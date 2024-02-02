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
import Bouton from "../../general/bouton";
import FenetrePopup from "../../general/fenetre_popup";

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
  const [editMode, setEditMode] = useState(false);
  const [zoneCapacity, setZoneCapacity] = useState(0); // Initialisation avec 0
  const [pendingChanges, setPendingChanges] = useState([]);

  const [isPopupVisible, setPopupVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const hidePopup = () => {
    setPopupVisible(false);
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
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
      // Utilisez la valeur en attente si elle existe, sinon utilisez la valeur du créneau horaire actuel
      const currentCapacity =
        pendingChanges[selectedHoraireIndex] !== undefined
          ? pendingChanges[selectedHoraireIndex]
          : selectedZone.horaireCota[selectedHoraireIndex]?.nb_benevole || 0;
      setZoneCapacity(currentCapacity);
    }
  }, [selectedZone, selectedHoraireIndex, pendingChanges]);

  const handleSaveChanges = async () => {
    // Appliquer toutes les modifications en attente à la zone sélectionnée
    const updatedZone = { ...selectedZone };
    for (const [index, capacity] of pendingChanges.entries()) {
      if (capacity !== undefined) {
        // Vérifie si une modification est en attente pour ce créneau
        updatedZone.horaireCota[index].nb_benevole = capacity;
      }
    }

    try {
      const response = await fetch(
        `http://localhost:3500/zoneBenevole/${selectedZone._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedZone), // Utilisez la zone mise à jour avec toutes les modifications
        }
      );

      if (response.ok) {
        // Mettre à jour l'état local avec la zone mise à jour
        const updatedZones = [...zones];
        updatedZones[selectedZoneIndex] = updatedZone;
        setZones(updatedZones);

        // Réinitialiser les modifications en attente
        setPendingChanges([]);

        // Désactive le mode édition
        toggleEditMode();

        // Afficher le message de succès
        setSuccessMessage("Modifications enregistrées avec succès");
        setErrorMessage(null);
      } else {
        throw new Error("Échec de l'enregistrement des modifications");
      }
    } catch (error) {
      setErrorMessage(
        "Erreur lors de l'enregistrement des modifications: " + error.message
      );
    } finally {
      setPopupVisible(true);
    }
  };

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

  const handleCapacityChange = (newValue, horaireIndex) => {
    if (editMode) {
      // Mettre à jour la valeur de la capacité en attente
      const updatedPendingChanges = [...pendingChanges];
      updatedPendingChanges[horaireIndex] = newValue;
      setPendingChanges(updatedPendingChanges);
    }
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

  const handleEditZone = (zoneIndex) => () => {
    // Active le mode édition uniquement pour la zone spécifiée
    const updatedZones = [...zones];
    updatedZones[zoneIndex].editMode = true;
    setZones(updatedZones);
    // Ne pas réinitialiser l'index ici
    toggleEditMode();
    console.log(
      "zone modifiable : " +
        zoneIndex +
        " " +
        zones[zoneIndex].nom_zone_benevole
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
                value={zoneCapacity}
                className="input"
                readOnly={!editMode}
                onChange={(e) => {
                  if (editMode) {
                    // Utilisez handleCapacityChange ici pour mettre à jour la capacité en attente
                    handleCapacityChange(
                      Number(e.target.value),
                      selectedHoraireIndex
                    );
                  }
                }}
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
          <div className="modif-button">
            {editMode ? (
              <Bouton
                type="button"
                onClick={() => handleSaveChanges(selectedZone)}
              >
                Enregistrer
              </Bouton>
            ) : (
              <Bouton type="button" onClick={handleEditZone(selectedZoneIndex)}>
                Modifier
              </Bouton>
            )}
          </div>
        </div>
      )}
      {showModal && jeuDetails && (
        <Modal onClose={closeModal} titre={jeuDetails.nom_jeu || "Jeu"}>
          <DisplayJeux jeu={jeuDetails} />
        </Modal>
      )}
      {errorMessage && isPopupVisible && (
        <FenetrePopup message={errorMessage} type="error" onClose={hidePopup} />
      )}
      {successMessage && isPopupVisible && (
        <FenetrePopup
          message={successMessage}
          type="success"
          onClose={hidePopup}
        />
      )}
    </div>
  );
}

export default DisplayZone;
