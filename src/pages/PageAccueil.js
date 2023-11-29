import React from 'react';
import { Link } from 'react-router-dom';
import "../styles/Pages/pageAccueil.css";
import BandeauLogo from '../components/bandeauLogo';
import Boite from '../components/boite';
import Jauge from '../components/jauge';

function PageAccueil() {
  return (
    <div className="accueil">
      <BandeauLogo />
      <div className="Titre">
        <h1>Accueil</h1>
        <Link to="/profil"><h1>Profile</h1></Link>

        <Boite>
          <Jauge borderColor='#454C8B'> Accueil </Jauge>
          <Jauge borderColor='#949BC3'> Cuisine </Jauge>
          <Jauge borderColor='485F3F'> Animation Jeux </Jauge>
        </Boite>
      </div>
    </div>
  );
}

export default PageAccueil;
