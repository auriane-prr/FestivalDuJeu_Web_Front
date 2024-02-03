import React, { useState, useEffect } from 'react';
import BandeauAdmin from '../../components/admin/bandeauAdmin';
import BoiteOnglet from '../../components/general/boiteOnglet';
import Flexible from '../../components/admin/flexible/flexible';
import FlexibleZone from '../../components/admin/flexible/flexibleZone';
import Champ from '../../components/general/champ';

function AdminFlexible() {
    console.log("je suis dans admin flexible")

    
    
    return (
      <div>
        <BandeauAdmin />
        <BoiteOnglet nomOnglet1={"Stands"} nomOnglet2={"Zones"}>
          <div className='nomOnglet1'>
          
            <Flexible />
          </div>
          <div className='nomOnglet2'>
            {/* <Champ>
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
      </Champ> */}
            <FlexibleZone/>
          </div>
        </BoiteOnglet>
      </div>
    );
}

export default AdminFlexible;