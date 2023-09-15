import { useCallback, useState, useEffect,useRef } from 'react';
import React from "react";
import Link from 'next/link';
import { Table } from '@nextui-org/react';
import Router from "next/router";
import Swal from 'sweetalert2';
import ProgressBar from '../ProgressBar';
// FIN

const CQuestionnaireSeven = () => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API

    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [messageError, setMessageError] = useState();

    // Les du formulaire
    const [selectedOption, setSelectedOption] = useState('');
    const [pointing, setPointing] = useState(); 
    
    // Question
    const question = "Si vous possédiez un placement dont la valeur aurait baissé de 25 % sur une période d’un an, que feriez-vous ?"
    // Les réponses des questions
    const answerOne = "Je n’en dors plus et je vendrais mon placement, même si cela entraînait une perte immédiate et j’opterais pour des placements moins risqués. Ce type de placement ne me convient pas.";
    const answerTwo = "Je conserverais mon placement jusqu’à ce qu’il reprenne sa valeur initiale, puis je le transférerais vers un placement moins volatile";
    const answerThree = "Je conserverais mon placement, car il faut s’attendre à des fluctuations du marché. C’est la croissance à long terme de ce placement qui m’intéresse, et les fluctuations à court terme ne me préoccupent pas";
    const answerFour = "J’investirais des sommes supplémentaires dans ce placement.Ce serait une occasion idéale d’acquérir davantage de parts ou d’actions à un meilleur prix et, par conséquent, d’améliorer le rendement à long terme de mon portefeuille.";

    
    const handleOptionChange = (event) => {
        const selectedValue = event.target.value;
        setSelectedOption(selectedValue);
    
        // Attribution des points en fonction de la sélection
        switch (selectedValue) {
          case answerOne:
            setPointing(0);
            break;
          case answerTwo:
            setPointing(3);
            break;
          case answerThree:
            setPointing(5);
            break;
          case answerFour:
            setPointing(8);
            break;
         
          default:
            setPointing(""); // Aucune sélection
        }
    };


    // Fonction d'envoie (Modifier) des données de questionSeven
    const updateQuestionSeven= async (event) => {
      event.preventDefault();
      setIsLoggingIn(true);
      try {

          const dataa = {
            questionSeven: question,
            answerSeven: selectedOption,
            pointingSeven: pointing,
          }

              const token = localStorage.getItem('tokenEnCours') //Le token récuperé

              const result = await fetch(`${API_URL}/api/profile/opcvm/update-questionSeven`, {
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
                  Router.push("/profil/kyc/opcvm/questionnaire-eight"); 
                }, 5000)
              }
              // Fin condition 
          } catch {
          setIsLoggingIn(false);
          }
    };
    // Fin
    
    // La barre de progression de KYC du profil entreprise
   const stepsOpcvm = ["Question 1","Question 2","Question 3", "Question 4","Question 5", "Question 6", "Question 7", "Question 8", "Question 9"];

   const activeStepOpcvm = 5;
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
                    {question}
                </label>
                {/* FORM  */}
                <form onSubmit={updateQuestionSeven}>
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
                 
                  {/* Les boutons */}
                  <div className="form-group mb-6 mt-3 col-lg-12 col-md-12  row justify-content-between">
                    <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">
                        <Link href='/profil/kyc/opcvm/questionnaire-six' className="align-right">
                            <a
                            className=""
                            >
                              <button className="btn btn-primary " type='button'> Précédente</button>
                            </a>   
                        </Link>
                    </div>
                   
                    <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">
                       <button className="btn btn-primary" type='submit' disabled={isLoggingIn}> Suivante </button>
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

export default CQuestionnaireSeven;
