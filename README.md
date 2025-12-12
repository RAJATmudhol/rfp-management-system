# rfp-management-system
AI-Powered RFP Management System

###### checkout to branch master #######
## 1. Project Setup
### 1.a. Prerequisites  (branch master)
Node.js v18+, PostgreSQL, OpenAI API Key, SMTP email credentials.
### 1.b. Install Steps
create a .env with provided .env.example file 
### 1.c. Email Setup
SMTP sending + IMAP/POP3 receiving.
Go to Google Account → Security

Turn ON 2-Step Verification

Go to App Passwords

Generate a new password → copy it → use as EMAIL_PASS
### 1.d. Run Locally
npn run dev
## 1. Tech Stack
1. Project Setup
Prerequisites:
- Node.js 18+
- PostgreSQL 13+
- OpenAI API key
- SMTP Email credentials (Gmail/Outlook)
Install Steps:
Backend:
1. cd backend
2. npm install
3. Configure .env (DB, SMTP, OPENAI_KEY)
4. npm run dev
Frontend:
1. cd frontend
2. npm install
3. npm run dev
Email Setup:
- SMTP is used for sending emails (via Nodemailer)
- IMAP listener fetches incoming vendor replies
- Mailparser extracts message body for AI processing
Running Locally:
- Start PostgreSQL service
- Start backend + frontend
- Open http://localhost:5173
-  Tech Stack
Frontend:
- React, Vite, Material UI, Axios
Backend:
- Node.js, Express, Sequelize
Database:
- PostgreSQL
AI Provider:
- OpenAI GPT■4o / GPT■4o-mini
Email:
- Nodemailer (send)
- node-imap (receive)
- mailparser (parse)
Key Libraries:
- express, nodemailer, openai, sequelize, uuid, dotenv
