import React, { useState, useEffect } from "react";
import FenetrePopup from "../../general/fenetre_popup";
import Champ from "../../general/champ";
import Bouton from "../../general/bouton";

const FicheDisplayZone = ({ zone, creneau }) => {
    const [benevoles, setBenevoles] = useState([]);
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [jeux, setJeux] = useState([]);
    const [jeuDetails, setJeuDetails] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

  const hidePopup = () => {
    setPopupVisible(false);
  };

  useEffect(() => {
    // Appel de fetchJeuxByZone lorsque le composant est monté
    if (zone) {
      fetchJeuxByZone(zone._id);
    }
  }, [zone]);

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

  const handleJeuChange = (event) => {
    const jeuId = event.target.value;
    const jeu = jeux.find((j) => j._id === jeuId);
    setJeuDetails(jeu);
    
  };

  useEffect(() => {
    const fetchBenevoles = async () => {
        const benevolesData = [];
        for (const benevoleId of zone.liste_benevole) {
            try {
                const token = localStorage.getItem("authToken");
                const response = await fetch(
                    `https://festivaldujeuback.onrender.com/benevole/id/${benevoleId}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                if (response.ok) {
                    const data = await response.json();
                    benevolesData.push(data.pseudo);
                } else {
                    throw new Error("Erreur lors de la récupération des informations du bénévole");
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des informations du bénévole :", error);
            }
        }
        setBenevoles(benevolesData);
    };

    if (zone.liste_benevole && zone.liste_benevole.length > 0) {
        fetchBenevoles();
    }
}, [zone.liste_benevole]);

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
      {benevoles.length === 0 ? (
          <input
            type="text"
            className="input"
            value="0 bénévole inscrits"
            readOnly
          />
        ) : (
            benevoles.map((pseudo, index) => (
            <input
              key={index}
              type="text"
              className="input"
              readOnly
              value={pseudo || ""}
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

export default FicheDisplayZone;
