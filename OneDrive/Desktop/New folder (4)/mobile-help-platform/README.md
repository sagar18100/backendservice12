# 📱 Mobile Software Problem Help Platform

A full-stack platform where users describe their mobile software issues and the admin is notified via **WhatsApp + Email**. Built with React (Vite), Node.js/Express, MongoDB Atlas, Nodemailer, and Twilio WhatsApp.

---

## 📁 Project Structure

```
mobile-help-platform/
├── frontend/    ← React (Vite) app
└── backend/     ← Node.js + Express API
```

---

## 🚀 Local Setup

### Prerequisites
- Node.js 18+
- npm 9+
- MongoDB Atlas account (free tier)
- Twilio account (for WhatsApp)
- Gmail account (for Nodemailer)

---

## 🔧 Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy and fill in your .env
cp .env.example .env
# Edit .env with your real values (see below)

# Start development server
npm run dev
# → Server runs on http://localhost:5000
```

### Backend `.env` values

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `ADMIN_EMAIL` | Email to receive submissions |
| `EMAIL_USER` | Gmail address for SMTP |
| `EMAIL_PASS` | Gmail **App Password** (not your login password) |
| `TWILIO_ACCOUNT_SID` | From [Twilio Console](https://console.twilio.com) |
| `TWILIO_AUTH_TOKEN` | From Twilio Console |
| `TWILIO_WHATSAPP_FROM` | `whatsapp:+14155238886` (sandbox default) |
| `ADMIN_WHATSAPP` | Your WhatsApp: `whatsapp:+91XXXXXXXXXX` |
| `AUTO_REPLY` | `true` or `false` |
| `FRONTEND_URL` | Your Vercel URL (for CORS in production) |

---

### Getting Gmail App Password
1. Go to [Google Account → Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification**
3. Go to [App Passwords](https://myaccount.google.com/apppasswords)
4. Generate a password for "Mail" → use it as `EMAIL_PASS`

---

### Setting up Twilio WhatsApp Sandbox
1. Sign up at [twilio.com](https://www.twilio.com/)
2. Go to **Messaging → Try it out → Send a WhatsApp Message**
3. Follow the sandbox activation instructions (send join code from your WhatsApp)
4. Your admin WhatsApp number must be registered in the sandbox
5. Copy your Account SID and Auth Token from the Twilio Console

---

## 🎨 Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy and fill in your .env
cp .env.example .env
# Edit .env with backend URL and admin contacts

# Start development server
npm run dev
# → App runs on http://localhost:5173
```

### Frontend `.env` values

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend URL (`http://localhost:5000` for dev) |
| `VITE_ADMIN_PHONE` | Call Now button link (e.g., `+919876543210`) |
| `VITE_ADMIN_WHATSAPP` | WhatsApp Chat button (digits only, e.g., `919876543210`) |

---

## 🗄️ MongoDB Atlas Setup

1. Go to [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free M0 cluster
3. Create a database user (username + password)
4. Whitelist your IP (use `0.0.0.0/0` for development)
5. Click **Connect → Connect your application**
6. Copy the connection string into `MONGODB_URI` in `.env`

---

## 🌐 Deployment

### Backend → Render

1. Push `backend/` to a GitHub repo
2. Go to [render.com](https://render.com) → **New Web Service**
3. Connect your GitHub repo
4. Set **Root Directory** = `backend`
5. Set **Build Command** = `npm install`
6. Set **Start Command** = `node server.js`
7. Add all environment variables from `.env` in Render's dashboard
8. Deploy → copy the Render URL (e.g., `https://mobile-help-backend.onrender.com`)

### Frontend → Vercel

1. Push `frontend/` to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → **New Project**
3. Connect your GitHub repo
4. Set **Root Directory** = `frontend`
5. Add environment variable: `VITE_API_URL` = your Render backend URL
6. Add `VITE_ADMIN_PHONE` and `VITE_ADMIN_WHATSAPP`
7. Deploy → copy your Vercel URL

### Update CORS on backend
In `backend/.env`, set:
```env
FRONTEND_URL=https://your-app.vercel.app
```
And redeploy the backend.

---

## 🔌 API Reference

### `POST /api/submit`

Submit a problem form.

**Request Body:**
```json
{
  "name": "Rahul Sharma",
  "phone": "9876543210",
  "address": "Delhi",
  "problem": "Mera phone hang ho raha hai"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Dhanyavaad! Aapki problem receive ho gayi hai...",
  "data": {
    "id": "...",
    "name": "Rahul Sharma",
    "phone": "9876543210",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

**Rate limit:** 5 requests per 15 minutes per IP.

---

## 🛡️ Security Features

- `helmet.js` for security headers
- CORS restricted to frontend URL
- `express-rate-limit` for spam protection (5 req/15 min)
- Input sanitization via `express-validator`
- Request body size limited to 10kb
- HTML escaping in email templates

---

## 📦 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Styling | Vanilla CSS (design system) |
| Backend | Node.js + Express |
| Database | MongoDB Atlas + Mongoose |
| Email | Nodemailer (Gmail SMTP) |
| WhatsApp | Twilio WhatsApp API |
| Deployment | Vercel + Render |

---

## 🤝 Contributing

Feel free to open issues or PRs. For major changes, please open an issue first.

---

*Made with ❤️ — Mobile Help Platform*
