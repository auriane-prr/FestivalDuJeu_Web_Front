import React, { useState } from "react";
import Champ from "../../general/champ";
import "../../../styles/Admin/stands/form_ajouter.css";
import Bouton from "../../general/bouton";
import FenetrePopup from "../../general/fenetre_popup";

function FestivalForm({ onClose }) {
  const [nomFestival, setNomFestival] = useState("");
  const [description, setDescription] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [lieu, setLieu] = useState("");

  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isPopupVisible, setPopupVisible] = useState(false);

  const hidePopup = () => {
    setPopupVisible(false);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleDateDebutChange = (e) => {
    setDateDebut(e.target.value);
  };

  const handleDateFinChange = (e) => {
    setDateFin(e.target.value);
  };

  const handleLieuChange = (e) => {
    setLieu(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

          const newFestival = {
            nom: nomFestival,
            description: description,
            date_debut: dateDebut,
            date_fin: dateFin,
            lieu: lieu,
          };
  
          try {
          const response = await fetch("https://festivaldujeuback.onrender.com/festival", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newFestival),
          });
  
          if (response.ok) {
            setSuccessMessage("Nouveau festival ajouté avec succès");
            setErrorMessage(null);
            setPopupVisible(true);
            setTimeout(() => {
              onClose();
              window.location.reload();
            }, 2000);
          } else {
            setErrorMessage("Une erreur est survenue, le festival n'a pas pu être créé");
            setSuccessMessage(null);
            setPopupVisible(true);
          }
          } catch (error) {
        setErrorMessage("Erreur de connexion au serveur: " + error.message);
        setSuccessMessage(null);
        setPopupVisible(true);
      }
    }

  return (
    <div>
      <form onSubmit={handleSubmit} className="FormAjout">

        <Champ label="Nom Festival :">
          <input
            className="input"
            required
            type="text"
            value={nomFestival}
            onChange={(e) => setNomFestival(e.target.value)}
          />
        </Champ>

        <Champ label="Date début :">
          <input
            className="input"
            required
            type="date"
            value={dateDebut}
            onChange={handleDateDebutChange}
          />
        </Champ>
        <Champ label="Date fin :">
          <input
            className="input"
            required
            type="date"
            value={dateFin}
            onChange={handleDateFinChange}
          />
        </Champ>

        <Champ label="Lieu :">
          <input
            className="input"
            required
            type="text"
            value={lieu}
            onChange={handleLieuChange}
          />
        </Champ>

        <Champ label="Description:">
          <textarea
            className="input"
            required
            type="text"
            value={description}
            onChange={handleDescriptionChange}
          />
        </Champ>

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

export default FestivalForm;
