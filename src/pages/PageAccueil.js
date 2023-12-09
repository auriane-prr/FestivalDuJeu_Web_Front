import React, { useState, useEffect } from 'react';
import "../styles/Pages/pageAccueil.css";
import BandeauLogo from '../components/bandeauLogo';
import Boite from '../components/boite';
import Jauge from '../components/jauge';

function PageAccueil() {
  const [standsByHour, setStandsByHour] = useState({});

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
    <div className="accueil">
      <BandeauLogo />
      <div className="Titre">
        <h1>Accueil</h1>
      </div>
      <Boite>
        {Object.entries(standsByHour).map(([hour, stands], index) => (
          <div key={index}>
            <h2>{hour}</h2>
            <div className="columns">
              <div className="column">
                {stands.map((stand, i) => (
                  <Jauge key={i} borderColor='#454C8B'>{stand.nom_stand}</Jauge>
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
