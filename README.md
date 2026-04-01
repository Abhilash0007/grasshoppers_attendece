# 🦗 Grasshoppers - Punch Attendance System (PWA)

A modern, feature-rich **Progressive Web App** (PWA) for punch and attendance tracking built with **Next.js**, **React**, and **Tailwind CSS**.

## ✨ Features

### 👤 Employee Features
- ✅ **Real-time Clock** - Live digital clock with current date
- ✅ **Punch In/Out** - One-click punch with geolocation tracking
- ✅ **Punch History** - View all your punch records with duration
- ✅ **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- ✅ **Offline Support** - Works offline with service workers
- ✅ **PWA Installation** - Install on home screen like native app

### 👨‍💼 Admin Features
- ✅ **Dashboard** - Real-time statistics and attendance overview
- ✅ **Employee Management** - View all employees and their punch records
- ✅ **Admin Notifications** - Email & push notifications on punch events
- ✅ **Holiday Management** - Manage company holidays and special days
- ✅ **Attendance Reports** - Detailed reports and analytics
- ✅ **Daily Overview** - See who's present/absent at a glance

### 🔐 Security
- ✅ **JWT Authentication** - Secure token-based authentication
- ✅ **Password Hashing** - Bcrypt password encryption
- ✅ **Role-based Access** - Employee and Admin roles
- ✅ **Protected Routes** - Private routes with middleware
- ✅ **Secure API** - Protected API endpoints

### 📱 PWA Features
- ✅ **Offline First** - Works fully offline with service workers
- ✅ **Installable** - Install on any device like a native app
- ✅ **Push Notifications** - Real-time notifications
- ✅ **Background Sync** - Sync data when connection returns
- ✅ **App Shell** - Fast loading cached shell

## 🚀 Tech Stack

| Layer | Technologies |
|-------|---|
| **Frontend** | Next.js 14, React 18, Tailwind CSS, TypeScript |
| **Backend** | Next.js API Routes, Node.js |
| **Database** | MongoDB |
| **Authentication** | JWT, Bcrypt |
| **Notifications** | Nodemailer (Email), Web Push (Browser) |
| **State Management** | React Context, SWR (Data Fetching) |
| **UI Components** | React Icons, Recharts |

## 📋 Prerequisites

- **Node.js** v16+ (v18+ recommended)
- **npm** or **yarn** package manager
- **MongoDB** (local or cloud - MongoDB Atlas)
- Modern web browser (Chrome, Firefox, Safari, Edge)

## ⚡ Quick Start (5 minutes)

### 1. Clone/Navigate to Project
```bash
cd /path/to/grasshoppers
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup MongoDB
```bash
# Option A: Local MongoDB
mongod  # Start MongoDB daemon

# Option B: Cloud (MongoDB Atlas)
# Create account at https://www.mongodb.com/cloud/atlas
# Get your connection string
```

### 4. Configure Environment
```bash
# Copy .env.example to .env.local (already done)
# Edit .env.local with your settings:
vi .env.local
```

**Required Environment Variables:**
```env
MONGODB_URI=mongodb://localhost:27017/grasshoppers-punch
JWT_SECRET=your-secret-key-here
NEXTAUTH_SECRET=your-nextauth-secret
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

### 5. Start Development Server
```bash
npm run dev
```

### 6. Access the App
- **Frontend**: http://localhost:3000
- **API**: http://localhost:3000/api

### 7. Demo Login
```
Email: demo@example.com
Password: password123
```

## 📚 Detailed Setup Guide

### MongoDB Setup

#### Local Installation (macOS)
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Local Installation (Linux)
```bash
sudo apt-get install -y mongodb
sudo systemctl start mongodb
```

#### MongoDB Atlas (Cloud)
1. Visit https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a cluster
4. Get connection string
5. Update `MONGODB_URI` in `.env.local`

### Gmail Setup for Email Notifications

1. Enable 2-Step Verification
2. Generate App Password
3. Copy `SMTP_USER` (your email)
4. Copy `SMTP_PASSWORD` (app-specific password)

### Web Push Notifications

Generate VAPID keys:
```bash
npm install -g web-push
web-push generate-vapid-keys

# Copy public and private keys to .env.local
NEXT_PUBLIC_VAPID_PUBLIC_KEY=...
VAPID_PRIVATE_KEY=...
```

## 📁 Project Structure

```
grasshoppers/
├── pages/
│   ├── api/
│   │   ├── auth/          # Authentication routes
│   │   ├── punch/         # Punch in/out routes
│   │   ├── admin/         # Admin routes
│   │   └── holidays/      # Holiday management
│   ├── admin/             # Admin pages
│   ├── index.tsx          # Home page
│   ├── login.tsx          # Login page
│   ├── signup.tsx         # Signup page
│   ├── dashboard.tsx      # Employee dashboard
│   ├── holidays.tsx       # Holidays page
│   ├── _app.tsx           # App wrapper
│   └── _document.tsx      # Document head
├── components/
│   ├── Clock.tsx          # Digital clock
│   ├── PunchButton.tsx    # Punch in/out button
│   ├── PunchHistory.tsx   # Punch history table
│   ├── Header.tsx         # Navigation header
│   ├── PrivateRoute.tsx   # Route protection
│── lib/
│   ├── db.ts              # MongoDB connection
│   └── models/            # Database models (User, PunchRecord, Holiday)
├── utils/
│   ├── auth.ts            # JWT utilities
│   ├── email.ts           # Email sending
│   └── push-notification.ts # Push notifications
├── hooks/
│   ├── useApi.ts          # API data fetching
│   └── index.ts           # Custom hooks (useClock, useGeolocation)
├── context/
│   └── auth.tsx           # Authentication context
├── styles/
│   └── globals.css        # Global Tailwind styles
├── public/
│   ├── manifest.json      # PWA manifest
│   ├── sw.js              # Service Worker
│   └── icons/             # PWA icons
├── .env.local             # Environment variables
├── package.json           # Dependencies
├── next.config.js         # Next.js config
├── tailwind.config.js     # Tailwind config
└── tsconfig.json          # TypeScript config
```

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start development server

# Production
npm run build            # Build for production
npm start                # Start production server

# Utilities
npm run lint             # Run ESLint
npm run format           # Format code with Prettier
npm run type-check       # TypeScript type checking
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user (coming soon)

### Punch Records
- `POST /api/punch/in` - Punch in
- `POST /api/punch/out` - Punch out
- `GET /api/punch/history` - Get punch history

### Admin
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/employees` - All employees

### Holidays
- `GET /api/holidays` - Get holidays
- `POST /api/holidays` - Create holiday (admin only)
- `DELETE /api/holidays` - Delete holiday (admin only)

## 🔐 Authentication Flow

1. User signs up/logs in
2. Server validates credentials and returns JWT token
3. Token stored in localStorage
4. Token sent with every API request in Authorization header
5. Server validates token on protected routes
6. User can logout to clear token

## 💾 Database Models

### User
```typescript
{
  name: string
  email: string (unique)
  password: string (hashed)
  role: 'employee' | 'admin'
  phone?: string
  department?: string
  position?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}
```

### PunchRecord
```typescript
{
  userId: ObjectId (ref: User)
  punchInTime: Date
  punchOutTime?: Date
  punchInLocation?: { latitude, longitude }
  punchOutLocation?: { latitude, longitude }
  workDuration?: number (in minutes)
  status: 'active' | 'completed'
  date: Date
  createdAt: Date
  updatedAt: Date
}
```

### Holiday
```typescript
{
  name: string
  date: Date
  type: 'national' | 'company' | 'other'
  description?: string
  isRecurring: boolean
  recurringPattern?: 'yearly' | 'monthly'
  createdAt: Date
  updatedAt: Date
}
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
# Follow prompts and configure environment variables
```

### Docker
```bash
docker build -t grasshoppers .
docker run -p 3000:3000 \
  -e MONGODB_URI=... \
  -e JWT_SECRET=... \
  grasshoppers
```

### Manual (Any Node.js Host)
```bash
npm run build
npm start
```

## 🛠️ Troubleshooting

### MongoDB Connection Error
```
Check MONGODB_URI in .env.local
Ensure MongoDB is running
For local: mongod
For cloud: Check connection string and IP whitelist
```

### Email Not Sending
```
Check SMTP credentials in .env.local
Enable less secure apps if using Gmail
Use app-specific password, not account password
```

### Push Notifications Not Working
```
Check VAPID keys are set
Verify browser supports notifications
Check notification permission granted
```

### Service Worker Not Caching
```
Clear browser cache: DevTools > Application > Clear
Restart development server
Check browser console for errors
```

## 📖 Documentation

- [Detailed Setup Guide](DEVELOPMENT.md)
- [API Documentation](API_DOCUMENTATION.md)
- [Feature Checklist](FEATURES.md)

## 🤝 Contributing

Contributions welcome! Please follow the code style and submit pull requests.

## 📄 License

MIT License - Feel free to use for commercial projects

## 📞 Support

For issues and questions:
1. Check documentation first
2. Review troubleshooting section
3. Check GitHub issues
4. Create new issue with details

## 🎉 Happy Tracking!

Grasshoppers makes attendance management simple, efficient, and modern. Enjoy!

---

**Made with ❤️ by the Grasshoppers Team**
