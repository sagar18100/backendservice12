import React from 'react';

const SuccessMessage = ({ data, onReset }) => {
  return (
    <div
      className="success-card"
      role="alert"
      aria-live="polite"
      aria-label="Form submitted successfully"
    >
      {/* Animated icon */}
      <div className="success-icon-wrap">
        <div className="success-icon-bg" aria-hidden="true">✅</div>
        <div className="success-ring" aria-hidden="true" />
      </div>

      {/* Title */}
      <h2 className="success-title">Dhanyavaad! 🙏</h2>

      {/* Message */}
      <p className="success-message">
        Aapki problem{' '}
        <strong>receive ho gayi hai</strong>.<br />
        Hum jald hi aapko{' '}
        <strong style={{ color: 'var(--primary)' }}>{data?.phone}</strong>{' '}
        par contact karenge.
      </p>

      {/* Submission details */}
      <div className="success-details">
        <div className="success-details-title">📋 Your Submission</div>

        <div className="success-detail-row">
          <span className="detail-key">👤 Name</span>
          <span className="detail-val">{data?.name}</span>
        </div>

        <div className="success-detail-row">
          <span className="detail-key">📱 Phone</span>
          <span className="detail-val">{data?.phone}</span>
        </div>

        {data?.address && (
          <div className="success-detail-row">
            <span className="detail-key">📍 Address</span>
            <span className="detail-val">{data.address}</span>
          </div>
        )}

        <div className="success-detail-row">
          <span className="detail-key">📝 Problem</span>
          <span className="detail-val"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {data?.problem}
          </span>
        </div>
      </div>

      {/* Reset button */}
      <button
        className="btn-new-submission"
        onClick={onReset}
        id="new-submission-btn"
        aria-label="Submit another problem"
      >
        + Nayi Problem Submit Karein
      </button>

      {/* Extra note */}
      <p style={{ marginTop: '16px', fontSize: '12px', color: 'var(--text-light)' }}>
        📨 Hamara team WhatsApp aur Email ke zariye aapki problem dekh raha hai
      </p>
    </div>
  );
};

export default SuccessMessage;
