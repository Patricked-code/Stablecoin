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

const CQuestionnaireRevenuTwo = () => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API

    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [messageError, setMessageError] = useState();

                            // incomeMonthly
                            // annualIncome
                            // natureAccount
                            // naturerelationship
                            // linkAnotherClient
                            // otherBankName
                            // otherBankCountry
                            // othertypeAccount
                            // mobileCountry
                            // operator

    // LES STATES DU FORMULAIRE DE REVENU
    // const [incomeMonthly, setIncomeMonthly] = useState();
    // const [annualIncome, setAnnualIncome] = useState();
    const [natureAccount, setNatureAccount] = useState();
    const [naturerelationship, setNaturerelationship] = useState();
    const [linkAnotherClient, setLinkAnotherClient] = useState();
    const [otherBankName, setOtherBankName] = useState();
    const [otherBankCountry, setOtherBankCountry] = useState();
    const [otherTypeAccount, setOtherTypeAccount] = useState();
    // const [mobileCountry, setMobileCountry] = useState();
    // const [operator, setOperator] = useState();

    // AVEC UNE MISE A JOUR

                            // incomeMonthly
                            // annualIncome
                            // otherBankAccount
                            // savingsAccount
                            // currentAccount
                            // bankReferencesSavings
                            // otherBankNameSavings
                            // otherBankCountrySavings
                            // bankReferencesCurrent
                            // otherBankNameCurrent
                            // otherBankCountryCurrent
                            // mobileAccount
                            // mobileCountry
                            // operator
    const [salaries, setSalaries] = useState('');
  const [rents, setRents] = useState('');
  const [leases, setLeases] = useState('');
  const [businessReceipts, setBusinessReceipts] = useState('');
  const [allowances, setAllowances] = useState('');
//   ***************************************
const [incomeMonthly, setIncomeMonthly] = useState('');
const [annualIncome, setAnnualIncome] = useState('');
const [otherBankAccount, setOtherBankAccount] = useState('');
const [savingsAccount, setSavingsAccount] = useState('');
const [currentAccount, setCurrentAccount] = useState('');
const [bankReferencesSavings, setBankReferencesSavings] = useState('');
const [otherBankNameSavings, setOtherBankNameSavings] = useState('');
const [otherBankCountrySavings, setOtherBankCountrySavings] = useState('');
const [bankReferencesCurrent, setBankReferencesCurrent] = useState('');
const [otherBankNameCurrent, setOtherBankNameCurrent] = useState('');
const [otherBankCountryCurrent, setOtherBankCountryCurrent] = useState('');
const [mobileAccount, setMobileAccount] = useState('');
const [mobileCountry, setMobileCountry] = useState('');
const [operator, setOperator] = useState('');



                            
                            
                            

















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

    // La barre de progression de KYC
    const steps = ["Questionnaires", "Justificatif d'identité", "Justificatif de domicile", "Photo", "Signature"];
    const activeStep = -1;
    // Fin

  return (
    <>
      <ProgressBar className="mb-15" steps={steps} activeStep={activeStep} />

        <div className='mt-15' >
            <div className=' mx-15'>
                <div className='py-10'>
                <br/><br/><h1 className='text-center '>Questionnaires AML & REVENU 2</h1>
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
                                    htmlFor="incomeMonthly"
                                    className="text-blackish-blue mb-2"
                                >
                                  Quel est l'estimation de vos revenus mensuels ?
                                </label>
                                <div className='form-group'>
                                    <input
                                        type='text'
                                        className='form-control'
                                        placeholder='Montant des revenus mensuels'
                                        defaultValue={incomeMonthly} 
                                        onChange={(event)=>setIncomeMonthly(event.target.value)}
                                    />
                                </div>
                            </div >
                            {/* Fin */}
                            {/* Question 2 */}
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="Q1"
                                    className="text-blackish-blue mb-2"
                                >
                                  Quel est l'estimation de vos revenus annuels
                                </label>
                                <div className='form-group'>
                                    <input
                                        type='text'
                                        className='form-control'
                                        placeholder='Montant des revenus annuels'
                                        defaultValue={annualIncome} 
                                        onChange={(event)=>setAnnualIncome(event.target.value)}
                                    />
                                </div>
                            </div >
                            {/* Fin */}
                            
                            {/* **************SECTION BANQUE************** */}
                            <div className="form-group mb-6 mt-3">
                                <label
                                        htmlFor="otherBankAccount"
                                        className="text-blackish-blue mb-2"
                                    >
                                        Avez-vous un compte bancaire ?
                                </label>
                                <select 
                                className="form-control"
                                id="otherBankAccount"
                                required
                                defaultValue={otherBankAccount} 
                                onChange={(event)=>setOtherBankAccount(event.target.value)}
                                >
                                <option defaultValue="">Choisissez</option>
                                    <optgroup className='single-cryptocurrency-box'>
                                    <option  value="Oui">Oui</option>
                                    <option  value="Non">Non</option>
                                    </optgroup>
                                </select>
                            </div >
                            
                            {/* **************SI L'UTILISATEUR A UN COMPTE************ */}
                            {/* Question 3 */}
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="natureAccount"
                                    className="text-blackish-blue mb-2"
                                >
                                    Nature du ou des comptes
                                </label>
                                {/* Compte épargne */}
                                <div className="form-group ">
                                    <label
                                        htmlFor="savingsAccount-check"
                                        className="gr-check-input mb-7 d-flex"
                                    >
                                        <input 
                                            type="checkbox" 
                                            name="Compte épargne"
                                            value="Compte épargne"
                                            id='savingsAccount-check' 
                                            checked={savingsAccount.includes("Compte épargne")}
                                            // onChange={handleOptionSavingsAccount}
                                        />
                                    <p className=" mx-2 mb-0 text-center">
                                        Compte épargne
                                    </p>
                                    </label>
                                </div>
                                
                                <div className="form-group ">
                                    <label
                                        htmlFor="currentAccount-check"
                                        className="gr-check-input mb-7 d-flex"
                                    >
                                    {/* savingsAccount
                                    currentAccount */}
                                        <input 
                                            type="checkbox" 
                                            name="Compte courant"
                                            value="Compte courant"
                                            id='currentAccount-check' 
                                            checked={currentAccount.includes("Compte courant")}
                                            // onChange={handleOptionCurrentAccount}
                                        />
                                    <p className=" mx-2 mb-0 text-center">
                                        Compte courant
                                    </p>
                                    </label>
                                </div>
                            </div >
                            {/* Fin */}

                            {/* LES CHAMPS A RENSEIGNER QUAND L'UTISATEUR A UN COMPTE BANCAIRE D'EPARGNE*/}
                            {/* Question 6 */}
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="bankReferencesSavings"
                                    className="text-blackish-blue mb-2"
                                >
                                    Reférences de votre compte bancaires d'épargne
                                </label>
                                <div className='form-group'>
                                    <input
                                        type='text'
                                        id='bankReferencesSavings'
                                        className='form-control'
                                        placeholder="Reférences de votre compte bancaires d'épargne"
                                        defaultValue={bankReferencesSavings} 
                                        onChange={(event)=>setBankReferencesSavings(event.target.value)}
                                    />
                                </div>
                            </div>
                            
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="bankNameSavings"
                                    className="text-blackish-blue mb-2"
                                >
                                  Nom de la banque du compte d'épargne
                                </label>
                                <div className='form-group '>
                                    <input
                                        type='text'
                                        id='bankNameSavings'
                                        className='form-control'
                                        placeholder="Nom de la banque du compte d'épargne"
                                        defaultValue={otherBankNameSavings} 
                                        onChange={(event)=>setOtherBankNameSavings(event.target.value)}
                                    />
                                </div>
                            </div >
                            {/* Fin */}

                             {/* Question 7 */}
                             <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="otherBankCountrySavings"
                                    className="text-blackish-blue mb-2"
                                >
                                    Pays de votre compte bancaire d'épargne existant
                                </label>
                                <select 
                                className="form-control"
                                id="otherBankCountrySavings"
                                required
                                defaultValue={otherBankCountrySavings} 
                                onChange={(event)=>setOtherBankCountrySavings(event.target.value)}
                                >
                                <option defaultValue="">Choisissez</option>
                                    <optgroup className='single-cryptocurrency-box'>
                                    <option  value="Oui">Côte d'ivoire </option>
                                    <option  value="Non">Mali</option>
                                    </optgroup>
                                </select>
                            </div >
                            
                            {/* Fin Q3 */}
                            {/* **********FIN CONDITION S'IL A UN COMPTE BANCAIRE******** */}

                            {/* LES CHAMPS A RENSEIGNER QUAND L'UTISATEUR A UN COMPTE BANCAIRE COURANT*/}
                            {/* Question 6 */}
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="bankReferencesCurrent"
                                    className="text-blackish-blue mb-2"
                                >
                                    Reférences de votre compte bancaires courant
                                </label>
                                <div className='form-group'>
                                    <input
                                        type='text'
                                        id='bankReferencesCurrent'
                                        className='form-control'
                                        placeholder='Reférences de votre compte bancaires courant'
                                        defaultValue={bankReferencesCurrent} 
                                        onChange={(event)=>setBankReferencesCurrent(event.target.value)}
                                    />
                                </div>
                            </div>
                            
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="bankNameCurrent"
                                    className="text-blackish-blue mb-2"
                                >
                                  Nom de la banque courant
                                </label>
                                <div className='form-group '>
                                    <input
                                        type='text'
                                        id='bankNameCurrentCurrent'
                                        className='form-control'
                                        placeholder='Nom de la banque courant'
                                        defaultValue={otherBankNameCurrent} 
                                        onChange={(event)=>setOtherBankNameCurrent(event.target.value)}
                                    />
                                </div>
                            </div >
                            {/* Fin */}
                            
                             {/* Question 7 */}
                             <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="otherBankCountryCurrent"
                                    className="text-blackish-blue mb-2"
                                >
                                    Pays de votre compte bancaire courant existant
                                </label>
                                <select 
                                className="form-control"
                                id="otherBankCountryCurrent"
                                required
                                defaultValue={otherBankCountryCurrent} 
                                onChange={(event)=>setOtherBankCountryCurrent(event.target.value)}
                                >
                                <option defaultValue="">Choisissez</option>
                                    <optgroup className='single-cryptocurrency-box'>
                                    <option  value="Oui">Côte d'ivoire </option>
                                    <option  value="Non">Mali</option>
                                    </optgroup>
                                </select>
                            </div >
                           
                            {/* Fin Q3 */}
                            {/* ***********FIN CONDITION S'IL A UN COMPTE BANCAIRE COURANT**** */}
                            
                            {/* ***********************FIN SECTION BANQUE*************** */}
                           
                            {/* ***************FIN CONDITION***************** */}





                            {/* ********SECTION MOBILE MONEY****************** */}
                            <div className="form-group mb-6 mt-3">
                                <label
                                        htmlFor="mobileAccount"
                                        className="text-blackish-blue mb-2"
                                    >
                                        Avez-vous un compte de monnaie électronique?
                                </label>
                                <select 
                                className="form-control"
                                id="mobileAccount"
                                required
                                defaultValue={mobileAccount} 
                                onChange={(event)=>setMobileAccount(event.target.value)}
                                >
                                <option defaultValue="">Choisissez</option>
                                    <optgroup className='single-cryptocurrency-box'>
                                    <option  value="Oui">Oui</option>
                                    <option  value="Non">Non</option>
                                    </optgroup>
                                </select>
                            </div >
                            
                            {/* ****************SI L'UTISATEUR A UN COMPTE MOBILE MONEY******** */}
                            {/* Question 7 */}
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="mobileCountry"
                                    className="text-blackish-blue mb-2"
                                >
                                    Pays de votre compte de la monnaie électronique existant
                                </label>
                                <select 
                                className="form-control"
                                id="mobileCountry"
                                required
                                defaultValue={mobileCountry} 
                                onChange={(event)=>setMobileCountry(event.target.value)}
                                >
                                <option defaultValue="">Choisissez</option>
                                    <optgroup className='single-cryptocurrency-box'>
                                    <option  value="Oui">Côte d'ivoire </option>
                                    <option  value="Non">Mali</option>
                                    </optgroup>
                                </select>
                            </div >
                            {/* Fin Q3 */}

                            {/* Question 7 */}
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="Operator"
                                    className="text-blackish-blue mb-2"
                                >
                                    Opérateur votre compte de la monnaie électronique existant
                                </label>
                                <select 
                                className="form-control"
                                id="operator"
                                required
                                defaultValue={operator} 
                                onChange={(event)=>setOperator(event.target.value)}
                                >
                                <option defaultValue="">Choisissez</option>
                                    <optgroup className='single-cryptocurrency-box'>
                                    <option  value="Oui">MTN </option>
                                    <option  value="Non">MOOV</option>
                                    </optgroup>
                                </select>
                            </div >
                            {/* Fin Q3 */}

                            {/* **********FIN CONDITION MOBILE************** */}
                            {/* ****************FIN SECTION MOBILE***************** */}
                            


                           
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="employerCorporate"
                                    className="text-blackish-blue mb-2"
                                >
                                    Source des revenus 

                                </label>

                                {/* <div className='form-group mt-3'>
                                    <input
                                        type='text'
                                        id='sourceIncome'
                                        className='form-control'
                                        placeholder='Source des revenus'
                                        defaultValue={sourceIncome} 
                                        onChange={(event)=>setSourceIncome(event.target.value)}
                                    />
                                </div> */}

                                <div>
                                    <label htmlFor="salaries">Salaires:</label>
                                    <input
                                    type="number"
                                    id="salaries"
                                    placeholder='Montant'
                                    value={salaries}
                                    onChange={(e) => setSalaries(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="rents">Rentes:</label>
                                    <input
                                    type="number"
                                    id="rents"
                                    placeholder='Montant'
                                    value={rents}
                                    onChange={(e) => setRents(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="businessReceipts">Recettes activités commerciales:</label>
                                    <input
                                    type="number"
                                    id="businessReceipts"
                                    placeholder='Montant'
                                    value={businessReceipts}
                                    onChange={(e) => setBusinessReceipts(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="allowances">Indemnités:</label>
                                    <input
                                    type="number"
                                    id="allowances"
                                    placeholder='Montant'
                                    value={allowances}
                                    onChange={(e) => setAllowances(e.target.value)}
                                    />
                                </div>
                                </div>





                            
                            

                           

                            
                            
                            
                            
                            









                            

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

export default CQuestionnaireRevenuTwo;
