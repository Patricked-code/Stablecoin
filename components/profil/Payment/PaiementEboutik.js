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

const PaiementEboutik = () => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API

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

    // Obtenir les données de la demande de paiement en fonction de l'utilisateur de l'utilisateur
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
                console.log("data=>",data)
                setPaymentPendingLength(data?.length)

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

    // Recupération des données de l'utilisation de stablecoin comme moyen de paiement de l'utilisateur connecté
    useEffect(async () => {
        const getDataRequestUseStablecoinOfUser = async () => {
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
                setDataRequestUseStablecoinOfUser(data);
            } catch (error) {
                // Gérer les erreurs de manière appropriée, par exemple, définir un état d'erreur.
                console.error('Erreur lors de la récupération des demandes:', error);
            }
        };

        await getDataRequestUseStablecoinOfUser();
    }, []);
    // Fin

    
    // Modal pour révoquer un rôle
    const [showDelete, setShowDelete] = useState(false);
    const handleDeleteClose = () => setShowDelete(false);
    const handleDeleteShow = () => setShowDelete(true);

    // Modal de paiement sur des sites ecommerces
    const [showPayer, setShowPayer] = useState(false);
    // const handleClosePayer = () => setShowPayer(false);
    const handleShowPayer = () => setShowPayer(true);
    const [secondsRemaining, setSecondsRemaining] = useState(5 * 60 );
    
    // Fin



   



// ***************************************************************
    // Transfert de stablecoin vers le smart contrat d'escrow
// ****************************************************************
async function transferToEscrow() {
    setIsLoggingIn(true)

    try {
      // Vérifier le solde de magicCurrentAddress
      const magicCurrentBalance = await contractStablecoin.balanceOf(magicCurrentAddress);
  
      // Convertir currentAmount en Wei
      const amountWei = ethers.utils.parseUnits(String(currentAmount), decimalStablecoin);
  
      // Vérifier si magicCurrentAddress a des fonds suffisants
      if (magicCurrentBalance.gte(amountWei)) {

        const dataForm = {
          spenderAddress: currentSenderAddress,
          ownerAddress: magicCurrentAddress,
          amount: amountWei,
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
        
        // return
          // Vérifier si l'exécutant a un solde Ether suffisant pour le gaz de dépôt
          if (executorBalance.gte(asyncTransferEstimateGas)) {
            // Transaction de dépôt
            const asyncTransferTx = await contractEscrow.asyncTransfer(dataForm?.ownerAddress, dataForm?.amount);
            await asyncTransferTx.wait();

            // Vérifier si l'exécutant a un solde gas suffisant pour le gaz d'apprabation de retrait
            const approveWithdrawalEstimateGas = await contractEscrow.estimateGas.approveWithdrawal(dataForm?.ownerAddress);
            const executorBalanceAfterTransfer = await signer.getBalance();
            if (executorBalanceAfterTransfer.gte(approveWithdrawalEstimateGas)) {
                // Fonction d'approbation de retrait
                const approveWithdrawalTx = await contractEscrow.approveWithdrawal(dataForm?.ownerAddress);
                await approveWithdrawalTx.wait();

                transferAmount(asyncTransferTx.hash) //Appele de la fonction de confirmation de la transaction dans la base de donnée
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
        console.error("Fonds insuffisants sur votre compte.");
      }
    } catch (error) {
        setIsLoggingIn(false)
        console.error("Erreur lors de l'exécution de la transaction :", error);
    }
}
  
  
  













   


   // FONCTION POUR CONFIRMER LE PAIEMENT DANS LA BASE DE DONNEE
   const transferAmount= async() =>{
    setIsLoggingIn(true)
    
    const dataa = {
      amount:currentAmount,
      senderId:currentSenderId,
    }
    
    // Obtenir le token en cours
    const token = localStorage.getItem('tokenEnCours');

    const result = await fetch(`${API_URL}/api/eshop/transfer-amount-eshop/${dataPaymentPending?.id}`, {
          method:"PUT",
        //   body: JSON.stringify(dataa),
          headers: {
              'Content-Type': 'application/json',
              Authorization:  `Bearer ${token}`
          }
      })
      .then(res=>{
      const data =  res.json();
        if (res.status==200) {
            //addHistorical(_hash) //Appel de la fonction d'ajout des infos de transaction dans la table de l'historique
        //    Actualiser après l'affichage 
          setTimeout(() => {
            window.location.reload()
          }, 5000) 
          Router.push("/profil/dashboard/");
          
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

    // FONCTION QUI METTRE VALID DE LA TABLE EN False
   const cancelPayment= async() =>{
    setIsLoggingIn(true)
    
    const dataForm = {
      amount:currentAmount,
      senderId:currentSenderId
       
    }
    // Obtenir le token en cours
    const token = localStorage.getItem('tokenEnCours');

    const result = await fetch(`${API_URL}/api/payment-request/cancel-payment/${idPaymentPending}`, {
          method:"PUT",
          body: JSON.stringify(dataForm),
          headers: {
              'Content-Type': 'application/json',
              Authorization:  `Bearer ${token}`
          }
      })
      .then(res=>{
      const data =  res.json();
        if (res.status==200) {
          Swal.fire({
            position: 'center',
            icon: 'success',
            html: "<p> La demande de paiement a été rejeté avec succès.<br/> Nous vous avons transmis un email de confirmation en ce sens.</p>" ,
            showConfirmButton: false,
            timer: 10000
          })

          //  Actualiser après l'affichage 
          setTimeout(() => {
            window.location.reload()
          }, 10000) 
          // Fin
        }else{
          setIsLoggingIn(false)

          Swal.fire({
            position: 'center',
            icon: 'error',
            html: "<p> L'annulation de la demande de paiement a échouée. </p>" ,
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
                typeTransaction: "Paiement e-commerce",
                activeName: nameStablecoin,
                activeSymbol: symbolStablecoin,
                nameSender: nameSender,
                nameReceiver: nameReceiver,
                emailSender: currentUser?.email,
                emailReceiver: infosOtherUser?.email,
                senderAddress: magicCurrentAddress,
                receiverAddress: infosOtherUser?.address,
                amount: currentAmount,
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
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    html: `<p> Votre transfert s'est effectué avec succès.</p>`,
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


    // FONCTION POUR RECUPERER LES INFOS D'UN AUTRE UTILISATEUR EN FONCTION DE SON ID
    useEffect(() => {
        const getInfosOtherUser = async (_userId) => {
        try {
            const result = await fetch(`${API_URL}/api/user/find-one-user-by-id/${_userId}`, {
            headers: {
                'Content-Type': 'application/json',
            },
            });
    
            if (!result.ok) {
            throw new Error('Failed to fetch user data');
            }
    
            const user = await result.json();
            setInfosOtherUser(user);
        } catch (error) {
            // Handle errors appropriately, e.g., set an error state.
            console.error('Error fetching user data:', error);
        }
        };
    
        if (currentSenderId) {
        getInfosOtherUser(currentSenderId);
        }
    }, [currentSenderId]);
    // FIN



    // Utilisez le useEffect pour effectuer des actions lorsque le composant est monté
    useEffect(() => {
        if (
          dataPaymentPending?.status == "En attente" &&
          dataPaymentPending?.createdAt
        ) {
            const createdAtTimestamp = new Date(dataPaymentPending.createdAt).getTime();
            const nowTimestamp = new Date().getTime();
            const initialTimeDifference = (nowTimestamp - createdAtTimestamp) / 1000; // en secondes
            let remainingTime = 5 * 60 - Math.floor(initialTimeDifference);
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
                transferAmount();
              }
            }, 1000); // Mettez à jour toutes les secondes
          }
        }
      }, [dataPaymentPending?.id]); // Le tableau de dépendances vide garantit que cela s'exécute une seule fois lors du montage du composant
  
      const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
      };
  
      // Gérez la fermeture du Modal
  const handleClosePayer = () => {
    setShowPayer(false);
    // Autres actions à effectuer lors de la fermeture du Modal
  };


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
                    <Button  type='button' onClick={cancelPayment}  color="primary" disabled={isLoggingIn}>
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
                            <Button className="text-white" color="danger" >
                                Annuler
                            </Button>
                        </div>
                        <div className='col-lg-6 col-md-6 col-sm-6 mt-3 '>
                            <Button className='px-3'  type='button'  color="success" onClick={transferToEscrow} disabled={isLoggingIn}>
                                Payer
                                {isLoggingIn === true ? (<i className="fas fa-spinner fa-spin fa-lg mx-3"></i>) : ("")}
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
