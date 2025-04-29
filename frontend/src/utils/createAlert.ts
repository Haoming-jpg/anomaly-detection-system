import axios from 'axios';

const classNames = [
  "person", "bicycle", "car", "motorcycle", "airplane", "bus", "train", "truck", "boat",
  "traffic light", "fire hydrant", "stop sign", "parking meter", "bench", "bird", "cat", "dog",
  "horse", "sheep", "cow", "elephant", "bear", "zebra", "giraffe", "backpack", "umbrella",
  "handbag", "tie", "suitcase", "frisbee", "skis", "snowboard", "sports ball", "kite",
  "baseball bat", "baseball glove", "skateboard", "surfboard", "tennis racket", "bottle",
  "wine glass", "cup", "fork", "knife", "spoon", "bowl", "banana", "apple", "sandwich", "orange",
  "broccoli", "carrot", "hot dog", "pizza", "donut", "cake", "chair", "couch", "potted plant",
  "bed", "dining table", "toilet", "tv", "laptop", "mouse", "remote", "keyboard", "cell phone",
  "microwave", "oven", "toaster", "sink", "refrigerator", "book", "clock", "vase", "scissors",
  "teddy bear", "hair drier", "toothbrush"
];

type Detection = {
  bbox: [number, number, number, number];
  score: number;
  classId: number;
};

export async function createAlertFromDetection(
  detection: Detection,
  frameUrl: string
) {
  const alert = {
    timestamp: new Date().toISOString(),
    type: classNames[detection.classId] || 'object',
    message: `Detected a ${classNames[detection.classId] || 'object'} with ${(detection.score * 100).toFixed(1)}% confidence`,
    frame_url: frameUrl,
  };

  await axios.post('http://18.227.183.133:5000/alerts', alert);
}
