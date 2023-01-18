import React, { useState,useCallback,useEffect, useContext } from 'react';
import Link from "../../../components/Link";
import { Icon } from '@iconify/react';
import { useRouter } from "next/router";
import { magic } from "../../../magic";
import { ethers } from "ethers";

import Router from 'next/router';
import Dropdown from 'react-bootstrap/Dropdown';







const SidebarProfil = () => {
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
                  }) 
              };
              await getUser();
              // Fin
            }
        })();
    }, [provider, magic]);
    //  Fin

// FONCTION DE LA DECONNEXION
const logaout = useCallback(() => {
  try {
  magic.user.logout().then(() => {
    // supprimer le token
    localStorage.removeItem('tokenEnCours');
    // Actualisation et redirection
    setTimeout(() => {
      window.location.reload()
     }, 1000)
    Router.push("/");

  });
} catch (error) {
  console.log("une erreur s'est produit =>", error)
}
}, [Router]);
// FIN
  return (
    <>
        <nav className='nav'>
          <div>
            <Link to='/' className='nav-logo'>
            
            <div className="brand-logo ">
              <img src={"/images/ecfa/logo/logo_ewari1.jpg"} width={'120'} alt="" />
              {/* width={'120'} */}
            </div>
              {/* <span className='nav-logo-name text-white mx-18'>OOOO</span> */}
            </Link>

            <div className='nav-list'>
            {currentUser?.firstName && currentUser?.lastName ? (
                <span className='nav-link-icon text-white mx-1'>{currentUser?.firstName} {currentUser?.lastName}</span>
            ) :('')}
            {currentUser?.entreprise? (
                <span className='nav-link-icon text-white mx-1'>{currentUser?.entreprise}</span>
            ) :('')}
            <br/><span className='nav-link-icon text-white mx-18'>{currentUser?.email}</span>
            
            <Link to='/profil/' className={pathname == "/profil" ? "active nav-link my-1" : "nav-link my-1"}>
                <i className='fas fa-user nav-link-icon'></i>
                <span className='nav-link-name'>Mon compte</span>
            </Link>
            <Link to='/profil/dashboard/' className={pathname == "/profil/dashboard/" ? "active nav-link my-1" : "nav-link my-1"}>
                <i className='fas fa-tachometer-alt nav-link-icon'></i>
                <span className='nav-link-name'>Accueil</span>
            </Link>
            <Link to='/#' className={pathname == "/#" ? "active nav-link my-1" : "nav-link my-1"}>
                <i className='fas fa-tachometer-alt nav-link-icon'></i>
                <span className='nav-link-name'>Mes cartes</span>
            </Link>
            <Link to='/profil/kyc/' className={pathname == "/profil/kyc/" ? "active nav-link my-1" : "nav-link my-1"}>
                <i className='fas fa-tachometer-alt nav-link-icon'></i>
                <span className='nav-link-name'>KYC</span>
            </Link>
            <Dropdown>

                <Dropdown.Toggle variant="" className='text-white' id="dropdown-basic">
                    {/* <img className=' nav-link-icon rounded-circle bg-white ' src={"/image/lysfc/token_lys/nft.png"} alt="" width={20} height={20}  /> */}
                    <i className='fas fa-tachometer-alt nav-link-icon'></i>

                    <span className='nav-link-name gr-text-10 mx-2'>Ecosystème</span>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item href="/profil/ecosysteme/ecommerces">E-commerce</Dropdown.Item>
                    <Dropdown.Item href="/profil/ecosysteme/crowdfunding">Crowdfunding</Dropdown.Item>
                    <Dropdown.Item href="/profil/ecosysteme/investissement">Investissement</Dropdown.Item>
                    <Dropdown.Item href="/profil/ecosysteme/demarches-administ">Administratives</Dropdown.Item>
                    <Dropdown.Item href="/profil/ecosysteme/facture-paiement">Facture & Paiments</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
              
              {/* <Link to='/#' className={pathname == "/profil/portefeuille" ? "active nav-link my-1" : "nav-link my-1"}>
                <i className='fas fa-wallet nav-link-icon'></i>
                <span className='nav-link-name '>E-commerce</span>
              </Link>
              <Link to='/#' className={pathname == "/profil/portefeuille" ? "active nav-link my-1" : "nav-link my-1"}>
                <i className='fas fa-wallet nav-link-icon'></i>
                <span className='nav-link-name '>Crowdfunding</span>
              </Link>
              <Link to='/#' className={pathname == "/profil/portefeuille" ? "active nav-link my-1" : "nav-link my-1"}>
                <i className='fas fa-wallet nav-link-icon'></i>
                <span className='nav-link-name '>Investissement</span>
              </Link> */}
              
              <Link to='/#' className={pathname == "/#" ? "active nav-link my-1" : "nav-link my-1"}>
                <i className='fas fa-vote-yea nav-link-icon'></i>
                <span className='nav-link-name'>Mes services</span>
              </Link>

              <Link to='/profil/portefeuille' className={pathname == "/profil/portefeuille" ? "active nav-link my-1" : "nav-link my-1"}>
                <i className='fas fa-wallet nav-link-icon'></i>
                <span className='nav-link-name '>Mes actifs</span>
              </Link>

                {currentUser?.entreprise? (
                    <Link to='/profil/action/' className={pathname == "/profil/action/" ? "active nav-link my-1" : "nav-link my-1"}>
                        <i className='fas fa-vote-yea nav-link-icon'></i>
                        <span className='nav-link-name'>Mes actions</span>
                    </Link>
                ) :('')}
             
              {/* <Link 
                to='/profil/en-cours/' 
                className={pathname == "/profil/en-cours/" ? "active nav-link my-1" : "nav-link my-1"}
              >
                <i className='fas fa-shopping-cart nav-link-icon'></i>
                <span className='nav-link-name'></span>
              </Link>
              <Link 
                to='/profil/recompenses/' 
                className={pathname == "/profil/recompenses/" ? "active nav-link my-1" : "nav-link my-1"}
              >
                <i className='fas fa-trophy nav-link-icon'></i>
                <span className='nav-link-name'>Récompenses</span>
              </Link> */}

              {/* <Link 
                to='/admin/votes/allScrutin' 
                className={pathname == "/" ? "active nav-link my-1" : "nav-link my-1"}
              >
                <i className='fas fa-chalkboard-teacher nav-link-icon'></i>
                <span className='nav-link-name'>Espace lys</span>
              </Link> */}

              {/* Bouton de deconnexion */}
                <Link  onClick={logaout} className='nav-link'>
                    <Icon className=' nav-link-icon'width={25} icon="bx:log-out" />
                    <span className='nav-link-name'>Déconnexion</span>
                </Link>
            </div>
            
          </div>

         
        </nav>
    </>
  );
};

export default SidebarProfil;
