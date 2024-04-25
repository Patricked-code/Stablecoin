import { useState, useEffect, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
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





const OuvertureBoutik = () => {
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


    //states de la demande de stablecoin 
    const [shopName, setShopName]=useState()
    const [shopContact, setShopContact]=useState()
    const [productType, setProductType]=useState([])
    const [openingTime, setOpeningTime]=useState()
    const [closingTime, setClosingTime]=useState()
    const [openingTimeSaturday, setOpeningTimeSaturday]=useState()
    const [closingTimeSaturday, setClosingTimeSaturday]=useState()
    const [openingTimeSunday, setOpeningTimeSunday]=useState()
    const [closingTimeSunday, setClosingTimeSunday]=useState()
    const [altitude, setAltitude]=useState()
    const [longitude, setLongitude]=useState()
    const [partnerWithdrawal, setPartnerWithdrawal]=useState()
    const [eshopWti, setEshopWti]=useState()
    const [description, setDescription]=useState()
    const maxLength = 500; //Nombre de caractères maximum pour la description
    const [workingDays, setWorkingDays] = useState([]);
    const [withdrawalAmount, setWithdrawalAmount] = useState('');
    const [serviceType, setServiceType] = useState([]);
    
    const [dataRequestUseStablecoin, setDataRequestUseStablecoin] =useState()


    
    // State du succès après avoir copié Api key
    const [successCopy, setSuccessCopy]=useState()

    // State du fichier du contrat signé à envoyer
    const [contractUnsigned, setContractUnsigned]=useState()

    
    
    // État pour contrôler l'affichage des descriptions
    const [showDescription, setShowDescription] = useState({
        shopName: false,
        shopContact:false,
        productType: false,
        openingTime: false,
        closingTime: false,
        openingTimeSaturday: false,
        closingTimeSaturday: false,
        openingTimeSunday: false,
        closingTimeSunday: false,
        altitude: false,
        longitude: false,
        partnerWithdrawal: false,
        workingDays:false,
        withdrawalAmount:false,
        serviceType: false,
        eshopWti: false,
        description: false,
    });

    // Gestion du basculement de l'affichage des descriptions
    const toggleDescription = (field) => {
        setShowDescription(prevState => ({...prevState, [field]: !prevState[field]}));
    };

    // Liste des types de produits disponibles
    const productOptions = [
        { value: 'Restauration et hôtellerie', label: 'Restauration et hôtellerie' },
        { value: 'Immobilier', label: 'Immobilier' },
        { value: 'Transports et logistique', label: 'Transports et logistique' },
        { value: 'Santé et bien-être', label: 'Santé et bien-être' },
        { value: 'Éducation et formation', label: 'Éducation et formation' },
        { value: 'Tourisme et loisirs', label: 'Tourisme et loisirs' },
        { value: 'Art et culture', label: 'Art et culture' },
        { value: 'Produits agricoles et alimentaires', label: 'Produits agricoles' },
        { value: 'Mode et accessoires', label: 'Mode et accessoires' },
        { value: 'Bricolage et amélioration de l\'habitat', label: 'Bricolage ' },
        { value: 'Automobiles et motos', label: 'Automobiles et motos' },
        { value: 'Lavage auto', label: 'Lavage auto' },
        { value: 'Garagiste', label: 'Garagiste' },
        { value: 'Supermarchés ', label: 'Supermarchés' },
        { value: 'Librairies et papeteries', label: 'Librairies et papeteries' },
        { value: 'Magasins de produits électroniques', label: 'Magasins électroniques' },
        { value: 'Magasins de jeux et jouets', label: 'Magasins de jeux' },
        { value: 'Boutiques de sport et équipements de loisirs', label: 'Boutiques de sport ' },
        { value: 'Boutiques de cadeaux et artisanat', label: 'Boutiques artisanat' },
        { value: 'Centres commerciaux', label: 'Centres commerciaux' },
        { value: 'Boutique', label: 'Boutique' },
        { value: 'Services de réparation et d\'entretien', label: 'Services de réparation' },
        { value: 'Cinémas et théâtres', label: 'Cinémas et théâtres' },
        { value: 'Concerts et événements', label: 'Concerts et événements' },
        { value: 'Cafés et boulangeries', label: 'Cafés et boulangeries' },
        { value: 'Bars et clubs', label: 'Bars et clubs' },
        { value: 'Agences de voyage et services de réservation', label: 'Agences de voyage ' },
        { value: 'Pharmacies et parapharmacies', label: 'Pharmacies ' },
        { value: 'Magasins de meubles et décoration d\'intérieur', label: 'Magasins de meubles' },
        { value: 'Services de coiffure et esthétique', label: 'Services de coiffure' },
        { value: 'Services de nettoyage et d\'entretien', label: 'Services de nettoyage ' },
        { value: 'Autres', label: 'Autres' },
    ];
    
    // Liste des types de produits disponibles
    const workingDaysOptions = [
        { value: 'Lundi', label: 'Lundi' },
        { value: 'Mardi', label: 'Mardi' },
        { value: 'Mercredi', label: 'Mercredi' },
        { value: 'Jeudi', label: 'Jeudi' },
        { value: 'Vendredi', label: 'Vendredi' },
        { value: 'Samedi', label: 'Samedi' },
        { value: 'Dimanche', label: 'Dimanche' },
        
    ];

    // Liste des types de services disponibles
    const serviceOptions = [
        { value: 'Dépôt', label: 'Dépôt' },
        { value: 'Retrait', label: 'Retrait' },
    ];
    
  
    // Gestionnaire de changement pour les cases à cocher
    const handleCheckboxChange = (event) => {
        const { value, checked } = event.target;
        const newProductTypes = checked
        ? [...productType, value] // Ajouter à la sélection
        : productType.filter((type) => type !== value); // Retirer de la sélection
    
        setProductType(newProductTypes);
    };


    // Gestionnaire de changement pour les cases à cocher pour les jours ouvrables
    const handleCheckboxChangeWorkingDays = (event) => {
        const { value, checked } = event.target;
        const newWorkingDays = checked
        ? [...workingDays, value] // Ajouter à la sélection
        : workingDays.filter((type) => type !== value); // Retirer de la sélection
    
        setWorkingDays(newWorkingDays);
    };
    
    // Déterminez si au moins un jour du Lundi au Vendredi est sélectionné
    const isWeekdaySelected = workingDays.some(day => ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'].includes(day));



    // Gestionnaire de changement pour les cases à cocher des services d'agence
    const handleCheckboxChangeService = (event) => {
        const { value, checked } = event.target;
        const newServiceTypes = checked
        ? [...serviceType, value] // Ajouter à la sélection
        : serviceType.filter((type) => type !== value); // Retirer de la sélection
    
        setServiceType(newServiceTypes);
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

    // FONCTION DE LA DEMANDE D'UTILISATION DE STABLECOIN COMME MOYEN DE PAIEMENT
    const requestUseStablecoin= async(event) =>{
        event.preventDefault();
        setIsLoggingIn(true)
        
        const dataa = {
            shopName:shopName,
            shopContact:shopContact,
            productType: productType,
            openingTime:openingTime,
            closingTime:closingTime,
            openingTimeSaturday:openingTimeSaturday,
            closingTimeSaturday:closingTimeSaturday,
            openingTimeSunday:openingTimeSunday,
            closingTimeSunday:closingTimeSunday,
            altitude:altitude,
            longitude:longitude,
            activeName:nameStablecoin,
            activeSymbol:symbolStablecoin,
            partnerWithdrawal:partnerWithdrawal,
            workingDays:workingDays,
            withdrawalAmount:withdrawalAmount,
            serviceType:serviceType,
            eshopWti:eshopWti,
            description:description,
        }
        
        // Obtenir le token en cours
        const token = localStorage.getItem('tokenEnCours');
        if (altitude&&longitude) {
            const result = await fetch(`${API_URL}/api/payment-request/add-of-request-use-stablecoin`, {
                method:"POST",
                body: JSON.stringify(dataa),
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
        }else{
            Swal.fire({
                position: 'center',
                icon: 'error',
                html: "<p> Désolé, vous devez indiquer la position de votre commerce en cliquant sur le bouton <b>Localiser commerce</b>.</p>" ,
                showConfirmButton: false,
                timer: 10000
            })
        }
    }
    // FIN

    // FONCTION DE LA MISE A JOUR DE LA DEMANDE D'UTILISATION DE STABLECOIN COMME MOYEN DE PAIEMENT
    const updateRequestUseStablecoin= async(event) =>{
        event.preventDefault();
        setIsLoggingIn(true)
        // shopContact openingTimeSaturday closingTimeSaturday openingTimeSunday closingTimeSunday
        const dataa = {
            shopName:shopName,
            shopContact:shopContact,
            productType: productType,
            openingTime:openingTime,
            closingTime:closingTime,
            openingTimeSaturday:openingTimeSaturday,
            closingTimeSaturday:closingTimeSaturday,
            openingTimeSunday:openingTimeSunday,
            closingTimeSunday:closingTimeSunday,
            altitude:altitude,
            longitude:longitude,
            activeName:nameStablecoin,
            activeSymbol:symbolStablecoin,
            partnerWithdrawal:partnerWithdrawal,
            workingDays:workingDays,
            withdrawalAmount:withdrawalAmount,
            eshopWti:eshopWti,
            eshopWti:eshopWti,
            description:description,
        }
        
        // Obtenir le token en cours
        const token = localStorage.getItem('tokenEnCours');
        if (altitude&&longitude) {
            const result = await fetch(`${API_URL}/api/payment-request/update-of-request-use-stablecoin/${dataRequestUseStablecoin?.id}`, {
                method:"PUT",
                body: JSON.stringify(dataa),
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': `${API_KEY_STABLECOIN}`,
                    Authorization:  `Bearer ${token}`
                }
            })
            .then(res=>{
                console.log("res=>",res)
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
        }else{
            Swal.fire({
                position: 'center',
                icon: 'error',
                html: "<p> Désolé, vous devez indiquer la position de votre commerce en cliquant sur le bouton <b>Localiser commerce</b>.</p>" ,
                showConfirmButton: false,
                timer: 10000
            })
        }
    }
    // FIN


    

    // Configuration de base de la carte
const mapContainerStyle = {
    height: "400px",
    width: "800px",
  };
  
  const center = {
    lat: -3.745,
    lng: -38.523,
  };
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
    const [location, setLocation] = useState(null);
    const [showRestFields, setShowRestFields] = useState();

    // FONCTION POUR RECUPERER LA POSITION GEAGRAPHIQUE DE L'UTILISATEUR
    const getLocation = () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
        //     setAltitude(position.coords.latitude.toString());
        //     setLongitude(position.coords.longitude.toString());
        // setLocation({ lat: altitude, lng: longitude });
        const { latitude, longitude } = position.coords;
        setAltitude(latitude);
        setLongitude(longitude);
        setShowRestFields(0)
        console.log("latitude=>",latitude)
        console.log("longitude=>",longitude)
        setLocation({ lat: latitude, lng: longitude });

            Swal.fire(
              'Position récupérée!',
              'Les coordonnées de votre commerce ont été mises à jour.',
              'success'
            );
          }, (error) => {
            console.error("Erreur lors de la récupération de la position : ", error);
            Swal.fire(
              'Erreur!',
              'Impossible de récupérer votre position. Assurez-vous d\'avoir autorisé l\'accès à la localisation.',
              'error'
            );
          });
        } else {
          console.error("La géolocalisation n'est pas prise en charge par ce navigateur.");
          Swal.fire(
            'Non supporté',
            'La géolocalisation n\'est pas prise en charge par votre navigateur.',
            'error'
          );
        }
    };
    
             
    
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
            const response = await fetch(`${API_URL}/api/payment-request/sign-contract-for-shop/${dataRequestUseStablecoin?.id}`, {
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
            setIsLoggingIn(false);

            console.error('Erreur =>', error);
        }
    };



     /**
     * Hook d'effet pour récupérer et définir la demande d'utilisation de stablecoin de l'utilisateur connecté.
     * @returns {void}
    */
      useEffect(async () => {
        const token = localStorage.getItem('tokenEnCours');
    
        /**
         * Fonction pour obtenir la demande d'utilisation de stablecoin de l'utilisateur connecté.
         * @returns {void}
         */
        const getDataRequestUseStablecoin = async () => {
            const result = await fetch(`${API_URL}/api/payment-request/find-request-use-stablecoin-of-user`, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': `${API_KEY_STABLECOIN}`,
                    Authorization: `Bearer ${token}`,
                },
            });
    
            if (!result.ok) {
                throw new Error('Failed to fetch data');
            } else {
                // Vérifier si la réponse n'est pas vide avant de la parser en JSON
                const text = await result.text();
                const data = text ? JSON.parse(text) : null;
    
                setDataRequestUseStablecoin(data);
            }
        };
    
        await getDataRequestUseStablecoin();
    }, []);
    // FIN

    // FONCTION POUR COPIER L'ADRESSE PUBLIC DE L'UTILISATEUR
    const copyToClipboard = () => {
        copy(dataRequestUseStablecoin?.key);
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
                <h3 className='text-center'>Stablecoin comme moyen de paiement dans commerce</h3>
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
                    <div className='col-lg-2 col-md-2'></div>
                    <div className='col-lg-8 col-md-8'>
                        <div className='currency-selection '>
                            <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                                <div className='cryptocurrency-slides'>
                                    <div className='single-cryptocurrency-box'>
                                        {/* Le corps de tab */}
                                        <div className="content-tabs">
                                            
                                                <div className='cryptocurrency-search-box'>
                                                {dataRequestUseStablecoin?.allow==0? (
                                                        <div className='colorBlue text-center'>Votre demande est en cours de traitement</div>
                                                    ):dataRequestUseStablecoin?.allow==1 && dataRequestUseStablecoin?.validContract==0?(
                                                        <div className='row'>
                                                            <div className='single-cryptocurrency-box col-lg-6 col-md-6'>
                                                                <div className=''>
                                                                    Vous avez reçu un contrat que vous devez télécharger, signer et renvoyer pour vérification.
                                                                </div>

                                                                <div className='btn-box'>
                                                                    <a 
                                                                        href={`${API_URL}/${dataRequestUseStablecoin?.contract}`} 
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
                                                    ):dataRequestUseStablecoin?.allow==1 && dataRequestUseStablecoin?.validContract==1?(
                                                        <div className='colorRed text-center'>Vous avez signé et envoyé le contrat, Merci de patienter le temps que la vérification finisse. </div>
                                                    ):dataRequestUseStablecoin?.allow==1 && dataRequestUseStablecoin?.validContract==2? (
                                                        // <div className='colorGreen text-center'>Félicitations, votre demande a été acceptée. </div>
                                                        // <h3>Félicitations, votre demande a été acceptée. Vous pouvez télécharger le contrat final</h3>
                                                        <div className='single-cryptocurrency-box'>
                                                            <div className='title'>
                                                               Félicitations, votre demande a été acceptée. Vous pouvez télécharger le contrat final.
                                                            </div>
                                                            
                                                            <div className='btn-box'>
                                                                <a 
                                                                    href={`${API_URL}/${dataRequestUseStablecoin?.contract}`} 
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
                                                        {dataRequestUseStablecoin?.allow==2? (
                                                            <>
                                                                <div className='colorRed text-center'>Desolé, votre demande a été rejetée, Merci de renvoyer votre demande.</div>
                                                                <div className='colorRed text-center mb-3'>
                                                                    <b>Voici la raison:</b>
                                                                    {dataRequestUseStablecoin?.reason}
                                                                </div>
                                                            </>
                                                        ):""}

                                                        <p className=' colorRed'><b>NB:</b><br/>1- Merci de cliquer sur le bouton <b>Détails</b> de chaque champ pour voir son explication. <br/>
                                                        2- Il est impératif de spécifier la position géographique de votre commerce avant de procéder à la saisie des informations complémentaires. <br/>
                                                        3- Veuillez vous assurer d'être physiquement présent dans votre lieu de commerce avant de procéder à la localisation. De plus, veuillez utiliser un téléphone mobile pour une précision optimale de la localisation. Merci pour votre coopération.
                                                        </p>
                                                        
                                                        <form onSubmit={dataRequestUseStablecoin?.allow==2 ? updateRequestUseStablecoin : requestUseStablecoin} className="row">
                                                            {/* Bouton pour utiliser la position de l'utilisateur */}
                                                            <div className="form-group col-12">
                                                                <div className="d-flex justify-content-between my-1">

                                                                <label htmlFor="longitude" className="mt-3">
                                                                    Localisation de votre commerce <sup className="colorRed">*</sup>
                                                                </label>
                                                                <button type="button" onClick={() => toggleDescription('longitude')} className="bgColorblue text-white btn-sm">
                                                                    {showDescription.longitude ? 'Fermer' : 'Détails'}
                                                                </button>
                                                                </div>
                                                                {showDescription.longitude && <p>Latitude et Longitude de l'emplacement de votre commerce. Cela permettra aux clients de repérer votre commerce facilement.</p>}
                                                                <button type="button" className=" bgColorblue mb-3 text-white btn-sm" onClick={() => {
                                                                Swal.fire({
                                                                    title: 'Attention!',
                                                                    text: 'Assurez-vous d\'être dans votre commerce avant de cliquer sur "Localiser". Nous utiliserons cette position comme les coordonnées de votre commerce.',
                                                                    icon: 'warning',
                                                                    showCancelButton: true,
                                                                    confirmButtonColor: '#3085d6',
                                                                    cancelButtonColor: '#d33',
                                                                    confirmButtonText: 'Localiser'
                                                                }).then((result) => {
                                                                    if (result.isConfirmed) {
                                                                    getLocation();
                                                                    }
                                                                });
                                                                }}>
                                                                Localiser le commerce
                                                                </button>

                                                                {longitude&&altitude&&showRestFields==0 ? (
                                                                <button type="button" className=" bgColorGreen mx-3 mb-3 text-white btn-sm" onClick={()=>setShowRestFields(1)}>
                                                                    Confirmer votre position
                                                                </button>
                                                                ):("")}
                                                                
                                                            </div>
                                                            
                                                            {/* Verifier si l'utilisateur a déjà renseigner ça position */}

                                                            {longitude&&altitude&&showRestFields==1 ? (
                                                            <>
                                                            
                                                            {/* Nom du commerce e-commerce */}
                                                            <div className="form-group my-6">
                                                                <div className="d-flex justify-content-between my-1">
                                                                <label htmlFor="shopName" className="mt-3">
                                                                    Nom du commerce <sup className="colorRed">*</sup>
                                                                </label>
                                                                <button type="button" onClick={() => toggleDescription('shopName')} className="bgColorblue text-white btn-sm">
                                                                    {showDescription.shopName ? 'Fermer' : 'Détails'}
                                                                </button>
                                                                </div>
                                                                {showDescription.shopName && <p>Le nom officiel de votre commerce.</p>}
                                                                <input
                                                                className="form-control"
                                                                type="text"
                                                                id="shopName"
                                                                placeholder="Nom du commerce"
                                                                required
                                                                value={shopName} 
                                                                onChange={(event) => setShopName(event.target.value)}
                                                                />
                                                            </div>

                                                            {/* contact du commerce e-commerce */}
                                                            <div className="form-group my-6">
                                                                <div className="d-flex justify-content-between my-1">
                                                                <label htmlFor="shopContact" className="mt-3">
                                                                    Contact du commerce <sup className="colorRed">*</sup>
                                                                </label>
                                                                <button type="button" onClick={() => toggleDescription('shopContact')} className="bgColorblue text-white btn-sm">
                                                                    {showDescription.shopContact ? 'Fermer' : 'Détails'}
                                                                </button>
                                                                </div>
                                                                {showDescription.shopContact && <p>Le contact sur lequel les clients pourront vous contacter .</p>}
                                                                <input
                                                                    className="form-control"
                                                                    type="text"
                                                                    id="shopContact"
                                                                    placeholder="+225 0116176155"
                                                                    required
                                                                    value={shopContact} 
                                                                    onChange={(event) => setShopContact(event.target.value)}
                                                                />
                                                            </div>

                                                            {/* Les jours ouvrables */}
                                                            <div className="form-group my-6">
                                                                <div className="d-flex justify-content-between my-1">
                                                                    <label htmlFor="productType" className="mt-3">
                                                                        Les jours de travail <sup className="colorRed">*</sup>
                                                                    </label>
                                                                    <button type="button" onClick={() => toggleDescription('workingDays')} className="bgColorblue text-white btn-sm ">
                                                                    {showDescription.workingDays ? 'Fermer' : 'Détails'}
                                                                    </button>
                                                                </div>
                                                                {showDescription.workingDays && <p>Les jours durant lesquels votre service est ouvert.</p>}
                                                                <div className='row'>
                                                                    {workingDaysOptions.map((option, index) => (
                                                                    <div className="" key={option.value}>
                                                                        <input
                                                                        type="checkbox"
                                                                        id={option.value}
                                                                        value={option.value}
                                                                        checked={workingDays.includes(option.value)}
                                                                        onChange={handleCheckboxChangeWorkingDays}
                                                                        />
                                                                        <label htmlFor={option.value}>{option.label}</label>
                                                                    </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            {isWeekdaySelected && (
                                                                <>
                                                                    {/* Heure d'ouverture Lundi au Vendredi */}
                                                                    <div className="form-group my-6">
                                                                        <div className="d-flex justify-content-between my-1">
                                                                        <label htmlFor="openingTime" className="mt-3">
                                                                            Heure d'ouverture du Lundi au Vendredi <sup className="colorRed">*</sup>
                                                                        </label>
                                                                        <button type="button" onClick={() => toggleDescription('openingTime')} className="bgColorblue text-white btn-sm">
                                                                            {showDescription.openingTime ? 'Fermer' : 'Détails'}
                                                                        </button>
                                                                        </div>
                                                                        {showDescription.openingTime && <p>L'heure à laquelle votre commerce commence à opérer du Lundi au Vendredi.</p>}
                                                                        <input
                                                                        className="form-control"
                                                                        type="time"
                                                                        id="openingTime"
                                                                        required
                                                                        value={openingTime}
                                                                        onChange={(event) => setOpeningTime(event.target.value)}
                                                                        />
                                                                    </div>

                                                                    {/* Heure de fermeture Lundi au Vendredi */}
                                                                    <div className="form-group my-6">
                                                                        <div className="d-flex justify-content-between my-1">
                                                                        <label htmlFor="closingTime" className="mt-3">
                                                                            Heure de fermeture du Lundi au Vendredi <sup className="colorRed">*</sup>
                                                                        </label>
                                                                        <button type="button" onClick={() => toggleDescription('closingTime')} className="bgColorblue text-white btn-sm">
                                                                            {showDescription.closingTime ? 'Fermer' : 'Détails'}
                                                                        </button>
                                                                        </div>
                                                                        {showDescription.closingTime && <p>L'heure à laquelle votre commerce ferme du Lundi au Vendredi.</p>}
                                                                        <input
                                                                            className="form-control"
                                                                            type="time"
                                                                            id="closingTime"
                                                                            required
                                                                            value={closingTime}
                                                                            onChange={(event) => setClosingTime(event.target.value)}
                                                                        />
                                                                    </div>
                                                                </>
                                                            )}

                                                            {/* Horaires Pour le samedi */}
                                                            {workingDays.includes("Samedi") && (
                                                                <>
                                                                    {/* Ouverture */}
                                                                    <div className="form-group my-6">
                                                                        <div className="d-flex justify-content-between my-1">
                                                                            <label htmlFor="openingTimeSaturday" className="mt-3">
                                                                                Heure d'ouverture le samedi <sup className="colorRed">*</sup>
                                                                            </label>
                                                                            <button type="button" onClick={() => toggleDescription('openingTimeSaturday')} className="bgColorblue text-white btn-sm">
                                                                                {showDescription.openingTimeSaturday ? 'Fermer' : 'Détails'}
                                                                            </button>
                                                                        
                                                                        
                                                                        </div>
                                                                        {showDescription.openingTimeSaturday && <p>L'heure à laquelle votre commerce ouvre le Samedi.</p>}
                                                                        <input
                                                                            className="form-control"
                                                                            type="time"
                                                                            id="openingTimeSaturday"
                                                                            required
                                                                            value={openingTimeSaturday}
                                                                            onChange={(event) => setOpeningTimeSaturday(event.target.value)}
                                                                        />
                                                                    </div>
                                                                    
                                                                    {/* Fermeture */}
                                                                    <div className="form-group my-6">
                                                                        <div className="d-flex justify-content-between my-1">
                                                                            <label htmlFor="closingTimeSaturday" className="mt-3">
                                                                                Heure de fermeture le samedi <sup className="colorRed">*</sup>
                                                                            </label>
                                                                            <button type="button" onClick={() => toggleDescription('closingTimeSaturday')} className="bgColorblue text-white btn-sm">
                                                                                {showDescription.closingTimeSaturday ? 'Fermer' : 'Détails'}
                                                                            </button>
                                                                        
                                                                        
                                                                        </div>
                                                                        {showDescription.closingTimeSaturday && <p>L'heure à laquelle votre commerce ferme le Samedi.</p>}
                                                                        <input
                                                                            className="form-control"
                                                                            type="time"
                                                                            id="closingTimeSaturday"
                                                                            required
                                                                            value={closingTimeSaturday}
                                                                            onChange={(event) => setClosingTimeSaturday(event.target.value)}
                                                                        />
                                                                    </div>
                                                                </>
                                                            )}

                                                            {/* Horaires Pour le dimanche */}
                                                            {workingDays.includes("Dimanche") && (
                                                                <>
                                                                    {/* Ouverture */}
                                                                    <div className="form-group my-6">
                                                                        <div className="d-flex justify-content-between my-1">
                                                                            <label htmlFor="openingTimeSunday" className="mt-3">
                                                                                Heure d'ouverture le dimanche <sup className="colorRed">*</sup>
                                                                            </label>
                                                                            <button type="button" onClick={() => toggleDescription('openingTimeSunday')} className="bgColorblue text-white btn-sm">
                                                                                {showDescription.openingTimeSunday ? 'Fermer' : 'Détails'}
                                                                            </button>
                                                                        
                                                                        
                                                                        </div>
                                                                        {showDescription.openingTimeSunday && <p>L'heure à laquelle votre commerce ouvre le dimanche.</p>}
                                                                        <input
                                                                            className="form-control"
                                                                            type="time"
                                                                            id="openingTimeSunday"
                                                                            required
                                                                            value={openingTimeSunday}
                                                                            onChange={(event) => setOpeningTimeSunday(event.target.value)}
                                                                        />
                                                                    </div>
                                                                    
                                                                    {/* Fermeture */}
                                                                    <div className="form-group my-6">
                                                                        <div className="d-flex justify-content-between my-1">
                                                                            <label htmlFor="closingTimeSunday" className="mt-3">
                                                                                Heure de fermeture le dimanche <sup className="colorRed">*</sup>
                                                                            </label>
                                                                            <button type="button" onClick={() => toggleDescription('closingTimeSunday')} className="bgColorblue text-white btn-sm">
                                                                                {showDescription.closingTimeSunday ? 'Fermer' : 'Détails'}
                                                                            </button>
                                                                        
                                                                        
                                                                        </div>
                                                                        {showDescription.closingTimeSunday && <p>L'heure à laquelle votre commerce ferme le dimanche.</p>}
                                                                        <input
                                                                            className="form-control"
                                                                            type="time"
                                                                            id="closingTimeSunday"
                                                                            required
                                                                            value={closingTimeSunday}
                                                                            onChange={(event) => setClosingTimeSunday(event.target.value)}
                                                                        />
                                                                    </div>
                                                                </>
                                                            )}

                     
                                                            {/* e-shop WTI */}
                                                            <div className="form-group my-6">
                                                                <div className="d-flex justify-content-between my-1">
                                                                <label htmlFor="eshopWti" className="mt-3">
                                                                    Voulez-vous avoir une commerce en ligne sur Wealthtech? <sup className="colorRed">*</sup>
                                                                </label>
                                                                <button type="button" onClick={() => toggleDescription('eshopWti')} className="bgColorblue text-white btn-sm">
                                                                    {showDescription.eshopWti ? 'Fermer' : 'Détails'}
                                                                </button>
                                                                </div>
                                                                {showDescription.eshopWti && <p>Ce champ vise à savoir si vous êtes intéressé avoir une commerce en ligne avec Wealthtech.</p>}
                                                                <select
                                                                    className="form-control"
                                                                    id="eshopWti"
                                                                    value={eshopWti}
                                                                    onChange={(event) => setEshopWti(event.target.value)}
                                                                    required
                                                                >
                                                                    <option value="">Veuillez sélectionner</option>
                                                                    <option value="Oui, nous voulons une boutique en ligne avec Wealthtech">Oui</option>
                                                                    <option value="Non, nous ne voulons pas une boutique en ligne avec Wealthtech">Non</option>
                                                                </select>
                                                            </div>

                                                            {/* Types de commerce */}
                                                            <div className="form-group my-6">
                                                                <div className="d-flex justify-content-between my-1">
                                                                    <label htmlFor="productType" className="mt-3">
                                                                    Types de commerce <sup className="colorRed">*</sup>
                                                                    </label>
                                                                    <button type="button" onClick={() => toggleDescription('productType')} className="bgColorblue text-white btn-sm ">
                                                                    {showDescription.productType ? 'Fermer' : 'Détails'}
                                                                    </button>
                                                                </div>
                                                                {showDescription.productType && <p>Description des types de commerce. Ce champ aide à adapter la solution de paiement.</p>}
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
                                                            
                                                            {/* Retrait partenaire */}
                                                            <div className="form-group my-6">
                                                                <div className="d-flex justify-content-between my-1">
                                                                <label htmlFor="partnerWithdrawal" className="mt-3">
                                                                    Voulez-vous être partenaire pour assurer les retraits de stablecoin? <sup className="colorRed">*</sup>
                                                                </label>
                                                                <button type="button" onClick={() => toggleDescription('partnerWithdrawal')} className="bgColorblue text-white btn-sm">
                                                                    {showDescription.partnerWithdrawal ? 'Fermer' : 'Détails'}
                                                                </button>
                                                                </div>
                                                                {showDescription.partnerWithdrawal && <p>Ce champ vise à savoir si vous êtes intéressé à établir un partenariat pour avoir une agence de retrait de stablecoin.</p>}
                                                                <select
                                                                    className="form-control"
                                                                    id="partnerWithdrawalSelect"
                                                                    value={partnerWithdrawal}
                                                                    onChange={(event) => setPartnerWithdrawal(event.target.value)}
                                                                    required
                                                                >
                                                                    <option value="">Veuillez sélectionner</option>
                                                                    <option value="Oui">Oui</option>
                                                                    <option value="Non">Non</option>
                                                                </select>
                                                            </div>

                                                            {/* Montant du retrait */}
                                                            {partnerWithdrawal==="Oui"? (
                                                                <>
                                                                {/* Types de commerce */}
                                                                <div className="form-group my-6">
                                                                    <div className="d-flex justify-content-between my-1">
                                                                        <label htmlFor="serviceType" className="mt-3">
                                                                            Types de services <sup className="colorRed">*</sup>
                                                                        </label>
                                                                        <button type="button" onClick={() => toggleDescription('serviceType')} className="bgColorblue text-white btn-sm ">
                                                                        {showDescription.serviceType ? 'Fermer' : 'Détails'}
                                                                        </button>
                                                                    </div>
                                                                    {showDescription.serviceType && <p>Ce champ vous permet de choisir le type de service que vous souhaiterez mener au sein de votre agence.</p>}
                                                                    <div className='row'>
                                                                        {serviceOptions.map((option, index) => (
                                                                        <div className="" key={option.value}>
                                                                            <input
                                                                            type="checkbox"
                                                                            id={option.value}
                                                                            value={option.value}
                                                                            checked={serviceType.includes(option.value)}
                                                                            onChange={handleCheckboxChangeService}
                                                                            />
                                                                            <label htmlFor={option.value}>{option.label}</label>
                                                                        </div>
                                                                        ))}
                                                                    </div>
                                                                </div>

                                                                {/* Intervalle du montant de retrait */}
                                                                <div className="form-group my-6">
                                                                    <div className="d-flex justify-content-between my-1">
                                                                        <label htmlFor="withdrawalAmount" className="mt-3">
                                                                            Sélectionnez la tranche de prix de retrait que vous pourez assurer par client.<sup className="colorRed">*</sup>
                                                                        </label>
                                                                    </div>
                                                                    <div className="form-check">
                                                                        <input className="form-check-input" type="radio" name="withdrawalAmount" id="range1" value="100-20000" onChange={(event) => setWithdrawalAmount(event.target.value)} />
                                                                        <label className="form-check-label" htmlFor="range1">
                                                                            Entre 100 à 20000
                                                                        </label>
                                                                    </div>
                                                                    <div className="form-check">
                                                                        <input className="form-check-input" type="radio" name="withdrawalAmount" id="range2" value="20001-50000" onChange={(event) => setWithdrawalAmount(event.target.value)} />
                                                                        <label className="form-check-label" htmlFor="range2">
                                                                        Entre 20001 à 50000
                                                                        </label>
                                                                    </div>
                                                                    <div className="form-check">
                                                                        <input className="form-check-input" type="radio" name="withdrawalAmount" id="range3" value="50001-plus" onChange={(event) => setWithdrawalAmount(event.target.value)} />
                                                                        <label className="form-check-label" htmlFor="range3">
                                                                            Entre 50001 ou plus
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                                </>
                                                            ):("")}

                                                            {/* Description du site */}
                                                            <div className="form-group my-3 col-12">
                                                            <div className="d-flex justify-content-between my-1">
                                                                <label className="mx-2 mb-2" htmlFor='description'>
                                                                    Description de votre commerce({!description?.length ? maxLength:maxLength - description?.length} caractères restants)
                                                                </label>
                                                                <button type="button" onClick={() => toggleDescription('description')} className="bgColorblue text-white btn-sm">
                                                                    {showDescription.description ? 'Fermer' : 'Détails'}
                                                                </button>
                                                                </div>
                                                                {showDescription.description && <p>Description détaillée de votre commerce.</p>}
                                                                <textarea
                                                                    className="form-control"
                                                                    id="description"
                                                                    placeholder="Description"
                                                                    rows={7}
                                                                    maxLength={maxLength} // Empêche de saisir plus de 500 caractères
                                                                    defaultValue={description} 
                                                                    onChange={handleChange}
                                                                    // onChange={(event) => setDescription(event.target.value)}
                                                                />
                                                            
                                                            </div>


                                                  
                                                        {/* Bouton de soumission */}
                                                        <div className="form-group col-12">
                                                          <button type="submit" className='btn btn-primary mt-3'>
                                                            Envoyer
                                                          </button>
                                                        </div>
                                                        </>): ("")}
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
                            
                            {/* AFFICHAGE DE LA CARTE */}
                            <div>
                                {location && (
                                    <LoadScript googleMapsApiKey={googleMapsApiKey}>
                                        <GoogleMap
                                        mapContainerStyle={mapContainerStyle}
                                        center={location}
                                        zoom={15}
                                        >
                                        <Marker position={location} />
                                        </GoogleMap>
                                    </LoadScript>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className='col-lg-2 col-md-2'></div>
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

export default OuvertureBoutik;
