import React, {useEffect, useState} from "react";
import "../../styles/Pages/pageAccueil.css";
import BandeauBenevole from "../../components/benevole/bandeauBenevole";
import BandeauReferent from "../../components/referent/bandeauReferent";
import BoiteOnglet from "../../components/general/boiteOnglet";
import Flexible from "../../components/benevole/stands/flexible";
import DisplayStand from "../../components/benevole/stands/display_jauges";
import DisplayZone from "../../components/benevole/zones/accueil_zone";
import FlexibleAnimation from '../../components/benevole/stands/flexible_zone';
import { useAuth } from "../../AuthWrapper.js";

function PageAccueil() {
  const { user } = useAuth();
  return (
    <div>
      {user.referent ? <BandeauReferent /> : <BandeauBenevole />}
      <BoiteOnglet nomOnglet1="Stands" nomOnglet2="Animation Jeux">
        <div className="Onglet1">
          <Flexible/>
          <DisplayStand/>
        </div>
        <div>
        <FlexibleAnimation/>
        <DisplayZone />
        </div>
      </BoiteOnglet>
    </div>
  );
}

export default PageAccueil;