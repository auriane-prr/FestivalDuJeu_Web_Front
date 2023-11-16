import React from 'react';
import Logo1 from '../Logo/logo.png';

function Bandeau() {
  return (
    <div className="Bandeau" 
          style={{
            width: 390, 
            height: 51, 
            left: 0, 
            top: 0, 
            position: 'absolute'
          }}>
            <div className="Fond" 
              style={{
                width: 390, 
                height: 51, 
                left: 0, 
                top: 0, 
                position: 'absolute', 
                background: 'rgba(29, 36, 75, 0.80)', 
                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)'
              }} />
          <img className="Logo1" 
            style={{
              width: 40, 
              height: 47.48, 
              left: 53, 
              top: 1, 
              position: 'absolute'
            }}>  
        </img>
        <div className="FestivalDuJeuMontpellier" 
        style={{
            left: 93, 
            top: 24, 
            position: 'absolute', 
            color: 'white', 
            fontSize: 20, 
            fontFamily: 'Itim', 
            fontWeight: '400', 
            wordWrap: 'break-word'}}>
                Festival du Jeu - Montpellier
        </div>
    </div>

  );
}

export default Bandeau;
