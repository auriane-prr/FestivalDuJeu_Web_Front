import React, { useState, useEffect } from 'react';
import '../../styles/planning.css';

function Planning({ date }) {
  const [standsBenevole, setStandsBenevole] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userid, setUserid] = useState('');

  useEffect(() => {
    const pseudo = localStorage.getItem('pseudo');
    const token = localStorage.getItem('authToken');

    if (pseudo && token) {
      setLoading(true);

      // Premièrement, récupérez l'ID du bénévole
      fetch(`http://localhost:3500/benevole/pseudo/${pseudo}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des informations utilisateur');
        }
        return response.json();
        
      })
      .then(benevoleData => {
        setUserid(benevoleData.benevole._id);
        // Deuxièmement, récupérez les stands pour cet ID
        return fetch(`http://localhost:3500/stands/benevole/${benevoleData.benevole._id}`);
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des stands');
        }
        return response.json();
      })
      .then(stands => {
        // Filtrer les stands par la date et construire la liste des stands pour le bénévole
        const standsPourDate = stands.filter(stand => new Date(stand.date).toDateString() === new Date(date).toDateString())
          .flatMap(stand => stand.horaireCota
            .filter(cota => cota.liste_benevole.some(id => id === userid))
            .map(cota => ({
              heure: cota.heure,
              nom_stand: stand.nom_stand
            }))
          );
        setStandsBenevole(standsPourDate);
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

  if (loading) {
    return <div>Chargement...</div>;
  }
  const horaires = ["9-11", "11-14", "14-17", "17-20", "20-22"];

  return (
    <div className="planning-container">
      {loading ? (
        <div>Loading...</div>
      ) : (
        horaires.map((horaire, index) => (
          <div key={index} className="planning-row">
            <div className="planning-time">{horaire}</div>
            <div className="planning-stand">
              {standsBenevole.find(stand => stand.heure === horaire)?.nom_stand || ""}
            </div>
          </div>
        ))
      )}
    </div>
  );
};


export default Planning;
