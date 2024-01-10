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

  const handleLogout = () => {
    logout();
    navigate("/"); // Redirige vers la page de connexion
  };

  return (
    <div className="Bandeau-admin">
        <img className="Logo-AD" src={Logo} alt="Logo" onClick={redirectToAccueil} />
        <img className="Flexible Logo-AD" src={LogoFlexible} alt="Logo" />
        <img className="Parametre Logo-AD" src={LogoAdmin} alt="Logo" onClick={redirectToParametre} />
        <img className='Deconnexion Logo-BL' src={DeconnexionImage} alt='Deconnexion' onClick={handleLogout}/>
    </div>
  );
}

export default BandeauAdmin;