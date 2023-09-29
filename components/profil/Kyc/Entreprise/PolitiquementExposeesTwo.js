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

const CPolitiquementExposeesTwo = () => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API

    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [messageError, setMessageError] = useState();
    const [kycPoliticallyExposed, setKycPoliticallyExposed] = useState();
    const [kycForEntreprise, setKycForEntreprise] = useState();
    const [allNationality, setAllNationality] = useState();
    const [currentKycEntrepriseStatut, setCurrentKycEntrepriseStatut] = useState();

    
    
    
    // Les states du formulaire
    const [functions, setFunctions] = useState();
    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [nationality, setNationality] = useState();

    //localStorage pour récupérer une valeur en cliquant sur un bouton Recompleter qui indique qu'on veut modifier une partie Kyc 
    useEffect(() => {
        const kycStatut = localStorage.getItem('currentKycEntrepriseStatut')  
        setCurrentKycEntrepriseStatut(kycStatut)
        console.log("kycStatut=>",kycStatut)
    }, [currentKycEntrepriseStatut]);

    // FONCTION D'AJOUT DES DONNEES DE POLITIQUEMENT EXPOSEE DANS LA BASE DE DONNEE
    const addPoliticallyExposed = async(event) => {
        event.preventDefault();
        setIsLoggingIn(true);

        try {

            const dataInfosUser = {
                firstName:firstName,
                lastName:lastName,
                functions:functions,
                nationality:nationality
                            
            }
                const token = localStorage.getItem('tokenEnCours') //Le token récuperé

                const result = await fetch(`${API_URL}/api/kyc/business/add-kyc-politically-exposed`, {
                method:"POST",
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
                   
                    setTimeout(() => {
                        if (currentKycStatut==="1") {
                            Router.push("/profil/kyc/particulier/resultat-kyc"); 
        
                        }else{
                            if (kycPoliticallyExposed?.length+1 == kycForEntreprise?.numberPoliticallyExposed) {
                                Swal.fire({
                                    position: 'center',
                                    icon: 'success',
                                    html: `<p> Vous avez ${kycPoliticallyExposed?.length + 1} personne(s) avec succès. </p>` ,
                                    showConfirmButton: false,
                                    timer: 5000
                                })
                                Router.push("/profil/kyc/entreprise/operations-financieres-one"); 
                            }else{
                                Swal.fire({
                                    position: 'center',
                                    icon: 'success',
                                    html: `<p> Vous avez ajouté ${kycPoliticallyExposed?.length + 1} personne(s) avec succès. </p>` ,
                                    showConfirmButton: false,
                                    timer: 1000
                                })
    
                                setTimeout(() => {
                                    window.location.reload()
                                }, 1000)
                            }
                        }
                    }, 5000)
                }
                // Fin condition 
            
            } catch {
            setIsLoggingIn(false);
        }
        
    }
    // Fin 

    // FONCTION D'AJOUT (MODIFIER) DES DONNEES DE POLITIQUEMENT EXPOSEE DANS LA BASE DE DONNEE
    const updatePoliticallyExposed = async(event) => {
        event.preventDefault();
        setIsLoggingIn(true);

        try {

            const dataInfosUser = {
                firstName:firstName,
                lastName:lastName,
                functions:functions,
                nationality:nationality
                            
            }
                const token = localStorage.getItem('tokenEnCours') //Le token récuperé

                const result = await fetch(`${API_URL}/api/kyc/business/update-kyc-politically-exposed/${currentKycEntrepriseStatut}`, {
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
                        html: `<p> Les modifications sauvegardées avec succès. </p>` ,
                        showConfirmButton: false,
                        timer: 5000
                    })
                    setTimeout(() => {
                        window.location.reload()
                    }, 5000)
                    Router.push("/profil/kyc/entreprise/resultat-kyc");
                }
                // Fin condition 
            
            } catch {
            setIsLoggingIn(false);
        }
        
    }
    // Fin 


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

    // RECUPERER LES DONNEES DU KYC DE POLITIQUEMENT EXPOSEE DE L'ENTREPRISE CONNECTEE
    useEffect(async() => {
        const token = localStorage.getItem('tokenEnCours')
        
            const getKycPoliticallyExposed = async () => {
            const resKyc = await fetch(`${API_URL}/api/kyc/business/find-kyc-business-politically-exposed-of-user-signIn`, {
                headers: {
                'Content-Type': 'application/json',
                Authorization:  `Bearer ${token}`,
                },
            })
                .then((resKyc) => resKyc.json())
                .then((data) => {
                setKycPoliticallyExposed(data)

                }) 
            };
            await getKycPoliticallyExposed();
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




    const [currentKycStatut, setCurrentKycStatut] = useState();

    //localStorage pour récupérer une valeur en cliquant sur un bouton Recompleter qui indique qu'on veut modifier une partie Kyc 
    useEffect(() => {
        const kycStatut = localStorage.getItem('currentUpdateKycStatut')  
        setCurrentKycStatut(kycStatut)
    }, [currentKycStatut]);
    // Fin

     // La barre de progression de KYC du profil entreprise
   const stepsEntreprise = ["AML","Identité","Représentant", "Bénéficiaire","Control", "Politique", "Opérations", "Fonds", "Financière", "Documents"];

   const activeStepEntreprise = 4;
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
                <br/><br/><h1 className='text-center '>Declaration de personnes politiquement exposees 2</h1>
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
                            {!currentKycEntrepriseStatut || currentKycEntrepriseStatut == "undefined"? (
                                `Veuillez renseigner les informations de la personne n° ${kycPoliticallyExposed?.length + 1}`
                            ):("Veuillez rajouter les informations de la personne concernée")}
                            
                        </h5>
                        <form className='' onSubmit={!currentKycEntrepriseStatut|| currentKycEntrepriseStatut == "undefined"? addPoliticallyExposed : updatePoliticallyExposed}>
                            
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="lastName"
                                    className="text-blackish-blue mb-2"
                                >
                                    Nom 
                                </label>
                                <div className='form-group'>
                                    <input
                                        type='text'
                                        id='lastName'
                                        required
                                        className='form-control'
                                        placeholder="Nom"
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
                                    Prénoms 
                                </label>
                                <div className='form-group'>
                                    <input
                                        type='text'
                                        id='firstName'
                                        required
                                        className='form-control'
                                        placeholder="Prénoms"
                                        defaultValue={firstName} 
                                        onChange={(event)=>setFirstName(event.target.value)}
                                    />
                                </div>
                            </div >
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="functions"
                                    className="text-blackish-blue mb-2"
                                >
                                    Fonctions
                                </label>
                                <div className='form-group'>
                                    <input
                                        type='text'
                                        id='functions'
                                        className='form-control'
                                        placeholder="Fonction"
                                        defaultValue={functions} 
                                        onChange={(event)=>setFunctions(event.target.value)}
                                    />
                                </div>
                            </div >
                            <div className='form-group mt-3'>
                                <label
                                    htmlFor="email"
                                    className="text-blackish-blue mb-2"
                                >
                                    Nationalité
                                </label>
                                <select 
                                    className='form-control'
                                    placeholder='Nationalité '
                                    defaultValue={nationality} 
                                    onChange={(event)=>setNationality(event.target.value)}
                                >
                                    <option>Nationalité</option>
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

                            {/* Vérifie s'il s'agit d'une modification à apporter */}
                            {!currentKycEntrepriseStatut || currentKycEntrepriseStatut == "undefined"?(
                                <>
                                    <label
                                        htmlFor="backDomicile mb-3 "
                                        className='colorRed'
                                    >
                                        NB: Vous avez ajouté {kycPoliticallyExposed?.length}/{kycForEntreprise?.numberPoliticallyExposed} personne(s)
                                    </label>
                                    <div className="form-group mb-6 mt-3 col-lg-12 col-md-12  row justify-content-between">
                                        <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">
                                            <Link href='/profil/kyc/entreprise/politiquement-exposees-one/' className="align-right">
                                                <a
                                                className=""
                                                >
                                                    <button className="btn btn-primary " type='button'  > Précédente </button>
                                                </a>   
                                            </Link>                          
                                        </div>

                                        {kycPoliticallyExposed?.length == kycForEntreprise?.numberPoliticallyExposed ? (
                                            <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">
                                                <Link href='/profil/kyc/entreprise/operations-financieres-one/' className="align-right">
                                                    <a
                                                    className=""
                                                    >
                                                        <button className="btn btn-primary " type='button'  > Suivant </button>
                                                    </a>   
                                                </Link>
                                            </div>
                                        ) : (
                                            <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">
                                                <button className="btn btn-primary " type='submit'  disabled={isLoggingIn}  > Suivant </button>                        
                                            </div>
                                        )}
                                    </div>
                                </>
                            ):(
                                <button className="btn btn-primary " type='submit'  disabled={isLoggingIn}>Modifier</button>
                            )}
                        </form>       
                    </div>
                <div className='col-lg-3 col-md-12'></div>
            </div>
        </div>
    </>
  );
};

export default CPolitiquementExposeesTwo;
