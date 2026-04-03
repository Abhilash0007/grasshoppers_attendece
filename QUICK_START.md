# 🚀 Quick Start Guide - New Features

## 5-Minute Setup

### 1. **Verify Environment File** (Already Updated)
Your `.env.local` already has:
```
ADMIN_EMAIL=abhilash.k.g.sharma@gmail.com
ENABLE_EMAIL_NOTIFICATIONS=true
ENABLE_PUSH_NOTIFICATIONS=true
```

### 2. **Add Gmail App Password**
1. Go to: https://myaccount.google.com/apppasswords
2. Select: Mail | Windows (or your device)
3. Click "Generate"
4. Copy 16-character password
5. Update in `.env.local`:
```
SMTP_PASSWORD=<paste-16-char-password-here>
```

### 3. **Optional: Setup Push Notifications**
```bash
npm install -g web-push
web-push generate-vapid-keys
```

Copy the keys and update `.env.local`:
```
NEXT_PUBLIC_VAPID_PUBLIC_KEY=<public-key>
VAPID_PRIVATE_KEY=<private-key>
```

### 4. **Set Admin User in MongoDB**
```javascript
// Connect to MongoDB and run:
db.users.updateOne(
  { email: "kgsharma1997143@gmail.com" },
  { $set: { role: "admin" } }
)
```

### 5. **Start App**
```bash
npm run dev
```

Open: http://localhost:3000

---

## 🎯 Try It Out

### As Admin (kgsharma1997143@gmail.com / Superadmin):
1. ✅ Login
2. 📋 Click "Punch History" → View all employee records
3. 📋 Filter by employee or date range
4. ⬇️ Click "Export CSV" to download records
5. 📝 Click "Manage Updates" → Create announcement
6. 📢 Write update & set priority → Publish

### As Employee:
1. ✅ Sign up OR login
2. 💼 Click "Punch In" button
3. ✅ Get push notification (if enabled)
4. 📧 Admin gets email notification
5. 📢 Click "Updates" to see announcements
6. 💼 Clock "Punch Out"
7. ✅ Get notification with work duration

---

## 📧 Email Example

When employee punches:
```
From: kgsharma1997143@gmail.com
To: abhilash.k.g.sharma@gmail.com

Subject: John Doe - Punched In

John Doe from your organization just punched in at 09:30 AM
```

---

## 🔔 Push Notification Example

When employee punches:
```
Title: ✅ Punch In Successful
Body: You punched in at 09:30 AM
```

When employee punches out:
```
Title: ✅ Punch Out Successful
Body: You punched out at 06:30 PM. Work duration: 540 minutes
```

---

## 📊 Admin Features Overview

| Feature | Route | Description |
|---------|-------|-------------|
| **Punch History** | `/admin/punch-history` | View all punch records, filter, export CSV |
| **Manage Updates** | `/admin/announcements` | Create/edit/delete announcements |
| **Main Dashboard** | `/admin` | Overall statistics & attendance |
| **Holidays** | `/holidays` | Manage company holidays |

---

## 👥 Employee Features

| Feature | Route | Description |
|---------|-------|-------------|
| **Updates** | `/announcements` | View company announcements |
| **Dashboard** | `/dashboard` | Punch in/out, view history |
| **Punch History** | `/dashboard` | Personal punch records |

---

## 🔑 Admin Credentials

```
Email: kgsharma1997143@gmail.com
Password: Superadmin
```

⚠️ **Change password after first login!**

---

## ✅ Verification Checklist

After setup, verify:
- [ ] Can login as admin
- [ ] Can see "Punch History" in navigation (admin only)
- [ ] Can see "Manage Updates" in navigation (admin only)
- [ ] Can create announcement
- [ ] Can see announcement as employee
- [ ] Punch in sends notification
- [ ] Email received at `abhilash.k.g.sharma@gmail.com`

---

## 🐛 Troubleshooting

### "Admin access required" error?
→ Set user role to "admin" in MongoDB

### Emails not arriving?
→ Check Gmail app password (not regular password)

### Push notifications not working?
→ Allow browser notifications when prompted

### Announcement not visible?
→ Refresh page / clear browser cache

---

## 📚 Documentation

📄 [Full Admin Setup Guide](./ADMIN_SETUP.md)  
📄 [API Documentation](./API_NEW_FEATURES.md)  
📄 [Feature Checklist](./FEATURE_CHECKLIST.md)  
📄 [Original README](./README.md)  

---

## 🎓 Understanding the Features

### Punch History Feature
- **Why?** Admins need to verify attendance and work hours
- **What?** Complete log of when employees punch in/out
- **How?** Filter by employee/date, download reports

### Email Notifications
- **Why?** Admin awareness of punch events in real-time
- **What?** Email sent immediately on punch in/out
- **How?** Configured in `.env.local`

### Push Notifications
- **Why?** Employees get instant confirmation
- **What?** Browser notification on punch events
- **How?** Device subscription in browser

### Announcements
- **Why?** Company-wide communication
- **What?** Prioritized updates from admin to all employees
- **How?** Create in admin panel, view in updates tab

---

**Ready? Run `npm run dev` and start punching! 🌟**
