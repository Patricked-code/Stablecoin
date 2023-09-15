import React, { useState } from 'react';
import TypeProfil from '../../../components/profil/Opcvm/TypeProfil';
import SidebarProfil from '../../../components/profil/SideBar/Sidebar';



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
            <SidebarProfil/>
            {/* FIN */}
          </aside>

          {/* CONTENU  */}
          <TypeProfil/>
          {/* FIN */}

        </main>
    </>
  );
};

export default index;
