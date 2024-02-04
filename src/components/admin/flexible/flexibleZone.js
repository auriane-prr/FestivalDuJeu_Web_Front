import React, { useState, useEffect } from "react";
import "../../../styles/Admin/flexible/flexible.css";
import Bouton from "../../general/bouton";
import Titre from "../../general/titre";
import FenetrePopup from "../../general/fenetre_popup";
import Champ from "../../general/champ";
import Jauge from "../../benevole/stands/jauge";

function FlexibleZone() {
  const [flexibleZones, setFlexibleZones] = useState([]);
  const [selectedFlexibleZoneId, setSelectedFlexibleZoneId] = useState(null);
  const [selectedFlexibleZone, setSelectedFlexibleZone] = useState(null);
  const [selectedZones, setSelectedZones] = useState({});
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
      const result = await fetch("https://festivaldujeuback.onrender.com/festival/latest");
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
    const filtered = flexibleZones.filter((flexibleZones) =>
      flexibleZones.horaire.some(
        (horaire) => formatDate(horaire.date) === formatDate(selectedValue)
      )
    );

    setFilteredFlexibles(filtered); // Mettre à jour les bénévoles filtrés
  };

  const hidePopup = () => {
    setPopupVisible(false);
  };

  // Récupérez la liste des bénévoles flexibleZones au chargement du composant
  useEffect(() => {
    fetch("https://festivaldujeuback.onrender.com/flexibleZone")
      .then((response) => response.json())
      .then((data) => {
        setFlexibleZones(data);
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
          "Erreur lors de la récupération des bénévoles flexibleZones: ",
          error
        )
      );
  }, []);

  // Gestionnaire de clic pour afficher les informations du bénévole flexibleZone sélectionné
  const handleFlexibleZoneClick = (flexibleZoneId) => {
    if (selectedFlexibleZoneId === flexibleZoneId) {
      setSelectedFlexibleZoneId(null);
      setSelectedFlexibleZone(null);
      return;
    }
    setSelectedZones({});

    // Récupérez les informations du bénévole flexibleZone en fonction de son ID
    fetch(`https://festivaldujeuback.onrender.com/flexibleZone/benevole/${flexibleZoneId}`)
      .then((response) => response.json())
      .then((data) => {
        setSelectedFlexibleZone(data);
      })
      .catch((error) =>
        console.error(
          "Erreur lors de la récupération des informations du bénévole flexibleZone: ",
          error
        )
      );
    setSelectedFlexibleZoneId(flexibleZoneId);
  };

  const fetchZoneDetails = async (zoneBenevoleId, horaire) => {
    try {
      const response = await fetch(
        `https://festivaldujeuback.onrender.com/zoneBenevole/${zoneBenevoleId}`
      );
      const zoneBenevoleData = await response.json();
      if (!response.ok)
        throw new Error(
          zoneBenevoleData.message ||
            "Erreur lors de la récupération des détails du zoneBenevole"
        );

      const horaireCota = zoneBenevoleData.horaireCota.find(
        (h) => h.heure === horaire
      );
      if (!horaireCota)
        throw new Error("Horaire spécifique non trouvé dans le zoneBenevole");

      const placesRestantes =
        horaireCota.nb_benevole - horaireCota.liste_benevole.length;

      setSelectedZones((prevZones) => ({
        ...prevZones,
        [horaire]: {
          ...prevZones[horaire],
          zoneBenevoleId,
          nb_benevole: horaireCota.nb_benevole,
          nom_zoneBenevole: zoneBenevoleData.nom_zone_benevole,
          placesRestantes,
        },
      }));
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des détails du zoneBenevole: ",
        error.message
      );
    }
  };

  const horaires = ["9-11", "11-14", "14-17", "17-20", "20-22"];

  const handleZoneClick = (horaire, zoneBenevoleId) => {
    setSelectedZones((prevZones) => {
      const isZoneSelected =
        prevZones[horaire]?.zoneBenevoleId === zoneBenevoleId;
      if (isZoneSelected) {
        const { [horaire]: _, ...rest } = prevZones;
        return rest;
      } else {
        return {
          ...prevZones,
          [horaire]: {
            zoneBenevoleId,
            // Vous pouvez inclure d'autres détails ici si nécessaire
          },
        };
      }
    });
    fetchZoneDetails(zoneBenevoleId, horaire);
  };

  const handleCancel = () => {
    setSelectedZones({});
  };

  const handleSubmit = async () => {
    if (Object.keys(selectedZones).length === 0) {
      console.log("Aucun zoneBenevole sélectionné.");
      return;
    }

    // Créez un tableau des zoneBenevoles sélectionnés
    const selectedZoneArray = Object.entries(selectedZones).map(
      ([horaire, zoneBenevoleInfo]) => ({
        horaire,
        zoneBenevoleId: zoneBenevoleInfo.zoneBenevoleId,
        idBenevole: selectedFlexibleZoneId,
      })
    );

    try {
      for (const zoneBenevoleInfo of selectedZoneArray) {
        const response = await fetch(
          `https://festivaldujeuback.onrender.com/zoneBenevole/inscrire/${zoneBenevoleInfo.zoneBenevoleId}/${zoneBenevoleInfo.horaire}/${zoneBenevoleInfo.idBenevole}`,
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
              "Vous ne pouvez pas vous inscrire à cette zone car vous êtes déjà inscrit à une autre zone ou zone à ce même horaire."
            );
            setPopupVisible(true);
          } else {
            setErrorMessage(
              "Une erreur est survenue lors de votre inscription."
            );
            setPopupVisible(true);
          }
          throw new Error(
            errorData.message || "Erreur lors de l'inscription à une zone."
          );
        }
      }
      console.log("Inscription réussie.");
      setIsSubmitting(true);
      console.log(
        "Tous les horaires ont été attribués, suppression du flexibleZone..."
      );
      const reponse = await fetch(
        `https://festivaldujeuback.onrender.com/flexibleZone/${selectedFlexibleZone._id}/${selectedDate}`,
        {
          method: "DELETE",
        }
      );
      if (!reponse.ok) {
        throw new Error("Erreur lors de la suppression du flexibleZone.");
      } else {
        console.log("FlexibleZone supprimé avec succès.");
        setFlexibleZones(
          flexibleZones.filter(
            (flexibleZone) =>
              flexibleZone.benevole_id[0]._id !== selectedFlexibleZoneId
          )
        );
        setSelectedFlexibleZoneId(null);
        setSelectedFlexibleZone(null);
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

  function getZonesForHoraire(horaires, selectedHoraire) {
    return horaires
      .filter(
        (horaire) =>
          horaire.heure === selectedHoraire &&
          formatDate(horaire.date) === formatDate(selectedDate)
      )
      .flatMap((horaire) => horaire.liste_zoneBenevole);
  }

  return (
    <div>
      <Titre valeurDuTitre={`Liste des bénévoles flexibles pour les zones`} />
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
              onClick={() =>
                handleFlexibleZoneClick(flexible.benevole_id[0]?._id)
              }
              className={`flexible-item ${
                selectedFlexibleZoneId === flexible.benevole_id[0]?._id
                  ? "selected"
                  : ""
              }`}
            >
              <Titre valeurDuTitre={flexible.benevole_id[0]?.pseudo} />
            </div>

            {selectedFlexibleZone && (
              <div>
                <h2>
                  Choisissez les zones que vous souhaitez attribuer à{" "}
                  {selectedFlexibleZone.benevole_id[0].pseudo}
                </h2>
                {horaires.map((horaire, index) => {
                  const zonesForHoraire = getZonesForHoraire(
                    selectedFlexibleZone.horaire,
                    horaire
                  );
                  return (
                    <div key={index} className="flexible-row">
                      <div className="flexible-time">{horaire}</div>
                      {zonesForHoraire.length === 0 ? (
                        <Champ customStyle={{ flexGrow: 1 }}>
                          <input
                            className="input"
                            value="Pas de zones sélectionnés pour ce créneau"
                            readOnly
                          />
                        </Champ>
                      ) : (
                        zonesForHoraire.map((zone) => (
                          <button
                            className={`button-stand ${
                              selectedZones[horaire]?.zoneId === zone._id
                                ? "selected-stand"
                                : ""
                            } `}
                            key={zone._id}
                            onClick={() => handleZoneClick(horaire, zone._id)}
                          >
                            {zone.nom_zone_benevole}
                          </button>
                        ))
                      )}
                    </div>
                  );
                })}

                {Object.keys(selectedZones).length > 0 && (
                  <div>
                    <h2>Informations zones sélectionnés</h2>
                    <ul className="stand-list">
                      {Object.entries(selectedZones).map(
                        ([horaire, zoneInfo]) => {
                          console.log(zoneInfo);
                          // Divisez l'heure en deux parties en utilisant le caractère "-"
                          const [heureDebut, heureFin] = horaire.split("-");

                          // Calcul du nombre d'inscrits
                          const nombreInscrits =
                          zoneInfo.nb_benevole - zoneInfo.placesRestantes;

                          return (
                            <li key={horaire}>
                              <div className="stand-flex-container">
                                {" "}
                                {/* Nouveau conteneur flex */}
                                <div className="zone-info">
                                  {zoneInfo.nom_zoneBenevole} ({heureDebut}h -{" "}
                                  {heureFin}h) :
                                </div>
                                <div className="jauge-pointer-cursor">
                                  <Jauge
                                    capaciteTotale={zoneInfo.nb_benevole}
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
                    <Bouton onClick={handleSubmit}>Soumettre</Bouton>
                    <Bouton onClick={handleCancel}>Annuler</Bouton>
                  </div>
                )}
                {isSubmitting && <p>En cours de soumission...</p>}
              </div>
            )}

            {flexibleZones.length !== index + 1 && (
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

export default FlexibleZone;
