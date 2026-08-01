# 🏋️ Gym Journal - Personal Fitness Tracking Application

A full-stack web application for tracking workouts, personal records, and fitness metrics. Built with React 19, TypeScript, and Node.js.

## ✨ Features

### 🎯 Core Functionality
- **User Authentication** - Secure login via Email/Password and **Google OAuth**
- **Personal Records Tracking** - Monitor your progress across different exercises
- **Workout Session Management** - Log and track your training sessions
- **Exercise Library** - Comprehensive database of exercises
- **Activity Logs** - Detailed tracking of user activities
- **Metrics Management** - Personalize and update your fitness metrics
- **AI Fitness Assistant** - Chat with an AI-powered fitness advisor (Gemini) for personalized training advice

### 📊 Dashboard & Analytics
- **Muscle Recovery Heatmap** - Interactive, gender-specific visualization of worked muscle groups (Front & Back views)
- **Progress Visualization** - Charts and graphs showing your fitness journey
- **Personal Records Cards** - Easy-to-view PR tracking
- **Training Selector** - Choose and customize your workout routines
- **Real-time Updates** - Live data synchronization across the application

## 📸 Screenshots

### Dashboard
![Dashboard Screenshot](dashboard.png)

### Analytics
![Analytics Screenshot](analytics.png)

### Login Page
![Login Screenshot](login.png)

### AI Chat Assistant
![AI Chat Example](chatExample.png)

## 🛠️ Tech Stack

### Frontend (`my-app/`)
- **React 19** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Recharts** - Data visualization library
- **Axios** - HTTP client for API communication
- **React Router** - Client-side routing
- **React Markdown** - Markdown rendering for AI responses
- **TanStack Query** - Efficient server state management

### Backend (`backend/`)
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **TypeScript** - Type-safe server-side development
- **TypeORM** - Object-Relational Mapping
- **PostgreSQL** - Primary database
- **JWT** - Authentication and authorization
- **Google Auth Library** - Google Sign-In integration
- **bcryptjs** - Password hashing
- **Google Generative AI (Gemini)** - AI-powered fitness assistance
- **Jest** - Testing framework

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Nanu25/GymJournal
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Create a .env file based on .env.example
   # Required variables:
   # DATABASE_URL=postgresql://username:password@localhost:5432/gym_journal
   # JWT_SECRET=your_secret
   # GOOGLE_CLIENT_ID=your_google_client_id
   # GEMINI_API_KEY=your_gemini_key
   ```

3. **Frontend Setup**
   ```bash
   cd ../my-app
   npm install
   ```

4. **Database Setup**
   ```bash
   cd ../backend
   # Run migrations/initialization
   npm run db:init
   # Optional: Populate with sample data
   npm run populate-db
   ```

5. **Start Development Servers**

   **Backend:**
   ```bash
   cd backend
   npm run dev
   ```

   **Frontend:**
   ```bash
   cd my-app
   npm run dev
   ```

   The application will be available at:
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:3000`

## 📁 Project Structure

```
gym-journal/
├── backend/                 # Node.js/Express API
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── routes/          # API endpoints
│   │   ├── services/        # Business logic
│   │   ├── entities/        # Database models (TypeORM)
│   │   ├── middleware/      # Custom middleware
│   │   ├── config/          # Configuration files
│   │   ├── scripts/         # Database scripts
│   │   └── tests/           # Backend tests
│   └── uploads/             # File uploads directory
├── my-app/                  # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── services/        # API services
│   │   ├── hooks/           # Custom React hooks
│   │   ├── context/         # React Context (Auth, etc)
│   │   ├── types/           # TypeScript types
│   │   └── lib/             # Utility functions
│   └── public/              # Static assets
└── README.md
```

## 🔧 Available Scripts

### Backend Scripts
```bash
npm run dev          # Start development server with nodemon
npm run build        # Build TypeScript to JavaScript
npm run start        # Start production server
npm run test         # Run tests
npm run populate-db  # Populate database with sample data
```

### Frontend Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run tests
npm run lint         # Run ESLint
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/google` - Google login

### User Management
- `GET /api/user` - Get user profile
- `PUT /api/user` - Update user profile

### Training & Stats
- `GET /api/trainings` - Get training sessions
- `POST /api/trainings` - Create training session
- `GET /api/trainings/muscle-group-distribution` - Get muscle usage stats
- `GET /api/trainings/recent-muscles` - Get recently trained muscles

### Exercises
- `GET /api/exercises` - Get exercise library

### Chat
- `POST /api/chat` - Send message to AI fitness assistant

## 📝 License

This project is licensed under the ISC License.

---

**Made with ❤️ for fitness enthusiasts** 