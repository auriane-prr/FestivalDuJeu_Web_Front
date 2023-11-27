import React from 'react';
import "../styles/bandeau.css"
import Logo from '../Logo/logo_long.png';

function Bandeau() {
  return (
    <div className="Bandeau">
      <img className="Logo" src={Logo} alt="Logo" />
    </div>

  );
}

export default Bandeau;
