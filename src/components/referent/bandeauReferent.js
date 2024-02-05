import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/benevoles/bandeauBenevole.css";
import Logo from "../../Logo/logo_court.png";
import ProfileImage from "../../Logo/icon_profil.png";
import CalendrierImage from "../../Logo/icon_calendar.png";
import InscriptionImage from "../../Logo/icon_inscription.png";
import DeconnexionImage from "../../Logo/icon_deco.png";
import { useAuth } from "../../AuthWrapper";

function BandeauLogo() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const redirectToAccueil = () => {
    navigate("/referent");
  };

  const redirectToProfil = () => {
    navigate("/profil");
  };

  const redirectToPlanning = () => {
    navigate("/planning");
  };

  const redirectToInscription = () => {
    navigate("/accueil");
  };

  const handleLogout = () => {
    logout();
    navigate("/"); // Redirige vers la page de connexion
  };

  return (
    <div className="Bandeau-logo">
      <img
        className="LogoApp"
        src={Logo}
        alt="Accueil"
        title="Accueil"
        onClick={redirectToAccueil}
      />
      <img
        className="Inscription Logo-BL"
        src={InscriptionImage}
        alt="Inscription"
        title="Inscription stands/zones"
        onClick={redirectToInscription}
      />
      <img
        className="Profile Logo-BL"
        src={ProfileImage}
        alt="Profil"
        title="Profil"
        onClick={redirectToProfil}
      />
      <img
        className="Calendrier Logo-BL"
        src={CalendrierImage}
        alt="Calendrier"
        title="Calendrier"
        onClick={redirectToPlanning}
      />
      <img
        className="Deconnexion Logo-BL"
        src={DeconnexionImage}
        alt="Déconnexion"
        title="Déconnexion"
        onClick={handleLogout}
      />
    </div>
  );
}

export default BandeauLogo;
