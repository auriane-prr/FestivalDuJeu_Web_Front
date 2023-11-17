import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
// import BandeauLogo from './components/bandeauLogo';
import Bandeau from './components/bandeau';
import Boite from './components/boite';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Bandeau />
    { <div className='Container'>
      <Boite />
    </div> }
  </React.StrictMode>
);

reportWebVitals();
