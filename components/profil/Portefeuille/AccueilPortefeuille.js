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
    const ADDRESS_CONTRAT_EWARI =process.env.NEXT_PUBLIC_ADDRESS_CONTRAT_EWARI
    const PRIVATE_KEY = process.env.NEXT_PUBLIC_PRIVATE_KEY

    
    const [currentUser, setCurrentUser] = useState();
    const [magicCurrentAddress, setMagicCurrentAddress] = useState();
    const [userMetadata, setUserMetadata] = useState("...");
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState();
    
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
    const [amountConvert, setAmountConvert] = useState()
    

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

    // Formulaire du Modal Transfert
    const [montantEnvoyer, setMontantEnvoyer] = useState(0);
    const [addressTo, setAddressTo] = useState();
    const [montantRecu, setMontantRecu] = useState(0);
    const [percent, setPercent] = useState(1);

    const [symbol, setSymbol] = useState();
    // Fin


    // Calcule des frais de transaction
    const frais = montantEnvoyer*percent/100
    const montantRecevoir =  montantEnvoyer - frais 
    // Fin

    // FONCTION POUR COPIER L'ADRESSE PUBLIC DE L'UTILISATEUR
    const copyToClipboard = () => {
        copy(magicCurrentAddress);
        setSuccessCopy("Adresse copiée avec succès !");

        setTimeout(() => {
        setSuccessCopy("");
        }, 1000)
    }
    // FIN

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

        try {
            
            const dataBody = {
                typeTransaction: "Transfert",
                activeName: nameStablecoin,
                activeSymbol: symbolStablecoin,
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
    const transferStablecoin = async () => {
        setIsLoggingIn(true);
        try {
            const tosting = String(montantEnvoyer);
            const amountWei = ethers.utils.parseUnits(tosting, decimalStablecoin);
            
            // Vérifier si magicCurrentAddress a suffisamment de fonds à transférer
            const balance = await contractStabl<ecoin.balanceOf(magicCurrentAddress);
            if (balance<montantEnvoyer) {
                // Afficher un message indiquant que magicCurrentAddress n'a pas suffisamment de fonds
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Erreur',
                    html: 'Vous n\'avez pas suffisamment de fonds pour effectuer cette transaction.',
                    showConfirmButton: false,
                    timer: 5000
                });
                setIsLoggingIn(false);
                return;
            }
            
            // Vérifier si l'exécuteur a suffisamment de frais de gas
            const gasEstimate = await contractStablecoin.estimateGas.metaTransfer(magicCurrentAddress, addressTo, amountWei);
            const gasCost = gasEstimate.mul(await provider.getGasPrice());
            const senderBalance = await signer.getBalance();

            if (gasCost>senderBalance) {
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
    

    
            // Effectuer la transaction
            const transferResult = await contractStablecoin.metaTransfer(magicCurrentAddress, addressTo, amountWei);
            await transferResult.wait();
            // Appel de la fonction d'ajout des données du transfert dans l'historique 
            addHistorical(transferResult.hash)
    
        } catch (error) {
            setIsLoggingIn(false);
            throw error;
        }
    }
    
    const handleSubmit = (e) => {
        e.preventDefault()
    }
  // Fin


    // FONCTION POUR RECUPERER TOUTES LES INFOS DE CONVERSION
    useEffect(() => {
        // Obtenir le token en cours
        const token = localStorage.getItem('tokenEnCours');
        const getInfosDistributer = async () => {
            try {
                const result = await fetch(`${API_URL}/api/conversion/find-all-conversion`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                });
    
                if (!result.ok) {
                    throw new Error('Failed to fetch user data');
                }
    
                const data = await result.json();
                // Choix de la devise (à remplacer par votre logique)
                // const currencyLocal = 'XOF'; // Remplacez cela par la logique de choix de votre devise
    
                // Filtrer les données en fonction de la devise choisie
                const filteredData = data.filter(item => item.currency === currencyLocal);
    
                // Appliquer la logique de multiplication si la devise est trouvée
                if (filteredData.length > 0) {
                    const exchangeRate = filteredData[0].exchangeRate;
                    // const balanceStablecoin = filteredData[0].balanceStablecoin;
                 
                    const result = exchangeRate * balanceStablecoinNoFormat;
                    setAmountConvert(formatNumber(result))
                    console.log('Résultat de la multiplication :', result);
                } else {
                    console.log('Aucune correspondance trouvée pour la devise sélectionnée.');
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
                                <h3 className='text-center'>Mon portefeuille numérique </h3>
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
                                                                <small className=" py-0 mx-2 px-0 btn btn-primary" onClick={handleTransfertShow}>
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
                                    <p className='text-right mb-0 text-white'>1000 0000 $</p>
                                </div>
                                {showWallet==1? (
                                <>
                                
                                        {/* Portefeuille crowdfunding */}
                                        
                                        {/* L'entête de tab*/}
                                        {/* <div className='row'> */}
                                            {/* <div className='col-lg-3 col-md-3'></div> */}
                                        <div className="bloc-tabs-utilite ">
                                            
                                            <button
                                                className={toggleState === 1 ? "tabs active-tabs gr-text-8 text-color-opacity" : "tabs gr-text-8 text-color-opacity"}
                                                onClick={() => toggleTab(1)}
                                                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                            >
                                                <span className=''>OPCVM</span>
                                                <p className='text-right mb-0 '>1000 0000 $</p>
                                                
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
                                Annuler
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
                                  Annuler
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
                              Annuler
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
                    Annuler
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
