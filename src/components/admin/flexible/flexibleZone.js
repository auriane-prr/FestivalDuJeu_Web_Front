import React, { useState, useEffect } from 'react';
import '../../../styles/Admin/flexible/flexible.css';
import Bouton from '../../general/bouton';
import Titre from '../../general/titre';

function FlexibleZone({ date }) {
    const [flexibleZones, setFlexibleZones] = useState([]);
    const [selectedFlexibleZoneId, setSelectedFlexibleZoneId] = useState(null);
    const [selectedFlexibleZone, setSelectedFlexibleZone] = useState(null);
    const [selectedStands, setSelectedStands] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

  // Récupérez la liste des bénévoles flexibleZones au chargement du composant
  useEffect(() => {
    fetch("http://localhost:3500/flexibleZone")
      .then(response => response.json())
      .then(data => setFlexibleZones(data))
      .catch(error => console.error("Erreur lors de la récupération des bénévoles flexibleZones: ", error));
  }, []);

  // Gestionnaire de clic pour afficher les informations du bénévole flexibleZone sélectionné
  const handleFlexibleZoneClick = (flexibleZoneId) => {
    console.log("je suis dans handleFlexibleZoneClick : ", flexibleZoneId)
    
    if (selectedFlexibleZoneId === flexibleZoneId) {
        setSelectedFlexibleZoneId(null);
        setSelectedFlexibleZone(null);
        return;
      } 
    setSelectedStands({}); 
    console.log(`Bénévole flexibleZone sélectionné: ${flexibleZoneId}`);

    // Récupérez les informations du bénévole flexibleZone en fonction de son ID
    fetch(`http://localhost:3500/flexibleZone/benevole/${flexibleZoneId}`)
      .then(response => response.json())
      .then(data => {
        setSelectedFlexibleZone(data);
        console.log("information du bénévole flexibleZone: ", data); 
        console.log("pseudo", data.benevole_id[0].pseudo )
      })
      .catch(error => console.error("Erreur lors de la récupération des informations du bénévole flexibleZone: ", error));
      setSelectedFlexibleZoneId(flexibleZoneId);
    
  };

  const fetchStandDetails = async (zoneBenevoleId, horaire) => {
    try {
      const response = await fetch(`http://localhost:3500/zoneBenevole/${zoneBenevoleId}`);
      const zoneBenevoleData = await response.json();
      if (!response.ok) throw new Error(zoneBenevoleData.message || "Erreur lors de la récupération des détails du zoneBenevole");
  
      // Trouver les informations de quota pour l'horaire spécifique
      const horaireCota = zoneBenevoleData.horaireCota.find(h => h.heure === horaire);
      if (!horaireCota) throw new Error("Horaire spécifique non trouvé dans le zoneBenevole");
  
      // Calculer le nombre de places restantes
      const placesRestantes = horaireCota.nb_benevole - horaireCota.liste_benevole.length;
      
      setSelectedStands(prevStands => ({
        ...prevStands,
        [horaire]: {
          ...prevStands[horaire],
          zoneBenevoleId,
          nb_benevole: horaireCota.nb_benevole,
          nom_zoneBenevole: zoneBenevoleData.zone_benevole,
          placesRestantes // Ajouter le nombre de places restantes à l'objet
        }
      }));
    } catch (error) {
      console.error("Erreur lors de la récupération des détails du zoneBenevole: ", error.message);
    }
  };
  
  const horaires = ["9-11", "11-14", "14-17", "17-20", "20-22"];

  const handleStandClick = (horaire, zoneBenevoleId) => {
    setSelectedStands(prevStands => {
      const isStandSelected = prevStands[horaire]?.zoneBenevoleId === zoneBenevoleId;
      if (isStandSelected) {
        console.log('Désélection du zoneBenevole:', zoneBenevoleId, 'à l\'horaire:', horaire);
        const { [horaire]: _, ...rest } = prevStands;
        return rest;
      } else {
        return {
          ...prevStands,
          [horaire]: {
            zoneBenevoleId,
            // Vous pouvez inclure d'autres détails ici si nécessaire
          }
        };
      }
    });
    fetchStandDetails(zoneBenevoleId, horaire);
  };
  
  const handleCancel = () => {
    setSelectedStands({});
  };

  const handleSubmit = async () => {
    if (Object.keys(selectedStands).length === 0) {
      console.log("Aucun zoneBenevole sélectionné.");
      return;
    }
  
    // Créez un tableau des zoneBenevoles sélectionnés
    const selectedStandArray = Object.entries(selectedStands).map(([horaire, zoneBenevoleInfo]) => ({
      horaire,
      zoneBenevoleId: zoneBenevoleInfo.zoneBenevoleId,
      idBenevole: selectedFlexibleZoneId,
    }));
  
    try {
      for (const zoneBenevoleInfo of selectedStandArray) {
        console.log("zoneBenevoleId :", zoneBenevoleInfo.zoneBenevoleId, "horaire: ", zoneBenevoleInfo.horaire, "benevoleId: ", zoneBenevoleInfo.idBenevole)
        const response = await fetch(`http://localhost:3500/zoneBenevole/inscrire/${zoneBenevoleInfo.zoneBenevoleId}/${zoneBenevoleInfo.horaire}/${zoneBenevoleInfo.idBenevole}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
  
        if (!response.ok) {
          throw new Error("Erreur lors de l'inscription à un zoneBenevole.");
        }
      }
      console.log("Inscription réussie.");
      setIsSubmitting(true);
        console.log("Tous les horaires ont été attribués, suppression du flexibleZone...");
        const reponse = await fetch(`http://localhost:3500/flexibleZone/${selectedFlexibleZone._id}/${date}`, {
          method: 'DELETE',
        });
        if (!reponse.ok) {
          throw new Error("Erreur lors de la suppression du flexibleZone.");
        } else {
          console.log("FlexibleZone supprimé avec succès.");
          setFlexibleZones(flexibleZones.filter(flexibleZone => flexibleZone.benevole_id[0]._id !== selectedFlexibleZoneId));
          setSelectedFlexibleZoneId(null);
          setSelectedFlexibleZone(null);
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

  return (
    <div>
      <Titre valeurDuTitre={`Liste des bénévoles flexibleZones`} />
        {flexibleZones.map((flexibleZone,index) => (
            <React.Fragment key={flexibleZone._id}>
                <div 
                onClick={() => handleFlexibleZoneClick(flexibleZone.benevole_id[0]?._id)}
                className={`flexible-item 
                    ${selectedFlexibleZoneId === flexibleZone.benevole_id[0]?._id ? "selected" : ""
                }`}
                >
                    <Titre valeurDuTitre={flexibleZone.benevole_id[0]?.pseudo} />
                </div>
                {flexibleZones.length !== index && (
                    <hr className="flexible-separator" />
                )}
            </React.Fragment>
        ))}

      {selectedFlexibleZone && (
        <div>
          <Titre valeurDuTitre={`Choisissez les zoneBenevoles que vous voulez attribuer à ${selectedFlexibleZone.benevole_id[0].pseudo}`}/>
          {horaires.map((horaire, index) => (
            <div key={index} className="flexible-row">
              <div className="flexible-time">
                {horaire}
              </div>
              <div className="flexible-stand">
                {selectedFlexibleZone.horaire && selectedFlexibleZone.horaire.length > 0 ? (
                  selectedFlexibleZone.horaire
                    .filter((horaireData) => horaireData.date === date && horaireData.heure === horaire)
                    .map((horaireData) => (
                      <div key={horaireData._id}>
                        {horaireData.liste_zoneBenevole && horaireData.liste_zoneBenevole.length > 0 ? (
                          horaireData.liste_zoneBenevole.map((zoneBenevole) => (
                            <button
                                className={`button-stand ${selectedStands[horaire]?.zoneBenevoleId === zoneBenevole._id ? 'selected-zoneBenevole' : ''}`}
                                key={zoneBenevole._id}
                                onClick={() => handleStandClick(horaire, zoneBenevole._id)}
                                >
                                {zoneBenevole.nom_zone_benevole}
                            </button>


                          ))
                        ) : (
                          <div>Aucun zoneBenevole disponible</div>
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
            <h3>Informations des zoneBenevoles sélectionnés</h3>
            <ul>
            {Object.entries(selectedStands).map(([horaire, zoneBenevoleInfo]) => (
                <li key={horaire}>
                Horaire: {horaire}, Stand: {zoneBenevoleInfo.nom_zone_benevole}, Capacité: {zoneBenevoleInfo.nb_benevole}, Places restantes: {zoneBenevoleInfo.placesRestantes}
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

export default FlexibleZone;
