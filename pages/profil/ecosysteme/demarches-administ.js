import React from "react";
import Frais from "../../../components/Ecosysteme/demarches-administ/frais";
import FraisConcours from "../../../components/Ecosysteme/demarches-administ/frais-concours";
import SideBar from "../../../components/profil/commun/sideBar";

function DemarchesAdmin() {

  return (
   

  <div>
    
    <div className="row col-lg-12 row col-md-12 justify-content-between">
      <Frais/>
      <FraisConcours />
    </div>
  
  </div>

  );
}

export default DemarchesAdmin;
