import React, { useState, useEffect } from 'react';
import Champ from '../../general/champ';


function Display_jeux() {
    const [selectedZone, setSelectedZone] = useState('');
    const [jeux, setJeux] = useState([]);

    const ZoneList = ({ onSelectZone }) => {
        const [zones, setZones] = useState([]);
      
        // Récupérer les zones dès le chargement du composant
        useEffect(() => {
          fetch('http://localhost:3500/jeux/zones')
            .then(response => response.json())
            .then(data => setZones(data))
            .catch(error => console.error('Erreur lors de la récupération des zones', error));
            console.log(zones);
        }, []);
      
        return (
          <select onChange={(e) => onSelectZone(e.target.value)} defaultValue="">
            <option value="" disabled>Sélectionnez une zone</option>
            {zones.map((zone, index) => (
              <option key={index} value={zone}>{zone}</option>
            ))}
          </select>
        );
      };

    
     // Récupération des jeux pour la zone sélectionnée
    useEffect(() => {
    if (selectedZone) {
      fetch(`http://localhost:3500/jeux/jeuxParZone/${selectedZone}`)
        .then(response => response.json())
        .then(data => setJeux(data))
        .catch(error => console.error('Erreur lors de la récupération des jeux', error));
    }
  }, [selectedZone]);

  // Composant ou fonction pour afficher les jeux
  const renderJeux = () => {
    return jeux.map((jeu, index) => (
      <div key={index}>
        {/* Ici, mettez en forme les informations du jeu comme dans l'exemple d'image */}
        <h2>{jeu.nom_jeu}</h2>
        <p>Éditeur: {jeu.editeur}</p>
        <p>Âge minimum: {jeu.ageMin}</p>
        <p>Durée: {jeu.duree}</p>
        <p>Thème: {jeu.theme}</p>
        <p>Mécanisme: {jeu.mecanisme}</p>
        <p>Tags: {jeu.tags}</p>
        <p>Description: {jeu.description}</p>
        <p>Nombre de joueurs: {jeu.nbJoueurs}</p>
        <p>Animation requise: {jeu.animationRequise ? 'Oui' : 'Non'}</p>
        <p>Lien: {jeu.lien}</p>
        <p>Logo: {jeu.logo}</p>
      </div>
    ));
  };

  return (
    <div>
      <ZoneList onSelectZone={setSelectedZone} />
      <div>{renderJeux()}</div>
    </div>
  );
}

export default Display_jeux;
