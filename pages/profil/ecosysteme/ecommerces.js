import React from "react";
import Boutique from "../../../components/Ecosysteme/ecommerces/card-boutique";
import CardProduit from "../../../components/Ecosysteme/ecommerces/card-produit";
import SideBar from "../../../components/profil/commun/sideBar";


function Ecommerces() {

  return (
    <div>
      <div className="row col-lg-12 row col-md-12 justify-content-between">
        <div className="row col-lg-2 row col-md-2">
        <SideBar/>

        </div>
        <div className="row col-lg-10 row col-md-12">
          <Boutique/>
          <CardProduit />
        </div>
      </div>
    </div>
  );
}

export default Ecommerces;
