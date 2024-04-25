import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Modal } from "react-bootstrap";
import {Button,Form} from "reactstrap";


// Pour Magic
import { magic } from "../../../../../magic";
import { ethers } from "ethers";
// import Loading from "../../../components/loading";
import Router from "next/router";
import { Table } from '@nextui-org/react';
import moment from 'moment';
import Swal from 'sweetalert2';


// FIN





const CKycEntrepriseDemandes = () => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API
     // Variable de l'api key de stablecoin
     const API_KEY_STABLECOIN = process.env.NEXT_PUBLIC_API_KEY_STABLECOIN

    const [isLoggingIn, setIsLoggingIn] = useState();
    const [currentUser, setCurrentUser] = useState();
    const [provider, setProvider] = useState(null);
    const [messageError, setMessageError] = useState();

    // States du formulaire d'acceptation par partie
    const [kycRequestId, setKycRequestId] = useState();
    const [oneKycRequest, setOneKycRequest] = useState();
    const [deadline, setDeadline] = useState();
    const [kycRequestOfUser, setKycRequestOfUser] = useState();

    


    
    /**
     * État de contrôle pour afficher ou masquer la modal du formulaire de réponse à la demande d'accès.
     * @type {boolean}
    */
     const [showForm, setShowForm] = useState(false);

     /**
      * Fonction pour fermer la modal du formulaire.
      * @function
      * @returns {void}
      */
     const handleCloseForm = () => setShowForm(false);
 
     /**
      * Fonction pour afficher la modal du formulaire.
      * @function
      * @returns {void}
      */
     const handleShowForm = () => setShowForm(true);
 
     /**
      * État de contrôle pour afficher ou masquer la modal du rejet de la demande.
      * @type {boolean}
      */
     const [showRejection, setShowRejection] = useState(false);
 
     /**
      * Fonction pour fermer la modal du rejet.
      * @function
      * @returns {void}
      */
     const handleCloseRejection = () => setShowRejection(false);
 
     /**
      * Fonction pour afficher la modal du rejet.
      * @function
      * @returns {void}
      */
     const handleShowRejection = () => setShowRejection(true);
 
 
 
 
 
 
     /**
      * Effet pour mettre à jour le fournisseur Ethereum lorsqu'un objet Magic est disponible.
      * Cet effet dépend de l'existence de l'objet `magic`.
      *
      * @function
      * @returns {void}
     */
     useEffect(() => {
         if (!!magic) {
             /**
              * Fournisseur Ethereum basé sur le fournisseur RPC de l'objet Magic.
              * @type {object}
              */
             const pt = new ethers.providers.Web3Provider(magic.rpcProvider);
 
             /**
              * Mise à jour de l'état local avec le nouveau fournisseur Ethereum.
              * @type {object}
              */
             setProvider(pt);
         }
     }, [magic]);
 
 
     /**
      * Effet pour obtenir les métadonnées de l'utilisateur connecté et mettre à jour l'état local.
      * Cet effet dépend de l'existence de l'objet `magic` et `provider`.
      *
      * @function
      * @returns {void}
     */
     useEffect(() => {
         /**
          * Fonction asynchrone pour récupérer les métadonnées de l'utilisateur connecté.
          *
          * @async
          * @returns {void}
          */
         const fetchData = async () => {
             if (!!magic && !!provider) {
                 /**
                  * Métadonnées de l'utilisateur récupérées via l'objet Magic.
                  * @type {object}
                  */
                 const userMetadatas = await magic.user.getMetadata();
 
                 /**
                  * Signataire associé au fournisseur Ethereum.
                  * @type {object}
                  */
                 const signer = provider.getSigner();
 
                 /**
                  * Réseau Ethereum actuel.
                  * @type {object}
                  */
                 const network = await provider.getNetwork();
 
                 /**
                  * Adresse de l'utilisateur connecté.
                  * @type {string}
                  */
                 const userAddress = await signer.getAddress();
 
                 // Obtenir l'utilisateur connecté
                 const token = localStorage.getItem('tokenEnCours');
                 try {
                     /**
                      * Résultat de la requête pour obtenir l'utilisateur connecté.
                      * @type {Response}
                      */
                     const result = await fetch(`${API_URL}/api/user/find-user-sign-in`, {
                         headers: {
                             'Content-Type': 'application/json',
                            'x-api-key': `${API_KEY_STABLECOIN}`,
                             Authorization: `Bearer ${token}`,
                         },
                     });
 
                     if (!result.ok) {
                         throw new Error('Failed to fetch user data');
                     }
 
                     /**
                      * Données de l'utilisateur connecté.
                      * @type {object}
                      */
                     const user = await result.json();
 
                     /**
                      * Mise à jour de l'état local avec les données de l'utilisateur.
                      * @type {object}
                      */
                     setCurrentUser(user);
                 } catch (error) {
                     // Gérer les erreurs de manière appropriée, par exemple, définir un état d'erreur.
                     console.error('Erreur lors de la récupération des données de l\'utilisateur:', error);
                 }
             }
         };
 
         // Appel de la fonction asynchrone pour obtenir les données lorsqu'il y a des changements dans `provider` ou `magic`.
         fetchData();
     }, [provider, magic]);


    /**
      * Partie d'acceptation des données de la demande KYC entreprise.
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
    const acceptKycRequestEntreprise = async (e) => {
        e.preventDefault();
        setIsLoggingIn(true);
    
        try {
            const dataForm = {
                quizAmlBusinessAccept: selectedOptionsEntreprise.includes("Questionnaire AML"),
                identityBusinessAccept: selectedOptionsEntreprise.includes("Justificatif d'identité"),
                legalRepresentativesAccept: selectedOptionsEntreprise.includes("Représentants légaux"),
                beneficiariesAccept: selectedOptionsEntreprise.includes("Bénéficiaires effectifs"),
                structuresAccept: selectedOptionsEntreprise.includes("Structures de contrôle"),
                politicallyExposedAccept: selectedOptionsEntreprise.includes("Personnes politiquement exposées"),
                financialOperationAccept: selectedOptionsEntreprise.includes("Opérations financières"),
                fundOriginAccept: selectedOptionsEntreprise.includes("Origine des fonds"),
                financialInformationAccept: selectedOptionsEntreprise.includes("Informations financières"),
                financialTransactionAccept: selectedOptionsEntreprise.includes("Transactions financières"),
                legalDocumentsAccept: selectedOptionsEntreprise.includes("Documents légaux"),
                deadline:deadline
            };
            
    
            const token = localStorage.getItem('tokenEnCours');
    
            const response = await fetch(`${API_URL}/api/kyc/answer-of-owner-kyc/${oneKycRequest?.id}`, {
                method: 'PUT',
                body: JSON.stringify(dataForm),
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': `${API_KEY_STABLECOIN}`,
                    Authorization: `Bearer ${token}`
                },
            });
    
            const data = await response.json();
    
            if (data.message == 200) {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    html: `<p> Votre réponses a été envoyée avec succès.</p>`,
                    showConfirmButton: false,
                    timer: 5000
                });
    
                setTimeout(() => {
                    window.location.reload();
                }, 7000);
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
        } catch (error) {
            console.error('Erreur =>', error);
        }
    };

    /**
        * Fonction de gestion de la soumission du formulaire.
        * @function
        * @param {Event} e - L'événement de soumission du formulaire.
        * @returns {void}
    */
     const handleSubmit = (e) => {
        e.preventDefault();
      };



    /**
     * Fonction pour rejeter une demande KYC particulier.
     *
     * @function
     * @returns {void}
    */
    const rejectKycEntreprise = async () => {
        setIsLoggingIn(true);
        
        try {
            // Obtenir le token en cours
            const token = localStorage.getItem('tokenEnCours');
  
            /**
             * Réponse de la requête KYC.
             * @type {Response}
             */
            const response = await fetch(`${API_URL}/api/kyc/rejection-request-by-owner-kyc/${oneKycRequest?.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': `${API_KEY_STABLECOIN}`,
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
                    html: `<p> Vous avez rejeté cette demande avec succès.</p>`,
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
         * Hook d'effet pour récupérer les données des demandes d'accès de l'utilisateur connecté.
         * Les données sont stockées dans l'état `kycRequestOfUser`.
         *
         * @async
         * @function
         * @returns {void}
    */
    useEffect(async () => {
        /**
         * Fonction pour obtenir les demandes d'accès de l'utilisateur connecté.
         *
         * @async
         * @returns {void}
         */
        const getKycRequestOfUser = async () => {
            const token = localStorage.getItem('tokenEnCours');

            try {
                /**
                 * Résultat de la requête pour récupérer les demandes d'accès de l'utilisateur connecté.
                 * @type {Response}
                 */
                const result = await fetch(`${API_URL}/api/kyc/find-all-kyc-request-of-kyc-owner`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': `${API_KEY_STABLECOIN}`,
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!result.ok) {
                    throw new Error('Failed to fetch KYC request data');
                }

                /**
                 * Données des demandes d'accès de l'utilisateur connecté.
                 * @type {object[]}
                 */
                const data = await result.json();
                setKycRequestOfUser(data);
            } catch (error) {
                // Gérer les erreurs de manière appropriée, par exemple, définir un état d'erreur.
                console.error('Erreur lors de la récupération des demandes d\'accès KYC:', error);
            }
        };

        // Appel de la fonction pour récupérer les demandes d'accès de l'utilisateur connecté.
        await getKycRequestOfUser();
    }, []);


    /**
     * Hook d'effet pour récupérer les données d'une demande d'accès en fonction de son ID.
     * Les données sont stockées dans l'état `OnekycRequest`.
     *
     * @async
     * @function
     * @returns {void}
    */
    useEffect(async () => {
        /**
         * Fonction pour obtenir une demande d'accès en fonction de son ID.
         *
         * @async
         * @returns {void}
         */
        const getOneKycRequest = async (_kycRequestId) => {
            const token = localStorage.getItem('tokenEnCours');

            try {
                /**
                 * Résultat de la requête pour récupérer une demandes d'accès en fonction de son ID.
                 * @type {Response}
                 */
                const result = await fetch(`${API_URL}/api/kyc/find-one-kyc-request/${_kycRequestId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                    'x-api-key': `${API_KEY_STABLECOIN}`,
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!result.ok) {
                    throw new Error('Failed to fetch KYC request data');
                }

                /**
                 * Données des demandes d'accès de l'utilisateur connecté.
                 * @type {object[]}
                 */
                const data = await result.json();
                setOneKycRequest(data);
            } catch (error) {
                // Gérer les erreurs de manière appropriée, par exemple, définir un état d'erreur.
                console.error('Erreur lors de la récupération des demandes d\'accès KYC:', error);
            }
        };

        // Appel de la fonction pour récupérer les demandes d'accès de l'utilisateur connecté.
        if (kycRequestId) {
            await getOneKycRequest(kycRequestId);
        }
        
    }, [kycRequestId]);


    /**
     * Fonction pour formater une date dans le format 'DD/MM/YYYY'.
     *
     * @function
     * @param {string} _updatedAt - La date à formater.
     * @returns {string} - La date formatée.
    */
    const formatDate = (_updatedAt) => {
        /**
         * Date formatée dans le format 'DD/MM/YYYY'.
         * @type {string}
        */
        const maDate = moment(_updatedAt).format('DD/MM/YYYY');

        return maDate;
    };
    

    return (
        <>
            {/* {currentUser?.profileId==2 || currentUser?.profileId==3?( */}

                <>
                    <div className='row' >
                        <div className='col-lg-1 col-md-1'></div>
                        <div className='col-lg-10 col-md-10'>
                            <div className=' mx-15'>
                                <div className='py-10'>
                                    <h1 className='text-center'>Demandes d'accès au kyc</h1>
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
                            <div className='cryptocurrency-search-box'>
                                <Table
                                    aria-label="Example table with static content"
                                    css={{
                                        height: "auto",
                                        minWidth: "100%",
                                    }}
                                >
                                    <Table.Header>
                                        {/* <Table.Column><p className="gr-text-8 pt-3 pb-0 mx-3 ">Nom & prenom </p></Table.Column> */}
                                        <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Institution</p></Table.Column>
                                        <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Date</p></Table.Column>
                                        <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Date limite</p></Table.Column>
                                        <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Statut</p></Table.Column>
                                        <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Actions</p></Table.Column>
                                    </Table.Header>
                                    <Table.Body>
                                        {kycRequestOfUser?.map((data, index) => (
                                            <Table.Row key={index}>                       
                                                <Table.Cell ><small className=" py-0 ">{data?.nameInstitution}</small></Table.Cell>
                                                <Table.Cell ><small className=" py-0 ">{formatDate(data?.sendingDate)}</small></Table.Cell>
                                                <Table.Cell ><small className=" py-0 ">{data?.deadline?formatDate(data?.deadline):"Aucune"}</small></Table.Cell>
                                                <Table.Cell ><small className=" py-0 ">{data?.status == 0?(<i >Pas encore acceptée</i>):data?.status == 1?(<i className='colorBlue'>Déjà acceptée</i>):data?.status == 2?(<i className='colorGreen'>Traitée</i>):data?.status == 3?(<i className='colorRed'>Rejetée</i>):""}</small></Table.Cell>
                                                <Table.Cell >
                                                    <div className='text-center d-flex'>
                                                        <p onClick={()=>setKycRequestId(data?.id)}>
                                                            <small className=" py-0  mx-2 btn btn-primary" onClick={handleShowForm}>Répondre</small>
                                                        </p>

                                                        <p onClick={()=>setKycRequestId(data?.id)}>
                                                            
                                                            <button 
                                                            className={`py-0 mx-2 btn ${data?.status === 3 ? 'btn-secondary' : 'btn-danger'} d`}
                                                            onClick={handleShowRejection}
                                                            disabled={data?.status === 3}
                                                            >
                                                                Rejeter
                                                            </button>
                                                        </p>
                                                    </div>
                                                </Table.Cell>
                                            </Table.Row >
                                        ))}
                                            
                                    </Table.Body>
                                    {/* <Table.Pagination
                                        shadow
                                        noMargin
                                        align="center"
                                        rowsPerPage={5}
                                        onPageChange={(page) => console.log({ page })}
                                    /> */}
                                </Table>
                            </div>
                        </div>
                    </div>
                    <div className='col-lg-1 col-md-1'></div>

                </>
            {/* ):(
                <span className="text-center bg-default-2 btn-bottom-text  d-block gr-text-5 text-blackish-blue gr-opacity-10 my-35">
                    <Loading/>
                </span>
            )} */}

            {/* ********************************************************************************** */}
                {/* MODAL D'ACCEPTATION OU REFUS DE LA DEMANDE*/}
            {/* ********************************************************************************** */}
            <Modal show={showForm} className="mt-15" onHide={handleCloseForm}>
                <Modal.Header closeButton id="bgcolor">
                    <Modal.Title className="" >Acceptation de la demande</Modal.Title>                
                </Modal.Header>
                <Form role="form" onSubmit={handleSubmit}>
                    <Modal.Body>
                        <div>
                            <label className='mb-3'>
                                Cochez les parties que vous souhaiterez autoriser l'institution financière à voir.
                            </label>
                            {oneKycRequest?.quizAmlBusiness? (
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
                            ) : ('')}

                            {oneKycRequest?.identityBusiness? (
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
                            ) : ('')}   

                            {oneKycRequest?.legalRepresentatives? (
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
                            ) : ('')} 

                            {oneKycRequest?.beneficiaries? (
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
                            ) : ('')} 

                            {oneKycRequest?.structures? (
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
                            ) : ('')} 

                            {oneKycRequest?.politicallyExposed? (
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
                            ) : ('')} 

                            {oneKycRequest?.financialOperation? (
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
                            ) : ('')} 
                            
                            {oneKycRequest?.fundOrigin? (
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
                            ) : ('')} 
                            
                            {oneKycRequest?.financialInformation? (
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
                            ) : ('')} 
                            
                            {oneKycRequest?.financialTransaction? (
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
                            ) : ('')} 
                            
                            {oneKycRequest?.legalDocuments? (
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
                            ) : ('')} 

                            <div className='form-group my-2'>
                                <label className='mx-3'>
                                    Date limite d'accès (Facultatif)
                                </label><br/>
                                <input
                                    type="date"
                                    className='mx-3'
                                    defaultValue={deadline} 
                                    onChange={(event)=>setDeadline(event.target.value)}
                                />
                                  
                            </div>

                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className="text-white" color="danger" onClick={handleCloseForm}>
                            Fermer
                        </Button>
                        <Button  onClick={acceptKycRequestEntreprise}  color="success" disabled={isLoggingIn}>
                            Autoriser
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
            {/* *****************************************FIN****************************************** */}


            {/* ********************************************************************************** */}
                {/* MODAL DU REJET COMPLET DE LA DEMANDE'*/}
            {/* ********************************************************************************** */}
            <Modal show={showRejection} className="mt-15" onHide={handleCloseRejection}>
                <Modal.Header closeButton className="bgColorRed">
                    <Modal.Title className="text-white" >Rejet de la demande</Modal.Title>                
                </Modal.Header>
                    <Modal.Body>
                        <div className='form-group my-3'>
                            Voulez-vous vraiment rejeter cette demande ?
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className="text-white" color="primary" onClick={handleCloseRejection}>
                            Fermer
                        </Button>
                        <Button  onClick={rejectKycEntreprise}  color="danger" disabled={isLoggingIn}>
                            Rejeter
                        </Button>
                    </Modal.Footer>
            </Modal>
            {/* *****************************************FIN****************************************** */}

        </>
    );
};

export default CKycEntrepriseDemandes;
