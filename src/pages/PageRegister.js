import React from 'react';
import Bandeau from '../components/bandeau';
import Boite from '../components/boite';
import FormInscription from '../components/form_register';
import '../styles/Pages/pageRegister.css';

function PageRegister() {
  return (
    <div className="page-container">
      <Bandeau />
        <Boite valeurDuTitre={'Merci de vous joindre à nous pour cette nouvelle édition du Festival du Jeu à Montpellier !'}>
          <FormInscription />
        </Boite>
    </div>
  );
}

export default PageRegister;