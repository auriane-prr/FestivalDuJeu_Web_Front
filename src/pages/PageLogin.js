import React from 'react';
import '../styles/Pages/pageLogin.css';
import Boite from '../components/boite';
import Bouton from '../components/bouton';
import Bandeau from '../components/bandeau';
import Login from '../components/login';
import Titre from '../components/titre';


function PageLogin() {
    return (
        <div className='Page'>
            <div className='Container-boite'>
                <Boite valeurDuTitre='Bienvenue à tous les bénévoles, passionés de jeu !'/>
            </div>
            <div className='Container-bouton'>
                <Bouton>S'inscrire</Bouton>
            </div>  
        </div>

    );
}

export default PageLogin;