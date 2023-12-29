import React from 'react';
import '../../../styles/Admin/stands/fenetre_ajouter_stand.css';
import StandForm from './form_ajouter_stand';

const Modal = ({ message, type, onClose }) => {
  const ficheAjoutClasses = `FicheAjoutStand ${type} ${message ? 'show' : ''}`;

  return (
    <div className={ficheAjoutClasses}>
      <p>{message}</p>
      <StandForm onClose={onClose} />
    </div>
  );
};

export default Modal;
