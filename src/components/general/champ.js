import React from 'react';
import "../../styles/champ.css";

const Champ = ({label, children, customStyle}) => {
  return (
    <div className="field"  style={customStyle}>
      <label htmlFor={label} className='input'>{label}</label>
        {children}
    </div>
  );
};

export default Champ;