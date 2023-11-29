import React from 'react';
import Bandeau from '../components/bandeau';
import "../styles/Pages/pageRegister.css"
import Boite from '../components/boite';
import FormInscription from '../components/form_register';

function PageRegister() {
  return (
    <div>
      <Bandeau />
      <Boite valeurDuTitre='Merci de vous joindre à nous pour cette nouvelle édition du Festival du Jeu à Montpellier !'>
        <FormInscription />
      </Boite>
    </div>
  );
}

export default PageRegister;