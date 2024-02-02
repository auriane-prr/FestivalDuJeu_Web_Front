import React, { useState, useEffect } from "react";
import FenetrePopup from "../../general/fenetre_popup";
import Champ from "../../general/champ";
import Bouton from "../../general/bouton";

const ParticiperZone = ({ zone, creneau, closeModal }) => {
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
        `http://localhost:3500/benevole/pseudo/${pseudo}`,
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

    if (zone && creneau && userId) {
      const idHoraire = creneau._id;
      try {
        const { _id: idZone, horaireCota } = zone;
        const idBenevole = userId;
        const token = localStorage.getItem("authToken");

        // Vérifier si le bénévole est déjà inscrit ailleurs ou à ce créneau
        const isAlreadyRegisteredElsewhere = horaireCota.some((horaire) => {
          return (
            horaire.liste_benevole.includes(idBenevole) &&
            horaire._id !== idHoraire
          );
        });

        const isAlreadyRegisteredHere = horaireCota.some((horaire) => {
          return (
            horaire.liste_benevole.includes(idBenevole) &&
            horaire._id === idHoraire
          );
        });

        if (isAlreadyRegisteredElsewhere) {
          setErrorMessage("Vous êtes déjà inscrit ailleurs");
          throw new Error("Vous êtes déjà inscrit ailleurs");
        } else if (isAlreadyRegisteredHere) {
          setErrorMessage("Vous êtes déjà inscrit à ce créneau");
          throw new Error("Vous êtes déjà inscrit à ce créneau");
        }
        console.log("Horaire : ", idHoraire + "    Benevole : ", idBenevole);

        const response = await fetch(
          `http://localhost:3500/zoneBenevole/participer/${idHoraire}/${idBenevole}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          // Cas 4: La participation a bien été enregistrée
          console.log("Participation enregistrée");
          const updatedResponse = await fetch(
            `http://localhost:3500/zoneBenevole/${idZone}`
          );
          if (updatedResponse.ok) {
            const updatedZone = await updatedResponse.json();

            setSuccessMessage(
              "Votre participation a été enregistrée avec succès"
            );
            setErrorMessage(null);

            // Afficher la pop-up
            setPopupVisible(true);

            // Fermer la modale après un certain délai (par exemple, 2 secondes)
            setTimeout(() => {
              closeModal(); // Fermer la modale
            }, 2000);
          }
        } else {
          // Cas 3: Une autre erreur s'est produite
          setErrorMessage(
            "Une erreur est survenue lors de votre participation"
          );
          setSuccessMessage(null);

          // Afficher la pop-up d'erreur (si nécessaire)
          if (errorMessage) {
            setPopupVisible(true);
          }
        }
      } catch (error) {
        // Cas 3: Une autre erreur s'est produite
        setErrorMessage("Erreur lors de la participation : " + error.message);
        setSuccessMessage(null);

        // Afficher la pop-up d'erreur (si nécessaire)
        if (errorMessage) {
          setPopupVisible(true);
        }
      }
    }
  };

  return (
    <>
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
        {zone && zone.liste_benevole && zone.liste_benevole.length === 0 ? (
          <input
            type="text"
            className="input"
            value="0 bénévole inscrits"
            readOnly
          />
        ) : (
          zone?.liste_benevole?.map((benevole, index) => (
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

export default ParticiperZone;
