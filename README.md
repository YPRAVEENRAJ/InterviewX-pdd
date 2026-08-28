# 🚀 InterviewX — Next-Gen AI Mock Interview & Evaluation Platform

[![GitHub Repo](https://img.shields.io/badge/GitHub-InterviewX--pdd-6366f1?style=for-the-badge&logo=github)](https://github.com/YPRAVEENRAJ/InterviewX-pdd)
[![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite_5-646CFF?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![NodeJS](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

**InterviewX** is an enterprise-grade, full-stack AI-driven Mock Interview and Candidate Evaluation Platform designed for software engineers, AI/ML developers, and tech professionals preparing for top-tier companies (**Google, Amazon, Meta, Microsoft, Apple, Netflix, Uber, Stripe**).

---

## 🌟 Key Features

### 1. 🤖 AI Company-Specific Previous Years Questions (PYQs)
* Real interview questions asked at **Google, Amazon, Meta, Microsoft, Apple, Netflix, and Uber**.
* Dynamic rubrics comparing candidate submissions against optimal architectural benchmark solutions and Big-O complexity limits.

### 2. 🛡️ Advanced AI Background Proctoring & Fullscreen Mode
* **Mandatory Fullscreen Security:** Exam locks into full-screen mode to eliminate distractions and unauthorized tools.
* **Zero-Tolerance Tab-Switch & Minimize Killer:** Instant disqualification (0 marks) if a candidate switches browser tabs, minimizes the window, or loses focus.
* **Pre-Exam Biometric Verification:** Face visibility checker that detects and blocks blank or obscured faces before entering the exam.
* **Surround Sound & Silence Check:** Uses the Web Audio API to detect background noise or secondary voices.
* **Environmental Disturbance Auto-Pause:** Exam automatically pauses during sudden room noise and automatically resumes when silence is restored.
* **Strict Warning Policy:** Maximum 1 warning for gaze deviations before termination.

### 3. 🎙️ Behavioral Verbal Voice Input vs. 💻 Technical Code Editor
* **Behavioral & HR Round:** Candidate articulates answers verbally through live microphone speech-to-text with STAR format evaluation.
* **Technical & System Design Rounds:** Interactive code editor and solution architect canvas.

### 4. 📄 AI Resume ATS Compliance Scanner
* Upload PDF/DOCX resumes (up to 10 MB) or paste text.
* Real-time ATS match scoring, matched technical keywords, and recommended additions for job roles:
  * *AI Engineer, ML Engineer, Data Scientist, Data Engineer, Full Stack, SDE, DevOps, Security, Mobile, Custom Roles.*

### 5. 💻 Curated FAANG Coding Practice Arena
* Interactive multi-language coding practice (**Python 3, JavaScript, Java, C++**).
* Filter by Topic (*Arrays & Hashing, Sliding Window, Dynamic Programming, Trees & Graphs, Heaps, Two Pointers*), Difficulty (*Easy, Medium, Hard*), and Target Company.
* Live code execution sandbox with real-time test cases and optimal solution approach walkthroughs.

---

## 🏗️ Project Architecture

```
InterviewX-pdd/
├── frontend/                  # React 18 + Vite Web Application
│   ├── src/
│   │   ├── components/        # Navbar, ScoreGauge, Simulator, Modals
│   │   ├── pages/             # Landing, Auth, Dashboard, InterviewSetup,
│   │   │                      # InterviewRoom, InterviewReport, ATS Scanner,
│   │   │                      # CodingArena, UserProfile, AdminPanel
│   │   ├── App.jsx            # Dynamic state controller
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── backend/                   # Node.js + Express API Backend
│   ├── server.js              # Express HTTP & WebSocket Server
│   ├── app.js
│   └── package.json
│
├── database/                  # Relational Schema & Seeding
│   ├── schema.sql             # Users, Interviews, Results, Submissions
│   └── seed.sql
│
└── mobile/                    # React Native / Expo Mobile App
    └── app/
```

---

## ⚡ Getting Started Locally

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher)
* [Git](https://git-scm.com/)

### 1. Clone the Repository
```bash
git clone https://github.com/YPRAVEENRAJ/InterviewX-pdd.git
cd InterviewX-pdd
```

### 2. Run Backend API Server
```bash
cd backend
npm install
node server.js
```
> Server will start on `http://localhost:5000`

### 3. Run Frontend Web Application
```bash
cd ../frontend
npm install
npm run dev
```
> Web application will start on `http://localhost:3000`

---

## 🔒 Security & Malpractice Enforcement

| Security Rule | Mechanism | Action on Violation |
| :--- | :--- | :--- |
| **Tab Switch / Blur** | `visibilitychange`, `window.blur` | **Immediate Disqualification (0 Marks)** |
| **Exit Fullscreen** | `fullscreenchange` | **Immediate Disqualification (0 Marks)** |
| **Blank Face** | Canvas pixel luminance analyzer | **Blocks exam start until face aligned** |
| **Room Disturbance** | Web Audio API decibel threshold | **Auto-pauses countdown timer** |
| **Gaze Deviation** | Continuous telemetry analysis | **Max 1 warning → Terminate on 2nd** |

---

## 📄 License & Attribution
Developed and maintained by **Praveen Raj** ([YPRAVEENRAJ](https://github.com/YPRAVEENRAJ)).  
Repository: [https://github.com/YPRAVEENRAJ/InterviewX-pdd](https://github.com/YPRAVEENRAJ/InterviewX-pdd)
