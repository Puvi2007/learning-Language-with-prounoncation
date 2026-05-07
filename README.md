# 🌐 Learn Language with Pronunciation

Learn Language with Pronunciation is a comprehensive, AI-powered 180-day language learning platform. It leverages the browser's native Web Speech API to provide interactive pronunciation validation, helping users master 8 different languages through daily guided tasks. Build a daily habit, track your streak, and earn a certificate upon completion!

## 🚀 Tech Stack

**Frontend**
*   **React 18** — UI Library
*   **React Router v6** — Client-side Routing
*   **Axios** — HTTP Client
*   **Web Speech API** — Native Browser SpeechSynthesis & SpeechRecognition
*   **jsPDF + html2canvas** — High-quality Certificate PDF Generation

**Backend**
*   **Node.js & Express.js** — Server & API Framework
*   **MongoDB + Mongoose** — NoSQL Database & Object Data Modeling
*   **JWT + bcryptjs** — Secure Authentication & Password Hashing
*   **Nodemailer** — Email Delivery (Password Resets)

---

## 📁 Project Structure

```text
d:\Mernstack51\
├── client/                     # React Frontend
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # Shared UI (Sidebar, ProgressBar, Certificate)
│   │   ├── context/            # Global State (AuthContext)
│   │   ├── hooks/              # Custom Hooks (useSpeechRecognition)
│   │   ├── pages/              # Application Views (Landing, Auth, Dashboard, DailyTasks)
│   │   ├── utils/              # Helper functions (api.js with Axios interceptors)
│   │   ├── App.jsx             # Main Router Setup
│   │   └── App.css             # Global CSS Variables and Styling
│   └── package.json            # Frontend Dependencies
│
├── server/                     # Express Backend
│   ├── controllers/            # Route Handlers (Auth, Tasks, Language, Certificates)
│   ├── middleware/             # JWT Protection & Error Handling
│   ├── models/                 # Mongoose Schemas (User, Progress, Curriculum, Certificate)
│   ├── routes/                 # API Endpoint Definitions
│   ├── utils/                  # Nodemailer Configuration
│   ├── seedCurriculum.js       # Script to populate initial language data
│   ├── server.js               # Express Server Bootstrap
│   └── package.json            # Backend Dependencies
└── .env                        # Environment Variables (Root)
```

---

## ⚡ Quick Start

### Prerequisites
*   **Node.js** (v18 or higher)
*   **MongoDB Atlas** account (or local MongoDB)
*   **Gmail Account** (with 2-Step Verification and an App Password configured)

### Step 1: Install Dependencies
Open two terminal windows to install dependencies for both sides.
```bash
# Terminal 1: Backend
cd server
npm install

# Terminal 2: Frontend
cd client
npm install
```

### Step 2: Configure Environment Variables
Create a `.env` file in the **root** folder (`d:\Mernstack51\.env`) and add the following:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key_here
EMAIL_USER=your_gmail_address@gmail.com
EMAIL_PASS=your_16_character_gmail_app_password
CLIENT_URL=http://localhost:3000
```
> **How to get a Gmail App Password:**
> 1. Go to your Google Account Settings > Security.
> 2. Enable 2-Step Verification.
> 3. Search for "App passwords".
> 4. Generate a new password (select "Other" and name it "Node App"). Paste the 16-character code into `EMAIL_PASS`.

### Step 3: Seed the Database
Populate the MongoDB database with the initial 180-day curriculum data.
```bash
cd server
node seedCurriculum.js
```

### Step 4: Run the Application
Start both the backend and frontend servers.
```bash
# Terminal 1: Backend
cd server
npm run dev    # Runs on port 5000

# Terminal 2: Frontend
cd client
npm start      # Runs on port 3000
```

### Step 5: Start Learning
Open your browser and navigate to: **[http://localhost:3000](http://localhost:3000)**

---

## 🌍 Supported Languages

| Language | Script | Family | Status |
| :--- | :--- | :--- | :--- |
| **Tamil** | தமிழ் | Dravidian | Active |
| **Hindi** | हिन्दी | Indo-Aryan | Active |
| **Telugu** | తెలుగు | Dravidian | Active |
| **Kannada** | ಕನ್ನಡ | Dravidian | Active |
| **Malayalam** | മലയാളം | Dravidian | Active |
| **Sanskrit** | संस्कृतम् | Indo-Aryan | Active |
| **English** | English | Germanic | Active |
| **French** | Français | Romance | Active |

---

## 📚 API Endpoints

| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | ❌ No | Register a new user |
| `POST` | `/api/auth/login` | ❌ No | Authenticate user & get JWT |
| `POST` | `/api/auth/forgot-password` | ❌ No | Request password reset email |
| `POST` | `/api/auth/reset-password/:token`| ❌ No | Set new password using token |
| `GET` | `/api/user/profile` | 🔒 Yes | Get current user details |
| `PUT` | `/api/user/profile` | 🔒 Yes | Update user profile |
| `POST` | `/api/language/select` | 🔒 Yes | Set learning language |
| `GET` | `/api/language/progress` | 🔒 Yes | Get stats (streak, % complete) |
| `GET` | `/api/tasks/:language/:day` | 🔒 Yes | Fetch curriculum tasks for a day |
| `POST` | `/api/tasks/complete` | 🔒 Yes | Mark specific task as done |
| `GET` | `/api/certificates/check` | 🔒 Yes | Check if user qualifies for cert |
| `POST` | `/api/certificates/issue` | 🔒 Yes | Generate completion certificate |
| `GET` | `/api/certificates/:id` | ❌ No | Public certificate verification |
| `GET` | `/api/curriculum/languages` | ❌ No | Get list of available languages |

---

## 🎤 Pronunciation Feature

This platform relies entirely on the **Browser Web Speech API**, meaning absolutely zero external audio libraries or expensive cloud APIs are required.
*   🤖 **AI Pronunciation (`SpeechSynthesis`)**: Automatically converts the target word into native speech using language-specific ISO codes.
*   🎤 **Mic Recognition (`SpeechRecognition`)**: Listens to the user, transcribes their speech, and runs a lenient substring match against the target word to evaluate pronunciation accuracy.

> **⚠️ CRITICAL:** The Web Speech Recognition API is currently only fully supported on **Google Chrome** (and some Chromium browsers). For the microphone feature to work, users *must* use Chrome.

---

## 🔒 Password Requirements

For maximum security, passwords are validated live on the client and strictly enforced on the server. They must meet all 5 criteria:
*   ✅ **At least 8 characters long**
*   ✅ **One uppercase letter (A-Z)**
*   ✅ **One lowercase letter (a-z)**
*   ✅ **One number (0-9)**
*   ✅ **One special character** (e.g., `!@#$%^&*()`)

---

## 🗺️ User Journey

1.  **Sign Up / Login**: Create a secure account.
2.  **Select Language**: Choose one of the 8 supported languages to begin.
3.  **Dashboard**: Track your current day, 180-day progress percentage, and daily learning streak.
4.  **Daily Tasks**: Complete 10 pronunciation tasks per day.
    *   *Listen* to the AI pronounce the word.
    *   *Speak* into the microphone to replicate it.
5.  **Unlock Progression**: Completing all 10 tasks permanently unlocks the next day.
6.  **Graduation**: Reach Day 180, complete the final task, and earn your certificate!

---

## 📜 Certificate

Upon completing all 180 days (1800 tasks) for a given language, the backend automatically flags the course as `isCompleted`. The user is then granted a dynamically generated Certificate of Completion. 
Using `html2canvas` and `jsPDF`, users can download a high-resolution, landscape PDF directly to their local machine featuring their name, language, completion date, and a unique verifiable Certificate ID.

---

## 🐛 Common Issues

*   **MongoDB Connection Error**: Double-check your `MONGO_URI` in the `.env` file. Ensure your IP address is whitelisted in MongoDB Atlas under Network Access.
*   **Speech Recognition Not Working / Crashing**: You are likely using Safari or Firefox. You **must** use Google Chrome for the Web Speech API to function properly. Ensure you have granted microphone permissions when prompted.
*   **Emails Not Sending**: If you receive a Nodemailer error during password reset, ensure your `EMAIL_PASS` is a valid 16-character Google App Password (with spaces removed). Standard account passwords will not work.
*   **Port in Use (EADDRINUSE)**: If port 5000 or 3000 is blocked, find the running process and kill it, or change the `PORT` in your `.env` file and client proxy settings.
