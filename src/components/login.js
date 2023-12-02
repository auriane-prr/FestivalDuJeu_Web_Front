import React, { useReducer, useState } from 'react';
import Champ from './champ';
import '../styles/login.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthWrapper';

const Login = () => {
  const [formData, setFormData] = useReducer((formData, newItem) => {
    return { ...formData, ...newItem };
  }, { pseudo: "", password: "" });

  const navigate = useNavigate();
  const { login } = useAuth();
  const [errorMessage, setErrorMessage] = useState(null);

  const doLogin = async () => {
    try {
      const response = await login(formData.pseudo, formData.password);
      const { token } = response;
      localStorage.setItem('authToken', token);
      localStorage.setItem('pseudo', formData.pseudo);
  
      navigate("/accueil");
    } catch (error) {
      setErrorMessage('Identifiants invalides'); // Message spécifique pour des identifiants invalides
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
            className='customInput'
            type='text'
            value={formData.pseudo}
            onChange={(e) => setFormData({ pseudo: e.target.value })}
            required
          />
        </Champ>
        <Champ label='Mot de passe :'>
          <input
            className='customInput'
            type='password'
            value={formData.password}
            onChange={(e) => setFormData({ password: e.target.value })}
            required
          />
        </Champ>
        
        <div className="Container-bouton">
          <button type='submit' onClick={doLogin} className="CustomButton">
            <span className="ButtonText">
              Connexion
            </span>
          </button>
        </div>
        {errorMessage ? <div className="error">{errorMessage}</div> : null}
      </form>
    </div>
  );
};


export default Login;

