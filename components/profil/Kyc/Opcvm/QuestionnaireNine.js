import { useCallback, useState, useEffect,useRef } from 'react';
import React from "react";
import Link from 'next/link';
import { Table } from '@nextui-org/react';
import Router from "next/router";
import Swal from 'sweetalert2';
import ProgressBar from '../ProgressBar';
// FIN

const CQuestionnaireNine = () => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API

    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [messageError, setMessageError] = useState();

    // LES BONS
    // divestment
    const [selectedOption, setSelectedOption] = useState('');
    const [pointing, setPointing] = useState(); 
    
    // Les réponses des questions
    const answerOne = "Portefeuille A | Rendement moyen annualisé du portefeuille : 1.50%";
    const answerTwo = "Portefeuille B | Rendement moyen annualisé du portefeuille : 2.50%";
    const answerThree = "Portefeuille C	| Rendement moyen annualisé du portefeuille : 5.00%";
    const answerFour = "Portefeuille D | Rendement moyen annualisé du portefeuille : 7.00%";
    const answerFive = "Portefeuille E | Rendement moyen annualisé du portefeuille : 9.00%";

    
    const handleOptionChange = (event) => {
        const selectedValue = event.target.value;
        setSelectedOption(selectedValue);
    
        // Attribution des points en fonction de la sélection
        switch (selectedValue) {
          case answerOne:
            setPointing(0);
            break;
          case answerTwo:
            setPointing(2);
            break;
          case answerThree:
            setPointing(4);
            break;
          case answerFour:
            setPointing(6);
            break;
          case answerFive:
            setPointing(8);
            break;
          default:
            setPointing(""); // Aucune sélection
        }
    };


    
    // La barre de progression de KYC du profil entreprise
   const stepsOpcvm = ["Question 1","Question 2","Question 3", "Question 4","Question 5", "Question 6", "Question 7", "Question 8", "Question 9"];

   const activeStepOpcvm = -1;
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
      {showProgressBar && <ProgressBar className="mb-15" steps={stepsOpcvm} activeStep={activeStepOpcvm} />}

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
                <label className='mb-3'>
                    Avec lequel des cinq portefeuilles fictifs suivants seriez-vous le plus à l’aise ?
                </label>
                <div className=' mb-5'>
                    <img src='/images/ecfa/opcvm/evolution.jpg' alt='image' />
                </div>
                {/* FORM  */}
                <form >
                <div className='form-group'>
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
                  <div className='form-group'>
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
                  <div className='form-group'>
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
                  <div className='form-group'>
                    <label className='gr-check-input d-flex'>
                        <input
                        type="radio"
                        value={answerFour}
                        className='mx-3'
                        checked={selectedOption === answerFour}
                        onChange={handleOptionChange}
                        />
                            {answerOne}
                    </label>
                  </div>
                  <div className='form-group'>
                    <label className='gr-check-input d-flex'>
                        <input
                          type="radio"
                          value={answerFive}
                          className='mx-3'
                          checked={selectedOption === answerFive}
                          onChange={handleOptionChange}
                        />
                          {answerFive}
                    </label>
                  </div>
                  {/* Les boutons */}
                  <div className="form-group mb-6 mt-3 col-lg-12 col-md-12  row justify-content-between">
                    <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">
                        <Link href='/profil/kyc/opcvm/questionnaire-eigth' className="align-right">
                            <a
                            className=""
                            >
                              <button className="btn btn-primary " type='button'> Précédente</button>
                            </a>   
                        </Link>
                    </div>
                   
                    <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">
                        <Link href='/profil' className="align-right">
                                <a
                                className=""
                                >
                                <button className="btn btn-primary " type='button'> Suivant</button>
                                </a>   
                        </Link>
                      {/* <button className="btn btn-primary" type='submit' disabled={isLoggingIn}> Suivant </button> */}
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

export default CQuestionnaireNine;
