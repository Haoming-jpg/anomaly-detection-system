import axios from 'axios';

export async function uploadFrame(blob: Blob, filename: string): Promise<string> {
  const formData = new FormData();
  formData.append('frame', blob, filename);

  const response = await axios.post('http://3.145.95.9:5000/upload_frame', formData);
  
  return response.data.frameUrl; // e.g., /frames/alert_00123.png
}
