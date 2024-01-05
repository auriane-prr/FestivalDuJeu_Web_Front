import React, { useState, useEffect } from "react";
import Boite from "../../general/boite";
import Champ from "../../general/champ";
import "../../../styles/Admin/festivals/display_festival.css";
import Bouton from "../../general/bouton";
import { useNavigate } from "react-router-dom";

function DisplayFestival() {
  const [festivals, setFestivals] = useState([]);
  const navigate = useNavigate();

  const goToFestivalPage = () => {
    console.log("go to festival page");
    navigate("/admin/festival");
  };

  useEffect(() => {
    async function fetchFestivals() {
      try {
        const response = await fetch("http://localhost:3500/festival", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const festivals = await response.json();
          setFestivals(festivals);
        } else {
          throw new Error("Failed to fetch festivals");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des festivals", error);
      }
    }

    fetchFestivals();
  }, []);

  return (
    <div>
      {festivals.map((festival) => (
        <Boite key={festival.id} valeurDuTitre={festival.nom}>
          <div className="date-container">
            <Champ label="Date début :">
              <input
                type="text"
                value={festival.date_debut}
                className="input"
                readOnly
              />
            </Champ>
            <Champ label="Date fin :">
              <input
                type="text"
                value={festival.date_fin}
                className="input"
                readOnly
              />
            </Champ>
          </div>
          <Champ label="Lieu :">
            <input
              type="text"
              value={festival.lieu}
              className="input"
              readOnly
            />
          </Champ>
          <Champ label="Description :">
            <input
              type="text"
              value={festival.description}
              className="input"
              readOnly
            />
          </Champ>
          <div className="button-container">
            <Bouton type="button" onClick={
                goToFestivalPage}>
              Voir plus
            </Bouton>
          </div>
        </Boite>
      ))}
    </div>
  );
}

export default DisplayFestival;
