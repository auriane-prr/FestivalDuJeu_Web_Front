import React from 'react';
import Bandeau from '../components/bandeau';
import "../styles/Pages/pageRegister.css"

function PageRegister() {
  return (
    <div className="accueil">
      <Bandeau />
      <div className="Titre">
        <h1>Register</h1>
      </div>
    </div>
  );
}

export default PageRegister;