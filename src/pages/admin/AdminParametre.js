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
  const [selectedBenevole, setSelectedBenevole] = useState(null);
  const [latestFestivalName, setLatestFestivalName] = useState("");

  function formatDate(date) {
    if (!date) return "";
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  const closeModal = () => {
    setShowModal(false);
  };

  const handleNonReferentChange = (e) => {
    const selectedId = e.target.value;
    const selected = nonReferentBenevoles.find((b) => b._id === selectedId);
    setSelectedBenevole(selected);
    setShowModal(true); // Ouvrir la modale
  };
  
  const handleReferentChange = (e) => {
    const selectedId = e.target.value;
    const selected = referentBenevoles.find((b) => b._id === selectedId);
    setSelectedBenevole(selected);
    setShowModal(true); // Ouvrir la modale
  };
  

  const fetchFestivalData = async () => {
    try {
      const response = await fetch("https://festivaldujeuback.onrender.com/festival/latest");
      if (response.ok) {
        const data = await response.json();
        setLatestFestivalName(data.nom); // Supposons que la propriété s'appelle 'nom'
        return data;
      } else {
        throw new Error("Non-OK response from server");
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données du festival",
        error
      );
      return null;
    }
  };

  const fetchNonReferentBenevoles = async () => {
    try {
      const response = await fetch(
        "https://festivaldujeuback.onrender.com/benevole/non-referent"
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

  const fetchStandsAndReferents = async () => {
    const festivalData = await fetchFestivalData();
    if (festivalData) {
      const { date_debut, date_fin } = festivalData;
      try {
        const responseDebut = await fetch(`https://festivaldujeuback.onrender.com/stands/date/${date_debut}`);
        const dataDebut = await responseDebut.ok ? await responseDebut.json() : [];
  
        const responseFin = await fetch(`https://festivaldujeuback.onrender.com/stands/date/${date_fin}`);
        const dataFin = await responseFin.ok ? await responseFin.json() : [];
  
        const mergedData = [...dataDebut, ...dataFin];
        setStands(mergedData);
  
        // Extraire les ID uniques des référents des stands
        const referentsIds = [...new Set(mergedData.flatMap(stand => stand.referents.map(ref => ref._id)))];
  
        // Récupérer les informations des référents en parallèle
        const referentsPromises = referentsIds.map(id =>
          fetch(`https://festivaldujeuback.onrender.com/benevole/id/${id}`).then(response => response.json())
        );
  
        const referents = await Promise.all(referentsPromises);
        setReferentBenevoles(referents.filter(benevole => benevole)); // Filtrer les valeurs non valides
      } catch (error) {
        console.error("Erreur lors de la récupération des stands et des référents", error);
      }
    }
  };

  const fetchZones = async () => {
    try {
      const response = await fetch("https://festivaldujeuback.onrender.com/zoneBenevole/");
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
    fetchStandsAndReferents();
    fetchZones();
  }, []);
  

  return (
    <div>
      <BandeauAdmin />
      <Boite>
        <Titre valeurDuTitre={latestFestivalName || "Chargement..."} />
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
      {showModal && selectedBenevole  && (
        <Modal onClose={closeModal}>
          <Titre valeurDuTitre={selectedBenevole.pseudo} />
          <ModaleInfos benevole={selectedBenevole} />
        </Modal>
      )}
    </div>
  );
}

export default AdminParametre;
