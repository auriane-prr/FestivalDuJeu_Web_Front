import React, { useState, useEffect } from "react";
import Jauge from "./jauge";
import "../../../styles/benevoles/ligne_temporelle.css";

const LigneTemporelle = ({ date, standId, handleJaugeClick }) => {
  const [creneaux, setCreneaux] = useState([]);
  const [stand, setStand] = useState(null); // Ajout pour stocker les infos du stand
  const heures = ["9h", "11h", "14h", "17h", "20h", "22h"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3500/stands/date/${date}`
        );
        const data = await response.json();
        const fetchedStand = data.find((stand) => stand._id === standId);
        setCreneaux(fetchedStand ? fetchedStand.horaireCota : []);
        setStand(fetchedStand); // Stocker les infos du stand
      } catch (error) {
        console.error("Erreur lors de la récupération des créneaux", error);
      }
    };
    fetchData();
  }, [date, standId]);

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
