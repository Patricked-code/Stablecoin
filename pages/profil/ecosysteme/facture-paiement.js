import React from "react";
import CardFacture from "../../../components/Ecosysteme/factures-paiements/card-facture";
import CardPaiement from "../../../components/Ecosysteme/factures-paiements/card-paiement";
import CardRecharge from "../../../components/Ecosysteme/factures-paiements/card-recharge";
// import { useWeb3React } from "@web3-react/core"
import Navbar from "../../../components/Navbar";
import SideBar from "../../../components/profil/commun/sideBar";

function FacturePaiement() {
// const { account } = useWeb3React()

  return (
    <div>

      <div className="row col-lg-12 row col-md-12 justify-content-between">
        <div className="row col-lg-2 row col-md-2">
        <SideBar/>

        </div>
        <div className="row col-lg-10 row col-md-12">
        <CardFacture/>
        <CardPaiement/>
        </div>
      </div>
    </div>

    
  );
}

export default FacturePaiement;
