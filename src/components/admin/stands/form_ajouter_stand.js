import React, { useState, useEffect } from "react";
import Champ from "../../general/champ";
import "../../../styles/Admin/stands/form_ajouter.css";
import Bouton from "../../general/bouton";
import FenetrePopup from "../../general/fenetre_popup";
import RadioButton from "../../general/radioButton";

function StandForm({ onClose }) {
  const [nom_stand, setNom_stand] = useState("");
  const [description, setDescription] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [descriptionHeight, setDescriptionHeight] = useState('auto');


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

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
    setDescriptionHeight(`${e.target.scrollHeight}px`);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleNbBenevoleChange = (index, value) => {
    const updatedHorairesData = [...horairesData];
    updatedHorairesData[index].nb_benevole = value;
    updatedHorairesData[index].nb_benevole = value ? Number(value) : 0;
    setHorairesData(updatedHorairesData);
  };

  const formatHoraire = (horaire) => {
    return `de ${horaire.replace("-", "h à ")}h`;
  };

  //cherche les dates
  useEffect(() => {
    // Exemple d'appel API pour récupérer les données du festival
    const fetchData = async () => {
      const result = await fetch("https://festivaldujeuback.onrender.com/festival/latest");
      const body = await result.json();
      setDateDebut(body.date_debut);
      setDateFin(body.date_fin);
      console.log(body.date_debut, body.date_fin);
    };
    fetchData();
  }, []);

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
    { label: formatDate(dateDebut), value: dateDebut },
    { label: formatDate(dateFin), value: dateFin },
    { label: "Les deux jours", value: "both" }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (nom_stand) {
      try {
        if (selectedDate === "both") {
          // Si "Les deux jours" est sélectionné, créez deux instances de stand
          const stand1 = {
            nom_stand,
            description,
            date: dateDebut,
            horaireCota: horairesData,
          };
          const stand2 = {
            nom_stand,
            description,
            date: dateFin,
            horaireCota: horairesData,
          };
  
          // Envoie les deux instances au serveur
          const response1 = await fetch("https://festivaldujeuback.onrender.com/stands", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(stand1),
          });
  
          const response2 = await fetch("https://festivaldujeuback.onrender.com/stands", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(stand2),
          });
  
          if (response1.ok && response2.ok) {
            setSuccessMessage("Nouveaux stands ajoutés avec succès");
            setErrorMessage(null);
            setPopupVisible(true);
            setTimeout(() => {
              onClose();
              window.location.reload();
            }, 2000);
          } else {
            setErrorMessage("Une erreur est survenue, les stands n'ont pas pu être créés");
            setSuccessMessage(null);
            setPopupVisible(true);
          }
        } else {
          const newStand = {
            nom_stand,
            description,
            date: selectedDate,
            horaireCota: horairesData,
          };
  
          const response = await fetch("https://festivaldujeuback.onrender.com/stands", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newStand),
          });
  
          if (response.ok) {
            setSuccessMessage("Nouveau stand ajouté avec succès");
            setErrorMessage(null);
            setPopupVisible(true);
            setTimeout(() => {
              onClose();
              window.location.reload();
            }, 2000);
          } else {
            setErrorMessage("Une erreur est survenue, le stand n'a pas pu être créé");
            setSuccessMessage(null);
            setPopupVisible(true);
          }
        }
      } catch (error) {
        setErrorMessage("Erreur de connexion au serveur: " + error.message);
        setSuccessMessage(null);
        setPopupVisible(true);
      }
    }
  };  

  return (
    <div>
      <form onSubmit={handleSubmit} className="FormAjout">
      
      <RadioButton
          options={radioOptions}
          name="dateSelection"
          selectedValue={selectedDate}
          onChange={handleDateChange}
        />
        {selectedDate === "both" && (
        <p>
        Vous pourrez modifier la capacité ultérieurement pour chacune des dates.
      </p>
      )}

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
          <textarea
            className="input"
            required
            type="text"
            value={description}
            onChange={handleDescriptionChange}
            style={{ height: descriptionHeight }} // Appliquez la hauteur calculée
          />
        </Champ>

        {horairesData && horairesData.length > 0 && horairesData.map((horaireData, index) => (
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
                onChange={(e) => handleNbBenevoleChange(index, e.target.value)}
              />
            </Champ>
          </div>
        ))}

        <div className="button_container">
          <Bouton type="submit">Ajouter</Bouton>
        </div>
      </form>

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

export default StandForm;
