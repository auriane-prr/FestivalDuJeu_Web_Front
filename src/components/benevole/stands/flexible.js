import React, { useState, useEffect } from "react";
import "../../../styles/benevoles/flexible.css";
import Modal from "../../general/fenetre_modale";
import Champ from "../../general/champ";
import RadioButton from "../../general/radioButton";
import Bouton from "../../general/bouton";
import FenetrePopup from "../../general/fenetre_popup";

function Flexible() {
  const [modalOpen, setModalOpen] = useState(false);
  const [stands, setStands] = useState([]);
  const [dateDebut, setDateDebut] = useState("");
  const [dateDebutDisplay, setDateDebutDisplay] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [dateFinDisplay, setDateFinDisplay] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedHeure, setSelectedHeure] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedStand, setSelectedStand] = useState("");
  const [userId, setUserId] = useState("");
  const [flexibleInfo, setFlexibleInfo] = useState("");
  const [horaires, setHoraires] = useState([
    "9-11",
    "11-14",
    "14-17",
    "17-20",
    "20-22",
  ]);
  const [selectValues, setSelectValues] = useState({});
  const [listeSelectedStands, setListeSelectedStands] = useState({});

  const hidePopup = () => {
    setPopupVisible(false);
  };

  const fetchUserId = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const pseudo = localStorage.getItem("pseudo");
      const response = await fetch(
        `https://festivaldujeuback.onrender.com/benevole/pseudo/${pseudo}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const { benevole } = await response.json();
        console.log("benevoleId", benevole._id);
        setUserId(benevole._id);
      } else {
        throw new Error(
          "Erreur lors de la récupération des informations utilisateur"
        );
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des informations utilisateur :",
        error
      );
    }
  };

  useEffect(() => {
    // Exemple d'appel API pour récupérer les données du festival
    const fetchData = async () => {
      const result = await fetch("https://festivaldujeuback.onrender.com/festival/latest");
      const body = await result.json();
      setDateDebutDisplay(body.date_debut);
      setDateFinDisplay(body.date_fin);
      setDateDebut(body.date_debut);
      setDateFin(body.date_fin);
    };
    fetchData();
    fetchUserId();
  }, []);

  const [horairesJour1Data, setHorairesJour1Data] = useState([
    { date: dateDebut, heure: "9-11", liste_stand: [] },
    { date: dateDebut, heure: "11-14", liste_stand: [] },
    { date: dateDebut, heure: "14-17", liste_stand: [] },
    { date: dateDebut, heure: "17-20", liste_stand: [] },
    { date: dateDebut, heure: "20-22", liste_stand: [] },
  ]);

  const [horairesJour2Data, setHorairesJour2Data] = useState([
    { date: dateFin, heure: "9-11", liste_stand: [] },
    { date: dateFin, heure: "11-14", liste_stand: [] },
    { date: dateFin, heure: "14-17", liste_stand: [] },
    { date: dateFin, heure: "17-20", liste_stand: [] },
    { date: dateFin, heure: "20-22", liste_stand: [] },
  ]);

  const handleOpenModal = () => {
    // Sélectionner la première option par défaut
    setSelectedDate(radioOptions[0].value);
    setModalOpen(true);
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

  const radioOptions = [
    { label: formatDate(dateDebutDisplay), value: dateDebutDisplay },
    { label: formatDate(dateFinDisplay), value: dateFinDisplay },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Filtrer les horaires avec des stands sélectionnées
    const horairesToSend = Object.keys(listeSelectedStands).map((heure) => {
      return {
        date: selectedDate === dateDebutDisplay ? dateDebut : dateFin,
        heure: heure,
        liste_stand: listeSelectedStands[heure].map((stand) => stand._id),
      };
    });
  
    // Vérifier si au moins une zone a été sélectionnée
    if (horairesToSend.length === 0) {
      setErrorMessage("Veuillez sélectionner au moins un stand.");
      setSuccessMessage("");
      setPopupVisible(true); // Afficher la popup d'erreur
      return;
    }
  
    const flexibleData = {
      benevole_id: userId,
      horaire: horairesToSend,
    };
  
    try {
      const response = await fetch(`https://festivaldujeuback.onrender.com/flexible`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(flexibleData),
      });
  
      if (!response.ok) {
        throw new Error("Erreur lors de la création du flexible");
      }
  
      // Affichage de la popup de succès
      setSuccessMessage("Votre flexibilité a été enregistrée avec succès !");
      setErrorMessage(""); // S'assurer que le message d'erreur est vide
      setPopupVisible(true); // Afficher la popup
  
      // Réinitialisation des états après succès
      setListeSelectedStands({});
      setSelectedDate("");
      setSelectedHeure("");
      setSelectedStand("");
      await fetchFlexibleData();
    } catch (error) {
      // Affichage de la popup d'erreur
      setErrorMessage("Erreur de connexion au serveur : " + error.message);
      setSuccessMessage(""); // S'assurer que le message de succès est vide
      setPopupVisible(true); // Afficher la popup
    }
  };  

  const handleSelectChange = (heure, standId) => {
    const stand = stands.find((s) => s._id === standId);
    if (stand) {
      setSelectValues({ ...selectValues, [heure]: stand.nom_stand });
      handleAddStand(heure, stand);
    }
  };

  async function fetchStandsData() {
    console.log(selectedDate);
    const url =
      selectedDate === "both"
        ? `https://festivaldujeuback.onrender.com/stands/date/both`
        : `https://festivaldujeuback.onrender.com/stands/date/${selectedDate}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        let standsData = await response.json();
        // Filtrer pour exclure le stand 'Animation Jeu'
        standsData = standsData.filter(
          (stand) => stand.nom_stand !== "Animation jeu"
        );
        setStands(standsData);
      } else {
        console.error("Erreur lors de la récupération des stands");
      }
    } catch (error) {
      console.error("Erreur de connexion au serveur", error);
    }
  }

  useEffect(() => {
    if (selectedDate) {
      fetchStandsData();
    }
  }, [selectedDate]);

  useEffect(() => {
    // Mettre à jour horairesJour1Data et horairesJour2Data
    setHorairesJour1Data(
      horairesJour1Data.map((h) => ({ ...h, date: dateDebut }))
    );
    setHorairesJour2Data(
      horairesJour2Data.map((h) => ({ ...h, date: dateFin }))
    );
  }, [dateDebut, dateFin]);
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleAddStand = (heure, stand) => {
    setListeSelectedStands((prevSelectedStand) => {
      const updatedSelectedStands = { ...prevSelectedStand };
      if (!updatedSelectedStands[heure]) {
        updatedSelectedStands[heure] = [];
      }

      const standIndex = updatedSelectedStands[heure].findIndex(
        (s) => s._id === stand._id
      );

      if (standIndex > -1) {
        // Si la zone est déjà sélectionnée, la retirer
        updatedSelectedStands[heure].splice(standIndex, 1);
      } else {
        // Sinon, l'ajouter à la liste des zones sélectionnées
        updatedSelectedStands[heure].push(stand);
      }

      return updatedSelectedStands;
    });
  };

  async function fetchFlexibleData() {
    try {
      const response = await fetch(
        `https://festivaldujeuback.onrender.com/flexible/benevole/${userId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.ok) {
        const flexible = await response.json(); // Remarquez que c'est maintenant 'flexible', pas 'flexibles'

        // Vérifiez si 'flexible' est non null et a une propriété 'horaire'
        if (flexible && flexible.horaire) {
          const horaires = flexible.horaire; // Pas besoin d'utiliser .map() et .flat()
          const stands = horaires.flatMap((horaire) =>
            horaire.liste_stand.map((stand) => ({
              id: stand._id,
              nom_stand: stand.nom_stand,
              date: formatDate(horaire.date),
              heure: horaire.heure,
            }))
          );
          setFlexibleInfo(stands);
        } else {
          console.log("Aucun flexible trouvé pour cet utilisateur");
        }
      } else {
        console.error("Erreur lors de la récupération des stands");
      }
    } catch (error) {
      console.error("Erreur de connexion au serveur", error);
    }
  }

  useEffect(() => {
    if (userId) {
      fetchFlexibleData();
    }
  }, [userId]);

  return (
    <div className="button-flexible">
      <Bouton onClick={handleOpenModal}>Devenir flexible</Bouton>
      {modalOpen && (
        <Modal
          onClose={() => setModalOpen(false)}
          valeurDuTitre={"Choisissez vos stands flexibles"}
        >
          <RadioButton
            options={radioOptions}
            name="dateSelection"
            selectedValue={selectedDate}
            onChange={handleDateChange}
          />

          <div className="planning-container">
            {horaires.map((horaire, index) => (
              <div key={index} className="planning-row">
                <div className="planning-time">{horaire}</div>
                <div className="selection-container">
                  <Champ>
                    <select
                      value={selectValues[horaire] || ""}
                      onChange={(e) =>
                        handleSelectChange(horaire, e.target.value)
                      }
                      className="input"
                    >
                      <option value="">Sélectionnez</option>
                      {stands.map((stand) => (
                        <option key={stand._id} value={stand._id}>
                          {stand.nom_stand}
                        </option>
                      ))}
                    </select>
                  </Champ>
                  <ul className="selected-zones-list">
                    {listeSelectedStands[horaire]?.map((stand) => (
                      <li key={stand._id} className="selected-zone-item">
                        {stand.nom_stand}
                        <button
                          type="button"
                          onClick={() => handleAddStand(horaire, stand)}
                          className="remove-zone-button"
                        >
                          X
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Bouton Soumettre */}
          <div className="button_container">
            <Bouton onClick={handleSubmit} type="submit">
              Soumettre
            </Bouton>
          </div>
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

export default Flexible;
