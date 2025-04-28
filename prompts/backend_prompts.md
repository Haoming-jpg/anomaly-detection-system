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

## 3. Connecting Backend to PostgreSQL

**Prompt:**

"Help me connect a Node.js backend (Express) to a local PostgreSQL database using the `pg` library. Set up a connection pool, and create routes to insert alerts (POST) and fetch all alerts (GET)."

**Result:**
Created `db.js` to manage PostgreSQL connection. Created `/alerts` POST route to insert alert data and `/alerts` GET route to fetch all alerts.

## 4. Manual Testing of /alerts Endpoint

**Prompt:**

"Help me manually test a POST /alerts endpoint in my Node.js backend that inserts alert data into PostgreSQL. Provide instructions for using Postman."

**Result:**
Successfully sent a test alert via Postman. Confirmed insertion into `alerts` table.

## 5. Implementing GET /alerts Endpoint

**Prompt:**

"Help me create a GET /alerts route in my Node.js backend that fetches all alert records from a PostgreSQL database and returns them as JSON sorted by timestamp."

**Result:**
Created `/alerts` GET route. Successfully retrieves all alerts and prepares them for frontend rendering.

## 6. Enhancing Upload Route to Generate Alert

**Prompt:**

"Help me update a POST /upload route to, after receiving a video file, automatically insert a simulated anomaly alert into PostgreSQL."

**Result:**
Updated `/upload` to save uploaded file and create a new alert record in database.

## 7. Creating AWS RDS PostgreSQL Database

**Prompt:**

"Help me create a new PostgreSQL database instance on AWS RDS. I want it to be publicly accessible for development, allow connections on port 5432, and be ready for backend connection."

**Result:**
Created a new PostgreSQL instance using AWS RDS (Free Tier), enabled public access, created a new VPC security group, and configured inbound rules to allow PostgreSQL connections on port 5432 from any IP (0.0.0.0/0) for testing.

## 8. Connect to AWS RDS PostgreSQL Using pgAdmin

**Prompt:**

"Help me connect to my AWS RDS PostgreSQL database from my local computer using pgAdmin, and make sure I can create tables remotely."

**Result:**
Successfully connected to AWS RDS PostgreSQL instance using pgAdmin, verified that the database is accessible and ready for table creation.

## 9. Create alerts Table in AWS RDS PostgreSQL

**Prompt:**

"Help me create the same alerts table structure in my AWS RDS PostgreSQL database that I used locally, using pgAdmin Query Tool."

**Result:**
Created `alerts` table with columns id (serial primary key), timestamp, type, message, and frame_url inside AWS RDS PostgreSQL instance, ready for backend connection.

## 10. Update Backend to Connect to AWS RDS Database

**Prompt:**

"Help me update my backend database connection (db.js) to connect to my AWS RDS PostgreSQL instance instead of local PostgreSQL."

**Result:**
Updated db.js configuration to connect to AWS RDS using correct endpoint, username, and password. Backend server now inserts and reads alerts from cloud database successfully.
