import React, { useState, useEffect } from 'react';
import Champ from '../champ';

function StandForm({ onClose }) {
  const [nom_stand, setNom_stand] = useState('');
  const [description, setDescription] = useState('');
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [selectedDate, setSelectedDate] = useState(''); // Initialisez avec une chaîne vide ou une valeur par défaut


  const [horairesData, setHorairesData] = useState([
    { heure: '9-11', nb_benevole: '' },
    { heure: '11-13', nb_benevole: '' },
    { heure: '13-15', nb_benevole: '' },
    { heure: '15-17', nb_benevole: '' },
    { heure: '17-19', nb_benevole: '' }
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Selected Date at Submit:", selectedDate);
    if (nom_stand && horairesData.some((item) => item.nb_benevole !== '')) {
      try {
        const newStand = {
          nom_stand,
          description,
          date: selectedDate,
          horaireCota: horairesData,
        };
        console.log(newStand);

        const response = await fetch('http://localhost:3500/stands', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newStand),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Nouveau stand ajouté:', data);
          onClose();
          window.location.reload();
        } else {
          console.error('Erreur lors de la création du stand');
        }
      } catch (error) {
        console.error('Erreur de connexion au serveur', error);
      }
    }
  };

  const handleNbBenevoleChange = (index, value) => {
    const updatedHorairesData = [...horairesData];
    updatedHorairesData[index].nb_benevole = value;
    setHorairesData(updatedHorairesData);
  };

  const handleCancel = () => {
    setNom_stand('');
    setDescription('');
    setHorairesData([
      { heure: '9-11', nb_benevole: '' },
      { heure: '11-13', nb_benevole: '' },
      { heure: '13-15', nb_benevole: '' },
      { heure: '15-17', nb_benevole: '' },
      { heure: '17-19', nb_benevole: '' },
    ]);
    onClose();
  };

  //cherche les dates 
  useEffect(() => {
    // Exemple d'appel API pour récupérer les données du festival
    const fetchData = async () => {
      const result = await fetch('http://localhost:3500/festival/latest');
      const body = await result.json();
      setDateDebut(body.date_debut);
      setDateFin(body.date_fin);
      console.log(body.date_debut, body.date_fin);
    };
    fetchData();
  }, []);
  

  return (
    <div>
      <form onSubmit={handleSubmit}>
      <button type="button" onClick={() => setSelectedDate(dateDebut)}>Pour Date de Début </button>
      <button type="button" onClick={() => setSelectedDate(dateFin)}> Pour Date de Fin</button>

      <Champ label='Nom Stand :'>
          <input
            className='customInput'
            type="text"
            value={nom_stand}
            onChange={(e) => setNom_stand(e.target.value)}
          />
        </Champ>

        <Champ label='Description:'>
          <input
            className='customInput'
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Champ>
        {horairesData.map((horaireData, index) => (
          <div key={index}>
            <Champ label={`Nombre de bénévoles requis pour ${horaireData.heure} :`}>
              <input
                className='customInput'
                type="number"
                value={horaireData.nb_benevole}
                onChange={(e) => handleNbBenevoleChange(index, e.target.value)}
              />
            </Champ>
          </div>
        ))}
        <button type="submit">Ajouter</button>
        <br />
        <button type="button" onClick={handleCancel}>Annuler</button>
      </form>
    </div>
  );
}

export default StandForm;
