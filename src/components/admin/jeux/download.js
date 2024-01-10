import React, { useState, useEffect, useRef } from "react";
import "../../../styles/Admin/jeux/download.css";

function Download() {
  const [file, setFile] = useState(null);
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isPopupVisible, setPopupVisible] = useState(false);

  const inputFileRef = useRef(null);

  const handleButtonClick = () => {
    inputFileRef.current.click();
  };

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

  const handleFileChangeAndUpload = async (e) => {
    const file = e.target.files[0];
    setFile(file);

    if (file) {
      // Ici, vous pouvez directement appeler handleUpload ou une nouvelle fonction qui gère l'upload
      await handleUpload(file); // Assurez-vous que handleUpload peut gérer cet appel
    } else {
      console.error("Aucun fichier sélectionné");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
  };

  const handleUpload = async (file) => {
    //e.preventDefault();
    if (!file) {
      console.error("Aucun fichier sélectionné");
      setErrorMessage("Aucun fichier sélectionné");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);

    try {
      await uploadZones(file, dateDebut, dateFin);
      console.log("Zones jour début ajoutées avec succès");
      console.log("Zones jour fin ajoutées avec succès");
      await uploadHoraireToZone(horairesData);
      console.log("Horaires ajoutés avec succès");
      await uploadJeux(file);
      console.log("Jeux ajoutés avec succès");
      await uploadZonesJeux(file);
      console.log("Jeux ajoutés aux zones avec succès");

      console.log("Processus terminé avec succès");
    } catch (error) {
      console.error("Erreur lors de l'envoi du fichier", error);
    }
  };

  async function uploadJeux(file) {
    try {
      const formData = new FormData();
      formData.append("file", file);
      // Ensuite, envoyez le fichier Excel au serveur pour créer les jeux
      const responseJeu = await fetch(`http://localhost:3500/jeux/upload`, {
        method: "POST",
        body: formData,
      });
      if (responseJeu.ok) {
        const resultJeu = await responseJeu.json();
        console.log("Ajout des jeux avec succès", resultJeu);
      } else {
        console.error("Erreur lors de l'ajout des jeux");
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout des jeux", error);
    }
  }

  async function uploadHoraireToZone(horairesData) {
    try {
      const horaire = {
        horaireCota: horairesData,
      };
      const response = await fetch("http://localhost:3500/zone/addHoraires", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(horaire),
      });

      if (response.ok) {
        setSuccessMessage("Horaires mis à jour pour toutes les zones");
      } else {
        throw new Error("Erreur lors de la mise à jour des horaires");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Erreur lors de la mise à jour des horaires");
    }
  }

  async function uploadZonesJeux(file) {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const responseAddJeu = await fetch(`http://localhost:3500/zone/addJeux`, {
        method: "POST",
        body: formData,
      });

      if (!responseAddJeu.ok) {
        console.error("Erreur lors de l'ajout des jeux aux zones");
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout des jeux aux zones", error);
    }
  }

  async function uploadZones(file, dateDebut, dateFin) {
    try {
      const formDataZone1 = new FormData();
      formDataZone1.append("file", file);
      formDataZone1.append("date", dateDebut);

      // Envoie les deux instances au serveur
      const response1 = await fetch(`http://localhost:3500/zone/jour1`, {
        method: "POST",
        body: formDataZone1,
      });

      const formDataZone2 = new FormData();
      formDataZone2.append("file", file);
      formDataZone2.append("date", dateFin);

      const response2 = await fetch(`http://localhost:3500/zone/jour2`, {
        method: "POST",
        body: formDataZone2,
      });

      if (response1.ok) {
        console.log("Ajout des zones pour dateDebut avec succès");
        setSuccessMessage("Nouveaux stands ajoutés avec succès");
        setErrorMessage(null);
        setPopupVisible(true);
      } else {
        setErrorMessage(
          "Une erreur est survenue, les stands n'ont pas pu être créés"
        );
        setSuccessMessage(null);
        setPopupVisible(true);
      }
      if (response2.ok) {
        console.log("Ajout des zones pour dateFin avec succès");
        setSuccessMessage("Nouveaux stands ajoutés avec succès");
        setErrorMessage(null);
        setPopupVisible(true);
      } else {
        setErrorMessage(
          "Une erreur est survenue, les stands n'ont pas pu être créés"
        );
        setSuccessMessage(null);
        setPopupVisible(true);
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout des zones", error);
    }
  }

  return (
    <div>
      <form>
        <input
          ref={inputFileRef}
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileChangeAndUpload}
          style={{ display: "none" }} // Vous pouvez aussi mettre le style directement ici
        />
        <div className="btn-download" onClick={handleButtonClick}>
          <div className="btn-download-wrapper">
            <div className="text">Importer</div>
            <span className="icon">
              <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="2em" height="2em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17"/>
              </svg>
            </span>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Download;
