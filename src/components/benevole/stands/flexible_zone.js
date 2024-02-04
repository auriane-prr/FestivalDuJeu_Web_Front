import React, { useState, useEffect } from "react";
import "../../../styles/benevoles/flexible.css";
import Modal from "../../general/fenetre_modale";
import Champ from "../../general/champ";
import RadioButton from "../../general/radioButton";
import Bouton from "../../general/bouton";

function FlexibleAnimation() {
  const [modalOpen, setModalOpen] = useState(false);
  const [zones, setZones] = useState([]);
  const [dateDebut, setDateDebut] = useState("");
  const [dateDebutDisplay, setDateDebutDisplay] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [dateFinDisplay, setDateFinDisplay] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedHeure, setSelectedHeure] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedZone, setSelectedZone] = useState("");
  const [userId, setUserId] = useState("");
  const [flexibleZoneInfo, setFlexibleZoneInfo] = useState("");
  const [horaires, setHoraires] = useState([
    "9-11",
    "11-14",
    "14-17",
    "17-20",
    "20-22",
  ]);
  const [selectValues, setSelectValues] = useState({});
  const [listeSelectedZones, setListeSelectedZones] = useState({});

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
    { date: dateDebut, heure: "9-11", liste_zoneBenevole: [] },
    { date: dateDebut, heure: "11-14", liste_zoneBenevole: [] },
    { date: dateDebut, heure: "14-17", liste_zoneBenevole: [] },
    { date: dateDebut, heure: "17-20", liste_zoneBenevole: [] },
    { date: dateDebut, heure: "20-22", liste_zoneBenevole: [] },
  ]);

  const [horairesJour2Data, setHorairesJour2Data] = useState([
    { date: dateFin, heure: "9-11", liste_zoneBenevole: [] },
    { date: dateFin, heure: "11-14", liste_zoneBenevole: [] },
    { date: dateFin, heure: "14-17", liste_zoneBenevole: [] },
    { date: dateFin, heure: "17-20", liste_zoneBenevole: [] },
    { date: dateFin, heure: "20-22", liste_zoneBenevole: [] },
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

    // Filtrer les horaires avec des zones sélectionnées
    const horairesToSend = Object.keys(listeSelectedZones).map((heure) => {
      return {
        date: selectedDate === dateDebutDisplay ? dateDebut : dateFin,
        heure: heure,
        liste_zoneBenevole: listeSelectedZones[heure].map((zone) => zone._id),
      };
    });

    console.log("horairesToSend : ", horairesToSend);

    // Vérifier si au moins une zone a été sélectionnée
    if (horairesToSend.length === 0) {
      setErrorMessage("Veuillez sélectionner au moins une zone.");
      setSuccessMessage("");
      return;
    }

    const flexibleZoneData = {
      benevole_id: userId,
      horaire: horairesToSend,
    };

    try {
      console.log("flexibleZoneData envoyé au serveur : ", flexibleZoneData);

      // Envoi de la requête
      const response = await fetch(`https://festivaldujeuback.onrender.com/flexibleZone`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(flexibleZoneData),
      });
      console.log("stringify : ", JSON.stringify(flexibleZoneData));

      if (!response.ok) {
        throw new Error("Erreur lors de la création du flexibleZone");
      }

      setSuccessMessage("Votre flexibilité a été enregistrée avec succès !");
      setErrorMessage("");
      setListeSelectedZones({}); // Réinitialiser les zones sélectionnées
      setSelectedDate("");
      setSelectedHeure("");
      setSelectedZone("");
      await fetchFlexibleZoneData();
    } catch (error) {
      setErrorMessage("Erreur de connexion au serveur : " + error.message);
      setSuccessMessage("");
    }
  };

  const handleSelectChange = (heure, zoneId) => {
    const zone = zones.find((z) => z._id === zoneId);
    if (zone) {
      setSelectValues({ ...selectValues, [heure]: zone.nom_zone_benevole });
      handleAddZone(heure, zone);
    }
  };

  async function fetchZonesData() {
    console.log(selectedDate);
    const url =
      selectedDate === "both"
        ? `https://festivaldujeuback.onrender.com/zoneBenevole/date/both`
        : `https://festivaldujeuback.onrender.com/zoneBenevole/date/${selectedDate}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        const zonesData = await response.json();
        zonesData.sort((a, b) =>
          a.nom_zone_benevole.localeCompare(b.nom_zone_benevole)
        ); // Tri par ordre alphabétique
        setZones(zonesData);
      } else {
        console.error("Erreur lors de la récupération des zones");
      }
    } catch (error) {
      console.error("Erreur de connexion au serveur", error);
    }
  }

  useEffect(() => {
    if (selectedDate) {
      fetchZonesData();
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

  const handleAddZone = (heure, zone) => {
    setListeSelectedZones((prevSelectedZones) => {
      const updatedSelectedZones = { ...prevSelectedZones };
      if (!updatedSelectedZones[heure]) {
        updatedSelectedZones[heure] = [];
      }

      const zoneIndex = updatedSelectedZones[heure].findIndex(
        (z) => z._id === zone._id
      );

      if (zoneIndex > -1) {
        // Si la zone est déjà sélectionnée, la retirer
        updatedSelectedZones[heure].splice(zoneIndex, 1);
      } else {
        // Sinon, l'ajouter à la liste des zones sélectionnées
        updatedSelectedZones[heure].push(zone);
      }

      return updatedSelectedZones;
    });
  };

  async function fetchFlexibleZoneData() {
    try {
      const response = await fetch(
        `https://festivaldujeuback.onrender.com/flexibleZone/benevole/${userId}`,
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
          const zones = horaires.flatMap((horaire) =>
            horaire.liste_zoneBenevole.map((zoneBenevole) => ({
              id: zoneBenevole._id,
              nom_stand: zoneBenevole.nom_zone_benevole,
              date: formatDate(horaire.date),
              heure: horaire.heure,
            }))
          );
          setFlexibleZoneInfo(zones);
        } else {
          console.log("Aucun flexible trouvé pour cet utilisateur");
        }
      } else {
        console.error("Erreur lors de la récupération des zones");
      }
    } catch (error) {
      console.error("Erreur de connexion au serveur", error);
    }
  }
  useEffect(() => {
    if (userId) {
      fetchFlexibleZoneData();
    }
  }, [userId]);

  return (
    <div className="button-flexible">
      <Bouton onClick={handleOpenModal}>Devenir flexible</Bouton>
      {modalOpen && (
        <Modal
          onClose={() => setModalOpen(false)}
          valeurDuTitre={"Choisissez vos zones flexibles"}
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
                      {zones.map((zone) => (
                        <option key={zone._id} value={zone._id}>
                          {zone.nom_zone_benevole}
                        </option>
                      ))}
                    </select>
                  </Champ>
                  <ul className="selected-zones-list">
                    {listeSelectedZones[horaire]?.map((zone) => (
                      <li key={zone._id} className="selected-zone-item">
                        {zone.nom_zone_benevole}
                        <button
                          type="button"
                          onClick={() => handleAddZone(horaire, zone)}
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
    </div>
  );
}

export default FlexibleAnimation;
