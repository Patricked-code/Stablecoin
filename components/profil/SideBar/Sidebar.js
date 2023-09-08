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


const [kycForEntreprise, setKycForEntreprise] = useState();
const [kycForParticular, setKycForParticular] = useState();


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



  // RECUPERER KYC DE L'UTILISATEUR
  useEffect(async() => {
    const token = localStorage.getItem('tokenEnCours')
    
        const getKycForParticular = async () => {
        const resKyc = await fetch(`${API_URL}/api/kyc/particular/find-kyc-particular-for-user`, {
            headers: {
            'Content-Type': 'application/json',
            Authorization:  `Bearer ${token}`,
            },
        })
            .then((resKyc) => resKyc.json())
            .then((data) => {
            setKycForParticular(data)
            }) 
        };
        // console.log("Banques =>",allBank)
        await getKycForParticular();
  }, []);
  // FIN





    // RECUPERER KYC DE L'ENTREPRISE
    useEffect(async() => {
        const token = localStorage.getItem('tokenEnCours')
        
            const getKycForEntreprise = async () => {
            const resKyc = await fetch(`${API_URL}/api/kyc/entreprise/find-kyc-entreprise-for-user`, {
                headers: {
                'Content-Type': 'application/json',
                Authorization:  `Bearer ${token}`,
                },
            })
                .then((resKyc) => resKyc.json())
                .then((data) => {
                setKycForEntreprise(data)
                }) 
            };
            // console.log("Banques =>",allBank)
            await getKycForEntreprise();
    }, []);
    // FIN

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
            </div>
            </Link>

            <div className='nav-list'>
            {!currentUser?.entreprise ? (
                <span className='nav-link-icon text-white mx-1'>{currentUser?.firstName} {currentUser?.lastName}</span>
            ) :('')}
            {currentUser?.entreprise? (
                <span className='nav-link-icon text-white mx-1'>{currentUser?.entreprise}</span>
            ) :('')}
            <br/><span className='nav-link-icon text-white mx-18'>{currentUser?.email}</span>
            
            
            <Link to='/profil/dashboard/' className={pathname == "/profil/dashboard/" ? "active-sidebar nav-link-sidebar my-1" : "nav-link-sidebar my-1"}>
                <i className='fas fa-tachometer-alt nav-link-icon'></i>
                <span className='nav-link-name'>Dashboard</span>
            </Link>

            <Link to='/profil/' className={pathname == "/profil" ? "active-sidebar nav-link-sidebar my-1" : "nav-link-sidebar my-1"}>
                <i className='fas fa-user nav-link-icon'></i>
                <span className='nav-link-name'>Mon compte</span>
            </Link>
            <Link to='/#' className={pathname == "/#" ? "active-sidebar nav-link-sidebar my-1" : "nav-link-sidebar my-1"}>
                <i className='fas fa-address-card nav-link-icon'></i>
                <span className='nav-link-name'>Mes cartes</span>
            </Link>

            {currentUser?.activated && currentUser?.codeTypeProfil==="part"? (
              <>
              {kycForParticular?.status==1 ? (
                <Link to='/profil/kyc/particulier/resultat-kyc/' className={pathname == "/profil/kyc/particulier/resultat-kyc/" ? "active-sidebar nav-link-sidebar my-1" : "nav-link-sidebar my-1"}>
                <i className='fas fa-tasks nav-link-icon'></i>
                <span className='nav-link-name'>KYC en attente</span>
              </Link>
              ) : (
                <>
                
              {kycForParticular?.quiz==1 && !kycForParticular?.quizTwo && !kycForParticular?.quizFatca && !kycForParticular?.identityOne && !kycForParticular?.identity==1 && !kycForParticular?.photoWithDocument==1 && !kycForParticular?.residence==1 && !kycForParticular?.photo==1? (
                <Link to='/profil/kyc/particulier/questionnaires-revenus-two/' className={pathname == "/profil/kyc/commun/signature/" ? "active-sidebar nav-link-sidebar my-1" : "nav-link-sidebar my-1"}>
                  <i className='fas fa-tasks nav-link-icon'></i>
                  <span className='nav-link-name'>KYC</span>
                </Link>
              ) :kycForParticular?.quiz==1 && kycForParticular?.quizTwo && !kycForParticular?.quizFatca && !kycForParticular?.identityOne && !kycForParticular?.identity==1 && !kycForParticular?.photoWithDocument==1 && !kycForParticular?.residence==1 && !kycForParticular?.photo==1? (
                <Link to='/profil/kyc/particulier/questionnaires-fatca/' className={pathname == "/profil/kyc/commun/signature/" ? "active-sidebar nav-link-sidebar my-1" : "nav-link-sidebar my-1"}>
                  <i className='fas fa-tasks nav-link-icon'></i>
                  <span className='nav-link-name'>KYC</span>
                </Link>
              ) :kycForParticular?.quiz==1 && kycForParticular?.quizTwo && kycForParticular?.quizFatca && !kycForParticular?.identityOne && !kycForParticular?.identity==1 && !kycForParticular?.photoWithDocument==1 && !kycForParticular?.residence==1 && !kycForParticular?.photo==1? (
                <Link to='/profil/kyc/particulier/justificatif-identite-one/' className={pathname == "/profil/kyc/particulier/seconde-phase/" ? "active-sidebar nav-link-sidebar my-1" : "nav-link-sidebar my-1"}>
                  <i className='fas fa-tasks nav-link-icon'></i>
                  <span className='nav-link-name'>KYC</span>
                </Link>
              ) :kycForParticular?.quiz==1 && kycForParticular?.quizTwo && kycForParticular?.quizFatca && kycForParticular?.identityOne && !kycForParticular?.identity==1 && !kycForParticular?.photoWithDocument==1 && !kycForParticular?.residence==1 && !kycForParticular?.photo==1? (
                <Link to='/profil/kyc/particulier/justificatif-identite-two/' className={pathname == "/profil/kyc/particulier/seconde-phase/" ? "active-sidebar nav-link-sidebar my-1" : "nav-link-sidebar my-1"}>
                  <i className='fas fa-tasks nav-link-icon'></i>
                  <span className='nav-link-name'>KYC</span>
                </Link>
              ) :kycForParticular?.quiz==1 && kycForParticular?.quizTwo && kycForParticular?.quizFatca && kycForParticular?.identityOne && kycForParticular?.identity==1 && !kycForParticular?.photoWithDocument==1 && !kycForParticular?.residence==1 && !kycForParticular?.photo==1? (
                <Link to='/profil/kyc/particulier/selfie-with-document/' className={pathname == "/profil/kyc/particulier/seconde-phase/" ? "active-sidebar nav-link-sidebar my-1" : "nav-link-sidebar my-1"}>
                  <i className='fas fa-tasks nav-link-icon'></i>
                  <span className='nav-link-name'>KYC</span>
                </Link>
              ) :kycForParticular?.quiz==1 && kycForParticular?.quizTwo && kycForParticular?.quizFatca && kycForParticular?.identityOne && kycForParticular?.identity==1 && kycForParticular?.photoWithDocument==1 && !kycForParticular?.residence==1 && !kycForParticular?.photo==1? (
                <Link to='/profil/kyc/particulier/justificatif-domicile/' className={pathname == "/profil/kyc/particulier/justificatif-domicile/" ? "active-sidebar nav-link-sidebar my-1" : "nav-link-sidebar my-1"}>
                  <i className='fas fa-tasks nav-link-icon'></i>
                  <span className='nav-link-name'>KYC</span>
                </Link>
              ) :kycForParticular?.quiz==1 && kycForParticular?.quizTwo && kycForParticular?.quizFatca && kycForParticular?.identityOne && kycForParticular?.identity==1 && kycForParticular?.photoWithDocument==1 && kycForParticular?.residence==1 && !kycForParticular?.photo==1? (
                <Link to='/profil/kyc/commun/selfie/' className={pathname == "/profil/kyc/commun/selfie/" ? "active-sidebar nav-link-sidebar my-1" : "nav-link-sidebar my-1"}>
                  <i className='fas fa-tasks nav-link-icon'></i>
                  <span className='nav-link-name'>KYC</span>
                </Link>
              ) :kycForParticular?.quiz==1 && kycForParticular?.quizTwo && kycForParticular?.quizFatca && kycForParticular?.identityOne && kycForParticular?.identity==1 && kycForParticular?.photoWithDocument==1 && kycForParticular?.residence==1 && kycForParticular?.photo==1? (
                  <Link to='/profil/kyc/commun/signature/' className={pathname == "/profil/kyc/commun/signature/" ? "active-sidebar nav-link-sidebar my-1" : "nav-link-sidebar my-1"}>
                    <i className='fas fa-tasks nav-link-icon'></i>
                    <span className='nav-link-name'>KYC</span>
                  </Link>
                
                ) : (
                  <Link to='/profil/kyc/particulier/questionnaires-revenus-one' className={pathname == "/profil/kyc/particulier/" ? "active-sidebar nav-link-sidebar my-1" : "nav-link-sidebar my-1"}>
                    <i className='fas fa-tasks nav-link-icon'></i>
                    <span className='nav-link-name'>KYC</span>
                  </Link>
                )}
              
              </>
              )}
              </>

            ) :('')}

            {currentUser?.activated && currentUser?.codeTypeProfil==="entCom"? (
              <>
                {kycForEntreprise?.status==1 ? (
                  <Link to='/profil/kyc/entreprise/resultat-kyc/' className={pathname == "/profil/kyc/entreprise/resultat-kyc/" ? "active-sidebar nav-link-sidebar my-1" : "nav-link-sidebar my-1"}>
                  <i className='fas fa-tasks nav-link-icon'></i>
                  <span className='nav-link-name'>KYC en attente</span>
                </Link>
                ) : (
                  <>
                  
                {kycForEntreprise?.quiz==1 && !kycForEntreprise?.legalDocuments==1 && !kycForEntreprise?.identity==1 && !kycForEntreprise?.residence==1 && !kycForEntreprise?.photo==1 && !kycForEntreprise?.signature==1 ? (
                  <Link to='/profil/kyc/entreprise/documents-legaux/' className={pathname == "/profil/kyc/entreprise/documents-legaux/" ? "active-sidebar nav-link-sidebar my-1" : "nav-link-sidebar my-1"}>
                    <i className='fas fa-tasks nav-link-icon'></i>
                    <span className='nav-link-name'>KYC</span>
                  </Link>
                ):kycForEntreprise?.quiz==1 && !kycForEntreprise?.identity==1 && !kycForEntreprise?.residence==1 && kycForEntreprise?.legalDocuments==1 && !kycForEntreprise?.photo==1 && !kycForEntreprise?.signature==1 ? (
                    <Link to='/profil/kyc/entreprise/justificatif-domicile/' className={pathname == "/profil/kyc/entreprise/justificatif-domicile/" ? "active-sidebar nav-link-sidebar my-1" : "nav-link-sidebar my-1"}>
                      <i className='fas fa-tasks nav-link-icon'></i>
                      <span className='nav-link-name'>KYC</span>
                    </Link>
                ):kycForEntreprise?.quiz==1 && kycForEntreprise?.legalDocuments==1 && kycForEntreprise?.residence==1 && !kycForEntreprise?.identity==1  && !kycForEntreprise?.photo==1 && !kycForEntreprise?.signature==1 ? (
                  <Link to='/profil/kyc/entreprise/justificatif-identite/' className={pathname == "/profil/kyc/entreprise/justificatif-identite/" ? "active-sidebar nav-link-sidebar my-1" : "nav-link-sidebar my-1"}>
                    <i className='fas fa-tasks nav-link-icon'></i>
                    <span className='nav-link-name'>KYC</span>
                  </Link>
                
                ):kycForEntreprise?.quiz==1 && kycForEntreprise?.legalDocuments==1 && kycForEntreprise?.identity==1 && kycForEntreprise?.residence==1 && !kycForEntreprise?.photo==1 && !kycForEntreprise?.signature==1 ? (
                  <Link to='/profil/kyc/commun/selfie/' className={pathname == "/profil/kyc/commun/selfie/" ? "active-sidebar nav-link-sidebar my-1" : "nav-link-sidebar my-1"}>
                    <i className='fas fa-tasks nav-link-icon'></i>
                    <span className='nav-link-name'>KYC</span>
                  </Link>
                ):kycForEntreprise?.quiz==1 && kycForEntreprise?.legalDocuments==1 && kycForEntreprise?.identity==1 && kycForEntreprise?.residence==1 && kycForEntreprise?.photo==1 && !kycForEntreprise?.signature==1 ? (
                  <Link to='/profil/kyc/commun/signature/' className={pathname == "/profil/kyc/commun/signature/" ? "active-sidebar nav-link-sidebar my-1" : "nav-link-sidebar my-1"}>
                    <i className='fas fa-tasks nav-link-icon'></i>
                    <span className='nav-link-name'>KYC</span>
                  </Link>
                ) : (
                  <Link to='/profil/kyc/entreprise/questionnaire' className={pathname == "/profil/kyc/entreprise/questionnaire" ? "active-sidebar nav-link-sidebar my-1" : "nav-link-sidebar my-1"}>
                    <i className='fas fa-tasks nav-link-icon'></i>
                    <span className='nav-link-name'>KYC</span>
                  </Link>
                )}
                </>
                )}
              </>
            ) :('')}

              {/* <Link to='/profil/portefeuille' className={pathname == "/profil/portefeuille" ? "active-sidebar nav-link-sidebar my-1" : "nav-link-sidebar my-1"}>
                <i className='fas fa-wallet nav-link-icon'></i>
                <span className='nav-link-name '>Mes actifs</span>
              </Link> */}

              <Link to='/profil/wallet/' className={pathname == "/profil/portefeuille" ? "active-sidebar nav-link-sidebar my-1" : "nav-link-sidebar my-1"}>
                <i className='fas fa-wallet nav-link-icon'></i>
                <span className='nav-link-name '>Portefeuille</span>
              </Link>

                {currentUser?.codeTypeProfil=="entCom" || currentUser?.codeTypeProfil=="insti"? (
                    <Link to='/profil/action/' className={pathname == "/profil/action/" ? "active-sidebar nav-link-sidebar my-1" : "nav-link-sidebar my-1"}>
                        <i className='fas fa-splotch nav-link-icon'></i>
                        <span className='nav-link-name'>Mes actions</span>
                    </Link>
                ) :('')}
             

             <Dropdown>
                <Dropdown.Toggle variant="" className='text-white' id="dropdown-basic">
                  <i className='fas fa-archive nav-link-icon mr-1 ml-0'></i> {" "}
                  <span className='nav-link-name  mx-4'>{" "}Ecosystème</span>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item href="/profil/ecosysteme/ecommerces">E-commerce</Dropdown.Item>
                    <Dropdown.Item href="/profil/ecosysteme/crowdfunding">Crowdfunding</Dropdown.Item>
                    <Dropdown.Item href="/profil/ecosysteme/investissement">Investissement</Dropdown.Item>
                    <Dropdown.Item href="/profil/ecosysteme/demarches-administ">Administratives</Dropdown.Item>
                    <Dropdown.Item href="/profil/ecosysteme/facture-paiement">Facture & Paiments</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>

              {/* Bouton de deconnexion */}
                <Link  onClick={logaout} className='nav-link-sidebar'>
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

export default SidebarProfil;
