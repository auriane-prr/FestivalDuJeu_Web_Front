import React, { useState, useEffect, useRef } from "react";
import "../../../styles/Admin/jeux/display_jeux.css";
import Champ from "../../general/champ";
import BoutonPagePrecedente from "../../BoutonPagePrecedente";
import BoutonPageSuivante from "../../BoutonPageSuivante";
import Download from "./download";
import Titre from "../../general/titre";

function Display_zones() {
  const [zones, setZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState("");
  const [currentZoneIndex, setCurrentZoneIndex] = useState(0);
  const currentZone = zones[currentZoneIndex] || {};
  const [currentZoneDetails, setCurrentZoneDetails] = useState(null);
  const [jeux, setJeux] = useState([]);


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

  async function fetchZoneData() {
    try {
      const reponse = await fetch("http://localhost:3500/zone", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (reponse.ok) {
        const zone = await reponse.json();
        console.log("zone", zone);
        setZones(
          zone.map((zone) => ({
            ...zone,
            nom_zone: zone.nom_zone || "",
            id_zone: zone.id_zone || "",
            date: zone.date || "",
            referents: zone.referents || [],
            liste_jeux: zone.liste_jeux || [],
            horaireCota: zone.horaireCota.map((horaire) => ({
              ...horaire,
              heure: horaire.heure || "",
              nb_benevole: horaire.nb_benevole || "",
              liste_benevole: horaire.liste_benevole || [],
          })),
        }))
      );
    }
    } catch (error) {
      console.error(error);
    };
  }

  useEffect(() => {
    fetchZoneData();
  }, [selectedZone]);

  async function fetchZoneDetails(zoneId){
    try {
      const reponse = await fetch(`http://localhost:3500/zone/${zoneId}`);
      if (reponse.ok) {
        const zoneDetails = await reponse.json();
        console.log("zoneDetails", zoneDetails);
        setCurrentZoneDetails(zoneDetails);
      } else {
          throw new Error("Erreur lors de la récupération des détails de la zone");
        }
      } catch (error) {
        console.error(error);
      }
    }

    useEffect(() => {
      if (zones.length > 0) {
        const zoneId = zones[currentZoneIndex]._id;
        if (zoneId) {
          fetchZoneDetails(zoneId);
        }
      }
    }, [currentZoneIndex, zones]);

    useEffect(() => {
      if (selectedZone && zones.length > 0) {
        const zoneIndex = zones.findIndex((zone) => zone.id_zone === selectedZone);
        setCurrentZoneIndex(zoneIndex !== -1 ? zoneIndex : 0);
      }
    }, [selectedZone, zones]);


    



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
            <option key={index} value={zone.id_zone}>
              {zone.nom_zone}
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
      {currentZoneDetails ? (
        <div >
          <Champ label="Nom de la zone">
            <input
            type="text" 
            value={currentZone?.nom_zone || ""} 
            className="input"/>
          </Champ>
          <Champ label="ID de la zone">
            <input
            type="text" 
            value={currentZone?.id_zone || ""} 
            className="input"/>
          </Champ>
          <Champ label="Date">
            <input
            type="text" 
            value={currentZone?.date || ""} 
            className="input"/>
          </Champ>
        </div>
      ) : (
        <p>Aucune zone trouvé.</p>
      )}
    </>
  );
}

export default Display_zones;
