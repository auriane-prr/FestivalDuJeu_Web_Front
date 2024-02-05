import React, { useState, useEffect } from 'react';
import '../../styles/planning.css';
import FicheDisplayStand from '../benevole/stands/fiche_display_stand';
import FicheDisplayZone from '../benevole/zones/fiche_display_zone';
import Modale from './fenetre_modale';

function Planning({ date }) {
  const [planningBenevole, setPlanningBenevole] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userid, setUserid] = useState('');
  const [mergedData, setMergedData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showModal, setShowModal] = useState(false);
 
  const closeModal = () => {
    setShowModal(false);
  };

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
                nb_benevole: cota.nb_benevole,
                liste_benevole: cota.liste_benevole,
                nom: event.nom_stand,
                referents: event.referents,
                description: event.description,
                id: event._id,
                type: "stand"
              })));
  
          const filteredZones = zones
            .filter(event => new Date(event.date).toDateString() === new Date(date).toDateString())
            .flatMap(event => event.horaireCota
              .filter(cota => cota.liste_benevole.includes(userid))
              .map(cota => ({
                horaireId: cota._id,
                heure: cota.heure,
                liste_benevole: cota.liste_benevole,
                nb_benevole: cota.nb_benevole,
                nom: event.nom_zone_benevole,
                id_zone_benevole: event.id_zone_benevole,
                description: event.description,
                referents: event.referents,
                liste_jeux: event.liste_jeux,
                id: event._id,
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
              planningData[index].description = data.description;
              planningData[index].liste_benevole = data.liste_benevole;
              planningData[index].referents = data.referents;
              planningData[index].liste_jeux = data.liste_jeux;
              planningData[index].nb_benevole = data.nb_benevole;
              planningData[index].id_zone_benevole = data.id_zone_benevole;
              planningData[index].id = data.id;

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
  
  
  const handleItemClick = (item) => {
    setSelectedItem(item);
    setShowDetails(true);
    setShowModal(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedItem(null);
    setShowModal(false);
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
                {planningBenevole.find(event => event.heure.includes(horaire))?.nom && (
                  <>
                    <div onClick={() => handleItemClick(planningBenevole.find(event => event.heure.includes(horaire)))}>
                      {planningBenevole.find(event => event.heure.includes(horaire)).nom}
                    </div>
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
                  </>
                )}
              </div>
            </div>
          ))}
          {showModal &&  (
          <Modale onClose={handleCloseDetails} valeurDuTitre={"Information"}>
          {showDetails && selectedItem && (
            selectedItem.type === 'stand' ? (
              console.log("selectedItem", selectedItem),
              <FicheDisplayStand
                stand={selectedItem}
                
                
              />
            ) : (
              console.log("selectedItem", selectedItem),
              <FicheDisplayZone
                zone={selectedItem}
                creneau={selectedItem}
                
              />
            )
          )}
          </Modale>
        )}
        </div>
      )}
    </div>
  );


}

export default Planning;
