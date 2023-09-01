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

const CStructureControlOne = () => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API

    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [messageError, setMessageError] = useState();
    const [currentKycStatut, setCurrentKycStatut] = useState();


    // LES BONS
    // numberAssociates
	// fivePercent

    // fivePercent
    const [numberAssociates, setNumberAssociates] = useState();
    const [fivePercent, setFivePercent] = useState();



   // Fonction de modification des infos des champs numberAssociates et fivePercent dans la table kyc_entreprise
   const updateNumberAssociates = async(event) => {
    setIsLoggingIn(true);
    event.preventDefault();


    try {

        const dataInfos = {
            numberAssociates:numberAssociates,
            fivePercent:fivePercent
        }
            const token = localStorage.getItem('tokenEnCours') //Le token récuperé

            const result = await fetch(`${API_URL}/api/kyc/business/update-kyc-for-number-associates`, {
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
                        Router.push("/profil/kyc/entreprise/structure-control-two"); 
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

   const activeStepEntreprise = 3;
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
                <br/><br/><h1 className='text-center '>Structure de propriété ou de contrôle 1</h1>
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
                        <form className='' onSubmit={updateNumberAssociates}>
                            
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="numberAssociates"
                                    className="text-blackish-blue mb-2"
                                >
                                    Nombre d'associé 
                                </label>
                                <select 
                                className="form-control"
                                id="numberAssociates"
                                required
                                defaultValue={numberAssociates} 
                                onChange={(event)=>setNumberAssociates(event.target.value)}
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
                                        <option  value="Plus de 10">Plus de 10</option>
                                    </optgroup>
                                </select>
                            </div>
                            {/* Si plus de 10 on pose cette question */}
                            {numberAssociates==="Plus de 10"? (
                                <>
                                
                                    <div className="form-group mb-6 mt-3">
                                        <label
                                            htmlFor="fivePercent"
                                            className="text-blackish-blue mb-2"
                                        >
                                            Combien d’associé qui ont 5% du capital 
                                        </label>
                                        <select 
                                        className="form-control"
                                        id="fivePercent"
                                        required
                                        defaultValue={fivePercent} 
                                        onChange={(event)=>setFivePercent(event.target.value)}
                                        >
                                        <option defaultValue="">Choisissez</option>
                                            <optgroup className='single-cryptocurrency-box'>
                                                <option  value="0">0</option>
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
                                    NB: Vous devez obligatoirement compléter les informations qui vont suivre pour chaque associé.  
                            </label>



                            <div className="form-group mb-6 mt-3 col-lg-12 col-md-12  row justify-content-between">
                                <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">
                                    <Link href='/profil/kyc/entreprise/beneficiaire-effectif-two/' className="align-right">
                                        <a
                                        className=""
                                        >
                                            <button className="btn btn-primary " type='button'  > Précédente </button>
                                        </a>   
                                    </Link>                          
                                </div>
                                <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">
                                    <button className="btn btn-primary "  disabled={isLoggingIn}>Suivant</button>                         
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

export default CStructureControlOne;
