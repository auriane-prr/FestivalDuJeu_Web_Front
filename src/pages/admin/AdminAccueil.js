import React, { useState, useEffect } from 'react';
import BandeauAdmin from '../../components/admin/bandeauAdmin';
import BoiteOnglet from '../../components/general/boiteOnglet';
import Display_stand from '../../components/admin/stands/display_stand';
import '../../styles/Pages/admin/accueil_admin.css';

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
