import React from 'react';
import "../styles/bandeauLogo.css"
import Logo from '../Logo/logo_court.png';
import ProfileImage from '../Logo/icon_profil.png';
import CalendrierImage from '../Logo/icon_calendar.png';
import AlerteImage from '../Logo/alerte_icon.png';

function Bandeau() {
  return (
    <div className="Bandeau">
        <img className="Logo" src={Logo} alt="Logo" />
        <img className="Profile" src={ProfileImage} alt="Profile" />
        <img className="Calendrier" src={CalendrierImage} alt="Calandrier" />
        <img className="Alerte" src={AlerteImage} alt="Alerte" />

    </div>
    

  );
}


export default Bandeau;
