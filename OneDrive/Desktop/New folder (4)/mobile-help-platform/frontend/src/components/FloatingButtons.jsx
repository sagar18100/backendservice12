import React from 'react';

const ADMIN_PHONE = import.meta.env.VITE_ADMIN_PHONE || '+916203896072';
const ADMIN_WHATSAPP = import.meta.env.VITE_ADMIN_WHATSAPP || '916203896072';

const FloatingButtons = () => {
  const waMessage = encodeURIComponent(
    'Namaste! Mujhe apne mobile software mein problem hai.'
  );

  return (
    <div className="floating-btns" role="complementary" aria-label="Quick contact buttons">
      {/* WhatsApp FAB */}
      <a
        href={`https://wa.me/${ADMIN_WHATSAPP}?text=${waMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fab fab-whatsapp"
        id="fab-whatsapp"
        aria-label="Chat on WhatsApp"
      >
        <span role="img" aria-hidden="true">💬</span>
        <span className="fab-tooltip">WhatsApp Chat</span>
      </a>

      {/* Call FAB */}
      <a
        href={`tel:${ADMIN_PHONE}`}
        className="fab fab-call"
        id="fab-call"
        aria-label="Call Now"
      >
        <span role="img" aria-hidden="true">📞</span>
        <span className="fab-tooltip">Call Now</span>
      </a>
    </div>
  );
};

export default FloatingButtons;
