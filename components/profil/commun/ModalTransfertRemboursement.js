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

const ModalTransfertRemboursement = ({historicalId, showRefund, onClose}) => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API
     // Variable de l'api key de stablecoin
     const API_KEY_STABLECOIN = process.env.NEXT_PUBLIC_API_KEY_STABLECOIN

    // console.log('historicalId=>',historicalId)
    // console.log('onClose=>',showRefund)
    // console.log('onClose=>',onClose)
    // Pour les smart contrats
    const ADDRESS_CONTRAT_EWARI = process.env.NEXT_PUBLIC_ADDRESS_CONTRAT_EWARI
    const PRIVATE_KEY = process.env.NEXT_PUBLIC_PRIVATE_KEY
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

    
    // *******************************************************************
        // LES CALCULS AFFICHER LE RECAPUTILATIF DES FRAIS DE DEMANDE DE REMBOURSEMENT
    // *******************************************************************

    let refundPercent=0.5
    let refundPercentWti=70

    let amountSender=""
    let amountReceiver=""
    let amountWti=""

    // Calcul du feeService
    let feeService = (oneHistorical?.amount * refundPercent) / 100;
    if (feeService>2000) {
        feeService = 2000 //Si le montant depasse 2000 on prend 2000 comme frais de service
    } else if(feeService<100){
        feeService = 100 //Si le montant est en dessous de 100 on prend 100 comme frais de service
    }

    // Calcul du montant pour l'expéditeur (amountSender)
    amountSender = oneHistorical?.amount - feeService;
    
    // Calcul du montant pour WTI (amountWti)
    amountWti = (feeService * refundPercentWti) / 100;

    // Calcul du montant pour le destinataire (amountReceiver)
    amountReceiver = feeService - amountWti;
// ***********************FIN***************************************


    


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
            }
        }
        // Appel de la fonction asynchrone pour obtenir les données lorsqu'il y a des changements dans `provider` ou `magic`.
        fetchData();;

    }, [provider, magic, currentSenderAddress]);
    //  Fin
    

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


    // Obtenir une seule ligne de transaction en fonction de son ID
    useEffect(async () => {
        const getOneHistorical= async (_historicalId) => {
            const token = localStorage.getItem('tokenEnCours');

            try {
                
                const result = await fetch(`${API_URL}/api/historical/find-one-historical/${_historicalId}`, {
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
                setOneHistorical(data);

            } catch (error) {
                // Gérer les erreurs de manière appropriée, par exemple, définir un état d'erreur.
                console.error('Erreur lors de la récupération des données:', error);
            }
        };
        if (historicalId) {
            await getOneHistorical(historicalId);
        }
    }, [historicalId]);
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

                // if (!result.ok) {
                //     throw new Error('Failed to fetch request data OK');
                //     setErrorDataOtherUser(1)
                // }

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
        if (addressTo) {
            await getOtherUser(addressTo);
        }
    }, [addressTo]);


   
    // Fonction pour faire la demande de remboursement du transfert à un mauvais destinateur
    const requestRefundTransfer  = async (e) => {
        e.preventDefault()
        setIsLoggingIn(true);
        /* Vérifier si l'utilisateur a choisi un pays, forme juridique, secteur, employés, type  
        *sinon il reçoit une alerte pour choisir
        */
        
          try {
            let address = ""
            if (optionRefund==0) {
                address = ""
            }else if(optionRefund==1){
                address= addressTo
            } 

            const dataForm = {
                addressRefund:address,
            }

            const token = localStorage.getItem('tokenEnCours') //Le token récuperé

            const result = await fetch(`${API_URL}/api/historical/request-refund-transfer/${historicalId}`, {
              method:"PUT",
              body: JSON.stringify(dataForm),
              headers: {
                'Content-Type': 'application/json',
                'x-api-key': `${API_KEY_STABLECOIN}`,
                Authorization:  `Bearer ${token}`
              }
            })
            const data = await result.json();
            /* Verifier s'il y a un messsage d'erreur on l'affiche dans SWAL 
            * sinon on affiche le message de succès
            */
            if (data?.transferFound?.refundStatus==0) {
                if (data?.transferFound?.addressRefund) {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        html: `
                            <p> 
                                Votre demande de remboursement du montant ${data?.transferFound?.amount} ${symbolStablecoin} envoyé à ${data?.transferFound?.nameReceiver} a bien été pris en compte.
                            </p>
                            <p> Veuillez patienter dans un delai De 24h .<br/>  Si l’incident est résolu ${infosOtherUser?.codeTypeProfil=="part"? (infosOtherUser?.firstName + " " + infosOtherUser?.lastName): (infosOtherUser?.entreprise)} recevra : </p>
                            <p><b>Montant à recevoir </b> : ${formatNumber(data?.transferFound?.refundAmountSender)} ${symbolStablecoin}</p>
                            <p><b>Frais de service  </b> : <i class="colorRed">- ${formatNumber(data?.transferFound?.refundServiceFee)} ${symbolStablecoin} </i></p>
                            <p><b>Montant envoyé  </b> : ${formatNumber(data?.transferFound?.amount)} ${symbolStablecoin}</p>
                        ` ,
                        showConfirmButton: false,
                        timer: 30000
                      })
                } else {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        html: `
                        <p> 
                            Votre demande de remboursement du montant ${data?.transferFound?.amount} ${symbolStablecoin} envoyé à ${data?.transferFound?.nameReceiver} a bien été pris en compte.
                        </p>
                        <p> Veuillez patienter dans un delai De 24h .<br/>  Si l’incident est résolu vous recevrez : </p>
                        <p><b>Montant à recevoir </b> : ${formatNumber(data?.transferFound?.refundAmountSender)} ${symbolStablecoin}</p>
                        <p><b>Frais de service  </b> : <i class="colorRed">- ${formatNumber(data?.transferFound?.refundServiceFee)} ${symbolStablecoin} </i></p>
                        <p><b>Montant envoyé  </b> : ${formatNumber(data?.transferFound?.amount)} ${symbolStablecoin}</p>
                        ` ,
                        showConfirmButton: false,
                        timer: 30000
                      })
                }
              

              // Actualiser après l'affichage 
              setTimeout(() => {
                window.location.reload()
                }, 30000)
                // Fin
            }else{
                setIsLoggingIn(false);
              
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    html: `<p> ${data?.message} </p>` ,
                    showConfirmButton: false,
                    timer: 10000
                  })
            }
            // Fin condition 
        
            } catch {
              setIsLoggingIn(false);
            }
        
    }
    // Fin


  
  
  













   



    




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
                onClose
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
        <Modal show={showRefund} width='2000' fullscreen={true} >
        {/* <Modal show={true} className="mt-15" width='50%' height='50%' onHide={handleCloseRefund}> */}
            <Modal.Header closeButton className='bgColorblue text-center'>
                <Modal.Title className="text-white " >Demande de remboursement (Temps restant: {formatTime(secondsRemaining)})</Modal.Title>                
            </Modal.Header>
            {/* <h3 className='text-center my-3'>Demande de remboursement</h3> */}
            {/* <Form role="form" onSubmit={hant}> */}
                <Modal.Body>
                    <div className='col-lg-12 col-md-12  row justify-content-between'>
                        {/* <div className='col-lg-2 col-md-2'></div> */}
                        <p className=''>
                            Vous venez d’effectuer la transaction suivante :<br/>
                        </p>
                        <div className='col-lg-6 col-md-6 mt-3'>
                            <b>Type transaction : </b> <br/> {oneHistorical?.typeTransaction}
                        </div>
                        <div className='col-lg-6 col-md-6 mt-3'>
                            <b>Recepteur: </b> <br/> {oneHistorical?.nameReceiver}
                        </div>
                        <div className='col-lg-6 col-md-6 mt-3'>
                            <b>Montant: </b> <br/> {oneHistorical?.amount} {symbolStablecoin}
                        </div>
                        <div className='col-lg-6 col-md-6 mt-3'>
                            <b>Date: </b> <br/> {formatDate(oneHistorical?.createdAt)}
                        </div>
                        <div className='col-lg-6 col-md-6 mt-3'>
                            <b>Adresse blockchain: </b> <br/> {oneHistorical?.receiverAddress}
                        </div>
                        <div className='col-lg-6 col-md-6 mt-3'>
                            <b>Hash transaction: </b> <br/> {oneHistorical?.hash}
                        </div>

                        <p className='my-3 col-lg-6 col-md-6'>
                            S'il n’y a pas d’erreur sur la cettte transaction clique sur le bouton.
                        </p>

                        <p className='my-3 col-lg-6 col-md-6'>
                            Si vous constatez une erreur vous pouvez utiliser le service régularisation pour modifier votre transaction. 
                            Lisez bien les conditions ci-dessous avant de déclencher ce service car il est <b>payant</b>
                        </p>

                        {/* {showConditions==1 ? (
                            <>
                                <div className=' col-lg-6 col-md-6'>
                                    <Button className="text-white" color="danger" onClick={onClose} >
                                        Pas d'erreur
                                    </Button>
                                </div>

                                <div className=' col-lg-6 col-md-6'>
                                    <Button className="text-white" onClick={()=>setShowConditions(1)} color="primary" >
                                        Régulariser
                                    </Button>
                                </div>
                            </>
                        ):("")} */}

                        {/* LE CONTENU APRES AVOIR CLIQUE SUR LE BOUTON REGULARISATION */}
                        
                        {showConditions==1 && !showPartRefund==1? (
                            <>
                                <p className='my-3 col-lg-12 col-md-12'>
                                    <b>Vous venez d’effectuer une transaction financière, mais vous vous rendez compte que vous avez commis une erreur ?</b><br/> Pas de panique, vous pouvez la corriger grâce au Service de Régularisation et Remboursement. Ce service vous permet de lancer une réclamation automatique pour annuler l’envoi de fonds à un mauvais destinataire et récupérer votre argent. Mais attention, vous n’avez que 10 minutes pour le faire ! Et ce service n’est pas gratuit, il vous coûtera des frais de gestion. Alors, avant de cliquer sur le bouton “Déclencher le Service”, lisez attentivement les informations suivantes :
                                </p>

                                <p className='my-3 col-lg-6 col-md-6'>
                                    <b className='colorBlue'>1 - </b> <b>Qu’est-ce que le Service de Régularisation et Remboursement ?</b> <br/> C’est un service qui a été créé pour vous aider à résoudre les erreurs de transaction, qui peuvent arriver à tout le monde. Il vous permet de demander à votre fournisseur de service financier de rectifier votre erreur et de vous rembourser le montant envoyé par erreur. Ainsi, vous évitez de perdre de l’argent et de vous retrouver dans une situation embarrassante.
                                </p>
                                <p className='my-3 col-lg-6 col-md-6'>
                                    <b className='colorBlue'>2 - </b><b>Quel est le délai pour utiliser le Service de Régularisation et Remboursement ?</b> <br/>Vous devez agir vite ! Vous n’avez que 10 minutes après avoir réalisé votre transaction pour déclencher le service. Passé ce délai, il sera trop tard et vous ne pourrez plus annuler votre transaction. Ce délai est nécessaire pour que le service soit efficace et que votre réclamation soit traitée rapidement.
                                </p>
                                <p className='my-3 col-lg-6 col-md-6'>
                                    <b className='colorBlue'>3 - </b>
                                    <b>Quels sont les frais du Service de Régularisation et Remboursement ? </b> <br/>
                                    Le service n’est pas gratuit, il vous coûtera des frais de gestion et de traitement de votre réclamation. Ces frais sont calculés en fonction du montant de votre transaction et du fournisseur de service financier que vous utilisez. Ils sont indiqués sur votre facture de régularisation et de remboursement.
                                </p>
                                <p className='my-3 col-lg-6 col-md-6'>
                                    <b className='colorBlue'>4 - </b>
                                    <b>Quelles sont vos responsabilités et vos engagements ? </b> <br/>
                                    En utilisant le service, vous vous engagez à respecter les règles et les conditions qui le régissent. Vous vous engagez également à utiliser le service de manière honnête et éthique. Vous reconnaissez que le service n’est pas destiné à abuser du système ou à frauder. Vous acceptez les conséquences en cas de mauvaise utilisation du service.
                                </p>
                                <p className='my-3 col-lg-6 col-md-6'>
                                    <b className='colorBlue'>5 - </b>
                                    <b>Quelles sont les sanctions en cas de fraude ou d’abus ? </b> <br/>
                                    Si vous utilisez le service de manière frauduleuse ou abusive, vous serez sévèrement sanctionné€. Votre compte sera immédiatement suspendu et votre identité sera signalée aux autorités compétentes. Vous risquez des poursuites judiciaires et des amendes.
                                </p>
                                <p className='my-3 col-lg-6 col-md-6'>
                                    <b className='colorBlue'>6 - </b> 
                                    En cliquant sur le bouton <b>“Déclencher le Service”</b>, vous confirmez que vous avez bien compris et accepté les termes et conditions du Service de Régularisation et Remboursement. Vous vous engagez à l’utiliser de manière responsable et conforme à son objectif.
                                </p>

                                <p className='my-3 col-lg-6 col-md-6'>
                                    <b className='colorBlue'>7 - </b> 
                                    Le Service de Régularisation et Remboursement est un service qui vise à vous faciliter la vie et à sécuriser vos transactions financières. En l’utilisant correctement, vous contribuez à maintenir la confiance et l’intégrité de notre plateforme.
                                </p>

                                <div className=' '>
                                {/* <Button className="text-white" color="primary" >
                                    Continuer
                                </Button> */}
                            </div>
                            </>
                        ) : ("")}
                    </div>

                    <form className='' onSubmit={requestRefundTransfer}>
                    
                    {/* LE FORMULAIRE DE DEMANDE DE REMBOURSEMENT */}
                    {showPartRefund==1 ? (
                        <>
                            {/* <form className=''> */}
                                <p className='my-2'>Erreur sur le Destinataire : </p>
                                
                                <div className='row'>
                                    <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">
                                        <libel>Choisissez une option</libel>
                                        <select 
                                            className="form-control"
                                            id="optionRefund"
                                            required
                                            defaultValue={optionRefund} 
                                            onChange={(event)=>setOptionRefund(event.target.value)}
                                        >
                                            <option defaultValue="">Option</option>
                                            <optgroup className=''>
                                                <option  value="0">Je veux le Remboursement vers Mon Compte : Le destinataire retourne le montant (moins les frais).</option>
                                                <option  value="1">Je veux que le Remboursement vers un Autre Compte le montant (moins les frais). </option>
                                            </optgroup>
                                        </select>
                                    </div >

                                    {/* Si l'utilisateur d'être rembourser sur autre adresse */}
                                    {optionRefund==1? (
                                        <div className='form-group col-lg-6 col-md-6 mt-3'>
                                            <label>Entrez l’adresse blockchain du compte qui doit recevoir le remboursement.</label>
                                            <input
                                                type='text'
                                                className='form-control'
                                                placeholder='Adresse blockchain'
                                                defaultValue={addressTo} 
                                                onChange={(event)=>setAddressTo(event.target.value)}
                                            />
                                        </div>
                                    ) : (''
                                        // <div className=' col-lg-6 col-md-6'>
                                        //     <Button className="text-white" color="primary" >
                                        //         Confirmer
                                        //     </Button>
                                        // </div>
                                    )}
                                </div>

                                {infosOtherUser?.codeTypeProfil? (
                                    <>
                                        {infosOtherUser?.codeTypeProfil=="part" ? (
                                            <>
                                                <div className='row'>
                                                    <p className='col-lg-6 col-md-6'><b>Nom :</b><br/> {infosOtherUser?.lastName}</p>
                                                    <p className='col-lg-6 col-md-6'><b>Prenom:</b><br/> {infosOtherUser?.firstName}</p>
                                                    <p className='col-lg-6 col-md-6'><b>Email :</b><br/> {infosOtherUser?.email}</p>
                                                    <p className='col-lg-6 col-md-6'><b>Adresse blockchain :</b><br/> {infosOtherUser?.address}</p>
                                                </div>
                                                
                                            </>
                                        ) : (
                                            <>
                                                <div className='row'>
                                                    <p className='col-lg-6 col-md-6'><b>Nom de la structure :</b><br/> {infosOtherUser?.entreprise}</p>
                                                    <p className='col-lg-6 col-md-6'><b>Email :</b><br/> {infosOtherUser?.email}</p>
                                                    <p className='col-lg-6 col-md-6'><b>Adresse blockchain :</b><br/> {infosOtherUser?.address}</p>
                                                </div>
                                                
                                            </>
                                        )}
                                        
                                        
                                    </>
                                ):('')}

                            {optionRefund==0 ? (
                                <div className='mt-3'>
                                    <p> 
                                        Votre demande de remboursement du montant {oneHistorical?.amount} {symbolStablecoin} envoyé à {oneHistorical?.nameReceiver} a bien été pris en compte.
                                    </p>
                                    <p> 
                                        Veuillez patienter dans un delai De 24h .<br/>  
                                        Si l’incident est résolu vous recevrez : 
                                    </p>
                                    <p><b>Montant à recevoir </b> : {formatNumber(amountSender)} {symbolStablecoin}</p>
                                    <p><b>Frais de service  </b> : <i className='colorRed'>- {formatNumber(feeService)} {symbolStablecoin}</i></p>
                                    <p><b>Montant envoyé  </b> : {formatNumber(oneHistorical?.amount)} {symbolStablecoin}</p>
                                </div>
                            ) : ("")}

                            {infosOtherUser?.codeTypeProfil? (
                                <div className='mt-3'>
                                    <p>            
                                        Votre demande de remboursement du montant {formatNumber(oneHistorical?.amount)} {symbolStablecoin} envoyé à {oneHistorical?.nameReceiver} a bien été pris en compte.
                                    </p>
                                    <p> Veuillez patienter dans un delai De 24h .<br/>  Si l’incident est résolu {infosOtherUser?.codeTypeProfil=="part"? (infosOtherUser?.firstName + " " + infosOtherUser?.lastName): (infosOtherUser?.entreprise)} recevra : </p>
                                    <p><b>Montant à recevoir </b> : {formatNumber(amountSender)} {symbolStablecoin}</p>
                                    <p><b>Frais de service  </b> : <i className='colorRed'>- {formatNumber(feeService)} {symbolStablecoin}</i></p>
                                    <p><b>Montant envoyé  </b> : {formatNumber(oneHistorical?.amount)} {symbolStablecoin}</p>
                                </div>
                            ) :("")}
                        
                        


                                {errorDataOtherUser === "Aucun utilisateur trouvé"? (
                                    <p className='colorRed text-center my-3'>Désolé, aucun utilisateur trouvé</p>
                                ):("")}
                                
                            {/* </form> */}
                        </>
                    ) :("")}

                    {/* LES BOUTONS */}
                    {showButtonRegul==0 && showConditions==1 ? (""): (
                        <>
                            <div className='row'>
                                <div className=' col-lg-6 col-md-6'>
                                    <Button className="text-white" color="danger" onClick={onClose} >
                                        Pas d'erreur
                                    </Button>
                                </div>

                                <div className=' col-lg-6 col-md-6'>
                                    <Button className="text-white" onClick={()=>setShowConditions(1)} color="primary" >
                                        Régulariser .
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                    

                    {showConditions==1 ? (
                        <>
                            <div className='row mt-3'>
                                <div className=' col-lg-6 col-md-6'>
                                    <Button className="text-white px-4" color="danger" onClick={onClose} >
                                        Fermer
                                    </Button>
                                </div>
                                {optionRefund==0? (
                                    <div className=' col-lg-6 col-md-6'>
                                        <Button disabled={isLoggingIn} className="text-white" type='submit' onClick={()=>setShowPartRefund(1)} color="primary" >
                                            Confirmer 
                                            {isLoggingIn === true ? (<i className="fas fa-spinner fa-spin fa-lg mx-3"></i>) : ("")}
                                        </Button>
                                    </div>
                                ) : optionRefund==1? (
                                    <div className=' col-lg-6 col-md-6'>
                                        <Button  
                                            disabled={errorDataOtherUser === "Aucun utilisateur trouvé"}  
                                            className="text-white" type='submit' 
                                            onClick={()=>setShowPartRefund(1)} 
                                            color="primary"
                                            // disabled={isLoggingIn} 

                                        >
                                            Confirmer 
                                            {isLoggingIn === true ? (<i className="fas fa-spinner fa-spin fa-lg mx-3"></i>) : ("")}

                                        </Button>
                                    </div>
                                ) : (
                                    <div className=' col-lg-6 col-md-6'>
                                    <Button className="text-white" onClick={()=>setShowPartRefund(1)} color="primary" >
                                        Continuer 
                                    </Button>
                                </div>
                                )}
                                
                            </div>
                        </>
                    ):("")}

                    </form>

                    {/* <div className='row d-flex'>
                        <div className='col-lg-6 col-md-6 col-sm-6 mt-3 '>
                            <Button className='px-3'  type='button'  color="success"  disabled={isLoggingIn}>
                                Payer
                                {isLoggingIn === true ? (<i className="fas fa-spinner fa-spin fa-lg mx-3"></i>) : ("")}
                            </Button>
                        </div>
                    </div> */}
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
            







        </>
    );
};

export default ModalTransfertRemboursement;
