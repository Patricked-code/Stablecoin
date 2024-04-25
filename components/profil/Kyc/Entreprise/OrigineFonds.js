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

const COrigneFonds = () => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API
     // Variable de l'api key de stablecoin
     const API_KEY_STABLECOIN = process.env.NEXT_PUBLIC_API_KEY_STABLECOIN

    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [messageError, setMessageError] = useState();
    const [fundOriginIdsToUpdate, setFundOriginIdsToUpdate] = useState();
    const [currentKycEntrepriseStatut, setCurrentKycEntrepriseStatut] = useState();

    
    
    // ***********LA BONNE PARTIE ***********************
    const [statusA, setStatusA] = useState(0);
    const [statusB, setStatusB] = useState(0);

    
    // Les states du formulaire
    const [questionsA, setQuestionsA] = useState([
        { title: "Revenus des ventes", question: "Les fonds provenant des ventes de biens ou de services effectuées par l'entreprise et reçus sous forme de paiements des clients.", answer: "" },
        { title: "Financement par capitaux propres", question: "Les fonds provenant de l'émission d'actions de l'entreprise et de l'investissement des actionnaires.", answer: "" },
        { title: "Financement par endettement", question: "Les fonds provenant de prêts accordés par des institutions financières ou d'autres prêteurs, tels que des emprunts bancaires, des lignes de crédit ou des émissions d'obligations.", answer: "" },
        { title: "Autofinancement", question: "Les fonds provenant des bénéfices générés par l'entreprise et conservés pour être réinvestis ou utilisés pour les dépenses opérationnelles.", answer: "" },
        { title: "Subventions et aides gouvernementales", question: "Les fonds provenant de subventions, de subventions ou d'autres formes d'aides financières accordées par des organismes gouvernementaux ou des institutions publiques.", answer: "" },
        
    ]);

    const [questionsB, setQuestionsB] = useState([
        { title: "Revenus d'investissements", question: "Les fonds provenant des revenus générés par des investissements de l'entreprise, tels que des intérêts, des dividendes ou des gains en capital provenant de placements financiers.", answer: "" },
        { title: "Prêts accordés à d'autres entités", question: "Les fonds provenant de prêts accordés par l'entreprise à des tiers, tels que des prêts commerciaux ou des prêts intra-groupe.", answer: "" },
        { title: "Transferts internes de fonds", question: "Les fonds provenant de transferts internes entre comptes bancaires de l'entreprise, par exemple, pour le rééquilibrage de la trésorerie ou pour le financement de filiales ou de divisions internes.", answer: "" },
        { title: "Recouvrement de créances", question: "Les fonds provenant du recouvrement de créances antérieures, tels que des paiements de clients en retard ou des remboursements d'avances.", answer: "" },
        { title: "Ventes d'actifs", question: "Les fonds provenant de la vente d'actifs non essentiels de l'entreprise, tels que des propriétés ou des équipements.", answer: "" },
        { title: "Autres sources de revenus", question: "Les fonds provenant d'autres sources de revenus de l'entreprise, telles que des revenus de location, des redevances ou des pénalités.", answer: "" }
    ]);

    
    //localStorage pour récupérer une valeur en cliquant sur un bouton Recompleter qui indique qu'on veut modifier une partie Kyc 
    useEffect(() => {
        const kycStatut = localStorage.getItem('currentKycEntrepriseStatut')  
        setCurrentKycEntrepriseStatut(kycStatut)
    }, [currentKycEntrepriseStatut]);


    // ENVOIES DES DONNEES D'ORIGINE DES FONDS 
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoggingIn(true);

        // Combiner les données du formulaire de différentes sections
        const combinedFormData = [
            ...questionsA,
            ...questionsB,
        ];
        try {
            // Prepare data
            const dataa = {
                fundOrigin: combinedFormData,
            };
            const token = localStorage.getItem('tokenEnCours') //Le token récuperé

            // Envoyer une requête POST en utilisant fetch
            const response = await fetch(`${API_URL}/api/kyc/business/add-kyc-fund-origin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': `${API_KEY_STABLECOIN}`,
                    Authorization:  `Bearer ${token}`

                },
                body: JSON.stringify(dataa),
            });

            // Parse the response data
            const data = await response.json();
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
                        Router.push("/profil/kyc/entreprise/information-financiere-one"); 
                      
                }, 5000)
            }
            // Fin condition 
                    
        } catch (error) {
            setIsLoggingIn(false);
        }
    };
    // FIN

        // FONCTION DE MODIFICATION DES DONNEES D'ORIGINE DES FONDS
        const handleUpdateSubmit = async (e) => {
            e.preventDefault();
            setIsLoggingIn(true);

            try {
                 // Combine form data from different sections
                const combinedFormData = [
                    ...questionsA,
                    ...questionsB,
                ];

                // Prepare data
                const dataa = {
                    fundOriginUpdate: combinedFormData,
                    fundOriginIds: fundOriginIdsToUpdate,
                };
                const token = localStorage.getItem('tokenEnCours') //Le token récuperé
                
                // Send PUT request using fetch
                const response = await fetch(`${API_URL}/api/kyc/business/update-kyc-fund-origin`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    'x-api-key': `${API_KEY_STABLECOIN}`,
                        Authorization:  `Bearer ${token}`
                    },
                    body: JSON.stringify(dataa),
                });
    
                // Parse the response data
                const data = await response.json();
                /* Verifier s'il y a un messsage d'erreur et qui est différent de 200 on l'affiche dans SWAL 
                * sinon on affiche le message de succès
                */
                if (data.message != 200) {
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
                        if (currentKycEntrepriseStatut==="1") {
                            Router.push("/profil/kyc/entreprise/resultat-kyc"); 
                        }else{
                            Router.push("/profil/kyc/entreprise/information-financiere-one"); 
                            // Router.push("/profil/"); 
                        }
                    }, 5000)
                }
                // Fin condition 
                
            } catch (error) {
                setIsLoggingIn(false);
            }
        };
        // FIN

        // FONCTION POUR RECUPERER LES DONNEES DES OPERATIONS FINANCIERES ET DEFINIR LES IDENTIFIANTS
        const getFundOriginIdsData = async () => {
            const token = localStorage.getItem('tokenEnCours') //Le token récuperé

            try {
                const response = await fetch(`${API_URL}/api/kyc/business/find-kyc-business-fund-origin-of-user-signIn`,{
                    headers: {
                        'Content-Type': 'application/json',
                    'x-api-key': `${API_KEY_STABLECOIN}`,
                        Authorization:  `Bearer ${token}`
                    },
                });
                const data = await response.json();
    
                // Extract IDs and set to state
                const ids = data.map(item => item.id);
                setFundOriginIdsToUpdate(ids);
            } catch (error) {
                console.error(error);
            }
        };
    
        // Appelez getFundOriginIdsData lors du montage du composant
        useEffect(() => {
            getFundOriginIdsData();
        }, []);
        // FIN
    

    //   ***********PARTIE SOLUTION A*********************
      const handleInputChangeA = (e, index, field) => {
        const { value } = e.target;
        setQuestionsA((prevQuestions) => {
          const updatedQuestions = [...prevQuestions];
          updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
          return updatedQuestions;
        });
      };
    //   ****************FIN**********************************


    //   ***********PARTIE SOLUTION B*********************
    const handleInputChangeB = (e, index, field) => {
        const { value } = e.target;
        setQuestionsB((prevQuestions) => {
          const updatedQuestions = [...prevQuestions];
          updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
          return updatedQuestions;
        });
      };
    //   ****************FIN**********************************

    // Modifie le state setStatusA avant de passer à la page suivante
    const newPageA =()=>{
        setStatusA(1),
        Swal.fire({
            position: 'center',
            icon: 'success',
            html: `<p> Veuillez renseigner aussi le formulaire de la page suivante.</p>` ,
            showConfirmButton: false,
            timer: 5000
        })
    }

    

     // La barre de progression de KYC du profil entreprise
   const stepsEntreprise = ["AML","Identité","Représentant", "Bénéficiaire","Control", "Politique", "Opérations", "Fonds", "Financière", "Documents"];

   const activeStepEntreprise = 6;
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
                    <br/><br/><h1 className='text-center '>Déclaration de l’origine des fonds  </h1>
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
                        {/* FORM A */}
                        <form onSubmit={fundOriginIdsToUpdate?.length===0 ? handleSubmit:handleUpdateSubmit} className="my-30">

                            {statusA===0? (
                                <>
                                    {questionsA.map((question, index) => (
                                        <div key={index} className="form-group mb-6 mt-3">
                                            <label><b>{question.title}</b></label>
                                            <input
                                                type="text"
                                                hidden
                                                value={question.title}
                                                onChange={(e) => handleInputChangeA(e, index, 'title')}
                                            /> <br/>

                                            <label className='mx-3'>• {question.question}</label>
                                            <input
                                                type="text"
                                                hidden
                                                value={question.question}
                                                onChange={(e) => handleInputChangeA(e, index, 'question')}
                                            />

                                            <select
                                                className="form-control mt-3"
                                                value={question.answer}
                                                onChange={(e) => handleInputChangeA(e, index, 'answer')}
                                            >
                                                <option defaultValue="">Choisissez</option>
                                                <optgroup className='single-cryptocurrency-box'>
                                                    <option value="Oui">Oui</option>
                                                    <option value="Non">Non</option>
                                                    <option value="Peut être">Peut être</option>
                                                </optgroup>
                                            </select>
                                        </div>
                                    ))}

                                    {/* <button className="btn btn-primary" type='submit' onClick={()=>setStatusA(1)}  disabled={isLoggingIn}>Suivant</button> */}
                                    <div className="form-group mb-6 mt-3 col-lg-12 col-md-12  row justify-content-between">
                                        <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">
                                            <Link href='/profil/kyc/entreprise/operations-financieres-one/' className="align-right">
                                                <a
                                                className=""
                                                >
                                                    <button className="btn btn-primary " type='button'> Précédente </button>
                                                </a>   
                                            </Link>                          
                                        </div>
                                        <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">
                                            <button className="btn btn-primary" type='submit' onClick={newPageA}  disabled={isLoggingIn}>Suivant</button>
                                        </div>
                                    </div>
                                </>
                            ):("")} 
                        


                            {/* FORM B */}
                            {statusA===1 && statusB===0 ? (
                                <>
                                    {questionsB.map((question, index) => (
                                        <div key={index} className="form-group my-3">
                                            <label><b>{question.title}</b></label>
                                            <input
                                                type="text"
                                                hidden
                                                value={question.title}
                                                onChange={(e) => handleInputChangeB(e, index, 'title')}
                                            /> 

                                            <label className='mx-3'>• {question.question}</label>
                                            <input
                                                type="text"
                                                className='mx-3'
                                                hidden
                                                value={question.question}
                                                onChange={(e) => handleInputChangeB(e, index, 'question')}
                                            />

                                            <select
                                                className="form-control mt-3"
                                                value={question.answer}
                                                onChange={(e) => handleInputChangeB(e, index, 'answer')}
                                            >
                                                <option defaultValue="">Choisissez</option>
                                                <optgroup className='single-cryptocurrency-box'>
                                                    <option value="Oui">Oui</option>
                                                    <option value="Non">Non</option>
                                                    <option value="Peut être">Peut être</option>
                                                </optgroup>
                                            </select>
                                        </div>
                                    ))}

                                        {/* <button className="btn btn-primary" type='submit' onClick={()=>setStatusB(1)}  disabled={isLoggingIn}>Suivant</button> */}
                                    <div className="form-group mb-6 mt-3 col-lg-12 col-md-12  row justify-content-between">
                                        <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">
                                        
                                            <button className="btn btn-primary" type='submit' onClick={()=>setStatusA(0)}  disabled={isLoggingIn}>Précédente</button>
                            
                                        </div>
                                        <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">
                                            
                                            <button className="btn btn-primary" type='submit'   disabled={isLoggingIn}> Suivant </button>
                                           
                                        </div>
                                    </div>
                                </> 
                            ):("")} 

                        </form> 
                    </div>
                <div className='col-lg-3 col-md-12'></div>
            </div>
        </div>
    </>
  );
};

export default COrigneFonds;
