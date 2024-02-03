import React, { useState } from "react";
import Champ from "../../general/champ";
import "../../../styles/Admin/promoteAdminBtn.css";
import PopUp from "../../general/fenetre_popup";

function ModaleInfos({ benevole }) {
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const promoteToAdmin = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `http://localhost:3500/benevole/promote/${benevole._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        // Mettre à jour l'état local du bénévole pour refléter le changement
        // Cela peut impliquer de soulever l'état ou d'utiliser un contexte/global store
        console.log("Bénévole promu admin");
        // Afficher la popup de succès
        setShowSuccessPopup(true);

        // Définir un délai de 2 secondes avant de fermer la popup et la modale
        setTimeout(() => {
          setShowSuccessPopup(false);
          // Vous pouvez ajouter ici une logique pour fermer la modale si nécessaire
        }, 2000); // 2000 millisecondes (2 secondes)
      } else {
        throw new Error("La promotion en tant qu'admin a échoué");
      }
    } catch (error) {
      console.error(
        "Erreur lors de la promotion du bénévole en tant qu'admin",
        error
      );
    }
  };

  return (
    <div className="">
      <Champ label="Prénom :">
        <input className="input" type="text" value={benevole.prenom} readOnly />
      </Champ>
      <Champ label="Nom :">
        <input className="input" type="text" value={benevole.nom} readOnly />
      </Champ>
      <Champ label="Association :">
        <input
          className="input"
          type="text"
          value={benevole.association}
          readOnly
        />
      </Champ>
      <Champ label="Taille Tee-shirt :">
        <input
          className="input"
          type="text"
          value={benevole.taille_tshirt}
          readOnly
        />
      </Champ>
      <Champ label="Végétarien ? :">
        <input
          className="input"
          type="text"
          value={benevole.vegetarien}
          readOnly
        />
      </Champ>
      <Champ label="Mail :">
        <input className="input" type="text" value={benevole.mail} readOnly />
      </Champ>
      <Champ label="Hébergement :">
        <input
          className="input"
          type="text"
          value={benevole.hebergement}
          readOnly
        />
      </Champ>

      {benevole.num_telephone && (
        <Champ label="Numéro de téléphone :">
          <input
            className="input"
            type="text"
            value={benevole.num_telephone}
            readOnly
          />
        </Champ>
      )}

      {benevole.adresse && (
        <Champ label="Adresse :">
          <input
            className="input"
            type="text"
            value={benevole.adresse}
            readOnly
          />
        </Champ>
      )}

      <div className="cta-container">
        <button className="cta" onClick={() => promoteToAdmin(benevole._id)}>
          <span>Promouvoir Admin</span>
          <svg width="15px" height="10px" viewBox="0 0 13 10">
            <path d="M1,5 L11,5"></path>
            <polyline points="8 1 12 5 8 9"></polyline>
          </svg>
        </button>
      </div>

      {showSuccessPopup && (
        <PopUp
          message={`Félicitations, ${benevole.pseudo} vient d'être promu admin`}
          type="success"
          onClose={() => setShowSuccessPopup(false)}
        />
      )}
    </div>
  );
}
export default ModaleInfos;
