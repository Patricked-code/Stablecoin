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

/**
 * Le composant PaiementEboutik gère le processus de paiement dans une application d'e-commerce,
 * permettant aux utilisateurs d'effectuer des paiements en utilisant un actif numérique stable (stablecoin)
 * via un smart contract Ethereum. Ce composant interagit avec l'API backend pour récupérer les informations
 * de paiement, ainsi qu'avec des smart contracts pour exécuter les transactions.
 *
 * @component
 * @example
 * return (
 *   <PaiementEboutik />
 * )
 */
const PaiementEboutik = () => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API

    // Déclaration des états et hooks pour gérer les différentes informations et états du composant.
    // Pour les smart contrats
    const ADDRESS_CONTRAT_EWARI = process.env.NEXT_PUBLIC_ADDRESS_CONTRAT_EWARI
    const PRIVATE_KEY = process.env.NEXT_PUBLIC_PRIVATE_KEY
    const [currentUser, setCurrentUser] = useState();
    const [magicCurrentAddress, setMagicCurrentAddress] = useState();
    const [provider, setProvider] = useState(null);
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const [dataPaymentPending, setDataPaymentPending] = useState(); //state des données de paiement en entente
    const [contractEscrow, setContractEscrow] = useState() //State du smart contrat d'escrow
    

    //***************************************************************** *
        // LES STATES DU STABLECOIN
    // ******************************************************************
    const [contractStablecoin, setContractStablecoin] = useState();
    const [signer, setSigner] = useState();
    const [nameStablecoin, setNameStablecoin] = useState();
    const [symbolStablecoin, setSymbolStablecoin] = useState();
    const [balanceStablecoin, setBalanceStablecoin] = useState();
    const [decimalStablecoin, setDecimalStablecoin] = useState();

    // States pour les données du marchand
    const [dataMerchantByIdentifier, setDataMerchantByIdentifier] = useState();
    
    const [operationCompleted, setOperationCompleted] = useState(false);


    /**
    * Exécute des effets secondaires pour initialiser le provider Ethereum et récupérer les métadonnées de l'utilisateur connecté avec Magic.
   */
    useEffect(() => {

        if (!!magic) {
            const pt = new ethers.providers.Web3Provider(magic.rpcProvider);
            setProvider(pt);
        }
    }, [magic]);

    /**
   * Récupère les informations de l'utilisateur connecté à partir de magic link.
   */
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
                 if (dataMerchantByIdentifier?.addressEscrow) {
                    const contractEscrow = new ethers.Contract(dataMerchantByIdentifier?.addressEscrow, ABI_ESCROW_STABLECOIN?.abi, walletRelay);
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

    }, [provider, magic, dataMerchantByIdentifier?.addressEscrow]);
    //  Fin
    

     /**
   * Récupère les informations de l'utilisateur connecté à partir de l'API backend.
   */
    useEffect(async () => {
        const getUser= async () => {
            const token = localStorage.getItem('tokenEnCours');

            try {
                
                const result = await fetch(`${API_URL}/api/user/find-user-sign-in`, {
                    headers: {
                        'Content-Type': 'application/json',
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

    /**
   * Récupère les informations sur les paiements en attente pour l'utilisateur connecté.
   */
    useEffect(async () => {
        const getPaymentPendingOfUser= async (_currentUserEmail) => {
            // const token = localStorage.getItem('tokenEnCours');

            try {
                
                const result = await fetch(`${API_URL}/api/eshop/find-one-order-by-email-customer-eshop?customerEmail=${_currentUserEmail}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        // Authorization: `Bearer ${token}`,
                    },
                });

                if (!result.ok) {
                    throw new Error('Failed to fetch request data');
                }

                const data = await result.json();
                setDataPaymentPending(data)

            } catch (error) {
                // Gérer les erreurs de manière appropriée, par exemple, définir un état d'erreur.
                console.error('Erreur lors de la récupération des données:', error);
            }
        };
        if (currentUser?.email) {
            await getPaymentPendingOfUser(currentUser?.email);
        }
    }, [currentUser?.email]);
    // Fin


    // Obtenir les données (adresse d'escrow) du marchand concerné en fonction de son identifiant
    useEffect(async () => {
        const getDataMerchantByIdentifier= async (_merchantIdentifier) => {
            const token = localStorage.getItem('tokenEnCours');

            try {
                
                const result = await fetch(`${API_URL}/api/apikey/find-one-use-stablecoin-for-eshop-by-merchant-identifier?merchantIdentifier=${_merchantIdentifier}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!result.ok) {
                    throw new Error('Failed to fetch request data');
                }

                const data = await result.json();
                setDataMerchantByIdentifier(data)

            } catch (error) {
                // Gérer les erreurs de manière appropriée, par exemple, définir un état d'erreur.
                console.error('Erreur lors de la récupération des données:', error);
            }
        };
        if (dataPaymentPending?.merchantIdentifier) {
            await getDataMerchantByIdentifier(dataPaymentPending?.merchantIdentifier);
        }
    }, [dataPaymentPending?.merchantIdentifier]);
    // Fin

   

    
    // Modal pour annuler le paiement
    const [showDelete, setShowDelete] = useState(false);
    const handleDeleteClose = () => setShowDelete(false);
    const handleDeleteShow = () => setShowDelete(true);
    
    // Modal pour confirmer le paiement
    const [showConfirmPayment, setShowConfirmPayment] = useState(false);
    const handleConfirmPaymentClose = () => setShowConfirmPayment(false);
    const handleConfirmPaymentShow = () => setShowConfirmPayment(true);

    // Modal de paiement sur des sites ecommerces
    const [showPayer, setShowPayer] = useState(false);
    // const handleClosePayer = () => setShowPayer(false);
    const handleShowPayer = () => setShowPayer(true);
    const delay = 10
    const [secondsRemaining, setSecondsRemaining] = useState(delay * 60 ); //Changer le temps ici aussi en 10 Min
    
    // Fin



   



    // ***************************************************************
        // Transfert de stablecoin vers le smart contrat d'escrow
    // ****************************************************************
    /**
     * Transfère les stablecoins vers le smart contract d'escrow pour effectuer le paiement.
     * Cette fonction interagit avec le smart contract de stablecoin pour approuver et transférer les fonds.
   */
    async function transferToEscrow() {
        setIsLoggingIn(true)

        try {

            if (dataMerchantByIdentifier?.addressEscrow) {
                        
                // Vérifier le solde de magicCurrentAddress
                const magicCurrentBalance = await contractStablecoin.balanceOf(magicCurrentAddress);
            
                // Convertir currentAmount en Wei
                const amountWei = ethers.utils.parseUnits(String(dataPaymentPending?.amount), decimalStablecoin);
                console.log("magicCurrentBalance=>",magicCurrentBalance)
                console.log("amountWei=>",amountWei)

                // Vérifier si magicCurrentAddress a des fonds suffisants
                if (magicCurrentBalance._hex>=amountWei._hex) {

                    const dataForm = {
                        spenderAddress: dataMerchantByIdentifier?.addressEscrow, //Adresse du smart contrat d'escrow
                        ownerAddress: magicCurrentAddress, //Adresse du client
                        amount: amountWei, //Montant
                    };

                    // Estimer le coût en gaz pour l'approbation
                    const approveEstimateGas = await contractStablecoin.estimateGas.approveFrom(
                    dataForm?.ownerAddress,
                    dataForm?.spenderAddress,
                    dataForm?.amount
                    );
            
                    // Obtenir le solde de l'exécutant
                    const executorBalance = await signer.getBalance();
            
                    // Vérifier si l'exécutant a un solde Ether suffisant pour le gaz d'approbation
                    if (executorBalance.gte(approveEstimateGas)) {
                    // Transaction d'approbation
                    const approveTx = await contractStablecoin.approveFrom(
                        dataForm?.ownerAddress,
                        dataForm?.spenderAddress,
                        dataForm?.amount
                    );
                    await approveTx.wait();
                    // Estimer le coût en gaz pour le dépôt
                    const asyncTransferEstimateGas = await contractEscrow.estimateGas.asyncTransfer(
                        dataForm?.ownerAddress,
                        dataForm?.amount,
                    );

                    // Vérifier si l'exécutant a un solde Ether suffisant pour le gaz de dépôt
                    if (executorBalance.gte(asyncTransferEstimateGas)) {
                        // Transaction de dépôt
                        const asyncTransferTx= await contractEscrow.asyncTransfer(dataForm?.ownerAddress, dataForm?.amount);
                        await asyncTransferTx.wait();
                        //Appel de la fonction d'ajout de la transaction dans la base de donnée (table historical)
                        addHistorical(asyncTransferTx.hash)
                    
                    } else {
                        setIsLoggingIn(false)
                        Swal.fire({
                        position: 'center',
                        icon: 'error',
                        html: `<p> Solde insuffisant pour couvrir les frais de gaz d'async transfer.</p>`,
                        showConfirmButton: false,
                        timer: 5000
                        });
                        console.error("Solde insuffisant pour couvrir les frais de gaz d'asyncTransfer.");
                    }
                    } else {
                        setIsLoggingIn(false)
                        Swal.fire({
                            position: 'center',
                            icon: 'error',
                            html: `<p> Solde insuffisant pour couvrir les frais de gaz d'approbation.</p>`,
                            showConfirmButton: false,
                            timer: 5000
                        });
                        console.error("Solde insuffisant pour couvrir les frais de gaz d'approbation.");
                    }
                } else {
                    setIsLoggingIn(false)
                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        html: `<p> Fonds insuffisants sur votre compte. <br/> Votre solde est: ${balanceStablecoin}</p>`,
                        showConfirmButton: false,
                        timer: 5000
                    });
                    cancelPayment('solde') //Appel de la fonction d'annulation de transaction
                    console.error("Fonds insuffisants sur votre compte.");
                }

                }else{
                    setIsLoggingIn(false)
                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        html: `<p> Recepteur introuvable</p>`,
                        showConfirmButton: false,
                        timer: 5000
                    });
                    console.error("Recepteur introuvable.");
                }
        } catch (error) {
            setIsLoggingIn(false)
            // Gestion spécifique de l'erreur de solde insuffisant
            if (error.message.includes("Le montant du transfert depasse le solde")) {
                // Swal.fire({
                //     position: 'center',
                //     icon: 'error',
                //     html: `<p> Fonds insuffisants sur votre compte. <br/> Votre solde est: ${ethers.utils.formatEther(await contractStablecoin.balanceOf(magicCurrentAddress))} ${symbolStablecoin}</p>`,
                //     showConfirmButton: false,
                //     timer: 10000
                // });
                cancelPayment('solde') //Appel de la fonction d'annulation de transaction

            }

            console.error("Erreur lors de l'exécution de la transaction :", error);
        }
    }
  

    /**
     * Confirme le paiement dans la base de données via une requête API.
   */
    const transferAmount= async() =>{
        setIsLoggingIn(true)

        // Obtenir le token en cours
        const token = localStorage.getItem('tokenEnCours');

        const result = await fetch(`${API_URL}/api/eshop/transfer-amount-eshop/${dataPaymentPending?.id}`, {
            method:"PUT",
            headers: {
                'Content-Type': 'application/json',
                Authorization:  `Bearer ${token}`
            }
        })
        .then(res=>{
        const data =  res.json();
            if (res.ok) {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    html: `<p> Votre paiement s'est effectué avec succès.</p>`,
                    showConfirmButton: false,
                    timer: 5000
                });
                setOperationCompleted(true); // Indique que l'opération est terminée
                //  Actualiser après l'affichage 
                // Router.push("/profil/dashboard/");
                setTimeout(() => {
                    window.location.href = "/profil/dashboard/";
                    // window.location.reload()
                }, 10000) 

            }else{
            setIsLoggingIn(false)
            Swal.fire({
                position: 'center',
                icon: 'error',
                html: `<p> ${data.message} </p>`,
                showConfirmButton: false,
                timer: 10000
            });
        }
        })
        .catch(error => {
        setIsLoggingIn(false)

        //handle error
        console.log(error);

        });
    }


    /**
   * Annule le paiement et met à jour la base de données via une requête API.
   */
    const cancelPayment= async(_data) =>{
        setIsLoggingIn(true)

        // Obtenir le token en cours
        const token = localStorage.getItem('tokenEnCours');

        const result = await fetch(`${API_URL}/api/eshop/cancel-payment-eshop/${dataPaymentPending?.id}`, {
            method:"PUT",
            headers: {
                'Content-Type': 'application/json',
                Authorization:  `Bearer ${token}`
            }
        })
        .then(res=>{
            if (res.status==200) {
            Swal.fire({
                position: 'center',
                icon: 'error',
                html: `<p> Paiement échoué ${_data=="solde"?("car votre est insuffisant"):("")}.<br/> Nous vous avons transmis un email de confirmation en ce sens.</p>` ,
                showConfirmButton: false,
                timer: 10000
            })
            setOperationCompleted(true); // Indique que l'opération est terminée
            //  Actualiser après l'affichage 
            // Router.push("/profil/dashboard/");
            setTimeout(() => {
                window.location.href = "/profil/dashboard/";
                // window.location.reload()
            }, 10000) 


            // Fin

            }else{
            setIsLoggingIn(false)

            Swal.fire({
                position: 'center',
                icon: 'error',
                html: "<p> L'annulation du paiement a échoué. </p>" ,
                showConfirmButton: false,
                timer: 15000
            })
        }
        })
        .catch(error => {
        setIsLoggingIn(false)

        //handle error
        console.log(error);

        });
    }
    // FIN


    /**
     * Enregistre les informations de la transaction dans l'historique via une requête API.
     * @param {string} _hash - Le hash de la transaction à enregistrer.
   */
    const addHistorical = async (_hash) => {
        setIsLoggingIn(true);

        let nameSender =""
        if (currentUser?.codeTypeProfil=="part") {
            nameSender = currentUser?.lastName + '' + currentUser?.firstName
        } else {
            nameSender = currentUser?.entreprise
        }
        
        try {
            
            const dataBody = {
                typeTransaction: "Paiement e-commerce",
                activeName: nameStablecoin,
                activeSymbol: symbolStablecoin,
                nameSender: nameSender,
                nameReceiver: dataPaymentPending?.eshopName,
                emailSender: currentUser?.email,
                emailReceiver: dataPaymentPending?.merchantEmail,
                senderAddress: magicCurrentAddress,
                receiverAddress: dataMerchantByIdentifier?.addressEscrow,
                amount: dataPaymentPending?.amount,
                eshopOrderId:dataPaymentPending?.id,
                hash: _hash
            }

            // Obtenir le token en cours
            const token = localStorage.getItem('tokenEnCours');
            
            const response = await fetch(`${API_URL}/api/historical/add-historical`, {
                method: 'POST',
                body: JSON.stringify(dataBody),
                headers: {
                    'Content-Type': 'application/json',
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
                //Appele de la fonction de confirmation de la transaction dans la base de donnée 
                transferAmount()
            } else {
                setIsLoggingIn(false);
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    html: `<p> ${data.message} </p>`,
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
          dataPaymentPending?.status == "En attente" &&
          dataPaymentPending?.createdAt
        ) {
            const createdAtTimestamp = new Date(dataPaymentPending.createdAt).getTime();
            const nowTimestamp = new Date().getTime();
            const initialTimeDifference = (nowTimestamp - createdAtTimestamp) / 1000; // en secondes
            let remainingTime = delay * 60 - Math.floor(initialTimeDifference); //Changer le temps ici aussi en 10 Min
            setSecondsRemaining(remainingTime);

          if (remainingTime > 0) {
            setShowPayer(true);
    
            const intervalId = setInterval(() => {
              remainingTime -= 1;
              setSecondsRemaining(remainingTime);
    
              if (remainingTime <= 0) {
                setShowPayer(false);
                clearInterval(intervalId);

                // Le temps est écoulé, exécutez la fonction transferAmount
                cancelPayment('echec');
              }
            }, 1000); // Mettez à jour toutes les secondes
          }
        }
    }, [dataPaymentPending?.id]); // Le tableau de dépendances vide garantit que cela s'exécute une seule fois lors du montage du composant
  
    // Formater le temps en seconde
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < delay ? '0' : ''}${remainingSeconds}`; //Changer le temps ici aussi en 10 Min
      };



    


    //UseEffect pour empêcher l'actualisation de la page pour le modal de confirmation
    useEffect(() => {
        const handleBeforeUnload = (event) => {
            if (showConfirmPayment && !operationCompleted) {
                event.preventDefault();
                event.returnValue = ''; // Pour les anciens navigateurs
            }
        };
    
        window.addEventListener('beforeunload', handleBeforeUnload);
    
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [showConfirmPayment, operationCompleted]);
    

     
    // FONCTION POUR FORMATER LA DATE
    const formatDate = (_updatedAt) =>{
        const maDate = moment(_updatedAt).format('DD/MM/YYYY à HH:mm');
        return  maDate
    }
    //  FIN

    return (
        <>

        {/* ********************************************************************************** */}
            {/* MODAL D'ANNULATION DE PAIEMENT'*/}
        {/* ********************************************************************************** */}
        <Modal show={showDelete} className="mt-15 border border-secondary border-5" backdrop="static">
            <Modal.Header closeButton className='bgColorRed'>
            <Modal.Title className="text-white">Annulation de paiement</Modal.Title>
            </Modal.Header>
                {/* <Form role="form"> */}
                    <Modal.Body className='bg-light'>
                        <div className="input-group flex-nowrap">
                            <div className='col-lg-12 col-md-12 row justify-content-center'>
                                <div className='input-group-alternative my-3 '>
                                    <label className="mx-2 mb-3 text-center" htmlFor='address'>
                                        {isLoggingIn === true ?(
                                            <i className='colorRed'>Annulation en cours... <br/>Merci de suivre le retour sur le site de votre marchand.</i>
                                        ):(
                                            "Voulez-vous vraiment annuler ce paiement ?"
                                        )}
                                    </label>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer className='bg-light'>
                    {isLoggingIn === true ?(""):(
                        <Button className="text-white px-4" color="danger" onClick={handleDeleteClose}>
                            Non .
                        </Button>
                    )}
                    <Button className='px-4' type='button' onClick={cancelPayment}  color="primary" disabled={isLoggingIn}>
                        Oui .
                        {isLoggingIn === true ? (<i className="fas fa-spinner fa-spin fa-lg mx-3"></i>) : ("")}
                    </Button>
                    </Modal.Footer>
                {/* </Form> */}
        </Modal>
        {/* *****************************************FIN****************************************** */}

        {/* ********************************************************************************** */}
            {/* MODAL DE CONFIRMATION DE PAIEMENT'*/}
        {/* ********************************************************************************** */}
        <Modal show={showConfirmPayment} className="mt-30 border border-secondary border-5" backdrop="static">
            <Modal.Header closeButton className='bgColorGreen'>
            <Modal.Title className="text-white">Confirmation du paiement</Modal.Title>
            </Modal.Header>
                {/* <Form role="form"> */}
                    <Modal.Body className='bg-light'>
                        <div className="input-group flex-nowrap">
                            <div className='col-lg-12 col-md-12 row justify-content-center'>
                                <div className='input-group-alternative my-3 '>
                                    <label className="mx-2 mb-3 text-center " htmlFor='address'>
                                        {isLoggingIn === true ?(
                                            <i className='colorGreen'>Confirmation en cours... <br/>Merci de suivre le retour sur le site de votre marchand.</i>
                                        ):(
                                            "Voulez-vous vraiment confirmer ce paiement ?"
                                        )}
                                        
                                    </label>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer className='bg-light'>
                        {isLoggingIn === true ?(""):(
                            <Button className="text-white px-4" color="danger" onClick={handleConfirmPaymentClose}>
                                Non .
                            </Button>
                        )}
                        <Button className='px-4' type='button' onClick={transferToEscrow}  color="success" disabled={isLoggingIn}>
                            Oui .
                            {isLoggingIn === true ? (<i className="fas fa-spinner fa-spin fa-lg mx-3"></i>) : ("")}
                        </Button>
                    </Modal.Footer>
                {/* </Form> */}
        </Modal>
        {/* *****************************************FIN****************************************** */}

        {/* <Button className="text-white" color="secondary" onClick={handleDeleteClose}> */}


        {/* ********************************************************************************** */}
            {/* MODAL DE VALIDATION DE PAIEMENT  '*/}
        {/* ********************************************************************************** */}
        <Modal show={showPayer} width='2000' fullscreen={true} >
        {/* <Modal show={showPayer} className="mt-15" onHide={handleClosePayer}> */}
            <Modal.Header closeButton className='bgColorblue'>
                <Modal.Title className="text-white" >Paiements en attente (Temps restant: {formatTime(secondsRemaining)})</Modal.Title>                
            </Modal.Header>
            {/* <Form role="form" onSubmit={hant}> */}
                <Modal.Body>
                    <div className='col-lg-12 col-md-12  row justify-content-center'>
                        <div className='col-lg-6 col-md-6 mt-3'>
                            <b>Marchand : </b> <br/> {dataPaymentPending?.eshopName}
                        </div>

                        <div className='col-lg-6 col-md-6 mt-3'>
                            <b>Identifiant marchand : </b> <br/> {dataPaymentPending?.merchantIdentifier}
                        </div>
                        <div className='col-lg-6 col-md-6 mt-3'>
                            <b>Nom client : </b> <br/> {dataPaymentPending?.customerName}
                        </div>

                        <div className='col-lg-6 col-md-6 mt-3'>
                            <b>Numéro commande : </b> <br/> {dataPaymentPending?.orderNumber}
                        </div>
                        <div className='col-lg-6 col-md-6 mt-3'>
                            <b>Montant : </b> <br/> {dataPaymentPending?.amount} {symbolStablecoin}
                        </div>
                        <div className='col-lg-6 col-md-6 mt-3'>
                            <b>Statut: </b> <br/> {dataPaymentPending?.status}
                        </div>
                        <div className='col-lg-6 col-md-6 mt-3'>
                            <b>Email du marchand : </b> <br/> {dataPaymentPending?.merchantEmail}
                        </div>
                        <div className='col-lg-6 col-md-6 mt-3'>
                            <b>Email Client : </b> <br/> {dataPaymentPending?.customerEmail}
                        </div>
                        
                    </div>
                    <div className='row d-flex'>
                        <div className='col-lg-6 col-md-6 col-sm-6 mt-3'>
                            <Button onClick={handleDeleteShow} disabled={isLoggingIn} className="text-white" color="danger" >
                                Annuler
                            </Button>
                        </div>
                        <div className='col-lg-6 col-md-6 col-sm-6 mt-3 '>
                            <Button className='px-4'  type='button'  color="success" onClick={handleConfirmPaymentShow} disabled={isLoggingIn}>
                            {/* <Button className='px-4'  type='button'  color="success" onClick={transferAmount} disabled={isLoggingIn}> */}
                                
                                Payer 
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
                {/* <Modal.Footer>
                    <Button className="text-white" color="danger" onClick={handleClosePayer}>
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

export default PaiementEboutik;
