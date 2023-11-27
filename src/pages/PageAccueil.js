import React from 'react';
import "../styles/Pages/pageAccueil.css"
import BandeauLogo from '../components/bandeauLogo';

function PageAccueil() {
  return (
    <div className="accueil">
      <BandeauLogo />
      <div className="Titre">
        <h1>Accueil</h1>
      </div>
    </div>
  );
}

export default PageAccueil;