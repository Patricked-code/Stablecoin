import { useState, useEffect } from 'react';
import { Container, Row, Col, Modal } from "react-bootstrap";
import {Button,} from "reactstrap";
import React from "react";
import Link from 'next/link';
import moment from 'moment';
import { Icon } from '@iconify/react';
import { Table } from '@nextui-org/react';



// Pour Magic
import { magic } from "../../../../../magic";
import { ethers } from "ethers";
import Loading from "../../../../../components/loading";
import Router from "next/router";
import Swal from 'sweetalert2';
// FIN

// Importer ABI de E-WARI
import ABI_TOKEN_EWARI from "../../../../../components/Contrats/Abi/AbiStablecoin.json";

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
const ModalConfirmationRetrait = () => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API
     // Variable de l'api key de stablecoin
     const API_KEY_STABLECOIN = process.env.NEXT_PUBLIC_API_KEY_STABLECOIN

    // Déclaration des états et hooks pour gérer les différentes informations et états du composant.
    // Pour les smart contrats
    const ADDRESS_CONTRAT_EWARI = process.env.NEXT_PUBLIC_ADDRESS_CONTRAT_EWARI
    const PRIVATE_KEY = process.env.NEXT_PUBLIC_PRIVATE_KEY
    const [currentUser, setCurrentUser] = useState();
    const [magicCurrentAddress, setMagicCurrentAddress] = useState();
    const [provider, setProvider] = useState(null);
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const [dataOneCashTxAgencyForCustomer, setDataOneCashTxAgencyForCustomer] = useState(); //state des données de paiement en entente
    const [contractEscrow, setContractEscrow] = useState() //State du smart contrat d'escrow
    

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
                 setWalletRelayer(walletRelay)
                 


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

    }, [provider, magic]);
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

    /**
   * Récupère les informations sur les paiements en attente pour l'utilisateur connecté.
   */
    useEffect(async () => {
        const getOneCashTxAgencyForCustomer= async () => {
            const token = localStorage.getItem('tokenEnCours');

            try {
                
                const result = await fetch(`${API_URL}/api//transaction/find-one-cash-transaction-agency-of-customer`, {
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
                console.log("data=>",data)
                setDataOneCashTxAgencyForCustomer(data)

            } catch (error) {
                // Gérer les erreurs de manière appropriée, par exemple, définir un état d'erreur.
                console.error('Erreur lors de la récupération des données:', error);
            }
        };
            await getOneCashTxAgencyForCustomer();
    }, []);
    // Fin


    

   

    
    // Modal pour annuler le paiement
    const [showDelete, setShowDelete] = useState(false);
    const handleDeleteClose = () => setShowDelete(false);
    const handleDeleteShow = () => setShowDelete(true);
    
    // Modal pour confirmer le paiement
    const [showConfirmWithdrawal, setShowConfirmWithdrawal] = useState(false);
    const handleConfirmPaymentClose = () => setShowConfirmWithdrawal(false);
    const handleConfirmPaymentShow = () => setShowConfirmWithdrawal(true);

    // Modal de paiement sur des sites ecommerces
    const [showWithdrawal, setShowWithdrawal] = useState(false);
    // const handleCloseWithdrawal = () => setShowWithdrawal(false);
    const handleShowWithdrawal = () => setShowWithdrawal(true);


    const delay = 2
    const [secondsRemaining, setSecondsRemaining] = useState(delay * 60 ); //Changer le temps ici aussi en 10 Min
    
    // Fin



   



    // ***************************************************************
        // Transfert de stablecoin vers le smart contrat d'escrow
    // ****************************************************************
    /**
     * Transfère les stablecoins vers le smart contract d'escrow pour effectuer le paiement.
     * Cette fonction interagit avec le smart contract de stablecoin pour approuver et transférer les fonds.
   */
    async function transferToEscrowEshop() {
        setIsLoggingIn(true);

        try {
            if (dataMerchantByIdentifier?.addressEscrow) {
                // Vérifier le solde de magicCurrentAddress
                const magicCurrentBalance = await contractStablecoin.balanceOf(magicCurrentAddress);
                const amountWei = ethers.utils.parseUnits(String(dataOneCashTxAgencyForCustomer?.amount), decimalStablecoin);
                console.log("magicCurrentBalance=>", magicCurrentBalance);
                console.log("amountWei=>", amountWei);

                // Vérifier si magicCurrentAddress a des fonds suffisants
                if (!magicCurrentBalance.gte(amountWei)) {
                    setIsLoggingIn(false);
                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        html: `<p> Fonds insuffisants sur votre compte. <br/> Votre solde est: ${ethers.utils.formatUnits(magicCurrentBalance, decimalStablecoin)}</p>`,
                        showConfirmButton: false,
                        timer: 5000
                    });
                    console.error("Fonds insuffisants sur votre compte.");
                    cancelPayment('solde'); // Appel de la fonction d'annulation de transaction
                    return;
                }

                const dataForm = {
                    spenderAddress: dataMerchantByIdentifier?.addressEscrow,
                    ownerAddress: magicCurrentAddress,
                    amount: amountWei,
                };

                // Estimer le coût en gaz pour l'approbation
                const approveEstimateGas = await contractStablecoin.estimateGas.approveFrom(
                    dataForm?.ownerAddress,
                    dataForm?.spenderAddress,
                    dataForm?.amount
                );

                const executorBalance = await walletRelayer.getBalance();

                // Vérifier si l'exécutant a un solde Ether suffisant pour le gaz d'approbation
                if (!executorBalance.gte(approveEstimateGas)) {
                    setIsLoggingIn(false);
                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        html: `<p> Solde insuffisant pour couvrir les frais de gaz d'approbation.</p>`,
                        showConfirmButton: false,
                        timer: 5000
                    });
                    console.error("Solde insuffisant pour couvrir les frais de gaz d'approbation.");
                    return;
                }

                // Effectuer l'approbation
                try {
                    const gasLimit = approveEstimateGas.add(ethers.BigNumber.from("100000")); // Adding extra gas as a buffer
                    const approveTx = await contractStablecoin.approveFrom(
                        dataForm?.ownerAddress,
                        dataForm?.spenderAddress,
                        dataForm?.amount,
                        { gasLimit }
                    );
                    await approveTx.wait(1);
                } catch (error) {
                    console.error("Erreur lors de l'approbation :", error.message);
                    setIsLoggingIn(false);
                    return;
                }

                // Estimer le coût en gaz pour le dépôt
                const asyncTransferEstimateGas = await contractEscrow.estimateGas.asyncTransferEshop(
                    dataForm?.ownerAddress,
                    dataForm?.amount
                );

                // Vérifier si l'exécutant a un solde Ether suffisant pour le gaz de dépôt
                if (!executorBalance.gte(asyncTransferEstimateGas)) {
                    setIsLoggingIn(false);
                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        html: `<p> Solde insuffisant pour couvrir les frais de gaz d'asyncTransfer.</p>`,
                        showConfirmButton: false,
                        timer: 5000
                    });
                    console.error("Solde insuffisant pour couvrir les frais de gaz d'asyncTransfer.");
                    return;
                }

                // Exécuter le transfert asynchrone vers l'escrow
                try {
                    const asyncTransferTx = await contractEscrow.asyncTransferEshop(dataForm?.ownerAddress, dataForm?.amount);
                    console.log("asyncTransferTx=>", asyncTransferTx);
                    const receipt = await asyncTransferTx.wait(1);

                    const depositEvent = receipt.events.find(event => event.event === 'AsyncTransfer');
                    const depositIndex = depositEvent.args.depositIndex.toNumber(); // Convertir en nombre décimal
                    console.log("depositEvent:", depositEvent);
                    console.log("Deposit Index:", depositIndex);

                    addHistorical(asyncTransferTx.hash, depositIndex) //Appel de la fonction addHistorical pour ajouter les données dans l'historique

                } catch (error) {
                    console.error("Erreur lors du transfert asynchrone :", error);
                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        html: `<p>Erreur lors du transfert asynchrone: ${error.message}</p>`,
                        showConfirmButton: true
                    });
                    setIsLoggingIn(false);
                    return;
                }

                setIsLoggingIn(false);
            } else {
                setIsLoggingIn(false);
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
            setIsLoggingIn(false);
            // Gestion spécifique de l'erreur de solde insuffisant
            if (error.message.includes("Le montant doit etre superieur a 0")) {
                cancelPayment('solde'); // Appel de la fonction d'annulation de transaction
            }
            console.error("Erreur lors de l'exécution de la transaction :", error);
        }
    }

  

    /**
     * Confirme le paiement dans la base de données via une requête API.
   */
    const transferAmount= async(_numberTx) =>{
        setIsLoggingIn(true)

        const dataBody={
            numberTx:_numberTx
        }
        // Obtenir le token en cours
        const token = localStorage.getItem('tokenEnCours');

        const result = await fetch(`${API_URL}/api/eshop/transfer-amount-eshop/${dataOneCashTxAgencyForCustomer?.id}`, {
            method:"PUT",
            body: JSON.stringify(dataBody),

            headers: {
                'Content-Type': 'application/json',
                'x-api-key': `${API_KEY_STABLECOIN}`,
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

        const result = await fetch(`${API_URL}/api/eshop/cancel-payment-eshop/${dataOneCashTxAgencyForCustomer?.id}`, {
            method:"PUT",
            headers: {
                'Content-Type': 'application/json',
                    'x-api-key': `${API_KEY_STABLECOIN}`,
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
    const addHistorical = async (_hash, _numberTx) => {
        setIsLoggingIn(true);

        let nameSender =""
        if (currentUser?.codeTypeProfil=="part") {
            nameSender = currentUser?.lastName + ' ' + currentUser?.firstName
        } else {
            nameSender = currentUser?.entreprise
        }
        
        try {
            
            const dataBody = {
                typeTransaction: "Paiement e-commerce",
                activeName: nameStablecoin,
                activeSymbol: symbolStablecoin,
                nameSender: nameSender,
                nameReceiver: dataOneCashTxAgencyForCustomer?.eshopName,
                emailSender: currentUser?.email,
                emailReceiver: dataOneCashTxAgencyForCustomer?.merchantEmail,
                senderAddress: magicCurrentAddress,
                receiverAddress: dataMerchantByIdentifier?.addressEscrow,
                amount: dataOneCashTxAgencyForCustomer?.amount,
                eshopOrderId:dataOneCashTxAgencyForCustomer?.id,
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
                //Appele de la fonction de confirmation de la transaction dans la base de donnée 
                transferAmount(_numberTx)
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

        console.log("dataOneCashTxAgencyForCustomer=>",dataOneCashTxAgencyForCustomer)
        if (
          dataOneCashTxAgencyForCustomer?.state == "En cours" &&
          dataOneCashTxAgencyForCustomer?.createdAt
        ) {
            const createdAtTimestamp = new Date(dataOneCashTxAgencyForCustomer.createdAt).getTime();
            const nowTimestamp = new Date().getTime();
            const initialTimeDifference = (nowTimestamp - createdAtTimestamp) / 1000; // en secondes
            let remainingTime = delay * 60 - Math.floor(initialTimeDifference); //Changer le temps ici aussi en 10 Min
            setSecondsRemaining(remainingTime);

          if (remainingTime > 0) {
            setShowWithdrawal(true);
    
            const intervalId = setInterval(() => {
              remainingTime -= 1;
              setSecondsRemaining(remainingTime);
    
              if (remainingTime <= 0) {
                setShowWithdrawal(false);
                clearInterval(intervalId);

                // Le temps est écoulé, exécutez la fonction transferAmount
                // cancelPayment('echec');
              }
            }, 1000); // Mettez à jour toutes les secondes
          }
        }
    }, [dataOneCashTxAgencyForCustomer?.id]); // Le tableau de dépendances vide garantit que cela s'exécute une seule fois lors du montage du composant
  
    // Formater le temps en seconde
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < delay ? '0' : ''}${remainingSeconds}`; //Changer le temps ici aussi en 10 Min
      };



    


    //UseEffect pour empêcher l'actualisation de la page pour le modal de confirmation
    useEffect(() => {
        const handleBeforeUnload = (event) => {
            if (showConfirmWithdrawal && !operationCompleted) {
                event.preventDefault();
                event.returnValue = ''; // Pour les anciens navigateurs
            }
        };
    
        window.addEventListener('beforeunload', handleBeforeUnload);
    
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [showConfirmWithdrawal, operationCompleted]);
    

     
    // FONCTION POUR FORMATER LA DATE
    const formatDate = (_updatedAt) =>{
        const maDate = moment(_updatedAt).format('DD/MM/YYYY à HH:mm');
        return  maDate
    }
    //  FIN

    return (
        <>

        {/* ********************************************************************************** */}
            {/* MODAL D'ANNULATION DE RETRAIT'*/}
        {/* ********************************************************************************** */}
        <Modal show={showDelete} className="mt-15 border border-secondary border-5" backdrop="static">
            <Modal.Header closeButton className='bgColorRed'>
            <Modal.Title className="text-white">Annulation de retrait</Modal.Title>
            </Modal.Header>
                {/* <Form role="form"> */}
                    <Modal.Body className='bg-light'>
                        <div className="input-group flex-nowrap">
                            <div className='col-lg-12 col-md-12 row justify-content-center'>
                                <div className='input-group-alternative my-3 '>
                                    <label className="mx-2 mb-3 text-center" htmlFor='address'>
                                        {isLoggingIn === true ?(
                                            <i className='colorRed'>Annulation en cours... </i>
                                        ):(
                                            "Voulez-vous vraiment annuler ce retrait ?"
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
            {/* MODAL DE CONFIRMATION DE RETRAIT'*/}
        {/* ********************************************************************************** */}
        <Modal show={showConfirmWithdrawal} className="mt-30 border border-secondary border-5" backdrop="static">
            <Modal.Header closeButton className='bgColorGreen'>
            <Modal.Title className="text-white">Confirmation du retrait</Modal.Title>
            </Modal.Header>
                {/* <Form role="form"> */}
                    <Modal.Body className='bg-light'>
                        <div className="input-group flex-nowrap">
                            <div className='col-lg-12 col-md-12 row justify-content-center'>
                                <div className='input-group-alternative my-3 '>
                                    <label className="mx-2 mb-3 text-center " htmlFor='address'>
                                        {isLoggingIn === true ?(
                                            <i className='colorGreen'>Confirmation en cours... </i>
                                        ):(
                                            "Voulez-vous vraiment confirmer ce retrait ?"
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
                        <Button className='px-4' type='button' onClick={transferToEscrowEshop}  color="success" disabled={isLoggingIn}>
                            Oui .
                            {isLoggingIn === true ? (<i className="fas fa-spinner fa-spin fa-lg mx-3"></i>) : ("")}
                        </Button>
                    </Modal.Footer>
                {/* </Form> */}
        </Modal>
        {/* *****************************************FIN****************************************** */}

        {/* <Button className="text-white" color="secondary" onClick={handleDeleteClose}> */}


        {/* ********************************************************************************** */}
            {/* MODAL DE VALIDATION DE RETRAIT '*/}
        {/* ********************************************************************************** */}
        <Modal show={showWithdrawal} width='2000' fullscreen={true} >
        {/* <Modal show={showWithdrawal} className="mt-15" onHide={handleCloseWithdrawal}> */}
            <Modal.Header closeButton className='bgColorblue'>
                <Modal.Title className="text-white"> (Temps restant: {formatTime(secondsRemaining)})</Modal.Title>                
            </Modal.Header>
            {/* <Form role="form" onSubmit={hant}> */}
                <Modal.Body>
                    <div className='col-lg-12 col-md-12  row justifPaiements en attentey-content-center'>
                        <div className='col-lg-6 col-md-6 mt-3'>
                            <b>Marchand : </b> <br/> {dataOneCashTxAgencyForCustomer?.nameAgency}
                        </div>

                        <div className='col-lg-6 col-md-6 mt-3'>
                            <b>Nom client : </b> <br/> {dataOneCashTxAgencyForCustomer?.nameCustomer}
                        </div>
                        
                        <div className='col-lg-6 col-md-6 mt-3'>
                            <b>Montant : </b> <br/> {dataOneCashTxAgencyForCustomer?.amount} {symbolStablecoin}
                        </div>

                        <div className='col-lg-6 col-md-6 mt-3'>
                            <b>Frais : </b> <br/> {dataOneCashTxAgencyForCustomer?.fees} {symbolStablecoin}
                        </div>
                        <div className='col-lg-6 col-md-6 mt-3'>
                            <b>Statut: </b> <br/> {dataOneCashTxAgencyForCustomer?.state}
                        </div>
                        {/* <div className='col-lg-6 col-md-6 mt-3'>
                            <b>Email du marchand : </b> <br/> {dataOneCashTxAgencyForCustomer?.merchantEmail}
                        </div> */}
                        {/* <div className='col-lg-6 col-md-6 mt-3'>
                            <b>Email Client : </b> <br/> {dataOneCashTxAgencyForCustomer?.customerEmail}
                        </div> */}
                        
                    </div>
                    <div className='row d-flex'>
                        <div className='col-lg-6 col-md-6 col-sm-6 mt-3'>
                            <Button onClick={handleDeleteShow} disabled={isLoggingIn} className="text-white" color="danger" >
                                Annuler
                            </Button>
                        </div>
                        <div className='col-lg-6 col-md-6 col-sm-6 mt-3 '>
                            {/* {magicCurrentAddress? ( */}
                            <Button className='px-4'  type='button'  color="success" onClick={handleConfirmPaymentShow} disabled={isLoggingIn}>
                                Payer 
                            </Button>
                            {/* ) : ('...')} */}
                        </div>
                    </div>
                </Modal.Body>
                {/* <Modal.Footer>
                    <Button className="text-white" color="danger" onClick={handleCloseWithdrawal}>
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

export default ModalConfirmationRetrait;
