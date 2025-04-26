import React from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface AlertDetailDialogProps {
  open: boolean;
  onClose: () => void;
  alert: {
    id: number;
    time: string;
    type: string;
    message: string;
    frameUrl: string; // URL to the supporting frame image
  } | null;
}

const AlertDetailDialog: React.FC<AlertDetailDialogProps> = ({ open, onClose, alert }) => {
  if (!alert) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        Alert Details
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Typography gutterBottom><strong>ID:</strong> {alert.id}</Typography>
        <Typography gutterBottom><strong>Time:</strong> {alert.time}</Typography>
        <Typography gutterBottom><strong>Type:</strong> {alert.type}</Typography>
        <Typography gutterBottom><strong>Message:</strong> {alert.message}</Typography>
        <Typography gutterBottom><strong>Supporting Frame:</strong></Typography>
        <img src={alert.frameUrl} alt="Supporting Frame" style={{ width: '100%', marginTop: 10 }} />
      </DialogContent>
    </Dialog>
  );
};

export default AlertDetailDialog;
