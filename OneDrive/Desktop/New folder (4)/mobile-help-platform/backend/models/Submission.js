const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name must be under 100 characters'],
    },
    address: {
      type: String,
      trim: true,
      maxlength: [300, 'Address must be under 300 characters'],
      default: '',
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^[+\d\s\-().]{7,20}$/, 'Please enter a valid phone number'],
    },
    problem: {
      type: String,
      required: [true, 'Problem description is required'],
      trim: true,
      maxlength: [2000, 'Problem description must be under 2000 characters'],
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'resolved'],
      default: 'pending',
    },
    notificationsSent: {
      email: { type: Boolean, default: false },
      whatsapp: { type: Boolean, default: false },
    },
    ipAddress: {
      type: String,
      select: false, // Hidden from regular queries for privacy
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// Index for faster queries by phone
submissionSchema.index({ phone: 1 });
submissionSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Submission', submissionSchema);
