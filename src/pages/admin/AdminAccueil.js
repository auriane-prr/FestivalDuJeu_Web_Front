import React, { useState, useEffect } from 'react';
import BandeauAdmin from '../../components/admin/bandeauAdmin';
import BoiteOnglet from '../../components/boiteOnglet';
import StandOnglet from '../../components/admin/display_stand';

function AdminPageStand() {
  return (
    <div className="pageStand">
      <BandeauAdmin />
      <BoiteOnglet nomOnglet1='Stand' nomOnglet2='Jeux'>
        <div className='Onglet1'>
          <StandOnglet />
        </div>
        <div>Jeux</div>
      </BoiteOnglet>
    </div>
  );
}

export default AdminPageStand;
