import React, { useState, useEffect } from "react";
import Champ from "../../general/champ";
import "../../../styles/Admin/stands/display_stand.css";
import BoutonPageSuivante from "../../general/BoutonPageSuivante";
import BoutonPagePrecedente from "../../general/BoutonPagePrecedente";
import Modal from "../../general/fenetre_modale";
import StandForm from "./form_ajouter_stand";
import Titre from "../../general/titre";
import Bouton from "../../general/bouton";
import FenetrePopup from "../../general/fenetre_popup";
import { func } from "prop-types";
// import RadioButton from "../../general/radioButton";

function DisplayStand() {
  const [showModal, setShowModal] = useState(false);
  const [stands, setStands] = useState([]);
  const [currentStandIndex, setCurrentStandIndex] = useState(0);
  const currentStand = stands[currentStandIndex] || {};
  const [editMode, setEditMode] = useState(false);
  const [nonReferentBenevoles, setNonReferentBenevoles] = useState([]);
  const [selectedBenevole, setSelectedBenevole] = useState(null); // Pour stocker le bénévole sélectionné
  const [showSelector, setShowSelector] = useState(false);
  const [currentStandDetails, setCurrentStandDetails] = useState(null);
  const [selectedHoraireIndex, setSelectedHoraireIndex] = useState(0); // suppose que le premier horaire est sélectionné par défaut
  const [textareaHeights, setTextareaHeights] = useState({}); // Stocke les hauteurs des textarea pour chaque stand
  const [selectedStand, setSelectedStand] = useState("");
  const [selectedDate, setSelectedDate] = useState("both");
  const [dateDebut, setDateDebut] = useState(null);
  const [dateFin, setDateFin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [referentsLoaded, setReferentsLoaded] = useState(false);
  const [addingReferent, setAddingReferent] = useState(false);
  const [hasStandDataChanged, setHasStandDataChanged] = useState(false);

  const [isPopupVisible, setPopupVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const hidePopup = () => {
    setPopupVisible(false);
  };

  useEffect(() => {
    const fetchFestivalAndStands = async () => {
      setLoading(true);
      try {
        const festivalData = await fetchFestivalData();
        setDateRange(festivalData.date_debut, festivalData.date_fin);
        await fetchStandsForFestival(
          festivalData.date_debut,
          festivalData.date_fin
        );
      } catch (error) {
        console.error("Error loading data:", error);
        setErrorMessage("Error loading data");
      } finally {
        setLoading(false);
      }
    };
    fetchFestivalAndStands();
  }, []);

  const fetchFestivalData = async () => {
    const response = await fetch(
      `https://festivaldujeuback.onrender.com/festival/latest`
    );
    if (!response.ok) throw new Error("Failed to fetch festival data");
    return response.json();
  };

  const setDateRange = (startDate, endDate) => {
    setDateDebut(startDate);
    setDateFin(endDate);
  };

  const fetchStandsForFestival = async (startDate, endDate) => {
    const standsForStart = await fetchStandsByDate(startDate);
    const standsForEnd = await fetchStandsByDate(endDate);
    setStands([...standsForStart, ...standsForEnd].sort(compareStandDates));
  };

  const fetchStandsByDate = async (date) => {
    const response = await fetch(
      `https://festivaldujeuback.onrender.com/stands/date/${date}`
    );
    if (!response.ok) throw new Error("Failed to fetch stands by date");
    return response.json();
  };

  const fetchStandDetails = async (standId) => {
    const response = await fetch(
      `https://festivaldujeuback.onrender.com/stands/${standId}`
    );
    if (!response.ok) throw new Error("Failed to fetch stand details");
    setCurrentStandDetails(await response.json());
    setReferentsLoaded(true); // Indique que les données des référents sont chargées
  };

  useEffect(() => {
    if (currentStandIndex >= 0 && currentStandIndex < stands.length) {
      // Fetch stand details only if the currentStandIndex is valid
      fetchStandDetails(stands[currentStandIndex]._id);
    }
  }, [currentStandIndex, stands]);

  useEffect(() => {
    const fetchFestivalAndStands = async () => {
      setLoading(true);
      try {
        // Fetch festival dates first
        const festivalData = await fetchFestivalData();
        if (festivalData.date_debut && festivalData.date_fin) {
          // Set festival dates in state
          setDateDebut(festivalData.date_debut);
          setDateFin(festivalData.date_fin);
          // Once we have the dates, fetch stands for those dates
          await fetchStandsByDate(
            festivalData.date_debut,
            festivalData.date_fin
          );
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        setErrorMessage("Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };

    fetchFestivalAndStands();
  }, []);

  useEffect(() => {
    if (dateDebut && dateFin) {
      fetchStandsByDate(dateDebut); // Appel pour les stands du samedi
      fetchStandsByDate(dateFin); // Appel pour les stands du dimanche
    }
  }, [dateDebut, dateFin]);

  const fetchStandsData = async () => {
    try {
      let url = "https://festivaldujeuback.onrender.com/stands";
      const response = await fetch(url);
      if (response.ok) {
        let standsData = await response.json();

        // Filtre basé sur les dates du festival si nécessaire
        if (selectedDate === "both" && dateDebut && dateFin) {
          standsData = standsData.filter(
            (stand) =>
              new Date(stand.date).getTime() ===
                new Date(dateDebut).getTime() ||
              new Date(stand.date).getTime() === new Date(dateFin).getTime()
          );
        }

        standsData.sort(compareStandDates);
        setStands(standsData);

        if (standsData.length > 0) {
          await fetchStandDetails(standsData[0]._id); // Make sure to await this call
        }
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des stands", error);
    } finally {
      setLoading(false); // Set loading to false once everything is loaded
    }
  };

  const fetchNonReferentBenevoles = async () => {
    try {
      const response = await fetch(
        "https://festivaldujeuback.onrender.com/benevole/non-referent"
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

  useEffect(() => {
    if (stands.length > 0 && currentStandIndex >= 0) {
      const standId = stands[currentStandIndex]._id;
      fetchStandDetails(standId);
    }
  }, [currentStandIndex, stands]);

  useEffect(() => {
    if (selectedStand && stands.length > 0) {
      const standIndex = stands.findIndex(
        (stand) => stand._id === selectedStand
      );
      setCurrentStandIndex(standIndex !== -1 ? standIndex : 0);
    }
  }, [selectedStand, stands]);

  const handleNomStandChange = (e) => {
    const updatedStands = [...stands];
    updatedStands[currentStandIndex].nom_stand = e.target.value;
    setStands(updatedStands);
  };

  const handleDescriptionChange = (e, standIndex) => {
    const updatedStands = [...stands];
    updatedStands[currentStandIndex].description = e.target.value;
    setStands(updatedStands);

    // Ajustez la hauteur du textarea correspondant
    setTextareaHeights((prevHeights) => ({
      ...prevHeights,
      [standIndex]: `${e.target.scrollHeight}px`,
    }));
  };

  const handleRadioDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    if (newDate === "both") {
      fetchStandsData();
    } else {
      const specificDate = newDate === "date_debut" ? dateDebut : dateFin;
      fetchStandsByDate(specificDate);
    }
  };

  useEffect(() => {
    if (dateDebut && dateFin) {
      handleRadioDateChange({ target: { value: "both" } });
    }
  }, [dateDebut, dateFin]);

  // const radioOptions = [
  //   { label: formatDate(dateDebut), value: "date_debut" },
  //   { label: formatDate(dateFin), value: "date_fin" },
  //   { label: "Tous les stands", value: "both" },
  // ];

  // Fonction pour comparer les dates
  const compareStandDates = (a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA - dateB; // Tri croissant par date
  };

  // // Utilisation de la fonction de tri
  // const sortedStands = [...stands].sort(compareStandDates);

  const handleNbBenevoleChange = (index, value) => {
    const updatedStands = [...stands];
    updatedStands[currentStandIndex].horaireCota[index].nb_benevole = value;
    setStands(updatedStands);
    setHasStandDataChanged(true); // Ajoutez cette ligne
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

  useEffect(() => {
    if (editMode) {
      fetchNonReferentBenevoles();
    }
  }, [editMode]);

  useEffect(() => {
    if (selectedDate === "both") {
      fetchStandsData();
    }
  }, [selectedDate]);

  const handleRemoveReferent = async (referentId, event) => {
    event.stopPropagation();
    try {
      if (!currentStand._id || !referentId) {
        console.error("ID du stand ou du référent manquant.");
        return;
      }

      const url = `https://festivaldujeuback.onrender.com/stands/removeReferent/${currentStand._id}/${referentId}`;
      console.log("Sending DELETE request to:", url);

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          // Assurez-vous d'inclure les en-têtes d'authentification si nécessaire.
        },
      });

      if (!response.ok) {
        // Si la réponse n'est pas ok, afficher l'erreur et arrêter l'exécution
        const errorText = await response.text();
        throw new Error(
          `Erreur lors de la suppression du référent : ${errorText}`
        );
      }

      console.log("Référent supprimé avec succès du stand !");

      // Mise à jour de l'état local pour refléter la suppression du référent
      const updatedCurrentStandDetails = {
        ...currentStandDetails,
        referents: currentStandDetails.referents.filter(
          (ref) => ref._id !== referentId
        ),
      };

      setCurrentStandDetails(updatedCurrentStandDetails);

      // Mise à jour de l'état des stands avec les détails mis à jour
      const updatedStands = stands.map((stand) =>
        stand._id === currentStand._id ? updatedCurrentStandDetails : stand
      );

      setStands(updatedStands);
    } catch (error) {
      console.error("Erreur lors de la suppression du référent :", error);
      // Afficher une fenêtre popup ou une notification d'erreur à l'utilisateur ici
    }
  };

  const handleSaveChanges = async () => {
    // Vérifiez d'abord si le mode de sélection du référent est actif
    if (showSelector) {
      setErrorMessage(
        "Veuillez valider votre sélection de référent avant d'enregistrer."
      );
      setPopupVisible(true);
      return;
    }

    try {
      // Si seul le champ "referent" a été modifié ou si aucune autre donnée du stand n'a changé
      if (
        !hasStandDataChanged &&
        JSON.stringify(currentStand.referents) ===
          JSON.stringify(stands[currentStandIndex].referents)
      ) {
        // Fermez le mode édition et affichez le message de succès
        setEditMode(false);
        setSuccessMessage("Référents mis à jour avec succès");
        setErrorMessage(null);
        setPopupVisible(true);
        return;
      }

      // Si d'autres données du stand ont été modifiées ou si hasStandDataChanged est true
      // Mettez à jour l'état avec les modifications
      const updatedStands = [...stands];
      updatedStands[currentStandIndex] = { ...currentStand };
      setStands(updatedStands);

      // Mettez à jour l'état des détails du stand
      setCurrentStandDetails(updatedStands[currentStandIndex]);

      // Construire l'objet de demande
      const standToUpdate = {
        ...updatedStands[currentStandIndex],
        horaireCota: [...updatedStands[currentStandIndex].horaireCota],
      };

      // Effectuez la mise à jour sur le serveur avec les données mises à jour
      const response = await fetch(
        `https://festivaldujeuback.onrender.com/stands/${currentStand._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(standToUpdate),
        }
      );

      if (response.ok) {
        // Mise à jour réussie, afficher la pop-up de succès
        setEditMode(false); // Désactiver le mode édition
        setSuccessMessage("Modifications enregistrées avec succès");
        setErrorMessage(null); // Réinitialiser le message d'erreur
        setPopupVisible(true); // Afficher la pop-up de succès
        setHasStandDataChanged(false); // Réinitialiser le drapeau de suivi des modifications
      } else {
        // La requête a échoué, afficher une erreur
        throw new Error("Échec de l'enregistrement des modifications");
      }
    } catch (error) {
      // Gérer les erreurs de la requête ou les erreurs lancées manuellement
      setSuccessMessage(null); // Réinitialiser le message de succès
      setErrorMessage(
        `Erreur lors de l'enregistrement des modifications: ${error.message}`
      );
      setPopupVisible(true); // Afficher la pop-up d'erreur
    }
  };

  const handleDeleteStand = async () => {
    try {
      const response = await fetch(
        `https://festivaldujeuback.onrender.com/stands/${currentStand._id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        // Le stand a été supprimé avec succès, mettez à jour l'interface utilisateur
        const updatedStands = [...stands];
        updatedStands.splice(currentStandIndex, 1); // Supprimez le stand du tableau local
        setStands(updatedStands);

        // Réinitialisez le mode d'édition et le stand actuel
        setEditMode(false);
        setCurrentStandIndex(0); // Vous pouvez initialiser l'index à 0 ou une autre valeur appropriée
        setSuccessMessage("Stand supprimé avec succès");
        setErrorMessage(null);
      } else {
        throw new Error("Échec de la suppression du stand");
      }
    } catch (error) {
      setErrorMessage(
        "Erreur lors de la suppression du stand: " + error.message
      );
    } finally {
      setPopupVisible(true);
    }
  };

  const showPreviousStand = () => {
    setCurrentStandIndex((prevIndex) => {
      if (prevIndex === 0) {
        return stands.length - 1;
      } else {
        return prevIndex - 1;
      }
    });
  };

  const showNextStand = () => {
    setCurrentStandIndex((prevIndex) => {
      if (prevIndex === stands.length - 1) {
        return 0;
      } else {
        return prevIndex + 1;
      }
    });
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleSelectBenevole = (benevole) => {
    // Mettre à jour le bénévole sélectionné
    setSelectedBenevole({ value: benevole.target.value });
  };

  const handleAddReferent = async () => {
    console.log(
      "stand : " + currentStand._id + " benevole : " + selectedBenevole.value
    );
    try {
      const response = await fetch(
        `https://festivaldujeuback.onrender.com/stands/referent/${currentStand._id}/${selectedBenevole.value}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        console.log("Référent ajouté avec succès !");
        fetchStandDetails(currentStand._id);
        setSelectedBenevole(null); // Réinitialiser le bénévole sélectionné
        setAddingReferent(false);
        setShowSelector(false);
      } else {
        // Gérer les réponses non-OK
        console.error(
          "Erreur lors de l'ajout d'un référent",
          await response.text()
        );
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout d'un référent :", error);
    }
  };

  const handleEditStand = (standIndex) => () => {
    // Mettre à jour l'index du stand actuel avant d'activer le mode édition
    setCurrentStandIndex(standIndex);

    // Activer le mode édition
    setEditMode(true);
  };

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : stands.length === 0 ? (
        // If there are no stands
        <div className="form-display">
          <p>Aucun stand d'ajouté pour l'instant.</p>
          <Bouton type="button" onClick={openModal}>
            Ajouter un stand
          </Bouton>
        </div>
      ) : (
        <div key={currentStandIndex}>
          <div className="header-stand">
            {/* RadioButton pour la sélection de la date */}
            {/* <RadioButton
              options={radioOptions}
              name="dateSelection"
              selectedValue={selectedDate}
              onChange={handleRadioDateChange}
            /> */}
            {/* Filtre les stands dans le select en fonction de la date sélectionnée */}
            <Champ customStyle={{ marginLeft: "0" }}>
              <select
                onChange={(e) => setSelectedStand(e.target.value)}
                value={selectedStand} // Remplacer defaultValue par value pour le contrôle complet
                className="input"
              >
                <option value="">Tous les stands</option>
                {stands.map(
                  (
                    stand,
                    index // Pas besoin de trier ici, car stands est déjà trié
                  ) => (
                    <option key={index} value={stand._id}>
                      {stand.nom_stand} ({formatDate(stand.date)})
                    </option>
                  )
                )}
              </select>
            </Champ>
          </div>
          <hr className="separator-stand" />
          <div className="Entete-btn">
            <div className="btn-changer-page" onClick={showPreviousStand}>
              <BoutonPagePrecedente />
            </div>
            <Titre valeurDuTitre={stands[currentStandIndex]?.nom_stand || ""} />
            <div className="btn-changer-page" onClick={showNextStand}>
              <BoutonPageSuivante />
            </div>
          </div>

          {currentStandDetails ? (
            <div className="form-display">
              {editMode && (
                <Champ label="Nom du stand :">
                  <input
                    type="text"
                    value={currentStand?.nom_stand || ""}
                    onChange={handleNomStandChange}
                    className="input"
                    readOnly={!editMode}
                  />
                </Champ>
              )}

              <Champ label="Date :">
                <input
                  type="text"
                  value={formatDate(currentStand?.date || "")}
                  className="input"
                  readOnly
                />
              </Champ>

              <Champ label="Description :">
                <textarea
                  type="text"
                  value={currentStand?.description || ""}
                  onChange={(e) =>
                    handleDescriptionChange(e, currentStandIndex)
                  }
                  className="input"
                  readOnly={!editMode}
                  style={{
                    height: textareaHeights[currentStandIndex] || "auto",
                  }}
                />
              </Champ>

              <div className="referent-container">
                <Champ label="Référents :">
                  {editMode && (
                    <div className="edit-mode-container">
                      {/* Condition pour afficher le sélecteur de bénévoles non-référents au-dessus des référents existants si showSelector est vrai et s'il y a des référents */}
                      {showSelector &&
                        currentStandDetails?.referents.length > 0 && (
                          <select
                            className="input"
                            onChange={handleSelectBenevole}
                            value={
                              selectedBenevole ? selectedBenevole.value : ""
                            }
                          >
                            <option value="">Sélectionner un bénévole</option>
                            {nonReferentBenevoles.map((benevole, index) => (
                              <option key={index} value={benevole._id}>
                                {benevole.pseudo}
                              </option>
                            ))}
                          </select>
                        )}

                      {/* Condition pour afficher le sélecteur à la place de "Pas de référents" si aucun référent n'est présent et que showSelector est vrai */}
                      {showSelector &&
                      currentStandDetails?.referents.length === 0 ? (
                        <select
                          className="input"
                          onChange={handleSelectBenevole}
                          value={selectedBenevole ? selectedBenevole.value : ""}
                        >
                          <option value="">Sélectionner un bénévole</option>
                          {nonReferentBenevoles.map((benevole, index) => (
                            <option key={index} value={benevole._id}>
                              {benevole.pseudo}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <>
                          {currentStandDetails?.referents.map(
                            (referent, index) => (
                              <div
                                key={referent._id}
                                className="referent-display"
                              >
                                <input
                                  type="text"
                                  className="input"
                                  value={referent.pseudo || ""}
                                  readOnly
                                />
                                <button
                                  className="supp-button"
                                  onClick={(event) =>
                                    handleRemoveReferent(referent._id, event)
                                  }
                                >
                                  X
                                </button>
                              </div>
                            )
                          )}
                          {currentStandDetails?.referents.length === 0 && (
                            <input
                              type="text"
                              className="input"
                              value="Pas de référents"
                              readOnly
                            />
                          )}
                        </>
                      )}

                      <div className="add-btn-container">
                        <button
                          onClick={() => {
                            if (showSelector) {
                              handleAddReferent();
                            }
                            setShowSelector(!showSelector);
                          }}
                          className="add-button"
                        >
                          {showSelector ? "OK" : "+"}
                        </button>
                      </div>
                    </div>
                  )}

                  {!editMode && (
                    <>
                      {currentStandDetails?.referents.map((referent, index) => (
                        <div key={referent._id} className="referent-display">
                          <input
                            type="text"
                            className="input"
                            value={referent.pseudo || ""}
                            readOnly
                          />
                        </div>
                      ))}
                      {currentStandDetails?.referents.length === 0 && (
                        <input
                          type="text"
                          className="input"
                          value="Pas de référents"
                          readOnly
                        />
                      )}
                    </>
                  )}
                </Champ>
              </div>

              {currentStand.nom_stand === "Animation jeu" ? (
                <p>Pour plus de détail aller sur l'onglet Zones</p>
              ) : (
                <div className="horaire-container">
                  <Champ label="Horaire :">
                    <select
                      className="input"
                      value={selectedHoraireIndex}
                      onChange={(e) => setSelectedHoraireIndex(e.target.value)}
                    >
                      {currentStand?.horaireCota &&
                      currentStand.horaireCota.length > 0 ? (
                        currentStand.horaireCota.map((horaire, index) => (
                          <option key={index} value={index}>
                            {horaire.heure}
                          </option>
                        ))
                      ) : (
                        <option>Aucun horaire disponible</option> // Cette option s'affiche s'il n'y a pas d'horaires
                      )}
                    </select>
                  </Champ>
                  <Champ label="Capacité :">
                    <input
                      type="number"
                      min="1"
                      value={
                        currentStand &&
                        currentStand.horaireCota &&
                        currentStand.horaireCota[selectedHoraireIndex]
                          ? currentStand.horaireCota[selectedHoraireIndex]
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
                    {/* Utilisez ?. pour accéder en toute sécurité à liste_benevole */}
                    {currentStandDetails?.horaireCota[selectedHoraireIndex]
                      ?.liste_benevole.length === 0 ? (
                      <input
                        type="text"
                        className="input"
                        value="0 bénévole inscrits"
                        readOnly
                      />
                    ) : (
                      currentStandDetails?.horaireCota[
                        selectedHoraireIndex
                      ]?.liste_benevole.map((benevole, index) => (
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
              )}
            </div>
          ) : (
            <p>Aucun stand trouvé.</p>
          )}

          <div className="button_container">
            {editMode ? (
              <>
                <Bouton
                  type="button"
                  onClick={() => handleSaveChanges(currentStand)}
                >
                  Enregistrer
                </Bouton>
                <Bouton
                  type="button"
                  onClick={() => handleDeleteStand(currentStand)}
                >
                  Supprimer ce stand
                </Bouton>
              </>
            ) : (
              <>
                <Bouton
                  type="button"
                  onClick={handleEditStand(currentStandIndex)}
                >
                  Modifier
                </Bouton>
                <Bouton type="button" onClick={openModal}>
                  Ajouter un stand
                </Bouton>
              </>
            )}
          </div>
        </div>
      )}
      {showModal && (
        <Modal onClose={closeModal}>
          <Titre valeurDuTitre="Ajouter un stand" />
          <StandForm onClose={closeModal} />
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
    </>
  );
}

export default DisplayStand;
