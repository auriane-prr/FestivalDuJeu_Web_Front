import React from 'react';
import "../styles/bandeau.css"
import LogoImage from '../Logo/logo.png';
import NomAssoImage from '../Logo/NomAssoLigne.png';

function Bandeau() {
  return (
    <div className="Bandeau">
      <img className="Logo" src={LogoImage} alt="Logo" />
      <img className="NomAsso" src={NomAssoImage} alt="NomAsso" />
    </div>
    

  );
}

export default Bandeau;
