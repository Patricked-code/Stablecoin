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
    // const [nationalEmisesbancaire, setNationalEmisesbancaire] = useState('');
    // const [nationalEmisesAutres, setNationalEmisesAutres] = useState('');
    // const [nationalRecuesbancaire, setNationalRecuesbancaire] = useState('');
    // const [nationalRecuesAutres, setNationalRecuesAutres] = useState('');

    const [nationalEmisesbancaire, setNationalEmisesbancaire] = useState('');
    const [nationalEmisesAutres, setNationalEmisesAutres] = useState('');
    const [nationalRecuesbancaire, setNationalRecuesbancaire] = useState('');
    const [nationalRecuesAutres, setNationalRecuesAutres] = useState('');

    
  
    // const [cfaUemoaEmisesbancaire, setCfaUemoaEmisesbancaire] = useState('');
    // const [cfaUemoaEmisesAutres, setCfaUemoaEmisesAutres] = useState('');
    // const [cfaUemoaRecuesbancaire, setCfaUemoaRecuesbancaire] = useState('');
    // const [cfaUemoaRecuesAutres, setCfaUemoaRecuesAutres] = useState('');
    
    const [cfaUemoaEmisesbancaire, setCfaUemoaEmisesbancaire] = useState('');
    const [cfaUemoaEmisesAutres, setCfaUemoaEmisesAutres] = useState('');
    const [cfaUemoaRecuesbancaire, setCfaUemoaRecuesbancaire] = useState('');
    const [cfaUemoaRecuesAutres, setCfaUemoaRecuesAutres] = useState('');

    // const [cfaHorsUemoaEmisesbancaire, setCfaHorsUemoaEmisesbancaire] = useState('');
    // const [cfaHorsUemoaEmisesAutres, setCfaHorsUemoaEmisesAutres] = useState('');
    // const [cfaRecuesbancaire, setCfaHorsUemoaRecuesbancaire] = useState('');
    // const [cfaHorsUemoaRecuesAutres, setCfaHorsUemoaRecuesAutres] = useState('');

    const [cfaHorsUemoaEmisesbancaire, setCfaHorsUemoaEmisesbancaire] = useState('');
    const [cfaHorsUemoaEmisesAutres, setCfaHorsUemoaEmisesAutres] = useState('');
    const [cfaRecuesbancaire, setCfaHorsUemoaRecuesbancaire] = useState('');
    const [cfaHorsUemoaRecuesAutres, setCfaHorsUemoaRecuesAutres] = useState('');

    // const [euroEmisesbancaire, setEuroEmisesbancaire] = useState('');
    // const [euroEmisesAutres, setEuroEmisesAutres] = useState('');
    // const [euroRecuesbancaire, setEuroRecuesbancaire] = useState('');
    // const [euroRecuesAutres, setEuroRecuesAutres] = useState('');
    
    const [euroEmisesbancaire, setEuroEmisesbancaire] = useState('');
    const [euroEmisesAutres, setEuroEmisesAutres] = useState('');
    const [euroRecuesbancaire, setEuroRecuesbancaire] = useState('');
    const [euroRecuesAutres, setEuroRecuesAutres] = useState('');
    
    const [dollarEmisesbancaire, setDollarEmisesbancaire] = useState('');
    const [dollarEmisesAutres, setDollarEmisesAutres] = useState('');
    const [dollarRecuesbancaire, setDollarRecuesbancaire] = useState('');
    const [dollarRecuesAutres, setDollarRecuesAutres] = useState('');
    
    const [autreDvseEmisesbancaire, setAutreDvseEmisesbancaire] = useState('');
    const [autreDvseEmisesAutres, setAutreDvseEmisesAutres] = useState('');
    const [autreDvseRecuesbancaire, setAutreDvseRecuesbancaire] = useState('');
    const [autreDvseRecuesAutres, setAutreDvseRecuesAutres] = useState('');
  




  
    
  
    const handleNationalEmisesbancaireChange = (e) => {
      setNationalEmisesbancaire(e.target.value);
    };
  
    const handleNationalEmisesAutresChange = (e) => {
      setNationalEmisesAutres(e.target.value);
    };
  
    const handleNationalRecuesbancaireChange = (e) => {
      setNationalRecuesbancaire(e.target.value);
    };
  
    const handleNationalRecuesAutresChange = (e) => {
      setNationalRecuesAutres(e.target.value);
    };
  
    const handleCfaUemoaEmisesbancaireChange = (e) => {
      setCfaUemoaEmisesbancaire(e.target.value);
    };
  
    const handleCfaUemoaEmisesAutresChange = (e) => {
      setCfaUemoaEmisesAutres(e.target.value);
    };
  
    const handleCfaUemoaRecuesbancaireChange = (e) => {
      setCfaUemoaRecuesbancaire(e.target.value);
    };
  
    const handleCfaUemoaRecuesAutresChange = (e) => {
      setCfaUemoaRecuesAutres(e.target.value);
    };
  
    const handleCfaHorsUemoaEmisesbancaireChange = (e) => {
      setCfaHorsUemoaEmisesbancaire(e.target.value);
    };
  
    const handleCfaHorsUemoaEmisesAutresChange = (e) => {
      setCfaHorsUemoaEmisesAutres(e.target.value);
    };
  
    const handleCfaHorsUemoaRecuesbancaireChange = (e) => {
      setCfaHorsUemoaRecuesbancaire(e.target.value);
    };
  
    const handleCfaHorsUemoaRecuesAutresChange = (e) => {
      setCfaHorsUemoaRecuesAutres(e.target.value);
    };
  
    const handleEuroEmisesbancaireChange = (e) => {
      setEuroEmisesbancaire(e.target.value);
    };
  
    const handleEuroEmisesAutresChange = (e) => {
      setEuroEmisesAutres(e.target.value);
    };
  
    const handleEuroRecuesbancaireChange = (e) => {
      setEuroRecuesbancaire(e.target.value);
    };
  
    const handleEuroRecuesAutresChange = (e) => {
      setEuroRecuesAutres(e.target.value);
    };

    const handleDollarEmisesbancaireChange = (e) => {
        setDollarEmisesbancaire(e.target.value);
      };
    
      const handleDollarEmisesAutresChange = (e) => {
        setDollarEmisesAutres(e.target.value);
      };
    
      const handleDollarRecuesbancaireChange = (e) => {
        setDollarRecuesbancaire(e.target.value);
      };
    
      const handleDollarRecuesAutresChange = (e) => {
        setDollarRecuesAutres(e.target.value);
      };
    
      const handleAutreDvseEmisesbancaireChange = (e) => {
        setAutreDvseEmisesbancaire(e.target.value);
      };
    
      const handleAutreDvseEmisesAutresChange = (e) => {
        setAutreDvseEmisesAutres(e.target.value);
      };
    
      const handleAutreDvseRecuesbancaireChange = (e) => {
        setAutreDvseRecuesbancaire(e.target.value);
        
      };

      const handleAutreDvseRecuesAutresChange = (e) => {
        setAutreDvseRecuesAutres(e.target.value);
      };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      // Effectuer des actions avec les données du formulaire
      console.log({
        nationalEmisesbancaire,
        nationalEmisesAutres,
        nationalRecuesbancaire,
        nationalRecuesAutres,
        cfaUemoaEmisesbancaire,
        cfaUemoaEmisesAutres,
        cfaUemoaRecuesbancaire,
        cfaUemoaRecuesAutres,
        cfaHorsUemoaEmisesbancaire,
        cfaHorsUemoaEmisesAutres,
        cfaRecuesbancaire,
        cfaHorsUemoaRecuesAutres,
        euroEmisesbancaire,
        euroEmisesAutres,
        euroRecuesbancaire,
        euroRecuesAutres
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
                                    value={nationalEmisesbancaire} 
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
                                <select className='' value={nationalEmisesAutres} onChange={handleNationalEmisesAutresChange}>
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
                                <select className='' value={nationalRecuesbancaire} onChange={handleNationalRecuesbancaireChange}>
                                <option value="">Sélectionner un élément</option>
                                    <option value="0">0</option>
                                    <option value="1&lt;transactions&lt;10">1 &lt; transactions &lt; 10</option>
                                    <option value="10&lt;transactions&lt;50">10 &lt; transactions &lt; 50</option>
                                    <option value="Transactions > 51">Transactions &gt; 51</option>
                                </select>
                            </label>

                            <label className="mt-3">
                                Autres transactions (mobile money, remittance , CB) : <br/>
                                <select className='' value={nationalRecuesAutres} onChange={handleNationalRecuesAutresChange}>
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
                                <select className='' value={cfaUemoaEmisesbancaire} onChange={handleCfaUemoaEmisesbancaireChange}>
                                    <option value="">Sélectionner un élément</option>
                                    <option value="0">0</option>
                                    <option value="1&lt;transactions&lt;10">1 &lt; transactions &lt; 10</option>
                                    <option value="10&lt;transactions&lt;50">10 &lt; transactions &lt; 50</option>
                                    <option value="Transactions > 51">Transactions &gt; 51</option>
                                </select>
                            </label>

                            <label className='mt-3'>
                                Autres transactions (mobile money, remittance , CB) : <br/>
                                <select className='' value={cfaUemoaEmisesAutres} onChange={handleCfaUemoaEmisesAutresChange}>
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
                                <select className='' value={cfaUemoaRecuesbancaire} onChange={handleCfaUemoaRecuesbancaireChange}>
                                    <option value="">Sélectionner un élément</option>
                                    <option value="0">0</option>
                                    <option value="1&lt;transactions&lt;10">1 &lt; transactions &lt; 10</option>
                                    <option value="10&lt;transactions&lt;50">10 &lt; transactions &lt; 50</option>
                                    <option value="Transactions > 51">Transactions &gt; 51</option>
                                </select>
                            </label>

                            <label className='mt-3'>
                                Autres transactions (mobile money, remittance , CB) : <br/>
                                <select className='' value={cfaUemoaRecuesAutres} onChange={handleCfaUemoaRecuesAutresChange}>
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
                                <select className='' value={cfaHorsUemoaEmisesbancaire} onChange={handleCfaHorsUemoaEmisesbancaireChange}>
                                <option value="">Sélectionner un élément</option>
                                    <option value="0">0</option>
                                    <option value="1&lt;transactions&lt;10">1 &lt; transactions &lt; 10</option>
                                    <option value="10&lt;transactions&lt;50">10 &lt; transactions &lt; 50</option>
                                    <option value="Transactions > 51">Transactions &gt; 51</option>
                                </select>
                            </label>
                            <label className='mt-3'>
                                Autres transactions (mobile money, remittance , CB) : <br/>
                                <select className='' value={cfaHorsUemoaEmisesAutres} onChange={handleCfaHorsUemoaEmisesAutresChange}>
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
                                <select className='' value={cfaRecuesbancaire} onChange={handleCfaHorsUemoaRecuesbancaireChange}>
                                    <option value="">Sélectionner un élément</option>
                                    <option value="0">0</option>
                                    <option value="1&lt;transactions&lt;10">1 &lt; transactions &lt; 10</option>
                                    <option value="10&lt;transactions&lt;50">10 &lt; transactions &lt; 50</option>
                                    <option value="Transactions > 51">Transactions &gt; 51</option>
                                </select>
                            </label>

                            <label className='mt-3'>
                                Autres transactions (mobile money, remittance , CB) :<br/>
                                <select className='' value={cfaHorsUemoaRecuesAutres} onChange={handleCfaHorsUemoaRecuesAutresChange}>
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
                                <select className='' value={euroEmisesbancaire} onChange={handleEuroEmisesbancaireChange}>
                                    <option value="">Sélectionner un élément</option>
                                    <option value="0">0</option>
                                    <option value="1&lt;transactions&lt;10">1 &lt; transactions &lt; 10</option>
                                    <option value="10&lt;transactions&lt;50">10 &lt; transactions &lt; 50</option>
                                    <option value="Transactions > 51">Transactions &gt; 51</option>
                                </select>
                            </label>

                            <label className='mt-3'>
                                Autres transactions (mobile money, remittance , CB) :<br/>
                                <select className='' value={euroEmisesAutres} onChange={handleEuroEmisesAutresChange}>
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
                                <select className='' value={euroRecuesbancaire} onChange={handleEuroRecuesbancaireChange}>
                                    <option value="">Sélectionner un élément</option>
                                    <option value="0">0</option>
                                    <option value="1&lt;transactions&lt;10">1 &lt; transactions &lt; 10</option>
                                    <option value="10&lt;transactions&lt;50">10 &lt; transactions &lt; 50</option>
                                    <option value="Transactions > 51">Transactions &gt; 51</option>
                                </select>
                            </label>

                            <label className='mt-3'>
                                Autres transactions (mobile money, remittance , CB) : <br/>
                                <select className='' value={euroRecuesAutres} onChange={handleEuroRecuesAutresChange}>
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
                                value={dollarEmisesbancaire}
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
                                value={dollarEmisesAutres}
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
                                value={dollarRecuesbancaire}
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
                                value={dollarRecuesAutres}
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
                                value={autreDvseEmisesbancaire}
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
                                value={autreDvseEmisesAutres}
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
                                value={autreDvseRecuesbancaire}
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
                                value={autreDvseRecuesAutres}
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
