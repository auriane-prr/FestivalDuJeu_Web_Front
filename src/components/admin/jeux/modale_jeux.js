import React, { useState, useEffect, useRef } from "react";
import "../../../styles/Admin/jeux/display_jeux.css";
import Champ from "../../general/champ";
import BoutonPagePrecedente from "../../BoutonPagePrecedente";
import BoutonPageSuivante from "../../BoutonPageSuivante";
import Ajouter_jeux from "./download";
import Titre from "../../general/titre";

function Display_jeux() {
  const [jeux, setJeux] = useState([]);
  const [currentJeuIndex, setCurrentJeuIndex] = useState(0);
  const currentJeu = jeux[currentJeuIndex] || {};
  const [zones, setZones] = useState([]);
  const descriptionRef = useRef(null);

  // Récupération des jeux pour la zone sélectionnée
  useEffect(() => {
    async function fetchJeuxData() {
      if (selectedZone) {
        try {
          const response = await fetch(
            `http://localhost:3500/jeux/jeuxParZone/${selectedZone}`
          );
          const data = await response.json();
          setJeux(data);
        } catch (error) {
          console.error("Erreur lors de la récupération des jeux", error);
        }
      }
    }
    fetchJeuxData();
  }, [selectedZone]);

  useEffect(() => {
    fetch("http://localhost:3500/jeux/zones")
      .then((response) => response.json())
      .then((data) => setZones(data))
      .catch((error) =>
        console.error("Erreur lors de la récupération des zones", error)
      );
  }, []);

  useEffect(() => {
    const adjustHeight = () => {
      if (descriptionRef.current) {
        descriptionRef.current.style.height = "inherit"; // Reset height to get the scrollHeight
        descriptionRef.current.style.height = `${descriptionRef.current.scrollHeight}px`;
      }
    };

    adjustHeight();
  }, [currentJeu.description]);

  useEffect(() => {
    const textarea = document.querySelector(".input"); // Make sure this class is unique to the textarea
    if (textarea) {
      textarea.style.height = "inherit";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [currentJeu.description]);

  const handleResize = (e) => {
    e.target.style.height = "inherit";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <div>
      <div className="field-container">
        <img src={currentJeu.logo} alt="Logo du jeu" className="logo-jeux" />
        <div className="row">
          <Champ label="Editeur" customStyle={{ width: "auto" }}>
            <input
              type="text"
              value={currentJeu.editeur}
              className="input"
              readOnly
            />
          </Champ>
          <Champ label="Âge minimum" customStyle={{ width: "auto" }}>
            <input
              type="text"
              value={currentJeu.ageMin}
              className="input"
              readOnly
            />
          </Champ>
        </div>
        <div className="row">
          <Champ label="Durée" customStyle={{ width: "auto" }}>
            <input
              type="text"
              value={currentJeu.duree}
              className="input"
              readOnly
            />
          </Champ>
          <Champ label="Nombre de joueurs" customStyle={{ width: "auto" }}>
            <input
              type="text"
              value={currentJeu.nbJoueurs}
              className="input"
              readOnly
            />
          </Champ>
        </div>
      </div>
      <div className="field-container">
        <div className="row">
          <Champ label="Thème">
            <input
              type="text"
              value={currentJeu.theme}
              className="input"
              readOnly
            />
          </Champ>

          <Champ label="Tags">
            <input
              type="text"
              value={currentJeu.tags}
              className="input"
              readOnly
            />
          </Champ>
        </div>
        <div className="row">
          <Champ label="Mécanisme">
            <input
              type="text"
              value={currentJeu.mecanisme}
              className="input"
              readOnly
            />
          </Champ>
          <Champ label="Lien">
            <input
              type="text"
              value={currentJeu.lien}
              className="input"
              readOnly
            />
          </Champ>
        </div>
      </div>
      <Champ label="Description">
        <textarea
          ref={descriptionRef} // Attach the ref here
          type="text"
          value={currentJeu.description}
          className="input"
          readOnly
          style={{ overflow: "hidden", resize: "none" }}
        />
      </Champ>
    </div>
  );
}

export default Display_jeux;
