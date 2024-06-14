import { useState, useEffect } from 'react';
import { Container, Row, Col, Modal } from "react-bootstrap";
import {Button,Form} from "reactstrap";

import React from "react";
import axios from 'axios';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import copy from "copy-to-clipboard"; 


// Pour Magic
import { magic } from "../../../../../magic";
import { ethers } from "ethers";
import Loading from "../../../../../components/loading";
import Router from "next/router";
import Swal from 'sweetalert2';
import Web3 from "web3";

// FIN

// Importer ABI de E-WARI
import ABI_TOKEN_EWARI from "../../../../../components/Contrats/Abi/AbiStablecoin.json";





const CompteEcommerce = () => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API
     // Variable de l'api key de stablecoin
     const API_KEY_STABLECOIN = process.env.NEXT_PUBLIC_API_KEY_STABLECOIN
    // Pour les smart contrats
    const ADDRESS_CONTRAT_EWARI = process.env.NEXT_PUBLIC_ADDRESS_CONTRAT_EWARI
    const PRIVATE_KEY = process.env.NEXT_PUBLIC_PRIVATE_KEY

    const [currentUser, setCurrentUser] = useState();
    const [isLoggingIn, setIsLoggingIn] = useState();
    const [provider, setProvider] = useState(null);
        
    // States du stablecoin
    const [nameStablecoin, setNameStablecoin] = useState();
    const [symbolStablecoin, setSymbolStablecoin] = useState();
    const [balanceStablecoin, setBalanceStablecoin] = useState();
    const [decimalStablecoin, setDecimalStablecoin] = useState();


    //states de la demande de stablecoin pour ecommerce
    const [partner, setPartner]=useState()
    const [siteLink, setSiteLink]=useState()
    const [productType, setProductType]=useState([])
    const [description, setDescription]=useState()
    const maxLength = 500; //Nombre de caractères maximum pour la description
    const [notificationLink, setNotificationLink] = useState()
    const [returnLink, setReturnLink] = useState()
    const [returnFailLink, setReturnFailLink] = useState()
    const [dataRequestUseStablecoinEshop, setDataRequestUseStablecoinEshop] =useState()



    // State du succès après avoir copié Api key
    const [successCopy, setSuccessCopy]=useState()

    // State du fichier du contrat signé à envoyer
    const [contractUnsigned, setContractUnsigned]=useState()

    
    // États pour gérer la visibilité des descriptions
    const [showDescription, setShowDescription] = useState({
        partner: false,
        siteLink: false,
        productType: false,
        notificationsLink: false,
        returnLink: false,
        returnFailLink: false,
        description: false
    });

    // Fonction pour basculer la visibilité des descriptions
    const toggleDescription = (field) => {
        setShowDescription((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    // Liste des types de produits disponibles
    const productOptions = [
        { value: 'Mode et accessoires', label: 'Mode et accessoires' },
        { value: 'Maison et jardin', label: 'Maison et jardin' },
        { value: 'Electronique et informatique', label: 'Électronique et informatique' },
        { value: 'Beaute et santé', label: 'Beauté et santé' },
        { value: 'Sports et loisirs', label: 'Sports et loisirs' },
        { value: 'Alimentation et épicerie', label: 'Alimentation et épicerie' },
        { value: 'Jouets et jeux pour enfants', label: 'Jouets et jeux pour enfants' },
        { value: 'Livres, musique et films', label: 'Livres, musique et films' },
        { value: 'Animaux de compagnie', label: 'Animaux de compagnie' },
        { value: 'Automobiles et motos', label: 'Automobiles et motos' },
        { value: 'Bricolage ', label: 'Bricolage ' },
        { value: 'Voyages et bagages', label: 'Voyages et bagages' },
        { value: 'Art et objets de collection', label: 'Art et objets de collection' },
        { value: 'High-tech et gadgets', label: 'High-Tech et gadgets' },
        { value: 'Equipement professionnel ', label: 'Équipement professionnel' },
        { value: 'Produits reconditionnés ', label: 'Produits reconditionnés' },
        { value: 'Santé et équipement médical', label: 'Équipement médical' },
        { value: 'Autres', label: 'Autres' },
    ];
    
  
    // Gestionnaire de changement pour les cases à cocher
    const handleCheckboxChange = (event) => {
        const { value, checked } = event.target;
        const newProductTypes = checked
        ? [...productType, value] // Ajouter à la sélection
        : productType.filter((type) => type !== value); // Retirer de la sélection
    
        setProductType(newProductTypes);
    };

    /**
     * État de contrôle pour afficher ou masquer la modal du formulaire de réponse à la demande d'accès.
     * @type {boolean}
    */
     const [showForm, setShowForm] = useState(false);

     /**
      * Fonction pour fermer la modal du formulaire.
      * @function
      * @returns {void}
      */
     const handleCloseForm = () => setShowForm(false);
 
     /**
      * Fonction pour afficher la modal du formulaire.
      * @function
      * @returns {void}
      */
     const handleShowForm = () => setShowForm(true);


    
    useEffect(() => {

        if (!!magic) {
            const pt = new ethers.providers.Web3Provider(magic.rpcProvider);
            setProvider(pt);
        }
    }, [magic]);

    // RECUPERATION DES INFORMATIONS QUI CONCERNENT MAGIC
    useEffect(() => {
        (async () => {
            if (!!magic && !!provider) {
              const userMetadatas = await magic.user.getMetadata();
              const signer = provider.getSigner();
              const network = await provider.getNetwork();
              const userAddress = await signer.getAddress();
              //const userBalance = ethers.utils.formatEther(await provider.getBalance(userAddress))
              // FIN

            //   SIGNE AVEC LA CLE PRIVEE
              const walletRelay = new ethers.Wallet(PRIVATE_KEY, provider);

              // *************************************************************************
                    // INTERACTION AVEC LE SMART CONTRAT DE STABLECOIN
                // *************************************************************************

                const contractStablecoin = new ethers.Contract(ADDRESS_CONTRAT_EWARI,ABI_TOKEN_EWARI.abi,walletRelay);
                
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
                // setBalanceStablecoin(formatNumber(balanceStablecoin/10**decimalStablecoin))


              // Obtenir un utilisateur en fonction de son email 
              const getUser = async () => {
                const result = await fetch(`${API_URL}/api/user/find-user-by-email?email=${userMetadatas?.email}`, {
                    headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': `${API_KEY_STABLECOIN}`,
                    },
                })
                  .then((result) => result.json())
                  .then((user) => {
                  setCurrentUser(user)
                  }) 
              };
              await getUser();
              // Fin
            }
        })();
    }, [provider, magic]);
    //  Fin


    // POUR DEFINIR LE NOMBRE DE CARACTERE RESTANT POUR LA DESCRIPTION
    const handleChange = (event) => {
        const value = event.target.value;
        if (value.length <= maxLength) {
          setDescription(value);
        }
      };

    // FONCTION DE LA DEMANDE D'UTILISATION DE STABLECOIN COMME MOYEN DE PAIEMENT SUR ECOMMERCE
    const requestUseStablecoinOnEshop= async(event) =>{
        event.preventDefault();
        setIsLoggingIn(true)
        
        const requestBody = {
            partner: partner,
            siteLink: siteLink,
            productType: productType,
            description: description,
            notificationLink: notificationLink,
            returnLink: returnLink,
            returnFailLink: returnFailLink,
            activeName:nameStablecoin,
            activeSymbol:symbolStablecoin
        }

        console.log("requestBody=>", requestBody)
        // return
        // Obtenir le token en cours
        const token = localStorage.getItem('tokenEnCours');

        const result = await fetch(`${API_URL}/api/apikey/generate-apikey`, {
            method:"POST",
            body: JSON.stringify(requestBody),
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
                icon: 'success',
                html: "<p> Votre demande a été envoyée avec succès.<br/> Merci de patienter le temps que le traitement de votre demande finisse.</p>" ,
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
                html: "<p>  Votre demande a échoué. </p>" ,
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

    // FONCTION DE LA DEMANDE D'UTILISATION DE STABLECOIN COMME MOYEN DE PAIEMENT SUR ECOMMERCE
    const updateRequestUseStablecoinOnEshop= async(event) =>{
        event.preventDefault();
        setIsLoggingIn(true)
            
        
        const requestBody = {
            partner: partner,
            siteLink: siteLink,
            productType: productType,
            description: description,
            notificationLink: notificationLink,
            returnLink: returnLink,
            returnFailLink: returnFailLink,
            activeName:nameStablecoin,
            activeSymbol:symbolStablecoin
        }

        console.log("requestBody=>", requestBody)
        // return
        // Obtenir le token en cours
        const token = localStorage.getItem('tokenEnCours');
        const result = await fetch(`${API_URL}/api/apikey/update-generate-apikey/${dataRequestUseStablecoinEshop?.id}`, {
            method:"PUT",
            body: JSON.stringify(requestBody),
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
                icon: 'success',
                html: "<p> Votre demande a été renvoyée avec succès.<br/> Merci de patienter le temps que le traitement de votre demande finisse.</p>" ,
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
                html: "<p>  Votre demande a échoué. </p>" ,
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

             
    
     // Pour uploader le fichier du contrat
     const handleFileChange = (event) => {
        setContractUnsigned(event.target.files[0]);
    };

    // Fonction pour envoyer le contrat signé à WTI
    const sendContractSigned = async () => {
        setIsLoggingIn(true);

        if (!contractUnsigned) {
            setUploadStatus('Vous devez sélectionner un fichier.');
            return;
            }
    
            

        try {
            const formData = new FormData();
            formData.append('contract', contractUnsigned);

            // Obtenir le token en cours
            const token = localStorage.getItem('tokenEnCours');
            /**
             * Réponse de la requête.
             * @type {Response}
             */
            const response = await fetch(`${API_URL}/api/apikey/sign-contract-for-eshop/${dataRequestUseStablecoinEshop?.id}`, {
                method: 'PUT',
                body: formData,
                headers: {
                    // 'Content-Type': 'application/json',
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
            if (data.message===200) {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    html: `<p> Vous avez envoyé le contrat signé à Wealthtech Innovations avec succès.</p>`,
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
     * Hook d'effet pour récupérer et définir la demande d'utilisation de stablecoin sur ecommerce de l'utilisateur connecté.
     * @returns {void}
     */
     useEffect(() => {
        const token = localStorage.getItem('tokenEnCours');
    
        /**
         * Fonction pour obtenir la demande d'utilisation de stablecoin sur ecommerce de l'utilisateur connecté.
         * @returns {void}
         */
        const getDataRequestUseStablecoinEshop = async () => {
            try {
                const result = await fetch(`${API_URL}/api/apikey/find-request-use-stablecoin-for-eshop-of-user`, {
                    headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': `${API_KEY_STABLECOIN}`,
                        Authorization: `Bearer ${token}`,
                    },
                });
    
                if (!result.ok) {
                    throw new Error("Échec de la récupération des données pour l'utilisation du stablecoin sur le commerce électronique");
                }
    
                const data = await result.json();
                setDataRequestUseStablecoinEshop(data);
            } catch (error) {
                console.error("Erreur lors de la récupération des données pour l'utilisation de stablecoin sur le commerce électronique:", error.message);
                // Handle the error as needed
            }
        };
    
        getDataRequestUseStablecoinEshop();
    }, []);
    
    // FIN

    // FONCTION POUR COPIER L'ADRESSE PUBLIC DE L'UTILISATEUR
    const copyToClipboard = () => {
        copy(dataRequestUseStablecoinEshop?.key);
        setSuccessCopy("Adresse copiée avec succès !");

        setTimeout(() => {
        setSuccessCopy("");
        }, 1000)
    }
    // FIN

  return (
    <>

      <div className='' >
        {/* <div className=' mx-15'> */}
            <div className=''>
                <h3 className='text-center'>Stablecoin comme moyen de paiement E-commerce</h3>
            </div>
        {/* </div> */}

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
                        <div className='currency-selection '>
                            <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                                <div className='cryptocurrency-slides'>
                                    <div className='single-cryptocurrency-box'>
                                        {/* Le corps de tab */}
                                        <div className="content-tabs">
                                            
                                                <div className='cryptocurrency-search-box'>
                                                {dataRequestUseStablecoinEshop?.allow==0? (
                                                        <div className='colorBlue text-center'>Votre demande est en cours de traitement</div>
                                                    ):dataRequestUseStablecoinEshop?.allow==1 && dataRequestUseStablecoinEshop?.validContract==0?(
                                                        <div className='row'>
                                                            <div className='single-cryptocurrency-box col-lg-6 col-md-6'>
                                                                <div className=''>
                                                                    Vous avez reçu un contrat que vous devez télécharger, signer et renvoyer pour vérification.
                                                                </div>

                                                                <div className='btn-box'>
                                                                    <a 
                                                                        href={`${API_URL}/${dataRequestUseStablecoinEshop?.contract}`} 
                                                                        download
                                                                        target="_blank"
                                                                    >
                                                                        <Button
                                                                            block
                                                                            color="primary"
                                                                            type="button"
                                                                        >
                                                                            Télécharger 
                                                                        </Button>
                                                                    </a>
                                                                </div>
                                                            </div>
                                                            <div className='single-cryptocurrency-box col-lg-6 col-md-6'>
                                                            <div className=''>
                                                                    Si vous avez fini de télécharger et signer le contrat, merci de cliquer sur le bouton ci-dessous pour l'envoyer.
                                                                </div>

                                                                <div className='btn-box'>
                                                                    <Button
                                                                        block
                                                                        color="primary"
                                                                        type="button"
                                                                        onClick={handleShowForm}

                                                                    >
                                                                        Envoyer 
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ):dataRequestUseStablecoinEshop?.allow==1 && dataRequestUseStablecoinEshop?.validContract==1?(
                                                        <div className='colorRed text-center'>Vous avez signé et envoyé le contrat, Merci de patienter le temps que la vérification finisse. </div>
                                                    ):dataRequestUseStablecoinEshop?.allow==1 && dataRequestUseStablecoinEshop?.validContract==2? (
                                                        // <div className='colorGreen text-center'>Félicitations, votre demande a été acceptée. </div>
                                                        // <h3>Félicitations, votre demande a été acceptée. Vous pouvez télécharger le contrat final</h3>
                                                        <div className='single-cryptocurrency-box'>
                                                            <div className='title'>
                                                               Félicitations, votre demande a été acceptée. Vous pouvez télécharger le contrat final.
                                                            </div>
                                                            <div className='title'>
                                                                <b>Voici votre Api key:</b><br/>
                                                                
                                                                <button>{dataRequestUseStablecoinEshop?.key}<Icon onClick={copyToClipboard} icon="bx:copy"  width="30" /></button>
                                                                <p className="gr-text-8 pt-3 pb-0 text-center colorGreen">{successCopy} </p>

                                                            </div>
                                                            <div className='btn-box'>
                                                                <a 
                                                                    href={`${API_URL}/${dataRequestUseStablecoinEshop?.contract}`} 
                                                                    download
                                                                    target="_blank"
                                                                >
                                                                    <Button
                                                                        block
                                                                        color="primary"
                                                                        type="button"
                                                                    >
                                                                        Télécharger contrat final
                                                                    </Button>
                                                                </a>
                                                            </div>
                                                        </div>
                                                        
                                                    ):(
                                                        <>

                                                        {dataRequestUseStablecoinEshop?.allow==2? (
                                                        <>
                                                            <div className='colorRed text-center'>Desolé, votre demande a été rejetée, Merci de renvoyer votre demande.</div>
                                                            <div className='colorRed text-center mb-3'>
                                                                <b>Voici la raison:</b>
                                                                {dataRequestUseStablecoinEshop?.reason}
                                                            </div>
                                                        </>
                                                        ):""}
                                                    


                                                        <p className='text-center colorRed'><b>NB:</b> Merci de cliquer sur le bouton <b>Détails</b> de chaque champ pour voir son explication. </p>

                                                        <form onSubmit={dataRequestUseStablecoinEshop?.allow==2 ? updateRequestUseStablecoinOnEshop: requestUseStablecoinOnEshop} className="row">
                                                        {/* Nom de la boutique e-commerce */}
                                                        <div className="form-group my-6 ">
                                                          <div className="d-flex justify-content-between my-1">
                                                            <label htmlFor="partner" className="mt-3">
                                                              Nom de la boutique e-commerce <sup className="colorRed">*</sup>
                                                            </label>
                                                            <button type="button" onClick={() => toggleDescription('partner')} className=" bgColorblue text-white btn-sm ">
                                                              {showDescription.partner ? 'Fermer' : 'Détails'}
                                                            </button>
                                                          </div>
                                                            {showDescription.partner && <p>Ce champ collecte le nom officiel de la boutique en ligne. il identifie la configuration du paiement.</p>}
                                                            <div className="input-group flex-nowrap">
                                                                <input
                                                                    className="form-control gr-text-11 border bg-white"
                                                                    type="text"
                                                                    id="partner"
                                                                    placeholder="Nom de la boutique e-commerce"
                                                                    required
                                                                    defaultValue={partner} 
                                                                    onChange={(event)=>setPartner(event.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                  
                                                        {/* Lien du site e-commerce */}
                                                        <div className="form-group my-6">
                                                          <div className="d-flex justify-content-between my-1">
                                                            <label htmlFor="siteLink" className="mt-3">
                                                              Lien de votre site e-commerce <sup className="colorRed">*</sup>
                                                            </label>
                                                            <button type="button" onClick={() => toggleDescription('siteLink')} className="bgColorblue text-white btn-sm ">
                                                              {showDescription.siteLink ? 'Fermer' : 'Détails'}
                                                            </button>
                                                          </div>
                                                            {showDescription.siteLink && <p>L'URL de votre site e-commerce où la solution de paiement sera intégrée.</p>}
                                                            <div className="input-group flex-nowrap">
                                                                <input
                                                                    className="form-control gr-text-11 border bg-white"
                                                                    type="text"
                                                                    id="siteLink"
                                                                    placeholder="Lien de votre site e-commerce"
                                                                    required
                                                                    defaultValue={siteLink} 
                                                                    onChange={(event)=>setSiteLink(event.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                  
                                                        {/* Lien de notifications */}
                                                        <div className="form-group my-6">
                                                          <div className="d-flex justify-content-between my-1">
                                                            <label htmlFor="notificationsLink" className="mt-3">
                                                              Endpoint de notifications (URL de webhook)  <sup className="colorRed">*</sup>
                                                            </label>
                                                            <button type="button" onClick={() => toggleDescription('notificationsLink')} className="bgColorblue text-white btn-sm ">
                                                              {showDescription.notificationsLink ? 'Fermer' : 'Détails'}
                                                            </button>
                                                          </div>
                                                            {showDescription.notificationsLink && 
                                                            <p>URL webhook pour les notifications de paiement. Il permet de traiter les transactions en temps réel.Ce lien doit pointer vers un endpoint spécifique sur le serveur du marchand capable de traiter ces notifications, comme illustré par la fonction 
                                                                <a 
                                                                    href={`/pdf/code-notification.pdf`} 
                                                                    target="_blank"
                                                                    className='px-1'
                                                                >
                                                                     paymentNotification
                                                                </a> dans votre backend. Cela permet au système e-commerce de mettre à jour automatiquement le statut des commandes en fonction des résultats des transactions.</p>}
                                                            <div className="input-group flex-nowrap">
                                                                <input
                                                                    className="form-control gr-text-11 border bg-white"
                                                                    type="text"
                                                                    id="notificationsLink"
                                                                    placeholder="Lien de notifications"
                                                                    required
                                                                    defaultValue={notificationLink} 
                                                                    onChange={(event)=>setNotificationLink(event.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                  
                                                        {/* Lien du retour de succès */}
                                                        <div className="form-group my-6">
                                                          <div className="d-flex justify-content-between my-1">
                                                            <label htmlFor="returnLink" className="mt-3">
                                                              Lien du retour de succès <sup className="colorRed">*</sup>
                                                            </label>
                                                            <button type="button" onClick={() => toggleDescription('returnLink')} className="bgColorblue text-white btn-sm ">
                                                              {showDescription.returnLink ? 'Fermer' : 'Détails'}
                                                            </button>
                                                          </div>
                                                            {showDescription.returnLink && <p>URL de redirection après un paiement réussi. Généralement une page de confirmation.</p>}
                                                            <div className="input-group flex-nowrap">
                                                                <input
                                                                    className="form-control gr-text-11 border bg-white"
                                                                    type="text"
                                                                    id="returnLink"
                                                                    placeholder="Lien du retour"
                                                                    required
                                                                    defaultValue={returnLink} 
                                                                    onChange={(event)=>setReturnLink(event.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                  
                                                        {/* Lien du retour d'échec */}
                                                        <div className="form-group my-6">
                                                          <div className="d-flex justify-content-between my-1">
                                                            <label htmlFor="returnFailLink" className="mt-3">
                                                              Lien du retour d'échec <sup className="colorRed">*</sup>
                                                            </label>
                                                            <button type="button" onClick={() => toggleDescription('returnFailLink')} className="bgColorblue text-white btn-sm ">
                                                              {showDescription.returnFailLink ? 'Fermer' : 'Détails'}
                                                            </button>
                                                          </div>
                                                            {showDescription.returnFailLink && <p>URL de redirection en cas d'échec du paiement. Informe l'utilisateur de l'échec.</p>}
                                                            <div className="input-group flex-nowrap">
                                                                <input
                                                                    className="form-control gr-text-11 border bg-white"
                                                                    type="text"
                                                                    id="returnFailLink"
                                                                    placeholder="Lien du retour"
                                                                    required
                                                                    defaultValue={returnFailLink} 
                                                                    onChange={(event)=>setReturnFailLink(event.target.value)}
                                                                />
                                                            </div>
                                                        </div>

                                                         {/* Types de produit */}
                                                         <div className="form-group my-6">
                                                            <div className="d-flex justify-content-between my-1">
                                                                <label htmlFor="productType" className="mt-3">
                                                                Types de produit <sup className="colorRed">*</sup>
                                                                </label>
                                                                <button type="button" onClick={() => toggleDescription('productType')} className="bgColorblue text-white btn-sm ">
                                                                {showDescription.productType ? 'Fermer' : 'Détails'}
                                                                </button>
                                                            </div>
                                                            {showDescription.productType && <p>Description des types de produits vendus. Ce champ aide à adapter la solution de paiement.</p>}
                                                            <div className='row'>
                                                                {productOptions.map((option, index) => (
                                                                <div className="" key={option.value}>
                                                                    <input
                                                                    type="checkbox"
                                                                    id={option.value}
                                                                    value={option.value}
                                                                    checked={productType.includes(option.value)}
                                                                    onChange={handleCheckboxChange}
                                                                    />
                                                                    <label htmlFor={option.value}>{option.label}</label>
                                                                </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                  
                                                        {/* Description du site */}
                                                        <div className="form-group my-3 col-12">
                                                          <div className="d-flex justify-content-between my-1">
                                                            <label className="mx-2 mb-2" htmlFor='description'>
                                                              Veuillez décrire votre site e-commerce({!description?.length ? maxLength:maxLength - description?.length} caractères restants)
                                                            </label>
                                                            <button type="button" onClick={() => toggleDescription('description')} className="bgColorblue text-white btn-sm ">
                                                              {showDescription.description ? 'Fermer' : 'Détails'}
                                                            </button>
                                                          </div>
                                                            {showDescription.description && <p>Description détaillée du site e-commerce. Fournit contexte et informations supplémentaires pour l'intégration.</p>}
                                                            <textarea
                                                                className="form-control gr-text-11 border  bg-white"
                                                                type="text"
                                                                id="desription"
                                                                rows={7}
                                                                maxLength={maxLength} // Empêche de saisir plus de 500 caractères
                                                                placeholder="Description"
                                                                defaultValue={description} 
                                                                onChange={handleChange}
                                                                // onChange={(event)=>setDescription(event.target.value)}
                                                            />
                                                        </div>
                                                  
                                                        {/* Bouton de soumission */}
                                                        <div className="form-group col-12">
                                                          <button type="submit" className='btn btn-primary mt-3'>
                                                            Envoyer
                                                          </button>
                                                        </div>
                                                      </form>
                                                      </>

                                                    )}
                                                </div>
                                            {/* Fin portefeuille crowdfunding*/}
                                        </div>
                                        {/* Fin le corps de tab */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-lg-1 col-md-1'></div>
                </div>
            </div>
       
      </div>


            {/* ********************************************************************************** */}
                {/* MODAL D'ENVOIE DU CONTRAT*/}
            {/* ********************************************************************************** */}
            <Modal show={showForm} className="mt-15" onHide={handleCloseForm}>
                <Modal.Header closeButton id="bgcolor">
                    <Modal.Title className="" >Envoie du contrat</Modal.Title>                
                </Modal.Header>
                    <form>
                    <Modal.Body>
                        <div className='form-group my-3'>
                            Veuillez envoyer le contrat signé à Wealthtech.
                        </div>
                        <input type="file" onChange={handleFileChange} accept=".pdf" />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className="text-white" color="danger" onClick={handleCloseForm}>
                            Fermer
                        </Button>
                        <Button  onClick={sendContractSigned}  color="success" disabled={isLoggingIn}>
                            Envoyer
                            {isLoggingIn === true ? (<i className="fas fa-spinner fa-spin fa-lg mx-2"></i>) : ("")}
                        </Button>
                    </Modal.Footer>
                    </form>
            </Modal>
            {/* *****************************************FIN****************************************** */}

           

    </>
  );
};

export default CompteEcommerce;
