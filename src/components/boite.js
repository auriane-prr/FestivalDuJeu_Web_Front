import React from 'react';
import "../styles/boite.css"
import Bouton from './bouton';
import Login from './login';

function Boite() {
  return (
    <div className="Fond">
        <div className="EnTete" >
            <div className="Couleur1" />
            <div className="Couleur2" />
            <div className="Couleur3" />
        </div>
        <div className='Titre'>
            <h2>Bienvenue à tous les bénévoles</h2>
            <h2>passionnés de jeux !</h2>
        </div>
        <Login />
        <Bouton>Connexion</Bouton>       
    </div>
    
  );
}


export default Boite;
