import React from "react";
import "../../styles/popup.css";

const FenetrePopup = ({ message, type, onClose }) => {
  const popupClasses = `FenetrePopup ${type} ${message ? "show" : ""}`;

  return (
    <div className={popupClasses}>
      <p>{message}</p>
      <button className="closeButton" onClick={onClose}>
        X
      </button>
    </div>
  );
};

export default FenetrePopup;
