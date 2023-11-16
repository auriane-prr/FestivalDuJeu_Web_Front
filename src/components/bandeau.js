import React from 'react';
import "../styles/bandeau.css"
import LogoImage from '../Logo/logo.png';
import NomAssoImage from '../Logo/NomAssoGris.png';

function Bandeau() {
  return (
    <div className="Bandeau">
      <div className='Fond' />
      <img className="Logo" src={LogoImage} alt="Logo" />
      <img className="NomAsso" src={NomAssoImage} alt="NomAsso" />
    </div>
    

  );
}

export default Bandeau;
