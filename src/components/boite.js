import React from 'react';
import "../styles/boite.css";
import Titre from './titre';


const Boite = ({ valeurDuTitre, children }) => {
  return (
    <div className="Container-boite">
    <div className="Fond">
        <div className="EnTete" >
            <div className="Couleur1" />
            <div className="Couleur2" />
            <div className="Couleur3" />
        </div>
        <Titre valeurDuTitre={valeurDuTitre}/> 
        {children}
    </div>
    </div>
  );
}


export default Boite;
