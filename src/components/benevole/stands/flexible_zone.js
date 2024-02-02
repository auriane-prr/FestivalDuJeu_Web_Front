import React, { useState, useEffect } from "react";
import "../../../styles/benevoles/flexible.css";
import Modal from "../../general/fenetre_modale";
import Champ from "../../general/champ";
import RadioButton from "../../general/radioButton";
import Button from "../../general/bouton";
import RechercheJeux from "../rechercheJeux";

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
    const [userId, setUserId] = useState('');
    const [flexibleZoneInfo, setFlexibleZoneInfo] = useState('');
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
        { date:dateDebut, heure: "9-11", liste_zoneBenevole: []},
        { date:dateDebut, heure: "11-14", liste_zoneBenevole: []},
        { date:dateDebut, heure: "14-17", liste_zoneBenevole: []},
        { date:dateDebut, heure: "17-20", liste_zoneBenevole: []},
        { date:dateDebut, heure: "20-22", liste_zoneBenevole: []},
    ]);

    const [horairesJour2Data, setHorairesJour2Data] = useState([
        { date:dateFin, heure: "9-11", liste_zoneBenevole: []},
        { date:dateFin, heure: "11-14", liste_zoneBenevole: []},
        { date:dateFin, heure: "14-17", liste_zoneBenevole: []},
        { date:dateFin, heure: "17-20", liste_zoneBenevole: []},
        { date:dateFin, heure: "20-22", liste_zoneBenevole: []},
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
        const filteredHorairesJour1 = horairesJour1Data.filter(h => h.liste_zoneBenevole.length > 0);
        const filteredHorairesJour2 = horairesJour2Data.filter(h => h.liste_zoneBenevole.length > 0);
        const horairesToSend = [...filteredHorairesJour1, ...filteredHorairesJour2];
        const flexibleZoneData = {
            benevole_id: userId,
            horaire: horairesToSend
        };
        try {
            console.log("flexibleZoneData envoyer au server: ",flexibleZoneData);
    
            // Envoi de la requête
            const response = await fetch(`http://localhost:3500/flexibleZone`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(flexibleZoneData),
            });
    
            if (!response.ok) {
                throw new Error("Erreur lors de la création du flexibleZone");
            }
    
            setSuccessMessage("Votre flexibilité a été enregistrée avec succès !");
            setErrorMessage("");
            setHorairesJour1Data(horairesJour1Data.map(h => ({ ...h, liste_zoneBenevole: [] })));
            setHorairesJour2Data(horairesJour2Data.map(h => ({ ...h, liste_zoneBenevole: [] })));
            setSelectedDate('');
            setSelectedHeure('');
            setSelectedZone('');
            await fetchFlexibleZoneData();
    
        } catch (error) {
            setErrorMessage("Erreur de connexion au serveur: " + error.message);
            setSuccessMessage("");
        }
    };
    
    async function fetchZonesData() {
        console.log(selectedDate);
        const url = selectedDate === "both"
            ? `http://localhost:3500/zoneBenevole/date/both`
            : `http://localhost:3500/zoneBenevole/date/${selectedDate}`;

        try {
            const response = await fetch(url, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            if (response.ok) {
                const zonesData = await response.json();
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
        setHorairesJour1Data(horairesJour1Data.map(h => ({ ...h, date: dateDebut })));
        setHorairesJour2Data(horairesJour2Data.map(h => ({ ...h, date: dateFin })));
    }, [dateDebut, dateFin]);
    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    const handleAddZone = (heure, zoneId) => {
        const updateHoraires = (horaires) => {
            return horaires.map(horaire => {
                if (horaire.heure === heure) {
                    const updatedListeZone = horaire.liste_zoneBenevole.includes(zoneId)
                        ? horaire.liste_zoneBenevole
                        : [...horaire.liste_zoneBenevole, zoneId];
                    
                    return { ...horaire, liste_zoneBenevole: updatedListeZone };
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
    async function fetchFlexibleZoneData() {
        try {
            const response = await fetch(`http://localhost:3500/flexibleZone/benevole/${userId}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            if (response.ok) {
                const flexible = await response.json(); // Remarquez que c'est maintenant 'flexible', pas 'flexibles'
                
                // Vérifiez si 'flexible' est non null et a une propriété 'horaire'
                if (flexible && flexible.horaire) {
                    const horaires = flexible.horaire; // Pas besoin d'utiliser .map() et .flat()
                    const zones = horaires.flatMap((horaire) => horaire.liste_zoneBenevole.map(zoneBenevole => ({
                        id: zoneBenevole._id, 
                        nom_stand: zoneBenevole.nom_zone_benevole, 
                        date: formatDate(horaire.date), 
                        heure: horaire.heure
                    })));
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
            <Button onClick={handleOpenModal}>Devenir flexible</Button>
            {modalOpen && (
                <Modal onClose={() => setModalOpen(false)} valeurDuTitre={"Choisissez vos zones flexibles"}>
                    <RechercheJeux />
                    <div>
                        <p className="inscription">Voici vos inscriptions :</p>
                        {flexibleZoneInfo.length > 0 ? (
                            <ul>
                                {flexibleZoneInfo.map((zone, index) => (
                                    <li key={index}>
                                        Nom du zone: {zone.nom_zone_benevole}, Date:{zone.date}, Horaire: {zone.heure}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>Vous n'êtes inscrit à aucune zone.</p>
                        )}
                    </div>

                    <div>
                        {selections.map((sel, index) => (
                            <div key={index}>
                                <p>Date: {sel.date}, Heure: {sel.heure}</p>
                                <ul>
                                    {sel.liste_zoneBenevole.map((zone, idx) => <li key={idx}>{zone.id_zone}</li>)}
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
                    <h3>Vos sélections d'horaires et de zone pour {formatDate(selectedDate === "both" ? dateDebut : selectedDate)}:</h3>
                    {(selectedDate === dateDebut || selectedDate === "both") && horairesJour1Data.map((horaire, index) => {
                        if (horaire.liste_zoneBenevole.length > 0) {
                            return (
                                <div key={index}>
                                    <p>Date: {formatDate(horaire.date)}, Horaire: {formatHoraire(horaire.heure)}</p>
                                    <ul>
                                        {horaire.liste_zoneBenevole.map((zoneId, idx) => {
                                            const zone = zones.find(s => s._id === zoneId);
                                            return <li key={idx}>{zone ? zone.nom_zone_benevole : "Zone non trouvé"}</li>;
                                        })}
                                    </ul>
                                </div>
                            );
                        }
                        return null;
                    })}

                    {selectedDate === "both" && <h3>Vos sélections d'horaires et de zones pour {formatDate(dateFin)}:</h3>}
                    {(selectedDate === dateFin || selectedDate === "both") && horairesJour2Data.map((horaire, index) => {
                        if (horaire.liste_zoneBenevole.length > 0) {
                            return (
                                <div key={index}>
                                    <p>Date: {formatDate(horaire.date)}, Horaire: {formatHoraire(horaire.heure)}</p>
                                    <ul>
                                        {horaire.liste_zoneBenevole.map((zoneId, idx) => {
                                            const zone = zones.find(s => s._id === zoneId);
                                            return <li key={idx}>{zone ? zone.nom_zone_benevole : "Zone non trouvé"}</li>;
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
                                    const zoneId = e.target.value;
                                    const heure = heureData.heure;
                                    handleAddZone(heure, zoneId);
                                }}
                                defaultValue=""
                                className="input"
                            >
                                <option value="" disabled>
                                Sélectionnez un zone
                                </option>
                                {zones.map((zone, index) => (
                                <option key={index} value={zone._id}>
                                    {zone.nom_zone_benevole} ({formatDate(zone.date)})
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

export default FlexibleAnimation;