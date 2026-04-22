const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Submission = require('../models/Submission');
const { sendAdminEmail } = require('../services/emailService');
const { sendAdminWhatsApp, sendUserAutoReplyWhatsApp } = require('../services/whatsappService');

// ── Validation Rules ────────────────────────────────────────
const validateSubmission = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Naam zaroori hai (Name is required)')
    .isLength({ max: 100 })
    .withMessage('Name too long')
    .escape(),

  body('address')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 300 })
    .withMessage('Address too long')
    .escape(),

  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number zaroori hai (Phone is required)')
    .matches(/^[+\d\s\-().]{7,20}$/)
    .withMessage('Valid phone number daalen (Enter a valid phone number)'),

  body('problem')
    .trim()
    .notEmpty()
    .withMessage('Problem description zaroori hai (Problem is required)')
    .isLength({ min: 10 })
    .withMessage('Problem thodi detail mein likhein (min 10 characters)')
    .isLength({ max: 2000 })
    .withMessage('Problem description too long (max 2000 chars)')
    .escape(),
];

// ── POST /api/submit ────────────────────────────────────────
router.post('/submit', validateSubmission, async (req, res) => {
  // 1. Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }

  const { name, address, phone, problem } = req.body;

  try {
    // 2. Save to MongoDB
    const submission = await Submission.create({
      name,
      address: address || '',
      phone,
      problem,
      ipAddress: req.ip,
    });

    console.log(`📥 New submission saved: ${submission._id} — ${name} (${phone})`);

    // 3. Send notifications (non-blocking — don't fail if one fails)
    const notificationResults = await Promise.allSettled([
      sendAdminEmail({ name, phone, address, problem, createdAt: submission.createdAt }),
      sendAdminWhatsApp({ name, phone, address, problem }),
    ]);

    // Track which notifications succeeded
    const emailSent = notificationResults[0].status === 'fulfilled';
    const whatsappSent = notificationResults[1].status === 'fulfilled';

    if (!emailSent) {
      console.error('❌ Email notification failed:', notificationResults[0].reason?.message);
    }
    if (!whatsappSent) {
      console.error('❌ WhatsApp notification failed:', notificationResults[1].reason?.message);
    }

    // Update notification status in DB
    await Submission.findByIdAndUpdate(submission._id, {
      'notificationsSent.email': emailSent,
      'notificationsSent.whatsapp': whatsappSent,
    });

    // 4. Optional auto-reply to user
    if (process.env.AUTO_REPLY === 'true') {
      sendUserAutoReplyWhatsApp({ name, phone }).catch((err) => {
        console.warn('⚠️ Auto-reply failed (user may not be in sandbox):', err.message);
      });
    }

    // 5. Success response
    return res.status(201).json({
      success: true,
      message: 'Dhanyavaad! Aapki problem receive ho gayi hai. Hum jald hi contact karenge. 🙏',
      data: {
        id: submission._id,
        name: submission.name,
        phone: submission.phone,
        createdAt: submission.createdAt,
      },
    });
  } catch (error) {
    console.error('❌ Submit route error:', error);

    // Handle MongoDB duplicate / validation errors gracefully
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Data validation failed. Kripya sabhi fields sahi bharen.',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Server error. Kripya baad mein try karein. (Please try again later)',
    });
  }
});

// ── GET /api/health ─────────────────────────────────────────
router.get('/health', (req, res) => {
  res.json({ success: true, message: 'API is running' });
});

module.exports = router;
