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

## 11. Launch AWS EC2 Ubuntu Server for Backend Deployment

**Prompt:**

"Help me launch an AWS EC2 Ubuntu instance to deploy my backend Node.js server."

**Result:**
Launched t2.micro Ubuntu EC2 instance, configured security group to allow SSH (22) and application traffic (5000), and prepared for backend deployment.

## 12. SSH into AWS EC2 Server

**Prompt:**

"Help me SSH into my AWS EC2 Ubuntu instance using my downloaded .pem key."

**Result:**
Successfully connected to AWS EC2 Ubuntu server via SSH using secure key authentication, ready to deploy backend server.

## 13. Install Node.js and npm on AWS EC2 Server

**Prompt:**

"Help me install Node.js and npm on my AWS EC2 Ubuntu instance to prepare for backend server deployment."

**Result:**
Successfully installed Node.js 20 LTS and npm on AWS EC2 Ubuntu instance using NodeSource installer.

## 14. Deploy Backend Code to AWS EC2 Server

**Prompt:**

"Help me move my Node.js backend project to my AWS EC2 instance and install all dependencies."

**Result:**
Cloned project from GitHub into EC2, installed backend dependencies using npm, and securely created .env file with AWS RDS database credentials.

## 15. Publicly Access Backend Server on AWS EC2

**Prompt:**

"Help me access my Node.js backend server running on my AWS EC2 instance from the public internet."

**Result:**
Accessed the backend server by visiting the EC2 public IP on port 5000.
http://3.145.95.9:5000/. Confirmed server is publicly accessible.

## 16. Connect Frontend to Publicly Deployed Backend

**Prompt:**

"Help me update my React frontend to connect to my publicly accessible backend server running on AWS EC2."

**Result:**
Replaced all localhost API calls with EC2 public IP, confirmed that frontend now communicates with cloud backend and database successfully.

## 17. Set Up GitHub Actions for Continuous Deployment (CD)

**Prompt:**

"Help me set up a GitHub Actions workflow that automatically SSHs into my AWS EC2 server, pulls the latest code from GitHub, installs dependencies, and restarts the backend server with pm2 whenever I push to develop or main branch."

**Result:**
- Created `.github/workflows/deploy.yml` workflow file.
- Configured GitHub Actions to trigger on `develop` and `main` branches.
- Installed `pm2` on EC2 to manage the backend server.
- Saved EC2 SSH private key as a GitHub repository secret (`EC2_SSH_KEY`).
- Saved EC2 public IP and username as secrets (`EC2_HOST`, `EC2_USER`).
- Deployment process

## 18. Fix Field Naming in /alerts Endpoint

**Prompt:**

"Help me debug and fix my Express backend `/alerts` POST endpoint. 
The frontend sends `frame_url`, but backend was reading `frameUrl`.
Correct the field naming so alerts are inserted properly into the PostgreSQL database."

**Result:**
- Updated `/alerts` route to destructure `frame_url` (not `frameUrl`) from `req.body`.
- Ensured database insert query uses the correct field names.
- Alerts are now inserted correctly into RDS after frame upload and YOLO detection.

## 19. Refactor Server to Remove Video Upload Endpoint

**Prompt:**

"Help me clean up my Express backend server.js. 
Remove the unnecessary /upload route and multer video upload setup, 
keeping only the /upload_frame route for frame uploads and /alerts route for creating/fetching alerts."

**Result:**
- Deleted the `/upload` endpoint for full video uploads.
- Removed `upload = multer({ dest: 'uploads/' })` unused setup.
- Kept only `/upload_frame` for frame uploads and `/alerts` for alert management.
- Server is now clean and matches in-browser detection architecture.
