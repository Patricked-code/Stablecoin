import { useState, useEffect } from 'react';
import { Container, Row, Col, Collapse, Button, Modal,Form } from "react-bootstrap";

import React from "react";
import axios from 'axios';
import Link from 'next/link';
import { Icon } from '@iconify/react';


const RetraitCash = () => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API

    const [isLoggingIn, setIsLoggingIn] = useState(false);


    
    // Formulaire du Modal Transfert
    const [montantEnvoyer, setMontantEnvoyer] = useState(0);
    const [addressTo, setAddressTo] = useState();
    const [montantRecu, setMontantRecu] = useState(0);
    const [percent, setPercent] = useState(1);

    const [symbol, setSymbol] = useState("E-WARI");

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
    



    
    
      




   


  return (
    <>

        <div className='' >
            <div className=' mx-15'>
                <div className='py-10'>
                    <h3 className='text-center'>Retrait cash</h3>
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
                      Code personnel
                    </button>
                  </div>

                  <div className="content-tabs">
                    <div
                    className={toggleState === 1 ? "content  active-content" : "content"}
                    >
                     {/* Formulaire de la partie avec adresse blockchain  */}
                    <form>
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
                      
                      <div className="form-group my-6 ">
                        <label
                          htmlFor="montant"
                          className="gr-text-8 fw-bold text-blackish-blue"
                        >
                          Montant à retirer <sup className="text-red">*</sup>
                        </label>
                        <div className="input-group flex-nowrap">
                        <input
                          className="form-control gr-text-11 border mt-3 bg-white"
                          type="number"
                          id="montant"
                          placeholder="Montant à retirer"
                          required
                          defaultValue={montantEnvoyer} 
                          onChange={(event)=>setMontantEnvoyer(event.target.value)}
                        />
                        <span className="input-group-text gr-text-11  mt-3" id="addon-wrapping">{symbol}</span>

                        </div>
                      </div>

                      <div className="form-group my-6 ">
                        <label
                          htmlFor="montant"
                          className="gr-text-8 fw-bold text-blackish-blue"
                        >
                          Montant à recevoir avec les frais <sup className="text-red">*</sup>
                        </label>
                        <div className="input-group flex-nowrap">
                        <input
                          className="form-control gr-text-11 border mt-3 bg-white"
                          type="number"
                          id="montant"
                          placeholder="Montant reçu"
                          required
                          disabled
                          value={montantRecevoir} 
                          // defaultValue={montantRecu} 
                          // onChange={(event)=>setMontantRecu(event.target.value)}
                        />
                        <span className="input-group-text gr-text-11  mt-3" id="addon-wrapping">{symbol}</span>

                        </div>
                      </div>
                      <Row className="my-3 justify-content-between align-items-center">
                        <Col
                            xs="6"
                            md="6"
                            lg="6"
                            xl="6"
                          className="order-lg-1 text-center"
                        >
                           <Button className="text-white " variant="danger">
                           {/* <Button className="text-white " variant="danger" onClick={handleTransfertClose}> */}
                        Annuler
                      </Button>
                        </Col>

                        <Col
                            xs="6"
                            md="6"
                            lg="6"
                            xl="6"
                          className="order-lg-1 text-center"
                          
                        >
                        <Button variant="success"  className="text-white" >
                          {/* onClick={transferLysfc} */}
                        Envoyer
                      </Button>
                        </Col>
                      </Row>
                    </form>
                    </div>

                    <div
                    className={toggleState === 2 ? "content  active-content" : "content"}
                    >
                     {/* Formulaire de la partie avec adresse blockchain  */}
                    <form>
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
                          // defaultValue={networkMobile} 
                          // onChange={(event)=>setNetworkMobile(event.target.value)}
                        />
                      </div>
                      
                      <div className="form-group my-6 ">
                        <label
                          htmlFor="montant"
                          className="gr-text-8 fw-bold text-blackish-blue"
                        >
                          Montant à envoyer <sup className="text-red">*</sup>
                        </label>
                        <div className="input-group flex-nowrap">
                        <input
                          className="form-control gr-text-11 border mt-3 bg-white"
                          type="number"
                          id="montant"
                          placeholder="Montant envoyé"
                          required
                          defaultValue={montantEnvoyer} 
                          onChange={(event)=>setMontantEnvoyer(event.target.value)}
                        />
                        <span className="input-group-text gr-text-11  mt-3" id="addon-wrapping">{symbol}</span>

                        </div>
                      </div>

                      <div className="form-group my-6 ">
                        <label
                          htmlFor="montant"
                          className="gr-text-8 fw-bold text-blackish-blue"
                        >
                          Montant à recevoir avec les frais
                        </label>
                        <div className="input-group flex-nowrap">
                        <input
                          className="form-control gr-text-11 border mt-3 bg-white"
                          type="number"
                          id="montant"
                          placeholder="Montant reçu"
                          required
                          disabled
                          value={montantRecevoir} 

                          // defaultValue={montantRecu} 
                          // onChange={(event)=>setMontantRecu(event.target.value)}
                        />
                          <span className="input-group-text gr-text-11  mt-3" id="addon-wrapping">{symbol}</span>

                        </div>
                      </div>
                      <Row className="my-3 justify-content-between align-items-center">
                        <Col
                            xs="6"
                            md="6"
                            lg="6"
                            xl="6"
                          className="order-lg-1 text-center"
                          
                        >
                           <Button className="text-white " variant="danger">
                           {/* <Button className="text-white " variant="danger" onClick={handleTransfertClose}> */}
                        Annuler
                      </Button>
                        </Col>

                        <Col
                            xs="6"
                            md="6"
                            lg="6"
                            xl="6"
                          className="order-lg-1 text-center"
                          
                        >
                        <Button variant="success" className="text-white" >
                            Envoyer
                        </Button>
                        </Col>
                      </Row>
                    </form>
                    </div>

                    <div
                    className={toggleState === 3 ? "content  active-content" : "content"}
                    >
                     {/* Formulaire de la partie avec adresse blockchain  */}
                    <form>
                      <div className="form-group mb-6">
                        <label
                          htmlFor="addressTo"
                          className="gr-text-8 fw-bold text-blackish-blue "
                        >
                          Code personnel du bénéficiaire <sup className="text-red">*</sup>
                        </label>
                        <input
                          className="form-control gr-text-11 border mt-3 bg-white"
                          type="text"
                          id="addressTo"
                          placeholder="Code personnel du bénéficiaire"
                          required
                          defaultValue={addressTo} 
                          onChange={(event)=>setAddressTo(event.target.value)}
                        />
                      </div>
                      
                      <div className="form-group my-6 ">
                        <label
                          htmlFor="montant"
                          className="gr-text-8 fw-bold text-blackish-blue"
                        >
                          Montant à envoyer <sup className="text-red">*</sup>
                        </label>
                        <div className="input-group flex-nowrap">
                        <input
                          className="form-control gr-text-11 border mt-3 bg-white"
                          type="number"
                          id="montant"
                          placeholder="Montant envoyé"
                          required
                          defaultValue={montantEnvoyer} 
                          onChange={(event)=>setMontantEnvoyer(event.target.value)}
                        />
                        <span className="input-group-text gr-text-11  mt-3" id="addon-wrapping">{symbol}</span>

                        </div>
                      </div>

                      <div className="form-group my-6 ">
                        <label
                          htmlFor="montant"
                          className="gr-text-8 fw-bold text-blackish-blue"
                        >
                          Montant à recevoir avec les frais <sup className="text-red">*</sup>
                        </label>
                        <div className="input-group flex-nowrap">
                        <input
                          className="form-control gr-text-11 border mt-3 bg-white"
                          type="number"
                          id="montant"
                          placeholder="Montant reçu"
                          required
                          disabled
                          value={montantRecevoir} 
                          // defaultValue={montantRecu} 
                          // onChange={(event)=>setMontantRecu(event.target.value)}
                        />
                        <span className="input-group-text gr-text-11  mt-3" id="addon-wrapping">{symbol}</span>
                        {/* <span className="input-group-text gr-text-11  mt-3" id="addon-wrapping">{symbol}</span> */}

                        </div>
                      </div>
                      <Row className="my-3 justify-content-between align-items-center">
                        <Col
                            xs="6"
                            md="6"
                            lg="6"
                            xl="6"
                          className="order-lg-1 text-center"
                        >
                           <Button className="text-white " variant="danger" >
                           {/* <Button className="text-white " variant="danger" onClick={handleTransfertClose}> */}
                        Annuler
                      </Button>
                        </Col>

                        <Col
                            xs="6"
                            md="6"
                            lg="6"
                            xl="6"
                          className="order-lg-1 text-center"
                          
                        >
                        <Button variant="success"  className="text-white" >
                          {/* onClick={transferLysfc} */}
                        Envoyer
                      </Button>
                        </Col>
                      </Row>
                    </form>
                    </div>
                  </div>
 
                    </div>
                <div className='col-lg-3 col-md-12'></div>
            </div>
        </div>
    </>
  );
};

export default RetraitCash;
