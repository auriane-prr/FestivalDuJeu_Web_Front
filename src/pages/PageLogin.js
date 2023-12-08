import React from 'react';
import { Link } from 'react-router-dom';
import Boite from '../components/boite';
import Bandeau from '../components/bandeau';
import "../styles/Pages/pageLogin.css"
import Login from '../components/login';
import Titre from '../components/titre';


function PageLogin() {
    return (
        <div>
            <Bandeau />
                <Boite valeurDuTitre='Bienvenue à tous les bénévoles, passionés de jeu !'>
                    <Login />
                </Boite>
                <Titre valeurDuTitre="Si tu n'as pas encore de compte, tu peux en créer un ici :" />
                <Link to="/register" style={{ textDecoration: 'none' }}>
                    <div className='button_container'>
                        <button type='submit'>
                            <span className="shadow"></span>
                            <span className="edge"></span>
                            <span className="front text"> S'inscire </span>
                        </button>
                    </div>
                </Link>
        </div> // jsp à quoi ça sert mais ça marche pas sans

    );
}

export default PageLogin;