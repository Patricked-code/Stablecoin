import { useRef, useState, useEffect } from 'react';
import { Container, Row, Col, Collapse, Button, Modal,Form } from "react-bootstrap";

import React from "react";
import axios from 'axios';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import moment from 'moment';
import Swal from 'sweetalert2';



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



const DemandeAccesKyc = () => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API

    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [messageError, setMessageError] = useState();

    // States recherche de d'un utilisateur
    const [userSignIn, setUserSignIn] = useState();
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
    const [object, setObject] = useState('');
    const [emailNotification, setEmailNotification] = useState('');

    
    
    
    /**
     * Représente l'état de bascule du tableau.
     * @type {number}
     */
    const [toggleState, setToggleState] = useState(1);

    /**
     * Fonction pour basculer l'onglet en fonction de l'index fourni.
     * @param {number} index - L'index de l'onglet à basculer.
     * @returns {void}
     */
    const toggleTab = (index) => {
        setToggleState(index);
    };
    // Fin

    /**
     * Hook d'effet pour récupérer et définir les informations de l'utilisateur connecté.
     * @returns {void}
     */
    useEffect(async () => {
        const token = localStorage.getItem('tokenEnCours');
        
        /**
         * Fonction pour obtenir l'utilisateur connecté et mettre à jour l'état.
         * @returns {void}
         */
        const getUserSignIn = async () => {
            const result = await fetch(`${API_URL}/api/user/find-user-sign-in`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((result) => result.json())
            .then((data) => {
                setUserSignIn(data);
            });
        };

        await getUserSignIn();
    }, []);
    // FIN

    /**
     * Recherche un utilisateur en fonction de son adresse e-mail.
     * @function
     * @returns {void}
     */
    const searchUserWithEmail = () => {
      if (emailOtherUser) {
          /**
           * Fonction pour obtenir un utilisateur en fonction de son adresse e-mail.
           * @async
           * @param {string} _emailOtherUser - L'adresse e-mail de l'utilisateur recherché.
           * @returns {void}
           */
          const getUser = async (_emailOtherUser) => {
              const result = await fetch(`${API_URL}/api/user/find-user-by-email?email=${_emailOtherUser}`, {
                  headers: {
                      'Content-Type': 'application/json',
                  },
              })
                  .then((result) => result.json())
                  .then((user) => {
                      setInfosOtherUser(user);
                  });
          };

          getUser(emailOtherUser);
      }
    };
    // FIN

    /**
    * Recherche un utilisateur en fonction de son adresse blockchain.
    * @function
    * @returns {void}
    */
    const searchUserWithBlockchain = () => {
      if (addressTo) {
          /**
           * Fonction pour obtenir un utilisateur en fonction de son adresse blockchain.
           * @async
           * @param {string} _addressTo - L'adresse blockchain de l'utilisateur recherché.
           * @returns {void}
           */
          const getUser = async (_addressTo) => {
              const result = await fetch(`${API_URL}/api/user/find-user-by-addrBlockchain?address=${_addressTo}`, {
                  headers: {
                      'Content-Type': 'application/json',
                  },
              })
                  .then((result) => result.json())
                  .then((user) => {
                      setInfosOtherUser(user);
                  });
          };

          getUser(addressTo);
      }
    };
    // FIN

    /**
    * Recherche un utilisateur en fonction de son identifiant.
    * @function
    * @returns {void}
    */
    const searchUserWithIdentifiant = () => {
      if (codeOtherUser) {
          /**
           * Fonction pour obtenir un utilisateur en fonction de son identifiant.
           * @async
           * @param {string} _codeOtherUser - L'identifiant de l'utilisateur recherché.
           * @returns {void}
           */
          const getUser = async (_codeOtherUser) => {
              const result = await fetch(`${API_URL}/api/user/find-user-by-userCode?code=${_codeOtherUser}`, {
                  headers: {
                      'Content-Type': 'application/json',
                  },
              })
                  .then((result) => result.json())
                  .then((user) => {
                      setInfosOtherUser(user);
                  });
          };

          getUser(codeOtherUser);
      }
    };
    // FIN

    /**
    * Fonction de gestion de la soumission du formulaire.
    * @function
    * @param {Event} e - L'événement de soumission du formulaire.
    * @returns {void}
    */
    const handleSubmit = (e) => {
      e.preventDefault();
    };



    // ************************************************************************
      // PARTIE SCANNER DU QR CODE
    // *************************************************************************

    /**
     * Référence à l'élément de scanner de code QR.
     * @type {React.MutableRefObject<null>}
   */
    const qrScannerRef = useRef(null);

    /**
     * État pour afficher ou masquer le scanner de code QR.
     * @type {boolean}
     */
    const [showScanner, setShowScanner] = useState();

    /**
     * État pour afficher ou masquer la saisie manuelle.
     * @type {boolean}
     */
    const [showInput, setShowInput] = useState();

    /**
     * Fonction de gestion du résultat de la numérisation du code QR.
     * @param {object} data - Les données extraites du code QR.
     * @returns {void}
     */
    const handleScan = (data) => {
        if (data) {
            /**
             * Met à jour l'adresse avec les données extraites du code QR.
             * @type {string}
             */
            setAddressTo(data?.text);
            
            // Appel automatique de la fonction de recherche des informations après avoir scanné le code QR
            // searchUserWithBlockchain();
        }
    };

    /**
     * Fonction de gestion des erreurs lors de la numérisation du code QR.
     * @param {Error} error - L'objet d'erreur généré lors de la numérisation.
     * @returns {void}
     */
    const handleError = (error) => {
        console.error(error);
    };
    // *****************************FIN SCANNER*****************************


    /**
     * Récupère une seule ligne de KYC (Know Your Customer) particulier pour un utilisateur en fonction de son ID.
     * Cette fonction est spécifiquement conçue pour les utilisateurs de type "particulier".
     *
     * @function
     * @param {string} _userId - L'ID de l'utilisateur pour lequel récupérer les informations KYC.
     * @returns {void}
   */
    if (infosOtherUser?.codeTypeProfil === "part") {
        
      const getOneKycForParticular = async (_userId) => {
          // Obtenir le token en cours
          const token = localStorage.getItem('tokenEnCours');
          try {
              /**
               * Requête pour récupérer une seule ligne de KYC particulier en fonction de l'ID de l'utilisateur.
               * @type {Response}
               */
              const resKyc = await fetch(`${API_URL}/api/kyc/particular/find-one-kyc-particular-by-userId?userId=${_userId}`, {
                  headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${token}`
                  },
              });

              if (!resKyc.ok) {
                  throw new Error('Failed to fetch KYC data');
              }

              /**
               * Données KYC récupérées pour un particulier.
               * @type {object}
               */
              const data = await resKyc.json();
              setOneKycForParticular(data);
          } catch (error) {
              // Gérer les erreurs de manière appropriée, par exemple, définir un état d'erreur.
              console.error('Erreur lors de la récupération des données KYC :', error);
          }
      };

      // Appel de la fonction pour récupérer le KYC pour le particulier actuel.
      getOneKycForParticular(infosOtherUser?.id);
    }













    /**
     * Fonction pour vider les champs liés à la recherche d'informations utilisateur
     * lorsqu'on clique sur les boutons Email, Adresse Blockchain et Identifiant.
     *
     * @function
     * @returns {void}
    */
    const dumpVariables = () => {
      setInfosOtherUser("");
      setAddressTo("");
      setEmailOtherUser("");
      setCodeOtherUser("");
      setReasonFiling(""); 
      setFundsOrigin("");
    };


    /**
      * Partie d'envoi des données de la demande KYC particulier.
      * Utilise l'état `selectedOptions` pour suivre les options sélectionnées.
      *
      * @type {Array<string>} selectedOptions - Les options sélectionnées pour la demande KYC.
      * @type {Function} setSelectedOptions - Fonction pour mettre à jour l'état des options sélectionnées.
      *
      * @function
      * @param {Event} e - L'événement de changement d'option.
      * @returns {void}
    */
     const [selectedOptions, setSelectedOptions] = useState([]);

    const handleOptionChange = (e) => {
      const value = e.target.value;
      const isChecked = e.target.checked;

      if (isChecked) {
          /**
           * Ajoute la valeur à la liste des options sélectionnées.
           * @type {Array<string>}
           */
          setSelectedOptions([...selectedOptions, value]);
      } else {
          /**
           * Retire la valeur de la liste des options sélectionnées.
           * @type {Array<string>}
           */
          setSelectedOptions(selectedOptions.filter(option => option !== value));
      }
    };


    /**
     * Fonction pour envoyer une demande KYC particulier.
     *
     * @function
     * @param {Event} e - L'événement de soumission du formulaire.
     * @returns {void}
    */
    const requestKycParticular = async (e) => {
      e.preventDefault();
      setIsLoggingIn(true);
      
      // Création du nom complet du propriétaire KYC
      const nameOwnerKyc = infosOtherUser?.lastName + " " + infosOtherUser?.firstName;

      try {
          /**
           * Données du formulaire à envoyer pour la demande KYC particulier.
           * @type {object}
           */
          const dataForm = {
              quizAml: selectedOptions.filter(option => option.includes("Questionnaire AML")),
              quizFatca: selectedOptions.filter(option => option.includes("Questionnaire FATCA")),
              identity: selectedOptions.filter(option => option.includes("Justificatif d'identité")),
              residence: selectedOptions.filter(option => option.includes("Justificatif de domicile")),
              photo: selectedOptions.filter(option => option.includes("Photo")),
              signature: selectedOptions.filter(option => option.includes("Signature")),
          };

          /**
           * Données à envoyer dans la requête KYC.
           * @type {object}
           */
          const requestData = {
              quizAml: dataForm?.quizAml[0] || null,
              quizFatca: dataForm?.quizFatca[0] || null,
              identity: dataForm?.identity[0] || null,
              residence: dataForm?.residence[0] || null,
              photo: dataForm?.photo[0] || null,
              signature: dataForm?.signature[0] || null,
              emailNotification: emailNotification,
              nameOwnerKyc: nameOwnerKyc,
              nameInstitution: userSignIn?.entreprise,
              object: object,
              particularKycId: oneKycForParticular?.id,
              ownerId: infosOtherUser?.id
          };

          // Obtenir le token en cours
          const token = localStorage.getItem('tokenEnCours');

          /**
           * Réponse de la requête KYC.
           * @type {Response}
           */
          const response = await fetch(`${API_URL}/api/kyc/add-kyc-request`, {
              method: 'POST',
              body: JSON.stringify(requestData),
              headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`
              },
          });

          /**
           * Données de la réponse de la requête KYC.
           * @type {object}
           */
          const data = await response.json();

          /* Verifier s'il y a un messsage d'erreur, on l'affiche dans SWAL 
          * sinon on affiche le message de succès
          */
          if (data.message == 200) {
              Swal.fire({
                  position: 'center',
                  icon: 'success',
                  html: `<p> Votre demande a été envoyée avec succès.</p>`,
                  showConfirmButton: false,
                  timer: 5000
              });

              // Actualiser après l'affichage
              setTimeout(() => {
                  window.location.reload();
              }, 7000);
              // Fin
          } else {
              setMessageError(data.message);
              setIsLoggingIn(false);
              Swal.fire({
                  position: 'center',
                  icon: 'error',
                  html: `<p> ${messageError} </p>`,
                  showConfirmButton: false,
                  timer: 10000
              });
          }
          // Fin condition
      } catch (error) {
          console.error('Erreur =>', error);
      }
    };


    /**
      * Partie d'envoi des données de la demande KYC entreprise.
      * Utilise l'état `selectedOptionsEntreprise` pour suivre les options sélectionnées.
      *
      * @type {Array<string>} selectedOptionsEntreprise - Les options sélectionnées pour la demande KYC.
      * @type {Function} setSelectedOptionsEntreprise - Fonction pour mettre à jour l'état des options sélectionnées.
      *
      * @function
      * @param {Event} e - L'événement de changement d'option.
      * @returns {void}
    */
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



    /**
     *
     * @function
     * @param {Event} e - L'événement de soumission du formulaire.
     * @returns {void}
     * 
    */
    const handleSubmitEntreprise = async (e) => {
      e.preventDefault();
      setIsLoggingIn(true);

      try {
          /**
           * Données du formulaire à envoyer pour la demande KYC entreprise.
           * @type {object}
           */
          const dataForm = {
              quizAmlBusiness: selectedOptionsEntreprise.filter(option => option.includes("Questionnaire AML")),
              identityBusiness: selectedOptionsEntreprise.filter(option => option.includes("Justificatif d'identité")),
              legalRepresentatives: selectedOptionsEntreprise.filter(option => option.includes("Représentants légaux")),
              beneficiaries: selectedOptionsEntreprise.filter(option => option.includes("Bénéficiaires effectifs")),
              structures: selectedOptionsEntreprise.filter(option => option.includes("Structures de contrôle")),
              politicallyExposed: selectedOptionsEntreprise.filter(option => option.includes("Personnes politiquement exposées")),
              financialOperation: selectedOptionsEntreprise.filter(option => option.includes("Opérations financières")),
              fundOrigin: selectedOptionsEntreprise.filter(option => option.includes("Origine des fonds")),
              financialInformation: selectedOptionsEntreprise.filter(option => option.includes("Informations financières")),
              financialTransaction: selectedOptionsEntreprise.filter(option => option.includes("Transactions financières")),
              legalDocuments: selectedOptionsEntreprise.filter(option => option.includes("Documents légaux")),
          };

          /**
           * Données à envoyer dans la requête KYC entreprise.
           * @type {object}
           */
          const requestData = {
              quizAmlBusiness: dataForm?.quizAmlBusiness[0] || null,
              identityBusiness: dataForm?.identityBusiness[0] || null,
              legalRepresentatives: dataForm?.legalRepresentatives[0] || null,
              beneficiaries: dataForm?.beneficiaries[0] || null,
              structures: dataForm?.structures[0] || null,
              politicallyExposed: dataForm?.politicallyExposed[0] || null,
              financialOperation: dataForm?.financialOperation[0] || null,
              fundOrigin: dataForm?.fundOrigin[0] || null,
              financialInformation: dataForm?.financialInformation[0] || null,
              financialTransaction: dataForm?.financialTransaction[0] || null,
              legalDocuments: dataForm?.legalDocuments[0] || null,
              emailNotification: emailNotification,
              nameOwnerKyc: infosOtherUser?.entreprise,
              nameInstitution: userSignIn?.entreprise,
              object: object,
              ownerId: infosOtherUser?.id
          };

          // Obtenir le token en cours
          const token = localStorage.getItem('tokenEnCours');

          /**
           * Réponse de la requête KYC entreprise.
           * @type {Response}
           */
          const response = await fetch(`${API_URL}/api/kyc/add-kyc-request`, {
              method: 'POST',
              body: JSON.stringify(requestData),
              headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`
              },
          });

          /**
           * Données de la réponse de la requête KYC entreprise.
           * @type {object}
           */
          const data = await response.json();

          /* Vérifier s'il y a un message d'erreur, on l'affiche dans SWAL 
          * sinon on affiche le message de succès
          */
          if (data.message == 200) {
              Swal.fire({
                  position: 'center',
                  icon: 'success',
                  html: `<p> Votre demande a été envoyée avec succès.</p>`,
                  showConfirmButton: false,
                  timer: 5000
              });

              // Actualiser après l'affichage
              setTimeout(() => {
                  window.location.reload();
              }, 7000);
              // Fin
          } else {
              setMessageError(data.message);
              setIsLoggingIn(false);
              Swal.fire({
                  position: 'center',
                  icon: 'error',
                  html: `<p> ${messageError} </p>`,
                  showConfirmButton: false,
                  timer: 10000
              });
          }
          // Fin condition
      } catch (error) {
          console.error('Erreur =>', error);
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

                                            <form onSubmit={handleSubmit}>
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
                                                      className="text-blackish-blue mt-3"
                                                  >
                                                      Votre email de notification
                                                  </label>
                                                  <input
                                                    className="form-control gr-text-11 border bg-white"
                                                    type="email"
                                                    id="emailNotification"
                                                    placeholder="Votre email de notification"
                                                    required
                                                    defaultValue={emailNotification} 
                                                    onChange={(event)=>setEmailNotification(event.target.value)}
                                                    
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
                                                      defaultValue={object} 
                                                      onChange={(event)=>setObject(event.target.value)}
                                                    />
                                                </div>
                                                <div className="form-group mb-6 mt-3 col-lg-12 col-md-12  row justify-content-between">
                                                    <button className="btn btn-primary" onClick={handleSubmitEntreprise} disabled={isLoggingIn}>Envoyer</button>
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
                                                    Veuillez demander les parties de KYC de <b>  {infosOtherUser?.lastName} {infosOtherUser?.firstName}</b> dont vous souhaiterez voir.
                                                    
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
                                                        type="email"
                                                        id="emailNotification"
                                                        placeholder="Votre email de notification"
                                                        required
                                                        defaultValue={emailNotification} 
                                                        onChange={(event)=>setEmailNotification(event.target.value)}
                                                        
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
                                                          defaultValue={object} 
                                                          onChange={(event)=>setObject(event.target.value)}
                                                        />
                                                    </div>

                                                    <div className="form-group mb-6 mt-3 col-lg-12 col-md-12  row justify-content-between">
                                                        <button className="btn btn-primary" onClick={requestKycParticular } disabled={isLoggingIn}>Envoyer</button>
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
