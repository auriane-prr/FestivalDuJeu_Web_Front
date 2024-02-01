import React from 'react';
import "../../styles/Pages/pageAccueil.css";
import BandeauLogo from '../../components/benevole/bandeauBenevole';
import BoiteOnglet from '../../components/general/boiteOnglet';
import Flexible from '../../components/benevole/stands/flexible';
import FlexibleAnimation from '../../components/benevole/stands/flexible_zone';
import DisplayJauges from '../../components/benevole/stands/display_jauges';

function PageAccueil() {
  return (
    <div>
      <BandeauLogo />
      
      <BoiteOnglet nomOnglet1="Stands" nomOnglet2="Animation Jeux">
        <div className="Onglet1">
          <Flexible/>
          <DisplayJauges/>
        </div>
        <div>
        <FlexibleAnimation/>
        {/* truc pour animation jeux */}
        </div>
      </BoiteOnglet>
      </div>
  );
  
}

export default PageAccueil;
