import React, { useState, useEffect } from "react";
import Boite from "../../general/boite";
import Champ from "../../general/champ";
import Bouton from "../../general/bouton";
import Modal from "../../general/fenetre_modale";
import Titre from "../../general/titre";
import FestivalForm from "./form_creer_festival";
import { useNavigate } from "react-router-dom";
import "../../../styles/Admin/festivals/display_festival.css";

function DisplayFestival() {
  const [festivals, setFestivals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedFestivalId, setSelectedFestivalId] = useState(null);
  const [latestFestivalId, setLatestFestivalId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFestivals = async () => {
      try {
        const response = await fetch("http://localhost:3500/festival");
        if (response.ok) {
          const fetchedFestivals = await response.json();
          fetchedFestivals.sort(
            (a, b) => new Date(b.date_debut) - new Date(a.date_debut)
          );
          setFestivals(fetchedFestivals);
        } else {
          throw new Error("Erreur lors de la récupération des festivals");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des festivals", error);
      }
    };

    const fetchLatestFestival = async () => {
      try {
        const response = await fetch("http://localhost:3500/festival/latest");
        if (response.ok) {
          const latestFestival = await response.json();
          console.log(latestFestival);
          setLatestFestivalId(latestFestival._id);
          
        } else {
          throw new Error("Erreur lors de la récupération du dernier festival");
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération du dernier festival",
          error
        );
      }
    };

    fetchFestivals();
    fetchLatestFestival();
  }, []);

  const handleFestivalClick = (festivalId) => {
    if (festivalId === latestFestivalId) {
      navigate("/admin/festival");
    } else {
      setSelectedFestivalId((currentId) => {
        // Affichez l'état avant et après la mise à jour pour le débogage
        console.log(
          `État précédent: ${currentId}, État mis à jour: ${
            festivalId === currentId ? null : festivalId
          }`
        );
        return festivalId === currentId ? null : festivalId;
      });
    }
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  function formatDate(date) {
    if (!date) return '';
  
    // Crée un nouvel objet Date si date n'est pas déjà une instance de Date
    const dateObj = date instanceof Date ? date : new Date(date);
    
    // Formate la date en 'jj/mm/aaaa'
    return dateObj.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }


  return (
    <div className="display-festival-container">
      <div className="btn-ajout-container">
        <Bouton type="button" onClick={openModal}>
          Créer Festival
        </Bouton>
      </div>
      <Boite>
        {festivals.map((festival, index) => (
          <React.Fragment key={festival._id}>
            <div
              className={`festival-item ${
                selectedFestivalId === festival._id ? "selected" : ""
              }`}
              onClick={() => handleFestivalClick(festival._id)}
            >
              <Titre valeurDuTitre={festival.nom} />
              <div
                className={`festival-details ${
                  selectedFestivalId === festival._id ? "show" : ""
                }`}
              >
                <div className="date-container">
                <Champ label="Date début :">
                  <input
                    type="text"
                    value={formatDate(festival.date_debut)}
                    className="input"
                    readOnly
                  />
                </Champ>
                <Champ label="Date fin :">
                  <input
                    type="text"
                    value={formatDate(festival.date_fin)}
                    className="input"
                    readOnly
                  />
                </Champ>
                </div>
                <Champ label="Lieu :">
                  <input
                    type="text"
                    value={festival.lieu}
                    className="input"
                    readOnly
                  />
                </Champ>
                <Champ label="Description :">
                  <textarea
                    value={festival.description}
                    className="input"
                    readOnly
                  />
                </Champ>
              </div>
            </div>
            {festivals.length - 1 !== index && (
              <hr className="festival-separator" />
            )}
          </React.Fragment>
        ))}
      </Boite>
      {showModal && (
        <Modal onClose={closeModal}>
          <Titre valeurDuTitre="Créer un nouveau Festival" />
          <FestivalForm onClose={closeModal} />
        </Modal>
      )}
    </div>
  );
}

export default DisplayFestival;
