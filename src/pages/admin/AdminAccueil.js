import React from 'react';
import BandeauAdmin from '../../components/admin/bandeauAdmin';
import BoiteOnglet from '../../components/general/boiteOnglet';
import Display_stand from '../../components/admin/stands/display_stand';
import Ajouter_jeux from '../../components/admin/stands/ajouter_jeux';
import '../../styles/Pages/admin/accueil_admin.css';

function AdminPageStand() {
  return (
    <div className="pageStand">
      <BandeauAdmin />
      <BoiteOnglet nomOnglet1='Stand' nomOnglet2='Jeux'>
        <div className='Onglet1'>
          <Display_stand />
        </div>
        <div>Jeux
        <Ajouter_jeux />
        </div>
      </BoiteOnglet>
    </div>
  );
}

export default AdminPageStand;
