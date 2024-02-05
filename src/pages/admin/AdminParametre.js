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

  const fetchFestivalData = async () => {
    try {
      const response = await fetch(
        "https://festivaldujeuback.onrender.com/festival/latest"
      );
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

  const fetchReferentBenevoles = async () => {
    try {
      const response = await fetch(
        "https://festivaldujeuback.onrender.com/benevole/referent"
      );
      if (response.ok) {
        const data = await response.json();
        setReferentBenevoles(data);
        console.log(data);
      } else {
        throw new Error("Non-OK response from server");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des référents:", error);
    }
  };

  const fetchStandsByDate = async (date) => {
    try {
      const response = await fetch(
        `https://festivaldujeuback.onrender.com/stands/date/${date}`
      );

      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        throw new Error("Non-OK response from server");
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des stands par date",
        error
      );
      return [];
    }
  };

  const fetchZones = async () => {
    try {
      const response = await fetch(
        "https://festivaldujeuback.onrender.com/zoneBenevole/"
      );
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
    fetchFestivalData().then((latestFestivalData) => {
      if (latestFestivalData) {
        const { date_debut, date_fin } = latestFestivalData;

        // Utilisez la date de début et la date de fin pour obtenir les stands correspondants
        const standsByStartDate = fetchStandsByDate(date_debut);
        const standsByEndDate = fetchStandsByDate(date_fin);

        // Vous pouvez maintenant utiliser les données des stands par date de début et de fin
        Promise.all([standsByStartDate, standsByEndDate]).then(
          ([standsStartDate, standsEndDate]) => {
            // Fusionnez les résultats des deux appels pour obtenir la liste complète de stands
            const allStands = [...standsStartDate, ...standsEndDate];

            // Traitez les données des stands comme vous le souhaitez
            console.log("Liste complète de stands :", allStands);

            // Mettez à jour l'état des stands avec les données obtenues
            setStands(allStands);
          }
        );
      }
    });
    fetchNonReferentBenevoles();
    fetchReferentBenevoles();
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
      {showModal && selectedBenevole && (
        <Modal onClose={closeModal}>
          <Titre valeurDuTitre={selectedBenevole.pseudo} />
          <ModaleInfos benevole={selectedBenevole} />
        </Modal>
      )}
    </div>
  );
}

export default AdminParametre;
