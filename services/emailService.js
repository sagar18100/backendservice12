const nodemailer = require('nodemailer');

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

/**
 * Send email notification to admin with submission details
 * @param {Object} data - Submission data
 */
const sendAdminEmail = async (data) => {
  const { name, phone, address, problem, createdAt } = data;

  const transporter = createTransporter();

  const formattedDate = new Date(createdAt).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'full',
    timeStyle: 'short',
  });

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; background: #f0f4ff; margin: 0; padding: 20px; }
        .wrapper { max-width: 600px; margin: auto; }
        .header {
          background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
          color: white;
          padding: 28px 32px;
          border-radius: 16px 16px 0 0;
          text-align: center;
        }
        .header h1 { margin: 0; font-size: 22px; letter-spacing: 0.5px; }
        .header p { margin: 6px 0 0; opacity: 0.85; font-size: 14px; }
        .body {
          background: #ffffff;
          padding: 32px;
          border-radius: 0 0 16px 16px;
          box-shadow: 0 4px 24px rgba(79, 70, 229, 0.10);
        }
        .badge {
          display: inline-block;
          background: #EEF2FF;
          color: #4F46E5;
          font-size: 12px;
          font-weight: 600;
          padding: 4px 12px;
          border-radius: 99px;
          margin-bottom: 24px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .field { margin-bottom: 20px; }
        .field-label {
          font-size: 12px;
          font-weight: 700;
          color: #6B7280;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          margin-bottom: 6px;
        }
        .field-value {
          font-size: 16px;
          color: #1E1B4B;
          background: #F8FAFF;
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          padding: 12px 16px;
          line-height: 1.6;
          word-break: break-word;
        }
        .problem-box {
          background: #FFFBEB;
          border: 1px solid #FDE68A;
          border-left: 4px solid #F59E0B;
        }
        .footer {
          text-align: center;
          margin-top: 28px;
          font-size: 13px;
          color: #9CA3AF;
        }
        .cta-btn {
          display: inline-block;
          background: linear-gradient(135deg, #25D366, #128C7E);
          color: white !important;
          text-decoration: none;
          padding: 12px 28px;
          border-radius: 99px;
          font-size: 15px;
          font-weight: 600;
          margin: 8px 4px;
        }
        .cta-btn.call {
          background: linear-gradient(135deg, #FF6B35, #E55A2B);
        }
        .actions { text-align: center; margin: 24px 0 8px; }
        .divider { border: none; border-top: 1px solid #E5E7EB; margin: 24px 0; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="header">
          <h1>🔔 New Problem Submission</h1>
          <p>Mobile Software Help Platform</p>
        </div>
        <div class="body">
          <div class="badge">New Request</div>

          <div class="field">
            <div class="field-label">👤 Customer Name</div>
            <div class="field-value">${escapeHtml(name)}</div>
          </div>

          <div class="field">
            <div class="field-label">📱 Phone Number</div>
            <div class="field-value">${escapeHtml(phone)}</div>
          </div>

          <div class="field">
            <div class="field-label">📍 Address</div>
            <div class="field-value">${address ? escapeHtml(address) : '<em style="color:#9CA3AF">Not provided</em>'}</div>
          </div>

          <div class="field">
            <div class="field-label">📝 Problem Description</div>
            <div class="field-value problem-box">${escapeHtml(problem)}</div>
          </div>

          <hr class="divider" />

          <div class="actions">
            <a href="https://wa.me/${phone.replace(/\D/g, '')}" class="cta-btn">💬 WhatsApp</a>
            <a href="tel:${escapeHtml(phone)}" class="cta-btn call">📞 Call Now</a>
          </div>

          <div class="footer">
            <p>Submitted on: <strong>${formattedDate} (IST)</strong></p>
            <p>Mobile Software Help Platform &mdash; Admin Notification</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: `"Mobile Help Platform 📱" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `🔔 New Problem: ${name} — ${phone}`,
    html: htmlContent,
    text: `New Problem Received!\n\nName: ${name}\nPhone: ${phone}\nAddress: ${address || 'Not provided'}\nProblem: ${problem}\n\nSubmitted at: ${formattedDate}`,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`✅ Admin email sent: ${info.messageId}`);
  return info;
};

/**
 * Send auto-reply email to user (optional)
 */
const sendUserAutoReply = async ({ name, phone }) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"Mobile Help Platform 📱" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL, // Only if user provides email; placeholder
    subject: `Aapki problem receive ho gayi! ✅`,
    text: `Namaste ${name} ji!\n\nAapki problem humne receive kar li hai. Hum jald hi aapke number (${phone}) par contact karenge.\n\nDhanyavaad!\nMobile Help Platform`,
  };

  await transporter.sendMail(mailOptions);
};

// Simple HTML escape to prevent injection in email body
const escapeHtml = (str) => {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/\n/g, '<br/>');
};

module.exports = { sendAdminEmail, sendUserAutoReply };
