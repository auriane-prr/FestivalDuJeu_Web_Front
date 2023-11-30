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
      localStorage.setItem('authToken', token); // Stocker le token dans le localStorage
  
      navigate("/accueil");
    } catch (error) {
      setErrorMessage(error);
    }
  };
  const fetchUserProfile = async () => {
    const token = localStorage.getItem('authToken');
    const response = await fetch('http://localhost:3500/benevole/${formData.pseudo}', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Inclure le token dans l'en-tête Authorization
      }
    });
  }
  
  

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('pseudo:', formData.pseudo);
    console.log('Mot de passe:', formData.password);
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

