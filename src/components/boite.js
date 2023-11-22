import React from 'react';
import "../styles/boite.css"
import Bouton from './bouton';
import Login from './login';
import Titre from './titre';


const Boite = ({ valeurDuTitre }) => {
  return (
    <div className="Fond">
        <div className="EnTete" >
            <div className="Couleur1" />
            <div className="Couleur2" />
            <div className="Couleur3" />
        </div>
        <Titre valeur='Bienvenue à tous les bénévoles, passionés de jeu !'/>
        <Login/>
        <Bouton>Connexion</Bouton>       
    </div>
    
  );
}


export default Boite;
