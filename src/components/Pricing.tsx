import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../translations';
import './Pricing.css';

const Pricing: React.FC = () => {
  const { language } = useLanguage();

  return (
    <div className="pricing-container">
      <section className="pricing-hero">
        <h1>{t(language, 'pricing')}</h1>
        <p className="pricing-subtitle">
          {t(language, 'pricingSubtitle') || 'Choose the plan that works for you'}
        </p>
      </section>

      <section className="pricing-plans">
        <div className="pricing-card">
          <div className="pricing-card-header">
            <h2>Free</h2>
            <div className="pricing-price">$0</div>
            <p>Perfect for occasional use</p>
          </div>
          <div className="pricing-card-features">
            <ul>
              <li>Generate up to 3 agreements per month</li>
              <li>Basic templates</li>
              <li>PDF download</li>
              <li>Watermarked documents</li>
            </ul>
          </div>
          <button className="pricing-btn">{t(language, 'getStarted')}</button>
        </div>

        <div className="pricing-card featured">
          <div className="pricing-card-header">
            <h2>Standard</h2>
            <div className="pricing-price">$9.99<span>/month</span></div>
            <p>For regular landlords</p>
          </div>
          <div className="pricing-card-features">
            <ul>
              <li>Unlimited agreements</li>
              <li>All templates</li>
              <li>PDF download</li>
              <li>No watermarks</li>
              <li>Email support</li>
            </ul>
          </div>
          <button className="pricing-btn">{t(language, 'getStarted')}</button>
        </div>

        <div className="pricing-card">
          <div className="pricing-card-header">
            <h2>Professional</h2>
            <div className="pricing-price">$19.99<span>/month</span></div>
            <p>For property managers</p>
          </div>
          <div className="pricing-card-features">
            <ul>
              <li>Everything in Standard</li>
              <li>Custom clauses</li>
              <li>Document storage</li>
              <li>Priority support</li>
              <li>API access</li>
            </ul>
          </div>
          <button className="pricing-btn">{t(language, 'getStarted')}</button>
        </div>
      </section>

      <section className="pricing-faq">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-item">
          <h3>Can I cancel my subscription anytime?</h3>
          <p>Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing period.</p>
        </div>
        <div className="faq-item">
          <h3>Are the agreements legally binding?</h3>
          <p>Our templates are designed to comply with general legal requirements, but we recommend having them reviewed by a legal professional for your specific jurisdiction.</p>
        </div>
        <div className="faq-item">
          <h3>Do you offer refunds?</h3>
          <p>We offer a 14-day money-back guarantee if you're not satisfied with our service.</p>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
