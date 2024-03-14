import { useState, useEffect } from 'react';
import { Container, Row, Col, Modal } from "react-bootstrap";
import ABI_TOKEN_EWARI from "../../../components/Contrats/Abi/AbiStablecoin.json";
import ABI_ESCROW_STABLECOIN from "../../../components/Contrats/Abi/AbiEscrowStablecoin.json";


import React from "react";
import axios from 'axios';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import copy from "copy-to-clipboard"; 
import { Table } from '@nextui-org/react';




// Pour Magic
import { magic } from "../../../magic";
import { ethers } from "ethers";
import Loading from "../../../components/loading";
import Router from "next/router";
import Swal from 'sweetalert2';
import Web3 from "web3";

// FIN



// MODALS 
// reactstrap components
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    FormGroup,
    Form,
    Input,
    InputGroupAddon,
    InputGroupText,
    InputGroup,
    // Modal,
    // Row,
    // Col,
  } from "reactstrap";
import ModalTransfertRemboursement from '../commun/ModalTransfertRemboursement';

// FIN

const Dashboard = () => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API
    const ADDRESS_CONTRAT_EWARI =process.env.NEXT_PUBLIC_ADDRESS_CONTRAT_EWARI
    const PRIVATE_KEY = process.env.NEXT_PUBLIC_PRIVATE_KEY
    // New
    const [userMetadata, setUserMetadata] = useState("...");
    const [magicCurrentAddress, setMagicCurrentAddress] = useState();
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState();
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    // Fin

    const [successCopy, setSuccessCopy] = useState();

    const [currentUser, setCurrentUser] = useState();
    const [dataPaymentPending, setDataPaymentPending] = useState(); //state des données de paiement en entente
    const [paymentPendingLength, setPaymentPendingLength] = useState();

    // States de la partie opcvm
    const [questionnaireForUser, setQuestionnaireForUser] = useState(false);






    // MODALS
    const [modalDefaultOpen, setModalDefaultOpen] = React.useState(false);
    const [modalNotificationOpen, setModalNotificationOpen] = React.useState(
        false
    );
    // Banque
    const [modalFormOpen, setModalFormOpen] = React.useState(false);
    // Mobile
    const [modalFormOpenMobile, setModalFormOpenMobile] = React.useState(false);

    // Achat
    const [modalFormOpenAchat, setModalFormOpenAchat] = React.useState(false);

    // Retrait
    const [modalFormOpenRetrait, setModalFormOpenRetrait] = React.useState(false);
    


    // FIN

    //   Banque
const [bankName, setBankName] = useState("")
const [iban, setIban] = useState("")
const [countrie, setCountrie] = useState("")
const [countrieMobile, setCountrieMobile] = useState("")
const [countrieBank, setCountrieBank] = useState("")
const [isoPays, setIsoPays] = useState("")



//   Mobile
const [accountName, setAccountName] = useState()
const [numberMobile, setNumberMobile] = useState()
const [networkMobile, setNetworkMobile] = useState()
const [mobileLenght, setMobileLength] = useState()
const [userDataMobile, setUserDataMobile] = useState()
const [deleteIdAccountMobile, setDeleteIdAccountMobile] = useState()




// Pays
const [allCountry, setAllCountry] = useState("");
const [statutCountry, setStatutCountry] = useState()


// Banques
const [allBank, setAllBank] = useState([])
const [bankByCountry, setBankByCountry] = useState({})
const [userDataAccountBank, setUserDataAccountBank] = useState()
const [accountBankLength, setAccountBankLength] = useState()
const [deleteIdAccountBank, setDeleteIdAccountBank] = useState()

// State des transactions des 10 dernières minutes
const [transactionsLessThanTenMinutesOfUser, setTransactionsLessThanTenMinutesOfUser] = useState()



// Operateurs
const [allOperators, setAllOperators] = useState([])


// Retrait
const [montantRetrait, setMontantRetrait] = useState(0)
const [montantRetraitCalculer, setMontantRetraitCalculer] = useState()


// Achat
const [montantAchat, setMontantAchat] = useState(0)






    
  const [name, setName] = useState('Bitcoin');
  const [nameTwo, setNameTwo] = useState('USD');

//   Variables de l'Utilisateur connecté
  const [userDataSession, setUserDataSession] = useState()
  const [dataCountryOfUser, setDataCountryOfUser] = useState()
  
// Fin

  //api data
  const [newData, setnewData] = useState([]);

  //converter hook
  const [conversionValue, setConversionValue] = useState('');
  const [cryptoQuantity, setcryptoQuantity] = useState(1);
  const [coinSymbol, setcoinSymbol] = useState('BTC');

  const [image, setImage] = useState(
    '/images/cryptocurrency/cryptocurrency2.png'
  );
  const [imageTwo, setImageTwo] = useState(
    '/images/cryptocurrency/cryptocurrency1.png'
  );

  const [clicked, setClicked] = useState(false);
  const [toggleState, setToggleState] = useState(false);
  const [toggleStateTwo, setToggleStateTwo] = useState(false);

  // PARTIE MAGIC
    // TOKEN
    const [balance, setBalance] = useState(0);
    const [symbol, setSymbol] = useState(null);

    const [cfaContract, setCfaContract] = useState();



    // TOKEN ENVOYER VERS AUTRE ADRESSE
    const [adresseTo, setAdresseTo] = useState(null);
    const [montantSaisiForTo, setMontantSaisiForTo] = useState();

    //   FORM
    const [montantSaisi, setMontantSaisi] = useState();

    const [tokenCurrent, setTokenCurrent] = useState();

    // State des infos user
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [mobile, setMobile] = useState('');
    const [currentAddress, setCurrentAdress] = useState('');
    const [codeCountry, setCodeCountry] = useState('');
    const [dataBankOfCountry, setDataBankOfCountry] = useState('');
    // Fin

           
    // BANQUE 
    const [codeBank, setCodeBank] = useState();
    const [codeGuichet, setCodeGuichet] = useState();
    const [numberCompte, setNumberCompte] = useState();
    const [cleRib, setCleRib] = useState();
    const [residence, setResidence] = useState();
    // FIN

    // Pour afficher les informations venant de la base dedonnée
    // const [userData, setUserData] = useState();


    // **************************NEW***************************************

    //***************************************************************** *
        // LES STATES DU STABLECOIN
    // ******************************************************************
    // const [magicCurrentAddress, setMagicCurrentAddress] = useState("...");
    const [contractStablecoin, setContractStablecoin] = useState();
    const [nameStablecoin, setNameStablecoin] = useState();
    const [symbolStablecoin, setSymbolStablecoin] = useState();
    const [balanceStablecoin, setBalanceStablecoin] = useState();
    const [decimalStablecoin, setDecimalStablecoin] = useState();
   
    // States d'escrow
    const [contractEscrow, setContractEscrow] = useState()
    const [balanceEscrow, setBalanceEscrow] = useState()
    const [dataRequestUseStablecoinForUser, setDataRequestUseStablecoinForUser] = useState()

    // State d'abonnement
    const [infoSubscriptionOfUser, setInfoSubscriptionOfUser] = useState()

    // Modal de la demande de remboursement 
    const [showRefund, setShowRefund] = useState(false);
    // const handleCloseRefund = () => setShowRefund(false);

    const handleButtonClick = () => {
        setShowRefund(true);
      };


    /**
     * Hook d'effet pour initialiser le fournisseur Web3 en fonction de l'instance Magic.
     * @function
     * @returns {void}
     * @param {Object} magic - Instance de Magic.
     * @param {Function} setProvider - Fonction pour mettre à jour l'état du fournisseur Web3.
     */
    useEffect(() => {
        /**
         * Fonction pour initialiser le fournisseur Web3 en fonction de l'instance Magic.
         * @returns {void}
         */
        const initializeWeb3Provider = () => {
        if (!!magic) {
            // Créer une instance du fournisseur Web3 à partir du fournisseur RPC de Magic.
            const web3Provider = new ethers.providers.Web3Provider(magic.rpcProvider);
    
            // Mettre à jour l'état du fournisseur Web3.
            setProvider(web3Provider);
        }
        };
    
        // Appeler la fonction d'initialisation lorsque l'instance Magic change.
        initializeWeb3Provider();
    }, [magic]);
    
    /**
     * Hook d'effet pour récupérer les informations liées à l'instance Magic et au fournisseur Web3.
     * @function
     * @returns {void}
     * @param {Object} magic - Instance de Magic.
     * @param {Object} provider - Fournisseur Web3.
     */
    useEffect(() => {
        /**
         * Fonction asynchrone pour récupérer les informations liées à Magic et au fournisseur Web3.
         * @returns {void}
         */
        const getMagicAndWeb3Info = async () => {
        if (!!magic && !!provider) {
            // Récupérer les métadonnées de l'utilisateur Magic.
            const userMetadatas = await magic.user.getMetadata();
            setUserMetadata(userMetadatas);
    
            // Obtenir le signer du fournisseur Web3.
            const signer = provider.getSigner();
            setSigner(signer);
    
            // Obtenir le réseau actuel à partir du fournisseur Web3.
            const network = await provider.getNetwork();
    
            // Obtenir l'adresse actuelle de l'utilisateur à partir du signer.
            const userAddress = await signer.getAddress();
            setMagicCurrentAddress(userAddress);
    
            // *************************************************************************
            // INTERACTION AVEC LE SMART CONTRAT DE STABLECOIN
            // *************************************************************************
            // Créer un portefeuille Web3 avec la clé privée.
            const walletRelay = new ethers.Wallet(PRIVATE_KEY, provider);
    
            
            // Créer une instance du contrat de stablecoin avec adresse magic.
            const contractStablecoinAddMagic = new ethers.Contract(
                ADDRESS_CONTRAT_EWARI,
                ABI_TOKEN_EWARI.abi,
                signer
            );

            // Obtenir le nombre de jour restant d'un abonnement
            // setRemainingDays(remainingDays)
            // const expiryDate = await contractStablecoinAddMagic.getSubscriptionExpiry();
            // const remainingDays = await contractStablecoinAddMagic.getRemainingDays();
            // console.log("Date d'expiration de l'abonnement:", expiryDate);
            // console.log("Jours restants:", remainingDays);



            // Créer une instance du contrat de stablecoin.
            const contractStablecoin = new ethers.Contract(
            ADDRESS_CONTRAT_EWARI,
            ABI_TOKEN_EWARI.abi,
            walletRelay
            );
            setContractStablecoin(contractStablecoin);
    
            // Récupérer les informations de stablecoin.
            const nameStablecoin = await contractStablecoin.name();
            const symbolStablecoin = await contractStablecoin.symbol();
            const decimalStablecoin = await contractStablecoin.decimals();
            const balanceStablecoin = await contractStablecoin.balanceOf(userAddress);
    
            // Stocker les informations de stablecoin dans leur state.
            setNameStablecoin(nameStablecoin);
            setSymbolStablecoin(symbolStablecoin);
            setDecimalStablecoin(decimalStablecoin);
            setBalanceStablecoin(formatNumber(balanceStablecoin / 10 ** decimalStablecoin));
            
            // Stoquer le symbol de stablecoin dans une variable local
            localStorage.setItem('SymbolStablecoin', symbolStablecoin);


            
                /**
                 * Smart contrat d'escrow.
                 * @type {string}
                 */
                 if (dataRequestUseStablecoinForUser?.addressEscrow) {
                    const contractEscrow = new ethers.Contract(dataRequestUseStablecoinForUser?.addressEscrow, ABI_ESCROW_STABLECOIN?.abi, walletRelay);
                    setContractEscrow(contractEscrow)
                    

                    // Balance de l'escrow en utilisant la fonction balanceOf de stablecoin pour l'utilisateur connecté
                    const balanceEscrow = await contractEscrow.getTotalApprovedAmount()
                    setBalanceEscrow(formatNumber(balanceEscrow/10**decimalStablecoin))
                 }

        }
        };
    
        // Appeler la fonction pour récupérer les informations lorsque le fournisseur Web3 ou Magic changent.
        getMagicAndWeb3Info();
    }, [provider, magic, dataRequestUseStablecoinForUser?.addressEscrow]);
    



    // Obtenir l'utilisateur connecté 
    useEffect(async () => {
        const token = localStorage.getItem('tokenEnCours')

        if (userMetadata?.email) {
            const getUser = async () => {
                const result = await fetch(`${API_URL}/api/user/find-user-sign-in`, {
                    headers: {
                    'Content-Type': 'application/json',
                    Authorization:  `Bearer ${token}`,
                    },
                })
                  .then((result) => result.json())
                  .then((user) => {
                    setUserDataSession(user)
                  }) 
            };
            getUser();
            // Fin
        }
    }, [userDataSession,userMetadata]);


    // Obtenir le pays en fontion de l'utilisateur connecté
    if (userDataSession?.countryId) {
        const getCountryOfUser = async (_idCountry) => {
            const res = await fetch(`${API_URL}/api/country/find-one/${_idCountry}`, {
            
                headers: {
                'Content-Type': 'application/json',
                },
            })
                .then((res) => res.json())
                .then((dataCountryOfUser) => {
                setDataCountryOfUser(dataCountryOfUser)
                        
                }) 
            
        };
        getCountryOfUser(userDataSession?.countryId)
    }
    // FIN

    
    // Obtenir le pays en fontion de l'utilisateur connecté
    if (countrieBank) {
        const getBankOfCountry = async (_countryIso) => {
            const res = await fetch(`${API_URL}/api/bank/find-bank-by-iso?countryIso=${_countryIso}`, {
            
                headers: {
                'Content-Type': 'application/json',
                },
            })
                .then((res) => res.json())
                .then((bankOfCountry) => {
                setDataBankOfCountry(bankOfCountry)
                }) 
            
        };
        getBankOfCountry(countrieBank)
    }
    // FIN




  // functions de transfert
  const sell_tokenThree = async () => {
    try {
      const mountWei = ethers.utils.parseUnits(montantSaisiForTo, 2);
      await cfaContract.transfer(adresseTo, mountWei).then((transferResult) => {
        // PARTIE SWITCH ALERT
        let timerInterval
        Swal.fire({
          title: 'Veuillez patienter svp',
          html: '<p>Votre transaction est en cours...</p>',
          timer: 20000,
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading()
            timerInterval = setInterval(() => {
            }, 1)
          },
          willClose: () => {
            clearInterval(timerInterval)
          }
        }).then((result) => {
          if (result.dismiss === Swal.DismissReason.timer) {
            //   Affiche après le rechargement
            Swal.fire({
                position: 'top-center',
                icon: 'success',
                title: `Succès`,
                html:`<p> ${transferResult.hash}</p>`,
                showConfirmButton: false,
                timer: 20000
            })
            // Fin

            // Actualiser après l'affichage 
            setTimeout(() => {
             window.location.reload()
            }, 20000)
            // Fin
          }
        })
        // FIN PARTIE SWITCH ALERT
    })
      
    } catch (error) {
      throw error;
    }
  }

  

    //  ******************************************
        // FONCTION OBTENIR DES JETONS
    // ******************************************
    async function send_token() {
        let wallet = await new ethers.Wallet(priv_key)
        const provider = await new ethers.providers.JsonRpcProvider(Rpcprovider); //Qui a remplacé Rpcprovider
        let walletSigner = await wallet.connect(provider)

        if (adresseEcfa) {
            //instanciation du contract (erc20 custom)
            let contract = await new ethers.Contract(
                adresseEcfa,
                AbiEcfa,
                walletSigner
            )

            //on parse le montant recuperé dans le champ
            let numberOfTokens = await ethers.utils.parseUnits(montantSaisi, 2)

            //   MINTER
            await contract.mint(numberOfTokens);
            //execution du transfert
            await contract.transfer(magicCurrentAddress, numberOfTokens).then((transferResult) => {
                getJetonDev()
                console.dir(transferResult)

                // PARTIE SWITCH ALERT
            
                let timerInterval
                Swal.fire({
                  title: 'Veuillez patienter svp',
                  html: '<p>Votre transaction est en cours...</p>',
                  timer: 20000,
                  timerProgressBar: true,
                  didOpen: () => {
                    Swal.showLoading()
                    timerInterval = setInterval(() => {
                    }, 1)
                  },
                  willClose: () => {
                    clearInterval(timerInterval)
                  }
                }).then((result) => {
                  if (result.dismiss === Swal.DismissReason.timer) {
                    //   Affiche après le rechargement
                    Swal.fire({
                        position: 'top-center',
                        icon: 'success',
                        title: `Succès`,
                        html:`<p> ${transferResult.hash}</p>`,
                        showConfirmButton: false,
                        timer: 20000
                    })
                    // Fin

                    // Actualiser après l'affichage 
                    setTimeout(() => {
                     window.location.reload()
                    }, 20000)
                    // Fin
                  }
                })
                // FIN PARTIE SWITCH ALERT
                



            })
        } else {
            //   console.log("l'adress nexiste pas");
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: "désolé, votre adresse n'existe pas!",
            })
        }
    }
    //   FIN ACHAT TOKEN ERC20 UTILISATEUR

    


    const [unikUserData, setUnikUserData] = useState([]);


    // Obtenir mes infos
    // useEffect(async() => {
    //     const token = localStorage.getItem('tokenEnCours')
    //     console.log("token meoo=>",token)
        
    //         const getMeSession = async () => {
    //         const res = await fetch(`${API_URL}/api/user`, {
    //             headers: {
    //             'Content-Type': 'application/json',
    //             Authorization:  `Bearer ${token}`
    //             },
    //         })
    //             .then((res) => res.json())
    //             .then((userDataSession) => {
    //             setUserDataSession(userDataSession)
    //             }) 

            

    //         };
            
    //         await getMeSession();
    // }, []);

    // Fin Obtenir mes infos


    useEffect(() => {
        (async () => {
    
        // Obtenir un utilisateur en fonction de son email 
        const getUser = async () => {
            // Obtenir le token en cours
            const token = localStorage.getItem('tokenEnCours');
        // const result = await fetch(`${API_URL}/api/user/find-user-by-email?email=${userMetadatas?.email}`, {
            const result = await fetch(`${API_URL}/api/user/find-user-sign-in`, {
            headers: {
            'Content-Type': 'application/json',
            Authorization:  `Bearer ${token}`
    
            },
        })
            .then((result) => result.json())
            .then((user) => {
            setCurrentUser(user)
    
            }) 
        };
        await getUser();
        // Fin
       
    })();
    
    }, [currentUser]);


    // FONCTION POUR RECUPERER LES INFOSD'ABONNEMENT EN FONCTION DE L'UTILISATEUR CONNECTE
    useEffect(() => {
        // Obtenir le token en cours
        const token = localStorage.getItem('tokenEnCours');
        const getSubsriptionOfUser = async () => {
        try {
            const result = await fetch(`${API_URL}/api/subscription/find-subscription-of-user`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
  
            },
            });
  
            if (!result.ok) {
            throw new Error('Failed to fetch user data');
            }
            const data = await result.json();
            setInfoSubscriptionOfUser(data);
        } catch (error) {
            // Handle errors appropriately, e.g., set an error state.
            console.error('Error fetching user data:', error);
        }
        };
  
        getSubsriptionOfUser();
        
    }, []);
    // FIN



    // Fonction pour calculer le nombre de jours restants
    const calculateRemainingDays = (startDate, subscriptionDays) => {
      const ONE_DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000; // Nombre de millisecondes dans une journée
      const currentDate = new Date();
      const startSubscriptionDate = new Date(startDate);
      const expirationDate = new Date(startSubscriptionDate.getTime() + subscriptionDays * ONE_DAY_IN_MILLISECONDS);
  
      // Calcul du nombre de jours restants
      const remainingDays = Math.ceil((expirationDate - currentDate) / ONE_DAY_IN_MILLISECONDS);
  
      return remainingDays > 0 ? remainingDays : 0;
    };
  
    // Utilisation de la fonction pour obtenir le nombre de jours restants
    const daysRemaining = infoSubscriptionOfUser
      ? calculateRemainingDays(infoSubscriptionOfUser?.updatedAt, infoSubscriptionOfUser?.subscriptionDays)
      : 0;
    
    /**
     * Effet secondaire pour mettre à jour l'état en fonction de la valeur stockée dans le localStorage.
     *
     * @function
     * @name useEffect
     * @memberof YourComponent
     * @inner
     * @param {function} effect - La fonction à exécuter lors de l'effet secondaire.
     * @param {Array} dependencies - Un tableau de dépendances qui déclenche l'effet lorsqu'une de ces dépendances change.
     * @returns {void}
    */
    useEffect(() => {
        /**
         * Stockée l'état de l'abonnement de l'utilisation dans le localStorage.
         * @type {string|null}
         */
        localStorage.setItem('stateOfSubscription', daysRemaining);
        
    }, [daysRemaining]);


    /**
     * Effectue une requête pour obtenir les données de la demande de paiement en fonction de l'utilisateur connecté.
     * Les données récupérées comprennent les demandes en attente de validation (champ 'valid' égal à null).
     * Met à jour les états avec les données récupérées et la longueur des demandes en attente.
     * @function
     * @returns {void}
     */
    useEffect(() => {
        /**
         * Fonction asynchrone pour effectuer la requête et mettre à jour les états.
         * @async
         * @function
         * @returns {Promise<void>}
         */
        const fetchData = async () => {
        if (currentUser?.id) {
            // Obtenir le token en cours
            const token = localStorage.getItem('tokenEnCours');
            const result = await fetch(`${API_URL}/api/payment-request/find-all-payment-request-for-receiver?receiverId=${currentUser.id}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization:  `Bearer ${token}`
            },
            })
            .then((result) => result.json())
            .then((data) => {
                // Filtrer les éléments où le champ 'valid' est égal à null
                const pendingRequests = data.filter(item => item.valid === null);
    
                // Obtenir la longueur des éléments filtrés
                const pendingRequestsLength = pendingRequests.length;
    
                // Mettre à jour les états
                setDataPaymentPending(data);
                setPaymentPendingLength(pendingRequestsLength);
            }) 
        }
        };
    
        fetchData(); // Appel de la fonction lors du montage du composant
    }, [currentUser]); // Dépendance currentUser, assurez-vous d'ajuster si nécessaire
  



    // RECUPERER TOUS LES PAYS
    useEffect(async() => {
        const token = localStorage.getItem('tokenEnCours')
        console.log("token pays=>",token)
        
            const getAllCountries = async () => {
            const resCountry = await fetch(`${API_URL}/api/country/find-all`, {
                headers: {
                'Content-Type': 'application/json',
                Authorization:  `Bearer ${token}`,

                },
            })
                .then((resCountry) => resCountry.json())
                .then((allCountry) => {
                setAllCountry(allCountry)
                }) 

            };
            
            await getAllCountries();
    }, []);
    // FIN


    // RECUPERER TOUTES LES BANQUES 
    useEffect(async() => {
        
            const getAllBank = async () => {
            const resBank = await fetch(`${API_URL}/api/bank/find-all`, {
                headers: {
                'Content-Type': 'application/json',
                },
            })
                .then((resBank) => resBank.json())
                .then((data) => {
                setAllBank(data)

                }) 
            };
            await getAllBank();
    }, []);
    // FIN


    // RECUPERER TOUS LES OPERATEURS
    useEffect(async() => {
        const token = localStorage.getItem('tokenEnCours')
        
            const getAllOperators = async () => {
            const resOperator = await fetch(`${API_URL}/api/operator/find-all-Operators`, {
                headers: {
                'Content-Type': 'application/json',
                Authorization:  `Bearer ${token}`,
                },
            })
                .then((resOperator) => resOperator.json())
                .then((data) => {
                setAllOperators(data)
                }) 
            };
            await getAllOperators();
    }, []);
    // FIN

     // Obtenir mes numéros mobile money
     useEffect(() => {
        const token = localStorage.getItem('tokenEnCours')
            const getMobiles = async () => {
            const res = await fetch(`${API_URL}/api/user/find-all-mobile-for-user`, {

                headers: {
                'Content-Type': 'application/json',
                Authorization:  `Bearer ${token}`,
                },
            })
                .then((res) => res.json())
                .then((userDataMobile) => {
                setUserDataMobile(userDataMobile)
                setMobileLength(userDataMobile.length)
                }) 

                
            };
            
            getMobiles();
    }, []);
    // Fin


     // Obtenir mes comptes bancaires
     useEffect(() => {
        const token = localStorage.getItem('tokenEnCours')
            const getAccountBank = async () => {
            const res = await fetch(`${API_URL}/api/acount-bank/find-all-account-bank-for-user`, {

                headers: {
                'Content-Type': 'application/json',
                Authorization:  `Bearer ${token}`,
                },
            })
                .then((res) => res.json())
                .then((dataAccountBank) => {
                setUserDataAccountBank(dataAccountBank)
                setAccountBankLength(dataAccountBank.length)
                }) 

                
            };
            
            getAccountBank();
    }, []);
    // Fin


    // FONCTION DE LA SUPRESSION D'UN COMPTE MOBILE MONEY
    const deleteAccountMobile = async () => {
            
        try {
         // getter
         const result = await fetch(`${API_URL}/api/mobile/delete-mobile/${deleteIdAccountMobile}`, {
               method:"DELETE",
               headers: {
                   'Content-Type': 'application/json',
               }
           })
           .then(result=>{
           const data = result.json();
         
                 Swal.fire({
                     position: 'center',
                     icon: 'success',
                     html: `<p> Votre compte mobile money a été supprimé avec succès </p>` ,
                     showConfirmButton: false,
                     timer: 5000
                   })
                // Actualisation 
                   setTimeout(() => {
                       window.location.reload()
                   }, 5000) 
               // Fin
             
         })
         .catch(error => {
           //handle error
           console.log(error);
         });
            
        } catch (error) {
            console.log("Erreur =>",error)
        }
         
     }
     // FIN

    // FONCTION DE LA SUPRESSION D'UN COMPTE BANCAIRE
    const deleteAccountBank = async () => {
            
        try {
         // getter
         const result = await fetch(`${API_URL}/api/acount-bank/delete-compte-Bank/${deleteIdAccountBank}`, {
               method:"DELETE",
               headers: {
                   'Content-Type': 'application/json',
               }
           })
           .then(result=>{
           const data = result.json();
         
                 Swal.fire({
                     position: 'center',
                     icon: 'success',
                     html: `<p> Votre compte mobile money a été supprimé avec succès </p>` ,
                     showConfirmButton: false,
                     timer: 5000
                   })
                // Actualisation 
                   setTimeout(() => {
                       window.location.reload()
                   }, 5000) 
               // Fin
             
         })
         .catch(error => {
           //handle error
           console.log(error);
         });
            
        } catch (error) {
            console.log("Erreur =>",error)
        }
         
     }
     // FIN


    // AJOUT D'UN COMPTE BANCAIRE
    const addAccountBank= async(event) =>{
        setIsLoggingIn(true)
        event.preventDefault();
        const dataa = {
            bankName:bankName,
            iban:iban,
            countrie:countrieBank,
            codeBank:codeBank,
            codeGuichet:codeGuichet,
            numberCompte:numberCompte,
            cleRib:cleRib,
            residence:residence,
            status:true
        }

        // getter
        const token = localStorage.getItem('tokenEnCours');

        const res = await fetch(`${API_URL}/api/acount-bank/add-account-bank`, {
              method:"POST",
              body: JSON.stringify(dataa),
              headers: {
                  'Content-Type': 'application/json',
                  Authorization:  `Bearer ${token}`
              }
          })
          .then(res=>{
            const data =  res.json();
            if (res?.status==200) {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    html: "<p> Votre compte bancaire a été ajouté avec succès </p>" ,
                    showConfirmButton: false,
                    timer: 5000
                  })

                //  Actualiser après l'affichage 
                setTimeout(() => {
                    window.location.reload()
                }, 5000) 
                // Fin

            }else{
                setIsLoggingIn(false)

                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    html: `<p>${data?.message} </p>` ,
                    showConfirmButton: false,
                    timer: 5000
                  })
            }
            
            })
        .catch(error => {
            setIsLoggingIn(false)

            Swal.fire({
                position: 'center',
                icon: 'error',
                html: `<p>Une erreur est survenue </p>` ,
                showConfirmButton: false,
                timer: 5000
              })
    
        });
    }
    // FIN

     // AJOUT D'UN COMPTE MOBILE MONEY
     const addAccountMobile = async(event) =>{
        event.preventDefault();

        const dataa = {
            networkMobile:networkMobile,
            countrie:countrieMobile,
            numberMobile:numberMobile,
            status:true,
    
        }
    
        // getter
        const token = localStorage.getItem('tokenEnCours');
        const res = await fetch(`${API_URL}/api/mobile/add-mobile`, {
              method:"POST",
              body: JSON.stringify(dataa),
              headers: {
                  'Content-Type': 'application/json',
                  Authorization:  `Bearer ${token}`
              }
          })
          .then(res=>{
          const data =  res.json();

            if (data?.message) {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    html: `<p>${data?.message} </p>` ,
                    showConfirmButton: false,
                    timer: 5000
                })
            }else{
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    html: "<p> Votre compte mobile money a été ajouté avec succès </p>" ,
                    showConfirmButton: false,
                    timer: 5000
                })

                //  Actualiser après l'affichage 
                setTimeout(() => {
                    window.location.reload()
                }, 5000) 
                // Fin

            }
        })
        .catch(error => {
          //handle error
          console.log(error);
    
        });
        
    }

    // FIN

      

    

  const handleSubmit = (e) => {
    e.preventDefault()
    }

    const handleSubmitTwo = (e) => {
    e.preventDefault()

    }
  // FIN PARTIE MAGIC


  useEffect(() => {
    const getCoins = async () => {
      const { data } = await axios.get(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false'
      );
      setnewData(data);
    };
    getCoins();
  }, []);

  useEffect(() => {
    const getData = async () => {
      const { data } = await axios.get(
        `https://min-api.cryptocompare.com/data/price?fsym=${coinSymbol}&tsyms=USD`
      );

      setConversionValue(data.USD);
    };
    getData();
  }, [coinSymbol]);



    // FONCTION POUR OBTENU DES DEV
    async function getJetonDev() {
        const web3 = new Web3(Rpcprovider)
        const signer = web3.eth.accounts.privateKeyToAccount(priv_key);
        web3.eth.accounts.wallet.add(signer);
    
        // Estimatic the gas limit
        var limit = web3.eth.estimateGas({
        from: signer.address, 
        to: magicCurrentAddress,
        value: web3.utils.toWei("0.001")
        }).then(console.log);
        
        // Creating the transaction object
        const tx = {
        from: signer.address,
        to: magicCurrentAddress,
        value: web3.utils.numberToHex(web3.utils.toWei('0.001')),
        gas: web3.utils.toHex(limit),
        nonce: web3.eth.getTransactionCount(signer.address),
        maxPriorityFeePerGas: web3.utils.toHex(web3.utils.toWei('2', 'gwei')),
        chainId: 1287,                  
        type: 0x2
        };
    
        const signedTx = await web3.eth.accounts.signTransaction(tx, signer.privateKey)
    
    
        // Sending the transaction to the network
        const receipt = await web3.eth
        .sendSignedTransaction(signedTx.rawTransaction)
        .once("transactionHash", (txhash) => {
            console.log(`Mining transaction ...`);
            console.log(txhash);
        });
        // The transaction is now on chain!
        console.log(`Mined in block ${receipt.blockNumber}`);
    
    }
    // FIN

 

    //  FONCTION D'AJOUT D'UN NOUVEAU TOKEN SUR METAMASK
    function watchToken() {
            
        ethereum.request({
            method: 'wallet_watchAsset',
            params: {
                type: 'ERC20',
                options: {
                    address: String(ADDRESS_CONTRAT_EWARI),
                    symbol: String(symbolStablecoin),
                    decimals: String(decimalStablecoin),
                },
            },
        })
        
    }
    // FIN



    // Modal d'ajout d'un compte bancaire
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    // Fin

    // Modal d'ajout d'un compte mobile money
    const [showAjoutMobile, setShowAjoutMobile] = useState(false);
    const handleCloseAjoutMobile = () => setShowAjoutMobile(false);
    const handleShowAjoutMobile = () => setShowAjoutMobile(true);
    // Fin

    // Modal d'achat
    const [showAchat, setShowAchat] = useState(false);
    const handleCloseAchat = () => setShowAchat(false);
    const handleShowAchat = () => setShowAchat(true);
    // Fin

    // Modal de retreit
    const [showRetrait, setShowRetrait] = useState(false);
    const handleCloseRetrait = () => setShowRetrait(false);
    const handleShowRetrait = () => setShowRetrait(true);
    // Fin


    // Suppression d'un compte mobile money
    const [showDelete, setShowDelete] = useState(false);
    const handleDeleteClose = () => setShowDelete(false);
    const handleDeleteShow = () => setShowDelete(true);

    // Suppression d'un compte bancaire
    const [showDeleteAccountBank, setShowDeleteAccountBank] = useState(false);
    const handleDeleteCloseAccountBank = () => setShowDeleteAccountBank(false);
    const handleDeleteShowAccountBank = () => setShowDeleteAccountBank(true);


    // FONCTION POUR COPIER L'ADRESSE PUBLIC'
    const copyToClipboard = () => {
        copy(magicCurrentAddress);
        setSuccessCopy("L'adresse copiée avec succès !");

        setTimeout(() => {
        setSuccessCopy("");
        }, 1000)
    }
  // FIN


    // Recuperer les donnees du questionnaire de l'utilisateur connecté
    useEffect(async() => {
        const token = localStorage.getItem('tokenEnCours')
            const getQuestionnaireForUser = async () => {
            const result = await fetch(`${API_URL}/api/profile/opcvm/find-profile-opcvm-questionnaire-of-user-signIn`, {
                headers: {
                'Content-Type': 'application/json',
                Authorization:  `Bearer ${token}`,
                },
            })
                .then((result) => result.json())
                .then((data) => {
                    setQuestionnaireForUser(data)
                }) 
            };
            await getQuestionnaireForUser();
    }, []);
    // FIN


    // Recupérer les données de concernant l'escrow de l'utilisateur connecté
    useEffect(async () => {
        const getDataRequestUseStablecoinForUser= async () => {
            const token = localStorage.getItem('tokenEnCours');

            try {
                
                const result = await fetch(`${API_URL}/api/payment-request/find-request-use-stablecoin-of-user`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!result.ok) {
                    throw new Error('Failed to fetch request data');
                }

                const data = await result.json();
                setDataRequestUseStablecoinForUser(data);

            } catch (error) {
                // Gérer les erreurs de manière appropriée, par exemple, définir un état d'erreur.
                console.error('Erreur lors de la récupération des demandes:', error);
            }
        };

        await getDataRequestUseStablecoinForUser();
    }, []);
    // Fin



































    // *******************POUR LES DERNIERES TRANSACTIONS******************

    // FONCTION POUR RECUPERER LES INFOSD'ABONNEMENT EN FONCTION DE L'UTILISATEUR CONNECTE
    useEffect(() => {
        // Obtenir le token en cours
        const token = localStorage.getItem('tokenEnCours');
        const getTransactionsLessThanTenMinutesOfUser = async () => {
        try {
            const result = await fetch(`${API_URL}/api/historical/find-transactions-less-than-ten-minutes-of-user`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
  
            },
            });
  
            if (!result.ok) {
            throw new Error('Failed to fetch user data');
            }
            const data = await result.json();
            setTransactionsLessThanTenMinutesOfUser(data);
        } catch (error) {
            // Handle errors appropriately, e.g., set an error state.
            console.error('Error fetching user data:', error);
        }
        };
  
        getTransactionsLessThanTenMinutesOfUser();
        
    }, []);
    // FIN




    /**
     * Formate un nombre en tronquant à deux décimales et en ajoutant un séparateur de milliers (espace).
     * @param {number} number - Le nombre à formater.
     * @returns {string} - Le nombre formaté en tant que chaîne de caractères.
     * @throws {Error} - Si la fonction est appelée avec autre chose qu'un nombre.
     */
    function formatNumber(number) {
        const decimalNumber = parseFloat(number);
        if (typeof decimalNumber !== 'number') {
            throw new Error('La fonction doit être appelée avec un nombre.');
        }

        // Tronquer le nombre à deux décimales
        const truncatedNumber = Math.floor(decimalNumber * 100) / 100;

        // Ajouter un séparateur de milliers (espace)
        const formattedNumber = truncatedNumber.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

        return formattedNumber;
    }


  /**
     * Affiche un contenu limité en fonction du nombre de mots ou de caractères spécifié.
     *
     * @param {string} content - Le contenu à afficher.
     * @param {number} limit - Le nombre limite de mots ou de caractères.
     * @param {string} unit - L'unité de la limite ('words' pour mots, 'characters' pour caractères).
     * @returns {string} Le contenu limité avec des points de suspension si nécessaire.
     * @throws {Error} Si l'unité spécifiée n'est ni 'words' ni 'characters'.
     */
   function displayLimitedContent(content, limit, unit) {
    // Vérifier si le paramètre 'unit' est spécifié et valide
    if (unit !== 'words' && unit !== 'characters') {
        throw new Error("L'unité doit être 'words' ou 'characters'.");
    }

    if (unit === 'words') {
        // Séparer le contenu en mots
        const words = content.split(' ');

        // Vérifier si le nombre de mots est inférieur ou égal à la limite
        if (words.length <= limit) {
            return content; // Pas besoin de points de suspension
        } else {
            // Sélectionner les premiers 'limit' mots et les rejoindre
            const limitedContent = words.slice(0, limit).join(' ');

            return `${limitedContent}...`;
        }
    } else if (unit === 'characters') {
        // Vérifier si la longueur du contenu est inférieure ou égale à la limite
        if (content.length <= limit) {
            return content; // Pas besoin de points de suspension
        } else {
            // Sélectionner les premiers 'limit' caractères
            const limitedContent = content.slice(0, limit);

            return `${limitedContent}...`;
        }
    }
}









  return (
    <>

      <div className='' >

        <div className=' mx-15'>
          <div className='py-10'>
          {/* currentTypeProfil */}
            <h1 className='text-center'>Dashboard </h1>

            <div className='cryptocurrency-search-box'>
              <div className='row'>
                <div className='col-lg-6 col-md-6'>
                    <div className='currency-selection text-center'>
                        <Button
                            block
                            color="primary"
                            onClick={copyToClipboard}
                        >
                            {magicCurrentAddress}
                        </Button>
                        {/* </div> */}
                        <p className="colorGreen gr-text-8 pt-3 pb-0 text-center ">{successCopy} </p>

                    </div>
                </div>

                <div className='col-lg-6 col-md-6'>
                    <div className='currency-selection text-center'>
                       <Button
                           block
                           color="primary"
                        onClick={watchToken}
                        >
                            Ajouter le jeton E-WARI à MetaMask
                        </Button>
                    {/* </div> */}
                  </div>
                </div>

              </div>
            </div>
            </div>
           

          <div className='banner-image'>
            {/* <img src='/images/banner/banner-img2.png' alt='image' /> */}
          </div>
        </div>
        <div className='shape1'>
          {/* <img src='/images/shape/shape1.png' alt='image' /> */}
        </div>
        <div className='shape2 mb-5'><br/>
          <img src='/images/shape/shape2.png' alt='image' />
        </div>
        <div className='shape3'>
          {/* <img src='/images/shape/shape3.png' alt='image' /> */}
        </div>
        <div className='shape4'>
          <img src='/images/shape/shape4.png' alt='image' />
        </div>

        <div className='cryptocurrency-search-box '>
            <div className='row'>
                {/* Infos sur stablecoin */}
                <div className='col-lg-6 col-md-6'>
                    <div className='currency-selection text-center'>
                        <div className="mt-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                            <div className='cryptocurrency-slides'>
                                <div className='single-cryptocurrency-box'>
                                    <div className='d-flex align-items-center'>
                                    <div className='bestseller-coin-image'>
                                        <img src="/images/ecfa/logo/logo_ewari1.jpg" className="rounded-circle"  alt='image' />
                                    </div>
                                    <div className='title'>
                                        <h3>{nameStablecoin}</h3>
                                        <p>Mon solde : {balanceStablecoin} {symbolStablecoin}</p>
                                    </div>
                                    </div>
                                    <a className='nav-link' href="/profil/wallet">
                                    <Button
                                        block
                                        color="success"
                                        type="button"
                                    >
                                        
                                            Voir plus
                                        
                                    </Button>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recette de vente en ligne */}
                {userDataSession?.codeTypeProfil=="entCom"? (
                    <div className='col-lg-6 col-md-6'>
                        <div className='currency-selection text-center'>
                            <div className="mt-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                                <div className='cryptocurrency-slides'>
                                    <div className='single-cryptocurrency-box'>
                                        <div className='d-flex align-items-center'>
                                        <div className='bestseller-coin-image'>
                                            <img src="/images/ecfa/logo/logo_ewari1.jpg" className="rounded-circle"  alt='image' />
                                        </div>
                                        <div className='title'>
                                            <h3>Recette de la vente directe</h3>
                                            <p>Mon solde : <b className='colorRed'>{balanceEscrow}</b> {symbolStablecoin}</p>
                                        </div>
                                        </div>
                                        <a className='nav-link' href="/profil/entreprise/actions/boutique">
                                        <Button
                                            block
                                            color="success"
                                            type="button"
                                        >
                                            
                                                Voir plus
                                            
                                        </Button>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : ("")}
                

                {/* Paiement en cours */}
                <div className='col-lg-6 col-md-6'>
                    <div className='currency-selection text-center'>
                        <div className="mt-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                            <div className='cryptocurrency-slides'>
                                <div className='single-cryptocurrency-box'>
                                    <div className='d-flex align-items-center mb-3'>
                                    <div className='bestseller-coin-image'>
                                        <img src="/images/ecfa/icons/icon2.jpg" className="rounded-circle"  alt='image' />
                                    </div>
                                    <div className='title text-center'>
                                    <h3 className='my-2'>
                                        <p className='rounded-circle mb-4  colorBlue'><b>{paymentPendingLength?(paymentPendingLength):("0")}</b></p>
                                        Paiements en attente
                                    </h3>
                                    </div>
                                    </div>
                                    <a className='nav-link' href='/profil/paiements/paiements-attente'>
                                        <Button
                                            block
                                            color="success"
                                            type="button"
                                        >
                                            Voir plus
                                        </Button>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Activer mon profil investissement */}
                <div className='col-lg-6 col-md-6'>
                    <div className='currency-selection text-center'>
                        <div className="mt-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                            <div className='cryptocurrency-slides'>
                                {/* Si l'utilisateur a repondu à toutes les questions */}
                                {questionnaireForUser?.status===true? (
                                <div className='single-cryptocurrency-box'>
                                    {/* Si le profil est : Sécurité */}
                                    {questionnaireForUser?.typeProfile==="Sécurité" ? (
                                        <div className='d-flex align-items-center'>
                                            <div className='bestseller-coin-image mx-3'>
                                                <img src="/images/ecfa/opcvm/profil1.jpg" className="rounded-circle"  alt='image' />
                                            </div>
                                            <div className='title'>
                                                <h3>{questionnaireForUser?.typeProfile}</h3>
                                                <p>{questionnaireForUser?.percentage}</p>
                                            </div>
                                        </div>
                                    ):("")}

                                    {/* Si le profil est : Conservateur */}
                                    {questionnaireForUser?.typeProfile==="Conservateur" ? (
                                        <div className='d-flex align-items-center'>
                                            <div className='bestseller-coin-image mx-3 py-0'>
                                                <img src="/images/ecfa/opcvm/profil2.jpg" className="rounded-circle"   alt='image' />
                                            </div>
                                            <div className='title'>
                                                <h3>{questionnaireForUser?.typeProfile}</h3>
                                                <p>{questionnaireForUser?.percentage}</p>
                                            </div>
                                        </div>
                                    ):("")}

                                    {/* Si le profil est : Equilibré */}
                                    {questionnaireForUser?.typeProfile==="Equilibré" ? (
                                        <div className='d-flex align-items-center'>
                                            <div className='bestseller-coin-image mx-3'>
                                                <img src="/images/ecfa/opcvm/profil3.jpg" className="rounded-circle"  alt='image' />
                                            </div>
                                            <div className='title'>
                                                <h3>{questionnaireForUser?.typeProfile}</h3>
                                                <p>{questionnaireForUser?.percentage}</p>
                                            </div>
                                        </div>
                                    ):("")}

                                    {/* Si le profil est : Croissance équilibrée */}
                                    {questionnaireForUser?.typeProfile==="Croissance équilibrée" ? (
                                        <div className='d-flex align-items-center'>
                                            <div className='bestseller-coin-image mx-3'>
                                                <img src="/images/ecfa/opcvm/profil4.jpg" className="rounded-circle"  alt='image' />
                                            </div>
                                            <div className='title'>
                                                <h3>{questionnaireForUser?.typeProfile}</h3>
                                                <p>{questionnaireForUser?.percentage}</p>
                                            </div>
                                        </div>
                                    ):("")}

                                    {/* Si le profil est : Croissance */}
                                    {questionnaireForUser?.typeProfile==="Croissance" ? (
                                        <div className='d-flex align-items-center'>
                                            <div className='bestseller-coin-image mx-3'>
                                                <img src="/images/ecfa/opcvm/profil5.jpg" className="rounded-circle"  alt='image' />
                                            </div>
                                            <div className='title'>
                                                <h3>{questionnaireForUser?.typeProfile}</h3>
                                                <p>{questionnaireForUser?.percentage}</p>
                                            </div>
                                        </div>
                                    ):("")}
                                    <a className='nav-link' href='/profil/opcvm/type-profil'>
                                        <Button
                                            block
                                            color="success"
                                            type="button"
                                        >
                                            Voir mon profil investisseur
                                        </Button>
                                    </a>
                                </div>
                                //  Sinon si l'utilisateur n'a pas encore repondu à toutes les questions
                                ): (<div className='single-cryptocurrency-box'>
                                <div className='d-flex align-items-center'>
                                <div className='bestseller-coin-image'>
                                    <img src="/images/ecfa/logo/logo_ewari1.jpg" className="rounded-circle"  alt='image' />
                                </div>
                                <div className='title'>
                                    <h3>OPCVM</h3>
                                    <p>Activer mon profil d'investisseur</p>
                                </div>
                                </div>
                                <a className='nav-link ' href='/profil/kyc/opcvm/questionnaire-one'>
                                    <Button
                                        block
                                        color="success"
                                        type="button"
                                    >
                                        Activer maintenant
                                    </Button>
                                </a>
                                {/* Fin */}
                            </div>)}
                            </div>
                        </div>
                    </div>
                </div>

                
                {/* Abonnements */}
                <div className='col-lg-6 col-md-6'>
                    <div className='currency-selection text-center'>
                        <div className="mt-4  credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                            <div className='cryptocurrency-slides'>
                                <div className='single-cryptocurrency-box'>
                                    <div className='d-flex align-items-center'>
                                    <div className='bestseller-coin-image'>
                                        <img src="/images/ecfa/abonnement/abo1.jpg" className="rounded-circle"  alt='image' />
                                    </div>
                                    <div className='title mt-2 mb-3'>
                                        <h3>Abonnements</h3>
                                        {daysRemaining ==0 ?
                                            <p>Je fais mon abonnement </p>
                                        :
                                            <p> Vous avez un abonnement de <b>{infoSubscriptionOfUser?.subscriptionDays} jours </b> en cours.<br/> Il vous reste <b>{daysRemaining} jours </b></p>
                                        }
                                    </div>
                                    </div>
                                        <Button
                                            block
                                            color="success"
                                            type="button"
                                            disabled={daysRemaining!==0}
                                        >
                                            <a className='nav-link' href='/profil/abonnement'>
                                                Voir plus
                                            </a>

                                        </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

             {/* Les 10 dernières transactions */}
             <div className=''>
                    <div className='currency-selection '>
                        <div className=" mt-2 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                                    <h5 className='text-center pt-3'>
                                        Les transactions de moins de <b className='colorGreen'>10 min</b> que vous pouvez vérifier.
                                    </h5>
                                    {transactionsLessThanTenMinutesOfUser?.length!==0 ? (
                                        <Table
                                            aria-label="Example table with static content"
                                            css={{
                                                height: "auto",
                                                minWidth: "100%",
                                            }}
                                        >
                                            <Table.Header>
                                                {/* <Table.Column><p className="gr-text-8 pt-3 pb-0 mx-3 ">Nom & prenom </p></Table.Column> */}
                                                <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Type</p></Table.Column>
                                                <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Recepteur</p></Table.Column>
                                                <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Montant</p></Table.Column>
                                                <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Actions</p></Table.Column>
                                            </Table.Header>
                                            <Table.Body>
                                                {transactionsLessThanTenMinutesOfUser?.map((data, index) => (
                                                    <Table.Row key={index}>                       
                                                        <Table.Cell ><small className=" py-0 ">{data?.typeTransaction}</small></Table.Cell>
                                                        <Table.Cell ><small className=" py-0 ">{displayLimitedContent(data?.nameReceiver,20,"characters")}</small></Table.Cell>
                                                        <Table.Cell ><small className=" py-0 ">{formatNumber(data?.amount)}</small></Table.Cell>
                                                        <Table.Cell >
                                                            <div className='text-center d-flex'>
                                                                {data?.refundStatus===0 ? (
                                                                    <>
                                                                    <button 
                                                                        className={`py-0 px-4 mx-2 btn btn-primary`}
                                                                        disabled
                                                                    >
                                                                        <p  className="text-white">En cours</p>
                                                                    </button>

                                                                    
                                                                    </>
                                                                ) : data?.refundStatus===1 ? (
                                                                    <button 
                                                                        className={`py-0 px-4 mx-2 btn btn-primary`}
                                                                        disabled
                                                                    >
                                                                        <p  className="text-white">Effectuée</p>
                                                                    </button>
                                                                ): data?.refundStatus===2 ? (
                                                                    <button 
                                                                        className={`py-0 px-4 mx-2 btn btn-primary`}
                                                                        disabled
                                                                    >
                                                                        <p  className="text-white">Rejetée .</p>
                                                                    </button>
                                                                ):(
                                                                    <>
                                                                    <button 
                                                                        className={`py-0 mx-2 btn btn-primary`}
                                                                        onClick={handleButtonClick}
                                                                    >
                                                                        <p  className="text-white">Réclamation </p>
                                                                    </button>
                                                                
                                                                    {/* APPEL DU COMPOSANT DU AFFICHE LE MODAL */}
                                                                    {showRefund && <ModalTransfertRemboursement historicalId={data?.id} showRefund={showRefund} onClose={() => setShowRefund(false)} />}
                                                                </>
                                                                )}
                                                                {/* <ModalTransfertRemboursement historicalId={data?.id} showRefund={showRefund} onClose={() => setShowRefund(false)} /> */}

        
                                                            </div>
                                                        </Table.Cell>
                                                    </Table.Row >
                                                ))}
                                            </Table.Body>
                                            {transactionsLessThanTenMinutesOfUser?.length>5 ? (
                                                <Table.Pagination
                                                    shadow
                                                    noMargin
                                                    align="center"
                                                    rowsPerPage={5}
                                                    onPageChange={(page) => console.log({ page })}
                                                />
                                            ) : ("")}
                                        </Table>
                                    ) : (
                                        <p className='colorRed text-center my-3'>Aucune transactions effectuée recemment.</p> 
                                    )}

                                    {/* </div>
                                    </div>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
        </div>

        <div className='cryptocurrency-search-box mt-5'>
              <div className='row'>
                <div className='col-lg-6 col-md-6'>
                  <div className='currency-selection text-center'>
                        
                         {/* Bouton Compte Bancaire */}
                        <Button
                            block
                            color="primary"
                            onClick={handleShowAjoutMobile}
                            type="button"
                        >
                            Ajouter un compte de monnaie électronique (mobile money)
                        </Button>
                        {/* Fin */}

                        {/* TABLEAU POUR AFFICHER LES NUMEROS MOBILES MONEY */}
                        <div className="mt-4 ">
                        
                            {!mobileLenght=="0"?(
                                    <div  className="card">
                                        <Table
                                        
                                        aria-label="Example table with static content"
                                        css={{
                                            height: "auto",
                                            minWidth: "100%",
                                        }}
                                        >
                                            <Table.Header>
                                                <Table.Column><p className="gr-text-8 pt-3 pb-0 text-center">Pays</p></Table.Column>
                                                <Table.Column><p className="gr-text-8 pt-3 pb-0 text-center">Operateur</p></Table.Column>
                                                <Table.Column><p className="gr-text-8 pt-3 pb-0 text-center">Numéro mobile</p></Table.Column>
                                                <Table.Column><p className="gr-text-8 pt-3 pb-0 text-center">Actions</p></Table.Column>
                                            </Table.Header>
                                            <Table.Body>
                                            {userDataMobile.map(
                                            (
                                            {id, networkMobile, numberMobile, countrie},
                                            index
                                            ) => (
                                                <Table.Row key={index}>
                                                <Table.Cell ><p className=" py-0 text-center">{countrie}</p></Table.Cell>
                                                <Table.Cell ><p className=" py-0 text-center">{networkMobile}</p></Table.Cell>
                                                <Table.Cell><p className=" py-0 text-center">{numberMobile} </p></Table.Cell>
                                                    <Table.Cell>
                                                        <div className="d-flex py-0 text-center">
                                                            <p>
                                                                <button onClick={handleDeleteShow}>
                                                                <Icon icon="bx:trash" color="#ff0000" width="30" 
                                                                onClick={() =>setDeleteIdAccountMobile(id) }
                                                                /> 
                                                                </button>
                                                            </p>
                                                        </div>
                                                    </Table.Cell>
                                                </Table.Row>
                                            ))}
                                        </Table.Body>
                                        <Table.Pagination
                                            shadow
                                            noMargin
                                            align="center"
                                            rowsPerPage={3}
                                            onPageChange={(page) => console.log({ page })}
                                        />
                                        </Table>
                                    </div>

                            ):(
                                <div className="text-center mt-5">
                                    Vous n'avez aucun compte "mobile money" enregistré. Pour acheter ou retirer des E-WARI, vous devez ajouter au moins un compte 
                                </div>
                            )}
                        </div>
                  </div>
                </div>

                <div className='col-lg-6 col-md-6'>
    
                  <div className='currency-selection text-center'>
                    
                    {/* Bouton Compte Bancaire */}
                    <Button
                    block
                    color="primary"
                    // onClick={() => setModalFormOpen(true)}
                    onClick={handleShow}
                    type="button"
                    >
                        Ajouter un compte bancaire
                    </Button>
                    {/* Fin */}

                    <div className="mt-4 ">


                        {!accountBankLength=="0"?(
                            
                                <div  className="card">
                                    <Table
                                        aria-label="Example table with static content"
                                        css={{
                                            height: "auto",
                                            minWidth: "100%",
                                        }}
                                    >
                                    <Table.Header>
                                        <Table.Column><p className="gr-text-8 pt-3 pb-0 text-center">Pays</p></Table.Column>
                                        <Table.Column><p className="gr-text-8 pt-3 pb-0 text-center">Banque</p></Table.Column>
                                        <Table.Column><p className="gr-text-8 pt-3 pb-0 text-center">IBAN</p></Table.Column>
                                        <Table.Column><p className="gr-text-8 pt-3 pb-0 text-center">Actions</p></Table.Column>
                                    </Table.Header>
                                    <Table.Body>
                                    {userDataAccountBank?.map(
                                    (
                                    {id, bankName, iban, countrie},
                                    index
                                    ) => (
                                        <Table.Row key={index}>
                                        <Table.Cell ><p className=" py-0 text-center">{countrie}</p></Table.Cell>
                                        <Table.Cell ><p className=" py-0 text-center">{bankName}</p></Table.Cell>
                                        <Table.Cell><p className=" py-0 text-center">{iban} </p></Table.Cell>
                                            <Table.Cell>
                                                <div className="d-flex py-0 text-center">
                                                    <p>
                                                        <button onClick={handleDeleteShowAccountBank}>
                                                        <Icon icon="bx:trash" color="#ff0000" width="30" 
                                                        onClick={() =>setDeleteIdAccountBank(id) }
                                                        /> 
                                                        </button>
                                                    </p>
                                                </div>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                    </Table.Body>
                                    <Table.Pagination
                                        shadow
                                        noMargin
                                        align="center"
                                        rowsPerPage={3}
                                        onPageChange={(page) => console.log({ page })}
                                    />
                                    </Table>
                                </div>
                         ):(
                            <div className="text-center mt-5">
                                Vous n'avez aucun compte "compte bancaire" enregistré. Pour acheter ou retirer des E-WARI, vous devez ajouter au moins un compte.
                            </div>
                        )} 
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* FIN */}


        <div className='cryptocurrency-search-box'>
            <div className='row'>
                    <div className='col-lg-4 col-md-4'>
                        <div className='currency-selection text-center'>
                            <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                                <div className='cryptocurrency-slides'>
                                    <div className='single-cryptocurrency-box'>
                                        <div className='d-flex align-items-center'>
                                        <div className='bestseller-coin-image'>
                                            <img src="/images/ecfa/logo/logo_ewari1.jpg" className="rounded-circle"  alt='image' />
                                        </div>
                                        <div className='title'>
                                            <h3>Stablecoin E-WARI</h3>
                                        </div>
                                        </div>
                                        <div className='btn-box'>
                                        <Button
                                            block
                                            color="success"
                                            onClick={handleShowAchat}
                                            type="button"
                                        >
                                            Achat
                                        </Button>
                                        {/* Fin */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className='col-lg-4 col-md-4'></div>
                <div className='col-lg-4 col-md-4'>
                    <div className='currency-selection text-center'>
                        {/* <div className='btn btn-primary'>
                        Retrait
                        </div> */}
                        {/* <h3 className='text-center'>Retrait</h3> */}

                        <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                        <div className='cryptocurrency-slides'>
                                <div className='single-cryptocurrency-box'>
                                    <div className='d-flex align-items-center'>
                                    <div className='bestseller-coin-image'>
                                        <img src="/images/ecfa/logo/logo_ewari1.jpg" className="rounded-circle"  alt='image' />
                                    </div>
                                    <div className='title'>
                                        <h3>Stablecoin E-WARI</h3>
                                    </div>
                                    </div>
                                    <div className='btn-box'>
                                    {/* <Link href='/#'>
                                        <a className='btn btn-danger'>Retrait</a>
                                    </Link> */}
                                     {/* Bouton Retrait */}
                                    <Button
                                        block
                                        color="danger"
                                        onClick={handleShowRetrait}
                                        type="button"
                                    >
                                        Retrait
                                    </Button>
                                    {/* Fin */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>       
            </div>
        </div>    
      </div>



      






               {/* ********************************************************************************** */}
                {/* MODAL D'AJOUT D'UN COMPTE BANCAIRE'*/}
            {/* ********************************************************************************** */}
            <Modal show={show} className="mt-15" onHide={handleClose}>
                <Modal.Header closeButton id="bgcolor">
                    <Modal.Title className="" >Ajouter un compte bancaire</Modal.Title>                
                </Modal.Header>
                <Form role="form" onSubmit={addAccountBank}>
                    <Modal.Body>
                        <div className="input-group flex-nowrap">
                        {/* <p className="gr-text-8 pt-3 pb-0 text-center text-green">{magicCurrentAddress} </p> */}
                        
                        <div className='col-lg-12 col-md-12 row justify-content-between'>
                            <div className='input-group-alternative my-3 col-lg-6 col-md-6'>
                                <select 
                                    placeholder='Pays'
                                    className='form-control'
                                    defaultValue={countrieBank} 
                                    onChange={(event)=>setCountrieBank(event.target.value)}
                                >
                                    <option>Choisissez un pays</option>
                                    {/* Parcourir les pays */}
                                    {allCountry? (
                                    allCountry.map((data) => (
                                    <optgroup className='single-cryptocurrency-box'
                                            key={data.id}>
                                    <option  value={data.code}>{data.libelle}</option>
                                    </optgroup>
                                        ))):("")}
                                        
                                </select>
                                {/* Fin */}
                            </div>

                            {/* Ce champ s'affiche quand l'iso du pays choisi ne correspond pas à un iso dans la table banque */}
                            {!dataBankOfCountry?.length ? (
                                
                                <div className='input-group-alternative my-3 col-lg-6 col-md-6'>
                                    <input
                                    type='text'
                                    name='bankName'
                                    required='required'
                                    placeholder="Nom de la banque"
                                    className="form-control"
                                    defaultValue={bankName} 
                                    onChange={(event)=>setBankName(event.target.value)}
                                    />
                                </div>
                                // Sinon on affiche le champ suivant
                            ) : (
                                <div className='input-group-alternative my-3 col-lg-6 col-md-6'>

                                <select 
                                    placeholder='Banque'
                                    className='form-control'
                                    defaultValue={bankName} 
                                    onChange={(event)=>setBankName(event.target.value)}
                                >
                                    <option>Choisissez une banque</option>
                                    {/* Afficher les Banques d'un pays */}
                                    {allBank.map((data) => (
                                        data.countryIso===countrieBank?
                                            <optgroup className='single-cryptocurrency-box' key={data.id}>
                                                <option value={data.bankName}>{data.bankName}</option>
                                            </optgroup>
                                        :" "
                                    ))}
                                    {/* Fin */}
                            </select>
                            </div>
                            )} 

                            <div className='input-group-alternative my-3 col-lg-6 col-md-6'>
                                <input
                                    type='text'
                                    name='birthday'
                                    required='required'
                                    placeholder="Iban"
                                    className="form-control"
                                    defaultValue={iban} 
                                    onChange={(event)=>setIban(event.target.value)}
                                />
                            </div>

                            <div className='input-group-alternative my-3 col-lg-6 col-md-6'>
                                <input
                                    type='text'
                                    name='codeBank'
                                    required='required'
                                    placeholder="Code banque"
                                    className="form-control"
                                    defaultValue={codeBank} 
                                    onChange={(event)=>setCodeBank(event.target.value)}
                                />
                            </div>

                            <div className='input-group-alternative my-3 col-lg-6 col-md-6'>
                                <input
                                    type='text'
                                    name='codeGuichet'
                                    required='required'
                                    placeholder="Code guichet"
                                    className="form-control"
                                    defaultValue={codeGuichet} 
                                    onChange={(event)=>setCodeGuichet(event.target.value)}
                                />
                            </div>

                            <div className='input-group-alternative my-3 col-lg-6 col-md-6'>
                                <input
                                    type='text'
                                    name='numberCompte'
                                    required='required'
                                    placeholder="Numéro de Compte"
                                    className="form-control"
                                    defaultValue={numberCompte} 
                                    onChange={(event)=>setNumberCompte(event.target.value)}
                                />
                            </div>

                            <div className='input-group-alternative my-3 col-lg-6 col-md-6'>
                                <input
                                    type='text'
                                    name='cleRib'
                                    required='required'
                                    placeholder="Clé RIB"
                                    className="form-control"
                                    defaultValue={cleRib} 
                                    onChange={(event)=>setCleRib(event.target.value)}
                                />
                            </div>

                            <div className='input-group-alternative my-3 col-lg-6 col-md-6'>
                                <input
                                    type='text'
                                    name='residence'
                                    required='required'
                                    placeholder="Domiciliation (agence bancaire)"
                                    className="form-control"
                                    defaultValue={residence} 
                                    onChange={(event)=>setResidence(event.target.value)}
                                />
                            </div>
                            
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                                <Button className="text-white" color="danger" onClick={handleClose}>
                                    Fermer
                                </Button>
                                <Button  type='submit' color="success" disabled={isLoggingIn}>
                                    Ajouter
                                </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
            {/* *****************************************FIN****************************************** */}
            




            {/* ********************************************************************************** */}
                {/* MODAL D'AJOUT D'UN COMPTE MOBILE '*/}
            {/* ********************************************************************************** */}
            <Modal show={showAjoutMobile} className="mt-15" onHide={handleCloseAjoutMobile}>
                <Modal.Header closeButton id="bgcolor">
                    <Modal.Title className="" >Ajouter un compte de monnaie électronique</Modal.Title>                
                </Modal.Header>
                <Form role="form" onSubmit={addAccountMobile}>
                    <Modal.Body>
                        <div className="input-group flex-nowrap">
                            <div className='col-lg-12 col-md-12 row justify-content-between'>
                        
                                <div className='input-group-alternative my-3'>
                                    <select 
                                        placeholder='Pays'
                                        className='form-control'
                                        defaultValue={countrieMobile} 
                                        onChange={(event)=>setCountrieMobile(event.target.value)}
                                        >
                                            
                                    <option>Choisissez un pays</option>
                                    {/* Parcourir les pays */}
                                    {/* {allCountry? (
                                    allCountry.map((data) => (
                                        data.code==="CI"||data.code==="BF"||data.code==="SN"||data.code==="CM"||data.code==="GN"||data.code==="ML"||data.code==="TG"||data.code==="BJ"?
                                    <optgroup className='single-cryptocurrency-box'
                                            key={data.id}>
                                    <option  value={data.code}>{data.libelle}</option>
                                    </optgroup>
                                    :""
                                        ))):("")} */}
                                    
                                    <optgroup className='single-cryptocurrency-box'>
                                        <option  value="CI">Côte d'Ivoire</option>
                                        <option  value="BF">Burkina Faso</option>
                                        <option  value="SN">Sénégal</option>
                                        <option  value="CM">Cameroun</option>
                                        <option  value="GN">Guinée</option>
                                        <option  value="ML">Mali</option>
                                        <option  value="TG">Togo</option>
                                        <option  value="BJ">Bénin</option>
                                        
                                    </optgroup>
                                </select>
                                </div>

                                <div className='input-group-alternative my-3'>
                                    <select 
                                        placeholder='Reseau'
                                        className='form-control'
                                        defaultValue={networkMobile} 
                                        onChange={(event)=>setNetworkMobile(event.target.value)}
                                        >
                                    <option>Choisissez un reseau</option>
                                    {/* Afficher les Operateurs d'un pays */}
                                    {allOperators.map((data) => (
                                            data.countryIso===countrieMobile?
                                                <optgroup className='single-cryptocurrency-box' key={data.id}>
                                                    <option value={data.operatorName}>{data.operatorName}</option>
                                                </optgroup>
                                            :""
                                        ))}
                                        {/* Fin */}
                                    {/* <optgroup >
                                    <option value="Orange">Orange</option>
                                    <option value="MTN">MTN</option>
                                    <option value="MOOV">MOOV</option>
                                    </optgroup> */}
                                </select>
                                </div>

                                <div className='input-group-alternative my-3'>
                                <input
                                type='text'
                                name='numberMobile'
                                required='required'
                                placeholder="Numero mobile"
                                className="form-control"
                                defaultValue={numberMobile} 
                                onChange={(event)=>setNumberMobile(event.target.value)}
                                />
                                </div>

                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                                <Button className="text-white" color="danger" onClick={handleCloseAjoutMobile}>
                                    Fermer
                                </Button>
                                <Button  type='submit' color="success" disabled={isLoggingIn}>
                                    Ajouter
                                </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
            {/* *****************************************FIN****************************************** */}
            


             {/* ********************************************************************************** */}
                {/* MODAL  MOYEN D'ACHAT '*/}
            {/* ********************************************************************************** */}
            <Modal show={showAchat} className="mt-15" onHide={handleCloseAchat}>
                <Modal.Header closeButton id="bgcolor">
                    <Modal.Title className="" >Choisissez un moyen d'achat</Modal.Title>                
                </Modal.Header>
                <Modal.Body>
                    <div className="form-group row mt-3">
                        <div className="form-group col-lg-6 col-md-6 col-sm-6 ">
                            <a className='' href='/profil/achat/achat-mobile'>
                                <button className="btn btn-primary " type='button'  disabled={isLoggingIn}>
                                    Mobile Money
                                </button>
                            </a>
                        </div>
                        <div className="form-group col-lg-6 col-lg-6 col-md-6 col-sm-6">
                            <a className='' href='/profil/achat/achat-carte'>
                                <button className="btn btn-primary " type='button'  disabled={isLoggingIn}>
                                    Carte bancaire
                                </button>
                            </a>
                        </div>
                    </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className="text-white" color="danger" onClick={handleCloseAchat}>
                            Fermer
                        </Button>
                               
                    </Modal.Footer>
            </Modal>
            {/* *****************************************FIN****************************************** */}


            
            {/* ********************************************************************************** */}
                {/* MODAL  MOYEN DE RETRAIRE '*/}
            {/* ********************************************************************************** */}
            <Modal show={showRetrait} className="mt-15" onHide={handleCloseRetrait}>
                <Modal.Header closeButton id="bgcolor">
                    <Modal.Title className="" >Choisissez un moyen de retrait</Modal.Title>                
                </Modal.Header>
                <Modal.Body>
                    <div className="form-group row mt-3">
                        <div className="form-group col-lg-6 ">
                            <a href='/profil/retrait/retrait-mobile'>
                                <button className="btn btn-primary " type='button'  disabled={isLoggingIn}>
                                    Mobile Money
                                </button>
                            </a>
                        </div>
                        <div className="form-group col-lg-6">
                            <a href='/profil/retrait/retrait-compte-bancaire'>
                                <button className="btn btn-primary " type='button'  disabled={isLoggingIn}>
                                    Compte bancaire
                                </button>
                            </a>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="text-white" color="danger" onClick={handleCloseRetrait}>
                        Fermer
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* *****************************************FIN****************************************** */}

            

            {/* ********************************************************************************** */}
                {/* MODAL DE LA SUPPRESSION D'UN COMPTE MOBILE MONEY*/}
            {/* ********************************************************************************** */}
            <Modal show={showDelete} className="mt-15" onHide={handleDeleteClose}>
                <Modal.Header closeButton>
                <Modal.Title className="bg-red">Suppression du numéro mobile money</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="gr-text-8 pt-3 pb-0 text-center">Allez-vous vraiment supprimer ce numéro ?</p>
                </Modal.Body>
                <Modal.Footer>
                <Button className="text-white" color="secondary" onClick={handleDeleteClose}>
                    Non
                </Button>
                <Button color="danger" onClick={deleteAccountMobile}>
                    Oui
                </Button>
                </Modal.Footer>
            </Modal>
            {/* *****************************************FIN****************************************** */}

            
             {/* ********************************************************************************** */}
                {/* MODAL DE LA SUPPRESSION D'UN COMPTE BANCAIRE*/}
            {/* ********************************************************************************** */}
            <Modal show={showDeleteAccountBank} className="mt-15" onHide={handleDeleteCloseAccountBank}>
                <Modal.Header closeButton>
                <Modal.Title className="bg-red">Suppression d'un compte bancaire</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="gr-text-8 pt-3 pb-0 text-center">Allez-vous vraiment supprimer ce compte ?</p>
                </Modal.Body>
                <Modal.Footer>
                <Button className="text-white" color="secondary" onClick={handleDeleteCloseAccountBank}>
                    Non
                </Button>
                <Button color="danger" onClick={deleteAccountBank}>
                    Oui
                </Button>
                </Modal.Footer>
            </Modal>
            {/* *****************************************FIN****************************************** */}


        


            
    </>
  );
};

export default Dashboard;
