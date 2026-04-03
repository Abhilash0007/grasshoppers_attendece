# Admin Setup & Features Guide

## 🔐 Admin Account Credentials

```
Email: kgsharma1997143@gmail.com
Username: admin
Password: Superadmin
```

**Important:** Change these credentials immediately after first login for security.

---

## 📧 Email Notifications Setup

### Gmail Configuration (Required)

1. **Get App-Specific Password:**
   - Visit: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer" (or your device)
   - Generate app password
   - Copy the 16-character password

2. **Update `.env.local`:**
   ```
   SMTP_USER=kgsharma1997143@gmail.com
   SMTP_PASSWORD=<your-16-char-app-password>
   EMAIL_FROM=kgsharma1997143@gmail.com
   ADMIN_EMAIL=abhilash.k.g.sharma@gmail.com
   ENABLE_EMAIL_NOTIFICATIONS=true
   ```

3. **Test Email:**
   - Punch in as an employee
   - Admin should receive email notification

---

## 🔔 Push Notifications Setup

### Generate VAPID Keys

```bash
npm install -g web-push
web-push generate-vapid-keys
```

### Update `.env.local`

```
NEXT_PUBLIC_VAPID_PUBLIC_KEY=<your-public-key>
VAPID_PRIVATE_KEY=<your-private-key>
ENABLE_PUSH_NOTIFICATIONS=true
```

### How It Works

1. Employee punches in/out
2. Browser notifies device via push notification
3. Notification shows: "✅ Punch In/Out Successful" + time

---

## 📋 Admin Features

### 1. **Admin Dashboard** (`/admin`)
- **Total Employees:** Quick count
- **Present Today:** Employees who punched in
- **Absent Today:** Employees with no punch record
- **On Time:** Employees who punched in before cutoff
- **Average Work Hours:** Overall work duration metrics
- **Employee Attendance Table:** Real-time punch status

### 2. **Punch History** (`/admin/punch-history`)
**View all employee punch records with filters:**
- Filter by employee name
- Filter by date range (start & end date)
- Download CSV report with all records
- Statistics: Total work hours, average duration
- Status tracking: Completed/Active punches

**CSV Export includes:**
- Employee name & email
- Date, punch in/out times
- Work duration in minutes
- Record status

### 3. **Manage Announcements** (`/admin/announcements`)
**Create & manage company-wide announcements:**
- **Create:** Title, description, full content
- **Priority Levels:** High (🔴), Medium (🟡), Low (🟢)
- **Edit:** Update existing announcements
- **Delete:** Remove announcements
- **Visibility:** Toggle announcement visibility

**Employee View** (`/announcements`)
- See all company announcements
- Expandable content view
- Priority-based highlighting
- Timestamps showing creator & date

### 4. **Holidays Management** (`/holidays`)
- Add/edit/delete company holidays
- Employees see holiday calendar

---

## 👥 User Roles

### Admin Rights
- View all employee punch records
- Download attendance reports
- Create/edit/delete announcements
- Manage holidays
- View detailed statistics

### Employee Rights
- Punch in/out with location
- View personal punch history
- Receive push notifications
- View company announcements
- See holiday calendar

---

## 🔑 Creating New Admin Users

### After Initial Setup

1. Have user sign up through `/signup`
2. Access MongoDB directly:
   ```javascript
   db.users.updateOne(
     { email: "newemail@example.com" },
     { $set: { role: "admin" } }
   )
   ```

---

## 📱 Push Notifications Flow

### For Employees

1. **On App Load:** Browser asks permission for notifications
2. **Approval:** Employee clicks "Allow"
3. **Subscription Saved:** Device subscription stored in database
4. **Punch Action:** When employee punches in/out, they receive:
   - ✅ Confirmation notification
   - Time of punch
   - Work duration (for punch out)

### Notifications Are Sent When:
- ✅ Employee punches in
- ✅ Employee punches out
- 📢 New announcement created (future feature)

---

## 📊 Data Flow

```
Employee Punch In/Out
    ↓
API Route (/api/punch/in or /api/punch/out)
    ↓
├─→ Save punch record to MongoDB
├─→ Calculate work duration
├─→ Send Email to Admin
└─→ Send Push Notification to Employee
```

---

## 🚀 Environment Variables Checklist

```bash
# Core
MONGODB_URI=mongodb://127.0.0.1:27017/grasshoppers-punch
JWT_SECRET=<strong-random-string>

# Email (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=kgsharma1997143@gmail.com
SMTP_PASSWORD=<app-specific-password>
EMAIL_FROM=kgsharma1997143@gmail.com
ADMIN_EMAIL=abhilash.k.g.sharma@gmail.com

# Notifications
ENABLE_EMAIL_NOTIFICATIONS=true
ENABLE_PUSH_NOTIFICATIONS=true

# Push (Generate with web-push)
NEXT_PUBLIC_VAPID_PUBLIC_KEY=<your-key>
VAPID_PRIVATE_KEY=<your-key>

# Next Auth (Optional)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<random>
```

---

## 🐛 Troubleshooting

### Emails Not Sending
- Check app-specific password is correct
- Verify Gmail account has 2FA enabled
- Check `ENABLE_EMAIL_NOTIFICATIONS=true` in .env

### Push Notifications Not Working
- Generate fresh VAPID keys
- Ensure browser allows notifications
- Check `ENABLE_PUSH_NOTIFICATIONS=true` in .env
- Reload app after updating .env

### Admin Features Not Visible
- Verify user role is "admin" in MongoDB
- Clear browser cache
- Logout and login again

---

## 📞 Support

For issues or questions:
1. Check environment variables are set correctly
2. Ensure MongoDB is running
3. Check browser console for errors
4. Review API responses in Network tab

---

## ✅ Quick Start Checklist

- [ ] Admin account created (kgsharma1997143@gmail.com / Superadmin)
- [ ] Gmail app password configured
- [ ] `.env.local` updated with credentials
- [ ] VAPID keys generated (for push notifications)
- [ ] MongoDB is running
- [ ] App started (`npm run dev`)
- [ ] Admin user set role="admin" in database
- [ ] Test punch in/out
- [ ] Verify email notification received
- [ ] Test push notification
- [ ] Create test announcement
- [ ] View announcement as employee
