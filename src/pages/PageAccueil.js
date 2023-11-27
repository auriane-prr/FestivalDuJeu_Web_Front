import React from 'react';
import Bandeau from '../components/bandeau';
import "../styles/Pages/pageAccueil.css"

function PageAccueil() {
  return (
    <div className="accueil">
      <Bandeau />
      <div className="Titre">
        <h1>Accueil</h1>
      </div>
    </div>
  );
}

export default PageAccueil;