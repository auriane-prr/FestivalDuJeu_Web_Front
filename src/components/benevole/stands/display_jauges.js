import React from "react";
import Titre from "../../general/titre";
import "../../../styles/benevoles/display_jauge.css";
import Champ from "../../general/champ";
import { useState, useEffect } from "react";
import LigneTemporelle from "./ligne_temporelle";
import Modale from "../../general/fenetre_modale";
import Participer from "./fiche_participer";

function DisplayJauges() {
  const [standsByHour, setStandsByHour] = useState({});
  const [standsByDate, setStandsByDate] = useState({});
  const [dateDebut, setDateDebut] = useState(null);
  const [dateFin, setDateFin] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [dateD, setDateD] = useState(null); // pour le titre sinon ca casse tout
  const [dateF, setDateF] = useState(null);
  const [userId, setUserId] = useState("");
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
            `http://localhost:3500/stands/date/${selectedDate}`
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
  }, [selectedDate]); // Dépendance au state selectedDate pour déclencher l'effet

  //   const fetchStandByDate = async (date) => {
  //     try {
  //       const response = await fetch(`http://localhost:3500/stands/date/${date}`);
  //       if (response.ok) {
  //         const stands = await response.json();
  //         console.log("liste de stands", stands);
  //         setStandsByDate((prevStands) => ({
  //           ...prevStands,
  //           [date]: groupStandsByHourAndColumn(stands),
  //         }));
  //       } else {
  //         throw new Error("Erreur lors de la récupération des stands");
  //       }
  //     } catch (error) {
  //       console.error("Erreur lors de la récupération des stands :", error);
  //     }
  //   };

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

  //   useEffect(() => {
  //     if (dateDebut && dateFin) {
  //       fetchStandByDate(dateDebut); // Appel pour les stands du samedi
  //       fetchStandByDate(dateFin); // Appel pour les stands du dimanche
  //     }
  //   }, [dateDebut, dateFin]);

  //   const groupStandsByHourAndColumn = (standsData) => {
  //     const standsByHour = {};
  //     standsData.forEach((stand) => {
  //       stand.horaireCota.forEach((horaire) => {
  //         const { heure, nb_benevole } = horaire;
  //         if (!standsByHour[heure]) {
  //           standsByHour[heure] = [];
  //         }
  //         standsByHour[heure].push({ ...stand, heure, nb_benevole }); // Ajout de toutes les informations du stand dans standsByHour
  //       });
  //     });
  //     return standsByHour;
  //   };

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
      <Titre valeurDuTitre={"Vue Générale"} />
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
              standId={stand._id}
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
