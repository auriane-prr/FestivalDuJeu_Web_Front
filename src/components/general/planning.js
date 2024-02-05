import React, { useState, useEffect } from 'react';
import '../../styles/planning.css';

function Planning({ date }) {
  const [planningBenevole, setPlanningBenevole] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userid, setUserid] = useState('');
  const [mergedData, setMergedData] = useState([]);
 

  const horaires = ["9-11", "11-14", "14-17", "17-20", "20-22"];
  const planningData = horaires.map(horaire => ({ heure: horaire, nom: "" }));

  useEffect(() => {
    const pseudo = localStorage.getItem('pseudo');
    const token = localStorage.getItem('authToken');

    if (pseudo && token) {
      setLoading(true);

      fetch(`https://festivaldujeuback.onrender.com/benevole/pseudo/${pseudo}`, {
          headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
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
      const standsPromise = fetch(`https://festivaldujeuback.onrender.com/stands/benevole/${userid}`)
        .then(response => response.ok ? response.json() : Promise.reject('Erreur lors de la récupération des stands'))
        .catch(() => []); // Retourne un tableau vide en cas d'erreur
  
      const zonesPromise = fetch(`https://festivaldujeuback.onrender.com/zoneBenevole/benevole/${userid}`)
        .then(response => response.ok ? response.json() : Promise.reject('Failed to fetch zones'))
        .catch(() => []); // Retourne un tableau vide en cas d'erreur
  
      Promise.allSettled([standsPromise, zonesPromise])
        .then(results => {
          const stands = results[0].status === 'fulfilled' ? results[0].value : [];
          const zones = results[1].status === 'fulfilled' ? results[1].value : [];
  
          // Filtrer et mapper les données des stands et des zones
          const filteredStands = stands
            .filter(event => new Date(event.date).toDateString() === new Date(date).toDateString())
            .flatMap(event => event.horaireCota
              .filter(cota => cota.liste_benevole.includes(userid))
              .map(cota => ({
                horaireId: cota._id,
                heure: cota.heure,
                nom: event.nom_stand,
                type: "stand"
              })));
  
          const filteredZones = zones
            .filter(event => new Date(event.date).toDateString() === new Date(date).toDateString())
            .flatMap(event => event.horaireCota
              .filter(cota => cota.liste_benevole.includes(userid))
              .map(cota => ({
                horaireId: cota._id,
                heure: cota.heure,
                nom: event.nom_zone_benevole,
                type: "zone"
              })));
  
          // Fusionner les listes filtrées et mappées
          const merged = [...filteredStands, ...filteredZones];
  
          // Mettre à jour l'état avec les données fusionnées
          setMergedData(merged);
          merged.forEach(data => {
            const index = planningData.findIndex(item => item.heure === data.heure);
            if (index !== -1) {
              planningData[index].nom = data.nom;
              planningData[index].horaireId = data.horaireId;
              planningData[index].type = data.type;
            }
          });
          setPlanningBenevole(planningData);
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
  

  const handleRemoveBenevole = async (horaireId, type, event) => {
    console.log("horaireID", horaireId, "type", type);
    event.stopPropagation();
    if (!userid || !horaireId) {
      console.error("ID ou horaire manquant.");
      return;
    }
  
    const baseUrl = 'https://festivaldujeuback.onrender.com';
    const url = `${baseUrl}/${type === 'stand' ? 'stands' : 'zoneBenevole'}/removeBenevole/${horaireId}/${userid}`;
    console.log("Sending DELETE request to:", url);
  
    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur lors de la suppression du bénévole : ${errorText}`);
      }
  
      console.log("Bénévole supprimé avec succès du " + (type === 'stand' ? 'stand' : 'zone') + " !");
      window.location.reload();
  
    } catch (error) {
      console.error("Erreur lors de la suppression du bénévole :", error);
    }
  };
  
  



  return (
    <div>
      {loading ? (
          <div className="loading">Chargement...</div>
        ) : (
      <div className="planning-container">
          {horaires.map((horaire, index) => (
            <div key={index} className="planning-row">
              <div className="planning-time">{horaire}</div>
              <div className="planning-stand">
                {planningBenevole.find(event => event.heure.includes(horaire))?.nom || ""}
                {planningBenevole.find(event => event.heure.includes(horaire))?.nom && (
            <button
              className="remove-button"
              onClick={(event) => {
                const selectedHoraire = planningBenevole.find(event => event.heure.includes(horaire));
                    if (selectedHoraire) {
                      handleRemoveBenevole(selectedHoraire.horaireId, selectedHoraire.type, event);
                    }
                  }}
            >
              X
            </button>
                )}
        </div>
      </div>
        ))}
      </div>
      )}
    </div>
  );
}

export default Planning;
