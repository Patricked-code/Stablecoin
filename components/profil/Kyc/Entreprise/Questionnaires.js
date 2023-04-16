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

const CQuestionnaire = () => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API

    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [messageError, setMessageError] = useState();


    // states des questionnaires

    // State de la question 2
    const [spentA, setSpentA] = useState([]);
    const [spentB, setSpentB] = useState([]);
    const [spentC, setSpentC] = useState([]);
    const [spentD, setSpentD] = useState([]);
    const [spentE, setSpentE] = useState([]);

    // State de la question 4
    const [operationA, setOperationA] = useState([]);
    const [operationB, setOperationB] = useState([]);
    const [operationC, setOperationC] = useState([]);
    const [operationD, setOperationD] = useState([]);
    const [operationE, setOperationE] = useState([]);
    const [operationF, setOperationF] = useState([]);
    const [operationG, setOperationG] = useState([]);

    const [eShop, setEShop] = useState();
    const [multiplePayment, setMultiplePayment] = useState();

    const [statutQ1, setStatutQ1] = useState();
    const [statutQ3, setStatutQ3] = useState();

    const [kycForEntreprise, setKycForEntreprise] = useState();


    


    const [currentKycEntrepriseStatut, setCurrentKycEntrepriseStatut] = useState();

    //localStorage pour récupérer une valeur en cliquant sur un bouton Recompleter qui indique qu'on veut modifier une partie Kyc 
    useEffect(() => {
        const kycStatut = localStorage.getItem('currentKycEntrepriseStatut')  
        setCurrentKycEntrepriseStatut(kycStatut)
    }, [currentKycEntrepriseStatut]);






    // RECUPERER KYC DE L'ENTREPRISE
    useEffect(async() => {
        const token = localStorage.getItem('tokenEnCours')
        
            const getKycForEntreprise = async () => {
            const resKyc = await fetch(`${API_URL}/api/kyc/entreprise/find-kyc-entreprise-for-user`, {
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
            // console.log("Banques =>",allBank)
            await getKycForEntreprise();
    }, []);
    // FIN

    // Fonction d'envoie des informations du questionnaire
    const addQuestionnaire= useCallback(async () => {
        // setIsLoggingIn(true);
        
        try {
            const dataTable = {
                spentA:Object.assign({},spentA),
                spentB:Object.assign({},spentB),
                spentC:Object.assign({},spentC),
                spentD:Object.assign({},spentD),
                spentE:Object.assign({},spentE),
                operationA:Object.assign({},operationA),
                operationB:Object.assign({},operationB),
                operationC:Object.assign({},operationC),
                operationD:Object.assign({},operationD),
                operationE:Object.assign({},operationE),
                operationF:Object.assign({},operationF),
                operationG:Object.assign({},operationG)
            }

            const dataa = {
                spentA:dataTable?.spentA[0],
                spentB:dataTable?.spentB[0],
                spentC:dataTable?.spentC[0],
                spentD:dataTable?.spentD[0],
                spentE:dataTable?.spentE[0],
                operationA:dataTable?.operationA[0],
                operationB:dataTable?.operationB[0],
                operationC:dataTable?.operationC[0],
                operationD:dataTable?.operationD[0],
                operationE:dataTable?.operationE[0],
                operationF:dataTable?.operationF[0],
                operationG:dataTable?.operationG[0],
                eShop:eShop,
                multiplePayment:multiplePayment
            }

            if (dataa?.spentA||dataa?.spentB||dataa?.spentC||dataa?.spentD||dataa?.spentE||dataa?.operationA||dataa?.operationB||dataa?.operationC||dataa?.operationD||dataa?.operationE||dataa?.operationF||dataa?.operationG||dataa?.eShop||dataa?.multiplePayment) {
                
                
                const token = localStorage.getItem('tokenEnCours') //Le token récuperé

                const result = await fetch(`${API_URL}/api/kyc/entreprise/add-kyc-questionnaires`, {
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
                    Router.push("/profil/kyc/entreprise/documents-legaux"); 
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
        
    }, [spentA,spentB,spentC,spentD,spentE,operationA,operationB,operationC,operationD,operationE,operationF,operationG,eShop,multiplePayment]);
    // Fin


    // Fonction d'envoie des informations du questionnaire
    const updateQuestionnaire= useCallback(async () => {
        // setIsLoggingIn(true);
        
        try {
            const dataTable = {
                spentA:Object.assign({},spentA),
                spentB:Object.assign({},spentB),
                spentC:Object.assign({},spentC),
                spentD:Object.assign({},spentD),
                spentE:Object.assign({},spentE),
                operationA:Object.assign({},operationA),
                operationB:Object.assign({},operationB),
                operationC:Object.assign({},operationC),
                operationD:Object.assign({},operationD),
                operationE:Object.assign({},operationE),
                operationF:Object.assign({},operationF),
                operationG:Object.assign({},operationG)
            }

            const dataa = {
                spentA:dataTable?.spentA[0],
                spentB:dataTable?.spentB[0],
                spentC:dataTable?.spentC[0],
                spentD:dataTable?.spentD[0],
                spentE:dataTable?.spentE[0],
                operationA:dataTable?.operationA[0],
                operationB:dataTable?.operationB[0],
                operationC:dataTable?.operationC[0],
                operationD:dataTable?.operationD[0],
                operationE:dataTable?.operationE[0],
                operationF:dataTable?.operationF[0],
                operationG:dataTable?.operationG[0],
                eShop:eShop,
                multiplePayment:multiplePayment
            }

            if (dataa?.spentA||dataa?.spentB||dataa?.spentC||dataa?.spentD||dataa?.spentE||dataa?.operationA||dataa?.operationB||dataa?.operationC||dataa?.operationD||dataa?.operationE||dataa?.operationF||dataa?.operationG||dataa?.eShop||dataa?.multiplePayment) {
                
                
                const token = localStorage.getItem('tokenEnCours') //Le token récuperé

                const result = await fetch(`${API_URL}/api/kyc/entreprise/update-kyc-questionnaires`, {
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
                        if (currentKycEntrepriseStatut==="1") {
                            Router.push("/profil/kyc/entreprise/resultat-kyc"); 
            
                        }else{
                            Router.push("/profil/kyc/entreprise/documents-legaux"); 
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
        
    }, [spentA,spentB,spentC,spentD,spentE,operationA,operationB,operationC,operationD,operationE,operationF,operationG,eShop,multiplePayment]);
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
    // FIN

    // Les handles de la 4è question
    const handleOptionOperationA = (event) => {
        const value = event.target.value;
        const isChecked = event.target.checked;

        if (isChecked) {
            setOperationA([...operationA, value]);
        } else {
            setOperationA("");
        }
    };

    const handleOptionOperationB = (event) => {
        const value = event.target.value;
        const isChecked = event.target.checked;

        if (isChecked) {
            setOperationB([...operationB, value]);
        } else {
            setOperationB("");
        }
    };

    const handleOptionOperationC = (event) => {
        const value = event.target.value;
        const isChecked = event.target.checked;

        if (isChecked) {
            setOperationC([...operationC, value]);
        } else {
            setOperationC("");
        }
    };

    const handleOptionOperationD = (event) => {
        const value = event.target.value;
        const isChecked = event.target.checked;

        if (isChecked) {
            setOperationD([...operationD, value]);
        } else {
            setOperationD("");
        }
    };

    const handleOptionOperationE = (event) => {
        const value = event.target.value;
        const isChecked = event.target.checked;

        if (isChecked) {
            setOperationE([...operationE, value]);
        } else {
            setOperationE("");
        }
    };

    const handleOptionOperationF = (event) => {
        const value = event.target.value;
        const isChecked = event.target.checked;

        if (isChecked) {
            setOperationF([...operationF, value]);
        } else {
            setOperationF("");
        }
    };

    const handleOptionOperationG = (event) => {
        const value = event.target.value;
        const isChecked = event.target.checked;

        if (isChecked) {
            setOperationG([...operationG, value]);
        } else {
            setOperationG("");
        }
    }

   // La barre de progression de KYC du profil particulier
   const stepsEntreprise = ["Questionnaires","Documents légaux","Justificatif de domicile", "Justificatif d'identité","Photo", "Signature"];
   const activeStepEntreprise = -1;
   // Fin


  return (
    <>
        <ProgressBar className="mb-15" steps={stepsEntreprise} activeStep={activeStepEntreprise} />
    

        <div className='' >
            <div className=' mx-15'>
                <div className='py-10'>
                    <br/><br/><h1 className='text-center'>Questionnaires</h1>
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
                                   Avez-vous des dépenses ou payer vous des charges récurrentes mensuelles ou annuelles dans le cadre des activités de votre entreprises ( Assurances, loyers, abonnement "internet, eau, courant, transports", remboursement de crédit, salaires, cotisations, fournisseurs )
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
                                        Choisissez vos dépenses récurrentes parmi les catégories ci-dessous : (choix multiples)
                                    </label>
                                    {/* Loyer */}
                                    <div className="form-group  mt-3 ">
                                        <label
                                            htmlFor="terms-check"
                                            className="gr-check-input mb-7 d-flex"
                                        >
                                            <input 
                                            type="checkbox" 
                                            name="transport"
                                            id='terms-check' 
                                            value='Loyer' 
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
                                            name="assurance"
                                            id='Assurances-check' 
                                            value='Assurances' 
                                            checked={spentB.includes("Assurances")}
                                            onChange={handleOptionSpentB}
                                            />
                                        <p className=" mx-2 mb-0 text-center">
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
                                            name="credit"
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
                                </>
                            ):('')}
                             {/* Fin Q2 */}

                            {/* Question 3 */}
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="Q1"
                                    className="text-blackish-blue mb-2"
                                >
                                    Avez-vous des clients ou des fournisseurs dans en dehors du pays dans lequel votre entreprise en située?
                                </label>
                                <select 
                                className="form-control"
                                id="Q1"
                                required
                                defaultValue={statutQ3} 
                                onChange={(event)=>setStatutQ3(event.target.value)}
                                >
                                <option defaultValue="">Choisissez</option>
                                    <optgroup className='single-cryptocurrency-box'>
                                    <option  value="Oui">Oui </option>
                                    <option  value="Non">Non </option>
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
                                        Les opérations financières transfrontalières dans le cadre des activités de votre entreprise concernent ? 
                                    </label>
                                
                                    {/* operationA*/}
                                    <div className="form-group  mt-3 ">
                                        <label
                                            htmlFor="operationA-check"
                                            className="gr-check-input mb-7 d-flex"
                                        >
                                            <input 
                                            type="checkbox" 
                                            name="operationA"
                                            id='operationA-check' 
                                            value="Vos clients Afrique-hors UEMOA: Réception de Fonds facturés aux clients africains-Hors CFA"
                                            checked={operationA.includes("Vos clients Afrique-hors UEMOA: Réception de Fonds facturés aux clients africains-Hors CFA")}
                                            onChange={handleOptionOperationA}
                                            />
                                        <p className=" mx-2 mb-0">
                                            Vos clients Afrique-hors UEMOA: Réception de Fonds facturés aux clients africains-Hors CFA
                                        </p>
                                        </label>
                                    </div>
                                    {/* operationB */}
                                    <div className="form-group  mt-3 ">
                                        <label
                                            htmlFor="operationA-check"
                                            className="gr-check-input mb-7 d-flex"
                                        >
                                            <input 
                                            type="checkbox" 
                                            name="operationB"
                                            id='operationA-check' 
                                            value="Vos clients ZONE EURO : Réception de Fonds facturés aux clients qui résident dans la zone EURO"
                                            checked={operationB.includes("Vos clients ZONE EURO : Réception de Fonds facturés aux clients qui résident dans la zone EURO")}
                                            onChange={handleOptionOperationB}
                                            />
                                        <p className=" mx-2 mb-0 ">
                                            Vos clients ZONE EURO : Réception de Fonds facturés aux clients qui résident dans la zone EURO
                                        </p>
                                        </label>
                                    </div>
                                    {/* operationC */}
                                    <div className="form-group  mt-3 ">
                                        <label
                                            htmlFor="operationA-check"
                                            className="gr-check-input mb-7 d-flex"
                                        >
                                            <input 
                                            type="checkbox" 
                                            name="operationC"
                                            id='operationC-check' 
                                            value="Vos clients AUTRES : Réception de Fonds facturés aux clients qui ne sont ni en Afrique, ni dans la zone euro"
                                            checked={operationC.includes("Vos clients AUTRES : Réception de Fonds facturés aux clients qui ne sont ni en Afrique, ni dans la zone euro")}
                                            onChange={handleOptionOperationC}
                                            />
                                        <p className=" mx-2 mb-0">
                                            Vos clients AUTRES : Réception de Fonds facturés aux clients qui ne sont ni en Afrique, ni dans la zone euro
                                        </p>
                                        </label>
                                    </div>


                                    {/* operationD */}
                                    <div className="form-group  mt-3 ">
                                        <label
                                            htmlFor="operationD-check"
                                            className="gr-check-input mb-7 d-flex"
                                        >
                                            <input 
                                            type="checkbox" 
                                            name="operationD"
                                            id='operationD-check' 
                                            value="Vos Fournisseurs UEMOA : Envoi de Fonds Pour payer vos Fournisseurs dans les pays de la zone CFA UEMOA"
                                            checked={operationD.includes("Vos Fournisseurs UEMOA : Envoi de Fonds Pour payer vos Fournisseurs dans les pays de la zone CFA UEMOA")}
                                            onChange={handleOptionOperationD}
                                            />
                                        <p className=" mx-2 mb-0">
                                            Vos Fournisseurs UEMOA : Envoi de Fonds Pour payer vos Fournisseurs dans les pays de la zone CFA UEMOA
                                        </p>
                                        </label>
                                    </div>
                                    {/* operationE */}
                                    <div className="form-group  mt-3 ">
                                        <label
                                            htmlFor="operationE-check"
                                            className="gr-check-input mb-7 d-flex"
                                        >
                                            <input 
                                            type="checkbox" 
                                            name="operationE"
                                            id='operationE-check' 
                                            value="Vos Fournisseurs Afrique-hors UEMOA: Envoi de Fonds Pour payer vos Fournisseurs africains-Hors CFA"
                                            checked={operationE.includes("Vos Fournisseurs Afrique-hors UEMOA: Envoi de Fonds Pour payer vos Fournisseurs africains-Hors CFA")}
                                            onChange={handleOptionOperationE}
                                            />
                                        <p className=" mx-2 mb-0">
                                            Vos Fournisseurs Afrique-hors UEMOA: Envoi de Fonds Pour payer vos Fournisseurs africains-Hors CFA
                                        </p>
                                        </label>
                                    </div>
                                    {/* operationF */}
                                    <div className="form-group  mt-3 ">
                                        <label
                                            htmlFor="operationF-check"
                                            className="gr-check-input mb-7 d-flex"
                                        >
                                            <input 
                                            type="checkbox" 
                                            name="operationF"
                                            id='operationF-check' 
                                            value="Vos Fournisseurs ZONE EURO : Envoi de Fonds Pour payer vos Fournisseurs qui résident dans la zone EURO"
                                            checked={operationF.includes("Vos Fournisseurs ZONE EURO : Envoi de Fonds Pour payer vos Fournisseurs qui résident dans la zone EURO")}
                                            onChange={handleOptionOperationF}
                                            />
                                        <p className=" mx-2 mb-0">
                                            Vos Fournisseurs ZONE EURO : Envoi de Fonds Pour payer vos Fournisseurs qui résident dans la zone EURO
                                        </p>
                                        </label>
                                    </div>
                                    {/* operationG */}
                                    <div className="form-group  mt-3 ">
                                        <label
                                            htmlFor="operationG-check"
                                            className="gr-check-input mb-7 d-flex"
                                        >
                                            <input 
                                            type="checkbox" 
                                            name="operationG"
                                            id='operationG-check' 
                                            value="Vos Fournisseurs AUTRES : Envoi de Fonds Pour payer vos Fournisseurs qui ne sont ni en Afrique, ni dans la zone euro"
                                            checked={operationG.includes("Vos Fournisseurs AUTRES : Envoi de Fonds Pour payer vos Fournisseurs qui ne sont ni en Afrique, ni dans la zone euro")}
                                            onChange={handleOptionOperationG}
                                            />
                                        <p className="mx-2 mb-0">
                                            Vos Fournisseurs AUTRES : Envoi de Fonds Pour payer vos Fournisseurs qui ne sont ni en Afrique, ni dans la zone euro
                                        </p>
                                        </label>
                                    </div>
                                </>
                            ):('')}
                            {/* Fin Q4 */}

                            {/* Question 5 */}
                            <label
                                htmlFor="Q1"
                                className="text-blackish-blue mb-2"
                            >
                                Avez-vous une boutique en ligne ?
                            </label>
                            <select 
                                className="form-control"
                                id="Q5"
                                required
                                defaultValue={eShop} 
                                onChange={(event)=>setEShop(event.target.value)}
                                >
                                <option defaultValue="">Choisissez</option>
                                    <optgroup className='single-cryptocurrency-box'>
                                    <option  value="Oui - J'ai une boutique en ligne">Oui</option>
                                    <option  value="Non - Je n'ai pas une boutique en ligne">Non</option>
                                    </optgroup>
                                </select>
                                {/* Fin Q5 */}

                                {/* Question 6 */}
                                {/* Question 5 */}
                            <label
                                htmlFor="Q1"
                                className="text-blackish-blue mb-2"
                            >
                                Seriez intéressés par une solution digitale (paiement/ encaissement) qui vous permettra de recevoir et d'effectuer des paiements instantanés de vos clients et à vos fournisseurs, quelque soit leur pays de résidence, les moyens de paiements que ces derniers utilisent ?
                            </label>
                            <select 
                                className="form-control"
                                id="Q5"
                                required
                                defaultValue={multiplePayment} 
                                onChange={(event)=>setMultiplePayment(event.target.value)}
                                >
                                <option defaultValue="">Choisissez</option>
                                    <optgroup className='single-cryptocurrency-box'>
                                    <option  value="Oui - Je suis intéressé par une solution digitale (paiement/ encaissement)">Oui</option>
                                    <option  value="Non - Je ne suis pas intéressé par une solution digitale (paiement/ encaissement)">Non</option>
                                    </optgroup>
                                </select>
                            <br/>

                            {/* <p className="colorRed mb-7 ">
                                NB : Aucun retour n'est permis sur cette page donc, répondez correctement aux questions
                            </p> */}
                                <a
                                className=""
                                >
                                    {kycForEntreprise?.userId ? (
                                        <button className="btn btn-primary " type='button' onClick={updateQuestionnaire}  disabled={isLoggingIn}>Suivant</button>
                                    ) : (
                                        <button className="btn btn-primary " type='button' onClick={addQuestionnaire}  disabled={isLoggingIn}>Suivant</button>
                                    )}
                                </a>
                        </form>       
                    </div>
                <div className='col-lg-3 col-md-12'></div>
            </div>
        </div>
    </>
  );
};

export default CQuestionnaire;
