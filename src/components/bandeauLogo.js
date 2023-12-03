import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/bandeauLogo.css";
import Logo from '../Logo/logo_court.png';
import ProfileImage from '../Logo/icon_profil.png';
import CalendrierImage from '../Logo/icon_calendar.png';
import AlerteImage from '../Logo/alerte_icon.png';

function BandeauLogo() {
  const navigate = useNavigate();

  const redirectToAccueil = () => {
    navigate("/accueil");
  };

  const redirectToProfil = () => {
    navigate("/profil");
  };

  return (
    <div className="Bandeau-logo">
      <img className="Logo-BL" src={Logo} alt="Logo" onClick={redirectToAccueil} />
      <img className="Profile Logo-BL" src={ProfileImage} alt="Profile" onClick={redirectToProfil} />
      <img className="Calendrier Logo-BL" src={CalendrierImage} alt="Calandrier" />
      <img className="Alerte Logo-BL" src={AlerteImage} alt="Alerte"  />
    </div>
  );
}

export default BandeauLogo;
