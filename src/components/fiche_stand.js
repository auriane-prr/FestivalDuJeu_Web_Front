import React from 'react';
import '../styles/fiche_stand.css';

const Fiche_stand = ({ children, type, onClose }) => {
  const ficheClasses = `FicheStand ${type} ${children ? 'show' : ''}`;

  return (
    <div className={ficheClasses}>
      {children}
      <button className="closeButtonF" onClick={onClose} >X</button>
    </div>
  );
};

export default Fiche_stand;
