import React from 'react';
import Bandeau from '../../components/login&register/bandeau';
import Boite from '../../components/general/boite';
import FormInscription from '../../components/login&register/form_register';
import '../../styles/Pages/login&register/pageRegister.css';

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