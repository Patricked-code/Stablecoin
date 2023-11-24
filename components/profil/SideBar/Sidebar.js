import React, { useState,useCallback,useEffect, useContext } from 'react';
import Link from "../../../components/Link";
import { Icon } from '@iconify/react';
import { useRouter } from "next/router";
import { magic } from "../../../magic";
import { ethers } from "ethers";
import Swal from 'sweetalert2';


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


const [kycForEntreprise, setKycForEntreprise] = useState(); // States du Kyc entreprise
const [kycForParticular, setKycForParticular] = useState(); // States du Kyc  particulier

// States des documents legaux de l'entreprise
const [kycBusinessLegalDocument, setKycBusinessLegalDocument] = useState();
const [kycBusinessIdentity, setKycBusinessIdentity] = useState();
const [kycBusinessRepresentative, setKycBusinessRepresentative] = useState();
const [kycBusinessBeneficiary, setKycBusinessBeneficiary] = useState();
const [kycBusinessStructure, setKycBusinessStructure] = useState();
const [kycBusinessPoliticallyExposed, setKycBusinessPoliticallyExposed] = useState();
const [kycBusinessFinancialOperationIds, setKycBusinessFinancialOperationIds] = useState();
const [kycBusinessFundOriginIds, setKycBusinessFundOriginIds] = useState();

const [kycBusinessFinancialMontly, setKycBusinessFinancialMontly] = useState();
const [kycBusinessFinancialQuarterly, setKycBusinessFinancialQuarterly] = useState();
const [kycBusinessFinancialAnnual, setKycBusinessFinancialAnnual] = useState();
const [kycBusinessTransactionMontly, setKycBusinessTransactionMontly] = useState();
const [kycBusinessTransactionAnnual, setKycBusinessTransactionAnnual] = useState();


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
   * Perform logout action via Magic.
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



    const [timeoutId, setTimeoutId] = useState(null);
    // Fonction pour gérer l'inactivité
    // const resetInactivityTimeout = () => {
    //   clearTimeout(timeoutId);
    //   setTimeout(() => {
    //     setTimeoutId(prevTimeoutId => {
    //       handleInactive(); 
    //       return prevTimeoutId;
    //     });
    //   }, 172800000);
    // };
  
    
  
    // const handleInactive = () => {
    //   Swal.fire({
    //     title: 'Déconnexion automatique',
    //     html: 'Vous serez déconnecté dans <b></b> secondes.<br><button id="stayConnected">Rester connecté</button>',
    //     timer: 172800000, // 120000 = 2 minutes en millisecondes
    //     timerProgressBar: true,
    //     didOpen: () => {
    //       Swal.showLoading();
    //       const b = Swal.getHtmlContainer().querySelector('b');
    //       const stayConnectedButton = document.getElementById('stayConnected');
  
    //       stayConnectedButton.addEventListener('click', () => {
    //         clearTimeout(timeoutId); // Correction ici
    //         Swal.close();
    //         resetInactivityTimeout(); // Réinitialiser le délai après avoir choisi de rester connecté
    //       });
  
    //       const timerInterval = setInterval(() => {
    //         const timeLeft = Swal.getTimerLeft();
    //         if (timeLeft > 0) {
    //           b.textContent = (timeLeft / 1000).toFixed(0);
    //         } else {
    //           clearInterval(timerInterval);
    //           logout();
    //         }
    //       }, 100);
    //     },
    //     willClose: () => {
    //       clearTimeout(timeoutId); // Correction ici
    //     }
    //   });
    // };
  
  
    // useEffect(() => {
    //   const startInactivityTimeout = () => {
    //     const newTimeoutId = setTimeout(() => {
    //       setTimeoutId(prevTimeoutId => {
    //         handleInactive();
    //         return prevTimeoutId;
    //       });
    //     }, 172800000);
    //     setTimeoutId(newTimeoutId);
    //   };
  
    //   document.addEventListener('mousemove', resetInactivityTimeout);
    //   document.addEventListener('keydown', resetInactivityTimeout);
  
    //   startInactivityTimeout(); // Démarrer le délai initial lors du rendu initial
  
    //   return () => {
    //     document.removeEventListener('mousemove', resetInactivityTimeout);
    //     document.removeEventListener('keydown', resetInactivityTimeout);
    //     clearTimeout(timeoutId);
    //   };
    // }, [resetInactivityTimeout, timeoutId]);
    

// FIN











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
        await getKycForParticular();
  }, []);
  // FIN





    // RECUPERER KYC DE L'ENTREPRISE
    useEffect(async() => {
        const token = localStorage.getItem('tokenEnCours')
        
            const getKycForEntreprise = async () => {
            const resKyc = await fetch(`${API_URL}/api/kyc/business/find-kyc-of-user`, {
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















// RECUPERER LES DONNEES DU KYC SUR L'IDENTITE DE L'ENTREPRISE CONNECTEE
useEffect(async() => {
  const token = localStorage.getItem('tokenEnCours')
  
      const getKycBusinessIdentity = async () => {
      const resKyc = await fetch(`${API_URL}/api/kyc/business/find-kyc-business-identity-of-user-signIn`, {
          headers: {
          'Content-Type': 'application/json',
          Authorization:  `Bearer ${token}`,
          },
      })
          .then((resKyc) => resKyc.json())
          .then((data) => {
          setKycBusinessIdentity(data)

          }) 
      };
      await getKycBusinessIdentity();
}, []);
// FIN


// RECUPERER LES DONNEES DU KYC DES REPRESENTANTS DE L'ENTREPRISE CONNECTEE
useEffect(async() => {
  const token = localStorage.getItem('tokenEnCours')
  
      const getKycBusinessRepresentative = async () => {
      const resKyc = await fetch(`${API_URL}/api/kyc/business/find-kyc-business-representative-of-user-signIn`, {
          headers: {
          'Content-Type': 'application/json',
          Authorization:  `Bearer ${token}`,
          },
      })
          .then((resKyc) => resKyc.json())
          .then((data) => {
          setKycBusinessRepresentative(data)
          

          }) 
      };
      await getKycBusinessRepresentative();
}, []);
// FIN


// RECUPERER LES DONNEES DU KYC DU BENEFIAIRE EFFECTIF DE L'ENTREPRISE CONNECTEE
useEffect(async() => {
  const token = localStorage.getItem('tokenEnCours')
  
      const getKycBusinessBeneficiary = async () => {
      const resKyc = await fetch(`${API_URL}/api/kyc/business/find-kyc-business-beneficiary-of-user-signIn`, {
          headers: {
          'Content-Type': 'application/json',
          Authorization:  `Bearer ${token}`,
          },
      })
          .then((resKyc) => resKyc.json())
          .then((data) => {
          setKycBusinessBeneficiary(data)
          }) 
      };
      await getKycBusinessBeneficiary();
}, []);
// FIN


// RECUPERER LES DONNEES DU KYC DE STRUCTURE DE CONTROL DE L'ENTREPRISE CONNECTEE
useEffect(async() => {
  const token = localStorage.getItem('tokenEnCours')
  
      const getKycBusinessStructure = async () => {
      const resKyc = await fetch(`${API_URL}/api/kyc/business/find-kyc-business-structure-of-user-signIn`, {
          headers: {
          'Content-Type': 'application/json',
          Authorization:  `Bearer ${token}`,
          },
      })
          .then((resKyc) => resKyc.json())
          .then((data) => {
          setKycBusinessStructure(data)
          }) 
      };
      await getKycBusinessStructure();
}, []);
// FIN


// RECUPERER LES DONNEES DU KYC DE POLITIQUEMENT EXPOSEE DE L'ENTREPRISE CONNECTEE
useEffect(async() => {
  const token = localStorage.getItem('tokenEnCours')
  
      const getKycBusinessPoliticallyExposed = async () => {
      const resKyc = await fetch(`${API_URL}/api/kyc/business/find-kyc-business-politically-exposed-of-user-signIn`, {
          headers: {
          'Content-Type': 'application/json',
          Authorization:  `Bearer ${token}`,
          },
      })
          .then((resKyc) => resKyc.json())
          .then((data) => {
          setKycBusinessPoliticallyExposed(data)

          }) 
      };
      await getKycBusinessPoliticallyExposed();
}, []);
// FIN


// FONCTION POUR RECUPERER LES DONNEES DES OPERATIONS FINANCIERES ET DEFINIR LES IDENTIFIANTS
const getKycBusinessFinancialOperation = async () => {
  const token = localStorage.getItem('tokenEnCours') //Le token récuperé

  try {
      const response = await fetch(`${API_URL}/api/kyc/business/find-kyc-business-financial-operation-of-user-signIn`,{
          headers: {
              'Content-Type': 'application/json',
              Authorization:  `Bearer ${token}`
          },
      });
      const data = await response.json();

      // Extract IDs and set to state
      const ids = data.map(item => item.id);
      setKycBusinessFinancialOperationIds(ids);
  } catch (error) {
      console.error(error);
  }
};

// Appelez getFinancialOperationData lors du montage du composant
useEffect(() => {
  getKycBusinessFinancialOperation();
}, []);
// FIN


// FONCTION POUR RECUPERER LES DONNEES DES OPERATIONS FINANCIERES ET DEFINIR LES IDENTIFIANTS
const getKycBusinessFundOriginIds = async () => {
  const token = localStorage.getItem('tokenEnCours') //Le token récuperé

  try {
      const response = await fetch(`${API_URL}/api/kyc/business/find-kyc-business-fund-origin-of-user-signIn`,{
          headers: {
              'Content-Type': 'application/json',
              Authorization:  `Bearer ${token}`
          },
      });
      const data = await response.json();

      // Extract IDs and set to state
      const ids = data.map(item => item.id);
      setKycBusinessFundOriginIds(ids);

  } catch (error) {
      console.error(error);
  }
};

// Appelez getFundOriginIdsData lors du montage du composant
useEffect(() => {
  getKycBusinessFundOriginIds();
}, []);
// FIN


// RECUPERER LES DONNEES DU KYC DE FINANCEMENT INFORMATIQUE (MENSUELLE) DE L'ENTREPRISE CONNECTEE 
useEffect(async() => {
  const token = localStorage.getItem('tokenEnCours')
  
      const getKycBusinessFinancialMontly = async () => {
      const resKyc = await fetch(`${API_URL}/api/kyc/business/find-kyc-business-financial-monthly-of-user-signIn`, {
          headers: {
          'Content-Type': 'application/json',
          Authorization:  `Bearer ${token}`,
          },
      })
          .then((resKyc) => resKyc.json())
          .then((data) => {
          setKycBusinessFinancialMontly(data)

          }) 
      };
      await getKycBusinessFinancialMontly();
}, []);
// FIN


// RECUPERER LES DONNEES DU KYC DE FINANCEMENT INFORMATIQUE (TRIMESTRIELLE) DE L'ENTREPRISE CONNECTEE 
useEffect(async() => {
  const token = localStorage.getItem('tokenEnCours')
  
      const getKycBusinessFinancialQuarterly = async () => {
      const resKyc = await fetch(`${API_URL}/api/kyc/business/find-kyc-business-financial-quarterly-of-user-signIn`, {
          headers: {
          'Content-Type': 'application/json',
          Authorization:  `Bearer ${token}`,
          },
      })
          .then((resKyc) => resKyc.json())
          .then((data) => {
          setKycBusinessFinancialQuarterly(data)
          }) 
      };
      await getKycBusinessFinancialQuarterly();
}, []);
// FIN

// RECUPERER LES DONNEES DU KYC DE FINANCEMENT INFORMATIQUE (ANNUELLE) DE L'ENTREPRISE CONNECTEE 
useEffect(async() => {
  const token = localStorage.getItem('tokenEnCours')
  
      const getKycBusinessFinancialAnnual = async () => {
      const resKyc = await fetch(`${API_URL}/api/kyc/business/find-kyc-business-financial-annual-of-user-signIn`, {
          headers: {
          'Content-Type': 'application/json',
          Authorization:  `Bearer ${token}`,
          },
      })
          .then((resKyc) => resKyc.json())
          .then((data) => {
          setKycBusinessFinancialAnnual(data)

          }) 
      };
      await getKycBusinessFinancialAnnual();
}, []);
// FIN

// RECUPERER LES DONNEES DU KYC DE FINANCEMENT TRANSACTION (MENSUELLE) DE L'ENTREPRISE CONNECTEE 
useEffect(async() => {
  const token = localStorage.getItem('tokenEnCours')
  
      const getKycBusinessTransactionMontly = async () => {
      const resKyc = await fetch(`${API_URL}/api/kyc/business/find-kyc-business-transaction-monthly-of-user-signIn`, {
          headers: {
          'Content-Type': 'application/json',
          Authorization:  `Bearer ${token}`,
          },
      })
          .then((resKyc) => resKyc.json())
          .then((data) => {
          setKycBusinessTransactionMontly(data)
          }) 
      };
      await getKycBusinessTransactionMontly();
}, []);
// FIN

// RECUPERER LES DONNEES DU KYC DE FINANCEMENT TRANSACTION (MENSUELLE) DE L'ENTREPRISE CONNECTEE 
useEffect(async() => {
  const token = localStorage.getItem('tokenEnCours')
  
      const getKycBusinessTransactionAnnual = async () => {
      const resKyc = await fetch(`${API_URL}/api/kyc/business/find-kyc-business-transaction-annual-of-user-signIn`, {
          headers: {
          'Content-Type': 'application/json',
          Authorization:  `Bearer ${token}`,
          },
      })
          .then((resKyc) => resKyc.json())
          .then((data) => {
          setKycBusinessTransactionAnnual(data)
          }) 
      };
      await getKycBusinessTransactionAnnual();
}, []);
// FIN

















// RECUPERER LES DONNEES DU KYC DES DOCUMENTS LEGAUX DE L'ENTREPRISE CONNECTEE
useEffect(async() => {
  const token = localStorage.getItem('tokenEnCours')
  
      const getKycBusinessDocument = async () => {
      const resKyc = await fetch(`${API_URL}/api/kyc/business/find-kyc-business-legal-documents-of-user-signIn`, {
          headers: {
          'Content-Type': 'application/json',
          Authorization:  `Bearer ${token}`,
          },
      })
          .then((resKyc) => resKyc.json())
          .then((data) => {
          setKycBusinessLegalDocument(data)

          }) 
      };
      await getKycBusinessDocument();
}, []);
// FIN












  return (
    <>
        <nav className='nav nav-list'>
          <div>
            <Link to='/' className='nav-logo'>
            
            <div className="brand-logo ">
              <img src={"/images/ecfa/logo/logo_ewari1.jpg"} width={'120'} alt="" />
            </div>
            </Link>

            <div className='nav-list'>
            {!currentUser?.entreprise ? (
                <span className='nav-link-icon text-white mx-1'>{currentUser?.lastName} {currentUser?.firstName}</span>
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
            {currentUser?.activated && currentUser?.codeTypeProfil==="insti"? (
              <>
                <Link to='/profil/institution/kyc-digital' className={pathname == "/profil/institution/Kyc-digital" ? "active-sidebar nav-link-sidebar my-1" : "nav-link-sidebar my-1"}>
                    <i className='fas fa-address-card nav-link-icon'></i>
                    <span className='nav-link-name'>Kyc digital</span>
                </Link>

                <Link to='/profil/institution/gestion-stablecoin' className={pathname == "/profil/institution/gestion-stablecoin" ? "active-sidebar nav-link-sidebar my-1" : "nav-link-sidebar my-1"}>
                  <i className='fas fa-address-card nav-link-icon'></i>
                  <span className='nav-link-name'>Gestion</span>
                </Link>
              </>
            ):(
              <Link to='/#' className={pathname == "/#" ? "active-sidebar nav-link-sidebar my-1" : "nav-link-sidebar my-1"}>
                  <i className='fas fa-address-card nav-link-icon'></i>
                  <span className='nav-link-name'>Mes cartes</span>
              </Link>
            )}

            {/* Pour le palcement des liens des différentes pages du kyc particulaire en fonction de là ou le remplisage s'est arrêté */}
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
            {/* Fin */}




            {/* Pour le palcement des liens des différentes pages du kyc entreprise en fonction de là ou le remplisage s'est arrêté */}
            {currentUser?.activated && currentUser?.codeTypeProfil==="entCom"? (
              <>
                {kycBusinessLegalDocument?.status==1 ? (
                  <Link to='/profil/kyc/entreprise/resultat-kyc/' className={pathname == "/profil/kyc/entreprise/resultat-kyc/" ? "active-sidebar nav-link-sidebar my-1" : "nav-link-sidebar my-1"}>
                    <i className='fas fa-tasks nav-link-icon'></i>
                    <span className='nav-link-name'>KYC en attente</span>
                  </Link>
                ) : (
                  <>
                  
                    {kycForEntreprise?.quiz==1 && 
                      !kycForEntreprise?.quizTwo==1 && 
                      !kycForEntreprise?.quizThree==1 && 
                      !kycForEntreprise?.quizFour==1 && 
                      !kycBusinessIdentity?.identity==1 ?
                      // !kycForEntreprise?.numberRepresentatives &&
                      // !kycForEntreprise?.numberRepresentatives==kycBusinessRepresentative?.length &&
                      // !kycForEntreprise?.numberBeneficial &&
                      // !kycForEntreprise?.numberBeneficial==kycBusinessBeneficiary?.length &&
                      // !kycForEntreprise?.numberAssociates &&
                      // !kycForEntreprise?.numberAssociates==kycBusinessStructure?.length &&
                      // !kycForEntreprise?.numberPoliticallyExposed &&
                      // !kycForEntreprise?.numberPoliticallyExposed==kycBusinessPoliticallyExposed?.length &&
                      // kycBusinessFinancialOperationIds?.length===0  &&
                      // kycBusinessFundOriginIds?.length===0  &&
                      // !kycBusinessFinancialMontly?.financialInformation==1 && 
                      // !kycBusinessFinancialQuarterly?.financialInformation==1 && 
                      // !kycBusinessFinancialAnnual?.financialInformation==1 && 
                      // !kycBusinessTransactionMontly?.financialTransaction==1 && 
                      // !kycBusinessTransactionAnnual?.financialTransaction==1 ?
                    (
                      <Link to='/profil/kyc/entreprise/questionnaire-aml-two' className={pathname == "/profil/kyc/entreprise/questionnaire-aml-two" ? "active-sidebar nav-link-sidebar my-1" : "nav-link-sidebar my-1"}>
                        <i className='fas fa-tasks nav-link-icon'></i>
                        <span className='nav-link-name'>KYC</span>
                      </Link>
                    ):kycForEntreprise?.quiz==1 && 
                      kycForEntreprise?.quizTwo==1 && 
                      !kycForEntreprise?.quizThree==1 && 
                      !kycForEntreprise?.quizFour==1 && 
                      !kycBusinessIdentity?.identity==1 ?
                      // !kycForEntreprise?.numberRepresentatives &&
                      // !kycForEntreprise?.numberRepresentatives==kycBusinessRepresentative?.length &&
                      // !kycForEntreprise?.numberBeneficial &&
                      // !kycForEntreprise?.numberBeneficial==kycBusinessBeneficiary?.length &&
                      // !kycForEntreprise?.numberAssociates &&
                      // !kycForEntreprise?.numberAssociates==kycBusinessStructure?.length &&
                      // !kycForEntreprise?.numberPoliticallyExposed &&
                      // !kycForEntreprise?.numberPoliticallyExposed==kycBusinessPoliticallyExposed?.length &&
                      // kycBusinessFinancialOperationIds?.length===0  &&
                      // kycBusinessFundOriginIds?.length===0  &&
                      // !kycBusinessFinancialMontly?.financialInformation==1 && 
                      // !kycBusinessFinancialQuarterly?.financialInformation==1 && 
                      // !kycBusinessFinancialAnnual?.financialInformation==1 && 
                      // !kycBusinessTransactionMontly?.financialTransaction==1 && 
                      // !kycBusinessTransactionAnnual?.financialTransaction==1 ?
                    (
                      <Link to='/profil/kyc/entreprise/questionnaire-aml-three' className={pathname == "/profil/kyc/entreprise/questionnaire-aml-three" ? "active-sidebar nav-link-sidebar my-1" : "nav-link-sidebar my-1"}>
                        <i className='fas fa-tasks nav-link-icon'></i>
                        <span className='nav-link-name'>KYC</span>
                      </Link>
                    ):kycForEntreprise?.quiz==1 && 
                      kycForEntreprise?.quizTwo==1 && 
                      kycForEntreprise?.quizThree==1 && 
                      !kycForEntreprise?.quizFour==1 && 
                      !kycBusinessIdentity?.identity==1 ?
                      // !kycForEntreprise?.numberRepresentatives &&
                      // !kycForEntreprise?.numberRepresentatives==kycBusinessRepresentative?.length &&
                      // !kycForEntreprise?.numberBeneficial &&
                      // !kycForEntreprise?.numberBeneficial==kycBusinessBeneficiary?.length &&
                      // !kycForEntreprise?.numberAssociates &&
                      // !kycForEntreprise?.numberAssociates==kycBusinessStructure?.length &&
                      // !kycForEntreprise?.numberPoliticallyExposed &&
                      // !kycForEntreprise?.numberPoliticallyExposed==kycBusinessPoliticallyExposed?.length &&
                      // kycBusinessFinancialOperationIds?.length===0  &&
                      // kycBusinessFundOriginIds?.length===0  &&
                      // !kycBusinessFinancialMontly?.financialInformation==1 && 
                      // !kycBusinessFinancialQuarterly?.financialInformation==1 && 
                      // !kycBusinessFinancialAnnual?.financialInformation==1 && 
                      // !kycBusinessTransactionMontly?.financialTransaction==1 && 
                      // !kycBusinessTransactionAnnual?.financialTransaction==1 ?
                    (
                      <Link to='/profil/kyc/entreprise/questionnaire-aml-four' className={pathname == "/profil/kyc/entreprise/questionnaire-aml-four" ? "active-sidebar nav-link-sidebar my-1" : "nav-link-sidebar my-1"}>
                        <i className='fas fa-tasks nav-link-icon'></i>
                        <span className='nav-link-name'>KYC</span>
                      </Link>
                    ):kycForEntreprise?.quiz==1 && 
                      kycForEntreprise?.quizTwo==1 && 
                      kycForEntreprise?.quizThree==1 && 
                      kycForEntreprise?.quizFour==1 && 
                      !kycBusinessIdentity?.identity==1 ?
                      // !kycForEntreprise?.numberRepresentatives &&
                      // !kycForEntreprise?.numberRepresentatives==kycBusinessRepresentative?.length &&
                      // !kycForEntreprise?.numberBeneficial &&
                      // !kycForEntreprise?.numberBeneficial==kycBusinessBeneficiary?.length &&
                      // !kycForEntreprise?.numberAssociates &&
                      // !kycForEntreprise?.numberAssociates==kycBusinessStructure?.length &&
                      // !kycForEntreprise?.numberPoliticallyExposed &&
                      // !kycForEntreprise?.numberPoliticallyExposed==kycBusinessPoliticallyExposed?.length &&
                      // kycBusinessFinancialOperationIds?.length===0  &&
                      // kycBusinessFundOriginIds?.length===0  &&
                      // !kycBusinessFinancialMontly?.financialInformation==1 && 
                      // !kycBusinessFinancialQuarterly?.financialInformation==1 && 
                      // !kycBusinessFinancialAnnual?.financialInformation==1 && 
                      // !kycBusinessTransactionMontly?.financialTransaction==1 && 
                      // !kycBusinessTransactionAnnual?.financialTransaction==1 ?
                    (
                      <Link to='/profil/kyc/entreprise/identite-one' className={pathname == "/profil/kyc/entreprise/identite-one" ? "active-sidebar nav-link-sidebar my-1" : "nav-link-sidebar my-1"}>
                        <i className='fas fa-tasks nav-link-icon'></i>
                        <span className='nav-link-name'>KYC</span>
                      </Link>
                    ):kycForEntreprise?.quiz==1 && 
                      kycForEntreprise?.quizTwo==1 && 
                      kycForEntreprise?.quizThree==1 && 
                      kycForEntreprise?.quizFour==1 && 
                      kycBusinessIdentity?.identity==1 &&
                      !kycForEntreprise?.numberRepresentatives ?
                      // !kycForEntreprise?.numberRepresentatives==kycBusinessRepresentative?.length &&
                      // !kycForEntreprise?.numberBeneficial &&
                      // !kycForEntreprise?.numberBeneficial==kycBusinessBeneficiary?.length &&
                      // !kycForEntreprise?.numberAssociates &&
                      // !kycForEntreprise?.numberAssociates==kycBusinessStructure?.length &&
                      // !kycForEntreprise?.numberPoliticallyExposed &&
                      // !kycForEntreprise?.numberPoliticallyExposed==kycBusinessPoliticallyExposed?.length &&
                      // kycBusinessFinancialOperationIds?.length===0  &&
                      // kycBusinessFundOriginIds?.length===0  &&
                      // !kycBusinessFinancialMontly?.financialInformation==1 && 
                      // !kycBusinessFinancialQuarterly?.financialInformation==1 && 
                      // !kycBusinessFinancialAnnual?.financialInformation==1 && 
                      // !kycBusinessTransactionMontly?.financialTransaction==1 && 
                      // !kycBusinessTransactionAnnual?.financialTransaction==1 ?
                    (
                      <Link to='/profil/kyc/entreprise/identite-representant-one' className={pathname == "/profil/kyc/entreprise/identite-representant-one" ? "active-sidebar nav-link-sidebar my-1" : "nav-link-sidebar my-1"}>
                        <i className='fas fa-tasks nav-link-icon'></i>
                        <span className='nav-link-name'>KYC</span>
                      </Link>
                    ):kycForEntreprise?.quiz==1 && 
                      kycForEntreprise?.quizTwo==1 && 
                      kycForEntreprise?.quizThree==1 && 
                      kycForEntreprise?.quizFour==1 && 
                      kycBusinessIdentity?.identity==1 &&
                      kycForEntreprise?.numberRepresentatives &&
                      !kycForEntreprise?.numberRepresentatives==kycBusinessRepresentative?.length ?
                      // !kycForEntreprise?.numberBeneficial &&
                      // !kycForEntreprise?.numberBeneficial==kycBusinessBeneficiary?.length &&
                      // !kycForEntreprise?.numberAssociates &&
                      // !kycForEntreprise?.numberAssociates==kycBusinessStructure?.length &&
                      // !kycForEntreprise?.numberPoliticallyExposed &&
                      // !kycForEntreprise?.numberPoliticallyExposed==kycBusinessPoliticallyExposed?.length &&
                      // kycBusinessFinancialOperationIds?.length===0  &&
                      // kycBusinessFundOriginIds?.length===0 &&
                      // !kycBusinessFinancialMontly?.financialInformation==1 && 
                      // !kycBusinessFinancialQuarterly?.financialInformation==1 && 
                      // !kycBusinessFinancialAnnual?.financialInformation==1 && 
                      // !kycBusinessTransactionMontly?.financialTransaction==1 && 
                      // !kycBusinessTransactionAnnual?.financialTransaction==1 ?
                    (
                      <Link to='/profil/kyc/entreprise/identite-representant-two' className={pathname == "/profil/kyc/entreprise/identite-representant-two" ? "active-sidebar nav-link-sidebar my-1" : "nav-link-sidebar my-1"}>
                        <i className='fas fa-tasks nav-link-icon'></i>
                        <span className='nav-link-name'>KYC</span>
                      </Link>
                    ):kycForEntreprise?.quiz==1 && 
                      kycForEntreprise?.quizTwo==1 && 
                      kycForEntreprise?.quizThree==1 && 
                      kycForEntreprise?.quizFour==1 && 
                      kycBusinessIdentity?.identity==1 &&
                      kycForEntreprise?.numberRepresentatives &&
                      kycForEntreprise?.numberRepresentatives==kycBusinessRepresentative?.length &&
                      !kycForEntreprise?.numberBeneficial?
                      // kycForEntreprise?.numberBeneficial!==kycBusinessBeneficiary?.length &&
                      // !kycForEntreprise?.numberAssociates &&
                      // kycForEntreprise?.numberAssociates!==kycBusinessStructure?.length &&
                      // !kycForEntreprise?.numberPoliticallyExposed &&
                      // kycForEntreprise?.numberPoliticallyExposed!==kycBusinessPoliticallyExposed?.length &&
                      // kycBusinessFinancialOperationIds?.length===0  &&
                      // kycBusinessFundOriginIds?.length===0  &&
                      // !kycBusinessFinancialMontly?.financialInformation==1 && 
                      // !kycBusinessFinancialQuarterly?.financialInformation==1 && 
                      // !kycBusinessFinancialAnnual?.financialInformation==1 && 
                      // !kycBusinessTransactionMontly?.financialTransaction==1 && 
                      // !kycBusinessTransactionAnnual?.financialTransaction==1 ?
                    (
                      <Link to='/profil/kyc/entreprise/beneficiaire-effectif-one' className={pathname == "/profil/kyc/entreprise/beneficiaire-effectif-one" ? "active-sidebar nav-link-sidebar my-1" : "nav-link-sidebar my-1"}>
                        <i className='fas fa-tasks nav-link-icon'></i>
                        <span className='nav-link-name'>KYC</span>
                      </Link>
                    ):kycForEntreprise?.quiz==1 && 
                      kycForEntreprise?.quizTwo==1 && 
                      kycForEntreprise?.quizThree==1 && 
                      kycForEntreprise?.quizFour==1 && 
                      kycBusinessIdentity?.identity==1 &&
                      kycForEntreprise?.numberRepresentatives &&
                      kycForEntreprise?.numberRepresentatives==kycBusinessRepresentative?.length &&
                      kycForEntreprise?.numberBeneficial &&
                      !kycForEntreprise?.numberBeneficial==kycBusinessBeneficiary?.length ?
                      // !kycForEntreprise?.numberAssociates &&
                      // !kycForEntreprise?.numberAssociates==kycBusinessStructure?.length &&
                      // !kycForEntreprise?.numberPoliticallyExposed &&
                      // !kycForEntreprise?.numberPoliticallyExposed==kycBusinessPoliticallyExposed?.length &&
                      // kycBusinessFinancialOperationIds?.length===0  &&
                      // kycBusinessFundOriginIds?.length===0  &&
                      // !kycBusinessFinancialMontly?.financialInformation==1 && 
                      // !kycBusinessFinancialQuarterly?.financialInformation==1 && 
                      // !kycBusinessFinancialAnnual?.financialInformation==1 && 
                      // !kycBusinessTransactionMontly?.financialTransaction==1 && 
                      // !kycBusinessTransactionAnnual?.financialTransaction==1 ?
                    (
                      <Link to='/profil/kyc/entreprise/beneficiaire-effectif-two' className={pathname == "/profil/kyc/entreprise/beneficiaire-effectif-two" ? "active-sidebar nav-link-sidebar my-1" : "nav-link-sidebar my-1"}>
                        <i className='fas fa-tasks nav-link-icon'></i>
                        <span className='nav-link-name'>KYC</span>
                      </Link>
                    ):kycForEntreprise?.quiz==1 && 
                      kycForEntreprise?.quizTwo==1 && 
                      kycForEntreprise?.quizThree==1 && 
                      kycForEntreprise?.quizFour==1 && 
                      kycBusinessIdentity?.identity==1 &&
                      kycForEntreprise?.numberRepresentatives &&
                      kycForEntreprise?.numberRepresentatives==kycBusinessRepresentative?.length &&
                      kycForEntreprise?.numberBeneficial &&
                      kycForEntreprise?.numberBeneficial==kycBusinessBeneficiary?.length &&
                      !kycForEntreprise?.numberAssociates ?
                      // !kycForEntreprise?.numberAssociates==kycBusinessStructure?.length &&
                      // !kycForEntreprise?.numberPoliticallyExposed &&
                      // !kycForEntreprise?.numberPoliticallyExposed==kycBusinessPoliticallyExposed?.length &&
                      // kycBusinessFinancialOperationIds?.length===0  &&
                      // kycBusinessFundOriginIds?.length===0  &&
                      // !kycBusinessFinancialMontly?.financialInformation==1 && 
                      // !kycBusinessFinancialQuarterly?.financialInformation==1 && 
                      // !kycBusinessFinancialAnnual?.financialInformation==1 && 
                      // !kycBusinessTransactionMontly?.financialTransaction==1 && 
                      // !kycBusinessTransactionAnnual?.financialTransaction==1 ?
                    (
                      <Link to='/profil/kyc/entreprise/structure-control-one' className={pathname == "/profil/kyc/entreprise/structure-control-one" ? "active-sidebar nav-link-sidebar my-1" : "nav-link-sidebar my-1"}>
                        <i className='fas fa-tasks nav-link-icon'></i>
                        <span className='nav-link-name'>KYC</span>
                      </Link>
                    ):kycForEntreprise?.quiz==1 && 
                      kycForEntreprise?.quizTwo==1 && 
                      kycForEntreprise?.quizThree==1 && 
                      kycForEntreprise?.quizFour==1 && 
                      kycBusinessIdentity?.identity==1 &&
                      kycForEntreprise?.numberRepresentatives &&
                      kycForEntreprise?.numberRepresentatives==kycBusinessRepresentative?.length &&
                      kycForEntreprise?.numberBeneficial &&
                      kycForEntreprise?.numberBeneficial==kycBusinessBeneficiary?.length &&
                      kycForEntreprise?.numberAssociates &&
                      !kycForEntreprise?.numberAssociates==kycBusinessStructure?.length ?
                      // !kycForEntreprise?.numberPoliticallyExposed &&
                      // !kycForEntreprise?.numberPoliticallyExposed==kycBusinessPoliticallyExposed?.length &&
                      // kycBusinessFinancialOperationIds?.length===0  &&
                      // kycBusinessFundOriginIds?.length===0  &&
                      // !kycBusinessFinancialMontly?.financialInformation==1 && 
                      // !kycBusinessFinancialQuarterly?.financialInformation==1 && 
                      // !kycBusinessFinancialAnnual?.financialInformation==1 && 
                      // !kycBusinessTransactionMontly?.financialTransaction==1 && 
                      // !kycBusinessTransactionAnnual?.financialTransaction==1 ?
                    (
                      <Link to='/profil/kyc/entreprise/structure-control-Two' className={pathname == "/profil/kyc/entreprise/structure-control-two" ? "active-sidebar nav-link-sidebar my-1" : "nav-link-sidebar my-1"}>
                        <i className='fas fa-tasks nav-link-icon'></i>
                        <span className='nav-link-name'>KYC</span>
                      </Link>
                    ):kycForEntreprise?.quiz==1 && 
                      kycForEntreprise?.quizTwo==1 && 
                      kycForEntreprise?.quizThree==1 && 
                      kycForEntreprise?.quizFour==1 && 
                      kycBusinessIdentity?.identity==1 &&
                      kycForEntreprise?.numberRepresentatives &&
                      kycForEntreprise?.numberRepresentatives==kycBusinessRepresentative?.length &&
                      kycForEntreprise?.numberBeneficial &&
                      kycForEntreprise?.numberBeneficial==kycBusinessBeneficiary?.length &&
                      kycForEntreprise?.numberAssociates &&
                      kycForEntreprise?.numberAssociates==kycBusinessStructure?.length &&
                      !kycForEntreprise?.numberPoliticallyExposed ?
                      // !kycForEntreprise?.numberPoliticallyExposed==kycBusinessPoliticallyExposed?.length &&
                      // kycBusinessFinancialOperationIds?.length===0  &&
                      // kycBusinessFundOriginIds?.length===0  &&
                      // !kycBusinessFinancialMontly?.financialInformation==1 && 
                      // !kycBusinessFinancialQuarterly?.financialInformation==1 && 
                      // !kycBusinessFinancialAnnual?.financialInformation==1 && 
                      // !kycBusinessTransactionMontly?.financialTransaction==1 && 
                      // !kycBusinessTransactionAnnual?.financialTransaction==1 ?
                    (
                      <Link to='/profil/kyc/entreprise/politiquement-exposees-one' className={pathname == "/profil/kyc/entreprise/politiquement-exposees-one" ? "active-sidebar nav-link-sidebar my-1" : "nav-link-sidebar my-1"}>
                        <i className='fas fa-tasks nav-link-icon'></i>
                        <span className='nav-link-name'>KYC</span>
                      </Link>
                    ):kycForEntreprise?.quiz==1 && 
                      kycForEntreprise?.quizTwo==1 && 
                      kycForEntreprise?.quizThree==1 && 
                      kycForEntreprise?.quizFour==1 && 
                      kycBusinessIdentity?.identity==1 &&
                      kycForEntreprise?.numberRepresentatives &&
                      kycForEntreprise?.numberRepresentatives==kycBusinessRepresentative?.length &&
                      kycForEntreprise?.numberBeneficial &&
                      kycForEntreprise?.numberBeneficial==kycBusinessBeneficiary?.length &&
                      kycForEntreprise?.numberAssociates &&
                      kycForEntreprise?.numberAssociates==kycBusinessStructure?.length &&
                      kycForEntreprise?.numberPoliticallyExposed &&
                      !kycForEntreprise?.numberPoliticallyExposed==kycBusinessPoliticallyExposed?.length ?
                      // kycBusinessFinancialOperationIds?.length===0  &&
                      // kycBusinessFundOriginIds?.length===0  &&
                      // !kycBusinessFinancialMontly?.financialInformation==1 && 
                      // !kycBusinessFinancialQuarterly?.financialInformation==1 && 
                      // !kycBusinessFinancialAnnual?.financialInformation==1 && 
                      // !kycBusinessTransactionMontly?.financialTransaction==1 && 
                      // !kycBusinessTransactionAnnual?.financialTransaction==1 ?
                    (
                      <Link to='/profil/kyc/entreprise/politiquement-exposees-two' className={pathname == "/profil/kyc/entreprise/politiquement-exposees-two" ? "active-sidebar nav-link-sidebar my-1" : "nav-link-sidebar my-1"}>
                        <i className='fas fa-tasks nav-link-icon'></i>
                        <span className='nav-link-name'>KYC</span>
                      </Link>
                    ):kycForEntreprise?.quiz==1 && 
                      kycForEntreprise?.quizTwo==1 && 
                      kycForEntreprise?.quizThree==1 && 
                      kycForEntreprise?.quizFour==1 && 
                      kycBusinessIdentity?.identity==1 &&
                      kycForEntreprise?.numberRepresentatives &&
                      kycForEntreprise?.numberRepresentatives==kycBusinessRepresentative?.length &&
                      kycForEntreprise?.numberBeneficial &&
                      kycForEntreprise?.numberBeneficial==kycBusinessBeneficiary?.length &&
                      kycForEntreprise?.numberAssociates &&
                      kycForEntreprise?.numberAssociates==kycBusinessStructure?.length &&
                      kycForEntreprise?.numberPoliticallyExposed &&
                      kycForEntreprise?.numberPoliticallyExposed==kycBusinessPoliticallyExposed?.length &&
                      kycBusinessFinancialOperationIds?.length===0  ?
                      // kycBusinessFundOriginIds?.length===0  &&
                      // !kycBusinessFinancialMontly?.financialInformation==1 && 
                      // !kycBusinessFinancialQuarterly?.financialInformation==1 && 
                      // !kycBusinessFinancialAnnual?.financialInformation==1 && 
                      // !kycBusinessTransactionMontly?.financialTransaction==1 && 
                      // !kycBusinessTransactionAnnual?.financialTransaction==1 ?
                    (
                      <Link to='/profil/kyc/entreprise/operations-financieres-one' className={pathname == "/profil/kyc/entreprise/operations-financieres-one" ? "active-sidebar nav-link-sidebar my-1" : "nav-link-sidebar my-1"}>
                        <i className='fas fa-tasks nav-link-icon'></i>
                        <span className='nav-link-name'>KYC</span>
                      </Link>
                    ):kycForEntreprise?.quiz==1 && 
                      kycForEntreprise?.quizTwo==1 && 
                      kycForEntreprise?.quizThree==1 && 
                      kycForEntreprise?.quizFour==1 && 
                      kycBusinessIdentity?.identity==1 &&
                      kycForEntreprise?.numberRepresentatives &&
                      kycForEntreprise?.numberRepresentatives==kycBusinessRepresentative?.length &&
                      kycForEntreprise?.numberBeneficial &&
                      kycForEntreprise?.numberBeneficial==kycBusinessBeneficiary?.length &&
                      kycForEntreprise?.numberAssociates &&
                      kycForEntreprise?.numberAssociates==kycBusinessStructure?.length &&
                      kycForEntreprise?.numberPoliticallyExposed &&
                      kycForEntreprise?.numberPoliticallyExposed==kycBusinessPoliticallyExposed?.length &&
                      kycBusinessFinancialOperationIds?.length!==0  && //Signifie que ça existe comme les autres
                      kycBusinessFundOriginIds?.length===0  ?
                      // !kycBusinessFinancialMontly?.financialInformation==1 && 
                      // !kycBusinessFinancialQuarterly?.financialInformation==1 && 
                      // !kycBusinessFinancialAnnual?.financialInformation==1 && 
                      // !kycBusinessTransactionMontly?.financialTransaction==1 && 
                      // !kycBusinessTransactionAnnual?.financialTransaction==1 ?
                    (
                      <Link to='/profil/kyc/entreprise/origine-fonds' className={pathname == "/profil/kyc/entreprise/origine-fonds" ? "active-sidebar nav-link-sidebar my-1" : "nav-link-sidebar my-1"}>
                        <i className='fas fa-tasks nav-link-icon'></i>
                        <span className='nav-link-name'>KYC</span>
                      </Link>
                    ):kycForEntreprise?.quiz==1 && 
                      kycForEntreprise?.quizTwo==1 && 
                      kycForEntreprise?.quizThree==1 && 
                      kycForEntreprise?.quizFour==1 && 
                      kycBusinessIdentity?.identity==1 &&
                      kycForEntreprise?.numberRepresentatives &&
                      kycForEntreprise?.numberRepresentatives==kycBusinessRepresentative?.length &&
                      kycForEntreprise?.numberBeneficial &&
                      kycForEntreprise?.numberBeneficial==kycBusinessBeneficiary?.length &&
                      kycForEntreprise?.numberAssociates &&
                      kycForEntreprise?.numberAssociates==kycBusinessStructure?.length &&
                      kycForEntreprise?.numberPoliticallyExposed &&
                      kycForEntreprise?.numberPoliticallyExposed==kycBusinessPoliticallyExposed?.length &&
                      kycBusinessFinancialOperationIds?.length!==0  &&
                      kycBusinessFundOriginIds?.length!==0  && //Signifie que ça existe comme les autres
                      !kycBusinessFinancialMontly?.financialInformation==1 ?
                      // !kycBusinessFinancialQuarterly?.financialInformation==1 && 
                      // !kycBusinessFinancialAnnual?.financialInformation==1 && 
                      // !kycBusinessTransactionMontly?.financialTransaction==1 && 
                      // !kycBusinessTransactionAnnual?.financialTransaction==1 ?
                    (
                      <Link to='/profil/kyc/entreprise/information-financiere-one' className={pathname == "/profil/kyc/entreprise/information-financiere-one" ? "active-sidebar nav-link-sidebar my-1" : "nav-link-sidebar my-1"}>
                        <i className='fas fa-tasks nav-link-icon'></i>
                        <span className='nav-link-name'>KYC</span>
                      </Link>
                    ):kycForEntreprise?.quiz==1 && 
                      kycForEntreprise?.quizTwo==1 && 
                      kycForEntreprise?.quizThree==1 && 
                      kycForEntreprise?.quizFour==1 && 
                      kycBusinessIdentity?.identity==1 &&
                      kycForEntreprise?.numberRepresentatives &&
                      kycForEntreprise?.numberRepresentatives==kycBusinessRepresentative?.length &&
                      kycForEntreprise?.numberBeneficial &&
                      kycForEntreprise?.numberBeneficial==kycBusinessBeneficiary?.length &&
                      kycForEntreprise?.numberAssociates &&
                      kycForEntreprise?.numberAssociates==kycBusinessStructure?.length &&
                      kycForEntreprise?.numberPoliticallyExposed &&
                      kycForEntreprise?.numberPoliticallyExposed==kycBusinessPoliticallyExposed?.length &&
                      kycBusinessFinancialOperationIds?.length!==0  &&
                      kycBusinessFundOriginIds?.length!==0  && //Signifie que ça existe comme les autres
                      kycBusinessFinancialMontly?.financialInformation==1 && 
                      !kycBusinessFinancialQuarterly?.financialInformation==1 ? 
                      // !kycBusinessFinancialAnnual?.financialInformation==1 && 
                      // !kycBusinessTransactionMontly?.financialTransaction==1 && 
                      // !kycBusinessTransactionAnnual?.financialTransaction==1 ?
                    (
                      <Link to='/profil/kyc/entreprise/information-financiere-two' className={pathname == "/profil/kyc/entreprise/information-financiere-two" ? "active-sidebar nav-link-sidebar my-1" : "nav-link-sidebar my-1"}>
                        <i className='fas fa-tasks nav-link-icon'></i>
                        <span className='nav-link-name'>KYC</span>
                      </Link>
                    ):kycForEntreprise?.quiz==1 && 
                      kycForEntreprise?.quizTwo==1 && 
                      kycForEntreprise?.quizThree==1 && 
                      kycForEntreprise?.quizFour==1 && 
                      kycBusinessIdentity?.identity==1 &&
                      kycForEntreprise?.numberRepresentatives &&
                      kycForEntreprise?.numberRepresentatives==kycBusinessRepresentative?.length &&
                      kycForEntreprise?.numberBeneficial &&
                      kycForEntreprise?.numberBeneficial==kycBusinessBeneficiary?.length &&
                      kycForEntreprise?.numberAssociates &&
                      kycForEntreprise?.numberAssociates==kycBusinessStructure?.length &&
                      kycForEntreprise?.numberPoliticallyExposed &&
                      kycForEntreprise?.numberPoliticallyExposed==kycBusinessPoliticallyExposed?.length &&
                      kycBusinessFinancialOperationIds?.length!==0  &&
                      kycBusinessFundOriginIds?.length!==0  && //Signifie que ça existe comme les autres
                      kycBusinessFinancialMontly?.financialInformation==1 && 
                      kycBusinessFinancialQuarterly?.financialInformation==1 && 
                      !kycBusinessFinancialAnnual?.financialInformation==1 && 
                      !kycBusinessTransactionMontly?.financialTransaction==1 && 
                      !kycBusinessTransactionAnnual?.financialTransaction==1 ?
                    (
                      <Link to='/profil/kyc/entreprise/information-financiere-three' className={pathname == "/profil/kyc/entreprise/information-financiere-three" ? "active-sidebar nav-link-sidebar my-1" : "nav-link-sidebar my-1"}>
                        <i className='fas fa-tasks nav-link-icon'></i>
                        <span className='nav-link-name'>KYC</span>
                      </Link>
                    ):kycForEntreprise?.quiz==1 && 
                      kycForEntreprise?.quizTwo==1 && 
                      kycForEntreprise?.quizThree==1 && 
                      kycForEntreprise?.quizFour==1 && 
                      kycBusinessIdentity?.identity==1 &&
                      kycForEntreprise?.numberRepresentatives &&
                      kycForEntreprise?.numberRepresentatives==kycBusinessRepresentative?.length &&
                      kycForEntreprise?.numberBeneficial &&
                      kycForEntreprise?.numberBeneficial==kycBusinessBeneficiary?.length &&
                      kycForEntreprise?.numberAssociates &&
                      kycForEntreprise?.numberAssociates==kycBusinessStructure?.length &&
                      kycForEntreprise?.numberPoliticallyExposed &&
                      kycForEntreprise?.numberPoliticallyExposed==kycBusinessPoliticallyExposed?.length &&
                      kycBusinessFinancialOperationIds?.length!==0  &&
                      kycBusinessFundOriginIds?.length!==0  && //Signifie que ça existe comme les autres
                      kycBusinessFinancialMontly?.financialInformation==1 && 
                      kycBusinessFinancialQuarterly?.financialInformation==1 && 
                      kycBusinessFinancialAnnual?.financialInformation==1 && 
                      !kycBusinessTransactionMontly?.financialTransaction==1 && 
                      !kycBusinessTransactionAnnual?.financialTransaction==1 ?
                    (
                      <Link to='/profil/kyc/entreprise/information-financiere-four' className={pathname == "/profil/kyc/entreprise/information-financiere-four" ? "active-sidebar nav-link-sidebar my-1" : "nav-link-sidebar my-1"}>
                        <i className='fas fa-tasks nav-link-icon'></i>
                        <span className='nav-link-name'>KYC</span>
                      </Link>
                    ):kycForEntreprise?.quiz==1 && 
                      kycForEntreprise?.quizTwo==1 && 
                      kycForEntreprise?.quizThree==1 && 
                      kycForEntreprise?.quizFour==1 && 
                      kycBusinessIdentity?.identity==1 &&
                      kycForEntreprise?.numberRepresentatives &&
                      kycForEntreprise?.numberRepresentatives==kycBusinessRepresentative?.length &&
                      kycForEntreprise?.numberBeneficial &&
                      kycForEntreprise?.numberBeneficial==kycBusinessBeneficiary?.length &&
                      kycForEntreprise?.numberAssociates &&
                      kycForEntreprise?.numberAssociates==kycBusinessStructure?.length &&
                      kycForEntreprise?.numberPoliticallyExposed &&
                      kycForEntreprise?.numberPoliticallyExposed==kycBusinessPoliticallyExposed?.length &&
                      kycBusinessFinancialOperationIds?.length!==0  &&
                      kycBusinessFundOriginIds?.length!==0  && //Signifie que ça existe comme les autres
                      kycBusinessFinancialMontly?.financialInformation==1 && 
                      kycBusinessFinancialQuarterly?.financialInformation==1 && 
                      kycBusinessFinancialAnnual?.financialInformation==1 && 
                      kycBusinessTransactionMontly?.financialTransaction==1 && 
                      !kycBusinessTransactionAnnual?.financialTransaction==1 ?
                    (
                      <Link to='/profil/kyc/entreprise/information-financiere-five' className={pathname == "/profil/kyc/entreprise/information-financiere-five" ? "active-sidebar nav-link-sidebar my-1" : "nav-link-sidebar my-1"}>
                        <i className='fas fa-tasks nav-link-icon'></i>
                        <span className='nav-link-name'>KYC</span>
                      </Link>
                    ):kycForEntreprise?.quiz==1 && 
                      kycForEntreprise?.quizTwo==1 && 
                      kycForEntreprise?.quizThree==1 && 
                      kycForEntreprise?.quizFour==1 && 
                      kycBusinessIdentity?.identity==1 &&
                      kycForEntreprise?.numberRepresentatives &&
                      kycForEntreprise?.numberRepresentatives==kycBusinessRepresentative?.length &&
                      kycForEntreprise?.numberBeneficial &&
                      kycForEntreprise?.numberBeneficial==kycBusinessBeneficiary?.length &&
                      kycForEntreprise?.numberAssociates &&
                      kycForEntreprise?.numberAssociates==kycBusinessStructure?.length &&
                      kycForEntreprise?.numberPoliticallyExposed &&
                      kycForEntreprise?.numberPoliticallyExposed==kycBusinessPoliticallyExposed?.length &&
                      kycBusinessFinancialOperationIds?.length!==0  &&
                      kycBusinessFundOriginIds?.length!==0  && //Signifie que ça existe comme les autres
                      kycBusinessFinancialMontly?.financialInformation==1 && 
                      kycBusinessFinancialQuarterly?.financialInformation==1 && 
                      kycBusinessFinancialAnnual?.financialInformation==1 && 
                      kycBusinessTransactionMontly?.financialTransaction==1 && 
                      kycBusinessTransactionAnnual?.financialTransaction==1 ?
                    (
                      <Link to='/profil/kyc/entreprise/documents-legaux' className={pathname == "/profil/kyc/entreprise/documents-legaux" ? "active-sidebar nav-link-sidebar my-1" : "nav-link-sidebar my-1"}>
                        <i className='fas fa-tasks nav-link-icon'></i>
                        <span className='nav-link-name'>KYC</span>
                      </Link>
                    ): (
                      <Link to='/profil/kyc/entreprise/questionnaire' className={pathname == "/profil/kyc/entreprise/questionnaire" ? "active-sidebar nav-link-sidebar my-1" : "nav-link-sidebar my-1"}>
                        <i className='fas fa-tasks nav-link-icon'></i>
                        <span className='nav-link-name'>KYC </span>
                      </Link>
                    )}
                  </>
                )}
              </>
            ) :("")}
            {/* Fin */}

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
