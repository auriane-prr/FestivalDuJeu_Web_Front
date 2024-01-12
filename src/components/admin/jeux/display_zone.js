import React, { useState } from "react";
import "../../../styles/Admin/jeux/display_jeux.css";
import Champ from "../../general/champ";
import BoutonPagePrecedente from "../../BoutonPagePrecedente";
import BoutonPageSuivante from "../../BoutonPageSuivante";
import Download from "./download";
import Titre from "../../general/titre";

function Display_zones() {
  const [selectedZone, setSelectedZone] = useState("");
  const [currentZoneIndex, setCurrentZoneIndex] = useState(0);
//   const currentZone = zones[currentZoneIndex] || {};
  const [jeux, setJeux] = useState([]);
  const [zones, setZones] = useState([]);

  const showPreviousZone = () => {
    setCurrentZoneIndex((prevIndex) => {
      if (prevIndex === 0) {
        return zones.length - 1;
      } else {
        return prevIndex - 1;
      }
    });
  };

  const showNextZone = () => {
    setCurrentZoneIndex((prevIndex) => {
      if (prevIndex === zones.length - 1) {
        return 0;
      } else {
        return prevIndex + 1;
      }
    });
  };

  return (
    <>
      <div className="header-container">
        <Download />
        <Champ customStyle={{ width: "70%" }}>
          <select
            onChange={(e) => setSelectedZone(e.target.value)}
            defaultValue=""
            className="input"
          >
            <option value="" disabled>
              Sélectionnez une zone
            </option>
            {zones.map((zone, index) => (
              <option key={index} value={zone}>
                {zone}
              </option>
            ))}
          </select>
        </Champ>
      </div>

      <div className="changer-page-container">
        <div className="btn-changer-page" onClick={showPreviousZone}>
          <BoutonPagePrecedente />
        </div>
        <Titre valeurDuTitre={zones[currentZoneIndex]?.nom_zone || ""} />
        <div className="btn-changer-page" onClick={showNextZone}>
          <BoutonPageSuivante />
        </div>
      </div>

      {jeux.length === 0 ? (
        <p>Aucune zone existante.</p>
      ) : (
        <div>
          
        </div>
      )}
    </>
  );
}

export default Display_zones;
