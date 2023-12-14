import React, { useState, useEffect } from 'react';
import Modal from './fiche_ajouter_stand';
import Champ from '../champ';
import '../../styles/Admin/display_stand.css';

function Display_stand(){
  const [showModal, setShowModal] = useState(false);
  const [stands, setStands] = useState([]);
  const [currentStandIndex, setCurrentStandIndex] = useState(0);
  const [benevolePseudos, setBenevolePseudos] = useState({});
  const [editMode, setEditMode] = useState(false);

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

  const getPseudosFromIds = (benevoleIds) => {
    return benevoleIds.map(id => benevolePseudos[id]).join(', ');
  };

  const displayStandsInfo = () => {
    if (stands && stands.length > 0) {
      const currentStand = stands[currentStandIndex];

      return (
        <div>
          <div>
            <Champ label = 'Nom du stand :'>
              <input type="text"
               value={currentStand.nom_stand}
               className='input'
               readOnly={!editMode} />
              </Champ> 
            <Champ label = 'Description :'>
              <input type="text"
               value={currentStand.description}
               className='input'
               readOnly={!editMode} />
              </Champ>
            <Champ label = 'Référent :'>
              <input type="text"
               value={currentStand.referents}
               className='input'
               readOnly={!editMode} />
              </Champ>
              {currentStand.horaireCota.map((horaire, index) => (
          <div key={index} className="horaire-container">
            <Champ label='Horaire :'>
              <input type="text" value={horaire.heure} className='input input-small' readOnly={!editMode} />
            </Champ>
            <Champ label='Capacité :'>
              <input type="text" value={horaire.nb_benevole} className='input input-small' readOnly={!editMode} />
            </Champ>
            <Champ label='Liste de bénévoles :'>
              <input 
                type="text"
                value={editMode ? horaire.liste_benevole.join(', ') : getPseudosFromIds(horaire.liste_benevole)}
                className='input'
                readOnly={!editMode}
              />
            </Champ>
          </div>
        ))}
      </div>
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
      <br />
      <button>Modifier</button>
    </>
  );
}

export default Display_stand;
