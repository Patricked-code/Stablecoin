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
import ABI_ESCROW_STABLECOIN from "../../../../../components/Contrats/Abi/AbiEscrowStablecoin.json";






const AccueilBoutique = () => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API
     // Variable de l'api key de stablecoin
     const API_KEY_STABLECOIN = process.env.NEXT_PUBLIC_API_KEY_STABLECOIN


     // Pour les smart contrats
     const ADDRESS_CONTRAT_EWARI = process.env.NEXT_PUBLIC_ADDRESS_CONTRAT_EWARI
     const PRIVATE_KEY = process.env.NEXT_PUBLIC_PRIVATE_KEY
     const [currentUser, setCurrentUser] = useState();
     const [magicCurrentAddress, setMagicCurrentAddress] = useState();
     const [provider, setProvider] = useState(null);
     const [isLoggingIn, setIsLoggingIn] = useState(false);

    const [contractStablecoin, setContractStablecoin] = useState();
    const [signer, setSigner] = useState();
    const [walletRelayer, setWalletRelayer] = useState();
    
    const [nameStablecoin, setNameStablecoin] = useState();
    const [symbolStablecoin, setSymbolStablecoin] = useState();
    const [balanceStablecoin, setBalanceStablecoin] = useState();
    const [decimalStablecoin, setDecimalStablecoin] = useState();

    // States d'escrow du commerce directe
    const [contractEscrow, setContractEscrow] = useState()
    const [balanceEscrow, setBalanceEscrow] = useState()

    const [dataRequestUseStablecoinForUser, setDataRequestUseStablecoinForUser] = useState()
    
    // States d'escrow ecommerce
    const [contractEscrowEshop, setContractEscrowEshop]=useState()
    const [balanceEscrowApprovedEshop, setBalanceEscrowApprovedEshop]=useState()
    const [balanceEscrowNoApprovedEshop, setBalanceEscrowNoApprovedEshop]=useState()
    const [dataForUserOfEshop, setDataForUserOfEshop] = useState() //state pour les infos marchand en ligne
    
    
    
    // Modal d'attribution d'un rôle à une adresse
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    // Fin

    // Modal d'attribution d'un rôle à une adresse
    const [showEshop, setShowEshop] = useState(false);
    const handleCloseEshop = () => setShowEshop(false);
    const handleShowEshop = () => setShowEshop(true);
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
                setBalanceStablecoin(formatNumber(balanceStablecoin/10**decimalStablecoin))


                /**
                 * Smart contrat d'escrow en ligne.
                 * @type {string}
                 */
                if (dataRequestUseStablecoinForUser?.addressEscrow) {
                    const contractEscrow = new ethers.Contract(dataRequestUseStablecoinForUser?.addressEscrow, ABI_ESCROW_STABLECOIN?.abi, walletRelay);
                    setContractEscrow(contractEscrow)
                    

                    // Balance de l'escrow apprové du marchand connecté
                    const balanceEscrow = await contractEscrow.getTotalApprovedAmount()
                    setBalanceEscrow(formatNumber(balanceEscrow/10**decimalStablecoin))

                 }



                 
                /**
                 * Smart contrat d'escrow ecommerce.
                 * @type {string}
                 */

                if (dataForUserOfEshop?.addressEscrow) {
                    const contractEscrowEshop = new ethers.Contract(dataForUserOfEshop?.addressEscrow, ABI_ESCROW_STABLECOIN?.abi, walletRelay);
                    setContractEscrowEshop(contractEscrowEshop)
                    
                    // Balance de l'escrow de ecommerce approuvé du marchand connecté
                    const balanceEscrowApprovedEshop = await contractEscrowEshop.getTotalApprovedAmount()
                    setBalanceEscrowApprovedEshop(formatNumber(balanceEscrowApprovedEshop/10**decimalStablecoin))

                    
                    // Balance de l'escrow de ecommerce non approuvé du marchand connecté
                    const balanceEscrowNoApprovedEshop = await contractEscrowEshop.getTotalNoApprovedAmount()
                    setBalanceEscrowNoApprovedEshop(formatNumber(balanceEscrowNoApprovedEshop/10**decimalStablecoin))
                    
                 }

                 
            }
        }
        // Appel de la fonction asynchrone pour obtenir les données lorsqu'il y a des changements dans `provider` ou `magic`.
        fetchData();;

    }, [provider, magic, dataRequestUseStablecoinForUser?.addressEscrow, dataForUserOfEshop?.addressEscrow]);
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

    // Recupérer les données du marchand directe concernant l'escrow de l'utilisateur connecté
    useEffect(async () => {
        const getDataRequestUseStablecoinForUser= async () => {
            const token = localStorage.getItem('tokenEnCours');

            try {
                
                const result = await fetch(`${API_URL}/api/payment-request/find-request-use-stablecoin-of-user`, {
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
                setDataRequestUseStablecoinForUser(data);

            } catch (error) {
                // Gérer les erreurs de manière appropriée, par exemple, définir un état d'erreur.
                console.error('Erreur lors de la récupération des demandes:', error);
            }
        };

        await getDataRequestUseStablecoinForUser();
    }, []);
    // Fin

    // Recupérer les données concernant de l'escrow du marchand en ligne de l'utilisateur connecté
    useEffect(async () => {
        const getDataForUserOfEshop= async () => {
            const token = localStorage.getItem('tokenEnCours');

            try {
                
                const result = await fetch(`${API_URL}/api/apikey/find-request-use-stablecoin-for-eshop-of-user`, {
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
                setDataForUserOfEshop(data);

            } catch (error) {
                // Gérer les erreurs de manière appropriée, par exemple, définir un état d'erreur.
                console.error('Erreur lors de la récupération des demandes:', error);
            }
        };

        await getDataForUserOfEshop();
    }, []);
    // Fin

    // Fonction pour gérer le retrait depuis l'escrow du commerce directe
    const withdrawAllApprovedFunds = async () => {
        setIsLoggingIn(true)

        try {

            // Obtenir le solde de l'exécutant
            const executorBalance = await signer.getBalance();

            // Estimer le coût en gaz pour le retrait
            const withdrawAllApprovedFundEstimateGas = await contractEscrow.estimateGas.withdrawAllApprovedFunds();
            
            if (executorBalance.lt(withdrawAllApprovedFundEstimateGas)) {
                    setIsLoggingIn(false)
                    Swal.fire({
                    position: 'center',
                    icon: 'error',
                    html: `<p> Solde insuffisant pour couvrir les frais de gaz</p>`,
                    showConfirmButton: false,
                    timer: 5000
                });
                console.error("Solde insuffisant pour couvrir les frais de gaz.");
                return
            } 
           
        
            // Appeler la fonction de retrait
            const transactionTx = await contractEscrow.withdrawAllApprovedFunds();
            // Attendre la confirmation de la transaction
            await transactionTx.wait();
            addHistorical(transactionTx?.hash)
        } catch (error) {
            setIsLoggingIn(false)
            // Trie les messages d'erreur
            if (error.message.includes("Aucun montant approuve")) {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    html: `<p> Aucun montant approuvé à retirer</p>`,
                    showConfirmButton: false,
                    timer: 5000
                });
                console.error("Aucun montant approuvé à retirer");
            } else if (error.message.includes("Solde insuffisant dans le contrat")) {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    html: `<p> Solde insuffisant dans le contrat</p>`,
                    showConfirmButton: false,
                    timer: 5000
                });
                console.error("Solde insuffisant dans le contrat");
            } else {
                // Gère les autres erreurs
                console.error("Erreur lors du retrait :", error);
                // Vous pouvez afficher un message générique ou gérer d'autres types d'erreurs ici
            }
            console.error("Erreur lors du retrait :", error);
        }
    };


    // Fonction pour gérer le retrait depuis l'escrow ecommerce 
    const withdrawAllApprovedFundsEshop = async () => {
        setIsLoggingIn(true)

        try {

            // Obtenir le solde de l'exécutant
            const executorBalance = await signer.getBalance();

            // Estimer le coût en gaz pour le retrait
            const withdrawAllApprovedFundEstimateGas = await contractEscrowEshop.estimateGas.withdrawAllApprovedFunds();
            
            if (executorBalance.lt(withdrawAllApprovedFundEstimateGas)) {
                    setIsLoggingIn(false)
                    Swal.fire({
                    position: 'center',
                    icon: 'error',
                    html: `<p> Solde insuffisant pour couvrir les frais de gaz</p>`,
                    showConfirmButton: false,
                    timer: 5000
                });
                console.error("Solde insuffisant pour couvrir les frais de gaz.");
                return
            } 
           
        
            // Appeler la fonction de retrait
            const transactionTx = await contractEscrowEshop.withdrawAllApprovedFunds();
            // Attendre la confirmation de la transaction
            await transactionTx.wait();
            addHistoricalEshop(transactionTx?.hash)
        } catch (error) {
            setIsLoggingIn(false)
            // Trie les messages d'erreur
            if (error.message.includes("Aucun montant approuve")) {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    html: `<p> Aucun montant approuvé à retirer</p>`,
                    showConfirmButton: false,
                    timer: 5000
                });
                console.error("Aucun montant approuvé à retirer");
            } else if (error.message.includes("Solde insuffisant dans le contrat")) {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    html: `<p> Solde insuffisant dans le contrat</p>`,
                    showConfirmButton: false,
                    timer: 5000
                });
                console.error("Solde insuffisant dans le contrat");
            } else {
                // Gère les autres erreurs
                console.error("Erreur lors du retrait :", error);
                // Vous pouvez afficher un message générique ou gérer d'autres types d'erreurs ici
            }
            console.error("Erreur lors du retrait :", error);
        }
    };



     // Fonction d'enregistrement des données du retrait de l'escrow du commerce directe dans l'historique
     const addHistorical = async (_hash) => {
        setIsLoggingIn(true);

        try {
            
            const dataBody = {
                typeTransaction: "Retrait Escrow",
                activeName: nameStablecoin,
                activeSymbol: symbolStablecoin,
                emailReceiver: currentUser?.email,
                senderAddress: dataRequestUseStablecoinForUser?.addressEscrow,
                receiverAddress: magicCurrentAddress,
                amount: balanceEscrow,
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
                    html: `<p> Votre retrait s'est effectué avec succès.</p>`,
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

     // Fonction d'enregistrement des données du retrait de l'escrow ecommerce dans l'historique
     const addHistoricalEshop = async (_hash) => {
        setIsLoggingIn(true);

        try {
            
            const dataBody = {
                typeTransaction: "Retrait Escrow",
                activeName: nameStablecoin,
                activeSymbol: symbolStablecoin,
                emailReceiver: currentUser?.email,
                senderAddress: dataForUserOfEshop?.addressEscrow,
                receiverAddress: magicCurrentAddress,
                amount: balanceEscrowApprovedEshop,
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
                    html: `<p> Votre retrait s'est effectué avec succès.</p>`,
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

      <div className='' >
        <div className=' mx-15'>
            <div className='py-10'>
                <h3 className='text-center'>Ma recette de vente directe</h3>
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

        {/* Les cards */}
            <div className='cryptocurrency-search-box'>
                <div className='row'>

                    <div className='col-lg-6 col-md-6'>
                        <div className='currency-selection '>
                            <div className="mt-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                                <div className='cryptocurrency-slides'>
                                    <div className='single-cryptocurrency-box'>
                                        <div className='d-flex align-items-center'>
                                        <div className='bestseller-coin-image'>
                                            <img src="/images/ecfa/logo/logo_ewari1.jpg" className="rounded-circle"  alt='image' />
                                        </div>
                                        <div className='title pb-0'>
                                            <h3>{nameStablecoin}</h3>
                                            <p>Mon solde de la vente directe non récupéré: <br/><b className='colorRed'>{balanceEscrow}</b> {symbolStablecoin}</p>
                                            <p>Mon solde : <br/> <b className='colorGreen'>{balanceStablecoin}</b> {symbolStablecoin}</p>
                                        </div>
                                        </div>
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='col-lg-6 col-md-6'>
                        <div className='currency-selection text-center'>
                            <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                                <div className='cryptocurrency-slides'>
                                    <div className='single-cryptocurrency-box'>
                                        <div className='d-flex align-items-center'>
                                        {/* <div className='bestseller-coin-image'>
                                            <img src="/images/ecfa/logo/logo_ewari1.jpg" className="rounded-circle"  alt='image' />
                                        </div> */}
                                        <div className='title'>
                                            <h3>Effectuer un retrait vers mon solde </h3>
                                        </div>
                                        </div>
                                        <form >
                                            <div className="form-group mb-0 ">
                                                {/* <label
                                                htmlFor="montant"
                                                className="gr-text-8 fw-bold text-blackish-blue"
                                                >
                                                    Montant à retirer <sup className="text-red">*</sup>
                                                </label> */}
                                                <div className="input-group flex-nowrap">
                                                <input
                                                    className="form-control gr-text-11 border mt-3 bg-white"
                                                    type="number"
                                                    id="montant"
                                                    required
                                                    disabled
                                                    value={balanceEscrow}
                                                />
                                                    <span className="input-group-text gr-text-11  mt-3" id="addon-wrapping">{symbolStablecoin}</span>
                                                </div>
                                            </div><br/>
                                            <Button
                                                block
                                                color="success"
                                                type="button"
                                                className='mt-0'
                                                disabled={balanceEscrow == 0}
                                                onClick={handleShow}
                                            >
                                                Retirer
                                            </Button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                                
                    
                </div>
            </div>

            {/* Les cards pour la recette de vente ecommerce */}
            <div className='cryptocurrency-search-box'>
            <div className='py-10'>
                <h3 className='text-center'>Ma recette de vente sur e-commerce</h3>
            </div>
                <div className='row'>

                    <div className='col-lg-6 col-md-6'>
                        <div className='currency-selection '>
                            <div className="mt-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                                <div className='cryptocurrency-slides'>
                                    <div className='single-cryptocurrency-box'>
                                        <div className='d-flex align-items-center'>
                                        <div className='bestseller-coin-image'>
                                            <img src="/images/ecfa/logo/logo_ewari1.jpg" className="rounded-circle"  alt='image' />
                                        </div>
                                        <div className='title pb-0'>
                                            <h3>{nameStablecoin}</h3>
                                            <p>Mon solde de vente sur e-commerce non récupérable: <br/><b className='colorRed'>{balanceEscrowApprovedEshop}</b> {symbolStablecoin}</p>
                                            <p>Mon solde de vente sur e-commerce récupérable: <br/><b className='colorBlue'>{balanceEscrowNoApprovedEshop}</b> {symbolStablecoin}</p>
                                            {/* <p>Mon solde : <br/> <b className='colorGreen'>{balanceStablecoin}</b> {symbolStablecoin}</p> */}
                                        </div>
                                        </div>
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='col-lg-6 col-md-6'>
                        <div className='currency-selection text-center'>
                            <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                                <div className='cryptocurrency-slides'>
                                    <div className='single-cryptocurrency-box'>
                                        <div className='d-flex align-items-center'>
                                        {/* <div className='bestseller-coin-image'>
                                            <img src="/images/ecfa/logo/logo_ewari1.jpg" className="rounded-circle"  alt='image' />
                                        </div> */}
                                        <div className='title'>
                                            <h3>Effectuer un retrait vers mon solde </h3>
                                        </div>
                                        </div>
                                        <form >
                                            <div className="form-group mb-0 ">
                                                {/* <label
                                                htmlFor="montant"
                                                className="gr-text-8 fw-bold text-blackish-blue"
                                                >
                                                    Montant à retirer <sup className="text-red">*</sup>
                                                </label> */}
                                                <div className="input-group flex-nowrap">
                                                <input
                                                    className="form-control gr-text-11 border mt-3 bg-white"
                                                    type="number"
                                                    id="montant"
                                                    required
                                                    disabled
                                                    value={balanceEscrowApprovedEshop}
                                                />
                                                    <span className="input-group-text gr-text-11  mt-3" id="addon-wrapping">{symbolStablecoin}</span>
                                                </div>
                                            </div><br/>
                                            <Button
                                                block
                                                color="success"
                                                type="button"
                                                className='mt-0'
                                                disabled={balanceEscrowApprovedEshop == 0}
                                                onClick={handleShow}
                                            >
                                                Retirer
                                            </Button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                                
                    
                </div>
            </div>
      </div>


       {/* ********************************************************************************** */}
            {/* MODAL DE RETRAIT ESCROW SUR COMMERCE DIRECTE '*/}
        {/* ********************************************************************************** */}
        <Modal show={show} className="mt-15" onHide={handleClose}>
            <Modal.Header closeButton className='bgColorGreen'>
                <Modal.Title className="text-white" >Validation du retrait</Modal.Title>                
            </Modal.Header>
            {/* <Form role="form" onSubmit={hant}> */}
                <Modal.Body>
                    <div className="input-group flex-nowrap">
                        <div className='col-lg-12 col-md-12 row justify-content-between'>
                            <div className='input-group-alternative my-3 '>
                                Veuillez cliquer sur valider pour effectuer le retrait des <b>{balanceEscrow} {symbolStablecoin}</b> de votre vente vers votre solde
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="text-white" color="danger" onClick={handleClose}>
                        Fermer
                    </Button>
                    <Button  type='button'  color="success" onClick={withdrawAllApprovedFunds} disabled={isLoggingIn}>
                        Valider
                        {isLoggingIn === true ? (<i className="fas fa-spinner fa-spin fa-lg mx-3"></i>) : ("")}

                    </Button>
                </Modal.Footer>
            {/* </Form> */}
        </Modal>
        {/* *****************************************FIN****************************************** */}
            
        
        {/* ********************************************************************************** */}
            {/* MODAL DE RETRAIT SUR ESCROW ECOMMERCE '*/}
        {/* ********************************************************************************** */}
        <Modal show={showEshop} className="mt-15" onHide={handleCloseEshop}>
            <Modal.Header closeButton className='bgColorGreen'>
                <Modal.Title className="text-white" >Validation du retrait</Modal.Title>                
            </Modal.Header>
            {/* <Form role="form" onSubmit={hant}> */}
                <Modal.Body>
                    <div className="input-group flex-nowrap">
                        <div className='col-lg-12 col-md-12 row justify-content-between'>
                            <div className='input-group-alternative my-3 '>
                                Veuillez cliquer sur valider pour effectuer le retrait des <b>{balanceEscrow} {symbolStablecoin}</b> de votre vente vers votre solde
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="text-white" color="danger" onClick={handleCloseEshop}>
                        Fermer
                    </Button>
                    <Button  type='button'  color="success" onClick={withdrawAllApprovedFundsEshop} disabled={isLoggingIn}>
                        Valider
                        {isLoggingIn === true ? (<i className="fas fa-spinner fa-spin fa-lg mx-3"></i>) : ("")}

                    </Button>
                </Modal.Footer>
            {/* </Form> */}
        </Modal>
        {/* *****************************************FIN****************************************** */}
            

    </>
  );
};

export default AccueilBoutique;
