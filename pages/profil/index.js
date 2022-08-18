import React from "react";
import CardProfil from "../../components/profil/card";
// import { useWeb3React } from "@web3-react/core"
import Navbar from "../../components/Navbar";
import SideBar from "../../components/profil/commun/sideBar";
import CardA from "../../components/profil/elements/card_A";
import Card2A from "../../components/profil/elements/Card2_A";

function Profile() {
// const { account } = useWeb3React()

  return (
    <div>
      <div className="row col-lg-12 row col-md-12 justify-content-between">
        <div className="row col-lg-2 row col-md-2">
        <SideBar/>

        </div>
        <div className="row col-lg-10 row col-md-12">
          <CardA/>
          {/* <Card2A /> */}
        </div>
      </div>
      {/* <Header /> */}
      {/* <CardProfil /> */}
    </div>
  );
}

export default Profile;
