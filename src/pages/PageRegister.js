import React from 'react';
import Bandeau from '../components/bandeau';
import "../styles/Pages/pageRegister.css"
import Boite from '../components/boite';

function PageRegister() {
  return (
    <div className="accueil">
      <Bandeau />
      <Boite valeurDuTitre='Merci de vous joindre à nous pour cette nouvelle édition du Festival du Jeu à Montpellier !'/>
    </div>
  );
}

export default PageRegister;