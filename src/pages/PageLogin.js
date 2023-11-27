import React from 'react';
import Boite from '../components/boite';
import Bouton from '../components/bouton';
import Bandeau from '../components/bandeau';
import "../styles/Pages/pageLogin.css"


function PageLogin() {
    return (
        <div className='Page_login'>
            <Bandeau />
                <Boite valeurDuTitre='Bienvenue à tous les bénévoles, passionés de jeu !'/>
            <Bouton>S'inscrire</Bouton>
        </div> // jsp à quoi ça sert mais ça marche pas sans

    );
}

export default PageLogin;