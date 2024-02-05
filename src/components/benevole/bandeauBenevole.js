import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../../styles/benevoles/bandeauBenevole.css";
import Logo from '../../Logo/logo_court.png';
import ProfileImage from '../../Logo/icon_profil.png';
import CalendrierImage from '../../Logo/icon_calendar.png';
import AlerteImage from '../../Logo/alerte_icon.png';
import DeconnexionImage from '../../Logo/icon_deco.png';
import { useAuth } from '../../AuthWrapper';

function BandeauLogo() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const redirectToAccueil = () => {
    navigate("/accueil");
  };

  const redirectToProfil = () => {
    navigate("/profil");
  };

  const redirectToPlanning = () => {
    navigate("/planning");
  }

  const handleLogout = () => {
    logout();
    navigate("/"); // Redirige vers la page de connexion
  };

  return (
    <div className="Bandeau-logo">
      <img className="LogoApp" src={Logo} alt="Logo" title="Accueil" onClick={redirectToAccueil} />
      <img className="Profile Logo-BL" src={ProfileImage} alt="Profile" title="Profil" onClick={redirectToProfil} />
      <img className="Calendrier Logo-BL" src={CalendrierImage} alt="Calandrier" title="Calendrier" onClick={redirectToPlanning}/>
      <img className="Deconnexion Logo-BL" src={DeconnexionImage} alt="Profile" title="Déconnexion" onClick={handleLogout} />
    </div>
  );
}

export default BandeauLogo;
