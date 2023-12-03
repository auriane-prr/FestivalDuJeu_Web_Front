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

  return (
    <div className="profil">
      <BandeauLogo />
      <Boite valeurDuTitre="Informations personnelles">
        <div className="Container-profil-info">
        <Champ label="Pseudo :">
          <input 
          className='customInput'
          type="text"
          value={pseudoValue}
          readOnly={true}
          />
        </Champ>
        <Champ label="Nom :">
          <input 
          className='customInput'
          type="text"
          value={nomValue}
          onChange={handleNomChange} 
          />
        </Champ>
        <Champ label="Prenom :">
          <input 
          className='customInput'
          type="text"
          value={prenomValue}
          onChange={handlePrenomChange} 
          />
        </Champ>
        <Champ label="Nom Association :">
          <input 
          className='customInput'
          type="text"
          value={associationValue}
          onChange={handleAssociationChange} 
          />
        </Champ>
        <Champ label="taille_tshirt :">
          <input 
          className='customInput'
          type="text"
          value={taille_tshirtValue}
          onChange={handleTailleTshirtChange} 
          />
        </Champ>
        </div>
      </Boite>
    </div>
  );
}

export default PageProfil;


