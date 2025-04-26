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
            {/* Later we will map real data here */}
            <TableRow
              hover
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setSelectedAlert({
                  id: 1,
                  time: '2024-06-16T12:00:00Z',
                  type: 'Type A',
                  message: 'Anomaly detected',
                  frameUrl: 'https://via.placeholder.com/320x240.png?text=Frame' // Placeholder image
                });
                setDialogOpen(true);
              }}
            >
              <TableCell>1</TableCell>
              <TableCell>2024-06-16T12:00:00Z</TableCell>
              <TableCell>Type A</TableCell>
              <TableCell>Anomaly detected</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>

      {/* Upload Video Section */}
      <Paper style={{ padding: 20 }}>
        <Typography variant="h5" gutterBottom>Upload Video</Typography>
        <input type="file" accept="video/*" onChange={handleUpload} />
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
