import React, { useEffect } from "react";
import "../../styles/fenetre_modale.css";
import EnTete from "./en_tete";
import Titre from "./titre";

const Modal = ({ onClose, children, valeurDuTitre }) => {
  // Effet pour empêcher le défilement de la page sous-jacente
  useEffect(() => {
    // Désactiver le défilement quand le composant modal est monté
    document.body.style.overflow = "hidden";

    // Réactiver le défilement lorsque le composant est démonté
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []); // Le tableau vide assure que l'effet s'exécute seulement au montage et au démontage

  return (
    <>
      <div className={`overlay ${children ? "showOverlay" : ""}`}></div>
      <div className="fenetre-modale show">
        <EnTete />
          <button className="modal-close-button" onClick={onClose}>X</button>
          <Titre valeurDuTitre={valeurDuTitre}/>
        {children}
      </div>
    </>
  );
};

export default Modal;
