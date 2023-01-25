import React from "react";
// import { Header } from "../../components/magicCompnents/Header";
import CardTransaction from "../../../components/Ecosysteme/Card";
// import { useWeb3React } from "@web3-react/core"
import Navbar from "../../../components/Navbar";
import SideBar from "../../../components/profil/commun/sideBar";

function Transaction() {
// const { account } = useWeb3React()

  return (
    
    <>
      <div className="row col-lg-12 row col-md-12 justify-content-between">
        <CardTransaction/>
      </div>
    </>
    
  );
}

export default Transaction;
