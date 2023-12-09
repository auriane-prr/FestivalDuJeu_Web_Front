import React, { useState, useEffect } from 'react';
import Modal from './modal';

function StandOnglet(){
    const [showModal, setShowModal] = useState(false);
    const [stands, setStands] = useState([]);
    const [currentStandIndex, setCurrentStandIndex] = useState(0);



useEffect(() => {
    const fetchStandsData = async () => {
      try {
        const response = await fetch('http://localhost:3500/stands');
        if (response.ok) {
          const data = await response.json();
          setStands(data);
          console.log('Stands récupérés:', data);
        } else {
          throw new Error('Erreur lors de la récupération des stands');
        }
      } catch (error) {
        console.error('Erreur :', error);
      }
    };

    fetchStandsData();
  }, []);

  useEffect(() => {
    if (stands.length > 0) {
      setCurrentStandIndex(0);
    }
  }, [stands]);

  const showPreviousStand = () => {
    setCurrentStandIndex((prevIndex) => {
      if (prevIndex === 0) {
        return stands.length - 1;
      } else {
        return prevIndex - 1;
      }
    });
  };

  const showNextStand = () => {
    setCurrentStandIndex((prevIndex) => {
      if (prevIndex === stands.length - 1) {
        return 0;
      } else {
        return prevIndex + 1;
      }
    });
  };

  

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const transformStandsData = (data) => {
    const transformedData = {};

    data.forEach((stand) => {
      const { horaire, nb_benevole } = stand;

      if (!transformedData[horaire]) {
        transformedData[horaire] = nb_benevole;
      }
    });

    return transformedData;
  };

  const restructuredStandsData = transformStandsData(stands);


  const displayStandsInfo = () => {
    if (stands && stands.length > 0) {
        const currentStand = stands[currentStandIndex];
  
        return (
            <div>
              <div>
                <p>
                  <b>Nom du stand:</b> {currentStand.nom_stand}
                </p>
                <p>
                  <b>Description:</b> {currentStand.description}
                </p>
              </div>
              {currentStand.horaireCota.map((horaire, index) => (
                <div key={index}>
                  <p>
                    <b>Plage horaire :</b> {horaire.heure}
                  </p>
                  <p>
                    <b>Capacité :</b> {horaire.nb_benevole} personnes
                  </p>
                </div>
              ))}
            </div>
          );
        } else {
          return <p>Aucun stand trouvé.</p>;
        }
      };

    return (
        <>
        <b>Stands</b>
          {displayStandsInfo()}

            <button onClick={openModal}>Ajouter un stand</button>
            <br />
            <button onClick={showPreviousStand}>Stand Précédent</button>
            <br />
            <button onClick={showNextStand}>Stand Suivant</button>
          {/* Fenêtre modale */}
          {showModal && (
            <Modal
              message="Contenu de la fenêtre modale"
              type="success"
              onClose={closeModal}
            />
          )}
          </>
    )
}

export default StandOnglet;