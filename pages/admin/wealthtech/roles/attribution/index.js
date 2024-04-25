import React, { useState,useEffect } from 'react';
import SidebarWealthtech from '../../../../../components/admin/Sidebar/Sidebarwti';
import GestionRole from '../../../../../components/admin/Wealthtech/Roles/AttributionRole';



const index = () => {
  // Variable de l'url de l'api
  const API_URL =process.env.NEXT_PUBLIC_URL_API
   // Variable de l'api key de stablecoin
   const API_KEY_STABLECOIN = process.env.NEXT_PUBLIC_API_KEY_STABLECOIN

  const [showSidebar, setShowSidebar] = useState(false);

  const [currentUser, setCurrentUser] = useState();
    
  // Obtenir un utilisateur en fonction de son email 
  useEffect(() => {
    (async () => {

    const token = localStorage.getItem('tokenEnCours')

    const getUser = async () => {
      const result = await fetch(`${API_URL}/api/user/find-user-sign-in`, {
          headers: {
          'Content-Type': 'application/json',
          'x-api-key': `${API_KEY_STABLECOIN}`,
          Authorization:  `Bearer ${token}`,

          },
      })
        .then((result) => result.json())
        .then((user) => {

          if (user?.profileId==2 || user?.profileId==3) {
              setCurrentUser(user)
          }else{
              Router.push("/profil/"); 
              
          }
        }) 
    };
    await getUser();
  })();

  }, []);
  // Fin



  return (
    <>
  
      {/* {currentUser?.profileId==2 || currentUser?.profileId==3?( */}
          <main className={showSidebar ? 'space-toggle' : null}>
            <header className={`header ${showSidebar ? 'space-toggle' : null}`}>
              <div className='header-toggle mx-30' onClick={() => setShowSidebar(!showSidebar)}>
                <i className={`fas fa-bars text-white  ${showSidebar == "true"? 'fa-solid fa-xmark text-white ' : null}`}></i>
              </div>
            </header>

            <aside className={`sidebar ${showSidebar ? 'showSidebar' : null} z-index-1`}>
              {/* SIDEBAR */}
              <SidebarWealthtech/>
              {/* FIN */}
            </aside>

            {/* CONTENU PROFIL */}
            <GestionRole/>
            {/* FIN */}

          </main>
      {/* ):(
        <span className="text-center bg-default-2 btn-bottom-text  d-block gr-text-5 text-blackish-blue gr-opacity-10 my-35">
          <Loading/>
        </span>
      )} */}
  </>
  )
};

export default index;
