import React from "react";
import Titre from "../../general/titre";
import "../../../styles/benevoles/display_jauge.css";
import Champ from "../../general/champ";
import { useState, useEffect } from "react";
import LigneTemporelle from "./ligne_temporelle";
import Modale from "../../general/fenetre_modale";
import Participer from "./fiche_participer";

function DisplayJauges() {
  const [dateDebut, setDateDebut] = useState(null);
  const [dateFin, setDateFin] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");

  const [selectedStand, setSelectedStand] = useState(null); // État pour stocker le stand sélectionné
  const [showModal, setShowModal] = useState(false); // État pour afficher ou masquer la fenêtre modale
  const [stands, setStands] = useState([]);

  useEffect(() => {
    // Fonction pour récupérer les stands par la date sélectionnée
    const fetchStandsBySelectedDate = async () => {
      if (selectedDate) {
        // S'assurer qu'une date est bien sélectionnée
        try {
          const response = await fetch(
            `https://festivaldujeuback.onrender.com/stands/date/${selectedDate}`
          );
          const data = await response.json();
          setStands(data); // Mettre à jour l'état avec les stands récupérés pour cette date
        } catch (error) {
          console.error(
            "Erreur lors de la récupération des stands par date",
            error
          );
        }
      }
    };

    fetchStandsBySelectedDate();
  }, [selectedDate]); 

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

  const handleJaugeClick = (creneau, stand) => {
    setSelectedStand({ ...stand, selectedCreneau: creneau });
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

  return (
    <>
      <Titre valeurDuTitre={"Planning Général des Stands"} />
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
      {stands
        .filter((stand) => stand.nom_stand !== "Animation jeu")
        .map((stand) => (
          <div key={stand._id}>
            <div className="nom-stand">{stand.nom_stand}</div>
            <LigneTemporelle
              date={selectedDate}
              id={stand._id} // Utilisez id au lieu de standId
              type="stand" // Ajoutez le type "stand"
              handleJaugeClick={handleJaugeClick}
            />
          </div>
        ))}
      {showModal && selectedStand && (
        <Modale onClose={closeModal} valeurDuTitre={selectedStand.nom_stand}>
          <Participer
            stand={selectedStand}
            creneau={selectedStand.selectedCreneau} // Passez le créneau horaire spécifique
            setSelectedStand={setSelectedStand}
            closeModal={closeModal}
          />
        </Modale>
      )}
    </>
  );
  
}

export default DisplayJauges;
