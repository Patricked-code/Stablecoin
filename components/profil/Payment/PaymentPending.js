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

const PaiementPending = () => {
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

    // Obtenir les données de la demande de paiement en fonction de l'utilisateur connecté 
    useEffect(async () => {
        const getPaymentPendingOfUser= async (_currentUserId) => {
            const token = localStorage.getItem('tokenEnCours');

            try {
                
                const result = await fetch(`${API_URL}/api/payment-request/find-all-payment-request-for-receiver?receiverId=${_currentUserId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!result.ok) {
                    throw new Error('Failed to fetch request data');
                }

                const data = await result.json();
                setDataPaymentPending(data)
                setPaymentPendingLength(data?.length)

            } catch (error) {
                // Gérer les erreurs de manière appropriée, par exemple, définir un état d'erreur.
                console.error('Erreur lors de la récupération des demandes:', error);
            }
        };
        if (currentUser?.id) {
            await getPaymentPendingOfUser(currentUser?.id);
        }
    }, [currentUser?.id]);
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

    // Modal d'attribution d'un rôle à une adresse
    const [showPayer, setShowPayer] = useState(false);
    const handleClosePayer = () => setShowPayer(false);
    const handleShowPayer = () => setShowPayer(true);
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
   const transferAmount= async(_hash) =>{
    setIsLoggingIn(true)
    
    const dataa = {
      amount:currentAmount,
      senderId:currentSenderId,
    }
    
    // Obtenir le token en cours
    const token = localStorage.getItem('tokenEnCours');

    const result = await fetch(`${API_URL}/api/payment-request/transfer-amount/${idPaymentPending}`, {
          method:"PUT",
          body: JSON.stringify(dataa),
          headers: {
              'Content-Type': 'application/json',
              Authorization:  `Bearer ${token}`
          }
      })
      .then(res=>{
      const data =  res.json();
        if (res.status==200) {
            addHistorical(_hash) //Appel de la fonction d'ajout des infos de transaction dans la table de l'historique
          //  Actualiser après l'affichage 
        //   setTimeout(() => {
        //     window.location.reload()
        //   }, 20000) 
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

        try {
            
            const dataBody = {
                typeTransaction: "Async transfert",
                activeName: nameStablecoin,
                activeSymbol: symbolStablecoin,
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
            console.log("user oth=>", user)
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
                            <h1 className='text-center'>Paiements en attente</h1>
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
                                <div className='col-lg-1 col-md-1'></div>

                                    <div className='col-lg-10 col-md-10'>
                                        <div className='currency-selection'>
                                            <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                                                    <div className='col-lg-12 col-md-12 row justify-content-between'>
                                                        {!paymentPendingLength==0?(
                                                            <Table
                                                                aria-label="Example table with static content"
                                                                css={{
                                                                    height: "auto",
                                                                    minWidth: "100%",
                                                                }}
                                                            >
                                                            <Table.Header>
                                                                <Table.Column><p className="gr-text-8 pt-3 pb-0 mx-3 ">Commerçant</p></Table.Column>
                                                                <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Montant</p></Table.Column>
                                                                <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Objet</p></Table.Column>
                                                                <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Statut</p></Table.Column>
                                                                <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Date</p></Table.Column>
                                                                <Table.Column><p className="gr-text-8 pt-3 pb-0 text-center">Actions</p></Table.Column>
                                                            </Table.Header>
                                                                <Table.Body>
                                                                    {dataPaymentPending?.map(
                                                                        (
                                                                        {id, objet, amount,senderEmail, senderAddress, nameEntreprise, senderId, createdAt, valid},
                                                                        index
                                                                        ) => (
                                                                            <Table.Row key={index}>
                                                                                {/* Default Admin */}
                                                                                <Table.Cell ><small className=" py-0 ">{displayLimitedContent(nameEntreprise,30,"characters")}</small></Table.Cell>
                                                                                <Table.Cell ><small className=" py-0 ">{amount}</small></Table.Cell>
                                                                                <Table.Cell ><small className=" py-0 ">{displayLimitedContent(objet,15,"characters")}</small></Table.Cell>
                                                                                <Table.Cell ><small className=" py-0 ">{valid == 1?(<i className='colorGreen'>Payé</i>):valid == 2 ? (<i className='colorBlue'>Remboursé</i>) :valid == 3? (<i className='colorRed'>Rejeté </i>) :<i>En cours</i>}</small></Table.Cell>

                                                                                <Table.Cell ><small className=" py-0 ">{formatDate(createdAt)}</small></Table.Cell>
                                                                            
                                                                                <Table.Cell>
                                                                                    <div className="d-flex py-0 ">
                                                                                        <p className="text-center">

                                                                                        
                                                                                            <button  onClick={()=>setCurrentSenderAddress(senderAddress)} disabled={valid === 1 || valid === 3}  className={`py-0 mx-2 btn ${valid === 1 || valid === 3 ? 'btn-secondary' : 'btn-success'} d`}>
                                                                                            {/* onClick={()=>setIdForSender(senderId)} */}
                                                                                            
                                                                                                <div onClick={()=>setIdPaymentPending(id)}>
                                                                                                    <div onClick={()=>setCurrentSenderId(senderId)}>
                                                                                                        <div onClick={()=>setCurrentAmount(amount)}>
                                                                                                            <div onClick={()=>setCurrentEntreprise(nameEntreprise)}>
                                                                                                                <div onClick={()=>setCurrentSenderEmail(senderEmail)}>
                                                                                                                    <div onClick={handleShowPayer}>
                                                                                                                        Valider 
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </button>

                                                                                            <button  onClick={()=>setCurrentAmount(amount)} disabled={valid === 1 || valid === 3}  className={`py-0 mx-2 btn ${valid === 1 || valid === 3 ? 'btn-secondary' : 'btn-danger'}`}>
                                                                                                <div onClick={()=>setIdPaymentPending(id)}>
                                                                                                    <div onClick={()=>setCurrentSenderId(senderId)}>
                                                                                                        <div onClick={handleDeleteShow}>
                                                                                                            Rejeter
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </button>

                                                                                            {/* <small  onClick={()=>setCurrentAmount(amount)} className='py-0 px-0 mx-2 btn btn-primary'>
                                                                                                <div onClick={()=>setIdPaymentPending(id)}>
                                                                                                    <div onClick={()=>setCurrentSenderId(senderId)}>
                                                                                                        <div>
                                                                                                            Rembourser
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </small> */}
                                                                                        </p>
                                                                                    </div>
                                                                                </Table.Cell>
                                                                            </Table.Row >
                                                                        )
                                                                    )}
                                                                    {/* <Table.Pagination
                                                                        shadow
                                                                        noMargin
                                                                        align="center"
                                                                        rowsPerPage={3}
                                                                        onPageChange={(page) => console.log({ page })}
                                                                    /> */}
                                                                </Table.Body>
                                                            </Table>
                                                        ):(
                                                            <div className="text-center my-5">
                                                                Aucune demande de paiement en attente
                                                            </div>
                                                        )}
                                                    </div>
                                                {/* </form> */}
                                            </div>
                                        </div>
                                    </div>
                                <div className='col-lg-1 col-md-1'></div>
                            </div>
                        </div>
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
        <Modal show={showPayer} className="mt-15" onHide={handleClosePayer}>
            <Modal.Header closeButton className='bgColorGreen'>
                <Modal.Title className="text-white" >Validation de paiement</Modal.Title>                
            </Modal.Header>
            {/* <Form role="form" onSubmit={hant}> */}
                <Modal.Body>
                    <div className="input-group flex-nowrap">
                        <div className='col-lg-12 col-md-12 row justify-content-between'>
                            <div className='input-group-alternative my-3 '>
                                Voulez-vous confirmer le paiement de {currentAmount} {symbolStablecoin} à l'adresse de {currentnameEntreprise}
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="text-white" color="danger" onClick={handleClosePayer}>
                        Fermer
                    </Button>
                    <Button  type='button'  color="success" onClick={transferToEscrow} disabled={isLoggingIn}>
                        Payer
                        {isLoggingIn === true ? (<i className="fas fa-spinner fa-spin fa-lg mx-3"></i>) : ("")}

                    </Button>
                </Modal.Footer>
            {/* </Form> */}
        </Modal>
        {/* *****************************************FIN****************************************** */}
            







        </>
    );
};

export default PaiementPending;
