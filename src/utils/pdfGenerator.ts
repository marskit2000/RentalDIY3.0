import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { convertToImage } from '../convertToImage';
import { 
  addWatermark, 
  getMonthInEnglish, 
  getDayWithOrdinal, 
  getMonthNumber, 
  getDateNumber,
  getYear,
  formatDate,
  toChinese,
  toChineseWithUnits,
  hasChinese,
  joinRemarks
} from './pdfHelpers';
import { Language } from '../contexts/LanguageContext';

export interface PdfGenerationParams {
  isPreview?: boolean;
  inputDate2: string;
  inputText1: string;
  inputText2: string;
  inputText3: string;
  inputText4: string;
  inputText5: string;
  rentAmount: string;
  securityDeposit: string;
  propertyUse: string;
  managementFee: string;
  governmentRates: string;
  governmentRent: string;
  rentFreeFrom: string;
  rentFreeTo: string;
  breakClause1: string;
  breakClause2: string;
  breakClause3: string;
  breakClause3Other: string;
  airConditioner: string;
  ventilator: string;
  oilVentilator: string;
  waterHeater: string;
  gasStove: string;
  lightings: string;
  refrigerator: string;
  washingMachine: string;
  bed: string;
  wardrobe: string;
  settee: string;
  otherFurniture: string;
  landLordId: string;
  landlordTel: string;
  tenantId: string;
  tenantTel: string;
  landlordBankAccount: string;
  bank: string;
  dateFrom: string;
  dateTo: string;
  remarksFields: string[];
  language: Language;
  t: (language: Language, key: string) => string;
  setImageLoading?: (loading: boolean) => void;
  setImageError?: (error: string | null) => void;
  setImages?: (images: string[]) => void;
}

// Type for input values (excluding function props)
export type PdfInputValues = Omit<PdfGenerationParams, 't' | 'setImageLoading' | 'setImageError' | 'setImages' | 'language' | 'isPreview'>;

// Session storage key
const PDF_INPUT_VALUES_KEY = 'pdfInputValues';

/**
 * Default values for PDF generation input fields
 */
export const defaultPdfInputValues: PdfInputValues = {
  inputDate2: '',
  inputText1: '',
  inputText2: '',
  inputText3: '',
  inputText4: '',
  inputText5: '',
  rentAmount: '',
  securityDeposit: '',
  propertyUse: 'residential',
  managementFee: 'landlord',
  governmentRates: 'landlord',
  governmentRent: 'landlord',
  rentFreeFrom: '',
  rentFreeTo: '',
  breakClause1: 'landlord',
  breakClause2: '',
  breakClause3: '12',
  breakClause3Other: '',
  airConditioner: '',
  ventilator: '',
  oilVentilator: '',
  waterHeater: '',
  gasStove: '',
  lightings: '',
  refrigerator: '',
  washingMachine: '',
  bed: '',
  wardrobe: '',
  settee: '',
  otherFurniture: '',
  landLordId: '',
  landlordTel: '',
  tenantId: '',
  tenantTel: '',
  landlordBankAccount: '',
  bank: '',
  dateFrom: '',
  dateTo: '',
  remarksFields: ['']
};

/**
 * Load saved PDF input values from localStorage
 * @returns PdfInputValues object from localStorage or default values if none exist
 */
export const loadPdfInputValues = (): PdfInputValues => {
  if (typeof window === 'undefined') {
    return defaultPdfInputValues;
  }
  
  const savedValues = localStorage.getItem(PDF_INPUT_VALUES_KEY);
  if (!savedValues) {
    return defaultPdfInputValues;
  }
  
  try {
    return JSON.parse(savedValues) as PdfInputValues;
  } catch (error) {
    console.error('Error parsing PDF input values from session storage:', error);
    return defaultPdfInputValues;
  }
};

/**
 * Update PDF input values and save to localStorage
 * @param newValues Partial PdfInputValues object with values to update
 * @returns Updated PdfInputValues object
 */
export const updatePdfInputValues = (newValues: Partial<PdfInputValues>): PdfInputValues => {
  if (typeof window === 'undefined') {
    return defaultPdfInputValues;
  }
  
  const currentValues = loadPdfInputValues();
  const updatedValues = { ...currentValues, ...newValues };
  
  try {
    localStorage.setItem(PDF_INPUT_VALUES_KEY, JSON.stringify(updatedValues));
    return updatedValues;
  } catch (error) {
    console.error('Error saving PDF input values to session storage:', error);
    return updatedValues;
  }
};

/**
 * Reset PDF input values to defaults and clear from session storage
 * @returns Default PdfInputValues object
 */
export const resetPdfInputValues = (): PdfInputValues => {
  if (typeof window === 'undefined') {
    return defaultPdfInputValues;
  }
  
  try {
    localStorage.removeItem(PDF_INPUT_VALUES_KEY);
    return defaultPdfInputValues;
  } catch (error) {
    console.error('Error resetting PDF input values in session storage:', error);
    return defaultPdfInputValues;
  }
};

export const generatePDF = async (params: PdfGenerationParams) => {
  const {
    isPreview = false,
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
  } = params;

  try {
    const response = await fetch('/src/assets/Tenancy_Agreement_Template_20250311.pdf');
    const pdfBuffer = await response.arrayBuffer();
    
    const pdfDoc = await PDFDocument.load(pdfBuffer);

    // Fonts
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
    pdfDoc.registerFontkit(fontkit)
    const defaultFontBuffer = await fetch(
      '/src/assets/fonts/NotoSansTC-Regular.ttf',
    ).then(res => res.arrayBuffer());
    const chineseFont = await pdfDoc.embedFont(defaultFontBuffer);

    const pages = pdfDoc.getPages();
    const { height } = pages[0].getSize()

    const fontColor = rgb(0, 0, 0);
    const lineColor = rgb(0, 0, 0);
    
    // Add SAMPLE watermark to all pages
    if(isPreview) {
      const warnText = t(language, 'previewWarning');
      pages.forEach(page => {
        addWatermark(page, 'PREVIEW', warnText, helveticaFont, {
          size: 120,
          opacity: 0.15,
          angle: -45,
        });
      });
    }
    
    // Add date information if date is provided
    if (inputDate2.trim()) {
      // Original displays (day with ordinal and month, year)
      const monthInEnglish = getMonthInEnglish(inputDate2);
      pages[0].drawText(monthInEnglish, {
        x: 260,
        y: height - 128,
        size: 14,
        font: helveticaFont,
        color: fontColor,
      });

      const dayWithOrdinal = getDayWithOrdinal(inputDate2);
      pages[0].drawText(dayWithOrdinal, {
        x: 168,
        y: height - 128,
        size: 14,
        font: helveticaFont,
        color: fontColor,
      });

      // New displays
      // Date at top left
      const dateNumber = getDateNumber(inputDate2);
      pages[0].drawText(dateNumber, {
        x: 394,
        y: height - 156,
        size: 14,
        font: helveticaFont,
        color: fontColor,
      });

      // Month number at top right
      const monthNumber = getMonthNumber(inputDate2);
      pages[0].drawText(monthNumber, {
        x: 353,
        y: height - 156,
        size: 14,
        font: helveticaFont,
        color: fontColor,
      });

      // Year at bottom left
      const year = getYear(inputDate2);
      pages[0].drawText(year, {
        x: 293,
        y: height - 156,
        size: 14,
        font: helveticaFont,
        color: fontColor,
      });
    }

    // Add user input text 1: The Premises
    if (inputText1.trim()) {
      pages[3].drawText(inputText1, {
        x: 128,
        y: height - 96,
        size: 14,
        font: chineseFont,
        color: fontColor,
      });
    }

    // Add user input text 2: The Landlord
    if (inputText2.trim()) {
      pages[3].drawText(inputText2, {
        x: 128,
        y: height - 132,
        size: 14,
        font: chineseFont,
        color: fontColor,
      });
    }

    // Add landlord ID
    if (landLordId.trim()) {
      pages[1].drawText(landLordId, {
        x: 428,
        y: height - 792,
        size: 12,
        font: helveticaFont,
        color: fontColor,
      });
    }

    // Add landlord Tel
    if (landlordTel.trim()) {
      pages[3].drawText(landlordTel, {
        x: 470,
        y: height - 160,
        size: 12,
        font: helveticaFont,
        color: fontColor,
      });
    }

    // Add user input text 3: Landlord Address
    if (inputText3.trim()) {
      pages[3].drawText(inputText3, {
        x: 128,
        y: height - 160,
        size: 14,
        font: chineseFont,
        color: fontColor,
      });
    }

    // Add user input text 4: The Tenant
    if (inputText4.trim()) {
      pages[3].drawText(inputText4, {
        x: 128,
        y: height - 192,
        size: 14,
        font: chineseFont,
        color: fontColor,
      });
    }

    // Add tenant ID
    if (tenantId.trim()) {
      pages[1].drawText(tenantId, {
        x: 160,
        y: height - 792,
        size: 12,
        font: helveticaFont,
        color: fontColor,
      });
    }

    // Add tenant Tel
    if (tenantTel.trim()) {
      pages[3].drawText(tenantTel, {
        x: 470,
        y: height - 220,
        size: 12,
        font: helveticaFont,
        color: fontColor,
      });
    }

    // Add user input text 5: Tenant Address
    if (inputText5.trim()) {
      pages[3].drawText(inputText5, {
        x: 128,
        y: height - 220,
        size: 14,
        font: chineseFont,
        color: fontColor,
      });
    }

    // Add date range of the Term at the top of page 3
    if (dateFrom) {
      // Display full date in DD/MM/YYYY format
      pages[3].drawText(formatDate(dateFrom), {
        x: 170,
        y: height - 242,
        size: 12,
        font: helveticaFont,
        color: fontColor,
      });

      // Add date components
      const fromDate = new Date(dateFrom);
      const fromDay = String(fromDate.getDate()).padStart(2, '0');
      const fromMonth = String(fromDate.getMonth() + 1).padStart(2, '0');
      const fromYear = String(fromDate.getFullYear());

      // Day
      pages[3].drawText(fromDay, {
        x: 248,
        y: height - 257,
        size: 12,
        font: helveticaFont,
        color: fontColor,
      });

      // Month
      pages[3].drawText(fromMonth, {
        x: 208,
        y: height - 257,
        size: 12,
        font: helveticaFont,
        color: fontColor,
      });

      // Year
      pages[3].drawText(fromYear, {
        x: 148,
        y: height - 257,
        size: 12,
        font: helveticaFont,
        color: fontColor,
      });
    }
    
    if (dateTo) {
      // Display full date in DD/MM/YYYY format
      pages[3].drawText(formatDate(dateTo), {
        x: 310,
        y: height - 242,
        size: 12,
        font: helveticaFont,
        color: fontColor,
      });

      // Add date components
      const toDate = new Date(dateTo);
      const toDay = String(toDate.getDate()).padStart(2, '0');
      const toMonth = String(toDate.getMonth() + 1).padStart(2, '0');
      const toYear = String(toDate.getFullYear());

      // Day
      pages[3].drawText(toDay, {
        x: 404,
        y: height - 257,
        size: 12,
        font: helveticaFont,
        color: fontColor,
      });

      // Month
      pages[3].drawText(toMonth, {
        x: 366,
        y: height - 257,
        size: 12,
        font: helveticaFont,
        color: fontColor,
      });

      // Year
      pages[3].drawText(toYear, {
        x: 308,
        y: height - 257,
        size: 12,
        font: helveticaFont,
        color: fontColor,
      });
    }

    // Add rent amount
    if (rentAmount) {
      // Display at original position
      pages[3].drawText(rentAmount + " -", {
        x: 160,
        y: height - 278,
        size: 12,
        font: helveticaFont,
        color: fontColor,
      });

      // Display Chinese
      const amount = Number(rentAmount);
      pages[3].drawText(toChineseWithUnits(amount, 'zh-TW')+"元正", {
        x: 186,
        y: height - 293,
        size: 12,
        font: chineseFont,
        color: fontColor,
      });
    }

    // Add security deposit amount
    if (securityDeposit) {
      // Display at page 3
      pages[3].drawText(securityDeposit + " -", {
        x: 160,
        y: height - 323,
        size: 12,
        font: helveticaFont,
        color: fontColor,
      });

      //Display at page 1
      pages[1].drawText(securityDeposit + " -", {
        x: 80,
        y: height - 551,
        size: 12,
        font: helveticaFont,
        color: fontColor,
      });

      // Display Chinese
      const depositAmount = Number(securityDeposit);
      const singlePlace = depositAmount%10;
      const tenPlace = ((Math.floor(depositAmount / 10) * 10)%100)/10;
      const hundredPlace = ((Math.floor(depositAmount / 100) * 100)%1000)/100;
      const thousandPlace = ((Math.floor(depositAmount / 1000) * 1000)%10000)/1000;
      const tenThousandPlace = (Math.floor(depositAmount / 10000) * 10000)/10000;
      
      // Display at page 3
      // Display 10
      pages[3].drawText(toChinese(tenPlace), {
        x: 288,
        y: height - 335,
        size: 10,
        font: chineseFont,
        color: fontColor,
      });

      // Display 100
      pages[3].drawText(toChinese(hundredPlace), {
        x: 248,
        y: height - 335,
        size: 10,
        font: chineseFont,
        color: fontColor,
      });

      // Display 1000
      pages[3].drawText(toChinese(thousandPlace), {
        x: 206,
        y: height - 335,
        size: 10,
        font: chineseFont,
        color: fontColor,
      });

      // Display 10000
      pages[3].drawText(toChineseWithUnits(tenThousandPlace), {
        x: 151,
        y: height - 335,
        size: 10,
        font: chineseFont,
        color: fontColor,
      });

      // Display at page 1
      const heightAdjustmentPage1 = 587;
      // Display 1
      pages[1].drawText(toChinese(singlePlace), {
        x: 178,
        y: height - heightAdjustmentPage1,
        size: 10,
        font: chineseFont,
        color: fontColor,
      });
      // Display 10
      pages[1].drawText(toChinese(tenPlace), {
        x: 148,
        y: height - heightAdjustmentPage1,
        size: 10,
        font: chineseFont,
        color: fontColor,
      });

      // Display 100
      pages[1].drawText(toChinese(hundredPlace), {
        x: 118,
        y: height - heightAdjustmentPage1,
        size: 10,
        font: chineseFont,
        color: fontColor,
      });

      // Display 1000
      pages[1].drawText(toChinese(thousandPlace), {
        x: 89,
        y: height - heightAdjustmentPage1,
        size: 10,
        font: chineseFont,
        color: fontColor,
      });

      // Display 10000
      pages[1].drawText(toChineseWithUnits(tenThousandPlace), {
        x: 59,
        y: height - heightAdjustmentPage1,
        size: 10,
        font: chineseFont,
        color: fontColor,
      });
    }

    // Add property use
    if (propertyUse) {
      // Display property use at top right of page 3
      pages[3].drawText(propertyUse, {
        x: 62,
        y: height - 448,
        size: 12,
        font: helveticaFont,
        color: fontColor,
      });

      // Display Chinese
      let propertyUseChinese = "";
      if (propertyUse === "residential") {
        propertyUseChinese = "住宅";
      } else if (propertyUse === "commercial") {
        propertyUseChinese = "商業";
      } else if (propertyUse === "office") {
        propertyUseChinese = "辦公室";
      } else if (propertyUse === "shop") {
        propertyUseChinese = "商店";
      } else if (propertyUse === "industrial") { 
        propertyUseChinese = "工業";
      }

      pages[3].drawText(propertyUseChinese, {
        x: 146,
        y: height - 476,
        size: 12,
        font: chineseFont,
        color: fontColor,
      });
    }

    // Add management fee indicator
    const managementFeeY = height - 566;
    const managementFeeYChinese = height - 595;
    if (managementFee === 'landlord') {
      //Draw red line at English position
      pages[3].drawLine({
        start: { x: 236, y: managementFeeY },
        end: { x: 278, y: managementFeeY },
        thickness: 1,
        color: lineColor,
      })
      // Draw red line at Chinese position
      pages[3].drawLine({
        start: { x: 142, y: managementFeeYChinese },
        end: { x: 164, y: managementFeeYChinese },
        thickness: 1,
        color: lineColor,
      });
    } else if (managementFee === 'tenant') {
      //Draw red line at English position
      pages[3].drawLine({
        start: { x: 186, y: managementFeeY },
        end: { x: 230, y: managementFeeY },
        thickness: 1,
        color: lineColor,
      })

      // Draw red line at Chinese position
      pages[3].drawLine({
        start: { x: 112, y: managementFeeYChinese },
        end: { x: 134, y: managementFeeYChinese },
        thickness: 1,
        color: lineColor,
      });
    }

    // Add government rates indicator
    const governmentRatesY = height - 619;
    const governmentRatesYChinese = height - 633;
    if (governmentRates === 'landlord') {
      // Draw red line at English position
      pages[3].drawLine({
        start: { x: 246, y: governmentRatesY },
        end: { x: 284, y: governmentRatesY },
        thickness: 1,
        color: lineColor,
      })
      // Draw red line at Chinese position
      pages[3].drawLine({
        start: { x: 130, y: governmentRatesYChinese },
        end: { x: 154, y: governmentRatesYChinese },
        thickness: 1,
        color: lineColor,
      });
    } else if (governmentRates === 'tenant') {
      // Draw red line at English position
      pages[3].drawLine({
        start: { x: 194, y: governmentRatesY },
        end: { x: 242, y: governmentRatesY },
        thickness: 1,
        color: lineColor,
      })
      // Draw red line at Chinese position (top left + 25px)
      pages[3].drawLine({
        start: { x: 100, y: governmentRatesYChinese },
        end: { x: 122, y: governmentRatesYChinese },
        thickness: 1,
        color: lineColor,
      });
    }

    // Add government rent indicator
    const governmentRentY = height - 655;
    const governmentRentYChinese = height - 667;
    if (governmentRent === 'landlord') {
      // Draw red line at English position
      pages[3].drawLine({
        start: { x: 242, y: governmentRentY },
        end: { x: 278, y: governmentRentY },
        thickness: 1,
        color: lineColor,
      })
      // Draw red line at Chinese position
      pages[3].drawLine({
        start: { x: 130, y: governmentRentYChinese },
        end: { x: 154, y: governmentRentYChinese },
        thickness: 1,
        color: lineColor,
      });
    } else if (governmentRent === 'tenant') {
      // Draw red line at English position
      pages[3].drawLine({
        start: { x: 189, y: governmentRentY },
        end: { x: 235, y: governmentRentY },
        thickness: 1,
        color: lineColor,
      })
      // Draw red line at Chinese position (top left + 25px)
      pages[3].drawLine({
        start: { x: 100, y: governmentRentYChinese },
        end: { x: 122, y: governmentRentYChinese },
        thickness: 1,
        color: lineColor,
      });
    }

    // Add rent free period dates
    if (rentFreeFrom) {
      pages[3].drawText(formatDate(rentFreeFrom), {
        x: 340,
        y: height - 741,
        size: 12,
        font: helveticaFont,
        color: fontColor,
      });

      pages[3].drawText(formatDate(rentFreeFrom), {
        x: 202,
        y: height - 800,
        size: 12,
        font: helveticaFont,
        color: fontColor,
      });
    }

    if (rentFreeTo) {
      pages[3].drawText(formatDate(rentFreeTo), {
        x: 480,
        y: height - 741,
        size: 12,
        font: helveticaFont,
        color: fontColor,
      });

      pages[3].drawText(formatDate(rentFreeTo), {
        x: 288,
        y: height - 800,
        size: 12,
        font: helveticaFont,
        color: fontColor,
      });
    }

    // Calculate date difference if both dates are available
    if (rentFreeFrom && rentFreeTo) {
      const fromDate = new Date(rentFreeFrom);
      const toDate = new Date(rentFreeTo);
      const diffTime = toDate.getTime() - fromDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const diffDaysInclusive = diffDays + 1;
      pages[3].drawText(diffDaysInclusive.toString(), {
        x: 106,
        y: height - 800,
        size: 12,
        font: helveticaFont,
        color: fontColor,
      });
    }

    // Add Break Clause 1 indicator
    if (breakClause1 === 'landlord') {
      // Draw red line zone1
      pages[4].drawLine({
        start: { x: 434, y: height - 64 },
        end: { x: 532, y: height - 64 },
        thickness: 1,
        color: lineColor,
      });
      // Draw red line zone2
      pages[4].drawLine({
        start: { x: 345, y: height - 94 },
        end: { x: 390, y: height - 94 },
        thickness: 1,
        color: lineColor,
      });
      pages[4].drawLine({
        start: { x: 428, y: height - 94 },
        end: { x: 485, y: height - 94 },
        thickness: 1,
        color: lineColor,
      });
      // Draw red line zone3
      pages[4].drawLine({
        start: { x: 152, y: height - 137 },
        end: { x: 237, y: height - 137 },
        thickness: 1,
        color: lineColor,
      });
      // Draw red line zone4
      pages[4].drawLine({
        start: { x: 267, y: height - 137 },
        end: { x: 294, y: height - 137 },
        thickness: 1,
        color: lineColor,
      });
      pages[4].drawLine({
        start: { x: 334, y: height - 137 },
        end: { x: 364, y: height - 137 },
        thickness: 1,
        color: lineColor,
      });
    } else if (breakClause1 === 'tenant') {
      // Draw red line zone1
      pages[4].drawLine({
        start: { x: 387, y: height - 64 },
        end: { x: 434, y: height - 64 },
        thickness: 1,
        color: lineColor,
      });
      pages[4].drawLine({
        start: { x: 470, y: height - 64 },
        end: { x: 532, y: height - 64 },
        thickness: 1,
        color: lineColor,
      });
      // Draw red line zone2
      pages[4].drawLine({
        start: { x: 391, y: height - 94 },
        end: { x: 485, y: height - 94 },
        thickness: 1,
        color: lineColor,
      });
      // Draw red line zone3
      pages[4].drawLine({
        start: { x: 121, y: height - 137 },
        end: { x: 148, y: height - 137 },
        thickness: 1,
        color: lineColor,
      });
      pages[4].drawLine({
        start: { x: 184, y: height - 137 },
        end: { x: 237, y: height - 137 },
        thickness: 1,
        color: lineColor,
      });
      // Draw red line zone4
      pages[4].drawLine({
        start: { x: 300, y: height - 137 },
        end: { x: 367, y: height - 137 },
        thickness: 1,
        color: lineColor,
      });
    } else if (breakClause1 === 'either') {
      // Draw red line zone1
      pages[4].drawLine({
        start: { x: 387, y: height - 64 },
        end: { x: 470, y: height - 64 },
        thickness: 1,
        color: lineColor,
      });
      // Draw red line zone2
      pages[4].drawLine({
        start: { x: 345, y: height - 94 },
        end: { x: 428, y: height - 94 },
        thickness: 1,
        color: lineColor,
      });
      // Draw red line zone3
      pages[4].drawLine({
        start: { x: 120, y: height - 137 },
        end: { x: 183, y: height - 137 },
        thickness: 1,
        color: lineColor,
      });
      // Draw red line zone4
      pages[4].drawLine({
        start: { x: 268, y: height - 137 },
        end: { x: 333, y: height - 137 },
        thickness: 1,
        color: lineColor,
      });
    }

    // Add Break Clause 2 
    if (breakClause2) {
      pages[4].drawText(breakClause2, {
        x: 507,
        y: height - 82,
        size: 12,
        font: helveticaFont,
        color: fontColor,
      });
      pages[4].drawText(breakClause2, {
        x: 186,
        y: height - 97,
        size: 12,
        font: helveticaFont,
        color: fontColor,
      });
      pages[4].drawText(breakClause2, {
        x: 410,
        y: height - 140,
        size: 12,
        font: helveticaFont,
        color: fontColor,
      });
      pages[4].drawText(breakClause2, {
        x: 523,
        y: height - 140,
        size: 12,
        font: helveticaFont,
        color: fontColor,
      });
    }

    // Add Break Clause 3
    if (breakClause3 === '12') {
      // Draw red line zone1
      pages[4].drawLine({
        start: { x: 430, y: height - 108 },
        end: { x: 480, y: height - 108 },
        thickness: 1,
        color: lineColor,
      });
      // Draw red line zone2
      pages[4].drawLine({
        start: { x: 436, y: height - 152 },
        end: { x: 475, y: height - 152 },
        thickness: 1,
        color: lineColor,
      });
      //Display zone3 & 4
      pages[4].drawText(breakClause3, {
        x: 478,
        y: height - 126,
        size: 10,
        font: helveticaFont,
        color: fontColor,
      });
      pages[4].drawText(breakClause3, {
        x: 104,
        y: height - 169,
        size: 10,
        font: helveticaFont,
        color: fontColor,
      });
    } else if (breakClause3 === '14') {
      // Draw red line zone1
      pages[4].drawLine({
        start: { x: 412, y: height - 108 },
        end: { x: 430, y: height - 108 },
        thickness: 1,
        color: lineColor,
      });
      pages[4].drawLine({
        start: { x: 447, y: height - 108 },
        end: { x: 480, y: height - 108 },
        thickness: 1,
        color: lineColor,
      });
      // Draw red line zone2
      pages[4].drawLine({
        start: { x: 419, y: height - 152 },
        end: { x: 435, y: height - 152 },
        thickness: 1,
        color: lineColor,
      });
      pages[4].drawLine({
        start: { x: 452, y: height - 152 },
        end: { x: 475, y: height - 152 },
        thickness: 1,
        color: lineColor,
      });
      //Display zone3 & 4
      pages[4].drawText(breakClause3, {
        x: 478,
        y: height - 126,
        size: 10,
        font: helveticaFont,
        color: fontColor,
      });
      pages[4].drawText(breakClause3, {
        x: 104,
        y: height - 169,
        size: 10,
        font: helveticaFont,
        color: fontColor,
      });
    } else if (breakClause3 === 'other' && breakClause3Other) {
      // Display other value zone 1
      pages[4].drawLine({
        start: { x: 412, y: height - 108 },
        end: { x: 446, y: height - 108 },
        thickness: 1,
        color: lineColor,
      });
      pages[4].drawText(breakClause3Other, {
        x: 457,
        y: height - 111,
        size: 10,
        font: helveticaFont,
        color: fontColor,
      });
      // Display other value zone 2
      pages[4].drawLine({
        start: { x: 419, y: height - 152 },
        end: { x: 451, y: height - 152 },
        thickness: 1,
        color: lineColor,
      });
      pages[4].drawText(breakClause3Other, {
        x: 457,
        y: height - 155,
        size: 10,
        font: helveticaFont,
        color: fontColor,
      });
      //Display zone3 & 4
      pages[4].drawText(breakClause3Other, {
        x: 478,
        y: height - 126,
        size: 10,
        font: helveticaFont,
        color: fontColor,
      });
      pages[4].drawText(breakClause3Other, {
        x: 104,
        y: height - 169,
        size: 10,
        font: helveticaFont,
        color: fontColor,
      });
    }

    // Add furniture items
    if (airConditioner) {
      pages[4].drawText(airConditioner, {
        x: 135,
        y: height - 248,
        size: 12,
        font: helveticaFont,
        color: fontColor,
      });
    }

    if (ventilator) {
      pages[4].drawText(ventilator, {
        x: 231,
        y: height - 248,
        size: 12,
        font: helveticaFont,
        color: fontColor,
      });
    }

    if (oilVentilator) {
      pages[4].drawText(oilVentilator, {
        x: 343,
        y: height - 248,
        size: 12,
        font: helveticaFont,
        color: fontColor,
      });
    }

    if (waterHeater) {
      pages[4].drawText(waterHeater, {
        x: 541,
        y: height - 248,
        size: 12,
        font: helveticaFont,
        color: fontColor,
      });
    }

    if (gasStove) {
      pages[4].drawText(gasStove, {
        x: 135,
        y: height - 284,
        size: 12,
        font: helveticaFont,
        color: fontColor,
      });
    }

    if (lightings) {
      pages[4].drawText(lightings, {
        x: 231,
        y: height - 284,
        size: 12,
        font: helveticaFont,
        color: fontColor,
      });
    }

    if (refrigerator) {
      pages[4].drawText(refrigerator, {
        x: 343,
        y: height - 284,
        size: 12,
        font: helveticaFont,
        color: fontColor,
      });
    }

    if (washingMachine) {
      pages[4].drawText(washingMachine, {
        x: 541,
        y: height - 284,
        size: 12,
        font: helveticaFont,
        color: fontColor,
      });
    }

    if (bed) {
      pages[4].drawText(bed, {
        x: 135,
        y: height - 320,
        size: 12,
        font: helveticaFont,
        color: fontColor,
      });
    }

    if (wardrobe) {
      pages[4].drawText(wardrobe, {
        x: 231,
        y: height - 320,
        size: 12,
        font: helveticaFont,
        color: fontColor,
      });
    }

    if (settee) {
      pages[4].drawText(settee, {
        x: 343,
        y: height - 320,
        size: 12,
        font: helveticaFont,
        color: fontColor,
      });
    }

    if (otherFurniture) {
      pages[4].drawText(otherFurniture, {
        x: 422,
        y: height - 320,
        size: 12,
        font: helveticaFont,
        color: fontColor,
      });
    }

    // Add landlord bank account
    if (landlordBankAccount) {
      pages[4].drawText(landlordBankAccount, {
        x: 410,
        y: height - 349,
        size: 10,
        font: helveticaFont,
        color: fontColor,
      });
      pages[4].drawText(landlordBankAccount, {
        x: 304,
        y: height - 371,
        size: 10,
        font: helveticaFont,
        color: fontColor,
      });
    }

    // Add bank
    if (bank) {
      pages[4].drawText(bank, {
        x: 410,
        y: height - 338,
        size: 10,
        font: helveticaFont,
        color: fontColor,
      });
      pages[4].drawText(bank, {
        x: 304,
        y: height - 361,
        size: 10,
        font: helveticaFont,
        color: fontColor,
      });
    }

    // Add filtered remarks
    const filteredRemarks = remarksFields.filter(remark => remark.trim() !== '');

    // Remake Chinese remarks
    const chineseRowLength = 43;
    const processedRemarks = filteredRemarks.map(remark => {
      if (hasChinese(remark)) {
        return joinRemarks(remark, chineseRowLength);
      }
      return remark;
    });

    // Add remarks on PDF
    if (processedRemarks.length > 0) {
      let remarksStr = "";
      const breakSymbol = "\n";
      
      processedRemarks.forEach((remark) => {
        remarksStr += `${remark}${breakSymbol}`;
      });

      pages[4].drawText(remarksStr, {
        x: 126,
        y: height - 392,
        maxWidth: 452,
        lineHeight: 23,
        size: 10,
        font: chineseFont,
        color: fontColor,
      });
    }

    pdfDoc.removePage(2);

    const pdfBytes = await pdfDoc.save();

    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);

    if (isPreview) {
      // Convert PDF to images
      try {
        if (setImageLoading) setImageLoading(true);
        if (setImageError) setImageError(null);
        if (setImages) setImages([]);
        const images = await convertToImage(url);
        if (setImages) setImages(images || []);
        return url;
      } catch (imageError) {
        console.error('Error converting PDF to images:', imageError);
        if (setImageError) setImageError('Failed to convert PDF to images');
      } finally {
        if (setImageLoading) setImageLoading(false);
      }
    } else {
      // Return PDF URL
      return url;
    }
    
    return url;
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Error generating PDF. Please check the console for details.');
    return null;
  }
};
