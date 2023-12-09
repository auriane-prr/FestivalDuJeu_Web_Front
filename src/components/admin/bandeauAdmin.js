import React from 'react';
import { useNavigate } from 'react-router-dom';
import LogoAdmin from '../../Logo/icon_admin.png';
import Logo from '../../Logo/logo_court.png';
import "../../styles/Admin/bandeauAdmin.css";


function BandeauAdmin() {
  const navigate = useNavigate();

  const redirectToUser = () => {
    navigate("/admin/user");
  };

  const redirectToAdmin = () => {
    navigate("/admin");
  };

  return (
    <div className="Bandeau-admin">
        <img className="Logo-AD" src={Logo} alt="Logo" onClick={redirectToAdmin} />
      <img className="Logo-Admin" src={LogoAdmin} alt="Logo" onClick={redirectToUser} />
    </div>
  );
}

export default BandeauAdmin;