import React from "react";
import "../../styles/radioButton.css";


const RadioButtonGroup = ({ options, name, selectedValue, onChange }) => {
    return (
      <div className="radio-inputs">
        {options.map((option, index) => (
          <label key={index} className="radio">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={selectedValue === option.value}
              onChange={onChange}
            />
            <span className="name">{option.label}</span>
          </label>
        ))}
      </div>
    );
  };

  export default RadioButtonGroup;