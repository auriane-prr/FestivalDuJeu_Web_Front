import React from 'react';
import "../styles/Pages/pageAccueil.css"
import BandeauLogo from '../components/bandeauLogo';
import Boite from '../components/boite';

function PageAccueil() {
  return (
    <div className="accueil">
      <BandeauLogo />
      <div className="Titre">
        <h1>Accueil</h1>
        <Boite></Boite>
        
      </div>
    </div>
  );
}

export default PageAccueil;