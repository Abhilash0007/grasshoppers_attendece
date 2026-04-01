# 🛠️ Development Guide

Complete guide for developing and deploying Grasshoppers Attendance System.

## 💻 Local Development Setup

### Prerequisites
- Node.js v16+ (v18+ recommended)
- MongoDB (local or cloud)
- Git
- Code editor (VS Code recommended)

### Installation

```bash
# Clone repository
git clone <repo-url>
cd grasshoppers-punch

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Edit .env.local with your configuration
nano .env.local

# Start MongoDB (if local)
mongod

# Start development server
npm run dev
```

Server runs on: http://localhost:3000

## 📁 Project Structure

```
grasshoppers-punch/
├── pages/              # Next.js pages and API routes
│   ├── api/           # API endpoints
│   ├── admin/         # Admin pages
│   ├── index.tsx      # Home page
│   ├── login.tsx      # Login page
│   ├── signup.tsx     # Signup page
│   ├── dashboard.tsx  # Dashboard page
│   ├── holidays.tsx   # Holidays page
│   ├── _app.tsx       # App wrapper
│   └── _document.tsx  # HTML document
├── components/        # React components
├── lib/              # Utilities and models
├── utils/            # Helper functions
├── hooks/            # Custom React hooks
├── context/          # React context providers
├── styles/           # CSS and Tailwind
├── public/           # Static assets
├── types/            # TypeScript types
└── config/           # Configuration files
```

## 🔧 Development Scripts

```bash
# Development server with hot reload
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Format code
npm run format

# Type checking
npm run type-check
```

## 🗄️ Database Management

### MongoDB Connection

Development:
```env
MONGODB_URI=mongodb://localhost:27017/grasshoppers-punch
```

Production (Atlas):
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/grasshoppers-punch
```

### Database Collections

1. **users** - User accounts and profiles
2. **punchrecords** - Punch in/out records
3. **holidays** - Holiday definitions

### Reset Database

```bash
# Connect to MongoDB
mongosh

# Select database
use grasshoppers-punch

# Drop a collection (careful!)
db.punchrecords.deleteMany({})

# Or drop entire database
db.dropDatabase()
```

## 🔐 Authentication & Security

### JWT Implementation

```typescript
// Token generation
const token = jwt.sign(
  { userId: user._id, email: user.email, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);

// Token verification
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

### Password Security

```typescript
// Hashing
const hashedPassword = await bcrypt.hash(password, 10);

// Verification
const isValid = await bcrypt.compare(password, hashedPassword);
```

### Environment Variables

**Never commit .env.local!** Always use .env.example template.

Required for production:
- `MONGODB_URI` - Database connection
- `JWT_SECRET` - Token signing key (min 32 chars)
- `NEXTAUTH_SECRET` - Next Auth secret
- `SMTP_USER` - Email sender
- `SMTP_PASSWORD` - Email password
- `VAPID_PUBLIC_KEY` - Push notifications
- `VAPID_PRIVATE_KEY` - Push notifications

## 📧 Email Configuration

### Gmail Setup
1. Enable 2-Step Verification
2. Create App Password
3. Copy to `.env.local`

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-16-char-app-password
EMAIL_FROM=noreply@grasshoppers.com
```

### Custom SMTP
Update host and port in email utility:

```typescript
// utils/email.ts
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});
```

## 🔔 Push Notifications

### Generate VAPID Keys

```bash
npm install -g web-push
web-push generate-vapid-keys
```

Output:
```
Public Key: AQDN...
Private Key: m3dI...
```

### Setup

1. Copy keys to `.env.local`
2. Share public key with frontend
3. Frontend subscribes to notifications
4. Backend sends notifications with private key

## 🎨 Styling & Components

### Tailwind CSS

Configured in `tailwind.config.js` with:
- Custom colors (grass green theme)
- Custom spacing
- Custom animations
- Custom shadows

### Component Library

Key components:
- `Clock` - Digital clock display
- `PunchButton` - Punch in/out button
- `PunchHistory` - Punch history table
- `Header` - Navigation header
- `PrivateRoute` - Route protection

## 🔄 API Development

### Creating New Endpoint

```typescript
// pages/api/example.ts
import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/db';
import { verifyToken } from '@/utils/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();

    // Verify token
    const token = req.headers.authorization?.split(' ')[1];
    const payload = verifyToken(token!);
    
    if (!payload) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Your logic here

    res.status(200).json({ success: true, data: {} });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
```

### Request/Response Pattern

All API responses should follow:
```json
{
  "success": boolean,
  "data": <T> | null,
  "error": string | null,
  "message": string | null
}
```

## 🧪 Testing

### Manual Testing Checklist

- [ ] User registration
- [ ] User login/logout
- [ ] Punch in (morning)
- [ ] Punch out (evening)
- [ ] View punch history
- [ ] Admin can see all employees
- [ ] Admin dashboard loads
- [ ] Holiday CRUD operations
- [ ] Email notifications send
- [ ] Push notifications work
- [ ] PWA installs
- [ ] App works offline

### Browser DevTools

Check for:
- Console errors
- Network requests
- Local storage (token)
- Service worker status
- Cache storage

## 📦 Building for Production

### Build Process

```bash
# Build optimized version
npm run build

# Test production build locally
npm start
```

### Optimization Tips

1. Image optimization - Next.js handles automatically
2. Code splitting - Done automatically by Next.js
3. CSS minification - Tailwind handles
4. Bundle analysis:
   ```bash
   npm install --save-dev @next/bundle-analyzer
   ```

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# Redeploy
vercel --prod
```

### Heroku

```bash
# Install Heroku CLI
brew install heroku

# Login
heroku login

# Create app
heroku create grasshoppers-attendance

# Set environment variables
heroku config:set MONGODB_URI=...
heroku config:set JWT_SECRET=...

# Deploy
git push heroku main
```

### Docker

```bash
# Build image
docker build -t grasshoppers .

# Run container
docker run -p 3000:3000 \
  -e MONGODB_URI=... \
  -e JWT_SECRET=... \
  grasshoppers
```

### AWS, Google Cloud, etc.

Follow their Node.js deployment guides with:
- Node buildpack
- Environment variables
- MongoDB connection
- HTTPS enabled

## 📊 Monitoring & Logging

### Application Logs

```bash
# View logs in production
# Vercel: vercel logs
# Heroku: heroku logs --tail
# Custom: Check server logs
```

### Error Handling

All errors logged with context:
```typescript
console.error('Action name:', error);
// Includes error message, stack trace, context
```

### Performance Monitoring

Check:
- **Lighthouse score** - Run in Chrome DevTools
- **Core Web Vitals** - Check PageSpeed Insights
- **API response time** - Use Network tab
- **Database performance** - MongoDB Atlas charts

## 🔄 CI/CD Setup

### GitHub Actions Example

```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - name: Deploy
        run: npm run deploy
        env:
          MONGODB_URI: ${{ secrets.MONGODB_URI }}
          JWT_SECRET: ${{ secrets.JWT_SECRET }}
```

## 🐛 Debugging Tips

### Debug Mode

```bash
# Enable debug logging
DEBUG=* npm run dev

# Debug specific module
DEBUG=grasshoppers:* npm run dev
```

### VS Code Debugging

Add to `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/next",
      "args": ["dev"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

### MongoDB Query Debugging

```bash
# Connect to MongoDB
mongosh

# View operations
db.currentOp()

# Kill slow query
db.killOp(opid)
```

## 📚 Useful Resources

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [MongoDB Docs](https://docs.mongodb.com)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [JWT Handbook](https://auth0.com/resources/ebooks/jwt-handbook)

## 🆘 Getting Help

1. Check documentation
2. Review example code
3. Check GitHub issues
4. Search Stack Overflow
5. Ask community

Happy developing! 🚀
