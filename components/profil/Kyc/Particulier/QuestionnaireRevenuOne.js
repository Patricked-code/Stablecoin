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

const CQuestionnaireRevenuOne = () => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API

    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [messageError, setMessageError] = useState();

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
                    Router.push("/profil/kyc/particulier/questionnaires-revenus-two");
                    // Router.push("/profil/kyc/particulier/seconde-phase");
                    
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
                // incomeTypeA:Object.assign({}, incomeTypeA),
                // incomeTypeB:Object.assign({},incomeTypeB),
                // incomeTypeC:Object.assign({},incomeTypeC)
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
                            Router.push("/profil/kyc/particulier/questionnaires-revenus-two"); 
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

    // La barre de progression de KYC
    const steps = ["AML 1 & 2","FATCA", "Identité 1 & 2", "Selfie", "Domicile", "Photo", "Signature"];
    const activeStep = -1;
    // Fin

  return (
    <>
      <ProgressBar className="mb-15" steps={steps} activeStep={activeStep} />

        <div className='mt-15' >
            <div className=' mx-15'>
                <div className='py-10'>
                <br/><br/><h1 className='text-center '>Questionnaires AML & REVENU </h1>
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
                            {/* Question 1 */}
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="Q1"
                                    className="text-blackish-blue mb-2"
                                >
                                   Avez-vous des dépenses ou payez vous des charges récurrentes mensuelles ou annuelles ?( Assurances, loyers, abonnement "internet, eau, courant, transports" remboursement crédit)
                                </label>
                                <select 
                                className="form-control"
                                id="Q1"
                                required
                                defaultValue={statutQ1} 
                                onChange={(event)=>setStatutQ1(event.target.value)}
                                >
                                <option defaultValue="">Choisissez</option>
                                    <optgroup className='single-cryptocurrency-box'>
                                    <option  value="Oui">Oui</option>
                                    <option  value="Non">Non</option>
                                    </optgroup>
                                </select>
                            </div >
                            {/* Fin */}

                            {/* Question 2 */}
                            {statutQ1==="Oui" ? (
                                <>
                               
                                    <label
                                        htmlFor="Q1"
                                        className="text-blackish-blue mb-2"
                                    >
                                        Choisissez vos dépenses récurrentes parmi les catégories ci-dessous
                                    </label>
                                    {/* Loyer */}
                                    <div className="form-group  mt-3 ">
                                        <label
                                            htmlFor="terms-check"
                                            className="gr-check-input mb-7 d-flex"
                                        >
                                            <input 
                                                type="checkbox" 
                                                name="loyer"
                                                value="Loyer"
                                                id='terms-check' 
                                                checked={spentA.includes("Loyer")}
                                                onChange={handleOptionSpentA}
                                            />
                                        <p className=" mx-2 mb-0 text-center">
                                            Loyer
                                        </p>
                                        </label>
                                    </div>
                                    {/* Assurances */}
                                    <div className="form-group  mt-3 ">
                                        <label
                                            htmlFor="Assurances-check"
                                            className="gr-check-input mb-7 d-flex"
                                        >
                                            <input 
                                            type="checkbox" 
                                            name="transport"
                                            id='Assurances-check'
                                            value='Assurances' 
                                            checked={spentB.includes("Assurances")}
                                            onChange={handleOptionSpentB}
                                            />
                                        <p className=" mx-2 mb-0 text-center" htmlFor="Assurances-check">
                                            Assurances
                                        </p>
                                        </label>
                                    </div>
                                    {/* Crédit bancaire */}
                                    <div className="form-group  mt-3 ">
                                        <label
                                            htmlFor="bancaire-check"
                                            className="gr-check-input mb-7 d-flex"
                                        >
                                            <input 
                                            type="checkbox" 
                                            name="transport"
                                            id='bancaire-check' 
                                            value='Crédit bancaire' 
                                            checked={spentC.includes("Crédit bancaire")}
                                            onChange={handleOptionSpentC}
                                            />
                                        <p className=" mx-2 mb-0 text-center">
                                            Crédit bancaire
                                        </p>
                                        </label>
                                    </div>
                                    {/* Transport */}
                                    <div className="form-group  mt-3 ">
                                        <label
                                            htmlFor="Transport-check"
                                            className="gr-check-input mb-7 d-flex"
                                        >
                                            <input 
                                            type="checkbox" 
                                            name="transport"
                                            id='Transport-check' 
                                            value='Transport'
                                            checked={spentD.includes("Transport")}
                                            onChange={handleOptionSpentD}
                                            />
                                        <p className=" mx-2 mb-0 text-center">
                                            Transport
                                        </p>
                                        </label>
                                    </div>
                                    {/* Abonnement & factures */}
                                    <div className="form-group  mt-3 ">
                                        <label
                                            htmlFor="factures-check"
                                            className="gr-check-input mb-7 d-flex"
                                        >
                                            <input 
                                            type="checkbox" 
                                            name="transport"
                                            id='terms-check' 
                                            value='Abonnement & factures'
                                            checked={spentE.includes("Abonnement & factures")}
                                            onChange={handleOptionSpentE}
                                            />
                                        <p className=" mx-2 mb-0 text-center">
                                            Abonnement & factures
                                        </p>
                                        </label>
                                    </div>
                                    {/* Scolarité */}
                                    <div className="form-group  mt-3 ">
                                        <label
                                            htmlFor="Scolarite-check"
                                            className="gr-check-input mb-7 d-flex"
                                        >
                                            <input 
                                            type="checkbox" 
                                            name="scolarite"
                                            id='terms-check' 
                                            value='Scolarité'
                                            checked={spentF.includes('Scolarité')}
                                            onChange={handleOptionSpentF}
                                            />
                                            <p className=" mx-2 mb-0 text-center">
                                                Scolarité
                                            </p>
                                        </label>
                                    </div>
                                </>
                            ) :("")}
                            {/* Fin Q2 */}
                            
                            {/* Question 3 */}
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="Q1"
                                    className="text-blackish-blue mb-2"
                                >
                                    Avez-vous une source récurrente de revenus financiers ? soit mensuelle, trimestrielle ou annuelle ?
                                </label>
                                <select 
                                className="form-control"
                                id="Q3"
                                required
                                defaultValue={statutQ3} 
                                onChange={(event)=>setStatutQ3(event.target.value)}
                                >
                                <option defaultValue="">Choisissez</option>
                                    <optgroup className='single-cryptocurrency-box'>
                                    <option  value="Oui">Oui - J'ai des revenus financiers récurrents</option>
                                    <option  value="Non">Non - mes revenus ne sont pas récurrents</option>
                                    </optgroup>
                                </select>
                            </div >
                            {/* Fin Q3 */}

                            {/* Question 4 */}
                            {statutQ3==="Oui" ? (
                                <>
                               
                                    <label
                                        htmlFor="Q1"
                                        className="text-blackish-blue mb-2"
                                    >
                                    Choisissez la ou les fréquences de vos revenus
                                    </label>
                                    {/* Revenus mensuels*/}
                                    <div className="form-group  mt-3 ">
                                        <label
                                            htmlFor="mensuels-check"
                                            className="gr-check-input mb-7 d-flex"
                                        >
                                            <input 
                                            type="checkbox" 
                                            name="mensuels"
                                            id='mensuels-check' 
                                            value='Revenus mensuels'
                                            checked={frequencyA.includes('Revenus mensuels')}
                                            onChange={handleOptionFrequencyA}
                                            />
                                        <p className=" mx-2 mb-0 text-center">
                                            Revenus mensuels
                                        </p>
                                        </label>
                                    </div>
                                    {/* Revenus Trimestriels */}
                                    <div className="form-group  mt-3 ">
                                        <label
                                            htmlFor="trimestriels-check"
                                            className="gr-check-input mb-7 d-flex"
                                        >
                                            <input 
                                            type="checkbox" 
                                            name="trimestriels"
                                            id='trimestriels-check' 
                                            value='Revenus trimestriels'
                                            checked={frequencyB.includes('Revenus trimestriels')}
                                            onChange={handleOptionFrequencyB}
                                            />
                                        <p className=" mx-2 mb-0 text-center">
                                            Revenus trimestriels
                                        </p>
                                        </label>
                                    </div>
                                    {/* Revenus annuels */}
                                    <div className="form-group  mt-3 ">
                                        <label
                                            htmlFor="annuels-check"
                                            className="gr-check-input mb-7 d-flex"
                                        >
                                            <input 
                                            type="checkbox" 
                                            name="annuels"
                                            id='annuels-check' 
                                            value='Revenus annuels'
                                            checked={frequencyC.includes('Revenus annuels')}
                                            onChange={handleOptionFrequencyC}
                                            />
                                        <p className=" mx-2 mb-0 text-center">
                                            Revenus annuels
                                        </p>
                                        </label>
                                    </div>
                                </>
                            ):("")}
                            {/* Fin Q4 */}

                            {/* Question 5 */}
                            {/* <label
                                htmlFor="Q1"
                                className="text-blackish-blue mb-2"
                            >
                                Dans quel cadre touchez vous ces revenus ?
                            </label> */}
                            {/* Salaire mensuels*/}
                            {/* <div className="form-group  mt-3 ">
                                <label
                                    htmlFor="SalaireMensuels-check"
                                    className="gr-check-input mb-7 d-flex"
                                >
                                    <input 
                                    type="checkbox" 
                                    name="SalaireMensuels"
                                    id='SalaireMensuels-check' 
                                    value='Salaire mensuels'
                                    checked={incomeTypeA.includes('Salaire mensuels')}
                                    onChange={handleOptionIncomeTypeA}
                                    />
                                <p className=" mx-2 mb-0 text-center">
                                    Salaire mensuels (Vous êtes salariés)
                                </p>
                                </label>
                            </div> */}
                            {/* Revenus Trimestriels */}
                            {/* <div className="form-group  mt-3 ">
                                <label
                                    htmlFor="trimestriels-check"
                                    className="gr-check-input mb-7 d-flex"
                                >
                                    <input 
                                    type="checkbox" 
                                    name="trimestriels"
                                    id='trimestriels-check' 
                                    value='Revenus trimestriels'
                                    checked={incomeTypeB.includes('Revenus trimestriels')}
                                    onChange={handleOptionIncomeTypeB}
                                    />
                                <p className=" mx-2 mb-0 text-center">
                                    Revenus trimestriels
                                </p>
                                </label>
                            </div> */}
                            {/* Rentes immobilières (Vous percevez des loyers) */}
                            {/* <div className="form-group  mt-3 ">
                                <label
                                    htmlFor="immobilieres-check"
                                    className="gr-check-input mb-7 d-flex"
                                >
                                    <input 
                                    type="checkbox" 
                                    name="immobilieres"
                                    id='immobilieres' 
                                    value='Rentes immobilières'
                                    checked={incomeTypeC.includes('Rentes immobilières')}
                                    onChange={handleOptionIncomeTypeC}
                                    />
                                <p className=" mx-2 mb-0 text-center">
                                    Rentes immobilières (Vous percevez des loyers)
                                </p>
                                </label>
                            </div> */}
                            {/* Fin Q5 */}


                            {/* <p className="colorRed mb-7 ">
                                NB : Aucun retour n'est permis sur cette page donc, répondez correctement aux questions
                            </p> */}

                            {kycForParticular?.userId ? (
                                <button className="btn btn-primary " type='button' onClick={updateQuestionnaire}  disabled={isLoggingIn}>Suivant</button>
                            ) : (
                                <button className="btn btn-primary " type='button' onClick={addQuestionnaire}  disabled={isLoggingIn}>Suivant</button>
                            )}
                            {/* <button className="btn btn-primary "  disabled={isLoggingIn}>Suivant</button> */}
                        </form>       
                    </div>
                <div className='col-lg-3 col-md-12'></div>
            </div>
        </div>
    </>
  );
};

export default CQuestionnaireRevenuOne;
