import React from 'react';
import BandeauAdmin from '../../components/admin/bandeauAdmin';
<<<<<<< HEAD
import BoiteOnglet from '../../components/boiteOnglet';
import Display_stand from '../../components/admin/display_stand';
import '../../styles/Pages/admin/AdminAccueil.css';
=======
import BoiteOnglet from '../../components/general/boiteOnglet';
import Display_stand from '../../components/admin/stands/display_stand';
import '../../styles/Pages/admin/accueil_admin.css';
>>>>>>> b2611606ed0e637afc77de1c21af41c6609fd5d4

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
