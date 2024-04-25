import { useCallback, useState, useEffect,useRef } from 'react';
import React from "react";
import Swal from 'sweetalert2';
import Router from "next/router";

// FIN

const CConditionsProfil = () => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API
     // Variable de l'api key de stablecoin
     const API_KEY_STABLECOIN = process.env.NEXT_PUBLIC_API_KEY_STABLECOIN

    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [messageError, setMessageError] = useState();

    // Les states du formualaire du modal
    const [selectedOption, setSelectedOption] = useState('');

     // Les réponses des questions du modal
     const answerOne = "Je suis d’accord que mon profil d’investisseur est conforme au profil précisé ci-dessus. J ’aimerais sélectionner une stratégie de répartition de l’actif qui correspond à ce profil. Je comprends les risques associés à ce profil d’investissement et suis conscient(e) que ces risques ont une incidence sur la valeur de mon portefeuille de placement. J’aviserai mon conseiller de tout changement susc eptible d’avoir une incidenc e sur mes objectifs de placement et du profil d’investisseur qui en découle.";
     const answerTwo = "Je préfère ne pas sélectionner parmi les options de placement qui correspondent à la catégorie de profil d’investisseur précisée ci-dessus pour mon portefeuille de placement, et je vais sélectionner une combinaison différente d’options de placement.";
     const answerThree = "Le choix d’une répartition de l’actif qui correspond à votre profil d’investisseur ne garantit pas que vous atteigniez vos objectifs financiers. D’autres facteurs, tels que les sommes nécessaires pour financer vos objectifs et vos habitudes d’épargne, doivent également être pris en compte. Votre conseiller peut vous aider à planifier les mesures à prendre pour atteindre vos objectifs.";
     const answerFour = "La notice explicative comprend des renseignements importants touchant les fonds. Vous devez la lire attentivement avant de prendre toute décision. Sauf et exceptée la garantie s’appliquant au décès ou à l’échéance, toute fraction de la cotisation ou toute somme affectée à un fonds distinct est déposée aux risques de l’investisseur. Sa valeur peut augmenter ou décroître en fonction des fluctuations des actifs du fonds sur les marchés. L’information sur le rendement est un reflet des rendements antérieurs et ne garantit pas les rendements futurs.";
 
     
     const handleOptionChange = (event) => {
         const selectedValue = event.target.value;
         setSelectedOption(selectedValue);
     };
 
    

    // Fonction d'envoie (Modifier) des données du champ conditions
    const updateFieldConditions= async (event) => {
        event.preventDefault();
        setIsLoggingIn(true);
        try {
  
            const dataa = {
              conditions: selectedOption,
            }
  
                const token = localStorage.getItem('tokenEnCours') //Le token récuperé
  
                const result = await fetch(`${API_URL}/api/profile/opcvm/update-field-conditions`, {
                method:"PUT",
                body: JSON.stringify(dataa),
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': `${API_KEY_STABLECOIN}`,
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
                    html: `<p> Votre réponse a été sauvegardée avec succès.</p>` ,
                    showConfirmButton: false,
                    timer: 5000
                  }),
                  setTimeout(() => {
                  Router.push("/profil/opcvm/type-profil"); 
                  }, 3000)
                }
                // Fin condition 
            } catch {
            setIsLoggingIn(false);
            }
      };
      // Fin

    

  return (
    <>
          <div className='mt-15' >

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
            <div className='row mt-5'>
              <div className='col-lg-3 col-md-12'></div>
              <div className='m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white cryptocurrency-search-box login-form col-lg-6 col-md-12'>
                <h3 className='mb-3'>
                    Cochez l’énoncé qui s’applique à vous :
                </h3>
                {/* FORM  */}
                <form onSubmit={updateFieldConditions}>
                    <div className='form-group my-3'>
                        <label className='gr-check-input d-flex'>
                        <input
                            type="radio"
                            value={answerOne}
                            className='mx-3'
                            checked={selectedOption === answerOne}
                            onChange={handleOptionChange}
                        />
                            {answerOne}
                        </label>
                    </div>
                    <div className='form-group my-3'>
                        <label className='gr-check-input d-flex'>
                        <input
                            type="radio"
                            value={answerTwo}
                            className='mx-3'
                            checked={selectedOption === answerTwo}
                            onChange={handleOptionChange}
                        />
                            {answerTwo}
                        </label>
                    </div>
                    <div className='form-group my-3'>
                        <label className='gr-check-input d-flex'>
                            <input
                            type="radio"
                            value={answerThree}
                            className='mx-3'
                            checked={selectedOption === answerThree}
                            onChange={handleOptionChange}
                            />
                            {answerThree}
                        </label>
                    </div>
                    <div className='form-group my-3'>
                        <label className='gr-check-input d-flex'>
                            <input
                            type="radio"
                            value={answerFour}
                            className='mx-3'
                            checked={selectedOption === answerFour}
                            onChange={handleOptionChange}
                            />
                                {answerFour}
                        </label>
                    </div>

                    {/* Les boutons */}
                    <div className="form-group mb-6 mt-3 col-lg-12 col-md-12  row justify-content-between">
                        <button className="btn btn-primary" type='submit' disabled={isLoggingIn}> Soumettre </button>
                    </div>
                </form>
              </div>
              <div className='col-lg-3 col-md-12'></div>
            </div>
          </div>
    </>
  );
};

export default CConditionsProfil;
