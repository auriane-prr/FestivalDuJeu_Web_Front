import React, { useState } from 'react';
import Champ from './champ';
import'../styles/login.css';



const Login = () => {
    const [pseudo, setpseudo] = useState('');
    const [password, setPassword] = useState('');
  
    const handlepseudoChange = (e) => {
      setpseudo(e.target.value);
    };
  
    const handlePasswordChange = (e) => {
      setPassword(e.target.value);
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      // Ajoutez ici la logique de validation et de gestion de connexion
      console.log('pseudo:', pseudo);
      console.log('Mot de passe:', password);
      // Réinitialise les champs après la soumission
      setpseudo('');
      setPassword('');
    };
  
    return (
      <div className='Form-login'>
              <form onSubmit={handleSubmit}>
                  <Champ label="Pseudo :">
                      <input 
                          className='customInput'
                          type="text"
                          value={pseudo}
                          onChange={handlepseudoChange}
                          required
                      />
                  </Champ>
                  <Champ label="Mot de passe :">
                      <input
                          className='customInput'
                          type="password"
                          value={password}
                          onChange={handlePasswordChange}
                          required
                      />
                  </Champ>
              </form>
          </div>
    );
  };
  
  export default Login;