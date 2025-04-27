const express = require('express');
const cors = require('cors');
const multer = require('multer');
const db = require('./db');

const app = express();
const port = 5000;
const path = require('path');

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
app.post('/upload', upload.single('video'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send({ error: 'No video file uploaded' });
  }

  console.log('Received file:', req.file);

  try {
    const now = new Date();
    const type = "Simulated Anomaly";
    const message = "Anomaly detected from uploaded video.";
    const frameUrl = "https://via.placeholder.com/320x240.png?text=Frame"; // Later this will be real

    const result = await db.query(
      'INSERT INTO alerts (timestamp, type, message, frame_url) VALUES ($1, $2, $3, $4) RETURNING *',
      [now, type, message, frameUrl]
    );

    res.status(201).send({ message: 'Video uploaded and alert generated!', alert: result.rows[0] });
  } catch (error) {
    console.error('Error processing upload:', error);
    res.status(500).send({ error: 'Failed to process video' });
  }
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
