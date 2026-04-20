const twilio = require('twilio');

const getClient = () => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (!accountSid || !authToken) {
    throw new Error('Twilio credentials not configured in .env');
  }

  return twilio(accountSid, authToken);
};

/**
 * Send WhatsApp notification to admin
 * @param {Object} data - Submission data
 */
const sendAdminWhatsApp = async ({ name, phone, address, problem }) => {
  const client = getClient();

  const message = [
    `🔔 *New Problem Received!*`,
    `━━━━━━━━━━━━━━━━━━━━━━`,
    `👤 *Name:* ${name}`,
    `📱 *Phone:* ${phone}`,
    `📍 *Address:* ${address || 'Not provided'}`,
    ``,
    `📝 *Problem:*`,
    `${problem}`,
    `━━━━━━━━━━━━━━━━━━━━━━`,
    `🕐 _Mobile Help Platform_`,
  ].join('\n');

  const result = await client.messages.create({
    from: process.env.TWILIO_WHATSAPP_FROM,
    to: process.env.ADMIN_WHATSAPP,
    body: message,
  });

  console.log(`✅ Admin WhatsApp sent: ${result.sid}`);
  return result;
};

/**
 * Send auto-reply WhatsApp to the user
 * NOTE: User must have sent "join <sandbox-keyword>" to Twilio sandbox first
 * @param {Object} data - Submission data
 */
const sendUserAutoReplyWhatsApp = async ({ name, phone }) => {
  const client = getClient();

  // Strip non-digits and add + prefix for WhatsApp
  const userPhone = `whatsapp:+${phone.replace(/\D/g, '')}`;

  const message = [
    `🙏 *Namaste ${name} ji!*`,
    ``,
    `Aapki problem humne receive kar li hai. ✅`,
    `Hum jald hi aapko *${phone}* par contact karenge.`,
    ``,
    `_Dhanyavaad! — Mobile Help Platform_ 📱`,
  ].join('\n');

  const result = await client.messages.create({
    from: process.env.TWILIO_WHATSAPP_FROM,
    to: userPhone,
    body: message,
  });

  console.log(`✅ User auto-reply WhatsApp sent: ${result.sid}`);
  return result;
};

module.exports = { sendAdminWhatsApp, sendUserAutoReplyWhatsApp };
