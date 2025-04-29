import React, { useState, useEffect } from 'react';
import { TextField, Button, Table, TableHead, TableRow, TableCell, TableBody, Paper, Typography } from '@mui/material';
import AlertDetailDialog from './AlertDetailDialog';
import axios from 'axios';
import { runYoloDetection, extractFramesFromVideo } from './utils/yoloDetection';
import { uploadFrame } from './utils/uploadFrame';
import { captureFrameAsBlob } from './utils/frameCapture';
import { createAlertFromDetection } from './utils/createAlert';

async function handleUploadedVideo(file: File) {
  const frames = await extractFramesFromVideo(file, 1000); // Capture frame every 1s

  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 640;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    console.error('Failed to get canvas context');
    return;
  }

  let frameCount = 0;

  for (const frame of frames) {
    frameCount++;

    // 1. Draw the frame onto the hidden canvas
    ctx.putImageData(frame, 0, 0);

    // 2. Run YOLO detection
    const detections = await runYoloDetection(frame);
    const filteredDetections = detections.filter(d => d.score > 0.5);

    if (filteredDetections.length > 0) {
      // 3. Capture canvas as Blob
      const blob = await captureFrameAsBlob(canvas);

      // 4. Upload frame image to backend
      const filename = `frame-${Date.now()}-${frameCount}.png`;
      const frameUrl = await uploadFrame(blob, filename);

      // 5. For each detection, create an alert
      for (const detection of filteredDetections) {
        await createAlertFromDetection(detection, frameUrl);
      }
    }

    // (Optional) delay between frames if needed
    await new Promise(res => setTimeout(res, 1000));
  }

  alert('Video processing complete. Alerts have been created!');
}

const MainPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<{
    id: number;
    time: string;
    type: string;
    message: string;
    frameUrl: string;
  } | null>(null);
  const [alerts, setAlerts] = useState<Array<{
    id: number;
    timestamp: string;
    type: string;
    message: string;
    frame_url: string;
  }>>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchAlerts = async () => {
    try {
      const response = await axios.get('http://18.227.183.133:5000/alerts');
      setAlerts(response.data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleSearch = () => {
    console.log('Search triggered with:', searchQuery);
    // You can add search logic here
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setVideoFile(file);
      await handleUploadedVideo(file);
      await fetchAlerts();
    }
  };


  const sendVideoToServer = async () => {
    if (!videoFile) return;

    const formData = new FormData();
    formData.append('video', videoFile);

    try {
      const response = await fetch('http://18.227.183.133:5000/upload', { // Updated endpoint to include 'upload'
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log('Server response:', data);
      alert('Video uploaded successfully!');

      fetchAlerts(); // Refresh alerts after upload
    } catch (error) {
      console.error('Error uploading video:', error);
      alert('Upload failed!');
    }
  };


  return (
    <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Search Section */}
      <Paper style={{ padding: 20 }}>
        <Typography variant="h5" gutterBottom>Search Criteria</Typography>
        <TextField
          fullWidth
          variant="outlined"
          label="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          style={{ marginTop: 10 }}
        >
          Search
        </Button>
      </Paper>

      {/* Results Table Section */}
      <Paper style={{ padding: 20 }}>
        <Typography variant="h5" gutterBottom>Search Results</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Message</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {alerts.map((alert) => (
              <TableRow
                key={alert.id}
                hover
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  setSelectedAlert({
                    id: alert.id,
                    time: alert.timestamp,
                    type: alert.type,
                    message: alert.message,
                    frameUrl: alert.frame_url,
                  });
                  setDialogOpen(true);
                }}
              >
                <TableCell>{alert.id}</TableCell>
                <TableCell>{new Date(alert.timestamp).toLocaleString()}</TableCell>
                <TableCell>{alert.type}</TableCell>
                <TableCell>{alert.message}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Upload Video Section */}
      <Paper style={{ padding: 20 }}>
        <Typography variant="h5" gutterBottom>Upload Video</Typography>
        <input
          type="file"
          accept="video/*"
          onChange={handleUpload}
          style={{ display: 'block', marginBottom: 10 }}
        />
        {videoFile && (
          <Button
            variant="contained"
            color="secondary"
            onClick={sendVideoToServer}
          >
            Send to Server
          </Button>
        )}
      </Paper>

      {/* Video Player Section */}
      {videoFile && (
        <Paper style={{ padding: 20 }}>
          <Typography variant="h5" gutterBottom>Video Preview</Typography>
          <video width="320" height="240" controls>
            <source src={URL.createObjectURL(videoFile)} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </Paper>
      )}
      {/* Alert Detail Dialog */}
      <AlertDetailDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        alert={selectedAlert}
      />
    </div>
  );
};

export default MainPage;
