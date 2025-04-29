const express = require('express');
const cors = require('cors');
const multer = require('multer');
const db = require('./db');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 5000;


// Middleware
app.use(cors());
app.use(express.json());

// Set up storage for frames
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'frames/'); // Save under frames/ directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'frame-' + uniqueSuffix + path.extname(file.originalname)); // e.g., frame-123456789.png
  }
});

const uploadFrame = multer({ storage: storage });

// Test route
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// Upload frame route
app.post('/upload_frame', uploadFrame.single('frame'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No frame uploaded.');
  }
  const frameUrl = '/frames/' + req.file.filename;
  res.json({ frameUrl: frameUrl });
});

// Create alert route
app.post('/alerts', async (req, res) => {
  const { timestamp, type, message, frame_url } = req.body;

  console.log('Received alert data:', { timestamp, type, message, frame_url });

  try {
    const result = await db.query(
      'INSERT INTO alerts (timestamp, type, message, frame_url) VALUES ($1, $2, $3, $4) RETURNING *',
      [timestamp, type, message, frame_url]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error inserting alert:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Fetch alerts route
app.get('/alerts', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM alerts ORDER BY timestamp DESC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/clear_all', async (req, res) => {
  try {
    // 1. Clear all alerts from the database
    await db.query('DELETE FROM alerts');

    // 2. Delete all frames from frames/ directory
    const framesPath = path.join(__dirname, 'frames');
    fs.readdir(framesPath, (err, files) => {
      if (err) {
        console.error('Error reading frames directory:', err);
        return res.status(500).json({ error: 'Failed to clear frames' });
      }

      for (const file of files) {
        fs.unlink(path.join(framesPath, file), (err) => {
          if (err) console.error('Error deleting frame:', file, err);
        });
      }
    });

    res.status(200).json({ message: 'All alerts and frames cleared successfully!' });
  } catch (error) {
    console.error('Error clearing all:', error);
    res.status(500).json({ error: 'Failed to clear all' });
  }
});
app.use('/frames', express.static(path.join(__dirname, 'frames')));

// Start server
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
