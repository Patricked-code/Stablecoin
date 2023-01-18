import React from "react";
import Entreprise from "../../../components/profil/elements/Entreprise";
import SideBar from "../../../components/profil/commun/sideBar";

function ProfileEntreprise() {
  return (
    <div>
      <div className="row col-lg-12 row col-md-12 justify-content-between">
        <div className="row col-lg-2 row col-md-2">
        <SideBar/>

        </div>
        <div className="row col-lg-10 row col-md-12">
          <Entreprise/>
        </div>
      </div>
    </div>
  );
}

export default ProfileEntreprise;
