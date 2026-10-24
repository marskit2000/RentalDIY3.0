import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../translations';
import { PdfInputValues } from '../utils/pdfGenerator';

interface PdfInputFormProps {
  formValues: PdfInputValues;
  handleInputChange: <T extends string | number | boolean | string[]>(
    fieldName: keyof PdfInputValues, 
    value: T, 
    setter: React.Dispatch<React.SetStateAction<T>>
  ) => void;
  handleRemarkChange: (index: number, value: string) => void;
  handleAddRemark: () => void;
  handleRemoveRemark: (index: number) => void;
  handleReset: () => void;
  handlePreview: () => void;
  handleRedirectToCheckout: () => void;
  handleRedirectToReturn: () => void;
  isLoading: boolean;
  isFreeMode: boolean;
  setters: {
    setInputText1: React.Dispatch<React.SetStateAction<string>>;
    setInputText2: React.Dispatch<React.SetStateAction<string>>;
    setInputText3: React.Dispatch<React.SetStateAction<string>>;
    setInputText4: React.Dispatch<React.SetStateAction<string>>;
    setInputText5: React.Dispatch<React.SetStateAction<string>>;
    setRentAmount: React.Dispatch<React.SetStateAction<string>>;
    setSecurityDeposit: React.Dispatch<React.SetStateAction<string>>;
    setPropertyUse: React.Dispatch<React.SetStateAction<string>>;
    setManagementFee: React.Dispatch<React.SetStateAction<string>>;
    setGovernmentRates: React.Dispatch<React.SetStateAction<string>>;
    setGovernmentRent: React.Dispatch<React.SetStateAction<string>>;
    setRentFreeFrom: React.Dispatch<React.SetStateAction<string>>;
    setRentFreeTo: React.Dispatch<React.SetStateAction<string>>;
    setBreakClause1: React.Dispatch<React.SetStateAction<string>>;
    setBreakClause2: React.Dispatch<React.SetStateAction<string>>;
    setBreakClause3: React.Dispatch<React.SetStateAction<string>>;
    setBreakClause3Other: React.Dispatch<React.SetStateAction<string>>;
    setAirConditioner: React.Dispatch<React.SetStateAction<string>>;
    setVentilator: React.Dispatch<React.SetStateAction<string>>;
    setOilVentilator: React.Dispatch<React.SetStateAction<string>>;
    setWaterHeater: React.Dispatch<React.SetStateAction<string>>;
    setGasStove: React.Dispatch<React.SetStateAction<string>>;
    setLightings: React.Dispatch<React.SetStateAction<string>>;
    setRefrigerator: React.Dispatch<React.SetStateAction<string>>;
    setWashingMachine: React.Dispatch<React.SetStateAction<string>>;
    setBed: React.Dispatch<React.SetStateAction<string>>;
    setWardrobe: React.Dispatch<React.SetStateAction<string>>;
    setSettee: React.Dispatch<React.SetStateAction<string>>;
    setOtherFurniture: React.Dispatch<React.SetStateAction<string>>;
    setLandLordId: React.Dispatch<React.SetStateAction<string>>;
    setLandlordTel: React.Dispatch<React.SetStateAction<string>>;
    setTenantId: React.Dispatch<React.SetStateAction<string>>;
    setTenantTel: React.Dispatch<React.SetStateAction<string>>;
    setLandlordBankAccount: React.Dispatch<React.SetStateAction<string>>;
    setBank: React.Dispatch<React.SetStateAction<string>>;
    setInputDate2: React.Dispatch<React.SetStateAction<string>>;
    setDateFrom: React.Dispatch<React.SetStateAction<string>>;
    setDateTo: React.Dispatch<React.SetStateAction<string>>;
  }
}

const PdfInputForm: React.FC<PdfInputFormProps> = ({
  formValues,
  handleInputChange,
  handleRemarkChange,
  handleAddRemark,
  handleRemoveRemark,
  handleReset,
  handlePreview,
  handleRedirectToCheckout,
  handleRedirectToReturn,
  isLoading,
  isFreeMode,
  setters
}) => {
  const { language } = useLanguage();
  
  const {
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
  } = formValues;

  const {
    setInputText1, setInputText2, setInputText3, setInputText4, setInputText5,
    setRentAmount, setSecurityDeposit, setPropertyUse, setManagementFee,
    setGovernmentRates, setGovernmentRent, setRentFreeFrom, setRentFreeTo,
    setBreakClause1, setBreakClause2, setBreakClause3, setBreakClause3Other,
    setAirConditioner, setVentilator, setOilVentilator, setWaterHeater,
    setGasStove, setLightings, setRefrigerator, setWashingMachine,
    setBed, setWardrobe, setSettee, setOtherFurniture,
    setLandLordId, setLandlordTel, setTenantId, setTenantTel,
    setLandlordBankAccount, setBank, setInputDate2, setDateFrom, setDateTo
  } = setters;

  return (
    <>
      <p className="input-group-heading">{t(language, 'Please fill in the following information:')}</p>
      <div className="input-group">
        <label htmlFor="pdf-date-2">{t(language, 'agreementDate')}</label>
        <input
          type="date"
          id="pdf-date-2"
          value={inputDate2}
          onChange={(e) => handleInputChange('inputDate2', e.target.value, setInputDate2)}
          placeholder={t(language, 'enterDate')}
        />
      </div>
      <div className="input-group">
        <label htmlFor="pdf-text-1">{t(language, 'propertyAddress')}</label>
        <input
          type="text"
          id="pdf-text-1"
          value={inputText1}
          onChange={(e) => handleInputChange('inputText1', e.target.value, setInputText1)}
          placeholder={t(language, 'enterPropertyAddress')}
        />
      </div>
      <div className="input-group">
        <label htmlFor="pdf-text-2">{t(language, 'landlord')}</label>
        <input
          type="text"
          id="pdf-text-2"
          value={inputText2}
          onChange={(e) => handleInputChange('inputText2', e.target.value, setInputText2)}
          placeholder={t(language, 'enterLandlordName')}
        />
      </div>
      <div className="input-group-row-container">
        <div className="input-group input-group-50">
          <label htmlFor="landlordTel">{t(language, 'landlordTel')}</label>
          <input
            type="text"
            id="landlordTel"
            value={landlordTel}
            onChange={(e) => handleInputChange('landlordTel', e.target.value, setLandlordTel)}
            placeholder={t(language, 'enterTel')}
          />
        </div>
        <div className="input-group input-group-50">
          <label htmlFor="landLordId">{t(language, 'landlordId')}</label>
          <input
            type="text"
            id="landLordId"
            value={landLordId}
            onChange={(e) => handleInputChange('landLordId', e.target.value, setLandLordId)}
            placeholder={t(language, 'enterID')}
          />
        </div>
      </div>
      <div className="input-group">
        <label htmlFor="pdf-text-3">{t(language, 'landlordAddress')}</label>
        <input
          type="text"
          id="pdf-text-3"
          value={inputText3}
          onChange={(e) => handleInputChange('inputText3', e.target.value, setInputText3)}
          placeholder={t(language, 'enterAddress')}
        />
      </div>
      <div className="input-group">
        <label htmlFor="pdf-text-4">{t(language, 'tenant')}</label>
        <input
          type="text"
          id="pdf-text-4"
          value={inputText4}
          onChange={(e) => handleInputChange('inputText4', e.target.value, setInputText4)}
          placeholder={t(language, 'enterTenantName')}
        />
      </div>
      <div className="input-group-row-container">
        <div className="input-group input-group-50">
          <label htmlFor="tenantTel">{t(language, 'tenantTel')}</label>
          <input
            type="text"
            id="tenantTel"
            value={tenantTel}
            onChange={(e) => handleInputChange('tenantTel', e.target.value, setTenantTel)}
            placeholder={t(language, 'enterTel')}
          />
        </div>
        <div className="input-group input-group-50">
          <label htmlFor="tenantId">{t(language, 'tenantId')}</label>
          <input
            type="text"
            id="tenantId"
            value={tenantId}
            onChange={(e) => handleInputChange('tenantId', e.target.value, setTenantId)}
            placeholder={t(language, 'enterID')}
          />
        </div>
      </div>
      
      <div className="input-group">
        <label htmlFor="pdf-text-5">{t(language, 'tenantAddress')}</label>
        <input
          type="text"
          id="pdf-text-5"
          value={inputText5}
          onChange={(e) => handleInputChange('inputText5', e.target.value, setInputText5)}
          placeholder={t(language, 'enterAddress')}
        />
      </div>
      <div className="date-range-group">
        <div className="input-group">
          <label htmlFor="date-from">{t(language, 'from')}</label>
          <input
            type="date"
            id="date-from"
            value={dateFrom}
            onChange={(e) => handleInputChange('dateFrom', e.target.value, setDateFrom)}
            placeholder={t(language, 'enterDate')}
          />
        </div>
        <div className="input-group">
          <label htmlFor="date-to">{t(language, 'to')}</label>
          <input
            type="date"
            id="date-to"
            value={dateTo}
            onChange={(e) => handleInputChange('dateTo', e.target.value, setDateTo)}
            placeholder={t(language, 'enterDate')}
          />
        </div>
      </div>
      <div className="input-group">
        <label htmlFor="rent-amount">{t(language, 'rentalAmount')}</label>
        <input
          type="number"
          id="rent-amount"
          value={rentAmount}
          onChange={(e) => handleInputChange('rentAmount', e.target.value, setRentAmount)}
          placeholder={t(language, 'enterAmount')}
          min="0"
          step="0.01"
        />
      </div>
      <div className="input-group">
        <label htmlFor="security-deposit">{t(language, 'depositAmount')}</label>
        <input
          type="number"
          id="security-deposit"
          value={securityDeposit}
          onChange={(e) => handleInputChange('securityDeposit', e.target.value, setSecurityDeposit)}
          placeholder={t(language, 'enterAmount')}
          min="0"
          step="0.01"
        />
      </div>
      <div className="input-group">
        <label htmlFor="property-use">{t(language, 'propertyUse')}</label>
        <select
          id="property-use"
          value={propertyUse}
          onChange={(e) => handleInputChange('propertyUse', e.target.value, setPropertyUse)}
        >
          <option value="residential">{t(language, 'residential')}</option>
          <option value="commercial">{t(language, 'commercial')}</option>
          <option value="office">{t(language, 'office')}</option>
          <option value="shop">{t(language, 'shop')}</option>
          <option value="industrial">{t(language, 'industrial')}</option>
        </select>
      </div>
      <div className="fee-row">
        <div className="input-group">
          <label htmlFor="management-fee">{t(language, 'managementFee')}</label>
          <select
            id="management-fee"
            value={managementFee}
            onChange={(e) => handleInputChange('managementFee', e.target.value, setManagementFee)}
          >
            <option value="landlord">{t(language, 'landlord')}</option>
            <option value="tenant">{t(language, 'tenant')}</option>
          </select>
        </div>
        <div className="input-group">
          <label htmlFor="government-rates">{t(language, 'governmentRates')}</label>
          <select
            id="government-rates"
            value={governmentRates}
            onChange={(e) => handleInputChange('governmentRates', e.target.value, setGovernmentRates)}
          >
            <option value="landlord">{t(language, 'landlord')}</option>
            <option value="tenant">{t(language, 'tenant')}</option>
          </select>
        </div>
        <div className="input-group">
          <label htmlFor="government-rent">{t(language, 'governmentRent')}</label>
          <select
            id="government-rent"
            value={governmentRent}
            onChange={(e) => handleInputChange('governmentRent', e.target.value, setGovernmentRent)}
          >
            <option value="landlord">{t(language, 'landlord')}</option>
            <option value="tenant">{t(language, 'tenant')}</option>
          </select>
        </div>
      </div>
      <div className="date-range-group">
        <div className="input-group">
          <label htmlFor="rent-free-from">{t(language, 'rentFreeFrom')}</label>
          <input
            type="date"
            id="rent-free-from"
            value={rentFreeFrom}
            onChange={(e) => handleInputChange('rentFreeFrom', e.target.value, setRentFreeFrom)}
            placeholder={t(language, 'enterDate')}
          />
        </div>
        <div className="input-group">
          <label htmlFor="rent-free-to">{t(language, 'rentFreeTo')}</label>
          <input
            type="date"
            id="rent-free-to"
            value={rentFreeTo}
            onChange={(e) => handleInputChange('rentFreeTo', e.target.value, setRentFreeTo)}
            placeholder={t(language, 'enterDate')}
          />
        </div>
      </div>
      <div className="break-clause-row">
        <div className="input-group">
          <label htmlFor="break-clause-1">{t(language, 'breakClause1')}</label>
          <select
            id="break-clause-1"
            value={breakClause1}
            onChange={(e) => handleInputChange('breakClause1', e.target.value, setBreakClause1)}
          >
            <option value="landlord">{t(language, 'landlord')}</option>
            <option value="tenant">{t(language, 'tenant')}</option>
            <option value="either">{t(language, 'either')}</option>
          </select>
        </div>
        <div className="input-group">
          <label htmlFor="break-clause-2">{t(language, 'breakClause2')}</label>
          <input
            type="number"
            id="break-clause-2"
            value={breakClause2}
            onChange={(e) => handleInputChange('breakClause2', e.target.value, setBreakClause2)}
            placeholder={t(language, 'enterNumber')}
            min="0"
            step="1"
          />
        </div>
        <div className="input-group break-clause-3-group">
          <label htmlFor="break-clause-3">{t(language, 'breakClause3')}</label>
          <div className="break-clause-3-inputs">
            <select
              id="break-clause-3"
              value={breakClause3}
              onChange={(e) => handleInputChange('breakClause3', e.target.value, setBreakClause3)}
            >
              <option value="12">12</option>
              <option value="14">14</option>
              <option value="other">{t(language, 'other')}</option>
            </select>
            {breakClause3 === 'other' && (
              <input
                type="number"
                id="break-clause-3-other"
                value={breakClause3Other}
                onChange={(e) => handleInputChange('breakClause3Other', e.target.value, setBreakClause3Other)}
                placeholder={t(language, 'enterNumber')}
                min="0"
                step="1"
              />
            )}
          </div>
        </div>
      </div>
      <div className="furniture-row">
        <div className="input-group">
          <label htmlFor="air-conditioner">{t(language, 'airConditioner')}</label>
          <input
            type="text"
            id="air-conditioner"
            value={airConditioner}
            onChange={(e) => handleInputChange('airConditioner', e.target.value, setAirConditioner)}
            placeholder={t(language, 'enterQuantity')}
          />
        </div>
        <div className="input-group">
          <label htmlFor="ventilator">{t(language, 'ventilator')}</label>
          <input
            type="text"
            id="ventilator"
            value={ventilator}
            onChange={(e) => handleInputChange('ventilator', e.target.value, setVentilator)}
            placeholder={t(language, 'enterQuantity')}
          />
        </div>
        <div className="input-group">
          <label htmlFor="oil-ventilator">{t(language, 'oilVentilator')}</label>
          <input
            type="text"
            id="oil-ventilator"
            value={oilVentilator}
            onChange={(e) => handleInputChange('oilVentilator', e.target.value, setOilVentilator)}
            placeholder={t(language, 'enterQuantity')}
          />
        </div>
        <div className="input-group">
          <label htmlFor="water-heater">{t(language, 'waterHeater')}</label>
          <input
            type="text"
            id="water-heater"
            value={waterHeater}
            onChange={(e) => handleInputChange('waterHeater', e.target.value, setWaterHeater)}
            placeholder={t(language, 'enterQuantity')}
          />
        </div>
      </div>
      <div className="furniture-row">
        <div className="input-group">
          <label htmlFor="gas-stove">{t(language, 'gasStove')}</label>
          <input
            type="text"
            id="gas-stove"
            value={gasStove}
            onChange={(e) => handleInputChange('gasStove', e.target.value, setGasStove)}
            placeholder={t(language, 'enterQuantity')}
          />
        </div>
        <div className="input-group">
          <label htmlFor="lightings">{t(language, 'lightings')}</label>
          <input
            type="text"
            id="lightings"
            value={lightings}
            onChange={(e) => handleInputChange('lightings', e.target.value, setLightings)}
            placeholder={t(language, 'enterQuantity')}
          />
        </div>
        <div className="input-group">
          <label htmlFor="refrigerator">{t(language, 'refrigerator')}</label>
          <input
            type="text"
            id="refrigerator"
            value={refrigerator}
            onChange={(e) => handleInputChange('refrigerator', e.target.value, setRefrigerator)}
            placeholder={t(language, 'enterQuantity')}
          />
        </div>
        <div className="input-group">
          <label htmlFor="washing-machine">{t(language, 'washingMachine')}</label>
          <input
            type="text"
            id="washing-machine"
            value={washingMachine}
            onChange={(e) => handleInputChange('washingMachine', e.target.value, setWashingMachine)}
            placeholder={t(language, 'enterQuantity')}
          />
        </div>
      </div>
      <div className="furniture-row">
        <div className="input-group">
          <label htmlFor="bed">{t(language, 'bed')}</label>
          <input
            type="text"
            id="bed"
            value={bed}
            onChange={(e) => handleInputChange('bed', e.target.value, setBed)}
            placeholder={t(language, 'enterQuantity')}
          />
        </div>
        <div className="input-group">
          <label htmlFor="wardrobe">{t(language, 'wardrobe')}</label>
          <input
            type="text"
            id="wardrobe"
            value={wardrobe}
            onChange={(e) => handleInputChange('wardrobe', e.target.value, setWardrobe)}
            placeholder={t(language, 'enterQuantity')}
          />
        </div>
        <div className="input-group">
          <label htmlFor="settee">{t(language, 'settee')}</label>
          <input
            type="text"
            id="settee"
            value={settee}
            onChange={(e) => handleInputChange('settee', e.target.value, setSettee)}
            placeholder={t(language, 'enterQuantity')}
          />
        </div>
        <div className="input-group">
          <label htmlFor="other-furniture">{t(language, 'otherFurniture')}</label>
          <input
            type="text"
            id="other-furniture"
            value={otherFurniture}
            onChange={(e) => handleInputChange('otherFurniture', e.target.value, setOtherFurniture)}
            placeholder={t(language, 'enterOtherFixtures')}
          />
        </div>
      </div>
      <div className="bank-row">
        <div className="input-group">
          <label htmlFor="landlord-bank-account">{t(language, 'landlordBankAccount')}</label>
          <input
            type="text"
            id="landlord-bank-account"
            value={landlordBankAccount}
            onChange={(e) => handleInputChange('landlordBankAccount', e.target.value, setLandlordBankAccount)}
            placeholder={t(language, 'enterAccountNumber')}
          />
        </div>
        <div className="input-group">
          <label htmlFor="bank">{t(language, 'bank')}</label>
          <input
            type="text"
            id="bank"
            value={bank}
            onChange={(e) => handleInputChange('bank', e.target.value, setBank)}
            placeholder={t(language, 'enterBank')}
          />
        </div>
      </div>
      <div className="remarks-group">
        <label>{t(language, 'remarks')}</label>
        {remarksFields.map((remark, index) => (
          <div key={index} className="remark-input-group">
            <textarea
              value={remark}
              onChange={(e) => handleRemarkChange(index, e.target.value)}
              placeholder={t(language, 'enterRemarks')}
              rows={3}
            />
            {index > 0 && (
              <button
                className="remove-remark-btn"
                onClick={() => handleRemoveRemark(index)}
              >
                ×
              </button>
            )}
          </div>
        ))}
        <button
          className="add-remark-btn"
          onClick={handleAddRemark}
        >
          +
        </button>
      </div>
      <div className="controls">
        <button 
          className="reset-btn" 
          onClick={handleReset}
          onTouchStart={(e) => {
            // Prevent default to avoid any delay
            e.preventDefault();
            handleReset();
          }}
        >
          {t(language, 'reset') || 'Reset Form'}
        </button>
        <div className="button-group-right">
          <button 
            className="generate-btn" 
            onClick={isFreeMode ? handleRedirectToReturn : handleRedirectToCheckout}
            onTouchStart={(e) => {
              // Prevent default to avoid any delay
              e.preventDefault();
              isFreeMode ? handleRedirectToReturn() : handleRedirectToCheckout(); 
            }}
            // disabled={isLoading}
          >
            {(t(language, 'generatePDF') || 'Generate PDF')}
          </button>
          <button 
            className="preview-btn"
            onClick={handlePreview}
            onTouchStart={(e) => {
              if (isLoading) return;
              // Prevent default to avoid any delay
              e.preventDefault();
              handlePreview();
            }}
            disabled={isLoading}
          >
            {t(language, 'preview') || 'Preview'}
          </button>
        </div>
      </div>
    </>
  );
};

export default PdfInputForm;
