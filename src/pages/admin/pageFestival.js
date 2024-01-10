import React from "react";
import BandeauAdmin from "../../components/admin/bandeauAdmin";
import BoiteOnglet from "../../components/general/boiteOnglet";
import Display_stand from "../../components/admin/stands/display_stand";
import Display_zone from "../../components/admin/jeux/display_zone";
import "../../styles/Pages/admin/pageFestival.css";

function PageFestival() {
  return (
    <div className="pageStand">
      <BandeauAdmin />
      <BoiteOnglet nomOnglet1="Stand" nomOnglet2="Jeux">
        <div className="Onglet1">
          <Display_stand />
        </div>
        <div>
        <Display_zone />
        </div>
      </BoiteOnglet>
    </div>
  );
}

export default PageFestival;
