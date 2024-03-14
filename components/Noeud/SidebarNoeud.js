import React, { useState,useCallback,useEffect, useContext,useRef } from 'react';
import Link from "../../components/Link";
import { Icon } from '@iconify/react';
import { useRouter } from "next/router";
import { magic } from "../../magic";
import { ethers } from "ethers";
import Swal from 'sweetalert2';


import Router from 'next/router';










const SidebarNoeud = () => {
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



  //  *********************INATIVITE***********************************  
  let timerInterval; // Déclarez timerInterval à une portée supérieure
  const timeoutRef = useRef(null); // Utilisez useRef au lieu de useState

  // Fonction pour gérer l'inactivité
  // const resetInactivityTimeout = useCallback(() => {
  //   clearTimeout(timeoutRef.current);
  //   timeoutRef.current = setTimeout(handleInactive, 120000); // 2 minutes
  // }, []);

  // const handleInactive = () => {
  //   Swal.fire({
  //     title: 'Déconnexion automatique',
  //     html: 'Vous serez déconnecté dans <b></b> secondes.<br><button id="stayConnected">Rester connecté</button>',
  //     timer: 120000, // 2 minutes
  //     timerProgressBar: true,
  //     didOpen: () => {
  //       Swal.showLoading();
  //       const b = Swal.getHtmlContainer().querySelector('b');
  //       const stayConnectedButton = document.getElementById('stayConnected');

  //       stayConnectedButton.addEventListener('click', () => {
  //         clearInterval(timerInterval); // Arrêtez également le timerInterval
  //         Swal.close();
  //         resetInactivityTimeout(); // Réinitialiser le délai après avoir choisi de rester connecté
  //       });

  //       timerInterval = setInterval(() => {
  //         const timeLeft = Swal.getTimerLeft();
  //         if (timeLeft > 0) {
  //           b.textContent = (timeLeft / 1000).toFixed(0);
  //         } else {
  //           clearInterval(timerInterval);
  //           logout(); // Implémentez votre logique de déconnexion ici
  //         }
  //       }, 100);
  //     },
  //     willClose: () => {
  //       clearInterval(timerInterval); // Nettoyer l'intervalle
  //     }
  //   });
  // };

  // useEffect(() => {
  //   resetInactivityTimeout(); // Démarrer le délai initial lors du rendu initial

  //   document.addEventListener('mousemove', resetInactivityTimeout);
  //   document.addEventListener('keydown', resetInactivityTimeout);

  //   return () => {
  //     document.removeEventListener('mousemove', resetInactivityTimeout);
  //     document.removeEventListener('keydown', resetInactivityTimeout);
  //     clearTimeout(timeoutRef.current);
  //   };
  // }, [resetInactivityTimeout]);
// ***********FIN****************************











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

            
            
            <Link to='/profil/dashboard/' className={pathname == "/profil/dashboard/" ? "active-sidebar nav-link-sidebar my-1" : "nav-link-sidebar my-1"}>
                <i className='fas fa-tachometer-alt nav-link-icon'></i>
                <span className='nav-link-name'>Dashboard</span>
            </Link>

            
            

           




           

             

                

            

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

export default SidebarNoeud;
