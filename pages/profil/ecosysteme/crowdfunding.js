import React from "react";
import CardCrowdfunding from "../../../components/Ecosysteme/Crowdfunding/card-crowdfunding";
import SideBar from "../../../components/profil/commun/sideBar";

function Crowdfunding() {
// const { account } = useWeb3React()

  return (
    <div>
      <div className="row col-lg-12 row col-md-12 justify-content-between">
        <div className="row col-lg-2 row col-md-2">
        <SideBar/>

        </div>
        <div className="row col-lg-10 row col-md-12">
          <CardCrowdfunding />
        </div>
      </div>
    </div>
  );
}

export default Crowdfunding;
