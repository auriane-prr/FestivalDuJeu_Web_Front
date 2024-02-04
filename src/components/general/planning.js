import React, { useState, useEffect } from 'react';
import '../../styles/planning.css';
import FenetrePopup from './fenetre_popup';

function Planning({ date }) {
  const [planningBenevole, setPlanningBenevole] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userid, setUserid] = useState('');
  const [mergedData, setMergedData] = useState([]);
  const [mergedDataReady, setMergedDataReady] = useState(false);

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

            const zonesPromise = fetch(`https://festivaldujeuback.onrender.com/zoneBenevole/benevole/${userid}`)
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
          if(stands.length === 0) {
            console.log("Aucun stand trouvé pour cet utilisateur");
            setMergedData(zones.filter(event => new Date(event.date).toDateString() === new Date(date).toDateString())
                .flatMap(event => event.horaireCota
                    .filter(cota => cota.liste_benevole.includes(userid))
                    .map(cota => ({ horaireId: cota._id, heure: cota.heure, nom: event.nom_stand || event.nom_zone_benevole }))
                ));
                setMergedDataReady(true);
          } else if(zones.length === 0) {
            console.log("Aucune zone trouvée pour cet utilisateur");
            setMergedData(stands.filter(event => new Date(event.date).toDateString() === new Date(date).toDateString())
                .flatMap(event => event.horaireCota
                    .filter(cota => cota.liste_benevole.includes(userid))
                    .map(cota => ({ horaireId: cota._id, heure: cota.heure, nom: event.nom_stand || event.nom_zone_benevole }))
                ));
                setMergedDataReady(true);
          } else if (stands.length > 0 && zones.length > 0){
          setMergedData([...stands, ...zones].filter(event => new Date(event.date).toDateString() === new Date(date).toDateString())
              .flatMap(event => event.horaireCota
                  .filter(cota => cota.liste_benevole.includes(userid))
                  .map(cota => ({
                      horaireId: cota._id,
                      heure: cota.heure,
                      nom: event.nom_stand || event.nom_zone_benevole
                  }))
              ));
              setMergedDataReady(true);
          }
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

  const handleRemoveBenevoleFromStand = async (horaireId, event) => {
    console.log("userID:", userid, "horaire:", horaireId);
    event.stopPropagation();
    try {
      if (!userid || !horaireId) {
        console.error("ID ou horaire manquant.");
        return;
      }
  
      const url = `https://festivaldujeuback.onrender.com/stands/removeBenevole/${horaireId}/${userid}`;
      console.log("Sending DELETE request to:", url);
  
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          
        },
      });
  
      if (!response.ok) {
        // Si la réponse n'est pas ok, afficher l'erreur et arrêter l'exécution
        const errorText = await response.text();
        throw new Error(
          `Erreur lors de la suppression du bénévole du stand : ${errorText}`
        );
      }
  
      console.log("Bénévole supprimé avec succès du stand !");
      window.location.reload();
  
    } catch (error) {
      console.error("Erreur lors de la suppression du bénévole du stand :", error);
      // Afficher une fenêtre popup ou une notification d'erreur à l'utilisateur ici
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
                {/*{planningBenevole.find(event => event.heure.includes(horaire))?.nom && (
            <button
              className="remove-button"
              onClick={(event) => {
                const selectedHoraire = planningBenevole.find(event => event.heure.includes(horaire));
                    if (selectedHoraire) {
                      handleRemoveBenevoleFromStand(selectedHoraire.horaireId, event);
                    }
                  }}
            >
              X
            </button>
                )}*/}
        </div>
      </div>
        ))}
      </div>
      )}
    </div>
  );
}

export default Planning;
