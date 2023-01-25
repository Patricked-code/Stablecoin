import React, { useState } from 'react';
import JtifDomicile from '../../../../components/profil/Kyc/Particulier/JustificatifDomicile';
import SidebarProfil from '../../../../components/profil/SideBar/Sidebar';



const justificatifDomicile = () => {
  const [show, setShow] = useState(false);

  return (
    <>
        <main className={show ? 'space-toggle' : null}>
          <header className={`header ${show ? 'space-toggle' : null}`}>
            <div className='header-toggle mx-30' onClick={() => setShow(!show)}>
              <i className={`fas fa-bars text-white  ${show == "true"? 'fa-solid fa-xmark text-white ' : null}`}></i>
            </div>
          </header>

          <aside className={`sidebar ${show ? 'show' : null} z-index-1`}>
            {/* SIDEBAR */}
            <SidebarProfil/>
            {/* FIN */}
          </aside>

          {/* CONTENU PROFIL */}
          <JtifDomicile/>
          {/* FIN */}

        </main>
    </>
  );
};

export default justificatifDomicile;
