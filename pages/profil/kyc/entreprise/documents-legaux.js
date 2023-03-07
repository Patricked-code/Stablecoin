import React, { useState } from 'react';
import CDocumentLegaux from '../../../../components/profil/Kyc/Entreprise/DocumentsLegaux';
import SidebarProfil from '../../../../components/profil/SideBar/Sidebar';



const documentLegaux = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <>
        <main className={showSidebar ? 'space-toggle' : null}>
          <header className={`header ${showSidebar ? 'space-toggle' : null}`}>
            <div className='header-toggle mx-30' onClick={() => setShowSidebar(!showSidebar)}>
              <i className={`fas fa-bars text-white  ${showSidebar == "true"? 'fa-solid fa-xmark text-white ' : null}`}></i>
            </div>
          </header>

          <aside className={`sidebar ${showSidebar ? 'showSidebar' : null} z-index-1`}>
            {/* SIDEBAR */}
            <SidebarProfil/>
            {/* FIN */}
          </aside>

          {/* CONTENU PROFIL */}
          <CDocumentLegaux />
          {/* FIN */}

        </main>
    </>
  );
};

export default documentLegaux;
