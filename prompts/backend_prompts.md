# Backend Prompts - Automated Anomaly Detection System

This document records all AI prompts used for backend development (Node.js + Express).

---

## 1. Backend Server Setup

**Prompt:**

"Help me set up a basic Node.js backend server using Express. It should:
- Listen on port 5000
- Accept CORS requests
- Provide a simple GET '/' route that returns 'Backend is running!'
- Prepare to handle file uploads."

**Result:**
Generated `server.js` with Express app, CORS enabled, basic test route created.

---

## 2. Uploading Video Files

**Prompt:**

"Help me set up an Express route to accept video file uploads using multer. Save uploaded files into an 'uploads/' folder locally. Respond with a JSON success message."

**Result:**
Created `/upload` POST route using multer middleware. Files saved in local `uploads/` folder. Successful upload returns a JSON message.

---
