import React, { useState, useEffect } from "react";
import "../../../styles/Admin/jeux/display_zones.css";
import Champ from "../../general/champ";
import BoutonPagePrecedente from "../../BoutonPagePrecedente";
import BoutonPageSuivante from "../../BoutonPageSuivante";
import Download from "./download";
import Titre from "../../general/titre";

function DisplayZones() {
  const [zones, setZones] = useState([]);
  const [zoneBenevoleNames, setZoneBenevoleNames] = useState([]);
  const [zonesBenevole, setZonesBenevole] = useState([]);
  const [selectedZone, setSelectedZone] = useState("");
  const [selectedZoneBenevole, setSelectedZoneBenevole] = useState("");
  const [currentZoneIndex, setCurrentZoneIndex] = useState(0);
  const currentZone = zones[currentZoneIndex] || {};
  const [currentZoneDetails, setCurrentZoneDetails] = useState(null);


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

  function formatDate(date) {
    if (!date) return "";

    // Crée un nouvel objet Date si date n'est pas déjà une instance de Date
    const dateObj = date instanceof Date ? date : new Date(date);

    // Formate la date en 'jj/mm/aaaa'
    return dateObj.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  async function fetchZoneData() {
    try {
      const reponse = await fetch("http://localhost:3500/zonePlan", {
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

   useEffect(() => {
    if (selectedZone) {
      fetchZoneBenevoleNames(selectedZone);
    }
  }, [selectedZone]);

  async function fetchZoneBenevoleData() {
    try {
      const reponse = await fetch("http://localhost:3500/zonePlan", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (reponse.ok) {
        const zone = await reponse.json();
        console.log("zoneBenevole", zone);
        setZonesBenevole(
          zone.map((zone) => ({
            ...zone,
            nom_zone: zone.nom_zone || "",
            date: zone.date || "",
            referents: zone.referents || [],
            liste_zone_benevole: zone.liste_zone_benevole || [],
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
    fetchZoneBenevoleData();
  }, [selectedZoneBenevole]);

  async function fetchZoneDetails(zoneId){
    try {
      const reponse = await fetch(`http://localhost:3500/zoneBenevole/${zoneId}`);
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
    async function fetchZoneBenevoleNames(zonePlanId) {
      try {
        const response = await fetch(`http://localhost:3500/zonePlan/zoneBenevole/${zonePlanId}`);
        if (response.ok) {
          const names = await response.json();
          setZoneBenevoleNames(names);
        } else {
          throw new Error("Erreur lors de la récupération des noms des zones bénévoles");
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
        const zoneIndex = zones.findIndex((zone) => zone._id === selectedZone);
        setCurrentZoneIndex(zoneIndex !== -1 ? zoneIndex : 0);
      }
    }, [selectedZone, zones]);

    const sortedZones = zones.sort((a, b) => {
      const nameA = a.nom_zone_plan ? a.nom_zone_plan.toUpperCase() : ""; // Assurez-vous que nameA n'est pas undefined
      const nameB = b.nom_zone_plan ? b.nom_zone_plan.toUpperCase() : ""; // Assurez-vous que nameB n'est pas undefined
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
    
      // Les noms sont égaux
      return 0;
    });
   

    const sortedZonesBenevole = zonesBenevole.sort((a, b) => {
      const nameA = a.nom_zone_benevole ? a.nom_zone_benevole.toUpperCase() : "";
      const nameB = b.nom_zone_benevole ? b.nom_zone_benevole.toUpperCase() : "";
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
    
      return 0;
    });
    
    
  return (
    <>
      <div className="header-zone">
        <Download />
        <Champ customStyle={{ width: "70%" }}>
        <select
          onChange={(e) => setSelectedZone(e.target.value)}
          defaultValue=""
          className="input"
        >
          <option value="" disabled>
            Sélectionnez une zone Plan
          </option>
          {sortedZones.map((zone, index) => (
            <option key={index} value={zone.id_zone}>
              {zone.nom_zone_plan} ({formatDate(zone.date)})
            </option>
          ))}
        </select>
        </Champ>
      </div>
      <hr className="separator-zone" />
      <div className="changer-page-container">
        <div className="btn-changer-page" onClick={showPreviousZone}>
          <BoutonPagePrecedente />
        </div>
        <Titre valeurDuTitre={zones[currentZoneIndex]?.nom_zone || ""} />
        <div className="btn-changer-page" onClick={showNextZone}>
          <BoutonPageSuivante />
        </div>
      </div>
      <select
          onChange={(e) => setSelectedZoneBenevole(e.target.value)}
          defaultValue=""
          className="input"
        >
          <option value="" disabled>
            Sélectionnez une zone Benevole
          </option>
          {sortedZonesBenevole.map((zoneBenevole, index) => (
            <option key={index} value={zoneBenevole.id_zone}>
              {zoneBenevole.nom_zone_benevole} ({formatDate(zoneBenevole.date)})
            </option>
          ))}
        </select>
      {currentZoneDetails ? (
        <div >
          <Champ label="Nom de la zone">
            <input
            type="text" 
            value={currentZone?.nom_zone_plan || ""} 
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
            value={formatDate(currentZone?.date) || ""} 
            className="input"/>
          </Champ>
        </div>
      ) : (
        <p>Aucune zone trouvé.</p>
      )}
    </>
  );
}

export default DisplayZones;
