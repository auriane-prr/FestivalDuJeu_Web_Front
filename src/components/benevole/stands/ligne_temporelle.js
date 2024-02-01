import React, { useState, useEffect } from "react";
import Jauge from "./jauge";
import "../../../styles/benevoles/ligne_temporelle.css";

const LigneTemporelle = ({ date, id, type, handleJaugeClick }) => {
  const [creneaux, setCreneaux] = useState([]);
  const [stand, setStand] = useState(null); // Ajout pour stocker les infos du stand
  const heures = ["9h", "11h", "14h", "17h", "20h", "22h"];

  useEffect(() => {
    const fetchData = async () => {
      let url;
      switch (type) {
        case 'stand':
          url = `http://localhost:3500/stands/date/${date}`;
          break;
        case 'zonePlan':
          url = `http://localhost:3500/zonePlan/date/${date}`;
          break;
        case 'zoneBenevole':
          url = `http://localhost:3500/zoneBenevole/date/${date}`;
          break;
        default:
          // Gérer les cas d'erreur ou les types inconnus
          console.error("Type inconnu pour la récupération des données");
          return;
      }

      try {
        const response = await fetch(url);
        const data = await response.json();
        // Utilisez id pour trouver l'élément spécifique si nécessaire, ou ajustez en fonction de la structure de données de l'API
        const item = data.find((item) => item._id === id);
        setCreneaux(item ? item.horaireCota : []);
        setStand(item); // Stocker les infos de l'élément (peut être un stand ou une zone)
      } catch (error) {
        console.error("Erreur lors de la récupération des créneaux", error);
      }
    };

    if (date && id && type) {
      fetchData();
    }
  }, [date, id, type]);

  return (
    <div className="ligne-container">
      {creneaux.map((creneau, index) => {
        // Afficher l'heure de début pour chaque jauge
        const heureDebut = heures[index];

        // Afficher l'heure de fin seulement pour la dernière jauge
        const heureFin = index === creneaux.length - 1 ? heures[index + 1] : "";

        return (
          <Jauge
            key={index}
            capaciteTotale={creneau.nb_benevole}
            nombreInscrits={creneau.liste_benevole ? creneau.liste_benevole.length : 0}
            onClick={() => handleJaugeClick(creneau, stand)}
            heureDebut={heureDebut}
            heureFin={heureFin}
          />
        );
      })}
    </div>
  );
};

export default LigneTemporelle;
