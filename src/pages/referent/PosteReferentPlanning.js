import React, { useEffect, useState } from "react";
import BandeauReferent from "../../components/referent/bandeauReferent";
import Boite from "../../components/general/boite";
import PlanningReferent from "../../components/referent/planningPosteReferent";
import Titre from "../../components/general/titre";

function ReferentPlanning() {
  const [idReferent, setIdReferent] = useState("");
  const [standDate, setStandDate] = useState("");
  const [standName, setStandName] = useState(""); // Nouvel état pour le nom du stand
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!loading) return; // Empêcher l'exécution répétée

      // Récupération de l'ID du référent
      const pseudo = localStorage.getItem("pseudo");
      const benevoleResponse = await fetch(
        `https://festivaldujeuback.onrender.com/benevole/pseudo/${pseudo}`
      );
      const benevoleData = await benevoleResponse.json();
      setIdReferent(benevoleData.benevole._id);

      // Assurez-vous que l'ID du référent est défini avant de continuer
      if (!benevoleData.benevole._id) return;

      // Récupération des stands du référent
      const standsResponse = await fetch(
        `https://festivaldujeuback.onrender.com/stands/referent/${benevoleData.benevole._id}`
      );
      const standsData = await standsResponse.json();

      // Mise à jour de l'état avec la date et le nom du premier stand, si disponible
      if (standsData.length > 0) {
        setStandDate(standsData[0].date);
        setStandName(standsData[0].nom_stand); // Mise à jour du nom du stand
      }

      setLoading(false); // Marquer la fin du chargement
    };

    fetchData();
  }, [loading]); // Dépend uniquement de loading

  function formatDate(date) {
    if (!date) return "";
    const dateObj = new Date(date);
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
        {/* Affichage conditionnel du titre si la date et le nom du stand sont disponibles */}
        {standDate && standName && (
          <Titre
            valeurDuTitre={`Planning du ${formatDate(
              standDate
            )} - ${standName}`}
          />
        )}
        <PlanningReferent date={standDate} />
      </Boite>
    </div>
  );
}

export default ReferentPlanning;
