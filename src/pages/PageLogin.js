import React from 'react';
import '../styles/Pages/pageLogin.css';
import Boite from '../components/boite';
import Bouton from '../components/bouton';
import Bandeau from '../components/bandeau';


function PageLogin() {
    return (
        <>
            <Bandeau />
                <Boite valeurDuTitre='Bienvenue à tous les bénévoles, passionés de jeu !'/>
            <Bouton>S'inscrire</Bouton>
        </> // jsp à quoi ça sert mais ça marche pas sans

    );
}

export default PageLogin;