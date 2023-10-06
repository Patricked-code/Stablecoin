import { useState, useEffect } from 'react';
import { Container, Row, Col, Collapse, Button, Modal,Form } from "react-bootstrap";

import React from "react";
import axios from 'axios';
import Link from 'next/link';
import { Icon } from '@iconify/react';


const VerifyDocuments = () => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API

    const [isLoggingIn, setIsLoggingIn] = useState(false);

    // States recherche de d'un utilisateur
    const [infosOtherUser, setInfosOtherUser] = useState();
    const [emailOtherUser, setEmailOtherUser] = useState();
    const [codeOtherUser, setCodeOtherUser] = useState();
    
    const [reasonFiling, setReasonFiling] = useState();
    const [fundsOrigin, setFundsOrigin] = useState();

    const [showInfoUser, setShowInfoUser] = useState();

    
    // Formulaire du Modal Transfert
    const [montantEnvoyer, setMontantEnvoyer] = useState(0);
    const [addressTo, setAddressTo] = useState();
    const [montantRecu, setMontantRecu] = useState(0);
    const [percent, setPercent] = useState(1);

    const [symbol, setSymbol] = useState("E-WARI");

    const [acteur, setActeur] = useState();


     // Calcule des frais de transaction
     const frais = montantEnvoyer*percent/100
     const montantRecevoir =  montantEnvoyer - frais 
     // Fin


    
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
                      console.log("user=>2",user)

            
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
                      console.log("user=>1",user)
            
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
                      console.log("user=>3",user)

            
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
                      Adresse Blockchain
                    </button>

                    <button
                    className={toggleState === 2 ? "tabs active-tabs  gr-text-8 text-color-opacity" : "tabs  gr-text-8 text-color-opacity"}
                    onClick={() => toggleTab(2)}
                    >
                      Adresse email
                    </button>

                    <button
                    className={toggleState === 3 ? "tabs active-tabs  gr-text-8 text-color-opacity" : "tabs  gr-text-8 text-color-opacity"}
                    onClick={() => toggleTab(3)}
                    >
                      Identifiant
                    </button>
                  </div>

                  <div className="content-tabs">
                    <div
                    className={toggleState === 1 ? "content  active-content" : "content"}
                    >
                     {/* Formulaire de la partie avec adresse blockchain  */}
                    <form onClick={handleSubmit}>
                      <div className="form-group mb-6">
                        <label
                          htmlFor="addressTo"
                          className="gr-text-8 fw-bold text-blackish-blue "
                        >
                          Adresse blockchain du bénéficiaire <sup className="text-red">*</sup>
                        </label>
                        <input
                          className="form-control gr-text-11 border mt-3 bg-white"
                          type="text"
                          id="addressTo"
                          placeholder="Adresse blockchain du bénéficiaire"
                          required
                          defaultValue={addressTo} 
                          onChange={(event)=>setAddressTo(event.target.value)}
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
                      <Row className="my-3 justify-content-center align-items-center">
                        <Col
                            xs="6"
                            md="6"
                            lg="6"
                            xl="6"
                          className="order-lg-1 text-center"
                          onClick={()=>setShowInfoUser(3)}
                        >
                           <Button className="text-white " onClick={searchUserWithIdentifiant} variant="danger" >
                                Vérifier
                            </Button>
                        </Col>
                      </Row>
                    </form>
                    </div>
                  </div>
 
                    </div>
                <div className='col-lg-3 col-md-12'></div>
            </div>
            

            {/* AFFICHAGE DES INFORMATIONS */}
            <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
              <div className='cryptocurrency-slides'>
                <div className='single-cryptocurrency-box'>

                  {/* AFFICHAGE DES TEXTES */}
                  <div className={toggleState === 3}>

                  {infosOtherUser?.entreprise ? (
                      <p className="gr-text-8 " id="addon-wrapping">
                            Nom de l'entreprise : {infosOtherUser?.entreprise}
                      </p>
                    ) : (infosOtherUser?.firstName && infosOtherUser?.lastName && infosOtherUser?.codeTypeProfil=="part"?
                      (
                      <div className='row'>
                        <div className='col-lg-4 col-md-4 mb-3'>
                          <p className="gr-text-8 " id="addon-wrapping">
                            Nom : {infosOtherUser?.firstName}
                          </p>
                          </div>
                          <div className='col-lg-4 col-md-4 mb-3'>
                          <p className="gr-text-8 " id="addon-wrapping">
                            Prenom : {infosOtherUser?.lastName}
                          </p>
                          </div>
                      </div>
                      ) : <p className="gr-text-8 colorRed" id="addon-wrapping">{infosOtherUser?.message}</p>)}

                  {/* AFFICHAGE DES FICHIERS */}
                  
                    <div className='row justify-content-center mt-5'>
                      <div className='col-lg-4 col-md-4 mb-3'>
                        <h5>Photo </h5>
                        <div className='buy-sell-cryptocurrency-image'>
                          <img src='/images/ecfa/ecosysteme/investissements/invest17.jpg' className="" width={'700'} height={'700'} alt='logo' />
                        </div>
                      </div>

                      <div className='col-lg-4 col-md-4 mb-3'>
                        <h5>Recto de justificatif d'identité </h5>
                        <div className='buy-sell-cryptocurrency-image'>
                          <img src='/images/ecfa/ecosysteme/investissements/invest17.jpg' className="" width={'700'} height={'700'} alt='logo' />
                        </div>
                      </div>

                      <div className='col-lg-4 col-md-4 mb-3'>
                        <h5>Verso de justificatif d'identité </h5>
                        <div className='buy-sell-cryptocurrency-image'>
                          <img src='/images/ecfa/ecosysteme/investissements/invest17.jpg' className="" width={'700'} height={'700'} alt='logo' />
                        </div>
                      </div>
                      
                    </div>
                    {/* FIN */}
                    <Row className="my-3 justify-content-center align-items-center ">
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
                  </div>
                </div>
              </div>
            </div>
            {/* FIN */}
        </div>
    </>
  );
};

export default VerifyDocuments;
