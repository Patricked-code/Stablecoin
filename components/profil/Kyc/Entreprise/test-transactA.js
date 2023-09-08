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

const CIformationFinanciereFour = () => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API

    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [messageError, setMessageError] = useState();

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
  
    const handleSubmit = (e) => {
      e.preventDefault();
      // Effectuer des actions avec les données du formulaire
      console.log({
        nationalBankIssued,
        nationalOthersIssued,
        nationalBankReceived,
        nationalOthersReceived,
        cfaUemoaBankIssued,
        cfaUemoaOthersIssued,
        cfaUemoaBankReceived,
        cfaUemoaOthersReceived,
        cfaOutsideUemoaBankIssued,
        cfaOutsideUemoaOthersIssued,
        cfaOutsideUemoaBankReceived,
        cfaOutsideUemoaOthersReceived,
        euroBankIssued,
        euroOthersIssued,
        euroBankReceived,
        euroOthersReceived
      });
    };

    // ***********FIN DE LA BONNE PARTIE*******************

    // LES CHAMPS DE LA TABLE
    

   // La barre de progression de KYC du profil entreprise
   const stepsEntreprise = ["AML","Identité","Représentant", "Bénéficiaire","Control", "Politique", "Opérations", "Fonds", "Financière", "Documents"];

   const activeStepEntreprise = 6;
    // Fin

  return (
    <>
      <ProgressBar className="mb-15" steps={stepsEntreprise} activeStep={activeStepEntreprise} />

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
                <div className='col-lg-3 col-md-12'></div>
                    <div className='m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white cryptocurrency-search-box login-form col-lg-6 col-md-12'>
                        <h4 className='mb-3'>Nombre de Transactions financières mensuelles moyennes</h4>
                        {/* FORM A */}
                        <form onSubmit={handleSubmit}>
                            {/* National */}

                            {/* PARTIE REMISES */}
                            <h5 className='form-control text-center'><b>National</b></h5>
                            <label className=''><b>Emises</b></label><br/>
                            <label>
                                Virement bancaire : <br/>
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
                            </label>

                            <label className="mt-3">
                                Autres transactions (mobile money, remittance , CB) :<br/>
                                <select className='' value={nationalOthersIssued} onChange={handleNationalEmisesAutresChange}>
                                    <option value="">Sélectionner un élément</option>
                                    <option value="0">0</option>
                                    <option value="1&lt;transactions&lt;10">1 &lt; transactions &lt; 10</option>
                                    <option value="10&lt;transactions&lt;50">10 &lt; transactions &lt; 50</option>
                                    <option value="Transactions > 51">Transactions &gt; 51</option>
                                </select>
                            </label><br/>

                            {/* PARTIE RECUES */}
                            <label className='mt-3'><b>Reçues</b></label><br/>
                            <label className="">
                                Virement bancaire :<br/>
                                <select className='' value={nationalBankReceived} onChange={handleNationalRecuesbancaireChange}>
                                <option value="">Sélectionner un élément</option>
                                    <option value="0">0</option>
                                    <option value="1&lt;transactions&lt;10">1 &lt; transactions &lt; 10</option>
                                    <option value="10&lt;transactions&lt;50">10 &lt; transactions &lt; 50</option>
                                    <option value="Transactions > 51">Transactions &gt; 51</option>
                                </select>
                            </label>

                            <label className="mt-3">
                                Autres transactions (mobile money, remittance , CB) : <br/>
                                <select className='' value={nationalOthersReceived} onChange={handleNationalRecuesAutresChange}>
                                    <option value="">Sélectionner un élément</option>
                                    <option value="0">0</option>
                                    <option value="1&lt;transactions&lt;10">1 &lt; transactions &lt; 10</option>
                                    <option value="10&lt;transactions&lt;50">10 &lt; transactions &lt; 50</option>
                                    <option value="Transactions > 51">Transactions &gt; 51</option>
                                </select>
                            </label>
                            {/* FIN PARTIE National */}

                            {/* Zone UEMOA CFA */}
                            {/* PARTIE REMISES */}
                            <h5 className='form-control text-center mt-3'><b>Zone UEMOA CFA</b></h5>

                            <label className=''><b>Emises</b></label><br/>
                            <label>
                                Virement bancaire :<br/>
                                <select className='' value={cfaUemoaBankIssued} onChange={handleCfaUemoaEmisesbancaireChange}>
                                    <option value="">Sélectionner un élément</option>
                                    <option value="0">0</option>
                                    <option value="1&lt;transactions&lt;10">1 &lt; transactions &lt; 10</option>
                                    <option value="10&lt;transactions&lt;50">10 &lt; transactions &lt; 50</option>
                                    <option value="Transactions > 51">Transactions &gt; 51</option>
                                </select>
                            </label>

                            <label className='mt-3'>
                                Autres transactions (mobile money, remittance , CB) : <br/>
                                <select className='' value={cfaUemoaOthersIssued} onChange={handleCfaUemoaEmisesAutresChange}>
                                    <option value="">Sélectionner un élément</option>
                                    <option value="0">0</option>
                                    <option value="1&lt;transactions&lt;10">1 &lt; transactions &lt; 10</option>
                                    <option value="10&lt;transactions&lt;50">10 &lt; transactions &lt; 50</option>
                                    <option value="Transactions > 51">Transactions &gt; 51</option>
                                </select>
                            </label><br/>

                            {/* RECUES */}
                            <label className='mt-3'><b>Reçues</b></label><br/>
                            <label className=''>
                                Virement bancaire :<br/>
                                <select className='' value={cfaUemoaBankReceived} onChange={handleCfaUemoaRecuesbancaireChange}>
                                    <option value="">Sélectionner un élément</option>
                                    <option value="0">0</option>
                                    <option value="1&lt;transactions&lt;10">1 &lt; transactions &lt; 10</option>
                                    <option value="10&lt;transactions&lt;50">10 &lt; transactions &lt; 50</option>
                                    <option value="Transactions > 51">Transactions &gt; 51</option>
                                </select>
                            </label>

                            <label className='mt-3'>
                                Autres transactions (mobile money, remittance , CB) : <br/>
                                <select className='' value={cfaUemoaOthersReceived} onChange={handleCfaUemoaRecuesAutresChange}>
                                    <option value="">Sélectionner un élément</option>
                                    <option value="0">0</option>
                                    <option value="1&lt;transactions&lt;10">1 &lt; transactions &lt; 10</option>
                                    <option value="10&lt;transactions&lt;50">10 &lt; transactions &lt; 50</option>
                                    <option value="Transactions > 51">Transactions &gt; 51</option>
                                </select>
                            </label>
                            {/* FIN PARTIE Zone UEMOA CFA */}

                            {/* Afrique Hors UEMOA */}
                            {/* PARTIE REMISES */}
                            <h5 className='form-control text-center mt-3'><b>Afrique Hors UEMOA </b></h5>

                            <label className=''><b>Emises</b></label><br/>
                            <label>
                                Virement bancaire :<br/>
                                <select className='' value={cfaOutsideUemoaBankIssued} onChange={handleCfaHorsUemoaEmisesbancaireChange}>
                                <option value="">Sélectionner un élément</option>
                                    <option value="0">0</option>
                                    <option value="1&lt;transactions&lt;10">1 &lt; transactions &lt; 10</option>
                                    <option value="10&lt;transactions&lt;50">10 &lt; transactions &lt; 50</option>
                                    <option value="Transactions > 51">Transactions &gt; 51</option>
                                </select>
                            </label>
                            <label className='mt-3'>
                                Autres transactions (mobile money, remittance , CB) : <br/>
                                <select className='' value={cfaOutsideUemoaOthersIssued} onChange={handleCfaHorsUemoaEmisesAutresChange}>
                                    <option value="">Sélectionner un élément</option>
                                    <option value="0">0</option>
                                    <option value="1&lt;transactions&lt;10">1 &lt; transactions &lt; 10</option>
                                    <option value="10&lt;transactions&lt;50">10 &lt; transactions &lt; 50</option>
                                    <option value="Transactions > 51">Transactions &gt; 51</option>
                                </select>
                            </label><br/>

                            {/* RECUES */}
                            <label className='mt-3'><b>Reçues</b></label><br/>
                            <label className=''>
                                Virement bancaire : <br/>
                                <select className='' value={cfaOutsideUemoaBankReceived} onChange={handleCfaHorsUemoaRecuesbancaireChange}>
                                    <option value="">Sélectionner un élément</option>
                                    <option value="0">0</option>
                                    <option value="1&lt;transactions&lt;10">1 &lt; transactions &lt; 10</option>
                                    <option value="10&lt;transactions&lt;50">10 &lt; transactions &lt; 50</option>
                                    <option value="Transactions > 51">Transactions &gt; 51</option>
                                </select>
                            </label>

                            <label className='mt-3'>
                                Autres transactions (mobile money, remittance , CB) :<br/>
                                <select className='' value={cfaOutsideUemoaOthersReceived} onChange={handleCfaHorsUemoaRecuesAutresChange}>
                                    <option value="">Sélectionner un élément</option>
                                    <option value="0">0</option>
                                    <option value="1&lt;transactions&lt;10">1 &lt; transactions &lt; 10</option>
                                    <option value="10&lt;transactions&lt;50">10 &lt; transactions &lt; 50</option>
                                    <option value="Transactions > 51">Transactions &gt; 51</option>
                                </select>
                            </label>
                            {/* FIN PARTIE Afrique Hors UEMOA */}

                            {/* En euros ou dans la zone EURO */}
                            {/* PARTIE REMISES */}
                            <h5 className='form-control text-center mt-3'><b>En euros ou dans la zone EURO</b></h5>

                            <label className=''><b>Emises</b></label><br/>
                            <label>
                                Virement bancaire :<br/>
                                <select className='' value={euroBankIssued} onChange={handleEuroEmisesbancaireChange}>
                                    <option value="">Sélectionner un élément</option>
                                    <option value="0">0</option>
                                    <option value="1&lt;transactions&lt;10">1 &lt; transactions &lt; 10</option>
                                    <option value="10&lt;transactions&lt;50">10 &lt; transactions &lt; 50</option>
                                    <option value="Transactions > 51">Transactions &gt; 51</option>
                                </select>
                            </label>

                            <label className='mt-3'>
                                Autres transactions (mobile money, remittance , CB) :<br/>
                                <select className='' value={euroOthersIssued} onChange={handleEuroEmisesAutresChange}>
                                    <option value="">Sélectionner un élément</option>
                                    <option value="0">0</option>
                                    <option value="1&lt;transactions&lt;10">1 &lt; transactions &lt; 10</option>
                                    <option value="10&lt;transactions&lt;50">10 &lt; transactions &lt; 50</option>
                                    <option value="Transactions > 51">Transactions &gt; 51</option>
                                </select>
                            </label><br/>

                            {/* PARTIE RECUES */}
                            <label className='mt-3'><b>Reçues</b></label><br/>
                            <label className=''>
                                Virement bancaire :<br/>
                                <select className='' value={euroBankReceived} onChange={handleEuroRecuesbancaireChange}>
                                    <option value="">Sélectionner un élément</option>
                                    <option value="0">0</option>
                                    <option value="1&lt;transactions&lt;10">1 &lt; transactions &lt; 10</option>
                                    <option value="10&lt;transactions&lt;50">10 &lt; transactions &lt; 50</option>
                                    <option value="Transactions > 51">Transactions &gt; 51</option>
                                </select>
                            </label>

                            <label className='mt-3'>
                                Autres transactions (mobile money, remittance , CB) : <br/>
                                <select className='' value={euroOthersReceived} onChange={handleEuroRecuesAutresChange}>
                                    <option value="">Sélectionner un élément</option>
                                    <option value="0">0</option>
                                    <option value="1&lt;transactions&lt;10">1 &lt; transactions &lt; 10</option>
                                    <option value="10&lt;transactions&lt;50">10 &lt; transactions &lt; 50</option>
                                    <option value="Transactions > 51">Transactions &gt; 51</option>
                                </select>
                            </label>
                            {/* FIN PARTIE M3 */}

                             {/* PARTIE N4 */}
                            <h5 className='form-control text-center mt-3'><b>En dollars US</b></h5>

                            <label className=''><b>Emises</b></label><br/>
                            <label className="">
                            Virement bancaire :<br/>
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
                            </label>

                            <label className="mt-3">
                            Autres transactions (mobile money, remittance , CB) :<br/>
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
                            </label><br/>

                            <label className='mt-3'><b>Reçues</b></label><br/>
                            <label className="">
                            Virement bancaire :<br/>
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
                            </label>

                            <label className="mt-3">
                            Autres transactions (mobile money, remittance , CB) :<br/>
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
                            </label>

                            <h5 className='form-control text-center mt-3'><b>Autre devises</b></h5>

                            <label className=''><b>Emises</b></label><br/>
                            <label className="">
                            Virement bancaire :<br/>
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
                            </label>

                            <label className="mt-3">
                            Autres transactions (mobile money, remittance , CB) :<br/>
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
                            </label><br/>

                            <label className='mt-3'><b>Reçues</b></label><br/>
                            <label className="">
                            Virement bancaire :<br/>
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
                            </label>

                            <label className="mt-3">
                            Autres transactions (mobile money, remittance , CB) : <br/>
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
                            </label>

                            {/* ... */}



                            {/* <button type="submit">Soumettre</button> */}

                            <div className="form-group mb-6 mt-3 col-lg-12 col-md-12  row justify-content-between">
                                    <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">
                                      <Link href='/profil/kyc/entreprise/information-financiere-three/' className="align-right">
                                            <a
                                            className=""
                                            >
                                                <button className="btn btn-primary " type='button'> Précédente </button>
                                            </a>   
                                      </Link>
                                    </div>
                                    <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">
                                        <Link href='/profil/kyc/entreprise/information-financiere-five/' className="align-right">
                                            <a
                                            className=""
                                            >
                                                <button className="btn btn-primary " type='button'> Suivant </button>
                                            </a>   
                                        </Link>
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

export default CIformationFinanciereFour;
