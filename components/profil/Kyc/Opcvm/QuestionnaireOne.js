import { useCallback, useState, useEffect,useRef } from 'react';
import React from "react";
import Link from 'next/link';
import { Table } from '@nextui-org/react';
import Router from "next/router";
import Swal from 'sweetalert2';
import ProgressBar from '../ProgressBar';
// FIN

const CQuestionnaireOne = () => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API

    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [messageError, setMessageError] = useState();
    const [questionnaireForUser, setQuestionnaireForUser] = useState();
    
    // State du formulaire
    const [selectedOption, setSelectedOption] = useState('');
    const [pointing, setPointing] = useState(); 

    // Question
    const question = "Si vous détenez des investissements financiers dans des OPCVM, quand aurez-vous besoin de toucher à votre portefeuille d’investissement que ce soit au moyen de retraits réguliers ou du retrait d’une somme forfaitaire importante ?"

    const handleOptionChange = (event) => {
        const selectedValue = event.target.value;
        setSelectedOption(selectedValue);
    
        // Attribution des points en fonction de la sélection
        switch (selectedValue) {
          case 'Moins de 5 ans':
            setPointing(0);
            break;
          case 'De 6 à 10 ans':
            setPointing(2);
            break;
          case 'De 11 à 15 ans':
            setPointing(4);
            break;
          case 'De 16 à 20 ans':
            setPointing(6);
            break;
          case 'Plus de 20 ans':
            setPointing(8);
            break;
          default:
            setPointing(""); // Aucune sélection
        }
      };

      // Fonction d'envoie des données de questionOne
      const addQuestionOne= async (event) => {
          event.preventDefault();
          setIsLoggingIn(true);
          try {

              const dataa = {
                questionOne: question,
                answerOne: selectedOption,
                pointingOne: pointing,
              }

                  const token = localStorage.getItem('tokenEnCours') //Le token récuperé

                  const result = await fetch(`${API_URL}/api/profile/opcvm/add-questionOne`, {
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
                      Router.push("/profil/kyc/opcvm/questionnaire-two"); 
                    }, 5000)
                  }
                  // Fin condition 
              } catch {
              setIsLoggingIn(false);
              }
      };
      // Fin

    // Fonction d'envoie (Modifier) des données de questionOne
    const updateQuestionOne= async (event) => {
        event.preventDefault();
        setIsLoggingIn(true);
        try {

            const dataa = {
              questionOne: question,
              answerOne: selectedOption,
              pointingOne: pointing,
            }

                const token = localStorage.getItem('tokenEnCours') //Le token récuperé

                const result = await fetch(`${API_URL}/api/profile/opcvm/update-questionOne`, {
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
                    Router.push("/profil/kyc/opcvm/questionnaire-two"); 
                  }, 5000)
                }
                // Fin condition 
            } catch {
            setIsLoggingIn(false);
            }
    };
    // Fin

    // Recuperer les donnees du questionnaire de l'utilisateur connecté
    useEffect(async() => {
      const token = localStorage.getItem('tokenEnCours')
          const getQuestionnaireForUser = async () => {
          const result = await fetch(`${API_URL}/api/profile/opcvm/find-profile-opcvm-questionnaire-of-user-signIn`, {
              headers: {
                'Content-Type': 'application/json',
                Authorization:  `Bearer ${token}`,
              },
          })
              .then((result) => result.json())
              .then((data) => {
                  setQuestionnaireForUser(data)
                  console.log("Data=>", data?.userId)
              }) 
          };
          await getQuestionnaireForUser();
    }, []);
    // FIN

    
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
                  {question}
                </label>
                {/* FORM  */}
                <form onSubmit={questionnaireForUser?.userId || !questionnaireForUser?.userId==undefined? updateQuestionOne : addQuestionOne}>
                  <div className='form-group'>
                    <label>
                      <input
                        type="radio"
                        value="Moins de 5 ans"
                        className='mx-3'
                        checked={selectedOption === "Moins de 5 ans"}
                        onChange={handleOptionChange}
                      />
                          Moins de 5 ans
                    </label>
                  </div>
                  <div className='form-group'>
                    <label>
                      <input
                        type="radio"
                        value="De 6 à 10 ans"
                        className='mx-3'
                        checked={selectedOption === "De 6 à 10 ans"}
                        onChange={handleOptionChange}
                      />
                        De 6 à 10 ans
                    </label>
                  </div>
                  <div className='form-group'>
                    <label>
                        <input
                        type="radio"
                        value="De 11 à 15 ans"
                        className='mx-3'
                        checked={selectedOption === "De 11 à 15 ans"}
                        onChange={handleOptionChange}
                        />
                          De 11 à 15 ans
                    </label>
                  </div>
                  <div className='form-group'>
                    <label>
                        <input
                        type="radio"
                        value="De 16 à 20 ans"
                        className='mx-3'
                        checked={selectedOption === "De 16 à 20 ans"}
                        onChange={handleOptionChange}
                        />
                        De 16 à 20 ans
                    </label>
                  </div>
                  <div className='form-group'>
                    <label>
                        <input
                          type="radio"
                          value="Plus de 20 ans"
                          className='mx-3'
                          checked={selectedOption === "Plus de 20 ans"}
                          onChange={handleOptionChange}
                        />
                          Plus de 20 ans
                    </label>
                  </div>

                  {/* Les boutons */}
                  <div className="form-group mb-6 mt-3 col-lg-12 col-md-12  row justify-content-between">
                      <button className="btn btn-primary" type='submit' disabled={isLoggingIn}> Suivante </button>
                  </div>
                </form>
              </div>
              <div className='col-lg-3 col-md-12'></div>
            </div>
          </div>
    </>
  );
};

export default CQuestionnaireOne;
