import React, { useState, useEffect } from "react";
import FenetrePopup from "../../general/fenetre_popup";
import Champ from "../../general/champ";

const FicheDisplayStand = ({ stand}) => {
    const [benevoles, setBenevoles] = useState([]);
    const [referents, setReferents] = useState([]);
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

  const hidePopup = () => {
    setPopupVisible(false);
  };

  useEffect(() => {
    const fetchData = async (ids, setState) => {
        const data = [];
        for (const id of ids) {
            try {
                const token = localStorage.getItem("authToken");
                const response = await fetch(
                    `https://festivaldujeuback.onrender.com/benevole/id/${id}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                if (response.ok) {
                    const result = await response.json();
                    data.push(result.pseudo); // Assurez-vous que cette ligne correspond à la structure de votre réponse API
                } else {
                    throw new Error("Erreur lors de la récupération des informations");
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des informations :", error);
            }
        }
        setState(data);
    };

    if (stand.liste_benevole && stand.liste_benevole.length > 0) {
        fetchData(stand.liste_benevole, setBenevoles);
    }

    if (stand.referents && stand.referents.length > 0) {
        fetchData(stand.referents, setReferents);
    }
}, [stand.liste_benevole, stand.referents]);

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

      <Champ label="Liste des référents:">
            {referents.length === 0 ? (
                <input
                        type="text"
                        className="input"
                        value="Aucun référent"
                        readOnly
                    />
        ) : (
                    referents.map((pseudo, index) => (
                        <input
                            key={index}
                            type="text"
                            className="input"
                            readOnly
                            value={pseudo}
                        />
                    ))
                )}
        </Champ>

      <Champ label="Horaire">
        <input
          type="text"
          value={stand.heure} // Accédez à l'heure du créneau
          className="input"
          readOnly
        />
      </Champ>

      <Champ label="Capacité">
        <input
          type="text"
          value={stand.nb_benevole} // Accédez à la capacité du créneau
          className="input"
          readOnly
        />
      </Champ>
      
      <Champ label="Liste des bénévoles inscrits:">
        {benevoles.length === 0 ? (
          <input
            type="text"
            className="input"
            value="0 bénévole inscrit"
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

export default FicheDisplayStand;
