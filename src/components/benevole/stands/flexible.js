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

    const [heureData, setHeureData] = useState([
        { heure: "9-11"},
        { heure: "11-14"},
        { heure: "14-17"},
        { heure: "17-20"},
        { heure: "20-22"},
    ]);

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
        };
        fetchData();
        fetchUserId();
    }, []);

    const [horairesJour1Data, setHorairesJour1Data] = useState([
        { date:dateDebut, heure: "9-11", liste_stand: []},
        { date:dateDebut, heure: "11-14", liste_stand: []},
        { date:dateDebut, heure: "14-17", liste_stand: []},
        { date:dateDebut, heure: "17-20", liste_stand: []},
        { date:dateDebut, heure: "20-22", liste_stand: []},
    ]);

    const [horairesJour2Data, setHorairesJour2Data] = useState([
        { date:dateFin, heure: "9-11", liste_stand: []},
        { date:dateFin, heure: "11-14", liste_stand: []},
        { date:dateFin, heure: "14-17", liste_stand: []},
        { date:dateFin, heure: "17-20", liste_stand: []},
        { date:dateFin, heure: "20-22", liste_stand: []},
    ]);

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
      const formatHoraire = (horaire) => {
        return `de ${horaire.replace("-", "h à ")}h`;
      };
      const radioOptions = [
        { label: formatDate(dateDebutDisplay), value: dateDebutDisplay },
        { label: formatDate(dateFinDisplay), value: dateFinDisplay },
        { label: "Les deux jours", value: "both" }
      ];

      const handleSubmit = async (e) => {
        e.preventDefault();
        const filteredHorairesJour1 = horairesJour1Data.filter(h => h.liste_stand.length > 0);
        const filteredHorairesJour2 = horairesJour2Data.filter(h => h.liste_stand.length > 0);
        const horairesToSend = [...filteredHorairesJour1, ...filteredHorairesJour2];
        const flexibleData = {
            benevole_id: userId,
            horaire: horairesToSend
        };
        try {
            console.log("flexibleData envoyer au server: ",flexibleData);
    
            // Envoi de la requête
            const response = await fetch(`http://localhost:3500/flexible`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(flexibleData),
            });
    
            if (!response.ok) {
                throw new Error("Erreur lors de la création du flexible");
            }
    
            setSuccessMessage("Votre flexibilité a été enregistrée avec succès !");
            setErrorMessage("");
            setHorairesJour1Data(horairesJour1Data.map(h => ({ ...h, liste_stand: [] })));
            setHorairesJour2Data(horairesJour2Data.map(h => ({ ...h, liste_stand: [] })));
            setSelectedDate('');
            setSelectedHeure('');
            setSelectedStand('');
            await fetchFlexibleData();
    
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

    useEffect(() => {
        // Mettre à jour horairesJour1Data et horairesJour2Data
        setHorairesJour1Data(horairesJour1Data.map(h => ({ ...h, date: dateDebut })));
        setHorairesJour2Data(horairesJour2Data.map(h => ({ ...h, date: dateFin })));
    }, [dateDebut, dateFin]);
    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    const handleAddStand = (heure, standId) => {
        const updateHoraires = (horaires) => {
            return horaires.map(horaire => {
                if (horaire.heure === heure) {
                    const updatedListeStand = horaire.liste_stand.includes(standId)
                        ? horaire.liste_stand
                        : [...horaire.liste_stand, standId];
                    
                    return { ...horaire, liste_stand: updatedListeStand };
                }
                return horaire;
            });
        };
    
        if (selectedDate === "both") {
            setHorairesJour1Data(updateHoraires(horairesJour1Data));
            setHorairesJour2Data(updateHoraires(horairesJour2Data));
        } else {
            const horairesToUpdate = selectedDate === dateDebut ? horairesJour1Data : horairesJour2Data;
            const updatedHoraires = updateHoraires(horairesToUpdate);
            selectedDate === dateDebut ? setHorairesJour1Data(updatedHoraires) : setHorairesJour2Data(updatedHoraires);
        }
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
            <Button onClick={handleOpenModal}>Devenir flexible</Button>
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
                    <div>
                    <h3>Vos sélections d'horaires et de stands pour {formatDate(selectedDate === "both" ? dateDebut : selectedDate)}:</h3>
                    {(selectedDate === dateDebut || selectedDate === "both") && horairesJour1Data.map((horaire, index) => {
                        if (horaire.liste_stand.length > 0) {
                            return (
                                <div key={index}>
                                    <p>Date: {formatDate(horaire.date)}, Horaire: {formatHoraire(horaire.heure)}</p>
                                    <ul>
                                        {horaire.liste_stand.map((standId, idx) => {
                                            const stand = stands.find(s => s._id === standId);
                                            return <li key={idx}>{stand ? stand.nom_stand : "Stand non trouvé"}</li>;
                                        })}
                                    </ul>
                                </div>
                            );
                        }
                        return null;
                    })}

                    {selectedDate === "both" && <h3>Vos sélections d'horaires et de stands pour {formatDate(dateFin)}:</h3>}
                    {(selectedDate === dateFin || selectedDate === "both") && horairesJour2Data.map((horaire, index) => {
                        if (horaire.liste_stand.length > 0) {
                            return (
                                <div key={index}>
                                    <p>Date: {formatDate(horaire.date)}, Horaire: {formatHoraire(horaire.heure)}</p>
                                    <ul>
                                        {horaire.liste_stand.map((standId, idx) => {
                                            const stand = stands.find(s => s._id === standId);
                                            return <li key={idx}>{stand ? stand.nom_stand : "Stand non trouvé"}</li>;
                                        })}
                                    </ul>
                                </div>
                            );
                        }
                        return null;
                    })}
                </div>
                    {heureData && heureData.length > 0 && heureData.map((heureData, index) => (
                        <div className="horaire-row" key={index}>
                        <Champ label="Horaires :">
                        <input
                            className="input"
                            type="text"
                            value={formatHoraire(heureData.heure)}
                            readOnly
                        />
                        </Champ>
                        <Champ>
                            <select
                                onChange={(e) =>{
                                    const standId = e.target.value;
                                    const heure = heureData.heure;
                                    handleAddStand(heure, standId);
                                }}
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
                        </div>
                    ))}
                    <form onSubmit={handleSubmit}>
                        <p className="inscription">{successMessage || errorMessage}</p>
                        <br />
                        <Button type="submit">Soumettre</Button>
                    </form>
                </Modal>
            )}

        </div>
    );
}

export default Flexible;