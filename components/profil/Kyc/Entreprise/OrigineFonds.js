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

    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [messageError, setMessageError] = useState();

    // ***********LA BONNE PARTIE ***********************
    const [statusA, setStatusA] = useState(0);
    const [statusB, setStatusB] = useState(0);
    const [statusC, setStatusC] = useState(0);
    const [statusD, setStatusD] = useState(0);
    const [statusE, setStatusE] = useState(0);

    // LES BONS
    // title
	// question
	// answer
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

       // localStorage.setItem('statusQuestA', statusA); 
        // const token = localStorage.getItem('tokenEnCours')
    

    //   ***********PARTIE SOLUTION A*********************
      const handleInputChangeA = (e, index, field) => {
        const { value } = e.target;
        setQuestionsA((prevQuestions) => {
          const updatedQuestions = [...prevQuestions];
          updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
          return updatedQuestions;
        });
      };


      const handleSubmitA = (e) => {
        e.preventDefault();

        // Effectuer des actions avec les questions du formulaire
        console.log(questionsA);
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


      const handleSubmitB = (e) => {
        e.preventDefault();

        // Effectuer des actions avec les questions du formulaire
        console.log(questionsB);
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


      const handleSubmitC = (e) => {
        e.preventDefault();

        // Effectuer des actions avec les questions du formulaire
        console.log(questionsC);
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


      const handleSubmitD = (e) => {
        e.preventDefault();

        // Effectuer des actions avec les questions du formulaire
        console.log(questionsD);
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


      const handleSubmitE = (e) => {
        e.preventDefault();

        // Effectuer des actions avec les questions du formulaire
        console.log(questionsE);
      };
    //   ****************FIN**********************************


    // ***********FIN DE LA BONNE PARTIE*******************

console.log("statutA=>",statusA)




    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     Construction des données à envoyer
    //     const requestData = questions.map((question) => ({
    //       title: question.title,
    //       question: question.question,
    //       answer: question.answer
    //     }));
    
    //     Envoi de la requête POST à l'API
    //     fetch('URL_DE_L_API', {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json'
    //       },
    //       body: JSON.stringify(requestData)
    //     })
    //       .then((response) => response.json())
    //       .then((data) => {
    //         Traitement de la réponse de l'API
    //         console.log(data);
    //       })
    //       .catch((error) => {
    //         Gestion des erreurs
    //         console.error(error);
    //       });
    //   };
    
    
















    // States du formulaire
    // entrepriseName
    // firstName
    // lastName
    // issuingCountry
    // nativeCountry
    // countryRegistration
    // dateBirth
    // nationality
    // email
    // functions
    // typeDocument
    // identityDocNumber
    // mobile
    // phoneFixe
    // startDate
    // NumberRCCM
    // expirationDate
    // typeBeneficiary
    {/* POUR PIECE D'IDENTITE */}
    // frontIdentity 
    // backIdentity 
    {/* FIN */}
    {/* POUR PIECE DE DOMICILE */}
    // frontDomicile
    // backDomicile
    {/* FIN */}
    
    const [entrepriseName, setEntrepriseName] = useState();
    
    const [issuingCountry, setIssuingCountry] = useState();
    const [nativeCountry, setNativeCountry] = useState();
    const [dateBirth, setDateBirth] = useState();
    
    const [percentControl, setPercentControl] = useState();
    const [email, setEmail] = useState();
    const [typeDocIdentite, setTypeDocIdentite] = useState();
    const [expirationDate, setExpirationDate] = useState();
    const [identityDocNumber, setIdentityDocNumber] = useState();
    const [mobile, setMobile] = useState();
    const [typeBeneficiary, setTypeBeneficiary] = useState();
    const [countryRegistration, setCountryRegistration] = useState();
    const [phoneFixe, setPhoneFixe] = useState();
    const [startDate, setStartDate] = useState();
    const [numberRCCM, setNumberRCCM] = useState();
    
    const [frontIdentity, setFrontIdentity ] = useState();
    const [backIdentity, setCackIdentity ] = useState();
    const [frontDomicile, setFrontDomicile] = useState();
    const [backDomicile, setBackDomicile] = useState();





    // familyCompany
    // functions
    // firstName
    // lastName
    // nationality
    const [familyCompany, setFamilyCompany] = useState();
    const [functions, setFunctions] = useState();
    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [nationality, setNationality] = useState();






    // Pour la signature
    const signatureRef = useRef(null)
    const [signatureData, setSignatureData] = useState(null)

    // Fonction pour sauvegarder une signature
    const save = () => {
        const data = signatureRef.current.getTrimmedCanvas().toDataURL('image/png')
        setSignatureData(data)
    }

    // STATES POUR PRENDRE PHOTO WEBCAMP (IDENTITE)
    const [statutDocIdentite, setStatutDocIdentite] = React.useState();
    // const [importerIdentite, setImporterIdentite] = React.useState();
    const [statutRecto, setStatutRecto] = React.useState("0");
    const [statutVerso, setStatutVerso] = React.useState("0");
    const webcamRefRecto = useRef(null)
    const webcamRefVerso = useRef(null)
    const [imageRecto, setImageRecto] = useState(null)
    const [imageVerso, setImageVerso] = useState(null)
    // FIN

    // LES FONCTIONS POUR PRENDRE PHOTO (IDENTITE)
    // Fonction pour prendre photo du Recto
    const captureRecto = () => {
        const image = webcamRefRecto.current.getScreenshot()
        setImageRecto(image)
    }
    // Fin

    // Fonction pour prendre photo du verso
    const captureVerso = () => {
        const image = webcamRefVerso.current.getScreenshot()
        setImageVerso(image)
    }
    // Fin
    // FIN


    // STATES POUR PRENDRE PHOTO WEBCAMP (IDENTITE)
    const [statutDocDomicile, setStatutDocDomicile] = React.useState();
    const [statutRectoDomicile, setStatutRectoDomicile] = React.useState("0");
    const [statutVersoDomicile, setStatutVersoDomicile] = React.useState("0");
    const webcamRefRectoDomicile = useRef(null)
    const webcamRefVersoDomicile = useRef(null)
    const [imageRectoDomicile, setImageRectoDomicile] = useState(null)
    const [imageVersoDomicile, setImageVersoDomicile] = useState(null)
    // FIN

    // LES FONCTIONS POUR PRENDRE PHOTO (DOMICILE)
    // Fonction pour prendre photo du Recto
    const captureRectoDomicile = () => {
        const image = webcamRefRectoDomicile.current.getScreenshot()
        setImageRectoDomicile(image)
    }
    // Fin

    // Fonction pour prendre photo du verso
    const captureVersoDomicile = () => {
        const image = webcamRefVersoDomicile.current.getScreenshot()
        setImageVersoDomicile(image)
    }
    // Fin
    // FIN

    

    
    
    
                            
                            
                            
                            
                            
                            
    




    // State de la question 2
    const [spentA, setSpentA] = useState([]);
    const [spentB, setSpentB] = useState([]);
    const [spentC, setSpentC] = useState([]);
    const [spentD, setSpentD] = useState([]);
    const [spentE, setSpentE] = useState([]);
    const [spentF, setSpentF] = useState([]);

    // State de la question 4
    const [frequencyA, setFrequencyA] = useState([]);
    const [frequencyB, setFrequencyB] = useState([]);
    const [frequencyC, setFrequencyC] = useState([]);

    // State de la question 5
    const [incomeTypeA, setIncomeTypeA] = useState([]);
    const [incomeTypeB, setIncomeTypeB] = useState([]);
    const [incomeTypeC, setIncomeTypeC] = useState([]);

    // State de la question 1 et 3
    const [statutQ1, setStatutQ1] = useState();
    const [statutQ3, setStatutQ3] = useState();
    
    // FIN

    const [kycForParticular, setKycForParticular] = useState();



    const [currentKycStatut, setCurrentKycStatut] = useState();

    //localStorage pour récupérer une valeur en cliquant sur un bouton Recompleter qui indique qu'on veut modifier une partie Kyc 
    useEffect(() => {
        const kycStatut = localStorage.getItem('currentUpdateKycStatut')  
        setCurrentKycStatut(kycStatut)
    }, [currentKycStatut]);
    // Fin


    // RECUPERER KYC DE L'UTILISATEUR
    useEffect(async() => {
        const token = localStorage.getItem('tokenEnCours')
        
            const getKycForParticular = async () => {
            const resKyc = await fetch(`${API_URL}/api/kyc/particular/find-kyc-particular-for-user`, {
                headers: {
                'Content-Type': 'application/json',
                Authorization:  `Bearer ${token}`,
                },
            })
                .then((resKyc) => resKyc.json())
                .then((data) => {
                setKycForParticular(data)
                }) 
            };
            // console.log("Banques =>",allBank)
            await getKycForParticular();
    }, []);
    // FIN








    // Fonction d'envoie des informations du questionnaire
    const addQuestionnaire= useCallback(async () => {
        setIsLoggingIn(true);
        
        try {
            const dataTable = {
                spentA:Object.assign({},spentA),
                spentB:Object.assign({},spentB),
                spentC:Object.assign({},spentC),
                spentD:Object.assign({},spentD),
                spentE:Object.assign({},spentE),
                spentF:Object.assign({},spentF),
                frequencyA:Object.assign({},frequencyA),
                frequencyB:Object.assign({},frequencyB),
                frequencyC:Object.assign({},frequencyC),
                incomeTypeA:Object.assign({}, incomeTypeA),
                incomeTypeB:Object.assign({},incomeTypeB),
                incomeTypeC:Object.assign({},incomeTypeC)
            }

            const dataa = {
                spentA:dataTable?.spentA[0],
                spentB:dataTable?.spentB[0],
                spentC:dataTable?.spentC[0],
                spentD:dataTable?.spentD[0],
                spentE:dataTable?.spentE[0],
                spentF:dataTable?.spentF[0],
                frequencyA:dataTable?.frequencyA[0],
                frequencyB:dataTable?.frequencyB[0],
                frequencyC:dataTable?.frequencyC[0],
                incomeTypeA:dataTable?.incomeTypeA[0],
                incomeTypeB:dataTable?.incomeTypeB[0],
                incomeTypeC:dataTable?.incomeTypeC[0],
                
            }
            // Condition pour forcer l'utilisateur à choisir au moins une reponse
            if (dataa?.spentA||dataa?.spentB||dataa?.spentC||dataa?.spentD||dataa?.spentE||dataa?.spentF||dataa?.frequencyA||dataa?.frequencyB||dataa?.frequencyC||dataa?.incomeTypeA||dataa?.incomeTypeB||dataa?.incomeTypeC) {
                
                
                const token = localStorage.getItem('tokenEnCours') //Le token récuperé

                const result = await fetch(`${API_URL}/api/kyc/particular/add-kyc-questionnaires`, {
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
                    Router.push("/profil/kyc/particulier/seconde-phase"); 
                    }, 5000)
                }
                // Fin condition 
            }else{
                setIsLoggingIn(false);
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    html: `<p> Désolé, vous devez repondre à une question au moins. </p>` ,
                    showConfirmButton: false,
                    timer: 10000
                })
            }
            
            } catch {
            setIsLoggingIn(false);
            }
        
    }, [spentA,spentB,spentC,spentD,spentE,spentF,frequencyA,frequencyB,frequencyC,incomeTypeA,incomeTypeB,incomeTypeC]);
    // Fin


     // Fonction d'envoie des informations du questionnaire
     const updateQuestionnaire= useCallback(async () => {
        setIsLoggingIn(true);
        
        try {
            const dataTable = {
                spentA:Object.assign({},spentA),
                spentB:Object.assign({},spentB),
                spentC:Object.assign({},spentC),
                spentD:Object.assign({},spentD),
                spentE:Object.assign({},spentE),
                spentF:Object.assign({},spentF),
                frequencyA:Object.assign({},frequencyA),
                frequencyB:Object.assign({},frequencyB),
                frequencyC:Object.assign({},frequencyC),
                incomeTypeA:Object.assign({}, incomeTypeA),
                incomeTypeB:Object.assign({},incomeTypeB),
                incomeTypeC:Object.assign({},incomeTypeC)
            }

            const dataa = {
                spentA:dataTable?.spentA[0],
                spentB:dataTable?.spentB[0],
                spentC:dataTable?.spentC[0],
                spentD:dataTable?.spentD[0],
                spentE:dataTable?.spentE[0],
                spentF:dataTable?.spentF[0],
                frequencyA:dataTable?.frequencyA[0],
                frequencyB:dataTable?.frequencyB[0],
                frequencyC:dataTable?.frequencyC[0],
                incomeTypeA:dataTable?.incomeTypeA[0],
                incomeTypeB:dataTable?.incomeTypeB[0],
                incomeTypeC:dataTable?.incomeTypeC[0],
                
            }
            // Condition pour forcer l'utilisateur à choisir au moins une reponse
            if (dataa?.spentA||dataa?.spentB||dataa?.spentC||dataa?.spentD||dataa?.spentE||dataa?.spentF||dataa?.frequencyA||dataa?.frequencyB||dataa?.frequencyC||dataa?.incomeTypeA||dataa?.incomeTypeB||dataa?.incomeTypeC) {
                
                
                const token = localStorage.getItem('tokenEnCours') //Le token récuperé

                const result = await fetch(`${API_URL}/api/kyc/particular/update-kyc-questionnaires`, {
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
                        if (currentKycStatut==="1") {
                            Router.push("/profil/kyc/entreprise/resultat-kyc"); 
        
                        }else{
                            Router.push("/profil/kyc/entreprise/seconde-phase"); 
                        }
                    }, 5000)
                }
                // Fin condition 
            }else{
                setIsLoggingIn(false);
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    html: `<p> Désolé, vous devez repondre à une question au moins. </p>` ,
                    showConfirmButton: false,
                    timer: 10000
                })
            }
            
            } catch {
            setIsLoggingIn(false);
            }
        
    }, [spentA,spentB,spentC,spentD,spentE,spentF,frequencyA,frequencyB,frequencyC,incomeTypeA,incomeTypeB,incomeTypeC]);
    // Fin

// Les handles de la 2è question
  const handleOptionSpentA = (event) => {
    const value = event.target.value;
    const isChecked = event.target.checked;

    if (isChecked) {
        setSpentA([...spentA, value]);
    } else {
        setSpentA("");
    }
  };

const handleOptionSpentB = (event) => {
    const value = event.target.value;
    const isChecked = event.target.checked;

    if (isChecked) {
        setSpentB([...spentB, value]);
    } else {
        setSpentB("");
    }
};

const handleOptionSpentC = (event) => {
    const value = event.target.value;
    const isChecked = event.target.checked;

    if (isChecked) {
        setSpentC([...spentC, value]);
    } else {
        setSpentC("");
    }
};

const handleOptionSpentD = (event) => {
    const value = event.target.value;
    const isChecked = event.target.checked;

    if (isChecked) {
        setSpentD([...spentD, value]);
    } else {
        setSpentD("");
    }
};

const handleOptionSpentE = (event) => {
    const value = event.target.value;
    const isChecked = event.target.checked;

    if (isChecked) {
        setSpentE([...spentE, value]);
    } else {
        setSpentE("");
    }
};

const handleOptionSpentF = (event) => {
    const value = event.target.value;
    const isChecked = event.target.checked;

    if (isChecked) {
        setSpentF([...spentF, value]);
    } else {
        setSpentF("");
    }
};

// FIN


// Les handles de la 4è question
const handleOptionFrequencyA = (event) => {
    const value = event.target.value;
    const isChecked = event.target.checked;

    if (isChecked) {
        setFrequencyA([...frequencyA, value]);
    } else {
        setFrequencyA("");
    }
};

const handleOptionFrequencyB = (event) => {
    const value = event.target.value;
    const isChecked = event.target.checked;

    if (isChecked) {
        setFrequencyB([...frequencyB, value]);
    } else {
        setFrequencyB("");
    }
};

const handleOptionFrequencyC = (event) => {
    const value = event.target.value;
    const isChecked = event.target.checked;

    if (isChecked) {
        setFrequencyC([...frequencyC, value]);
    } else {
        setFrequencyC("");
    }
};
// FIN
 
// Les handles de la 5è question
const handleOptionIncomeTypeA = (event) => {
    const value = event.target.value;
    const isChecked = event.target.checked;

    if (isChecked) {
        setIncomeTypeA([...incomeTypeA, value]);
    } else {
        setIncomeTypeA("");
    }
};

const handleOptionIncomeTypeB = (event) => {
    const value = event.target.value;
    const isChecked = event.target.checked;

    if (isChecked) {
        setIncomeTypeB([...incomeTypeB, value]);
    } else {
        setIncomeTypeB("");
    }
};

const handleOptionIncomeTypeC = (event) => {
    const value = event.target.value;
    const isChecked = event.target.checked;

    if (isChecked) {
        setIncomeTypeC([...incomeTypeC, value]);
    } else {
        setIncomeTypeC("");
    }
};

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
                        {statusA===0? (
                            <form onSubmit={handleSubmitA} className="my-30">
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
                                        <Link href='/profil/kyc/entreprise/operations-financieres-one/' className="align-right">
                                            <a
                                            className=""
                                            >
                                                <button className="btn btn-primary " type='button'> Précédente </button>
                                            </a>   
                                        </Link>                          
                                    </div>
                                    <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">
                                        <button className="btn btn-primary" type='submit' onClick={()=>setStatusA(1)}  disabled={isLoggingIn}>Suivant</button>
                                    </div>
                                </div>
                            </form> 
                        ):("")} 

                        {/* FORM B */}
                        {statusA===1 && statusB===0 ? (
                            <form onSubmit={handleSubmitB} className="my-30">
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
                                                <option value="NON">Non</option>
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
                                        <Link href='/profil/kyc/entreprise/information-financiere-one/' className="align-right">
                                            <a
                                            className=""
                                            >
                                                <button className="btn btn-primary " type='button'> Suivant </button>
                                            </a>   
                                        </Link>
                                    </div>
                                </div>
                            </form> 
                        ):("")} 


                        
                             
                    </div>
                <div className='col-lg-3 col-md-12'></div>
            </div>
        </div>
    </>
  );
};

export default COrigneFonds;
