import React, { useState, useEffect } from "react";
import Champ from "../../general/champ";
import "../../../styles/Admin/stands/display_stand.css";
import BoutonPageSuivante from "../../BoutonPageSuivante";
import BoutonPagePrecedente from "../../BoutonPagePrecedente";
import Modal from "../../general/fenetre_modale";
import StandForm from "./form_ajouter_stand";
import Titre from "../../general/titre";
import Bouton from "../../general/bouton";
import FenetrePopup from "../../general/fenetre_popup";

function Display_stand() {
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

  const [isPopupVisible, setPopupVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const hidePopup = () => {
    setPopupVisible(false);
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  async function fetchStandsData() {
    try {
      // Pas besoin de token ou pseudo ici, sauf si l'API exige une authentification
      const response = await fetch("http://localhost:3500/stands", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const standsData = await response.json();
        console.log("Stands data:", standsData);
        setStands(
          standsData.map((stand) => ({
            ...stand,
            nom_stand: stand.nom_stand || "",
            description: stand.description || "",
            date: stand.date || "",
            referents: stand.referents || "",
            horaireCota: stand.horaireCota.map((horaire) => ({
              ...horaire,
              heure: horaire.heure || "",
              nb_benevole: horaire.nb_benevole || "",
              liste_benevole: horaire.liste_benevole || [],
            })),
          }))
        );
      }
    } catch (error) {
      console.error(
        "Une erreur s'est produite lors de la récupération des stands",
        error
      );
      // Gérer l'erreur, par exemple afficher un message d'erreur à l'utilisateur
    }
  }

  useEffect(() => {
    fetchStandsData();
  }, [editMode]);

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

  async function fetchStandDetails(standId) {
    try {
      const response = await fetch(`http://localhost:3500/stands/${standId}`);
      if (response.ok) {
        const standDetails = await response.json();
        setCurrentStandDetails(standDetails); // Mise à jour avec les détails récupérés
      } else {
        throw new Error("Failed to fetch stand details");
      }
    } catch (error) {
      console.error("Error fetching stand details:", error);
    }
  }

  useEffect(() => {
    if (stands.length > 0) {
      const standId = stands[currentStandIndex]._id;
      if (standId) {
        fetchStandDetails(standId);
      }
    }
  }, [currentStandIndex, stands]);

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

  const handleDateChange = (e) => {
    const updatedStands = [...stands];
    updatedStands[currentStandIndex].date = e.target.value;
    setStands(updatedStands);
  };

  const handleNbBenevoleChange = (index, value) => {
    const updatedStands = [...stands];
    updatedStands[currentStandIndex].horaireCota[index].nb_benevole = value;
    setStands(updatedStands);
  };

  function formatDate(date) {
    if (!date) return '';
  
    // Crée un nouvel objet Date si date n'est pas déjà une instance de Date
    const dateObj = date instanceof Date ? date : new Date(date);
    
    // Formate la date en 'jj/mm/aaaa'
    return dateObj.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  const handleRemoveReferent = async (referentId) => {
    try {
      if (!currentStand._id || !referentId) {
        console.error("ID du stand ou du référent manquant.");
        return;
      }

      const response = await fetch(
        `http://localhost:3500/stands/removeReferent/${currentStand._id}/${referentId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        console.log("Référent supprimé avec succès !");
        // Mettez à jour l'état des stands après la suppression du référent
        fetchStandsData();
      } else {
        throw new Error("Erreur lors de la suppression du référent");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du référent :", error);
    }
  };

  const handleSaveChanges = async () => {
    console.log("ID du stand à mettre à jour :", currentStand._id);

    try {
      const response = await fetch(
        `http://localhost:3500/stands/${currentStand._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(currentStand),
        }
      );
      console.log("Données à envoyer :", JSON.stringify(currentStand));

      if (response.ok) {
        const updatedStands = [...stands];
        updatedStands[currentStandIndex] = currentStand;
        setStands(updatedStands);

        // Désactive le mode édition
        toggleEditMode();
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

  const handleDeleteStand = async () => {
    try {
      const response = await fetch(
        `http://localhost:3500/stands/${currentStand._id}`,
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
    console.log("stand : " + currentStandIndex);
  };

  const showNextStand = () => {
    setCurrentStandIndex((prevIndex) => {
      if (prevIndex === stands.length - 1) {
        return 0;
      } else {
        return prevIndex + 1;
      }
    });
    console.log("stand : " + currentStandIndex);
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleAddReferentDisplay = async () => {
    await fetchNonReferentBenevoles();
    setShowSelector(true);
  };

  const handleSelectBenevole = (benevole) => {
    // Mettre à jour le bénévole sélectionné
    setSelectedBenevole({ value: benevole.target.value });
  };

  const handleAddReferent = async () => {
    // Vérifier si un bénévole est sélectionné
    if (selectedBenevole && selectedBenevole.value) {
      const response = await fetch(
        `http://localhost:3500/stands/referent/${currentStand._id}/${selectedBenevole.value}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          // Pas besoin de body car l'ID du bénévole est dans l'URL
        }
      );
      if (response.ok) {
        fetchStandsData(); // Cette fonction devrait également mettre à jour les référents dans l'état du composant
      } else {
        // Gérer les réponses non-OK, comme l'erreur 404
        console.error(
          "Erreur lors de l'ajout d'un référent",
          await response.text()
        );
      }
    } else {
      // Si aucun bénévole n'est sélectionné ou l'identifiant du bénévole est manquant
      console.warn(
        "Aucun bénévole sélectionné ou l'identifiant du bénévole est manquant."
      );
    }
    // Réinitialiser le sélecteur de bénévoles et l'état de sélection, que l'ajout soit réussi ou non
    setShowSelector(false);
    setSelectedBenevole(null);
  };

  const handleEditStand = (standIndex) => () => {
    // Active le mode édition uniquement pour le stand spécifié
    const updatedStands = [...stands];
    updatedStands[standIndex].editMode = true;
    setStands(updatedStands);
    // Ne pas réinitialiser l'index ici
    toggleEditMode();
  };

  return (
    <>
      {stands.length === 0 ? (
        <div className="form-display">
          <p>Aucun stand d'ajouté pour l'instant.</p>
          <Bouton type="button" onClick={openModal}>
            Ajouter un stand
          </Bouton>
        </div>
      ) : (
        <>
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
                  onChange={handleDateChange}
                  className="input"
                  readOnly={!editMode}
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
                  {showSelector ? (
                    <select className="input" onChange={handleSelectBenevole}>
                      <option value="">Sélectionner un bénévole</option>
                      {nonReferentBenevoles.map((benevole, index) => (
                        <option key={index} value={benevole._id}>
                          {benevole.pseudo}
                        </option>
                      ))}
                    </select>
                  ) : currentStandDetails?.referents &&
                    currentStandDetails.referents.length > 0 ? (
                    currentStandDetails.referents.map((referent) => (
                      <div key={referent._id} className="referent-input">
                        <input
                          type="text"
                          className="input"
                          value={referent.pseudo || ""} // Utilisation directe du pseudo
                          readOnly
                        />
                        {editMode && (
                          <button
                            onClick={() => handleRemoveReferent(referent._id)}
                            className="supp-button"
                          >
                            X
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <input
                      type="text"
                      className="input"
                      value="Pas de référents"
                      readOnly
                    />
                  )}
                </Champ>
                {editMode && (
                  <div className="add-btn-container">
                    {showSelector ? (
                      <button
                        onClick={handleAddReferent}
                        className="add-button"
                        style={{ fontSize: "15px" }}
                      >
                        OK
                      </button>
                    ) : (
                      <button
                        onClick={handleAddReferentDisplay}
                        className="add-button"
                      >
                        +
                      </button>
                    )}
                  </div>
                )}
              </div>

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
                  {currentStandDetails?.horaireCota[selectedHoraireIndex]
                    .liste_benevole.length === 0 ? (
                    <input
                      type="text"
                      className="input"
                      value="0 bénévole inscrits"
                      readOnly
                    />
                  ) : (
                    currentStandDetails?.horaireCota[
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
        </>
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

export default Display_stand;
