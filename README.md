# AI-Powered Interview Assessment Platform

Welcome to the **Interview Assessment Platform**, an intelligent, AI-driven application designed to conduct technical interviews and evaluate candidate performance using Google's Gemini AI.

🔗 **GitHub Repository**: [https://github.com/gautam1025/Interview-AI](https://github.com/gautam1025/Interview-AI)

## 🚀 Features
- **User Authentication**: Secure signup and login functionality using JWT and bcrypt.
- **AI-Generated Questions**: Automatically generates technical interview questions tailored to the candidate's chosen role and experience level using Gemini 2.5 Flash.
- **AI-Driven Evaluation**: Analyzes candidate answers and provides comprehensive scoring on:
  - Technical Accuracy
  - Clarity
  - Confidence
  - Structure
  - Overall Score
- **Actionable Feedback**: Provides detailed strengths, weaknesses, and a structured improvement plan based on the interview performance.
- **Performance Dashboard**: Visualizes interview history, performance trends over time using Recharts, and highlights best scores.

## 🛠️ Tech Stack

**Frontend:**
- [React 19](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Recharts](https://recharts.org/) for data visualization
- [Lucide React](https://lucide.dev/) for icons
- [React Router DOM](https://reactrouter.com/)

**Backend:**
- [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- [Google Generative AI](https://ai.google.dev/) (Gemini API)
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) & [bcryptjs](https://github.com/dcodeIO/bcrypt.js) for authentication

---

## ⚙️ Local Setup & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) installed
- A [MongoDB](https://www.mongodb.com/) account or local instance
- A [Google Gemini API Key](https://aistudio.google.com/app/apikey)

### 1. Clone the repository
```bash
git clone https://github.com/gautam1025/Interview-AI.git
cd Interview-AI
```

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` directory with the following variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   GEMINI_API_KEY=your_google_gemini_api_key
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

### 4. Running the Application
Once both servers are running, access the application in your browser at `http://localhost:5173` (or the port specified by Vite).

---

## 📄 License
This project is open-source and available under the ISC License.
