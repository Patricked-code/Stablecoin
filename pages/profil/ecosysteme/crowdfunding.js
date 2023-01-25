import React from "react";
import CardCrowdfunding from "../../../components/Ecosysteme/Crowdfunding/card-crowdfunding";
import SideBar from "../../../components/profil/commun/sideBar";

function Crowdfunding() {
// const { account } = useWeb3React()

  return (
    <div>
      
      <div className="row col-lg-12 row col-md-12 justify-content-between">
        <CardCrowdfunding />
      </div>
      
    </div>
  );
}

export default Crowdfunding;
