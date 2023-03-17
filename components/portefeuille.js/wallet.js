import { useState, useEffect } from 'react';
import { Container, Row, Col, Collapse, Button, Modal,Form } from "react-bootstrap";
import { magic } from "../../magic";
import { ethers } from "ethers";
import Web3 from "web3";

import { Icon } from '@iconify/react';
// import { get, isEmpty, find, filter, has, debounce } from "loadash";

import copy from "copy-to-clipboard"; 
import Swal from 'sweetalert2'
// **************************************************************
import Link from 'next/link';

// PARTIE MAGIC
import { Web3Provider } from "@ethersproject/providers";
import { Magic } from "magic-sdk";


const Wallet =({bgGradient, blackText})=>{

// Variable de l'url de l'api
const API_URL =process.env.NEXT_PUBLIC_URL_API;

//  LES ADRESSES DES TOKENS
const ADDRESS_LYSFC=process.env.NEXT_PUBLIC_ADDRESS_CONTRAT_TOKEN_LYSFC

const [contractTokenLysfc, setContractTokenLysfc] = useState();
    const [web3, setWeb3] = useState();
    const [balance, setBalance] = useState();
    const [symbolLysfc, setSymbolLysfc] = useState();
    const [nameLysfc, setNameLysfc] = useState();
    



  // States de tab
  const [toggleState, setToggleState] = useState(1);
  const toggleTab = (index) => {
    setToggleState(index);
  };
  // Fin

  // States de magic
  const [currentAdresse, setCurrentAdresse] = useState("...");
  const [provider, setProvider] = useState(null);
  // Fin

  const [contentDepot, setContentDepot] = useState();
  const [successCopy, setSuccessCopy] = useState();


  // Modal Depot
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  // Fin

  // Modal Transfert
  const [showTransfert, setShowTransfert] = useState(false);
  const handleTransfertClose = () => setShowTransfert(false);
  const handleTransfertShow = () => setShowTransfert(true);

  // Formulaire du Modal Transfert
  const [montantEnvoyer, setMontantEnvoyer] = useState(0);
  const [addressTo, setAddressTo] = useState();
  const [montantRecu, setMontantRecu] = useState(0);
  const [percent, setPercent] = useState(1);

  const [symbol, setSymbol] = useState();

  const [token, setToken] = useState();

  // Fin

  const [userDataTransaction, setUserDataTransaction]=useState('')
  const [calculMontantLys, setCalculMontantLys]=useState()
  var lodash = require('lodash');

    // Calcule des frais de transaction
    const frais = montantEnvoyer*percent/100
    const montantRecevoir =  montantEnvoyer - frais 
    // Fin
    


    // FONCTION POUR COPIER L'ADRESSE PUBLIC DE L'UTILISATEUR
    const copyToClipboard = () => {
        copy(currentAdresse);
        setSuccessCopy("Adresse copiée avec succès !");

        setTimeout(() => {
        setSuccessCopy("");
        }, 1000)
    }
    // FIN










    return (
        <>
           <div>
                <div className="sign-page bg-default-2 px-0">
                    <Container>
                        <Row className="justify-content-center py-15">
                        <Col lg="12">
                            <div className="main-block">
                            <div className="form-title text-center">
                                <h2 className="title gr-text-7 mb-9 heading-color">Mon Portefeuille Numérique</h2>
                                {/* <button éonClick={transferLysfcRelayer}>Envoyer</button> */}
                            </div>
                            <Row className="justify-content-center">
                                {/* PARTIE DE E-WARI */}
                                <Col lg="6" md="6" sm="10" className="mb-5">
                                    <div className="mt-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                                    <div className="price-content px-16">
                                        <div className="d-flex">
                                        <div className="circle-32 pe-5 ml-5">
                                            <img src="/images/ecfa/logo/logo_ewari1.jpg" className="mx-3 rounded-circle" alt=""   width={60}/>
                                        </div>
                                        <div className="text">
                                            <div className=" my-3 text-blackish-blue title gr-text-7 mb-9 heading-color px-7">
                                            
                                            <p className="my-3 gr-text-8 text-blackish-blue mt-0">
                                            Stablecoin E-WARI
                                            </p>

                                            <p className="my-3 gr-text-8 text-blackish-blue mt-0">
                                               Mon solde: 0.000000000 E-WARI
                                            </p>
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                    <Row className="justify-content-center align-items-center">
                                        <Col
                                        xs="6"
                                        md="6"
                                        lg="6"
                                        xl="6"
                                        className="order-lg-1 mb-5"
                                        data-aos="fade-right"
                                        data-aos-duration="750"
                                        data-aos-delay="500"
                                        >
                                        <div className="hero-btn text-center "
                                            onClick={handleShow}
                                        >
                                        <Button
                                            block
                                            color="success"
                                            type="button"
                                            onClick={()=>setContentDepot(`Copiez cette adresse pour envoyer à vos proches afin de recevoir des E-WARI du réseau moonbeam`)}
                                        >
                                            Dépôt 
                                        </Button>
                                            
                                        </div>
                                        </Col>

                                        <Col
                                        xs="6"
                                        md="6"
                                        lg="6"
                                        xl="6"
                                        className="order-lg-1 mb-5"
                                        data-aos="fade-right"
                                        data-aos-duration="750"
                                        data-aos-delay="500"
                                        >
                                        <div 
                                            className="hero-btn text-center"
                                            onClick={()=>setSymbol("E-WARI")}
                                        >
                                            <Button
                                            block
                                            color="success"
                                            type="button"
                                            onClick={handleTransfertShow}
                                            >
                                                Transfert
                                            </Button>
                                        </div>
                                        </Col>
                                    </Row>
                                    </div>
                                </Col>
                                {/* FIN */}

                                {/* PARTIE DE NSIA */}
                                <Col lg="6" md="6" sm="10" className="mb-5">
                                    <div className="mt-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                                    <div className="price-content px-16">
                                        <div className="d-flex">
                                        <div className="circle-32 pe-5 ml-5">
                                            <img src="/images/ecfa/logo/logo_ewari1.jpg" className="mx-3 rounded-circle" alt=""   width={60}/>
                                        </div>
                                        <div className="text">
                                            <div className=" my-3 text-blackish-blue title gr-text-7 mb-9 heading-color px-7">
                                            
                                            <p className="my-3 gr-text-8 text-blackish-blue mt-0">
                                                NSIA
                                            </p>

                                            <p className="my-3 gr-text-8 text-blackish-blue mt-0">
                                               Mon solde: 0.000000000 NSIA EPargne
                                            </p>
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                    <Row className="justify-content-center align-items-center">
                                        <Col
                                        xs="6"
                                        md="6"
                                        lg="6"
                                        xl="6"
                                        className="order-lg-1 mb-5"
                                        data-aos="fade-right"
                                        data-aos-duration="750"
                                        data-aos-delay="500"
                                        >
                                        <div className="hero-btn text-center "
                                            onClick={handleShow}
                                        >
                                        <Button
                                            block
                                            color="success"
                                            type="button"
                                            onClick={()=>setContentDepot(`Copiez cette adresse pour envoyer à vos proches afin de recevoir des NSIA Epargne du réseau moonbeam`)}
                                        >
                                            Dépôt 
                                        </Button>
                                            
                                        </div>
                                        </Col>

                                        <Col
                                        xs="6"
                                        md="6"
                                        lg="6"
                                        xl="6"
                                        className="order-lg-1 mb-5"
                                        data-aos="fade-right"
                                        data-aos-duration="750"
                                        data-aos-delay="500"
                                        >
                                        <div 
                                            className="hero-btn text-center"
                                            onClick={()=>setSymbol("E-WARI")}
                                        >
                                            <Button
                                            block
                                            color="success"
                                            type="button"
                                            onClick={handleTransfertShow}
                                            >
                                                Transfert
                                            </Button>
                                        </div>
                                        </Col>
                                    </Row>
                                    </div>
                                </Col>
                                {/* FIN */}

                                {/* PARTIE DE CREPMF */}
                                <Col lg="6" md="6" sm="10" className="mb-5">
                                    <div className="mt-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                                    <div className="price-content px-16">
                                        <div className="d-flex">
                                        <div className="circle-32 pe-5 ml-5">
                                            <img src="/images/ecfa/logo/logo_ewari1.jpg" className="mx-3 rounded-circle" alt=""   width={60}/>
                                        </div>
                                        <div className="text">
                                            <div className=" my-3 text-blackish-blue title gr-text-7 mb-9 heading-color px-7">
                                            
                                            <p className="my-3 gr-text-8 text-blackish-blue mt-0">
                                                CREPMF
                                            </p>

                                            <p className="my-3 gr-text-8 text-blackish-blue mt-0">
                                               Mon solde: 0.000000000 CREPMF Actions
                                            </p>
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                    <Row className="justify-content-center align-items-center">
                                        <Col
                                        xs="6"
                                        md="6"
                                        lg="6"
                                        xl="6"
                                        className="order-lg-1 mb-5"
                                        data-aos="fade-right"
                                        data-aos-duration="750"
                                        data-aos-delay="500"
                                        >
                                        <div className="hero-btn text-center "
                                            onClick={handleShow}
                                        >
                                        <Button
                                            block
                                            color="success"
                                            type="button"
                                            onClick={()=>setContentDepot(`Copiez cette adresse pour envoyer à vos proches afin de recevoir des CREPMF Actions du réseau moonbeam`)}
                                        >
                                            Dépôt 
                                        </Button>
                                            
                                        </div>
                                        </Col>

                                        <Col
                                        xs="6"
                                        md="6"
                                        lg="6"
                                        xl="6"
                                        className="order-lg-1 mb-5"
                                        data-aos="fade-right"
                                        data-aos-duration="750"
                                        data-aos-delay="500"
                                        >
                                        <div 
                                            className="hero-btn text-center"
                                            onClick={()=>setSymbol("E-WARI")}
                                        >
                                            <Button
                                            block
                                            color="success"
                                            type="button"
                                            onClick={handleTransfertShow}
                                            >
                                                Transfert
                                            </Button>
                                        </div>
                                        </Col>
                                    </Row>
                                    </div>
                                </Col>
                                {/* FIN */}

                                {/* PARTIE DE Sicav */}
                                <Col lg="6" md="6" sm="10" className="mb-5">
                                    <div className="mt-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                                    <div className="price-content px-16">
                                        <div className="d-flex">
                                        <div className="circle-32 pe-5 ml-5">
                                            <img src="/images/ecfa/logo/logo_ewari1.jpg" className="mx-3 rounded-circle" alt=""   width={60}/>
                                        </div>
                                        <div className="text">
                                            <div className=" my-3 text-blackish-blue title gr-text-7 mb-9 heading-color px-7">
                                            
                                            <p className="my-3 gr-text-8 text-blackish-blue mt-0">
                                                SICAV
                                            </p>

                                            <p className="my-3 gr-text-8 text-blackish-blue mt-0">
                                               Mon solde: 0.000000000 Sicav Abdou Diouf
                                            </p>
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                    <Row className="justify-content-center align-items-center">
                                        <Col
                                        xs="6"
                                        md="6"
                                        lg="6"
                                        xl="6"
                                        className="order-lg-1 mb-5"
                                        data-aos="fade-right"
                                        data-aos-duration="750"
                                        data-aos-delay="500"
                                        >
                                        <div className="hero-btn text-center "
                                            onClick={handleShow}
                                        >
                                        <Button
                                            block
                                            color="success"
                                            type="button"
                                            onClick={()=>setContentDepot(`Copiez cette adresse pour envoyer à vos proches afin de recevoir des Sicav Abdou Diouf du réseau moonbeam`)}
                                        >
                                            Dépôt 
                                        </Button>
                                            
                                        </div>
                                        </Col>

                                        <Col
                                        xs="6"
                                        md="6"
                                        lg="6"
                                        xl="6"
                                        className="order-lg-1 mb-5"
                                        data-aos="fade-right"
                                        data-aos-duration="750"
                                        data-aos-delay="500"
                                        >
                                        <div 
                                            className="hero-btn text-center"
                                            onClick={()=>setSymbol("E-WARI")}
                                        >
                                            <Button
                                            block
                                            color="success"
                                            type="button"
                                            onClick={handleTransfertShow}
                                            >
                                                Transfert
                                            </Button>
                                        </div>
                                        </Col>
                                    </Row>
                                    </div>
                                </Col>
                                {/* FIN */}

                                {/* PARTIE DE Ecobank */}
                                <Col lg="6" md="6" sm="10" className="mb-5">
                                    <div className="mt-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                                    <div className="price-content px-16">
                                        <div className="d-flex">
                                        <div className="circle-32 pe-5 ml-5">
                                            <img src="/images/ecfa/logo/logo_ewari1.jpg" className="mx-3 rounded-circle" alt=""   width={60}/>
                                        </div>
                                        <div className="text">
                                            <div className=" my-3 text-blackish-blue title gr-text-7 mb-9 heading-color px-7">
                                            
                                            <p className="my-3 gr-text-8 text-blackish-blue mt-0">
                                                ECOBANK
                                            </p>

                                            <p className="my-3 gr-text-8 text-blackish-blue mt-0">
                                               Mon solde: 0.000000000 Sicav Ecobank
                                            </p>
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                    <Row className="justify-content-center align-items-center">
                                        <Col
                                        xs="6"
                                        md="6"
                                        lg="6"
                                        xl="6"
                                        className="order-lg-1 mb-5"
                                        data-aos="fade-right"
                                        data-aos-duration="750"
                                        data-aos-delay="500"
                                        >
                                        <div className="hero-btn text-center "
                                            onClick={handleShow}
                                        >
                                        <Button
                                            block
                                            color="success"
                                            type="button"
                                            onClick={()=>setContentDepot(`Copiez cette adresse pour envoyer à vos proches afin de recevoir des Sicav Ecobank du réseau moonbeam`)}
                                        >
                                            Dépôt 
                                        </Button>
                                            
                                        </div>
                                        </Col>

                                        <Col
                                        xs="6"
                                        md="6"
                                        lg="6"
                                        xl="6"
                                        className="order-lg-1 mb-5"
                                        data-aos="fade-right"
                                        data-aos-duration="750"
                                        data-aos-delay="500"
                                        >
                                        <div 
                                            className="hero-btn text-center"
                                            onClick={()=>setSymbol("E-WARI")}
                                        >
                                            <Button
                                            block
                                            color="success"
                                            type="button"
                                            onClick={handleTransfertShow}
                                            >
                                                Transfert
                                            </Button>
                                        </div>
                                        </Col>
                                    </Row>
                                    </div>
                                </Col>
                                {/* FIN */}

                                {/* PARTIE DE FCP  */}
                                <Col lg="6" md="6" sm="10" className="mb-5">
                                    <div className="mt-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                                    <div className="price-content px-16">
                                        <div className="d-flex">
                                        <div className="circle-32 pe-5 ml-5">
                                            <img src="/images/ecfa/logo/logo_ewari1.jpg" className="mx-3 rounded-circle" alt=""   width={60}/>
                                        </div>
                                        <div className="text">
                                            <div className=" my-3 text-blackish-blue title gr-text-7 mb-9 heading-color px-7">
                                            
                                            <p className="my-3 gr-text-8 text-blackish-blue mt-0">
                                            FCP 
                                            </p>

                                            <p className="my-3 gr-text-8 text-blackish-blue mt-0">
                                               Mon solde: 0.000000000 FCP Coris
                                            </p>
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                    <Row className="justify-content-center align-items-center">
                                        <Col
                                        xs="6"
                                        md="6"
                                        lg="6"
                                        xl="6"
                                        className="order-lg-1 mb-5"
                                        data-aos="fade-right"
                                        data-aos-duration="750"
                                        data-aos-delay="500"
                                        >
                                        <div className="hero-btn text-center "
                                            onClick={handleShow}
                                        >
                                        <Button
                                            block
                                            color="success"
                                            type="button"
                                            onClick={()=>setContentDepot(`Copiez cette adresse pour envoyer à vos proches afin de recevoir des FCP Coris du réseau moonbeam`)}
                                        >
                                            Dépôt 
                                        </Button>
                                            
                                        </div>
                                        </Col>

                                        <Col
                                        xs="6"
                                        md="6"
                                        lg="6"
                                        xl="6"
                                        className="order-lg-1 mb-5"
                                        data-aos="fade-right"
                                        data-aos-duration="750"
                                        data-aos-delay="500"
                                        >
                                        <div 
                                            className="hero-btn text-center"
                                            onClick={()=>setSymbol("E-WARI")}
                                        >
                                            <Button
                                            block
                                            color="success"
                                            type="button"
                                            onClick={handleTransfertShow}
                                            >
                                                Transfert
                                            </Button>
                                        </div>
                                        </Col>
                                    </Row>
                                    </div>
                                </Col>
                                {/* FIN */}
                            </Row>
                        </div>
                        </Col>
                    </Row>
                    </Container>
                </div>
            </div>




      


       {/* ********************************************************************************** */}
                {/* MODAL DE L'ADRESSE PUBLIC'*/}
            {/* ********************************************************************************** */}
            <Modal show={show} className="mt-15" onHide={handleClose}>
                <Modal.Header closeButton id="bgcolor">
                <Modal.Title className="text-white" >Mon adresse public</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className="input-group flex-nowrap">
                  {/* <p className="gr-text-8 pt-3 pb-0 text-center text-green">{currentAdresse} </p> */}
                    
                    <input
                      className="form-control gr-text-8 border  mt-3 bg-white"
                      type="text" 
                      disabled
                      value={currentAdresse}
                    />
                      <span className="input-group-text gr-text-11  mt-3" id="addon-wrapping">
                        <button><Icon onClick={copyToClipboard} icon="bx:copy"  width="30" /></button>
                      </span>
                  </div>
                  
                  <p className="gr-text-8 pt-3 pb-0 text-center text-green">{successCopy} </p>
                  <p className="gr-text-8 pt-3 pb-0 text-center">{contentDepot} </p>
                </Modal.Body>
            </Modal>
            {/* *****************************************FIN****************************************** */}


          

          {/* ********************************************************************************** */}
                {/* MODAL DE TRANSFERT DE JETON VERS AUTRE COMPTE*/}
            {/* ********************************************************************************** */}
            <Modal show={showTransfert} className="mt-15" onHide={handleTransfertClose} style={{maxWidth: '1800px', width: '100%'}}>
                <Modal.Header closeButton id="bgcolor">
                <Modal.Title className="" >Transfert du jeton vers un autre utilisateur</Modal.Title>
                </Modal.Header>
                {/* <form > */}
                <Modal.Body>
                
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
                           <Button className="text-white " variant="danger" onClick={handleTransfertClose}>
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
                           <Button className="text-white " variant="danger" onClick={handleTransfertClose}>
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
                           <Button className="text-white " variant="danger" onClick={handleTransfertClose}>
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

              






                    
                    
                </Modal.Body>
                {/* <Modal.Footer> */}
                {/* <Button className="text-white" variant="danger" onClick={handleTransfertClose}>
                    Annuler
                </Button>
                <Button variant="success" className="text-white" >
                    Envoyer
                </Button>
                </Modal.Footer> */}
                {/* </form> */}
                
            </Modal>
            {/* *****************************************FIN****************************************** */}

        </>
      );
}
export default Wallet