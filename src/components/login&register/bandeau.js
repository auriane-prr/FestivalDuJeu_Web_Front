import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../../styles/login&register/bandeau_login.css"
import Logo from '../../Logo/logo_long.png';

function Bandeau() {
  const navigate = useNavigate();
  const redirectToAccueil = () => {
    navigate("/"); // Redirige vers la page de connexion
  };

  return (
    <div className="Bandeau">
      <img className="Logo" src={Logo} alt="Logo" onClick={redirectToAccueil}/>
    </div>
  );
}

export default Bandeau;
