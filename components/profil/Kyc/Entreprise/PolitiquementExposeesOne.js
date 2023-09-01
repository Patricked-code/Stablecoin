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

// FIN

const CPolitiquementExposeesOne = () => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API

    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [messageError, setMessageError] = useState();
    const [currentKycStatut, setCurrentKycStatut] = useState();
    const [familyCompany, setFamilyCompany] = useState();



    // LES BONS
    // numberAssociates
	// fivePercent

    // fivePercent
    const [numberPoliticallyExposed, setNumberPoliticallyExposed] = useState();
    



   // Fonction de modification des infos des champs numberPoliticallyExposed dans la table kyc_entreprise
   const updateNumberPoliticallyExposed = async(event) => {
    setIsLoggingIn(true);
    event.preventDefault();


    try {

        const dataInfos = {
            numberPoliticallyExposed:numberPoliticallyExposed,
        }
            const token = localStorage.getItem('tokenEnCours') //Le token récuperé

            const result = await fetch(`${API_URL}/api/kyc/business/update-kyc-for-number-politically-exposed`, {
            method:"PUT",
            body: JSON.stringify(dataInfos),
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
                        Router.push("/profil/kyc/entreprise/politiquement-exposees-two"); 
                    }
                }, 5000)
            }
            // Fin condition 
        
        } catch {
        setIsLoggingIn(false);
    }
    
}
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
                    <br/><br/><h1 className='text-center '>Declaration de personnes politiquement exposees 1</h1>
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
                        <form className='' onSubmit={updateNumberPoliticallyExposed}>
                            
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="familyCompany"
                                    className="text-blackish-blue mb-2"
                                >
                                    La société possède parmi ses bénéficiaires effectifs/titulaires réels ou ses administrateurs, ou parmi les plus proches membres de leur famille et des personnes connues pour leur être étroitement associées, une personne occupant ou ayant occupé durant les 12 derniers mois une haute fonction publique représentative ou un poste important au sein des administrations publiques en Andorre, dans des États membres de l’Union européenne ou dans des pays tiers ?
                                </label>
                                <select 
                                className="form-control"
                                id="familyCompany"
                                required
                                defaultValue={familyCompany} 
                                onChange={(event)=>setFamilyCompany(event.target.value)}
                                >
                                <option defaultValue="">Choisissez</option>
                                    <optgroup className='single-cryptocurrency-box'>
                                        <option  value="Oui">Oui</option>
                                        <option  value="Non">Non</option>
                                    </optgroup>
                                </select>
                            </div>
                            {/* Si plus de 10 on pose cette question */}
                            {familyCompany==="Oui"? (
                                <>
                                
                                    <div className="form-group mb-6 mt-3">
                                        <label
                                            htmlFor="fivePercent"
                                            className="text-blackish-blue mb-2"
                                        >
                                            Combien sont-ils? 
                                        </label>
                                        <select 
                                        className="form-control"
                                        id="fivePercent"
                                        required
                                        defaultValue={numberPoliticallyExposed} 
                                        onChange={(event)=>setNumberPoliticallyExposed(event.target.value)}
                                        >
                                        <option defaultValue="">Choisissez</option>
                                            <optgroup className='single-cryptocurrency-box'>
                                                <option  value="1">1</option>
                                                <option  value="2">2</option>
                                                <option  value="3">3</option>
                                                <option  value="4">4</option>
                                                <option  value="5">5</option>
                                                <option  value="6">6</option>
                                                <option  value="7">7</option>
                                                <option  value="8">8</option>
                                                <option  value="9">9</option>
                                                <option  value="10">10</option>
                                            </optgroup>
                                        </select>
                                    </div >
                                </>
                            ):("")}
                            <label
                                    htmlFor="nativeCountry"
                                    className="text-blackish-blue mb-2 colorRed"
                                >
                                    NB: Vous devez obligatoirement compléter les informations qui vont suivre pour chaque personne.  
                            </label>



                            <div className="form-group mb-6 mt-3 col-lg-12 col-md-12  row justify-content-between">
                                <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">
                                    <Link href='/profil/kyc/entreprise/structure-control-two/' className="align-right">
                                        <a
                                        className=""
                                        >
                                            <button className="btn btn-primary " type='button'  > Précédente </button>
                                        </a>   
                                    </Link>                          
                                </div>
                                <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">
                                    {familyCompany==="Non"? (
                                        <Link href='/profil/kyc/entreprise/operations-financieres-one' className="align-right">
                                            <a
                                            className=""
                                            >
                                                <button className="btn btn-primary " type='button'  > Suivant </button>
                                            </a>   
                                        </Link>
                                    ):(
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

export default CPolitiquementExposeesOne;
