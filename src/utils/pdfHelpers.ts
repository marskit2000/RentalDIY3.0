import { degrees, PDFPage, Color, PDFFont, rgb } from 'pdf-lib';
import { toChinese as toChineseOriginal, toChineseWithUnits as toChineseWithUnitsOriginal } from 'chinese-number-format';

// Date formatting utility functions
export const getMonthInEnglish = (dateString: string): string => {
  const date = new Date(dateString);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${month}, ${year}`;
};

export const getDayWithOrdinal = (dateString: string): string => {
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

export const getMonthNumber = (dateString: string): string => {
  const date = new Date(dateString);
  return String(date.getMonth() + 1).padStart(2, '0');
};

export const getDateNumber = (dateString: string): string => {
  const date = new Date(dateString);
  return String(date.getDate()).padStart(2, '0');
};

export const getYear = (dateString: string): string => {
  const date = new Date(dateString);
  return String(date.getFullYear());
};

export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Export the Chinese number format utilities
export const toChinese = toChineseOriginal;
export const toChineseWithUnits = toChineseWithUnitsOriginal;

// Text utilities
export const hasChinese = (input: string): boolean => {
  const REGEX_CHINESE = /[\u4e00-\u9fff]|[\u3400-\u4dbf]|[\u{20000}-\u{2a6df}]|[\u{2a700}-\u{2b73f}]|[\u{2b740}-\u{2b81f}]|[\u{2b820}-\u{2ceaf}]|[\uf900-\ufaff]|[\u3300-\u33ff]|[\ufe30-\ufe4f]|[\uf900-\ufaff]|[\u{2f800}-\u{2fa1f}]/u;
  return REGEX_CHINESE.test(input);
};

//Split remarks into several char chunks
export const splitRemarks = (input: string, chunkSize: number): string[] => {
  const chunks = [];
  for (let i = 0; i < input.length; i += chunkSize) {
    chunks.push(input.slice(i, i + chunkSize));
  }
  return chunks;
};

//Chinese remarks chunks join with \n
export const joinRemarks = (input: string, chunkSize: number): string => {
  const chunks = splitRemarks(input, chunkSize);
  return chunks.join("\n");
};

// Function to add watermark to PDF page
export const addWatermark = async (
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
