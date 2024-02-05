import React, { useEffect, useState } from "react";
import BandeauReferent from "../../components/referent/bandeauReferent";
import Boite from "../../components/general/boite";
import PlanningReferent from "../../components/referent/planningPosteReferent";
import Titre from "../../components/general/titre";

function ReferentPlanning() {
  const [dateDebutDisplay, setDateDebutDisplay] = useState("");
  const [dateFinDisplay, setDateFinDisplay] = useState("");
  const [idReferent, setIdReferent] = useState("");
  const [hasAssignedStands, setHasAssignedStands] = useState(false);
  const [loading, setLoading] = useState(true);
  const [standDate, setStandDate] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await fetch(
        "https://festivaldujeuback.onrender.com/festival/latest"
      );
      const body = await result.json();
      setDateDebutDisplay(body.date_debut);
      setDateFinDisplay(body.date_fin);

      const pseudo = localStorage.getItem("pseudo");
      const response = await fetch(
        `https://festivaldujeuback.onrender.com/benevole/pseudo/${pseudo}`
      );
      const data = await response.json();
      const referentId = data.benevole._id;
      setIdReferent(referentId);

      const standsResponse = await fetch(
        `https://festivaldujeuback.onrender.com/stands/referent/${referentId}`
      );
      const standsData = await standsResponse.json();
      const filteredStands = standsData.filter(
        (stand) =>
          new Date(stand.date).toDateString() ===
            new Date(dateDebutDisplay).toDateString() ||
          new Date(stand.date).toDateString() ===
            new Date(dateFinDisplay).toDateString()
      );
      if (filteredStands.length > 0) {
        setHasAssignedStands(true);
        // Mettez à jour l'état avec la date du premier stand filtré
        setStandDate(filteredStands[0].date);
      } else {
        setHasAssignedStands(false);
      }
    };
    fetchData();
  }, [dateDebutDisplay, dateFinDisplay]);

  function formatDate(date) {
    if (!date) return "";

    // Crée un nouvel objet Date si date n'est pas déjà une instance de Date
    const dateObj = date instanceof Date ? date : new Date(date);

    // Formate la date en 'jj/mm/aaaa'
    return dateObj.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      <BandeauReferent />
      <Boite>
        <Titre valeurDuTitre={"Planning du {formatDate(standDate)}"} />
        <PlanningReferent date={standDate} />
      </Boite>
    </div>
  );
}

export default ReferentPlanning;
