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


// FIN

const GestionPaiementEcommerce = () => {
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
    
   

   
    const [currentSenderAddress, setCurrentSenderAddress] = useState();
    const [contractEscrow, setContractEscrow] = useState()
    
   
    
    

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


    // States
    const [dataForUserOfEshop, setDataForUserOfEshop] = useState() //state pour les infos marchand en ligne
    const [dataAllOrdersOfMerchantByIdentifier, setDataAllOrdersOfMerchantByIdentifier] = useState() //state pour les infos marchand en ligne
  

     // États pour stocker les commandes par statut
     const [paidOrders, setPaidOrders] = useState([]);
     const [confirmedPayments, setConfirmedPayments] = useState([]);
     const [confirmedWithProof, setConfirmedWithProof] = useState([]);
     const [refundRequests, setRefundRequests] = useState([]);
     const [acceptedRefunds, setAcceptedRefunds] = useState([]);
     const [cancelledOrders, setCancelledOrders] = useState([]);
     const [rejectedAndCompletedRefunds, setRejectedAndCompletedRefunds] = useState([]);

     const [orderId, setOrderId] = useState();
     const [dataOneEshopOrderById, setDataOneEshopOrderById] = useState();
     const [dataMerchantByIdentifier, setDataMerchantByIdentifier] = useState();

     
     


     /**
      * État de contrôle pour afficher ou masquer la modal de remboursement.
      * @type {boolean}
      */
    const [showRefund, setShowRefund] = useState(false);
 
    /**
     * Fonction pour fermer de remboursement.
     * @function
     * @returns {void}
     */
    const handleCloseRefund = () => setShowRefund(false);

    /**
     * Fonction pour afficher le modal de remboursement.
     * @function
     * @returns {void}
     */
    const handleShowRefund = () => setShowRefund(true);


    
    /**
    * État de contrôle pour afficher ou masquer la modal du rejet de la demande de remboursement.
    * @type {boolean}
    */
    const [showRejectRequestRefund, setShowRejectRequestRefund] = useState(false);
 
    /**
    * Fonction pour fermer le modal du rejet de la demande de remboursement.
    * @function
    * @returns {void}
    */
    const handleCloseRejectRequestRefund = () => setShowRejectRequestRefund(false);
      
    /**
    * Fonction pour afficher le modal du rejet de la demande de remboursement.
    * @function
    * @returns {void}
    */
    const handleShowRejectRequestRefund = () => setShowRejectRequestRefund(true);



     /**
      * État de contrôle pour afficher ou masquer la modal d'affichage des informations de la commande.
      * @type {boolean}
      */
    const [showInfos, setShowInfos] = useState(false);
 
    /**
     * Fonction pour fermer d'affichage des informations de la commande.
     * @function
     * @returns {void}
     */
    const handleCloseInfos = () => setShowInfos(false);

    /**
     * Fonction pour afficher des informations de la commande.
     * @function
     * @returns {void}
     */
    const handleShowInfos = () => setShowInfos(true);


    
    // POUR L'IMAGE DE PREUVE
    const [pictureProof, setPictureProof] = useState(null);
    const [uploadStatus, setUploadStatus] = useState(null);

    /**
      * État de contrôle pour afficher ou masquer la modal d'ajout de la photo de preuve.
      * @type {boolean}
      */
    const [showPictureProof, setShowPictureProof] = useState(false);
 
    /**
     * Fonction pour fermer du changement de photo.
     * @function
     * @returns {void}
     */
    const handleClosePictureProof = () => setShowPictureProof(false);

    /**
     * Fonction pour afficher du changement de photo.
     * @function
     * @returns {void}
     */
    const handleShowPictureProof = () => setShowPictureProof(true);


    const handleFileChange = (event) => {
        setPictureProof(event.target.files[0]);
    };

    // FONCTION DU CHANGEMENT DE LA PHOTO DE L'AVATAR
    const handleUpdatePictureProof = async (event) => {
        event.preventDefault();
        // setIsLoggingIn(true);
        
        if (!pictureProof) {
        setUploadStatus('Vous devez sélectionner un fichier.');
        return;
        }

        const formData = new FormData();
        formData.append('pictureProof', pictureProof);

        // Obtenir le token en cours
        const token = localStorage.getItem('tokenEnCours');

        try {
        const response = await fetch(`${API_URL}/api/eshop/add-picture-proof-eshop/${orderId}`, {
            method: 'PUT',
            body: formData,
            headers: {
                // 'Content-Type': 'application/json',
                'x-api-key': `${API_KEY_STABLECOIN}`,
                Authorization: `Bearer ${token}`
            }
        });

        const responseData = await response.json();

        if (response.ok) {
            setUploadStatus(responseData.message);
            Swal.fire({
                position: 'center',
                icon: 'success',
                html: `<p>${responseData.message}</p>` ,
                showConfirmButton: false,
                timer: 5000
            })
            setTimeout(() => {
                window.location.reload()
            }, 5000)
        } else {
            console.error('Error updating picture:', responseData.message);
            setIsLoggingIn(false);
            Swal.fire({
                position: 'center',
                icon: 'error',
                html: `<p>Une erreur s'est produite lors de l'ajout de la photo</p>` ,
                showConfirmButton: false,
                timer: 6000
            })
        }
        } catch (error) {
            console.error('Error updating picture:', error);
            setIsLoggingIn(false);
            Swal.fire({
                position: 'center',
                icon: 'error',
                html: `<p>Une erreur s'est produite lors de l'ajout de la photo</p>` ,
                showConfirmButton: false,
                timer: 6000
            })
        }
    };
    //Fin

    // States de tab
    const [toggleState, setToggleState] = useState(1);
    const toggleTab = (index) => {
        setToggleState(index);
    };
    // Fin

    // States de tab des paiements
    const [toggleStatePaiment, setToggleStatePaiment] = useState(1);
    const toggleTabPaiment = (index) => {
        setToggleStatePaiment(index);
    };
    // Fin


    // States de tab des remboursements
    const [toggleStateRefund, setToggleStateRefund] = useState();
    const toggleTabRefund = (index) => {
        setToggleStateRefund(index);
    };
    // Fin

    

 // Obtenir les données (adresse d'escrow) du marchand concerné en fonction de son identifiant
 useEffect(async () => {
    const getDataMerchantByIdentifier= async (_merchantIdentifier) => {
        const token = localStorage.getItem('tokenEnCours');

        try {
            
            const result = await fetch(`${API_URL}/api/apikey/find-one-use-stablecoin-for-eshop-by-merchant-identifier?merchantIdentifier=${_merchantIdentifier}`, {
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
            setDataMerchantByIdentifier(data)

        } catch (error) {
            // Gérer les erreurs de manière appropriée, par exemple, définir un état d'erreur.
            console.error('Erreur lors de la récupération des données:', error);
        }
    };
    if (dataOneEshopOrderById?.merchantIdentifier) {
        await getDataMerchantByIdentifier(dataOneEshopOrderById?.merchantIdentifier);
    }
}, [dataOneEshopOrderById?.merchantIdentifier]);
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

                /**
                * Smart contrat du factory d'escrow.
                * @type {string}
                */
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

    // Obtenir les données d'une commande par son identifiant
    useEffect(async () => {
        const getOneEshopOrderById= async () => {
            const token = localStorage.getItem('tokenEnCours');

            try {
                
                const result = await fetch(`${API_URL}/api/eshop/find-one-order-eshop/${orderId}`, {
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
                setDataOneEshopOrderById(data);
                console.log("setDataOneEshopOrderById=>", data)

            } catch (error) {
                // Gérer les erreurs de manière appropriée, par exemple, définir un état d'erreur.
                console.error('Erreur lors de la récupération des demandes:', error);
            }
        };

        await getOneEshopOrderById();
    }, [orderId]);
    // Fin

   

    
    // Modal pour révoquer un rôle
    const [showDelete, setShowDelete] = useState(false);
    const handleDeleteClose = () => setShowDelete(false);
    const handleDeleteShow = () => setShowDelete(true);

    // Modal d'attribution d'un rôle à une adresse
    const [showPayer, setShowPayer] = useState(false);
    const handleClosePayer = () => setShowPayer(false);
    const handleShowPayer = () => setShowPayer(true);
    // Fin

    // Recupérer les données concernant de l'escrow du marchand en ligne de l'utilisateur connecté
    useEffect( () => {
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

        getDataForUserOfEshop();
    }, []);
    // Fin


    // Obtenir toutes les transactions effectuées sur les sites ecommerces
    useEffect(() => {
        const fetchOrders = async () => {
            const token = localStorage.getItem('tokenEnCours');
            try {
                const response = await fetch(`${API_URL}/api/eshop/find-all-order-eshop`, {
                    headers: {
                        'Content-Type': 'application/json',
                    'x-api-key': `${API_KEY_STABLECOIN}`,
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch orders');
                }
                const orders = await response.json();
                // Filtrer et stocker les commandes par statut
                setPaidOrders(orders.filter(order => order.status === 'Paiement effectué'));
                // setConfirmedPayments(orders.filter(order => order.status === 'Paiement confirmé'));
                // Modifier le filtre pour inclure condition sur pictureProof vide
                setConfirmedPayments(orders.filter(order => order.status === 'Paiement confirmé' && !order.pictureProof));

                // Ajouter un nouveau filtre pour orders avec pictureProof non vide
                const confirmedWithProof = orders.filter(order => order.status === 'Paiement confirmé' && order.pictureProof);
                setConfirmedWithProof(confirmedWithProof);

                setRefundRequests(orders.filter(order => order.status === 'Demande de remboursement'));
                setAcceptedRefunds(orders.filter(order => order.status === 'Demande de remboursement acceptée'));
                  
                // Combinez les commandes de remboursements rejetés et effectués
                const rejectedAndCompletedRefunds = orders.filter(order => order.status === 'Demande de remboursement rejetée' || order.status === 'Remboursement effectué');
                setRejectedAndCompletedRefunds(rejectedAndCompletedRefunds); // Ajout de cet état
  
                setCancelledOrders(orders.filter(order => order.status === 'Paiement échoué'));
             
              
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, [dataForUserOfEshop?.merchantIdentifier]);
    // Fin

    // ********************FONCTION DU SMART CONTRAT**********
    // Fonction pour rembourser le client coté smart contrat
    async function processRefundContrat() {
        setIsLoggingIn(true);
    
        const dataForm = {
            contributor: magicCurrentAddress,
            depositIndex: dataOneEshopOrderById?.numberTx // Assurez-vous que numberTx a une valeur valide
        };
    
    
        try {
           
            // Vérifier si l'objet et la méthode existent
            if (!contractEscrow || !contractEscrow.estimateGas || !contractEscrow.estimateGas.refund) {
                throw new Error("Le contrat escrow ou la méthode estimateGas.refund est indéfini.");
            }

            // Vérifier si l'exécutant a un solde suffisant pour le gaz du remboursement
            const refundEstimateGas = await contractEscrow.estimateGas.refund(dataForm?.contributor, dataForm?.depositIndex);
            const executorBalanceAfterTransfer = await walletRelayer.getBalance();
            
    
            if (!executorBalanceAfterTransfer.gte(refundEstimateGas)) {
                setIsLoggingIn(false);
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    html: `<p>Solde insuffisant pour couvrir les frais de gaz du remboursement.</p>`,
                    showConfirmButton: false,
                    timer: 5000
                });
                console.error("Solde insuffisant pour couvrir les frais de gaz du remboursement.");
                return;
            }
    
            // Fonction de remboursement
            try {
                const gasLimit = refundEstimateGas.add(ethers.BigNumber.from("100000")); // Adding extra gas as a buffer
                const refundTx = await contractEscrow.refund(dataForm?.contributor, dataForm?.depositIndex, { gasLimit });
                const receipt = await refundTx.wait(1);
    
                refundDb(); // Appel de la fonction de confirmation du remboursement dans la base de données
                setIsLoggingIn(false);
            } catch (error) {
                // Vérifier si l'erreur contient des messages spécifiques
                if (error.message.includes("Index de depot invalide")) {
                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        html: `<p>Index de dépôt invalide. Veuillez vérifier l'index du dépôt et réessayer.</p>`,
                        showConfirmButton: true
                    });
                    console.error("Erreur lors du remboursement : Index de dépôt invalide");
                } else if (error.message.includes("Aucune demande de remboursement en attente pour ce depot.")) {
                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        html: `<p>Aucune demande de remboursement en attente pour ce dépôt.</p>`,
                        showConfirmButton: true
                    });
                    console.error("Aucune demande de remboursement en attente pour ce dépôt");
                } else {
                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        html: `<p>Erreur lors du remboursement</p>`,
                        showConfirmButton: true
                    });
                    console.error("Erreur lors du remboursement :", error);
                }
                setIsLoggingIn(false);
            }
        } catch (error) {
            setIsLoggingIn(false);
            console.error("Erreur lors de l'exécution de la transaction :", error);
            Swal.fire({
                position: 'center',
                icon: 'error',
                html: `<p>Erreur lors de l'exécution de la transaction</p>`,
                showConfirmButton: true
            });
        }
    }

    // Fonction pour rejeter la demande de remboursement du client coté smart contrat
    async function revokeRefundRequest() {
        setIsLoggingIn(true);
    
        const dataForm = {
            contributor: magicCurrentAddress,
            depositIndex: dataOneEshopOrderById?.numberTx // Assurez-vous que numberTx a une valeur valide
        };
    
    
        try {
            // Vérifier si l'objet et la méthode existent
            if (!contractEscrow || !contractEscrow.estimateGas || !contractEscrow.estimateGas.revokeRefundRequest) {
                throw new Error("Le contrat escrow ou la méthode estimateGas.refund est indéfini.");
            }
            
    
            // Vérifier si l'exécutant a un solde suffisant pour le gaz du remboursement
            const revokeRefundRequestEstimateGas = await contractEscrow.estimateGas.revokeRefundRequest(dataForm?.contributor, dataForm?.depositIndex);
            const executorBalanceAfterTransfer = await walletRelayer.getBalance();
            
    
            if (!executorBalanceAfterTransfer.gte(revokeRefundRequestEstimateGas)) {
                setIsLoggingIn(false);
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    html: `<p>Solde insuffisant pour couvrir les frais de gaz du rejet de la demande de remboursement.</p>`,
                    showConfirmButton: false,
                    timer: 5000
                });
                console.error("Solde insuffisant pour couvrir les frais de gaz du rejet de la demande de remboursement.");
                return;
            }
    
            // Fonction de remboursement
            try {
                const gasLimit = revokeRefundRequestEstimateGas.add(ethers.BigNumber.from("100000")); // Adding extra gas as a buffer
                const revokeRefundRequestTx = await contractEscrow.revokeRefundRequest(dataForm?.contributor, dataForm?.depositIndex, { gasLimit });
                const receipt = await revokeRefundRequestTx.wait(1);
                rejectRequestRefundDb(); // Appel de la fonction du rejet du remboursement du client dans la base de données
                setIsLoggingIn(false);
            } catch (error) {
                // Vérifier si l'erreur contient des messages spécifiques
                if (error.message.includes("Index de depot invalide")) {
                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        html: `<p>Index de dépôt invalide. Veuillez vérifier l'index du dépôt et réessayer.</p>`,
                        showConfirmButton: true
                    });
                    console.error("Erreur lors du remboursement : Index de dépôt invalide");
                } else if (error.message.includes("Aucune demande de remboursement active a revoquer")) {
                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        html: `<p>Aucune demande de remboursement active à revoquer.</p>`,
                        showConfirmButton: true
                    });
                    console.error("Aucune demande de remboursement active a revoquer");
                } else {
                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        html: `<p>Erreur lors du rejet de la demande de remboursement.</p>`,
                        showConfirmButton: true
                    });
                    console.error("Erreur lors du remboursement :", error);
                }
                setIsLoggingIn(false);
            }
        } catch (error) {
            setIsLoggingIn(false);
            console.error("Erreur lors de l'exécution de la transaction :", error);
            Swal.fire({
                position: 'center',
                icon: 'error',
                html: `<p>Erreur lors de l'exécution de la transaction</p>`,
                showConfirmButton: true
            });
        }
    }
    






    // FONCTION POUR  REMBOURSEMENT DANS LA BASE DE DONNEE 
    const refundDb = async() =>{
        setIsLoggingIn(true)

        // Obtenir le token en cours
        const token = localStorage.getItem('tokenEnCours');

        const result = await fetch(`${API_URL}/api/eshop/refund-payment-eshop/${orderId}`, {
            method:"PUT",
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': `${API_KEY_STABLECOIN}`,
                Authorization:  `Bearer ${token}`
            }
        })
        .then(res=>{
        const data =  res.json();
            if (res.status==200) {
               Swal.fire({
                position: 'center',
                icon: 'success',
                html: `<p> Vous avez remboursé le client avec succès.</p>`,
                showConfirmButton: false,
                timer: 5000
            });
            //    Actualiser après l'affichage 
            setTimeout(() => {
                window.location.reload()
            }, 5000) 
            // Router.push("/paiements/paiements-ecommerce-attente/");
            
            // Fin
            }else{
            setIsLoggingIn(false)
        }
        })
        .catch(error => {
        setIsLoggingIn(false)

        //handle error
        console.log(error);

        });
    }
    // FIN

    // FONCTION POUR REJETER LA DEMANDE DE REMBOURSEMENT DANS LA BASE DE DONNEE 
    const rejectRequestRefundDb = async() =>{
        setIsLoggingIn(true)

        // Obtenir le token en cours
        const token = localStorage.getItem('tokenEnCours');

        const result = await fetch(`${API_URL}/api/eshop/rejection-refund-payment-eshop/${orderId}`, {
            method:"PUT",
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': `${API_KEY_STABLECOIN}`,
                Authorization:  `Bearer ${token}`
            }
        })
        .then(res=>{
        const data =  res.json();
            if (res.status==200) {
               Swal.fire({
                position: 'center',
                icon: 'success',
                html: `<p> Vous avez rejeté la demande de remboursement du client avec succès.</p>`,
                showConfirmButton: false,
                timer: 5000
            });
            //    Actualiser après l'affichage 
            setTimeout(() => {
                window.location.reload()
            }, 5000) 
            // Router.push("/paiements/paiements-ecommerce-attente/");
            
            // Fin
            }else{
            setIsLoggingIn(false)
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
        {/* {magicCurrentAddress?(  */}
            <>
                <div className='' >
                    <div className=' mx-15'>
                        <div className='py-10'>
                            <h1 className='text-center'>Gestion de paiements E-commerce</h1>
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


                    {/************L'entête des tabs Paiements et Remboursement*********/}
                    <div className="bloc-tabs-utilite ">
                        <button
                            className={toggleState === 1 ? "tabs active-tabs gr-text-8 text-color-opacity " : "tabs gr-text-8 text-color-opacity"}
                            onClick={()=>setToggleStateRefund(0)}
                        >
                            <div onClick={() => toggleTab(1)} >
                                <span className='colorBlue'>Paiements</span>
                            </div>
                        </button>

                        <button
                            className={toggleState === 2 ? "tabs active-tabs gr-text-8 text-color-opacity" : "tabs gr-text-8 text-color-opacity"}
                            onClick={()=>setToggleStatePaiment(0)}
                        >
                            <div onClick={() => toggleTab(2)} >
                                <span className='colorRed' >Remboursements</span>
                            </div>
                        </button>
                    </div>
                    {/* Fin L'entête des tabs Paiements et Remboursement */}




                            
                            
                    {/************* Le corps de tab des paiements***************/}
                    <div className="content-tabs">
                        <div
                            className={toggleState === 1 ? "content  active-content" : "content"}
                        >


                            {/******************L'entête des tabs de Paiements ***********/}
                            <div className="bloc-tabs-utilite ">
                                <button
                                    className={toggleStatePaiment === 1 ? "tabs active-tabs gr-text-8 text-color-opacity" : "tabs gr-text-8 text-color-opacity"}
                                    onClick={() => toggleTabPaiment(1)}
                                >
                                    <span className=''>Paiements effectués</span>
                                </button>

                                <button
                                    className={toggleStatePaiment === 2 ? "tabs active-tabs gr-text-8 text-color-opacity" : "tabs gr-text-8 text-color-opacity"}
                                    onClick={() => toggleTabPaiment(2)}
                                >
                                    <span className=''>Paiements confirmés </span>
                                </button>

                                <button
                                    className={toggleStatePaiment === 3 ? "tabs active-tabs gr-text-8 text-color-opacity" : "tabs gr-text-8 text-color-opacity"}
                                    onClick={() => toggleTabPaiment(3)}
                                >
                                    <span className=''>Commandes livrées </span>
                                </button>

                                <button
                                    className={toggleStatePaiment === 4 ? "tabs active-tabs gr-text-8 text-color-opacity" : "tabs gr-text-8 text-color-opacity"}
                                    onClick={() => toggleTabPaiment(4)}
                                >
                                    <span className=''>Commandes annulées </span>
                                </button>
                            </div>
                            {/* FIN L'entête des tabs de Paiements*/}


                        </div>
                    </div>
                    {/* Fin Le corps de tab des paiements */}





                    
                    {/* ***************************************************** */}
                        {/* LE CONTENU QUI CONTIENT LES DIFFERENTES PARTIES DE PAIEMENT */}
                    {/* ********************************************************* */}

                    {/************* Le corps de tab des Paiements effectués***************/}
                    <div className="content-tabs">
                        <div
                            className={toggleStatePaiment === 1 ? "content  active-content" : "content"}
                        >
                            <div className='cryptocurrency-search-box'>
                                <div className='row'>
                                    <div className='col-lg-12 col-md-12'>
                                        <div className='currency-selection'>
                                            <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                                                <div className='col-lg-12 col-md-12 row justify-content-between'>
                                                    {!paidOrders?.length==0?(
                                                        <Table
                                                            aria-label="Example table with static content"
                                                            css={{
                                                                height: "auto",
                                                                minWidth: "100%",
                                                            }}
                                                        >
                                                            <Table.Header>
                                                                <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Boutique</p></Table.Column>
                                                                <Table.Column><p className="gr-text-8 pt-3 pb-0">Numéro commande</p></Table.Column>
                                                                <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Montant</p></Table.Column>
                                                                <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Date</p></Table.Column>
                                                                <Table.Column><p className="gr-text-8 pt-3 pb-0">Infos</p></Table.Column>
                                                            </Table.Header>

                                                            <Table.Body>
                                                                {paidOrders?.map((data) => (
                                                                    <Table.Row key={data?.id}>
                                                                        <Table.Cell ><small className=" py-0 ">{displayLimitedContent(data?.eshopName,30,"characters")}</small></Table.Cell>
                                                                        <Table.Cell ><small className=" py-0 "> {data?.orderNumber}</small></Table.Cell>
                                                                        
                                                                        <Table.Cell ><small className=" py-0 "> {data?.amount}</small></Table.Cell>
                                                                        <Table.Cell ><small className=" py-0 "> {formatDate(data?.createdAt)}</small></Table.Cell>
                                                                        <Table.Cell>
                                                                            <div className="d-flex py-0 ">
                                                                                <p className="">
                                                                                    <button onClick={()=>setOrderId(data?.id)} className="py-0  btn btn-primary">
                                                                                        <div onClick={handleShowInfos}>
                                                                                            Détails
                                                                                        </div>
                                                                                    </button>
                                                                                </p>
                                                                            </div>
                                                                        </Table.Cell>
                                                                    </Table.Row >
                                                                ))}
                                                            </Table.Body>
                                                            {paidOrders?.length>10 ? (
                                                                <Table.Pagination
                                                                    shadow
                                                                    noMargin
                                                                    align="center"
                                                                    rowsPerPage={10}
                                                                    onPageChange={(page) => console.log({ page })}
                                                                />
                                                            ) : ("")}
                                                        </Table>
                                                    ):(
                                                        <div className="text-center my-5">
                                                            Aucun paiement effectué
                                                        </div>
                                                    )} 
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* ***************************FIN******************************* */}


                    {/************* Le corps de tab des Paiements effectués***************/}
                    <div className="content-tabs">
                        <div
                            className={toggleStatePaiment === 2 ? "content  active-content" : "content"}
                        >

                            <div className='cryptocurrency-search-box'>
                                <div className='row'>
                                    <div className='col-lg-12 col-md-12'>
                                        <div className='currency-selection'>
                                            <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                                                <div className='col-lg-12 col-md-12 row justify-content-between'>
                                                    {!confirmedPayments?.length==0?(
                                                        <Table
                                                            aria-label="Example table with static content"
                                                            css={{
                                                                height: "auto",
                                                                minWidth: "100%",
                                                            }}
                                                        >
                                                            <Table.Header>
                                                                <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Boutique</p></Table.Column>
                                                                <Table.Column><p className="gr-text-8 pt-3 pb-0">Numéro commande</p></Table.Column>
                                                                <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Montant</p></Table.Column>
                                                                <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Date</p></Table.Column>
                                                                <Table.Column><p className="gr-text-8 pt-3 pb-0">Infos</p></Table.Column>
                                                            </Table.Header>

                                                            <Table.Body>
                                                                {confirmedPayments?.map((data) => (
                                                                    <Table.Row key={data?.id}>
                                                                        <Table.Cell ><small className=" py-0 ">{displayLimitedContent(data?.eshopName,30,"characters")}</small></Table.Cell>
                                                                        <Table.Cell ><small className=" py-0 "> {data?.orderNumber}</small></Table.Cell>
                                                                        
                                                                        <Table.Cell ><small className=" py-0 "> {data?.amount}</small></Table.Cell>
                                                                        <Table.Cell ><small className=" py-0 "> {formatDate(data?.createdAt)}</small></Table.Cell>
                                                                        <Table.Cell>
                                                                            <div className="d-flex py-0 ">
                                                                                <p className="">
                                                                                    <button onClick={()=>setOrderId(data?.id)} className="py-0  btn btn-primary">
                                                                                        <div onClick={handleShowInfos}>
                                                                                            Détails
                                                                                        </div>
                                                                                    </button>
                                                                                </p>
                                                                            </div>
                                                                        </Table.Cell>
                                                                    </Table.Row >
                                                                ))}
                                                            </Table.Body>
                                                            {confirmedPayments?.length>10 ? (
                                                                <Table.Pagination
                                                                    shadow
                                                                    noMargin
                                                                    align="center"
                                                                    rowsPerPage={10}
                                                                    onPageChange={(page) => console.log({ page })}
                                                                />
                                                            ) : ("")}
                                                        </Table>
                                                    ):(
                                                        <div className="text-center my-5">
                                                            Aucun paiement confirmé
                                                        </div>
                                                    )} 
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* ***************************FIN******************************* */}

                    {/************* Le corps de tab des Paiements effectués***************/}
                    <div className="content-tabs">
                        <div
                            className={toggleStatePaiment === 3 ? "content  active-content" : "content"}
                        >

                            <div className='cryptocurrency-search-box'>
                                <div className='row'>
                                    <div className='col-lg-12 col-md-12'>
                                        <div className='currency-selection'>
                                            <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                                                <div className='col-lg-12 col-md-12 row justify-content-between'>
                                                    {!confirmedWithProof?.length==0?(
                                                        <Table
                                                            aria-label="Example table with static content"
                                                            css={{
                                                                height: "auto",
                                                                minWidth: "100%",
                                                            }}
                                                        >
                                                            <Table.Header>
                                                                <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Boutique</p></Table.Column>
                                                                <Table.Column><p className="gr-text-8 pt-3 pb-0">Numéro commande</p></Table.Column>
                                                                <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Montant</p></Table.Column>
                                                                <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Date</p></Table.Column>
                                                                <Table.Column><p className="gr-text-8 pt-3 pb-0">Infos</p></Table.Column>
                                                                <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Preuve</p></Table.Column>
                                                            </Table.Header>

                                                            <Table.Body>
                                                                {confirmedWithProof?.map((data) => (
                                                                    <Table.Row key={data?.id}>
                                                                        <Table.Cell ><small className=" py-0 ">{displayLimitedContent(data?.eshopName,30,"characters")}</small></Table.Cell>
                                                                        <Table.Cell ><small className=" py-0 "> {data?.orderNumber}</small></Table.Cell>
                                                                        
                                                                        <Table.Cell ><small className=" py-0 "> {data?.amount}</small></Table.Cell>
                                                                        <Table.Cell ><small className=" py-0 "> {formatDate(data?.updateAt)}</small></Table.Cell>
                                                                        <Table.Cell>
                                                                            <div className="d-flex py-0 ">
                                                                                <p className="">
                                                                                    <button onClick={()=>setOrderId(data?.id)} className="py-0 px-4 btn btn-primary">
                                                                                        <div onClick={handleShowInfos}>
                                                                                            Détails
                                                                                        </div>
                                                                                    </button>
                                                                                </p>
                                                                            </div>
                                                                        </Table.Cell>
                                                                        <Table.Cell>
                                                                            <div className="d-flex py-0 ">
                                                                                <p className="">
                                                                                    <a 
                                                                                        href={`${API_URL}/${data?.pictureProof}`} 
                                                                                        download
                                                                                        target="_blank"
                                                                                    >
                                                                                        <button onClick={()=>setOrderId(data?.id)} className="py-0  btn btn-success">
                                                                                            Voir preuve          
                                                                                        </button>  
                                                                                    </a>
                                                                                </p>
                                                                            </div>
                                                                        </Table.Cell>
                                                                    </Table.Row >
                                                                ))}
                                                            </Table.Body>
                                                            {confirmedWithProof?.length>10 ? (
                                                                <Table.Pagination
                                                                    shadow
                                                                    noMargin
                                                                    align="center"
                                                                    rowsPerPage={10}
                                                                    onPageChange={(page) => console.log({ page })}
                                                                />
                                                            ) : ("")}
                                                        </Table>
                                                    ):(
                                                        <div className="text-center my-5">
                                                            Aucun paiement confirmé avec preuve
                                                        </div>
                                                    )} 
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* ***************************FIN******************************* */}

                    {/************* Le corps de tab des commande annulés***************/}
                    <div className="content-tabs">
                        <div
                            className={toggleStatePaiment === 4 ? "content  active-content" : "content"}
                        >

                            <div className='cryptocurrency-search-box'>
                                <div className='row'>
                                    <div className='col-lg-12 col-md-12'>
                                        <div className='currency-selection'>
                                            <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                                                <div className='col-lg-12 col-md-12 row justify-content-between'>
                                                    {!cancelledOrders?.length==0?(
                                                        <Table
                                                            aria-label="Example table with static content"
                                                            css={{
                                                                height: "auto",
                                                                minWidth: "100%",
                                                            }}
                                                        >
                                                            <Table.Header>
                                                                <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Boutique</p></Table.Column>
                                                                <Table.Column><p className="gr-text-8 pt-3 pb-0">Numéro commande</p></Table.Column>
                                                                <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Montant</p></Table.Column>
                                                                <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Date</p></Table.Column>
                                                                <Table.Column><p className="gr-text-8 pt-3 pb-0">Infos</p></Table.Column>
                                                            </Table.Header>

                                                            <Table.Body>
                                                                {cancelledOrders?.map((data) => (
                                                                    <Table.Row key={data?.id}>
                                                                        <Table.Cell ><small className=" py-0 ">{displayLimitedContent(data?.eshopName,30,"characters")}</small></Table.Cell>
                                                                        <Table.Cell ><small className=" py-0 "> {data?.orderNumber}</small></Table.Cell>
                                                                        
                                                                        <Table.Cell ><small className=" py-0 "> {data?.amount}</small></Table.Cell>
                                                                        <Table.Cell ><small className=" py-0 "> {formatDate(data?.createdAt)}</small></Table.Cell>
                                                                        <Table.Cell>
                                                                            <div className="d-flex py-0 ">
                                                                                <p className="">
                                                                                    <button onClick={()=>setOrderId(data?.id)} className="py-0  btn btn-primary">
                                                                                        <div onClick={handleShowInfos}>
                                                                                            Détails
                                                                                        </div>
                                                                                    </button>
                                                                                </p>
                                                                            </div>
                                                                        </Table.Cell>
                                                                    </Table.Row >
                                                                ))}
                                                            </Table.Body>
                                                            {cancelledOrders?.length>10 ? (
                                                                <Table.Pagination
                                                                    shadow
                                                                    noMargin
                                                                    align="center"
                                                                    rowsPerPage={10}
                                                                    onPageChange={(page) => console.log({ page })}
                                                                />
                                                            ) : ("")}
                                                        </Table>
                                                    ):(
                                                        <div className="text-center my-5">
                                                            Aucune commande annulée
                                                        </div>
                                                    )} 
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ***************************FIN******************************* */}











                    {/************* Le corps de tab des remboursements***************/}
                    <div className="content-tabs">
                        <div
                            className={toggleState === 2 ? "content  active-content" : "content"}
                        >

                            {/******************L'entête des tabs de remboursement ***********/}
                            <div className="bloc-tabs-utilite ">
                            <button
                                    className={toggleStateRefund === 1 ? "tabs active-tabs  gr-text-8 text-color-opacity" : "tabs  gr-text-8 text-color-opacity"}
                                    onClick={() => toggleTabRefund(1)}
                                >
                                    <span className=''>Remboursements demandés</span>
                                </button>

                                {/* <button
                                    className={toggleStateRefund === 2 ? "tabs active-tabs  gr-text-8 text-color-opacity" : "tabs  gr-text-8 text-color-opacity"}
                                    onClick={() => toggleTabRefund(2)}
                                    
                                >
                                    <span className=''>Remboursements Acceptés</span>
                                </button> */}

                                <button
                                    className={toggleStateRefund === 3 ? "tabs active-tabs  gr-text-8 text-color-opacity" : "tabs  gr-text-8 text-color-opacity"}
                                    onClick={() => toggleTabRefund(3)}
                                    
                                >
                                    <span className=''>Historique remboursement</span>
                                </button>
                               
                            </div>
                            {/* FIN L'entête des tabs de remboursement*/}
                        </div>
                    </div>
                    {/* Fin Le corps de tab des remboursement */}


                     {/* *********************************************************************** */}
                        {/* LE CONTENU QUI CONTIENT LES DIFFERENTES PARTIES DE REMBOURSEMENT */}
                    {/* *************************************************************************** */}

                    {/************* Le corps de tab des Demandes de remboursement***************/}
                    <div className="content-tabs">
                        <div
                            className={toggleStateRefund === 1 ? "content  active-content" : "content"}
                        >
                            <div className='cryptocurrency-search-box'>
                                <div className='row'>
                                    <div className='col-lg-12 col-md-12'>
                                        <div className='currency-selection'>
                                            <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                                                <div className='col-lg-12 col-md-12 row justify-content-between'>
                                                    {!refundRequests?.length==0?(
                                                        <Table
                                                            aria-label="Example table with static content"
                                                            css={{
                                                                height: "auto",
                                                                minWidth: "100%",
                                                            }}
                                                        >
                                                            <Table.Header>
                                                                <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Boutique</p></Table.Column>
                                                                <Table.Column><p className="gr-text-8 pt-3 pb-0">Numéro commande</p></Table.Column>
                                                                <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Montant</p></Table.Column>
                                                                <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Date</p></Table.Column>
                                                                <Table.Column><p className="gr-text-8 pt-3 pb-0">Infos</p></Table.Column>
                                                                <Table.Column><p className="gr-text-8 pt-3 pb-0 text-center">Actions</p></Table.Column>

                                                            </Table.Header>

                                                            <Table.Body>
                                                                {refundRequests?.map((data) => (
                                                                    <Table.Row key={data?.id}>
                                                                        <Table.Cell ><small className=" py-0 ">{displayLimitedContent(data?.eshopName,30,"characters")}</small></Table.Cell>
                                                                        <Table.Cell ><small className=" py-0 "> {data?.orderNumber}</small></Table.Cell>
                                                                        
                                                                        <Table.Cell ><small className=" py-0 "> {data?.amount}</small></Table.Cell>
                                                                        <Table.Cell ><small className=" py-0 "> {formatDate(data?.createdAt)}</small></Table.Cell>
                                                                        <Table.Cell>
                                                                            <div className="d-flex py-0 ">
                                                                                <p className="">
                                                                                    <button onClick={()=>setOrderId(data?.id)} className="py-0 px-4 btn btn-primary">
                                                                                        <div onClick={handleShowInfos}>
                                                                                            Détails
                                                                                        </div>
                                                                                    </button>
                                                                                </p>
                                                                            </div>
                                                                        </Table.Cell>
                                                                        <Table.Cell>
                                                                            <div className="d-flex py-0 mt-3">
                                                                                <p className="text-center">
                                                                                    <button onClick={()=>setOrderId(data?.id)} className="py-0 mx-2 btn btn-success">
                                                                                        <div onClick={handleShowRefund}>
                                                                                            Rembourser
                                                                                        </div>
                                                                                    </button>
                                                                                </p>
                                                                                <p className="text-center">
                                                                                    <button onClick={()=>setOrderId(data?.id)} className="py-0 px-4 mx-2 btn btn-danger">
                                                                                        <div onClick={handleShowRejectRequestRefund}>
                                                                                            Rejeter
                                                                                        </div>
                                                                                    </button>
                                                                                </p>
                                                                            </div>
                                                                        </Table.Cell>
                                                                    
                                                                    </Table.Row >
                                                                ))}
                                                            </Table.Body>
                                                            {refundRequests?.length>10 ? (
                                                                <Table.Pagination
                                                                    shadow
                                                                    noMargin
                                                                    align="center"
                                                                    rowsPerPage={10}
                                                                    onPageChange={(page) => console.log({ page })}
                                                                />
                                                            ) : ("")}
                                                        </Table>
                                                    ):(
                                                        <div className="text-center my-5">
                                                            Aucune demande de remboursement
                                                        </div>
                                                    )} 
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* ***************************FIN******************************* */}


                    
                     {/************* Le corps de tab des Demandes de remboursement accepter***************/}
                     <div className="content-tabs">
                        <div
                            className={toggleStateRefund === 2 ? "content  active-content" : "content"}
                        >
                            <div className='cryptocurrency-search-box'>
                                <div className='row'>
                                    <div className='col-lg-12 col-md-12'>
                                        <div className='currency-selection'>
                                            <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                                                <div className='col-lg-12 col-md-12 row justify-content-between'>
                                                    {!acceptedRefunds?.length==0?(
                                                        <Table
                                                            aria-label="Example table with static content"
                                                            css={{
                                                                height: "auto",
                                                                minWidth: "100%",
                                                            }}
                                                        >
                                                            <Table.Header>
                                                                <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Boutique</p></Table.Column>
                                                                <Table.Column><p className="gr-text-8 pt-3 pb-0">Numéro commande</p></Table.Column>
                                                                <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Montant</p></Table.Column>
                                                                <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Date</p></Table.Column>
                                                                <Table.Column><p className="gr-text-8 pt-3 pb-0">Infos</p></Table.Column>
                                                            </Table.Header>

                                                            <Table.Body>
                                                                {acceptedRefunds?.map((data) => (
                                                                    <Table.Row key={data?.id}>
                                                                        <Table.Cell ><small className=" py-0 ">{displayLimitedContent(data?.eshopName,30,"characters")}</small></Table.Cell>
                                                                        <Table.Cell ><small className=" py-0 "> {data?.orderNumber}</small></Table.Cell>
                                                                        
                                                                        <Table.Cell ><small className=" py-0 "> {data?.amount}</small></Table.Cell>
                                                                        <Table.Cell ><small className=" py-0 "> {formatDate(data?.createdAt)}</small></Table.Cell>
                                                                        <Table.Cell>
                                                                            <div className="d-flex py-0 ">
                                                                                <p className="">
                                                                                    <button onClick={()=>setOrderId(data?.id)} className="py-0  btn btn-primary">
                                                                                        <div onClick={handleShowInfos}>
                                                                                            Détails
                                                                                        </div>
                                                                                    </button>
                                                                                </p>
                                                                            </div>
                                                                        </Table.Cell>
                                                                    </Table.Row >
                                                                ))}
                                                            </Table.Body>
                                                            {acceptedRefunds?.length>10 ? (
                                                                <Table.Pagination
                                                                    shadow
                                                                    noMargin
                                                                    align="center"
                                                                    rowsPerPage={10}
                                                                    onPageChange={(page) => console.log({ page })}
                                                                />
                                                            ) : ("")}
                                                        </Table>
                                                    ):(
                                                        <div className="text-center my-5">
                                                            Aucune demande de remboursement acceptée
                                                        </div>
                                                    )} 
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* ***************************FIN******************************* */}


                    {/************* Le corps de tab des Demandes de remboursement rejetée et Remboursement effectué***************/}
                    <div className="content-tabs">
                        <div
                            className={toggleStateRefund === 3 ? "content  active-content" : "content"}
                        >
                            <div className='cryptocurrency-search-box'>
                                <div className='row'>
                                    <div className='col-lg-12 col-md-12'>
                                        <div className='currency-selection'>
                                            <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                                                <div className='col-lg-12 col-md-12 row justify-content-between'>
                                                    {!rejectedAndCompletedRefunds?.length==0?(
                                                        <Table
                                                            aria-label="Example table with static content"
                                                            css={{
                                                                height: "auto",
                                                                minWidth: "100%",
                                                            }}
                                                        >
                                                            <Table.Header>
                                                                <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Boutique</p></Table.Column>
                                                                <Table.Column><p className="gr-text-8 pt-3 pb-0">Numéro commande</p></Table.Column>
                                                                <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Montant</p></Table.Column>
                                                                <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Statut</p></Table.Column>
                                                                <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Date</p></Table.Column>
                                                                <Table.Column><p className="gr-text-8 pt-3 pb-0">Infos</p></Table.Column>
                                                            </Table.Header>

                                                            <Table.Body>
                                                                {rejectedAndCompletedRefunds?.map((data) => (
                                                                    <Table.Row key={data?.id}>
                                                                        <Table.Cell ><small className=" py-0 ">{displayLimitedContent(data?.eshopName,30,"characters")}</small></Table.Cell>
                                                                        <Table.Cell ><small className=" py-0 "> {data?.orderNumber}</small></Table.Cell>
                                                                        
                                                                        <Table.Cell ><small className=" py-0 "> {data?.amount}</small></Table.Cell>
                                                                        <Table.Cell ><small className=" py-0 "> {data?.status ==="Demande de remboursement rejetée"? (<i className='colorRed'>Demande rejetée</i>):data?.status ==="Remboursement effectué"?(<i className='colorGreen'>Rembourser</i>):""}</small></Table.Cell>
                                                                        <Table.Cell ><small className=" py-0 "> {formatDate(data?.createdAt)}</small></Table.Cell>
                                                                        <Table.Cell>
                                                                            <div className="d-flex py-0 ">
                                                                                <p className="">
                                                                                    <button onClick={()=>setOrderId(data?.id)} className="py-0  btn btn-primary">
                                                                                        <div onClick={handleShowInfos}>
                                                                                            Détails
                                                                                        </div>
                                                                                    </button>
                                                                                </p>
                                                                            </div>
                                                                        </Table.Cell>
                                                                    </Table.Row >
                                                                ))}
                                                            </Table.Body>
                                                            {rejectedAndCompletedRefunds?.length>10 ? (
                                                                <Table.Pagination
                                                                    shadow
                                                                    noMargin
                                                                    align="center"
                                                                    rowsPerPage={10}
                                                                    onPageChange={(page) => console.log({ page })}
                                                                />
                                                            ) : ("")}
                                                        </Table>
                                                    ):(
                                                        <div className="text-center my-5">
                                                            Aucune donnée disponible
                                                        </div>
                                                    )} 
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* ***************************FIN******************************* */}


                    
                </div>  
            </>
         {/* ):(
            <span className="text-center bg-default-2 btn-bottom-text  d-block gr-text-5 text-blackish-blue gr-opacity-10 my-35">
                <Loading/>
            </span>
        )}  */}





        {/* ********************************************************************************** */}
            {/* MODAL D'ANNULATION DE PAIEMENT'*/}
        {/* ********************************************************************************** */}
        
        <Modal show={showDelete} className="mt-15" onHide={handleDeleteClose}>
            <Modal.Header closeButton className='bgColorRed'>
            <Modal.Title className="text-white">Annulation de la demande</Modal.Title>
            </Modal.Header>
                {/* <Form role="form"> */}
                    <Modal.Body>
                        <div className="input-group flex-nowrap">
                            <div className='col-lg-12 col-md-12 row justify-content-center'>
                                <div className='input-group-alternative my-3 '>
                                    <label className="mx-2 mb-3 text-center" htmlFor='address'>
                                        Voulez-vous vraiment annuler cette demande de paiement ?
                                    </label>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button className="text-white" color="danger" onClick={handleDeleteClose}>
                        Fermer
                    </Button>
                    <Button  type='button'  color="primary" disabled={isLoggingIn}>
                        Rejeter
                    </Button>
                    </Modal.Footer>
                {/* </Form> */}
        </Modal>
        {/* *****************************************FIN****************************************** */}

        {/* <Button className="text-white" color="secondary" onClick={handleDeleteClose}> */}


        {/* ********************************************************************************** */}
            {/* MODAL DE VALIDATION DE PAIEMENT  '*/}
        {/* ********************************************************************************** */}
        <Modal show={showPayer} className="mt-15" onHide={handleClosePayer}>
            <Modal.Header closeButton className='bgColorGreen'>
                <Modal.Title className="text-white" >Validation de paiement</Modal.Title>                
            </Modal.Header>
            {/* <Form role="form" onSubmit={hant}> */}
                <Modal.Body>
                    <div className="input-group flex-nowrap">
                        <div className='col-lg-12 col-md-12 row justify-content-between'>
                            <div className='input-group-alternative my-3 '>
                                Voulez-vous confirmer le paiement de à l'adresse de 
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="text-white" color="danger" onClick={handleClosePayer}>
                        Fermer
                    </Button>
                    <Button  type='button'  color="success" disabled={isLoggingIn}>
                        Payer
                        {isLoggingIn === true ? (<i className="fas fa-spinner fa-spin fa-lg mx-3"></i>) : ("")}

                    </Button>
                </Modal.Footer>
            {/* </Form> */}
        </Modal>
        {/* *****************************************FIN****************************************** */}
            
        

            {/* ********************************************************************************** */}
                {/* MODAL DE REMBOURSEMENT'*/}
            {/* ********************************************************************************** */}
            <Modal show={showRefund} className="mt-15" onHide={handleCloseRefund}>
                <Modal.Header closeButton className="bgColorGreen">
                    <Modal.Title className="text-white" >Remboursement</Modal.Title>                
                </Modal.Header>
                    <Modal.Body>
                        <p>Voulez-vous vraiment rembourser la somme de <b>{dataOneEshopOrderById?.amount}</b> au client <b>{dataOneEshopOrderById?.customerName} ?</b></p>                            
                    </Modal.Body>
                    <Modal.Footer>
                        {!isLoggingIn === true ? (
                            <Button className="text-white" color="danger" onClick={handleCloseRefund}>
                                Non 
                            </Button>
                        ) :("")}
                        {magicCurrentAddress? (
                            <Button  type='submit' onClick={processRefundContrat}  color="success" disabled={isLoggingIn}>
                                Oui 
                                {isLoggingIn === true ? (<i className="fas fa-spinner fa-spin fa-lg mx-3"></i>) : ("")}
                            </Button>
                        ) : ("...")}
                    </Modal.Footer>
            </Modal>
            {/* *****************************************FIN****************************************** */}


            {/* ********************************************************************************** */}
                {/* MODAL DU REJET DE LA DEMANDE DE REMBOURSEMENT'*/}
            {/* ********************************************************************************** */}
            <Modal show={showRejectRequestRefund} className="mt-15" onHide={handleCloseRejectRequestRefund}>
                <Modal.Header closeButton className="bgColorGreen">
                    <Modal.Title className="text-white" >Rejet demande de remboursement</Modal.Title>                
                </Modal.Header>
                    <Modal.Body>
                        <p>Voulez-vous vraiment rejeter la demande de remboursement de la somme de <b>{dataOneEshopOrderById?.amount}</b> envoyer par le client <b>{dataOneEshopOrderById?.customerName} ?</b></p>                            
                    </Modal.Body>
                    <Modal.Footer>
                        {!isLoggingIn === true ? (
                            <Button className="text-white" color="danger" onClick={handleCloseRejectRequestRefund}>
                                Non
                            </Button>
                        ) : ("")}

                        {magicCurrentAddress?(
                            <Button  type='button' onClick={revokeRefundRequest} color="success" disabled={isLoggingIn}>
                                Oui 
                                {isLoggingIn === true ? (<i className="fas fa-spinner fa-spin fa-lg mx-3"></i>) : ("")}
                            </Button>
                        ):("...")}
                    </Modal.Footer>
            </Modal>
            {/* *****************************************FIN****************************************** */}


            {/* ********************************************************************************** */}
                {/* MODAL DE L'IMAGE DE LA PREUVE DE LIVRAISON'*/}
            {/* ********************************************************************************** */}
            <Modal show={showPictureProof} className="mt-15" onHide={handleClosePictureProof}>
                <Modal.Header closeButton className="bgColorGreen">
                    <Modal.Title className="text-white" >Ajouter la photo de preuve de livraison</Modal.Title>                
                </Modal.Header>
                    <form onSubmit={handleUpdatePictureProof}>
                        <Modal.Body>
                            <input type="file" onChange={handleFileChange} accept="image/*" />
                            
                        </Modal.Body>
                        <Modal.Footer>
                            <Button className="text-white" color="danger" onClick={handleClosePictureProof}>
                                Fermer
                            </Button>
                            <Button  type='submit'  color="success" disabled={isLoggingIn}>
                                Ajouter 
                            </Button>
                        </Modal.Footer>
                    </form>
            </Modal>
            {/* *****************************************FIN****************************************** */}


            {/* ********************************************************************************** */}
                {/* MODAL DES INFORMATIONS DE LA COMMANDE*/}
            {/* ********************************************************************************** */}
            <Modal show={showInfos} className="mt-15" onHide={handleCloseInfos}>
                <Modal.Header closeButton className="bgColorblue">
                    <Modal.Title className="text-white" >Les infos de la commande</Modal.Title>                
                </Modal.Header>
                <Modal.Body>
                        <div className=''>
                            <div className=''>
                                <b>Nom de la boutique en ligne:</b> <br/>
                                {dataOneEshopOrderById?.eshopName}
                            </div>
                            <div className=''>
                                <b>Email marchand:</b> <br/>
                                {dataOneEshopOrderById?.merchantEmail}
                            </div>


                            <div className=''>
                                <b>Nom client:</b> <br/>
                                {dataOneEshopOrderById?.customerName}
                            </div>
                            <div className=''>
                                <b>Email client:</b> <br/>
                                {dataOneEshopOrderById?.customerEmail}
                            </div>

                            <div className=''>
                                <b>Date de livraison:</b> <br/>
                                {formatDate(dataOneEshopOrderById?.deliveryDate)}
                            </div>

                        </div>
                        
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className="text-white" color="danger" onClick={handleCloseInfos}>
                            Fermer
                        </Button>
                       
                    </Modal.Footer>
            </Modal>
            {/* *****************************************FIN****************************************** */}



            

        </>
    );
};

export default GestionPaiementEcommerce;
