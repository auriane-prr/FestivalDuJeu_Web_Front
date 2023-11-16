import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import Bandeau from './components/bandeau';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Bandeau />
  </React.StrictMode>
);

reportWebVitals();
