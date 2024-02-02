import React, { useState, useEffect } from 'react';
import '../../../styles/Admin/flexible/flexible.css';
import Bouton from '../../general/bouton';
import Titre from '../../general/titre';

function Flexible({ date }) {
    const [flexibles, setFlexibles] = useState([]);
    const [selectedFlexibleId, setSelectedFlexibleId] = useState(null);
    const [selectedFlexible, setSelectedFlexible] = useState(null);
    const [selectedStands, setSelectedStands] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

  // Récupérez la liste des bénévoles flexibles au chargement du composant
  useEffect(() => {
    fetch("http://localhost:3500/flexible")
      .then(response => response.json())
      .then(data => setFlexibles(data))
      .catch(error => console.error("Erreur lors de la récupération des bénévoles flexibles: ", error));
  }, []);

  // Gestionnaire de clic pour afficher les informations du bénévole flexible sélectionné
  const handleFlexibleClick = (flexibleId) => {
    console.log("je suis dans handleFlexibleClick : ", flexibleId)
    
    if (selectedFlexibleId === flexibleId) {
        setSelectedFlexibleId(null);
        setSelectedFlexible(null);
        return;
      } 
    setSelectedStands({}); 
    console.log(`Bénévole flexible sélectionné: ${flexibleId}`);

    // Récupérez les informations du bénévole flexible en fonction de son ID
    fetch(`http://localhost:3500/flexible/benevole/${flexibleId}`)
      .then(response => response.json())
      .then(data => {
        setSelectedFlexible(data);
        console.log("information du bénévole flexible: ", data); 
        console.log("pseudo", data.benevole_id[0].pseudo )
      })
      .catch(error => console.error("Erreur lors de la récupération des informations du bénévole flexible: ", error));
      setSelectedFlexibleId(flexibleId);
    
  };

  const fetchStandDetails = async (standId, horaire) => {
    try {
      const response = await fetch(`http://localhost:3500/stands/${standId}`);
      const standData = await response.json();
      if (!response.ok) throw new Error(standData.message || "Erreur lors de la récupération des détails du stand");
  
      // Trouver les informations de quota pour l'horaire spécifique
      const horaireCota = standData.horaireCota.find(h => h.heure === horaire);
      if (!horaireCota) throw new Error("Horaire spécifique non trouvé dans le stand");
  
      // Calculer le nombre de places restantes
      const placesRestantes = horaireCota.nb_benevole - horaireCota.liste_benevole.length;
      
      setSelectedStands(prevStands => ({
        ...prevStands,
        [horaire]: {
          ...prevStands[horaire],
          standId,
          nb_benevole: horaireCota.nb_benevole,
          nom_stand: standData.nom_stand,
          placesRestantes // Ajouter le nombre de places restantes à l'objet
        }
      }));
    } catch (error) {
      console.error("Erreur lors de la récupération des détails du stand: ", error.message);
    }
  };
  
  const horaires = ["9-11", "11-14", "14-17", "17-20", "20-22"];

  const handleStandClick = (horaire, standId) => {
    setSelectedStands(prevStands => {
      const isStandSelected = prevStands[horaire]?.standId === standId;
      if (isStandSelected) {
        console.log('Désélection du stand:', standId, 'à l\'horaire:', horaire);
        const { [horaire]: _, ...rest } = prevStands;
        return rest;
      } else {
        return {
          ...prevStands,
          [horaire]: {
            standId,
            // Vous pouvez inclure d'autres détails ici si nécessaire
          }
        };
      }
    });
    fetchStandDetails(standId, horaire);
  };
  
  const handleCancel = () => {
    setSelectedStands({});
  };

  const handleSubmit = async () => {
    if (Object.keys(selectedStands).length === 0) {
      console.log("Aucun stand sélectionné.");
      return;
    }
  
    // Créez un tableau des stands sélectionnés
    const selectedStandArray = Object.entries(selectedStands).map(([horaire, standInfo]) => ({
      horaire,
      standId: standInfo.standId,
      idBenevole: selectedFlexibleId,
    }));
  
    try {
      for (const standInfo of selectedStandArray) {
        console.log("standId :", standInfo.standId, "horaire: ", standInfo.horaire, "benevoleId: ", standInfo.idBenevole)
        const response = await fetch(`http://localhost:3500/stands/inscrire/${standInfo.standId}/${standInfo.horaire}/${standInfo.idBenevole}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
  
        if (!response.ok) {
          throw new Error("Erreur lors de l'inscription à un stand.");
        }
      }
      console.log("Inscription réussie.");
      setIsSubmitting(true);
        console.log("Tous les horaires ont été attribués, suppression du flexible...");
        const reponse = await fetch(`http://localhost:3500/flexible/${selectedFlexible._id}/${date}`, {
          method: 'DELETE',
        });
        if (!reponse.ok) {
          throw new Error("Erreur lors de la suppression du flexible.");
        } else {
          console.log("Flexible supprimé avec succès.");
          setFlexibles(flexibles.filter(flexible => flexible.benevole_id[0]._id !== selectedFlexibleId));
          setSelectedFlexibleId(null);
          setSelectedFlexible(null);
          await checkAndDeleteFlexible();
          setIsSubmitting(false); // Réinitialiser isSubmitting
          handleCancel(); // Réinitialiser le formulaire
          window.location.reload(); // Rafraîchir la page
        }
    } catch (error) {
      console.error(error.message);
    }
  };
  
  useEffect(() => {
    console.log('selectedStands updated:', selectedStands);
  }, [selectedStands]);

  const checkAndDeleteFlexible = async () => {
    try {
        const response = await fetch('http://localhost:3500/flexible/check', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) throw new Error('Erreur lors de la vérification des flexibles.');
        const result = await response.json();
        console.log('Flexibles nettoyés:', result.deletedFlexibles);
    } catch (error) {
        console.error('Erreur lors du nettoyage des flexibles:', error);
    }
};

  return (
    <div>
      <Titre valeurDuTitre={`Liste des bénévoles flexibles`} />
        {flexibles.map((flexible,index) => (
            <React.Fragment key={flexible._id}>
                <div 
                onClick={() => handleFlexibleClick(flexible.benevole_id[0]?._id)}
                className={`flexible-item 
                    ${selectedFlexibleId === flexible.benevole_id[0]?._id ? "selected" : ""
                }`}
                >
                    <Titre valeurDuTitre={flexible.benevole_id[0]?.pseudo} />
                </div>
                {flexibles.length !== index && (
                    <hr className="flexible-separator" />
                )}
            </React.Fragment>
        ))}

      {selectedFlexible && (
        <div>
          <Titre valeurDuTitre={`Choisissez les stands que vous voulez attribuer à ${selectedFlexible.benevole_id[0].pseudo}`}/>
          {horaires.map((horaire, index) => (
            <div key={index} className="flexible-row">
              <div className="flexible-time">
                {horaire}
              </div>
              <div className="flexible-stand">
                {selectedFlexible.horaire && selectedFlexible.horaire.length > 0 ? (
                  selectedFlexible.horaire
                    .filter((horaireData) => horaireData.date === date && horaireData.heure === horaire)
                    .map((horaireData) => (
                      <div key={horaireData._id}>
                        {horaireData.liste_stand && horaireData.liste_stand.length > 0 ? (
                          horaireData.liste_stand.map((stand) => (
                            <button
                                className={`button-stand ${selectedStands[horaire]?.standId === stand._id ? 'selected-stand' : ''}`}
                                key={stand._id}
                                onClick={() => handleStandClick(horaire, stand._id)}
                                >
                                {stand.nom_stand}
                            </button>


                          ))
                        ) : (
                          <div>Aucun stand disponible</div>
                        )}
                      </div>
                    ))
                ) : (
                  <div>Aucun horaire disponible</div>
                )}
              </div>
            </div>
          ))}
        {Object.keys(selectedStands).length > 0 && (
        <div>
            <h3>Informations des stands sélectionnés</h3>
            <ul>
            {Object.entries(selectedStands).map(([horaire, standInfo]) => (
                <li key={horaire}>
                Horaire: {horaire}, Stand: {standInfo.nom_stand}, Capacité: {standInfo.nb_benevole}, Places restantes: {standInfo.placesRestantes}
                </li>
            ))}
            </ul>
        </div>
        )}


    {!isSubmitting && (
        <div className='boutons'>
            <Bouton onClick={handleSubmit} className='bouton-soumettre' >Soumettre</Bouton>
            <Bouton onClick={handleCancel}>Annuler</Bouton>
        </div>
    )}
    {isSubmitting && (
        <p>En cours de soumission...</p>
    )}
        </div>
      )}

    
    </div>
  );
}

export default Flexible;
