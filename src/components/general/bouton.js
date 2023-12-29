import React from "react";
import "../../styles/bouton.css";

const Bouton = ({ children, onClick, type }) => {
    return (
      <button type={type} onClick={onClick}>
        <span className="shadow"></span>
        <span className="edge"></span>
        <span className="front text">{children}</span>
      </button>
    );
  };

export default Bouton;
