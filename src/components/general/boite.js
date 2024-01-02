import React from 'react';
import "../../styles/boite.css";
import Titre from './titre';
import EnTete from './en_tete';


const Boite = ({ valeurDuTitre, children }) => {
  return (
    <div className="boite">
        <EnTete/>
        <Titre valeurDuTitre={valeurDuTitre}/> 
        {children}
    </div>
  );
}


export default Boite;
