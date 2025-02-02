# TBO HACKATHON - AI Trip Planner 🌎

An intelligent travel planning platform that combines AI-powered itinerary generation with real-time collaboration features.

## 🚀 Features

### 1. AI Trip Itinerary Generator
- Personalized travel plans using Gemini API
- Smart recommendations based on:
  - Destination preferences
  - Budget constraints
  - Luxury preferences
  - Trip duration
- Google Places API integration for location photos
- Direct Google Maps integration for places

### 2. Real-time Group Planning
- Interactive chat rooms for groups of 2+ people
- Email-based invitation system
- Real-time messaging with WebSocket support
- Media file sharing capabilities
- Firebase-powered data persistence

### 3. Dynamic Schedule Management
- Interactive calendar interface using react-big-calendar
- Features:
  - Drag-and-drop event management
  - Hour-by-hour planning
  - Custom event creation
  - Real-time updates via Firebase

### 4. Smart Budget Tracking
- Individual expense tracking
- Group expenditure management
- Category-wise budget analysis
- Voice input support (Groq API + Whisper Large v3)
- AI-powered expense chat history search
- Friend-wise due/debt tracking

### 5. Integrated Booking System
- TBO API integration for:
  - Hotel bookings
  - Flight reservations
- Comprehensive search filters
- Real-time availability checks

## 🛠️ Tech Stack

### Frontend
```json
{
  "framework": "React 18.3.1",
  "buildTool": "Vite 6.0.1",
  "styling": "TailwindCSS 3.4.17",
  "realtime": "Socket.io-client 4.8.1",
  "database": "Firebase 11.1.0",
  "routing": "React Router DOM 7.0.2"
}
```

### Backend (Node.js)
```json
{
  "runtime": "Node.js",
  "framework": "Express 4.21.2",
  "realtime": "Socket.io 4.8.1",
  "database": ["Firebase 11.2.0", "MongoDB 6.12.0"],
  "orm": "Mongoose 8.9.5",
  "email": "Nodemailer 6.10.0"
}
```

### Backend (Python)
- AI/ML Processing
- Google Cloud Translation Integration
- Service Account Authentication

## 🚀 Getting Started

### Prerequisites
- Node.js (Latest LTS)
- Python 3.x
- MongoDB
- Firebase Account
- Google Cloud Account

### Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Node.js Backend Setup
```bash
# Install dependencies
npm install

# Start server
npm start
```

### Required Environment Variables
```env
# Firebase
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_PROJECT_ID=
FIREBASE_STORAGE_BUCKET=
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_APP_ID=

# Google APIs
GOOGLE_MAPS_API_KEY=
GEMINI_API_KEY=

# TBO API
TBO_API_KEY=
TBO_API_SECRET=

# Database
MONGODB_URI=

# Email
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=

# Groq
GROQ_API_KEY=
```

## 📁 Project Structure
```
trip-planner/
├── frontend/            # React frontend
│   ├── src/
│   ├── public/
│   └── package.json
├── backend-node/        # Node.js backend
│   ├── src/
│   └── package.json
└── backend-python/      # Python backend
    ├── src/
    └── requirements.txt
```

## 🔒 Security Notes
- Secure all API keys and credentials
- Use environment variables
- Implement proper authentication
- Enable HTTPS
- Set up CORS correctly
- Rate limit API endpoints


## 📝 License
ISC License

## 🙏 Acknowledgments
- TBO API Documentation
- Google Cloud Platform
- Firebase Documentation
- React Community
- Node.js Community
