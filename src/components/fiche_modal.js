import React from 'react';
import '../styles/fiche_modal.css';

const Fiche_modal = ({ children, type, onClose }) => {
  const popupClasses = `FenetrePopupF ${type} ${children ? 'show' : ''}`;

  return (
    <div className={popupClasses}>
      {children}
      <button className="closeButton" onClick={onClose} >X</button>
    </div>
  );
};

export default Fiche_modal;
