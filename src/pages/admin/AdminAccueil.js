import React from 'react';
import BandeauAdmin from '../../components/admin/bandeauAdmin';
import DisplayFestival from '../../components/admin/festivals/display_festival';

function AdminAccueil() {
  return (
    <div>
      <BandeauAdmin />
      <DisplayFestival />
    </div>
  );
}

export default AdminAccueil;