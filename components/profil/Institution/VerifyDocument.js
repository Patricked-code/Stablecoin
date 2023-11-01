import { useRef, useState, useEffect } from 'react';
import { Container, Row, Col, Collapse, Button, Modal,Form } from "react-bootstrap";

import React from "react";
import axios from 'axios';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import moment from 'moment';


// Pour l'importation du scanner
import dynamic from 'next/dynamic';

const QrScannerWithNoSSR = dynamic(() => import('react-qr-scanner'), {
  ssr: false,
});
// Finn scanner

// PARTIE IMPORTATTION DES MODULES POUR AGRANDIR LES IMAGES
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import MapComponent from '../../CarteEmplacement/MapComponent';
// Fin



const VerifyDocuments = () => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API

    const [isLoggingIn, setIsLoggingIn] = useState(false);

  // const position = [parseFloat(oneKycForParticular?.latitude), parseFloat(oneKycForParticular?.longiitude)];

    // States recherche de d'un utilisateur
    const [infosOtherUser, setInfosOtherUser] = useState();
    const [emailOtherUser, setEmailOtherUser] = useState();
    const [codeOtherUser, setCodeOtherUser] = useState();
    
    const [reasonFiling, setReasonFiling] = useState();
    const [fundsOrigin, setFundsOrigin] = useState();
    
    const [showInfoUser, setShowInfoUser] = useState();

    // states de kyc
    const [oneKycForParticular, setOneKycForParticular] = useState();

    
    // Formulaire du Modal Transfert
    const [montantEnvoyer, setMontantEnvoyer] = useState(0);
    const [addressTo, setAddressTo] = useState();
    const [montantRecu, setMontantRecu] = useState(0);
    const [percent, setPercent] = useState(1);



     // Calcule des frais de transaction
     const frais = montantEnvoyer*percent/100
     const montantRecevoir =  montantEnvoyer - frais 
     // Fin


    // La fonction qui vérifie si un lien est un lien pdf
    function isPdfLink(link) {
      return link.endsWith('.pdf');
    }
    // States de tab
    const [toggleState, setToggleState] = useState(1);
    const toggleTab = (index) => {
        setToggleState(index);
    };
    // Fin


        // Obtenir un utilisateur en fonction de son email 
        const searchUserWithEmail = () =>{
          if (emailOtherUser) {
            const getUser = async (_emailOtherUser) => {
            
                const result = await fetch(`${API_URL}/api/user/find-user-by-email?email=${_emailOtherUser}`, {
                    headers: {
                    'Content-Type': 'application/json',
                    },
                })
                    .then((result) => result.json())
                    .then((user) => {
                      setInfosOtherUser(user)

            
                    }) 
            
                };
                
                  getUser(emailOtherUser);
              
          }
        }
        // FIN
    
         // Obtenir un utilisateur en fonction de son adresse blockchain
         const searchUserWithBlockchain = () =>{
          if (addressTo) {
            const getUser = async (_addressTo) => {
            
                const result = await fetch(`${API_URL}/api/user/find-user-by-addrBlockchain?address=${_addressTo}`, {
                    headers: {
                    'Content-Type': 'application/json',

                    },
                })
                    .then((result) => result.json())
                    .then((user) => {
                      setInfosOtherUser(user)
                      console.log("InfosOtherUser=>",user)
            
                    }) 
            
                };
                
                  getUser(addressTo);
              
          }
        }
        // FIN
    
         // Obtenir un utilisateur en fonction de son Identifiant
         const searchUserWithIdentifiant = () =>{
          if (codeOtherUser) {
            const getUser = async (_codeOtherUser) => {
                const result = await fetch(`${API_URL}/api/user/find-user-by-userCode?code=${_codeOtherUser}`, {
                    headers: {
                    'Content-Type': 'application/json',
                    },
                })
                    .then((result) => result.json())
                    .then((user) => {
                      setInfosOtherUser(user)

            
                    }) 
            
                };
                
                  getUser(codeOtherUser);
              
          }
        }
        // FIN
        
        const handleSubmit = (e) => {
          e.preventDefault()
      
        }
        // Fin


   // ************************************************************************
    // PARTIE SCANNER DU QR CODE
  // *************************************************************************
  const qrScannerRef = useRef(null);
  const [showScanner, setShowScanner] = useState();
  const [showInput, setShowInput] = useState();

  const handleScan = (data) => {
    if (data) {
      setAddressTo(data?.text);
      // searchUserWithBlockchain() //Appel automatique de la fonction de recherche des informations apres avoir scanné le qr code 

    }
  };

  const handleError = (error) => {
    console.error(error);
  };
  // *****************************FIN SCANNER*****************************

  // RECUPERER UNE SEULE LIGNE DE KYC DU PARTICULIER D'UN UTILISATEUR EN FONCTION DE SON ID
  if (infosOtherUser?.id) {
    
    const getOneKycForParticular = async (_userId) => {
      // Obtenir le token en cours
      const token = localStorage.getItem('tokenEnCours');
      try {
        const resKyc = await fetch(`${API_URL}/api/kyc/particular/find-one-kyc-particular-by-userId?userId=${_userId}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization:  `Bearer ${token}`

          },
        });
  
        if (!resKyc.ok) {
          throw new Error('Failed to fetch KYC data');
        }
  
        const data = await resKyc.json();
        setOneKycForParticular(data);
      } catch (error) {
        // Handle errors appropriately, e.g., set an error state.
        console.error('Error fetching KYC data:', error);
      }
    };
  
    getOneKycForParticular(infosOtherUser?.id);
}
// FIN












// FONCTION POUR VIDER DES CHAMPS QUAND ON CLIQUE SUR LE BOUTON EMAIL, ADRESSE BLOCKCHAIN ET IDENTIFAINT
const dumpVariables = () =>{
  setInfosOtherUser("")
  setAddressTo("")
  setEmailOtherUser("")
  setCodeOtherUser("")
  setReasonFiling("") 
  setFundsOrigin("")
}


// PARTIE POUR AGRANDIR LES IMAGES
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const images = [
      oneKycForParticular?.frontReceiptPhoto,
      `${API_URL}/${oneKycForParticular?.frontReceipt}`,
      oneKycForParticular?.backReceiptPhoto,
      `${API_URL}/${oneKycForParticular?.backReceipt}`
  ];
  const handleClickImage = (index) => {
      setLightboxOpen(true);
      setLightboxIndex(index);
  };
// FIN PARTIE POUR AGRANDIR LES IMAGES

// FONCTION POUR FORMATER LA DATE
const formatDate = (_updatedAt) =>{
  const maDate = moment(_updatedAt).format('DD/MM/YYYY');
  return  maDate
}
//  FIN

  return (
    <>

        <div className='' >
            <div className=' mx-15'>
                <div className='py-10'>
                    <h3 className='text-center'>Vérifications des documents</h3>
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
                    
                    <div className="bloc-tabs-utilite">
                    <button
                      className={toggleState === 1 ? "tabs active-tabs gr-text-8 text-color-opacity" : "tabs gr-text-8 text-color-opacity"}
                      onClick={() => toggleTab(1)}
                    >
                      <p onClick={dumpVariables}>Adresse Blockchain</p>
                    </button>

                    <button
                    className={toggleState === 2 ? "tabs active-tabs  gr-text-8 text-color-opacity" : "tabs  gr-text-8 text-color-opacity"}
                    onClick={() => toggleTab(2)}
                    >
                      <p onClick={dumpVariables}>Adresse email</p>
                    </button>

                    <button
                    className={toggleState === 3 ? "tabs active-tabs  gr-text-8 text-color-opacity" : "tabs  gr-text-8 text-color-opacity"}
                    onClick={() => toggleTab(3)}
                    >
                      <p onClick={dumpVariables}>Identifiant</p>
                    </button>
                  </div>

                  <div className="content-tabs">
                    <div
                    className={toggleState === 1 ? "content  active-content" : "content"}
                    >
                     {/* Formulaire de la partie avec adresse blockchain  */}
                     <form onSubmit={handleSubmit}>
                        <div className="form-group my-6 ">

                          <div className='row'>
                            <div className='col-lg-6 col-md-6' onClick={()=>setShowInput(0)}>
                              <p onClick={()=>setAddressTo("")}>
                                <button className='my-3' onClick={()=>setShowScanner(1)} disabled={isLoggingIn}>cliquez ici pour scanner le QR code du recepteur</button>
                              </p>
                            </div>
                              
                            <div className='col-lg-6 col-md-6' onClick={()=>setShowScanner(0)}>
                              <p  onClick={()=>setAddressTo("")}>
                              <button className='my-3' onClick={()=>setShowInput(1)} disabled={isLoggingIn}>cliquez ici pour saisir l'adresse blockchain du recepteur</button>
                              </p>
                            </div>
                            {showScanner==1 && showInput==0? (
                              <>
                                {!addressTo? (
                                  <>
                                    <div className='col-lg-3 col-md-3'></div>
                                    <div className='col-lg-6 col-md-6'>
                                    
                                      
                                        <QrScannerWithNoSSR
                                          ref={qrScannerRef}
                                          onScan={handleScan}
                                          onError={handleError}
                                          style={{ width: '100%', height: 'auto' }}
                                        />
                                      
                                    </div>
                                    <div className='col-lg-3 col-md-3'></div>
                                </>
                                ):(
                                  <div className="input-group ">
                                    <input
                                        className="form-control gr-text-11 border mt-3 bg-white"
                                        type="text"
                                        id="addressTo"
                                        disabled
                                        placeholder="Entrez adresse bockchain du recepteur"
                                        required
                                        value={addressTo} 
                                    />
                                  </div>
                                )}
                              </>
                            ) : ("")}
                          </div>
                          
                          
                          {showScanner==0 && showInput==1 ? (
                            <>
                              <label
                                htmlFor="montant"
                                className="gr-text-8 fw-bold text-blackish-blue"
                              >
                                Entrez adresse bockchain du recepteur <sup className="text-red">*</sup>

                              </label>
                              <div className="input-group flex-nowrap">
                                <input
                                    className="form-control gr-text-11 border mt-3 bg-white"
                                    type="text"
                                    id="addressTo"
                                    placeholder="Entrez adresse bockchain du recepteur"
                                    required
                                    defaultValue={addressTo} 
                                    onChange={(event)=>setAddressTo(event.target.value)}
                                    
                                />
                                {/* <span className="gr-text-8 mx-2" id="addon-wrapping">
                                  <button onClick={searchUserWithBlockchain} disabled={isLoggingIn}><Icon  icon="bx:search-alt"  />
                                  </button>
                                </span> */}

                              </div>
                            </>
                          ) : ("")}

                          <div className='row mt-3'>
                                <div className="form-group mb-6 col-lg-6 col-md-6">
                                  <label
                                    htmlFor="motif"
                                    className="gr-text-8 fw-bold text-blackish-blue "
                                  >
                                    Motif du dépôt <sup className="text-red">*</sup>
                                  </label>
                                  <select 
                                    className="form-control mt-3"
                                    id="motif"
                                    required
                                    defaultValue={reasonFiling} 
                                    onChange={(event)=>setReasonFiling(event.target.value)}
                                  >
                                    <option defaultValue="">Motif du dépôt</option>
                                      <optgroup className='single-cryptocurrency-box'>
                                        <option  value="Assistance familiale/Frais de subsistence">Assistance familiale/Frais de subsistence</option>
                                        <option  value="Epargne/Investissements">Epargne/Investissements</option>
                                        <option  value="Cadeau">Cadeau</option>
                                        <option  value="Paiement de biens et de services">Paiement de biens et de services </option>
                                        <option  value="Loyer/Hypothèque">Loyer/Hypothèque </option>
                                        <option  value="Urgence/Assistance médicale ">Urgence/Assistance médicale </option>
                                        <option  value="Organisme de bienfaisance/Paiement d’aide ">Organisme de bienfaisance/Paiement d’aide </option>
                                        <option  value="Frais relatifs à une loterie ou un prix/Impôts ">Frais relatifs à une loterie ou un prix/impôts </option>
                                        <option  value="Paie des employés/Frais des employés">Paie des employés/Frais des employés </option>
                                        <option  value="Autre ">Autre </option>
                                      </optgroup>
                                  </select>
                                </div>

                                <div className="form-group mb-6 col-lg-6 col-md-6">
                                  <label
                                    htmlFor="origine"
                                    className="gr-text-8 fw-bold text-blackish-blue "
                                  >
                                    Origine des fonds <sup className="text-red">*</sup>
                                  </label>
                                  <select 
                                    className="form-control mt-3"
                                    id="origine"
                                    required
                                    defaultValue={fundsOrigin} 
                                    onChange={(event)=>setFundsOrigin(event.target.value)}
                                  >
                                    <option defaultValue="">Origine des fonds</option>
                                      <optgroup className='single-cryptocurrency-box'>
                                        <option  value="Salaire/Revenus">Salaire/Revenus</option>
                                        <option  value="Prêt/Emprunt">Prêt/Emprunt</option>
                                        <option  value="Cadeau">Cadeau</option>
                                        <option  value="Pension/Allocations publique/Aide sociale">Pension/Allocations publique/Aide sociale</option>
                                        <option  value="Héritage">Héritage </option>
                                        <option  value="Dons de bienfaisance ">Dons de bienfaisance</option>
                                        <option  value="Autre ">Autre </option>
                                      </optgroup>
                                  </select>
                                </div>
                              </div>
                      
                              {addressTo && reasonFiling && fundsOrigin ? (
                                <Row className="my-3 justify-content-center align-items-center">
                                  <Col
                                      xs="6"
                                      md="6"
                                      lg="6"
                                      xl="6"
                                    className="order-lg-1 text-center"
                                    onClick={()=>setShowInfoUser(1)}
                                    
                                  >
                                  <Button variant="success" onClick={searchUserWithBlockchain}  className="text-white" >
                                      Vérifier
                                  </Button>
                                  </Col>
                                </Row>
                              ) : ("")}
                        </div>
                        
                      </form>
                    </div>




                    <div
                    className={toggleState === 2 ? "content  active-content" : "content"}
                    >
                     {/* Formulaire de la partie avec adresse email  */}
                    <form onSubmit={handleSubmit}>
                      <div className="form-group mb-6">
                        <label
                          htmlFor="pays"
                          className="gr-text-8 fw-bold text-blackish-blue "
                        >
                          Adresse email du bénéficiaire <sup className="text-red">*</sup>
                        </label>
                        <input
                          className="form-control gr-text-11 border mt-3 bg-white"
                          type="email"
                          id="contact"
                          placeholder="Adresse email du bénéficiaire"
                          required
                          defaultValue={emailOtherUser} 
                          onChange={(event)=>setEmailOtherUser(event.target.value)}
                        />
                      </div>

                      <div className='row'>
                        <div className="form-group mb-6 col-lg-6 col-md-6">
                          <label
                            htmlFor="motif"
                            className="gr-text-8 fw-bold text-blackish-blue "
                          >
                            Motif du dépôt <sup className="text-red">*</sup>
                          </label>
                          <select 
                            className="form-control mt-3"
                            id="motif"
                            required
                            defaultValue={reasonFiling} 
                            onChange={(event)=>setReasonFiling(event.target.value)}
                          >
                            <option defaultValue="">Motif du dépôt</option>
                              <optgroup className='single-cryptocurrency-box'>
                                <option  value="Assistance familiale/Frais de subsistence">Assistance familiale/Frais de subsistence</option>
                                <option  value="Epargne/Investissements">Epargne/Investissements</option>
                                <option  value="Cadeau">Cadeau</option>
                                <option  value="Paiement de biens et de services">Paiement de biens et de services </option>
                                <option  value="Loyer/Hypothèque">Loyer/Hypothèque </option>
                                <option  value="Urgence/Assistance médicale ">Urgence/Assistance médicale </option>
                                <option  value="Organisme de bienfaisance/Paiement d’aide ">Organisme de bienfaisance/Paiement d’aide </option>
                                <option  value="Frais relatifs à une loterie ou un prix/Impôts ">Frais relatifs à une loterie ou un prix/Impôts </option>
                                <option  value="Paie des employés/Frais des employés">Paie des employés/Frais des employés </option>
                                <option  value="Autre ">Autre </option>
                              </optgroup>
                          </select>
                        </div>

                        <div className="form-group mb-6 col-lg-6 col-md-6">
                          <label
                            htmlFor="origine"
                            className="gr-text-8 fw-bold text-blackish-blue "
                          >
                            Origine des fonds <sup className="text-red">*</sup>
                          </label>
                          <select 
                            className="form-control mt-3"
                            id="origine"
                            required
                            defaultValue={fundsOrigin} 
                            onChange={(event)=>setFundsOrigin(event.target.value)}
                          >
                            <option defaultValue="">Origine des fonds</option>
                              <optgroup className='single-cryptocurrency-box'>
                                <option  value="Salaire/Revenus">Salaire/Revenus</option>
                                <option  value="Prêt/Emprunt">Prêt/Emprunt</option>
                                <option  value="Cadeau">Cadeau</option>
                                <option  value="Pension/Allocations publique/Aide sociale">Pension/Allocations publique/Aide sociale</option>
                                <option  value="Héritage">Héritage </option>
                                <option  value="Dons de bienfaisance ">Dons de bienfaisance</option>
                                <option  value="Autre ">Autre </option>
                              </optgroup>
                          </select>
                        </div>
                      </div>
                      
                      {emailOtherUser && reasonFiling && fundsOrigin ? (
                      <Row className="my-3 justify-content-center align-items-center">
                        <Col
                            xs="6"
                            md="6"
                            lg="6"
                            xl="6"
                          className="order-lg-1 text-center"
                          onClick={()=>setShowInfoUser(2)}
                          
                        >
                        <Button variant="success" onClick={searchUserWithEmail} className="text-white" >
                            Vérifier
                        </Button>
                        </Col>
                      </Row>
                      ):("")}
                    </form>
                    </div>




                    <div
                    className={toggleState === 3 ? "content  active-content" : "content"}
                    >
                     {/* Formulaire de la partie avec identifiant  */}
                    <form onSubmit={handleSubmit}>
                      <div className="form-group mb-6">
                        <label
                          htmlFor="identifiant"
                          className="gr-text-8 fw-bold text-blackish-blue "
                        >
                          Identifiant du bénéficiaire <sup className="text-red">*</sup>
                        </label>
                        <input
                          className="form-control gr-text-11 border mt-3 bg-white"
                          type="text"
                          id="identifiant"
                          placeholder="Identifiant du bénéficiaire"
                          required
                          defaultValue={codeOtherUser} 
                          onChange={(event)=>setCodeOtherUser(event.target.value)}
                        />
                      </div>

                      <div className='row'>
                        <div className="form-group mb-6 col-lg-6 col-md-6">
                          <label
                            htmlFor="motif"
                            className="gr-text-8 fw-bold text-blackish-blue "
                          >
                            Motif du dépôt <sup className="text-red">*</sup>
                          </label>
                          <select 
                            className="form-control mt-3"
                            id="motif"
                            required
                            defaultValue={reasonFiling} 
                            onChange={(event)=>setReasonFiling(event.target.value)}
                          >
                            <option defaultValue="">Motif du dépôt</option>
                              <optgroup className='single-cryptocurrency-box'>
                                <option  value="Assistance familiale/Frais de subsistence">Assistance familiale/Frais de subsistence</option>
                                <option  value="Epargne/Investissements">Epargne/Investissements</option>
                                <option  value="Cadeau">Cadeau</option>
                                <option  value="Paiement de biens et de services">Paiement de biens et de services </option>
                                <option  value="Loyer/Hypothèque">Loyer/Hypothèque </option>
                                <option  value="Urgence/Assistance médicale ">Urgence/Assistance médicale </option>
                                <option  value="Organisme de bienfaisance/Paiement d’aide ">Organisme de bienfaisance/Paiement d’aide </option>
                                <option  value="Frais relatifs à une loterie ou un prix/Impôts ">Frais relatifs à une loterie ou un prix/Impôts </option>
                                <option  value="Paie des employés/Frais des employés">Paie des employés/Frais des employés </option>
                                <option  value="Autre ">Autre </option>
                              </optgroup>
                          </select>
                        </div>

                        <div className="form-group mb-6 col-lg-6 col-md-6">
                          <label
                            htmlFor="origine"
                            className="gr-text-8 fw-bold text-blackish-blue "
                          >
                            Origine des fonds <sup className="text-red">*</sup>
                          </label>
                          <select 
                            className="form-control mt-3"
                            id="origine"
                            required
                            defaultValue={fundsOrigin} 
                            onChange={(event)=>setFundsOrigin(event.target.value)}
                          >
                            <option defaultValue="">Origine des fonds</option>
                              <optgroup className='single-cryptocurrency-box'>
                                <option  value="Salaire/Revenus">Salaire/Revenus</option>
                                <option  value="Prêt/Emprunt">Prêt/Emprunt</option>
                                <option  value="Cadeau">Cadeau</option>
                                <option  value="Pension/Allocations publique/Aide sociale">Pension/Allocations publique/Aide sociale</option>
                                <option  value="Héritage">Héritage </option>
                                <option  value="Dons de bienfaisance ">Dons de bienfaisance</option>
                                <option  value="Autre ">Autre </option>
                              </optgroup>
                          </select>
                        </div>
                      </div>

                      {codeOtherUser && reasonFiling && fundsOrigin ? (
                        <Row className="my-3 justify-content-center align-items-center">
                          <Col
                              xs="6"
                              md="6"
                              lg="6"
                              xl="6"
                            className="order-lg-1 text-center"
                            onClick={()=>setShowInfoUser(3)}
                          >
                            <Button className="text-white " onClick={searchUserWithIdentifiant} variant="success" >
                                  Vérifier
                              </Button>
                          </Col>
                        </Row>
                      ):("")}
                    </form>
                    </div>
                  </div>
 
                    </div>
                <div className='col-lg-3 col-md-12'></div>
            </div>
            

            {/* AFFICHAGE DES INFORMATIONS */}
            {infosOtherUser? (
              <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                <div className='cryptocurrency-slides'>
                  <div className='single-cryptocurrency-box'>

                    {/* AFFICHAGE DES TEXTES */}
                    <div className={toggleState === 3}>

                    {infosOtherUser?.entreprise ? (
                        // <p className="gr-text-8 " id="addon-wrapping">
                        //       Nom de l'entreprise : {infosOtherUser?.entreprise}
                        // </p>
                        <p className="gr-text-8 colorRed text-center" >Les informations correspondantes sont pour l'entreprise {infosOtherUser?.entreprise} </p>

                      ) : (infosOtherUser?.firstName && infosOtherUser?.lastName && infosOtherUser?.codeTypeProfil=="part"?
                        (
                          <>
                            {!oneKycForParticular?.message ?(
                              <>
                                {oneKycForParticular?.validQuiz==1 && oneKycForParticular?.validQuizTwo==1 && oneKycForParticular?.validQuizFatca==1 && oneKycForParticular?.validIdentityOne==1 && oneKycForParticular.validPhotoWithDocument && oneKycForParticular?.validIdentity==1 && oneKycForParticular?.validResidence==1 && oneKycForParticular?.validPhoto==1 && oneKycForParticular?.validSignature==1 ?(
                                  <>
                                    <div className='row'>
                                      <div className='col-lg-6 col-md-6'>
                                          <b> Nom :</b><br/>
                                          {infosOtherUser?.firstName? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{infosOtherUser.firstName }</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                      </div>
                                                          
                                      <div className='col-lg-6 col-md-6'>
                                          <b> Prénoms :</b><br/>
                                          {infosOtherUser?.lastName? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{infosOtherUser.lastName }</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                      </div>
                                      <div className='col-lg-6 col-md-6 '>
                                          <b> Type de justificatif d'identité :</b><br/>
                                          {oneKycForParticular?.receiptType? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForParticular.receiptType }</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                      </div>

                                      <div className='col-lg-6 col-md-6 '>
                                          <b> Numéro du justificatif d'identité :</b><br/>
                                          {oneKycForParticular?.pieceNumber? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForParticular.pieceNumber }</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                      </div>

                                      <div className='col-lg-6 col-md-6 '>
                                          <b> Date de validité :</b><br/>
                                          {oneKycForParticular?.validityDate? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{formatDate(oneKycForParticular.validityDate) }</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                      </div>
                                    </div>

                                     {/* AFFICHAGE DES FICHIERS */}
                                    <div className=" row col-lg-12 col-md-12 justify-content-between">
                                      <div className='col-lg-6 col-md-6 text-center'>
                                          <b className='text-center'>Recto</b><br/>
                                          {/* Si le document est prise en photo */}
                                          {oneKycForParticular?.frontReceiptPhoto? 
                                                  <img src={oneKycForParticular?.frontReceiptPhoto} className="" width={'400'} height={'400'} alt="Recto"/> : 
                                                  // sinon
                                                  oneKycForParticular?.frontReceipt? (
                                                      <>
                                                          {/* Utilisation de la fonction isPdfLink pour vérifier si un lien est pour un fichier PDF */}
                                                          {isPdfLink(`${API_URL}/${oneKycForParticular?.frontReceipt}`) ? (
                                                              <>
                                                                  <div className="hero-btn  text-center ">
                                                                      <a
                                                                          className="nav-link btn btn-blue nav-link btn btn-outline-green"
                                                                          role="button"
                                                                          data-toggle="dropdown"
                                                                          aria-haspopup="true"
                                                                          aria-expanded="false"
                                                                          href={`${API_URL}/${oneKycForParticular?.frontReceipt}`} 
                                                                          target="_blank"
                                                                      >
                                                                      <p className="gr-text-8 bgColorblue text-white mb-0">
                                                                          <Icon icon="bx:show-alt" width="50" />
                                                                          Veuillez cliquer ici pour voir le fichier
                                                                                          </p>
                                                                      </a>
                                                                  </div>
                                                              </>
                                                          ) : (
                                                              <>
                                                                  <img src={`${API_URL}/${oneKycForParticular?.frontReceipt}`} className="" width={'400'} height={'400'} alt="Recto"/> :
                                                              </>
                                                          )}
                                                      </>
                                                  ):"Pas de recto justificatif"
                                          }
                                                              
                                      </div>

                                      <div className='col-lg-6 col-md-6 text-center'>
                                          <b className='text-center'>Verso</b><br/>
                                          {oneKycForParticular?.backReceiptPhoto? 
                                              <img src={oneKycForParticular?.backReceiptPhoto} className="" width={'400'} height={'400'} alt="Verso"/> : 
                                              oneKycForParticular?.backReceipt? 
                                              (
                                                  <>
                                                  {/* Utilisation de la fonction isPdfLink pour vérifier si un lien est pour un fichier PDF */}
                                                  {isPdfLink(`${API_URL}/${oneKycForParticular?.frontReceipt}`) ? (
                                                      <>
                                                          <div className="hero-btn  text-center ">
                                                              <a
                                                                  className="nav-link btn btn-blue nav-link btn btn-outline-green"
                                                                  role="button"
                                                                  data-toggle="dropdown"
                                                                  aria-haspopup="true"
                                                                  aria-expanded="false"
                                                                  href={`${API_URL}/${oneKycForParticular?.backReceipt}`} 
                                                                  target="_blank"
                                                              >
                                                              <p className="gr-text-8 bgColorblue text-white mb-0">
                                                                  <Icon icon="bx:show-alt" width="50" />
                                                                  Veuillez cliquer ici pour voir le fichier
                                                              </p>
                                                              </a>
                                                          </div>
                                                      </>
                                                  ) : (
                                                      <>
                                                          <img src={`${API_URL}/${oneKycForParticular?.backReceipt}`} className="" width={'400'} height={'400'} alt="Verso"/> 
                                                      </>
                                                  )}
                                              </>
                                              ):"Pas de recto justificatif"
                                          }
                                      </div>

                                      <div className='col-lg-6 col-md-6 text-center my-5'>
                                        <b className='text-center'>Photo</b><br/>
                                        {oneKycForParticular?.userPicture? <img src={oneKycForParticular?.userPicture} alt="Selfie" /> : "Aucune photo"}
                                      </div>

                                      <div className='col-lg-6 col-md-6 text-center my-5'>
                                        <b className='text-center'>Photo avec document d'identité</b><br/>
                                        {oneKycForParticular?.selfieWithDocument? <img src={oneKycForParticular?.selfieWithDocument} alt="Selfie" /> : "Aucune photo avec document"}
                                      </div>

                                      <div className='col-lg-6 col-md-6 text-center my-5'>
                                        <b className='text-center'>Signature</b><br/>
                                        {oneKycForParticular?.userSignature? <img src={oneKycForParticular?.userSignature} alt="Selfie" /> : "Aucune signature"}
                                      </div>

                                      <div className='col-lg-6 col-md-6 text-center my-5'>
                                        
                                        <b className='text-center'>Carte de l'emplacement</b><br/>
                                        {oneKycForParticular?.userSignature?(
                                          <MapComponent className="mb-5" latitude={parseFloat(oneKycForParticular?.latitude)} longitude={parseFloat(oneKycForParticular?.longitude)} />
                                        )
                                        // <Map latitude={parseFloat(oneKycForParticular?.latitude)} longitude={parseFloat(oneKycForParticular?.longitude)} />
                                        : "Aucune Carte de l'emplacemen"}
                                      </div>
                                    </div><br/>
                                
                                    {/* FIN */}
                                    <Row className="mb-5 mt-5 justify-content-center align-items-center ">
                                      <Col
                                          xs="6"
                                          md="6"
                                          lg="6"
                                          xl="6"
                                        className="order-lg-1 text-center"
                                      >
                                        <a href='/profil/institution/depot-cash/'>
                                          <Button  className="text-white" >
                                            Continuer vers le dépôt
                                          </Button>
                                        </a>
                                      </Col>
                                    </Row>
                                  </>
                                ):(<p className="gr-text-8 colorRed text-center">Le Kyc de cet utilisateur n'a pas encore été validé</p>)}
                              </>
                            ):(<p className="gr-text-8 colorRed text-center" id="addon-wrapping">Cet utilisateur n'a pas rempli le Kyc</p>)}
                          </>
                        ) : <p className="gr-text-8 colorRed text-center" id="addon-wrapping">{infosOtherUser?.message}</p>)}
                    </div>
                  </div>
                </div>
              </div>
            ) : ("")}
            {/* FIN */}
        </div>
    </>
  );
};

export default VerifyDocuments;
