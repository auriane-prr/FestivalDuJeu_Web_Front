import React, { useState, useEffect } from "react";
import "../../../styles/benevoles/flexible.css";
import Modal from "../../general/fenetre_modale";
import Champ from "../../general/champ";
import RadioButton from "../../general/radioButton";
import Button from "../../general/bouton";

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
    const [errorMessage, setErrorMessage] = useState("");
    const [selectedStand, setSelectedStand] = useState("");
    const [userId, setUserId] = useState('');
    const[flexibleInfo, setFlexibleInfo] = useState('');
    const [selections, setSelections] = useState([]);

    const fetchUserId = async () => {
        try {
          const token = localStorage.getItem('authToken');
          const pseudo = localStorage.getItem('pseudo');
          const response = await fetch(`http://localhost:3500/benevole/pseudo/${pseudo}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              }
            });
            if (response.ok) {
              const { benevole } = await response.json();
              console.log('benevoleId', benevole._id);
              setUserId(benevole._id);
            } else {
              throw new Error('Erreur lors de la récupération des informations utilisateur');
            }
        } catch (error) {
          console.error('Erreur lors de la récupération des informations utilisateur :', error);
        }
      };

      

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
        fetchUserId();
      }, []);

      const handleOpenModal = () => setModalOpen(true);

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
            const uptatedHorairesData = [{
                date: selectedDate,
                heure: selectedHeure,
                liste_stand: [{ id_stand: selectedStand }]
            }];

            // Créez des objets flexible selon la sélection
            const flexibles = selectedDate === "both" ? 
            [{
                benevole_id: userId,
                horaire: [{ ...uptatedHorairesData[0], date: dateDebut }]
            }, {
                benevole_id: userId,
                horaire: [{ ...uptatedHorairesData[0], date: dateFin }]
            }] : [{
                benevole_id: userId,
                horaire: uptatedHorairesData
            }];

            for (let flexible of flexibles) {
                console.log(flexible);
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
            setSuccessMessage("Votre flexibilité a été enregistré avec succès !");
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
    const handleAddStand = (date, heure, standId) => {
        setSelections(prevSelections => {
            const existingHoraireIndex = prevSelections.findIndex(h => h.date === date && h.heure === heure);
            if (existingHoraireIndex >= 0) {
                // Horaire existant, ajouter le stand à la liste
                const newSelections = [...prevSelections];
                newSelections[existingHoraireIndex].liste_stand.push({ id_stand: standId });
                return newSelections;
            } else {
                // Nouvel horaire
                return [...prevSelections, { date, heure, liste_stand: [{ id_stand: standId }] }];
            }
        });
    };
    

    async function fetchFlexibleData() {
        try {
            const response = await fetch(`http://localhost:3500/flexible/benevole/${userId}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            if (response.ok) {
                const flexibles = await response.json();
                const horaires = flexibles.flatMap((flexible) => flexible.horaire);
                const stands = horaires.flatMap((horaire) => horaire.liste_stand.map(stand => ({
                    id: stand._id, 
                    nom_stand: stand.nom_stand, 
                    date: formatDate(horaire.date), 
                    heure: horaire.heure
                })));
                setFlexibleInfo(stands);
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
            <button onClick={handleOpenModal}> Devenir flexible</button>
            {modalOpen && (
                <Modal onClose={() => setModalOpen(false)} valeurDuTitre={"Choisissez vos stands flexibles"}>
                    <div>
                        <p className="inscription">Voici vos inscriptions :</p>
                        {flexibleInfo.length > 0 ? (
                            <ul>
                                {flexibleInfo.map((stand, index) => (
                                    <li key={index}>
                                        Nom du stand: {stand.nom_stand}, Date:{stand.date}, Horaire: {stand.heure}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>Vous n'êtes inscrit à aucun stand.</p>
                        )}
                    </div>
                    <div>
                        {selections.map((sel, index) => (
                            <div key={index}>
                                <p>Date: {sel.date}, Heure: {sel.heure}</p>
                                <ul>
                                    {sel.liste_stand.map((stand, idx) => <li key={idx}>{stand.id_stand}</li>)}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <RadioButton
                        options={radioOptions}
                        name="dateSelection"
                        selectedValue={selectedDate}
                        onChange={handleDateChange}
                    />
                    <Champ>
                        <input
                            type="text"
                            value={selectedHeure}
                            onChange={(e) => setSelectedHeure(e.target.value)}
                            placeholder="Heure (ex: 9-11)"
                        />
                    </Champ>
                    <form onSubmit={handleSubmit}>
                        <p className="inscription">{successMessage || errorMessage}</p>
                        <Champ>
                            <select
                                onChange={(e) => setSelectedStand(e.target.value)}
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
                        <Button type="submit">Soumettre</Button>
                    </form>
                </Modal>
            )}

        </div>
    );
}

export default Flexible;