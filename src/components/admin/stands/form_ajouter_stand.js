import React, { useState, useEffect } from "react";
import Champ from "../../general/champ";
import "../../../styles/Admin/stands/form_ajouter.css";
import Bouton from "../../general/bouton";
import FenetrePopup from "../../general/fenetre_popup";

function StandForm({ onClose }) {
  const [nom_stand, setNom_stand] = useState("");
  const [description, setDescription] = useState("");
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const [horairesData, setHorairesData] = useState([
    { heure: "9-11", nb_benevole: "" },
    { heure: "11-14", nb_benevole: "" },
    { heure: "14-17", nb_benevole: "" },
    { heure: "17-20", nb_benevole: "" },
    { heure: "20-22", nb_benevole: "" },
  ]);

  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isPopupVisible, setPopupVisible] = useState(false);

  const hidePopup = () => {
    setPopupVisible(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (nom_stand && horairesData.some((item) => item.nb_benevole !== "")) {
      try {
        const newStand = {
          nom_stand,
          description,
          date: selectedDate,
          horaireCota: horairesData,
        };

        const response = await fetch("http://localhost:3500/stands", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newStand),
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Nouveau stand ajouté:", data);
          onClose();
          window.location.reload();
        } else {
          console.error("Erreur lors de la création du stand");
        }
      } catch (error) {
        console.error("Erreur de connexion au serveur", error);
      }
    }
  };

  const handleNbBenevoleChange = (index, value) => {
    const updatedHorairesData = [...horairesData];
    updatedHorairesData[index].nb_benevole = value;
    // Assurez-vous que la valeur est supérieure ou égale à 1
    updatedHorairesData[index].nb_benevole = value >= 0 ? value : "";
    setHorairesData(updatedHorairesData);
  };

  const formatHoraire = (horaire) => {
    return `de ${horaire.replace("-", "h à ")}h`;
  };

  //cherche les dates 
  useEffect(() => {
    // Exemple d'appel API pour récupérer les données du festival
    const fetchData = async () => {
      const result = await fetch('http://localhost:3500/festival/latest');
      const body = await result.json();
      setDateDebut(body.date_debut);
      setDateFin(body.date_fin);
      console.log(body.date_debut, body.date_fin);
    };
    fetchData();
  }, []);

  return (
    <div className="FormAjout-container">
      <form onSubmit={handleSubmit} className="FormAjout">

      <button type="button" onClick={() => setSelectedDate(dateDebut)}>Pour Date de Début </button>
      <button type="button" onClick={() => setSelectedDate(dateFin)}> Pour Date de Fin</button>
      
        <Champ label="Nom Stand :">
          <input
            className="input"
            required
            type="text"
            value={nom_stand}
            onChange={(e) => setNom_stand(e.target.value)}
          />
        </Champ>

        <Champ label="Description:">
          <input
            className="input"
            required
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Champ>

        {horairesData.map((horaireData, index) => (
          <div className="horaire-row" key={index}>
            <Champ label="Horaires :">
              <input
                className="input"
                type="text"
                value={formatHoraire(horaireData.heure)}
                readOnly
              />
            </Champ>
            <Champ label="Capacité :">
              <input
                className="input"
                type="number"
                min="0"
                value={horaireData.nb_benevole}
                required
                onChange={(e) => handleNbBenevoleChange(index, e.target.value)}
              />
            </Champ>
          </div>
        ))}

        <div className="button_container">
          <Bouton type="submit">Ajouter</Bouton>
        </div>
      </form>
    </div>
  );
}

export default StandForm;
