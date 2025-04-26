import React, { useState } from 'react';
import { TextField, Button, Table, TableHead, TableRow, TableCell, TableBody, Paper, Typography } from '@mui/material';
import AlertDetailDialog from './AlertDetailDialog';

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

  const [dialogOpen, setDialogOpen] = useState(false);


  const handleSearch = () => {
    console.log('Search triggered with:', searchQuery);
    // You can add search logic here
  };

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setVideoFile(event.target.files[0]);
    }
  };

  const dummyAlerts = [
    {
      id: 1,
      time: '2024-06-16T12:00:00Z',
      type: 'Type A',
      message: 'Anomaly detected',
      frameUrl: 'https://via.placeholder.com/320x240.png?text=Frame+1',
    },
    {
      id: 2,
      time: '2024-06-16T13:00:00Z',
      type: 'Type B',
      message: 'Another anomaly detected',
      frameUrl: 'https://via.placeholder.com/320x240.png?text=Frame+2',
    },
    {
      id: 3,
      time: '2024-06-16T14:00:00Z',
      type: 'Type C',
      message: 'Unusual behavior detected',
      frameUrl: 'https://via.placeholder.com/320x240.png?text=Frame+3',
    },
  ];

  const filteredAlerts = dummyAlerts.filter((alert) => {
    const query = searchQuery.toLowerCase();
    return (
      alert.id.toString().includes(query) ||
      alert.time.toLowerCase().includes(query) ||
      alert.type.toLowerCase().includes(query) ||
      alert.message.toLowerCase().includes(query)
    );
  });

  const sendVideoToServer = async () => {
    if (!videoFile) return;

    const formData = new FormData();
    formData.append('video', videoFile);

    try {
      // MOCK sending to backend
      console.log('Sending video to backend...');

      // Later this will be your real API call:
      // await fetch('http://localhost:5000/upload', {
      //   method: 'POST',
      //   body: formData,
      // });

      alert('Video sent to server (mock)');
    } catch (error) {
      console.error('Error uploading video:', error);
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
          color="secondary"
          onClick={sendVideoToServer}
        >
          Send to Server
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
            {filteredAlerts.map((alert) => (
              <TableRow
                key={alert.id}
                hover
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  setSelectedAlert(alert);
                  setDialogOpen(true);
                }}
              >
                <TableCell>{alert.id}</TableCell>
                <TableCell>{alert.time}</TableCell>
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
            onClick={() => {
              console.log('Ready to upload:', videoFile);
              // Later: Here you will call the API to upload to backend
            }}
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
