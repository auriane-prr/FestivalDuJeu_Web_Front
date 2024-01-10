import React from 'react';
import { useNavigate } from 'react-router-dom';
import LogoAdmin from '../../Logo/icon_admin.png';
import Logo from '../../Logo/logo_court.png';
import "../../styles/Admin/bandeauAdmin.css";
import LogoFlexible from '../../Logo/icon_flexible.png';


function BandeauAdmin() {
  const navigate = useNavigate();

  const redirectToParametre = () => {
    navigate("/admin/parametre")
    console.log("je redirige vers parametre admin");
  };

  const redirectToAccueil = () => {
    navigate("/admin");
  };

  return (
    <div className="Bandeau-admin">
        <img className="Logo-AD" src={Logo} alt="Logo" onClick={redirectToAccueil} />
        <img className="Flexible Logo-AD" src={LogoFlexible} alt="Logo" />
        <img className="Parametre Logo-AD" src={LogoAdmin} alt="Logo" onClick={redirectToParametre} />
    </div>
  );
}

export default BandeauAdmin;