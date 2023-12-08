import React, { useReducer, useState } from 'react';
import Champ from './champ';
import '../styles/login.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthWrapper';
import FenetrePopup from './fenetre_popup';

const Login = () => {
  const [formData, setFormData] = useReducer((formData, newItem) => {
    return { ...formData, ...newItem };
  }, { pseudo: "", password: "" });

  const navigate = useNavigate();
  const { login } = useAuth();
  const [errorMessage, setErrorMessage] = useState(null);
  const [isPopupVisible, setPopupVisible] = useState(false);

  const hidePopup = () => {
    setPopupVisible(false);
  };
  
  const doLogin = async () => {
    try {
      const response = await login(formData.pseudo, formData.password);
      const { token } = response;
      localStorage.setItem('authToken', token);
      localStorage.setItem('pseudo', formData.pseudo);
  
      navigate("/accueil");
    } catch (error) {
      setErrorMessage('Identifiants invalides');
      setPopupVisible(true);  // Afficher la popup en cas d'identifiants invalides
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.pseudo || !formData.password) {
      setErrorMessage('Veuillez saisir un pseudo et un mot de passe'); // Message si des champs sont vides
      return;
    }

    try {
      await doLogin();
    } catch (error) {
      console.error('Erreur lors de la tentative de connexion :', error);
      setErrorMessage('Une erreur s\'est produite lors de la connexion');
    }
  };

  return (
    <div className='Form-login'>
      <form onSubmit={handleSubmit}>
        <Champ label='Pseudo :'>
          <input
            className='input'
            type='text'
            value={formData.pseudo}
            onChange={(e) => setFormData({ pseudo: e.target.value })}
            required
          />
        </Champ>
        <Champ label='Mot de passe :'>
          <input
            className='input'
            type='password'
            value={formData.password}
            onChange={(e) => setFormData({ password: e.target.value })}
            required
          />
        </Champ>
        
        <div className='button_container'>
          <button type='submit' onClick={doLogin}>
            <span className="shadow"></span>
            <span className="edge"></span>
            <span className="front text"> Connexion </span>
          </button>
        </div>
      </form>

      {errorMessage && isPopupVisible && (
        <FenetrePopup
          message={errorMessage}
          type="error"
          onClose={hidePopup}
        />
      )}

    </div>
  );
};


export default Login;

