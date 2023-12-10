import "../styles/Pages/pageProfil.css";
import React, { useState, useEffect } from 'react';
import BandeauLogo from "../components/bandeauLogo";
import Boite from '../components/boite';
import Champ from '../components/champ';
import { useAuth } from '../AuthWrapper';

function PageProfil() {
  const { user } = useAuth();
  const { userInfo = {} } = user;

  const { nom = '', prenom = '', pseudo = '', association = '', taille_tshirt = '', password = '', mail = '', num_telephone = '', vegetarien = '', hebergement = '', adresse = '' } = userInfo;
  const [editMode, setEditMode] = useState(false);

  const [nomValue, setNom] = useState(nom);
  const [prenomValue, setPrenom] = useState(prenom);
  const [pseudoValue, setPseudo] = useState(pseudo);
  const [associationValue, setAssociation] = useState(association);
  const [taille_tshirtValue, setTailleTshirt] = useState(taille_tshirt);
  const [passwordValue, setPassword] = useState(password);
  const [mailValue, setMail] = useState(mail);
  const [telephoneValue, setTelephone] = useState(num_telephone);
  const [vegetarienValue, setVegetarien] = useState(vegetarien);
  const [hebergementValue, setHebergement] = useState(hebergement);
  const [adresseValue, setAdresse] = useState(adresse);

  const handleEditModeToggle = () => {
    setEditMode(!editMode);
  };
  
  
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

        if (response.ok) {
          const { benevole } = await response.json();
          setPseudo(benevole.pseudo || '');
          setNom(benevole.nom || '');
          setPrenom(benevole.prenom || '');
          setAssociation(benevole.association || '');
          setTailleTshirt(benevole.taille_tshirt || '');
          setPassword(benevole.password || '');
          setMail(benevole.mail || '');
          setTelephone(benevole.num_telephone || '');
          setVegetarien(benevole.vegetarien || '');
          setHebergement(benevole.hebergement || '');
          setAdresse(benevole.adresse || '');
        } else {
          throw new Error('Erreur lors de la récupération des informations utilisateur');
        }
      } catch (error) {
        console.error('Une erreur s\'est produite lors de la récupération des informations utilisateur', error);
        // Gérer l'erreur, par exemple afficher un message d'erreur à l'utilisateur
      }
    }
    fetchUserProfile();
  }, [userInfo.pseudo]);


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
    setVegetarien(e.target.value === 'Oui');
  }
  

  const handleHebergementChange = (e) => {
    setHebergement(e.target.value);
  }

  const handleAdresseChange = (e) => {
    setAdresse(e.target.value);
  }

  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const pseudo = localStorage.getItem('pseudo');
  
      // Construisez l'objet avec les modifications à envoyer au serveur
      const modifiedData = {
        nom: nomValue,
        prenom: prenomValue,
        mail: mailValue,
        password: passwordValue,
        num_telephone: telephoneValue,
        association: associationValue,
        taille_tshirt: taille_tshirtValue,
        vegetarien: vegetarienValue,
        hebergement: hebergementValue,
        adresse: adresseValue,
      };
  
      // Effectuez la requête PUT au serveur avec les données modifiées
      const response = await fetch(`http://localhost:3500/benevole/${pseudo}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(modifiedData),
      });
  
      if (!token) {
        console.error('Token d\'authentification non trouvé');
        return;
      }
  
      if (response.ok) {
        // Les modifications ont été enregistrées avec succès
        console.log('Modifications enregistrées avec succès');
        // Désactivez le mode édition après avoir sauvegardé les modifications
        setEditMode(false);
      } else {
        // Gérez les erreurs liées à la requête
        console.error('Erreur lors de la sauvegarde des modifications', response.status, response.statusText);
      }
    } catch (error) {
      // Gérez les erreurs liées à la requête
      console.error('Erreur lors de la sauvegarde des modifications', error);
    }
  };

  return (
    <div>
      <BandeauLogo />
      <Boite valeurDuTitre={pseudoValue}>
        <div className="Container-profil-info">
        <Champ label="Nom :">
          <input 
          className='input'
          type="text"
          value={nomValue}
          onChange={handleNomChange} 
          readOnly={!editMode}
          />
        </Champ>
        <Champ label="Prénom :">
          <input 
          className='input'
          type="text"
          value={prenomValue}
          onChange={handlePrenomChange} 
          readOnly={!editMode}
          />
        </Champ>
        <Champ label='Mot de passe :'>
          <input
            type='password'
            id='password'
            name='password'
            value={passwordValue}
            readOnly={!editMode}
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
            readOnly={!editMode}
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
          readOnly={!editMode}
          />
        </Champ>
        <Champ label="Taille de tee-shirt :">
          <input 
          className='input'
          type="text"
          value={taille_tshirtValue}
          onChange={handleTailleTshirtChange} 
          readOnly={!editMode}
          />
        </Champ>
        {telephoneValue && (
        <Champ label='Téléphone :'>
          <input
            type='tel'
            name='num_telephone'
            id='num_telephone'
            value={telephoneValue}
            onChange={handleTelephoneChange}
            readOnly={!editMode}
            className='input'
          />
        </Champ>
        )}
        <Champ label="Végétarien :">
          <input
            className='input'
            type="text"
            value={vegetarienValue ? 'Oui' : 'Non'}
            readOnly={!editMode}
            onChange={handleVegetarienChange}
          />
        </Champ>
        <Champ label='Hébergement :'>
          <input
            name='hebergement'
            id='hebergement'
            value={hebergementValue}
            onChange={handleHebergementChange}
            readOnly={!editMode}
            className='input'
            required
          />
        </Champ>
        {adresseValue && (
          <Champ label='Adresse :'>
            <input
            type='text'
            name='adresse'
            id='adresse'
            value={adresseValue}
            onChange={handleAdresseChange}
            readOnly
            className='input'
            />
          </Champ>
        )}
        </div>
      </Boite>
      <div className='button_container'>
        {editMode ? (
          <button type='button' onClick={handleSaveChanges}>
            <span className="shadow"></span>
            <span className="edge"></span>
            <span className="front text"> Enregistrer </span>
          </button>
        ) : (
          <button type='button' onClick={handleEditModeToggle}>
            <span className="shadow"></span>
            <span className="edge"></span>
            <span className="front text"> Modifier </span>
          </button>
        )}
      </div>
    </div>
  );
}

export default PageProfil;