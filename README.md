# 🌿 Arogya Mind - Mental Health & Wellness App

![Arogya Mind Banner](https://img.shields.io/badge/Arogya%20Mind-Wellness%20App-teal?style=for-the-badge&logo=heart)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-5.0-000000?style=for-the-badge&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Cloud%20Atlas-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4.0-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Gemini AI](https://img.shields.io/badge/Google%20Gemini-AI%20Powered-8E75B2?style=for-the-badge&logo=google)](https://deepmind.google/technologies/gemini/)

**Arogya Mind** is a modern, comprehensive MERN stack web application built to empower users on their mental wellness journey. Featuring interactive mood tracking, AI-powered conversational support with Google's Gemini AI, detailed progress analytics, and a sleek glassmorphism UI.

---

## 🌟 Key Features

- 🧘 **Daily Mood & Activity Tracking**: Easily log daily emotions, notes, and wellness activities to build mindful habits.
- 🤖 **AI Wellness Companion**: Interactive AI chatbot integrated with Google Gemini AI (`@google/generative-ai`) providing empathetic guidance, stress management tips, and coping strategies.
- 📊 **Interactive Analytics & Progress**: Real-time charts powered by Recharts to visualize mood trends, track streaks, and analyze health patterns over time.
- 🔒 **Secure Authentication**: End-to-end user authentication powered by JSON Web Tokens (JWT) and encrypted password storage with `bcryptjs`.
- 🎨 **Modern & Responsive Design**: Crafted with Tailwind CSS v4, React 19, Lucide Icons, and 3D Spline visuals for a seamless experience on both desktop and mobile devices.

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4
- **Routing**: React Router v7
- **Data Visualization**: Recharts
- **Icons & Visuals**: Lucide React, React Icons, Spline 3D (`@splinetool/react-spline`)
- **HTTP Client**: Axios

### **Backend**
- **Runtime**: Node.js
- **Framework**: Express.js v5
- **Database**: MongoDB (via Mongoose v9)
- **Authentication**: JSON Web Token (JWT) & BcryptJS
- **AI Integration**: Google Gemini AI SDK (`@google/generative-ai`)

---

## 📁 Project Structure

```text
Aarogya_mind-main/
├── client/                 # Frontend React application (Vite)
│   ├── src/
│   │   ├── components/     # UI Components (Chatbot, MoodSelector, Navbar)
│   │   ├── context/        # React Context (Auth State management)
│   │   ├── pages/          # App Pages (Landing, Login, Register, Home, Analytics, Progress)
│   │   ├── services/       # API call handlers & Axios configuration
│   │   ├── App.jsx         # Main App Component & Router Setup
│   │   └── main.jsx        # App Entry Point
│   ├── package.json
│   └── vite.config.js
├── server/                 # Backend Node.js & Express API
│   ├── controllers/        # Request handlers (Auth, Mood, Chat)
│   ├── middleware/         # Auth verification middleware
│   ├── models/             # Mongoose schemas (User, MoodLog)
│   ├── routes/             # Express route definitions
│   ├── index.js            # Server entry point
│   ├── package.json
│   └── .env                # Server environment variables (Git ignored)
├── package.json            # Root configuration & unified scripts
└── README.md               # Project documentation
```

---

## 🚀 Getting Started

Follow these steps to set up and run Arogya Mind locally on your system.

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) (included with Node.js)
- A [MongoDB Cloud Atlas](https://www.mongodb.com/cloud/atlas) account (or a local MongoDB instance)
- A [Google Gemini API Key](https://aistudio.google.com/)

---

### 🔑 Environment Variables Setup

Create a `.env` file inside the `server/` directory with the following variables:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/arogya_mind?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key
GEMINI_API_KEY=your_google_gemini_api_key
```

---

### 💻 Installation & Running Locally

#### Option A: Quick Run (Root Terminal)

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/Aarogya_mind.git
   cd Aarogya_mind
   ```

2. Install all dependencies for both client and server:
   ```bash
   npm run build
   ```

3. Start the backend server:
   ```bash
   npm start
   ```

4. In a separate terminal, navigate to `client/` and start the Vite dev server:
   ```bash
   cd client
   npm run dev
   ```

---

#### Option B: Manual Setup (Separate Terminals)

1. **Backend Setup**:
   ```bash
   cd server
   npm install
   npm run dev
   ```
   *The server will run on `http://localhost:5000`.*

2. **Frontend Setup**:
   ```bash
   cd client
   npm install
   npm run dev
   ```
   *The client application will open on `http://localhost:5173`.*

---

## 📡 API Endpoints

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register` | Register a new user | ❌ |
| `POST` | `/api/auth/login` | Login user & generate JWT token | ❌ |
| `GET` | `/api/auth/me` | Fetch currently authenticated user profile | ✅ |
| `POST` | `/api/mood/log` | Create a daily mood & activity log | ✅ |
| `GET` | `/api/mood/history` | Retrieve user's historical mood logs | ✅ |
| `POST` | `/api/chat/message` | Send message to AI Wellness Chatbot (Gemini API) | ✅ |

---

## 📜 NPM Scripts Reference

### **Root Scripts (`/package.json`)**
- `npm run build`: Installs all dependencies across server and client, then builds client assets.
- `npm start`: Starts the backend Node server.

### **Backend Scripts (`/server/package.json`)**
- `npm run dev`: Starts the backend API server with `nodemon` for auto-reloading.
- `npm start`: Starts the production backend API server.

### **Frontend Scripts (`/client/package.json`)**
- `npm run dev`: Launches the Vite development server with HMR.
- `npm run build`: Builds the optimized production production bundle.
- `npm run preview`: Previews the local production build.
- `npm run lint`: Runs ESLint for code quality checks.

---

## 🤝 Contributing

Contributions are welcome! If you'd like to improve Arogya Mind:
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **ISC License**. See `LICENSE` for more information.

---

⭐ **Created by Vishal Girase** & maintained by the community. If you found this project helpful, give it a star on GitHub!
