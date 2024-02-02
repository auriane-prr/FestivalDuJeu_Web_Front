import React, { useState, useEffect } from 'react';
import '../../styles/planning.css';

function Planning({ date }) {
  const [planningBenevole, setPlanningBenevole] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userid, setUserid] = useState('');

  useEffect(() => {
    const pseudo = localStorage.getItem('pseudo');
    const token = localStorage.getItem('authToken');

    if (pseudo && token) {
      setLoading(true);

      fetch(`http://localhost:3500/benevole/pseudo/${pseudo}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => response.json())
      .then(benevoleData => {
        setUserid(benevoleData.benevole._id);
        const standsPromise = fetch(`http://localhost:3500/stands/benevole/${benevoleData.benevole._id}`).then(response => response.json());
        const zonesPromise = fetch(`http://localhost:3500/zoneBenevole/benevole/${benevoleData.benevole._id}`).then(response => response.json());

        return Promise.all([standsPromise, zonesPromise]);
      })
      .then(([stands, zones]) => {
        const mergedData = [...stands, ...zones].filter(event => new Date(event.date).toDateString() === new Date(date).toDateString())
          .flatMap(event => event.horaireCota
            .filter(cota => cota.liste_benevole.includes(userid))
            .map(cota => ({
              heure: cota.heure,
              nom: event.nom_stand || event.nom_zone_benevole
            }))
          );
        setPlanningBenevole(mergedData);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des données: ", error);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [date, userid]);

  const horaires = ["9-11", "11-14", "14-17", "17-20", "20-22"];

  return (
    <div className="planning-container">
      {horaires.map((horaire, index) => (
        <div key={index} className="planning-row">
          <div className="planning-time">{horaire}</div>
          <div className="planning-stand">
            {planningBenevole.find(event => event.heure === horaire)?.nom || ""}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Planning;
