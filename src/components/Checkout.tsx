import { useCallback, useState, useEffect, useRef } from "react";
import { loadStripe } from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js';
import './Checkout.css';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../translations';
import { loadPdfInputValues, PdfInputValues } from '../utils/pdfGenerator';
import { useNavigate } from 'react-router-dom';

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe("pk_test_51RA8KVINtVMv4lc9Eep5HOFszD4ejFQwFXst1Oh5vJV3EqsexIxa08C9EdVIVaBFfznQudB5lyV6D1FlRTQ1cbJp00HNfbhbwJ");

const Checkout = () => {
  const { language } = useLanguage();
  const [formValues, setFormValues] = useState<PdfInputValues | null>(null);
  const navigate = useNavigate();
  const summaryRef = useRef<HTMLDivElement>(null);
  const paymentRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Load saved form values from localStorage
    const savedValues = loadPdfInputValues();
    setFormValues(savedValues);
  }, []);

  // Effect to synchronize heights between summary and payment sections
  useEffect(() => {
    // Function to check if we're on mobile view
    const isMobileView = () => {
      return window.innerWidth <= 768; // Standard breakpoint for mobile devices
    };

    const syncHeights = () => {
      if (summaryRef.current && paymentRef.current) {
        // Only apply height sync on non-mobile screens
        if (!isMobileView()) {
          const paymentHeight = paymentRef.current.offsetHeight;
          if (paymentHeight > 600) {
            summaryRef.current.style.height = `${paymentHeight}px`;
          } else {
            summaryRef.current.style.height = '600px';
          }
        } else {
          // Reset height on mobile view
          summaryRef.current.style.height = 'auto';
        }
      }
    };

    // Initial sync
    syncHeights();

    // Set up observer to watch for height changes in the payment form
    const resizeObserver = new ResizeObserver(syncHeights);
    if (paymentRef.current) {
      resizeObserver.observe(paymentRef.current);
    }

    // Also listen for window resize events to handle orientation changes
    window.addEventListener('resize', syncHeights);

    // Cleanup
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', syncHeights);
    };
  }, []);

  const fetchClientSecret = useCallback(() => {
    // Create a Checkout Session
    return fetch("/create-checkout-session", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        // Add any parameters you want to send
        language: language === "zh-CN" ? "zh" : language,
      })
    })
      .then((res) => res.json())
      .then((data) => data.clientSecret);
  }, [language]);

  const options = { fetchClientSecret };

  // Helper function to format values for display
  const formatValue = (value: string | string[] | undefined) => {
    if (!value) return '-';
    if (Array.isArray(value)) {
      return value.filter(item => item.trim() !== '').join(', ') || '-';
    }
    
    // Check if the value might be a translation key
    // This assumes that translation keys don't contain spaces
    // and are typically shorter than displayed values
    if (typeof value === 'string' && !value.includes(' ') && value.length < 30) {
      const translated = t(language, value);
      if (translated && translated !== value) {
        return translated;
      }
    }
    
    return value || '-';
  };


  // Helper function to get translated field names
  const getFieldLabel = (key: string) => {
    return t(language, key) || key;
  };

  // Helper function to render a field row
  const renderField = (label: string, value: string | string[] | undefined) => {
    return (
      <div className="checkout-field">
        <div className="field-label">{label}</div>
        <div className="field-value">{formatValue(value)}</div>
      </div>
    );
  };
  
  // Handle edit button click
  const handleEditClick = () => {
    navigate('/rental-agreement');
  };

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <h1>{t(language, 'checkoutTitle') || 'Complete Your Purchase'}</h1>
        <p>{t(language, 'checkoutSubtitle') || 'Please review your information and complete the payment to generate your rental agreement.'}</p>
      </div>

      <div className="checkout-content">
        <div className="checkout-summary" ref={summaryRef}>
          <div className="summary-header">
            <h2>{t(language, 'orderSummary') || 'Order Summary'}</h2>
          </div>
          
          <div className="summary-content">
            <div className="summary-section">
              <h3>{t(language, 'propertyDetails') || 'Property Details'}</h3>
              {renderField(getFieldLabel('propertyAddress'), formValues?.inputText1)}
              {renderField(getFieldLabel('from'), formValues?.dateFrom)}
              {renderField(getFieldLabel('to'), formValues?.dateTo)}
              {renderField(getFieldLabel('propertyUse'), formValues?.propertyUse)}
            </div>

            <div className="summary-section">
              <h3>{t(language, 'financialDetails') || 'Financial Details'}</h3>
              {renderField(getFieldLabel('rentalAmount'), formValues?.rentAmount)}
              {renderField(getFieldLabel('depositAmount'), formValues?.securityDeposit)}
              {renderField(getFieldLabel('managementFee'), formValues?.managementFee)}
              {renderField(getFieldLabel('governmentRates'), formValues?.governmentRates)}
              {renderField(getFieldLabel('governmentRent'), formValues?.governmentRent)}
              {renderField(getFieldLabel('rentFreeFrom'), formValues?.rentFreeFrom)}
              {renderField(getFieldLabel('rentFreeTo'), formValues?.rentFreeTo)}
            </div>

            <div className="summary-section">
              <h3>{t(language, 'partiesInvolved') || 'Parties Involved'}</h3>
              {renderField(getFieldLabel('landlord'), formValues?.inputText2)}
              {renderField(getFieldLabel('landlordTel'), formValues?.landlordTel)}
              {renderField(getFieldLabel('landlordId'), formValues?.landLordId)}
              {renderField(getFieldLabel('landlordAddress'), formValues?.inputText4)}
              {renderField(getFieldLabel('tenant'), formValues?.inputText3)}
              {renderField(getFieldLabel('tenantTel'), formValues?.tenantTel)}
              {renderField(getFieldLabel('tenantId'), formValues?.tenantId)}
              {renderField(getFieldLabel('tenantAddress'), formValues?.inputText5)}
            </div>

            <div className="summary-section">
              <h3>{t(language, 'breakClause') || 'Break Clause'}</h3>
              {renderField(getFieldLabel('breakClause1'), formValues?.breakClause1)}
              {renderField(getFieldLabel('breakClause2'), formValues?.breakClause2)}
              {renderField(getFieldLabel('breakClause3'), formValues?.breakClause3)}
              {formValues?.breakClause3Other && renderField(getFieldLabel('other'), formValues.breakClause3Other)}
            </div>

            <div className="summary-section">
              <h3>{t(language, 'bankDetails') || 'Bank Details'}</h3>
              {renderField(getFieldLabel('bank'), formValues?.bank)}
              {renderField(getFieldLabel('landlordBankAccount'), formValues?.landlordBankAccount)}
            </div>

            <div className="summary-section">
              <h3>{t(language, 'fixtures') || 'Fixtures & Fittings'}</h3>
              {renderField(getFieldLabel('airConditioner'), formValues?.airConditioner)}
              {renderField(getFieldLabel('ventilator'), formValues?.ventilator)}
              {renderField(getFieldLabel('oilVentilator'), formValues?.oilVentilator)}
              {renderField(getFieldLabel('waterHeater'), formValues?.waterHeater)}
              {renderField(getFieldLabel('gasStove'), formValues?.gasStove)}
              {renderField(getFieldLabel('lightings'), formValues?.lightings)}
              {renderField(getFieldLabel('refrigerator'), formValues?.refrigerator)}
              {renderField(getFieldLabel('washingMachine'), formValues?.washingMachine)}
              {renderField(getFieldLabel('bed'), formValues?.bed)}
              {renderField(getFieldLabel('wardrobe'), formValues?.wardrobe)}
              {renderField(getFieldLabel('settee'), formValues?.settee)}
              {renderField(getFieldLabel('otherFurniture'), formValues?.otherFurniture)}
            </div>

            <div className="summary-section">
              <h3>{t(language, 'otherDetails') || 'Other Details'}</h3>
              {renderField(getFieldLabel('agreementDate'), formValues?.inputDate2)}
            </div>

            {formValues?.remarksFields && formValues.remarksFields.some(remark => remark.trim() !== '') && (
              <div className="summary-section">
                <h3>{t(language, 'remarks') || 'Remarks'}</h3>
                <div className="remarks-content">
                  {formValues.remarksFields
                    .filter(remark => remark.trim() !== '')
                    .map((remark, index) => (
                      <div key={index} className="remark-item">{remark}</div>
                    ))}
                </div>
              </div>
            )}
          </div>
          <div className="summary-footer">
            <button className="edit-button" onClick={handleEditClick}>
              <span className="edit-icon">✎</span>
              {t(language, 'edit') || 'Edit'}
            </button>
          </div>
        </div>

        <div className="checkout-payment" ref={paymentRef}>
          <div className="payment-header">
            <h2>{t(language, 'payment') || 'Payment'}</h2>
          </div>
          <div className="payment-content">
            <div className="payment-form">
              <EmbeddedCheckoutProvider
                stripe={stripePromise}
                options={options}
              >
                <EmbeddedCheckout />
              </EmbeddedCheckoutProvider>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;