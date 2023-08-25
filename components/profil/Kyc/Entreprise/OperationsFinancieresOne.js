import { useCallback, useState, useEffect,useRef } from 'react';
import React from "react";
import Link from 'next/link';
import Router from "next/router";
import Swal from 'sweetalert2';
import ProgressBar from '../ProgressBar';


const COperationsFinancieresOne = () => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API

    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [messageError, setMessageError] = useState();
    const [currentKycStatut, setCurrentKycStatut] = useState();
    const [financialOperationIdsToUpdate, setFinancialOperationIdsToUpdate] = useState([]);


    // ***********LA BONNE PARTIE ***********************
    const [statusA, setStatusA] = useState(0);
    const [statusB, setStatusB] = useState(0);
    const [statusC, setStatusC] = useState(0);
    const [statusD, setStatusD] = useState(0);
    const [statusE, setStatusE] = useState(0);

    // Les states du formulaire
    const [questionsA, setQuestionsA] = useState([
        { title: 'Opérations liées aux ventes et aux clients', question: 'Réception de paiements des clients pour les ventes de biens ou services.', answer: '' },
        { title: 'Opérations liées aux achats et aux fournisseurs', question: 'Paiement des fournisseurs pour l\'achat de biens ou services.', answer: '' },
        { title: 'Opérations liées aux employés', question: 'Paiement des salaires et des avantages sociaux aux employés.', answer: '' },
        { title: 'Opérations liées aux impôts et aux taxes', question: 'Paiement des impôts sur le revenu et des taxes sur les ventes.', answer: '' },
        { title: 'Opérations liées aux assurances', question: 'Paiement d\'assurances pour couvrir les risques et les pertes éventuelles.', answer: '' },
    ]); 

    const [questionsB, setQuestionsB] = useState([
        { title: 'Opérations liées aux investissements', question: 'Encaissement d\'intérêts sur les prêts accordés ou paiement d\'intérêts sur les emprunts.', answer: '' },
        { title: 'Opérations liées aux investissements', question: 'Paiement des dividendes aux actionnaires.', answer: '' },
        { title: 'Opérations liées aux investissements', question: 'Encaissement de revenus d\'investissements, tels que des intérêts, des dividendes ou des gains en capital.', answer: '' },
        { title: 'Opérations liées aux investissements', question: 'Acquisition ou cession d\'actifs tels que des immobilisations corporelles ou des brevets.', answer: '' },
        { title: 'Opérations liées aux investissements', question: 'Investissement dans des OPCVM.', answer: '' },
        { title: 'Opérations liées aux investissements', question: 'Placement de trésorerie.', answer: '' },
        { title: 'Opérations liées aux investissements', question: 'Financement participatif.', answer: '' },
        { title: 'Opérations liées aux investissements', question: 'Epargne salariale.', answer: '' },
    ]);

    const [questionsC, setQuestionsC] = useState([    
        { title: 'Opérations liées au financement', question: 'Émission d\'actions ou de titres de créance pour lever des fonds.', answer: '' },
        { title: 'Opérations liées au financement', question: 'Rachat d\'actions propres de l\'entreprise sur le marché.', answer: '' },
        { title: 'Opérations liées au financement', question: 'Remboursement de prêts ou de dettes à long terme.', answer: '' },
        { title: 'Opérations liées au financement', question: 'Campagne de financement participatif.', answer: '' },
    ]);

    const [questionsD, setQuestionsD] = useState([
        { title: 'Opérations liées aux opérations internationales', question: 'Conversion de devises étrangères lors d\'opérations internationales.', answer: '' },
        { title: 'Opérations liées aux opérations internationales', question: 'Transferts transfrontaliers.', answer: '' },
        { title: 'Opérations liées aux opérations internationales', question: 'Commerce international.', answer: '' },
        { title: 'Opérations liées aux opérations internationales', question: 'Trade Finance.', answer: '' },
    ]);

    const [questionsE, setQuestionsE] = useState([
        { title: 'Opérations diverses', question: 'Paiement de loyers pour l\'utilisation de locaux ou d\'équipements.', answer: '' },
        { title: 'Opérations diverses', question: 'Paiement de frais juridiques ou comptables pour des services professionnels.', answer: '' },
        { title: 'Opérations diverses', question: 'Paiement de frais de licence ou de redevances pour l\'utilisation de brevets, de marques de commerce ou d\'autres droits de propriété intellectuelle.', answer: '' },
        { title: 'Opérations diverses', question: 'Paiement de commissions à des courtiers ou à des agents commerciaux.', answer: '' },
        { title: 'Opérations diverses', question: 'Paiement de frais bancaires tels que les frais de transaction, les frais de tenue de compte ou les frais de découvert.', answer: '' },
        { title: 'Opérations diverses', question: 'Paiement de frais de publicité ou de marketing.', answer: '' },
        { title: 'Opérations diverses', question: 'Paiement de frais de formation et de développement du personnel.', answer: '' },
        { title: 'Opérations diverses', question: 'Paiement de frais de transport ou de logistique.', answer: '' },
        { title: 'Opérations diverses', question: 'Paiement de frais de services publics tels que l\'électricité, l\'eau ou le gaz.', answer: '' },
        { title: 'Opérations diverses', question: 'Paiement de frais de location ou de leasing d\'équipements.', answer: '' }
    
      ]);


    //   ***********PARTIE SOLUTION A*********************
      const handleInputChangeA = (e, index, field) => {
        const { value } = e.target;
        setQuestionsA((prevQuestions) => {
          const updatedQuestions = [...prevQuestions];
          updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
          return updatedQuestions;
        });
      };


    // ENVOIES DES DONNEES DE L'OPERATION FINANCIERE
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoggingIn(true);

        // Combiner les données du formulaire de différentes sections
        const combinedFormData = [
            ...questionsA,
            ...questionsB,
            ...questionsC,
            ...questionsD,
            ...questionsE,
        ];
        try {
            // Prepare data
            const dataa = {
                financialOperation: combinedFormData,
            };
            const token = localStorage.getItem('tokenEnCours') //Le token récuperé

            // Envoyer une requête POST en utilisant fetch
            const response = await fetch(`${API_URL}/api/kyc/business/add-kyc-financial-operation`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
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
                    if (currentKycStatut==="1") {
                        Router.push("/profil/kyc/entreprise/resultat-kyc"); 
                    }else{
                        Router.push("/profil/kyc/entreprise/origine-fonds"); 
                    }
                }, 5000)
            }
            // Fin condition 
                    
        } catch (error) {
            setIsLoggingIn(false);
        }
    };
    // FIN

        // FONCTION DE MODIFICATION DES DONNEES DES OPERATIONS FINANCIRES
        const handleUpdateSubmit = async (e) => {
            e.preventDefault();
            setIsLoggingIn(true);

            try {
                 // Combine form data from different sections
                const combinedFormData = [
                    ...questionsA,
                    ...questionsB,
                    ...questionsC,
                    ...questionsD,
                    ...questionsE,
                ];

                // Prepare data
                const dataa = {
                    financialOperationUpdate: combinedFormData,
                    financialOperationIds: financialOperationIdsToUpdate,
                };
                const token = localStorage.getItem('tokenEnCours') //Le token récuperé
                
                // Send PUT request using fetch
                const response = await fetch(`${API_URL}/api/kyc/business/update-kyc-financial-operation`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
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
                        if (currentKycStatut==="1") {
                            Router.push("/profil/kyc/entreprise/resultat-kyc"); 
                        }else{
                            Router.push("/profil/kyc/entreprise/origine-fonds"); 
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
        const getFinancialOperationData = async () => {
            const token = localStorage.getItem('tokenEnCours') //Le token récuperé

            try {
                const response = await fetch(`${API_URL}/api/kyc/business/find-kyc-business-financial-operation-of-user-signIn`,{
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization:  `Bearer ${token}`
                    },
                });
                const data = await response.json();
    
                // Extract IDs and set to state
                const ids = data.map(item => item.id);
                setFinancialOperationIdsToUpdate(ids);
            } catch (error) {
                console.error(error);
            }
        };
    
        // Appelez getFinancialOperationData lors du montage du composant
        useEffect(() => {
            getFinancialOperationData();
        }, []);
        // FIN
    
    


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

    //   ***********PARTIE SOLUTION C*********************
    const handleInputChangeC = (e, index, field) => {
        const { value } = e.target;
        setQuestionsC((prevQuestions) => {
          const updatedQuestions = [...prevQuestions];
          updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
          return updatedQuestions;
        });
      };
    //   ****************FIN**********************************

    //   ***********PARTIE SOLUTION D*********************
    const handleInputChangeD = (e, index, field) => {
        const { value } = e.target;
        setQuestionsD((prevQuestions) => {
          const updatedQuestions = [...prevQuestions];
          updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
          return updatedQuestions;
        });
      };
    //   ****************FIN**********************************

    //   ***********PARTIE SOLUTION E*********************
    const handleInputChangeE = (e, index, field) => {
        const { value } = e.target;
        setQuestionsE((prevQuestions) => {
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

    // Modifie le state setStatusB avant de passer à la page suivante
    const newPageB =()=>{
        setStatusB(1)
        Swal.fire({
            position: 'center',
            icon: 'success',
            html: `<p> Veuillez renseigner aussi le formulaire de la page suivante.</p>` ,
            showConfirmButton: false,
            timer: 5000
        })
    }

    // Modifie le state setStatusC avant de passer à la page suivante
    const newPageC =()=>{
        setStatusC(1)
        Swal.fire({
            position: 'center',
            icon: 'success',
            html: `<p> Veuillez renseigner aussi le formulaire de la page suivante.</p>` ,
            showConfirmButton: false,
            timer: 5000
        })
    }

    // Modifie le state setStatusD avant de passer à la page suivante
    const newPageD =()=>{
        setStatusD(1)
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

   const activeStepEntreprise = 5;
    // Fin

  return (
    <>
      <ProgressBar className="mb-15" steps={stepsEntreprise} activeStep={activeStepEntreprise} />

        <div className='mt-15' >
            <div className=' mx-15'>
                <div className='py-10'>
                <br/><br/><h1 className='text-center '>Description des opérations financières </h1>
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
                        <form onSubmit={financialOperationIdsToUpdate?.length===0 ? handleSubmit:handleUpdateSubmit} className="my-30">
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
                                                <option value="NON">Non</option>
                                                <option value="Peut être">Peut être</option>
                                            </optgroup>
                                        </select>
                                    </div>
                                ))}

                                    {/* <button className="btn btn-primary" type='submit' onClick={()=>setStatusA(1)}  disabled={isLoggingIn}>Suivant</button> */}
                                    <div className="form-group mb-6 mt-3 col-lg-12 col-md-12  row justify-content-between">
                                    <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">
                                        <Link href='/profil/kyc/entreprise/politiquement-exposees-two/' className="align-right">
                                            <a
                                            className=""
                                            >
                                                <button className="btn btn-primary " type='button'  > Précédente </button>
                                            </a>   
                                        </Link>                          
                                    </div>
                                    <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">
                                        <button className="btn btn-primary" type='button' onClick={newPageA} disabled={isLoggingIn}>Suivant</button>
                                    </div>
                                </div>
                            </>
                        ):("")} 
                        
                        {/* FORM B */}
                        {statusA===1 && statusB===0 ? (
                            <>
                                <label><b>Opérations liées aux investissements :</b></label>
                                {questionsB.map((question, index) => (
                                    <div key={index} className="form-group my-3">
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
                                                <option value="NON">Non</option>
                                                <option value="Peut être">Peut être</option>
                                            </optgroup>
                                        </select>
                                    </div>
                                ))}
                                <div className="form-group mb-6 mt-3 col-lg-12 col-md-12  row justify-content-between">
                                    <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">
                                        
                                        <button className="btn btn-primary " onClick={()=>setStatusA(0)}  type='button'  > Précédente </button>
                                                                      
                                    </div>
                                    <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">
                                        <button className="btn btn-primary" type='button' onClick={newPageB}  disabled={isLoggingIn}>Suivant</button>

                                    </div>
                                </div>
                            </>
                        ):("")} 


                        {/* FORM C */}
                        {statusA===1 && statusB===1 && statusC===0? (
                            <>
                                <label><b>Opérations liées au financement :</b></label>
                                {questionsC.map((question, index) => (
                                    <div key={index} className="form-group mb-2 mt-3">
                                        <input
                                            type="text"
                                            hidden
                                            value={question.title}
                                            onChange={(e) => handleInputChangeC(e, index, 'title')}
                                        /> 

                                        <label className='mx-3'>• {question.question}</label>
                                        <input
                                            type="text"
                                            hidden
                                            value={question.question}
                                            onChange={(e) => handleInputChangeC(e, index, 'question')}
                                        />

                                        <select
                                            className="form-control mt-3"
                                            value={question.answer}
                                            onChange={(e) => handleInputChangeC(e, index, 'answer')}
                                        >
                                            <option defaultValue="">Choisissez</option>
                                            <optgroup className='single-cryptocurrency-box'>
                                                <option value="Oui">Oui</option>
                                                <option value="NON">Non</option>
                                                <option value="Peut être">Peut être</option>
                                            </optgroup>
                                        </select>
                                    </div>
                                ))}
                                <div className="form-group mb-6 mt-3 col-lg-12 col-md-12  row justify-content-between">
                                    <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">
                                        
                                        <button className="btn btn-primary " onClick={()=>setStatusB(0)}  type='button'  > Précédente </button>
                                                                      
                                    </div>
                                    <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">
                                        <button className="btn btn-primary" type='button' onClick={newPageC}  disabled={isLoggingIn}>Suivant</button>

                                    </div>
                                </div>
                            </>
                        ):("")}

                        {/* FORM D */}
                        {statusA===1 && statusB===1 && statusC===1 && statusD===0? (
                            <>
                                <label><b>Opérations liées aux opérations internationales :</b></label>
                                {questionsD.map((question, index) => (
                                    <div key={index} className="form-group mb-6 mt-3">
                                        <input
                                            type="text"
                                            hidden
                                            value={question.title}
                                            onChange={(e) => handleInputChangeD(e, index, 'title')}
                                        />

                                        <label className='mx-3'>• {question.question}</label>
                                        <input
                                            type="text"
                                            hidden
                                            value={question.question}
                                            onChange={(e) => handleInputChangeD(e, index, 'question')}
                                        />

                                        <select
                                            className="form-control mt-3"
                                            value={question.answer}
                                            onChange={(e) => handleInputChangeD(e, index, 'answer')}
                                        >
                                            <option defaultValue="">Choisissez</option>
                                            <optgroup className='single-cryptocurrency-box'>
                                                <option value="Oui">Oui</option>
                                                <option value="NON">Non</option>
                                                <option value="Peut être">Peut être</option>
                                            </optgroup>
                                        </select>
                                    </div>
                                ))}
                                <div className="form-group mb-6 mt-3 col-lg-12 col-md-12  row justify-content-between">
                                    <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">
                                        
                                        <button className="btn btn-primary " onClick={()=>setStatusC(0)}  type='button'  > Précédente </button>
                                                                      
                                    </div>
                                    <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">
                                        <button className="btn btn-primary" type='button' onClick={newPageD}  disabled={isLoggingIn}>Suivant</button>

                                    </div>
                                </div>
                            </>
                        ):("")}


                        {/* FORM E */}
                        {statusA===1 && statusB===1 && statusC===1 && statusD===1 && statusE===0? (
                            <>
                                <label><b>Opérations diverses :</b></label>

                                {questionsE.map((question, index) => (
                                    <div key={index} className="form-group mb-2 mt-3">
                                        <input
                                            type="text"
                                            hidden
                                            value={question.title}
                                            onChange={(e) => handleInputChangeE(e, index, 'title')}
                                        /> 

                                        <label className='mx-3'>• {question.question}</label>
                                        <input
                                            type="text"
                                            hidden
                                            value={question.question}
                                            onChange={(e) => handleInputChangeE(e, index, 'question')}
                                        />

                                        <select
                                            className="form-control mt-3"
                                            value={question.answer}
                                            onChange={(e) => handleInputChangeE(e, index, 'answer')}
                                        >
                                            <option defaultValue="">Choisissez</option>
                                            <optgroup className='single-cryptocurrency-box'>
                                                <option value="Oui">Oui</option>
                                                <option value="NON">Non</option>
                                                <option value="Peut être">Peut être</option>
                                            </optgroup>
                                        </select>
                                    </div>
                                ))}
                                <div className="form-group mb-6 mt-3 col-lg-12 col-md-12  row justify-content-between">
                                    <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">
                                        <button className="btn btn-primary " onClick={()=>setStatusD(0)}  type='button'  > Précédente </button>
                                    </div>
                                    <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">
                                        <button className="btn btn-primary" type='submit'   disabled={isLoggingIn}>Suivant</button>
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

export default COperationsFinancieresOne;
