import React, { useState } from 'react';
import DashboardNoeud from '../../components/Noeud/Dashboard';
import SidebarNoeud from '../../components/Noeud/SidebarNoeud';



const index = () => {
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
            <SidebarNoeud/>
            {/* FIN */}
          </aside>

          {/* CONTENU PROFIL */}
          <DashboardNoeud/>
          {/* FIN */}

        </main>
    </>
  );
};

export default index;
