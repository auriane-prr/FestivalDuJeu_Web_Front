import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../styles/Pages/referent/ReferentAccueil.css";
import BandeauReferent from "../../components/referent/bandeauReferent";
import Boite from "../../components/general/boite";
import Champ from "../../components/general/champ";
import ReferentDisplayZone from "../../components/referent/ReferentDisplayZone";
import Titre from "../../components/general/titre";
import Bouton from "../../components/general/bouton";

function PageAccueil() {
  const [userData, setUserData] = useState("");
  const [standInfo, setStandInfo] = useState([{}]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const pseudo = localStorage.getItem("pseudo");
    if (!pseudo) return;

    const fetchUserDataAndStandInfo = async () => {
      setIsLoading(true); // Commencer le chargement
      try {
        const responseBenevole = await fetch(
          `https://festivaldujeuback.onrender.com/benevole/pseudo/${pseudo}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (responseBenevole.ok) {
          const { benevole } = await responseBenevole.json();
          setUserData(benevole);

          const responseStand = await fetch(
            `https://festivaldujeuback.onrender.com/stands/referent/${benevole._id}`,
            {
              method: "GET",
              headers: { "Content-Type": "application/json" },
            }
          );

          if (responseStand.ok) {
            const standData = await responseStand.json();
            setStandInfo(standData);
            setIsLoading(false); // Fin du chargement
          }
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        setIsLoading(false); // Fin du chargement même en cas d'erreur
      }
    };

    fetchUserDataAndStandInfo();
  }, []);

  function formatDate(date) {
    if (!date) return "";
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }
  const currentStand = standInfo ? standInfo[0] : null;

  if (isLoading || !standInfo) {
    return <div>Chargement des données...</div>;
  }

  const renderGeneralStandContent = () => {
    return (
      <div>
        <Champ label="description">
          <input
            type="text"
            className="input"
            value={currentStand.description || "Chargement..."}
            readOnly
          />
        </Champ>
        <Champ label="Date">
          <input
            type="text"
            className="input"
            value={formatDate(currentStand.date) || "Chargement..."}
            readOnly
          />
        </Champ>
        <Champ label="Référents">
          {currentStand.referents && currentStand.referents.length > 0 ? (
            currentStand.referents.map((referent) => (
              <div key={referent._id} className="referent-input">
                <input
                  type="text"
                  className="input"
                  value={referent.pseudo || "Chargement..."}
                  readOnly
                />
              </div>
            ))
          ) : (
            <input
              type="text"
              className="input"
              value="Aucun référent"
              readOnly
            />
          )}
        </Champ>

        <div className="PlanningPoste">
          <Link to="/referent/poste" style={{ textDecoration: "none" }}>
            <Bouton>Voir le planning</Bouton>
          </Link>
        </div>
      </div>
    );
  };

  const renderAnimationJeuContent = () => {
    return (
      <div>
        <ReferentDisplayZone />
      </div>
    );
  };

  return (
    <div>
      <BandeauReferent />

      <Boite>
        <Titre
          valeurDuTitre={`Bonjour ${
            userData.pseudo || "Chargement..."
          }, le ${formatDate(
            currentStand.date
          )} vous êtes référent(e) du stand ${
            standInfo[0]?.nom_stand || "Chargement..."
          }`}
        />

        {currentStand.nom_stand === "Animation jeu"
          ? renderAnimationJeuContent()
          : renderGeneralStandContent()}
      </Boite>
    </div>
  );
}

export default PageAccueil;
