import React from 'react';
import "../styles/champ.css";

const Champ = (props) => {
  return (
    <div className="field">
      <label htmlFor={props.label}>{props.label}</label>
      <div>
        {props.children}
      </div>
    </div>
  );
};

export default Champ;