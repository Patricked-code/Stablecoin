import React from "react";
import Financier from "../../../components/profil/elements/Financier";
import SideBar from "../../../components/profil/commun/sideBar";

function ProfileFinancier() {
  return (
    <div>
      <div className="row col-lg-12 row col-md-12 justify-content-between">
        <div className="row col-lg-2 row col-md-2">
        <SideBar/>

        </div>
        <div className="row col-lg-10 row col-md-12">
          <Financier/>
        </div>
      </div>
    </div>
  );
}

export default ProfileFinancier;
