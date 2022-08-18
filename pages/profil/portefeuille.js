import React from "react";
import CardPortefeuille from "../../components/portefeuille.js/card";
import Navbar from "../../components/Navbar";
import SideBar from "../../components/profil/commun/sideBar";
import CardActifs from "../../components/portefeuille.js/card_actifs";

function Portefeuille() {

  return (
  <>
    <div className="row col-lg-12 row col-md-12 justify-content-between">
        <div className="row col-lg-2 row col-md-2">
      <SideBar/>

      </div>
      <div className="row col-lg-10 row col-md-12">
        <CardActifs
        bgGradient='bg-gradient-image'
        blackText='black-text'
        ctaImage='/images/man-with-ipad.png'
        />
      {/* <CardPortefeuille/> */}

      </div>
    </div>
  </>
  );
}

export default Portefeuille;
