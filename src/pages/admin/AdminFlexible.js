import React, { useState, useEffect } from 'react';
import BandeauAdmin from '../../components/admin/bandeauAdmin';
import BoiteOnglet from '../../components/general/boiteOnglet';
import Flexible from '../../components/admin/flexible/flexible';
import FlexibleZone from '../../components/admin/flexible/flexibleZone';
import Champ from '../../components/general/champ';

function AdminFlexible() {
    console.log("je suis dans admin flexible")
    const [dateDebut, setDateDebut] = useState("");
    const [dateFin, setDateFin] = useState("");
    const [selectedDate, setSelectedDate] = useState("");

    useEffect(() => {
        // Exemple d'appel API pour récupérer les données du festival
        const fetchData = async () => {
            const result = await fetch("http://localhost:3500/festival/latest");
            const body = await result.json();
            setDateDebut(body.date_debut);
            setDateFin(body.date_fin);
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

      const handleDateChange = (e) => {
        const selectedValue = e.target.value;
        setSelectedDate(selectedValue);
      };
    
    
    return (
      <div>
        <BandeauAdmin />
        <BoiteOnglet nomOnglet1={"Stands"} nomOnglet2={"Zones"}>
          <div className='nomOnglet1'>
          <Champ>
        <select
          className="input"
          value={selectedDate}
          onChange={handleDateChange}
        >
          <option value="" disabled={selectedDate !== ""}>
            Choisissez une date
          </option>
          {dateDebut && (
            <option value={dateDebut}>{formatDate(dateDebut)}</option>
          )}
          {dateFin && <option value={dateFin}>{formatDate(dateFin)}</option>}
        </select>
      </Champ>
            <Flexible date={selectedDate} />
          </div>
          <div className='nomOnglet2'>
            <p>Zone</p>
            <Champ>
        <select
          className="input"
          value={selectedDate}
          onChange={handleDateChange}
        >
          <option value="" disabled={selectedDate !== ""}>
            Choisissez une date
          </option>
          {dateDebut && (
            <option value={dateDebut}>{formatDate(dateDebut)}</option>
          )}
          {dateFin && <option value={dateFin}>{formatDate(dateFin)}</option>}
        </select>
      </Champ>
            <FlexibleZone date={selectedDate} />
          </div>
        </BoiteOnglet>
      </div>
    );
}

export default AdminFlexible;