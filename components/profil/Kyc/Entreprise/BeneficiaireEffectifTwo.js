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

const CBeneficiaireEffectifTwo = () => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API

    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [messageError, setMessageError] = useState();

    // States du formulaire
    // entrepriseName
    // firstName
    // lastName
    // issuingCountry
    // nativeCountry
    // countryRegistration
    // dateBirth
    // nationality
    // email
    // functions
    // typeDocument
    // identityDocNumber
    // mobile
    // phoneFixe
    // startDate
    // numberRccm
    // expirationDate
    // typeBeneficiary
    {/* POUR PIECE D'IDENTITE */}
    // frontIdentityFile
    // backIdentityFile 
    // frontIdentityPhoto
    // backIdentityPhoto
    {/* FIN */}
    
    
    const [entrepriseName, setEntrepriseName] = useState();
    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [issuingCountry, setIssuingCountry] = useState();
    const [nativeCountry, setNativeCountry] = useState();
    const [dateBirth, setDateBirth] = useState();
    const [nationality, setNationality] = useState();
    const [percentControl, setPercentControl] = useState();
    const [email, setEmail] = useState();
    const [typeDocIdentite, setTypeDocIdentite] = useState();
    const [expirationDate, setExpirationDate] = useState();
    const [identityDocNumber, setIdentityDocNumber] = useState();
    const [mobile, setMobile] = useState();
    const [typeBeneficiary, setTypeBeneficiary] = useState();
    const [countryRegistration, setCountryRegistration] = useState();
    const [phoneFixe, setPhoneFixe] = useState();
    const [startDate, setStartDate] = useState();
    const [numberRccm, setNumberRccm] = useState();
    
    const [frontIdentityFile, setFrontIdentityFile ] = useState();
    const [backIdentityFile, setCackIdentityFile ] = useState();
    const [frontIdentityPhoto, setFrontIdentityPhoto ] = useState();
    const [backIdentityPhoto, setCackIdentityPhoto ] = useState();

    
    // Pour la signature
    const signatureRef = useRef(null)
    const [signatureData, setSignatureData] = useState(null)

    // Fonction pour sauvegarder une signature
    const save = () => {
        const data = signatureRef.current.getTrimmedCanvas().toDataURL('image/png')
        setSignatureData(data)
    }

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


    // STATES POUR PRENDRE PHOTO WEBCAMP (IDENTITE)
    const [statutDocDomicile, setStatutDocDomicile] = React.useState();
    const [statutRectoDomicile, setStatutRectoDomicile] = React.useState("0");
    const [statutVersoDomicile, setStatutVersoDomicile] = React.useState("0");
    const webcamRefRectoDomicile = useRef(null)
    const webcamRefVersoDomicile = useRef(null)
    const [imageRectoDomicile, setImageRectoDomicile] = useState(null)
    const [imageVersoDomicile, setImageVersoDomicile] = useState(null)
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

    

    
    
    
                            
                            
                            
                            
                            
                            
    




    // State de la question 2
    const [spentA, setSpentA] = useState([]);
    const [spentB, setSpentB] = useState([]);
    const [spentC, setSpentC] = useState([]);
    const [spentD, setSpentD] = useState([]);
    const [spentE, setSpentE] = useState([]);
    const [spentF, setSpentF] = useState([]);

    // State de la question 4
    const [frequencyA, setFrequencyA] = useState([]);
    const [frequencyB, setFrequencyB] = useState([]);
    const [frequencyC, setFrequencyC] = useState([]);

    // State de la question 5
    const [incomeTypeA, setIncomeTypeA] = useState([]);
    const [incomeTypeB, setIncomeTypeB] = useState([]);
    const [incomeTypeC, setIncomeTypeC] = useState([]);

    // State de la question 1 et 3
    const [statutQ1, setStatutQ1] = useState();
    const [statutQ3, setStatutQ3] = useState();
    
    // FIN

    const [kycForParticular, setKycForParticular] = useState();



    const [currentKycStatut, setCurrentKycStatut] = useState();

    //localStorage pour récupérer une valeur en cliquant sur un bouton Recompleter qui indique qu'on veut modifier une partie Kyc 
    useEffect(() => {
        const kycStatut = localStorage.getItem('currentUpdateKycStatut')  
        setCurrentKycStatut(kycStatut)
    }, [currentKycStatut]);
    // Fin


    // RECUPERER KYC DE L'UTILISATEUR
    useEffect(async() => {
        const token = localStorage.getItem('tokenEnCours')
        
            const getKycForParticular = async () => {
            const resKyc = await fetch(`${API_URL}/api/kyc/particular/find-kyc-particular-for-user`, {
                headers: {
                'Content-Type': 'application/json',
                Authorization:  `Bearer ${token}`,
                },
            })
                .then((resKyc) => resKyc.json())
                .then((data) => {
                setKycForParticular(data)
                }) 
            };
            // console.log("Banques =>",allBank)
            await getKycForParticular();
    }, []);
    // FIN








    // Fonction d'envoie des informations du questionnaire
    const addQuestionnaire= useCallback(async () => {
        setIsLoggingIn(true);
        
        try {
            const dataTable = {
                spentA:Object.assign({},spentA),
                spentB:Object.assign({},spentB),
                spentC:Object.assign({},spentC),
                spentD:Object.assign({},spentD),
                spentE:Object.assign({},spentE),
                spentF:Object.assign({},spentF),
                frequencyA:Object.assign({},frequencyA),
                frequencyB:Object.assign({},frequencyB),
                frequencyC:Object.assign({},frequencyC),
                incomeTypeA:Object.assign({}, incomeTypeA),
                incomeTypeB:Object.assign({},incomeTypeB),
                incomeTypeC:Object.assign({},incomeTypeC)
            }

            const dataa = {
                spentA:dataTable?.spentA[0],
                spentB:dataTable?.spentB[0],
                spentC:dataTable?.spentC[0],
                spentD:dataTable?.spentD[0],
                spentE:dataTable?.spentE[0],
                spentF:dataTable?.spentF[0],
                frequencyA:dataTable?.frequencyA[0],
                frequencyB:dataTable?.frequencyB[0],
                frequencyC:dataTable?.frequencyC[0],
                incomeTypeA:dataTable?.incomeTypeA[0],
                incomeTypeB:dataTable?.incomeTypeB[0],
                incomeTypeC:dataTable?.incomeTypeC[0],
                
            }
            // Condition pour forcer l'utilisateur à choisir au moins une reponse
            if (dataa?.spentA||dataa?.spentB||dataa?.spentC||dataa?.spentD||dataa?.spentE||dataa?.spentF||dataa?.frequencyA||dataa?.frequencyB||dataa?.frequencyC||dataa?.incomeTypeA||dataa?.incomeTypeB||dataa?.incomeTypeC) {
                
                
                const token = localStorage.getItem('tokenEnCours') //Le token récuperé

                const result = await fetch(`${API_URL}/api/kyc/particular/add-kyc-questionnaires`, {
                method:"POST",
                body: JSON.stringify(dataa),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization:  `Bearer ${token}`
                }
                })
                const data = await result.json();
            
                /* Verifier s'il y a un messsage d'erreur on l'affiche dans SWAL 
                * sinon on affiche le message de succès
                */
                if (data.message) {
                setMessageError(data.message)
                setIsLoggingIn(false);
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    html: `<p> ${messageError} </p>` ,
                    showConfirmButton: false,
                    timer: 10000
                })
                }else{
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        html: `<p> Vos réponses ont été sauvegardées avec succès.</p>` ,
                        showConfirmButton: false,
                        timer: 5000
                    }),
                    setTimeout(() => {
                    Router.push("/profil/kyc/particulier/seconde-phase"); 
                    }, 5000)
                }
                // Fin condition 
            }else{
                setIsLoggingIn(false);
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    html: `<p> Désolé, vous devez repondre à une question au moins. </p>` ,
                    showConfirmButton: false,
                    timer: 10000
                })
            }
            
            } catch {
            setIsLoggingIn(false);
            }
        
    }, [spentA,spentB,spentC,spentD,spentE,spentF,frequencyA,frequencyB,frequencyC,incomeTypeA,incomeTypeB,incomeTypeC]);
    // Fin


     // Fonction d'envoie des informations du questionnaire
     const updateQuestionnaire= useCallback(async () => {
        setIsLoggingIn(true);
        
        try {
            const dataTable = {
                spentA:Object.assign({},spentA),
                spentB:Object.assign({},spentB),
                spentC:Object.assign({},spentC),
                spentD:Object.assign({},spentD),
                spentE:Object.assign({},spentE),
                spentF:Object.assign({},spentF),
                frequencyA:Object.assign({},frequencyA),
                frequencyB:Object.assign({},frequencyB),
                frequencyC:Object.assign({},frequencyC),
                incomeTypeA:Object.assign({}, incomeTypeA),
                incomeTypeB:Object.assign({},incomeTypeB),
                incomeTypeC:Object.assign({},incomeTypeC)
            }

            const dataa = {
                spentA:dataTable?.spentA[0],
                spentB:dataTable?.spentB[0],
                spentC:dataTable?.spentC[0],
                spentD:dataTable?.spentD[0],
                spentE:dataTable?.spentE[0],
                spentF:dataTable?.spentF[0],
                frequencyA:dataTable?.frequencyA[0],
                frequencyB:dataTable?.frequencyB[0],
                frequencyC:dataTable?.frequencyC[0],
                incomeTypeA:dataTable?.incomeTypeA[0],
                incomeTypeB:dataTable?.incomeTypeB[0],
                incomeTypeC:dataTable?.incomeTypeC[0],
                
            }
            // Condition pour forcer l'utilisateur à choisir au moins une reponse
            if (dataa?.spentA||dataa?.spentB||dataa?.spentC||dataa?.spentD||dataa?.spentE||dataa?.spentF||dataa?.frequencyA||dataa?.frequencyB||dataa?.frequencyC||dataa?.incomeTypeA||dataa?.incomeTypeB||dataa?.incomeTypeC) {
                
                
                const token = localStorage.getItem('tokenEnCours') //Le token récuperé

                const result = await fetch(`${API_URL}/api/kyc/particular/update-kyc-questionnaires`, {
                method:"PUT",
                body: JSON.stringify(dataa),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization:  `Bearer ${token}`
                }
                })
                const data = await result.json();
            
                /* Verifier s'il y a un messsage d'erreur on l'affiche dans SWAL 
                * sinon on affiche le message de succès
                */
                if (data.message) {
                setMessageError(data.message)
                setIsLoggingIn(false);
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    html: `<p> ${messageError} </p>` ,
                    showConfirmButton: false,
                    timer: 10000
                })
                }else{
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        html: `<p> Vos réponses ont été sauvegardées avec succès.</p>` ,
                        showConfirmButton: false,
                        timer: 5000
                    }),
                    setTimeout(() => {
                        if (currentKycStatut==="1") {
                            Router.push("/profil/kyc/particulier/resultat-kyc"); 
        
                        }else{
                            Router.push("/profil/kyc/particulier/seconde-phase"); 
                        }
                    }, 5000)
                }
                // Fin condition 
            }else{
                setIsLoggingIn(false);
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    html: `<p> Désolé, vous devez repondre à une question au moins. </p>` ,
                    showConfirmButton: false,
                    timer: 10000
                })
            }
            
            } catch {
            setIsLoggingIn(false);
            }
        
    }, [spentA,spentB,spentC,spentD,spentE,spentF,frequencyA,frequencyB,frequencyC,incomeTypeA,incomeTypeB,incomeTypeC]);
    // Fin

// Les handles de la 2è question
  const handleOptionSpentA = (event) => {
    const value = event.target.value;
    const isChecked = event.target.checked;

    if (isChecked) {
        setSpentA([...spentA, value]);
    } else {
        setSpentA("");
    }
  };

const handleOptionSpentB = (event) => {
    const value = event.target.value;
    const isChecked = event.target.checked;

    if (isChecked) {
        setSpentB([...spentB, value]);
    } else {
        setSpentB("");
    }
};

const handleOptionSpentC = (event) => {
    const value = event.target.value;
    const isChecked = event.target.checked;

    if (isChecked) {
        setSpentC([...spentC, value]);
    } else {
        setSpentC("");
    }
};

const handleOptionSpentD = (event) => {
    const value = event.target.value;
    const isChecked = event.target.checked;

    if (isChecked) {
        setSpentD([...spentD, value]);
    } else {
        setSpentD("");
    }
};

const handleOptionSpentE = (event) => {
    const value = event.target.value;
    const isChecked = event.target.checked;

    if (isChecked) {
        setSpentE([...spentE, value]);
    } else {
        setSpentE("");
    }
};

const handleOptionSpentF = (event) => {
    const value = event.target.value;
    const isChecked = event.target.checked;

    if (isChecked) {
        setSpentF([...spentF, value]);
    } else {
        setSpentF("");
    }
};

// FIN


// Les handles de la 4è question
const handleOptionFrequencyA = (event) => {
    const value = event.target.value;
    const isChecked = event.target.checked;

    if (isChecked) {
        setFrequencyA([...frequencyA, value]);
    } else {
        setFrequencyA("");
    }
};

const handleOptionFrequencyB = (event) => {
    const value = event.target.value;
    const isChecked = event.target.checked;

    if (isChecked) {
        setFrequencyB([...frequencyB, value]);
    } else {
        setFrequencyB("");
    }
};

const handleOptionFrequencyC = (event) => {
    const value = event.target.value;
    const isChecked = event.target.checked;

    if (isChecked) {
        setFrequencyC([...frequencyC, value]);
    } else {
        setFrequencyC("");
    }
};
// FIN
 
// Les handles de la 5è question
const handleOptionIncomeTypeA = (event) => {
    const value = event.target.value;
    const isChecked = event.target.checked;

    if (isChecked) {
        setIncomeTypeA([...incomeTypeA, value]);
    } else {
        setIncomeTypeA("");
    }
};

const handleOptionIncomeTypeB = (event) => {
    const value = event.target.value;
    const isChecked = event.target.checked;

    if (isChecked) {
        setIncomeTypeB([...incomeTypeB, value]);
    } else {
        setIncomeTypeB("");
    }
};

const handleOptionIncomeTypeC = (event) => {
    const value = event.target.value;
    const isChecked = event.target.checked;

    if (isChecked) {
        setIncomeTypeC([...incomeTypeC, value]);
    } else {
        setIncomeTypeC("");
    }
};

     // La barre de progression de KYC du profil entreprise
   const stepsEntreprise = ["AML","Identité","Représentant", "Bénéficiaire","Control", "Politique", "Opérations", "Fonds", "Financière", "Documents"];

   const activeStepEntreprise = 2;
    // Fin

  return (
    <>
      <ProgressBar className="mb-15" steps={stepsEntreprise} activeStep={activeStepEntreprise} />

        <div className='mt-15' >
            <div className=' mx-15'>
                <div className='py-10'>
                <br/><br/><h1 className='text-center '>Bénéficiaire(s) effectif(s)</h1>
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
                        <form className=''>
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="typeBeneficiary"
                                    className="text-blackish-blue mb-2"
                                >
                                    Type de bénéficiaire
                                </label>
                                <select 
                                className="form-control"
                                id="typeBeneficiary"
                                required
                                defaultValue={typeBeneficiary} 
                                onChange={(event)=>setTypeBeneficiary(event.target.value)}
                                >
                                <option defaultValue="">Choisissez</option>
                                    <optgroup className='single-cryptocurrency-box'>
                                        <option  value="Personne physique">Personne Physique</option>
                                        <option  value="Personne morale">Personne Morale</option>
                                    </optgroup>
                                </select>
                            </div>

                            {typeBeneficiary ? (
                                <>

                                    {typeBeneficiary==="Personne physique" ? (
                                        <>
                                            <div className="form-group mb-6 mt-3">
                                                <label
                                                    htmlFor="lastName"
                                                    className="text-blackish-blue mb-2"
                                                >
                                                    Nom du bénéficiaire
                                                </label>
                                                <div className='form-group'>
                                                    <input
                                                        type='text'
                                                        id='lastName'
                                                        className='form-control'
                                                        placeholder='Nom du bénéficiaire'
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
                                                    Prénoms du bénéficiaire
                                                </label>
                                                <div className='form-group'>
                                                    <input
                                                        type='text'
                                                        id='firstName'
                                                        className='form-control'
                                                        placeholder='Prénoms du bénéficiaire'
                                                        defaultValue={firstName} 
                                                        onChange={(event)=>setFirstName(event.target.value)}
                                                        
                                                    />
                                                </div>
                                            </div >
                                       

                                            <div className="form-group mb-6 mt-3">
                                                <label
                                                    htmlFor="typeDocIdentite"
                                                    className="text-blackish-blue mb-2"
                                                >
                                                    Type de document d’identité  
                                                </label>
                                                <select 
                                                className="form-control"
                                                id="typeDocIdentite"
                                                required
                                                defaultValue={typeDocIdentite} 
                                                onChange={(event)=>setTypeDocIdentite(event.target.value)}
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
                                            <div className="form-group mb-6 mt-3">
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
                                                <option defaultValue="">Choisissez</option>
                                                    <optgroup className='single-cryptocurrency-box'>
                                                        <option  value="CNI">Côte d'Ivoire</option>
                                                        <option  value="Passeport">Mali</option>
                                                    </optgroup>
                                                </select>
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
                                                            // onChange={uploadToClientRecto}
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
                                                            // onChange={uploadToClientVerso}
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

                                                    <div className="form-group mb-6 mt-3">
                                                        <label
                                                            htmlFor="nationality"
                                                            className="text-blackish-blue mb-2"
                                                        >
                                                            Nationalité
                                                        </label>
                                                        <select 
                                                        className="form-control"
                                                        id="nationality"
                                                        required
                                                        defaultValue={nationality} 
                                                        onChange={(event)=>setNationality(event.target.value)}
                                                        >
                                                        <option defaultValue="">Choisissez</option>
                                                            <optgroup className='single-cryptocurrency-box'>
                                                                <option  value="CNI">Ivoirienne</option>
                                                                <option  value="Passeport">Malienne</option>
                                                            </optgroup>
                                                        </select>
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

                                                    <div className="form-group mb-6 mt-3">
                                                        <label
                                                            htmlFor="nativeCountry"
                                                            className="text-blackish-blue mb-2"
                                                        >
                                                            Pays de résidence  
                                                        </label>
                                                        <select 
                                                        className="form-control"
                                                        id="nativeCountry"
                                                        required
                                                        defaultValue={nativeCountry} 
                                                        onChange={(event)=>setNativeCountry(event.target.value)}
                                                        >
                                                        <option defaultValue="">Choisissez</option>
                                                            <optgroup className='single-cryptocurrency-box'>
                                                                <option  value="CNI">Côte d'Ivoire</option>
                                                                <option  value="Passeport">Mali</option>
                                                            </optgroup>
                                                        </select>
                                                    </div>

                                                    <div className="form-group mb-6 mt-3">
                                                <label
                                                    htmlFor="mobile"
                                                    className="text-blackish-blue mb-2"
                                                >
                                                    Téléphone mobile 
                                                </label>
                                                <div className='form-group'>
                                                    <input
                                                        type='text'
                                                        id='mobile'
                                                        className='form-control'
                                                        placeholder='Téléphone mobile'
                                                        defaultValue={mobile} 
                                                        onChange={(event)=>setMobile(event.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            
                                                </>
                                            ):('')}

                                            {typeBeneficiary==="Personne morale" ? (
                                                <>
                                                    <div className="form-group mb-6 mt-3">
                                                        <label
                                                            htmlFor="entrepriseName"
                                                            className="text-blackish-blue mb-2"
                                                        >
                                                            Raison sociale
                                                        </label>
                                                        <div className='form-group'>
                                                            <input
                                                                type='text'
                                                                id='entrepriseName'
                                                                className='form-control'
                                                                placeholder='Raison sociale'
                                                                defaultValue={entrepriseName} 
                                                                onChange={(event)=>setEntrepriseName(event.target.value)}
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
                    
                                                    <div className="form-group mb-6 mt-3">
                                                        <label
                                                            htmlFor="nativeCountry"
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
                                                        <option defaultValue="">Choisissez</option>
                                                            <optgroup className='single-cryptocurrency-box'>
                                                                <option  value="CNI">Côte d'Ivoire</option>
                                                                <option  value="Passeport">Mali</option>
                                                            </optgroup>
                                                        </select>
                                                    </div>
                                                    <div className="form-group mb-6 mt-3">
                                                <label
                                                    htmlFor="phoneFixe"
                                                    className="text-blackish-blue mb-2"
                                                >
                                                    Téléphone fixe
                                                </label>
                                                <div className='form-group'>
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
                                            

                            

                            
                            
                            
                            











                            












                            {/* <p className="colorRed mb-7 ">
                                NB : Aucun retour n'est permis sur cette page donc, répondez correctement aux questions
                            </p> */}

                            {/* {kycForParticular?.userId ? (
                                <button className="btn btn-primary " type='button' onClick={updateQuestionnaire}  disabled={isLoggingIn}>Suivant</button>
                            ) : (
                                <button className="btn btn-primary " type='button' onClick={addQuestionnaire}  disabled={isLoggingIn}>Suivant</button>
                            )} */}

                            
                            {/* <button className="btn btn-primary "  disabled={isLoggingIn}>Suivant</button> */}
                            </>
                            ) : ("")}

                            <div className="form-group mb-6 mt-3 col-lg-12 col-md-12  row justify-content-between">
                                {typeBeneficiary|| !typeBeneficiary ?(
                                    
                                    <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">
                                        <Link href='/profil/kyc/entreprise/beneficiaire-effectif-one/' className="align-right">
                                        
                                            <a
                                            className=""
                                            >
                                                <button className="btn btn-primary " type='button'  > Précédente </button>
                                            </a>   
                                        </Link>                          
                                    </div>
                                ):("")}
                                {typeBeneficiary ? (
                                    <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">
                                        <Link href='/profil/kyc/entreprise/structure-control-one/' className="align-right">
                                        
                                            <a
                                            className=""
                                            >
                                                <button className="btn btn-primary " type='button'  > Suivant </button>
                                            </a>   
                                        </Link>                          
                                    </div>
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

export default CBeneficiaireEffectifTwo;
