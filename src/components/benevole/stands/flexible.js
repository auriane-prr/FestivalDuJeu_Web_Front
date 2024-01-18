import React, { useState, useEffect } from "react";
import "../../../styles/benevoles/flexible.css";
import Modal from "../../general/fenetre_modale";
import Champ from "../../general/champ";
import RadioButton from "../../general/radioButton";

function Flexible({ benevoleId }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [stands, setStands] = useState([]);
    const [dateDebut, setDateDebut] = useState("");
    const [dateDebutDisplay, setDateDebutDisplay] = useState("");
    const [dateFin, setDateFin] = useState("");
    const [dateFinDisplay, setDateFinDisplay] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedHeure, setSelectedHeure] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [selectedStand, setSelectedStand] = useState("");

    useEffect(() => {
        // Exemple d'appel API pour récupérer les données du festival
        const fetchData = async () => {
            const result = await fetch("http://localhost:3500/festival/latest");
            const body = await result.json();
            setDateDebutDisplay(body.date_debut);
            setDateFinDisplay(body.date_fin);
            setDateDebut(body.date_debut);
            setDateFin(body.date_fin);
            console.log(body.date_debut, body.date_fin);
        };
        fetchData();
      }, []);

      const handleOpenModal = () => setModalOpen(true);

      const [horairesData, setHorairesData] = useState([
        {date: selectedDate, heure: selectedHeure, liste_stand: selectedStand},
      ]);

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
      const radioOptions = [
        { label: formatDate(dateDebutDisplay), value: dateDebutDisplay },
        { label: formatDate(dateFinDisplay), value: dateFinDisplay },
        { label: "Les deux jours", value: "both" }
      ];

      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Créez des objets flexible selon la sélection
            const flexibles = selectedDate === "both" ? 
            [{
                benevole_id: benevoleId,
                horaires: horairesData
            }, {
                benevole_id: benevoleId,
                horaires: horairesData
            }] : [{
                benevole_id: benevoleId,
                horaires: horairesData
            }];

            for (let flexible of flexibles) {
                const response = await fetch(`http://localhost:3500/flexible`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(flexible),
                });
                if (!response.ok) {
                    throw new Error("Erreur lors de la création du flexible");
                }
            }
            setSuccessMessage("Votre choix flexible a été enregistré avec succès !");
            setErrorMessage("");
        } catch (error) {
            setErrorMessage("Erreur de connexion au serveur: " + error.message);
            setSuccessMessage("");
        }
    };
    async function fetchStandsData() {
        console.log(selectedDate);
        const url = selectedDate === "both"
            ? `http://localhost:3500/stands/date/both`
            : `http://localhost:3500/stands/date/${selectedDate}`;

        try {
            const response = await fetch(url, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            if (response.ok) {
                const standsData = await response.json();
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

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    
    return (
        <div className="button-flexible">
            <button onClick={handleOpenModal}>Choisissez vos stands flexibles</button>
            {modalOpen && (
                <Modal onClose={() => setModalOpen(false)}>
                    <RadioButton
                        options={radioOptions}
                        name="dateSelection"
                        selectedValue={selectedDate}
                        onChange={handleDateChange}
                    />
                    <form onSubmit={handleSubmit}>
                        <h2>Choisissez vos stands flexibles</h2>
                        <p>{successMessage || errorMessage}</p>
                        <Champ>
                            <select
                                onChange={(e) => setSelectedDate(e.target.value)}
                                defaultValue=""
                                className="input"
                            >
                                <option value="" disabled>
                                Sélectionnez un stand
                                </option>
                                {stands.map((stand, index) => (
                                <option key={index} value={stand._id}>
                                    {stand.nom_stand} ({formatDate(stand.date)})
                                </option>
                                ))}
                            </select>
                        </Champ>
                        <button type="submit">Soumettre</button>
                    </form>
                </Modal>
            )}

        </div>
    );
}

export default Flexible;