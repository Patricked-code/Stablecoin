import { useCallback, useState, useEffect,useRef } from 'react';
import React from "react";
import Link from 'next/link';
import Router from "next/router";
import Swal from 'sweetalert2';
import ProgressBar from '../ProgressBar';

// FIN

const CBeneficiaireEffectifOne = () => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API

    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [messageError, setMessageError] = useState();
    const [currentKycStatut, setCurrentKycStatut] = useState();

    // States du formulaire
    const [numberBeneficial, setNumberBeneficial] = useState();


    // Fonction de modification des infos du champ numberBeneficial dans la table kyc_entreprise
    const updateNumberBeneficial = async(event) => {
        setIsLoggingIn(true);
        event.preventDefault();


        try {

            const dataInfos = {
                numberBeneficial:numberBeneficial
            }
                const token = localStorage.getItem('tokenEnCours') //Le token récuperé

                const result = await fetch(`${API_URL}/api/kyc/business/update-kyc-for-number-beneficial`, {
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
                            Router.push("/profil/kyc/entreprise/beneficiaire-effectif-two"); 
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

   const activeStepEntreprise = 2;
    // Fin

  return (
    <>
      <ProgressBar className="mb-15" steps={stepsEntreprise} activeStep={activeStepEntreprise} />

        <div className='mt-15' >
            <div className=' mx-15'>
                <div className='py-10'>
                <br/><br/><h1 className='text-center '>Bénéficiaire(s) effectif(s) </h1>
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
                        <form className='' onSubmit={updateNumberBeneficial}>
                            
                            <div className="form-group mb-6 mt-3">
                            <label
                                    htmlFor="issuingCountry"
                                    className="text-blackish-blue mb-2"
                                >
                                    L’expression « Bénéficiaire effectif »1 (ou « Titulaire réel ») désigne la ou les personnes physiques qui, en dernier ressort, possèdent ou contrôlent, directement ou indirectement, un pourcentage supérieur à 25 % du capital de la société ou des droits de vote ou qui, à travers d’autres moyens, exercent le contrôle direct ou indirect de la gestion de la personne morale. Faute de titulaire réel, identifier le/s administrateur/s de la société (en cas d’administrateur personne morale identifier le représentant personne physique).
                                </label>

                                <label
                                    htmlFor="numberBeneficial"
                                    className="text-blackish-blue mb-2"
                                >
                                    Combien de bénéficiaire effectif ?
                                </label>
                                <select 
                                className="form-control"
                                id="numberBeneficial"
                                required
                                defaultValue={numberBeneficial} 
                                onChange={(event)=>setNumberBeneficial(event.target.value)}
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
                            </div>
                            <label
                                    htmlFor="nativeCountry"
                                    className="text-blackish-blue mb-2 colorRed"
                                >
                                    NB: Vous devez obligatoirement compléter les informations qui vont suivre pour chaque bénéficiaire.  
                            </label>


                            <div className="form-group mb-6 mt-3 col-lg-12 col-md-12  row justify-content-between">
                                <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">
                                    <Link href='/profil/kyc/entreprise/identite-representant-two/' className="align-right">
                                        <a
                                        className=""
                                        >
                                            <button className="btn btn-primary " type='button'  > Précédente </button>
                                        </a>   
                                    </Link>                          
                                </div>
                                <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">
                                    <button className="btn btn-primary " type='submit'  disabled={isLoggingIn}>Suivant</button>
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

export default CBeneficiaireEffectifOne;
