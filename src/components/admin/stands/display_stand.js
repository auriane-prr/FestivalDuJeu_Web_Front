import React, { useState, useEffect } from 'react';
import Modal from './fenetre_ajouter_stand';

function Display_stand(){
  const [showModal, setShowModal] = useState(false);
  const [stands, setStands] = useState([]);
  const [currentStandIndex, setCurrentStandIndex] = useState(0);
  const [benevolePseudos, setBenevolePseudos] = useState({});

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

  useEffect(() => {
    if (stands.length > 0) {
      const currentStand = stands[currentStandIndex];
      const fetchBenevolePseudos = async () => {
        const pseudoMap = {};
        for (const horaire of currentStand.horaireCota) {
          for (const benevoleId of horaire.liste_benevole) {
            try {
              const response = await fetch(`http://localhost:3500/benevole/id/${benevoleId}`);
              if (response.ok) {
                const { pseudo } = await response.json();
                pseudoMap[benevoleId] = pseudo;
                console.log('Pseudo récupéré:', pseudo);
              } else {
                throw new Error('Erreur lors de la récupération du pseudo du bénévole');
              }
            } catch (error) {
              console.error('Erreur :', error);
              pseudoMap[benevoleId] = null;
            }
          }
        }
        setBenevolePseudos(pseudoMap);
      };

      fetchBenevolePseudos();
    }
  }, [stands, currentStandIndex]);

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
            <p>
              <b>Référent:</b> {currentStand.referents}
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
              <p>
                <b>Liste de bénévoles : </b>
                {horaire.liste_benevole.length > 0 ? (
                  // Afficher les pseudos récupérés
                  horaire.liste_benevole.map((benevoleId, index) => (
                    <span key={`benevole_${index}`}>{benevolePseudos[benevoleId]}</span>
                  ))
                ) : (
                  // Sinon, afficher un message indiquant que la liste est vide
                  <span>Aucun bénévole inscrit</span>
                )}
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
      {showModal && <div className="overlay showOverlay"><Modal onClose={closeModal} /></div>}
      <br />
      <button>Modifier</button>
    </>
  );
}

export default Display_stand;
