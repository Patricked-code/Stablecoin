


import React from "react";

import CardInvestissement from "../../../components/Ecosysteme/investissement/card-investissement";
import CardOpcvm from "../../../components/Ecosysteme/investissement/card-opcvm";

// import { useWeb3React } from "@web3-react/core"
import Navbar from "../../../components/Navbar";
import SideBar from "../../../components/profil/commun/sideBar";

function Investissement() {
// const { account } = useWeb3React()

  return (
    <>
    <div className="row col-lg-12 row col-md-12 justify-content-between">
        <div className="row col-lg-2 row col-md-2">
        <SideBar/>

        </div>
        <div className="row col-lg-10 row col-md-12">
          <CardOpcvm/>
      {/* <CardInvestissement/> */}

        </div>
      </div>
      </>
  );
}

export default Investissement;

