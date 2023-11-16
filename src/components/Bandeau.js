import React from 'react';
import LogoImage from '../Logo/logo.png';
import NomAssoImage from '../Logo/NomAsso.png';

function Bandeau() {
  return (
    <div className="Bandeau">
      <div className="Fond" />
      <img className="Logo" src={LogoImage} alt="Logo"></img>
      <img className="NomAsso" src={NomAssoImage} alt="NomAsso"></img>
    </div>
  );
}

export default Bandeau;
