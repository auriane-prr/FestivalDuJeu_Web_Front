import React, { useState, useEffect } from 'react';
import "../styles/Pages/pageAccueil.css";
import BandeauLogo from '../components/bandeauLogo';
import Boite from '../components/boite';
import Jauge from '../components/jauge';

function PageAccueil() {
  const [standsByHour, setStandsByHour] = useState({});
  const columns = {
    column1: ['valeur1', 'valeur2', 'valeur3'],
    column2: ['valeur4', 'valeur5', 'valeur6'],
    // ... Ajoutez d'autres colonnes si nécessaire
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3500/stands');
        if (response.ok) {
          const data = await response.json();
          const standsByHour = groupStandsByHourAndColumn(data);
          setStandsByHour(standsByHour);
        } else {
          throw new Error('Erreur lors de la récupération des stands');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des stands :', error);
      }
    };

    fetchData();
  }, []);

  const groupStandsByHourAndColumn = (standsData) => {
    const standsByHour = {};
    standsData.forEach((stand) => {
      stand.horaireCota.forEach((horaire) => {
        const { heure, nb_benevole } = horaire;
        if (!standsByHour[heure]) {
          standsByHour[heure] = [];
        }
        standsByHour[heure].push({ nom_stand: stand.nom_stand, nb_benevole });
      });
    });
    return standsByHour;
  };

  return (
    <div>
      <BandeauLogo />
      <Boite>
        {Object.entries(standsByHour).map(([hour, stands], index) => (
          <div key={index}>
            <h2>{hour}</h2>
            <div className="columns">
              <div className="column">
                {stands.map((stand, i) => (
                  <React.Fragment key={i}>
                    <Jauge borderColor='#454C8B'>{stand.nom_stand}</Jauge>
                    <h2>{hour}h</h2>
                    <div>
                      <div>
                        {columns.column1.map((stand, i) => (
                          <Jauge key={i} borderColor='#454C8B'>{stand}</Jauge>
                        ))}
                      </div>
                      <div>
                        {columns.column2.map((stand, i) => (
                          <Jauge key={i} borderColor='#454C8B'>{stand}</Jauge>
                        ))}
                      </div>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        ))}
      </Boite>
    </div>
  );
  
}

export default PageAccueil;
