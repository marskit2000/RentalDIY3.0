import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../translations';
import './LandingPage.css';
import HeroImageTwo from './HeroImageTwo';
import AdSenseSection from './AdSenseSection';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const handleGetStarted = () => {
    navigate('/rental-agreement');
  };

  return (
    <div className="landing-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1>{t(language, 'landingTitle')}</h1>
          <p className="hero-subtitle">{t(language, 'landingSubtitle')}</p>
          <button className="cta-button" onClick={handleGetStarted}>
            {t(language, 'getStarted')}
          </button>
        </div>
        <HeroImageTwo />
      </section>

      <section className="features-section">
        <h2>{t(language, 'featuresTitle')}</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📝</div>
            <h3>{t(language, 'feature1Title')}</h3>
            <p>{t(language, 'feature1Description')}</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔄</div>
            <h3>{t(language, 'feature2Title')}</h3>
            <p>{t(language, 'feature2Description')}</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>{t(language, 'feature3Title')}</h3>
            <p>{t(language, 'feature3Description')}</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>{t(language, 'feature4Title')}</h3>
            <p>{t(language, 'feature4Description')}</p>
          </div>
        </div>
      </section>

      {/* Google AdSense Section */}
      <AdSenseSection />

      <section className="how-it-works-section">
        <h2>{t(language, 'howItWorksTitle')}</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>{t(language, 'step1Title')}</h3>
            <p>{t(language, 'step1Description')}</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>{t(language, 'step2Title')}</h3>
            <p>{t(language, 'step2Description')}</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>{t(language, 'step3Title')}</h3>
            <p>{t(language, 'step3Description')}</p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>{t(language, 'ctaTitle')}</h2>
        <p>{t(language, 'ctaDescription')}</p>
        <button className="cta-button" onClick={handleGetStarted}>
          {t(language, 'getStarted')}
        </button>
      </section>

      
    </div>
  );
};

export default LandingPage;
