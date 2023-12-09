import "../styles/Pages/pageProfil.css";
import React, { useState, useEffect } from 'react';
import BandeauLogo from "../components/bandeauLogo";
import Boite from '../components/boite';
import Champ from '../components/champ';
import { useAuth } from '../AuthWrapper';

function PageProfil() {
  const { user } = useAuth();
  const { userInfo = {} } = user;

  const { nom='', prenom='', pseudo='', association='', taille_tshirt='' } = userInfo;

  const [nomValue, setNom] = useState(nom);
  const [prenomValue, setPrenom] = useState(prenom);
  const [pseudoValue, setPseudo] = useState(pseudo);
  const [associationValue, setAssociation] = useState(association);
  const [taille_tshirtValue, setTailleTshirt] = useState(taille_tshirt);
  const [passwordValue, setPassword] = useState('');
  const [mailValue, setMail] = useState('');
  const [telephoneValue, setTelephone] = useState('');
  const [vegetarienValue, setVegetarien] = useState('');

  
  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const token = localStorage.getItem('authToken');
        const pseudo = localStorage.getItem('pseudo');
        
        const response = await fetch(`http://localhost:3500/benevole/${pseudo}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        console.log('le user :',pseudo);
        console.log(`http://localhost:3500/benevole/${pseudo}`);
        

        if (response.ok) {
          const {benevole} = await response.json();
          setPseudo(benevole.pseudo || '');
          setNom(benevole.nom || '');
          setPrenom(benevole.prenom || '');
          setAssociation(benevole.association || '');
          setTailleTshirt(benevole.taille_tshirt || '');
          setPassword(benevole.password || '');
          setMail(benevole.mail || '');
          setTelephone(benevole.num_telephone || '');
          setVegetarien(benevole.vegetarien || '');
          console.log(benevole);
          console.log('nom : ',benevole.nom);
        } else {
          throw new Error('Erreur lors de la récupération des informations utilisateur');
        }
      } catch (error) {
        console.error('Une erreur s\'est produite lors de la récupération des informations utilisateur', error);
        // Gérer l'erreur, par exemple afficher un message d'erreur à l'utilisateur
      }
    }

    fetchUserProfile();
  }, [pseudo]); 

  const handleNomChange = (e) => {
    setNom(e.target.value);
  };

  const handlePrenomChange = (e) => {
    setPrenom(e.target.value);
  };

  const handleAssociationChange = (e) => {
    setAssociation(e.target.value);
  };

  const handleTailleTshirtChange = (e) => {
    setTailleTshirt(e.target.value);
  }

  const handleMailChange = (e) => {
    setMail(e.target.value);
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  }

  const handleTelephoneChange = (e) => {
    setTelephone(e.target.value);
  }

  const handleVegetarienChange = (e) => {
    setVegetarien(e.target.value);
  }

  return (
    <div className="profil">
      <BandeauLogo />
      <Boite valeurDuTitre="Informations Personnelles">
        <div className="Container-profil-info">
        <Champ label="Pseudo :">
          <input 
          className='input'
          type="text"
          value={pseudoValue}
          readOnly={true}
          />
        </Champ>
        <Champ label="Nom :">
          <input 
          className='input'
          type="text"
          value={nomValue}
          onChange={handleNomChange} 
          />
        </Champ>
        <Champ label="Prenom :">
          <input 
          className='input'
          type="text"
          value={prenomValue}
          onChange={handlePrenomChange} 
          />
        </Champ>
        <Champ label='Mot de passe :'>
          <input
            type='password'
            id='password'
            name='password'
            value={passwordValue}
            onChange={handlePasswordChange}
            className='input'
            required
          />
        </Champ>
        <Champ label='Email :'>
          <input
            type='text'
            name='mail'
            id='mail'
            value={mailValue}
            onChange={handleMailChange}
            className='input'
            required
          />
        </Champ>
        <Champ label="Association :">
          <input 
          className='input'
          type="text"
          value={associationValue}
          onChange={handleAssociationChange} 
          />
        </Champ>
        <Champ label="Taille de tee-shirt :">
          <input 
          className='input'
          type="text"
          value={taille_tshirtValue}
          onChange={handleTailleTshirtChange} 
          />
        </Champ>
        <Champ label='Téléphone :'>
          <input
            type='tel'
            name='num_telephone'
            id='num_telephone'
            value={telephoneValue}
            onChange={handleTelephoneChange}
            className='input'
          />
        </Champ>
        <Champ label="Végétarien :">
          <input 
          className='input'
          type="text"
          value={vegetarienValue}
          onChange={handleVegetarienChange} 
          />
        </Champ>
        
        </div>
      </Boite>
    </div>
  );
}

export default PageProfil;


