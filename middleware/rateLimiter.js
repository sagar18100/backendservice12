const rateLimit = require('express-rate-limit');

/**
 * Rate limiter: max 5 submissions per 15 minutes per IP
 * Prevents spam form submissions
 */
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message:
      'Bahut zyada requests aa gayi hain. Kripya 15 minute baad try karein. (Too many requests, please try again after 15 minutes.)',
  },
  handler: (req, res, next, options) => {
    console.warn(`[Rate Limit] IP blocked: ${req.ip}`);
    res.status(429).json(options.message);
  },
});

module.exports = { rateLimiter };
