import React, { useState, useEffect } from "react";
import FenetrePopup from "../../general/fenetre_popup";
import Champ from "../../general/champ";
import Modal from "../../general/fenetre_modale";
import Bouton from "../../general/bouton";
import DisplayJeu from "../../admin/jeux/display_jeux";

const ParticiperZone = ({ zone, creneau, closeModal }) => {
  const [userId, setUserId] = useState("");
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [jeux, setJeux] = useState([]);
  const [jeuDetails, setJeuDetails] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchUserId();
  }, []);

  useEffect(() => {
    // Appel de fetchJeuxByZone lorsque le composant est monté
    if (zone) {
      fetchJeuxByZone(zone._id);
    }
  }, [zone]);

  const hidePopup = () => {
    setPopupVisible(false);
  };

  const openModal = () => {
    setShowModal(true);
  };

  const fetchJeuxByZone = async (idZone) => {
    try {
      const response = await fetch(
        `https://festivaldujeuback.onrender.com/zoneBenevole/${idZone}/jeux`
      );
      const jeuxData = await response.json();
      setJeux(jeuxData);
    } catch (error) {
      console.error("Erreur lors de la récupération des jeux :", error);
      setJeux([]);
    }
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

  const handleJeuChange = (event) => {
    const jeuId = event.target.value;
    const jeu = jeux.find((j) => j._id === jeuId);
    setJeuDetails(jeu);
    openModal();
  };

  const handleParticiperClick = async () => {
    if (!userId) {
      await fetchUserId();
      return;
    }

    if (zone && creneau && userId) {
      const idHoraire = creneau._id;
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(
          `https://festivaldujeuback.onrender.com/zoneBenevole/participer/${idHoraire}/${userId}`,
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
          // Vérifier le message d'erreur renvoyé par votre API et ajuster le message d'erreur en fonction
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
          // Le bénévole a été inscrit avec succès à la zone
          const updatedZone = await response.json();
          setSuccessMessage(
            "Votre participation à la zone a été enregistrée avec succès !"
          );
          setPopupVisible(true);

          // Fermer la modale après un certain délai
          setTimeout(() => {
            closeModal(); // Fermer la modale
            window.location.reload(); // Optionnel : recharger la page pour mettre à jour l'affichage
          }, 2000);
        }
      } catch (error) {
        console.error("Erreur lors de la participation à la zone : ", error);
        setErrorMessage(
          "Erreur lors de la participation à la zone : " + error.message
        );
        setPopupVisible(true);
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
        {creneau &&
        creneau.liste_benevole &&
        creneau.liste_benevole.length === 0 ? (
          <input
            type="text"
            className="input"
            value="0 bénévole inscrits"
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

      <Champ label="Jeux :" customStyle={{ width: "80%" }}>
        <select
          className="input"
          onChange={handleJeuChange}
          value={jeuDetails?._id || ""}
        >
          <option value="">Sélectionner un jeu</option>
          {jeux.map((jeu) => (
            <option key={jeu._id} value={jeu._id}>
              {jeu.nom_jeu}
            </option>
          ))}
        </select>
      </Champ>

      <div className="button_container">
        <Bouton type="button" onClick={handleParticiperClick}>
          Participer
        </Bouton>
      </div>

      {showModal && jeuDetails && (
        <Modal onClose={closeModal} titre={jeuDetails.nom_jeu || "Jeu"}>
          <DisplayJeu jeu={jeuDetails} />
        </Modal>
      )}

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
