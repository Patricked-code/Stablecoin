import { useCallback, useState, useEffect,useRef } from 'react';
import React from "react";
import Link from 'next/link';
import Router from "next/router";
import Swal from 'sweetalert2';
import ProgressBar from '../ProgressBar';
import moment from 'moment';


// Pour la signature
import SignatureCanvas from 'react-signature-canvas'
// Pour camera photo
import Webcam from 'react-webcam'

// FIN

const CIdentiteRepresentantTwo = () => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API

    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [messageError, setMessageError] = useState();
    const [allCountry, setAllCountry] = useState();
    const [allNationality, setAllNationality] = useState();
    const [kycForEntreprise, setKycForEntreprise] = useState();
    const [kycRepresentative, setKycRepresentative] = useState();

    // Les states du formulaire
    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [issuingCountry, setIssuingCountry] = useState();
    const [residenceCountry, setResidenceCountry] = useState();
    const [dateBirth, setDateBirth] = useState();
    const [expirationDate, setExpirationDate] = useState();
    const [nationality, setNationality] = useState();
    const [functions, setFunctions] = useState();
    const [email, setEmail] = useState();
    const [typeDocIdentity, setTypeDocIdentity] = useState();
    const [typeDocumentResidence, setTypeDocumentResidence] = useState();
    const [identityDocNumber, setIdentityDocNumber] = useState();
    const [mobile, setMobile] = useState();
    
    const [frontIdentity, setFrontIdentity ] = useState();
    const [backIdentity, setBackIdentity ] = useState();
    const [frontDomicile, setFrontDomicile] = useState();
    const [backDomicile, setBackDomicile] = useState();

    
    // Pour la signature
    const signatureRef = useRef(null)
    const [signatureData, setSignatureData] = useState(null)

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


    // STATES POUR PRENDRE PHOTO WEBCAMP (DOMICILE)
    const [statutDocDomicile, setStatutDocDomicile] = React.useState();
    const [statutRectoDomicile, setStatutRectoDomicile] = React.useState("0");
    const [statutVersoDomicile, setStatutVersoDomicile] = React.useState("0");
    const webcamRefRectoDomicile = useRef(null)
    const webcamRefVersoDomicile = useRef(null)
    const [imageRectoDomicile, setImageRectoDomicile] = useState(null)
    const [imageVersoDomicile, setImageVersoDomicile] = useState(null)
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


    // LES FONCTIONS POUR PRENDRE PHOTO (DOMICILE)
    // Fonction pour prendre photo du Recto
    const captureRectoDomicile = () => {
        const image = webcamRefRectoDomicile.current.getScreenshot()
        setImageRectoDomicile(image)
    }
    // Fin

    // Fonction pour prendre photo du verso
    const captureVersoDomicile = () => {
        const image = webcamRefVersoDomicile.current.getScreenshot()
        setImageVersoDomicile(image)
    }
    // Fin
    // FIN


    // FONCTION DE LA MODIFICATION DE LA PHOTO
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

    // Les fichiers de justificatif de domicile du representant
    const uploadToClientDomicileFront = (event) => {
        if (event.target.files && event.target.files[0]) {
        const i = event.target.files[0];

        setFrontDomicile(i);
        setCreateObjectURL(URL.createObjectURL(i));
        }
    };

    const uploadToClientDomicileBack = (event) => {
        if (event.target.files && event.target.files[0]) {
        const i = event.target.files[0];

        setBackDomicile(i);
        setCreateObjectURL(URL.createObjectURL(i));
        }
    };
    // Fin

    // Fonction pour sauvegarder une signature
    const save = () => {
        const data = signatureRef.current.getTrimmedCanvas().toDataURL('image/png')
        setSignatureData(data)
      }
    // Fin

    const currentDate = new Date();//definir la date actuelle

    // FONCTION D'ENVOIE DES DONNEES DU REPRESENTANT LEGAL
    const addRepresentatives = async (event) => {
        event.preventDefault();
        setIsLoggingIn(true);

        const token = localStorage.getItem('tokenEnCours')
        if (dateBirth < formatDate(currentDate) && expirationDate > formatDate(currentDate)) {

        const body = new FormData();
        body.append("lastName", lastName);
        body.append("firstName", firstName);
        body.append("issuingCountry", issuingCountry);
        body.append("residenceCountry", residenceCountry);
        body.append("dateBirth", dateBirth);
        body.append("expirationDate", expirationDate);
        body.append("nationality", nationality);
        body.append("email", email);
        body.append("functions", functions);
        body.append("typeDocIdentity", typeDocIdentity);
        body.append("identityDocNumber", identityDocNumber);
        body.append("mobile", mobile);
        body.append("frontIdentityFile", statutDocIdentite==="0"?frontIdentity:"");
        body.append("backIdentityFile", statutDocIdentite==="0"?backIdentity:"");
        body.append("frontIdentityPhoto", statutDocIdentite==="1"?imageRecto:"");
        body.append("backIdentityPhoto", statutDocIdentite==="1"?imageVerso:"");
        body.append("typeDocumentResidence", typeDocumentResidence);
        body.append("frontDomicileFile", statutDocDomicile==="0"?frontDomicile:"");
        body.append("backDomicileFile", statutDocDomicile==="0"?backDomicile:"");
        body.append("frontDomicilePhoto", statutDocDomicile==="1"?imageRectoDomicile:"");
        body.append("backDomicilePhoto", statutDocDomicile==="1"?imageVersoDomicile:"");
        body.append("signature", signatureData);
        
        
            const result = await fetch(`${API_URL}/api/kyc/business/add-kyc-representatives`, {
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
                        if (kycRepresentative?.length+1 == kycForEntreprise?.numberRepresentatives) {
                            Swal.fire({
                                position: 'center',
                                icon: 'success',
                                html: `<p> Vous avez ajouté ${kycRepresentative?.length + 1} représentant(s) avec succès. </p>` ,
                                showConfirmButton: false,
                                timer: 5000
                            })
                            
                            Router.push("/profil/kyc/entreprise/beneficiaire-effectif-one"); 
                        }else{
                            Swal.fire({
                                position: 'center',
                                icon: 'success',
                                html: `<p> Vous avez ajouté ${kycRepresentative?.length + 1} représentant(s) avec succès. </p>` ,
                                showConfirmButton: false,
                                timer: 2000
                            })

                            setTimeout(() => {
                                window.location.reload()
                            }, 2000)
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
        }else{
            setIsLoggingIn(false);
            Swal.fire({
                position: 'center',
                icon: 'error',
                html: `<p> Désolé la date de naissance doit être inférieure à la date du jour <br/> Et la date d'expiration doit être supérieure à la date du jour. </p>` ,
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

    // RECUPERER LES DONNEES DU KYC REPRESENTATNT LEGAL DE L'ENTREPRISE CONNECTEE
    useEffect(async() => {
        const token = localStorage.getItem('tokenEnCours')
        
            const getKycRepresentative = async () => {
            const resKyc = await fetch(`${API_URL}/api/kyc/business/find-kyc-business-representative-of-user-signIn`, {
                headers: {
                'Content-Type': 'application/json',
                Authorization:  `Bearer ${token}`,
                },
            })
                .then((resKyc) => resKyc.json())
                .then((data) => {
                setKycRepresentative(data)

                }) 
            };
            await getKycRepresentative();
    }, []);
    // FIN
    

    
    
    
                            
                            
                            
                            
                            
                            
    





    const [currentKycStatut, setCurrentKycStatut] = useState();

    //localStorage pour récupérer une valeur en cliquant sur un bouton Recompleter qui indique qu'on veut modifier une partie Kyc 
    useEffect(() => {
        const kycStatut = localStorage.getItem('currentUpdateKycStatut')  
        setCurrentKycStatut(kycStatut)
    }, [currentKycStatut]);
    // Fin


   




    // FONCTION POUR FORMATER LA DATE
    const formatDate = (_updatedAt) =>{
        const maDate = moment(_updatedAt).format('YYYY-MM-DD');
        return  maDate
    }
    //  FIN




    // La barre de progression de KYC du profil entreprise
   const stepsEntreprise = ["AML","Identité","Représentant", "Bénéficiaire","Control", "Politique", "Opérations", "Fonds", "Financière", "Documents"];

   const activeStepEntreprise = 1;
    // Fin

    // ********************************************************************************
  // LA PARTIE POUR EVITER L'AFFICHAGE DES LA BARRE DE PROGRSSION SUR MOBILE
// ********************************************************************************
  
// Utilisez un état local pour stocker la largeur de l'écran
  const [windowWidth, setWindowWidth] = useState(0);
  // Utilisez useEffect pour obtenir la largeur de l'écran une fois que le composant est monté
  useEffect(() => {
    // Obtenez la largeur de l'écran et mettez à jour l'état local
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Ajoutez un gestionnaire d'événement pour redimensionner la fenêtre
    window.addEventListener('resize', handleResize);

    // Appelez handleResize une fois pour obtenir la largeur initiale
    handleResize();

    // Nettoyez le gestionnaire d'événement lors du démontage du composant
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Conditionnez l'affichage de ProgressBar en fonction de la largeur de l'écran
  const showProgressBar = windowWidth >= 1180; // Par exemple, considérez les écrans de 768 pixels ou plus comme des ordinateurs
  
  // *****************FIN LA PARTIE POUR EVITER L'AFFICHAGE DES LA BARRE DE PROGRSSION SUR MOBILE*****


  return (
    <>
      {showProgressBar && <ProgressBar className="mb-15" steps={stepsEntreprise} activeStep={activeStepEntreprise} />}

        <div className='mt-15' >
            <div className=' mx-15'>
                <div className='py-10'>
                <br/><br/><h1 className='text-center '>Identité du / des représentants légaux 2 </h1>
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
                        <h5
                            htmlFor="lastName"
                            className="text-blackish-blue mb-2 colorRed"
                        >
                            Veuillez renseigner les informations du représentant n° {kycRepresentative?.length + 1}
                        </h5>
                        <form className='' onSubmit={addRepresentatives}>
                        <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="lastName"
                                    className="text-blackish-blue mb-2"
                                >
                                    Nom du représentation légal {kycRepresentative?.length}
                                </label>
                                <div className='form-group'>
                                    <input
                                        type='text'
                                        id='lastName'
                                        className='form-control'
                                        placeholder='Nom du représentation légal'
                                        defaultValue={lastName} 
                                        onChange={(event)=>setLastName(event.target.value)}
                                        
                                    />
                                </div>
                            </div >
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="firstName"
                                    className="text-blackish-blue mb-2"
                                >
                                    Prénoms du représentation légal
                                </label>
                                <div className='form-group'>
                                    <input
                                        type='text'
                                        id='firstName'
                                        className='form-control'
                                        placeholder='Prénoms du représentation légal'
                                        defaultValue={firstName} 
                                        onChange={(event)=>setFirstName(event.target.value)}
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
                                    htmlFor="identityDocNumber"
                                    className="text-blackish-blue mb-2"
                                >
                                    Date d'expiration du document d’identité 
                                </label>
                                <div className='form-group'>
                                    <input
                                        type='date'
                                        id='identityDocNumber'
                                        className='form-control'
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
                                    Comment voulez-vous ajouter vos documents de justificatif d'identité ?
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
                                        Importer les fichiers de justificatif d'identité en pdf ou en image
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
                                        Prendre les fichiers de justificatif d'identité en photo
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
                                            Recto du document de justificatif d'identité
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
                                            Verso du document de justificatif d'identité
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
                                    className="text-blackish-blue mb-2"
                                >
                                   Nationalité du représentant
                                </label>
                                <select 
                                className='form-control'
                                placeholder='Nationalité '
                                defaultValue={nationality} 
                                onChange={(event)=>setNationality(event.target.value)}
                                >
                                    <option>Nationalité du représentant</option>
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
                                    htmlFor="email"
                                    className="text-blackish-blue mb-2"
                                >
                                    Email
                                </label>
                                <div className='form-group'>
                                    <input
                                        type='email'
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

                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="functions"
                                    className="text-blackish-blue mb-2"
                                >
                                    Fonction
                                </label>
                                <select 
                                className="form-control"
                                id="functions"
                                required
                                defaultValue={functions} 
                                onChange={(event)=>setFunctions(event.target.value)}
                                >
                                <option defaultValue="">Choisissez</option>
                                    <optgroup className='single-cryptocurrency-box'>
                                        <option  value="Administrateur">Administrateur</option>
                                        <option  value="Mandataire">Mandataire</option>
                                        <option  value="Autres">Autres</option>
                                    </optgroup>
                                </select>
                            </div>

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
                                    type="number"
                                    id="contact"
                                    placeholder="Numéro téléphone mobile"
                                    required
                                    defaultValue={mobile} 
                                    onChange={(event)=>setMobile(event.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="typeDocumentResidence"
                                    className="text-blackish-blue mb-2"
                                >
                                    Type de document de domicile 
                                </label>
                                <select 
                                className="form-control"
                                id="typeDocumentResidence"
                                required
                                defaultValue={typeDocumentResidence} 
                                onChange={(event)=>setTypeDocumentResidence(event.target.value)}
                                >
                                <option defaultValue="">Choisissez</option>
                                    <optgroup className='single-cryptocurrency-box'>
                                        <option  value="Facture de l'électricité">Facture de l'électricité</option>
                                        <option  value="Attestation de résidence">Attestation de résidence</option>
                                        <option  value="Relevé de compte bancaire">Relevé de compte bancaire</option>
                                    </optgroup>
                                </select>
                            </div>
                            
                             {/* PARTIE DE LA MANIERE A ENVOYER LES FICHIERS */}
                             <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="Q1"
                                    className="text-blackish-blue mb-2"
                                >
                                    Comment voulez-vous importer vos documents de justificatif de domicile ?
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
                                        name="importer"
                                        value='0'
                                        id='importer-check' 
                                        checked={statutDocDomicile==="0"}
                                        onChange={()=>setStatutDocDomicile("0")}
                                        />
                                    <p className=" mx-2 mb-0 text-center">
                                        Importer les fichiers de justificatif de domicile en pdf ou en image
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
                                        checked={statutDocDomicile==="1"}
                                        onChange={()=>setStatutDocDomicile("1")}
                                        />
                                    <p className=" mx-2 mb-0 text-center">
                                        Prendre les fichiers de justificatif de domicile en photo
                                    </p>
                                    </label>
                                </div>
                                </div>
                            </div>
                            {/* FIN */}


                            {/* SI L'UTILISATEUR CHOISIT D'IMPORTER LES DOCUMENTS */}
                            {statutDocDomicile==="0" ? (
                                <>
                                    <div className="form-group my-6">
                                        <label
                                            htmlFor="frontDomicile"
                                        >
                                            Recto de justificatif de domicile
                                        </label>
                                        <input
                                            className="form-control border mt-3 bg-white"
                                            type="file" 
                                            name="myImage"
                                            id='frontDomicile'
                                            accept="application/pdf, image/*"
                                            onChange={uploadToClientDomicileFront}
                                        />
                                    </div>
                                    <div className="form-group mb-6">
                                        <label
                                            htmlFor="backDomicile"
                                        >
                                            Verso de justificatif de domicile
                                        </label>
                                        <input
                                            className="form-control  border mt-3"
                                            type="file" 
                                            name="myImage"
                                            id='backDomicile'
                                            accept="application/pdf, image/*"
                                            onChange={uploadToClientDomicileBack}
                                        />
                                    </div>
                                </>
                            ) : ("")}
                            {/* ****************FIN IMPORTATION**************** */}



                            {/* SI L'UTILISATEUR CHOISIT DE PRENDRE LES DOCUMENTS DE DOMICILE EN PHOTO */}
                            {statutDocDomicile==="1" ? (
                                <>
                                    <div className="form-group col-lg-6 col-md-6 ">
                                        {statutRectoDomicile==="0" ? (
                                            <button className="btn btn-primary "
                                                type='button'  
                                                disabled={isLoggingIn}
                                                onClick={()=>setStatutRectoDomicile("1")}
                                            >
                                                Déclencher la caméra pour prendre la photo du Recto 
                                            </button>
                                        ) : ("")}


                                        {/* Cette partie s'affciche lorsqu'on clique sur le bouton ci-dessus */}
                                        {/* Recto */}
                                        {statutRectoDomicile==="1" ? (
                                        <>
                                        <label
                                            htmlFor="picture"
                                        >
                                            Recto de votre justificatif d'identité
                                        </label>
                                            {/* Si on a pas encore pris la photo on affiche la camera */}
                                        {!imageRectoDomicile ? (
                                        <Webcam
                                            audio={false}
                                            height={350}
                                            ref={webcamRefRectoDomicile}
                                            screenshotFormat="image/jpeg"
                                            width={350}
                                        />
                                        ) : ("")}
                                        {/* Fin */}

                                        {/* Si on a pas encore pris la photo on affiche ce bouton */}
                                        {!imageRectoDomicile ? (
                                            <button type='button' onClick={captureRectoDomicile}>Sauvegarder</button>
                                        ) : ("")}
                                        {/* Fin */}
                                                    

                                        {/* Si on a pris la photo et qu'on veut reprende on affiche on clique sur ce bouton */}
                                        {imageRectoDomicile ? (
                                            <button type='button' onClick={()=>setImageRectoDomicile("")}>Reprendre la photo</button>
                                        ) : ("")}
                                        {/* Fin */}

                                        {/* Pour afficher l'image qui a été prise        */}
                                        {imageRectoDomicile && <img src={imageRectoDomicile} alt="Selfie" />}
                                        {/* Fin*/}
                                        </>
                                        ) : ("")}
                                        {/* Fin Recto */}

                                        {/* Verso */}
                                        {imageRectoDomicile ? (
                                            statutVersoDomicile ==="0"? (

                                                <button className="btn btn-primary "
                                                    type='button'  
                                                    disabled={isLoggingIn}
                                                    onClick={()=>setStatutVersoDomicile("1")}
                                                >
                                                    Déclencher la caméra pour prendre la photo du verso 
                                                </button>
                                            ) : ("")
                                        ) : ("")}

                                        {statutVersoDomicile ==="1"? (
                                            <>
                                                <br/><br/>
                                                <label
                                                    htmlFor="picture"
                                                >
                                                    Verso de votre justificatif d'identité
                                                </label>
                                                {/* Si on a pas encore pris la photo on affiche la camera */}
                                                {!imageVersoDomicile ? (
                                                <Webcam
                                                    audio={false}
                                                    height={350}
                                                                ref={webcamRefVersoDomicile}
                                                    screenshotFormat="image/jpeg"
                                                    width={350}
                                                />
                                                ) : ("")}
                                                {/* Fin */}

                                                {/* Si on a pas encore pris la photo on affiche ce bouton */}
                                                {!imageVersoDomicile  ? (
                                                    <button type='button' onClick={captureVersoDomicile}>Sauvegarder</button>
                                                ) : ("")}
                                                {/* Fin */}
                                                    

                                                {/* Si on a pris la photo et qu'on veut reprende on affiche on clique sur ce bouton */}
                                                {imageVersoDomicile ? (
                                                    <button type='button' onClick={()=>setImageVersoDomicile("")}>Reprendre la photo</button>
                                                ) : ("")}
                                                {/* Fin */}

                                                {/* Pour afficher l'image qui a été prise        */}
                                                {imageVersoDomicile && <img src={imageVersoDomicile} alt="Selfie" />}
                                                {/* Fin*/}
                                            </>
                                        ) : ("")}

                                    </div>
                                </>
                            ) : ("")}
                            {/* ****************FIN PRENDRE PHOTO**************** */}


                            <div className="form-group row mt-3 text-center">
                            <label
                                htmlFor="backDomicile mb-3"
                            >
                                Signature du représentant légal
                            </label>
                            <div className="form-group col-lg-3 col-md-3"></div>

                                <div className="form-group col-lg-6 col-md-6 ">
                                    {!signatureData? (
                                    <SignatureCanvas
                                        className=" card"
                                        canvasProps={{ width: 250, height: 200, className: 'sigCanvas bg-secondary text-white' }}
                                        ref={signatureRef}
                                    />
                                    ) : ('')}
                                            
                                    {signatureData? (
                                        <button type='button' onClick={()=>setSignatureData("")}>Reprendre la signature</button>
                                    ) : ('')}

                                    {!signatureData? (
                                    <button type='button' onClick={save}>Sauvegarder</button>
                                    ) : ('')}
                                    
                                    {signatureData && <img src={signatureData} alt="Signature" className='mt-3' />}
                                </div>
                            <div className="form-group col-lg-3 col-md-3"></div>

                            </div>
                            {/* Fin */}

                            <label
                                htmlFor="backDomicile mb-3 "
                                className='colorRed'
                            >
                                NB: Vous avez ajouté {kycRepresentative?.length}/{kycForEntreprise?.numberRepresentatives} représentant(s)
                            </label>

                            <div className="form-group mb-6 mt-3 col-lg-12 col-md-12  row justify-content-between">
                                <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">
                                    <Link href='/profil/kyc/entreprise/identite-representant-one/' className="align-right">
                                        <a
                                        className=""
                                        >
                                            <button className="btn btn-primary " type='button'  > Précédente </button>
                                        </a>   
                                    </Link>  
                                                            
                                </div>
                                <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">

                                    {kycRepresentative?.length == kycForEntreprise?.numberRepresentatives ? (
                                        <Link href='/profil/kyc/entreprise/beneficiaire-effectif-one' className="align-right">
                                            <a
                                            className=""
                                            >
                                                <button className="btn btn-primary " type='button'  > Suivant </button>
                                            </a>   
                                        </Link>
                                    ) : (
                                        <button className="btn btn-primary " type='submit'  disabled={isLoggingIn}>Suivant</button>

                                        
                                    )}
                                </div>
                            </div>
                        </form>       
                    </div>
                <div className='col-lg-3 col-md-12'></div>
            </div>
        </div>
    </>
  );
};

export default CIdentiteRepresentantTwo;
