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

const CQuestionnaireFatca = () => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API

    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [messageError, setMessageError] = useState();

    // States du formulaire
                            // usPerson
                            // address
                            // mailbox
                            // profession
                            // professionStatus
                            // bankReferences
                            // motivation
                            // employerCorporate
                            // employerAddress
                            // sourceIncome
                            // natureAccount
                            // directorship
                            // whatBoard
                            // shareholder
                            // whatHareholder
    const [usPerson, setUsPerson] = useState();
    const [mailbox, setMailbox] = useState();
    const [profession, setProfession] = useState();
    const [professionStatus, setProfessionStatus] = useState();
    const [motivation, setMotivation] = useState([]);
    const [motivationA, setMotivationA] = useState([]);
    const [motivationB, setMotivationB] = useState([]);
    const [motivationC, setMotivationC] = useState([]);
    const [motivationD, setMotivationD] = useState([]);
    const [motivationE, setMotivationE] = useState([]);
    const [motivationF, setMotivationF] = useState([]);
    const [employerCorporate, setEmployerCorporate] = useState();
    const [employerAddress, setEmployerAddress] = useState();
    const [directorship, setDirectorship] = useState();
    const [whatBoard, setWhatBoard] = useState();
    const [shareholder, setShareholder] = useState();
    const [whatHareholder, setWhatHareholder] = useState();

    

    const handleOptionMotivation = (event) => {
        const value = event.target.value;
        const isChecked = event.target.checked;
    
        if (isChecked) {
            setMotivation([...motivation, value]);
        } else {
            setMotivation("");
        }
    };

    const handleOptionMotivationA = (event) => {
        const value = event.target.value;
        const isChecked = event.target.checked;
    
        if (isChecked) {
            setMotivationA([...motivationA, value]);
        } else {
            setMotivationA("");
        }
    };

    const handleOptionMotivationB = (event) => {
        const value = event.target.value;
        const isChecked = event.target.checked;
    
        if (isChecked) {
            setMotivationB([...motivationB, value]);
        } else {
            setMotivationB("");
        }
    };

    const handleOptionMotivationC = (event) => {
        const value = event.target.value;
        const isChecked = event.target.checked;
    
        if (isChecked) {
            setMotivationC([...motivationC, value]);
        } else {
            setMotivationC("");
        }
    };

    const handleOptionMotivationD = (event) => {
        const value = event.target.value;
        const isChecked = event.target.checked;
    
        if (isChecked) {
            setMotivationD([...motivationD, value]);
        } else {
            setMotivationD("");
        }
    };

    const handleOptionMotivationE = (event) => {
        const value = event.target.value;
        const isChecked = event.target.checked;
    
        if (isChecked) {
            setMotivationE([...frequencyB, value]);
        } else {
            setMotivationE("");
        }
    };

    const handleOptionMotivationF = (event) => {
        const value = event.target.value;
        const isChecked = event.target.checked;
    
        if (isChecked) {
            setMotivationF([...frequencyB, value]);
        } else {
            setMotivationF("");
        }
    };






    
    // Fonction d'envoie des informations du questionnaire FATCA
    const updateQuestionnaireFatca= async (event) => {
        setIsLoggingIn(true);
        event.preventDefault();

        try {
            const dataTable = {
                motivation:Object.assign({},motivation),
                motivationA:Object.assign({},motivationA),
                motivationB:Object.assign({},motivationB),
                motivationC:Object.assign({},motivationC),
                motivationD:Object.assign({},motivationD),
                
            }

            const dataa = {
                motivation:dataTable?.motivation[0],
                motivationA:dataTable?.motivationA[0],
                motivationB:dataTable?.motivationB[0],
                motivationC:dataTable?.motivationC[0],
                motivationD:dataTable?.motivationD[0],
                

                usPerson:usPerson,
                mailbox:mailbox,
                profession:profession,
                professionStatus:professionStatus,
                employerCorporate:employerCorporate,
                employerAddress:employerAddress,
                directorship:directorship,
                whatBoard:whatBoard,
                shareholder:shareholder,
                whatHareholder:whatHareholder
            }
            // Condition pour forcer l'utilisateur à choisir au moins une reponse
            // if () {
                
                
                const token = localStorage.getItem('tokenEnCours') //Le token récuperé

                const result = await fetch(`${API_URL}/api/kyc/particular/update-kyc-questionnaire-fatca`, {
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
                            Router.push("/profil/kyc/particulier/justificatif-identite-one"); 
                        }
                    }, 5000)
                }
                // Fin condition 
            // }else{
            //     setIsLoggingIn(false);
            //     Swal.fire({
            //         position: 'center',
            //         icon: 'error',
            //         html: `<p> Désolé, vous devez repondre à une question au moins. </p>` ,
            //         showConfirmButton: false,
            //         timer: 10000
            //     })
            // }
            
            } catch {
            setIsLoggingIn(false);
            }
        
    };
    // Fin                   
                            
                            
                            
                            
                            
    




    
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


    // La barre de progression de KYC
    const steps = ["AML 1 & 2","FATCA", "Identité 1 & 2", "Selfie", "Domicile", "Photo", "Signature"];
    const activeStep = 0;
    // Fin

  return (
    <>
      <ProgressBar className="mb-15" steps={steps} activeStep={activeStep} />

        <div className='mt-15' >
            <div className=' mx-15'>
                <div className='py-10'>
                <br/><br/><h1 className='text-center '>Questionnaires ID & FATCA </h1>
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
                        <form className='' onSubmit={updateQuestionnaireFatca}>
                            {/* Question 1 */}
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="usPerson"
                                    className="text-blackish-blue mb-2"
                                >
                                   Etes-vous une "US PERSON"? (Citoyenneté Américaine (Passeport américain) / Résidence aux USA /Présence significative ou permanente (green card) / Lieu de naissance aux USA) 
                                </label>
                                <select 
                                className="form-control"
                                id="usPerson"
                                required
                                defaultValue={usPerson} 
                                onChange={(event)=>setUsPerson(event.target.value)}
                                >
                                <option defaultValue="">Choisissez</option>
                                    <optgroup className='single-cryptocurrency-box'>
                                    <option  value="Oui">Oui</option>
                                    <option  value="Non">Non</option>
                                    </optgroup>
                                </select>
                            </div >
                            {/* Fin */}

                            {/* Question 1 */}
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="mailbox"
                                    className="text-blackish-blue mb-2"
                                >
                                  
                                   Adresse ou boîte postale
                                </label>
                                <div className='form-group mt-3'>
                                    <input
                                        type='text'
                                        id='mailbox'
                                        className='form-control'
                                        placeholder='Adresse ou boîte postale'
                                        defaultValue={mailbox} 
                                        onChange={(event)=>setMailbox(event.target.value)}
                                    />
                                </div>
                            </div >
                            {/* Fin */}

                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="professionStatus"
                                    className="text-blackish-blue mb-2"
                                >
                                    Statut professionnel
                                </label>
                                <select 
                                className="form-control"
                                id="professionStatus"
                                required
                                defaultValue={professionStatus} 
                                onChange={(event)=>setProfessionStatus(event.target.value)}
                                >
                                <option defaultValue="">Choisissez</option>
                                    <optgroup className='single-cryptocurrency-box'>
                                    <option  value="Salarié">Salarié</option>
                                    <option  value="Profession libérale">Profession libérale</option>
                                    <option  value="Retraité">Retraité</option>
                                    <option  value="Activité commerciale">Activité commerciale</option>
                                    </optgroup>
                                </select>
                            </div >
                            {/* SI Statut professionnel EST SALRIE */}
                            {professionStatus==="Salarié" ? (
                                <>
                                
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="employerCorporate"
                                    className="text-blackish-blue mb-2"
                                >
                                    Nom de l'employeur 
                                </label>
                                <div className='form-group mt-3'>
                                    <input
                                        type='text'
                                        id='employerCorporate'
                                        className='form-control'
                                        placeholder="Nom de l'employeur"
                                        defaultValue={employerCorporate} 
                                        onChange={(event)=>setEmployerCorporate(event.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="employerAddress"
                                    className="text-blackish-blue mb-2"
                                >
                                    Adresse de l'employeur 
                                </label>
                                <div className='form-group mt-3'>
                                    <input
                                        type='text'
                                        id='employerAddress'
                                        className='form-control'
                                        placeholder="Adresse de l'employeur"
                                        defaultValue={employerAddress} 
                                        onChange={(event)=>setEmployerAddress(event.target.value)}
                                    />
                                </div>
                            </div>
                            </>
                            ):('')}

                            {/* Question 1*/}
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="profession"
                                    className="text-blackish-blue mb-2"
                                >
                                    Profession/fonction/activité
                                </label>
                                <div className='form-group mt-3'>
                                    <input
                                        type='text'
                                        id='profession'
                                        className='form-control'
                                        placeholder='Profession, fonction, activité'
                                        defaultValue={profession} 
                                        onChange={(event)=>setProfession(event.target.value)}
                                    />
                                </div>
                            </div >
                            {/* Fin */}
                            



                            {/* PARTIE MOTIVATION */}
                            <label
                                htmlFor="Q1"
                                className="text-blackish-blue mb-2"
                            >
                                Motivation de l’ouverture de compte.
                            </label> 
                            <div className="form-group  mt-3 ">
                                <label
                                    htmlFor="Salaire-check"
                                    className="gr-check-input mb-7 d-flex"
                                >
                                    <input 
                                    type="checkbox" 
                                    name="Salaire"
                                    id='Salaire-check' 
                                    value='Pour recevoir mon salaire'
                                    checked={motivation.includes('Pour recevoir mon salaire')}
                                    onChange={handleOptionMotivation}
                                    />
                                <p className=" mx-2 mb-0 text-center">
                                    Pour recevoir mon salaire
                                </p>
                                </label>
                            </div> 

                            <div className="form-group  mt-3 ">
                                <label
                                    htmlFor="commerciale-check"
                                    className="gr-check-input mb-7 d-flex"
                                >
                                    <input 
                                    type="checkbox" 
                                    name="commerciale"
                                    id='commerciale-check' 
                                    value='Pour mon activité commerciale'
                                    checked={motivationA.includes('Pour mon activité commerciale')}
                                    onChange={handleOptionMotivationA}
                                    />
                                <p className=" mx-2 mb-0 text-center">
                                    Pour mon activité commerciale
                                </p>
                                </label>
                            </div> 

                            <div className="form-group  mt-3 ">
                                <label
                                    htmlFor="paiement-check"
                                    className="gr-check-input mb-7 d-flex"
                                >
                                    <input 
                                    type="checkbox" 
                                    name="paiement"
                                    id='paiement-check' 
                                    value='Pour faire des achats et des paiement'
                                    checked={motivationB.includes('Pour faire des achats et des paiement')}
                                    onChange={handleOptionMotivationB}
                                    />
                                <p className=" mx-2 mb-0 text-center">
                                    Pour faire des achats et des paiement
                                </p>
                                </label>
                            </div> 

                            <div className="form-group  mt-3 ">
                                <label
                                    htmlFor="epargner-check"
                                    className="gr-check-input mb-7 d-flex"
                                >
                                    <input 
                                    type="checkbox" 
                                    name="epargner"
                                    id='epargner-check' 
                                    value='Pour épargner'
                                    checked={motivationC.includes('Pour épargner')}
                                    onChange={handleOptionMotivationC}
                                    />
                                <p className=" mx-2 mb-0 text-center">
                                    Pour épargner
                                </p>
                                </label>
                            </div> 
                            <div className="form-group  mt-3 ">
                                <label
                                    htmlFor="autre-check"
                                    className="gr-check-input mb-7 d-flex"
                                >
                                    <input 
                                    type="checkbox" 
                                    name="autre"
                                    id='autre-check' 
                                    value='Autre'
                                    checked={motivationD.includes('Autre')}
                                    onChange={handleOptionMotivationD}
                                    />
                                <p className=" mx-2 mb-0 text-center">
                                    Autre
                                </p>
                                </label>
                            </div> 
                            {/* FIN MOTIVATION */}


















                            {/* <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="motivation"
                                    className="text-blackish-blue mb-2"
                                >
                                    Motivation de l’ouverture de compte.
                                </label>
                                <select 
                                className="form-control"
                                id="motivation"
                                required
                                defaultValue={motivation} 
                                onChange={(event)=>setMotivation(event.target.value)}
                                >
                                <option defaultValue="">Choisissez</option>
                                    <optgroup className='single-cryptocurrency-box'>
                                    <option  value="Pour recevoir mon salaire">Pour recevoir mon salaire</option>
                                    <option  value="Pour mon activité commerciale">Pour mon activité commerciale</option>
                                    <option  value="Pour faire des achats et des paiement">Pour faire des achats et des paiement</option>
                                    <option  value="Pour épargner">Pour épargner</option>
                                    <option  value="Pour transférer de l'argent">Pour transférer de l'argent</option>
                                    <option  value="Pour encaisser des paiements">Pour encaisser des paiements</option>
                                    <option  value="Autre">Autre</option>
                                    </optgroup>
                                </select>
                            </div > */}

                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="directorship"
                                    className="text-blackish-blue mb-2"
                                >
                                    Bénéficiez-vous d’un mandat d’administrateur dans le Conseil d’Administration d’une société ?  
                                </label>
                                <select 
                                className="form-control"
                                id="directorship"
                                required
                                defaultValue={directorship} 
                                onChange={(event)=>setDirectorship(event.target.value)}
                                >
                                <option defaultValue="">Choisissez</option>
                                    <optgroup className='single-cryptocurrency-box'>
                                    <option  value="Oui">Oui</option>
                                    <option  value="Non">Non</option>
                                    </optgroup>
                                </select>
                            </div>
                            
                            {/* SI L'UTISATEUR BENEFICIE D'UN MENDAT D'ADMINISTRATEUR */}
                            {directorship==="Oui" ? (
                                <>
                                
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="employerCorporate"
                                    className="text-blackish-blue mb-2"
                                >
                                    La (les)quelle(s) 

                                </label>
                                <div className='form-group mt-3'>
                                    <input
                                        type='text'
                                        id='employerCorporate'
                                        className='form-control'
                                        placeholder='précisez le nom de la société'
                                        defaultValue={whatBoard} 
                                        onChange={(event)=>setWhatBoard(event.target.value)}
                                    />
                                </div>
                            </div>
                            </>
                            ):("")}
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="shareholder"
                                    className="text-blackish-blue mb-2"
                                >
                                    Etes-vous actionnaire, fondateur ou co-fondateur d'une société ? 
                                </label>
                                <select 
                                className="form-control"
                                id="shareholder"
                                required
                                defaultValue={shareholder} 
                                onChange={(event)=>setShareholder(event.target.value)}
                                >
                                <option defaultValue="">Choisissez</option>
                                    <optgroup className='single-cryptocurrency-box'>
                                    <option  value="Oui">Oui</option>
                                    <option  value="Non">Non</option>
                                    </optgroup>
                                </select>
                            </div>

                            {/* SI L'UTILISATEUR EST ACTIONNAIRE DANS UNE SOCIETE */}
                            {shareholder==="Oui"? (
                                <>
                                 
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="whatHareholder"
                                    className="text-blackish-blue mb-2"
                                >
                                    La (les)quelle(s) 

                                </label>
                                <div className='form-group mt-3'>
                                    <input
                                        type='text'
                                        id='whatHareholder'
                                        className='form-control'
                                        placeholder='précisez le nom de la société'
                                        defaultValue={whatHareholder} 
                                        onChange={(event)=>setWhatHareholder(event.target.value)}
                                    />
                                </div>
                            </div>
                            </>
                            ):("")}
                            


                            









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
                                    <Link href='/profil/kyc/particulier/questionnaires-revenus-two/' className="align-right">
                                        <a
                                        className=""
                                        >
                                            <button className="btn btn-primary " type='button'  > Précédente </button>
                                        </a>   
                                    </Link>                          
                                </div>
                                <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">
                                   
                                    <button className="btn btn-primary " type='submit' disabled={isLoggingIn} > Suivant </button>
                                                            
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

export default CQuestionnaireFatca;
