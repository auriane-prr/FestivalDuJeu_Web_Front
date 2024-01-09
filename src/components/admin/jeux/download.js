import "../../../styles/Admin/jeux/download.css";
import React, { useRef, useState } from 'react';

function Ajouter_jeux() {
    const [file, setFile] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFile(file);
        handleUpload(file);  // Upload immediately after file selection
    };

    const handleUpload = async (file) => {
        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await fetch('http://localhost:3500/jeux/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    const result = await response.json();
                    console.log('Fichier téléchargé avec succès', result);
                } else {
                    console.error('Erreur lors du téléchargement du fichier');
                }
            } catch (error) {
                console.error('Erreur lors de l\'envoi du fichier', error);
            }
        } else {
            console.error('Aucun fichier sélectionné');
        }
    };

    // When the custom button is clicked, trigger the hidden file input
    const triggerFileSelect = () => fileInputRef.current.click();

    return (
        <div>
            <input type="file" ref={fileInputRef} accept=".xlsx, .xls" onChange={handleFileChange} style={{display: 'none'}} />
            <div className="btn-download" onClick={triggerFileSelect}>
                <div className="btn-download-wrapper">
                    <div className="text">Download</div>
                    <span className="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="2em" height="2em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17"></path></svg>
                    </span>
                </div>
            </div>
        </div>
    );
}

export default Ajouter_jeux;
