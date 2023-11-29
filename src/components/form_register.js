import React, { useReducer, useState } from 'react';
import Champ from './champ';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthWrapper';
import '../styles/login.css';

const FormInscription = () => {
  const formReducer = (state, action) => {
    switch (action.type) {
      case 'UPDATE_FIELD':
        return { ...state, [action.field]: action.value };
      default:
        return state;
    }
  };

  const [formData, dispatchFormData] = useReducer(formReducer, {
    nom: '',
    prenom: '',
    pseudo: '',
    password: '',
    association: '',
    taille_tshirt: '',
    vegetarien: '',
    hebergement: '',
    num_telephone: '',
    mail: '',
    admin: false,
    referent: false,
  });
  console.log(formData);

  const [pseudo, setPseudo] = useState('');
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    dispatchFormData({ type: 'UPDATE_FIELD', field: name, value });
  
    // Si le champ végétarien est sélectionné, convertir la valeur en booléen
    if (name === 'vegetarien') {
      const vegetarienValue = name === 'vegetarien' ? value === 'oui' : value;
      dispatchFormData({ type: 'UPDATE_FIELD', field: name, value : vegetarienValue});
    }
  
    // Update pseudo when changing in the name or surname fields
    if (name === 'nom' || name === 'prenom') {
      generatePseudo();
    }
  };

  const generatePseudo = () => {
    const { nom, prenom } = formData;
    if (nom && prenom) {
      const newPseudo = `${prenom}${nom.charAt(0)}`;
      setPseudo(newPseudo);
      dispatchFormData({ type: 'UPDATE_FIELD', field: 'pseudo', value: newPseudo });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await register(formData);

      if (response === 'success') {
        setSuccessMessage('Inscription réussie');
        setErrorMessage(null);
        navigate('/PageLogin');
      } else {
        setErrorMessage('L\'inscription a échoué');
        setSuccessMessage(null);
        // Handle other cases, display error messages, etc.
      }
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
      setErrorMessage('L\'inscription a échoué');
      setSuccessMessage(null);
      // Handle registration errors here
    }
  };

  return (
    <div className='Form-login'>
      <form onSubmit={handleSubmit}>
        
      <Champ label='Nom :'>
          <input
            className='customInput'
            type='text'
            name='nom'
            id='nom'
            value={formData.nom}
            onChange={handleInputChange}
            required
          />
        </Champ>

        <Champ label='Prenom :'>
          <input
            type='text'
            id='prenom'
            name='prenom'
            value={formData.prenom}
            onChange={handleInputChange}
            className='customInput'
            required
          />
        </Champ>

        <Champ label='Pseudo :'>
          <input
            type='text'
            name='pseudo'
            id='pseudo'
            value={pseudo}
            readOnly
            className='customInput'
            required
          />
        </Champ>

        <Champ label='Mot de passe :'>
          <input
            type='password'
            id='password'
            name='password'
            value={formData.password}
            onChange={handleInputChange}
            className='customInput'
            required
          />
        </Champ>

        <Champ label='Email :'>
          <input
            type='text'
            name='mail'
            id='mail'
            value={formData.mail}
            onChange={handleInputChange}
            className='customInput'
            required
          />
        </Champ>

        <Champ label='Taille de Tee-shirt :'>
          <input
            type='text'
            name='taille_tshirt'
            id='taille_tshirt'
            value={formData.taille_tshirt}
            onChange={handleInputChange}
            className='customInput'
            required
          />
        </Champ>

        <Champ label='Téléphone :'>
          <input
            type='tel'
            name='num_telephone'
            id='num_telephone'
            value={formData.num_telephone}
            onChange={handleInputChange}
            className='customInput'
          />
        </Champ>

        <Champ label='Association :'>
          <select
            name='association'
            id='association' 
            value={formData.association}
            onChange={handleInputChange}
            className='customInput'
            required
          >
            <option value=''>-- Sélectionnez une option --</option>
            <option value='APCU'>APCU</option>
            <option value='MEN'>MEN</option>
            <option value='SMI'>SMI</option>
          </select>
        </Champ>

        <Champ label='Hébergement :'>
          <select
            name='hebergement'
            id='hebergement'
            value={formData.hebergement}
            onChange={handleInputChange}
            className='customInput'
          >
            <option value="">-- Sélectionnez une option --</option>
//           <option value="recherche">Recherche</option>
//           <option value="proposition">Proposition</option>
//           <option value="rien">Rien</option>
          </select>
        </Champ>

        <Champ label='Végétarien ? :'>
          <select
            name='vegetarien'
            id='vegetarien'
            value={formData.vegetarien}
            onChange={handleInputChange}
            className='customInput'
          >
            <option value=''>-- Sélectionnez une option --</option>
            <option value='true'>oui</option>
            <option value='false'>non</option>
          </select>
        </Champ>

        {/* ... autres champs ... */}

        <div className='Container-bouton'>
          <button type='submit' className='CustomButton'>
            <span className='ButtonText'>Je m'inscris</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormInscription;
