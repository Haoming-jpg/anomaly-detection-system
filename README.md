# Anomaly Detection System

## Project Overview
This repository contains a full-stack application for detecting anomalies using computer vision. The backend is built with Node.js, and the frontend is a React application with TypeScript. The system utilizes YOLO (You Only Look Once) for object detection, leveraging the yolov8n.onnx model.

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/anomaly-detection-system.git
   ```
2. Install dependencies for both backend and frontend:
   ```bash
   cd anomaly-detection-system
   cd frontend
   npm install
   cd ../backend
   npm install
   ```

## Running the Application
1. **Backend**: Hosted on **http://3.145.95.9:5000/** and managed by ES2.
2. **Frontend**: Deployed at **http://anomaly-frontend-prod.s3-website.us-east-2.amazonaws.com**.

## Key Features
- **Anomaly Detection**: Uses YOLOv8 for real-time object detection.
- **Upload and Analysis**: Users can upload frames for anomaly detection.
- **Alert System**: Generates alerts for detected anomalies with details.

## Directory Structure
```
anomaly-detection-system/
├── backend/          # Node.js backend with API endpoints
├── frontend/        # React frontend with detection UI
├── prompts/         # Development prompts and guides
└── README.md        # This file
```

## Development Documentation
The `prompts/` directory contains detailed documentation of the AI-driven development process:
- **backend_prompts.md**: Records AI prompts and results for backend development, including server setup, database integration, and deployment automation.
- **frontend_prompts.md**: Documents AI prompts for frontend components, including UI development, YOLO integration, and testing.
- **test_prompts.md**: Outlines unit tests and testing strategies for both frontend and backend, ensuring code quality and coverage.

## Contribution Guidelines
1. Fork the repository and create a new branch.
2. Make necessary changes and ensure tests pass.
3. Submit a pull request with clear documentation.

## Dependencies
- **Backend**: Express.js, Jest
- **Frontend**: React, TypeScript, YOLOv8 ONNX model

## Troubleshooting
- Ensure the backend is running via ES2 before interacting with the frontend.
- Check `frontend/public/models/yolov8n.onnx` for model integrity.