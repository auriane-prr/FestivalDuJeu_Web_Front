import React, { useReducer, useState, useEffect } from 'react';
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

  const [pseudo, setPseudo] = useState('');
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isPopupVisible, setPopupVisible] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Cette fonction sera appelée après que le composant ait été rendu
    // et que setPseudo ait mis à jour l'état
    dispatchFormData({ type: 'UPDATE_FIELD', field: 'pseudo', value: pseudo });
  }, [pseudo]); // Assurez-vous d'ajouter pseudo comme dépendance ici

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const prevData = { ...formData };
    dispatchFormData({ type: 'UPDATE_FIELD', field: name, value });
  
    // Si le champ végétarien est sélectionné, convertir la valeur en booléen
    if (name === 'vegetarien') {
      const vegetarienValue = name === 'vegetarien' ? value === 'oui' : value;
      dispatchFormData({ type: 'UPDATE_FIELD', field: name, value : vegetarienValue});
    }
  
    // Update pseudo when changing in the name or surname fields
    if (name === 'prenom' || name === 'nom') {
        generatePseudo(e); 
    };
  };

  const generatePseudo = (e) => {
    const prenom = e.target.value;
    const { nom } = formData;
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
        setPopupVisible(true); // Afficher la fenêtre contextuelle
        // La redirection sera effectuée après que l'utilisateur a vu la fenêtre contextuelle
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setErrorMessage('L\'inscription a échoué');
        setSuccessMessage(null);
        setPopupVisible(true); // Afficher la fenêtre contextuelle
        // Handle other cases, display error messages, etc.
      }
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
      setErrorMessage('L\'inscription a échoué');
      setSuccessMessage(null);
      setPopupVisible(true); // Afficher la fenêtre contextuelle
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
            onChange={handleInputChange}
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
          <select
            type='text'
            name='taille_tshirt'
            id='taille_tshirt'
            value={formData.taille_tshirt}
            onChange={handleInputChange}
            className='customInput'
            required
          >
            <option value=''>-- Sélectionnez une option --</option>
            <option value='XS'>XS</option>
            <option value='S'>S</option>
            <option value='M'>M</option>
            <option value='L'>L</option>
            <option value='XL'>XL</option>
            <option value='XXL'>XXL</option>
          </select>
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
           <option value="recherche">Recherche</option>
           <option value="proposition">Proposition</option>
           <option value="rien">Rien</option>
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

        <div className='Container-bouton'>
          <button type='submit' className='CustomButton'>
            <span className='ButtonText'>Je m'inscris</span>
          </button>
        </div>


        {isPopupVisible && (
          <div className='popup'>
            <p>{successMessage || errorMessage}</p>
          <button onClick={() => setPopupVisible(false)}>Fermer</button>
        </div>
      )}

      </form>
    </div>

    
  );
};

export default FormInscription;
