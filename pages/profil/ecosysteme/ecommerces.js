import React from "react";
import Boutique from "../../../components/Ecosysteme/ecommerces/card-boutique";
import CardProduit from "../../../components/Ecosysteme/ecommerces/card-produit";
import SideBar from "../../../components/profil/commun/sideBar";


function Ecommerces() {

  return (
    <div>
      
      <div className="row col-lg-12 row col-md-12 justify-content-between">
        <Boutique/>
        <CardProduit />
      </div>
      
    </div>
  );
}

export default Ecommerces;
