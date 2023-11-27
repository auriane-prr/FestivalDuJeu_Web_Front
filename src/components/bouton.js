import React from 'react';
import "../styles/bouton.css";

const Bouton = ({ children }) => {
  return (
    <div className='Container-bouton'>
      <button type="submit" className="CustomButton">
        <span className="ButtonText">
          {children}
        </span>
      </button>
    </div>
  );
};

export default Bouton;