import React from 'react';
import '../../styles/Admin/modal.css';
import StandForm from './form_stand';

const Modal = ({ message, type, onClose }) => {
  const popupClasses = `FenetrePopup ${type} ${message ? 'show' : ''}`;

  return (
    <div className={popupClasses}>
      <p>{message}</p>
      {/* Inclure le formulaire StandForm */}
      <StandForm onClose={onClose} />
    </div>
  );
};

export default Modal;
