import React, { useEffect, useState } from "react";
import Download from "./download";
import "../../../styles/Admin/jeux/display_zones.css";
import RadioButton from "../../general/radioButton";
import Champ from "../../general/champ";
import BoutonPagePrecedente from "../../general/BoutonPagePrecedente";
import BoutonPageSuivante from "../../general/BoutonPageSuivante";
import Titre from "../../general/titre";
import Modal from "../../general/fenetre_modale";
import DisplayJeux from "./display_jeux";

function DisplayZone() {
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

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const fetchFestivalData = async () => {
      try {
        const result = await fetch(`http://localhost:3500/festival/latest`);
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
      let url = "http://localhost:3500/zoneBenevole"; // Remplace par ton URL de l'API
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
        `http://localhost:3500/zoneBenevole/${idZone}/jeux`
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
    }
  }, [selectedZone]);

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
            <Download />
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
              onChange={handleZoneChange}
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

          <div className="horaire-container">
            <Champ label="Horaire :">
              <select
                className="input"
                value={selectedHoraireIndex}
                onChange={(e) => setSelectedHoraireIndex(e.target.value)}
              >
                {selectedZone?.horaireCota &&
                selectedZone.horaireCota.length > 0 ? (
                  selectedZone.horaireCota.map((horaire, index) => (
                    <option key={index} value={index}>
                      {horaire.heure}
                    </option>
                  ))
                ) : (
                  <option>Aucun horaire disponible</option>
                )}
              </select>
            </Champ>
            <Champ label="Capacité :">
              <input
                type="number"
                min="1"
                value={
                  selectedZone &&
                  selectedZone.horaireCota &&
                  selectedZone.horaireCota[selectedHoraireIndex]
                    ? selectedZone.horaireCota[selectedHoraireIndex]
                        .nb_benevole || ""
                    : ""
                }
                className="input"
                readOnly
              />
            </Champ>
            <Champ label="Liste de bénévoles :">
              {selectedZone?.horaireCota[selectedHoraireIndex].liste_benevole
                .length === 0 ? (
                <input
                  type="text"
                  className="input"
                  value="0 bénévole inscrits"
                  readOnly
                />
              ) : (
                selectedZone?.horaireCota[
                  selectedHoraireIndex
                ].liste_benevole.map((benevole, index) => (
                  <input
                    key={benevole._id}
                    type="text"
                    className="input"
                    value={benevole.pseudo || ""}
                    readOnly
                  />
                ))
              )}
            </Champ>
          </div>
          <Champ label="Jeux :" customStyle={{ width: "80%" }}>
            <select
              className="input"
              onChange={handleJeuChange}
              value={jeuDetails?._id || ""}
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

export default DisplayZone;
