import React, { useState,useCallback,useEffect, useContext } from 'react';
import Link from "../../Link";
import { Icon } from '@iconify/react';
import { useRouter } from "next/router";
import { magic } from "../../../magic";
import { ethers } from "ethers";

import Router from 'next/router';
import Dropdown from 'react-bootstrap/Dropdown';







const SidebarWealthtech = () => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API

// LES ELEMENTS DE LA ROUTE
const router = useRouter();
const { pathname } = router;
// FIN


const [currentUser, setCurrentUser] = useState();
const [provider, setProvider] = useState(null);



    useEffect(() => {

        if (!!magic) {
            const pt = new ethers.providers.Web3Provider(magic.rpcProvider);
            setProvider(pt);
        }
    }, [magic]);

    // RECUPERATION DES INFORMATIONS QUI CONCERNENT MAGIC
    useEffect(() => {
        (async () => {
            if (!!magic && !!provider) {
              const userMetadatas = await magic.user.getMetadata();
              const signer = provider.getSigner();
              const network = await provider.getNetwork();
              const userAddress = await signer.getAddress();
              //const userBalance = ethers.utils.formatEther(await provider.getBalance(userAddress))
              // FIN

              // Obtenir un utilisateur en fonction de son email 
              const getUser = async () => {
                const result = await fetch(`${API_URL}/api/user/find-user-by-email?email=${userMetadatas?.email}`, {
                    headers: {
                    'Content-Type': 'application/json',
                    },
                })
                  .then((result) => result.json())
                  .then((user) => {
                  setCurrentUser(user)

                  localStorage.setItem('currentTypeProfil', user?.codeTypeProfil); //Pour stocker le code du type de profil dans la variable local

                  }) 
              };
              await getUser();
              // Fin

              if (!userAddress) {
                Router.push("/auth/authentication/")
              }
            }else{
              
            }
        })();
    }, [provider, magic]);
    //  Fin




/**
   * FONCTION DE DECONNEXION SUR MAGIC ET SUR LE SITE.
   */
 const logout = useCallback(() => {
  magic.user.logout().then(() => {
    // supprimer le token
    localStorage.removeItem('tokenEnCours');
    Swal.fire({
      position: 'center',
      icon: 'error',
      html: `<p>Vous êtes déconnecté </p>` ,
      showConfirmButton: false,
      timer: 5000
  })
    setTimeout(() => {
      window.location.reload()
     }, 5000)
    Router.push("/");
  });
}, [Router]);

 // Obtenir l'utilisateur qui est connecté
 useEffect(() => {
  (async () => {
      const token = localStorage.getItem('tokenEnCours') //Le token récuperé

      const getUser = async () => {
      const result = await fetch(`${API_URL}/api/user/find-user-sign-in`, {
          headers: {
          'Content-Type': 'application/json',
          Authorization:  `Bearer ${token}`

          },
      })
      .then((result) => result.json())
      .then((user) => {
      
      console.log('Auth', user)
      // On verifie si l'utilisateur est deconnecté du site
        if (user?.message==="Accès non autorisé") {
          logout() //Appel de la fonction de déconnexion à magic
        }
      }) 
      };
      await getUser();
      // Fin

  })();
}, []);
// Fin

  return (
    <>
        <nav className='nav'>
          <div>
            <Link to='/' className='nav-logo'>
            
            <div className="brand-logo ">
              <img src={"/images/ecfa/logo/logo_ewari1.jpg"} width={'120'} alt="" />
            </div>
            </Link>

            <div className='nav-list'>
            {!currentUser?.entreprise? (
                <span className='nav-link-icon text-white mx-1'>{currentUser?.firstName} {currentUser?.lastName}</span>
            ) :('')}
            {currentUser?.entreprise? (
                <span className='nav-link-icon text-white mx-1'>{currentUser?.entreprise}</span>
            ) :('')}
            <br/><span className='nav-link-icon text-white mx-18'>{currentUser?.email}</span>
            
            
            <Link to='/admin/wealthtech/' className={pathname == "/admin/wealthtech/" ? "active-sidebar nav-link-sidebar my-1" : "nav-link-sidebar my-1"}>
                <i className='fas fa-tachometer-alt nav-link-icon'></i>
                <span className='nav-link-name'>Dashboard</span>
            </Link>

            <Link to='/profil/' className={pathname == "/profil" ? "active-sidebar nav-link-sidebar my-1" : "nav-link-sidebar my-1"}>
                <i className='fas fa-user nav-link-icon'></i>
                <span className='nav-link-name'>Mon compte</span>
            </Link>
            <Link to='/admin/wealthtech/stablecoin' className={pathname == "/admin/wealthtech/stablecoin" ? "active-sidebar nav-link-sidebar my-1" : "nav-link-sidebar my-1"}>
                <i className='fas fa-address-card nav-link-icon'></i>
                <span className='nav-link-name'>Stablecoin</span>
            </Link>

      
            <Link to='/admin/wealthtech/kyc/' className={pathname == "/admin/wealthtech/kyc/" ? "active-sidebar nav-link-sidebar my-1" : "nav-link-sidebar my-1"}>
              <i className='fas fa-tasks nav-link-icon'></i>
              <span className='nav-link-name'>Kyc</span>
            </Link>
            

              {/* Bouton de deconnexion */}
                <Link  onClick={logout} className='nav-link-sidebar'>
                    <Icon className=' nav-link-icon'width={20} icon="bx:log-out" />
                {/* <i className='fas fa-log-out nav-link-icon'></i> */}

                    <span className='nav-link-name'>Déconnexion</span>
                </Link>
            </div>
            
          </div>

         
        </nav>
    </>
  );
};

export default SidebarWealthtech;
