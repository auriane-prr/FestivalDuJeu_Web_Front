import React from 'react';
import PropTypes from 'prop-types';
import "../../../styles/jauge.css";

const Jauge = ({ children, borderColor, filledPercentage }) => {
    const jaugeStyle = {
        borderColor: borderColor || '#454C8B', // Couleur par défaut si aucune couleur n'est fournie
    };
    const jaugeFillStyle = {
        width: `${filledPercentage}%`, // Utilisation du pourcentage pour définir la largeur
        backgroundColor: borderColor || '#454C8B',
    };

    return (
        <div className='jauge-container' style={jaugeStyle}>
            <span className='nom-jauge'>
            <div className='jauge-fill' style={jaugeFillStyle}></div>
                {children}
            </span>
        </div>
    );
};

Jauge.propTypes = {
    borderColor: PropTypes.string, // Propriété borderColor pour spécifier la couleur de la bordure
    children: PropTypes.node.isRequired,
    filledPercentage: PropTypes.number.isRequired,
};

export default Jauge;
