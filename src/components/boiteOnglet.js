import React, { useState } from 'react';
import '../styles/boiteOnglet.css';

const BoiteOnglet = ({ children,nomOnglet1,nomOnglet2 }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (tabIndex) => {
    setActiveTab(tabIndex);
  };

  return (
    <div className="Container-boite">
      <div className="Fond">
        <div className="EnTete">
          <div
            className={activeTab === 0 ? 'Couleur1Onglet active' : 'Couleur1Onglet'}
            onClick={() => handleTabClick(0)}
          >
            {nomOnglet1}
          </div>
          <div
            className={activeTab === 1 ? 'Couleur2Onglet active' : 'Couleur2Onglet'}
            onClick={() => handleTabClick(1)}
          >
            {nomOnglet2}
          </div>
        </div>
        <div className="TabContent">{children[activeTab]}</div>
      </div>
    </div>
  );
};

export default BoiteOnglet;
