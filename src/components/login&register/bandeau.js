import React from 'react';
import "../../styles/login&register/bandeau_login.css"
import Logo from '../../Logo/logo_long.png';

function Bandeau() {
  return (
    <div className="Bandeau">
      <img className="Logo" src={Logo} alt="Logo" />
    </div>

  );
}

export default Bandeau;
