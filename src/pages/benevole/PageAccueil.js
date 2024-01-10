import React, { useState, useEffect } from 'react';
import "../../styles/Pages/pageAccueil.css";
import BandeauLogo from '../../components/benevole/bandeauBenevole';
import BoiteOnglet from '../../components/general/boiteOnglet';
import Jauge from '../../components/benevole/stands/jauge';
import Champ from '../../components/general/champ';
import Fiche_modal from '../../components/benevole/stands/fiche_stand_participer'; // Import du composant Modal

function PageAccueil() {
  const [standsByHour, setStandsByHour] = useState({});
  const [standsByDate, setStandsByDate] = useState({});
  const [dateDebut, setDateDebut] = useState(null);
  const [dateFin, setDateFin] = useState(null);
  const [dateD, setDateD] = useState(null); // pour le titre sinon ca casse tout
  const [dateF, setDateF] = useState(null);
  const [userId, setUserId] = useState('');
  const [selectedStand, setSelectedStand] = useState(null); // État pour stocker le stand sélectionné
  const [showModal, setShowModal] = useState(false); // État pour afficher ou masquer la fenêtre modale

  const fetchUserId = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const pseudo = localStorage.getItem('pseudo');
      const response = await fetch(`http://localhost:3500/benevole/pseudo/${pseudo}`, {
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
  const fetchStandByDate = async (date) => {
    try {
      const response = await fetch(`http://localhost:3500/stands/date/${date}`);
      if (response.ok) {
        const stands = await response.json();
        console.log('liste de stands', stands);
        setStandsByDate((prevStands) => ({
          ...prevStands,
          [date]: groupStandsByHourAndColumn(stands),
        }));
      } else {
        throw new Error('Erreur lors de la récupération des stands');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des stands :', error);
    }
  };

  useEffect(() => {
    // Exemple d'appel API pour récupérer les dates du festival
    const fetchFestivalData = async () => {
      const result = await fetch(`http://localhost:3500/festival/latest`);
      const body = await result.json();
      setDateDebut(body.date_debut);
      setDateD(body.date_debut);
      setDateFin(body.date_fin);
      setDateF(body.date_fin);
      console.log(dateDebut, dateFin);
    };
    fetchFestivalData();
  }, []);

  useEffect(() => {
    if (dateDebut && dateFin) {
      fetchStandByDate(dateDebut); // Appel pour les stands du samedi
      fetchStandByDate(dateFin); // Appel pour les stands du dimanche
    }
  }, [dateDebut, dateFin]);

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
        const response = await fetch(`http://localhost:3500/stands/participer/${idHoraire}/${idBenevole}`, {
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
          console.log('updatedStand', updatedStand);

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


  function formatDate(date) {

    if (!date) return '';
  
    // Crée un nouvel objet Date si date n'est pas déjà une instance de Date
    const dateObj = date instanceof Date ? date : new Date(date);
    
    // Formate la date en 'jj/mm/aaaa'
    return dateObj.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }
  
  return (
    <div>
      <BandeauLogo />
      <BoiteOnglet nomOnglet1={formatDate(dateD)} nomOnglet2={formatDate(dateF)}>
        <div className='nomOnglet1'>
        {standsByDate[dateDebut] && Object.entries(standsByDate[dateDebut]).map(([hour, stands], index) => (
          <div key={index}>
            <h2>{hour}</h2>
            <div className="columns">
              <div className="column">
                {stands.map((stand, i) => {
                    const filledPercentage = stand.liste_benevole
                    ? (stand.liste_benevole.length / stand.nb_benevole) * 100
                    : 0;
                    return (
                      <div key={i} onClick={() => handleJaugeClick(stand)}>
                        <Jauge borderColor='#454C8B' filledPercentage={filledPercentage}>
                          {stand.nom_stand}
                        </Jauge>
                      </div>
                    );
                    })}
              </div>
            </div>
          </div>
          ))}
        </div>
        <div className='nomOnglet2'>
        {standsByDate[dateFin] && Object.entries(standsByDate[dateFin]).map(([hour, stands], index) => (
            // Affichage des stands pour Dimanche
            <div key={index}>
              <h2>{hour}</h2>
              <div className="columns">
                <div className="column">
                  {stands.map((stand, i) => {
                    const filledPercentage = stand.liste_benevole
                    ? (stand.liste_benevole.length / stand.nb_benevole) * 100
                    : 0;
                    return (
                    <div key={i} onClick={() => handleJaugeClick(stand)}>
                      <Jauge borderColor='#454C8B' filledPercentage={filledPercentage}>
                        {stand.nom_stand}
                        </Jauge>
                    </div>
                    );
                    })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </BoiteOnglet>
      {showModal && selectedStand && ( // Affichage conditionnel de la fenêtre modale
        <Fiche_modal type="success" onClose={closeModal} onParticipateClick={handleParticiperClick}>
          <p>Nom du stand: {selectedStand.nom_stand}</p>
          <p>Description: {selectedStand.description}</p>
          <p>Heure: {selectedStand.heure}</p>
          <p>Nombre de bénévoles maximum: {selectedStand.nb_benevole}</p>
          <p>Liste de bénévoles inscrits:
            {selectedStand && selectedStand.liste_benevole && selectedStand.liste_benevole.length > 0 ? (
              selectedStand.liste_benevole.map((benevole, index) => (
                <span key={index}>{benevole.pseudo} </span>
              ))
            ) : (
              <span>0 bénévole inscrits</span>
            )}
          </p>
          <button onClick={() => handleParticiperClick()}>Participer</button>
        </Fiche_modal>
      )}
    </div>
  );
  
}

export default PageAccueil;
