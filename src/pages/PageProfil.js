import "../styles/Pages/pageProfil.css";
import React, { useState } from 'react';
import Bandeau from "../components/bandeau";
import Boite from '../components/boite';
import Champ from '../components/champ';
import { useAuth } from '../AuthWrapper';

function PageProfil() {
  const { user } = useAuth();

  const { nom, prenom, pseudo, association, taille_tshirt } = user.userInfo;

  const [nomValue, setNom] = useState(nom || '');
  const [prenomValue, setPrenom] = useState(prenom || '');
  const [pseudoValue] = useState(pseudo || '');
  const [associationValue, setAssociation] = useState(association || '');
  const [taille_tshirtValue, setTailleTshirt] = useState(taille_tshirt || '');

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

console.log(user);
  return (
    <div className="profil">
      <Bandeau />
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


