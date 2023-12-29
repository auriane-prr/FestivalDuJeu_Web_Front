import React from 'react';
import PropTypes from 'prop-types';
import "../../../styles/jauge.css";

const Jauge = ({ children, borderColor }) => {
    const jaugeStyle = {
        borderColor: borderColor || '#454C8B', // Couleur par défaut si aucune couleur n'est fournie
    };

    return (
        <div className='jauge-container' style={jaugeStyle}>
            <span className='nom-jauge'>
                {children}
            </span>
        </div>
    );
};

Jauge.propTypes = {
    borderColor: PropTypes.string, // Propriété borderColor pour spécifier la couleur de la bordure
    children: PropTypes.node.isRequired,
};

export default Jauge;
