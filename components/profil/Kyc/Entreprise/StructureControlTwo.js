import { useCallback, useState, useEffect,useRef } from 'react';
import React from "react";
import axios from 'axios';
import Link from 'next/link';
import { Icon } from '@iconify/react';


// Pour Magic
import { magic } from "../../../../magic";
import { ethers } from "ethers";
import Loading from "../../../loading";
import Router from "next/router";
import Swal from 'sweetalert2';
import Web3 from "web3";
import ProgressBar from '../ProgressBar';

// Pour la signature
import SignatureCanvas from 'react-signature-canvas'
// Pour camera photo
import Webcam from 'react-webcam'

// FIN

const CStructureControlTwo = () => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API

    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [messageError, setMessageError] = useState();
    const [allCountry, setAllCountry] = useState();
    const [allNationality, setAllNationality] = useState();
    const [kycForEntreprise, setKycForEntreprise] = useState();
    const [kycStructure, setKycStructure] = useState();
    const [currentKycStatut, setCurrentKycStatut] = useState();


    // States du formulaire
    const [socialReason, setSocialReason] = useState();
    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [issuingCountry, setIssuingCountry] = useState();
    const [residenceCountry, setResidenceCountry] = useState();
    const [dateBirth, setDateBirth] = useState();
    const [nationality, setNationality] = useState();
    const [percentControl, setPercentControl] = useState();
    const [email, setEmail] = useState();
    const [typeDocIdentity, setTypeDocIdentity] = useState();
    const [expirationDate, setExpirationDate] = useState();
    const [identityDocNumber, setIdentityDocNumber] = useState();
    const [mobile, setMobile] = useState();
    const [typePartner, setTypePartner] = useState();
    const [countryRegistration, setCountryRegistration] = useState();
    const [phoneFixe, setPhoneFixe] = useState();
    const [startDate, setStartDate] = useState();
    const [numberRccm, setNumberRccm] = useState();
    
    const [frontIdentity, setFrontIdentity ] = useState();
    const [backIdentity, setBackIdentity ] = useState();


    

    // STATES POUR PRENDRE PHOTO WEBCAMP (IDENTITE)
    const [statutDocIdentite, setStatutDocIdentite] = React.useState();
    // const [importerIdentite, setImporterIdentite] = React.useState();
    const [statutRecto, setStatutRecto] = React.useState("0");
    const [statutVerso, setStatutVerso] = React.useState("0");
    const webcamRefRecto = useRef(null)
    const webcamRefVerso = useRef(null)
    const [imageRecto, setImageRecto] = useState(null)
    const [imageVerso, setImageVerso] = useState(null)
    // FIN

    // LES FONCTIONS POUR PRENDRE PHOTO (IDENTITE)
    // Fonction pour prendre photo du Recto
    const captureRecto = () => {
        const image = webcamRefRecto.current.getScreenshot()
        setImageRecto(image)
    }
    // Fin

    // Fonction pour prendre photo du verso
    const captureVerso = () => {
        const image = webcamRefVerso.current.getScreenshot()
        setImageVerso(image)
    }
    // Fin
    // FIN


    // Partie importation du fichier
    const [createObjectURL, setCreateObjectURL] = useState(null);

    // Les fichiers de justificatif d'identité du representant
    const uploadToClientIdentityFront = (event) => {
        if (event.target.files && event.target.files[0]) {
        const i = event.target.files[0];

        setFrontIdentity(i);
        setCreateObjectURL(URL.createObjectURL(i));
        }
    };


    const uploadToClientIdentityBack = (event) => {
        if (event.target.files && event.target.files[0]) {
        const i = event.target.files[0];

        setBackIdentity(i);
        setCreateObjectURL(URL.createObjectURL(i));
        }
    };
    // Fin
 

    // FONCTION D'ENVOIE DES DONNEES DU BENEFICIARE EFFECTIF
    const addStructure = async (event) => {
        event.preventDefault();
        setIsLoggingIn(true);

        const token = localStorage.getItem('tokenEnCours')
        const body = new FormData();
        body.append("socialReason", socialReason);
        body.append("lastName", lastName);
        body.append("firstName", firstName);
        body.append("issuingCountry", issuingCountry);
        body.append("residenceCountry", residenceCountry);
        body.append("countryRegistration", countryRegistration);
        body.append("dateBirth", dateBirth);
        body.append("nationality", nationality);
        body.append("email", email);
        body.append("mobile", mobile);
        body.append("phoneFixe", phoneFixe);
        body.append("startDate", startDate);
        body.append("expirationDate", expirationDate);
        body.append("numberRccm", numberRccm);
        body.append("percentControl", percentControl);
        body.append("typePartner", typePartner);
        body.append("typeDocIdentity", typeDocIdentity);
        body.append("identityDocNumber", identityDocNumber);
        body.append("frontIdentityFile", statutDocIdentite==="0"?frontIdentity:"");
        body.append("backIdentityFile", statutDocIdentite==="0"?backIdentity:"");
        body.append("frontIdentityPhoto", statutDocIdentite==="1"?imageRecto:"");
        body.append("backIdentityPhoto", statutDocIdentite==="1"?imageVerso:"");
    
  
    
            const result = await fetch(`${API_URL}/api/kyc/business/add-kyc-structure`, {
                method:"POST",
                body,
                headers: {
                    // 'Content-Type': 'application/json',
                    Authorization:  `Bearer ${token}`,
                    },
            })    
            /* Verifier s'il y a un messsage d'erreur on l'affiche dans SWAL 
                * sinon on affiche le message de succès
                */
            if (result?.status===200) {
                setTimeout(() => {
                    if (currentKycStatut==="1") {
                        Router.push("/profil/kyc/particulier/resultat-kyc"); 
                    }else{
                        if (kycStructure?.length+1 == kycForEntreprise?.numberAssociates) {
                            Swal.fire({
                                position: 'center',
                                icon: 'success',
                                html: `<p> Vous avez ${kycStructure?.length + 1}  bénéfiaire(s) effectif(s) avec succès. </p>` ,
                                showConfirmButton: false,
                                timer: 5000
                            })
                            
                            Router.push("/profil/kyc/entreprise/politiquement-exposees-one"); 
                        }else{
                            Swal.fire({
                                position: 'center',
                                icon: 'success',
                                html: `<p> Vous avez ajouté ${kycStructure?.length + 1} bénéfiaire(s) effectif(s) avec succès. </p>` ,
                                showConfirmButton: false,
                                timer: 1000
                            })

                            setTimeout(() => {
                                window.location.reload()
                            }, 1000)
                        }
                    }
                }, 5000)
                
                }else{
                    // setMessageError(data.message)

                    setIsLoggingIn(false);
                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        html: `<p> Désolé une erreur s'est produite,Veuillez réessayer svp. </p>` ,
                        showConfirmButton: false,
                        timer: 10000
                    })
                    
                }
    }
    // FIN


    // RECUPERER TOUS LES PAYS
    useEffect(async() => {
        const token = localStorage.getItem('tokenEnCours')
        
            const getAllCountries = async () => {
            const resCountry = await fetch(`${API_URL}/api/country/find-all`, {
                headers: {
                'Content-Type': 'application/json',
                Authorization:  `Bearer ${token}`,

                },
            })
                .then((resCountry) => resCountry.json())
                .then((allCountry) => {
                setAllCountry(allCountry)
                }) 

            };
            
            await getAllCountries();
    }, []);
    // FIN

    // RECUPERER TOUTES LES NATIONALITES
    useEffect(async() => {
        const getAllNationality = async () => {
        const resCountry = await fetch(`${API_URL}/api/country/find-all-nationnality`, {
            headers: {
            'Content-Type': 'application/json',
            },
        })
        .then((resNationality) => resNationality.json())
        .then((allNationality) => {
            setAllNationality(allNationality)
        }) 
        };
        await getAllNationality();
    }, []);
    // FIN


    // RECUPERER KYC DE L'ENTREPRISE
    useEffect(async() => {
        const token = localStorage.getItem('tokenEnCours')
        
            const getKycForEntreprise = async () => {
            const resKyc = await fetch(`${API_URL}/api/kyc/business/find-kyc-of-user`, {
                headers: {
                'Content-Type': 'application/json',
                Authorization:  `Bearer ${token}`,
                },
            })
                .then((resKyc) => resKyc.json())
                .then((data) => {
                setKycForEntreprise(data)

                }) 
            };
            await getKycForEntreprise();
    }, []);
    // FIN

    // RECUPERER LES DONNEES DU KYC DE STRUCTURE DE CONTROL DE L'ENTREPRISE CONNECTEE
    useEffect(async() => {
        const token = localStorage.getItem('tokenEnCours')
        
            const getKycStructure = async () => {
            const resKyc = await fetch(`${API_URL}/api/kyc/business/find-kyc-business-structure-of-user-signIn`, {
                headers: {
                'Content-Type': 'application/json',
                Authorization:  `Bearer ${token}`,
                },
            })
                .then((resKyc) => resKyc.json())
                .then((data) => {
                setKycStructure(data)

                }) 
            };
            await getKycStructure();
    }, []);
    // FIN
 

     // La barre de progression de KYC du profil entreprise
   const stepsEntreprise = ["AML","Identité","Représentant", "Bénéficiaire","Control", "Politique", "Opérations", "Fonds", "Financière", "Documents"];

   const activeStepEntreprise = 3;
    // Fin

  return (
    <>
      <ProgressBar className="mb-15" steps={stepsEntreprise} activeStep={activeStepEntreprise} />

        <div className='mt-15' >
            <div className=' mx-15'>
                <div className='py-10'>
                <br/><br/><h1 className='text-center '>Structure de propriété ou de contrôle 2</h1>
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
            <div className='row'>
                <div className='col-lg-3 col-md-12'></div>
                    <div className='m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white cryptocurrency-search-box login-form col-lg-6 col-md-12'>
                        <form className='' onSubmit={addStructure}>
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="typePartner"
                                    className="text-blackish-blue mb-2"
                                >
                                    Type d'associé
                                </label>
                                <select 
                                className="form-control"
                                id="typePartner"
                                required
                                defaultValue={typePartner} 
                                onChange={(event)=>setTypePartner(event.target.value)}
                                >
                                <option defaultValue="">Choisissez</option>
                                    <optgroup className='single-cryptocurrency-box'>
                                        <option  value="Personne physique">Personne Physique</option>
                                        <option  value="Personne morale">Personne Morale</option>
                                    </optgroup>
                                </select>
                            </div>

                            {typePartner ? (
                                <>

                                    {typePartner==="Personne physique" ? (
                                        <>
                                            <div className="form-group mb-6 mt-3">
                                                <label
                                                    htmlFor="firstName"
                                                    className="text-blackish-blue mb-2"
                                                >
                                                    Nom de l'associé
                                                </label>
                                                <div className='form-group'>
                                                    <input
                                                        type='text'
                                                        id='firstName'
                                                        className='form-control'
                                                        placeholder="Nom de l'associé"
                                                        defaultValue={firstName} 
                                                        onChange={(event)=>setFirstName(event.target.value)}
                                                    />
                                                </div>
                                            </div >
                                            <div className="form-group mb-6 mt-3">
                                                <label
                                                    htmlFor="lastName"
                                                    className="text-blackish-blue mb-2"
                                                >
                                                    Prénoms de l'associé
                                                </label>
                                                <div className='form-group'>
                                                    <input
                                                        type='text'
                                                        id='lastName'
                                                        className='form-control'
                                                        placeholder="Prénoms de l'associé"
                                                        defaultValue={lastName} 
                                                        onChange={(event)=>setLastName(event.target.value)}
                                                    />
                                                </div>
                                            </div >
                                       

                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="typeDocIdentity"
                                    className="text-blackish-blue mb-2"
                                >
                                    Type de document d’identité  
                                </label>
                                <select 
                                className="form-control"
                                id="typeDocIdentity"
                                required
                                defaultValue={typeDocIdentity} 
                                onChange={(event)=>setTypeDocIdentity(event.target.value)}
                                >
                                <option defaultValue="">Choisissez</option>
                                    <optgroup className='single-cryptocurrency-box'>
                                        <option  value="CNI">CNI</option>
                                        <option  value="Passeport">Passeport</option>
                                    </optgroup>
                                </select>
                            </div>
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="identityDocNumber"
                                    className="text-blackish-blue mb-2"
                                >
                                    Numéro du document d’identité 
                                </label>
                                <div className='form-group'>
                                    <input
                                        type='text'
                                        id='identityDocNumber'
                                        className='form-control'
                                        placeholder='Numéro du document d’identité'
                                        defaultValue={identityDocNumber} 
                                        onChange={(event)=>setIdentityDocNumber(event.target.value)}
                                    />
                                </div>
                            </div >
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="expirationDate"
                                    className="text-blackish-blue mb-2"
                                >
                                    Date d’expiration
                                </label>
                                <div className='form-group'>
                                    <input
                                        type='date'
                                        id='expirationDate'
                                        className='form-control'
                                        placeholder='Date d’expiration'
                                        defaultValue={expirationDate} 
                                        onChange={(event)=>setExpirationDate(event.target.value)}
                                    />
                                </div>
                            </div >
                            <div className='form-group form-group mb-6 mt-3'>
                                <label
                                    htmlFor="issuingCountry"
                                    className="text-blackish-blue mb-2"
                                >
                                    Pays émetteur du document d'identité
                                </label>
                                <select 
                                    className="form-control"
                                    id="issuingCountry"
                                    required
                                    defaultValue={issuingCountry} 
                                    onChange={(event)=>setIssuingCountry(event.target.value)}
                                >
                                    <option>Pays </option>
                                    {/* Parcourir les pays */}
                                    {allCountry?(
                                    allCountry.map((data) => (
                                        <optgroup className='single-cryptocurrency-box'
                                                key={data.id}>
                                            <option  value={data.libelle}>{data.libelle}</option>
                                        </optgroup>
                                    ))):("")}
                                </select>
                                {/* Fin */}
                            </div>                            

                            {/* PARTIE DE LA MANIERE A ENVOYER LES FICHIERS */}
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="Q1"
                                    className="text-blackish-blue mb-2"
                                >
                                    Comment voulez-vous importer vos fichiers ?
                                <br/>
                                </label>
                               
                                <div className='row'>
                                {/* Imoporter*/}
                                <div className="form-group col-lg-6  mt-3 ">
                                    <label
                                        htmlFor="importer-check"
                                        className="gr-check-input mb-7 d-flex"
                                    >
                                        
                                        <input 
                                        type="radio" 
                                        name="0"
                                        value='0'
                                        id='importer-check' 
                                        checked={statutDocIdentite==="0"}
                                        onChange={()=>setStatutDocIdentite("0")}
                                        />
                                    <p className=" mx-2 mb-0 text-center">
                                        Importer les fichiers pdf ou image
                                    </p>
                                    </label>
                                </div>
                                {/* Photo */}
                                <div className="form-group col-lg-6  mt-3 ">
                                    <label
                                        htmlFor="photo-check"
                                        className="gr-check-input mb-7 d-flex"
                                    >
                                        <input 
                                        type="radio" 
                                        name="photo"
                                        value="1"
                                        id='photo-check' 
                                        checked={statutDocIdentite==="1"}
                                        onChange={()=>setStatutDocIdentite("1")}
                                        />
                                    <p className=" mx-2 mb-0 text-center">
                                        Prendre les fichiers en photo
                                    </p>
                                    </label>
                                </div>
                                </div>
                            </div>
                            {/* FIN */}

                            
                            {/* SI L'UTILISATEUR CHOISIT D'IMPORTER LES DOCUMENTS */}
                            {statutDocIdentite==="0" ? (
                                <>
                                
                                    <div className="form-group my-6">
                                        <label
                                            htmlFor="frontIdentity"
                                        >
                                            Recto du document d'identité
                                        </label>
                                        <input
                                            className="form-control border mt-3 bg-white"
                                            type="file" 
                                            name="myImage"
                                            id='frontIdentity'
                                            accept="application/pdf, image/*"
                                            onChange={uploadToClientIdentityFront}
                                        />
                                    </div>
                                    <div className="form-group mb-6">
                                        <label
                                            htmlFor="backIdentity"
                                        >
                                            Verso du document d'identité
                                        </label>
                                        <input
                                            className="form-control  border mt-3"
                                            type="file" 
                                            name="myImage"
                                            id='backIdentity'
                                            accept="application/pdf, image/*"
                                            onChange={uploadToClientIdentityBack}
                                        />
                                    </div>
                                </>
                            ) : ("")}
                            {/* FIN IMPORTATION */}
                            

                            {/* SI L'UTILISATEUR CHOISIT DE PRENDRE LES DOCUMENTS EN PHOTO */}
                            {statutDocIdentite==="1" ? (
                                <>
                                    <div className="form-group col-lg-6 col-md-6 ">
                                        {statutRecto==="0" ? (
                                            <button className="btn btn-primary "
                                                type='button'  
                                                disabled={isLoggingIn}
                                                onClick={()=>setStatutRecto("1")}
                                            >
                                                Déclencher la caméra pour prendre la photo du Recto 
                                            </button>
                                        ) : ("")}


                                        {/* Cette partie s'affciche lorsqu'on clique sur le bouton ci-dessus */}
                                        {/* Recto */}
                                        {statutRecto==="1" ? (
                                        <>
                                        <label
                                            htmlFor="picture"
                                        >
                                            Recto de votre justificatif d'identité
                                        </label>
                                            {/* Si on a pas encore pris la photo on affiche la camera */}
                                        {!imageRecto ? (
                                        <Webcam
                                            audio={false}
                                            height={350}
                                            ref={webcamRefRecto}
                                            screenshotFormat="image/jpeg"
                                            width={350}
                                        />
                                        ) : ("")}
                                        {/* Fin */}

                                        {/* Si on a pas encore pris la photo on affiche ce bouton */}
                                        {!imageRecto ? (
                                            <button type='button' onClick={captureRecto}>Sauvegarder</button>
                                        ) : ("")}
                                        {/* Fin */}
                                                    

                                        {/* Si on a pris la photo et qu'on veut reprende on affiche on clique sur ce bouton */}
                                        {imageRecto ? (
                                            <button type='button' onClick={()=>setImageRecto("")}>Reprendre la photo</button>
                                        ) : ("")}
                                        {/* Fin */}

                                        {/* Pour afficher l'image qui a été prise        */}
                                        {imageRecto && <img src={imageRecto} alt="Selfie" />}
                                        {/* Fin*/}
                                        </>
                                        ) : ("")}
                                        {/* Fin Recto */}

                                        {/* Verso */}
                                        {imageRecto ? (
                                            statutVerso ==="0"? (

                                                <button className="btn btn-primary "
                                                    type='button'  
                                                    disabled={isLoggingIn}
                                                    onClick={()=>setStatutVerso("1")}
                                                >
                                                    Déclencher la caméra pour prendre la photo du verso 
                                                </button>
                                            ) : ("")
                                        ) : ("")}

                                        {statutVerso ==="1"? (
                                            <>
                                                <br/><br/>
                                                <label
                                                    htmlFor="picture"
                                                >
                                                    Verso de votre justificatif d'identité
                                                </label>
                                                {/* Si on a pas encore pris la photo on affiche la camera */}
                                                {!imageVerso ? (
                                                    <Webcam
                                                        audio={false}
                                                        height={350}
                                                        ref={webcamRefVerso}
                                                        screenshotFormat="image/jpeg"
                                                        width={350}
                                                    />
                                                ) : ("")}
                                                {/* Fin */}

                                                {/* Si on a pas encore pris la photo on affiche ce bouton */}
                                                {!imageVerso  ? (
                                                    <button type='button' onClick={captureVerso}>Sauvegarder</button>
                                                ) : ("")}
                                                {/* Fin */}
                                                    

                                                {/* Si on a pris la photo et qu'on veut reprende on affiche on clique sur ce bouton */}
                                                {imageVerso ? (
                                                    <button type='button' onClick={()=>setImageVerso("")}>Reprendre la photo</button>
                                                ) : ("")}
                                                {/* Fin */}

                                                {/* Pour afficher l'image qui a été prise        */}
                                                {imageVerso && <img src={imageVerso} alt="Selfie" />}
                                                {/* Fin*/}
                                            </>
                                        ) : ("")}
                                        {/* Fin verso */}
                                    </div>
                                </>
                            ) : ("")}
                            {/* ****************FIN PRENDRE PHOTO**************** */}

                                    <div className='form-group mt-3'>
                                        <label
                                            htmlFor="email"
                                            className="text-blackish-blue mb-2"
                                        >
                                            Votre nationalité
                                        </label>
                                        <select 
                                            className='form-control'
                                            placeholder='Nationalité '
                                            defaultValue={nationality} 
                                            onChange={(event)=>setNationality(event.target.value)}
                                        >
                                            <option>Votre nationalité</option>
                                            {/* Parcourir les nationalités */}
                                            {allNationality?(
                                            allNationality.map((data) => (
                                            <optgroup className='single-cryptocurrency-box'
                                                    key={data.id}>
                                            <option  value={data.libelle}>{data.libelle}</option>
                                            </optgroup>
                                                ))):("")}
                                        </select>
                                        {/* Fin */}
                                    </div>
                                    
                                    <div className="form-group mb-6 mt-3">
                                        <label
                                            htmlFor="dateBirth"
                                            className="text-blackish-blue mb-2"
                                        >
                                            Date de naissance
                                        </label>
                                        <div className='form-group'>
                                            <input
                                                type='date'
                                                id='dateBirth'
                                                className='form-control'
                                                placeholder='Date de naissance'
                                                defaultValue={dateBirth} 
                                                onChange={(event)=>setDateBirth(event.target.value)}
                                            />
                                        </div>
                                    </div >

                                    <div className='form-group form-group mb-6 mt-3'>
                                        <label
                                            htmlFor="residenceCountry"
                                            className="text-blackish-blue mb-2"
                                        >
                                            Pays de résidence  
                                        </label>
                                        <select 
                                            className="form-control"
                                            id="residenceCountry"
                                            required
                                            defaultValue={residenceCountry} 
                                            onChange={(event)=>setResidenceCountry(event.target.value)}
                                        >
                                        <option>Pays de Résidence </option>
                                        {/* Parcourir les pays */}
                                        {allCountry?(
                                        allCountry.map((data) => (
                                        <optgroup className='single-cryptocurrency-box'
                                                key={data.id}>
                                            <option  value={data.code}>{data.libelle}</option>
                                        </optgroup>
                                            ))):("")}
                                        </select>
                                        {/* Fin */}
                                    </div>

                                    <div className=" form-group mb-6 mt-3 ">
                                        <label
                                            htmlFor="mobile"
                                            className="text-blackish-blue mb-2"
                                        >
                                            Téléphone mobile 
                                        </label>
                                        <div className=" input-group flex-nowrap ">
                                            <span  className="input-group-text " id="addon-wrapping">
                                            {allCountry?(
                                            allCountry.map((data) => (
                                                data.code == residenceCountry ?(
                                                <i key={data.id}>{data.indicator}</i>
                                                                
                                                ):('')
                                            ))
                                            ):("")}
                                            </span>
                                            <input
                                                className="form-control"
                                                type="text"
                                                id="contact"
                                                placeholder="Numéro téléphone mobile"
                                                required
                                                defaultValue={mobile} 
                                                onChange={(event)=>setMobile(event.target.value)}
                                            />
                                        </div>
                                    </div>
                            
                                </>
                            ):('')}

                            {typePartner==="Personne morale" ? (
                                <>
                                    <div className="form-group mb-6 mt-3">
                                        <label
                                            htmlFor="socialReason"
                                            className="text-blackish-blue mb-2"
                                        >
                                            Raison sociale
                                        </label>
                                        <div className='form-group'>
                                            <input
                                                type='text'
                                                id='socialReason'
                                                className='form-control'
                                                placeholder='Raison sociale'
                                                defaultValue={socialReason} 
                                                onChange={(event)=>setSocialReason(event.target.value)}
                                            />
                                        </div>
                                    </div >

                                    <div className="form-group mb-6 mt-3">
                                        <label
                                            htmlFor="numberRccm"
                                            className="text-blackish-blue mb-2"
                                        >
                                            Numéro RCCM
                                        </label>
                                        <div className='form-group'>
                                            <input
                                                type='text'
                                                id='numberRccm'
                                                className='form-control'
                                                placeholder='Numéro RCCM'
                                                defaultValue={numberRccm} 
                                                onChange={(event)=>setNumberRccm(event.target.value)}
                                            />
                                        </div>
                                    </div >
    
                                    <div className='form-group form-group mb-6 mt-3'>
                                        <label
                                            htmlFor="residenceCountry"
                                            className="text-blackish-blue mb-2"
                                        >
                                            Pays d'immatriculation 
                                        </label>
                                        <select 
                                            className="form-control"
                                            id="countryRegistration"
                                            required
                                            defaultValue={countryRegistration} 
                                            onChange={(event)=>setCountryRegistration(event.target.value)}
                                            >
                                            <option>Pays de Résidence </option>
                                            {/* Parcourir les pays */}
                                            {allCountry?(
                                            allCountry.map((data) => (
                                            <optgroup className='single-cryptocurrency-box'
                                                    key={data.id}>
                                                <option  value={data.code}>{data.libelle}</option>
                                            </optgroup>
                                                ))):("")}
                                        </select>
                                        {/* Fin */}
                                    </div>
                                    <div className=" form-group mb-6 mt-3 ">
                                        <label
                                            htmlFor="mobile"
                                            className="text-blackish-blue mb-2"
                                        >
                                            Téléphone fixe
                                        </label>
                                        <div className=" input-group flex-nowrap ">
                                            <span  className="input-group-text " id="addon-wrapping">
                                            {allCountry?(
                                            allCountry.map((data) => (
                                                data.code == countryRegistration ?(
                                                <i key={data.id}>{data.indicator}</i>
                                                                
                                                ):('')
                                            ))
                                            ):("")}
                                            </span>
                                            <input
                                                type='text'
                                                id='phoneFixe'
                                                className='form-control'
                                                placeholder='Téléphone fixe'
                                                defaultValue={phoneFixe} 
                                                onChange={(event)=>setPhoneFixe(event.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group mb-6 mt-3">
                                        <label
                                            htmlFor="startDate"
                                            className="text-blackish-blue mb-2"
                                        >
                                            Date de création
                                        </label>
                                        <div className='form-group'>
                                            <input
                                                type='date'
                                                id='startDate'
                                                className='form-control'
                                                placeholder='Date de création'
                                                defaultValue={startDate} 
                                                onChange={(event)=>setStartDate(event.target.value)}
                                            />
                                        </div>
                                    </div>
                                    </>
                            ):('')}

                            
                            
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="email"
                                    className="text-blackish-blue mb-2"
                                >
                                    Email
                                </label>
                                <div className='form-group'>
                                    <input
                                        type='text'
                                        id='dateBirth'
                                        className='form-control'
                                        placeholder='Email'
                                        defaultValue={email} 
                                        onChange={(event)=>setEmail(event.target.value)}
                                    />
                                </div>
                            </div >
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="percentControl"
                                    className="text-blackish-blue mb-2"
                                >
                                    % Participation/ Contrôle
                                </label>
                                <div className='form-group'>
                                    <input
                                        type='text'
                                        id='percentControl'
                                        className='form-control'
                                        placeholder='% Participation/ Contrôle'
                                        defaultValue={percentControl} 
                                        onChange={(event)=>setPercentControl(event.target.value)}
                                    />
                                </div>
                            </div >
                            </>
                            ) : ("")}

                            <label
                                htmlFor="backDomicile mb-3 "
                                className='colorRed'
                            >
                                NB: Vous avez ajouté {kycStructure?.length}/{kycForEntreprise?.numberAssociates} associé(s)
                            </label>

                            <div className="form-group mb-6 mt-3 col-lg-12 col-md-12  row justify-content-between">
                                {typePartner|| !typePartner ?(
                                    
                                    <div className={`form-group mb-6 mt-3  ${!typePartner?"col-lg-12 col-md-12":" col-lg-6 col-md-6"}`}>
                                        <Link href='/profil/kyc/entreprise/structure-control-one/' className="align-right">
                                            <a
                                            className=""
                                            >
                                                <button className="btn btn-primary " type='button'  > Précédente </button>
                                            </a>   
                                        </Link>                          
                                    </div>
                                ):("")}
                                {typePartner ? (
                                    <>
                                        {kycStructure?.length == kycForEntreprise?.numberAssociates ? (
                                            <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">
                                                <Link href='/profil/kyc/entreprise/politiquement-exposees-one' className="align-right">
                                                    <a
                                                    className=""
                                                    >
                                                        <button className="btn btn-primary " type='button'> Suivant </button>
                                                    </a>   
                                                </Link>
                                            </div>
                                        ) : (
                                            <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">
                                                <button className="btn btn-primary " type='submit'  disabled={isLoggingIn}  > Suivant </button>                        
                                            </div>
                                        )}
                                    </>
                                ):("")}
                            </div>
                        </form>       
                    </div>
                <div className='col-lg-3 col-md-12'></div>
            </div>
        </div>
    </>
  );
};

export default CStructureControlTwo;
