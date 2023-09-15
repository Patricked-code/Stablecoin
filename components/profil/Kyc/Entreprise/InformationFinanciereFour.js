import { useCallback, useState, useEffect,useRef } from 'react';
import React from "react";
import Link from 'next/link';
import { Table } from '@nextui-org/react';



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

const CIformationFinanciereFour = () => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API

    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [messageError, setMessageError] = useState();
    const [currentKycStatut, setCurrentKycStatut] = useState();
    const [kycTransactionMontlyId, setKycTransactionMontlyId] = useState();
    
    
    
    // ***********LA BONNE PARTIE ***********************

// *******************ANGLAIS*****
const [nationalBankIssued, setNationalBankIssued] = useState('');
const [nationalOthersIssued, setNationalOthersIssued] = useState('');
const [nationalBankReceived, setNationalBankReceived] = useState('');
const [nationalOthersReceived, setNationalOthersReceived] = useState('');

const [cfaUemoaBankIssued, setCfaUemoaBankIssued] = useState('');
const [cfaUemoaOthersIssued, setCfaUemoaOthersIssued] = useState('');
const [cfaUemoaBankReceived, setCfaUemoaBankReceived] = useState('');
const [cfaUemoaOthersReceived, setCfaUemoaOthersReceived] = useState('');

const [cfaOutsideUemoaBankIssued, setCfaOutsideUemoaBankIssued] = useState('');
const [cfaOutsideUemoaOthersIssued, setCfaOutsideUemoaOthersIssued] = useState('');
const [cfaOutsideUemoaBankReceived, setCfaOutsideUemoaBankReceived] = useState('');
const [cfaOutsideUemoaOthersReceived, setCfaOutsideUemoaOthersReceived] = useState('');

const [euroBankIssued, setEuroBankIssued] = useState('');
const [euroOthersIssued, setEuroOthersIssued] = useState('');
const [euroBankReceived, setEuroBankReceived] = useState('');
const [euroOthersReceived, setEuroOthersReceived] = useState('');

const [dollarBankIssued, setDollarBankIssued] = useState('');
const [dollarOthersIssued, setDollarOthersIssued] = useState('');
const [dollarBankReceived, setDollarBankReceived] = useState('');
const [dollarOthersReceived, setDollarOthersReceived] = useState('');

const [otherCurrencyBankIssued, setOtherCurrencyBankIssued] = useState('');
const [otherCurrencyOthersIssued, setOtherCurrencyOthersIssued] = useState('');
const [otherCurrencyBankReceived, setOtherCurrencyBankReceived] = useState('');
const [otherCurrencyOthersReceived, setOtherCurrencyOthersReceived] = useState('');
// *******FIN***********


  
    
  
    const handleNationalEmisesbancaireChange = (e) => {
      setNationalBankIssued(e.target.value);
    };
  
    const handleNationalEmisesAutresChange = (e) => {
      setNationalOthersIssued(e.target.value);
    };
  
    const handleNationalRecuesbancaireChange = (e) => {
      setNationalBankReceived(e.target.value);
    };
  
    const handleNationalRecuesAutresChange = (e) => {
      setNationalOthersReceived(e.target.value);
    };
  
    const handleCfaUemoaEmisesbancaireChange = (e) => {
      setCfaUemoaBankIssued(e.target.value);
    };
  
    const handleCfaUemoaEmisesAutresChange = (e) => {
      setCfaUemoaOthersIssued(e.target.value);
    };
  
    const handleCfaUemoaRecuesbancaireChange = (e) => {
      setCfaUemoaBankReceived(e.target.value);
    };
  
    const handleCfaUemoaRecuesAutresChange = (e) => {
      setCfaUemoaOthersReceived(e.target.value);
    };
  
    const handleCfaHorsUemoaEmisesbancaireChange = (e) => {
      setCfaOutsideUemoaBankIssued(e.target.value);
    };
  
    const handleCfaHorsUemoaEmisesAutresChange = (e) => {
      setCfaOutsideUemoaOthersIssued(e.target.value);
    };
  
    const handleCfaHorsUemoaRecuesbancaireChange = (e) => {
      setCfaOutsideUemoaBankReceived(e.target.value);
    };
  
    const handleCfaHorsUemoaRecuesAutresChange = (e) => {
      setCfaOutsideUemoaOthersReceived(e.target.value);
    };
  
    const handleEuroEmisesbancaireChange = (e) => {
      setEuroBankIssued(e.target.value);
    };
  
    const handleEuroEmisesAutresChange = (e) => {
      setEuroOthersIssued(e.target.value);
    };
  
    const handleEuroRecuesbancaireChange = (e) => {
      setEuroBankReceived(e.target.value);
    };
  
    const handleEuroRecuesAutresChange = (e) => {
      setEuroOthersReceived(e.target.value);
    };

    const handleDollarEmisesbancaireChange = (e) => {
        setDollarBankIssued(e.target.value);
      };
    
      const handleDollarEmisesAutresChange = (e) => {
        setDollarOthersIssued(e.target.value);
      };
    
      const handleDollarRecuesbancaireChange = (e) => {
        setDollarBankReceived(e.target.value);
      };
    
      const handleDollarRecuesAutresChange = (e) => {
        setDollarOthersReceived(e.target.value);
      };
    
      const handleAutreDvseEmisesbancaireChange = (e) => {
        setOtherCurrencyBankIssued(e.target.value);
      };
    
      const handleAutreDvseEmisesAutresChange = (e) => {
        setOtherCurrencyOthersIssued(e.target.value);
      };
    
      const handleAutreDvseRecuesbancaireChange = (e) => {
        setOtherCurrencyBankReceived(e.target.value);
        
      };

      const handleAutreDvseRecuesAutresChange = (e) => {
        setOtherCurrencyOthersReceived(e.target.value);
      };
    // ***********FIN DE LA BONNE PARTIE*******************

    // ENVOIES DES DONNEES DES TRANSACTIONS FINANCIERES (MENSUELLE) 
    const addFinancialTransactionMontly = async (e) => {
        e.preventDefault();
        setIsLoggingIn(true);
  
        // Combiner les données du formulaire de différentes sections
        
        try {
            // Prepare data
            const dataa = {
                period: "Mensuelle",
                periodMonthly:true,
                nationalBankIssued: nationalBankIssued,
                nationalOthersIssued: nationalOthersIssued,
                nationalBankReceived: nationalBankReceived,
                nationalOthersReceived: nationalOthersReceived,
                cfaUemoaBankIssued: cfaUemoaBankIssued,
                cfaUemoaOthersIssued: cfaUemoaOthersIssued,
                cfaUemoaBankReceived: cfaUemoaBankReceived,
                cfaUemoaOthersReceived: cfaUemoaOthersReceived,
                cfaOutsideUemoaBankIssued: cfaOutsideUemoaBankIssued,
                cfaOutsideUemoaOthersIssued: cfaOutsideUemoaOthersIssued,
                cfaOutsideUemoaBankReceived: cfaOutsideUemoaBankReceived,
                cfaOutsideUemoaOthersReceived: cfaOutsideUemoaOthersReceived,
                euroBankIssued: euroBankIssued,
                euroOthersIssued: euroOthersIssued,
                euroBankReceived: euroBankReceived,
                euroOthersReceived: euroOthersReceived,
                dollarBankIssued: dollarBankIssued,
                dollarOthersIssued: dollarOthersIssued,
                dollarBankReceived: dollarBankReceived,
                dollarOthersReceived: dollarOthersReceived,
                otherCurrencyBankIssued: otherCurrencyBankIssued,
                otherCurrencyOthersIssued: otherCurrencyOthersIssued,
                otherCurrencyBankReceived: otherCurrencyBankReceived,
                otherCurrencyOthersReceived: otherCurrencyOthersReceived,
                
            };
            
            
            const token = localStorage.getItem('tokenEnCours') //Le token récuperé
  
            // Envoyer une requête POST en utilisant fetch
            const response = await fetch(`${API_URL}/api/kyc/business/add-kyc-financial-transaction`, {
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
                        Router.push("/profil/kyc/entreprise/information-financiere-five"); 
                    }
                }, 5000)
            }
            // Fin condition 
                    
        } catch (error) {
            setIsLoggingIn(false);
        }
      };
      // FIN

    // ENVOIES (Modification) DES DONNEES DES TRANSACTIONS FINANCIERES (MENSUELLE) 
    const updateFinancialTransactionMontly = async (e) => {
        e.preventDefault();
        setIsLoggingIn(true);
  
        // Combiner les données du formulaire de différentes sections
        
        try {
            // Prepare data
            const dataa = {
                period: "Mensuelle",
                periodMonthly:true,
                nationalBankIssued: nationalBankIssued,
                nationalOthersIssued: nationalOthersIssued,
                nationalBankReceived: nationalBankReceived,
                nationalOthersReceived: nationalOthersReceived,
                cfaUemoaBankIssued: cfaUemoaBankIssued,
                cfaUemoaOthersIssued: cfaUemoaOthersIssued,
                cfaUemoaBankReceived: cfaUemoaBankReceived,
                cfaUemoaOthersReceived: cfaUemoaOthersReceived,
                cfaOutsideUemoaBankIssued: cfaOutsideUemoaBankIssued,
                cfaOutsideUemoaOthersIssued: cfaOutsideUemoaOthersIssued,
                cfaOutsideUemoaBankReceived: cfaOutsideUemoaBankReceived,
                cfaOutsideUemoaOthersReceived: cfaOutsideUemoaOthersReceived,
                euroBankIssued: euroBankIssued,
                euroOthersIssued: euroOthersIssued,
                euroBankReceived: euroBankReceived,
                euroOthersReceived: euroOthersReceived,
                dollarBankIssued: dollarBankIssued,
                dollarOthersIssued: dollarOthersIssued,
                dollarBankReceived: dollarBankReceived,
                dollarOthersReceived: dollarOthersReceived,
                otherCurrencyBankIssued: otherCurrencyBankIssued,
                otherCurrencyOthersIssued: otherCurrencyOthersIssued,
                otherCurrencyBankReceived: otherCurrencyBankReceived,
                otherCurrencyOthersReceived: otherCurrencyOthersReceived,
                
            };
            
            
            const token = localStorage.getItem('tokenEnCours') //Le token récuperé
  
            // Envoyer une requête POST en utilisant fetch
            const response = await fetch(`${API_URL}/api/kyc/business/update-kyc-financial-transaction/${kycTransactionMontlyId}`, {
                method: 'PUT',
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
                        Router.push("/profil/kyc/entreprise/information-financiere-five"); 
                    }
                }, 5000)
            }
            // Fin condition 
                    
        } catch (error) {
            setIsLoggingIn(false);
        }
    };
      // FIN



       // RECUPERER LES DONNEES DU KYC DE FINANCEMENT TRANSACTION (MENSUELLE) DE L'ENTREPRISE CONNECTEE 
        useEffect(async() => {
            const token = localStorage.getItem('tokenEnCours')
            
                const getKycTransactionMontly = async () => {
                const resKyc = await fetch(`${API_URL}/api/kyc/business/find-kyc-business-transaction-monthly-of-user-signIn`, {
                    headers: {
                    'Content-Type': 'application/json',
                    Authorization:  `Bearer ${token}`,
                    },
                })
                    .then((resKyc) => resKyc.json())
                    .then((data) => {
                    setKycTransactionMontlyId(data?.id)

                    }) 
                };
                await getKycTransactionMontly();
        }, []);
        // FIN


   // La barre de progression de KYC du profil entreprise
   const stepsEntreprise = ["AML","Identité","Représentant", "Bénéficiaire","Control", "Politique", "Opérations", "Fonds", "Financière", "Documents"];

   const activeStepEntreprise = 7;
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
                    <br/><br/><h1 className='text-center '>Autre information financière et transactions 4</h1>
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
                    <div className='m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white cryptocurrency-search-box login-form col-lg-12 col-md-12'>
                        <h4 className='mb-3'>Nombre de transactions financières mensuelles moyennes</h4>
                        {/* FORM A */}
                        <form onSubmit={kycTransactionMontlyId?updateFinancialTransactionMontly:addFinancialTransactionMontly}>
                          <Table
                              aria-label="Example table with static content"
                              css={{
                                  height: "auto",
                                  minWidth: "100%",
                              }}
                          >
                            
                            <Table.Header>
                                <Table.Column><p className="gr-text-8 pt-3 pb-0 px-2 ">Zone</p></Table.Column>
                                <Table.Column><p className="gr-text-8 pt-3 pb-0 "><b className='colorRed'>EMISES</b><br/> Virement bancaire </p></Table.Column>
                                <Table.Column><p className="gr-text-8 pt-3 pb-0 "><b className='colorRed'>EMISES</b><br/> Autres Transactions </p></Table.Column>
                                <Table.Column><p className="gr-text-8 pt-3 pb-0 "><b className='colorRed'>RECUES</b><br/> Virement bancaire </p></Table.Column>
                                <Table.Column><p className="gr-text-8 pt-3 pb-0 "><b className='colorRed'>RECUES</b><br/> Autres Transactions </p></Table.Column>
                            </Table.Header>
                              <Table.Body>
                                      {/* National */}
                                      <Table.Row >  
                                          {/* Emise */}
                                          <Table.Cell ><p className=" py-0 "> National </p></Table.Cell>
                                          <Table.Cell >
                                            <p className=" py-0 ">
                                                <select 
                                                    className=''
                                                    value={nationalBankIssued} 
                                                    onChange={handleNationalEmisesbancaireChange}
                                                >
                                                    <option value="">Sélectionnez un élément</option>
                                                    <option value="0">0</option>
                                                    <option value="1&lt;transactions&lt;10">1 &lt; transactions &lt; 10</option>
                                                    <option value="10&lt;transactions&lt;50">10 &lt; transactions &lt; 50</option>
                                                    <option value="Transactions > 51">Transactions &gt; 51</option>
                                                </select>
                                            </p>
                                          </Table.Cell>
                                          <Table.Cell >
                                            <p className=" py-0 ">
                                                <select className='' value={nationalOthersIssued} onChange={handleNationalEmisesAutresChange}>
                                                    <option value="">Sélectionner un élément</option>
                                                    <option value="0">0</option>
                                                    <option value="1&lt;transactions&lt;10">1 &lt; transactions &lt; 10</option>
                                                    <option value="10&lt;transactions&lt;50">10 &lt; transactions &lt; 50</option>
                                                    <option value="Transactions > 51">Transactions &gt; 51</option>
                                                </select>
                                            </p>
                                          </Table.Cell>
                                          {/* Emise */}
                                          <Table.Cell >
                                            <p className=" py-0 ">
                                                <select className='' value={nationalBankReceived} onChange={handleNationalRecuesbancaireChange}>
                                                    <option value="">Sélectionner un élément</option>
                                                    <option value="0">0</option>
                                                    <option value="1&lt;transactions&lt;10">1 &lt; transactions &lt; 10</option>
                                                    <option value="10&lt;transactions&lt;50">10 &lt; transactions &lt; 50</option>
                                                    <option value="Transactions > 51">Transactions &gt; 51</option>
                                                </select>
                                            </p>
                                          </Table.Cell>
                                          <Table.Cell >
                                            <p className=" py-0 ">
                                                <select className='' value={nationalOthersReceived} onChange={handleNationalRecuesAutresChange}>
                                                    <option value="">Sélectionner un élément</option>
                                                    <option value="0">0</option>
                                                    <option value="1&lt;transactions&lt;10">1 &lt; transactions &lt; 10</option>
                                                    <option value="10&lt;transactions&lt;50">10 &lt; transactions &lt; 50</option>
                                                    <option value="Transactions > 51">Transactions &gt; 51</option>
                                                </select>
                                            </p>
                                          </Table.Cell>
                                      </Table.Row >

                                      {/* Zone UEMOA CFA */}
                                      <Table.Row >                       
                                          <Table.Cell ><p className=" py-0 ">Zone UEMOA CFA</p></Table.Cell>
                                          {/* EMISES */}
                                          <Table.Cell >
                                            <p className=" py-0 ">
                                                <select className='' value={cfaUemoaBankIssued} onChange={handleCfaUemoaEmisesbancaireChange}>
                                                    <option value="">Sélectionner un élément</option>
                                                    <option value="0">0</option>
                                                    <option value="1&lt;transactions&lt;10">1 &lt; transactions &lt; 10</option>
                                                    <option value="10&lt;transactions&lt;50">10 &lt; transactions &lt; 50</option>
                                                    <option value="Transactions > 51">Transactions &gt; 51</option>
                                                </select>
                                            </p>
                                          </Table.Cell>
                                          <Table.Cell >
                                            <p className=" py-0 ">
                                                <select className='' value={cfaUemoaOthersIssued} onChange={handleCfaUemoaEmisesAutresChange}>
                                                    <option value="">Sélectionner un élément</option>
                                                    <option value="0">0</option>
                                                    <option value="1&lt;transactions&lt;10">1 &lt; transactions &lt; 10</option>
                                                    <option value="10&lt;transactions&lt;50">10 &lt; transactions &lt; 50</option>
                                                    <option value="Transactions > 51">Transactions &gt; 51</option>
                                                </select>
                                            </p>
                                          </Table.Cell>

                                          {/* RECU */}
                                          <Table.Cell >
                                            <p className=" py-0 ">
                                                <select className='' value={cfaUemoaBankReceived} onChange={handleCfaUemoaRecuesbancaireChange}>
                                                    <option value="">Sélectionner un élément</option>
                                                    <option value="0">0</option>
                                                    <option value="1&lt;transactions&lt;10">1 &lt; transactions &lt; 10</option>
                                                    <option value="10&lt;transactions&lt;50">10 &lt; transactions &lt; 50</option>
                                                    <option value="Transactions > 51">Transactions &gt; 51</option>
                                                </select>
                                            </p>
                                          </Table.Cell>
                                          <Table.Cell >
                                            <p className=" py-0 ">
                                                <select className='' value={cfaUemoaOthersReceived} onChange={handleCfaUemoaRecuesAutresChange}>
                                                    <option value="">Sélectionner un élément</option>
                                                    <option value="0">0</option>
                                                    <option value="1&lt;transactions&lt;10">1 &lt; transactions &lt; 10</option>
                                                    <option value="10&lt;transactions&lt;50">10 &lt; transactions &lt; 50</option>
                                                    <option value="Transactions > 51">Transactions &gt; 51</option>
                                                </select>
                                            </p>
                                          </Table.Cell>
                                      </Table.Row >

                                      {/* Afrique Hors UEMOA */}
                                      <Table.Row >                       
                                          <Table.Cell ><p className=" py-0 ">Afrique Hors UEMOA </p></Table.Cell>
                                          {/* EMISE */}
                                          <Table.Cell >
                                            <p className=" py-0 ">
                                                <select className='' value={cfaOutsideUemoaBankIssued} onChange={handleCfaHorsUemoaEmisesbancaireChange}>
                                                    <option value="">Sélectionner un élément</option>
                                                    <option value="0">0</option>
                                                    <option value="1&lt;transactions&lt;10">1 &lt; transactions &lt; 10</option>
                                                    <option value="10&lt;transactions&lt;50">10 &lt; transactions &lt; 50</option>
                                                    <option value="Transactions > 51">Transactions &gt; 51</option>
                                                </select>
                                            </p>
                                          </Table.Cell>
                                          <Table.Cell >
                                            <p className=" py-0 ">
                                                <select className='' value={cfaOutsideUemoaOthersIssued} onChange={handleCfaHorsUemoaEmisesAutresChange}>
                                                    <option value="">Sélectionner un élément</option>
                                                    <option value="0">0</option>
                                                    <option value="1&lt;transactions&lt;10">1 &lt; transactions &lt; 10</option>
                                                    <option value="10&lt;transactions&lt;50">10 &lt; transactions &lt; 50</option>
                                                    <option value="Transactions > 51">Transactions &gt; 51</option>
                                                </select>
                                            </p>
                                          </Table.Cell>
                                          {/* RECUES */}
                                          <Table.Cell >
                                            <p className=" py-0 ">
                                                <select className='' value={cfaOutsideUemoaBankReceived} onChange={handleCfaHorsUemoaRecuesbancaireChange}>
                                                    <option value="">Sélectionner un élément</option>
                                                    <option value="0">0</option>
                                                    <option value="1&lt;transactions&lt;10">1 &lt; transactions &lt; 10</option>
                                                    <option value="10&lt;transactions&lt;50">10 &lt; transactions &lt; 50</option>
                                                    <option value="Transactions > 51">Transactions &gt; 51</option>
                                                </select>
                                            </p>
                                          </Table.Cell>
                                          <Table.Cell >
                                            <p className=" py-0 ">
                                                <select className='' value={cfaOutsideUemoaOthersReceived} onChange={handleCfaHorsUemoaRecuesAutresChange}>
                                                    <option value="">Sélectionner un élément</option>
                                                    <option value="0">0</option>
                                                    <option value="1&lt;transactions&lt;10">1 &lt; transactions &lt; 10</option>
                                                    <option value="10&lt;transactions&lt;50">10 &lt; transactions &lt; 50</option>
                                                    <option value="Transactions > 51">Transactions &gt; 51</option>
                                                </select>
                                            </p>
                                          </Table.Cell>
                                      </Table.Row >

                                      {/* En euros ou dans la zone EURO  */}
                                      <Table.Row >                       
                                          <Table.Cell ><p className=" py-0 ">En euros ou dans la zone EURO </p></Table.Cell>
                                          {/* EMISE */}
                                          <Table.Cell >
                                            <p className=" py-0 ">
                                                <select className='' value={euroBankIssued} onChange={handleEuroEmisesbancaireChange}>
                                                    <option value="">Sélectionner un élément</option>
                                                    <option value="0">0</option>
                                                    <option value="1&lt;transactions&lt;10">1 &lt; transactions &lt; 10</option>
                                                    <option value="10&lt;transactions&lt;50">10 &lt; transactions &lt; 50</option>
                                                    <option value="Transactions > 51">Transactions &gt; 51</option>
                                                </select>
                                            </p>
                                            </Table.Cell>
                                          <Table.Cell >
                                            <p className=" py-0 ">
                                                <select className='' value={euroOthersIssued} onChange={handleEuroEmisesAutresChange}>
                                                    <option value="">Sélectionner un élément</option>
                                                    <option value="0">0</option>
                                                    <option value="1&lt;transactions&lt;10">1 &lt; transactions &lt; 10</option>
                                                    <option value="10&lt;transactions&lt;50">10 &lt; transactions &lt; 50</option>
                                                    <option value="Transactions > 51">Transactions &gt; 51</option>
                                                </select>
                                            </p>
                                          </Table.Cell>
                                          {/* RECUES */}
                                          <Table.Cell >
                                            <p className=" py-0 ">
                                                <select className='' value={euroBankReceived} onChange={handleEuroRecuesbancaireChange}>
                                                    <option value="">Sélectionner un élément</option>
                                                    <option value="0">0</option>
                                                    <option value="1&lt;transactions&lt;10">1 &lt; transactions &lt; 10</option>
                                                    <option value="10&lt;transactions&lt;50">10 &lt; transactions &lt; 50</option>
                                                    <option value="Transactions > 51">Transactions &gt; 51</option>
                                                </select>
                                            </p>
                                          </Table.Cell>
                                          <Table.Cell >
                                            <p className=" py-0 ">
                                                <select className='' value={euroOthersReceived} onChange={handleEuroRecuesAutresChange}>
                                                    <option value="">Sélectionner un élément</option>
                                                    <option value="0">0</option>
                                                    <option value="1&lt;transactions&lt;10">1 &lt; transactions &lt; 10</option>
                                                    <option value="10&lt;transactions&lt;50">10 &lt; transactions &lt; 50</option>
                                                    <option value="Transactions > 51">Transactions &gt; 51</option>
                                                </select>
                                            </p>
                                          </Table.Cell>
                                      </Table.Row >

                                      {/* En dollars US */}
                                      <Table.Row >                       
                                          <Table.Cell ><p className=" py-0 ">En dollars US </p></Table.Cell>
                                          {/* EMISE */}
                                          <Table.Cell >
                                            <p className=" py-0 ">
                                                <select
                                                    className=''
                                                    value={dollarBankIssued}
                                                    onChange={handleDollarEmisesbancaireChange}
                                                >
                                                    <option value="">Sélectionner un élément</option>
                                                    <option value="0">0</option>
                                                    <option value="1&lt;transactions&lt;10">1 &lt; transactions &lt; 10</option>
                                                    <option value="10&lt;transactions&lt;50">10 &lt; transactions &lt; 50</option>
                                                    <option value="Transactions > 51">Transactions &gt; 51</option>
                                                </select>
                                            </p>
                                            </Table.Cell>
                                          <Table.Cell >
                                            <p className=" py-0 ">
                                                <select
                                                    className=''
                                                    value={dollarOthersIssued}
                                                    onChange={handleDollarEmisesAutresChange}
                                                >
                                                    <option value="">Sélectionner un élément</option>
                                                    <option value="0">0</option>
                                                    <option value="1&lt;transactions&lt;10">1 &lt; transactions &lt; 10</option>
                                                    <option value="10&lt;transactions&lt;50">10 &lt; transactions &lt; 50</option>
                                                    <option value="Transactions > 51">Transactions &gt; 51</option>
                                                </select>
                                            </p>
                                          </Table.Cell>
                                          {/* RECUES */}
                                          <Table.Cell >
                                            <p className=" py-0 ">
                                                <select
                                                    className=''
                                                    value={dollarBankReceived}
                                                    onChange={handleDollarRecuesbancaireChange}
                                                >
                                                    <option value="">Sélectionner un élément</option>
                                                    <option value="0">0</option>
                                                    <option value="1&lt;transactions&lt;10">1 &lt; transactions &lt; 10</option>
                                                    <option value="10&lt;transactions&lt;50">10 &lt; transactions &lt; 50</option>
                                                    <option value="Transactions > 51">Transactions &gt; 51</option>
                                                </select>
                                            </p>
                                          </Table.Cell>
                                          <Table.Cell >
                                            <p className=" py-0 ">
                                                <select
                                                    className=''
                                                    value={dollarOthersReceived}
                                                    onChange={handleDollarRecuesAutresChange}
                                                >
                                                    <option value="">Sélectionner un élément</option>
                                                    <option value="0">0</option>
                                                    <option value="1&lt;transactions&lt;10">1 &lt; transactions &lt; 10</option>
                                                    <option value="10&lt;transactions&lt;50">10 &lt; transactions &lt; 50</option>
                                                    <option value="Transactions > 51">Transactions &gt; 51</option>
                                                </select>
                                            </p>
                                          </Table.Cell>
                                      </Table.Row >

                                      {/* Autre devises */}
                                      <Table.Row >                       
                                          <Table.Cell ><p className=" py-0 ">Autre devises </p></Table.Cell>
                                          {/* EMISE */}
                                          <Table.Cell >
                                            <p className=" py-0 ">
                                                <select
                                                    className=''
                                                    value={otherCurrencyBankIssued}
                                                    onChange={handleAutreDvseEmisesbancaireChange}
                                                >
                                                    <option value="">Sélectionner un élément</option>
                                                    <option value="0">0</option>
                                                    <option value="1&lt;transactions&lt;10">1 &lt; transactions &lt; 10</option>
                                                    <option value="10&lt;transactions&lt;50">10 &lt; transactions &lt; 50</option>
                                                    <option value="Transactions > 51">Transactions &gt; 51</option>
                                                </select>
                                            </p>
                                            </Table.Cell>
                                          <Table.Cell >
                                            <p className=" py-0 ">
                                                <select
                                                    className=''
                                                    value={otherCurrencyOthersIssued}
                                                    onChange={handleAutreDvseEmisesAutresChange}
                                                >
                                                    <option value="">Sélectionner un élément</option>
                                                    <option value="0">0</option>
                                                    <option value="1&lt;transactions&lt;10">1 &lt; transactions &lt; 10</option>
                                                    <option value="10&lt;transactions&lt;50">10 &lt; transactions &lt; 50</option>
                                                    <option value="Transactions > 51">Transactions &gt; 51</option>
                                                </select>
                                            </p>
                                          </Table.Cell>
                                          {/* RECUES */}
                                          <Table.Cell >
                                            <p className=" py-0 ">
                                                <select
                                                    className=''
                                                    value={otherCurrencyBankReceived}
                                                    onChange={handleAutreDvseRecuesbancaireChange}
                                                >
                                                    <option value="">Sélectionner un élément</option>
                                                    <option value="0">0</option>
                                                    <option value="1&lt;transactions&lt;10">1 &lt; transactions &lt; 10</option>
                                                    <option value="10&lt;transactions&lt;50">10 &lt; transactions &lt; 50</option>
                                                    <option value="Transactions > 51">Transactions &gt; 51</option>
                                                </select>
                                            </p>
                                          </Table.Cell>
                                          <Table.Cell >
                                            <p className=" py-0 ">
                                                <select
                                                    className=''
                                                    value={otherCurrencyOthersReceived}
                                                    onChange={handleAutreDvseRecuesAutresChange}
                                                >
                                                    <option value="">Sélectionner un élément</option>
                                                    <option value="0">0</option>
                                                    <option value="1&lt;transactions&lt;10">1 &lt; transactions &lt; 10</option>
                                                    <option value="10&lt;transactions&lt;50">10 &lt; transactions &lt; 50</option>
                                                    <option value="Transactions > 51">Transactions &gt; 51</option>
                                                </select>
                                            </p>
                                          </Table.Cell>
                                      </Table.Row >

                                      
                                                          
                                      
                              </Table.Body>
                          </Table>

                          <div className="form-group mb-6 mt-3 col-lg-12 col-md-12  row justify-content-between">
                                    <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">
                                      <Link href='/profil/kyc/entreprise/information-financiere-three' className="align-right">
                                            <a
                                            className=""
                                            >
                                                <button className="btn btn-primary " type='button'> Précédente</button>
                                            </a>   
                                      </Link>
                                    </div>
                                    <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">
                                      <button className="btn btn-primary" type='submit' disabled={isLoggingIn}> Suivant </button>
                                    </div>
                                    
                              </div>
                        </form>
                        
                             
                    </div>
            </div>
        </div>
    </>
  );
};

export default CIformationFinanciereFour;
