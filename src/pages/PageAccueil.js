import React, { useState, useEffect } from 'react';
import "../styles/Pages/pageAccueil.css";
import BandeauLogo from '../components/bandeauLogo';
import Boite from '../components/boite';
import Jauge from '../components/jauge';
import * as XLSX from 'xlsx';

function PageAccueil() {
  const [scheduleData, setScheduleData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('./stand.xlsx'); // Assurez-vous que le chemin du fichier est correct
        const arrayBuffer = await response.arrayBuffer();
        const data = new Uint8Array(arrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const schedule = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        setScheduleData(schedule);
      } catch (error) {
        console.error('Erreur lors du chargement du fichier Excel :', error);
      }
    };

    fetchData();
  }, []);

  // Fonction pour regrouper les stands par heure et par colonne
  const groupStandsByHourAndColumn = () => {
    const standsByHour = {};
    scheduleData.forEach((row) => {
      const hour = row[0];
      if (!standsByHour[hour]) {
        standsByHour[hour] = { column1: [], column2: [] };
      }
      if (standsByHour[hour].column1.length < 3) {
        standsByHour[hour].column1.push(row[1]);
      } else {
        standsByHour[hour].column2.push(row[1]);
      }
    });
    return standsByHour;
  };

  const standsByHourAndColumn = groupStandsByHourAndColumn();

  return (
    <div>
      <BandeauLogo />
      <Boite>
        {Object.entries(standsByHourAndColumn).map(([hour, columns], index) => (
          <div key={index}>
            <h2>{hour}h</h2>
            <div>
              <div>
                {columns.column1.map((stand, i) => (
                  <Jauge key={i} borderColor='#454C8B'>{stand}</Jauge>
                ))}
              </div>
              <div>
                {columns.column2.map((stand, i) => (
                  <Jauge key={i} borderColor='#454C8B'>{stand}</Jauge>
                ))}
              </div>
            </div>
          </div>
        ))}
      </Boite>
    </div>
  );
}

export default PageAccueil;
