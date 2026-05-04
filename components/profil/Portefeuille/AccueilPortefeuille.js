import { useState, useEffect } from 'react';
import { Container, Row, Col, Collapse, Button, Modal,Form } from "react-bootstrap";
import React from "react";
// Importer ABI de E-WARI
import ABI_TOKEN_EWARI from "../../../components/Contrats/Abi/AbiStablecoin.json";



// Pour Magic
import { magic } from "../../../magic";
import { ethers } from "ethers";
import Loading from "../../../components/loading";
import Router from "next/router";
import { Table } from '@nextui-org/react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import copy from "copy-to-clipboard"; 
import Swal from 'sweetalert2'
// FIN

const CAccueilPortefeuille = () => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API
     // Variable de l'api key de stablecoin
     const API_KEY_STABLECOIN = process.env.NEXT_PUBLIC_API_KEY_STABLECOIN
    const URL_API_OPCVM =process.env.NEXT_PUBLIC_URL_API_OPCVM // URL STABLECOIN
    const ADDRESS_CONTRAT_EWARI =process.env.NEXT_PUBLIC_ADDRESS_CONTRAT_EWARI
    const PRIVATE_KEY = process.env.NEXT_PUBLIC_PRIVATE_KEY
    const ADDRESS_COMMISSION_TRANSFER =process.env.NEXT_PUBLIC_ADDRESS_COMMISSION_TRANSFER //Adresse de commission des transferts
    
    const [currentUser, setCurrentUser] = useState();
    const [magicCurrentAddress, setMagicCurrentAddress] = useState();
    const [userMetadata, setUserMetadata] = useState("...");
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState();
    const [walletRelayer, setWalletRelayer] = useState();
    
    
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [showWallet, setShowWallet] = useState(null);
    
    //***************************************************************** *
        // LES STATES DU STABLECOIN
    // ******************************************************************
    const [contractStablecoin, setContractStablecoin] = useState();
    const [nameStablecoin, setNameStablecoin] = useState();
    const [symbolStablecoin, setSymbolStablecoin] = useState();
    const [balanceStablecoin, setBalanceStablecoin] = useState();
    const [balanceStablecoinNoFormat, setBalanceStablecoinNoFormat] = useState();
    const [decimalStablecoin, setDecimalStablecoin] = useState();
    // ****************************************************************************
        // LES STATES DE TRANSFERT
    // ****************************************************************************
    const [emailOtherUser, setEmailOtherUser] = useState();
    const [infosOtherUser, setInfosOtherUser] = useState();
    const [codeOtherUser, setCodeOtherUser] = useState();

    // Autres states
    const [contentDepot, setContentDepot] = useState();
    const [successCopy, setSuccessCopy] = useState();

    // State de coversion
    const [currencyLocal, setCurrencyLocal] = useState()
    const [allInfosConversion, setAllInfosConversion] = useState()

    // States des montant de conversion
    const [amountConvert, setAmountConvert] = useState()
    const [amountConvertNGN, setAmountConvertNGN] = useState()
    const [exchangeRateNGN, setExchangeRateNGN] = useState()
    

    // State de l'état d'abonnement
    const [stateOfSubscription, setStateOfSubscription] = useState()

    // ********************STATES DU OPCVM*******************************************
    const [allFondsOfUser, setAllFondsOfUser] = useState()
    const [allWalletOpcvmOfUser, setAllWalletOpcvmOfUser] = useState()
    
    
    
    // **********************FIN OPCVM***********************************************
    // States de tab
    const [toggleState, setToggleState] = useState(1);
    const toggleTab = (index) => {
        setToggleState(index);
    };
    // Fin

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
          setWalletRelayer(walletRelay)
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
          setBalanceStablecoinNoFormat(balanceStablecoin / 10 ** decimalStablecoin);

          // Obtenir l'utilisateur connecté.
          const token = localStorage.getItem('tokenEnCours');
          const result = await fetch(`${API_URL}/api/user/find-user-sign-in`, {
            headers: {
              'Content-Type': 'application/json',
                    'x-api-key': `${API_KEY_STABLECOIN}`,
              Authorization: `Bearer ${token}`,
            },
          });

          const user = await result.json();
          setCurrentUser(user);
        }
      };

      // Appeler la fonction pour récupérer les informations lorsque le fournisseur Web3 ou Magic changent.
      getMagicAndWeb3Info();
    }, [provider, magic]);



    // Modal Depot
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    // Fin

    // Modal Transfert
    const [showTransfert, setShowTransfert] = useState(false);
    const handleTransfertClose = () => setShowTransfert(false);
    const handleTransfertShow = () => setShowTransfert(true);

    // Modal Transfert sans abonnement
    const [showTransfertNoSubscribe, setShowTransfertNoSubscribe] = useState(false);
    const handleTransfertCloseNoSubscribe = () => setShowTransfertNoSubscribe(false);
    const handleTransfertShowNoSubscribe = () => setShowTransfertNoSubscribe(true);
    

    // Formulaire du Modal Transfert
    const [montantEnvoyer, setMontantEnvoyer] = useState();
    const [addressTo, setAddressTo] = useState();
    const [montantRecu, setMontantRecu] = useState();
    const [percent, setPercent] = useState(0.5);

    const [symbol, setSymbol] = useState();
    // Fin

    // *********************************************************
      // LES CALCULS
    // ***************************************************************

    // Calcule des frais de transaction
    let feeTransfer = montantEnvoyer*percent/100

    if (feeTransfer<10) {
      feeTransfer = 10 //Si le montant est en dessous de 10 on prend 10 comme frais de transfert
    }

    //Calcul du montant à rececoir 
    const montantRecevoir =  montantEnvoyer - feeTransfer
    // *********************FIN CALCUL******************************

    // FONCTION POUR COPIER L'ADRESSE PUBLIC DE L'UTILISATEUR
    const copyToClipboard = () => {
        copy(magicCurrentAddress);
        setSuccessCopy("Adresse copiée avec succès !");

        setTimeout(() => {
        setSuccessCopy("");
        }, 1000)
    }
    // FIN


    // ****************************************************************************
    // META TRANSFER SECURISE VIA BACKEND OPENZEPPELIN RELAYER - 6AR
    // ****************************************************************************
    /*
      Objectif :
      - Ne plus envoyer metaTransfer directement depuis le navigateur.
      - Ne plus faire porter au frontend la logique de relayer pour metaTransfer.
      - Passer par la route serveur /api/metaTransfer.
      - Conserver le token Bearer utilisateur afin que le backend vérifie que
        l'adresse `from` correspond bien à l'utilisateur authentifié.
      - Laisser le backend vérifier :
        * l'adresse from ;
        * le solde E-WARI ;
        * le rôle RELAYER_ROLE ;
        * l'appel OpenZeppelin Relayer local.
    */

    const getMetaTransferAuthToken = () => {
        if (typeof window === "undefined") {
            return "";
        }

        return localStorage.getItem("tokenEnCours") || "";
    };

    const extractMetaTransferReference = (result) => {
        return (
            result?.txHash ||
            result?.transactionHash ||
            result?.hash ||
            result?.relayerTransactionId ||
            result?.relayerTransactionStatus ||
            "OPENZEPPELIN_RELAYER_ACCEPTED"
        );
    };

    const getMetaTransferUserMessage = (data) => {
        const code = data?.code || "";

        if (code === "INSUFFICIENT_BALANCE") {
            return "Votre solde E-WARI est insuffisant pour exécuter ce transfert.";
        }

        if (code === "FROM_ADDRESS_NOT_AUTHENTICATED_USER") {
            return "L'adresse source ne correspond pas à l'adresse blockchain de votre session.";
        }

        if (code === "AUTH_TOKEN_MISSING") {
            return "Votre session est expirée ou invalide. Veuillez vous reconnecter.";
        }

        if (code === "AUTH_USER_BLOCKCHAIN_ADDRESS_MISSING") {
            return "Votre compte ne contient pas encore d'adresse blockchain valide.";
        }

        if (code === "OPENZEPPELIN_RELAYER_API_KEY_MISSING") {
            return "Le service de relayer sécurisé n'est pas correctement configuré côté serveur.";
        }

        if (code === "OPENZEPPELIN_RELAYER_HTTP_ERROR" || code === "OPENZEPPELIN_RELAYER_API_ERROR") {
            return "Le service de relayer sécurisé n'a pas accepté la transaction. Veuillez réessayer.";
        }

        if (code === "RELAYER_ROLE_MISSING") {
            return "Le relayer serveur n'a pas le rôle nécessaire pour exécuter cette transaction.";
        }

        return data?.message || "Une erreur s'est produite lors de la transaction sécurisée.";
    };

    const callBackendMetaTransfer = async ({ from, to, value }) => {
        const token = getMetaTransferAuthToken();

        if (!token) {
            const error = new Error("Token d'authentification manquant.");
            error.code = "AUTH_TOKEN_MISSING";
            throw error;
        }

        const response = await fetch("/api/metaTransfer/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                from,
                to,
                value: ethers.BigNumber.from(value).toString(),
            }),
        });

        let data = null;

        try {
            data = await response.json();
        } catch (_) {
            data = {
                ok: false,
                code: "META_TRANSFER_RESPONSE_INVALID",
                message: "Réponse serveur metaTransfer non reconnue.",
            };
        }

        if (!response.ok || data?.ok === false) {
            const error = new Error(getMetaTransferUserMessage(data));
            error.code = data?.code || "META_TRANSFER_BACKEND_FAILED";
            error.status = response.status;
            error.payload = data;
            throw error;
        }

        return data;
    };

    const executeMetaTransferViaBackend = async (amountWei) => {
        const convertAmount = parseFloat(montantEnvoyer);

        if (balanceStablecoinNoFormat <= convertAmount) {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Erreur',
                html: "Vous n'avez pas suffisamment de fonds pour effectuer cette transaction.",
                showConfirmButton: false,
                timer: 5000
            });

            setIsLoggingIn(false);
            return null;
        }

        const result = await callBackendMetaTransfer({
            from: magicCurrentAddress,
            to: addressTo,
            value: amountWei,
        });

        const txReference = extractMetaTransferReference(result);

        await addHistorical(txReference);

        return result;
    };

    // FIN META TRANSFER SECURISE VIA BACKEND OPENZEPPELIN RELAYER - 6AR


    // *******************************************************************
    // LES FONCTIONS DE RECHERCHE DE L'UTILISATEUR
    // **********************************************************************

    // Obtenir un utilisateur en fonction de son email 
  const searchUserWithEmail = () =>{
    if (emailOtherUser) {
      const getUser = async (_emailOtherUser) => {
          const result = await fetch(`${API_URL}/api/user/find-user-by-email?email=${_emailOtherUser}`, {
              headers: {
              'Content-Type': 'application/json',
                    'x-api-key': `${API_KEY_STABLECOIN}`,
              },
          })
              .then((result) => result.json())
              .then((user) => {
                setInfosOtherUser(user)
                setAddressTo(user?.address)

      
              }) 
      
          };
          
            getUser(emailOtherUser);
        
    }
  }
  // FIN

   // Obtenir un utilisateur en fonction de son adresse blockchain
   const searchUserWithBlockchain = () =>{
    if (addressTo) {
      const getUser = async (_addressTo) => {
          const result = await fetch(`${API_URL}/api/user/find-user-by-addrBlockchain?address=${_addressTo}`, {
              headers: {
              'Content-Type': 'application/json',
                    'x-api-key': `${API_KEY_STABLECOIN}`,
              },
          })
              .then((result) => result.json())
              .then((user) => {
                setInfosOtherUser(user)
                setAddressTo(user?.address)

      
              }) 
      
          };
          
            getUser(addressTo);
        
    }
  }
  // FIN

   // Obtenir un utilisateur en fonction de son Identifiant
   const searchUserWithIdentifiant = () =>{
    if (codeOtherUser) {
      const getUser = async (_codeOtherUser) => {
          const result = await fetch(`${API_URL}/api/user/find-user-by-userCode?code=${_codeOtherUser}`, {
              headers: {
              'Content-Type': 'application/json',
                    'x-api-key': `${API_KEY_STABLECOIN}`,
              },
          })
            .then((result) => result.json())
            .then((user) => {
                setInfosOtherUser(user)
                setAddressTo(user?.address)
            }) 
      
          };
        getUser(codeOtherUser);
    }
  }
  // FIN


    // Fonction d'enregistrement des données du transfert dans l'historique
    const addHistorical = async (_hash) => {
        setIsLoggingIn(true);
        
        let nameSender =""
        if (currentUser?.codeTypeProfil=="part") {
            nameSender = currentUser?.lastName + '' + currentUser?.firstName
        } else {
            nameSender = currentUser?.entreprise
        }

        let nameReceiver =""
        if (infosOtherUser?.codeTypeProfil=="part") {
            nameReceiver = infosOtherUser?.lastName + '' + infosOtherUser?.firstName
        } else {
            nameReceiver = infosOtherUser?.entreprise
        }
        try {
            
            const dataBody = {
                typeTransaction: "Transfert",
                activeName: nameStablecoin,
                activeSymbol: symbolStablecoin,
                nameSender: nameSender,
                nameReceiver: nameReceiver,
                emailSender: currentUser?.email,
                emailReceiver: infosOtherUser?.email,
                senderAddress: magicCurrentAddress,
                receiverAddress: infosOtherUser?.address,
                amount: montantEnvoyer,
                hash: _hash
            }

            // Obtenir le token en cours
            const token = localStorage.getItem('tokenEnCours');
            
            const response = await fetch(`${API_URL}/api/historical/add-historical`, {
                method: 'POST',
                body: JSON.stringify(dataBody),
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': `${API_KEY_STABLECOIN}`,
                    Authorization: `Bearer ${token}`
                },
            });

            /**
             * Données de la réponse de la requête .
             * @type {object}
             */
            const data = await response.json();

            /* Verifier s'il y a un messsage d'erreur, on l'affiche dans SWAL 
            * sinon on affiche le message de succès
            */
            if (data.message==200) {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    html: `<p> votre transfert s'est effectué avec succès.</p>`,
                    showConfirmButton: false,
                    timer: 5000
                });

                // Actualiser après l'affichage
                setTimeout(() => {
                    window.location.reload();
                }, 7000);
                // Fin
            } else {
                setMessageError(data.message);
                setIsLoggingIn(false);
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    html: `<p> ${messageError} </p>`,
                    showConfirmButton: false,
                    timer: 10000
                });
            }
            // Fin condition
        } catch (error) {
            console.error('Erreur =>', error);
        }
    };


    // Fonction d'enregistrement des données du transfert dans l'historique
    const addHistoricalTransferBatch = async (_hash) => {
      setIsLoggingIn(true);
      
      let nameSender =""
      if (currentUser?.codeTypeProfil=="part") {
          nameSender = currentUser?.lastName + '' + currentUser?.firstName
      } else {
          nameSender = currentUser?.entreprise
      }

      let nameReceiver =""
      if (infosOtherUser?.codeTypeProfil=="part") {
          nameReceiver = infosOtherUser?.lastName + '' + infosOtherUser?.firstName
      } else {
          nameReceiver = infosOtherUser?.entreprise
      }
      try {
          
          const dataBody = {
              typeTransaction: "Transfert",
              activeName: nameStablecoin,
              activeSymbol: symbolStablecoin,
              nameSender: nameSender,
              nameReceiver: nameReceiver,
              emailSender: currentUser?.email,
              emailReceiver: infosOtherUser?.email,
              senderAddress: magicCurrentAddress,
              receiverAddress: infosOtherUser?.address,
              commissionWealthechAddress:ADDRESS_COMMISSION_TRANSFER,
              fees:feeTransfer,
              percent:percent,
              amount: montantRecevoir,
              hash: _hash
          }

          // Obtenir le token en cours
          const token = localStorage.getItem('tokenEnCours');
          
          const response = await fetch(`${API_URL}/api/historical/add-historical`, {
              method: 'POST',
              body: JSON.stringify(dataBody),
              headers: {
                  'Content-Type': 'application/json',
                    'x-api-key': `${API_KEY_STABLECOIN}`,
                  Authorization: `Bearer ${token}`
              },
          });

          /**
           * Données de la réponse de la requête .
           * @type {object}
           */
          const data = await response.json();

          /* Verifier s'il y a un messsage d'erreur, on l'affiche dans SWAL 
          * sinon on affiche le message de succès
          */
          if (data.message==200) {
              Swal.fire({
                  position: 'center',
                  icon: 'success',
                  html: `<p> votre transfert s'est effectué avec succès.</p>`,
                  showConfirmButton: false,
                  timer: 5000
              });

              // Actualiser après l'affichage
              setTimeout(() => {
                  window.location.reload();
              }, 7000);
              // Fin
          } else {
              setMessageError(data.message);
              setIsLoggingIn(false);
              Swal.fire({
                  position: 'center',
                  icon: 'error',
                  html: `<p> ${messageError} </p>`,
                  showConfirmButton: false,
                  timer: 10000
              });
          }
          // Fin condition
      } catch (error) {
          console.error('Erreur =>', error);
      }
  };

    // ***************************************************************************************
    // IMPLEMENTATIONS DES FONCTIONS DU SMART CONTRAT DU TOKEN DE STABLECOIN
    // ***************************************************************************************
  
    // Functions de transfert de Stablecoin avec l'adresse Blockchain
    const transferStablecoinNO3 = async () => {
      setIsLoggingIn(true);
      try {
        const tosting = String(montantEnvoyer);
        const amountWei = ethers.utils.parseUnits(tosting, decimalStablecoin);
    
        // Vérifier si magicCurrentAddress a suffisamment de fonds à transférer
        const convertAmount = parseFloat(montantEnvoyer);
        if (balanceStablecoinNoFormat <= convertAmount) {
          // Afficher un message indiquant que magicCurrentAddress n'a pas suffisamment de fonds
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Erreur',
            html: "Vous n'avez pas suffisamment de fonds pour effectuer cette transaction.",
            showConfirmButton: false,
            timer: 5000
          });
          setIsLoggingIn(false);
          return;
        }
    
        // Transmission securisee cote serveur via OpenZeppelin Relayer.
        // Le frontend n'envoie plus directement metaTransfer sur la blockchain.
        const relayerResult = await executeMetaTransferViaBackend(amountWei);
        console.log("MetaTransfer OpenZeppelin Relayer:", relayerResult);
    
      } catch (error) {
        setIsLoggingIn(false);
        console.error("Erreur:", error.message);
        Swal.fire({
          position: 'center',
          icon: 'error',
          html: "Une erreur s'est produite lors de la transaction.",
          showConfirmButton: false,
          timer: 5000
        });
    
        // Afficher des détails supplémentaires sur l'erreur pour le débogage
        console.error("Transaction failed with error:", error);
        if (error.transaction) {
          console.error("Transaction details:", error.transaction);
        }
        if (error.receipt) {
          console.error("Transaction receipt:", error.receipt);
        }
      }
    };
    
    const transferStablecoinNO2 = async () => {
      setIsLoggingIn(true);
      try {
        const tosting = String(montantEnvoyer);
        const amountWei = ethers.utils.parseUnits(tosting, decimalStablecoin);
    
        // Vérifier si magicCurrentAddress a suffisamment de fonds à transférer
        const convertAmount = parseFloat(montantEnvoyer);
        if (balanceStablecoinNoFormat <= convertAmount) {
          // Afficher un message indiquant que magicCurrentAddress n'a pas suffisamment de fonds
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Erreur',
            html: "Vous n'avez pas suffisamment de fonds pour effectuer cette transaction.",
            showConfirmButton: false,
            timer: 5000
          });
          setIsLoggingIn(false);
          return;
        }

        
        // Transmission securisee cote serveur via OpenZeppelin Relayer.
        // Le frontend n'envoie plus directement metaTransfer sur la blockchain.
        const relayerResult = await executeMetaTransferViaBackend(amountWei);
        console.log("MetaTransfer OpenZeppelin Relayer:", relayerResult);
    
      } catch (error) {
        setIsLoggingIn(false);
        console.error("Erreur:", error.message);
        Swal.fire({
          position: 'center',
          icon: 'error',
          html: "Une erreur s'est produite lors de la transaction.",
          showConfirmButton: false,
          timer: 5000
        });
    
        // Afficher des détails supplémentaires sur l'erreur pour le débogage
        console.error("Transaction failed with error:", error);
        if (error.transaction) {
          console.error("Transaction details:", error.transaction);
        }
        if (error.receipt) {
          console.error("Transaction receipt:", error.receipt);
        }
      }
    };
    
    const transferStablecoinNO1 = async () => {
      setIsLoggingIn(true);
      try {
          const tosting = String(montantEnvoyer);
          const amountWei = ethers.utils.parseUnits(tosting, decimalStablecoin);
          
          // Vérifier si magicCurrentAddress a suffisamment de fonds à transférer
          const convertAmount = parseFloat(montantEnvoyer);
          if (balanceStablecoinNoFormat <= convertAmount) {
              // Afficher un message indiquant que magicCurrentAddress n'a pas suffisamment de fonds
              Swal.fire({
                  position: 'center',
                  icon: 'error',
                  title: 'Erreur',
                  html: "Vous n'avez pas suffisamment de fonds pour effectuer cette transaction.",
                  showConfirmButton: false,
                  timer: 5000
              });
              setIsLoggingIn(false);
              return;
          }
          
          // Transmission securisee cote serveur via OpenZeppelin Relayer.
          // Le frontend n'envoie plus directement metaTransfer sur la blockchain.
          const relayerResult = await executeMetaTransferViaBackend(amountWei);
          console.log("MetaTransfer OpenZeppelin Relayer:", relayerResult);
  
      } catch (error) {
          setIsLoggingIn(false);
          console.error("Erreur:", error.message);
          Swal.fire({
              position: 'center',
              icon: 'error',
              html: "Une erreur s'est produite lors de la transaction.",
              showConfirmButton: false,
              timer: 5000
          });
      }
  };

  
    const transferStablecoin = async () => {
        setIsLoggingIn(true);
        try {
            const tosting = String(montantEnvoyer);
            const amountWei = ethers.utils.parseUnits(tosting, decimalStablecoin);
            
            // Vérifier si magicCurrentAddress a suffisamment de fonds à transférer
            // const balance = await contractStablecoin.balanceOf(magicCurrentAddress);
            const convertAmount = parseFloat(montantEnvoyer)
            if (balanceStablecoinNoFormat<=convertAmount) {
                // Afficher un message indiquant que magicCurrentAddress n'a pas suffisamment de fonds
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Erreur',
                    html: "Vous n'avez pas suffisamment de fonds pour effectuer cette transaction.",
                    showConfirmButton: false,
                    timer: 5000
                });
                setIsLoggingIn(false);
                return;
            }
            
            // Transmission securisee cote serveur via OpenZeppelin Relayer.
            // Le frontend n'envoie plus directement metaTransfer sur la blockchain.
            const relayerResult = await executeMetaTransferViaBackend(amountWei);
            console.log("MetaTransfer OpenZeppelin Relayer:", relayerResult);
    
        } catch (error) {
            setIsLoggingIn(false);
            throw error;
        }
    }
    
    const handleSubmit = (e) => {
        e.preventDefault()
    }
  // Fin



  
    // **********Fonction pour effectuer le transfert en payant les frais de transaction***************************************************************
    const transferBatch = async () => {
      setIsLoggingIn(true);
    
      // Parser le montant à recevoir à l'expéditeur
      const tostingReceiver = String(montantRecevoir);
      const amountWeiReceiver = ethers.utils.parseUnits(tostingReceiver, decimalStablecoin);
    
      // Parser le montant de commission de remboursement de transfert de WTI
      const tostingWti = String(feeTransfer);
      const amountWeiWti = ethers.utils.parseUnits(tostingWti, decimalStablecoin);
    
      const dataForm = {
        addressTo: magicCurrentAddress,
        recipients: [addressTo, ADDRESS_COMMISSION_TRANSFER],
        amounts: [amountWeiReceiver, amountWeiWti],
      };
    
      try {
        // Vérifie que les tableaux ont la même longueur
        if (dataForm?.recipients.length !== dataForm?.amounts.length) {
          setIsLoggingIn(false);
          Swal.fire({
            position: 'center',
            icon: 'error',
            html: `<p> Les tableaux doivent avoir la même longueur.</p>`,
            showConfirmButton: false,
            timer: 5000,
          });
          throw new Error("Les tableaux doivent avoir la même longueur");
        }
    
        // Vérifie si l'abonné a suffisamment de jetons pour effectuer le remboursement
        const convertAmount = parseFloat(montantEnvoyer);
        if (balanceStablecoin <= convertAmount) {
          setIsLoggingIn(false);
          Swal.fire({
            position: 'center',
            icon: 'error',
            html: "Votre solde est insuffisant pour effectuer le transfert.",
            showConfirmButton: false,
            timer: 5000,
          });
          throw new Error("Solde insuffisant pour effectuer le transfert.");
        }
    
        // Vérifie que l'expéditeur a suffisamment de DEV pour les frais de gas
        const gasEstimate = await contractStablecoin.estimateGas.transferBatch(dataForm?.addressTo, dataForm?.recipients, dataForm?.amounts);
        const gasPrice = await provider.getGasPrice();
        const gasCost = gasEstimate.mul(gasPrice);
        const senderBalance = await walletRelayer.getBalance();
    
        console.log("Gas Estimate:", gasEstimate.toString());
        console.log("Gas Price:", gasPrice.toString());
        console.log("Gas Cost:", gasCost.toString());
        console.log("Sender Balance:", senderBalance.toString());
    
        if (gasCost.gt(senderBalance)) {
          setIsLoggingIn(false);
          Swal.fire({
            position: 'center',
            icon: 'error',
            html: `<p> L'exécuteur n'a pas suffisamment de frais de gas pour exécuter cette transaction.</p>`,
            showConfirmButton: false,
            timer: 5000,
          });
          throw new Error("L'exécuteur n'a pas suffisamment de frais de gas pour exécuter cette transaction.");
        }
    
        // Effectue le transfert pour chaque destinataire dans une seule transaction
        const transferBatchTx = await contractStablecoin.transferBatch(dataForm?.addressTo, dataForm?.recipients, dataForm?.amounts);
        await transferBatchTx.wait();
    
        // Appel de la fonction de la mise à jour de l'historique de transaction
        addHistoricalTransferBatch(transferBatchTx?.hash);
      } catch (error) {
        setIsLoggingIn(false);
        Swal.fire({
          position: 'center',
          icon: 'error',
          html: `<p> Une erreur s'est produite lors de la transaction.</p>`,
          showConfirmButton: false,
          timer: 5000,
        });
        console.error("Erreur:", error.message);
      }
    };
    
    
    
    const transferBatchNO = async () => {
      setIsLoggingIn(true)
  
      // Parser le montant à recevoir à l'expéditeur
      const tostingReceiver = String(montantRecevoir)
      const amountWeiReceiver = ethers.utils.parseUnits(tostingReceiver, decimalStablecoin);
  
      // Parser le montant de commission de remboursement de transfert de WTI
      const tostingWti = String(feeTransfer)
      const amountWeiWti = ethers.utils.parseUnits(tostingWti, decimalStablecoin);
  
     
      // return
      const dataForm = {
        addressTo:magicCurrentAddress,
        recipients: [addressTo, ADDRESS_COMMISSION_TRANSFER],
        amounts: [amountWeiReceiver, amountWeiWti],
      };
      
      try {
        // Vérifie que les tableaux ont la même longueur
        if (dataForm?.recipients.length !== dataForm?.amounts.length) {
          setIsLoggingIn(false)
          Swal.fire({
            position: 'center',
            icon: 'error',
            html: `<p> Les tableaux doivent avoir la même longueur.</p>`,
            showConfirmButton: false,
            timer: 5000
          });
          throw new Error("Les tableaux doivent avoir la même longueur");
        }
  
      // Vérifie si l'abonné a suffisamment de jetons pour effectuer le remboursement
        const convertAmount = parseFloat(montantEnvoyer)
        if (balanceStablecoin<=convertAmount) {
          setIsLoggingIn(false);
          Swal.fire({
            position: 'center',
            icon: 'error',
            html: "Votre solde est insuffisant pour effectuer le transfert.",
            showConfirmButton: false,
            timer: 5000,
          });
          throw new Error("Solde insuffisant pour effectuer le transfert.");
        }
  
        // Vérifie que l'expéditeur a suffisamment de DEV pour les frais de gas
        const gasEstimate = await contractStablecoin.estimateGas.transferBatch(dataForm?.addressTo, dataForm?.recipients, dataForm?.amounts);
        const gasCost = gasEstimate.mul(await provider.getGasPrice());
        const senderBalance = await walletRelayer.getBalance();
  
        if (gasCost?._hex>senderBalance?._hex) {
          setIsLoggingIn(false)
          Swal.fire({
            position: 'center',
            icon: 'error',
            html: `<p> L'exécuteur n'a pas suffisamment de frais de gas pour exécuter cette transaction.</p>`,
            showConfirmButton: false,
            timer: 5000
          });
          throw new Error("L'exécuteur n'a pas suffisamment de frais de gas pour exécuter cette transaction.");
  
        }
  
        // Effectue le transfert pour chaque destinataire dans une seule transaction
        const transferBatchTx = await contractStablecoin.transferBatch(dataForm?.addressTo, dataForm?.recipients, dataForm?.amounts);
        await transferBatchTx.wait();

        //Appel de la fonction de la mise à jour de l'historique de transaction
        addHistoricalTransferBatch(transferBatchTx?.hash);

      } catch (error) {
        setIsLoggingIn(false)
          Swal.fire({
            position: 'center',
            icon: 'error',
            html: `<p> Une erreur s'est produite lors de la transaction.</p>`,
            showConfirmButton: false,
            timer: 5000
          });
        console.error("Erreur:", error.message);
      }
  };


    // FONCTION POUR RECUPERER TOUTES LES INFOS DE CONVERSION
    useEffect(() => {
        // Obtenir le token en cours
        const token = localStorage.getItem('tokenEnCours');
        const getInfosDistributer = async () => {
            try {
                const result = await fetch(`${API_URL}/api/conversion/find-all-conversion`, {
                    headers: {
                        'Content-Type': 'application/json',
                    'x-api-key': `${API_KEY_STABLECOIN}`,
                        Authorization: `Bearer ${token}`
                    },
                });
    
                if (!result.ok) {
                    throw new Error('Failed to fetch user data');
                }
    
                const data = await result.json();
                // Choix de la devise (à remplacer par votre logique)
                // const currencyLocal = 'XOF'; // Remplacez cela par la logique de choix de votre devise
    
                // Filtrer les données pour l'actif Ewari en fonction de la devise choisie
                const filteredData = data.filter(item => item.currency === currencyLocal && item.activeSymbol === "EWRITC");
    
                 // Filtrer les données pour l'actif NGN en fonction de la devise choisie
                 const filteredDataNGN = data.filter(item => item.currency === currencyLocal && item.activeSymbol === "CRN");

                // Appliquer la logique de multiplication si la devise est trouvée pour l'actif Ewari
                if (filteredData.length > 0) {
                    const exchangeRate = filteredData[0].exchangeRate;
                 
                    const result = exchangeRate * balanceStablecoinNoFormat;
                    setAmountConvert(formatNumber(result))
                } else {
                    console.error('Aucune correspondance trouvée pour la devise sélectionnée.');
                }

                // Appliquer la logique de multiplication si la devise est trouvée pour l'actif Ewari
                if (filteredDataNGN.length > 0) {
                  const exchangeRate = filteredDataNGN[0].exchangeRate;
               
                  const result = exchangeRate * balanceStablecoinNoFormat;
                  setAmountConvertNGN(formatNumber(result))
                  setExchangeRateNGN(exchangeRate)
              } else {
                  console.error('Aucune correspondance trouvée pour la devise sélectionnée.');
              }
    
                setAllInfosConversion(data);
            } catch (error) {
                // Handle errors appropriately, e.g., set an error state.
                console.error('Error fetching user data:', error);
            }
        };
    
        getInfosDistributer();
    
    }, [currencyLocal]);
    // FIN

    
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
       * Recupérée l'état de l'abonnement de l'utilisation dans le localStorage.
       * @type {string|null}
       */
      const stateOfRequest = localStorage.getItem('stateOfSubscription');
      
      /**
       * Met à jour l'état en fonction de la valeur stockée dans le localStorage.
       * @type {string|null}
       */ 
      setStateOfSubscription(stateOfRequest);
  }, [stateOfSubscription]);

  const warnOnSubscription = async () =>{
    Swal.fire({
        position: 'center',
        icon: 'error',
        html: `Désolé, vous devez vous abonnez afin de pouvoir effectué un transfert.` ,
        showConfirmButton: false,
        timer: 15000
    })
}







  // *****************************************************************************
    // PARTIE PORTEFEUILLE OPCVM
  // ****************************************************************************
  // FONCTION POUR RECUPERER TOUTES LES FONDS DE L'UTILISATEUR CONNECTE
  useEffect(() => {
      // Obtenir le token en cours
      // const token = localStorage.getItem('tokenEnCours');
      const getAllFondsOfUser = async (_userId) => {
          try {
              const result = await fetch(`${URL_API_OPCVM}/api/getfondbyusersignin/${_userId}`, {
                  headers: {
                      'Content-Type': 'application/json',
                    'x-api-key': `${API_KEY_STABLECOIN}`,
                      // Authorization: `Bearer ${token}`
                  },
              });

              if (!result.ok) {
                  throw new Error('Failed to fetch data');
              }

              const data = await result.json();
              
              setAllFondsOfUser(data.data.funds);
          } catch (error) {
              // Handle errors appropriately, e.g., set an error state.
              console.error('Error fetching data:', error);
          }
      };

      if (currentUser?.id) {
        getAllFondsOfUser(currentUser?.id);
      }

  }, [currentUser?.id]);
  // FIN



  // FONCTION POUR RECUPERER TOUTES LES FONDS DE L'UTILISATEUR CONNECTE
  useEffect(() => {
    // Obtenir le token en cours
    // const token = localStorage.getItem('tokenEnCours');
    const getAllWalletOpcvmOfUser = async (_userId) => {
        try {
            const result = await fetch(`${URL_API_OPCVM}/api/getportefeuillebyuser/${_userId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': `${API_KEY_STABLECOIN}`,
                    // Authorization: `Bearer ${token}`
                },
            });

            if (!result.ok) {
                throw new Error('Failed to fetch data');
            }

            const data = await result.json();
            
            setAllWalletOpcvmOfUser(data.data.portefeuille);
        } catch (error) {
            // Handle errors appropriately, e.g., set an error state.
            console.error('Error fetching data:', error);
        }
    };

    if (currentUser?.id) {
      getAllWalletOpcvmOfUser(currentUser?.id);
    }

}, [currentUser?.id]);
// FIN

// ********************FIN OPCVM***************************************


    /**
     * Formate un nombre en tronquant à deux décimales et en ajoutant un séparateur de milliers (espace).
     * @param {number} number - Le nombre à formater.
     * @returns {string} - Le nombre formaté en tant que chaîne de caractères.
     * @throws {Error} - Si la fonction est appelée avec autre chose qu'un nombre.
     */
    function formatNumber(number) {
      if (typeof number !== 'number') {
          throw new Error('La fonction doit être appelée avec un nombre.');
      }

      // Tronquer le nombre à deux décimales
      const truncatedNumber = Math.floor(number * 100) / 100;

      // Ajouter un séparateur de milliers (espace)
      const formattedNumber = truncatedNumber.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

      return formattedNumber;
    }

    return (
        <>
            {userMetadata?(

                <>
                    <div className='' >
                        <div className='  row'>
                            <div className=' col-lg-2 col-md-2' ></div>
                            <div className=' col-lg-6 col-md-6' >
                                <h3 className='text-center'>Mon portefeuille numérique  </h3>
                            </div>
                            <div className=' col-lg-2 col-md-2' ></div>
                            <div className=' col-lg-2 col-md-2 text-right' >
                            <select 
                                className="form-control"
                                required
                                defaultValue={currencyLocal} 
                                onChange={(event)=>setCurrencyLocal(event.target.value)}
                            >
                                <optgroup className='single-cryptocurrency-box'>
                                    <option defaultValue="XOF">XOF</option>
                                    <option  value="XAF">XAF</option>
                                    <option  value="$">Dollars</option>
                                    <option  value="€">Euro</option>
                                </optgroup>
                            </select>
                            </div>
                        </div>

                        {/* Les images de fond */}
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
                        {/* Fin des images de fond */}
                        <div className='row'>
                            <div className='col-lg-1 col-md-1'></div>

                            <div className='col-lg-10 col-md-10'>
                                <div className=' bgColorblue my-3 px-3' onClick={()=>setShowWallet(0)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span className='btn text-white'>Portefeuille cash</span>
                                    <p className='text-right mb-0 text-white'>{currencyLocal? (<>{amountConvert} {currencyLocal}</>) :(<>{balanceStablecoin} XOF</>)}</p>
                                </div>
                                
                                {/* ********************************************************* */}
                                    {/* PORTEFEUILLE CASH*/}
                                {/* *********************************************************** */}
                                {showWallet==0? (
                                    <div className='cryptocurrency-search-box'>
                                        
                                        <Table
                                            aria-label="Example table with static content"
                                            css={{
                                                height: "auto",
                                                minWidth: "100%",
                                            }}
                                        >
                                            <Table.Header>
                                                <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Actifs</p></Table.Column>
                                                <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Montant</p></Table.Column>
                                                <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Valeur en {!currencyLocal ? "XOF" : currencyLocal=="$" ? "Dollars" : currencyLocal=="€" ? "Euro" :(currencyLocal) }</p></Table.Column>
                                                <Table.Column><p className="gr-text-8 pt-3 pb-0 text-center">Actions </p></Table.Column>
                                            </Table.Header>
                                            <Table.Body>
                                                {/* {allKycForParticular?.map((data) => ( */}
                                                    <Table.Row >                       
                                                        <Table.Cell ><p className=" py-0 "><b>{symbolStablecoin}</b><br/><small>{nameStablecoin}</small></p></Table.Cell>
                                                        <Table.Cell ><p className=" py-0 "><b>{balanceStablecoin}</b> <br/><small >{balanceStablecoin} XOF</small></p></Table.Cell>
                                                        <Table.Cell ><p className=" py-0 "><b>{balanceStablecoin}</b> <br/><small> {currencyLocal? (<>{amountConvert} {currencyLocal}</>) :(<>{balanceStablecoin} XOF</>)} </small></p></Table.Cell>
                                                        <Table.Cell className="row ">
                                                            <div className='text-center'>
                                                                <small className=" py-0  mx-2 btn btn-success " onClick={handleShow}>
                                                                    {/* <Link href="/#" > */}
                                                                    <a className=" text-white aNoDecor  px-3">Dépôt</a> 
                                                                    {/* </Link> */}
                                                                </small>
                                                                <small className=" py-0 mx-2 btn btn-danger">
                                                                    <Link href="/#" >
                                                                    <a className=" text-white aNoDecor px-3">Retrait</a> 
                                                                    </Link>
                                                                </small>
                                                                {/* <small className=" py-0 mx-2 px-0 btn btn-primary" onClick={!stateOfSubscription || stateOfSubscription==0 ? handleTransfertShowNoSubscribe : handleTransfertShow}> */}
                                                                
                                                                <small className=" py-0 mx-2 px-0 btn btn-primary" onClick={ handleTransfertShowNoSubscribe}>
                                                                    <a className=" text-white aNoDecor  px-3">Transfert</a> 
                                                                </small>
                                                                <small className=" py-0 mx-2 px-0 btn btn-secondary">
                                                                    <Link href="/#" >
                                                                    <a className=" text-white aNoDecor px-2">Conversion</a> 
                                                                    </Link>
                                                                </small>
                                                            </div>
                                                        </Table.Cell>
                                                    </Table.Row >


                                                    
                                                {/* ))} */}
                                            </Table.Body>
                                            {/* <Table.Pagination
                                                shadow
                                                noMargin
                                                align="center"
                                                rowsPerPage={3}
                                                onPageChange={(page) => console.log({ page })}
                                            /> */}
                                        </Table>
                                        
                                    </div>
                                ) : ('')}
                                {/* *****************FIN PORTEFEUILLE CASH************************ */}








                                {/* ***************************************************************** */}
                                    {/* PORTEFEUILLE INVESTISSEMENT*/}
                                {/* ***************************************************************** */}
                                <div className=' bgColorblue my-3 px-3' onClick={()=>setShowWallet(1)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span className='btn text-white'>Portefeuille d'investissement</span>
                                    <p className='text-right mb-0 text-white'>{currencyLocal? (<>{formatNumber(exchangeRateNGN * 4000)} {currencyLocal}</>) :(<>{formatNumber(4000 * 1.59)} XOF</>)}</p>
                                </div>
                                {showWallet==1? (
                                <>
                                
                                        {/* Portefeuille crowdfunding */}
                                        
                                        {/* L'entête de tab*/}
                                        <div className="bloc-tabs-utilite ">
                                            
                                            <button
                                                className={toggleState === 1 ? "tabs active-tabs gr-text-8 text-color-opacity" : "tabs gr-text-8 text-color-opacity"}
                                                onClick={() => toggleTab(1)}
                                                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                            >
                                                <span className=''>OPCVM</span>
                                                <p className='text-right mb-0 '>{currencyLocal? (<>{formatNumber(exchangeRateNGN * 4000)} {currencyLocal}</>) :(<>{formatNumber(4000 * 1.59)} XOF</>)}</p>
                                                
                                            </button>

                                            <button
                                                className={toggleState === 2 ? "tabs active-tabs  gr-text-8 text-color-opacity" : "tabs  gr-text-8 text-color-opacity"}
                                                onClick={() => toggleTab(2)}
                                                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}

                                            >
                                                <span className=''>Crowfunding</span>
                                                <p className='text-right mb-0 '>1000 0000 $</p>
                                            </button>
                                        </div>
                                        <div className='col-lg-6 col-md-6'></div>
                                        {/* </div> */}
                                        {/* L'entête de tab */}


                                        {/* Le corps de tab */}
                                        <div className="content-tabs">
                                            {/* Portefeuille OPCVM */}
                                            <div
                                                className={toggleState === 1 ? "content  active-content" : "content"}
                                            >
                                                <div className='cryptocurrency-search-box'>
                                                    
                                                    <Table
                                                        aria-label="Example table with static content"
                                                        css={{
                                                            height: "auto",
                                                            minWidth: "100%",
                                                        }}
                                                    >
                                                        <Table.Header>
                                                            <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Nom du fonds</p></Table.Column>
                                                            <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Date <br/>ISIN </p></Table.Column>
                                                            <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Quantité <br/> Valorisation </p></Table.Column>
                                                            <Table.Column><p className="gr-text-8 pt-3 pb-0 ">VL en devise <br/> Type</p></Table.Column>
                                                            <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Valeur en devise<br/>Valeur en {!currencyLocal ? "XOF" : currencyLocal=="$" ? "Dollars" : currencyLocal=="€" ? "Euro" :(currencyLocal) }</p></Table.Column>
                                                            {/* <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Valeur en Dollars</p></Table.Column> */}
                                                            <Table.Column><p className="gr-text-8 pt-3 pb-0 text-center">Actions</p></Table.Column>
                                                        </Table.Header>
                                                        <Table.Body>
                                                            {allFondsOfUser?.map((data, index) => (
                                                                <Table.Row key={index}>                      
                                                                    {/* <Table.Cell ><p className=" py-0 "><small>Echiquier Major SRI G<br/>rowth Europe A - France </small></p></Table.Cell> */}
                                                                    <Table.Cell ><p className=" py-0 "><small>{data?.nom_fond} </small></p></Table.Cell>
                                                                    <Table.Cell ><small className=" py-0 "><b>{data?.datejour}</b> <br/>{data?.code_ISIN}</small></Table.Cell>
                                                                    <Table.Cell ><small className=" py-0 "><b>1 000 000.00 </b> <br/> Hebdomadaire</small></Table.Cell>
                                                                    
                                                                    {/* <Table.Cell ><small className=" py-0 "><b>5 000 000 $</b></small></Table.Cell> */}
                                                                    <Table.Cell ><small className=" py-0 "><b>1 000 000.00 NGN</b> <br/><small>OPCVM</small></small></Table.Cell>
                                                                    <Table.Cell ><small className=" py-0 "><b>1 000 000 000.00 NGN</b> <br/><small>{currencyLocal? (<>{formatNumber(exchangeRateNGN * 1000000000)} {currencyLocal}</>) :(<>{formatNumber(1000000000 * 1.59)} XOF</>)} </small></small></Table.Cell>
                                                                    <Table.Cell className="row">
                                                                        <div className='text-center'>
                                                                            <small className=" py-0  mx-2 btn btn-success">
                                                                                <Link href="/#" >
                                                                                <a className=" text-white aNoDecor  px-0">Achat</a> 
                                                                                </Link>
                                                                            </small>
                                                                            <small className=" py-0 mx-2 btn btn-danger">
                                                                                <Link href="/#" >
                                                                                    <a className=" text-white aNoDecor px-0">Vente</a> 
                                                                                </Link>
                                                                            </small>
                                                                            
                                                                        </div>
                                                                    </Table.Cell>
                                                                </Table.Row >

                                                                
                                                            ))} 
                                                        </Table.Body>
                                                        {/* <Table.Pagination
                                                            shadow
                                                            noMargin
                                                            align="center"
                                                            rowsPerPage={3}
                                                            onPageChange={(page) => console.log({ page })}
                                                        /> */}
                                                    </Table>
                                                </div>
                                            </div>
                                            {/* Fin portefeuille OPCVM */}

                                            
                                            <div
                                                className={toggleState === 2 ? "content  active-content" : "content"}
                                            >
                                                <div className='cryptocurrency-search-box'>
                                                    
                                                    <Table
                                                        aria-label="Example table with static content"
                                                        css={{
                                                            height: "auto",
                                                            minWidth: "100%",
                                                        }}
                                                    >
                                                        <Table.Header>
                                                            <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Opcvm</p></Table.Column>
                                                            <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Actifs</p></Table.Column>
                                                            <Table.Column><p className="gr-text-8 pt-3 pb-0 ">VL</p></Table.Column>
                                                            <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Valeur $</p></Table.Column>
                                                            <Table.Column><p className="gr-text-8 pt-3 pb-0 text-center">Actions</p></Table.Column>
                                                        </Table.Header>
                                                        <Table.Body>
                                                            {/* {allKycForParticular?.map((data) => ( */}
                                                                <Table.Row >                       
                                                                    <Table.Cell ><p className=" py-0 "><small>Stablecoin</small></p></Table.Cell>
                                                                    <Table.Cell ><small className=" py-0 "><b>5 000 000 $</b></small></Table.Cell>
                                                                    <Table.Cell ><p className=" py-0 "><b>1 000 000 000 KOREE</b> <br/><small >1 000 000 000 CFA</small></p></Table.Cell>
                                                                    <Table.Cell ><p className=" py-0 "><b>1 000 000 000 KOREE</b> <br/><small>1 000 000 $ </small></p></Table.Cell>
                                                                    <Table.Cell className="row">
                                                                        <div className='text-center'>
                                                                            <small className=" py-0  mx-2 btn btn-success">
                                                                                <Link href="/#" >
                                                                                <a className=" text-white aNoDecor  px-4">Achat</a> 
                                                                                </Link>
                                                                            </small>
                                                                            <small className=" py-0 mx-2 btn btn-danger">
                                                                                <Link href="/#" >
                                                                                    <a className=" text-white aNoDecor px-4">Vente</a> 
                                                                                </Link>
                                                                            </small>
                                                                            
                                                                        </div>
                                                                    </Table.Cell>
                                                                </Table.Row >

                                                                
                                                            {/* ))} */}
                                                        </Table.Body>
                                                        {/* <Table.Pagination
                                                            shadow
                                                            noMargin
                                                            align="center"
                                                            rowsPerPage={3}
                                                            onPageChange={(page) => console.log({ page })}
                                                        /> */}
                                                    </Table>
                                                </div>
                                            </div>
                                            {/* Fin portefeuille crowdfunding*/}
                                        </div>
                                        {/* Fin le corps de tab */}
                                    </>
                                ):("")}
                                {/* ************** Fin portefeuille investissement*********** */}
                            </div>
                            <div className='col-lg-1 col-md-1'></div>
                        </div>
                    </div>



                    
                    { /* ********************************************************************************** */}
                        {/* MODAL DE L'ADRESSE PUBLIC'*/}
                    {/* ********************************************************************************** */}
                    <Modal show={show} className="mt-15" onHide={handleClose}>
                        <Modal.Header closeButton className="bgColorGreen">
                        <Modal.Title className="text-white" >Mon adresse public blockchain</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                        <div className="input-group flex-nowrap">
                        {/* <p className="gr-text-8 pt-3 pb-0 text-center text-green">{magicCurrentAddress} </p> */}
                            
                            <input
                            className="form-control gr-text-8 border  mt-3 bg-white"
                            type="text" 
                            disabled={true}
                            value={magicCurrentAddress}
                            />
                            <span className="input-group-text gr-text-11  mt-3" id="addon-wrapping">
                                <button><Icon onClick={copyToClipboard} icon="bx:copy"  width="30" /></button>
                            </span>
                        </div>
                        
                        <p className="gr-text-8 pt-3 pb-0 text-center colorGreen">{successCopy} </p>
                        <p className="gr-text-8 pt-3 pb-0 text-center">{contentDepot} </p>
                        </Modal.Body>
                    </Modal>
                    {/* *****************************************FIN****************************************** */}
                    


            {/* ********************************************************************************** */}
                {/* MODAL DE TRANSFERT DE JETON VERS AUTRE COMPTE*/}
            {/* ********************************************************************************** */}
            <Modal show={showTransfert} className="mt-15" onHide={handleTransfertClose} style={{maxWidth: '1800px', width: '100%'}}>
                <Modal.Header closeButton id="bgcolor">
                <Modal.Title className="" >Transfert des jetons </Modal.Title>
                </Modal.Header>
                {/* <form > */}
                <Modal.Body>
                
                  <div className="bloc-tabs-utilite">
                    <button
                      className={toggleState === 1 ? "tabs active-tabs gr-text-8 text-color-opacity" : "tabs gr-text-8 text-color-opacity"}
                      onClick={() => toggleTab(1)}
                    >
                      Adresse Blockchain
                    </button>

                    <button
                    className={toggleState === 2 ? "tabs active-tabs  gr-text-8 text-color-opacity" : "tabs  gr-text-8 text-color-opacity"}
                    onClick={() => toggleTab(2)}
                    >
                      Adresse email
                    </button>

                    <button
                    className={toggleState === 3 ? "tabs active-tabs  gr-text-8 text-color-opacity" : "tabs  gr-text-8 text-color-opacity"}
                    onClick={() => toggleTab(3)}
                    >
                      Identifiant
                    </button>
                  </div>

                  <div className="content-tabs">
                    <div
                    className={toggleState === 1 ? "content  active-content" : "content"}
                    >
                     {/* Formulaire de la partie avec adresse blockchain  */}
                    <form onSubmit={handleSubmit}>
                      {/* <div className="form-group mb-6">
                        <label
                          htmlFor="addressTo"
                          className="gr-text-8 fw-bold text-blackish-blue "
                        >
                          Adresse blockchain du bénéficiaire <sup className="text-red">*</sup>
                        </label>
                        <input
                          className="form-control gr-text-11 border mt-3 bg-white"
                          type="text"
                          id="addressTo"
                          placeholder="Adresse blockchain du bénéficiaire"
                          required
                          defaultValue={addressTo} 
                          onChange={(event)=>setAddressTo(event.target.value)}
                        />
                      </div> */}

                        <div className="form-group my-6 ">
                          <label
                            htmlFor="montant"
                            className="gr-text-8 fw-bold text-blackish-blue"
                          >
                            Adresse bockchain du bénéficiaire <sup className="text-red">*</sup>

                          </label>
                          <div className="input-group flex-nowrap">
                          <input
                              className="form-control gr-text-11 border mt-3 bg-white"
                              type="text"
                              id="addressTo"
                              placeholder="Adresse blockchain du bénéficiaire"
                              required
                              defaultValue={addressTo} 
                              onChange={(event)=>setAddressTo(event.target.value)}
                              
                          />
                          <span className="input-group-text gr-text-11  mt-3" id="addon-wrapping">
                            <button onClick={searchUserWithBlockchain} disabled={isLoggingIn}><Icon  icon="bx:search-alt"  />
                            </button>
                          </span>

                          </div>
                        </div>

                        {/* affichage infos utilisateur beneeficiaire */}
                        {infosOtherUser?.entreprise ? (
                          <p className="gr-text-8 " id="addon-wrapping">
                            Nom de l'entreprise : {infosOtherUser?.entreprise}
                          </p>
                        ) : (infosOtherUser?.firstName && infosOtherUser?.lastName ?
                         (<div>
                            <p className="gr-text-8 " id="addon-wrapping">
                              Nom : {infosOtherUser?.lastName}
                            </p>
                            <p className="gr-text-8 " id="addon-wrapping">
                              Prenom : {infosOtherUser?.firstName}
                            </p>
                         </div>) : <p className="gr-text-8 colorRed" id="addon-wrapping">{infosOtherUser?.message}</p>)}
                          {/* Fin affichage */}

                      {infosOtherUser?.entreprise || infosOtherUser?.firstName || infosOtherUser?.lastName?(
                        <>
                          <div className="form-group my-6 ">
                            <label
                              htmlFor="montant"
                              className="gr-text-8 fw-bold text-blackish-blue"
                            >
                              Montant à envoyer <sup className="text-red">*</sup>
                            </label>
                            <div className="input-group flex-nowrap">
                            <input
                              className="form-control gr-text-11 border mt-3 bg-white"
                              type="number"
                              id="montant"
                              placeholder="Montant envoyé"
                              required
                              defaultValue={montantEnvoyer} 
                              onChange={(event)=>setMontantEnvoyer(event.target.value)}
                            />
                            <span className="input-group-text gr-text-11  mt-3" id="addon-wrapping">{symbolStablecoin}</span>

                            </div>
                          </div>

                          {/* <div className="form-group my-6 ">
                            <label
                              htmlFor="montant"
                              className="gr-text-8 fw-bold text-blackish-blue"
                            >
                              Montant à recevoir avec les frais <sup className="text-red">*</sup>
                            </label>
                            <div className="input-group flex-nowrap">
                            <input
                              className="form-control gr-text-11 border mt-3 bg-white"
                              type="number"
                              id="montant"
                              placeholder="Montant reçu"
                              required
                              disabled={true}
                              value={montantRecevoir} 
                              // defaultValue={montantRecu} 
                              // onChange={(event)=>setMontantRecu(event.target.value)}
                            />
                            <span className="input-group-text gr-text-11  mt-3" id="addon-wrapping">{symbolStablecoin}</span>

                            </div>
                          </div> */}
                          <Row className="my-3 justify-content-between align-items-center">
                            <Col
                                xs="6"
                                md="6"
                                lg="6"
                                xl="6"
                              className="order-lg-1 text-center"
                            >
                              <Button className="text-white " variant="danger" onClick={handleTransfertClose} >
                                Fermer
                              </Button>
                            </Col>

                            <Col
                                xs="6"
                                md="6"
                                lg="6"
                                xl="6"
                              className="order-lg-1 text-center"
                              
                            >
                              <Button variant="success" onClick={transferStablecoin} disabled={isLoggingIn} className="text-white" >
                                Envoyer
                                {isLoggingIn === true ? (<i className="fas fa-spinner fa-spin fa-lg mx-3"></i>) : ("")}

                              </Button>
                            </Col>
                          </Row>
                         
                        </>
                      ):("")}
                    </form>
                    </div>

                    <div
                    className={toggleState === 2 ? "content  active-content" : "content"}
                    >
                     {/* Formulaire de la partie avec adresse Email  */}
                    <form onSubmit={handleSubmit}>
                      
                        <div className="form-group my-6 ">
                          <label
                            htmlFor="montant"
                            className="gr-text-8 fw-bold text-blackish-blue"
                          >
                            Adresse email du bénéficiaire <sup className="text-red">*</sup>

                          </label>
                          <div className="input-group flex-nowrap">
                          <input
                              className="form-control gr-text-11 border mt-3 bg-white"
                              type="email"
                              id="email"
                              placeholder="Adresse email du bénéficiaire"
                              required
                              defaultValue={emailOtherUser} 
                              onChange={(event)=>setEmailOtherUser(event.target.value)}
                              
                          />
                          <span className="input-group-text gr-text-11  mt-3" id="addon-wrapping">
                            <button onClick={searchUserWithEmail} disabled={isLoggingIn}><Icon  icon="bx:search-alt"  />
                            </button>
                          </span>

                          </div>
                        </div>
                        {/* affichage des infos de l'utilisateur */}
                        {infosOtherUser?.entreprise ? (
                          <p className="gr-text-8 mb-3" id="addon-wrapping">
                            Nom de l'entreprise : {infosOtherUser?.entreprise}
                          </p>
                        ) : (infosOtherUser?.firstName && infosOtherUser?.lastName ?
                         (<div className='mb-3'>
                            <p className="gr-text-8 " id="addon-wrapping">
                              Nom : {infosOtherUser?.lastName}
                            </p>
                            <p className="gr-text-8 " id="addon-wrapping">
                              Prenom : {infosOtherUser?.firstName}
                            </p>
                         </div>) : <p className="gr-text-8 mb-3 colorRed" id="addon-wrapping">{infosOtherUser?.message}</p>)}
                        {/* Fin affichage */}

                        {infosOtherUser?.entreprise || infosOtherUser?.firstName || infosOtherUser?.lastName?(
                          <>
                            <div className="form-group my-6 ">
                              <label
                                htmlFor="montant"
                                className="gr-text-8 fw-bold text-blackish-blue"
                              >
                                Montant à envoyer <sup className="text-red">*</sup>
                              </label>
                              <div className="input-group flex-nowrap">
                              <input
                                className="form-control gr-text-11 border mt-3 bg-white"
                                type="number"
                                id="montant"
                                placeholder="Montant envoyé"
                                required
                                defaultValue={montantEnvoyer} 
                                onChange={(event)=>setMontantEnvoyer(event.target.value)}
                              />
                              <span className="input-group-text gr-text-11  mt-3" id="addon-wrapping">{symbolStablecoin}</span>

                              </div>
                            </div>

                            {/* <div className="form-group my-6 ">
                              <label
                                htmlFor="montant"
                                className="gr-text-8 fw-bold text-blackish-blue"
                              >
                                Montant à recevoir avec les frais
                              </label>
                              <div className="input-group flex-nowrap">
                              <input
                                className="form-control gr-text-11 border mt-3 bg-white"
                                type="number"
                                id="montant"
                                placeholder="Montant reçu"
                                required
                                disabled={true}
                                value={montantRecevoir} 

                                // defaultValue={montantRecu} 
                                // onChange={(event)=>setMontantRecu(event.target.value)}
                              />
                                <span className="input-group-text gr-text-11  mt-3" id="addon-wrapping">{symbolStablecoin}</span>

                              </div>
                            </div> */}
                            <Row className="my-3 justify-content-between align-items-center">
                              <Col
                                  xs="6"
                                  md="6"
                                  lg="6"
                                  xl="6"
                                className="order-lg-1 text-center"
                                
                              >
                                <Button className="text-white " variant="danger"  onClick={handleTransfertClose} >
                                  Fermer
                                </Button>
                              </Col>

                              <Col
                                  xs="6"
                                  md="6"
                                  lg="6"
                                  xl="6"
                                className="order-lg-1 text-center"
                                
                              >
                              <Button variant="success" onClick={transferStablecoin} disabled={isLoggingIn} className="text-white" >
                                  Envoyer
                                {isLoggingIn === true ? (<i className="fas fa-spinner fa-spin fa-lg mx-3"></i>) : ("")}

                              </Button>
                              </Col>
                            </Row>
                          </>
                        ):("")}

                    </form>
                    </div>

                    <div
                    className={toggleState === 3 ? "content  active-content" : "content"}
                    >
                     {/* Formulaire de la partie avec identifiant */}
                    <form onSubmit={handleSubmit}>

                      <div className="form-group my-6 ">
                          <label
                            htmlFor="montant"
                            className="gr-text-8 fw-bold text-blackish-blue"
                          >
                            Identifiant du bénéficiaire <sup className="text-red">*</sup>

                          </label>
                          <div className="input-group flex-nowrap">
                          <input
                              className="form-control gr-text-11 border mt-3 bg-white"
                              type="text"
                              id="addressTo"
                              placeholder="Identifiant du bénéficiaire"
                              required
                              defaultValue={codeOtherUser} 
                              onChange={(event)=>setCodeOtherUser(event.target.value)}
                          />
                          <span className="input-group-text gr-text-11  mt-3" id="addon-wrapping">
                            <button onClick={searchUserWithIdentifiant} disabled={isLoggingIn}><Icon  icon="bx:search-alt"  />
                            </button>
                          </span>

                          </div>
                        </div>

                        {/* affichage des infos de l'utilisateur */}
                        {infosOtherUser?.entreprise ? (
                          <p className="gr-text-8 mb-3" id="addon-wrapping">
                            Nom de l'entreprise : {infosOtherUser?.entreprise}
                          </p>
                        ) : (infosOtherUser?.firstName && infosOtherUser?.lastName ?
                         (<div className='mb-3'>
                            <p className="gr-text-8 " id="addon-wrapping">
                              Nom : {infosOtherUser?.lastName}
                            </p>
                            <p className="gr-text-8 " id="addon-wrapping">
                              Prenom : {infosOtherUser?.firstName}
                            </p>
                         </div>) : <p className="gr-text-8 mb-3 colorRed" id="addon-wrapping">{infosOtherUser?.message}</p>)}
                        {/* Fin affichage */}
                        {infosOtherUser?.entreprise || infosOtherUser?.firstName || infosOtherUser?.lastName ?(
                          <>
                            <div className="form-group my-6 ">
                              <label
                                htmlFor="montant"
                                className="gr-text-8 fw-bold text-blackish-blue"
                              >
                                Montant à envoyer <sup className="text-red">*</sup>
                              </label>
                              <div className="input-group flex-nowrap">
                              <input
                                className="form-control gr-text-11 border mt-3 bg-white"
                                type="number"
                                id="montant"
                                placeholder="Montant envoyé"
                                required
                                defaultValue={montantEnvoyer} 
                                onChange={(event)=>setMontantEnvoyer(event.target.value)}
                              />
                              <span className="input-group-text gr-text-11  mt-3" id="addon-wrapping">{symbolStablecoin}</span>

                              </div>
                            </div>
                        
                            {/* <div className="form-group my-6 ">
                              <label
                                htmlFor="montant"
                                className="gr-text-8 fw-bold text-blackish-blue"
                              >
                                Montant à recevoir avec les frais <sup className="text-red">*</sup>
                              </label>
                              <div className="input-group flex-nowrap">
                              <input
                                className="form-control gr-text-11 border mt-3 bg-white"
                                type="number"
                                id="montant"
                                placeholder="Montant reçu"
                                required
                                disabled={true}
                                value={montantRecevoir} 
                                defaultValue={montantRecu} 
                                onChange={(event)=>setMontantRecu(event.target.value)}
                              />
                              <span className="input-group-text gr-text-11  mt-3" id="addon-wrapping">{symbolStablecoin}</span>

                              </div>
                            </div> */}
                            <Row className="my-3 justify-content-between align-items-center">
                              <Col
                                  xs="6"
                                  md="6"
                                  lg="6"
                                  xl="6"
                                className="order-lg-1 text-center"
                              >
                                <Button className="text-white " variant="danger" onClick={handleTransfertClose}>
                              Fermer
                            </Button>
                              </Col>

                              <Col
                                  xs="6"
                                  md="6"
                                  lg="6"
                                  xl="6"
                                className="order-lg-1 text-center"
                                
                              >
                                <Button variant="success" onClick={transferStablecoin} disabled={isLoggingIn}  className="text-white" >
                                  Envoyer
                                {isLoggingIn === true ? (<i className="fas fa-spinner fa-spin fa-lg mx-3"></i>) : ("")}

                                </Button>
                              </Col>
                            </Row>
                          </>
                        ):("")}

                    </form>
                    </div>
                  </div>

              






                    
                    
                </Modal.Body>
                {/* <Modal.Footer> */}
                {/* <Button className="text-white" variant="danger" onClick={handleTransfertClose}>
                    Fermer
                </Button>
                <Button variant="success" className="text-white" >
                    Envoyer
                </Button>
                </Modal.Footer> */}
                {/* </form> */}
                
            </Modal>
            {/* *****************************************FIN****************************************** */}

            {/* ********************************************************************************** */}
                {/* MODAL DE TRANSFERT DE JETON VERS AUTRE COMPTE SANS ABONNEMENT*/}
            {/* ********************************************************************************** */}
            <Modal show={showTransfertNoSubscribe} className="mt-15" onHide={handleTransfertCloseNoSubscribe} style={{maxWidth: '1800px', width: '100%'}}>
                <Modal.Header closeButton id="bgcolorblue">
                <Modal.Title className="" >Transfert des jetons </Modal.Title>
                </Modal.Header>
                {/* <form > */}
                <Modal.Body>
                
                  <div className="bloc-tabs-utilite">
                    <button
                      className={toggleState === 1 ? "tabs active-tabs gr-text-8 text-color-opacity" : "tabs gr-text-8 text-color-opacity"}
                      onClick={() => toggleTab(1)}
                    >
                      Adresse Blockchain
                    </button>

                    <button
                    className={toggleState === 2 ? "tabs active-tabs  gr-text-8 text-color-opacity" : "tabs  gr-text-8 text-color-opacity"}
                    onClick={() => toggleTab(2)}
                    >
                      Adresse email
                    </button>

                    <button
                    className={toggleState === 3 ? "tabs active-tabs  gr-text-8 text-color-opacity" : "tabs  gr-text-8 text-color-opacity"}
                    onClick={() => toggleTab(3)}
                    >
                      Identifiant
                    </button>
                  </div>

                  <div className="content-tabs">
                    <div
                    className={toggleState === 1 ? "content  active-content" : "content"}
                    >
                     {/* Formulaire de la partie avec adresse blockchain  */}
                    <form onSubmit={handleSubmit}>
                      {/* <div className="form-group mb-6">
                        <label
                          htmlFor="addressTo"
                          className="gr-text-8 fw-bold text-blackish-blue "
                        >
                          Adresse blockchain du bénéficiaire <sup className="text-red">*</sup>
                        </label>
                        <input
                          className="form-control gr-text-11 border mt-3 bg-white"
                          type="text"
                          id="addressTo"
                          placeholder="Adresse blockchain du bénéficiaire"
                          required
                          defaultValue={addressTo} 
                          onChange={(event)=>setAddressTo(event.target.value)}
                        />
                      </div> */}

                        <div className="form-group my-6 ">
                          <label
                            htmlFor="montant"
                            className="gr-text-8 fw-bold text-blackish-blue"
                          >
                            Adresse bockchain du bénéficiaire <sup className="text-red">*</sup>

                          </label>
                          <div className="input-group flex-nowrap">
                          <input
                              className="form-control gr-text-11 border mt-3 bg-white"
                              type="text"
                              id="addressTo"
                              placeholder="Adresse blockchain du bénéficiaire"
                              required
                              defaultValue={addressTo} 
                              onChange={(event)=>setAddressTo(event.target.value)}
                              
                          />
                          <span className="input-group-text gr-text-11  mt-3" id="addon-wrapping">
                            <button onClick={searchUserWithBlockchain} disabled={isLoggingIn}><Icon  icon="bx:search-alt"  />
                            </button>
                          </span>

                          </div>
                        </div>

                        {/* affichage infos utilisateur beneeficiaire */}
                        {infosOtherUser?.entreprise ? (
                          <p className="gr-text-8 " id="addon-wrapping">
                            Nom de l'entreprise : {infosOtherUser?.entreprise}
                          </p>
                        ) : (infosOtherUser?.firstName && infosOtherUser?.lastName ?
                         (<div>
                            <p className="gr-text-8 " id="addon-wrapping">
                              Nom : {infosOtherUser?.lastName}
                            </p>
                            <p className="gr-text-8 " id="addon-wrapping">
                              Prenom : {infosOtherUser?.firstName}
                            </p>
                         </div>) : <p className="gr-text-8 colorRed" id="addon-wrapping">{infosOtherUser?.message}</p>)}
                          {/* Fin affichage */}

                      {infosOtherUser?.entreprise || infosOtherUser?.firstName || infosOtherUser?.lastName?(
                        <>
                          <div className="form-group my-6 ">
                            <label
                              htmlFor="montant"
                              className="gr-text-8 fw-bold text-blackish-blue"
                            >
                              Montant à envoyer <sup className="text-red">*</sup>
                            </label>
                            <div className="input-group flex-nowrap">
                            <input
                              className="form-control gr-text-11 border mt-3 bg-white"
                              type="number"
                              id="montant"
                              placeholder="Montant envoyé"
                              required
                              defaultValue={montantEnvoyer} 
                              onChange={(event)=>setMontantEnvoyer(event.target.value)}
                            />
                            <span className="input-group-text gr-text-11  mt-3" id="addon-wrapping">{symbolStablecoin}</span>

                            </div>
                          </div>

                          <div className='row mt-3'>
                            <div className="form-group my-6 col-lg-6 col-md-6">
                              <label
                                htmlFor="montant"
                                className="gr-text-8 fw-bold text-blackish-blue"
                              >
                                Montant à recevoir <sup className="text-red">*</sup>
                              </label>
                              <div className="input-group flex-nowrap">
                              <input
                                className="form-control gr-text-11 border mt-3 bg-white"
                                type="number"
                                id="montant"
                                placeholder="Montant reçu"
                                required
                                disabled={true}
                                value={montantRecevoir} 
                                // defaultValue={montantRecu} 
                                // onChange={(event)=>setMontantRecu(event.target.value)}
                              />
                              <span className="input-group-text gr-text-11  mt-3" id="addon-wrapping">{symbolStablecoin}</span>

                              </div>
                            </div>

                            <div className="form-group my-6 col-lg-6 col-md-6">
                              <label
                                htmlFor="montant"
                                className="gr-text-8 fw-bold text-blackish-blue"
                              >
                                Frais <sup className="text-red">*</sup>
                              </label>
                              <div className="input-group flex-nowrap">
                              <input
                                className="form-control gr-text-11 border mt-3 bg-white"
                                type="number"
                                id="montant"
                                placeholder="Montant reçu"
                                required
                                disabled={true}
                                value={feeTransfer} 
                              
                              />
                              <span className="input-group-text gr-text-11  mt-3" id="addon-wrapping">{symbolStablecoin}</span>

                              </div>
                            </div>
                          </div>
                          <Row className="my-3 justify-content-between align-items-center">
                            <Col
                                xs="6"
                                md="6"
                                lg="6"
                                xl="6"
                              className="order-lg-1 text-center"
                            >
                              <Button className="text-white " variant="danger" onClick={handleTransfertClose} >
                                Fermer
                              </Button>
                            </Col>

                            <Col
                                xs="6"
                                md="6"
                                lg="6"
                                xl="6"
                              className="order-lg-1 text-center"
                              
                            >
                              <Button variant="success" onClick={transferBatch} disabled={isLoggingIn} className="text-white" >
                                Envoyer
                                {isLoggingIn === true ? (<i className="fas fa-spinner fa-spin fa-lg mx-3"></i>) : ("")}

                              </Button>
                            </Col>
                          </Row>
                         
                        </>
                      ):("")}
                    </form>
                    </div>

                    <div
                    className={toggleState === 2 ? "content  active-content" : "content"}
                    >
                     {/* Formulaire de la partie avec adresse Email  */}
                    <form onSubmit={handleSubmit}>
                      
                        <div className="form-group my-6 ">
                          <label
                            htmlFor="montant"
                            className="gr-text-8 fw-bold text-blackish-blue"
                          >
                            Adresse email du bénéficiaire <sup className="text-red">*</sup>

                          </label>
                          <div className="input-group flex-nowrap">
                          <input
                              className="form-control gr-text-11 border mt-3 bg-white"
                              type="email"
                              id="email"
                              placeholder="Adresse email du bénéficiaire"
                              required
                              defaultValue={emailOtherUser} 
                              onChange={(event)=>setEmailOtherUser(event.target.value)}
                              
                          />
                          <span className="input-group-text gr-text-11  mt-3" id="addon-wrapping">
                            <button onClick={searchUserWithEmail} disabled={isLoggingIn}><Icon  icon="bx:search-alt"  />
                            </button>
                          </span>

                          </div>
                        </div>
                        {/* affichage des infos de l'utilisateur */}
                        {infosOtherUser?.entreprise ? (
                          <p className="gr-text-8 mb-3" id="addon-wrapping">
                            Nom de l'entreprise : {infosOtherUser?.entreprise}
                          </p>
                        ) : (infosOtherUser?.firstName && infosOtherUser?.lastName ?
                         (<div className='mb-3'>
                            <p className="gr-text-8 " id="addon-wrapping">
                              Nom : {infosOtherUser?.lastName}
                            </p>
                            <p className="gr-text-8 " id="addon-wrapping">
                              Prenom : {infosOtherUser?.firstName}
                            </p>
                         </div>) : <p className="gr-text-8 mb-3 colorRed" id="addon-wrapping">{infosOtherUser?.message}</p>)}
                        {/* Fin affichage */}

                        {infosOtherUser?.entreprise || infosOtherUser?.firstName || infosOtherUser?.lastName?(
                          <>
                            <div className="form-group my-6 ">
                              <label
                                htmlFor="montant"
                                className="gr-text-8 fw-bold text-blackish-blue"
                              >
                                Montant à envoyer <sup className="text-red">*</sup>
                              </label>
                              <div className="input-group flex-nowrap">
                              <input
                                className="form-control gr-text-11 border mt-3 bg-white"
                                type="number"
                                id="montant"
                                placeholder="Montant envoyé"
                                required
                                defaultValue={montantEnvoyer} 
                                onChange={(event)=>setMontantEnvoyer(event.target.value)}
                              />
                              <span className="input-group-text gr-text-11  mt-3" id="addon-wrapping">{symbolStablecoin}</span>

                              </div>
                            </div>

                            <div className='row mt-3'>
                            <div className="form-group my-6 col-lg-6 col-md-6">
                              <label
                                htmlFor="montant"
                                className="gr-text-8 fw-bold text-blackish-blue"
                              >
                                Montant à recevoir <sup className="text-red">*</sup>
                              </label>
                              <div className="input-group flex-nowrap">
                              <input
                                className="form-control gr-text-11 border mt-3 bg-white"
                                type="number"
                                id="montant"
                                placeholder="Montant reçu"
                                required
                                disabled={true}
                                value={montantRecevoir} 
                                // defaultValue={montantRecu} 
                                // onChange={(event)=>setMontantRecu(event.target.value)}
                              />
                              <span className="input-group-text gr-text-11  mt-3" id="addon-wrapping">{symbolStablecoin}</span>

                              </div>
                            </div>

                            <div className="form-group my-6 col-lg-6 col-md-6">
                              <label
                                htmlFor="montant"
                                className="gr-text-8 fw-bold text-blackish-blue"
                              >
                                Frais <sup className="text-red">*</sup>
                              </label>
                              <div className="input-group flex-nowrap">
                              <input
                                className="form-control gr-text-11 border mt-3 bg-white"
                                type="number"
                                id="montant"
                                placeholder="Montant reçu"
                                required
                                disabled={true}
                                value={feeTransfer} 
                              
                              />
                              <span className="input-group-text gr-text-11  mt-3" id="addon-wrapping">{symbolStablecoin}</span>

                              </div>
                            </div>
                          </div>
                          <Row className="my-3 justify-content-between align-items-center">
                            <Col
                                xs="6"
                                md="6"
                                lg="6"
                                xl="6"
                              className="order-lg-1 text-center"
                            >
                              <Button className="text-white " variant="danger" onClick={handleTransfertClose} >
                                Fermer
                              </Button>
                            </Col>

                            <Col
                                xs="6"
                                md="6"
                                lg="6"
                                xl="6"
                              className="order-lg-1 text-center"
                              
                            >
                              <Button variant="success" onClick={transferBatch} disabled={isLoggingIn} className="text-white" >
                                Envoyer
                                {isLoggingIn === true ? (<i className="fas fa-spinner fa-spin fa-lg mx-3"></i>) : ("")}

                              </Button>
                            </Col>
                          </Row>
                          </>
                        ):("")}

                    </form>
                    </div>

                    <div
                    className={toggleState === 3 ? "content  active-content" : "content"}
                    >
                     {/* Formulaire de la partie avec identifiant */}
                    <form onSubmit={handleSubmit}>

                      <div className="form-group my-6 ">
                          <label
                            htmlFor="montant"
                            className="gr-text-8 fw-bold text-blackish-blue"
                          >
                            Identifiant du bénéficiaire <sup className="text-red">*</sup>

                          </label>
                          <div className="input-group flex-nowrap">
                          <input
                              className="form-control gr-text-11 border mt-3 bg-white"
                              type="text"
                              id="addressTo"
                              placeholder="Identifiant du bénéficiaire"
                              required
                              defaultValue={codeOtherUser} 
                              onChange={(event)=>setCodeOtherUser(event.target.value)}
                          />
                          <span className="input-group-text gr-text-11  mt-3" id="addon-wrapping">
                            <button onClick={searchUserWithIdentifiant} disabled={isLoggingIn}><Icon  icon="bx:search-alt"  />
                            </button>
                          </span>

                          </div>
                        </div>

                        {/* affichage des infos de l'utilisateur */}
                        {infosOtherUser?.entreprise ? (
                          <p className="gr-text-8 mb-3" id="addon-wrapping">
                            Nom de l'entreprise : {infosOtherUser?.entreprise}
                          </p>
                        ) : (infosOtherUser?.firstName && infosOtherUser?.lastName ?
                         (<div className='mb-3'>
                            <p className="gr-text-8 " id="addon-wrapping">
                              Nom : {infosOtherUser?.lastName}
                            </p>
                            <p className="gr-text-8 " id="addon-wrapping">
                              Prenom : {infosOtherUser?.firstName}
                            </p>
                         </div>) : <p className="gr-text-8 mb-3 colorRed" id="addon-wrapping">{infosOtherUser?.message}</p>)}
                        {/* Fin affichage */}
                        {infosOtherUser?.entreprise || infosOtherUser?.firstName || infosOtherUser?.lastName ?(
                          <>
                            <div className="form-group my-6 ">
                              <label
                                htmlFor="montant"
                                className="gr-text-8 fw-bold text-blackish-blue"
                              >
                                Montant à envoyer <sup className="text-red">*</sup>
                              </label>
                              <div className="input-group flex-nowrap">
                              <input
                                className="form-control gr-text-11 border mt-3 bg-white"
                                type="number"
                                id="montant"
                                placeholder="Montant envoyé"
                                required
                                defaultValue={montantEnvoyer} 
                                onChange={(event)=>setMontantEnvoyer(event.target.value)}
                              />
                              <span className="input-group-text gr-text-11  mt-3" id="addon-wrapping">{symbolStablecoin}</span>

                              </div>
                            </div>
                        
                            <div className='row mt-3'>
                            <div className="form-group my-6 col-lg-6 col-md-6">
                              <label
                                htmlFor="montant"
                                className="gr-text-8 fw-bold text-blackish-blue"
                              >
                                Montant à recevoir <sup className="text-red">*</sup>
                              </label>
                              <div className="input-group flex-nowrap">
                              <input
                                className="form-control gr-text-11 border mt-3 bg-white"
                                type="number"
                                id="montant"
                                placeholder="Montant reçu"
                                required
                                disabled={true}
                                value={montantRecevoir} 
                                // defaultValue={montantRecu} 
                                // onChange={(event)=>setMontantRecu(event.target.value)}
                              />
                              <span className="input-group-text gr-text-11  mt-3" id="addon-wrapping">{symbolStablecoin}</span>

                              </div>
                            </div>

                            <div className="form-group my-6 col-lg-6 col-md-6">
                              <label
                                htmlFor="montant"
                                className="gr-text-8 fw-bold text-blackish-blue"
                              >
                                Frais <sup className="text-red">*</sup>
                              </label>
                              <div className="input-group flex-nowrap">
                              <input
                                className="form-control gr-text-11 border mt-3 bg-white"
                                type="number"
                                id="montant"
                                placeholder="Montant reçu"
                                required
                                disabled={true}
                                value={feeTransfer} 
                              
                              />
                              <span className="input-group-text gr-text-11  mt-3" id="addon-wrapping">{symbolStablecoin}</span>

                              </div>
                            </div>
                          </div>
                          <Row className="my-3 justify-content-between align-items-center">
                            <Col
                                xs="6"
                                md="6"
                                lg="6"
                                xl="6"
                              className="order-lg-1 text-center"
                            >
                              <Button className="text-white " variant="danger" onClick={handleTransfertClose} >
                                Fermer
                              </Button>
                            </Col>

                            <Col
                                xs="6"
                                md="6"
                                lg="6"
                                xl="6"
                              className="order-lg-1 text-center"
                              
                            >
                              <Button variant="success" onClick={transferBatch} disabled={isLoggingIn} className="text-white" >
                                Envoyer
                                {isLoggingIn === true ? (<i className="fas fa-spinner fa-spin fa-lg mx-3"></i>) : ("")}

                              </Button>
                            </Col>
                          </Row>
                          </>
                        ):("")}

                    </form>
                    </div>
                  </div>

              






                    
                    
                </Modal.Body>
                {/* <Modal.Footer> */}
                {/* <Button className="text-white" variant="danger" onClick={handleTransfertClose}>
                    Fermer
                </Button>
                <Button variant="success" className="text-white" >
                    Envoyer
                </Button>
                </Modal.Footer> */}
                {/* </form> */}
                
            </Modal>
            {/* *****************************************FIN****************************************** */}

                </>
          ):(
            <span className="text-center bg-default-2 btn-bottom-text  d-block gr-text-5 text-blackish-blue gr-opacity-10 my-35">
              <Loading/>
            </span>
          )} 
        </>
    );
};

export default CAccueilPortefeuille;
