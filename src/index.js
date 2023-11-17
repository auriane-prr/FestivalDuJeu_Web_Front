import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import BandeauLogo from './components/bandeauLogo';
import Bandeau from './components/bandeau';
import Boite from './components/boite';
import Bouton from './components/bouton';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BandeauLogo />
    <div className='Container'>
      <Boite />
      <div className='Bouton-Container'>
        <Bouton>Je me connecte</Bouton>
      </div>
    </div>
  </React.StrictMode>
);

reportWebVitals();
