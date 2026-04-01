# ⚡ Quick Start Guide - 5 Minutes

Get **Grasshoppers Attendance System** up and running in just 5 minutes!

## 🎯 Prerequisites Check
- ✅ Node.js v16+ installed
- ✅ npm or yarn available
- ✅ MongoDB running (local or cloud)
- ✅ Modern web browser

**Check versions:**
```bash
node --version  # Should be v16+
npm --version   # Should be v7+
```

## 📦 Installation (1-2 minutes)

### Step 1: Navigate to Project
```bash
cd /path/to/grasshoppers-punch
```

### Step 2: Install Dependencies
```bash
npm install
# This installs all 30+ dependencies
```

### Step 3: Setup MongoDB

**Option A - Local (Mac):**
```bash
brew services start mongodb-community
# MongoDB now runs at mongodb://localhost:27017
```

**Option B - Local (Linux):**
```bash
sudo systemctl start mongodb
```

**Option C - Cloud (Recommended):**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create cluster (takes 3-5 min)
4. Get connection string
5. Update `MONGODB_URI` in `.env.local`

### Step 4: Configure Environment (30 seconds)
The `.env.local` file is already created with defaults!

**Quick setup** - Just update these values:
```env
# .env.local (already exists)
MONGODB_URI=mongodb://localhost:27017/grasshoppers-punch  # If local
# OR
MONGODB_URI=mongodb+srv://username:password@...  # If cloud

JWT_SECRET=dev-secret  # Already set for dev
SMTP_USER=your-email@gmail.com  # For email notifications
SMTP_PASSWORD=your-app-password  # Gmail app password
```

## 🚀 Start Development Server (1 minute)

```bash
npm run dev
```

**Expected output:**
```
> next dev

ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

## 🌐 Access the Application

| Page | URL | Purpose |
|------|-----|---------|
| Home | http://localhost:3000 | Landing page |
| Login | http://localhost:3000/login | User login |
| Signup | http://localhost:3000/signup | New account |
| Dashboard | http://localhost:3000/dashboard | Employee interface |
| Admin | http://localhost:3000/admin | Admin dashboard |
| Holidays | http://localhost:3000/holidays | Holiday management |

## 👤 Demo Accounts

### Employee Account
```
Email: employee@example.com
Password: password123
```
Create your own account by signing up!

### Admin Account
To create an admin account, you need to manually update the database after signup.

**Option 1: Using MongoDB Compass (GUI)**
1. Connect to MongoDB
2. Find `grasshoppers-punch` database
3. Find `users` collection
4. Edit your user document
5. Change `role` field to `"admin"`
6. Save and refresh

**Option 2: Using MongoDB Shell**
```bash
mongo
use grasshoppers-punch
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

## ✅ Verify Everything Works

### Test 1: Frontend Loads
```bash
# In browser, visit:
http://localhost:3000
# Should see landing page with login/signup buttons
```

### Test 2: Create Account
```bash
# Click Sign Up
# Enter your details
# Submit
# Should redirect to dashboard
```

### Test 3: Punch In
```bash
# Click "Punch In" button
# Should show success message
# Button should change to "Punch Out"
```

### Test 4: Punch Out
```bash
# Click "Punch Out" button
# Should show success message
# Button should revert to "Punch In"
```

### Test 5: View History
```bash
# On dashboard, scroll to Punch History
# Should see your punch record
```

## 📚 Next Steps

### 1. Setup Email Notifications

**For Gmail:**
1. Enable 2-Step Verification
2. Generate App Password
3. Copy to `.env.local`:
   ```env
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=your-16-char-password
   ```
4. Restart server

### 2. Enable Push Notifications

Generate VAPID keys:
```bash
npm install -g web-push
web-push generate-vapid-keys
```

Copy keys to `.env.local`:
```env
NEXT_PUBLIC_VAPID_PUBLIC_KEY=...
VAPID_PRIVATE_KEY=...
```

### 3. Explore Admin Panel

```bash
# Make yourself admin (see above)
# Login and visit http://localhost:3000/admin
# View dashboards, manage holidays
```

### 4. Install as PWA

On mobile or desktop:
1. Open app in Chrome/Edge
2. Click address bar menu
3. Click "Install app"
4. Use like native app!

## 🆘 Troubleshooting

### ❌ "Cannot connect to MongoDB"
```bash
# Check MongoDB is running
mongosh  # Connect to test

# For cloud, verify:
# - Connection string is correct
# - IP whitelist includes your IP
# - Firewall allows outbound connections
```

### ❌ "Port 3000 already in use"
```bash
# Find process on port 3000
lsof -i :3000

# Kill it
kill -9 <PID>

# Or use different port
PORT=3001 npm run dev
```

### ❌ "npm modules not installing"
```bash
# Clear npm cache
npm cache clean --force

# Try again
npm install
```

### ❌ "Styling looks broken"
```bash
# Clear Next.js cache
rm -rf .next

# Restart server
npm run dev
```

### ❌ "Email not sending"
```bash
# Use app-specific password (not account password)
# Verify SMTP credentials in .env.local
# Check EMAIL_FROM is set
# Check internet connection
```

## 📖 Documentation

- **Full Setup**: See [README.md](README.md)
- **Development**: See [DEVELOPMENT.md](DEVELOPMENT.md)
- **API Docs**: See [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
- **Features**: See [FEATURES.md](FEATURES.md)

## 🎉 You're All Set!

Your Grasshoppers Attendance System is running! 🦗

Start punching in and tracking attendance. Enjoy!

---

**Need help?** Check the troubleshooting section or review the detailed guides.
