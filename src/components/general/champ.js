import React from 'react';
import "../../styles/champ.css";

const Champ = (props) => {
  return (
    <div className="field">
      <label htmlFor={props.label} className='input'>{props.label}</label>
        {props.children}
    </div>
  );
};

export default Champ;