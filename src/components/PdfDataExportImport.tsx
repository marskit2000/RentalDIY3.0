import React, { useState, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../translations';
import { PdfInputValues } from '../utils/pdfGenerator';
import { exportPdfDataToJson, importPdfDataFromJson, validatePdfDataJson } from '../utils/pdfDataExport';
import './PdfDataExportImport.css';

interface PdfDataExportImportProps {
  currentValues: PdfInputValues;
  onImport: (values: PdfInputValues) => void;
}

const PdfDataExportImport: React.FC<PdfDataExportImportProps> = ({ 
  currentValues, 
  onImport 
}) => {
  const { language } = useLanguage();
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle export data
  const handleExport = () => {
    try {
      // Generate JSON data
      const jsonData = exportPdfDataToJson(currentValues);
      
      // Create a blob and download link
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Create a download link and trigger it
      const link = document.createElement('a');
      link.href = url;
      
      // Generate filename with date
      const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      const filename = `rental_agreement_data_${date}.json`;
      
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      // Show success message
      setImportSuccess(true);
      setImportError(null);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setImportSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error exporting data:', error);
      if (error instanceof Error) {
        setImportError(error.message);
      } else {
        setImportError('Unknown error occurred during export');
      }
      
      // Hide error message after 5 seconds
      setTimeout(() => {
        setImportError(null);
      }, 5000);
    }
  };

  // Handle import button click
  const handleImportClick = () => {
    // Trigger file input click
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset states
    setImportError(null);
    setImportSuccess(false);

    // Read file
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonString = e.target?.result as string;
        
        // Validate the JSON data
        const validationResult = validatePdfDataJson(jsonString);
        if (!validationResult.isValid) {
          throw new Error(validationResult.error || 'Invalid data format');
        }
        
        // Import the data
        const importedData = importPdfDataFromJson(jsonString);
        
        // Pass the imported data to the parent component
        onImport(importedData);
        
        // Show success message
        setImportSuccess(true);
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          setImportSuccess(false);
        }, 3000);
      } catch (error) {
        console.error('Error importing data:', error);
        if (error instanceof Error) {
          setImportError(error.message);
        } else {
          setImportError('Unknown error occurred during import');
        }
        
        // Hide error message after 5 seconds
        setTimeout(() => {
          setImportError(null);
        }, 5000);
      }
    };
    
    reader.onerror = () => {
      setImportError('Error reading file');
    };
    
    reader.readAsText(file);
    
    // Reset file input
    event.target.value = '';
  };

  return (
    <div className="pdf-data-export-import">
      <div className="export-import-buttons">
        <button 
          className="export-btn" 
          onClick={handleExport}
          title={t(language, 'exportDataTitle') || 'Export form data as JSON file'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
          {t(language, 'exportData') || 'Export'}
        </button>
        
        <button 
          className="import-btn" 
          onClick={handleImportClick}
          title={t(language, 'importDataTitle') || 'Import form data from JSON file'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          {t(language, 'importData') || 'Import'}
        </button>
        
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".json"
          style={{ display: 'none' }}
        />
      </div>
      
      {importError && (
        <div className="import-error">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          {importError}
        </div>
      )}
      
      {importSuccess && (
        <div className="import-success">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          {importSuccess ? (t(language, 'importSuccess') || 'Data imported successfully') : (t(language, 'exportSuccess') || 'Data exported successfully')}
        </div>
      )}
    </div>
  );
};

export default PdfDataExportImport;
