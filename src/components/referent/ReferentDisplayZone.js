import React, { useEffect, useState } from "react";
import "../../styles/Admin/jeux/display_zones.css";
import RadioButton from "../general/radioButton";
import BoutonPagePrecedente from "../general/BoutonPagePrecedente";
import BoutonPageSuivante from "../general/BoutonPageSuivante";
import Titre from "../general/titre";
import Champ from "../general/champ";
import Modal from "../general/fenetre_modale";
import DisplayJeux from "../admin/jeux/display_jeux";

function ReferentDisplayZone() {
    const [showModal, setShowModal] = useState(false);
    const [dateDebut, setDateDebut] = useState(null);
    const [dateFin, setDateFin] = useState(null);
    const [selectedRadio, setSelectedRadio] = useState("all");
    const [zones, setZones] = useState([]);
    const [selectedZoneIndex, setSelectedZoneIndex] = useState(0);
    const [selectedHoraireIndex, setSelectedHoraireIndex] = useState(0);
    const selectedZone = zones[selectedZoneIndex]; // Déclarer selectedZone ici, après avoir déclaré les états
    const [jeux, setJeux] = useState([]);
    const [jeuDetails, setJeuDetails] = useState(null);
    const [zoneCapacity, setZoneCapacity] = useState(0); // Initialisation avec 0
    const [pendingChanges, setPendingChanges] = useState([]);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const fetchFestivalData = async () => {
      try {
        const result = await fetch(`https://festivaldujeuback.onrender.com/festival/latest`);
        const body = await result.json();
        setDateDebut(body.date_debut);
        setDateFin(body.date_fin);
      } catch (error) {
        console.error("Error fetching festival data:", error);
      }
    };

    fetchFestivalData();
  }, []);

  useEffect(() => {
    const fetchZones = async () => {
      let url = "https://festivaldujeuback.onrender.com/zoneBenevole"; // Remplace par ton URL de l'API
      if (selectedRadio === "debut") {
        url += `/date/${dateDebut}`;
      } else if (selectedRadio === "fin") {
        url += `/date/${dateFin}`;
      }
      // Ajoute ta logique pour récupérer et gérer les données ici
      try {
        const response = await fetch(url);
        const data = await response.json();
        const sortedData = data.sort((a, b) =>
          a.nom_zone_benevole.localeCompare(b.nom_zone_benevole)
        );
        setZones(sortedData);
        setSelectedZoneIndex(0);
      } catch (error) {
        console.error("Erreur lors de la récupération des stands :", error);
      }
    };

    if (dateDebut && dateFin) {
      fetchZones();
    }
  }, [selectedRadio, dateDebut, dateFin]);

  function formatDate(date) {
    if (!date) return "";
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  const fetchJeuxByZone = async (idZone) => {
    try {
      const response = await fetch(
        `https://festivaldujeuback.onrender.com/zoneBenevole/${idZone}/jeux`
      );
      const jeuxData = await response.json();
      setJeux(jeuxData);
    } catch (error) {
      console.error("Erreur lors de la récupération des jeux :", error);
      setJeux([]);
    }
  };

  useEffect(() => {
    if (selectedZone) {
      fetchJeuxByZone(selectedZone._id);
      // Utilisez la valeur en attente si elle existe, sinon utilisez la valeur du créneau horaire actuel
      const currentCapacity =
        pendingChanges[selectedHoraireIndex] !== undefined
          ? pendingChanges[selectedHoraireIndex]
          : selectedZone.horaireCota[selectedHoraireIndex]?.nb_benevole || 0;
      setZoneCapacity(currentCapacity);
    }
  }, [selectedZone, selectedHoraireIndex, pendingChanges]);


  const handleZoneChange = (event) => {
    setSelectedZoneIndex(Number(event.target.value));
  };

  const handleRadioChange = (event) => {
    setSelectedRadio(event.target.value);
  };

  const handleJeuChange = (event) => {
    const jeuId = event.target.value;
    const jeu = jeux.find((j) => j._id === jeuId);
    setJeuDetails(jeu);
    openModal();
  };

  const radioOptions = [
    { label: `${formatDate(dateDebut)}`, value: "debut" },
    { label: `${formatDate(dateFin)}`, value: "fin" },
    { label: "Toutes les zones", value: "all" },
  ];

  const showNextZone = () => {
    setSelectedZoneIndex((prevIndex) => (prevIndex + 1) % zones.length);
  };

  const showPreviousZone = () => {
    setSelectedZoneIndex(
      (prevIndex) => (prevIndex - 1 + zones.length) % zones.length
    );
  };


  return (
    <div>
      {selectedZone && (
        <div className="header-zone">
          <div className="header-row">
            <RadioButton
              options={radioOptions}
              name="standFilter"
              selectedValue={selectedRadio}
              onChange={handleRadioChange}
            />
          </div>
          <Champ>
            <select
              value={selectedZoneIndex}
              className="input"
            >
              {zones.map((zone, index) => (
                <option key={`${zone.id}-${index}`} value={index}>
                  {zone.nom_zone_benevole} ({formatDate(zone.date)})
                </option>
              ))}
            </select>
          </Champ>
        </div>
      )}

      <hr className="separator-zone" />
      {selectedZone && zones.length > 0 ? (
        <div className="Entete-btn">
          <div className="btn-changer-page" onClick={showPreviousZone}>
            <BoutonPagePrecedente />
          </div>
          <Titre
            valeurDuTitre={selectedZone ? selectedZone.nom_zone_benevole : ""}
          />
          <div className="btn-changer-page" onClick={showNextZone}>
            <BoutonPageSuivante />
          </div>
        </div>
      ) : (
        <p>Aucune zone importée</p>
      )}
      {zones.length > 0 && (
        <div className="form-display-zone">
          <Champ label="Date :" customStyle={{ width: "80%" }}>
            <input
              type="text"
              value={selectedZone ? formatDate(selectedZone.date) : ""}
              className="input"
              readOnly
            />
          </Champ>
          
          <Champ label="Jeux :" customStyle={{ width: "80%" }}>
            <select
              className="input"
              value={jeuDetails?._id || ""}
              onChange={handleJeuChange}
            >
              <option value="">Sélectionner un jeu</option>
              {jeux.map((jeu) => (
                <option key={jeu._id} value={jeu._id}>
                  {jeu.nom_jeu}
                </option>
              ))}
            </select>
          </Champ>
        </div>
      )}
      {showModal && jeuDetails && (
        <Modal onClose={closeModal} titre={jeuDetails.nom_jeu || "Jeu"}>
          <DisplayJeux jeu={jeuDetails} />
        </Modal>
      )}
    </div>
  );
}

export default ReferentDisplayZone;