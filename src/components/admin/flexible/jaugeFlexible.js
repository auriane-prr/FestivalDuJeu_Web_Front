import React from 'react';
const JaugeFlexible= ({ nomStand, capaciteTotale, nombreInscrits, onClick }) => {
    const pourcentageRemplissage = capaciteTotale > 0 ? (nombreInscrits / capaciteTotale) * 100 : 0;
    const isClickable = capaciteTotale > 0 && pourcentageRemplissage < 100;
  
    let fillingClass = "";
    if (pourcentageRemplissage === 100) {
      fillingClass = "jauge-filling--full";
    } else if (pourcentageRemplissage > 0) {
      fillingClass = "jauge-filling--partial";
    } else {
      fillingClass = "jauge-filling--empty";
    }
  
    return (
      <div className="jauge-stand-container" onClick={isClickable ? onClick : null} style={{ cursor: isClickable ? 'pointer' : 'default' }}>
        <div className="jauge-stand-nom">{nomStand}</div>
        <div className={`jauge-stand-filling ${fillingClass}`} style={{ width: `${pourcentageRemplissage}%` }}></div>
      </div>
    );
  };

export default JaugeFlexible;
  