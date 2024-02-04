import React, { useState } from 'react';

function Ajouter_jeux() {
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFile(file);
    };

    const handleUpload = async (e) => {
        e.preventDefault(); // Pour éviter le rechargement de la page
        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await fetch('https://festivaldujeuback.onrender.com/jeux/upload', {
                    method: 'POST',
                    body: formData, 
                });

                if (response.ok) {
                    const result = await response.json();
                    console.log('Fichier téléchargé avec succès', result);
                    
                    // Vous pouvez également déclencher une alerte ou une notification pour l'utilisateur ici
                } else {
                    console.error('Erreur lors du téléchargement du fichier');
                    // Gérer l'erreur, par exemple afficher une notification à l'utilisateur
                }
            } catch (error) {
                console.error('Erreur lors de l\'envoi du fichier', error);
                // Gérer l'erreur, par exemple afficher une notification à l'utilisateur
            }
        } else {
            console.error('Aucun fichier sélectionné');
            // Informer l'utilisateur qu'il doit sélectionner un fichier
        }
    };

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
