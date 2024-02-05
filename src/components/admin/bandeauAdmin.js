import React from 'react';
import { useNavigate } from 'react-router-dom';
import LogoAdmin from '../../Logo/icon_parametres.png';
import Logo from '../../Logo/logo_court.png';
import "../../styles/Admin/bandeauAdmin.css";
import LogoFlexible from '../../Logo/icon_flexible.png';
import DeconnexionImage from '../../Logo/icon_deco.png';
import { useAuth } from '../../AuthWrapper';


function BandeauAdmin() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const redirectToParametre = () => {
    navigate("/admin/parametre")
    console.log("je redirige vers parametre admin");
  };

  const redirectToAccueil = () => {
    navigate("/admin");
  };

  const redirectToFlexible = () => {
    navigate("/admin/flexible");
  }

  const handleLogout = () => {
    logout();
    navigate("/"); // Redirige vers la page de connexion
  };

  return (
    <div className="Bandeau-admin">
        <img className="LogoApp" src={Logo} alt="Logo" title="Accueil" onClick={redirectToAccueil} />
        <img className="Flexible Logo-AD" src={LogoFlexible} alt="Logo" title="Flexibles" onClick={redirectToFlexible} />
        <img className="Parametre Logo-AD" src={LogoAdmin} alt="Logo" title="Paramètres" onClick={redirectToParametre} />
        <img className='Deconnexion Logo-AD' src={DeconnexionImage} alt='Deconnexion' title="Deconnexion" onClick={handleLogout}/>
    </div>
  );
}

export default BandeauAdmin;