import React from 'react';
import "../../styles/boite.css";
import Titre from './titre';
import EnTete from './en_tete';


const Boite = ({ valeurDuTitre, children }) => {
  return (
    <div className="Container-boite">
    <div className="Fond">
        <EnTete/>
        <Titre valeurDuTitre={valeurDuTitre}/> 
        {children}
    </div>
    </div>
  );
}


export default Boite;
