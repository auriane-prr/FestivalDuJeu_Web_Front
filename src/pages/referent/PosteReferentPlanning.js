import React, {useEffect, useState} from "react";
import BandeauReferent from "../../components/referent/bandeauReferent";
import BoiteOnglet from "../../components/general/boiteOnglet";
import PlanningReferent from "../../components/referent/planningPosteReferent";
import Planning from "../../components/general/planning";

function ReferentPlanning() {
    const [dateDebutDisplay, setDateDebutDisplay] = useState("");
    const [dateFinDisplay, setDateFinDisplay] = useState("");
    const [idReferent, setIdReferent] = useState("");
    const [hasAssignedStands, setHasAssignedStands] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const result = await fetch("http://localhost:3500/festival/latest");
            const body = await result.json();
            setDateDebutDisplay(body.date_debut);
            setDateFinDisplay(body.date_fin);

            const pseudo = localStorage.getItem('pseudo');
            const response = await fetch(`http://localhost:3500/benevole/pseudo/${pseudo}`);
            const data = await response.json();
            const referentId = data.benevole._id;
            setIdReferent(referentId);

            const standsResponse = await fetch(`http://localhost:3500/stands/referent/${referentId}`);
            const standsData = await standsResponse.json();
            const filteredStands = standsData.filter(stand => new Date(stand.date).toDateString() === new Date(dateDebutDisplay).toDateString() || new Date(stand.date).toDateString() === new Date(dateFinDisplay).toDateString());
            setHasAssignedStands(filteredStands.length > 0);
            setLoading(false);
        };
        fetchData();
    }, [dateDebutDisplay, dateFinDisplay]);

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

    if (loading) {
        return <div>Chargement...</div>;
    }

    return (
        <div>
            <BandeauReferent />
            <BoiteOnglet nomOnglet1={formatDate(dateDebutDisplay)} nomOnglet2={formatDate(dateFinDisplay)}>
            <div className='nomOnglet1'>
            {hasAssignedStands ? (
                        <PlanningReferent date={dateDebutDisplay} />
                    ) : (
                        <h3>Vous n'êtes pas référents à cette date</h3>
                    )}
                </div>
            <div className='nomOnglet2'>
            {hasAssignedStands ? (
                        <PlanningReferent date={dateFinDisplay}/>
                    ) : (
                        <h3>Vous n'êtes pas référents à cette date</h3>
                    )}
                </div>
            </BoiteOnglet>
            
        </div>
    )
}

export default ReferentPlanning;