import React, { useState, useEffect } from 'react';
import BandeauAdmin from '../../components/admin/bandeauAdmin';
import BoiteOnglet from '../../components/boiteOnglet';
import Display_stand from '../../components/admin/display_stand';

function AdminPageStand() {
  return (
    <div className="pageStand">
      <BandeauAdmin />
      <BoiteOnglet nomOnglet1='Stand' nomOnglet2='Jeux'>
        <div className='Onglet1'>
          <Display_stand />
        </div>
        <div>Jeux</div>
      </BoiteOnglet>
    </div>
  );
}

export default AdminPageStand;
