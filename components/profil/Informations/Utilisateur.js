import { useState, useEffect } from 'react';
import { Container, Row, Col, Modal } from "react-bootstrap";
import React from "react";
import axios from 'axios';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import moment from 'moment';
import copy from "copy-to-clipboard"; 
import QRCode from 'qrcode.react';



// Pour Magic
import { magic } from "../../../magic";
import { ethers } from "ethers";
import Loading from "../../loading";
import Router from "next/router";
import Swal from 'sweetalert2';
import Web3 from "web3";

// FIN



// MODALS 
// reactstrap components
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    FormGroup,
    Form,
    Input,
    InputGroupAddon,
    InputGroupText,
    InputGroup,
    // Modal,
    // Row,
    // Col,
  } from "reactstrap";

// FIN

const InfosUtilisateur = () => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API
    const API_KEY_STABLECOIN = process.env.NEXT_PUBLIC_API_KEY_STABLECOIN


    const [currentUser, setCurrentUser] = useState();
    const [currentUserAddress, setCurrentUserAddress] = useState();
    const [provider, setProvider] = useState(null);
    const [dataCountryOfUser, setDataCountryOfUser] = useState(null);
    const [isLoggingIn, setIsLoggingIn]=useState(false)
    const [messageError, setMessageError]=useState()

    // State de copy
    const [successCopy, setSuccessCopy] = useState();

    // State du formulaire de modification (Profil particulier)
    const [lastName, setLastName] = useState();
    const [firstName, setFirstName] = useState();
    const [country, setCountry] = useState();
    const [city, setCity] = useState();

    // State du formulaire de modification (Profil entreprise/commerçant)
    const [entreprise, setEntreprise] = useState();
    // const [country, setCountry] = useState();
    // const [city, setCity] = useState();
    const [site, setSite] = useState();
    const [sector, setSector] = useState();
    const [mobile, setMobile] = useState();
    const [employee, setEmployee] = useState();
    const [user_type, setUser_type] = useState();
    const [numberRegister, setNumberRegister] = useState();

    // State du formulaire de modification (Profil institution financière)
    const [abbreviation, setAbbreviation] = useState();

    // State du formulaire de modification (Société de gestion OPCVM)
    const [approvalNumber, setApprovalNumber] = useState(currentUser?.approvalNumber || '');
    const [regulator, setRegulator] = useState(currentUser?.regulator || '');
    
    // Pour avatar
    const [avatar, setAvatar] = useState(null);
    const [uploadStatus, setUploadStatus] = useState(null);

    /**
      * État de contrôle pour afficher ou masquer la modal du changement de photo.
      * @type {boolean}
      */
     const [showChangeAvatar, setShowChangeAvatar] = useState(false);
 
     /**
      * Fonction pour fermer du changement de photo.
      * @function
      * @returns {void}
      */
     const handleCloseChangeAvatar = () => setShowChangeAvatar(false);
 
     /**
      * Fonction pour afficher du changement de photo.
      * @function
      * @returns {void}
      */
     const handleShowChangeAvatar = () => setShowChangeAvatar(true);
 

    const handleFileChange = (event) => {
        setAvatar(event.target.files[0]);
    };

    // FONCTION DU CHANGEMENT DE LA PHOTO DE L'AVATAR
    const handleUpdatePicture = async (event) => {
        event.preventDefault();
        // setIsLoggingIn(true);
        
        if (!avatar) {
        setUploadStatus('Vous devez sélectionner un fichier.');
        return;
        }

        const formData = new FormData();
        formData.append('avatar', avatar);

        // Obtenir le token en cours
        const token = localStorage.getItem('tokenEnCours');

        try {
        const response = await fetch(`${API_URL}/api/session/update-picture`, {
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
                  html: `<p>Une erreur s'est produite lors du changement de votre photo</p>` ,
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
                  html: `<p>Une erreur s'est produite lors du changement de votre photo</p>` ,
                  showConfirmButton: false,
                  timer: 6000
              })
        }
    };
    //Fin
    
    
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
                  setCurrentUserAddress(userAddress)
                  //const userBalance = ethers.utils.formatEther(await provider.getBalance(userAddress))
                  // FIN
    
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


        // Obtenir le pays en fontion de l'utilisateur connecté
        if (currentUser?.countryId) {
            const getCountryOfUser = async (_idCountry) => {
                const res = await fetch(`${API_URL}/api/country/find-one/${_idCountry}`, {
                
                    headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': `${API_KEY_STABLECOIN}`,
                    },
                })
                    .then((res) => res.json())
                    .then((dataCountryOfUser) => {
                    setDataCountryOfUser(dataCountryOfUser)
                            
                    }) 
                
            };
            getCountryOfUser(currentUser?.countryId)
        }
        // FIN
 

        // PARTIE MODIFICATION DES INFORMATIONS DU PROFIL

        /**
         * Fonction de mise à jour des informations du profil particulier.
         * @async
         * @function
         * @param {Event} event - Événement de formulaire.
         * @returns {void}
        */
        const updateProfileParticular= async(event) =>{
            event.preventDefault();
            setIsLoggingIn(true)
            
            let dataRequest = {}
            if (currentUser?.codeTypeProfil === "part") {
                dataRequest = {
                    lastName:lastName,
                    firstName:firstName,
                    mobile:mobile,
                    city:city
                }
            }else if(currentUser?.codeTypeProfil === "entCom" ){
                dataRequest = {
                    entreprise:entreprise,
                    city:city, 
                    site:site,
                    mobile:mobile,
                    employee:employee,
                }
            }else if(currentUser?.codeTypeProfil === "insti"){
                dataRequest = {
                    entreprise:entreprise,
                    city:city,
                    site:site,
                    mobile:mobile,
                }
            }else if(currentUser?.codeTypeProfil === "socGest"){
                dataRequest = {
                    entreprise:entreprise,
                    city:city,
                    site:site,
                    mobile:mobile,
                }
            }


            // Obtenir le token en cours
            const token = localStorage.getItem('tokenEnCours');

            const result = await fetch(`${API_URL}/api/session/update-profil`, {
                method:"PUT",
                body: JSON.stringify(dataRequest),
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
                    html: "<p> Votre modification s'est effectuée avec succès.</p>" ,
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
                    html: "<p>  Une erreur s'est produite lors de l'exécution.</p>" ,
                    showConfirmButton: false,
                    timer: 15000
                })
                console.error("Erreur=>",res?.message);

            }
            })
            .catch(error => {
                setIsLoggingIn(false)
                //handle error
                console.log(error);

            });
        }
        // FIN

    // FONCTION POUR COPIER LE CODE DU PARRAINNAGE
  const copyToClipboard = () => {
    copy(currentUser?.code);
    setSuccessCopy("Code copié avec succès !");

    setTimeout(() => {
      setSuccessCopy("");
    }, 1000)
  }
  // FIN

    // FONCTION POUR FORMATER LA DATE
    const formatDate = (_updatedAt) =>{
        const maDate = moment(_updatedAt).format('DD/MM/YYYY');
        return  maDate
    }
    //  FIN

    // Modal du code personnel
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    // Fin

    // Modal du Qr code
    const [showQr, setShowQr] = useState(false);
    const handleCloseQr = () => setShowQr(false);
    const handleShowQr = () => setShowQr(true);
    // Fin

    // Modal de modification des informations
    const [showFormUpdate, setShowFormUpdate] = useState(false);
    const handleCloseFormUpdate = () => setShowFormUpdate(false);
    const handleShowFormUpdate = () => setShowFormUpdate(true);
    // Fin


  return (
    <>

      <div className='' >
        <div className=' mx-15'>
            <div className='py-10'>
                {/* INFORMATIONS DU PROFIL PATICULIER */}
                {currentUser?.codeTypeProfil === "part" ? (
                <h1 className='text-center'>Infos personnelles</h1>
                ):("")}

                {/* INFORMATIONS DU PROFIL Entreprise / Commerçant */}
                {currentUser?.codeTypeProfil === "entCom" ? (   
                <h1 className='text-center'>Infos de l'entreprise</h1>
                ):("")}

                {/* INFORMATIONS DU PROFIL Institution et société financière */}
                {currentUser?.codeTypeProfil === "insti" ? ( 
                <h1 className='text-center'>Infos de l'institution</h1>
                ):("")}
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
                    <div className='col-lg-4 col-md-4'>
                        <div className='currency-selection text-center'>
                            <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                                <div className='cryptocurrency-slides'>
                                    <div className='bestseller-coin-image text-center '>
                                        {currentUser?.picture?(
                                            <img src={`${API_URL}/${currentUser?.picture}`} width={100} className="rounded-circle mt-3"  alt='image' />
                                        ):(
                                            // D:\Projets\WTI\STABLECOIN\FRONTEND\GITLAB\stablecoin\public\images\ecfa\profil\avatar
                                            <img src="/images/ecfa/profil/avatar/avatar1.jpg" width={100} className="rounded-circle mt-3"  alt='image' />
                                        )}
                                    </div>
                                    {/* <div className='title'>
                                        <h4>Mes infos de connexion</h4>
                                    </div> */}

                                    <div className='single-cryptocurrency-box'>
                                        <div className='btn-box'>
                                        <Button
                                            block
                                            color="primary"
                                            onClick={handleShowChangeAvatar}
                                        >
                                            Changer la photo
                                        </Button>
                                        </div>
                                    </div>
                                    {/* Fin */}
                                        
                                </div>
                            </div>

                            {/* Bouton du Pop up d'identifiant */}
                            <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                                <div className='cryptocurrency-slides'>
                                    <div className='single-cryptocurrency-box'>
                                        <div className='btn-box'>
                                        <Button
                                            block
                                            color="primary"
                                            type="button"
                                            onClick={handleShow}
                                        >
                                            Mon identifiant
                                        </Button>
                                        {/* Fin */}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Bouton du Pop up de Qr code */}
                            <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                                <div className='cryptocurrency-slides'>
                                    <div className='single-cryptocurrency-box'>
                                        <div className='btn-box'>
                                        <Button
                                            block
                                            color="primary"
                                            type="button"
                                            onClick={handleShowQr}
                                        >
                                            Mon Qr code
                                        </Button>
                                        {/* Fin */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* INFORMATIONS DU PROFIL PATICULIER */}
                     
                    <div className='col-lg-8 col-md-8'>
                        {currentUser?.codeTypeProfil === "part" ? (  
                            <div className='currency-selection '>
                                <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                                <div className='cryptocurrency-slides'>
                                        <div className='single-cryptocurrency-box'>
                                            <div className='row '>
                                                {currentUser?.lastName ? (
                                                    <div className='col-lg-6 col-md-6 mb-3'>
                                                        <h5>Nom</h5>
                                                        <p>{currentUser?.lastName}</p>
                                                    </div>
                                                ) : ('')}

                                                {currentUser?.firstName ? (
                                                    <div className='col-lg-6 col-md-6 mb-3'>
                                                        <h5>Prénom</h5>
                                                        <p>{currentUser?.firstName}</p>
                                                    </div>
                                                ) : ('')}

                                                {dataCountryOfUser?.libelle ? (
                                                <Col
                                                    xs="6"
                                                    md="6"
                                                    lg="6"
                                                >
                                                    <div>
                                                        <h5>Pays</h5>
                                                        <p>{dataCountryOfUser?.libelle}</p>
                                                    </div>
                                                </Col>
                                                ) : ("")}   

                                                {currentUser?.city ? (
                                                    <div className='col-lg-6 col-md-6 mb-3'>
                                                        <h5>Ville</h5>
                                                        <p>{currentUser?.city}</p>
                                                    </div>
                                                ) : ('')}

                                                {currentUser?.birthday ? (
                                                    <div className='col-lg-6 col-md-6 mb-3'>
                                                        <h5>Date de naissance</h5>
                                                        <p>{formatDate(currentUser?.birthday)}</p>
                                                    </div>
                                                ) : ('')}
                                                {currentUser?.sex ? (
                                                    <div className='col-lg-6 col-md-6 mb-3'>
                                                        <h5>Sexe</h5>
                                                        <p>{currentUser?.sex}</p>
                                                    </div>
                                                ) : ('')}

                                                
                                                {currentUser?.mobile && dataCountryOfUser?.indicator ? (
                                                    <div className='col-lg-6 col-md-6 mb-3'>
                                                        <h5>Numéro de téléphone</h5>
                                                        <p>{dataCountryOfUser?.indicator} {currentUser?.mobile}</p>
                                                    </div>
                                                ) : ('')}

                                                {currentUser?.email ? (
                                                    <div className='col-lg-6 col-md-6 mb-3'>
                                                        <h5>Email</h5>
                                                        <p>{currentUser?.email}</p>
                                                    </div>
                                                ) : ('')}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : ("")}
                        
                    
                    {/* Fin */}

                    {/* INFORMATIONS DU PROFIL Entreprise / Commerçant */}
                    {currentUser?.codeTypeProfil === "entCom" ? (  
                        <>
                         {/* <div className='col-lg-8 col-md-8'> */}
                        <div className='currency-selection '>
                            <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                            <div className='cryptocurrency-slides'>
                                    <div className='single-cryptocurrency-box'>
                                        <div className='row '>
                                            {currentUser?.entreprise ? (
                                                <div className='col-lg-6 col-md-6 mb-3'>
                                                    <h5>Nom de l'entreprise</h5>
                                                    <p>{currentUser?.entreprise}</p>
                                                </div>
                                            ) : ('')}

                                            {dataCountryOfUser?.libelle ? (
                                                <Col
                                                    xs="6"
                                                    md="6"
                                                    lg="6"
                                                >
                                                    <div>
                                                        <h5>Pays</h5>
                                                        <p>{dataCountryOfUser?.libelle}</p>
                                                    </div>
                                                </Col>
                                            ) : ("")}   

                                            {currentUser?.city ? (
                                                <div className='col-lg-6 col-md-6 mb-3'>
                                                    <h5>Ville</h5>
                                                    <p>{currentUser?.city}</p>
                                                </div>
                                            ) : ('')}

                                            {currentUser?.site ? (
                                                <div className='col-lg-6 col-md-6 mb-3'>
                                                    <h5>Site internet</h5>
                                                    <p>{currentUser?.site}</p>
                                                </div>
                                            ) : ('')}

                                            {currentUser?.sector ? (
                                                <div className='col-lg-6 col-md-6 mb-3'>
                                                    <h5>Secteur d'activité</h5>
                                                    <p>{currentUser?.sector}</p>
                                                </div>
                                            ) : ('')}

                                            {currentUser?.mobile && dataCountryOfUser?.indicator ? (
                                                <div className='col-lg-6 col-md-6 mb-3'>
                                                    <h5>Numéro de téléphone</h5>
                                                    <p>{dataCountryOfUser?.indicator} {currentUser?.mobile}</p>
                                                </div>
                                            ) : ('')}

                                            {currentUser?.employee ? (
                                                <div className='col-lg-6 col-md-6 mb-3'>
                                                    <h5>Nombre d'employés</h5>
                                                    <p>{currentUser?.employee}</p>
                                                </div>
                                            ) : ('')}

                                            {currentUser?.user_type ? (
                                                <div className='col-lg-6 col-md-6 mb-3'>
                                                    <h5>Type de l'entreprise</h5>
                                                    <p>{currentUser?.user_type}</p>
                                                </div>
                                            ) : ('')}

                                            {currentUser?.numberRegister ? (
                                                <div className='col-lg-6 col-md-6 mb-3'>
                                                    <h5>Numéro du régistre</h5>
                                                    <p>{currentUser?.numberRegister}</p>
                                                </div>
                                            ) : ('')}
                                            

                                            {currentUser?.email ? (
                                                <div className='col-lg-6 col-md-6 mb-3'>
                                                    <h5>Email</h5>
                                                    <p>{currentUser?.email}</p>
                                                </div>
                                            ) : ('')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        </> 
                    ) : ("")}
                    {/* FIN */}

                {/* INFORMATIONS DU PROFIL Institution et société financière */}
                {currentUser?.codeTypeProfil === "insti" ? ( 
                    <>  
                     {/* <div className='col-lg-8 col-md-8'> */}
                        <div className='currency-selection '>
                            <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                            <div className='cryptocurrency-slides'>
                                    <div className='single-cryptocurrency-box'>
                                        <div className='row '>
                                            {currentUser?.entreprise ? (
                                                <div className='col-lg-6 col-md-6 mb-3'>
                                                    <h5>Nom de l'institution</h5>
                                                    <p>{currentUser?.entreprise}</p>
                                                </div>
                                            ) : ('')}

                                            {dataCountryOfUser?.libelle ? (
                                                <Col
                                                    xs="6"
                                                    md="6"
                                                    lg="6"
                                                >
                                                    <div>
                                                        <h5>Pays</h5>
                                                        <p>{dataCountryOfUser?.libelle}</p>
                                                    </div>
                                                </Col>
                                            ) : ("")}   

                                            {currentUser?.city ? (
                                                <div className='col-lg-6 col-md-6 mb-3'>
                                                    <h5>Ville</h5>
                                                    <p>{currentUser?.city}</p>
                                                </div>
                                            ) : ('')}

                                            {currentUser?.site ? (
                                                <div className='col-lg-6 col-md-6 mb-3'>
                                                    <h5>Site internet</h5>
                                                    <p>{currentUser?.site}</p>
                                                </div>
                                            ) : ('')}

                                            {currentUser?.mobile && dataCountryOfUser?.indicator ? (
                                                <div className='col-lg-6 col-md-6 mb-3'>
                                                    <h5>Numéro de téléphone</h5>
                                                    <p>{dataCountryOfUser?.indicator} {currentUser?.mobile}</p>
                                                </div>
                                            ) : ('')}

                                            {currentUser?.user_type ? (
                                                <div className='col-lg-6 col-md-6 mb-3'>
                                                    <h5>Type de l'institution</h5>
                                                    <p>{currentUser?.user_type}</p>
                                                </div>
                                            ) : ('')}

                                            
                                            {currentUser?.abbreviation ? (
                                                <div className='col-lg-6 col-md-6 mb-3'>
                                                    <h5>Abréviation</h5>
                                                    <p>{currentUser?.abbreviation}</p>
                                                </div>
                                            ) : ('')}

                                            {currentUser?.email ? (
                                                <div className='col-lg-6 col-md-6 mb-3'>
                                                    <h5>Email de l'institution</h5>
                                                    <p>{currentUser?.email}</p>
                                                </div>
                                            ) : ('')}
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </> 
                ) : ("")}
                {/* FIN */}

                 {/* INFORMATIONS DU PROFIL Institution et société de gestion des opcvm */}
                 {currentUser?.codeTypeProfil === "socGest" ? ( 
                     <>  
                     {/* <div className='col-lg-8 col-md-8'> */}
                        <div className='currency-selection '>
                            <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                            <div className='cryptocurrency-slides'>
                                    <div className='single-cryptocurrency-box'>
                                        <div className='row '>
                                            {currentUser?.entreprise ? (
                                                <div className='col-lg-6 col-md-6 mb-3'>
                                                    <h5>Nom de la société de gestion</h5>
                                                    <p>{currentUser?.entreprise}</p>
                                                </div>
                                            ) : ('')}

                                            {dataCountryOfUser?.libelle ? (
                                                <Col
                                                    xs="6"
                                                    md="6"
                                                    lg="6"
                                                >
                                                    <div>
                                                        <h5>Pays</h5>
                                                        <p>{dataCountryOfUser?.libelle}</p>
                                                    </div>
                                                </Col>
                                            ) : ("")}   

                                            {currentUser?.city ? (
                                                <div className='col-lg-6 col-md-6 mb-3'>
                                                    <h5>Ville</h5>
                                                    <p>{currentUser?.city}</p>
                                                </div>
                                            ) : ('')}

                                            {currentUser?.site ? (
                                                <div className='col-lg-6 col-md-6 mb-3'>
                                                    <h5>Site internet</h5>
                                                    <p>{currentUser?.site}</p>
                                                </div>
                                            ) : ('')}

                                            {currentUser?.mobile && dataCountryOfUser?.indicator ? (
                                                <div className='col-lg-6 col-md-6 mb-3'>
                                                    <h5>Numéro de téléphone</h5>
                                                    <p>{dataCountryOfUser?.indicator} {currentUser?.mobile}</p>
                                                </div>
                                            ) : ('')}

                                            {currentUser?.approvalNumber ? (
                                                <div className='col-lg-6 col-md-6 mb-3'>
                                                    <h5>Numéro d'approbation</h5>
                                                    <p>{currentUser?.approvalNumber}</p>
                                                </div>
                                            ) : ('')}

                                            
                                            {currentUser?.regulator ? (
                                                <div className='col-lg-6 col-md-6 mb-3'>
                                                    <h5>Régulateur</h5>
                                                    <p>{currentUser?.regulator}</p>
                                                </div>
                                            ) : ('')}

                                            {currentUser?.email ? (
                                                <div className='col-lg-6 col-md-6 mb-3'>
                                                    <h5>Email de la société de gestion</h5>
                                                    <p>{currentUser?.email}</p>
                                                </div>
                                            ) : ('')}
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </> 
                ) : ("")}

                {/* Le bouton de modification */}
                <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                    <div className='cryptocurrency-slides'>
                        <div className='single-cryptocurrency-box'>
                            <div className='btn-box'>
                            <Button
                                block
                                color="primary"
                                type="button"
                                onClick={handleShowFormUpdate}
                            >
                                Modifier les informations
                            </Button>
                            {/* Fin */}
                            </div>
                        </div>
                    </div>
                </div>
            </div> 
            {/* FIN */}
            </div>
        </div>
      </div>






     
            { /* ********************************************************************************** */}
                {/* MODAL DU CODE D'IDENTIFIANT*/}
            {/* ********************************************************************************** */}
            <Modal show={show} className="mt-15" onHide={handleClose}>
                <Modal.Header closeButton id="bgcolor">
                <Modal.Title className="" >Copiez votre identifiant</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className="input-group flex-nowrap">
                    <input
                      className="form-control gr-text-8 border py-0 mt-3 bg-white"
                      type="text" 
                      disabled
                      value={currentUser?.code}
                    />
                      <span className="input-group-text gr-text-11  mt-3" id="addon-wrapping">
                        <button><Icon onClick={copyToClipboard} icon="bx:copy"  width="30" /></button>
                      </span>
                  </div>
                  <p className="gr-text-8 pt-3 pb-0 text-center colorGreen">{successCopy} </p>
                </Modal.Body>
            </Modal>
            {/* *****************************************FIN****************************************** */}


            { /* ********************************************************************************** */}
                {/* MODAL DU CODE D'IDENTIFIANT*/}
            {/* ********************************************************************************** */}
            <Modal show={showQr} className="mt-15" onHide={handleCloseQr}>
                <Modal.Header closeButton id="bgcolor">
                <Modal.Title className="" >Mon Qr code</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='text-center my-30'>
                        <QRCode
                        className='text-center'
                        value={currentUserAddress}
                        size={256}
                        fgColor="#000000"
                        bgColor="#ffffff"
                        level="L"
                        renderAs="svg"
                        />
                    </div>
                </Modal.Body>
            </Modal>
            {/* Fin */}


            {/* ********************************************************************************** */}
                {/* MODAL DU CHANGEMENT DE L'AVATAR'*/}
            {/* ********************************************************************************** */}
            <Modal show={showChangeAvatar} className="mt-15" onHide={handleCloseChangeAvatar}>
                <Modal.Header closeButton className="bgColorblue">
                    <Modal.Title className="text-white" >Changer votre photo de profil</Modal.Title>                
                </Modal.Header>
                    <form onSubmit={handleUpdatePicture}>
                        <Modal.Body>
                            <input type="file" onChange={handleFileChange} accept="image/*" />
                            
                        </Modal.Body>
                        <Modal.Footer>
                            <Button className="text-white" color="danger" onClick={handleCloseChangeAvatar}>
                                Fermer
                            </Button>
                            <Button  type='submit'  color="success" disabled={isLoggingIn}>
                                Changer la photo
                            </Button>
                        </Modal.Footer>
                    </form>
            </Modal>
            {/* *****************************************FIN****************************************** */}



            {/* ********************************************************************************** */}
                {/* MODAL DD MODIFICATION DES INFORMATIONS*/}
            {/* ********************************************************************************** */}
            <Modal show={showFormUpdate} className="mt-15" onHide={handleCloseFormUpdate}>
                <Modal.Header closeButton id="bgcolor">
                    <Modal.Title className="" >Modification des informations</Modal.Title>                
                </Modal.Header>
                {/* Formulaire de modification du profil particulier */}
                {currentUser?.codeTypeProfil === "part" ? ( 
                    <Form role="form" onSubmit={updateProfileParticular}>
                    {/* <Form role="form" onSubmit={handleSubmit}> */}
                        <Modal.Body>
                        <div className='row mx-3'>
                            <div className='form-group col-lg-6 col-md-6 mb-3'>
                                <input
                                    type="text"
                                    className=' form-control'
                                    defaultValue={currentUser?.lastName} 
                                    onChange={(event) => setLastName(event.target.value)}
                                />
                            </div>
                            
                            <div className='form-group col-lg-6 col-md-6 mb-3'>
                                <input
                                    type="text"
                                    className=' form-control'
                                    defaultValue={currentUser?.firstName} 
                                    onChange={(event) => setFirstName(event.target.value)}
                                />
                            </div>

                            <div className=" form-group col-lg-6 col-md-6 mb-3 ">
                                <div className=" input-group flex-nowrap ">
                                    <span  className="input-group-text " id="addon-wrapping">
                                        {dataCountryOfUser?.indicator}
                                    </span>
                                    <input
                                        className=" form-control"
                                        type="number"
                                        id="contact"
                                        required
                                        defaultValue={currentUser?.mobile} 
                                        onChange={(event)=>setMobile(event.target.value)}
                                    />
                                </div>
                            </div>

                            <div className='form-group col-lg-6 col-md-6 mb-3'>
                                <input
                                    type="text"
                                    className=' form-control'
                                    defaultValue={currentUser?.city} 
                                    onChange={(event) => setCity(event.target.value)}
                                />
                            </div>

                        </div>

                        </Modal.Body>
                        <Modal.Footer>
                            <Button className="text-white" color="danger" onClick={handleCloseFormUpdate}>
                                Fermer
                            </Button>
                            <Button type='submit'  color="success" disabled={isLoggingIn}>
                                Modifier
                            </Button>
                        </Modal.Footer>
                    </Form>
                ):("")}

                {/* Formulaire de modification du profil Entreprise / Commerçant */}
                {currentUser?.codeTypeProfil === "entCom" ? ( 
                    <Form role="form" onSubmit={updateProfileParticular}>
                    {/* <Form role="form" onSubmit={handleSubmit}> */}
                        <Modal.Body>
                            <div className='row mx-3'>
                                {currentUser?.entreprise? (
                                    <div className='form-group col-lg-6 col-md-6 mb-3'>
                                        <input
                                            type="text"
                                            id="entreprise"
                                            className=' form-control'
                                            defaultValue={currentUser?.entreprise}
                                            onChange={(event) => setEntreprise(event.target.value)}
                                        />
                                    </div>
                                ) : ("")}
                  
                                {currentUser?.city? (
                                    <div className='form-group col-lg-6 col-md-6 mb-3'>
                                        <input
                                            type="text"
                                            id="city"
                                            className='form-control'
                                            defaultValue={currentUser?.city}
                                            onChange={(event) => setCity(event.target.value)}
                                        />
                                    </div>
                                ) : ("")}

                                {currentUser?.site? (
                                    <div className='form-group col-lg-6 col-md-6 mb-3'>
                                        <input
                                            type="text"
                                            id="site"
                                            className='form-control'
                                            defaultValue={currentUser?.site}
                                            onChange={(event) => setSite(event.target.value)}
                                        />
                                    </div>
                                ) : ("")}

                                {currentUser?.mobile? (
                                    <div className=" form-group col-lg-6 col-md-6 mb-3 ">
                                        <div className=" input-group flex-nowrap ">
                                            <span  className="input-group-text " id="addon-wrapping">
                                                {dataCountryOfUser?.indicator}
                                            </span>
                                            <input
                                                className=" form-control"
                                                type="number"
                                                id="contact"
                                                required
                                                defaultValue={currentUser?.mobile} 
                                                onChange={(event)=>setMobile(event.target.value)}
                                            />
                                        </div>
                                    </div>
                                ) : ("")}

                                {currentUser?.employee? (
                                    <div className='form-group col-lg-6 col-md-6 mb-3'>
                                        <input
                                            type="text"
                                            id="employee"
                                            className='form-control'
                                            defaultValue={currentUser?.employee}
                                            onChange={(event) => setEmployee(event.target.value)}
                                        />
                                    </div>
                                ) : ("")}
                               
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button className="text-white" color="danger" onClick={handleCloseFormUpdate}>
                                Fermer
                            </Button>
                            <Button type='submit' color="success" disabled={isLoggingIn}>
                                Modifier
                            </Button>
                        </Modal.Footer>
                    </Form> 
                ):("")}

                 {/* Formulaire de modification du profil Institution et société financière */}
                 {currentUser?.codeTypeProfil === "insti" ? ( 
                    <Form role="form" onSubmit={updateProfileParticular}>
                    {/* <Form role="form" onSubmit={handleSubmit}> */}
                        <Modal.Body>
                            <div className='row mx-3'>
                                {currentUser?.entreprise? (
                                    <div className='form-group col-lg-6 col-md-6 mb-3'>
                                        <input
                                            type="text"
                                            id="institutionName"
                                            className='form-control'
                                            defaultValue={currentUser?.entreprise}
                                            onChange={(event) => setEntreprise(event.target.value)}
                                        />
                                    </div>
                                ) : ("")}
                  

                                    {currentUser?.city? (
                                        <div className='form-group col-lg-6 col-md-6 mb-3'>
                                            <input
                                                type="text"
                                                id="city"
                                                className='form-control'
                                                defaultValue={currentUser?.city}
                                                onChange={(event) => setCity(event.target.value)}
                                            />
                                        </div>
                                    ) : ("")}

                                    {currentUser?.site? (
                                    <div className='form-group col-lg-6 col-md-6 mb-3'>
                                        <input
                                            type="text"
                                            id="site"
                                            className='form-control'
                                            defaultValue={currentUser?.site}
                                            onChange={(event) => setSite(event.target.value)}
                                        />
                                    </div>
                                    ) : ("")}

                                {currentUser?.mobile? (
                                    <div className=" form-group col-lg-6 col-md-6 mb-3 ">
                                        <div className=" input-group flex-nowrap ">
                                            <span  className="input-group-text " id="addon-wrapping">
                                                {dataCountryOfUser?.indicator}
                                            </span>
                                            <input
                                                className=" form-control"
                                                type="number"
                                                id="contact"
                                                required
                                                defaultValue={currentUser?.mobile} 
                                                onChange={(event)=>setMobile(event.target.value)}
                                            />
                                        </div>
                                    </div>
                                ) : ("")}
                                
                            </div>

                        </Modal.Body>
                        <Modal.Footer>
                            <Button className="text-white" color="danger" onClick={handleCloseFormUpdate}>
                                Fermer
                            </Button>
                            <Button type='submit' color="success" disabled={isLoggingIn}>
                                Modifier
                            </Button>
                        </Modal.Footer>
                    </Form>
                ):("")}

                {/* Formulaire de modification du profil Société de gestion OPCVM */}
                {currentUser?.codeTypeProfil === "socGest" ? ( 
                    <Form role="form" onSubmit={updateProfileParticular}>
                    {/* <Form role="form" onSubmit={handleSubmit}> */}
                        <Modal.Body>
                            <div className='row mx-3'>
                                {currentUser?.entreprise? (
                                    <div className='form-group col-lg-6 col-md-6 mb-3'>
                                        <input
                                            type="text"
                                            id="companyName"
                                            className='mx-3 form-control'
                                            defaultValue={currentUser?.entreprise}
                                            onChange={(event) => setEntreprise(event.target.value)}
                                        />
                                    </div>
                                ) : ("")}
                       
                                {currentUser?.city? (
                                    <div className='form-group col-lg-6 col-md-6 mb-3'>
                                        <input
                                            type="text"
                                            id="city"
                                            className='mx-3 form-control'
                                            defaultValue={currentUser?.city}
                                            onChange={(event) => setCity(event.target.value)}
                                        />
                                    </div>
                                ) : ("")}
                                
                                {currentUser?.site? (
                                    <div className='form-group col-lg-6 col-md-6 mb-3'>
                                        <input
                                            type="text"
                                            id="site"
                                            className='mx-3 form-control'
                                            defaultValue={currentUser?.site}
                                            onChange={(event) => setSite(event.target.value)}
                                        />
                                    </div>
                                ) : ("")}
                             
                                {currentUser?.mobile? (
                                    <div className='form-group col-lg-6 col-md-6 mb-3'>
                                        <input
                                            type="text"
                                            id="mobile"
                                            className='mx-3 form-control'
                                            defaultValue={currentUser?.mobile}
                                            onChange={(event) => setMobile(event.target.value)}
                                        />
                                    </div>
                                ) : ("")}
                               
                                
                            </div>

                        </Modal.Body>
                        <Modal.Footer>
                            <Button className="text-white" color="danger" onClick={handleCloseFormUpdate}>
                                Fermer
                            </Button>
                            <Button type='submit' color="success" disabled={isLoggingIn}>
                                Modifier
                            </Button>
                        </Modal.Footer>
                    </Form>
                ):("")}
            </Modal>
      
    </>
  );
};

export default InfosUtilisateur;
