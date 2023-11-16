import React from 'react';
import "../styles/bandeauLogo.css"
import LogoImage from '../Logo/logo.png';
import NomAssoImage from '../Logo/NomAssoGris.png';
import ProfileImage from '../Logo/icon_profil.png';
import CalandrierImage from '../Logo/icon_calendar.png';
import Alerte from '../Logo/alerte_icon.png';

function Bandeau() {
  return (
    <div className="Bandeau">
        <img className="Logo" src={LogoImage} alt="Logo" />
        <img className="NomAsso" src={NomAssoImage} alt="NomAsso" />
        <img className="Profile" src={ProfileImage} alt="Profile" />
        <img className="Calandrier" src={CalandrierImage} alt="Calandrier" />
        <img className="Alerte" src={Alerte} alt="Alerte" />
    </div>
    

  );
}

export default Bandeau;
