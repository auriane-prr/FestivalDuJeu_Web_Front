import React, { useState, useEffect } from 'react';
import '../../styles/planning.css';

function PlanningPosteReferent({ date }) {
  const [stands, setStands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [idReferent, setIdReferent] = useState('');

  useEffect(() => {
    setLoading(true);
    const pseudo = localStorage.getItem('pseudo');
    fetch(`http://localhost:3500/benevole/pseudo/${pseudo}`)
      .then(response => response.json())
      .then(data => {
        const referentId = data.benevole._id;
        setIdReferent(referentId);
        return fetch(`http://localhost:3500/stands/referent/${referentId}`);
      })
      .then(response => response.json())
      .then(data => {
        const filteredStands = data.filter(stand => new Date(stand.date).toDateString() === new Date(date).toDateString());
        setStands(filteredStands);
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des stands pour le référent: ", error);
      })
      .finally(() => setLoading(false));
  }, [date]);

  const horaires = ["9-11", "11-14", "14-17", "17-20", "20-22"];

  return (
    <div className="planning-container">
      {loading ? (
        <div>Chargement...</div>
      ) : (
        stands.map((stand, index) => (
          <React.Fragment key={index}>
            <h2>{stand.nom_stand}</h2>
            {horaires.map((horaire, indexHoraire) => {
              const cota = stand.horaireCota.find(c => c.heure === horaire);
              return (
                <div key={indexHoraire} className="planning-row">
                  <div className="planning-time">{horaire}</div>
                  <div className="planning-stand">
                    {cota && cota.liste_benevole.length > 0 ? (
                      cota.liste_benevole.map((benevole, indexBenevole) => (
                        <span key={indexBenevole} className="benevole-name">
                          {benevole.pseudo}
                          {indexBenevole < cota.liste_benevole.length - 1 ? ', ' : ''}
                        </span>
                      ))
                    ) : (
                      <span>Aucun bénévole inscrit</span>
                    )}
                  </div>
                </div>
              );
            })}
          </React.Fragment>
        ))
      )}
    </div>
  );
}

export default PlanningPosteReferent;