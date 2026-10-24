import React, { useState, useEffect } from 'react';
import './PdfGenerateSection.css';
import { PDFDocument, rgb, StandardFonts, degrees, PDFPage, Color, PDFFont } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit'
import { toChinese, toChineseWithUnits } from 'chinese-number-format';
import { useLanguage } from '../src/contexts/LanguageContext';
import { t } from '../src/translations';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface PdfGenerateSectionProps {
  // Add props here as needed
}

const PdfGenerateSection: React.FC<PdfGenerateSectionProps> = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [inputText1, setInputText1] = useState('');
  const [inputText2, setInputText2] = useState('');
  const [inputText3, setInputText3] = useState('');
  const [inputText4, setInputText4] = useState('');
  const [inputText5, setInputText5] = useState('');
  const [rentAmount, setRentAmount] = useState('');
  const [securityDeposit, setSecurityDeposit] = useState('');
  const [propertyUse, setPropertyUse] = useState('residential');
  const [managementFee, setManagementFee] = useState('landlord');
  const [governmentRates, setGovernmentRates] = useState('landlord');
  const [governmentRent, setGovernmentRent] = useState('landlord');
  const [rentFreeFrom, setRentFreeFrom] = useState('');
  const [rentFreeTo, setRentFreeTo] = useState('');
  const [breakClause1, setBreakClause1] = useState('landlord');
  const [breakClause2, setBreakClause2] = useState('');
  const [breakClause3, setBreakClause3] = useState('12');
  const [breakClause3Other, setBreakClause3Other] = useState('');
  const [airConditioner, setAirConditioner] = useState('');
  const [ventilator, setVentilator] = useState('');
  const [oilVentilator, setOilVentilator] = useState('');
  const [waterHeater, setWaterHeater] = useState('');
  const [gasStove, setGasStove] = useState('');
  const [lightings, setLightings] = useState('');
  const [refrigerator, setRefrigerator] = useState('');
  const [washingMachine, setWashingMachine] = useState('');
  const [bed, setBed] = useState('');
  const [wardrobe, setWardrobe] = useState('');
  const [settee, setSettee] = useState('');
  const [otherFurniture, setOtherFurniture] = useState('');
  const [landLordId, setLandLordId] = useState('');
  const [landlordTel, setLandlordTel] = useState('');
  const [tenantId, setTenantId] = useState('');
  const [tenantTel, setTenantTel] = useState('');
  const [landlordBankAccount, setLandlordBankAccount] = useState('');
  const [bank, setBank] = useState('');
  const [inputDate2, setInputDate2] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [remarksFields, setRemarksFields] = useState<string[]>(['']);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const { language } = useLanguage();

  //Color Type
// type RGB = `rgb(${number}, ${number}, ${number})`;
// type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
// type HEX = `#${string}`;
// type Color = RGB | RGBA | HEX | undefined;

  // Debug language changes
  useEffect(() => {
    console.log('Language changed to:', language);
    console.log('Translation for "landlord":', t(language, 'landlord'));
  }, [language]);

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

  const getMonthInEnglish = (dateString: string): string => {
    const date = new Date(dateString);
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${month}, ${year}`;
  };

  const getDayWithOrdinal = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate();
    if (day > 3 && day < 21) return `${day}th`;
    switch (day % 10) {
      case 1: return `${day}st`;
      case 2: return `${day}nd`;
      case 3: return `${day}rd`;
      default: return `${day}th`;
    }
  };

  const getMonthNumber = (dateString: string): string => {
    const date = new Date(dateString);
    return String(date.getMonth() + 1).padStart(2, '0');
  };

  const getDateNumber = (dateString: string): string => {
    const date = new Date(dateString);
    return String(date.getDate()).padStart(2, '0');
  };

  const getYear = (dateString: string): string => {
    const date = new Date(dateString);
    return String(date.getFullYear());
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Function to add watermark to PDF page
  const addWatermark = async (
    page: PDFPage,
    text: string,
    subText: string,
    font: PDFFont, 
    options: {
      size?: number;
      color?: Color;
      opacity?: number;
      angle?: number;
      xOffset?: number;
      yOffset?: number;
    } = {}
  ) => {
    const {
      size = 50,
      color = rgb(0.95, 0.1, 0.1),
      opacity = 0.3,
      angle = -45,
      xOffset = 0,
      yOffset = 0,
    } = options;

    const { height } = page.getSize();
    
    // Draw the main watermark text
    page.drawText(text, {
      x: page.getWidth() / 2 - font.widthOfTextAtSize(text, size) / 2 + xOffset,
      y: height / 2 + yOffset,
      size,
      font,
      color,
      opacity,
      rotate: degrees(angle),
    });

    // Draw the sub-text if provided
    if (subText) {
      page.drawText(subText, {
        x: page.getWidth() / 2 - font.widthOfTextAtSize(subText, size / 3) / 2 + xOffset,
        y: height / 2 - size + yOffset,
        size: size / 3,
        font,
        color,
        opacity,
        rotate: degrees(angle),
      });
    }
  };

  const generatePDF = async (isPreview: boolean = false) => {
    try {
      setIsLoading(true);

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
        })
      }

      // Add user input text 2: The Landlord
      if (inputText2.trim()) {
        pages[3].drawText(inputText2, {
          x: 128,
          y: height - 132,
          size: 14,
          font: chineseFont,
          color: fontColor,
        })
      }

      // Add landlord ID
      if (landLordId.trim()) {
        pages[1].drawText(landLordId, {
          x: 428,
          y: height - 792,
          size: 12,
          font: helveticaFont,
          color: fontColor,
        })
      }

      // Add landlord Tel
      if (landlordTel.trim()) {
        pages[3].drawText(landlordTel, {
          x: 470,
          y: height - 160,
          size: 12,
          font: helveticaFont,
          color: fontColor,
        })
      }

      // Add user input text 3: Landlord Address
      if (inputText3.trim()) {
        pages[3].drawText(inputText3, {
          x: 128,
          y: height - 160,
          size: 14,
          font: chineseFont,
          color: fontColor,
        })
      }

      // Add user input text 4: The Tenant
      if (inputText4.trim()) {
        pages[3].drawText(inputText4, {
          x: 128,
          y: height - 192,
          size: 14,
          font: chineseFont,
          color: fontColor,
        })
      }

      // Add tenant ID
      if (tenantId.trim()) {
        pages[1].drawText(tenantId, {
          x: 160,
          y: height - 792,
          size: 12,
          font: helveticaFont,
          color: fontColor,
        })
      }

      // Add tenant Tel
      if (tenantTel.trim()) {
        pages[3].drawText(tenantTel, {
          x: 470,
          y: height - 220,
          size: 12,
          font: helveticaFont,
          color: fontColor,
        })
      }

      // Add user input text 5: Tenant Address
      if (inputText5.trim()) {
        pages[3].drawText(inputText5, {
          x: 128,
          y: height - 220,
          size: 14,
          font: chineseFont,
          color: fontColor,
        })
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
        })

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
        })

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
        console.log(toChinese(tenPlace), toChinese(hundredPlace), toChinese(thousandPlace), toChinese(tenThousandPlace));
        
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

    
      //Check Chinese Chars
      const hasChinese = (input: string) => {
        const REGEX_CHINESE = /[\u4e00-\u9fff]|[\u3400-\u4dbf]|[\u{20000}-\u{2a6df}]|[\u{2a700}-\u{2b73f}]|[\u{2b740}-\u{2b81f}]|[\u{2b820}-\u{2ceaf}]|[\uf900-\ufaff]|[\u3300-\u33ff]|[\ufe30-\ufe4f]|[\uf900-\ufaff]|[\u{2f800}-\u{2fa1f}]/u;
        return REGEX_CHINESE.test(input);
      }

      //Split remarks into 20 char chunks
      const splitRemarks = (input: string, chunkSize: number) => {
        let chunks = [] as string[];
        for (let i = 0; i < input.length; i += chunkSize) {
          chunks.push(input.slice(i, i + chunkSize));
        }
        return chunks;
      }

      //chinese remarks one row length
      const chineseRowLength = 43;

      //Chinese remarks chunks join with \n
      const joinRemarks = (input: string, chunkSize: number) => {
        const chunks = splitRemarks(input, chunkSize);
        return chunks.join("\n");
      }

      // Add filtered remarks
      const filteredRemarks = remarksFields.filter(remark => remark.trim() !== '');

      // Remake Chinese remarks
      filteredRemarks.forEach((remark, index) => {
        if(hasChinese(remark)) {
          const remakeRemark = joinRemarks(remark, chineseRowLength);
          console.log(remark);
          filteredRemarks[index] = remakeRemark;
          console.log(filteredRemarks[index]);
        }
      });

      console.log(filteredRemarks[0]);

      //Add remarks on PDF
      if (filteredRemarks.length > 0) {

        let remarksStr = "";
        const breakSymbol = "\n";
        
        // filteredRemarks.forEach((remark, index) => {
        //   remarksStr += `${index + 2}.${remark}${breakSymbol}`;
        // });

        filteredRemarks.forEach((remark) => {
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

        // Add each remark with proper spacing
        // filteredRemarks.forEach((remark, index) => {
        //   pages[4].drawText(`${index + 2}. ${remark}`, {
        //     x: 50,
        //     y: height - 440 - (index * 20),
        //     maxWidth: 550, 
        //     size: 10,
        //     font: helveticaFont,
        //     color: fontColor,
        //   });
        // });
      }

      pdfDoc.removePage(2);

      const pdfBytes = await pdfDoc.save();

      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      setPdfUrl(url);
      return url;
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please check the console for details.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeneratePDF = async () => {
    const url = await generatePDF();
    if (url) {
      const link = document.createElement('a');
      link.href = url;
      link.download = "modified_tenancy_agreement.pdf";
      link.click();
    }
  };

  const handlePreview = async () => {
    const url = await generatePDF(true);
    if (url) {
      setShowPreview(true);
    }
  };

  const handleAddRemark = () => {
    setRemarksFields([...remarksFields, '']);
  };

  const handleRemoveRemark = (index: number) => {
    const newRemarksFields = [...remarksFields];
    newRemarksFields.splice(index, 1);
    setRemarksFields(newRemarksFields);
  };

  const handleRemarkChange = (index: number, value: string) => {
    const newRemarksFields = [...remarksFields];
    newRemarksFields[index] = value;
    setRemarksFields(newRemarksFields);
  };

  return (
    <div className="pdf-generate-section">
      <div className="left-section">  
        <p className="input-group-heading">{t(language, 'Please fill in the following information:')}</p>
        <div className="input-group">
          <label htmlFor="pdf-date-2">{t(language, 'agreementDate')}</label>
          <input
            type="date"
            id="pdf-date-2"
            value={inputDate2}
            onChange={(e) => setInputDate2(e.target.value)}
            placeholder={t(language, 'enterDate')}
          />
        </div>
        <div className="input-group">
          <label htmlFor="pdf-text-1">{t(language, 'propertyAddress')}</label>
          <input
            type="text"
            id="pdf-text-1"
            value={inputText1}
            onChange={(e) => setInputText1(e.target.value)}
            placeholder={t(language, 'enterPropertyAddress')}
          />
        </div>
        <div className="input-group">
          <label htmlFor="pdf-text-2">{t(language, 'landlord')}</label>
          <input
            type="text"
            id="pdf-text-2"
            value={inputText2}
            onChange={(e) => setInputText2(e.target.value)}
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
              onChange={(e) => setLandlordTel(e.target.value)}
              placeholder={t(language, 'enterTel')}
            />
          </div>
          <div className="input-group input-group-50">
            <label htmlFor="landLordId">{t(language, 'landlordId')}</label>
            <input
              type="text"
              id="landLordId"
              value={landLordId}
              onChange={(e) => setLandLordId(e.target.value)}
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
            onChange={(e) => setInputText3(e.target.value)}
            placeholder={t(language, 'enterAddress')}
          />
        </div>
        <div className="input-group">
          <label htmlFor="pdf-text-4">{t(language, 'tenant')}</label>
          <input
            type="text"
            id="pdf-text-4"
            value={inputText4}
            onChange={(e) => setInputText4(e.target.value)}
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
              onChange={(e) => setTenantTel(e.target.value)}
              placeholder={t(language, 'enterTel')}
            />
          </div>
          <div className="input-group input-group-50">
            <label htmlFor="tenantId">{t(language, 'tenantId')}</label>
            <input
              type="text"
              id="tenantId"
              value={tenantId}
              onChange={(e) => setTenantId(e.target.value)}
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
            onChange={(e) => setInputText5(e.target.value)}
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
              onChange={(e) => setDateFrom(e.target.value)}
              placeholder={t(language, 'enterDate')}
            />
          </div>
          <div className="input-group">
            <label htmlFor="date-to">{t(language, 'to')}</label>
            <input
              type="date"
              id="date-to"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
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
            onChange={(e) => setRentAmount(e.target.value)}
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
            onChange={(e) => setSecurityDeposit(e.target.value)}
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
            onChange={(e) => setPropertyUse(e.target.value)}
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
              onChange={(e) => setManagementFee(e.target.value)}
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
              onChange={(e) => setGovernmentRates(e.target.value)}
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
              onChange={(e) => setGovernmentRent(e.target.value)}
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
              onChange={(e) => setRentFreeFrom(e.target.value)}
              placeholder={t(language, 'enterDate')}
            />
          </div>
          <div className="input-group">
            <label htmlFor="rent-free-to">{t(language, 'rentFreeTo')}</label>
            <input
              type="date"
              id="rent-free-to"
              value={rentFreeTo}
              onChange={(e) => setRentFreeTo(e.target.value)}
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
              onChange={(e) => setBreakClause1(e.target.value)}
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
              onChange={(e) => setBreakClause2(e.target.value)}
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
                onChange={(e) => setBreakClause3(e.target.value)}
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
                  onChange={(e) => setBreakClause3Other(e.target.value)}
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
              onChange={(e) => setAirConditioner(e.target.value)}
              placeholder={t(language, 'enterQuantity')}
            />
          </div>
          <div className="input-group">
            <label htmlFor="ventilator">{t(language, 'ventilator')}</label>
            <input
              type="text"
              id="ventilator"
              value={ventilator}
              onChange={(e) => setVentilator(e.target.value)}
              placeholder={t(language, 'enterQuantity')}
            />
          </div>
          <div className="input-group">
            <label htmlFor="oil-ventilator">{t(language, 'oilVentilator')}</label>
            <input
              type="text"
              id="oil-ventilator"
              value={oilVentilator}
              onChange={(e) => setOilVentilator(e.target.value)}
              placeholder={t(language, 'enterQuantity')}
            />
          </div>
          <div className="input-group">
            <label htmlFor="water-heater">{t(language, 'waterHeater')}</label>
            <input
              type="text"
              id="water-heater"
              value={waterHeater}
              onChange={(e) => setWaterHeater(e.target.value)}
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
              onChange={(e) => setGasStove(e.target.value)}
              placeholder={t(language, 'enterQuantity')}
            />
          </div>
          <div className="input-group">
            <label htmlFor="lightings">{t(language, 'lightings')}</label>
            <input
              type="text"
              id="lightings"
              value={lightings}
              onChange={(e) => setLightings(e.target.value)}
              placeholder={t(language, 'enterQuantity')}
            />
          </div>
          <div className="input-group">
            <label htmlFor="refrigerator">{t(language, 'refrigerator')}</label>
            <input
              type="text"
              id="refrigerator"
              value={refrigerator}
              onChange={(e) => setRefrigerator(e.target.value)}
              placeholder={t(language, 'enterQuantity')}
            />
          </div>
          <div className="input-group">
            <label htmlFor="washing-machine">{t(language, 'washingMachine')}</label>
            <input
              type="text"
              id="washing-machine"
              value={washingMachine}
              onChange={(e) => setWashingMachine(e.target.value)}
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
              onChange={(e) => setBed(e.target.value)}
              placeholder={t(language, 'enterQuantity')}
            />
          </div>
          <div className="input-group">
            <label htmlFor="wardrobe">{t(language, 'wardrobe')}</label>
            <input
              type="text"
              id="wardrobe"
              value={wardrobe}
              onChange={(e) => setWardrobe(e.target.value)}
              placeholder={t(language, 'enterQuantity')}
            />
          </div>
          <div className="input-group">
            <label htmlFor="settee">{t(language, 'settee')}</label>
            <input
              type="text"
              id="settee"
              value={settee}
              onChange={(e) => setSettee(e.target.value)}
              placeholder={t(language, 'enterQuantity')}
            />
          </div>
          <div className="input-group">
            <label htmlFor="other-furniture">{t(language, 'otherFurniture')}</label>
            <input
              type="text"
              id="other-furniture"
              value={otherFurniture}
              onChange={(e) => setOtherFurniture(e.target.value)}
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
              onChange={(e) => setLandlordBankAccount(e.target.value)}
              placeholder={t(language, 'enterAccountNumber')}
            />
          </div>
          <div className="input-group">
            <label htmlFor="bank">{t(language, 'bank')}</label>
            <input
              type="text"
              id="bank"
              value={bank}
              onChange={(e) => setBank(e.target.value)}
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
            className="generate-btn" 
            onClick={handleGeneratePDF}
            disabled={isLoading}
          >
            {isLoading ? t(language, 'generating') : t(language, 'generate')}
          </button>
          <button 
            className="preview-btn" 
            onClick={handlePreview}
            disabled={isLoading}
          >
            {t(language, 'preview')}
          </button>
        </div>
      </div>
      <div className="right-section">
        {showPreview && pdfUrl ? (
          <div className="pdf-preview">
            <iframe 
              src={pdfUrl+"#toolbar=0&view=FitH"} 
              title={t(language, 'PDF Preview')}
            />
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
    </div>
  );
};

export default PdfGenerateSection;
