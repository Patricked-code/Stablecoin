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

const CIformationFinanciereThree = () => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API

    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [messageError, setMessageError] = useState();
    const [currentKycStatut, setCurrentKycStatut] = useState();


    // ***********LA BONNE PARTIE STATE DU FORMULAIRE***********************
    const [mOneCa, setMOneCa] = useState('');
    const [mOneCharges, setMOneCharges] = useState('');
    const [mOneResultat, setMOneResultat] = useState('');
    const [mOneTransactions, setMOneTransactions] = useState('');
  
    const [mTwoCa, setMTwoCa] = useState('');
    const [mTwoCharges, setMTwoCharges] = useState('');
    const [mTwoResultat, setMTwoResultat] = useState('');
    const [mTwoTransactions, setMTwoTransactions] = useState('');
  
    const [mThreeCa, setMThreeCa] = useState('');
    const [mThreeCharges, setMThreeCharges] = useState('');
    const [mThreeResultat, setMThreeResultat] = useState('');
    const [mThreeTransactions, setMThreeTransactions] = useState('');
  
    const [mFourCa, setMFourCa] = useState('');
    const [mFourCharges, setMFourCharges] = useState('');
    const [mFourResultat, setMFourResultat] = useState('');
    const [mFourTransactions, setMFourTransactions] = useState('');
  

    const handleM1CaChange = (e) => {
      setMOneCa(e.target.value);
    };
  
    const handleM1ChargesChange = (e) => {
      setMOneCharges(e.target.value);
    };
  
    const handleM1ResultatChange = (e) => {
      setMOneResultat(e.target.value);
    };
  
    const handleM1TransactionsChange = (e) => {
      setMOneTransactions(e.target.value);
    };
  
    const handleM2CaChange = (e) => {
      setMTwoCa(e.target.value);
    };
  
    const handleM2ChargesChange = (e) => {
      setMTwoCharges(e.target.value);
    };
  
    const handleM2ResultatChange = (e) => {
      setMTwoResultat(e.target.value);
    };
  
    const handleM2TransactionsChange = (e) => {
      setMTwoTransactions(e.target.value);
    };
  
    const handleM3CaChange = (e) => {
      setMThreeCa(e.target.value);
    };
  
    const handleM3ChargesChange = (e) => {
      setMThreeCharges(e.target.value);
    };
  
    const handleM3ResultatChange = (e) => {
      setMThreeResultat(e.target.value);
    };
  
    const handleM3TransactionsChange = (e) => {
      setMThreeTransactions(e.target.value);
    };
  
    const handleM4CaChange = (e) => {
      setMFourCa(e.target.value);
    };
  
    const handleM4ChargesChange = (e) => {
      setMFourCharges(e.target.value);
    };
  
    const handleM4ResultatChange = (e) => {
      setMFourResultat(e.target.value);
    };
  
    const handleM4TransactionsChange = (e) => {
      setMFourTransactions(e.target.value);
    };
    // ***********FIN DE LA BONNE PARTIE*******************


    // ENVOIES DES DONNEES DES INFORMATIONS FINANCIERES (Annuelle) 
  const addFinancialInformationAnnual = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);

    // Combiner les données du formulaire de différentes sections
    
    try {
        // Prepare data
        const dataa = {
          period: "Annuelle",
          periodOneCa: mOneCa,
          periodOneCharges: mOneCharges,
          periodOneResultat: mOneResultat,
          periodOneTransactions: mOneTransactions,
          periodTwoCa: mTwoCa,
          periodTwoCharges: mTwoCharges,
          periodTwoResultat: mTwoResultat,
          periodTwoTransactions: mTwoTransactions,
          periodThreeCa: mThreeCa,
          periodThreeCharges: mThreeCharges,
          periodThreeResultat: mThreeResultat,
          periodThreeTransactions: mThreeTransactions,
          periodFourCa: mFourCa,
          periodFourCharges: mFourCharges,
          periodFourResultat: mFourResultat,
          periodFourTransactions: mFourTransactions
        };
      
      
        const token = localStorage.getItem('tokenEnCours') //Le token récuperé

        // Envoyer une requête POST en utilisant fetch
        const response = await fetch(`${API_URL}/api/kyc/business/add-kyc-financial-information`, {
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
                    Router.push("/profil/kyc/entreprise/information-financiere-three"); 
                }
            }, 5000)
        }
        // Fin condition 
                
    } catch (error) {
        setIsLoggingIn(false);
    }
  };
  // FIN

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
                    <br/><br/><h1 className='text-center'>Autre information financière et transactions 3</h1>
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
                        <h4>Information financière sur les 4 dernières années</h4>
                        {/* FORM A */}
                        <form onSubmit={addFinancialInformationAnnual}>
                            {/* PARTIE N1 */}
                            <label className='mt-3'><b>N-1</b></label><br/>
                            <label>
                                CA mensuel :
                                <select 
                                    value={m1Ca} 
                                    onChange={handleM1CaChange}
                                >
                                    <option value="">Sélectionner un élément</option>
                                    <option value="CA < 10.000.000 FCFA (15.000€)">CA &lt; 10.000.000 FCFA (15.000€)</option>
                                    <option value="1O.000.000 FCFA < CA < 65.000.000FCFA">1O.000.000 FCFA &lt; CA &lt; 65.000.000FCFA</option>
                                    <option value="CA > 65.900.000FCFA (100.000 €)">CA &gt; 65.900.000FCFA (100.000 €)</option>
                                </select>
                            </label>

                            <label className="mt-3">
                                Charges mensuelles :
                                <select value={m1Charges} onChange={handleM1ChargesChange}>
                                <option value="">Sélectionner un élément</option>
                                <option value="Charges< 10%CA">Charges &lt; 10%CA</option>
                                <option value="10%CA<Charges<50% CA">10%CA &lt; Charges &lt; 50%CA</option>
                                <option value="50%CA<Charges<100%CA">50%CA &lt; Charges &lt; 100%CA</option>
                                <option value="Charges > CA">Charges &gt; CA</option>
                                </select>
                            </label>

                            <label className="mt-3">
                                Résultat net Mensuel (%CA) :
                                <select value={m1Resultat} onChange={handleM1ResultatChange}>
                                <option value="">Sélectionner un élément</option>
                                <option value="Résultat<0">Résultat &lt; 0</option>
                                <option value="0<Résultat<10% CA">0 &lt; Résultat &lt; 10% CA</option>
                                <option value="10%CA<Résultat<20%CA">10%CA &lt; Résultat &lt; 20%CA</option>
                                <option value="Résultat > 20%CA">Résultat &gt; 20%CA</option>
                                </select>
                            </label>

                            <label className="mt-3">
                                Nombre moyen de transactions mensuelles financières (bancaires) :
                                <select value={m1Transactions} onChange={handleM1TransactionsChange}>
                                <option value="">Sélectionner un élément</option>
                                <option value="0">0</option>
                                <option value="1&lt;transactions&lt;10">1 &lt; transactions &lt; 10</option>
                                <option value="10&lt;transactions&lt;50">10 &lt; transactions &lt; 50</option>
                                <option value="Transactions > 51">Transactions &gt; 51</option>
                                </select>
                            </label>
                            {/* FIN PARTIE N1 */}


                            {/* PARTIE N2 */}
                            <label className='mt-3'><b>N-2</b></label><br/>
                            <label>
                                CA mensuel :
                                <select value={m2Ca} onChange={handleM2CaChange}>
                                <option value="">Sélectionner un élément</option>
                                <option value="CA < 10.000.000 FCFA (15.000€)">CA &lt; 10.000.000 FCFA (15.000€)</option>
                                <option value="1O.000.000 FCFA < CA < 65.000.000FCFA">1O.000.000 FCFA &lt; CA &lt; 65.000.000FCFA</option>
                                <option value="CA > 65.900.000FCFA (100.000 €)">CA &gt; 65.900.000FCFA (100.000 €)</option>
                                </select>
                            </label>

                            <label className='mt-3'>
                                Charges mensuelles :
                                <select value={m2Charges} onChange={handleM2ChargesChange}>
                                <option value="">Sélectionner un élément</option>
                                <option value="Charges< 10%CA">Charges &lt; 10%CA</option>
                                <option value="10%CA<Charges<50% CA">10%CA &lt; Charges &lt; 50%CA</option>
                                <option value="50%CA<Charges<100%CA">50%CA &lt; Charges &lt; 100%CA</option>
                                <option value="Charges > CA">Charges &gt; CA</option>
                                </select>
                            </label>

                            <label className='mt-3'>
                                Résultat net Mensuel (%CA) :
                                <select value={m2Resultat} onChange={handleM2ResultatChange}>
                                <option value="">Sélectionner un élément</option>
                                <option value="Résultat<0">Résultat &lt; 0</option>
                                <option value="0<Résultat<10% CA">0 &lt; Résultat &lt; 10% CA</option>
                                <option value="10%CA<Résultat<20%CA">10%CA &lt; Résultat &lt; 20%CA</option>
                                <option value="Résultat > 20%CA">Résultat &gt; 20%CA</option>
                                </select>
                            </label>

                            <label className='mt-3'>
                                Nombre moyen de transactions mensuelles financières (bancaires) :
                                <select value={m2Transactions} onChange={handleM2TransactionsChange}>
                                <option value="">Sélectionner un élément</option>
                                <option value="0">0</option>
                                <option value="1&lt;transactions&lt;10">1 &lt; transactions &lt; 10</option>
                                <option value="10&lt;transactions&lt;50">10 &lt; transactions &lt; 50</option>
                                <option value="Transactions > 51">Transactions &gt; 51</option>
                                </select>
                            </label>
                            {/* FIN PARTIE N2 */}


                            {/* PARTIE N3 */}
                            <label className='mt-3'><b>N-3</b></label><br/>
                            <label>
                                CA mensuel :
                                <select value={m3Ca} onChange={handleM3CaChange}>
                                <option value="">Sélectionner un élément</option>
                                <option value="CA < 10.000.000 FCFA (15.000€)">CA &lt; 10.000.000 FCFA (15.000€)</option>
                                <option value="1O.000.000 FCFA < CA < 65.000.000FCFA">1O.000.000 FCFA &lt; CA &lt; 65.000.000FCFA</option>
                                <option value="CA > 65.900.000FCFA (100.000 €)">CA &gt; 65.900.000FCFA (100.000 €)</option>
                                </select>
                            </label>
                            <label className='mt-3'>
                                Charges mensuelles :
                                <select value={m3Charges} onChange={handleM3ChargesChange}>
                                <option value="">Sélectionner un élément</option>
                                <option value="Charges< 10%CA">Charges &lt; 10%CA</option>
                                <option value="10%CA<Charges<50% CA">10%CA &lt; Charges &lt; 50%CA</option>
                                <option value="50%CA<Charges<100%CA">50%CA &lt; Charges &lt; 100%CA</option>
                                <option value="Charges > CA">Charges &gt; CA</option>
                                </select>
                            </label>

                            <label className='mt-3'>
                                Résultat net Mensuel (%CA) :
                                <select value={m3Resultat} onChange={handleM3ResultatChange}>
                                <option value="">Sélectionner un élément</option>
                                <option value="Résultat<0">Résultat &lt; 0</option>
                                <option value="0<Résultat<10% CA">0 &lt; Résultat &lt; 10% CA</option>
                                <option value="10%CA<Résultat<20%CA">10%CA &lt; Résultat &lt; 20%CA</option>
                                <option value="Résultat > 20%CA">Résultat &gt; 20%CA</option>
                                </select>
                            </label>

                            <label className='mt-3'>
                                Nombre moyen de transactions mensuelles financières (bancaires) :
                                <select value={m3Transactions} onChange={handleM3TransactionsChange}>
                                <option value="">Sélectionner un élément</option>
                                <option value="0">0</option>
                                <option value="1&lt;transactions&lt;10">1 &lt; transactions &lt; 10</option>
                                <option value="10&lt;transactions&lt;50">10 &lt; transactions &lt; 50</option>
                                <option value="Transactions > 51">Transactions &gt; 51</option>
                                </select>
                            </label>
                            {/* FIN PARTIE N3 */}


                            {/* PARTIE N4 */}
                            <label className='mt-3'><b>N-4</b></label><br/>
                            <label>
                                CA mensuel :
                                <select value={m4Ca} onChange={handleM4CaChange}>
                                <option value="">Sélectionner un élément</option>
                                <option value="CA < 10.000.000 FCFA (15.000€)">CA &lt; 10.000.000 FCFA (15.000€)</option>
                                <option value="1O.000.000 FCFA < CA < 65.000.000FCFA">1O.000.000 FCFA &lt; CA &lt; 65.000.000FCFA</option>
                                <option value="CA > 65.900.000FCFA (100.000 €)">CA &gt; 65.900.000FCFA (100.000 €)</option>
                                </select>
                            </label>

                            <label className='mt-3'>
                                Charges mensuelles :
                                <select value={m4Charges} onChange={handleM4ChargesChange}>
                                <option value="">Sélectionner un élément</option>
                                <option value="Charges< 10%CA">Charges &lt; 10%CA</option>
                                <option value="10%CA<Charges<50% CA">10%CA &lt; Charges &lt; 50%CA</option>
                                <option value="50%CA<Charges<100%CA">50%CA &lt; Charges &lt; 100%CA</option>
                                <option value="Charges > CA">Charges &gt; CA</option>
                                </select>
                            </label>

                            <label className='mt-3'>
                                Résultat net Mensuel (%CA) :
                                <select value={m4Resultat} onChange={handleM4ResultatChange}>
                                <option value="">Sélectionner un élément</option>
                                <option value="Résultat<0">Résultat &lt; 0</option>
                                <option value="0<Résultat<10% CA">0 &lt; Résultat &lt; 10% CA</option>
                                <option value="10%CA<Résultat<20%CA">10%CA &lt; Résultat &lt; 20%CA</option>
                                <option value="Résultat > 20%CA">Résultat &gt; 20%CA</option>
                                </select>
                            </label>

                            <label className='mt-3'>
                                Nombre moyen de transactions mensuelles financières (bancaires) :
                                <select value={m4Transactions} onChange={handleM4TransactionsChange}>
                                <option value="">Sélectionner un élément</option>
                                <option value="0">0</option>
                                <option value="1&lt;transactions&lt;10">1 &lt; transactions &lt; 10</option>
                                <option value="10&lt;transactions&lt;50">10 &lt; transactions &lt; 50</option>
                                <option value="Transactions > 51">Transactions &gt; 51</option>
                                </select>
                            </label>
                            {/* FIN PARTIE M3 */}


                            {/* <button type="submit">Soumettre</button> */}

                            <div className="form-group mb-6 mt-3 col-lg-12 col-md-12  row justify-content-between">
                                    <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">
                                      <Link href='/profil/kyc/entreprise/information-financiere-two/' className="align-right">
                                            <a
                                            className=""
                                            >
                                                <button className="btn btn-primary " type='button'> Précédente </button>
                                            </a>   
                                      </Link>
                                    </div>
                                    <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">
                                        <Link href='/profil/kyc/entreprise/information-financiere-four/' className="align-right">
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

export default CIformationFinanciereThree;
