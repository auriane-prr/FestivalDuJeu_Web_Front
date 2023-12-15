import React, { useState, useEffect } from 'react';
import Modal from './fiche_ajouter_stand';
import Champ from '../champ';
import '../../styles/Admin/display_stand.css';
import BoutonPageSuivante from '../BoutonPageSuivante';
import BoutonPagePrecedente from '../BoutonPagePrecedente';

function Display_stand(){
  
  const [showModal, setShowModal] = useState(false);
  const [stands, setStands] = useState([]);
  const [currentStandIndex, setCurrentStandIndex] = useState(0);
  const currentStand = stands[currentStandIndex] || {};
  const [benevolePseudos, setBenevolePseudos] = useState({});
  const [referentInput, setReferentInput] = useState([]);  
  const [referents, setReferents] = useState(currentStand.referents || []);
  const [editMode, setEditMode] = useState(false);

  

  const handleEditModeToggle = () => {
    setEditMode(!editMode);
  };

  async function fetchStandsData() {
    try {
      // Pas besoin de token ou pseudo ici, sauf si l'API exige une authentification
      const response = await fetch('http://localhost:3500/stands', {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
      });

      if (response.ok) {
        const standsData = await response.json();
        // Mettez à jour l'état avec les données récupérées
        setStands(standsData.map(stand => ({
          ...stand,
          nom_stand: stand.nom_stand || '',
          description: stand.description || '',
          referents: stand.referents || '',
          horaireCota: stand.horaireCota.map(horaire => ({
            ...horaire,
            heure: horaire.heure || '',
            nb_benevole: horaire.nb_benevole || '',
            liste_benevole: horaire.liste_benevole || []
          }))
        })));
      }
    } catch (error) {
      console.error("Une erreur s'est produite lors de la récupération des stands", error);
      // Gérer l'erreur, par exemple afficher un message d'erreur à l'utilisateur
    }
  }
  useEffect(() => {
  fetchStandsData();
  }, [editMode]);

  const handleNomStandChange = (e) => {
    const updatedStands = [...stands];
    updatedStands[currentStandIndex].nom_stand = e.target.value;
    setStands(updatedStands);
  };

  const handleDescriptionChange = (e) => {
    const updatedStands = [...stands];
    updatedStands[currentStandIndex].description = e.target.value;
    setStands(updatedStands);
  };

  const handleReferentInputChange = (e) => {
    setReferentInput(e.target.value);
  };
  

  const handleAddReferent = async () => {
    if (referentInput.trim()) {
      try {
        const response = await fetch(`http://localhost:3500/benevole/${referentInput.trim()}`);
        if (response.ok) {
          setReferents(oldReferents => [...oldReferents, referentInput.trim()]);
          setReferentInput(""); // Réinitialiser l'input après l'ajout
        } else {
          throw new Error('Référent non trouvé');
        }
      } catch (error) {
        console.error('Erreur lors de la vérification du référent', error);
        //FAIRE UN POPUP
      }
    }
  };
  

  const handleNbBenevoleChange = (index, value) => {
    const updatedStands = [...stands];
    updatedStands[currentStandIndex].horaireCota[index].nb_benevole = value;
    setStands(updatedStands);
  };

  const handleHeureChange = (index, value) => {
    const updatedStands = [...stands];
    updatedStands[currentStandIndex].horaireCota[index].heure = value;
    setStands(updatedStands);
  };

  const handleListBenevoleChange = (index, value) => {
    const updatedStands = [...stands];
    updatedStands[currentStandIndex].horaireCota[index].liste_benevole = value;
    setStands(updatedStands);
  };

  const handleSaveChanges = async () => {
    try {
      const updatedStand = stands[currentStandIndex];
      const response = await fetch(`http://localhost:3500/stands/${updatedStand._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedStand),
      });

      if (response.ok) {
        console.log('Stand modifié');
        fetchStandsData();
        setEditMode(false);
      } else {
        throw new Error('Erreur lors de la modification du stand');
      }
    } catch (error) {
      console.error('Erreur :', error);
    }
  };

  const handleCancel = () => {
    fetchStandsData();
    setEditMode(false);
  };




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
        <div className='form-display'>
          <Champ label = 'Nom du stand :'>
            <input type="text"
               value={currentStand.nom_stand}
               onChange={handleNomStandChange}
               className='input'
               readOnly={!editMode} />
            </Champ> 
            <Champ label = 'Description :'>
              <input type="text"
               value={currentStand.description}
                onChange={handleDescriptionChange}
               className='input'
               readOnly={!editMode} />
            </Champ>
            <Champ label='Référent :'>
              <input
                type="text"
                value={referentInput}
                onChange={handleReferentInputChange}
                onKeyPress={(e) => { if (e.key === 'Enter') handleAddReferent(); }}
                className='input'
                readOnly={!editMode}
              />
              <button onClick={handleAddReferent} readOnly={!editMode} disabled={!editMode}>Ajouter</button>
            </Champ>
              {currentStand.horaireCota.map((horaire, index) => (
          <div key={index} className="horaire-container">
            <Champ label='Horaire :'>
              <input type="text"
               value={horaire.heure} 
                onChange={(e) => handleHeureChange(index, e.target.value)}
               className='input input-small' 
               readOnly={!editMode} />
            </Champ>
            <Champ label='Capacité :'>
              <input type="text"
               value={horaire.nb_benevole}
                onChange={(e) => handleNbBenevoleChange(index, e.target.value)}
               className='input input-small' 
               readOnly={!editMode} />
            </Champ>
            <Champ label='Liste de bénévoles :'>
              <input 
                type="text"
                value={getPseudosFromIds(horaire.liste_benevole)}
                onChange={(e) => handleListBenevoleChange(index, e.target.value)}
                className='input input-list'
                readOnly={!editMode}
              />
            </Champ>
          </div>
        ))}
        <div className="button_container">
          {editMode ? (
            <>
            <button type="button" onClick={handleSaveChanges}>
              <span className="shadow"></span>
              <span className="edge"></span>
              <span className="front text"> Enregistrer </span>
            </button>
            
            <button type="button" onClick={handleCancel}>
              <span className="shadow"></span>
              <span className="edge"></span>
              <span className="front text"> Annuler </span>
            </button>
            </>
          ) : (
            <button type="button" onClick={handleEditModeToggle}>
              <span className="shadow"></span>
              <span className="edge"></span>
              <span className="front text"> Modifier </span>
            </button>
          )}
        </div>
      </div>
    );
  } else {
    return <p>Aucun stand trouvé.</p>;
  }
};

  return (
    <>
    <div className='Entete-btn'>
      <div className="btn-container-precedent" onClick={showPreviousStand}>
        <BoutonPagePrecedente />
        </div>
        <h2 className="stand-name">{stands.length > 0 ? stands[currentStandIndex].nom_stand : ''}</h2>
      <div className="btn-container-suivant" onClick={showNextStand}>
        <BoutonPageSuivante />
        </div>
      </div>
      {displayStandsInfo()}
      {!editMode && (
        <button type="button" onClick={openModal}>
          <span className="shadow"></span>
          <span className="edge"></span>
          <span className="front text"> Ajouter un stand </span>
        </button>
)}
      <br />
      {/* Fenêtre modale */}
      {showModal && (
        <Modal
          message="Contenu de la fenêtre modale"
          type="success"
          onClose={closeModal}
        />
      )}
    </>
  );
}

export default Display_stand;
