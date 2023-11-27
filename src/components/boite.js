import React from 'react';
import "../styles/boite.css";
import Login from './form';
import Titre from './titre';


const Boite = ({ valeurDuTitre }) => {
  return (
    <div className="Container-boite">
      <div className="Fond">
          <div className="EnTete" >
            <div className="Couleur1" />
            <div className="Couleur2" />
            <div className="Couleur3" />
          </div>
          <Titre valeurDuTitre={valeurDuTitre}/> 
          <Login />
      </div>
    </div>
  );
}


export default Boite;
