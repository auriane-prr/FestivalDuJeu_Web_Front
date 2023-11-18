import React from 'react';
import "../styles/boite.css"
import BoutonConnexion from './bouton';
import Pseudo from './champ';
import MotDePasse from './champ';

function Boite() {
  return (
      <div className="Fond">
        <div className="EnTete" >
          <div className="Couleur1" />
          <div className="Couleur2"  />
          <div className="Couleur3" />
        </div> 
        <Pseudo/>
        <BoutonConnexion>Connexion</BoutonConnexion>
      </div>
    
  );
}

export default Boite;
