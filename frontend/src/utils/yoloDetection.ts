import * as ort from 'onnxruntime-web';

const modelUrl = '/models/yolov8n.onnx'; // served from public folder

export async function runYoloDetection(imageData: ImageData) {
  // 1. Create session
  const session = await ort.InferenceSession.create(modelUrl, { executionProviders: ['wasm'] });

  // 2. Preprocess input (normalize, resize, etc.)
  const preprocessed = preprocessImageData(imageData);

  // 3. Create tensor
  const inputTensor = new ort.Tensor('float32', preprocessed.data, [1, 3, 640, 640]);

  // 4. Run inference
  const feeds: Record<string, ort.Tensor> = {};
  feeds[session.inputNames[0]] = inputTensor;

  const output = await session.run(feeds);

  // 5. Post-process output (filter detections)
  const boxes = postprocessOutput(output);

  return boxes;
}

export function preprocessImageData(imageData: ImageData): { data: Float32Array } {
  const width = 640;
  const height = 640;

  // Create Float32Array for YOLO input
  const floatData = new Float32Array(3 * width * height);

  // ImageData is RGBA, we only need RGB
  const pixels = imageData.data;

  for (let i = 0; i < width * height; i++) {
    const r = pixels[i * 4] / 255;     // Normalize R channel
    const g = pixels[i * 4 + 1] / 255; // Normalize G channel
    const b = pixels[i * 4 + 2] / 255; // Normalize B channel

    // Convert HWC -> CHW
    floatData[i] = r;
    floatData[i + width * height] = g;
    floatData[i + 2 * width * height] = b;
  }

  return { data: floatData };
}

type Detection = {
  bbox: [number, number, number, number]; // [x_min, y_min, width, height]
  score: number;
  classId: number;
};

export function postprocessOutput(output: Record<string, ort.Tensor>, scoreThreshold = 0.5): Detection[] {
  const outputTensor = output[Object.keys(output)[0]]; // Assume first output
  const data = outputTensor.data as Float32Array; // (1, 84, 8400) flattened
  
  const numClasses = 80;
  const numBoxes = 8400;
  const results: Detection[] = [];

  for (let i = 0; i < numBoxes; i++) {
    const offset = i * (numClasses + 4);

    const xCenter = data[offset];
    const yCenter = data[offset + 1];
    const width = data[offset + 2];
    const height = data[offset + 3];

    const classScores = data.slice(offset + 4, offset + 4 + numClasses);

    // Softmax function
    const expScores = classScores.map(s => Math.exp(s));
    const sumExp = expScores.reduce((a, b) => a + b, 0);
    const softmaxScores = expScores.map(s => s / sumExp);
    
    let maxScore = -Infinity;
    let classId = -1;
    
    for (let c = 0; c < numClasses; c++) {
      if (softmaxScores[c] > maxScore) {
        maxScore = softmaxScores[c];
        classId = c;
      }
    }
    

    if (maxScore  > scoreThreshold) {
      const xMin = (xCenter - width / 2) * 640;
      const yMin = (yCenter - height / 2) * 640;
      const w = width * 640;
      const h = height * 640;

      results.push({
        bbox: [xMin, yMin, w, h],
        score: maxScore,
        classId: classId,
      });
    }
  }

  return results;
}


// Load video into hidden <video> element and draw video frames to <canvas> element
// to extract frames at specified intervals (e.g., every second)
export async function extractFramesFromVideo(file: File, frameInterval = 1000): Promise<ImageData[]> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Failed to get canvas context'));
      return;
    }

    const url = URL.createObjectURL(file);
    const frames: ImageData[] = [];

    video.src = url;
    video.crossOrigin = "anonymous";
    video.muted = true;
    video.playsInline = true;

    video.addEventListener('loadedmetadata', () => {
      canvas.width = 640;   // Resize frames to 640x640
      canvas.height = 640;
      video.width = 640;
      video.height = 640;

      const duration = video.duration * 1000; // ms
      let currentTime = 0;

      const captureFrame = () => {
        if (currentTime > duration) {
          URL.revokeObjectURL(url);
          resolve(frames);
          return;
        }

        video.currentTime = currentTime / 1000;
      };

      video.addEventListener('seeked', () => {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
        frames.push(frame);
        currentTime += frameInterval;
        captureFrame();
      });

      captureFrame();
    });

    video.addEventListener('error', () => {
      reject(new Error('Failed to load video'));
    });
  });
}

