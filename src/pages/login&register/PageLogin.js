import React from 'react';
import { Link } from 'react-router-dom';
import Boite from '../../components/general/boite';
import Bandeau from '../../components/login&register/bandeau';
import "../../styles/Pages/login&register/pageLogin.css"
import Login from '../../components/login&register/login';
import Titre from '../../components/general/titre';
import Bouton from '../../components/general/bouton';


function PageLogin() {
    return (
        <div>
            <Bandeau />
                <Boite valeurDuTitre='Bienvenue à tous les bénévoles, passionés de jeu !'>
                    <Login />
                </Boite>
                <Titre valeurDuTitre="Si tu n'as pas encore de compte, tu peux en créer un ici :" />
                <div className='button_container'>
                     <Link to="/register" style={{ textDecoration: 'none' }}>
                        <Bouton>S'inscrire</Bouton>
                    </Link>
                </div>
        </div> // jsp à quoi ça sert mais ça marche pas sans

    );
}

export default PageLogin;