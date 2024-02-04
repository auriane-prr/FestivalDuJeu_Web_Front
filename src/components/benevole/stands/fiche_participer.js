import React, { useState, useEffect } from "react";
import FenetrePopup from "../../general/fenetre_popup";
import Champ from "../../general/champ";
import Bouton from "../../general/bouton";

const ModaleParticiper = ({ stand, creneau, closeModal }) => {
  const [userId, setUserId] = useState("");
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    fetchUserId();
  }, []);

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

  const handleParticiperClick = async () => {
    if (!userId) {
      await fetchUserId();
      console.log("Je n'ai pas d'userId");
      return;
    }

    if (stand && creneau && userId) {
      const idHoraire = creneau._id;
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(
          `https://festivaldujeuback.onrender.com/stands/participer/${idHoraire}/${userId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          // Ici, vous devriez vérifier le message d'erreur renvoyé par votre API
          // et ajuster le message d'erreur en fonction
          if (errorData.message.includes("déjà inscrit")) {
            setErrorMessage(
              "Vous ne pouvez pas vous inscrire à ce créneau car vous êtes déjà inscrit à un autre stand ou une autre zone à ce même horaire."
            );
          } else {
            setErrorMessage(
              "Une erreur est survenue lors de votre inscription."
            );
          }
          setPopupVisible(true);
        } else {
          // Le bénévole a été inscrit avec succès
          const updatedStand = await response.json();
          console.log("updatedStand", updatedStand);
          setSuccessMessage(
            "Votre participation a été enregistrée avec succès !"
          );
          setPopupVisible(true);

          // Fermer la modale après un certain délai
          setTimeout(() => {
            closeModal(); // Fermer la modale
            window.location.reload(); // Optionnel : recharger la page pour mettre à jour l'affichage
          }, 2000);
        }
      } catch (error) {
        console.error("Erreur lors de la participation : ", error);
        setErrorMessage("Erreur lors de la participation : " + error.message);
        setPopupVisible(true);
      }
    }
  };

  return (
    <>
      <Champ label="Description">
        <input
          type="text"
          value={stand.description}
          className="input"
          readOnly
        />
      </Champ>

      <Champ label="Horaire">
        <input
          type="text"
          value={creneau.heure} // Accédez à l'heure du créneau
          className="input"
          readOnly
        />
      </Champ>

      <Champ label="Capacité">
        <input
          type="text"
          value={creneau.nb_benevole} // Accédez à la capacité du créneau
          className="input"
          readOnly
        />
      </Champ>
      
      <Champ label="Liste des bénévoles inscrits:">
        {creneau &&
        creneau.liste_benevole &&
        creneau.liste_benevole.length === 0 ? (
          <input
            type="text"
            className="input"
            value="0 bénévole inscrit"
            readOnly
          />
        ) : (
          creneau?.liste_benevole?.map((benevole, index) => (
            <input
              key={index}
              type="text"
              className="input"
              readOnly
              value={benevole.pseudo || ""}
            />
          ))
        )}
      </Champ>

      <div className="button_container">
        <Bouton type="button" onClick={handleParticiperClick}>
          Participer
        </Bouton>
      </div>

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
    </>
  );
};

export default ModaleParticiper;
