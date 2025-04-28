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

function postprocessOutput(output: Record<string, ort.Tensor>, scoreThreshold = 0.5): Detection[] {
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

    let maxClassScore = -Infinity;
    let classId = -1;

    for (let c = 0; c < numClasses; c++) {
      const classScore = data[offset + 4 + c];
      if (classScore > maxClassScore) {
        maxClassScore = classScore;
        classId = c;
      }
    }

    if (maxClassScore > scoreThreshold) {
      const xMin = (xCenter - width / 2) * 640;
      const yMin = (yCenter - height / 2) * 640;
      const w = width * 640;
      const h = height * 640;

      results.push({
        bbox: [xMin, yMin, w, h],
        score: maxClassScore,
        classId: classId,
      });
    }
  }

  return results;
}
