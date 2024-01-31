import React from "react";
import "../../../styles/benevoles/jauge.css";

const Jauge = ({
  capaciteTotale,
  nombreInscrits,
  onClick,
  heureDebut,
  heureFin
}) => {
  const pourcentageRemplissage =
    capaciteTotale > 0 ? (nombreInscrits / capaciteTotale) * 100 : 0;
  // Les jauges sont cliquables si elles ont une capacité et ne sont pas pleines (incluant les jauges vides)
  const isClickable = capaciteTotale > 0 && pourcentageRemplissage < 100;

  const handleClick = () => {
    if (isClickable) {
      onClick(); // Appeler onClick seulement si la jauge est cliquable
    }
  };

  let fillingClass = "";
  let textClass = "";

  // Détermination de la classe en fonction du remplissage
  if (pourcentageRemplissage === 100) {
    fillingClass = "jauge-filling--full";
    textClass = "jauge-text--full";
  } else if (pourcentageRemplissage > 0) {
    fillingClass = "jauge-filling--partial";
  } else {
    fillingClass = "jauge-filling--empty";
  }

  return (
    <div className="jauge-container" onClick={handleClick} style={{ cursor: isClickable ? 'pointer' : 'default' }}>
      <div className="jauge-text-extremite debut">{heureDebut}</div>
      <div className={`jauge-filling ${fillingClass}`} style={{ width: `${pourcentageRemplissage}%` }}></div>
      <div className={`jauge-text ${textClass}`}>{nombreInscrits}/{capaciteTotale}</div>
      <div className="jauge-text-extremite fin">{heureFin}</div>
    </div>
  );
};

export default Jauge;
