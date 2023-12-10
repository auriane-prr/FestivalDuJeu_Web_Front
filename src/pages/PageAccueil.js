import React, { useState, useEffect } from 'react';
import "../styles/Pages/pageAccueil.css";
import BandeauLogo from '../components/bandeauLogo';
import Boite from '../components/boite';
import Jauge from '../components/jauge';
import Fiche_modal from '../components/fiche_modal'; // Import du composant Modal

function PageAccueil() {
  const [standsByHour, setStandsByHour] = useState({});
  const [userId, setUserId] = useState('');
  const [selectedStand, setSelectedStand] = useState(null); // État pour stocker le stand sélectionné
  const [showModal, setShowModal] = useState(false); // État pour afficher ou masquer la fenêtre modale

  const fetchUserId = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const pseudo = localStorage.getItem('pseudo');
      const response = await fetch(`http://localhost:3500/benevole/${pseudo}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const { benevole } = await response.json();
          console.log('benevoleId', benevole._id);
          setUserId(benevole._id);
        } else {
          throw new Error('Erreur lors de la récupération des informations utilisateur');
        }
    } catch (error) {
      console.error('Erreur lors de la récupération des informations utilisateur :', error);
    }
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

  useEffect(() => {
    if (selectedStand && userId) {
      handleParticiperClick();
    }
  }, [userId]);
  const groupStandsByHourAndColumn = (standsData) => {
    const standsByHour = {};
    standsData.forEach((stand) => {
      stand.horaireCota.forEach((horaire) => {
        const { heure, nb_benevole } = horaire;
        if (!standsByHour[heure]) {
          standsByHour[heure] = [];
        }
        standsByHour[heure].push({ ...stand, heure, nb_benevole }); // Ajout de toutes les informations du stand dans standsByHour
      });
    });
    return standsByHour;
  };

  const handleJaugeClick = (stand) => {
    setSelectedStand(stand); // Mettre à jour l'état du stand sélectionné
    setShowModal(true); // Afficher la fenêtre modale
  };

  const closeModal = () => {
    setShowModal(false); // Cacher la fenêtre modale
  };
  
  const handleParticiperClick = async () => {
    await fetchUserId();
    if (selectedStand && userId) {
      try {
        const { _id: idStand, horaireCota } = selectedStand;
        const idHoraire = horaireCota[0]._id; 
        const idBenevole = userId;
        const token = localStorage.getItem('authToken');
        const response = await fetch(`http://localhost:3500/stands/${idStand}/${idHoraire}/${idBenevole}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          console.log('Participation enregistrée');
          const updatedResponse = await fetch(`http://localhost:3500/stands/${idStand}`);
        if (updatedResponse.ok) {
          const updatedStand = await updatedResponse.json();

          // Mettre à jour selectedStand avec la nouvelle liste de bénévoles inscrits
          setSelectedStand(updatedStand);
        }
        } else {
          throw new Error('Erreur lors de l enregistrement de la participation');
        }
      } catch (error) {
        console.error('Erreur lors de la participation :', error);
      }
    }
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
                  <div key={i} onClick={() => handleJaugeClick(stand)}>
                    <Jauge borderColor='#454C8B'>{stand.nom_stand}</Jauge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </Boite>
      {showModal && selectedStand && ( // Affichage conditionnel de la fenêtre modale
        <Fiche_modal type="success" onClose={closeModal} onParticipateClick={handleParticiperClick}>
          <p>Nom du stand: {selectedStand.nom_stand}</p>
          <p>Description: {selectedStand.description}</p>
          <p>Heure: {selectedStand.heure}</p>
          <p>Nombre de bénévoles maximum: {selectedStand.nb_benevole}</p>
          <p>Liste de bénévoles inscrits: {selectedStand.liste_benevole}</p>
          <button onClick={() => handleParticiperClick()}>Participer</button>
        </Fiche_modal>
      )}
    </div>
  );
  
}

export default PageAccueil;
