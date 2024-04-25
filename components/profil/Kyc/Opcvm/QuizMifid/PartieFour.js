import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import Swal from 'sweetalert2';
import Link from 'next/link';
import ProgressBar from '../../ProgressBar';

/**
 * Composant pour la quatrième partie du quiz MIFID.
 * @component
 * @return {JSX.Element} Composant de la quatrième partie du quiz MIFID.
 */
const CPartieFour = () => {
  // Variable de l'url de l'api
  const API_URL = process.env.NEXT_PUBLIC_URL_API;
   // Variable de l'api key de stablecoin
   const API_KEY_STABLECOIN = process.env.NEXT_PUBLIC_API_KEY_STABLECOIN

  // États pour gérer l'état du formulaire
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [messageError, setMessageError] = useState('');

  // States de MIFID
  const [quizPartFour, setQuizPartFour] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);

  // Effet pour récupérer les questionnaires de la partie 4
  useEffect(async () => {
    const token = localStorage.getItem('tokenEnCours');
    const getQuizPartFour = async () => {
      try {
        const result = await fetch(`${API_URL}/api/mifid/find-quiz-part-four`, {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': `${API_KEY_STABLECOIN}`,
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await result.json();
        setQuizPartFour(data.questions);
        setSelectedOptions(Array(data.questions.length).fill({ reponse: '', points: 0 }));
      } catch (error) {
        console.error('Error fetching quiz part one:', error);
      }
    };

    await getQuizPartFour();
  }, []);

 
  // Fonction pour gérer le changement d'option
  const handleOptionChange = (event, questionIndex) => {
    const newSelectedOptions = [...selectedOptions];
    const selectedOption = quizPartFour[questionIndex].reponses.find(
      (reponse) => reponse.reponse === event.target.value
    );

    newSelectedOptions[questionIndex] = selectedOption;
    setSelectedOptions(newSelectedOptions);
  };

  

  // Fonction pour gérer la mise à jour des données de la partie 4
  const updatePartFour = async (event) => {
    event.preventDefault();
    setIsLoggingIn(true);

    try {
      const dataToUpdate = {
        pointOnePartFour: selectedOptions[0].points,
        pointTwoPartFour: selectedOptions[1].points,
        pointThreePartFour: selectedOptions[2].points,
        pointFourPartFour: selectedOptions[3].points,
      };

      const token = localStorage.getItem('tokenEnCours');
      const result = await fetch(`${API_URL}/api/mifid/update-part-four`, {
        method: 'PUT',
        body: JSON.stringify(dataToUpdate),
        headers: {
          'Content-Type': 'application/json',
                    'x-api-key': `${API_KEY_STABLECOIN}`,
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await result.json();

      if (data.message) {
        setMessageError(data.message);
        setIsLoggingIn(false);

        Swal.fire({
          position: 'center',
          icon: 'error',
          html: `<p> ${messageError} </p>`,
          showConfirmButton: false,
          timer: 10000,
        });
      } else {
        Swal.fire({
          position: 'center',
          icon: 'success',
          html: `<p> Vos réponses ont été sauvegardées avec succès.</p>`,
          showConfirmButton: false,
          timer: 5000,
        });
        
        setTimeout(() => {
          Router.push('/profil/kyc/opcvm/mifid/partie-five');
        }, 5000);
      }
    } catch (error) {
      console.error('Error updating part one:', error);
      setIsLoggingIn(false);
    }
  };

  // La barre de progression de KYC du profil entreprise
  const stepsQuizMifid = ['Partie 1', 'Partie 2', 'Partie 3', 'Partie 4', 'Partie 5', 'Partie 6', 'Partie 7', 'Partie 8'];

  const activeStepQuizMifid = 2;

  // Conditionnez l'affichage de ProgressBar en fonction de la largeur de l'écran
  const [windowWidth, setWindowWidth] = useState(0);
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const showProgressBar = windowWidth >= 1180;

  return (
    <>
      {showProgressBar && <ProgressBar className="mb-15" steps={stepsQuizMifid} activeStep={activeStepQuizMifid} />}

      <div className='mt-15' >
        {/* Les images de fond */}
        <div className='shape1'></div>
        <div className='shape2 mb-5'><br/></div>
        <div className='shape3'></div>
        <div className='shape4'><img src='/images/shape/shape4.png' alt='image' /></div>
        {/* Fin des images de fond */}

        {/* Les cards */}
        <div className='row mt-5'>
          <div className='col-lg-3 col-md-12'></div>
          <div className='m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg rounded-xl bg-white cryptocurrency-search-box login-form col-lg-6 col-md-12'>
            <form onSubmit={updatePartFour}>
              <h4> L’expérience en termes d’investissement.</h4>
              <p>Cette partie vise à évaluer votre expérience en matière d'investissement, en tenant compte de la fréquence, de la durée, du montant et du type de vos placements passés ou actuels. Ces informations sont utiles pour apprécier votre capacité à gérer votre portefeuille, à prendre des décisions éclairées et à faire face aux fluctuations du marché.</p>
              {quizPartFour.map((questionData, index) => (
                <div key={index}>
                  <label className='mb-3'>{questionData.question}</label>
                  {questionData.reponses.map((reponse, idx) => (
                    <div key={idx} className='form-group'>
                      <label className='d-flex'>
                        <input
                          type='radio'
                          value={reponse.reponse}
                          className='mx-3'
                          checked={selectedOptions[index]?.reponse === reponse.reponse}
                          onChange={(event) => handleOptionChange(event, index)}
                        />
                            <p className=" mx-2 mb-0">
                                {reponse.reponse}
                            </p>
                      </label>
                    </div>
                  ))}
                </div>
              ))}

              {/* Les boutons */}
              <div className='form-group mb-6 mt-3 col-lg-12 col-md-12'>
                <button className='btn btn-primary' type='submit' disabled={isLoggingIn}>
                  Suivante
                </button>
              </div>
            </form>
          </div>
          <div className='col-lg-3 col-md-12'></div>
        </div>
      </div>
    </>
  );
};

export default CPartieFour;
