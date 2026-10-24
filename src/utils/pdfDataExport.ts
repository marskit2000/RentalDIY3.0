import { PdfInputValues, defaultPdfInputValues } from './pdfGenerator';

/**
 * Exports the PdfInputValues to a JSON string
 * @param values The PdfInputValues object to export
 * @returns A JSON string representation of the values
 */
export const exportPdfDataToJson = (values: PdfInputValues): string => {
  try {
    // Add metadata to the exported data
    const exportData = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      data: values
    };
    
    return JSON.stringify(exportData, null, 2);
  } catch (error) {
    console.error('Error exporting PDF data to JSON:', error);
    throw new Error('Failed to export PDF data to JSON');
  }
};

/**
 * Imports PdfInputValues from a JSON string
 * @param jsonString The JSON string to import
 * @returns The PdfInputValues object
 * @throws Error if the JSON string is invalid or missing required fields
 */
export const importPdfDataFromJson = (jsonString: string): PdfInputValues => {
  try {
    // Parse the JSON string
    const parsedData = JSON.parse(jsonString);
    
    // Check if the parsed data has the expected structure
    if (!parsedData || typeof parsedData !== 'object') {
      throw new Error('Invalid JSON format');
    }
    
    // If the data has our metadata structure, extract the actual data
    const pdfData = parsedData.data || parsedData;
    
    // Check for missing fields (but don't throw an error, just log them)
    const requiredFields = Object.keys(defaultPdfInputValues);
    const missingFields = requiredFields.filter(field => !(field in pdfData));
    
    if (missingFields.length > 0) {
      console.warn(`Using default values for missing fields: ${missingFields.join(', ')}`);
    }
    
    // Merge with default values to ensure all fields are present
    // This also handles the case where new fields might have been added to the app
    // since the data was exported
    return {
      ...defaultPdfInputValues,
      ...pdfData
    };
  } catch (error) {
    console.error('Error importing PDF data from JSON:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to import PDF data from JSON: ${error.message}`);
    } else {
      throw new Error(`Failed to import PDF data from JSON: ${String(error)}`);
    }
  }
};

/**
 * Validates if a string is a valid JSON representation of PdfInputValues
 * @param jsonString The JSON string to validate
 * @returns An object with isValid flag and optional error message
 */
export const validatePdfDataJson = (jsonString: string): { isValid: boolean; error?: string } => {
  try {
    // Try to import the data
    importPdfDataFromJson(jsonString);
    return { isValid: true };
  } catch (error) {
    return { 
      isValid: false, 
      error: error instanceof Error ? error.message : String(error)
    };
  }
};
