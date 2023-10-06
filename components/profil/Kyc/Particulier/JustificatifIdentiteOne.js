import { useCallback, useState, useEffect } from 'react';
import React from "react";
import axios from 'axios';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import moment from 'moment';


// Pour Magic
import { magic } from "../../../../magic";
import { ethers } from "ethers";
import Loading from "../../../loading";
import Router from "next/router";
import Swal from 'sweetalert2';
import Web3 from "web3";
import ProgressBar from '../ProgressBar';

// FIN

const CJustificatifIdentiteOne = () => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API

    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [messageError, setMessageError] = useState();
    const [currentUser, setCurrentUser] = useState();
    const [currentUserCountry, setCurrentUserCountry] = useState();
    

    // States du formulaire
   
    const [civility, setCivility] = useState();
    const [fatherName, setFatherName] = useState();
    const [motherName, setMotherName] = useState();
    const [familyStatus, setFamilyStatus] = useState();
    const [language, setLanguage] = useState();

    // Pour les infos qui existent déjà dans la table Users
    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [nationality, setNationality] = useState();
    const [nativeCountry, setNativeCountry] = useState();
    const [birthday, setBirthday] = useState();

    




    useEffect(() => {
        (async () => {
            const token = localStorage.getItem('tokenEnCours') //Le token récuperé

            // Obtenir l'utilisateur qui est connecté
            const getUser = async () => {
            const result = await fetch(`${API_URL}/api/user/find-user-sign-in`, {
                headers: {
                'Content-Type': 'application/json',
                Authorization:  `Bearer ${token}`

                },
            })
            .then((result) => result.json())
            .then((user) => {
            setCurrentUser(user)

            }) 
            };
            await getUser();
            // Fin


            // Obtenir le pays de l'utilisateur connecté
            if (currentUser?.nativeCountry) {
            const getUserCountry = async () => {
                const resultCountry = await fetch(`${API_URL}/api/country/find-one/${currentUser?.nativeCountry}`, {
                    headers: {
                    'Content-Type': 'application/json',
                    },
                })
               
                .then((resultCountry) => resultCountry.json())
                .then((userCountry) => {
                setCurrentUserCountry(userCountry)
                }) 
                };
                await getUserCountry();

            }
            // Fin

        })();
    }, [currentUser]);
      // Fin

                    
                            
    // Fonction d'envoie des informations du justificatif d'identité
    const updateJustificatifIdentite= async (event) => {
        setIsLoggingIn(true);
        event.preventDefault();

        try {

            const dataa = {
                civility:civility,
                fatherName:fatherName,
                motherName:motherName,
                familyStatus:familyStatus,
                language:language,
            }
            // Condition pour forcer l'utilisateur à choisir au moins une reponse
            // if () {
                
                
                const token = localStorage.getItem('tokenEnCours') //Le token récuperé

                const result = await fetch(`${API_URL}/api/kyc/particular/add-kyc-identity`, {
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
                    updateInfosUser() //Appel de la fonction updateInfosUser() 
                    
                    
                    
                }
                // Fin condition 
            } catch {
            setIsLoggingIn(false);
            }
        
    };
    // Fin              
              
    
    // Fonction de modification des infos de l'utisateur qui sont dans justificatif d'identité
    const updateInfosUser = useCallback(async() => {
        setIsLoggingIn(true);

        try {

            const dataInfosUser = {
                firstName:firstName,
                lastName:lastName,
                nationality:nationality,
                nativeCountry:nativeCountry,
                birthday:birthday,
                            
            }
                const token = localStorage.getItem('tokenEnCours') //Le token récuperé

                const result = await fetch(`${API_URL}/api/kyc/particular/update-user-kyc-identity`, {
                method:"PUT",
                body: JSON.stringify(dataInfosUser),
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
                            Router.push("/profil/kyc/particulier/justificatif-identite-two"); 
                        }
                    }, 5000)
                }
                // Fin condition 
            
            } catch {
            setIsLoggingIn(false);
        }
        
    }, [firstName,lastName,nationality,nativeCountry,birthday]);
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


    // FONCTION POUR FORMATER LA DATE
    const formatDate = (_updatedAt) =>{
        const maDate = moment(_updatedAt).format('DD/MM/YYYY');
        return  maDate
    }
    //  FIN

    // La barre de progression de KYC
    const steps = ["AML 1 & 2","FATCA", "Identité 1 & 2", "Selfie", "Domicile", "Photo", "Signature"];
    const activeStep = 1;
    // Fin

  return (
    <>
      <ProgressBar className="mb-15" steps={steps} activeStep={activeStep} />

        <div className='mt-15' >
            <div className=' mx-15'>
                <div className='py-10'>
                <br/><br/><h1 className='text-center '>Justificatif d'identité</h1>
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
                        <form className='' onSubmit={updateJustificatifIdentite}>
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="civility"
                                    className="text-blackish-blue mb-2"
                                >
                                    Civilité
                                </label>
                                <select 
                                className="form-control"
                                id="civility"
                                required
                                defaultValue={civility} 
                                onChange={(event)=>setCivility(event.target.value)}
                                >
                                <option defaultValue="">Choisissez</option>
                                    <optgroup className='single-cryptocurrency-box'>
                                    <option  value="M.">M.</option>
                                    <option  value="Mme">Mme</option>
                                    <option  value="Mlle">Mlle</option>
                                    </optgroup>
                                </select>
                            </div >
                            
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="firstName"
                                    className="text-blackish-blue mb-2"
                                >
                                    Votre nom
                                </label>
                                <div className='form-group'>
                                    <input
                                        type='text'
                                        id='firstName'
                                        className='form-control'
                                        placeholder='Votre nom'
                                        defaultValue={currentUser?.firstName} 
                                        onChange={(event)=>setFirstName(event.target.value)}
                                    />
                                </div>
                            </div >
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="lastName"
                                    className="text-blackish-blue mb-2"
                                >
                                    Vos prénoms
                                </label>
                                <div className='form-group'>
                                    <input
                                        type='text'
                                        id='lastName'
                                        className='form-control'
                                        placeholder='Vos prénoms'
                                        defaultValue={currentUser?.lastName} 
                                        onChange={(event)=>setLastName(event.target.value)}
                                    />
                                </div>
                            </div >
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="fatherName"
                                    className="text-blackish-blue mb-2"
                                >
                                    Nom et prénoms du père
                                </label>
                                <div className='form-group'>
                                    <input
                                        type='text'
                                        id='fatherName'
                                        className='form-control'
                                        placeholder='Nom et prénoms du père'
                                        defaultValue={fatherName} 
                                        onChange={(event)=>setFatherName(event.target.value)}
                                    />
                                </div>
                            </div >
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="motherName"
                                    className="text-blackish-blue mb-2"
                                >
                                    Nom et prénoms de la mère
                                </label>
                                <div className='form-group'>
                                    <input
                                        type='text'
                                        id='motherName'
                                        className='form-control'
                                        placeholder='Nom et prénoms de la mère'
                                        defaultValue={motherName} 
                                        onChange={(event)=>setMotherName(event.target.value)}
                                    />
                                </div>
                            </div >
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="familyStatus"
                                    className="text-blackish-blue mb-2"
                                >
                                    Situation familiale
                                </label>
                                <select 
                                className="form-control"
                                id="familyStatus"
                                required
                                defaultValue={familyStatus} 
                                onChange={(event)=>setFamilyStatus(event.target.value)}
                                >
                                <option defaultValue="">Choisissez</option>
                                    <optgroup className='single-cryptocurrency-box'>
                                    <option  value="Célibataire">Célibataire</option>
                                    <option  value="Marié(e)">Marié(e)</option>
                                    <option  value="Divorcé(e)">Divorcé(e)</option>
                                    <option  value="Veuf(ve)">Veuf(ve)</option>
                                    </optgroup>
                                </select>
                            </div >
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="language"
                                    className="text-blackish-blue mb-2"
                                >
                                    Langue
                                </label>
                                <select 
                                className="form-control"
                                id="language"
                                required
                                defaultValue={language} 
                                onChange={(event)=>setLanguage(event.target.value)}
                                >
                                <option defaultValue="">Choisissez</option>
                                    <optgroup className='single-cryptocurrency-box'>
                                    <option  value="Français">Français</option>
                                    <option  value="Anglais">Anglais</option>
                                    <option  value="Autre">Autre</option>
                                    </optgroup>
                                </select>
                            </div >
                            
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="nationality"
                                    className="text-blackish-blue mb-2"
                                >
                                    Nationalité
                                </label>
                                <div className='form-group'>
                                    <input
                                        type='text'
                                        id='nationality'
                                        className='form-control'
                                        defaultValue={currentUser?.nationality} 
                                        onChange={(event)=>setNationality(event.target.value)}
                                    />
                                </div>
                            </div >
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="nativeCountry"
                                    className="text-blackish-blue mb-2"
                                >
                                    Pays de Naissance
                                </label>
                                <div className='form-group'>
                                    <input
                                        type='text'
                                        id='nativeCountry'
                                        className='form-control'
                                        placeholder='Pays de Naissance'
                                        defaultValue={currentUserCountry?.libelle} 
                                        onChange={(event)=>setNativeCountry(event.target.value)}
                                    />
                                </div>
                            </div >
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="dateBirth"
                                    className="text-blackish-blue mb-2"
                                >
                                    Date de naissance ({formatDate(currentUser?.birthday)}) si cette date est incorrecte veuillez saisir la bonne sinon laissez le champ vide.
                                </label>
                                <div className='form-group'>
                                    <input
                                        type='date'
                                        id='dateBirth'
                                        className='form-control'
                                        placeholder='Date de naissance'
                                        defaultValue={formatDate(currentUser?.birthday)}
                                        onChange={(event)=>setBirthday(event.target.value)}
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

                            <div className="form-group mb-6 mt-3 col-lg-12 col-md-12  row justify-content-between">
                                <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">
                                    <Link href='/profil/kyc/particulier/questionnaires-fatca/' className="align-right">
                                        <a
                                        className=""
                                        >
                                            <button className="btn btn-primary " type='button'  > Précédente </button>
                                        </a>   
                                    </Link>                          
                                </div>
                                <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">
                                    
                                    <button className="btn btn-primary " type='submit'  > Suivant </button>
                                                              
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

export default CJustificatifIdentiteOne;
