import React, { useState, useEffect } from 'react';
import "../styles/Pages/pageAccueil.css";
import BandeauLogo from '../components/bandeauLogo';
import Boite from '../components/boite';
import Jauge from '../components/jauge';
import Fiche_modal from '../components/fiche_modal'; // Import du composant Modal

function PageAccueil() {
  const [standsByHour, setStandsByHour] = useState({});
  const [selectedStand, setSelectedStand] = useState(null); // État pour stocker le stand sélectionné
  const [showModal, setShowModal] = useState(false); // État pour afficher ou masquer la fenêtre modale

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
        <Fiche_modal type="success" onClose={closeModal}>
          <p>Nom du stand: {selectedStand.nom_stand}</p>
          <p>Description: {selectedStand.description}</p>
          <p>Heure: {selectedStand.heure}</p>
          <p>Nombre de bénévoles maximum: {selectedStand.nb_benevole}</p>
          <button>Participer</button>
        </Fiche_modal>
      )}
    </div>
  );
}

export default PageAccueil;
