import React, { useState, useEffect } from 'react';
import { TextField, Button, Table, TableHead, TableRow, TableCell, TableBody, Paper, Typography } from '@mui/material';
import AlertDetailDialog from './AlertDetailDialog';
import axios from 'axios';
import { runYoloDetection, extractFramesFromVideo } from './utils/yoloDetection';
import { uploadFrame } from './utils/uploadFrame';
import { captureFrameAsBlob } from './utils/frameCapture';
import { createAlertFromDetection } from './utils/createAlert';


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
  const [currentPage, setCurrentPage] = useState(1);
  const alertsPerPage = 50;
  const [pageInput, setPageInput] = useState('');
  const [filteredAlerts, setFilteredAlerts] = useState<Array<{
    id: number;
    timestamp: string;
    type: string;
    message: string;
    frame_url: string;
  }>>([]);

  const fetchAlerts = async () => {
    try {
      const response = await axios.get('http://3.145.95.9:5000/alerts');
      setAlerts(response.data);
      setFilteredAlerts(response.data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleSearchByType = () => {
    if (searchQuery.trim() === '') {
      setFilteredAlerts(alerts); // Reset to all
    } else {
      setFilteredAlerts(alerts.filter(alert =>
        alert.type.toLowerCase().includes(searchQuery.toLowerCase())
      ));
    }
    setCurrentPage(1);
  };

  const handleSearchByMessage = () => {
    if (searchQuery.trim() === '') {
      setFilteredAlerts(alerts); // Reset to all
    } else {
      setFilteredAlerts(alerts.filter(alert =>
        alert.message.toLowerCase().includes(searchQuery.toLowerCase())
      ));
    }
    setCurrentPage(1);
  };


  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setVideoFile(file);
      await processVideo(file);
      await fetchAlerts();  // Refresh table after processing
    }
  };

  const handleResetSearch = () => {
    setSearchQuery('');
    setFilteredAlerts(alerts);
    setCurrentPage(1);
  };

  async function processVideo(file: File) {
    const frames = await extractFramesFromVideo(file, 1000);

    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 640;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      console.error('Failed to get canvas context');
      return;
    }

    console.log('Canvas context obtained successfully.');
    console.log(`Total frames extracted: ${frames.length}`);

    let frameCount = 0;

    for (let i = 0; i < frames.length; i++) {
      if (i % 2 !== 0) continue;  // Skip every 2nd frame for faster processing

      const frame = frames[i];
      frameCount++;

      ctx.putImageData(frame, 0, 0);

      const detections = await runYoloDetection(frame);
      console.log(`Frame ${frameCount}: Detections found:`, detections.length);

      const filteredDetections = detections.filter(d => d.score > 0.5);
      console.log(`Frame ${frameCount}: High-confidence detections:`, filteredDetections.length);

      if (filteredDetections.length > 0) {
        const blob = await captureFrameAsBlob(canvas);
        console.log(`Frame ${frameCount}: Captured frame blob`);

        const filename = `frame-${Date.now()}-${frameCount}.png`;
        const frameUrl = await uploadFrame(blob, filename);
        console.log(`Frame ${frameCount}: Uploaded frame to ${frameUrl}`);

        for (const detection of filteredDetections) {
          console.log(`Frame ${frameCount}: Creating alert for detection:`, detection.classId);
          await createAlertFromDetection(detection, frameUrl);
          console.log(`Frame ${frameCount}: Alert created.`);
        }
      } else {
        console.log(`Frame ${frameCount}: No high-confidence detections, skipping alert.`);
      }

      await new Promise(res => setTimeout(res, 100)); // Tiny delay to avoid locking browser
    }

    alert('Video processing complete.');
  }

  const indexOfLastAlert = currentPage * alertsPerPage;
  const indexOfFirstAlert = indexOfLastAlert - alertsPerPage;
  const currentAlerts = filteredAlerts.slice(indexOfFirstAlert, indexOfLastAlert);
  const totalPages = Math.ceil(filteredAlerts.length / alertsPerPage);

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
          onClick={handleSearchByType}
          style={{ marginTop: 10, marginRight: 10 }}
        >
          Search by Type
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSearchByMessage}
          style={{ marginTop: 10 }}
        >
          Search by Message
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleResetSearch}
          style={{ marginTop: 10, marginLeft: 10 }}
        >
          Reset
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
            {currentAlerts.map((alert) => (
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
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
          <Button
            variant="contained"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            style={{ marginRight: 10 }}
          >
            Previous
          </Button>
          <Typography variant="body1" style={{ margin: '0 10px' }}>
            Page {currentPage} of {totalPages}
          </Typography>
          <Button
            variant="contained"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            style={{ marginLeft: 10 }}
          >
            Next
          </Button>
          <div style={{ marginLeft: 20, display: 'flex', alignItems: 'center' }}>
            <TextField
              label="Go to page"
              variant="outlined"
              size="small"
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              style={{ width: 100, marginRight: 10 }}
            />
            <Button
              variant="contained"
              onClick={() => {
                const pageNumber = Number(pageInput);
                if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
                  setCurrentPage(pageNumber);
                } else {
                  alert('Invalid page number');
                }
              }}
            >
              Go
            </Button>
          </div>
        </div>

      </Paper>

      {/* Upload Video Section */}
      <Paper style={{ padding: 20 }}>
        <Button
          variant="outlined"
          color="secondary"
          onClick={async () => {
            if (window.confirm('Are you sure you want to delete all alerts and frames? This action cannot be undone.')) {
              try {
                await axios.post('http://3.145.95.9:5000/clear_all');
                alert('All alerts and frames cleared!');
                fetchAlerts(); // Refresh table
              } catch (error) {
                console.error('Error clearing all:', error);
                alert('Failed to clear alerts and frames.');
              }
            }
          }}
          style={{ marginTop: 10 }}
        >
          Clear All Alerts and Frames
        </Button>

        <Typography variant="h5" gutterBottom>Upload Video</Typography>
        <input
          type="file"
          accept="video/*"
          onChange={handleUpload}
          style={{ display: 'block', marginBottom: 10 }}
        />
      </Paper>

      {/* Video Preview Section */}
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
