import React, { useState, useEffect } from "react";
import Champ from "../../general/champ";
import "../../../styles/Admin/jeux/display_zones.css";
import BoutonPageSuivante from "../../BoutonPageSuivante";
import BoutonPagePrecedente from "../../BoutonPagePrecedente";
import Titre from "../../general/titre";
import Bouton from "../../general/bouton";
import FenetrePopup from "../../general/fenetre_popup";
import RadioButton from "../../general/radioButton";
import Download from "./download";
import Modal from "../../general/fenetre_modale";
import DisplayJeux from "./display_jeux";

function DisplayZone() {
  const [showModal, setShowModal] = useState(false);
  const [zones, setZones] = useState([]);
  const [currentZoneIndex, setCurrentZoneIndex] = useState(0);
  const currentZone = zones[currentZoneIndex] || {};
  const [editMode, setEditMode] = useState(false);
  const [nonReferentBenevoles, setNonReferentBenevoles] = useState([]);
  const [selectedBenevole, setSelectedBenevole] = useState(null); // Pour stocker le bénévole sélectionné
  const [showSelector, setShowSelector] = useState(false);
  const [currentZoneDetails, setCurrentZoneDetails] = useState(null);
  const [selectedHoraireIndex, setSelectedHoraireIndex] = useState(0);
  const [selectedZone, setSelectedZone] = useState("");
  const [selectedDate, setSelectedDate] = useState("both");
  const [dateDebut, setDateDebut] = useState(null);
  const [dateFin, setDateFin] = useState(null);
  const [zoneBnvl, setZoneBnvl] = useState([]);
  const [zonesBenevole, setZonesBenevole] = useState([]);
  const [selectedZoneBenevole, setSelectedZoneBenevole] = useState("");
  const [currentZoneBenevoleIndex, setCurrentZoneBenevoleIndex] = useState(0);
  const [editingZone, setEditingZone] = useState(null);
  const [isEditingZoneBenevole, setIsEditingZoneBenevole] = useState(false);
  const [jeux, setJeux] = useState([]);
  const [selectedJeuId, setSelectedJeuId] = useState(null);
  const [jeuDetails, setJeuDetails] = useState(null);

  const [isPopupVisible, setPopupVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const hidePopup = () => {
    setPopupVisible(false);
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchFestivalData();
      await fetchZonesData();
    };

    loadData();
  }, [dateDebut, dateFin]);

  const fetchFestivalData = async () => {
    const result = await fetch(`http://localhost:3500/festival/latest`);
    const body = await result.json();
    setDateDebut(body.date_debut);
    setDateFin(body.date_fin);
    console.log(dateDebut, dateFin);
  };

  useEffect(() => {
    if (dateDebut && dateFin) {
      fetchZonesByDate(dateDebut);
      fetchZonesByDate(dateFin);
    }
  }, [dateDebut, dateFin]);

  async function fetchZonesData() {
    try {
      if (editMode) {
        return;
      }
  
      let url = "http://localhost:3500/zonePlan";
      if (selectedDate === "both" && dateDebut && dateFin) {
        // Utilisez les dates de début et de fin du dernier festival pour filtrer les zones
        url += `?dateDebut=${dateDebut}&dateFin=${dateFin}`;
      }
  
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (response.ok) {
        let zonesData = await response.json();
        if (zonesData && zonesData.length > 0) {
          // Filtrer les zones pour s'assurer qu'elles correspondent aux dates du dernier festival
          const filteredZones = zonesData.filter(zone =>
            new Date(zone.date) >= new Date(dateDebut) && new Date(zone.date) <= new Date(dateFin)
          );
          setZones(filteredZones);
        } else {
          setZones([]);
        }
      } else {
        throw new Error("Failed to fetch zones from the server");
      }
    } catch (error) {
      console.error("Error fetching zones: ", error);
    }
  }
    
  
  useEffect(() => {
    // Cette fonction s'exécute chaque fois que `selectedDate` change.
    if (selectedDate === "both") {
      // Si "both" est sélectionné, nous voulons afficher les zones des dates de début et de fin du festival.
      fetchZonesData();
    } else {
      // Sinon, nous affichons les zones pour la date sélectionnée spécifique.
      const specificDate = selectedDate === "date_debut" ? dateDebut : dateFin;
      fetchZonesByDate(specificDate);
    }
  }, [selectedDate, dateDebut, dateFin]); // Nous avons également besoin de dateDebut et dateFin comme dépendances.
  

  const handleJeuSelect = async (jeuId) => {
    try {
      const response = await fetch(`http://localhost:3500/jeux/${jeuId}`);
      if (!response.ok)
        throw new Error("Erreur lors de la récupération des détails du jeu");

      const data = await response.json();
      setJeuDetails(data); // Stockez les détails du jeu
      openModal(); // Ouvrez la modale
    } catch (error) {
      console.error(error);
      setErrorMessage("Impossible de charger les détails du jeu.");
      setPopupVisible(true);
    }
  };

  useEffect(() => {
    fetchZonesData();
  }, []);

  useEffect(() => {
    fetchZonesData();
  }, [editMode, selectedZone]);

  const fetchNonReferentBenevoles = async () => {
    try {
      const response = await fetch(
        "http://localhost:3500/benevole/non-referent"
      );
      if (response.ok) {
        const data = await response.json();
        setNonReferentBenevoles(data);
      } else {
        throw new Error("Non-OK response from server");
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des bénévoles non référents:",
        error
      );
    }
  };

  async function fetchZoneDetails(zoneId) {
    try {
      const response = await fetch(`http://localhost:3500/zonePlan/${zoneId}`);
      if (response.ok) {
        const zoneDetails = await response.json();
        setJeux(zoneDetails.liste_jeux || []);

        if (zoneDetails.liste_zone_benevole.length > 0) {
          const zoneBenevoleDetailsPromises =
            zoneDetails.liste_zone_benevole.map((zoneBenevoleId) =>
              fetch(
                `http://localhost:3500/zoneBenevole/${zoneBenevoleId}`
              ).then((res) => res.json())
            );

          let zoneBenevoles = await Promise.all(zoneBenevoleDetailsPromises);

          // Trier les zones bénévoles par ordre alphabétique basé sur la fin du nom
          zoneBenevoles.sort((a, b) =>
            a.nom_zone_benevole
              .split(" ")
              .pop()
              .localeCompare(b.nom_zone_benevole.split(" ").pop())
          );

          setCurrentZoneDetails({
            ...zoneDetails,
            zoneBenevoles: zoneBenevoles,
            currentZoneBenevoleIndex: 0, // Commencez toujours par la première zone bénévole triée
          });
        } else {
          setCurrentZoneDetails({
            ...zoneDetails,
            zoneBenevoles: [],
            currentZoneBenevoleIndex: -1, // Aucune zone bénévole à afficher
          });
        }
      } else {
        throw new Error("Failed to fetch zone details");
      }
    } catch (error) {
      console.error("Error fetching zone details:", error);
    }
  }

  useEffect(() => {
    // Cette fonction s'assure que nous avons les détails corrects à chaque fois que l'index de la zone change
    const loadZoneDetails = async () => {
      // Vérifier si l'index de la zone est valide avant de tenter de charger les détails
      if (currentZoneIndex >= 0 && currentZoneIndex < zones.length) {
        const zoneId = zones[currentZoneIndex]._id;
        await fetchZoneDetails(zoneId);
      } else {
        // Si l'index n'est pas valide, réinitialiser les détails de la zone et l'index
        setCurrentZoneDetails(null);
        setCurrentZoneIndex(0);
      }
    };

    loadZoneDetails();
  }, [currentZoneIndex, zones]);

  useEffect(() => {
    if (selectedZone && zones.length > 0) {
      const zoneIndex = zones.findIndex((zone) => zone._id === selectedZone);
      setCurrentZoneIndex(zoneIndex !== -1 ? zoneIndex : 0);
      setCurrentZoneBenevoleIndex(0); // Réinitialiser l'index de zone bénévole
    }
  }, [selectedZone, zones]);

  const handleRadioDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    if (newDate === "both") {
      fetchZonesData();
    } else {
      const specificDate = newDate === "date_debut" ? dateDebut : dateFin;
      fetchZonesByDate(specificDate);
    }
  };

  useEffect(() => {
    if (dateDebut && dateFin) {
      handleRadioDateChange({ target: { value: "both" } });
    }
  }, [dateDebut, dateFin]);

  const radioOptions = [
    { label: formatDate(dateDebut), value: "date_debut" },
    { label: formatDate(dateFin), value: "date_fin" },
    { label: "Toutes les zones", value: "both" },
  ];

  // Fonction pour comparer les dates
  const compareZoneDates = (a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA - dateB; // Tri croissant par date
  };

  // Utilisation de la fonction de tri
  const sortedZones = [...zones].sort(compareZoneDates);

  const handleNbBenevoleChange = (index, value) => {
    const updatedZones = [...zones];
    updatedZones[currentZoneIndex].horaireCota[index].nb_benevole = value;
    setZones(updatedZones);
  };

  function formatDate(date) {
    if (!date) return "";
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  async function fetchZoneBenevoleData() {
    try {
      const reponse = await fetch("http://localhost:3500/zoneBenevole", {
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
            nom_zone_benevole: zone.nom_zone_benevole || "",
            id_zone_benevole: zone.id_zone_benevole || "",
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
    }
  }

  useEffect(() => {
    fetchZoneBenevoleData();
  }, [selectedZoneBenevole]);

  const fetchZonesByDate = async (date) => {
    try {
      let url = "http://localhost:3500/zonePlan";
      if (date !== "both") {
        url += `/date/${date}`;
      }
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        const zonesData = await response.json();
        setZones(zonesData);
      } else {
        throw new Error("Erreur lors de la récupération des zones");
      }
    } catch (error) {
      console.error("Erreur: ", error);
    }
  };

  const handleSaveChanges = async () => {
    // Déterminez si vous modifiez une zone bénévole ou une zone plan.
    const zoneToUpdate = isZoneBenevole()
      ? currentZoneDetails.zoneBenevoles[currentZoneBenevoleIndex]
      : currentZone;
  
    // Préparez l'URL et le corps de la requête.
    const url = `http://localhost:3500/${isZoneBenevole() ? "zoneBenevole" : "zonePlan"}/${zoneToUpdate._id}`;
    const body = JSON.stringify(zoneToUpdate);
  
    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: body,
      });
  
      if (!response.ok) {
        throw new Error("Échec de la sauvegarde des modifications.");
      }
  
      // Mettez à jour les détails à jour et l'état du composant.
      const updatedZone = await response.json();
      if (isZoneBenevole()) {
        // Mettez à jour la zone bénévole spécifique dans currentZoneDetails.zoneBenevoles
        const updatedZoneBenevoles = [...currentZoneDetails.zoneBenevoles];
        updatedZoneBenevoles[currentZoneBenevoleIndex] = updatedZone.zone;
        setCurrentZoneDetails({ ...currentZoneDetails, zoneBenevoles: updatedZoneBenevoles });
      } else {
        // Mettez à jour la zone plan dans l'état 'zones'
        const updatedZones = zones.map((z) => (z._id === updatedZone.zone._id ? updatedZone.zone : z));
        setZones(updatedZones);
        // Mettez à jour currentZoneDetails si vous êtes sur une zone plan
        setCurrentZoneDetails(updatedZone.zone);
      }
  
      setEditMode(false);
      setSuccessMessage("Modifications enregistrées avec succès.");
      setPopupVisible(true);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement des modifications:", error);
      setErrorMessage(`Erreur lors de l'enregistrement des modifications: ${error.message}`);
      setPopupVisible(true);
    }
  };  

  const showPreviousZone = () => {
    // Si nous sommes en train de parcourir les zoneBenevoles...
    if (
      currentZoneDetails.zoneBenevoles &&
      currentZoneDetails.zoneBenevoles.length > 0
    ) {
      // Et si nous sommes à la première zoneBenevole...
      if (currentZoneBenevoleIndex === 0) {
        // Alors, déplacez-vous vers la zonePlan précédente
        setCurrentZoneIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : zones.length - 1
        );
        setCurrentZoneBenevoleIndex(0); // Réinitialiser l'index des zoneBenevoles pour la nouvelle zonePlan
      } else {
        // Sinon, simplement aller à la zoneBenevole précédente
        setCurrentZoneBenevoleIndex((prevIndex) => prevIndex - 1);
      }
    } else {
      // Si pas de zoneBenevoles, se déplacer normalement entre les zonePlans
      setCurrentZoneIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : zones.length - 1
      );
    }
  };

  const showNextZone = () => {
    // Si nous sommes en train de parcourir les zoneBenevoles...
    if (
      currentZoneDetails.zoneBenevoles &&
      currentZoneDetails.zoneBenevoles.length > 0
    ) {
      // Et si nous sommes à la dernière zoneBenevole...
      if (
        currentZoneBenevoleIndex ===
        currentZoneDetails.zoneBenevoles.length - 1
      ) {
        // Alors, déplacez-vous vers la zonePlan suivante
        setCurrentZoneIndex((prevIndex) =>
          prevIndex < zones.length - 1 ? prevIndex + 1 : 0
        );
        setCurrentZoneBenevoleIndex(0); // Réinitialiser l'index des zoneBenevoles pour la nouvelle zonePlan
      } else {
        // Sinon, simplement aller à la zoneBenevole suivante
        setCurrentZoneBenevoleIndex((prevIndex) => prevIndex + 1);
      }
    } else {
      // Si pas de zoneBenevoles, se déplacer normalement entre les zonePlans
      setCurrentZoneIndex((prevIndex) =>
        prevIndex < zones.length - 1 ? prevIndex + 1 : 0
      );
    }
  };

  const isZoneBenevole = () => {
    return (
      currentZoneDetails &&
      currentZoneDetails.zoneBenevoles &&
      currentZoneDetails.zoneBenevoles.length > currentZoneBenevoleIndex
    );
  };

  const handleEditZone = () => {
    // Vérifiez si vous êtes dans le contexte d'une zone bénévole spécifique ou d'une zone plan générale.
    const isEditingZoneBenevole =
      currentZoneDetails &&
      currentZoneDetails.zoneBenevoles &&
      currentZoneDetails.zoneBenevoles.length > currentZoneBenevoleIndex;

    if (isEditingZoneBenevole) {
      // Modifier la zone bénévole actuelle.
      setEditMode(true);
    } else {
      // Modifier la zone plan actuelle.
      setEditMode(true);
    }
  };

  const sortedZonesName = zones.sort((a, b) => {
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

  return (
    <>
      {zones.length === 0 ? (
        <>
          <div className="header-zone">
            <div className="header-row">
              <Download />
              <RadioButton
                options={radioOptions}
                name="dateSelection"
                selectedValue={selectedDate}
                onChange={handleRadioDateChange}
              />
            </div>
            <div className="header-row">
              <Champ customStyle={{ marginLeft: "0" }}>
                <select
                  onChange={(e) => setSelectedZone(e.target.value)}
                  value={selectedZone}
                  className="input"
                >
                  <option value="">Toutes les zones</option>
                  {sortedZonesName.map((zone, index) => (
                    <option key={index} value={zone._id}>
                      {zone.nom_zone_plan} ({formatDate(zone.date)})
                    </option>
                  ))}
                </select>
              </Champ>
            </div>
          </div>

          <hr className="separator-zone" />
          <p>Aucune zones importées pour l'instant.</p>
          </>
      ) : (
        <>
          <div className="header-zone">
            <div className="header-row">
              <Download />
              <RadioButton
                options={radioOptions}
                name="dateSelection"
                selectedValue={selectedDate}
                onChange={handleRadioDateChange}
              />
            </div>
            <div className="header-row">
              <Champ customStyle={{ marginLeft: "0" }}>
                <select
                  onChange={(e) => setSelectedZone(e.target.value)}
                  value={selectedZone}
                  className="input"
                >
                  <option value="">Toutes les zones</option>
                  {sortedZonesName.map((zone, index) => (
                    <option key={index} value={zone._id}>
                      {zone.nom_zone_plan} ({formatDate(zone.date)})
                    </option>
                  ))}
                </select>
              </Champ>
            </div>
          </div>

          <hr className="separator-zone" />

          {selectedZone ? (
            <>
              <div className="Entete-btn">
                <div className="btn-changer-page" onClick={showPreviousZone}>
                  <BoutonPagePrecedente />
                </div>
                <Titre
                  valeurDuTitre={
                    currentZoneDetails &&
                    currentZoneDetails.zoneBenevoles &&
                    currentZoneDetails.zoneBenevoles.length >
                      currentZoneBenevoleIndex
                      ? currentZoneDetails.zoneBenevoles[
                          currentZoneBenevoleIndex
                        ].nom_zone_benevole
                      : currentZoneDetails
                      ? currentZoneDetails.nom_zone_plan
                      : "Chargement..."
                  }
                />
                <div className="btn-changer-page" onClick={showNextZone}>
                  <BoutonPageSuivante />
                </div>
              </div>

              {currentZoneDetails ? (
                <div className="form-display-zone">
                  <Champ label="Date :" customStyle={{ width: "80%" }}>
                    <input
                      type="text"
                      value={formatDate(currentZone?.date || "")}
                      className="input"
                      readOnly
                    />
                  </Champ>

                  <div className="horaire-container">
                    <Champ label="Horaire :">
                      <select
                        className="input"
                        value={selectedHoraireIndex}
                        onChange={(e) =>
                          setSelectedHoraireIndex(e.target.value)
                        }
                      >
                        {currentZone?.horaireCota &&
                        currentZone.horaireCota.length > 0 ? (
                          currentZone.horaireCota.map((horaire, index) => (
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
                          currentZone &&
                          currentZone.horaireCota &&
                          currentZone.horaireCota[selectedHoraireIndex]
                            ? currentZone.horaireCota[selectedHoraireIndex]
                                .nb_benevole || ""
                            : ""
                        }
                        onChange={(e) =>
                          handleNbBenevoleChange(
                            selectedHoraireIndex,
                            e.target.value
                          )
                        }
                        className="input"
                        readOnly={!editMode}
                      />
                    </Champ>
                    <Champ label="Liste de bénévoles :">
                      {currentZoneDetails?.horaireCota[selectedHoraireIndex]
                        .liste_benevole.length === 0 ? (
                        <input
                          type="text"
                          className="input"
                          value="0 bénévole inscrits"
                          readOnly
                        />
                      ) : (
                        currentZoneDetails?.horaireCota[
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

                  <Champ label="Jeux :">
                    <select
                      className="input"
                      value={selectedJeuId || ""}
                      onChange={(e) => {
                        setSelectedJeuId(e.target.value); // Mettez à jour l'ID du jeu sélectionné
                        handleJeuSelect(e.target.value); // Appelez handleJeuSelect pour ouvrir la modale avec les détails du jeu
                      }}
                    >
                      <option value="">Sélectionner un jeu</option>
                      {jeux.map((jeu, index) => (
                        <option key={index} value={jeu._id}>
                          {jeu.nom_jeu}
                        </option>
                      ))}
                    </select>
                  </Champ>
                </div>
              ) : (
                <p>Chargement des détails de la zone...</p>
              )}

              <div className="button_container">
                {editMode ? (
                  <Bouton
                    type="button"
                    onClick={() => handleSaveChanges(currentZone)}
                  >
                    Enregistrer
                  </Bouton>
                ) : (
                  <Bouton
                    type="button"
                    onClick={handleEditZone} // Appel direct pour basculer le mode d'édition
                  >
                    Modifier
                  </Bouton>
                )}
              </div>
            </>
          ) : (
            <p>Veuillez sélectionner une zone</p>
          )}

          {showModal && jeuDetails && (
            <Modal
              onClose={closeModal}
              valeurDuTitre={jeuDetails.nom_jeu || "Jeu"}
            >
              <DisplayJeux jeu={jeuDetails} />{" "}
              {/* Passez les détails du jeu ici */}
            </Modal>
          )}

          {errorMessage && isPopupVisible && (
            <FenetrePopup
              message={errorMessage}
              type="error"
              onClose={hidePopup}
            />
          )}

          {successMessage && isPopupVisible && (
            <FenetrePopup
              message={successMessage}
              type="success"
              onClose={hidePopup}
            />
          )}
        </>
      )}
    </>
  );
}

export default DisplayZone;
