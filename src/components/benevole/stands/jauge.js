import React from 'react';

const Jauge = ({ capaciteTotale, nombreInscrits }) => {
  // Calcul du pourcentage de remplissage de la jauge
  const pourcentageRemplissage = (nombreInscrits / capaciteTotale) * 100;

  return (
    <div style={{ border: '1px solid #ccc', width: '20%', height: '50px', cursor: 'pointer' }}>
      <div style={{
        width: `${pourcentageRemplissage}%`,
        height: '100%',
        backgroundColor: pourcentageRemplissage === 100 ? 'red' : 'green',
        transition: 'width 0.5s ease-in-out'
      }}>
        {nombreInscrits}/{capaciteTotale}
      </div>
    </div>
  );
};

export default Jauge;

