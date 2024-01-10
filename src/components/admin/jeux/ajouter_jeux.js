import React, { useState, useEffect } from 'react';

function Ajouter_jeux() {
    const [file, setFile] = useState(null);
    const [dateDebut, setDateDebut] = useState("");
    const [dateFin, setDateFin] = useState("");
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [isPopupVisible, setPopupVisible] = useState(false);

    const [horairesData, setHorairesData] = useState([
        { heure: "9-11", nb_benevole: "" },
        { heure: "11-14", nb_benevole: "" },
        { heure: "14-17", nb_benevole: "" },
        { heure: "17-20", nb_benevole: "" },
        { heure: "20-22", nb_benevole: "" },
    ]);


    useEffect(() => {
    // Exemple d'appel API pour récupérer les données du festival
    const fetchFestivalDates = async () => {
      const result = await fetch(`http://localhost:3500/festival/latest`);
      const body = await result.json();
      setDateDebut(body.date_debut);
      setDateFin(body.date_fin);
      console.log(body.date_debut, body.date_fin);
    };
    fetchFestivalDates();
  }, []);
    

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFile(file);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            console.error('Aucun fichier sélectionné');
            return;
        }
        const formData = new FormData();
        formData.append('file', file);
    
        try {
            await uploadZones(file, dateDebut, dateFin);
            console.log('Zones jour début ajoutées avec succès');
            console.log('Zones jour fin ajoutées avec succès');
            await uploadHoraireToZone(horairesData);
            console.log('Horaires ajoutés avec succès');
            await uploadJeux(file);
            console.log('Jeux ajoutés avec succès');
            await uploadZonesJeux(file);
            console.log('Jeux ajoutés aux zones avec succès');

            console.log('Processus terminé avec succès');
        } catch (error) {
            console.error('Erreur lors de l\'envoi du fichier', error);
        }
    };

    async function uploadJeux(file) {
        try {
            const formData = new FormData();
            formData.append('file', file);
        // Ensuite, envoyez le fichier Excel au serveur pour créer les jeux
        const responseJeu = await fetch(`http://localhost:3500/jeux/upload`, {
            method: 'POST',
            body: formData,
        });
        if (responseJeu.ok) {
        const resultJeu = await responseJeu.json();
        console.log('Ajout des jeux avec succès', resultJeu);
        } else {
        console.error('Erreur lors de l\'ajout des jeux');
        }
        } catch (error) {
            console.error('Erreur lors de l\'ajout des jeux', error);
        }
    
    }

    async function uploadHoraireToZone(horairesData) {
        try {
            const horaire = {
                horaireCota : horairesData
            }
            const response = await fetch('http://localhost:3500/zone/addHoraires', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(horaire),
        });

        if (response.ok) {
            setSuccessMessage('Horaires mis à jour pour toutes les zones');
        } else {
            throw new Error('Erreur lors de la mise à jour des horaires');
        }
    } catch (error) {
        console.error(error);
        setErrorMessage('Erreur lors de la mise à jour des horaires');
    }
}

    async function uploadZonesJeux(file) {
        
        const formData = new FormData();
        formData.append('file', file);
        try {
            const responseAddJeu = await fetch(`http://localhost:3500/zone/addJeux`, {
                method: 'POST',
                body: formData,
            });
    
            if (!responseAddJeu.ok) {
                console.error('Erreur lors de l\'ajout des jeux aux zones');
            }
        } catch (error) {
            console.error('Erreur lors de l\'ajout des jeux aux zones', error);
        }
    }

    async function uploadZones(file, dateDebut, dateFin) {
        try {
        const formDataZone1 = new FormData();
        formDataZone1.append('file', file);
        formDataZone1.append('date', dateDebut);

      
            // Envoie les deux instances au serveur
            const response1 = await fetch(`http://localhost:3500/zone/jour1`, {
                method: "POST",
                body: formDataZone1,
            });
            
        const formDataZone2 = new FormData();
        formDataZone2.append('file', file);
        formDataZone2.append('date', dateFin);
      
            const response2 = await fetch(`http://localhost:3500/zone/jour2`, {
                method: "POST",
                body: formDataZone2,
            });
      
            if (response1.ok) {
                console.log('Ajout des zones pour dateDebut avec succès');
                setSuccessMessage("Nouveaux stands ajoutés avec succès");
                setErrorMessage(null);
                setPopupVisible(true);
            } else {
                setErrorMessage("Une erreur est survenue, les stands n'ont pas pu être créés");
                setSuccessMessage(null);
                setPopupVisible(true);
            } 
            if (response2.ok) {
                console.log('Ajout des zones pour dateFin avec succès');
                setSuccessMessage("Nouveaux stands ajoutés avec succès");
                setErrorMessage(null);
                setPopupVisible(true);
            } else {
                setErrorMessage("Une erreur est survenue, les stands n'ont pas pu être créés");
                setSuccessMessage(null);
                setPopupVisible(true);
            } 
        } catch (error) {
            console.error('Erreur lors de l\'ajout des zones', error);
        }

    }



    return (
        <div>
            <form onSubmit={handleUpload}>
                <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
                <button type="submit">Télécharger</button>
            </form>
        </div>
    );
}

export default Ajouter_jeux;
