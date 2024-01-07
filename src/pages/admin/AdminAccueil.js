import React from 'react';
import BandeauAdmin from '../../components/admin/bandeauAdmin';
import DisplayFestival from '../../components/admin/festivals/display_festival';

function AdminAccueil() {
  return (
    <div>
      <BandeauAdmin />
<<<<<<< HEAD
      <BoiteOnglet nomOnglet1='Stand' nomOnglet2='Jeux'>
        <div className='Onglet1'>
          <Display_stand />
        </div>
        <div>Jeux
        <Display_jeux />
        </div>
      </BoiteOnglet>
=======
      <DisplayFestival />
>>>>>>> 75454ec51df02d66358c14789e13b992b1c17658
    </div>
  );
}

export default AdminAccueil;