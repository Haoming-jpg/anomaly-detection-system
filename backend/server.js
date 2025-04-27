const express = require('express');
const cors = require('cors');
const multer = require('multer');
const db = require('./db');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Multer setup for file upload
const upload = multer({ dest: 'uploads/' });

// Test route
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// Upload route
app.post('/upload', upload.single('video'), (req, res) => {
  console.log('Received file:', req.file);
  res.send({ message: 'File uploaded successfully!' });
});

app.post('/alerts', async (req, res) => {
  const { timestamp, type, message, frameUrl } = req.body;

  try {
    const result = await db.query(
      'INSERT INTO alerts (timestamp, type, message, frame_url) VALUES ($1, $2, $3, $4) RETURNING *',
      [timestamp, type, message, frameUrl]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error inserting alert:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/alerts', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM alerts ORDER BY timestamp DESC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Start server
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
