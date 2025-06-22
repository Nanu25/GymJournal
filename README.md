# 🏋️ Gym Journal - Personal Fitness Tracking Application

A full-stack web application for tracking workouts, personal records, and fitness metrics. Built with React, TypeScript, and Node.js.

## ✨ Features

### 🎯 Core Functionality
- **User Authentication & Registration** - Secure login and user management
- **Personal Records Tracking** - Monitor your progress across different exercises
- **Workout Session Management** - Log and track your training sessions
- **Exercise Library** - Comprehensive database of exercises with video support
- **Activity Logs** - Detailed tracking of user activities and progress
- **Metrics Management** - Personalize and update your fitness metrics
- **Video Upload/Download** - Upload and manage exercise demonstration videos
- **AI Fitness Assistant** - Chat with an AI-powered fitness advisor for personalized training advice, nutrition tips, and workout guidance

### 📊 Dashboard Features
- **Progress Visualization** - Charts and graphs showing your fitness journey
- **Personal Records Cards** - Easy-to-view PR tracking for each exercise
- **Training Selector** - Choose and customize your workout routines
- **Real-time Updates** - Live data synchronization across the application
- **AI Chat Integration** - Direct access to AI fitness assistance from the dashboard

## 📸 Screenshots

### Dashboard
![Dashboard Screenshot](dashbooard.png)

### Login Page
![Login Screenshot](login.png)

### AI Chat Assistant
![AI Chat Example](https://github.com/Nanu25/GymJournal/raw/Heroku/chatExample.png)

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
- **Jest & Testing Library** - Unit and integration testing

### Backend (`backend/`)
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **TypeScript** - Type-safe server-side development
- **TypeORM** - Object-Relational Mapping
- **PostgreSQL** - Primary database
- **MongoDB** - Additional data storage
- **JWT** - Authentication and authorization
- **Multer** - File upload handling
- **bcrypt** - Password hashing
- **Google Generative AI (Gemini)** - AI-powered fitness assistance
- **Jest** - Testing framework

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database
- MongoDB (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Nanu25/GymJournal
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Create a .env file. You can copy the example if one exists.
   # Example .env content:
   DATABASE_URL=postgresql://username:password@localhost:5432/gym_journal
   JWT_SECRET=your_jwt_secret_here
   PORT=3000
   ```

3. **Frontend Setup**
   ```bash
   cd ../my-app
   npm install
   ```

4. **Database Setup**
   ```bash
   cd ../backend
   npm run build
   # This script populates the database. Ensure your .env is configured.
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
   - Frontend: `http://localhost:5173` (or another port if 5173 is busy)
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
│   │   ├── models/          # Database models (Mongoose)
│   │   ├── middleware/      # Custom middleware
│   │   ├── config/          # Configuration files
│   │   ├── scripts/         # Database scripts
│   │   └── tests/           # Backend tests
│   └── uploads/             # File uploads directory
├── my-app/                  # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── services/        # API services
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
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage
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

## 🧪 Testing

The project includes comprehensive testing with Jest and React Testing Library.

```bash
# Backend tests
cd backend
npm run test

# Frontend tests
cd my-app
npm run test
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### User Management
- `GET /api/user` - Get user profile
- `PUT /api/user` - Update user profile

### Training
- `GET /api/trainings` - Get training sessions
- `POST /api/trainings` - Create training session
- `PUT /api/trainings/:id` - Update training session
- `DELETE /api/trainings/:id` - Delete training session

### Exercises
- `GET /api/exercises` - Get exercise library
- `POST /api/exercises` - Add new exercise

### Activity Logs
- `GET /api/activity-logs` - Get activity logs (admin)

### File Management
- `POST /api/upload` - Upload video files
- `GET /api/download/:filename` - Download files
- `GET /api/videos` - List uploaded videos

### Chat
- `GET /api/chat/status` - Check chat service status
- `POST /api/chat` - Send message to AI fitness assistant

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS configuration
- File upload validation
- Environment variables for sensitive data
- Protected AI chat endpoints requiring authentication

## 🚀 Deployment

### Environment Variables Required
Make sure to set the following environment variables for the AI chat feature:
- `GEMINI_API_KEY` - Your Google Generative AI API key

### Backend Deployment
1. Build the application: `npm run build`
2. Set production environment variables (including GEMINI_API_KEY)
3. Start the server: `npm start`

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy the `dist/` folder to your hosting service of choice (e.g., Netlify, Vercel, AWS S3).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License. See the `package.json` in the `backend` for more details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI library
- [Express.js](https://expressjs.com/) - Web framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [TypeORM](https://typeorm.io/) - Database ORM

---

**Made with ❤️ for fitness enthusiasts** 
