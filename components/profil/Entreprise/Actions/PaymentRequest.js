import { useState, useEffect } from 'react';
import { Container, Row, Col, Collapse, Button, Modal,Form } from "react-bootstrap";

import React from "react";
import axios from 'axios';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import Swal from 'sweetalert2';



const PaymentRequest = () => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API

    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [isLoggingInEmail, setIsLoggingInEmail] = useState(false);
    const [isLoggingInBlockchain, setIsLoggingInBlockchain] = useState(false);
    const [isLoggingInIdentifiant, setIsLoggingInIdentifiant] = useState(false);

    // States recherche de d'un utilisateur
    const [infosOtherUser, setInfosOtherUser] = useState();
    const [emailOtherUser, setEmailOtherUser] = useState();
    const [codeOtherUser, setCodeOtherUser] = useState();
    
    // Formulaire du Modal Transfert
    const [montantEnvoyer, setMontantEnvoyer] = useState();
    const [objet, setObjet] = useState("Achats de biens et services");
    
    const [addressTo, setAddressTo] = useState();
    const [montantRecu, setMontantRecu] = useState(0);
    const [percent, setPercent] = useState(1);

    const [symbol, setSymbol] = useState("KOREE");

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
          console.log("emailOtherUser 3=>",_emailOtherUser)
        
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
          console.log("emailOtherUser 3=>",_addressTo)
        
            const result = await fetch(`${API_URL}/api/user/find-user-by-addrBlockchain?address=${_addressTo}`, {
                headers: {
                'Content-Type': 'application/json',
                },
            })
                .then((result) => result.json())
                .then((user) => {
                  setInfosOtherUser(user)
                  
            console.log("infosOtherUser 1=>",infosOtherUser)
        
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
                  
            console.log("infosOtherUser 2=>",infosOtherUser)
        
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
      


     // FONCTION DE LA DEMANDE DE PAIEMENT
     const addPaymentRequest= async(event) =>{
      event.preventDefault();
      setIsLoggingIn(true)
      
      const dataa = {
        objet:objet,
        amount:montantEnvoyer,
        receiverId:infosOtherUser.id
         
      }

      console.log("dataa=>",dataa)
      // Obtenir le token en cours
      const token = localStorage.getItem('tokenEnCours');

      const result = await fetch(`${API_URL}/api/payment-request/add-payment-request`, {
            method:"POST",
            body: JSON.stringify(dataa),
            headers: {
                'Content-Type': 'application/json',
                Authorization:  `Bearer ${token}`
            }
        })
        .then(res=>{
        const data =  res.json();
        console.log("data 1=>",res)
          if (res.status==200) {
            Swal.fire({
              position: 'center',
              icon: 'success',
              html: "<p> La demande de paiement a été effectuée avec succès.<br/> Un mail du détail de la demande de paiement vous a été envoyé.</p>" ,
              showConfirmButton: false,
              timer: 10000
            })

            //  Actualiser après l'affichage 
            setTimeout(() => {
              window.location.reload()
            }, 10000) 
            // Fin
          }else{
            setIsLoggingIn(false)

            Swal.fire({
              position: 'center',
              icon: 'error',
              html: "<p> La demande de paiement a échouée. </p>" ,
              showConfirmButton: false,
              timer: 15000
          })
        }
      })
      .catch(error => {
        setIsLoggingIn(false)

        //handle error
        console.log(error);
  
      });
  }
  // FIN




   


  return (
    <>

        <div className='' >
            <div className=' mx-15'>
                <div className='py-10'>
                    <h3 className='text-center'>Demande de paiement</h3>
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
                     <form onSubmit={handleSubmit}>
                        <div className="form-group my-6 ">
                          <label
                            htmlFor="montant"
                            className="gr-text-8 fw-bold text-blackish-blue"
                          >
                            Adresse bockchain du recepteur <sup className="text-red">*</sup>

                          </label>
                          <div className="input-group flex-nowrap">
                          <input
                              className="form-control gr-text-11 border mt-3 bg-white"
                              type="text"
                              id="addressTo"
                              placeholder="Adresse blockchain du recepteur"
                              required
                              defaultValue={addressTo} 
                              onChange={(event)=>setAddressTo(event.target.value)}
                              
                          />
                          <span className="gr-text-8 mx-2" id="addon-wrapping">
                            <button onClick={searchUserWithBlockchain} disabled={isLoggingIn}><Icon  icon="bx:search-alt"  />
                            </button>
                          </span>

                          </div>
                        </div>
                        {infosOtherUser?.entreprise ? (
                          <p className="gr-text-8 " id="addon-wrapping">
                            Nom de l'entreprise : {infosOtherUser?.entreprise}
                          </p>
                        ) : (infosOtherUser?.firstName && infosOtherUser?.lastName ?
                         (<div>
                            <p className="gr-text-8 " id="addon-wrapping">
                              Nom : {infosOtherUser?.firstName}
                            </p>
                            <p className="gr-text-8 " id="addon-wrapping">
                              Prenom : {infosOtherUser?.lastName}
                            </p>
                         </div>) : <p className="gr-text-8 colorRed" id="addon-wrapping">{infosOtherUser?.message}</p>)}
                      </form>

                      {infosOtherUser?.entreprise || infosOtherUser?.firstName || infosOtherUser?.lastName?
                        (
                          <form className='mt-3'>
                            {infosOtherUser?.entreprise ? (
                              <div className="form-group my-6 ">
                                <label
                                  htmlFor="montant"
                                  className="gr-text-8 fw-bold text-blackish-blue"
                                >
                                  Numéro de la facture <sup className="text-red">*</sup>
                                </label>
                                <div className="input-group">
                                <input
                                  className="form-control gr-text-11 border mt-3 bg-white"
                                  type="number"
                                  id="montant"
                                  placeholder="Numéro de la facture"
                                  required
                                  defaultValue={objet} 
                                  onChange={(event)=>setObjet(event.target.value)}
                                />

                                </div>
                              </div>
                            ) : ("")}

                            <div className="form-group my-6 ">
                              <label
                                htmlFor="montant"
                                className="gr-text-8 fw-bold text-blackish-blue"
                              >
                                Montant à payer <sup className="text-red">*</sup>
                              </label>
                              <div className="input-group flex-nowrap">
                              <input
                                className="form-control gr-text-11 border mt-3 bg-white"
                                type="number"
                                id="montant"
                                placeholder="Montant à payer"
                                required
                                defaultValue={montantEnvoyer} 
                                onChange={(event)=>setMontantEnvoyer(event.target.value)}
                              />
                              <span className="input-group-text gr-text-11  mt-3" id="addon-wrapping">{symbol}</span>

                              </div>
                            </div>

                            <Row className="my-3 justify-content-center align-items-center">
                              <Col
                                  xs="6"
                                  md="6"
                                  lg="6"
                                  xl="6"
                                className="order-lg-1 text-center"
                              >
                              <Button variant="success" onClick={addPaymentRequest} className="text-white" >
                                Envoyer
                              </Button>
                              </Col>
                            </Row>
                          </form>
                        ):("")
                      }
                    </div>

                    <div
                    className={toggleState === 2 ? "content  active-content" : "content"}
                    >
                     {/* Formulaire de la partie avec adresse email  */}
                     <form onSubmit={handleSubmit}>
                        <div className="form-group my-6 ">
                          <label
                            htmlFor="montant"
                            className="gr-text-8 fw-bold text-blackish-blue"
                          >
                            Adresse email du recepteur <sup className="text-red">*</sup>

                          </label>
                          <div className="input-group flex-nowrap">
                          <input
                              className="form-control gr-text-11 border mt-3 bg-white"
                              type="email"
                              id="email"
                              placeholder="Adresse email du recepteur"
                              required
                              defaultValue={emailOtherUser} 
                              onChange={(event)=>setEmailOtherUser(event.target.value)}
                              
                          />
                          <span className="gr-text-8 mx-2" id="addon-wrapping">
                            <button onClick={searchUserWithEmail} disabled={isLoggingIn}><Icon  icon="bx:search-alt"  />
                            </button>
                          </span>

                          </div>
                        </div>
                        {infosOtherUser?.entreprise ? (
                          <p className="gr-text-8 " id="addon-wrapping">
                            Nom de l'entreprise : {infosOtherUser?.entreprise}
                          </p>
                        ) : (infosOtherUser?.firstName && infosOtherUser?.lastName ?
                         (<div>
                            <p className="gr-text-8 " id="addon-wrapping">
                              Nom : {infosOtherUser?.firstName}
                            </p>
                            <p className="gr-text-8 " id="addon-wrapping">
                              Prenom : {infosOtherUser?.lastName}
                            </p>
                         </div>) : <p className="gr-text-8 colorRed" id="addon-wrapping">{infosOtherUser?.message}</p>)}
                      </form>

                      {infosOtherUser?.entreprise || infosOtherUser?.firstName || infosOtherUser?.lastName?
                        (
                          <form className='mt-3'>
                            {infosOtherUser?.entreprise ? (
                              <div className="form-group my-6 ">
                                <label
                                  htmlFor="montant"
                                  className="gr-text-8 fw-bold text-blackish-blue"
                                >
                                  Numéro de la facture <sup className="text-red">*</sup>
                                </label>
                                <div className="input-group">
                                <input
                                  className="form-control gr-text-11 border mt-3 bg-white"
                                  type="number"
                                  id="montant"
                                  placeholder="Numéro de la facture"
                                  required
                                  defaultValue={objet} 
                                  onChange={(event)=>setObjet(event.target.value)}
                                />

                                </div>
                              </div>
                            ) : ("")}

                            <div className="form-group my-6 ">
                              <label
                                htmlFor="montant"
                                className="gr-text-8 fw-bold text-blackish-blue"
                              >
                                Montant à payer <sup className="text-red">*</sup>
                              </label>
                              <div className="input-group flex-nowrap">
                              <input
                                className="form-control gr-text-11 border mt-3 bg-white"
                                type="number"
                                id="montant"
                                placeholder="Montant à payer"
                                required
                                defaultValue={montantEnvoyer} 
                                onChange={(event)=>setMontantEnvoyer(event.target.value)}
                              />
                              <span className="input-group-text gr-text-11  mt-3" id="addon-wrapping">{symbol}</span>

                              </div>
                            </div>

                            <Row className="my-3 justify-content-center align-items-center">
                              <Col
                                  xs="6"
                                  md="6"
                                  lg="6"
                                  xl="6"
                                className="order-lg-1 text-center"
                              >
                              <Button variant="success" onClick={addPaymentRequest} className="text-white" >
                                Envoyer
                              </Button>
                              </Col>
                            </Row>
                          </form>
                        ):("")
                      }
                    </div>

                    <div
                    className={toggleState === 3 ? "content  active-content" : "content"}
                    >
                     {/* Formulaire de la partie avec identifiant  */}
                     <form onSubmit={handleSubmit}>
                        <div className="form-group my-6 ">
                          <label
                            htmlFor="montant"
                            className="gr-text-8 fw-bold text-blackish-blue"
                          >
                            Identifiant du recepteur <sup className="text-red">*</sup>

                          </label>
                          <div className="input-group flex-nowrap">
                          <input
                              className="form-control gr-text-11 border mt-3 bg-white"
                              type="text"
                              id="addressTo"
                              placeholder="Identifiant du recepteur"
                              required
                              defaultValue={codeOtherUser} 
                              onChange={(event)=>setCodeOtherUser(event.target.value)}
                          />
                          <span className="gr-text-8 mx-2" id="addon-wrapping">
                            <button onClick={searchUserWithIdentifiant} disabled={isLoggingIn}><Icon  icon="bx:search-alt"  />
                            </button>
                          </span>

                          </div>
                        </div>
                        {infosOtherUser?.entreprise ? (
                          <p className="gr-text-8 " id="addon-wrapping">
                            Nom de l'entreprise : {infosOtherUser?.entreprise}
                          </p>
                        ) : (infosOtherUser?.firstName && infosOtherUser?.lastName ?
                         (<div>
                            <p className="gr-text-8 " id="addon-wrapping">
                              Nom : {infosOtherUser?.firstName}
                            </p>
                            <p className="gr-text-8 " id="addon-wrapping">
                              Prenom : {infosOtherUser?.lastName}
                            </p>
                         </div>) : <p className="gr-text-8 colorRed" id="addon-wrapping">{infosOtherUser?.message}</p>)}
                      </form>

                      {infosOtherUser?.entreprise || infosOtherUser?.firstName || infosOtherUser?.lastName?
                        (
                          <form className='mt-3'>
                            {infosOtherUser?.entreprise ? (
                              <div className="form-group my-6 ">
                                <label
                                  htmlFor="montant"
                                  className="gr-text-8 fw-bold text-blackish-blue"
                                >
                                  Numéro de la facture <sup className="text-red">*</sup>
                                </label>
                                <div className="input-group">
                                <input
                                  className="form-control gr-text-11 border mt-3 bg-white"
                                  type="number"
                                  id="montant"
                                  placeholder="Numéro de la facture"
                                  required
                                  defaultValue={objet} 
                                  onChange={(event)=>setObjet(event.target.value)}
                                />

                                </div>
                              </div>
                            ) : ("")}

                            <div className="form-group my-6 ">
                              <label
                                htmlFor="montant"
                                className="gr-text-8 fw-bold text-blackish-blue"
                              >
                                Montant à payer <sup className="text-red">*</sup>
                              </label>
                              <div className="input-group flex-nowrap">
                              <input
                                className="form-control gr-text-11 border mt-3 bg-white"
                                type="number"
                                id="montant"
                                placeholder="Montant à payer"
                                required
                                defaultValue={montantEnvoyer} 
                                onChange={(event)=>setMontantEnvoyer(event.target.value)}
                              />
                              <span className="input-group-text gr-text-11  mt-3" id="addon-wrapping">{symbol}</span>

                              </div>
                            </div>

                            <Row className="my-3 justify-content-center align-items-center">
                              <Col
                                  xs="6"
                                  md="6"
                                  lg="6"
                                  xl="6"
                                className="order-lg-1 text-center"
                              >
                              <Button variant="success" onClick={addPaymentRequest} className="text-white" >
                                Envoyer
                              </Button>
                              </Col>
                            </Row>
                          </form>
                        ):("")
                      }
                    </div>
                  </div>
 
                    </div>
                <div className='col-lg-3 col-md-12'></div>
            </div>
        </div>
    </>
  );
};

export default PaymentRequest;
