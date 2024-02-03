import React, { useState, useEffect } from "react";
import "../../../styles/Admin/flexible/flexible.css";
import Bouton from "../../general/bouton";
import Titre from "../../general/titre";
import FenetrePopup from "../../general/fenetre_popup";
import Champ from "../../general/champ";
import Jauge from "../../benevole/stands/jauge";

function Flexible() {
  const [flexibles, setFlexibles] = useState([]);
  const [selectedFlexibleId, setSelectedFlexibleId] = useState(null);
  const [selectedFlexible, setSelectedFlexible] = useState(null);
  const [selectedStands, setSelectedStands] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [filteredFlexibles, setFilteredFlexibles] = useState([]);

  useEffect(() => {
    // Exemple d'appel API pour récupérer les données du festival
    const fetchData = async () => {
      const result = await fetch("http://localhost:3500/festival/latest");
      const body = await result.json();
      setDateDebut(body.date_debut);
      setDateFin(body.date_fin);
    };
    fetchData();
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

    // Filtrez les bénévoles flexibles pour la date sélectionnée
    const filtered = flexibles.filter((flexible) =>
      flexible.horaire.some(
        (horaire) => formatDate(horaire.date) === formatDate(selectedValue)
      )
    );

    setFilteredFlexibles(filtered); // Mettre à jour les bénévoles filtrés
  };

  const hidePopup = () => {
    setPopupVisible(false);
  };

  useEffect(() => {
    // Récupérez la liste complète des bénévoles flexibles
    fetch("http://localhost:3500/flexible")
      .then((response) => response.json())
      .then((data) => {
        setFlexibles(data);
        // Filtrez les bénévoles flexibles si une date est déjà sélectionnée
        if (selectedDate) {
          const filtered = data.filter((flexible) =>
            flexible.horaire.some(
              (horaire) => formatDate(horaire.date) === formatDate(selectedDate)
            )
          );
          setFilteredFlexibles(filtered);
        }
      })
      .catch((error) =>
        console.error(
          "Erreur lors de la récupération des bénévoles flexibles: ",
          error
        )
      );
  }, [selectedDate]);

  // Gestionnaire de clic pour afficher les informations du bénévole flexible sélectionné
  const handleFlexibleClick = (flexibleId) => {

    if (selectedFlexibleId === flexibleId) {
      setSelectedFlexibleId(null);
      setSelectedFlexible(null);
      return;
    }
    setSelectedStands({});

    // Récupérez les informations du bénévole flexible en fonction de son ID
    fetch(`http://localhost:3500/flexible/benevole/${flexibleId}`)
      .then((response) => response.json())
      .then((data) => {
        setSelectedFlexible(data);
      })
      .catch((error) =>
        console.error(
          "Erreur lors de la récupération des informations du bénévole flexible: ",
          error
        )
      );
    setSelectedFlexibleId(flexibleId);
  };

  const fetchStandDetails = async (standId, horaire) => {
    try {
      const response = await fetch(`http://localhost:3500/stands/${standId}`);
      const standData = await response.json();
      if (!response.ok)
        throw new Error(
          standData.message ||
            "Erreur lors de la récupération des détails du stand"
        );

      // Trouver les informations de quota pour l'horaire spécifique
      const horaireCota = standData.horaireCota.find(
        (h) => h.heure === horaire
      );
      if (!horaireCota)
        throw new Error("Horaire spécifique non trouvé dans le stand");

      // Calculer le nombre de places restantes
      const placesRestantes =
        horaireCota.nb_benevole - horaireCota.liste_benevole.length;

      setSelectedStands((prevStands) => ({
        ...prevStands,
        [horaire]: {
          ...prevStands[horaire],
          standId,
          nb_benevole: horaireCota.nb_benevole,
          nom_stand: standData.nom_stand,
          placesRestantes, // Ajouter le nombre de places restantes à l'objet
        },
      }));
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des détails du stand: ",
        error.message
      );
    }
  };

  const horaires = ["9-11", "11-14", "14-17", "17-20", "20-22"];

  const handleStandClick = (horaire, standId) => {
    setSelectedStands((prevStands) => {
      const isStandSelected = prevStands[horaire]?.standId === standId;
      if (isStandSelected) {
        const { [horaire]: _, ...rest } = prevStands;
        return rest;
      } else {
        return {
          ...prevStands,
          [horaire]: {
            standId,
            // Vous pouvez inclure d'autres détails ici si nécessaire
          },
        };
      }
    });
    fetchStandDetails(standId, horaire);
  };

  const handleCancel = () => {
    setSelectedStands({});
  };

  const handleSubmit = async () => {
    if (Object.keys(selectedStands).length === 0) {
      console.log("Aucun stand sélectionné.");
      return;
    }

    // Créez un tableau des stands sélectionnés
    const selectedStandArray = Object.entries(selectedStands).map(
      ([horaire, standInfo]) => ({
        horaire,
        standId: standInfo.standId,
        idBenevole: selectedFlexibleId,
      })
    );

    try {
      for (const standInfo of selectedStandArray) {
        const response = await fetch(
          `http://localhost:3500/stands/inscrire/${standInfo.standId}/${standInfo.horaire}/${standInfo.idBenevole}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          if (errorData.message.includes("déjà inscrit")) {
            setErrorMessage(
              "Vous ne pouvez pas vous inscrire à ce stand car vous êtes déjà inscrit à un autre stand ou zone à ce même horaire."
            );
            setPopupVisible(true);
          } else {
            setErrorMessage(
              "Une erreur est survenue lors de votre inscription."
            );
            setPopupVisible(true);
          }
          throw new Error(
            errorData.message || "Erreur lors de l'inscription à un stand."
          );
        }
      }
      console.log("Inscription réussie.");
      setIsSubmitting(true);
      console.log(
        "Tous les horaires ont été attribués, suppression du flexible..."
      );
      const reponse = await fetch(
        `http://localhost:3500/flexible/${selectedFlexible._id}/${selectedDate}`,
        {
          method: "DELETE",
        }
      );
      if (!reponse.ok) {
        throw new Error("Erreur lors de la suppression du flexible.");
      } else {
        console.log("Flexible supprimé avec succès.");
        setFlexibles(
          flexibles.filter(
            (flexible) => flexible.benevole_id[0]._id !== selectedFlexibleId
          )
        );
        setSelectedFlexibleId(null);
        setSelectedFlexible(null);
        await checkAndDeleteFlexible();
        setIsSubmitting(false); // Réinitialiser isSubmitting
        handleCancel(); // Réinitialiser le formulaire
        window.location.reload(); // Rafraîchir la page
      }
    } catch (error) {
      console.error(error.message);
      setErrorMessage(error.message);
      setPopupVisible(true);
    }
  };

  useEffect(() => {
    console.log("selectedStands updated:", selectedStands);
  }, [selectedStands]);

  const checkAndDeleteFlexible = async () => {
    try {
      const response = await fetch("http://localhost:3500/flexible/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok)
        throw new Error("Erreur lors de la vérification des flexibles.");
      const result = await response.json();
      console.log("Flexibles nettoyés:", result.deletedFlexibles);
    } catch (error) {
      console.error("Erreur lors du nettoyage des flexibles:", error);
    }
  };

  function getStandsForHoraire(horaires, selectedHoraire) {
    return horaires
      .filter(
        (horaire) =>
          horaire.heure === selectedHoraire &&
          formatDate(horaire.date) === formatDate(selectedDate)
      )
      .flatMap((horaire) => horaire.liste_stand);
  }

  return (
    <div>
      <Titre valeurDuTitre={`Liste des bénévoles flexibles pour les stands`} />
      <Champ>
        <select
          className="input"
          value={selectedDate}
          onChange={handleDateChange}
        >
          <option value="">Choisissez une date</option>
          {dateDebut && (
            <option value={dateDebut}>{formatDate(dateDebut)}</option>
          )}
          {dateFin && <option value={dateFin}>{formatDate(dateFin)}</option>}
        </select>
      </Champ>

      {!selectedDate && <p>Veuillez sélectionner une date</p>}

      {selectedDate && filteredFlexibles.length === 0 && (
        <p>Aucun flexible à cette date là</p>
      )}

      {selectedDate &&
        filteredFlexibles.length > 0 &&
        filteredFlexibles.map((flexible, index) => (
          <React.Fragment key={flexible._id}>
            <div
              onClick={() => handleFlexibleClick(flexible.benevole_id[0]?._id)}
              className={`flexible-item ${
                selectedFlexibleId === flexible.benevole_id[0]?._id
                  ? "selected"
                  : ""
              }`}
            >
              <Titre valeurDuTitre={flexible.benevole_id[0]?.pseudo} />
            </div>

            {selectedFlexible && (
              <div>
                <h2>
                  Choisissez les stands que vous souhaitez attribuer à{" "}
                  {selectedFlexible.benevole_id[0].pseudo}
                </h2>
                {horaires.map((horaire, index) => {
                  const standsForHoraire = getStandsForHoraire(
                    selectedFlexible.horaire,
                    horaire
                  );
                  return (
                    <div key={index} className="flexible-row">
                      <div className="flexible-time">{horaire}</div>
                      {standsForHoraire.length === 0 ? (
                        <Champ customStyle={{ flexGrow: 1 }}>
                          <input
                            className="input"
                            value="Pas de stands sélectionnés pour ce créneau"
                            readOnly
                          />
                        </Champ>
                      ) : (
                        standsForHoraire.map((stand) => (
                          <button
                            className={`button-stand ${
                              selectedStands[horaire]?.standId === stand._id
                                ? "selected-stand"
                                : ""
                            } `}
                            key={stand._id}
                            onClick={() => handleStandClick(horaire, stand._id)}
                          >
                            {stand.nom_stand}
                          </button>
                        ))
                      )}
                    </div>
                  );
                })}

                {Object.keys(selectedStands).length > 0 && (
                  <div>
                    <h2>Informations stands sélectionnés</h2>
                    <ul className="stand-list">
                      {Object.entries(selectedStands).map(
                        ([horaire, standInfo]) => {
                          // Divisez l'heure en deux parties en utilisant le caractère "-"
                          const [heureDebut, heureFin] = horaire.split("-");

                          // Calcul du nombre d'inscrits
                          const nombreInscrits =
                            standInfo.nb_benevole - standInfo.placesRestantes;

                          return (
                            <li key={horaire}>
                              <div className="stand-flex-container">
                                {" "}
                                {/* Nouveau conteneur flex */}
                                <div className="stand-info">
                                  {standInfo.nom_stand} ({heureDebut}h -{" "}
                                  {heureFin}h) :
                                </div>
                                <div className="jauge-pointer-cursor">
                                  <Jauge
                                    capaciteTotale={standInfo.nb_benevole}
                                    nombreInscrits={nombreInscrits}
                                    onClick={() => {}}
                                  />
                                </div>
                              </div>
                            </li>
                          );
                        }
                      )}
                    </ul>
                  </div>
                )}

                {!isSubmitting && (
                  <div className="boutons">
                    <Bouton onClick={handleSubmit}>
                      Soumettre
                    </Bouton>
                    <Bouton onClick={handleCancel}>Annuler</Bouton>
                  </div>
                )}
                {isSubmitting && <p>En cours de soumission...</p>}
              </div>
            )}

            {flexibles.length !== index + 1 && (
              <hr className="flexible-separator" />
            )}
          </React.Fragment>
        ))}

      {errorMessage && isPopupVisible && (
        <FenetrePopup message={errorMessage} type="error" onClose={hidePopup} />
      )}
    </div>
  );
}

export default Flexible;
