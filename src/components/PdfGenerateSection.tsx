import React, { useState, useEffect, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../translations';
import { 
  generatePDF, 
  PdfGenerationParams, 
  updatePdfInputValues, 
  loadPdfInputValues,
  resetPdfInputValues,
  PdfInputValues
} from '../utils/pdfGenerator';
import ConfirmationModal from './ui/ConfirmationModal';
import AdInterstitialModal from './AdInterstitialModal';
import AdSenseSection from './AdSenseSection';
import PdfInputForm from './PdfInputForm';
import './PdfGenerateSection.css';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface PdfGenerateSectionProps {
  // Add props here as needed
}

const PdfGenerateSection: React.FC<PdfGenerateSectionProps> = () => {
  const { language } = useLanguage();
  
  const isFreeMode = true;
  
  // Load saved values from session storage or use defaults
  const savedValues = loadPdfInputValues();
  
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [inputText1, setInputText1] = useState(savedValues.inputText1);
  const [inputText2, setInputText2] = useState(savedValues.inputText2);
  const [inputText3, setInputText3] = useState(savedValues.inputText3);
  const [inputText4, setInputText4] = useState(savedValues.inputText4);
  const [inputText5, setInputText5] = useState(savedValues.inputText5);
  const [rentAmount, setRentAmount] = useState(savedValues.rentAmount);
  const [securityDeposit, setSecurityDeposit] = useState(savedValues.securityDeposit);
  const [propertyUse, setPropertyUse] = useState(savedValues.propertyUse);
  const [managementFee, setManagementFee] = useState(savedValues.managementFee);
  const [governmentRates, setGovernmentRates] = useState(savedValues.governmentRates);
  const [governmentRent, setGovernmentRent] = useState(savedValues.governmentRent);
  const [rentFreeFrom, setRentFreeFrom] = useState(savedValues.rentFreeFrom);
  const [rentFreeTo, setRentFreeTo] = useState(savedValues.rentFreeTo);
  const [breakClause1, setBreakClause1] = useState(savedValues.breakClause1);
  const [breakClause2, setBreakClause2] = useState(savedValues.breakClause2);
  const [breakClause3, setBreakClause3] = useState(savedValues.breakClause3);
  const [breakClause3Other, setBreakClause3Other] = useState(savedValues.breakClause3Other);
  const [airConditioner, setAirConditioner] = useState(savedValues.airConditioner);
  const [ventilator, setVentilator] = useState(savedValues.ventilator);
  const [oilVentilator, setOilVentilator] = useState(savedValues.oilVentilator);
  const [waterHeater, setWaterHeater] = useState(savedValues.waterHeater);
  const [gasStove, setGasStove] = useState(savedValues.gasStove);
  const [lightings, setLightings] = useState(savedValues.lightings);
  const [refrigerator, setRefrigerator] = useState(savedValues.refrigerator);
  const [washingMachine, setWashingMachine] = useState(savedValues.washingMachine);
  const [bed, setBed] = useState(savedValues.bed);
  const [wardrobe, setWardrobe] = useState(savedValues.wardrobe);
  const [settee, setSettee] = useState(savedValues.settee);
  const [otherFurniture, setOtherFurniture] = useState(savedValues.otherFurniture);
  const [landLordId, setLandLordId] = useState(savedValues.landLordId);
  const [landlordTel, setLandlordTel] = useState(savedValues.landlordTel);
  const [tenantId, setTenantId] = useState(savedValues.tenantId);
  const [tenantTel, setTenantTel] = useState(savedValues.tenantTel);
  const [landlordBankAccount, setLandlordBankAccount] = useState(savedValues.landlordBankAccount);
  const [bank, setBank] = useState(savedValues.bank);
  const [inputDate2, setInputDate2] = useState(savedValues.inputDate2);
  const [dateFrom, setDateFrom] = useState(savedValues.dateFrom);
  const [dateTo, setDateTo] = useState(savedValues.dateTo);
  const [remarksFields, setRemarksFields] = useState<string[]>(savedValues.remarksFields);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [redirectToCheckout, setRedirectToCheckout] = useState(false);
  const [showAdModal, setShowAdModal] = useState(false);

  // ConvertToImage State - used by the preview function
  const [images, setImages] = useState<string[]>([]);
  // These variables are used in the handlePreview function when passed to generatePDF
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [imageError, setImageError] = useState<string | null>(null);

  // Create a debounced update function with 500ms delay
  const debouncedUpdate = useCallback(() => {
    let timeoutId: number | null = null;
    
    return (updates: Partial<PdfInputValues>) => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
      
      timeoutId = window.setTimeout(() => {
        updatePdfInputValues(updates);
        timeoutId = null;
      }, 500);
    };
  }, [])();

  // Generic change handler for input fields
  const handleInputChange = useCallback(<T extends string | number | boolean | string[]>(fieldName: keyof PdfInputValues, value: T, setter: React.Dispatch<React.SetStateAction<T>>) => {
    setter(value);
    debouncedUpdate({ [fieldName]: value } as Partial<PdfInputValues>);
  }, [debouncedUpdate]);

  // Handle remarks changes separately due to array structure
  const handleRemarkChange = useCallback((index: number, value: string) => {
    setRemarksFields(prev => {
      const newFields = [...prev];
      newFields[index] = value;
      debouncedUpdate({ remarksFields: newFields });
      return newFields;
    });
  }, [debouncedUpdate]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const resetFormValues = () => {
    // Reset all form values to defaults
    const defaultValues = resetPdfInputValues();
        
    // Update all state values
    setInputText1(defaultValues.inputText1);
    setInputText2(defaultValues.inputText2);
    setInputText3(defaultValues.inputText3);
    setInputText4(defaultValues.inputText4);
    setInputText5(defaultValues.inputText5);
    setRentAmount(defaultValues.rentAmount);
    setSecurityDeposit(defaultValues.securityDeposit);
    setPropertyUse(defaultValues.propertyUse);
    setManagementFee(defaultValues.managementFee);
    setGovernmentRates(defaultValues.governmentRates);
    setGovernmentRent(defaultValues.governmentRent);
    setRentFreeFrom(defaultValues.rentFreeFrom);
    setRentFreeTo(defaultValues.rentFreeTo);
    setBreakClause1(defaultValues.breakClause1);
    setBreakClause2(defaultValues.breakClause2);
    setBreakClause3(defaultValues.breakClause3);
    setBreakClause3Other(defaultValues.breakClause3Other);
    setAirConditioner(defaultValues.airConditioner);
    setVentilator(defaultValues.ventilator);
    setOilVentilator(defaultValues.oilVentilator);
    setWaterHeater(defaultValues.waterHeater);
    setGasStove(defaultValues.gasStove);
    setLightings(defaultValues.lightings);
    setRefrigerator(defaultValues.refrigerator);
    setWashingMachine(defaultValues.washingMachine);
    setBed(defaultValues.bed);
    setWardrobe(defaultValues.wardrobe);
    setSettee(defaultValues.settee);
    setOtherFurniture(defaultValues.otherFurniture);
    setLandLordId(defaultValues.landLordId);
    setLandlordTel(defaultValues.landlordTel);
    setTenantId(defaultValues.tenantId);
    setTenantTel(defaultValues.tenantTel);
    setLandlordBankAccount(defaultValues.landlordBankAccount);
    setBank(defaultValues.bank);
    setInputDate2(defaultValues.inputDate2);
    setDateFrom(defaultValues.dateFrom);
    setDateTo(defaultValues.dateTo);
    setRemarksFields(defaultValues.remarksFields);
  };

  const handleGeneratePDF = async () => {
    try {
      setIsLoading(true);
      
      const params: PdfGenerationParams = {
        inputDate2,
        inputText1,
        inputText2,
        inputText3,
        inputText4,
        inputText5,
        rentAmount,
        securityDeposit,
        propertyUse,
        managementFee,
        governmentRates,
        governmentRent,
        rentFreeFrom,
        rentFreeTo,
        breakClause1,
        breakClause2,
        breakClause3,
        breakClause3Other,
        airConditioner,
        ventilator,
        oilVentilator,
        waterHeater,
        gasStove,
        lightings,
        refrigerator,
        washingMachine,
        bed,
        wardrobe,
        settee,
        otherFurniture,
        landLordId,
        landlordTel,
        tenantId,
        tenantTel,
        landlordBankAccount,
        bank,
        dateFrom,
        dateTo,
        remarksFields,
        language,
        t
      };
      
      const url = await generatePDF(params);
      
      if (url) {
        const link = document.createElement('a');
        link.href = url;
        link.download = "filled_tenancy_agreement.pdf";
        link.click();
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please check the console for details.');
    } finally {
      setIsLoading(false);
      resetFormValues();
    }
  };

  const handlePreview = async () => {
    try {
      setIsLoading(true);
      
      const params: PdfGenerationParams = {
        isPreview: true,
        inputDate2,
        inputText1,
        inputText2,
        inputText3,
        inputText4,
        inputText5,
        rentAmount,
        securityDeposit,
        propertyUse,
        managementFee,
        governmentRates,
        governmentRent,
        rentFreeFrom,
        rentFreeTo,
        breakClause1,
        breakClause2,
        breakClause3,
        breakClause3Other,
        airConditioner,
        ventilator,
        oilVentilator,
        waterHeater,
        gasStove,
        lightings,
        refrigerator,
        washingMachine,
        bed,
        wardrobe,
        settee,
        otherFurniture,
        landLordId,
        landlordTel,
        tenantId,
        tenantTel,
        landlordBankAccount,
        bank,
        dateFrom,
        dateTo,
        remarksFields,
        language,
        t,
        setImageLoading,
        setImageError,
        setImages
      };
      
      const url = await generatePDF(params);
      
      if (url) {
        setShowPreview(true);
      } else {
        throw new Error('Failed to generate PDF preview');
      }
    } catch (error) {
      console.error('Error generating PDF preview:', error);
      alert(t(language, 'pdfPreviewError') || 'Error generating PDF preview. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    // Show confirmation modal instead of immediately resetting
    setShowResetModal(true);
  };

  const confirmReset = () => {
    // Close the modal
    setShowResetModal(false);
    
    // Perform the reset
    resetFormValues();
    
    // // Show confirmation message
    // alert(t(language, 'resetConfirmation') || 'Form has been reset to default values.');
  };

  const cancelReset = () => {
    // Just close the modal without resetting
    setShowResetModal(false);
  };

  const handleAddRemark = () => {
    const newRemarksFields = [...remarksFields, ''];
    setRemarksFields(newRemarksFields);
    debouncedUpdate({ remarksFields: newRemarksFields });
  };

  const handleRemoveRemark = (index: number) => {
    const newRemarksFields = [...remarksFields];
    newRemarksFields.splice(index, 1);
    setRemarksFields(newRemarksFields);
    debouncedUpdate({ remarksFields: newRemarksFields });
  };

  const handleRedirectToCheckout = () => {
    // Save form values before redirecting
    const currentValues: PdfInputValues = {
      inputText1, inputText2, inputText3, inputText4, inputText5,
      rentAmount, securityDeposit, propertyUse, managementFee,
      governmentRates, governmentRent, rentFreeFrom, rentFreeTo,
      breakClause1, breakClause2, breakClause3, breakClause3Other,
      airConditioner, ventilator, oilVentilator, waterHeater,
      gasStove, lightings, refrigerator, washingMachine,
      bed, wardrobe, settee, otherFurniture,
      landLordId, landlordTel, tenantId, tenantTel,
      landlordBankAccount, bank, inputDate2, dateFrom, dateTo,
      remarksFields
    };
    
    // Save the current form state to localStorage
    updatePdfInputValues(currentValues);
    
    // Set state to trigger redirection
    setRedirectToCheckout(true);
  }

  // Add the redirect to checkout if the state is true
  if (redirectToCheckout) {
    return <Navigate to="/checkout" />;
  }

  const handleRedirectToReturn = () => {
    // Save form values before showing ad modal
    const currentValues: PdfInputValues = {
      inputText1, inputText2, inputText3, inputText4, inputText5,
      rentAmount, securityDeposit, propertyUse, managementFee,
      governmentRates, governmentRent, rentFreeFrom, rentFreeTo,
      breakClause1, breakClause2, breakClause3, breakClause3Other,
      airConditioner, ventilator, oilVentilator, waterHeater,
      gasStove, lightings, refrigerator, washingMachine,
      bed, wardrobe, settee, otherFurniture,
      landLordId, landlordTel, tenantId, tenantTel,
      landlordBankAccount, bank, inputDate2, dateFrom, dateTo,
      remarksFields
    };
    
    // Save the current form state to localStorage
    updatePdfInputValues(currentValues);
    
    // Show ad modal instead of generating PDF immediately
    setShowAdModal(true);
  }

  // Function to handle PDF generation after ad interaction
  const handleGeneratePDFAfterAd = async () => {
    try {
      setIsLoading(true);
      
      const params: PdfGenerationParams = {
        inputDate2,
        inputText1,
        inputText2,
        inputText3,
        inputText4,
        inputText5,
        rentAmount,
        securityDeposit,
        propertyUse,
        managementFee,
        governmentRates,
        governmentRent,
        rentFreeFrom,
        rentFreeTo,
        breakClause1,
        breakClause2,
        breakClause3,
        breakClause3Other,
        airConditioner,
        ventilator,
        oilVentilator,
        waterHeater,
        gasStove,
        lightings,
        refrigerator,
        washingMachine,
        bed,
        wardrobe,
        settee,
        otherFurniture,
        landLordId,
        landlordTel,
        tenantId,
        tenantTel,
        landlordBankAccount,
        bank,
        dateFrom,
        dateTo,
        remarksFields,
        language,
        t
      };
      
      const url = await generatePDF(params);
      
      if (url) {
        const link = document.createElement('a');
        link.href = url;
        link.download = "filled_tenancy_agreement.pdf";
        link.click();
        
        // Reset form after successful PDF generation
        resetFormValues();
        alert(t(language, 'pdfGeneratedAndReset') || 'PDF generated successfully. Form has been reset.');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert(t(language, 'pdfError') || 'Error generating PDF. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="pdf-generate-section">
      {/* Left Section */}
      <div className="left-section">
        {/* Google AdSense Section */}
        <AdSenseSection slot='2060948289'/>
        <PdfInputForm 
        formValues={{
          inputText1, inputText2, inputText3, inputText4, inputText5,
          rentAmount, securityDeposit, propertyUse, managementFee,
          governmentRates, governmentRent, rentFreeFrom, rentFreeTo,
          breakClause1, breakClause2, breakClause3, breakClause3Other,
          airConditioner, ventilator, oilVentilator, waterHeater,
          gasStove, lightings, refrigerator, washingMachine,
          bed, wardrobe, settee, otherFurniture,
          landLordId, landlordTel, tenantId, tenantTel,
          landlordBankAccount, bank, inputDate2, dateFrom, dateTo,
          remarksFields
        }}
        handleInputChange={handleInputChange}
        handleRemarkChange={handleRemarkChange}
        handleAddRemark={handleAddRemark}
        handleRemoveRemark={handleRemoveRemark}
        handleReset={handleReset}
        handlePreview={handlePreview}
        handleRedirectToCheckout={handleRedirectToCheckout}
        handleRedirectToReturn={handleRedirectToReturn}
        isLoading={isLoading}
        isFreeMode={isFreeMode}
        setters={{
          setInputText1, setInputText2, setInputText3, setInputText4, setInputText5,
          setRentAmount, setSecurityDeposit, setPropertyUse, setManagementFee,
          setGovernmentRates, setGovernmentRent, setRentFreeFrom, setRentFreeTo,
          setBreakClause1, setBreakClause2, setBreakClause3, setBreakClause3Other,
          setAirConditioner, setVentilator, setOilVentilator, setWaterHeater,
          setGasStove, setLightings, setRefrigerator, setWashingMachine,
          setBed, setWardrobe, setSettee, setOtherFurniture,
          setLandLordId, setLandlordTel, setTenantId, setTenantTel,
          setLandlordBankAccount, setBank, setInputDate2, setDateFrom, setDateTo
        }}
      />
      </div>
      {/* Right Section */}
      <div className="right-section">
        {showPreview ? (
          <div className="pdf-preview">
            {images.map((image, index) => (
              <div key={index} className="image-item">
                <h3>Page {index + 1}</h3>
                <img src={image} alt={`Page ${index + 1}`} />
              </div>
            ))}
          </div>
        ) : (
          <div className="preview-placeholder">
            <div className="placeholder-content">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="12" y1="18" x2="12" y2="12"></line>
                <line x1="9" y1="15" x2="15" y2="15"></line>
              </svg>
              <p>{t(language, 'previewPlaceholder')}</p>
            </div>
          </div>
        )}
      </div>
      {showScrollTop && (
        <button 
          className="scroll-to-top-btn"
          onClick={scrollToTop}
          aria-label={t(language, 'Scroll to top')}
        >
          ↑
        </button>
      )}
      
      <ConfirmationModal
        isOpen={showResetModal}
        title={t(language, 'resetConfirmationTitle') || 'Confirm Reset'}
        message={t(language, 'resetConfirmationMessage') || 'Are you sure you want to reset all form fields to their default values?'}
        confirmText={t(language, 'confirm') || 'Reset'}
        cancelText={t(language, 'cancel') || 'Cancel'}
        onConfirm={confirmReset}
        onCancel={cancelReset}
      />
      
      {/* Ad Interstitial Modal */}
      <AdInterstitialModal
        isOpen={showAdModal}
        onClose={() => setShowAdModal(false)}
        onContinue={handleGeneratePDFAfterAd}
        client="ca-pub-3940256099942544" // Use your Google AdSense client ID
        slot="7094024363" // Use your preferred ad slot
      />
    </div>
  );
};

export default PdfGenerateSection;
