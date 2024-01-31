import React, { useState, useEffect } from 'react';
import BandeauAdmin from '../../components/admin/bandeauAdmin';
import BoiteOnglet from '../../components/general/boiteOnglet';
import Flexible from '../../components/admin/flexible/flexible';

function AdminFlexible() {
    console.log("je suis dans admin flexible")
    const [dateDebutDisplay, setDateDebutDisplay] = useState("");
    const [dateFinDisplay, setDateFinDisplay] = useState("");

    useEffect(() => {
        // Exemple d'appel API pour récupérer les données du festival
        const fetchData = async () => {
            const result = await fetch("http://localhost:3500/festival/latest");
            const body = await result.json();
            setDateDebutDisplay(body.date_debut);
            setDateFinDisplay(body.date_fin);
        };
        fetchData();
    }, []);

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
      <div>
        <BandeauAdmin />
        <BoiteOnglet nomOnglet1={formatDate(dateDebutDisplay)} nomOnglet2={formatDate(dateFinDisplay)}>
          <div className='nomOnglet1'>
            <Flexible date={dateDebutDisplay} />
          </div>
          <div>
            <Flexible date={dateFinDisplay} />
          </div>
        </BoiteOnglet>
      </div>
    );
}

export default AdminFlexible;