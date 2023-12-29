import React from "react";
import "../../../styles/Admin/stands/fenetre_ajouter_stand.css";
import StandForm from "./form_ajouter_stand";
import EnTete from "../../general/en_tete";

const Modal = ({ onClose }) => {
  return (
    <div className="FicheAjoutStand show">
      <EnTete />
      <StandForm onClose={onClose} />
    </div>
  );
};

export default Modal;

// const Modal = ({ message, type, onClose }) => {
//   const ficheAjoutClasses = `FicheAjoutStand ${type} ${message ? 'show' : ''}`;

//   return (
//     <div className={ficheAjoutClasses}>
//       <p>{message}</p>
//       <StandForm onClose={onClose} />
//     </div>
//   );
// };

// export default Modal;
