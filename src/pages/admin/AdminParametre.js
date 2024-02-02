import React from "react";
import BandeauAdmin from "../../components/admin/bandeauAdmin";
import Boite from "../../components/general/boite";
import { useState, useEffect } from "react";
import Champ from "../../components/general/champ";
import ModaleInfos from "../../components/admin/parametres/display_infos";
import Modal from "../../components/general/fenetre_modale";
import Titre from "../../components/general/titre";

function AdminParametre() {
  const [showModal, setShowModal] = useState(false);
  const [nonReferentBenevoles, setNonReferentBenevoles] = useState([]);
  const [referentBenevoles, setReferentBenevoles] = useState([]);
  const [stands, setStands] = useState([]);
  const [zones, setZones] = useState([]);
  const[selectedBenevole, setSelectedBenevole] = useState(null);

  function formatDate(date) {
    if (!date) return "";
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleNonReferentChange = (e) => {
    const selectedId = e.target.value;
    const selected = nonReferentBenevoles.find((b) => b._id === selectedId);
    setSelectedBenevole(selected);
    openModal();
  };

  const handleReferentChange = (e) => {
    const selectedId = e.target.value;
    const selected = referentBenevoles.find((b) => b._id === selectedId);
    setSelectedBenevole(selected);
    openModal();
  };

  const fetchFestivalData = async () => {
    try {
      const response = await fetch("http://localhost:3500/festival/latest");
      if (response.ok) {
        const data = await response.json();
        return data; // Retourne les données du dernier festival
      } else {
        throw new Error("Non-OK response from server");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données du festival", error);
      return null; // En cas d'erreur, retournez null ou gérez l'erreur comme nécessaire
    }
  };  

  const fetchNonReferentBenevoles = async () => {
    try {
      const response = await fetch(
        "http://localhost:3500/benevole/non-referent"
      );
      if (response.ok) {
        const data = await response.json();
        setNonReferentBenevoles(data);
        console.log(data);
      } else {
        throw new Error("Non-OK response from server");
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des bénévoles non référents:",
        error
      );
    }
  };

  const fetchReferentBenevoles = async () => {
    try {
      const response = await fetch("http://localhost:3500/benevole/referent");
      if (response.ok) {
        const data = await response.json();
        setReferentBenevoles(data);
      } else {
        throw new Error("Non-OK response from server");
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des bénévoles référents:",
        error
      );
    }
  };

  const fetchStands = async () => {
    const festivalData = await fetchFestivalData(); // Récupérez les dates du dernier festival
    if (festivalData) {
      const { date_debut, date_fin } = festivalData;
      try {
        // Effectuez la requête pour obtenir les stands avec date_debut
        const responseDebut = await fetch(`http://localhost:3500/stands/date/${date_debut}`);
        if (responseDebut.ok) {
          const dataDebut = await responseDebut.json();
  
          // Effectuez la deuxième requête pour obtenir les stands avec date_fin
          const responseFin = await fetch(`http://localhost:3500/stands/date/${date_fin}`);
          if (responseFin.ok) {
            const dataFin = await responseFin.json();
  
            // Fusionnez les résultats des deux requêtes
            const mergedData = [...dataDebut, ...dataFin];
            // Utilisez les stands récupérés (mergedData) comme nécessaire
            console.log(mergedData);
            setStands(mergedData); // Mettez à jour l'état des stands avec les données récupérées
          } else {
            throw new Error("Non-OK response from server (date_fin)");
          }
        } else {
          throw new Error("Non-OK response from server (date_debut)");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des stands par date", error);
      }
    }
  };
  
  const fetchZones = async () => {
    try {
      const response = await fetch("http://localhost:3500/zoneBenevole/");
      if (response.ok) {
        const data = await response.json();
        setZones(data);
      } else {
        throw new Error("Non-OK response from server");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des zones", error);
    }
  };

  useEffect(() => {
    fetchNonReferentBenevoles();
    fetchReferentBenevoles();
    fetchStands();
    fetchZones();
  }, []);

  return (
    <div>
      <BandeauAdmin />
      <Boite>
        <Champ label={"Voir les bénévoles inscrits :"}>
          <select className="input" onChange={handleNonReferentChange}>
            <option value="">Sélectionner un bénévole</option>
            {nonReferentBenevoles.map((benevole, index) => (
              <option key={index} value={benevole._id}>
                {benevole.pseudo}
              </option>
            ))}
          </select>
        </Champ>
        <Champ label={"Voir les référents :"}>
          <select className="input" onChange={handleReferentChange}>
            <option value="">Sélectionner un référent</option>
            {referentBenevoles.map((benevole, index) => (
              <option key={index} value={benevole._id}>
                {benevole.pseudo}
              </option>
            ))}
          </select>
        </Champ>
        <Champ label={"Liste des stands :"}>
          <select className="input">
            <option value="">Voir les stands</option>
            {stands.map((stand, index) => (
              <option key={index} value={stand._id}>
                {stand.nom_stand} ({formatDate(stand.date)})
              </option>
            ))}
          </select>
        </Champ>
        <Champ label={"Liste des zones :"}>
          <select className="input">
            <option value="">Voir les zones</option>
            {zones.map((zoneBenevole, index) => (
              <option key={index} value={zoneBenevole._id}>
                {zoneBenevole.nom_zone_benevole}
              </option>
            ))}
          </select>
        </Champ>
      </Boite>
      {showModal && selectedBenevole && (
        <Modal onClose={closeModal}>
          <Titre valeurDuTitre={selectedBenevole.pseudo} />
          <ModaleInfos
            benevole={selectedBenevole}
          />
        </Modal>
      )}
    </div>
  );
}

export default AdminParametre;
