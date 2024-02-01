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
  const [dateD, setDateD] = useState(null); // pour le titre sinon ca casse tout
  const [dateF, setDateF] = useState(null);
  const [zoneBenevole, setZoneBenevole] = useState([]);
  const [zonePlan, setZonePlan] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedZone, setSelectedZone] = useState(null);
  const [zonePlanAvecBenevoles, setZonePlanAvecBenevoles] = useState([]);

  useEffect(() => {
    const fetchZonesBySelectedDate = async () => {
      if (selectedDate) {
        try {
          // Récupérez toutes les zones plan, y compris celles avec une liste de zones bénévoles vide
          const responseZonePlan = await fetch(
            `http://localhost:3500/zonePlan/date/${selectedDate}`
          );
          const dataZonePlan = await responseZonePlan.json();
          const zonesPlanVides = dataZonePlan.filter(
            (zone) => zone.liste_zone_benevole.length === 0
          );
          setZonePlan(zonesPlanVides);

          // Récupérez toutes les zones bénévoles pour la date sélectionnée
          const responseZoneBenevole = await fetch(
            `http://localhost:3500/zoneBenevole/date/${selectedDate}`
          );
          const dataZoneBenevole = await responseZoneBenevole.json();
          setZoneBenevole(dataZoneBenevole);
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

  const handleJaugeClick = (creneau, stand) => {
    setSelectedZone({ zoneBenevole, zonePlan, selectedCreneau: creneau });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    // Exemple d'appel API pour récupérer les dates du festival
    const fetchFestivalData = async () => {
      const result = await fetch(`http://localhost:3500/festival/latest`);
      const body = await result.json();
      setDateDebut(body.date_debut);
      setDateD(body.date_debut);
      setDateFin(body.date_fin);
      setDateF(body.date_fin);
      console.log(dateDebut, dateFin);
    };
    fetchFestivalData();
  }, []);

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

  // Combine zonePlan et zoneBenevole en une seule liste
  // Ajoutez un type à chaque zone lors de la combinaison des listes
  const combinedZones = [
    ...zonePlan.map((zone) => ({ ...zone, type: "zonePlan" })),
    ...zoneBenevole.map((zone) => ({ ...zone, type: "zoneBenevole" })),
  ];

  // Triez la liste combinée par ordre alphabétique en fonction du nom de la zone
  const sortedCombinedZones = combinedZones.sort((a, b) => {
    const nomA = a.nom_zone_plan
      ? a.nom_zone_plan.toUpperCase()
      : a.nom_zone_benevole.toUpperCase();
    const nomB = b.nom_zone_plan
      ? b.nom_zone_plan.toUpperCase()
      : b.nom_zone_benevole.toUpperCase();
    return nomA.localeCompare(nomB);
  });

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

      {sortedCombinedZones.map((zone) => (
        <div key={zone._id}>
          <div className="nom-stand">
            {zone.nom_zone_plan || zone.nom_zone_benevole}
          </div>
          <LigneTemporelle
            date={selectedDate}
            id={zone._id}
            type={zone.type} // Passer le type de zone ici
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
