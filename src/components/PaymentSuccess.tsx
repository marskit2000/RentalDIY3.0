import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FaCheckCircle, FaDownload, FaHome } from 'react-icons/fa'
import './PaymentSuccess.css'
import { useLanguage } from '../contexts/LanguageContext'
import { t } from '../translations'
import { 
  generatePDF, 
  PdfGenerationParams, 
  loadPdfInputValues
} from '../utils/pdfGenerator'

const PaymentSuccess = ({ email }: { email: string }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { language } = useLanguage()
  const [isLoading, setIsLoading] = useState(false)
  const [transactionId, setTransactionId] = useState('')

  //TODO: send the PDF to the email address
  console.log('Email:', email)
  
  useEffect(() => {
    transactionIdGeneration()
  }, [])

  const transactionIdGeneration = () => {
    // Generate a realistic transaction ID when component mounts
    const timestamp = new Date().getTime().toString()
    const randomPart = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    const generatedId = `RA-${timestamp.slice(-6)}-${randomPart}`
    setTransactionId(generatedId)
    
    // You could also get the transaction ID from URL params if passed from payment processor
    const params = new URLSearchParams(location.search)
    const urlTransactionId = params.get('transactionId')
    if (urlTransactionId) {
      setTransactionId(urlTransactionId)
    }
  }


  const handleDownload = async () => {
    try {
      setIsLoading(true)
      console.log('Generating rental agreement PDF...')
      
      // Load saved values from localStorage
      const savedValues = loadPdfInputValues()
      
      // Create params object for PDF generation
      const params: PdfGenerationParams = {
        inputDate2: savedValues.inputDate2,
        inputText1: savedValues.inputText1,
        inputText2: savedValues.inputText2,
        inputText3: savedValues.inputText3,
        inputText4: savedValues.inputText4,
        inputText5: savedValues.inputText5,
        rentAmount: savedValues.rentAmount,
        securityDeposit: savedValues.securityDeposit,
        propertyUse: savedValues.propertyUse,
        managementFee: savedValues.managementFee,
        governmentRates: savedValues.governmentRates,
        governmentRent: savedValues.governmentRent,
        rentFreeFrom: savedValues.rentFreeFrom,
        rentFreeTo: savedValues.rentFreeTo,
        breakClause1: savedValues.breakClause1,
        breakClause2: savedValues.breakClause2,
        breakClause3: savedValues.breakClause3,
        breakClause3Other: savedValues.breakClause3Other,
        airConditioner: savedValues.airConditioner,
        ventilator: savedValues.ventilator,
        oilVentilator: savedValues.oilVentilator,
        waterHeater: savedValues.waterHeater,
        gasStove: savedValues.gasStove,
        lightings: savedValues.lightings,
        refrigerator: savedValues.refrigerator,
        washingMachine: savedValues.washingMachine,
        bed: savedValues.bed,
        wardrobe: savedValues.wardrobe,
        settee: savedValues.settee,
        otherFurniture: savedValues.otherFurniture,
        landLordId: savedValues.landLordId,
        landlordTel: savedValues.landlordTel,
        tenantId: savedValues.tenantId,
        tenantTel: savedValues.tenantTel,
        landlordBankAccount: savedValues.landlordBankAccount,
        bank: savedValues.bank,
        dateFrom: savedValues.dateFrom,
        dateTo: savedValues.dateTo,
        remarksFields: savedValues.remarksFields,
        language,
        t
      }
      
      // Generate the PDF
      const url = await generatePDF(params)
      
      if (url) {
        // Create a link element and trigger download
        const link = document.createElement('a')
        link.href = url
        link.download = "filled_tenancy_agreement.pdf"
        link.click()
      } else {
        console.error('Failed to generate PDF: URL is null')
        alert('Failed to generate PDF. Please try again.')
      }
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Error generating PDF. Please check the console for details.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReturnHome = () => {
    navigate('/')
  }

  return (
    <div className="payment-success-container">
      <div className="payment-success-card">
        <div className="success-icon">
          <FaCheckCircle />
        </div>
        <h1>{t(language, 'paymentSuccessful') || 'Payment Successful!'}</h1>
        <p>{t(language, 'paymentThankYou') || 'Thank you for your payment. Your rental agreement has been processed successfully.'}</p>
        
        <div className="payment-details">
          <h2>{t(language, 'transactionDetails') || 'Transaction Details'}</h2>
          <div className="detail-row">
            <span>{t(language, 'transactionId') || 'Transaction ID'}:</span>
            <span>{transactionId}</span>
          </div>
          <div className="detail-row">
            <span>{t(language, 'date') || 'Date'}:</span>
            <span>{new Date().toLocaleDateString(language === 'zh-TW' ? 'zh-HK' : undefined)}</span>
          </div>
        </div>

        <div className="action-buttons">
          <button 
            className="download-btn" 
            onClick={handleDownload} 
            disabled={isLoading}
          >
            <FaDownload /> {isLoading ? (t(language, 'generating') || 'Generating...') : (t(language, 'downloadRentalAgreement') || 'Download Rental Agreement')}
          </button>
          <button className="home-btn" onClick={handleReturnHome}>
            <FaHome /> {t(language, 'returnToHome') || 'Return to Home'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PaymentSuccess