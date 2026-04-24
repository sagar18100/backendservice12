import React from 'react';

const HeroSection = () => {
  const scrollToForm = () => {
    document.getElementById('main-content')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero" aria-label="Welcome section">
      {/* Dot grid */}
      <div className="hero-dots" aria-hidden="true" />

      <div className="hero-content">
        {/* Badge */}
        <div className="hero-badge">
          <span>✅</span>
          <span>Trusted Mobile Software Help</span>
        </div>

        {/* Main icon */}
        <span className="hero-icon" role="img" aria-label="mobile phone">📱</span>

        {/* Hindi Greeting */}
        <h1 className="hero-title">
          Hello 👋, aapka swagat hai<br />
          hamare <span style={{ color: '#A5B4FC' }}>Mobile Help Platform</span> par
        </h1>

        {/* Description */}
        <p className="hero-subtitle">
          Yahan aap apne mobile ke software related problems batayein,<br />
          hum aapki madad karenge — Hindi, English ya Hinglish mein 🙏
        </p>

        {/* Single CTA — scroll to form */}
        <div className="hero-actions">
          <button
            onClick={scrollToForm}
            className="btn-hero btn-whatsapp"
            id="hero-submit-btn"
            aria-label="Submit your problem"
          >
            <span role="img" aria-hidden="true">📝</span>
            Apni Problem Submit Karein
          </button>
        </div>

        {/* Stats */}
        <div className="hero-stats" aria-label="Platform statistics">
          <div className="stat-item">
            <span className="stat-number">500+</span>
            <span className="stat-label">Problems Solved</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">24/7</span>
            <span className="stat-label">Support</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">⭐ 4.9</span>
            <span className="stat-label">Rating</span>
          </div>
        </div>
      </div>

      {/* Wave at bottom */}
      <div className="hero-wave" aria-hidden="true">
        <svg viewBox="0 0 1440 64" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path
            d="M0 64L48 58.7C96 53.3 192 42.7 288 42.7C384 42.7 480 53.3 576 53.3C672 53.3 768 42.7 864 37.3C960 32 1056 32 1152 37.3C1248 42.7 1344 53.3 1392 58.7L1440 64V64H1392C1344 64 1248 64 1152 64C1056 64 960 64 864 64C768 64 672 64 576 64C480 64 384 64 288 64C192 64 96 64 48 64H0V64Z"
            fill="#F0F4FF"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
