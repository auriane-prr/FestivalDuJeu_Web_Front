import React from "react";
import "../../styles/Pages/pageAccueil.css";
import BandeauLogo from "../../components/benevole/bandeauBenevole";
import BoiteOnglet from "../../components/general/boiteOnglet";
import Flexible from "../../components/benevole/stands/flexible";
import DisplayStand from "../../components/benevole/stands/display_jauges";
import DisplayZone from "../../components/benevole/zones/accueil_zone";

function PageAccueil() {
  return (
    <div>
      <BandeauLogo />
      <Flexible />
      <BoiteOnglet nomOnglet1="Stands" nomOnglet2="Animation Jeux">
        <div className="Onglet1">
          <DisplayStand />
        </div>
        <div>
          <DisplayZone />
        </div>
      </BoiteOnglet>
    </div>
  );
}

export default PageAccueil;