import React, { useState } from 'react';
import '../../styles/login&register/aide.css';

function Aide() {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div className="aide-container">
            <div 
                className="aide-button" 
                onMouseEnter={() => setIsHovered(true)} 
                onMouseLeave={() => setIsHovered(false)}
            >
                ?
            </div>
            {isHovered && (
                <div className="aide-text">
                    Attention : Votre nom, prénom et mot de passe ne pourront pas être modifiés ultérieurement.
                </div>
            )}
        </div>
    );
}

export default Aide;
