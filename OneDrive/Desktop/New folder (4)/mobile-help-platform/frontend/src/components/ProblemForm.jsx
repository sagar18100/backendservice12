import React, { useState, useCallback } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const INITIAL_FORM = {
  name: '',
  address: '',
  phone: '',
  problem: '',
};

const INITIAL_ERRORS = {
  name: '',
  phone: '',
  problem: '',
};

// ── Validation helpers ───────────────────────────────────────
const validateField = (name, value) => {
  switch (name) {
    case 'name':
      if (!value.trim()) return 'Naam zaroori hai (Name is required)';
      if (value.trim().length < 2) return 'Naam kam se kam 2 character ka hona chahiye';
      if (value.trim().length > 100) return 'Naam bahut lamba hai (max 100 characters)';
      return '';

    case 'phone': {
      const cleaned = value.replace(/\s/g, '');
      if (!cleaned) return 'Phone number zaroori hai';
      if (!/^[+\d\-().]{7,20}$/.test(cleaned)) return 'Valid phone number daalen (e.g., 9876543210)';
      return '';
    }

    case 'problem':
      if (!value.trim()) return 'Problem likhna zaroori hai';
      if (value.trim().length < 10) return 'Problem thodi aur detail mein likhein (min 10 characters)';
      if (value.trim().length > 2000) return 'Problem bahut lamba hai (max 2000 characters)';
      return '';

    default:
      return '';
  }
};

const validateAll = (form) => {
  const errors = {};
  ['name', 'phone', 'problem'].forEach((field) => {
    const err = validateField(field, form[field]);
    if (err) errors[field] = err;
  });
  return errors;
};

// ── Component ────────────────────────────────────────────────
const ProblemForm = ({ onSuccess }) => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState(INITIAL_ERRORS);
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  // Handle input changes with real-time validation for touched fields
  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
      setServerError('');

      if (touched[name]) {
        setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
      }
    },
    [touched]
  );

  // Mark field as touched on blur and validate
  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    // Touch all required fields to show errors
    setTouched({ name: true, phone: true, problem: true });

    // Full validation
    const validationErrors = validateAll(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...validationErrors }));
      // Scroll to first error
      const firstErrorField = document.querySelector('.form-input.has-error, .form-textarea.has-error');
      if (firstErrorField) firstErrorField.focus();
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: form.name.trim(),
        address: form.address.trim(),
        phone: form.phone.trim(),
        problem: form.problem.trim(),
      };

      const response = await axios.post(`${API_URL}/api/submit`, payload, {
        timeout: 15000,
      });

      if (response.data.success) {
        onSuccess({ ...payload, id: response.data.data?.id });
      }
    } catch (err) {
      if (err.response) {
        // Server returned error response
        const { data } = err.response;

        if (err.response.status === 429) {
          setServerError(data.message || 'Bahut zyada requests. 15 minute baad try karein.');
        } else if (err.response.status === 400 && data.errors) {
          // Field-level validation errors from server
          const serverFieldErrors = {};
          data.errors.forEach(({ field, message }) => {
            serverFieldErrors[field] = message;
          });
          setErrors((prev) => ({ ...prev, ...serverFieldErrors }));
        } else {
          setServerError(data.message || 'Kuch galat ho gaya. Dobara try karein.');
        }
      } else if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
        setServerError('Request timeout ho gayi. Internet connection check karein aur dobara try karein.');
      } else {
        setServerError('Server se connect nahi ho pa raha. Internet connection check karein.');
      }
    } finally {
      setLoading(false);
    }
  };

  const problemLength = form.problem.length;
  const isFormDirty = Object.values(form).some((v) => v.trim() !== '');

  return (
    <div className="form-card" id="problem-form-card">
      {/* Card header */}
      <div className="form-card-header">
        <h2 className="form-card-title">📝 Apni Problem Batayein</h2>
        <p className="form-card-subtitle">
          Niche form bharen — hum jald hi aapse contact karenge
        </p>
      </div>

      {/* Progress dots */}
      <div className="form-progress" role="presentation" aria-hidden="true">
        <div className={`progress-dot ${isFormDirty ? 'active' : ''}`} />
        <div className={`progress-dot ${form.name && form.phone ? 'active' : ''}`} />
        <div className={`progress-dot ${form.problem.length >= 10 ? 'active' : ''}`} />
      </div>

      {/* Server error banner */}
      {serverError && (
        <div className="server-error-banner" role="alert">
          <span className="error-icon">⚠️</span>
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate aria-label="Problem submission form">
        {/* ── Name ────────────────────────────────── */}
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            <span className="label-icon">👤</span>
            Aapka Naam
            <span className="required-star" aria-hidden="true">*</span>
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Apna poora naam likhein"
            className={`form-input ${errors.name && touched.name ? 'has-error' : ''}`}
            maxLength={100}
            autoComplete="name"
            aria-required="true"
            aria-invalid={!!(errors.name && touched.name)}
            aria-describedby={errors.name && touched.name ? 'name-error' : undefined}
          />
          {errors.name && touched.name && (
            <p className="field-error" id="name-error" role="alert">
              <span aria-hidden="true">⚠️</span> {errors.name}
            </p>
          )}
        </div>

        {/* ── Phone ───────────────────────────────── */}
        <div className="form-group">
          <label htmlFor="phone" className="form-label">
            <span className="label-icon">📱</span>
            Phone Number
            <span className="required-star" aria-hidden="true">*</span>
          </label>
          <div
            className={`phone-input-wrapper ${errors.phone && touched.phone ? 'has-error' : ''}`}
          >
            <div className="phone-prefix" aria-hidden="true">
              🇮🇳 +91
            </div>
            <input
              id="phone"
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="98765 43210"
              className="form-input"
              maxLength={15}
              autoComplete="tel"
              inputMode="numeric"
              aria-required="true"
              aria-invalid={!!(errors.phone && touched.phone)}
              aria-describedby={errors.phone && touched.phone ? 'phone-error' : 'phone-hint'}
            />
          </div>
          {errors.phone && touched.phone ? (
            <p className="field-error" id="phone-error" role="alert">
              <span aria-hidden="true">⚠️</span> {errors.phone}
            </p>
          ) : (
            <p id="phone-hint" style={{ fontSize: '12px', color: 'var(--text-light)', marginTop: '6px' }}>
              💡 Yahi number par hum contact karenge
            </p>
          )}
        </div>

        {/* ── Address (optional) ──────────────────── */}
        <div className="form-group">
          <label htmlFor="address" className="form-label">
            <span className="label-icon">📍</span>
            Address
            <span className="optional-tag">Optional</span>
          </label>
          <input
            id="address"
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Apna sheher / mohalla (zaroorat nahi)"
            className="form-input"
            maxLength={300}
            autoComplete="street-address"
          />
        </div>

        {/* ── Problem Description ─────────────────── */}
        <div className="form-group">
          <label htmlFor="problem" className="form-label">
            <span className="label-icon">📝</span>
            Apni Problem Batayein
            <span className="required-star" aria-hidden="true">*</span>
          </label>
          <div className="input-wrapper">
            <textarea
              id="problem"
              name="problem"
              value={form.problem}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Apni problem Hindi, English ya Hinglish mein likhein...
&#10;Example: Mera phone hang ho raha hai, apps open nahi ho rahe, ya battery bahut jaldi khatam ho jati hai."
              className={`form-textarea ${errors.problem && touched.problem ? 'has-error' : ''}`}
              maxLength={2000}
              aria-required="true"
              aria-invalid={!!(errors.problem && touched.problem)}
              aria-describedby={
                errors.problem && touched.problem ? 'problem-error' : 'problem-hint'
              }
            />
            <span
              className="char-count"
              aria-live="polite"
              aria-label={`${problemLength} of 2000 characters used`}
            >
              {problemLength}/2000
            </span>
          </div>
          {errors.problem && touched.problem ? (
            <p className="field-error" id="problem-error" role="alert">
              <span aria-hidden="true">⚠️</span> {errors.problem}
            </p>
          ) : (
            <p id="problem-hint" style={{ fontSize: '12px', color: 'var(--text-light)', marginTop: '6px' }}>
              💡 Jitna detail mein bata sakein, utna better hai
            </p>
          )}
        </div>

        {/* ── Submit ──────────────────────────────── */}
        <button
          type="submit"
          className="btn-submit"
          id="submit-btn"
          disabled={loading}
          aria-busy={loading}
        >
          <span className="btn-submit-inner">
            {loading ? (
              <>
                <span className="spinner" aria-hidden="true" />
                <span>Bhej rahe hain...</span>
              </>
            ) : (
              <>
                <span aria-hidden="true">🚀</span>
                <span>Problem Submit Karein</span>
              </>
            )}
          </span>
        </button>

        {/* Security note */}
        <p className="form-security-note" aria-label="Privacy notice">
          <span aria-hidden="true">🔒</span>
          Aapki information safe hai. Hum kabhi share nahi karenge.
        </p>
      </form>
    </div>
  );
};

export default ProblemForm;
