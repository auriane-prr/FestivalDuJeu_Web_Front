import React from 'react';
import '../../styles/Admin/fiche_ajouter_stand.css';
import StandForm from './form_stand';

const Modal = ({ message, type, onClose }) => {
  const ficheAjoutClasses = `FicheAjoutStand ${type} ${message ? 'show' : ''}`;

  return (
    <div className={ficheAjoutClasses}>
      <p>{message}</p>
      {/* Inclure le formulaire StandForm */}
      <StandForm onClose={onClose} />
    </div>
  );
};

export default Modal;
