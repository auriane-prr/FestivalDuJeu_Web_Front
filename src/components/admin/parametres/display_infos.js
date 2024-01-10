import React from "react";
import Champ from "../../general/champ";

function ModaleInfos({ benevole }) {
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
    </div>
  );
}
export default ModaleInfos;
