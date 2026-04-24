import React, { useState, useCallback } from 'react';
import HeroSection from './components/HeroSection';
import ProblemForm from './components/ProblemForm';
import SuccessMessage from './components/SuccessMessage';


const App = () => {
  const [submittedData, setSubmittedData] = useState(null);

  const handleSuccess = useCallback((data) => {
    setSubmittedData(data);
    // Scroll to top to show success message
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleReset = useCallback(() => {
    setSubmittedData(null);
  }, []);

  return (
    <div className="app">
      {/* Hero / Landing Section */}
      <HeroSection />

      {/* Main Content */}
      <main className="main-section" id="main-content">
        {submittedData ? (
          <SuccessMessage data={submittedData} onReset={handleReset} />
        ) : (
          <ProblemForm onSuccess={handleSuccess} />
        )}
      </main>

      {/* Footer */}
      <footer className="footer" role="contentinfo">
        <p>
          © {new Date().getFullYear()} Mobile Help Platform &mdash; Aapki sewa mein hamesha 🙏
        </p>
        <p style={{ marginTop: '6px', fontSize: '12px' }}>
          Made with ❤️ for our valued customers
        </p>
      </footer>

    </div>
  );
};

export default App;
