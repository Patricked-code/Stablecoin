import { useCallback, useState, useEffect } from 'react';
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

// FIN

const CIdentiteOne = () => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API

    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [messageError, setMessageError] = useState();

    // States du formulaire
                            // naturePerson
                            // seniority
                            // entreprise
                            // numberRCCM
                            // socialObject
                            // numberIdentification
                            // officeAddress
                            // fax
                            // email
                            // dateConstitution
                            // registrationDate
                            // international
                            // national
                            // local

    const [naturePerson, setNaturePerson] = useState();
    const [seniority, setSeniority] = useState();
    const [entreprise, setEntreprise] = useState();
    const [numberRCCM, setNumberRCCM] = useState();
    const [socialObject, setSocialObject] = useState();
    const [numberIdentification, setNumberIdentification] = useState();
    const [officeAddress, setOfficeAddress] = useState();
    const [fax, setFax] = useState();
    const [email, setEmail] = useState();
    const [dateConstitution, setDateConstitution] = useState();
    const [registrationDate, setRegistrationDate] = useState();
    const [international, setInternational] = useState();
    const [national, setNational] = useState();
    const [local, setLocal] = useState();

    

    
    
    
                            
                            
                            
                            
                            
                            
    




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
                    Router.push("/profil/kyc/entreprise/seconde-phase"); 
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
                            Router.push("/profil/kyc/entreprise/resultat-kyc"); 
        
                        }else{
                            Router.push("/profil/kyc/entreprise/seconde-phase"); 
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

    const activeStepEntreprise = 0;
    // Fin

  return (
    <>
      <ProgressBar className="mb-15" steps={stepsEntreprise} activeStep={activeStepEntreprise} />

        <div className='mt-15' >
            <div className=' mx-15'>
                <div className='py-10'>
                <br/><br/><h1 className='text-center '>Identité </h1>
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
                                    htmlFor="international"
                                    className="text-blackish-blue mb-2"
                                >
                                    Domaine d’activité 
                                </label>
                                {/* Compte épargne */}
                                <div className="form-group ">
                                    <label
                                        htmlFor="international-check"
                                        className="gr-check-input mb-7 d-flex"
                                    >
                                        <input 
                                            type="checkbox" 
                                            name="International"
                                            value="International"
                                            id='international-check' 
                                            // checked={international.includes("International")}
                                            // onChange={handleOptionInternational}
                                        />
                                    <p className=" mx-2 mb-0 text-center">
                                        International
                                    </p>
                                    </label>
                                </div>
                                <div className="form-group ">
                                    <label
                                        htmlFor="national-check"
                                        className="gr-check-input mb-7 d-flex"
                                    >
                                        <input 
                                            type="checkbox" 
                                            name="National"
                                            value="National"
                                            id='national-check' 
                                            // checked={national.includes("National")}
                                            // onChange={handleOptionNational}
                                        />
                                    <p className=" mx-2 mb-0 text-center">
                                        National
                                    </p>
                                    </label>
                                </div>
                                <div className="form-group ">
                                    <label
                                        htmlFor="local-check"
                                        className="gr-check-input mb-7 d-flex"
                                    >
                                        <input 
                                            type="checkbox" 
                                            name="Local"
                                            value="Local"
                                            id='local-check' 
                                            // checked={local.includes("Local")}
                                            // onChange={handleOptionNational}
                                        />
                                    <p className=" mx-2 mb-0 text-center">
                                        Local
                                    </p>
                                    </label>
                                </div>
                            </div >

                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="naturePerson"
                                    className="text-blackish-blue mb-2"
                                >
                                    Nature de la Personne morale 
                                </label>
                                <select 
                                className="form-control"
                                id="naturePerson"
                                required
                                defaultValue={naturePerson} 
                                onChange={(event)=>setNaturePerson(event.target.value)}
                                >
                                <option defaultValue="">Choisissez</option>
                                    <optgroup className='single-cryptocurrency-box'>
                                    <option  value="Entreprise individuelle">Entreprise individuelle</option>
                                    <option  value="Profession libérale">Profession libérale</option>
                                    <option  value="SA">SA</option>
                                    <option  value="SARL">SARL</option>
                                    <option  value="SARL Unipersonnelle">SARL Unipersonnelle</option>
                                    <option  value="Société cooperative">Société cooperative</option>
                                    <option  value="Association">Association</option>
                                    <option  value="GVC">GVC</option>
                                    <option  value="ONG">ONG</option>
                                    <option  value="GIE">GIE</option>
                                    <option  value="Autre">Autre</option>
                                    </optgroup>
                                </select>
                            </div>

                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="seniority"
                                    className="text-blackish-blue mb-2"
                                >
                                    Ancienneté professionnelle 
                                </label>
                                <select 
                                className="form-control"
                                id="seniority"
                                required
                                defaultValue={seniority} 
                                onChange={(event)=>setSeniority(event.target.value)}
                                >
                                    
                                <option defaultValue="">Choisissez</option>
                                    <optgroup className='single-cryptocurrency-box'>
                                        <option  value="Inférieure à un an">Inférieure à un an</option>
                                        <option  value="De 1 à 10 ans">De 1 à 10 ans</option>
                                        <option  value="Plus de 10 ans">Plus de 10 ans</option>
                                    </optgroup>
                                </select>
                            </div>

                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="entreprise"
                                    className="text-blackish-blue mb-2"
                                >
                                    Dénomination sociale
                                </label>
                                <div className='form-group'>
                                    <input
                                        type='text'
                                        id='entreprise'
                                        className='form-control'
                                        placeholder='Dénomination sociale'
                                        defaultValue={entreprise} 
                                        onChange={(event)=>setEntreprise(event.target.value)}
                                    />
                                </div>
                            </div>
                            
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="numberRCCM"
                                    className="text-blackish-blue mb-2"
                                >
                                    Numéro RCCM
                                </label>
                                <div className='form-group'>
                                    <input
                                        type='text'
                                        id='numberRCCM'
                                        className='form-control'
                                        placeholder='Numéro RCCM'
                                        defaultValue={numberRCCM} 
                                        onChange={(event)=>setNumberRCCM(event.target.value)}
                                    />
                                </div>
                            </div>
                            
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="socialObject"
                                    className="text-blackish-blue mb-2"
                                >
                                    Objet social
                                </label>
                                <div className='form-group'>
                                    <input
                                        type='text'
                                        id='socialObject'
                                        className='form-control'
                                        placeholder='Objet social'
                                        defaultValue={socialObject} 
                                        onChange={(event)=>setSocialObject(event.target.value)}
                                    />
                                </div>
                            </div>
                            
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="numberIdentification"
                                    className="text-blackish-blue mb-2"
                                >
                                    Numéro d’identification 
                                </label>
                                <div className='form-group'>
                                    <input
                                        type='text'
                                        id='numberIdentification'
                                        className='form-control'
                                        placeholder='Numéro d’identification '
                                        defaultValue={numberIdentification} 
                                        onChange={(event)=>setNumberIdentification(event.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="immatriculation"
                                    className="text-blackish-blue mb-2"
                                >
                                    Pays d’immatriculation
                                </label>
                                <div className='form-group'>
                                    <input
                                        type='text'
                                        id='immatriculation'
                                        className='form-control'
                                        placeholder='Pays d’immatriculation'
                                        // defaultValue={socialObject} 
                                        // onChange={(event)=>setSocialObject(event.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="city"
                                    className="text-blackish-blue mb-2"
                                >
                                    Ville 
                                </label>
                                <div className='form-group'>
                                    <input
                                        type='text'
                                        id='city'
                                        className='form-control'
                                        placeholder='Ville'
                                        // defaultValue={numberIdentification} 
                                        // onChange={(event)=>setNumberIdentification(event.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="immatriculation"
                                    className="text-blackish-blue mb-2"
                                >
                                    Adresse postale
                                </label>
                                <div className='form-group'>
                                    <input
                                        type='text'
                                        id='immatriculation'
                                        className='form-control'
                                        placeholder='Adresse postale'
                                        // defaultValue={socialObject} 
                                        // onChange={(event)=>setSocialObject(event.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="officeAddress"
                                    className="text-blackish-blue mb-2"
                                >
                                    Adresse siège social 
                                </label>
                                <div className='form-group'>
                                    <input
                                        type='text'
                                        id='officeAddress'
                                        className='form-control'
                                        placeholder='Adresse siège social'
                                        defaultValue={officeAddress} 
                                        onChange={(event)=>setOfficeAddress(event.target.value)}
                                    />
                                </div>
                            </div>
                            
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="immatriculation"
                                    className="text-blackish-blue mb-2"
                                >
                                    Téléphone Fixe
                                </label>
                                <div className='form-group'>
                                    <input
                                        type='text'
                                        id='phoneFixe'
                                        className='form-control'
                                        placeholder='Adresse postale'
                                        // defaultValue={phoneFixe} 
                                        // onChange={(event)=>setPhoneFixe(event.target.value)}
                                    />
                                </div>
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
                                        // defaultValue={mobile} 
                                        // onChange={(event)=>setMobile(event.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="fax"
                                    className="text-blackish-blue mb-2"
                                >
                                    Fax
                                </label>
                                <div className='form-group'>
                                    <input
                                        type='text'
                                        id='fax'
                                        className='form-control'
                                        placeholder='Fax'
                                        defaultValue={fax} 
                                        onChange={(event)=>setFax(event.target.value)}
                                    />
                                </div>
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
                                        type='text'
                                        id='email'
                                        className='form-control'
                                        placeholder='Email'
                                        defaultValue={email} 
                                        onChange={(event)=>setEmail(event.target.value)}
                                    />
                                </div>
                            </div>
                            
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="dateConstitution"
                                    className="text-blackish-blue mb-2"
                                >
                                    Date de constitution 
                                </label>
                                <div className='form-group'>
                                    <input
                                        type='text'
                                        id='dateConstitution'
                                        className='form-control'
                                        placeholder='Date de constitution '
                                        defaultValue={dateConstitution} 
                                        onChange={(event)=>setDateConstitution(event.target.value)}
                                    />
                                </div>
                            </div>
                            
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="registrationDate"
                                    className="text-blackish-blue mb-2"
                                >
                                    Date d'enregistrement
                                </label>
                                <div className='form-group'>
                                    <input
                                        type='text'
                                        id='registrationDate'
                                        className='form-control'
                                        placeholder="Date d'enregistrement"
                                        defaultValue={registrationDate} 
                                        onChange={(event)=>setRegistrationDate(event.target.value)}
                                    />
                                </div>
                            </div>

                            

                            















                            {/* <p className="colorRed mb-7 ">
                                NB : Aucun retour n'est permis sur cette page donc, répondez correctement aux questions
                            </p> */}

                            {/* {kycForParticular?.userId ? (
                                <button className="btn btn-primary " type='button' onClick={updateQuestionnaire}  disabled={isLoggingIn}>Suivant</button>
                            ) : (
                                <button className="btn btn-primary " type='button' onClick={addQuestionnaire}  disabled={isLoggingIn}>Suivant</button>
                            )} */}

                            <div className="form-group mb-6 mt-3 col-lg-12 col-md-12  row justify-content-between">
                                <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">
                                    <Link href='/profil/kyc/entreprise/questionnaire-aml-five/' className="align-right">
                                        <a
                                        className=""
                                        >
                                            <button className="btn btn-primary " type='button'  > Précédente </button>
                                        </a>   
                                    </Link>                          
                                </div>
                                <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">
                                    <Link href='/profil/kyc/entreprise/identite-representant-one/' className="align-right">
                                        <a
                                        className=""
                                        >
                                            <button className="btn btn-primary " type='button'  > Suivant </button>
                                        </a>   
                                    </Link>                          
                                </div>
                            </div> 
                            {/* <button className="btn btn-primary "  disabled={isLoggingIn}>Suivant</button> */}
                        </form>       
                    </div>
                <div className='col-lg-3 col-md-12'></div>
            </div>
        </div>
    </>
  );
};

export default CIdentiteOne;
