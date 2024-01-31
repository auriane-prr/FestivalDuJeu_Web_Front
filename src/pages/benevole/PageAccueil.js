import React from 'react';
import "../../styles/Pages/pageAccueil.css";
import BandeauLogo from '../../components/benevole/bandeauBenevole';
import BoiteOnglet from '../../components/general/boiteOnglet';
import Flexible from '../../components/benevole/stands/flexible';
import DisplayJauges from '../../components/benevole/stands/display_jauges';

function PageAccueil() {
  return (
    <div>
      <BandeauLogo />
      <Flexible/>
      <BoiteOnglet nomOnglet1="Stands" nomOnglet2="Animation Jeux">
        <div className="Onglet1">
          <DisplayJauges/>
        </div>
        <div>
        {/* truc pour animation jeux */}
        </div>
      </BoiteOnglet>
      </div>
  );
  
}

export default PageAccueil;
