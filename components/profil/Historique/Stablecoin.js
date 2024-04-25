import { useState, useEffect } from 'react';
import React from "react";
import { Container, Row, Col, Modal} from "react-bootstrap";
import {Button,} from "reactstrap";

import moment from 'moment';
// import Link from "../../Link";
import Link from 'next/link';
import { Icon } from '@iconify/react';
import copy from "copy-to-clipboard"; 
import Swal from 'sweetalert2'
import ABI_TOKEN_EWARI from "../../../components/Contrats/Abi/AbiStablecoin.json";
import ABI_ESCROW_STABLECOIN from "../../../components/Contrats/Abi/AbiEscrowStablecoin.json";


// Pour Magic
import { magic } from "../../../magic";
import { ethers } from "ethers";
import Loading from "../../../components/loading";
import Router from "next/router";
import { Table } from '@nextui-org/react';


// FIN




const CHistoriqueStablecoin = () => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API
     // Variable de l'api key de stablecoin
     const API_KEY_STABLECOIN = process.env.NEXT_PUBLIC_API_KEY_STABLECOIN
    const HASH_TX = process.env.NEXT_PUBLIC_HASH_TX
    const ADDRESS_TX = process.env.NEXT_PUBLIC_ADDRESS_TX
    const ADDRESS_CONTRAT_EWARI =process.env.NEXT_PUBLIC_ADDRESS_CONTRAT_EWARI
    const PRIVATE_KEY = process.env.NEXT_PUBLIC_PRIVATE_KEY

    const [currentUser, setCurrentUser] = useState();
   
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [isLoggingInRefund, setIsLoggingInRefund] = useState(false); //Pour la partie de remboursement
    
    const [dataAllHistoricalByUserEmail, setDataAllHistoricalByUserEmail] = useState();
    const [copyAddress, setCopyAddress] = useState()
    const [successCopy, setSuccessCopy] = useState()

    //***************************************************************** *
        // LES STATES DU STABLECOIN
    // ******************************************************************
    const [contractStablecoin, setContractStablecoin] = useState();
    const [signer, setSigner] = useState();
    const [walletRelayer, setWalletRelayer] = useState();
    const [magicCurrentAddress, setMagicCurrentAddress] = useState();
    const [userMetadata, setUserMetadata] = useState("...");
    const [provider, setProvider] = useState(null);
    
    const [nameStablecoin, setNameStablecoin] = useState();
    const [symbolStablecoin, setSymbolStablecoin] = useState();
    const [balanceStablecoin, setBalanceStablecoin] = useState();
    const [balanceStablecoinNoFormat, setBalanceStablecoinNoFormat] = useState();
    const [decimalStablecoin, setDecimalStablecoin] = useState();
    
    // States smart contrat d'escrow
    const [contractEscrow, setContractEscrow] = useState()


    // State de remboursement pour transfert directe
    const [historicalId, setHistoricalId] = useState();
    const [oneHistorical, setOneHistorical] = useState();

    // States des commandes effectuées sur des sites ecommerce
    const [oneEshopOrderById, setOneEshopOrderById] = useState();

    // States pour les données du marchand
    const [dataMerchantByIdentifier, setDataMerchantByIdentifier] = useState();

    // Modal du resultat de la demande de remboursement
    const [showRefundResult, setShowRefundResult] = useState(false);
    const handleCloseRefundResult = () => setShowRefundResult(false);
    const handleShowRefundResult = () => setShowRefundResult(true);
    // Fin

     // Modal de la demande de remboursement
     const [amountRefund, setAmountRefund] = useState();
     const [showRefund, setShowRefund] = useState(false);
     const handleCloseRefund = () => setShowRefund(false);
     const handleShowRefund = () => setShowRefund(true);
     // Fin
    
    // Modal de la demande de remboursement
    const [amountRefundEcommerce, setAmountRefundEcommerce] = useState();
    const [showRefundEcommerce, setShowRefundEcommerce] = useState(false);
    const handleCloseRefundEcommerce = () => setShowRefundEcommerce(false);
    const handleShowRefundEcommerce = () => setShowRefundEcommerce(true);
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
          /**
            * Smart contrat du factory d'escrow.
            * @type {string}
            */
            if (dataMerchantByIdentifier?.addressEscrow) {
                const contractEscrow = new ethers.Contract(dataMerchantByIdentifier?.addressEscrow, ABI_ESCROW_STABLECOIN?.abi, walletRelay);
                setContractEscrow(contractEscrow)
            }

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
        }
      };

      // Appeler la fonction pour récupérer les informations lorsque le fournisseur Web3 ou Magic changent.
      getMagicAndWeb3Info();
    }, [provider, magic, dataMerchantByIdentifier]);



    /**
     * Hook d'effet pour récupérer et définir les informations de l'utilisateur connecté.
     * @returns {void}
     */
     useEffect(async () => {
        const token = localStorage.getItem('tokenEnCours');
        
        /**
         * Fonction pour obtenir l'utilisateur connecté et mettre à jour l'état.
         * @returns {void}
         */
        const getUserSignIn = async () => {
            const result = await fetch(`${API_URL}/api/user/find-user-sign-in`, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': `${API_KEY_STABLECOIN}`,
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((result) => result.json())
            .then((data) => {
                setCurrentUser(data);
            });
        };

        await getUserSignIn();
    }, []);
    // FIN


    // FONCTION POUR RECUPERER L'HISTORIQUE DE TRANSACTION DE L'UTILISATEUR EN FONCTION DE SON EMAIL'
    useEffect(() => {
        // Obtenir le token en cours
        const token = localStorage.getItem('tokenEnCours');
        const getAllHistoricalByUserEmail = async () => {
        try {
            const result = await fetch(`${API_URL}/api/historical/find-all-historical-by-user-email?email=${currentUser?.email}`, {
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
            setDataAllHistoricalByUserEmail(data);
        } catch (error) {
            // Handle errors appropriately, e.g., set an error state.
            console.error('Error fetching user data:', error);
        }
        };
  
        getAllHistoricalByUserEmail();
        
    }, [currentUser?.id]);
    // FIN

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
                console.log("setOneHistorical=>",data)


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






















    // ********************************************************************
        // PARTIE D'IMPLEMENTATION DES FONCTIONS DU SMART CONTRAT D'ESCROW
    // ********************************************************************
        // FONCTION SMART CONTRAT POUR CONFIRMER LE PAIEMENT ou APPROUVER PAIMENT
        async function approveWithdrawal() {
            setIsLoggingIn(true)
        
            try {
              // Vérifier le solde de magicCurrentAddress
              const magicCurrentBalance = await contractStablecoin.balanceOf(magicCurrentAddress);
        
                const dataForm = {
                  ownerAddress: magicCurrentAddress,
                };
                
                
                    // Vérifier si l'exécutant a un solde gas suffisant pour le gaz d'apprabation de retrait
                    const approveWithdrawalEstimateGas = await contractEscrow.estimateGas.approveWithdrawal(dataForm?.ownerAddress);
                    const executorBalanceAfterTransfer = await signer.getBalance();
                    if (executorBalanceAfterTransfer.gte(approveWithdrawalEstimateGas)) {
                        // Fonction d'approbation de retrait
                        const approveWithdrawalTx = await contractEscrow.approveWithdrawal(dataForm?.ownerAddress);
                        await approveWithdrawalTx.wait();
        
                        confirmPaiementEshop() //Appele de la fonction de confirmation de la transaction dans la base de donnée
                    } else {
                        setIsLoggingIn(false);
                        Swal.fire({
                            position: 'center',
                            icon: 'error',
                            html: `<p>Solde insuffisant pour couvrir les frais de gaz d'approbation du retrait.</p>`,
                            showConfirmButton: false,
                        timer: 5000
                        });
                        console.error("Solde insuffisant pour couvrir les frais de gaz d'approveWithdrawal.");
                    }
                  
                
              
            } catch (error) {
                setIsLoggingIn(false)
                console.error("Erreur lors de l'exécution de la transaction :", error);
            }
        }

        // FONCTION SMART CONTRAT POUR DEMANDE DE REMBOURSEMENT
        async function requestRefund() {
            setIsLoggingInRefund(true)
        
            try {
              
                const dataForm = {
                  ownerAddress: magicCurrentAddress,
                };
                
                
                    // Vérifier si l'exécutant a un solde gas suffisant pour le gaz d'apprabation de retrait
                    const requestRefundEstimateGas = await contractEscrow.estimateGas.requestRefund(dataForm?.ownerAddress);
                    const executorBalanceAfterTransfer = await signer.getBalance();
                    if (executorBalanceAfterTransfer.gte(requestRefundEstimateGas)) {
                        // Fonction d'approbation de retrait
                        const requestRefundTx = await contractEscrow.approveWithdrawal(dataForm?.ownerAddress);
                        await requestRefundTx.wait();
        
                        requestRefundPaymentEshop() //Appele de la fonction de la demande de remboursement dans la base de donnée
                    } else {
                        setIsLoggingInRefund(false);
                        Swal.fire({
                            position: 'center',
                            icon: 'error',
                            html: `<p>Solde insuffisant pour couvrir les frais de gaz de la demande de remboursement.</p>`,
                            showConfirmButton: false,
                        timer: 5000
                        });
                        console.error("Solde insuffisant pour couvrir les frais de gaz de la demande de remboursement.");
                    }
                  
                
              
            } catch (error) {
                setIsLoggingInRefund(false)
                console.error("Erreur lors de l'exécution de la transaction :", error);
            }
        }




        // FONCTION POUR CONFIRMER LE PAIEMENT DANS LA BASE DE DONNEE (Appélée dans la fonction approveWithdrawal())
        const confirmPaiementEshop= async() =>{
            setIsLoggingIn(true)

            // Obtenir le token en cours
            const token = localStorage.getItem('tokenEnCours');

            const result = await fetch(`${API_URL}/api/eshop/confirm-paiement-eshop/${dataPaymentPending?.id}`, {
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
                    html: `<p> Vous avez confirmé me paiement avec succès.</p>`,
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


        // FONCTION POUR DEMANDE DE REMBOURSEMENT DANS LA BASE DE DONNEE (Appélée dans la fonction requestRefund())
        const requestRefundPaymentEshop = async() =>{
            setIsLoggingInRefund(true)

            // Obtenir le token en cours
            const token = localStorage.getItem('tokenEnCours');

            const result = await fetch(`${API_URL}/api/eshop/request-refund-payment-eshop/${dataPaymentPending?.id}`, {
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
                    html: `<p> Vous demande de remboursement a été envoyé avec succès.</p>`,
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
                setIsLoggingInRefund(false)
            }
            })
            .catch(error => {
            setIsLoggingIn(false)

            //handle error
            console.log(error);

            });
        }
        // FIN


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
        if (oneEshopOrderById?.merchantIdentifier) {
            await getDataMerchantByIdentifier(oneEshopOrderById?.merchantIdentifier);
        }
    }, [oneEshopOrderById?.merchantIdentifier]);
    // Fin





    // *********************************************************************
        // PARTIE DES COMMANDES EFFECTUEES SUR LES SITES ECOMMERCES
    // **********************************************************************

    // Obtenir une commande d'un utilisateur en fonction de son email
    useEffect(async () => {
        const getOneEshopOrderById= async (_eshopOrderId) => {
            // const token = localStorage.getItem('tokenEnCours');

            try {
                
                const result = await fetch(`${API_URL}/api/eshop/find-one-order-eshop/${_eshopOrderId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                    'x-api-key': `${API_KEY_STABLECOIN}`,
                        // Authorization: `Bearer ${token}`,
                    },
                });

                if (!result.ok) {
                    throw new Error('Failed to fetch request data');
                }

                const data = await result.json();
                setOneEshopOrderById(data);

            } catch (error) {
                // Gérer les erreurs de manière appropriée, par exemple, définir un état d'erreur.
                console.error('Erreur lors de la récupération des données:', error);
            }
        };
        if (oneHistorical?.eshopOrderId) {
            await getOneEshopOrderById(oneHistorical?.eshopOrderId);
        }
    }, [oneHistorical?.eshopOrderId]);

/**
 * Vérifie si le bouton doit être visible en fonction de la différence de temps entre
 * l'heure actuelle et l'heure de création du transfert.
 *
 * @param {string} createdAt - La date de création du transfert (au format ISO 8601).
 * @returns {boolean} - True si le bouton doit être visible, sinon false.
 */
const isButtonVisible = (createdAt) => {
    const currentTime = new Date();
    const createdAtTime = new Date(createdAt);
    const differenceInMinutes = (currentTime - createdAtTime) / (10 * 60);

    return differenceInMinutes <= 5000000; // Afficher le bouton si la différence est inférieure ou égale à 5 minutes
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
        // const maDate = moment(_updatedAt).format('DD/MM/YYYY');
        const maDate = moment(_updatedAt).format('DD/MM/YYYY à HH:mm');
        return  maDate
    }
    //  FIN

    // FONCTION POUR COPIER UNE ADRESSE PUBLIC 
    const copyToClipboard = () => {
        copy(copyAddress);
        setSuccessCopy("Adresse copiée avec succès !");
        Swal.fire({
            position: 'center',
            icon: 'success',
            html: `<p> Adresse copiée avec succès</p>`,
            showConfirmButton: false,
            timer: 1000
        });
        // setTimeout(() => {
        //     setSuccessCopy("");
        // }, 1000)
    }
    // FIN

    return (
        <>
            {/* {currentUser?.profileId==2 || currentUser?.profileId==3?( */}

                <>
                    <div className='' >
                        <div className=' mx-15'>
                            <div className='py-10'>
                                <h1 className='text-center'>Historiques de stablecoin</h1>
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
                            {!dataAllHistoricalByUserEmail?.length==0 ? (
                                <Table
                                    aria-label="Example table with static content"
                                    css={{
                                        height: "auto",
                                        minWidth: "100%",
                                    }}
                                >
                                    <Table.Header>
                                        {/* <Table.Column><p className="gr-text-8 pt-3 pb-0 mx-3 ">Nom & prenom </p></Table.Column> */}
                                        <Table.Column><p className="gr-text-8 pt-3 pb-0 ">type</p></Table.Column>
                                        <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Actif</p></Table.Column>
                                        {/* <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Nom</p></Table.Column> */}
                                        <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Hash de transaction</p></Table.Column>
                                        <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Nom<br/>Adresse</p></Table.Column>
                                        <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Montant<br/>Bonus/Frais</p></Table.Column>
                                        <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Date</p></Table.Column>
                                    </Table.Header>
                                    <Table.Body>
                                        {dataAllHistoricalByUserEmail?.map((data,) => (
                                            <Table.Row key={data?.id}>                       
                                                <Table.Cell >
                                                    <small className=" py-0 ">{data?.typeTransaction}</small>
                                                    {data?.typeTransaction==="Paiement e-commerce" ?  (
                                                        <button className='mx-2' onClick={()=>setHistoricalId(data?.id)}>
                                                            <Icon onClick={handleShowRefundEcommerce}  color='blue' icon="healthicons:i-note-action-outline" width="20" />
                                                        </button>
                                                    ) : ("")}
                                                </Table.Cell>
                                                <Table.Cell >
                                                    <small className=" py-0 ">{data?.activeSymbol}</small>
                                                    {currentUser?.address != data?.receiverAddress && data?.typeTransaction=="Transfert"? (
                                                        <>
                                                            {data?.refundStatus===0 || data?.refundStatus===1 || data?.refundStatus===2 ? (
                                                                <button className='mx-2' onClick={()=>setHistoricalId(data?.id)}>
                                                                    <Icon onClick={handleShowRefundResult} color='green' icon="gridicons:refund" width="20" />
                                                                </button>  
                                                            ) : (
                                                                isButtonVisible(data?.createdAt) && (
                                                                    <button className='mx-2' onClick={()=>setAmountRefund(data?.amount)}>
                                                                        <Icon onClick={handleShowRefund} color='blue' icon="gridicons:refund" width="20" />
                                                                    </button>
                                                                )
                                                            )}
                                                            
                                                        </>
                                                    ):("")}
                                                    
                                                </Table.Cell>
                                                {/* <Table.Cell >
                                                    <small className=" py-0 ">
                                                        {currentUser?.address != data?.senderAddress ? (
                                                            <>
                                                                {displayLimitedContent(data?.nameSender,20,"characters")}
                                                            </>
                                                        ):currentUser?.address != data?.receiverAddress ? (
                                                            <>
                                                                {displayLimitedContent(data?.nameReceiver,20,"characters")}
                                                            </>
                                                        ):("")}
                                                    </small>
                                                </Table.Cell> */}
                                                <Table.Cell ><small className=" py-0 d-flex">{displayLimitedContent(data?.hash, 20, "characters")}<a className=" aNoDecor " target="_blank"  href={`${HASH_TX}/${data?.hash}`}>Détails</a></small></Table.Cell>
                                                <Table.Cell >
                                                    <small className=" py-0 ">
                                                    {currentUser?.address != data?.senderAddress ? (
                                                            <>
                                                                {displayLimitedContent(data?.nameSender,20,"characters")}
                                                            </>
                                                        ):currentUser?.address != data?.receiverAddress ? (
                                                            <>
                                                                {displayLimitedContent(data?.nameReceiver,20,"characters")}
                                                            </>
                                                        ):("")}
                                                        <br/>
                                                        {currentUser?.address != data?.senderAddress ? (
                                                            <>
                                                                {displayLimitedContent(data?.senderAddress,20,'characters')} 
                                                                <button onClick={()=>setCopyAddress(data?.senderAddress)}><Icon onClick={copyToClipboard} icon="bx:copy"  width="15" /></button><br/>
                                                            
                                                            </>
                                                        ) :currentUser?.address != data?.receiverAddress ? (
                                                            <>
                                                                {displayLimitedContent(data?.receiverAddress,20,"characters")}

                                                                <button onClick={()=>setCopyAddress(data?.receiverAddress)}>
                                                                    <Icon onClick={copyToClipboard} icon="bx:copy"  width="15" />
                                                                </button><br/><i className="colorGreen"></i>
                                                            </>
                                                        ):("")}

                                                       
                                                    </small>
                                                </Table.Cell>
                                                <Table.Cell >
                                                    <small className=" py-0 ">
                                                    {currentUser?.address != data?.senderAddress ? (
                                                            <>
                                                                <i className='colorGreen'> + {formatNumber(parseFloat(data?.amount))}</i>
                                                            </>
                                                        ):currentUser?.address != data?.receiverAddress ? (
                                                            <>
                                                                <i className='colorRed'> - {formatNumber(parseFloat(data?.amount))}</i>
                                                            </>
                                                    ):("")}
                                                    
                                                    <br/>
                                                    {currentUser?.address != data?.senderAddress  ? (
                                                        <>
                                                            {data?.typeTransaction==="Remboursement" ? (
                                                                <i className='colorRed'> - {formatNumber(parseFloat(data?.refundServiceFee))}</i>
                                                            ):('- - - - - - -') }
                                                        </>
                                                    ):currentUser?.address != data?.receiverAddress? (
                                                            <>
                                                            {data?.typeTransaction==="Remboursement" ? (
                                                                <i className='colorGreen'> + {formatNumber(parseFloat(data?.refundAmountReceiver))}</i>
                                                            ):data?.typeTransaction==="Transfert" && data?.fees?(
                                                                <i className='colorRed'> - {formatNumber(parseFloat(data?.fees))}</i>
                                                            ):('- - - - - - -') }

                                                            </>
                                                    ):("")}
                                                    </small>
                                                    {/* <small className=" py-0 ">
                                                        {formatNumber(parseFloat(data?.amount))}<br/>{formatDate(data?.createdAt)}
                                                    </small> */}
                                                </Table.Cell>
                                                <Table.Cell >
                                                    <small className=" py-0 ">
                                                        {formatDate(data?.createdAt)}
                                                    </small>
                                                    {/* <small className=" py-0 ">
                                                        {formatNumber(parseFloat(data?.amount))}<br/>{formatDate(data?.createdAt)}
                                                    </small> */}
                                                </Table.Cell>
                                            </Table.Row >
                                        ))} 
                                    </Table.Body>
                                    {!dataAllHistoricalByUserEmail?.length>5 ? (
                                    <Table.Pagination
                                        shadow
                                        noMargin
                                        align="center"
                                        rowsPerPage={5}
                                        onPageChange={(page) => console.log({ page })}
                                    />
                                    ):("")}
                                </Table>
                            ) : (
                                <p className='colorRed text-center m-3'>Aucune transaction effectuée</p>
                            )}
                        </div>
                    </div>
                </>
            {/* ):(
                <span className="text-center bg-default-2 btn-bottom-text  d-block gr-text-5 text-blackish-blue gr-opacity-10 my-35">
                    <Loading/>
                </span>
            )} */}





        {/* ********************************************************************************** */}
            {/* MODAL DE DEMANDE DE REMBOURSEMENT  '*/}
        {/* ********************************************************************************** */}
        <Modal show={showRefundResult} className="mt-15" onHide={handleCloseRefundResult}>
            <Modal.Header closeButton className='bgColorblue'>
                <Modal.Title className="text-white" >Resultat demande de remboursement</Modal.Title>                
            </Modal.Header>
                <Modal.Body>
                    <div className="input-group flex-nowrap">
                        <div className='col-lg-12 col-md-12 row justify-content-between'>
                        {oneHistorical?.refundStatus==0 ? 
                            (
                                <><br/><i className='colorBlue'>Demande de remboursement en cours </i></>
                            ):oneHistorical?.refundStatus==1 ?
                            (
                                <><br/><i colorGreen>Remboursement Effectué </i></>
                            ): oneHistorical?.refundStatus==2 ?
                            (
                                <><br/><i className='colorRed'>Demande de remboursement rejétée </i></>
                            ):("")
                        }
                        
                        </div>
                    </div>
                </Modal.Body>
        </Modal>
        {/* *****************************************FIN****************************************** */}
            
         {/* ********************************************************************************** */}
            {/* MODAL DE DEMANDE DE REMBOURSEMENT  '*/}
        {/* ********************************************************************************** */}
        <Modal show={showRefund} className="mt-15" onHide={handleCloseRefund}>
            <Modal.Header closeButton className='bgColorblue'>
                <Modal.Title className="text-white" >Demande de remboursement</Modal.Title>                
            </Modal.Header>
            {/* <Form role="form" onSubmit={hant}> */}
                <Modal.Body>
                    <div className="input-group flex-nowrap">
                        <div className='col-lg-12 col-md-12 row justify-content-between'>
                            <div className='input-group-alternative my-3  '>
                                Voulez-vous confirmer la demande remboursement des <b className='colorGreen'>{formatNumber(parseFloat(amountRefund))} {symbolStablecoin}?</b>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="text-white" color="danger" onClick={handleCloseRefund}>
                        Non
                    </Button>
                    <Button  type='button'  color="success"  disabled={isLoggingIn}>
                        Oui
                        {isLoggingIn === true ? (<i className="fas fa-spinner fa-spin fa-lg mx-3"></i>) : ("")}

                    </Button>
                </Modal.Footer>
            {/* </Form> */}
        </Modal>
        {/* *****************************************FIN****************************************** */}
            

        {/* ********************************************************************************** */}
            {/* MODAL DE DEMANDE DE REMBOURSEMENT POUR LES ECOMMERCES '*/}
        {/* ********************************************************************************** */}
        <Modal show={showRefundEcommerce} width={2000} className="mt-15 modal-fullpage" onHide={handleCloseRefundEcommerce}>
            <Modal.Header closeButton className='bgColorblue'>
                <Modal.Title className="text-white" >Informations du paiement en ligne</Modal.Title>                
            </Modal.Header>
            {/* <Form role="form" onSubmit={hant}> */}
                <Modal.Body>
                    <div className="input-group flex-nowrap ">
                        <div className='col-lg-12 col-md-12 row justify-content-between'>
                            <Table
                                aria-label="Example table with static content"
                                css={{
                                    height: "auto",
                                    minWidth: "100%",
                                }}
                            >
                            <Table.Header>
                                <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Numéro commande</p></Table.Column>
                                <Table.Column><p className="gr-text-8 pt-3 pb-0 text-center">Statut</p></Table.Column>
                                <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Actions</p></Table.Column>
                            </Table.Header>
                            <Table.Body>
                                <Table.Row >
                                    <Table.Cell >
                                        <p className=" py-0 ">{oneEshopOrderById?.orderNumber}</p>
                                    </Table.Cell>
                                    <Table.Cell >
                                        
                                        {oneEshopOrderById?.status=="Paiement effectué"? (
                                            <>
                                                <div className='input-group-alternative my-3 col-lg-6 col-md-6 '>
                                                    <p className='colorGreen'>Paiement effectué</p>
                                                </div>
                                            </>
                                        ):oneEshopOrderById?.status=="Paiement confirmé"? (
                                            <>
                                                <div className='input-group-alternative my-3 col-lg-6 col-md-6 '>
                                                    <p className='colorGreen'>Paiement confirmé</p>
                                                </div>
                                            </>
                                        ):oneEshopOrderById?.status=="Demande de remboursement"?(
                                            <>
                                                <div className='input-group-alternative my-3 col-lg-6 col-md-6 '>
                                                    <p className=''>Demande de remboursement en cours</p>
                                                </div>
                                            </>
                                        ):oneEshopOrderById?.status=="Demande de remboursement acceptée"? (
                                            <>
                                                <div className='input-group-alternative my-3 col-lg-6 col-md-6 '>
                                                    <p className='colorGreen'>Demande de remboursement acceptée </p>
                                                </div>
                                            </>
                                        ):oneEshopOrderById?.status=="Demande de remboursement rejetée"? (
                                            <>
                                                <div className='input-group-alternative my-3 col-lg-6 col-md-6 '>
                                                    <p className='colorRed'>Demande de remboursement rejetée </p>
                                                </div>
                                            </>
                                        ):oneEshopOrderById?.status=="Remboursement effectué"? (
                                            <>
                                                <div className='input-group-alternative my-3 col-lg-6 col-md-6 '>
                                                    <p className='colorGreen'>Remboursement effectué </p>
                                                </div>
                                            </>
                                        ):oneEshopOrderById?.status=="Commande annulée"? (
                                            <>
                                                <div className='input-group-alternative my-3 col-lg-6 col-md-6 '>
                                                    <p className='colorRed'>Commande annulée </p>
                                                </div>
                                            </>
                                        ):("")}
                                    </Table.Cell>
                                    
                                    <Table.Cell>
                                        <div className="d-flex py-0 ">
                                        {oneEshopOrderById?.status=="Paiement effectué"? (
                                            <>
                                                <Button onClick={approveWithdrawal} className="text-white py-0 px-4 mx-1" disabled={isLoggingIn} color="success">
                                                    Colis reçu
                                                    {isLoggingIn === true ? (<i className="fas fa-spinner fa-spin fa-lg mx-3"></i>) : ("")}
                                                </Button>

                                                <Button onClick={requestRefund} className="text-white py-0 px-2" disabled={isLoggingInRefund} color="primary">
                                                    Colis non reçu
                                                    {isLoggingInRefund === true ? (<i className="fas fa-spinner fa-spin fa-lg mx-3"></i>) : ("")}
                                                </Button>
                                            </>
                                        ):oneEshopOrderById?.status=="Paiement confirmé"? (
                                            <>
                                                <Button disabled className="text-white py-0 px-1" color="primary">
                                                    Aucune
                                                </Button>
                                            </>
                                        ):oneEshopOrderById?.status=="Demande de remboursement"?(
                                            <>
                                                <Button disabled className="text-white py-0 px-1" color="primary">
                                                    Aucune
                                                </Button>
                                            </>
                                        ):oneEshopOrderById?.status=="Demande de remboursement acceptée"? (
                                            <>
                                                <Button disabled className="text-white py-0 px-1" color="primary">
                                                    Aucune
                                                </Button>
                                            </>
                                        ):oneEshopOrderById?.status=="Demande de remboursement rejetée"? (
                                            <>
                                                <Button disabled className="text-white py-0 px-1" color="primary">
                                                    Aucune
                                                </Button>
                                            </>
                                        ):oneEshopOrderById?.status=="Remboursement effectué"? (
                                            <>
                                                <Button disabled className="text-white py-0 px-1" color="primary">
                                                    Aucune
                                                </Button>
                                            </>
                                        ):oneEshopOrderById?.status=="Commande annulée"? (
                                            <>
                                                <Button disabled className="text-white py-0 px-1" color="primary">
                                                    Aucune
                                                </Button>
                                            </>
                                        ):("")}
                                        </div>
                                    </Table.Cell>
                                </Table.Row >
                            </Table.Body>
                        </Table>

                        </div>
                    </div>
                </Modal.Body>
                {/* <Modal.Footer>
                    <Button className="text-white" color="danger" onClick={handleCloseRefundEcommerce}>
                        Non
                    </Button>
                    <Button  type='button'  color="success"  disabled={isLoggingIn}>
                        Oui
                        {isLoggingIn === true ? (<i className="fas fa-spinner fa-spin fa-lg mx-3"></i>) : ("")}

                    </Button>
                </Modal.Footer> */}
            {/* </Form> */}
        </Modal>
        {/* *****************************************FIN****************************************** */}
            
        </>
    );
};

export default CHistoriqueStablecoin;
