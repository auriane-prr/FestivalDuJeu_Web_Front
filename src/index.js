import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import Bandeau from './components/bandeau';
import Boite from './components/boite';
import Bouton from './components/bouton';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Bandeau />
    <div className='Page'>
    <div className='Container-boite'>
      <Boite />
    </div>
      <div className='Container-bouton'>
        <Bouton>S'inscrire</Bouton>
    </div>  
    </div>
  </React.StrictMode>
);

reportWebVitals();
