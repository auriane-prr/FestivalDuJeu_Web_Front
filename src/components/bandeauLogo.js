import React from 'react';
import "../styles/bandeauLogo.css"
import Logo from '../Logo/logo_court.png';
import ProfileImage from '../Logo/icon_profil.png';
import CalendrierImage from '../Logo/icon_calendar.png';
import AlerteImage from '../Logo/alerte_icon.png';

function BandeauLogo() {
  return (
    <div className="Bandeau-logo">
        <img className="Logo-BL" src={Logo} alt="Logo" />
        <img className="Profile Logo-BL" src={ProfileImage} alt="Profile" />
        <img className="Calendrier Logo-BL" src={CalendrierImage} alt="Calandrier" />
        <img className="Alerte Logo-BL" src={AlerteImage} alt="Alerte" />

    </div>
    

  );
}


export default BandeauLogo;
