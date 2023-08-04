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
      const [bankReferencesSavings, setBankReferencesSavings] = useState('');
      const [otherBankNameSavings, setOtherBankNameSavings] = useState('');
      const [otherBankCountrySavings, setOtherBankCountrySavings] = useState('');
      const [bankReferencesCurrent, setBankReferencesCurrent] = useState('');
      const [otherBankNameCurrent, setOtherBankNameCurrent] = useState('');
      const [otherBankCountryCurrent, setOtherBankCountryCurrent] = useState('');
      const [bankReferencesTitle, setBankReferencesTitle] = useState('');
      const [otherBankNameTitle, setOtherBankNameTitle] = useState('');
      const [otherBankCountryTitle, setOtherBankCountryTitle] = useState('');

// LES BONS
// otherBankAccount
// savingsAccount
// currentAccount
// titleAccount
// dat
// bankReferencesSavings
// otherBankNameSavings
// otherBankCountrySavings
// bankReferencesCurrent
// otherBankNameCurrent
// otherBankCountryCurrent
// bankReferencesTitle
// otherBankNameTitle
// otherBankCountryTitle
// bankReferencesDat
// otherBankNameDat
// otherBankCountryDat
// cashPayments
// relationsIranKoreaSyriaCuba
// transactionsInTaxHavens
// cryptocurrencyPayments
// relationsInternationalSanctions
// transactionsLowTaxation
// politicallyExposedClients
// offshoreCompanyPayments
// crossBorderTransactions

    
      const handleChange = (e) => {
        setAnswers({ ...answers, [e.target.name]: e.target.value });
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
        // Envoyer les réponses à l'endroit approprié ou effectuer d'autres actions nécessaires
        console.log(answers);
      };
    

    //   POUR LES BANQUES
    const [hasOtherBankAccount, setHasOtherBankAccount] = useState(false);
    const [bankAccountDetails, setBankAccountDetails] = useState({
      country: '',
      bankName: '',
      accountTypes: [],
    });
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setBankAccountDetails((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    };
  
    const handleCheckboxChange = (e) => {
      const { name, checked } = e.target;
      if (checked) {
        setBankAccountDetails((prevState) => ({
          ...prevState,
          accountTypes: [...prevState.accountTypes, name],
        }));
      } else {
        setBankAccountDetails((prevState) => ({
          ...prevState,
          accountTypes: prevState.accountTypes.filter((type) => type !== name),
        }));
      }
    };

    //   FIN BANQUE




    
   // La barre de progression de KYC du profil entreprise
   const stepsEntreprise = ["AML","Identité","Représentant", "Bénéficiaire","Control", "Politique", "Opérations", "Fonds", "Financière", "Documents"];

   const activeStepEntreprise = -1;
   // Fin


  return (
    <>
        <ProgressBar className="mb-15" steps={stepsEntreprise} activeStep={activeStepEntreprise} />
    

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
                        <form onSubmit={handleSubmit}>




                        <div className="mt-3">
                <label>Avez-vous un compte bancaire dans une autre institution ?</label>
                <select
                    className="form-control mt-2"
                    name="hasOtherBankAccount"
                    value={hasOtherBankAccount.toString()}
                    onChange={(e) => setHasOtherBankAccount(e.target.value === "true")}
                >
                    <option value="true">Oui</option>
                    <option value="false">Non</option>
                </select>
                
              </div>

              {hasOtherBankAccount && (
                <>
                  <div className="mt-3">
                    <label>Pays :</label>
                    <select
                        className="form-control mt-2"
                        name="country"
                        value={bankAccountDetails.country}
                        onChange={handleInputChange}
                    >
                        <option value="">Sélectionnez un pays</option>
                        <option value="France">France</option>
                        <option value="États-Unis">États-Unis</option>
                        <option value="Royaume-Uni">Royaume-Uni</option>
                        {/* Ajoutez d'autres options de pays ici */}
                    </select>
                    </div>

                  <div className="mt-3">
                    <label>Nom de la banque :</label>
                    <input
                      type="text"
                      name="bankName"
                      className="form-control mt-2"
                      value={bankAccountDetails.bankName}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="mt-3">
                    <label>Type de compte :</label>
                    <div className="mt-2">
                      <label>
                        <input
                          type="checkbox"
                          name="compteCourant"
                          checked={bankAccountDetails.accountTypes.includes('compteCourant')}
                          onChange={handleCheckboxChange}
                        />
                        Compte courant
                      </label>
                      <br />
                      <label>
                        <input
                          type="checkbox"
                          name="compteEpargne"
                          checked={bankAccountDetails.accountTypes.includes('compteEpargne')}
                          onChange={handleCheckboxChange}
                        />
                        Compte épargne
                      </label>
                      <br />
                      <label>
                        <input
                          type="checkbox"
                          name="DAT"
                          checked={bankAccountDetails.accountTypes.includes('DAT')}
                          onChange={handleCheckboxChange}
                        />
                        DAT
                      </label>
                      <br />
                      <label>
                        <input
                          type="checkbox"
                          name="compteTitres"
                          checked={bankAccountDetails.accountTypes.includes('compteTitres')}
                          onChange={handleCheckboxChange}
                        />
                        Compte titres
                      </label>
                      <br />
                      <label>
                        <input
                          type="checkbox"
                          name="compteDevisesEtrangeres"
                          checked={bankAccountDetails.accountTypes.includes('compteDevisesEtrangeres')}
                          onChange={handleCheckboxChange}
                        />
                        Compte en devises étrangères
                      </label>
                    </div>
                  </div>
                </>
              )}

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
                                    <Link href='/profil/kyc/entreprise/questionnaire-aml-three/' className="align-right">
                                        <a
                                        className=""
                                        >
                                            <button className="btn btn-primary " type='button'  > Suivant </button>
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

export default CQuestionnaireAmlTwo;
