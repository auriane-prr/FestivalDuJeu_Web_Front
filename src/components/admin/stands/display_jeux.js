import React, { useState, useEffect } from 'react';
import Champ from '../../general/champ';
import BoutonPagePrecedente from '../../BoutonPagePrecedente';
import BoutonPageSuivante from '../../BoutonPageSuivante';


function Display_jeux() {
    const [selectedZone, setSelectedZone] = useState('');
    const [jeux, setJeux] = useState([]);
    const [currentJeuIndex, setCurrentJeuIndex] = useState(0);
    const currentJeu = jeux[currentJeuIndex] || {};
    
     // Récupération des jeux pour la zone sélectionnée
    useEffect(() => {
        async function fetchJeuxData() {
            if (selectedZone) {
                try {
                    const response = await fetch(`http://localhost:3500/jeux/jeuxParZone/${selectedZone}`);
                    const data = await response.json();
                    setJeux(data);
                } catch (error) {
                    console.error('Erreur lors de la récupération des jeux', error);
                }
            }
        }
        fetchJeuxData();
    }, [selectedZone]);

    const showPreviousJeu = () => {
        setCurrentJeuIndex((prevIndex) => prevIndex === 0 ? jeux.length - 1 : prevIndex - 1);
    };

            
    const showNextJeu = () => {
        setCurrentJeuIndex((prevIndex) => prevIndex === jeux.length - 1 ? 0 : prevIndex + 1);
    };
    const ZoneList = ({ onSelectZone }) => {
        const [zones, setZones] = useState([]);
    
        useEffect(() => {
          fetch('http://localhost:3500/jeux/zones')
            .then(response => response.json())
            .then(data => setZones(data))
            .catch(error => console.error('Erreur lors de la récupération des zones', error));
        }, []);
    
        return (
          <select onChange={(e) => onSelectZone(e.target.value)} defaultValue="">
            <option value="" disabled>Sélectionnez une zone</option>
            {zones.map((zone, index) => (
              <option key={index} value={zone}>{zone}</option>
            ))}
          </select>
        );
      };
    


  // Composant ou fonction pour afficher les jeux
  const displayJeuxInfo = () => {
    if (!currentJeu|| jeux.length === 0) {
        return <p>Aucun jeu trouvé pour cette zone.</p>;
      }
    return (
      <div>
        <Champ label="Nom du jeu">
        <input type="text"
        value={currentJeu.nom_jeu}
        className='input'
        readOnly />
        </Champ>
        <Champ label="Editeur">
        <input type="text"
        value={currentJeu.editeur}
        className='input'
        readOnly />
        </Champ>
        <Champ label="Âge minimum">
        <input type="text"
        value={currentJeu.ageMin}
        className='input'
        readOnly />
        </Champ>
        <Champ label="Durée">
        <input type="text"
        value={currentJeu.duree}
        className='input' 
        readOnly/>
        </Champ>
        <Champ label="Thème">
        <input type="text"
        value={currentJeu.theme}
        className='input' 
        readOnly/>
        </Champ>
        <Champ label="Mécanisme">
        <input type="text"
        value={currentJeu.mecanisme}
        className='input' 
        readOnly/>
        </Champ>
        <Champ label="Tags">
        <input type="text"
        value={currentJeu.tags}
        className='input'
        readOnly />
        </Champ>
        <Champ label="Description">
        <input type="text"
        value={currentJeu.description}
        className='input'
        readOnly />
        </Champ>
        <Champ label="Nombre de joueurs">
        <input type="text"
        value={currentJeu.nbJoueurs}
        className='input'
        readOnly />
        </Champ>
        <Champ label="Animation requise">
        <input type="text"
        value={currentJeu.animationRequise}
        className='input'
        readOnly />
        </Champ>
        <Champ label="Lien">
        <input type="text"
        value={currentJeu.lien}
        className='input'
        readOnly />
        </Champ>
        <Champ label="Logo">
        <input type="text"
        value={currentJeu.logo}
        className='input'
        readOnly />
        </Champ>
      </div>
    );
  };

  return (
    <div>
      <ZoneList onSelectZone={setSelectedZone} />
      <BoutonPagePrecedente onClick={showPreviousJeu} />
      <BoutonPageSuivante onClick={showNextJeu} />
      <div>{displayJeuxInfo()}</div>
    </div>
  );
}



export default Display_jeux;
