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
// Fin

import Map from '../../CarteEmplacement/Map';


const DemandeAccesKyc = () => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API

    const [isLoggingIn, setIsLoggingIn] = useState(false);

    // States recherche de d'un utilisateur
    const [infosOtherUser, setInfosOtherUser] = useState();
    const [emailOtherUser, setEmailOtherUser] = useState();
    const [codeOtherUser, setCodeOtherUser] = useState();

    const [addressTo, setAddressTo] = useState();
    
    const [reasonFiling, setReasonFiling] = useState();
    const [fundsOrigin, setFundsOrigin] = useState();
    
    const [showInfoUser, setShowInfoUser] = useState();

    // states de kyc
    const [oneKycForParticular, setOneKycForParticular] = useState();

    
    // State du formulaire
    const [selectedOption, setSelectedOption] = useState('');


    
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
        console.log("OneKycForParticular=>",data)
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



// PARTIE D'ENVOIE DES DONNEES DE LA DEMANDE DE KYC PARTICULIER
    const [selectedOptions, setSelectedOptions] = useState([]);

    const handleOptionChange = (e) => {
        const value = e.target.value;
        const isChecked = e.target.checked;

        if (isChecked) {
            setSelectedOptions([...selectedOptions, value]);

        } else {
            setSelectedOptions(selectedOptions.filter(option => option !== value));
        }
    };

    // Fonction d'envoie des données
    const requestKycParticular = async (e) => {
        e.preventDefault();
    
        const response = await fetch('/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'Questionnaire AML': selectedOptions.filter(option => option.includes("Questionnaire AML")),
                'Questionnaire FATCA': selectedOptions.filter(option => option.includes("Questionnaire FATCA")),
                "Justificatif d'identité": selectedOptions.filter(option => option.includes("Justificatif d'identité")),
                "Justificatif de domicile": selectedOptions.filter(option => option.includes("Justificatif de domicile")),
                'Photo': selectedOptions.filter(option => option.includes("Photo")),
                'Signature': selectedOptions.filter(option => option.includes("Signature"))
            }),
        });
    
        if (response.ok) {
            console.log('Données enregistrées avec succès');
        } else {
            console.error('Erreur lors de l\'enregistrement des données');
        }
    };
    // FIN 

    // PARTIE D'ENVOIE DES DONNEES DE LA DEMANDE DE KYC ENTREPRISE
    const [selectedOptionsEntreprise, setSelectedOptionsEntreprise] = useState([]);

    const handleOptionChangeEntreprise = (e) => {
        const value = e.target.value;
        const isChecked = e.target.checked;

        if (isChecked) {
            setSelectedOptionsEntreprise([...selectedOptionsEntreprise, value]);
        } else {
            setSelectedOptionsEntreprise(selectedOptionsEntreprise.filter(option => option !== value));
        }
    };

    const handleSubmitEntreprise = async (e) => {
        e.preventDefault();

        const response = await fetch('/submit-entreprise', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'quizBusiness': selectedOptionsEntreprise.filter(option => option.includes("Questionnaire AML")),
                'identtityBusiness': selectedOptionsEntreprise.filter(option => option.includes("Justificatif d'identité")),
                'representives': selectedOptionsEntreprise.filter(option => option.includes("Représentants légaux")),
                'beneficiary': selectedOptionsEntreprise.filter(option => option.includes("Bénéficiaires effectifs")),
                'structures': selectedOptionsEntreprise.filter(option => option.includes("Structures de contrôle")),
                'politicallyExposed': selectedOptionsEntreprise.filter(option => option.includes("Personnes politiquement exposées")),
                'financialOperation': selectedOptionsEntreprise.filter(option => option.includes("Opérations financières")),
                'fundsOrigin': selectedOptionsEntreprise.filter(option => option.includes("Origine des fonds")),
                'financialInformation': selectedOptionsEntreprise.filter(option => option.includes("Informations financières")),
                'financialTransaction': selectedOptionsEntreprise.filter(option => option.includes("Transactions financières")),
                'legalDocument': selectedOptionsEntreprise.filter(option => option.includes("Documents légaux"))
            }),
        });
        if (response.ok) {

            console.log('Données enregistrées avec succès');
        } else {
            console.error('Erreur lors de l\'enregistrement des données');
        }
    };


  return (
    <>

        <div className='' >
            <div className=' mx-15'>
                <div className='py-10'>
                    <h3 className='text-center'>Demande de kyc</h3>
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
                      
                              {addressTo ? (
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
                                      Rechercher
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
                    <form onSubmit={requestKycParticular}>
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
                      
                      {emailOtherUser ? (
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
                            Rechercher
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

                      {codeOtherUser ? (
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
                                  Rechercher
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
                <>
                    <div className='row'>
                        <div className='col-lg-3 col-md-12'></div>
                        <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white col-lg-6 col-md-12">
                            <div className='cryptocurrency-slides'>
                            <div className='single-cryptocurrency-box'>

                                {/* AFFICHAGE DES TEXTES */}
                                <div className={toggleState === 3}>

                                    {infosOtherUser?.codeTypeProfil==="entCom" ? (
                                        <>
                                        {/* // <p className="gr-text-8 " id="addon-wrapping">
                                        //       Nom de l'entreprise : {infosOtherUser?.entreprise}
                                        // </p>
                                            // <p className="gr-text-8 colorRed text-center" >Les informations correspondantes sont pour l'entreprise {infosOtherUser?.entreprise} </p> */}
                                            <div className='mb-3'>
                                                Veuillez demander les parties de KYC de <b> {infosOtherUser?.entreprise} </b> dont vous souhaiterez voir.
                                            </div>

                                            <form onSubmit={handleSubmitEntreprise}>
                                                <div className='form-group'>
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            value="Questionnaire AML"
                                                            className='mx-3'
                                                            checked={selectedOptionsEntreprise.includes("Questionnaire AML")}
                                                            onChange={handleOptionChangeEntreprise}
                                                        />
                                                        Questionnaire AML
                                                    </label>
                                                </div>
                                                <div className='form-group'>
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            value="Justificatif d'identité"
                                                            className='mx-3'
                                                            checked={selectedOptionsEntreprise.includes("Justificatif d'identité")}
                                                            onChange={handleOptionChangeEntreprise}
                                                        />
                                                        Justificatif d'identité
                                                    </label>
                                                </div>
                                                <div className='form-group'>
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            value="Représentants légaux"
                                                            className='mx-3'
                                                            checked={selectedOptionsEntreprise.includes("Représentants légaux")}
                                                            onChange={handleOptionChangeEntreprise}
                                                        />
                                                        Représentants légaux
                                                    </label>
                                                </div>
                                                <div className='form-group'>
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            value="Bénéficiaires effectifs"
                                                            className='mx-3'
                                                            checked={selectedOptionsEntreprise.includes("Bénéficiaires effectifs")}
                                                            onChange={handleOptionChangeEntreprise}
                                                        />
                                                        Bénéficiaires effectifs
                                                    </label>
                                                </div>
                                                <div className='form-group'>
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            value="Structures de contrôle"
                                                            className='mx-3'
                                                            checked={selectedOptionsEntreprise.includes("Structures de contrôle")}
                                                            onChange={handleOptionChangeEntreprise}
                                                        />
                                                        Structures de contrôle
                                                    </label>
                                                </div>
                                                <div className='form-group'>
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            value="Personnes politiquement exposées"
                                                            className='mx-3'
                                                            checked={selectedOptionsEntreprise.includes("Personnes politiquement exposées")}
                                                            onChange={handleOptionChangeEntreprise}
                                                        />
                                                        Personnes politiquement exposées
                                                    </label>
                                                </div>
                                                <div className='form-group'>
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            value="Opérations financières"
                                                            className='mx-3'
                                                            checked={selectedOptionsEntreprise.includes("Opérations financières")}
                                                            onChange={handleOptionChangeEntreprise}
                                                        />
                                                        Opérations financières
                                                    </label>
                                                </div>
                                                <div className='form-group'>
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            value="Origine des fonds"
                                                            className='mx-3'
                                                            checked={selectedOptionsEntreprise.includes("Origine des fonds")}
                                                            onChange={handleOptionChangeEntreprise}
                                                        />
                                                        Origine des fonds
                                                    </label>
                                                </div>
                                                <div className='form-group'>
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            value="Informations financières"
                                                            className='mx-3'
                                                            checked={selectedOptionsEntreprise.includes("Informations financières")}
                                                            onChange={handleOptionChangeEntreprise}
                                                        />
                                                        Informations financières
                                                    </label>
                                                </div>
                                                <div className='form-group'>
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            value="Transactions financières"
                                                            className='mx-3'
                                                            checked={selectedOptionsEntreprise.includes("Transactions financières")}
                                                            onChange={handleOptionChangeEntreprise}
                                                        />
                                                        Transactions financières
                                                    </label>
                                                </div>
                                                <div className='form-group'>
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            value="Documents légaux"
                                                            className='mx-3'
                                                            checked={selectedOptionsEntreprise.includes("Documents légaux")}
                                                            onChange={handleOptionChangeEntreprise}
                                                        />
                                                        Documents légaux
                                                    </label>
                                                </div>
                                                <div className='form-group'>
                                                  <label
                                                        htmlFor="emailNotification"
                                                      className="text-blackish-blue mb-2"
                                                  >
                                                      Votre email de notification
                                                  </label>
                                                  <input
                                                    className="form-control gr-text-11 border mt-3 bg-white"
                                                    type="text"
                                                    id="emailNotification"
                                                    placeholder="Votre email de notification"
                                                    required
                                                    // defaultValue={emailNotification} 
                                                    // onChange={(event)=>setEmailNotification(event.target.value)}
                                                    
                                                  />
                                                </div>
                                                <div className="form-group mt-3">
                                                  <label
                                                      htmlFor="object"
                                                      className="text-blackish-blue "
                                                  >
                                                      Objet de la demande du KYC
                                                  </label>
                                                  <textarea
                                                      className="form-control gr-text-11 border bg-white"
                                                      type="text"
                                                      id="object"
                                                      placeholder=""
                                                      // defaultValue={object} 
                                                      // onChange={(event)=>setObject(event.target.value)}
                                                    />
                                                </div>
                                                <div className="form-group mb-6 mt-3 col-lg-12 col-md-12  row justify-content-between">
                                                    <button className="btn btn-primary" type='submit' disabled={isLoggingIn}>Envoyer</button>
                                                </div>
                                            </form>
                                        </>

                                      // ***********PARTIE PARTICULIER**************
                                    ) : (infosOtherUser?.firstName && infosOtherUser?.lastName && infosOtherUser?.codeTypeProfil=="part"?
                                    (
                                    <>
                                        {!oneKycForParticular?.message ?(
                                            <>
                                                <div className='mb-3'>
                                                    Veuillez demander les parties de KYC de <b> {infosOtherUser?.firstName} {infosOtherUser?.lastName} </b> dont vous souhaiterez voir.
                                                    
                                                </div>

                                                <form onSubmit={handleSubmit}>
                                                    <div className='form-group'>
                                                        <label>
                                                            <input
                                                                type="checkbox"
                                                                value="Questionnaire AML"
                                                                className='mx-3'
                                                                checked={selectedOptions.includes("Questionnaire AML")}
                                                                onChange={handleOptionChange}
                                                            />
                                                            Questionnaire AML
                                                        </label>
                                                    </div>
                                                    <div className='form-group'>
                                                        <label>
                                                            <input
                                                                type="checkbox"
                                                                value="Questionnaire FATCA"
                                                                className='mx-3'
                                                                checked={selectedOptions.includes("Questionnaire FATCA")}
                                                                onChange={handleOptionChange}
                                                            />
                                                            Questionnaire FATCA
                                                        </label>
                                                    </div>
                                                    <div className='form-group'>
                                                        <label>
                                                            <input
                                                                type="checkbox"
                                                                value="Justificatif d'identité"
                                                                className='mx-3'
                                                                checked={selectedOptions.includes("Justificatif d'identité")}
                                                                onChange={handleOptionChange}
                                                            />
                                                            Justificatif d'identité
                                                        </label>
                                                    </div>
                                                    <div className='form-group'>
                                                        <label>
                                                            <input
                                                                type="checkbox"
                                                                value="Justificatif de domicile"
                                                                className='mx-3'
                                                                checked={selectedOptions.includes("Justificatif de domicile")}
                                                                onChange={handleOptionChange}
                                                            />
                                                            Justificatif de domicile
                                                        </label>
                                                    </div>
                                                    <div className='form-group'>
                                                        <label>
                                                            <input
                                                                type="checkbox"
                                                                value="Photo"
                                                                className='mx-3'
                                                                checked={selectedOptions.includes("Photo")}
                                                                onChange={handleOptionChange}
                                                            />
                                                            Photo
                                                        </label>
                                                    </div>
                                                    <div className='form-group'>
                                                        <label>
                                                            <input
                                                                type="checkbox"
                                                                value="Signature"
                                                                className='mx-3'
                                                                checked={selectedOptions.includes("Signature")}
                                                                onChange={handleOptionChange}
                                                            />
                                                            Signature
                                                        </label>
                                                    </div>

                                                    <div className='form-group'>
                                                      <label
                                                            htmlFor="emailNotification"
                                                          className="text-blackish-blue mt-3"
                                                      >
                                                          Votre email de notification
                                                      </label>
                                                      <input
                                                        className="form-control gr-text-11 border bg-white"
                                                        type="text"
                                                        id="emailNotification"
                                                        placeholder="Votre email de notification"
                                                        required
                                                        // defaultValue={emailNotification} 
                                                        // onChange={(event)=>setEmailNotification(event.target.value)}
                                                        
                                                      />
                                                    </div>
                                                    <div className="form-group mt-3">
                                                      <label
                                                          htmlFor="object"
                                                          className="text-blackish-blue"
                                                      >
                                                          Objet de la demande du KYC
                                                      </label>
                                                      <textarea
                                                          className="form-control gr-text-11 border bg-white"
                                                          type="text"
                                                          id="object"
                                                          placeholder=""
                                                          // defaultValue={object} 
                                                          // onChange={(event)=>setObject(event.target.value)}
                                                        />
                                                    </div>

                                                    <div className="form-group mb-6 mt-3 col-lg-12 col-md-12  row justify-content-between">
                                                        <button className="btn btn-primary" type='submit' disabled={isLoggingIn}>Envoyer</button>
                                                    </div>
                                                </form>
                                                {/* FIN */}
                                            </>
                                        ):(<p className="gr-text-8 colorRed text-center" id="addon-wrapping">Cet utilisateur n'a pas rempli le Kyc</p>)}
                                    </>
                                    ) : <p className="gr-text-8 colorRed text-center" id="addon-wrapping">{infosOtherUser?.message}</p>)}
                                </div>
                            </div>
                            </div>
                        </div>
                        <div className='col-lg-3 col-md-12'></div>
                    </div>
                </>
            ) : ("")}
            {/* FIN */}
        </div>
    </>
  );
};

export default DemandeAccesKyc;
