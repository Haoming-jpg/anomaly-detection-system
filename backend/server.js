const express = require('express');
const cors = require('cors');
const multer = require('multer');

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

// Start server
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
