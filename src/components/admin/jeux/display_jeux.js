import React from "react";
import "../../../styles/Admin/jeux/display_jeux.css";
import Champ from "../../general/champ";

function Display_jeux({ jeu }) {

  return (
        <div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Champ
              customStyle={{
                width: "20%",
                border: "1px solid #000",
                borderRadius: "10px",
                flex: "0 0 auto",
              }}
            >
              <img src={jeu.logo} className="input" alt="Logo" />
            </Champ>
            <Champ
              label="Nom du jeu"
              customStyle={{ flex: 1, marginRight: "10px" }}
            >
              <input
                type="text"
                value={jeu.nom_jeu}
                className="input"
                readOnly
              />
            </Champ>
            <Champ label="Editeur" customStyle={{ flex: 1, marginRight: "60px" }}>
              <input
                type="text"
                value={jeu.editeur}
                className="input"
                readOnly
              />
            </Champ>
          </div>
          <Champ label="Âge minimum" customStyle={{ marginTop: "10px" }}>
            <input
              type="text"
              value={jeu.ageMin}
              className="input"
              readOnly
            />
          </Champ>
          <Champ label="Durée">
            <input
              type="text"
              value={jeu.duree}
              className="input"
              readOnly
            />
          </Champ>
          <Champ label="Thème">
            <input
              type="text"
              value={jeu.theme}
              className="input"
              readOnly
            />
          </Champ>
          <Champ label="Mécanisme">
            <input
              type="text"
              value={jeu.mecanisme}
              className="input"
              readOnly
            />
          </Champ>
          <Champ label="Tags">
            <input
              type="text"
              value={jeu.tags}
              className="input"
              readOnly
            />
          </Champ>
          <Champ label="Description">
            <input
              type="text"
              value={jeu.description}
              className="input"
              readOnly
            />
          </Champ>
          <Champ label="Nombre de joueurs">
            <input
              type="text"
              value={jeu.nbJoueurs}
              className="input"
              readOnly
            />
          </Champ>
          <Champ label="Animation requise">
            <input
              type="text"
              value={jeu.animationRequise}
              className="input"
              readOnly
            />
          </Champ>
          <Champ label="Lien">
            <input
              type="text"
              value={jeu.lien}
              className="input"
              readOnly
            />
          </Champ>
        </div>
  );
}

export default Display_jeux;
