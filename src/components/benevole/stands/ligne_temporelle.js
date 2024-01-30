import React, { useState, useEffect } from 'react';
import Jauge from './jauge';
import "../../../styles/benevoles/ligne_temporelle.css";

const LigneTemporelle = ({ date, standId }) => {
    const [creneaux, setCreneaux] = useState([]);
  
    useEffect(() => {
      // Remplacez 'url-api' par l'URL réelle de votre API
      const fetchData = async () => {
        try {
          const response = await fetch(`http://localhost:3500/stands/date/${date}`);
          const data = await response.json();
          const stand = data.find(stand => stand._id === standId);
          setCreneaux(stand ? stand.horaireCota : []);
        } catch (error) {
          console.error("Erreur lors de la récupération des créneaux", error);
        }
      };
      fetchData();
    }, [date, standId]);
  
    return (
      <div className="jauges-container">
        {creneaux.map((creneau) => (
          <Jauge
            key={creneau._id} // Assurez-vous que chaque 'creneau' a un '_id' unique.
            capaciteTotale={creneau.nb_benevole}
            nombreInscrits={creneau.liste_benevole.length}
          />
        ))}
      </div>
    );
  };
  

export default LigneTemporelle;
