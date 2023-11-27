import React from 'react';
import { Link } from 'react-router-dom';
import Boite from '../components/boite';
import Bouton from '../components/bouton';
import Bandeau from '../components/bandeau';
import "../styles/Pages/pageLogin.css"
import Login from '../components/login';


function PageLogin() {
    return (
        <div>
            <Bandeau />
                <Boite valeurDuTitre='Bienvenue à tous les bénévoles, passionés de jeu !'>
                    <Login />
                </Boite>
                <div className="Container-texte">
                    <h2>Si tu n'as pas encore de compte, tu peux en créer un ici :</h2>
                </div>
                <Link to="/register">
                    <Bouton>S'inscrire</Bouton>
                </Link>
        </div> // jsp à quoi ça sert mais ça marche pas sans

    );
}

export default PageLogin;