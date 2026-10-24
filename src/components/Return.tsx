import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import './Return.css';
import PaymentSuccess from "./PaymentSuccess";
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../translations';

const Return = () => {
    const [status, setStatus] = useState(null);
    const [customerEmail, setCustomerEmail] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const { language } = useLanguage();
    const navigate = useNavigate();
  
    useEffect(() => {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const sessionId = urlParams.get('session_id');
  
      fetch(`/session-status?session_id=${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          setStatus(data.status);
          setCustomerEmail(data.customer_email);
        });
    }, []);
  
    if (status === 'open') {
      // Show alert and redirect after delay
      useEffect(() => {
        if (status === 'open') {
          setShowAlert(true);
          const timer = setTimeout(() => {
            navigate('/checkout');
          }, 3000); // Redirect after 3 seconds
          
          return () => clearTimeout(timer);
        }
      }, [status, navigate]);
      
      return (
        <div className="return-container">
          {showAlert && (
            <div className="alert-dropdown">
              <div className="alert-content">
                <div className="alert-icon">⚠️</div>
                <div className="alert-message">
                  {t(language, 'paymentDeclined') || 'The payment was declined. No transaction has been made. Redirecting back to the checkout page...'}
                </div>
              </div>
            </div>
          )}
          <div className="return-content">
            <div className="loading-spinner"></div>
            <p>{t(language, 'redirecting') || 'Redirecting...'}</p>
          </div>
        </div>
      );
    }
  
    if (status === 'complete') {
      return (
        <PaymentSuccess email={customerEmail}/>
      )
    }
  
    return null;
  }
  
  export default Return;
