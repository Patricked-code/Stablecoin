import { useState, useEffect } from 'react';
import { Container, Row, Col, Modal } from "react-bootstrap";
import {Button,} from "reactstrap";
import React from "react";
import Link from 'next/link';
import moment from 'moment';
import { Icon } from '@iconify/react';
import { Table } from '@nextui-org/react';



// Pour Magic
import { magic } from "../../../magic";
import { ethers } from "ethers";
import Loading from "../../../components/loading";
import Router from "next/router";
import Swal from 'sweetalert2';
// FIN

// Importer ABI de E-WARI
import ABI_TOKEN_EWARI from "../../../components/Contrats/Abi/AbiStablecoin.json";
import ABI_ESCROW_STABLECOIN from "../../../components/Contrats/Abi/AbiEscrowStablecoin.json";


// FIN

const ModalTransfertRemboursementRecepteur = () => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API
     // Variable de l'api key de stablecoin
     const API_KEY_STABLECOIN = process.env.NEXT_PUBLIC_API_KEY_STABLECOIN

    
    // Pour les smart contrats
    const ADDRESS_CONTRAT_EWARI = process.env.NEXT_PUBLIC_ADDRESS_CONTRAT_EWARI
    const PRIVATE_KEY = process.env.NEXT_PUBLIC_PRIVATE_KEY
    const ADDRESS_COMMISSION_REFUND_TRANSFER = process.env.NEXT_PUBLIC_ADDRESS_COMMISSION_REFUND_TRANSFER //Adresse commission de transfert Wealthtech 
    
    const [currentUser, setCurrentUser] = useState();
    const [magicCurrentAddress, setMagicCurrentAddress] = useState();
    const [provider, setProvider] = useState(null);
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const [dataPaymentPending, setDataPaymentPending] = useState(); //state des données de paiement en entente
    const [dataOnePaymentPending, setDataOnePaymentPending] = useState();
    const [paymentPendingLength, setPaymentPendingLength] = useState();

    const [idPaymentPending, setIdPaymentPending] = useState();
    const [currentnameEntreprise, setCurrentEntreprise] = useState();
    const [currentSenderEmail, setCurrentSenderEmail] = useState();
    const [currentSenderAddress, setCurrentSenderAddress] = useState();
    const [currentAmount, setCurrentAmount] = useState();
    const [currentSenderId, setCurrentSenderId] = useState();
    const [contractEscrow, setContractEscrow] = useState()
    
    // Autre user
    const [infosOtherUser, setInfosOtherUser] = useState()
    const [errorDataOtherUser, setErrorDataOtherUser] = useState()

    

    //***************************************************************** *
        // LES STATES DU STABLECOIN
    // ******************************************************************
    const [contractStablecoin, setContractStablecoin] = useState();
    const [signer, setSigner] = useState();
    const [walletRelayer, setWalletRelayer] = useState();
    
    const [nameStablecoin, setNameStablecoin] = useState();
    const [symbolStablecoin, setSymbolStablecoin] = useState();
    const [balanceStablecoin, setBalanceStablecoin] = useState();
    const [decimalStablecoin, setDecimalStablecoin] = useState();

    // States des données de l'utilisation de stablecoin comme moyen de paiement
    const [dataRequestUseStablecoinOfUser, setDataRequestUseStablecoinOfUser] = useState()


    // States de la demande de remboursement
    const [oneHistorical, setOneHistorical] = useState();
    const [optionRefund, setOptionRefund] = useState();
    const [addressTo, setAddressTo] = useState();
    const [showConditions, setShowConditions] = useState();
    const [showPartRefund, setShowPartRefund] = useState();
    const [showButtonRegul, setShowButtonRegul] = useState(0);

    
    // Modal de la confirmation de remboursement
    const [showRefundConfirm, setShowRefundConfirm] = useState(false);
    const handleCloseRefundConfirm = () => setShowRefundConfirm(false);
    const handleShowRefundConfirm = () => setShowRefundConfirm(true);
    // Fin



    


    useEffect(() => {

        if (!!magic) {
            const pt = new ethers.providers.Web3Provider(magic.rpcProvider);
            setProvider(pt);
        }
    }, [magic]);

    // RECUPERATION DES INFORMATIONS QUI CONCERNENT MAGIC
    useEffect(() => {
        const fetchData = async () => {
            if (!!magic && !!provider) {
                const userMetadatas = await magic.user.getMetadata();
                const signer = provider.getSigner();
                setSigner(signer)
                const network = await provider.getNetwork();
                const userAddress = await signer.getAddress();
                setMagicCurrentAddress(userAddress)
                //const userBalance = ethers.utils.formatEther(await provider.getBalance(userAddress))
                // FIN

                
                /**
                 * Smart contrat du factory d'escrow.
                 * @type {string}
                 */
                 const walletRelay = new ethers.Wallet(PRIVATE_KEY, provider);
                 setWalletRelayer(walletRelay)

                 if (currentSenderAddress) {
                    const contractEscrow = new ethers.Contract(currentSenderAddress, ABI_ESCROW_STABLECOIN?.abi, walletRelay);
                    setContractEscrow(contractEscrow)
                 }
                 


                // *************************************************************************
                    // INTERACTION AVEC LE SMART CONTRAT DE STABLECOIN
                // *************************************************************************

                const contractStablecoin = new ethers.Contract(ADDRESS_CONTRAT_EWARI,ABI_TOKEN_EWARI.abi,walletRelay);
                setContractStablecoin(contractStablecoin);
                
                //   recuperation des infos de stablecoin
                const nameStablecoin = await contractStablecoin.name()
                const symbolStablecoin = await contractStablecoin.symbol()
                const decimalStablecoin = await contractStablecoin.decimals()
                const balanceStablecoin = await contractStablecoin.balanceOf(userAddress)
                // Fin 

                // Stocker les infos de stablecoin dans leur state
                setNameStablecoin(nameStablecoin)
                setSymbolStablecoin(symbolStablecoin)
                setDecimalStablecoin(decimalStablecoin)
                setBalanceStablecoin(balanceStablecoin/10**decimalStablecoin)


                // ******************************************
                // Autres
                // ********************************************
        //         const filter = contractStablecoin.filters.Transfer(userAddress, null) || contract.filters.Transfer(null, userAddress);
        // const events = await provider.getLogs({...filter, fromBlock: 0, toBlock: 'latest'});
        
        // let balance = ethers.BigNumber.from(0);
    
        // for (let event of events) {
        //     const eventDetails = contractStablecoin.interface.parseLog(event);
        //     const {from, to, value} = eventDetails.args;
    
        //     const block = await provider.getBlock(event.blockNumber);
        //     const eventTimestamp = block.timestamp;
    
        //     // Continuer tant que l'événement est antérieur à la date limite
        //     if (eventTimestamp < oneHistorical?.createdAt) {
        //         if (userAddress.toLowerCase() === from.toLowerCase()) {
        //             balance = balance.sub(value);
        //         } else if (userAddress.toLowerCase() === to.toLowerCase()) {
        //             balance = balance.add(value);
        //         }
        //     } else {
        //         // Arrêter l'itération une fois qu'un événement postérieur à la date cible est trouvé
        //         break;
        //     }
        // }

        // // const decimals = await contract.decimals();
        // const formattedBalance = balance.div(ethers.BigNumber.from(10).pow(decimalStablecoin));
    
        // console.log("formattedBalance=>",formattedBalance);

            // *********FIN AUTRE****************************

            }
        }
        // Appel de la fonction asynchrone pour obtenir les données lorsqu'il y a des changements dans `provider` ou `magic`.
        fetchData();

    }, [provider, magic, currentSenderAddress]);
    //  Fin


    // *****************************************************************************
        // MONTANT EN FOCNTION D'UNE DATE
    // *****************************************************************************
    async function getBalanceBeforeTimestamp(provider, userAddress, contractAddress, abi, timestamp) {
        const contract = new ethers.Contract(contractAddress, abi, provider);
        const filter = contract.filters.Transfer(userAddress, null) || contract.filters.Transfer(null, userAddress);
        const events = await provider.getLogs({...filter, fromBlock: 0, toBlock: 'latest'});
        
        let balance = ethers.BigNumber.from(0);
    
        for (let event of events) {
            const eventDetails = contract.interface.parseLog(event);
            const {from, to, value} = eventDetails.args;
    
            const block = await provider.getBlock(event.blockNumber);
            const eventTimestamp = block.timestamp;
    
            // Continuer tant que l'événement est antérieur à la date limite
            if (eventTimestamp < timestamp) {
                if (userAddress.toLowerCase() === from.toLowerCase()) {
                    balance = balance.sub(value);
                } else if (userAddress.toLowerCase() === to.toLowerCase()) {
                    balance = balance.add(value);
                }
            } else {
                // Arrêter l'itération une fois qu'un événement postérieur à la date cible est trouvé
                break;
            }
        }
    
        // Convertir le solde en un nombre compréhensible en tenant compte des décimales du token
        const decimals = await contract.decimals();
        const formattedBalance = balance.div(ethers.BigNumber.from(10).pow(decimals));
    
        return formattedBalance;
    }
    
    // Utilisez cette fonction en passant la date et l'heure cibles sous forme de timestamp UNIX
    // Par exemple, pour le 02/02/2024 à 15:50, convertissez cette date en timestamp UNIX
    const targetTimestamp = new Date('2024-02-02T15:50:00Z').getTime() / 1000;
    
    // *******************FIN******************************************************






    

    // Obtenir l'utilisateur connecté 
    useEffect(async () => {
        const getUser= async () => {
            const token = localStorage.getItem('tokenEnCours');

            try {
                
                const result = await fetch(`${API_URL}/api/user/find-user-sign-in`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': `${API_KEY_STABLECOIN}`,
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!result.ok) {
                    throw new Error('Failed to fetch request data');
                }

                const data = await result.json();
                setCurrentUser(data);

            } catch (error) {
                // Gérer les erreurs de manière appropriée, par exemple, définir un état d'erreur.
                console.error('Erreur lors de la récupération des demandes:', error);
            }
        };

        await getUser();
    }, []);
    // Fin


    // Obtenir une seule ligne de transaction en fonction de l'email du recepteur
    useEffect(async () => {
        const getOneHistorical= async (_userEmail) => {
            const token = localStorage.getItem('tokenEnCours');

            try {
                
                const result = await fetch(`${API_URL}/api/historical/find-one-request-refund-transfer-by-user-email?email=${_userEmail}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': `${API_KEY_STABLECOIN}`,
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!result.ok) {
                    throw new Error('Failed to fetch request data ok');
                }

                const data = await result.json();
                setOneHistorical(data);

            } catch (error) {
                // Gérer les erreurs de manière appropriée, par exemple, définir un état d'erreur.
                console.error('Erreur lors de la récupération des données:', error);
            }
        };
        if (currentUser?.email) {
            await getOneHistorical(currentUser?.email);
        }
    }, [currentUser?.email]);
    // Fin

    
    // Modal de la demande de remboursement 
    // const [showRefund, setShowRefund] = useState(false);
    // const handleCloseRefund = () => setShowRefund(false);
    // const handleShowRefund = () => setShowRefund(true);
    const [secondsRemaining, setSecondsRemaining] = useState(10 * 60 );
    
    // Fin


    // Obtenir un utilisateur en fonction de son adresse blockchain
    useEffect(async () => {
        const getOtherUser= async (_addressTo) => {
            const token = localStorage.getItem('tokenEnCours');

            try {
                
                const result = await fetch(`${API_URL}/api/user/find-user-by-addrBlockchain?address=${_addressTo}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': `${API_KEY_STABLECOIN}`,
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await result.json();
                setInfosOtherUser(data);
                if (optionRefund==0) {
                    setErrorDataOtherUser("")
                } else {
                    setErrorDataOtherUser(data?.message)
                }

            } catch (error) {
                // Gérer les erreurs de manière appropriée, par exemple, définir un état d'erreur.
                console.error('Erreur lors de la récupération des données:', error);
            }
        };
        if (oneHistorical?.addressRefund) {
            await getOtherUser(oneHistorical?.addressRefund);
        }
    }, [oneHistorical?.addressRefund]);


   


//    useEffect pour empêcher l'actualisation de la page
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      // Empêcher l'actualisation de la page si le Modal est ouvert
      if (showRefundConfirm) {
        event.preventDefault();
        event.returnValue = ''; // Pour les anciens navigateurs
      }
    };

    // Ajouter le gestionnaire d'événements lorsque le composant est monté
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Supprimer le gestionnaire d'événements lorsque le composant est démonté
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [showRefundConfirm]);

//   const handleCloseRefundConfirm = () => {
//     setShowRefundConfirm(false);
//   };



    // *************************************************************************
        // FONCTIONS DU SMART CONTRAT
    // *************************************************************************
    const transferBatch = async () => {
        setIsLoggingIn(true)
    
        // Parser le montant à rembourser à l'expéditeur
        const tostingSender = String(oneHistorical?.refundAmountSender)
        const mountWeiSender = ethers.utils.parseUnits(tostingSender, decimalStablecoin);
    
        // Parser le montant de commission de remboursement de transfert de WTI
        const tostingWti = String(oneHistorical?.refundAmountWti)
        const mountWeiWti = ethers.utils.parseUnits(tostingWti, decimalStablecoin);
    
        let refundAddress = "";
        if (oneHistorical?.addressRefund) {
            refundAddress=oneHistorical?.addressRefund
        }else{
            refundAddress=oneHistorical?.senderAddress
        }
    // return
        const dataForm = {
            addressTo:oneHistorical?.receiverAddress,
            recipients: [refundAddress, ADDRESS_COMMISSION_REFUND_TRANSFER],
            amounts: [mountWeiSender, mountWeiWti],
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
          const convertAmount = parseFloat(oneHistorical?.amount)
          if (balanceStablecoin<=convertAmount) {
            setIsLoggingIn(false);
            Swal.fire({
              position: 'center',
              icon: 'error',
              html: "Votre solde est insuffisant pour couvrir le coût du remboursement.",
              showConfirmButton: false,
              timer: 5000,
            });
            throw new Error("Solde insuffisant pour le remboursement.");
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
          if (infosOtherUser) {
            addHistoricalOtherUser(transferBatchTx?.hash);
          } else {
            addHistorical(transferBatchTx?.hash);
          }

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
  
  
  
      // Fonction d'enregistrement des données du transfert dans l'historique 
      //si le remboursement s'effectue sur le compte de l'expéditeur qui s'est trompé
    const addHistorical = async (_hash) => {
        
        try {
            
            const dataBody = {
                typeTransaction: "Remboursement",
                activeName: nameStablecoin,
                activeSymbol: symbolStablecoin,
                nameSender: oneHistorical?.nameReceiver,
                nameReceiver: oneHistorical?.nameSender,
                emailSender: oneHistorical?.emailReceiver,
                emailReceiver: oneHistorical?.emailSender,
                senderAddress: oneHistorical?.receiverAddress,
                receiverAddress: oneHistorical?.senderAddress,
                amount: oneHistorical?.refundAmountSender,
                refundServiceFee:oneHistorical?.refundServiceFee,
                refundAmountSender:oneHistorical?.refundAmountSender,
                refundAmountReceiver:oneHistorical?.refundAmountReceiver,
                refundAmountWti:oneHistorical?.refundAmountWti,
                commissionWealthechAddress: ADDRESS_COMMISSION_REFUND_TRANSFER,
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
                refundTransfer(oneHistorical?.id)
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
     //si l'expédietur souhaite que le remboursement s'effectue sur le compte d'un autre utilisateur
     const addHistoricalOtherUser = async (_hash) => {
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
                typeTransaction: "Remboursement",
                activeName: nameStablecoin,
                activeSymbol: symbolStablecoin,
                nameSender: nameSender,
                nameReceiver: nameReceiver,
                emailSender: currentUser?.email,
                emailReceiver: infosOtherUser?.email,
                senderAddress: magicCurrentAddress,
                receiverAddress: infosOtherUser?.address,
                amount: oneHistorical?.refundAmountSender,
                refundServiceFee:oneHistorical?.refundServiceFee,
                refundAmountSender:oneHistorical?.refundAmountSender,
                refundAmountReceiver:oneHistorical?.refundAmountReceiver,
                refundAmountWti:oneHistorical?.refundAmountWti,
                addressRefund:oneHistorical?.addressRefund,
                commissionWealthechAddress: ADDRESS_COMMISSION_REFUND_TRANSFER,
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
                refundTransfer(oneHistorical?.id)
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

    //Fonction pour indiquer que 
    const refundTransfer = async (_historicalId) => {
        setIsLoggingIn(true);
        
            try {
            // Obtenir le token en cours
            const token = localStorage.getItem('tokenEnCours');
            
            const response = await fetch(`${API_URL}/api/historical/refund-transfer/${_historicalId}`, {
                method: 'PUT',
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
            if (data?.transferFound?.refundStatus==1) {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    html: `<p> Le remboursement s'est effectué avec succès. <br/> Vous devez constater une augmentation d'une somme de <b>${formatNumber(oneHistorical?.refundAmountReceiver)} ${symbolStablecoin}</b> à votre solde comme bonus.</p>`,
                    showConfirmButton: false,
                    timer: 10000
                });
                setShowRefundConfirm(false); //Pour fermer le modal de confirmation de remboursement
                // Actualiser après l'affichage
                setTimeout(() => {
                    window.location.reload();
                    
                }, 10000);
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












   



    




    // Utilisez le useEffect pour effectuer des actions lorsque le composant est monté
    useEffect(() => {
        if (
            oneHistorical?.createdAt
        ) {
            const createdAtTimestamp = new Date(oneHistorical?.createdAt).getTime();
            const nowTimestamp = new Date().getTime();
            const initialTimeDifference = (nowTimestamp - createdAtTimestamp) / 1000; // en secondes
            let remainingTime = 10 * 60 - Math.floor(initialTimeDifference);
            setSecondsRemaining(remainingTime);
        //   if (remainingTime > 0) {
        //     setShowPayer(true);
    
            const intervalId = setInterval(() => {
              remainingTime -= 1;
              setSecondsRemaining(remainingTime);
    
              if (remainingTime <= 0) {
                // setShowPayer(false);
                clearInterval(intervalId);

                // Le temps est écoulé, exécutez la fonction transferAmount
                // transferAmount();
              }
            }, 1000); // Mettez à jour toutes les secondes
        //   }
        }
      }, [oneHistorical?.createdAt]); // Le tableau de dépendances vide garantit que cela s'exécute une seule fois lors du montage du composant
  
      const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
      };
  

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
     
    // FONCTION POUR FORMATER LA DATE
    const formatDate = (_updatedAt) =>{
        const maDate = moment(_updatedAt).format('DD/MM/YYYY à HH:mm');
        return  maDate
    }
    //  FIN

    




    return (
        <>
        


        {/* ********************************************************************************** */}
            {/* MODAL DE VALIDATION DE PAIEMENT  '*/}
        {/* ********************************************************************************** */}
        <Modal show={oneHistorical?.refundStatus===0} width='2000' fullscreen={true} >
        {/* <Modal show={true} className="mt-15" width='50%' height='50%' onHide={handleCloseRefund}> */}
            <Modal.Header closeButton className='bgColorblue text-center'>
                <Modal.Title className="text-white " ></Modal.Title>                
            </Modal.Header>
            {/* <h3 className='text-center my-3'>Demande de remboursement</h3> */}
            {/* <Form role="form" onSubmit={hant}> */}
                <Modal.Body>

                    <div className='row'>
                        <div className='col-lg-2 col-md-2'></div>
                            <div className='col-lg-8 col-md-8'>
                            <h3 className='text-center'>Demande de remboursement</h3>

                                <div className='currency-selection '>
                                    <div className="mt-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                                    <div className=' text-center'>
                                        <img src="/images/ecfa/icons/icon3.jpg" width={100}  className="rounded-circle"  alt='image' />
                                    </div>
                                        <div className='cryptocurrency-slides'>
                                            <div className='single-cryptocurrency-box'>
                                                
                                                <div className='d-flex align-items-center mb-3'>
                                                
                                                <div className='title '>
                                                    {/* <p className=''>
                                                        Vous avez cette demande de remboursement en cours suite à une erreur de tansfert de la part de (Koné) d'une somme de (1000) vers votre compte. Nous de cliquer sur le bouton ci-dessous pour effectuer le remboursement pour n'est pas voire votre compte bloqué. Nous vous informons que vous aurez (200) comme bonus pour avoir accepté de raméner cet argent au propriétaire. Si vous avez des vous pouvez contacter les administrateur de Wealthtech à travers cet email (aroune@gmail.com). <br/>
                                                    </p> */}
                                                    <p>Madame, Monsieur,</p>
                                                    <p>
                                                        Nous vous prions de bien vouloir prendre connaissance de la présente communication relative à une demande de remboursement en cours, consécutive à une erreur de transfert émanant :
                                                        <br/> de l'expéditeur: <b>{oneHistorical?.nameSender}</b>, <br/>d'un montant de: <b>{formatNumber(oneHistorical?.amount)} {symbolStablecoin}</b>,<br/> à la date: <b>{formatDate(oneHistorical?.createdAt)}</b> vers votre compte.<br/> Ce qui augmente votre solde à :
                                                        {balanceStablecoin? (
                                                        <> 
                                                            <b> { formatNumber(balanceStablecoin)} {symbolStablecoin} </b> <br/>qui était 
                                                            <b> { formatNumber(balanceStablecoin - oneHistorical?.amount)} {symbolStablecoin}</b>
                                                        </>):(" ...")}
                                                    </p>
                                                    
                                                    <p>
                                                        Afin d'éviter tout blocage de votre compte, nous vous prions instamment de cliquer sur le bouton ci-dessous pour procéder au remboursement. Nous souhaitons vous informer que, en reconnaissance de votre collaboration exemplaire, un bonus de <b>{formatNumber(oneHistorical?.refundAmountReceiver)} {symbolStablecoin}</b> vous sera octroyé pour avoir accepté de restituer ces fonds à leur propriétaire légitime.
                                                    </p>

                                                    <p>
                                                        Veuillez noter que pour toute question ou préoccupation, vous avez la possibilité de contacter les administrateurs de Wealthtech via l'adresse électronique suivante : <b className='colorBlue'>contact@wealthtechinnovations.com</b>
                                                    </p>

                                                    <p>
                                                        Nous vous remercions chaleureusement pour votre coopération rapide et efficace dans cette affaire. Nous demeurons à votre entière disposition pour toute assistance supplémentaire.
                                                    </p>
                                                </div>
                                                </div>
                                                {magicCurrentAddress? (
                                                    <>
                                                        {showRefundConfirm==true ? ("") : (
                                                            <Button
                                                                block
                                                                color="success"
                                                                type="button"
                                                                onClick={handleShowRefundConfirm}
                                                            >
                                                                Rembourser
                                                            </Button>
                                                        )}
                                                    </>
                                                ) :("")}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        <div className='col-lg-2 col-md-2'></div>
                    </div>

                   
                </Modal.Body>
                {/* <Modal.Footer>
                    <Button className="text-white" color="danger" onClick={handleCloseRefund}>
                        Fermer
                    </Button>
                    <Button  type='button'  color="success" onClick={transferToEscrow} disabled={isLoggingIn}>
                        Payer
                        {isLoggingIn === true ? (<i className="fas fa-spinner fa-spin fa-lg mx-3"></i>) : ("")}

                    </Button>
                </Modal.Footer> */}
            {/* </Form> */}
        </Modal>
        {/* *****************************************FIN****************************************** */}
            

         {/* ********************************************************************************** */}
            {/* MODAL DE DEMANDE DE CONFIRMATION DE REMBOURSEMENT  '*/}
        {/* ********************************************************************************** */}
        <Modal show={showRefundConfirm} className="mt-15" backdrop="static">
            <Modal.Header closeButton className='bgColorGreen'>
                <Modal.Title className="text-white" >Confirmer le remboursement</Modal.Title>                
            </Modal.Header>
            {/* <Form role="form" onSubmit={hant}> */}
                <Modal.Body>
                    <div className="input-group flex-nowrap">
                        <div className='col-lg-12 col-md-12 row justify-content-between'>
                            <div className='input-group-alternative my-3  '>

                                {isLoggingIn === true ? (
                                <b className='colorRed'>NB: Veuillez ne pas fermer cette fenêtre avant la fin de l'exécution afin d'éviter toute perte de fonds..</b>
                                ) : ("Voulez-vous confirmer le remboursement ? ")}
                                
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    {isLoggingIn === false ? (
                        <Button className="text-white" color="danger" onClick={handleCloseRefundConfirm}>
                            Non
                        </Button>
                    ) : ("")}

                    <Button onClick={transferBatch} type='button'  color="success"  disabled={isLoggingIn}>
                        Oui
                        {isLoggingIn === true ? (<i className="fas fa-spinner fa-spin fa-lg mx-3"></i>) : ("")}

                    </Button>
                </Modal.Footer>
            {/* </Form> */}
        </Modal>
        {/* *****************************************FIN****************************************** */}
          





        </>
    );
};

export default ModalTransfertRemboursementRecepteur;
