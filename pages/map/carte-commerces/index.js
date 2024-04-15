import React, { useState } from 'react';
// import CarteCommcerces from '../../../components/CarteLocalisation/CarteCommerces';
import CarteCommun from '../../../components/CarteLocalisation/CarteCommun';
import SidebarProfil from '../../../components/profil/SideBar/Sidebar';



const index = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <>
        <>
         

          {/* CONTENU PROFIL */}
          {/* <CarteCommcerces/> */}
          <CarteCommun/>
          {/* FIN */}

        </>
    </>
  );
};

export default index;
