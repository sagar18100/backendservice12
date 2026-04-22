require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const { rateLimiter } = require('./middleware/rateLimiter');
const submitRoute = require('./routes/submit');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Security Headers ────────────────────────────────────────
app.use(helmet());

// ── CORS ────────────────────────────────────────────────────
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'https://shivamai.site',
  'https://www.shivamai.site',
  'https://servicebackend-9fuv.vercel.app',
  'https://servicebackend-9fuv-7arkfbbaw-rahshiv034-5890s-projects.vercel.app',
  // Also allow any *.vercel.app subdomain for future preview deployments
  process.env.FRONTEND_URL_PROD,
  process.env.FRONTEND_URL_PREVIEW,
].filter(Boolean); // remove undefined/empty values

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (Postman, curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST'],
    credentials: true,
  })
);

// ── Body Parsing ─────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ── Rate Limiting ────────────────────────────────────────────
app.use('/api/', rateLimiter);

// ── Routes ───────────────────────────────────────────────────
app.use('/api', submitRoute);

// ── Health Check ─────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ── 404 Handler ──────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ── Global Error Handler ─────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[Server Error]', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

// ── MongoDB Connection ────────────────────────────────────────
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
  });
  isConnected = true;
  console.log('✅ MongoDB connected successfully');
};

// ── Vercel: connect on each request, then pass to app ────────
const handler = async (req, res) => {
  try {
    await connectDB();
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    return res.status(500).json({ success: false, message: 'Database connection failed' });
  }
  return app(req, res);
};

// ── Export for Vercel (serverless) ───────────────────────────
module.exports = handler;

// ── Local dev: start the server normally ─────────────────────
if (process.env.NODE_ENV !== 'production' || process.env.VERCEL !== '1') {
  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`📡 Health check: http://localhost:${PORT}/health`);
      });
    })
    .catch((err) => {
      console.error('❌ Startup failed:', err.message);
      process.exit(1);
    });
}
// Deployment trigger: 2026-04-23 001126
