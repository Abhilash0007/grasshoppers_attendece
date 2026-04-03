# API Documentation - New Features

## 🔔 Notifications APIs

### Subscribe to Push Notifications
```
POST /api/notifications/subscribe
Authorization: Bearer {token}

Body:
{
  "subscription": {
    "endpoint": "https://...",
    "keys": {
      "p256dh": "...",
      "auth": "..."
    }
  }
}

Response:
{
  "success": true,
  "message": "Push subscription saved successfully"
}
```

---

## 📋 Punch History APIs

### Get Detailed Punch Records (Admin Only)
```
GET /api/admin/punch-history?employeeId={id}&startDate={date}&endDate={date}&limit=100&skip=0
Authorization: Bearer {admin_token}

Response:
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "userId": {
        "name": "John Doe",
        "email": "john@example.com",
        "department": "IT",
        "position": "Developer"
      },
      "date": "2026-04-02",
      "punchInTime": "2026-04-02T09:00:00Z",
      "punchOutTime": "2026-04-02T18:00:00Z",
      "workDuration": 540,
      "status": "completed"
    }
  ],
  "pagination": {
    "total": 50,
    "limit": 100,
    "skip": 0,
    "returned": 50
  },
  "statistics": {
    "totalRecords": 50,
    "totalWorkMinutes": 27000,
    "avgWorkMinutes": 540,
    "avgWorkHours": "9.00"
  }
}
```

---

## 📢 Announcements APIs

### Get All Announcements (Public - Employees)
```
GET /api/announcements

Response:
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "title": "Company Meeting",
      "description": "Important quarterly meeting",
      "priority": "high",
      "adminName": "Admin User",
      "createdAt": "2026-04-02T10:00:00Z"
    }
  ]
}
```

### Get Single Announcement
```
GET /api/announcements/{id}

Response:
{
  "success": true,
  "data": {
    "_id": "...",
    "title": "Company Meeting",
    "description": "Important quarterly meeting",
    "content": "Full announcement content here...",
    "priority": "high",
    "adminName": "Admin User",
    "createdAt": "2026-04-02T10:00:00Z"
  }
}
```

### Create Announcement (Admin Only)
```
POST /api/announcements
Authorization: Bearer {admin_token}
Content-Type: application/json

Body:
{
  "title": "Company Meeting",
  "description": "Important quarterly meeting",
  "content": "Full announcement content with all details...",
  "priority": "high"
}

Response:
{
  "success": true,
  "data": { /* announcement object */ },
  "message": "Announcement created successfully"
}
```

### Update Announcement (Admin Only)
```
PUT /api/announcements/{id}
Authorization: Bearer {admin_token}

Body:
{
  "title": "Updated Title",
  "description": "Updated description",
  "content": "Updated content",
  "priority": "medium",
  "visible": true
}

Response:
{
  "success": true,
  "data": { /* updated announcement */ },
  "message": "Announcement updated successfully"
}
```

### Delete Announcement (Admin Only)
```
DELETE /api/announcements/{id}
Authorization: Bearer {admin_token}

Response:
{
  "success": true,
  "message": "Announcement deleted successfully"
}
```

---

## 📤 Punch Notification Updates

### Punch In API (Updated)
```
POST /api/punch/in
Authorization: Bearer {token}

Body:
{
  "latitude": 28.6139,
  "longitude": 77.2090,
  "notes": "Optional notes"
}

Response includes:
- Email notification sent to admin
- Push notification sent to employee device
- Both can be toggled via environment variables
```

### Punch Out API (Updated)
```
POST /api/punch/out
Authorization: Bearer {token}

Body:
{
  "latitude": 28.6139,
  "longitude": 77.2090,
  "notes": "Optional notes"
}

Response includes:
- Email notification sent to admin
- Push notification sent to employee device with work duration
- Calculated work duration in response
```

---

## 🔐 Authentication Requirements

| Endpoint | Role Required | Auth Method |
|----------|--------------|-------------|
| `GET /api/announcements` | Employee | Bearer token |
| `POST /api/announcements` | Admin | Bearer token |
| `PUT /api/announcements/{id}` | Admin | Bearer token |
| `DELETE /api/announcements/{id}` | Admin | Bearer token |
| `GET /api/admin/punch-history` | Admin | Bearer token |
| `POST /api/notifications/subscribe` | Employee | Bearer token |

---

## 🌐 UI Pages Added

| Route | Role | Description |
|-------|------|-------------|
| `/announcements` | Employee | View all company announcements |
| `/admin/announcements` | Admin | Create & manage announcements |
| `/admin/punch-history` | Admin | View detailed punch records & export |

---

## 📊 Error Responses

### Common Errors

```javascript
// Unauthorized
{
  "success": false,
  "error": "Unauthorized"
}
// Status: 401

// Admin access required
{
  "success": false,
  "error": "Admin access required"
}
// Status: 403

// Not Found
{
  "success": false,
  "error": "Announcement not found"
}
// Status: 404

// Invalid Input
{
  "success": false,
  "error": "Missing required fields"
}
// Status: 400
```

---

## 🔗 Frontend Integration

### Using Announcements in Components

```typescript
import { useApi } from '@/hooks/useApi';

function MyComponent() {
  const { data: announcements } = useApi('/api/announcements');
  
  return (
    <div>
      {announcements?.map(ann => (
        <div key={ann._id}>
          <h3>{ann.title}</h3>
          <p>{ann.description}</p>
        </div>
      ))}
    </div>
  );
}
```

### Registering Push Notifications

```typescript
// In useEffect after auth
if ('serviceWorker' in navigator && 'PushManager' in window) {
  const registration = await navigator.serviceWorker.ready;
  
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  });

  await fetch('/api/notifications/subscribe', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ subscription }),
  });
}
```

---

## ✅ Features Summary

✅ Admin can view all employee punch in/out history  
✅ Admin can filter punch records by employee & date  
✅ Admin can download CSV reports  
✅ Push notifications on punch in/out (with device status)  
✅ Email notifications to admin (configurable)  
✅ Admin can create/edit/delete announcements  
✅ Employees can view announcements with priorities  
✅ All data persists in MongoDB  
✅ Role-based access control (employee vs admin)  
