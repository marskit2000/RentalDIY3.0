import { exportPdfDataToJson, importPdfDataFromJson, validatePdfDataJson } from './pdfDataExport';
import { PdfInputValues, defaultPdfInputValues } from './pdfGenerator';

/**
 * Test function to run all tests for the PDF data export/import functionality
 */
export const runPdfDataExportTests = (): void => {
  console.log('=== Running PDF Data Export/Import Tests ===');
  
  // Test data
  const testData: PdfInputValues = {
    ...defaultPdfInputValues,
    inputText1: 'Test Property Name',
    inputText2: 'Test Property Address',
    rentAmount: '10000',
    securityDeposit: '20000',
    dateFrom: '2025-01-01',
    dateTo: '2026-01-01',
    landLordId: 'L123456789',
    tenantId: 'T987654321',
    remarksFields: ['Special condition 1', 'Special condition 2']
  };
  
  // Test 1: Export data to JSON
  console.log('\nTest 1: Export data to JSON');
  try {
    const jsonString = exportPdfDataToJson(testData);
    console.log('✅ Successfully exported data to JSON');
    console.log('JSON Preview (first 200 chars):');
    console.log(jsonString.substring(0, 200) + '...');
    
    // Test 2: Import data from JSON
    console.log('\nTest 2: Import data from JSON');
    const importedData = importPdfDataFromJson(jsonString);
    
    // Check if the imported data matches the original data
    const isEqual = JSON.stringify(importedData) === JSON.stringify(testData);
    if (isEqual) {
      console.log('✅ Successfully imported data from JSON');
      console.log('Imported data matches original data');
    } else {
      console.log('❌ Imported data does not match original data');
      console.log('Original:', testData);
      console.log('Imported:', importedData);
    }
    
    // Test 3: Validate JSON
    console.log('\nTest 3: Validate JSON');
    const validationResult = validatePdfDataJson(jsonString);
    if (validationResult.isValid) {
      console.log('✅ JSON validation successful');
    } else {
      console.log('❌ JSON validation failed:', validationResult.error);
    }
    
    // Test 4: Handle invalid JSON
    console.log('\nTest 4: Handle invalid JSON');
    const invalidJson = '{ "this is not valid JSON" }';
    try {
      importPdfDataFromJson(invalidJson);
      console.log('❌ Failed to detect invalid JSON');
    } catch (error) {
      // Type guard to check if error is an Error object
      if (error instanceof Error) {
        console.log('✅ Successfully detected invalid JSON:', error.message);
      } else {
        console.log('✅ Successfully detected invalid JSON:', String(error));
      }
    }
    
    // Test 5: Handle missing fields
    console.log('\nTest 5: Handle missing fields');
    const incompleteData = { inputText1: 'Only this field exists' };
    const incompleteJson = JSON.stringify(incompleteData);
    
    try {
      const result = importPdfDataFromJson(incompleteJson);
      console.log('✅ Successfully handled missing fields by using defaults');
      
      // Check if default values were applied for missing fields
      const hasDefaultValues = Object.keys(defaultPdfInputValues)
        .filter(key => key !== 'inputText1')
        .every(key => {
          // Use type assertion to tell TypeScript this is a valid key
          const typedKey = key as keyof PdfInputValues;
          return result[typedKey] === defaultPdfInputValues[typedKey];
        });
      
      if (hasDefaultValues) {
        console.log('✅ Default values were correctly applied for missing fields');
      } else {
        console.log('❌ Default values were not correctly applied');
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log('❌ Failed to handle missing fields:', error.message);
      } else {
        console.log('❌ Failed to handle missing fields:', String(error));
      }
    }
    
    // Test 6: Export with metadata
    console.log('\nTest 6: Verify metadata in exported JSON');
    const exportedJson = JSON.parse(exportPdfDataToJson(testData));
    
    if (exportedJson.version && exportedJson.timestamp && exportedJson.data) {
      console.log('✅ Metadata correctly included in exported JSON');
      console.log('Version:', exportedJson.version);
      console.log('Timestamp:', exportedJson.timestamp);
    } else {
      console.log('❌ Metadata missing from exported JSON');
    }
    
    console.log('\n=== All tests completed ===');
  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
};

// Uncomment the line below to run the tests when this file is loaded
// runPdfDataExportTests();

/**
 * Function to run the tests from the browser console
 * This makes it easy to test without modifying the code
 */
(window as any).testPdfDataExport = runPdfDataExportTests;

console.log('PDF Data Export tests are ready. Run window.testPdfDataExport() in the console to execute tests.');
