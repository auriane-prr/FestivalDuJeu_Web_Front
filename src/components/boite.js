import React from 'react';
import "../styles/boite.css"
import BoutonConnexion from './bouton';

function Boite() {
  return (
      <div className="Fond">
        <div className="EnTete" >
          <div className="Couleur1" />
          <div className="Couleur2"  />
          <div className="Couleur3" />
        </div> 
        <BoutonConnexion>Connexion</BoutonConnexion>
      </div>

  );
}

export default Boite;
