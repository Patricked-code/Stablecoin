import { useCallback, useState, useEffect } from 'react';
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

// FIN

const CQuestionnaireAmlTwo = () => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API

    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [messageError, setMessageError] = useState();


    // states des questionnaires
      const [answers, setAnswers] = useState({
        cashPayments: '',
        relationsIranKoreaSyriaCuba: '',
        transactionsInTaxHavens: '',
        cryptocurrencyPayments: '',
        relationsInternationalSanctions: '',
        transactionsLowTaxation: '',
        politicallyExposedClients: '',
        offshoreCompanyPayments: '',
        crossBorderTransactions: ''
      });


      // Autres states
      const [otherBankAccount, setOtherBankAccount] = useState('');
      const [savingsAccount, setSavingsAccount] = useState([]);
      const [currentAccount, setCurrentAccount] = useState([]);
      const [titleAccount, setTitleAccount] = useState([]);
      const [datAccount, setDatAccount] = useState([]);
      const [foreignCurrencyAccount, setForeignCurrencyAccount] = useState([]);

      const [allCountry, setAllCountry] = useState('');
      const [allBank, setAllBank] = useState([])
      const [currentKycEntrepriseStatut, setCurrentKycEntrepriseStatut] = useState();



      
      const [bankReferencesSavings, setBankReferencesSavings] = useState('');
      const [otherBankNameSavings, setOtherBankNameSavings] = useState('');
      const [otherBankCountrySavings, setOtherBankCountrySavings] = useState('');
      const [bankReferencesCurrent, setBankReferencesCurrent] = useState('');
      const [otherBankNameCurrent, setOtherBankNameCurrent] = useState('');
      const [otherBankCountryCurrent, setOtherBankCountryCurrent] = useState('');
      const [bankReferencesTitle, setBankReferencesTitle] = useState('');
      const [otherBankNameTitle, setOtherBankNameTitle] = useState('');
      const [otherBankCountryTitle, setOtherBankCountryTitle] = useState('');
      const [bankReferencesDat, setBankReferencesDat] = useState('');
      const [otherBankNameDat, setOtherBankNameDat] = useState('');
      const [otherBankCountryDat, setOtherBankCountryDat] = useState('');


    // Fonction d'envoie des informations du questionnaire Two
    const updateQuizTwo= async (event) => {
      event.preventDefault();
      setIsLoggingIn(true);
      
      try {

        const dataTable = {
          savingsAccount:Object.assign({},savingsAccount),
          currentAccount:Object.assign({},currentAccount),
          titleAccount:Object.assign({},titleAccount),
          datAccount:Object.assign({},datAccount),
          foreignCurrencyAccount:Object.assign({},foreignCurrencyAccount),

        }

          const dataa = {
            otherBankAccount:otherBankAccount,
            savingsAccount:dataTable?.savingsAccount[0],
            currentAccount:dataTable?.currentAccount[0],
            titleAccount:dataTable?.titleAccount[0],
            dat:dataTable?.datAccount[0],
            foreignCurrencyAccount:dataTable?.foreignCurrencyAccount[0],
            bankReferencesSavings:bankReferencesSavings,
            otherBankNameSavings:otherBankNameSavings,
            otherBankCountrySavings:otherBankCountrySavings,
            bankReferencesCurrent:bankReferencesCurrent,
            otherBankNameCurrent:otherBankNameCurrent,
            otherBankCountryCurrent:otherBankCountryCurrent,
            bankReferencesTitle:bankReferencesTitle,
            otherBankNameTitle:otherBankNameTitle,
            otherBankCountryTitle:otherBankCountryTitle,
            bankReferencesDat:bankReferencesDat,
            otherBankNameDat:otherBankNameDat,
            otherBankCountryDat:otherBankCountryDat,
            cashPayments:answers?.cashPayments,
            transactionsInTaxHavens:answers?.transactionsInTaxHavens,
            cryptocurrencyPayments:answers?.cryptocurrencyPayments,
            transactionsLowTaxation:answers?.transactionsLowTaxation,
            politicallyExposedClients:answers?.politicallyExposedClients,
            offshoreCompanyPayments:answers?.offshoreCompanyPayments,
            crossBorderTransactions:answers?.crossBorderTransactions
          }

              const token = localStorage.getItem('tokenEnCours') //Le token récuperé

              const result = await fetch(`${API_URL}/api/kyc/business/update-kyc-quiz-two`, {
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
                      if (currentKycEntrepriseStatut==="1") {
                          Router.push("/profil/kyc/entreprise/resultat-kyc"); 
          
                      }else{
                          Router.push("/profil/kyc/entreprise/questionnaire-aml-three"); 
                      }
                  }, 5000)
              }
              // Fin condition 
          } catch {
          setIsLoggingIn(false);
          }
    };
    // Fin

    const handleChange = (e) => {
      setAnswers({ ...answers, [e.target.name]: e.target.value });
    };


    // Les handles des questions de checkbox de la partie banque
    const handleOptionSavingsAccount = (event) => {
      const value = event.target.value;
      const isChecked = event.target.checked;

      if (isChecked) {
          setSavingsAccount([...savingsAccount, value]);
      } else {
          setSavingsAccount("");
      }
    };

    const handleOptionCurrentAccount = (event) => {
        const value = event.target.value;
        const isChecked = event.target.checked;

        if (isChecked) {
            setCurrentAccount([...currentAccount, value]);
        } else {
            setCurrentAccount("");
        }
    };

    const handleOptionTitleAccount = (event) => {
        const value = event.target.value;
        const isChecked = event.target.checked;

        if (isChecked) {
            setTitleAccount([...titleAccount, value]);
        } else {
            setTitleAccount("");
        }
    };

    const handleOptionDatAccount = (event) => {
      const value = event.target.value;
      const isChecked = event.target.checked;

      if (isChecked) {
          setDatAccount([...datAccount, value]);
      } else {
          setDatAccount("");
      }
    };

    const handleOptionForeignCurrencyAccount = (event) => {
      const value = event.target.value;
      const isChecked = event.target.checked;

      if (isChecked) {
          setForeignCurrencyAccount([...foreignCurrencyAccount, value]);
      } else {
          setForeignCurrencyAccount("");
      }
    };

    // FIN

    // RECUPERER TOUS LES PAYS
    useEffect(async() => {
      const getAllCountries = async () => {
      const resCountry = await fetch(`${API_URL}/api/country/find-all`, {
          headers: {
          'Content-Type': 'application/json',
          },
      })
        .then((resCountry) => resCountry.json())
        .then((allCountry) => {
        setAllCountry(allCountry)
        }) 
      };
      await getAllCountries();
    }, []);
    // FIN

    // RECUPERER TOUTES LES BANQUES 
    useEffect(async() => {
                
      const getAllBank = async () => {
      const resBank = await fetch(`${API_URL}/api/bank/find-all`, {
          headers: {
          'Content-Type': 'application/json',
          },
      })
          .then((resBank) => resBank.json())
          .then((data) => {
          setAllBank(data)

          }) 
      };
      await getAllBank();
    }, []);
    // FIN

   // La barre de progression de KYC du profil entreprise
   const stepsEntreprise = ["AML","Identité","Représentant", "Bénéficiaire","Control", "Politique", "Opérations", "Fonds", "Financière", "Documents"];

   const activeStepEntreprise = -1;
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
    

        <div className='' >
            <div className=' mx-15'>
                <div className='py-10'>
                    <br/><br/><h1 className='text-center'>Questionnaires AML 2</h1>
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
                        <form onSubmit={updateQuizTwo}>




                          <div className="mt-3">
                            <label>Avez-vous un compte bancaire dans une autre institution ?</label>
                            <select
                                className="form-control mt-2"
                                name="hasOtherBankAccount"
                                value={otherBankAccount}
                                onChange={(e) => setOtherBankAccount(e.target.value)}
                            >
                                <option defaultValue="">Choisissez</option>

                                <option value="Oui">Oui</option>
                                <option value="Non">Non</option>
                            </select>
                            
                          </div>

                          {otherBankAccount ==="Oui" && (
                            <>
                  <div className="mt-3 mb-5">
                    <label>Type de compte :</label>
                    <div className="mt-2">
                      <label>
                        <input
                          type="checkbox"
                          name="Compte courant"
                          value="Compte courant"
                          checked={currentAccount.includes('Compte courant')}
                          onChange={handleOptionCurrentAccount}
                        />
                        Compte courant
                      </label>
                      <br />
                      <label>
                        <input
                          type="checkbox"
                          name="Compte épargne"
                          value="Compte épargne"
                          checked={savingsAccount.includes('Compte épargne')}
                          onChange={handleOptionSavingsAccount}
                        />
                        Compte épargne
                      </label>
                      <br />
                      <label>
                        <input
                          type="checkbox"
                          name="Compte DAT"
                          value="Compte DAT"
                          checked={datAccount.includes('Compte DAT')}
                          onChange={handleOptionDatAccount}
                        />
                        DAT
                      </label>
                      <br />
                      <label>
                        <input
                          type="checkbox"
                          name="Compte titre"
                          value="Compte titre"
                          checked={titleAccount.includes('Compte titre')}
                          onChange={handleOptionTitleAccount}
                        />
                        Compte titre
                      </label>
                      <br />
                      <label>
                        <input
                          type="checkbox"
                          name="Compte en devises étrangères"
                          value="Compte en devises étrangères"
                          checked={foreignCurrencyAccount.includes('Compte en devises étrangères')}
                          onChange={handleOptionForeignCurrencyAccount}
                        />
                          Compte en devises étrangères
                      </label>
                    </div>
                  </div>
               

                          {/* LES CHAMPS A RENSEIGNER QUAND L'UTISATEUR A UN COMPTE BANCAIRE D'EPARGNE*/}
                          {savingsAccount[0]==="Compte épargne"? (
                            <>
                            <label className="text-center mb-2 colorRed">
                                Les informations du compte d'épargne
                            </label>
                            {/* Question 7 */}
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="otherBankCountrySavings"
                                    className="text-blackish-blue mb-2"
                                >
                                    Pays de la banque de votre compte d'épargne existant
                                </label>
                                <select 
                                className="form-control"
                                id="otherBankCountrySavings"
                                required
                                defaultValue={otherBankCountrySavings} 
                                onChange={(event)=>setOtherBankCountrySavings(event.target.value)}
                                >
                                    <option defaultValue="">Choisissez</option>
                                    {allCountry?(
                                        allCountry.map((data) => (
                                        <optgroup className='single-cryptocurrency-box'
                                                key={data.id}>
                                        <option  value={data.code}>{data.libelle}</option>
                                        </optgroup>
                                    ))):("")}
                                </select>
                            </div >

                            {otherBankCountrySavings==="CI" || otherBankCountrySavings==="TG" || otherBankCountrySavings==="BJ" || otherBankCountrySavings==="BF" || otherBankCountrySavings==="TD" || otherBankCountrySavings==="GA" || otherBankCountrySavings==="CG" || otherBankCountrySavings==="CF" || otherBankCountrySavings==="GQ" || otherBankCountrySavings==="CM" || otherBankCountrySavings==="GW" || otherBankCountrySavings==="ML" || otherBankCountrySavings==="NE" || otherBankCountrySavings==="SN" ?(
                                
                                <div className='form-group mb-6 mt-3'>
                                    <label
                                        htmlFor="bankNameSavings"
                                        className="text-blackish-blue mb-2"
                                    >
                                     Nom de la banque de votre compte d'épargne
                                    </label>
                                    <select 
                                        placeholder='Banque'
                                        className='form-control'
                                        defaultValue={otherBankNameSavings} 
                                        onChange={(event)=>setOtherBankNameSavings(event.target.value)}
                                    >
                                        <option>Choisissez</option>
                                        {/* Afficher les Banques d'un pays */}
                                        {allBank.map((data) => (
                                            data.countryIso===otherBankCountrySavings?
                                                <optgroup className='single-cryptocurrency-box' key={data.id}>
                                                    <option value={data.bankName}>{data.bankName}</option>
                                                </optgroup>
                                            :" "
                                        ))}
                                        {/* Fin */}
                                </select>
                                </div>
                            ):(
                                <div className="form-group mb-6 mt-3">
                                    <label
                                        htmlFor="bankNameSavings"
                                        className="text-blackish-blue mb-2"
                                    >
                                    Nom de la banque de votre compte d'épargne
                                    </label>
                                    <div className='form-group '>
                                        <input
                                            type='text'
                                            id='bankNameSavings'
                                            className='form-control'
                                            placeholder="Nom de la banque de votre compte d'épargne"
                                            defaultValue={otherBankNameSavings} 
                                            onChange={(event)=>setOtherBankNameSavings(event.target.value)}
                                        />
                                    </div>
                                </div >
                            )}

                            {/* Fin Q3 */}
                                
                            {/* Question 6 */}
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="bankReferencesSavings"
                                    className="text-blackish-blue mb-2"
                                >
                                    Références de la banque de votre compte d'épargne
                                </label>
                                <div className='form-group'>
                                    <input
                                        type='text'
                                        id='bankReferencesSavings'
                                        className='form-control'
                                        placeholder=" Références de la banque de votre compte d'épargne"
                                        defaultValue={bankReferencesSavings} 
                                        onChange={(event)=>setBankReferencesSavings(event.target.value)}
                                    />
                                </div>
                            </div>
                            
                            
                            {/* Fin */}

                             
                            </>
                            ):("")}
                            {/* **********FIN CONDITION DE COMPTE BANCAIRE D'EPARGNE******** */}

                            {/* LES CHAMPS A RENSEIGNER QUAND L'UTISATEUR A UN COMPTE BANCAIRE COURANT*/}
                            {currentAccount[0]==="Compte courant"? (
                            <>
                            <label className="text-center mb-2 colorRed">
                                Les informations du compte courant
                            </label>
                                 {/* Question 7 */}
                             <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="otherBankCountryCurrent"
                                    className="text-blackish-blue mb-2"
                                >
                                    Pays de la banque de votre compte courant existant
                                </label>
                                <select 
                                className="form-control  bgColorRed"
                                id="otherBankCountryCurrent"
                                required
                                defaultValue={otherBankCountryCurrent} 
                                onChange={(event)=>setOtherBankCountryCurrent(event.target.value)}
                                >
                                    <option defaultValue="">Choisissez</option>
                                    {allCountry?(
                                        allCountry.map((data) => (
                                            <optgroup className='single-cryptocurrency-box'
                                                    key={data.id}>
                                            <option  value={data.code}>{data.libelle}</option>
                                            </optgroup>
                                        ))
                                    ):("")}
                                </select>
                            </div >

                            {otherBankCountryCurrent==="CI" || otherBankCountryCurrent==="TG" || otherBankCountryCurrent==="BJ" || otherBankCountryCurrent==="BF" || otherBankCountryCurrent==="TD" || otherBankCountryCurrent==="GA" || otherBankCountryCurrent==="CG" || otherBankCountryCurrent==="CF" || otherBankCountryCurrent==="GQ" || otherBankCountryCurrent==="CM" || otherBankCountryCurrent==="GW" || otherBankCountryCurrent==="ML" || otherBankCountryCurrent==="NE" || otherBankCountryCurrent==="SN" ?(
                                <div className='form-group mb-6 mt-3'>
                                    <label
                                        htmlFor="bankNameSavings"
                                        className="text-blackish-blue mb-2"
                                    >
                                        Nom de la banque de votre compte courant
                                    </label>
                                    <select 
                                        placeholder='Banque'
                                        className='form-control'
                                        defaultValue={otherBankNameCurrent} 
                                        onChange={(event)=>setOtherBankNameCurrent(event.target.value)}
                                    >
                                        <option>Choisissez</option>
                                        {/* Afficher les Banques d'un pays */}
                                        {allBank.map((data) => (
                                            data.countryIso===otherBankCountryCurrent?
                                                <optgroup className='single-cryptocurrency-box' key={data.id}>
                                                    <option value={data.bankName}>{data.bankName}</option>
                                                </optgroup>
                                            :" "
                                        ))}
                                        {/* Fin */}
                                </select>
                                </div>
                            ):(
                                <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="bankNameCurrent"
                                    className="text-blackish-blue mb-2"
                                >
                                  Nom de la banque de votre compte courant
                                </label>
                                <div className='form-group '>
                                    <input
                                        type='text'
                                        id='bankNameCurrentCurrent'
                                        className='form-control'
                                        placeholder='Nom de la banque de votre compte courant'
                                        defaultValue={otherBankNameCurrent} 
                                        onChange={(event)=>setOtherBankNameCurrent(event.target.value)}
                                    />
                                </div>
                            </div >
                            )}
                            
                            {/* Question 6 */}
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="bankReferencesCurrent"
                                    className="text-blackish-blue mb-2"
                                >
                                    Références de la banque de votre compte courant
                                </label>
                                <div className='form-group'>
                                    <input
                                        type='text'
                                        id='bankReferencesCurrent'
                                        className='form-control'
                                        placeholder='Références de la banque de votre compte courant'
                                        defaultValue={bankReferencesCurrent} 
                                        onChange={(event)=>setBankReferencesCurrent(event.target.value)}
                                    />
                                </div>
                            </div>
                            
                           
                            {/* Fin */}
                            
                            </>
                            ):("")}
                            {/* ***********FIN CONDITION S'IL A UN COMPTE BANCAIRE COURANT**** */}
                            
                            {/* LES CHAMPS A RENSEIGNER QUAND L'UTISATEUR A UN COMPTE BANCAIRE TITRE*/}
                            {titleAccount[0]==="Compte titre"? (
                            <>
                            <label className="text-center mb-2 colorRed">
                                Les informations du compte titre
                            </label>
                                {/* Question 7 */}
                             <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="otherBankCountryTitle"
                                    className="text-blackish-blue mb-2"
                                >
                                    Pays de la banque de votre compte titre existant
                                </label>
                                <select 
                                className="form-control"
                                id="otherBankCountryTitle"
                                required
                                defaultValue={otherBankCountryTitle} 
                                onChange={(event)=>setOtherBankCountryTitle(event.target.value)}
                                >
                                    <option defaultValue="">Choisissez</option>
                                    {allCountry?(
                                        allCountry.map((data) => (
                                            <optgroup className='single-cryptocurrency-box'
                                                    key={data.id}>
                                            <option  value={data.code}>{data.libelle}</option>
                                            </optgroup>
                                        ))
                                    ):("")}
                                </select>
                            </div >

                            {otherBankCountryTitle==="CI" || otherBankCountryTitle==="TG" || otherBankCountryTitle==="BJ" || otherBankCountryTitle==="BF" || otherBankCountryTitle==="TD" || otherBankCountryTitle==="GA" || otherBankCountryTitle==="CG" || otherBankCountryTitle==="CF" || otherBankCountryTitle==="GQ" || otherBankCountryTitle==="CM" || otherBankCountryTitle==="GW" || otherBankCountryTitle==="ML" || otherBankCountryTitle==="NE" || otherBankCountryTitle==="SN" ?(
                                <div className='form-group mb-6 mt-3'>
                                    <label
                                        htmlFor="bankNameSavings"
                                        className="text-blackish-blue mb-2"
                                    >
                                        Nom de la banque de votre compte titre

                                    </label>
                                    <select 
                                        placeholder='Banque'
                                        className='form-control'
                                        defaultValue={otherBankNameTitle} 
                                        onChange={(event)=>setOtherBankNameTitle(event.target.value)}
                                    >
                                        <option>Choisissez</option>
                                        {/* Afficher les Banques d'un pays */}
                                        {allBank.map((data) => (
                                            data.countryIso===otherBankCountryTitle?
                                                <optgroup className='single-cryptocurrency-box' key={data.id}>
                                                    <option value={data.bankName}>{data.bankName}</option>
                                                </optgroup>
                                            :" "
                                        ))}
                                        {/* Fin */}
                                </select>
                                </div>
                            ):(
                                <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="bankNameTitle"
                                    className="text-blackish-blue mb-2"
                                >
                                  Nom de la banque de votre compte titre
                                </label>
                                <div className='form-group '>
                                    <input
                                        type='text'
                                        id='bankNameCurrentTitle'
                                        className='form-control'
                                        placeholder='Nom de la banque de votre compte titre'
                                        defaultValue={otherBankNameTitle} 
                                        onChange={(event)=>setOtherBankNameTitle(event.target.value)}
                                    />
                                </div>
                            </div >
                            )}

                            
                           
                            {/* Fin Q3 */}
                            {/* Question 6 */}
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="bankReferencesTitle"
                                    className="text-blackish-blue mb-2"
                                >
                                    Références de la banque de votre compte titre
                                </label>
                                <div className='form-group'>
                                    <input
                                        type='text'
                                        id='bankReferencesTitle'
                                        className='form-control'
                                        placeholder='Références de la banque de votre compte titre'
                                        defaultValue={bankReferencesTitle} 
                                        onChange={(event)=>setBankReferencesTitle(event.target.value)}
                                    />
                                </div>
                            </div>
                            
                            
                            {/* Fin */}
                            
                             
                            </>
                            ):("")}
                            {/* **************FIN CONDITION COMPTE TITRE*********** */}
                            
                            {/* LES CHAMPS A RENSEIGNER QUAND L'UTISATEUR A UN COMPTE BANCAIRE DAT*/}
                            {datAccount[0]==="Compte DAT"? (
                            <>
                            <label className="text-center mb-2 colorRed">
                                Les informations du compte DAT
                            </label>
                                {/* Question 7 */}
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="otherBankCountryDat"
                                    className="text-blackish-blue mb-2"
                                >
                                    Pays de la banque de votre compte DAT existant
                                </label>
                                <select 
                                className="form-control"
                                id="otherBankCountryDat"
                                required
                                defaultValue={otherBankCountryDat} 
                                onChange={(event)=>setOtherBankCountryDat(event.target.value)}
                                >
                                    <option defaultValue="">Choisissez</option>
                                    {allCountry?(
                                        allCountry.map((data) => (
                                            <optgroup className='single-cryptocurrency-box'
                                                    key={data.id}>
                                            <option  value={data.code}>{data.libelle}</option>
                                            </optgroup>
                                        ))
                                    ):("")}
                                </select>
                            </div >

                            {otherBankCountryDat==="CI" || otherBankCountryDat==="TG" || otherBankCountryDat==="BJ" || otherBankCountryDat==="BF" || otherBankCountryDat==="TD" || otherBankCountryDat==="GA" || otherBankCountryDat==="CG" || otherBankCountryDat==="CF" || otherBankCountryDat==="GQ" || otherBankCountryDat==="CM" || otherBankCountryDat==="GW" || otherBankCountryDat==="ML" || otherBankCountryDat==="NE" || otherBankCountryDat==="SN" ?(
                                <div className='form-group mb-6 mt-3'>
                                    <label
                                        htmlFor="bankNameSavings"
                                        className="text-blackish-blue mb-2"
                                    >
                                        Nom de la banque de votre compte DAT

                                    </label>
                                    <select 
                                        placeholder='Banque'
                                        className='form-control'
                                        defaultValue={otherBankNameDat} 
                                        onChange={(event)=>setOtherBankNameDat(event.target.value)}
                                    >
                                        <option>Choisissez</option>
                                        {/* Afficher les Banques d'un pays */}
                                        {allBank.map((data) => (
                                            data.countryIso===otherBankCountryDat?
                                                <optgroup className='single-cryptocurrency-box' key={data.id}>
                                                    <option value={data.bankName}>{data.bankName}</option>
                                                </optgroup>
                                            :" "
                                        ))}
                                        {/* Fin */}
                                </select>
                                </div>
                            ):(
                                <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="bankNameDat"
                                    className="text-blackish-blue mb-2"
                                >
                                  Nom de la banque de votre compte DAT
                                </label>
                                <div className='form-group '>
                                    <input
                                        type='text'
                                        id='bankNameCurrentDat'
                                        className='form-control'
                                        placeholder='Nom de la banque de votre compte DAT'
                                        defaultValue={otherBankNameDat} 
                                        onChange={(event)=>setOtherBankNameDat(event.target.value)}
                                    />
                                </div>
                            </div >
                            )}



                            {/* Fin Q3 */}
                            {/* Question 6 */}
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="bankReferencesDat"
                                    className="text-blackish-blue mb-2"
                                >
                                    Références de la banque de votre compte DAT
                                </label>
                                <div className='form-group'>
                                    <input
                                        type='text'
                                        id='bankReferencesDat'
                                        className='form-control'
                                        placeholder='Références de la banque de votre compte DAT'
                                        defaultValue={bankReferencesDat} 
                                        onChange={(event)=>setBankReferencesDat(event.target.value)}
                                    />
                                </div>
                            </div>


                            {/* Fin */}

                            
                            </>
                            ):("")}
                            {/* **************FIN CONDITION COMPTE DAT********** */}
                            </>
                          )}
                           
                            {/* ****************FIN PARTIE BANQUE************************ */}

                            <div className='mt-3'>
                                <label>
                                Acceptez-vous des paiements en espèces pour des biens ou services d'une valeur supérieure à 15 000 dollars américains (ou équivalent dans une autre devise) provenant d'activités telles que la construction, les services juridiques ou l'hôtellerie ?
                                </label>
                                <select className='form-control mt-2' name="cashPayments" onChange={handleChange}>
                                <option value="">Choisissez une option</option>
                                <option value="Oui">Oui</option>
                                <option value="Non">Non</option>
                                </select>
                            </div>

                            <div className='mt-3'>
                                <label>
                                Avez-vous des relations commerciales avec des individus ou des entités basés en Iran, en Corée du Nord, en Syrie ou à Cuba, notamment dans des secteurs tels que l'énergie, les télécommunications ou la construction ?
                                </label>
                                <select className='form-control mt-2' name="relationsIranKoreaSyriaCuba" onChange={handleChange}>
                                <option value="">Choisissez une option</option>
                                <option value="Oui">Oui</option>
                                <option value="Non">Non</option>
                                </select>
                            </div>

                            <div className='mt-3'>
                                <label>
                                Effectuez-vous des transactions avec des banques ou des institutions financières situées dans des pays considérés comme des paradis fiscaux ou à haut risque de blanchiment d'argent, en particulier dans des zones offshore telles que les Îles Caïmans, les Îles Vierges Britanniques ou les Seychelles ?
                                </label>
                                <select className='form-control mt-2' name="transactionsInTaxHavens" onChange={handleChange}>
                                <option value="">Choisissez une option</option>
                                <option value="Oui">Oui</option>
                                <option value="Non">Non</option>
                                </select>
                            </div>

                            <div className='mt-3'>
                                <label>
                                Acceptez-vous des paiements ou effectuez-vous des transactions en crypto-monnaies telles que le Bitcoin ou l'Ethereum, notamment dans des activités de jeux en ligne, de paris sportifs ou de commerce en ligne ?
                                </label>
                                <select className='form-control mt-2' name="cryptocurrencyPayments" onChange={handleChange}>
                                <option value="">Choisissez une option</option>
                                <option value="Oui">Oui</option>
                                <option value="Non">Non</option>
                                </select>
                            </div>

                            <div className='mt-3'>
                                <label>
                                Avez-vous des relations commerciales avec des individus ou des entités figurant sur des listes de sanctions internationales, telles que la liste des personnes spécialement désignées (SDN) du Bureau of Foreign Assets Control (OFAC) aux États-Unis, notamment dans des secteurs tels que la défense, la technologie ou les transports ?
                                </label>
                                <select className='form-control mt-2' name="relationsInternationalSanctions" onChange={handleChange}>
                                <option value="">Choisissez une option</option>
                                <option value="Oui">Oui</option>
                                <option value="Non">Non</option>
                                </select>
                            </div>

                            <div className='mt-3'>
                                <label>
                                Effectuez-vous des transactions d'une valeur supérieure à 5 000 euros (ou équivalent dans une autre devise) vers des pays ou des territoires à faible taux d'imposition, notamment dans des secteurs tels que la finance, la gestion de patrimoine ou l'immobilier ?
                                </label>
                                <select className='form-control mt-2' name="transactionsLowTaxation" onChange={handleChange}>
                                <option value="">Choisissez une option</option>
                                <option value="Oui">Oui</option>
                                <option value="Non">Non</option>
                                </select>
                            </div>

                            <div className='mt-3'>
                                <label>
                                Avez-vous des clients ou des fournisseurs qui sont des politiquement exposés (PEP) ou des membres de leur famille proche, notamment dans des secteurs tels que la politique, les institutions publiques ou les organisations internationales ?
                                </label>
                                <select className='form-control mt-2' name="politicallyExposedClients" onChange={handleChange}>
                                <option value="">Choisissez une option</option>
                                <option value="Oui">Oui</option>
                                <option value="Non">Non</option>
                                </select>
                            </div>

                            <div className='mt-3'>
                                <label>
                                Acceptez-vous des paiements ou effectuez-vous des transactions en utilisant des sociétés écrans, des trusts ou des sociétés offshore, notamment dans des activités telles que l'évasion fiscale, la planification successorale ou la gestion de patrimoine ?
                                </label>
                                <select className='form-control mt-2' name="offshoreCompanyPayments" onChange={handleChange}>
                                <option value="">Choisissez une option</option>
                                <option value="Oui">Oui</option>
                                <option value="Non">Non</option>
                                </select>
                            </div>

                            <div className='mt-3'>
                                <label>
                                Effectuez-vous des transactions transfrontalieres d'une valeur superieure à 10 000 dollars americains (ou equivalent dans une autre devise) sans verifier la source des fonds ou l'identite des parties, notamment dans des activites telles que le commerce de marchandises, le negoce de matieres premieres ou le transport international ?
                                </label>
                                <select className='form-control mt-2' name="crossBorderTransactions" onChange={handleChange}>
                                <option value="">Choisissez une option</option>
                                <option value="Oui">Oui</option>
                                <option value="Non">Non</option>
                                </select>
                            </div>

                            {/* <button type="submit">Envoyer</button> */}
                            <div className="form-group mb-6 mt-3 col-lg-12 col-md-12  row justify-content-between">
                                <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">
                                    <Link href='/profil/kyc/entreprise/questionnaire/' className="align-right">
                                        <a
                                        className=""
                                        >
                                            <button className="btn btn-primary " type='button'  > Précédente </button>
                                        </a>   
                                    </Link>                          
                                </div>
                                <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">
                                  <button className="btn btn-primary " type='submit' disabled={isLoggingIn}> Suivant </button>
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

export default CQuestionnaireAmlTwo;
