import React, { useEffect, useState } from "react";
import Titre from "../../general/titre";
import Champ from "../../general/champ";
import LigneTemporelle from "../stands/ligne_temporelle";
import Modale from "../../general/fenetre_modale";
import Participer from "./participer_zone";
import RechercheJeux from "../rechercheJeux";

function AccueilZone() {
  const [dateDebut, setDateDebut] = useState(null);
  const [dateFin, setDateFin] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedZone, setSelectedZone] = useState(null);
  const [zones, setZones] = useState([]);

  useEffect(() => {
    // Exemple d'appel API pour récupérer les dates du festival
    const fetchFestivalData = async () => {
      const result = await fetch(`https://festivaldujeuback.onrender.com/festival/latest`);
      const body = await result.json();
      setDateDebut(body.date_debut);
      setDateFin(body.date_fin);
      console.log(dateDebut, dateFin);
    };
    fetchFestivalData();
  }, []);

  useEffect(() => {
    const fetchZonesBySelectedDate = async () => {
      if (selectedDate) {
        try {
          // Récupérez toutes les zones bénévoles pour la date sélectionnée
          const response = await fetch(
            `https://festivaldujeuback.onrender.com/zoneBenevole/date/${selectedDate}`
          );
          const data = await response.json();
          setZones(data);
        } catch (error) {
          console.error(
            "Erreur lors de la récupération des zones par date",
            error
          );
        }
      }
    };

    fetchZonesBySelectedDate();
  }, [selectedDate]);

  const handleJaugeClick = (creneau, zone) => {
    setSelectedZone({ ...zone, selectedCreneau: creneau });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
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

  const handleDateChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedDate(selectedValue);
  };

  const sortedZones = zones
    .slice()
    .sort((a, b) => a.nom_zone_benevole.localeCompare(b.nom_zone_benevole));

  return (
    <>
      <Titre valeurDuTitre={"Planning Général des Zones"} />
      <RechercheJeux />
      <Champ>
        <select
          className="input"
          value={selectedDate}
          onChange={handleDateChange}
        >
          <option value="" disabled={selectedDate !== ""}>
            Choisissez une date
          </option>
          {dateDebut && (
            <option value={dateDebut}>{formatDate(dateDebut)}</option>
          )}
          {dateFin && <option value={dateFin}>{formatDate(dateFin)}</option>}
        </select>
      </Champ>
      <hr className="separator-benevole" />
      {selectedDate === "" && <p>Veuillez sélectionner une date</p>}
      {sortedZones.map((zone) => (
        <div key={zone._id}>
          <div className="nom-stand">{zone.nom_zone_benevole}</div>
          <LigneTemporelle
            date={selectedDate}
            id={zone._id} // Utilisez id au lieu de standId
            type="zone" // Ajoutez le type "stand"
            handleJaugeClick={handleJaugeClick}
          />
        </div>
      ))}

      {showModal && selectedZone && (
        <Modale
          onClose={closeModal}
          valeurDuTitre={
            selectedZone.nom_zone_plan || selectedZone.nom_zone_benevole
          }
        >
          <Participer
            zone={selectedZone}
            creneau={selectedZone.selectedCreneau} // Passez le créneau horaire spécifique
            setSelectedZone={setSelectedZone}
            closeModal={closeModal}
          />
        </Modale>
      )}
    </>
  );
}

export default AccueilZone;
