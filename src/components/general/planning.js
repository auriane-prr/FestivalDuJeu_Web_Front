import React, { useState, useEffect } from 'react';
import '../../styles/planning.css';
import Titre from './titre';

function Planning({ date }) {
  const [planningBenevole, setPlanningBenevole] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userid, setUserid] = useState('');

  const horaires = ["9-11", "11-14", "14-17", "17-20", "20-22"];
  const planningData = horaires.map(horaire => ({ heure: horaire, nom: "" }));

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
      .then(response => response.ok ? response.json() : Promise.reject('Erreur lors de la récupération du bénévole'))
      .then(benevoleData => {
        setUserid(benevoleData.benevole._id);
      })
      .catch(error => {
        console.error("Erreur lors de la récupération de l'ID de l'utilisateur: ", error);
      });
    }
  }, []);
  useEffect(() => {
    setLoading(true);
    if (userid) {
        const standsPromise = fetch(`http://localhost:3500/stands/benevole/${userid}`)
            .then(response => {
              if(!response.ok) {
                throw new Error('Erreur lors de la récupération des stands');
              }
              return response.json();
            })
            .then(dataStands => {
              console.log("Data pour les stands:", dataStands);
              return dataStands;
            })
            .catch(() => []);

            const zonesPromise = fetch(`http://localhost:3500/zoneBenevole/benevole/${userid}`)
            .then(response => {
              if (!response.ok) {
                  throw new Error('Failed to fetch zones');
              }
              return response.json();
          })
          .then(dataZones => {
              console.log("Data pour les zones:", dataZones);
              return dataZones; // Ceci est déjà résolu et sera un tableau
          })
          .catch(() => []);

        Promise.allSettled([standsPromise, zonesPromise])
        .then(results => {
          const stands = results[0].status === 'fulfilled' ? results[0].value : [];
          const zones = results[1].status === 'fulfilled' ? results[1].value : [];
          const mergedData = [...stands, ...zones].filter(event => new Date(event.date).toDateString() === new Date(date).toDateString())
              .flatMap(event => event.horaireCota
                  .filter(cota => cota.liste_benevole.includes(userid))
                  .map(cota => ({
                      heure: cota.heure,
                      nom: event.nom_stand || event.nom_zone_benevole
                  }))
              );
              console.log("Données fusionnées:", mergedData);
              mergedData.forEach(data => {
                const index = planningData.findIndex(item => item.heure === data.heure);
                if (index !== -1) {
                  planningData[index].nom = data.nom;
                }
              });
      
              setPlanningBenevole(planningData);
              setLoading(false);
      })
      .catch(error => {
          console.error("Erreur lors de la récupération des données: ", error);
          setLoading(false);
      })
    } else {
      setLoading(false);
    }
  }, [date, userid]);



  return (
    <div>
    <Titre texte="Vous n'ête pas référent à cette date" />
    <h3>Planning</h3>
    <div className="planning-container">
      {horaires.map((horaire, index) => (
        <div key={index} className="planning-row">
          <div className="planning-time">{horaire}</div>
          <div className="planning-stand">
            {planningBenevole.find(event => event.heure.includes(horaire))?.nom || ""}
          </div>
        </div>
      ))}
    </div>
    </div>
  );
}

export default Planning;
