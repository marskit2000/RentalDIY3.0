import React from 'react';
import './ConfirmationModal.css';
import { Language } from '../../contexts/LanguageContext';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
  language?: Language;
  t?: (language: Language, key: string) => string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  // Handle background click to close the modal
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only trigger if the click was directly on the overlay (not its children)
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="modal-buttons">
          <button 
            className="modal-cancel-btn" 
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button 
            className="modal-confirm-btn" 
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
