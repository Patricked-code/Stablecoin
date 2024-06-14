import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Modal } from "react-bootstrap";
import {Button,Form} from "reactstrap";

// Pour Magic
import { magic } from "../../../../../magic";
import { ethers } from "ethers";
// import Loading from "../../../components/loading";
import Router from "next/router";
import { Table } from '@nextui-org/react';
import Link from 'next/link';
import moment from 'moment';
import Swal from 'sweetalert2';
import ABI_FACTORY_ESCROW from "../../../../../components/Contrats/Abi/AbiFactoryEscrow.json";
import ABI_ESCROW_STABLECOIN from "../../../../../components/Contrats/Abi/AbiFactoryEscrow.json";






const SurEcommerces = () => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API
     // Variable de l'api key de stablecoin
     const API_KEY_STABLECOIN = process.env.NEXT_PUBLIC_API_KEY_STABLECOIN

    // Pour les smart contrats
    const ADDRESS_CONTRAT_FACTORY_ESCROW = process.env.NEXT_PUBLIC_ADDRESS_CONTRAT_FACTORY_ESCROW
    const ADDRESS_CONTRAT_EWARI = process.env.NEXT_PUBLIC_ADDRESS_CONTRAT_EWARI
    const PRIVATE_KEY = process.env.NEXT_PUBLIC_PRIVATE_KEY

    const [isLoggingIn, setIsLoggingIn] = useState();
    const [currentUser, setCurrentUser] = useState();
    const [userById, setUserById] = useState();
    const [provider, setProvider] = useState(null);
    const [messageError, setMessageError] = useState();
    const [allDataRequestUseStablecoinEshop, setAllDataRequestUseStablecoinEshop] = useState();

    
    const [contractFactoryEscrow, setContractFactoryEscrow] = useState();
    
    // States du formulaire d'acceptation par partie
    const [requestId, setRequestId] = useState();
    const [dataRequestById, setDataRequestById] = useState();
    const [contractUnsigned, setContractUnsigned] = useState();
    const [reason, setReason]=useState()

    const [resetTime, setResetTime] = useState()
    const [limit, setLimit] = useState()
    const [addressEscrow, setAddressEscrow] = useState()
    

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
     * État de contrôle pour afficher ou masquer la modal des informations de la demande d'accès.
     * @type {boolean}
    */
     const [showInfos, setShowInfos] = useState(false);

     /**
      * Fonction pour fermer la modal des informations.
      * @function
      * @returns {void}
      */
     const handleCloseInfos = () => setShowInfos(false);
 
     /**
      * Fonction pour afficher la modal des informations.
      * @function
      * @returns {void}
      */
     const handleShowInfos = () => setShowInfos(true);

    /**
     * État de contrôle pour afficher ou masquer la modal du contrat signer.
     * @type {boolean}
    */
     const [showContrat, setShowContrat] = useState(false);

     /**
      * Fonction pour fermer la modal du contrat.
      * @function
      * @returns {void}
      */
     const handleCloseContrat = () => setShowContrat(false);
 
     /**
      * Fonction pour afficher la modal du contrat.
      * @function
      * @returns {void}
      */
     const handleShowContrat = () => setShowContrat(true);
 

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

                // const wallet = new ethers.Wallet(privateKey, provider);

                /**
                 * Smart contrat du factory d'escrow.
                 * @type {string}
                 */
                const walletRelay = new ethers.Wallet(PRIVATE_KEY, provider);
                const contract_FactoryEscrow = new ethers.Contract(ADDRESS_CONTRAT_FACTORY_ESCROW, ABI_FACTORY_ESCROW.abi, walletRelay);
                setContractFactoryEscrow(contract_FactoryEscrow)

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
                     if (user?.profileId==2 || user?.profileId==3) {
                        setCurrentUser(user)
                    }else{
                        Router.push("/profil/"); 
                        
                    }
                } catch (error) {
                    // Gérer les erreurs de manière appropriée, par exemple, définir un état d'erreur.
                    console.error('Erreur lors de la récupération des données de l\'utilisateur:', error);
                }
            }
        };

        // Appel de la fonction asynchrone pour obtenir les données lorsqu'il y a des changements dans `provider` ou `magic`.
        fetchData();
    }, [provider, magic]);


    
    useEffect(async () => {
        const getAllDataRequestUseStablecoinEshop = async () => {
            const token = localStorage.getItem('tokenEnCours');

            try {
                
                const result = await fetch(`${API_URL}/api/apikey/find-all-request-use-stablecoin-for-eshop`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': `${API_KEY_STABLECOIN}`,
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!result.ok) {
                    throw new Error('Failed to fetch request data');
                }

                
                const data = await result.json();
                setAllDataRequestUseStablecoinEshop(data);
            } catch (error) {
                // Gérer les erreurs de manière appropriée, par exemple, définir un état d'erreur.
                console.error('Erreur lors de la récupération des demandes:', error);
            }
        };

        await getAllDataRequestUseStablecoinEshop();
    }, []);


    // Pour uploader le fichier du contrat
    const handleFileChange = (event) => {
        setContractUnsigned(event.target.files[0]);
    };

    // Fonction pour envoyer le contrat au marchand
    const acceptRequest = async (_addressEscrow) => {
        setIsLoggingIn(true);

        if (!contractUnsigned) {
            setUploadStatus('Vous devez sélectionner un fichier.');
            return;
            }
    
            

        try {
            
            // const dataBody ={
            //     // rateLimit: {
            //     //     limit: limit,
            //     //     resetTime: resetTime,
            //     // },
            //     addressEscrow:_addressEscrow
            // }
           
            const formData = new FormData();
            formData.append('contract', contractUnsigned);
            formData.append('addressEscrow', _addressEscrow);

            // Obtenir le token en cours
            const token = localStorage.getItem('tokenEnCours');
            /**
             * Réponse de la requête KYC.
             * @type {Response}
             */
            const response = await fetch(`${API_URL}/api/apikey/answer-of-request-use-stablecoin-for-eshop/${requestId}`, {
                method: 'PUT',
                body: formData,
                headers: {
                    // 'Content-Type': 'application/json',
                    'x-api-key': `${API_KEY_STABLECOIN}`,
                    Authorization: `Bearer ${token}`
                },
            });
  
            /**
             * Données de la réponse de la requête .
             * @type {object}
             */
            const data = await response.json();
  
            /* Verifier s'il y a un messsage d'erreur, on l'affiche dans SWAL 
            * sinon on affiche le message de succès
            */
            if (data.message===200) {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    html: `<p> Vous avez envoyé un contrat à signer au marchand avec succès.</p>`,
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


    // FONCTION POUR RECUPERER LES INFOS DE L'UTILISATEUR EN FONCTION DE SON ID
    useEffect(() => {
        const getUserById = async (_userId) => {
        try {
            const result = await fetch(`${API_URL}/api/user/find-one-user-by-id/${_userId}`, {
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': `${API_KEY_STABLECOIN}`,
            },
            });
    
            if (!result.ok) {
            throw new Error('Failed to fetch user data');
            }
    
            const user = await result.json();
            setUserById(user);
        } catch (error) {
            // Handle errors appropriately, e.g., set an error state.
            console.error('Error fetching user data:', error);
        }
        };
    
        if (dataRequestById?.userId) {
        getUserById(dataRequestById?.userId);
        }
    }, [dataRequestById?.userId]);
    // FIN
    
    

     // FONCTION POUR RECUPERER LES INFOS D'UNE DEMANDE D'ACCESS SPECIFIQUE
     useEffect(() => {
        // Obtenir le token en cours
        const token = localStorage.getItem('tokenEnCours');

        const getDataRequestById = async (_requestId) => {
        try {
            const result = await fetch(`${API_URL}/api/apikey/find-one-request-use-stablecoin-for-eshop/${_requestId}`, {
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': `${API_KEY_STABLECOIN}`,
                Authorization: `Bearer ${token}`

            },
            });
    
            if (!result.ok) {
            throw new Error('Failed to fetch user data');
            }
    
            const data = await result.json();
            setDataRequestById(data);
        } catch (error) {
            // Handle errors appropriately, e.g., set an error state.
            console.error('Error fetching user data:', error);
        }
        };
    
        if (requestId) {
        getDataRequestById(requestId);
        }
    }, [requestId]);
    // FIN

    // ****************************************************
        // PARTIE DU SMART CONTRAT
    // *****************************************************
    
    // Fonction pour créer un smart contrat d'escrow pour l'utilisateur
    const createEscrowStablecoin = async () => {
        const maxRetries = 3; // Set a maximum number of retries
        let retryCount = 0;
        setIsLoggingIn(true);

        while (retryCount < maxRetries) {
            try {
                const tx = await contractFactoryEscrow.createEscrowStablecoin(userById?.address, ADDRESS_CONTRAT_EWARI);
                const result = await tx.wait();

                // Écoutez l'événement EscrowStablecoinCreated
                const escrowCreatedEvent = result.events.find(event => event.event === "EscrowStablecoinCreated");
                
                // Vérifiez si l'événement a été trouvé
                if (escrowCreatedEvent) {
                    const escrowContractAddress = escrowCreatedEvent.args[0];
    
                    // Stockez l'adresse du contrat en utilisant setAddressEscrow
                    setAddressEscrow(escrowContractAddress);
                    acceptRequest(escrowContractAddress); // Call the function to accept the request in the database
                    return escrowContractAddress; // Retournez l'adresse du contrat
                } else {
                    setIsLoggingIn(false);
                    console.error("L'événement EscrowStablecoinCreated n'a pas été trouvé dans les logs de la transaction.");
                    return null; // Ou renvoyez une valeur appropriée en cas d'échec
                }
            } catch (error) {
                setIsLoggingIn(false);
                console.error("Erreur =>", error);
                retryCount++;
    
                if (retryCount < maxRetries) {
                    const waitTime = Math.pow(2, retryCount) * 1000; // Exponential backoff: 2^retryCount seconds
                    console.log(`Retrying in ${waitTime / 1000} seconds...`);
                    await new Promise(resolve => setTimeout(resolve, waitTime));
                } else {
                    setIsLoggingIn(false);
                    console.error("Nombre maximal de tentatives atteint. Impossible de finaliser la transaction.");
                    return null; // Ou renvoyez une valeur appropriée en cas d'échec
                }
            }
        }
    };
    
    
    // FONCTION POUR REJETER LA DEMANDE
    const rejetRequest = async () => {
        setIsLoggingIn(true);
        
        try {
            const dataForm ={
                reason:reason
            }
  
            // Obtenir le token en cours
            const token = localStorage.getItem('tokenEnCours');
            /**
             * Réponse de la requête KYC.
             * @type {Response}
             */
            const response = await fetch(`${API_URL}/api/apikey/rejection-request-use-stablecoin-for-eshop/${requestId}`, {
                method: 'PUT',
                body: JSON.stringify(dataForm),
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': `${API_KEY_STABLECOIN}`,
                    Authorization: `Bearer ${token}`
                },
            });
  
            /**
             * Données de la réponse de la requête .
             * @type {object}
             */
            const data = await response.json();
  
            /* Verifier s'il y a un messsage d'erreur, on l'affiche dans SWAL 
            * sinon on affiche le message de succès
            */
            if (data.message===200) {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    html: `<p> Cette demande a été rejetée avec succès.</p>`,
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


     // FONCTION POUR VALIDER LE CONTRAT
     const validContratSign = async () => {
        setIsLoggingIn(true);
        
        try {
           
  
            // Obtenir le token en cours
            const token = localStorage.getItem('tokenEnCours');
            /**
             * Réponse de la requête .
             * @type {Response}
             */
            const response = await fetch(`${API_URL}/api/apikey/valid-contract-for-eshop/${requestId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': `${API_KEY_STABLECOIN}`,
                    Authorization: `Bearer ${token}`
                },
            });
  
            /**
             * Données de la réponse de la requête .
             * @type {object}
             */
            const data = await response.json();
  
            /* Verifier s'il y a un messsage d'erreur, on l'affiche dans SWAL 
            * sinon on affiche le message de succès
            */
            if (data.message===200) {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    html: `<p> Vous avez validé ce contrat avec succès.</p>`,
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
     * Transforme une chaîne de caractères JSON représentant un tableau de types de commerce
     * en une chaîne de caractères lisible avec les éléments séparés par des virgules.
     * La fonction tente de parser la chaîne de caractères en tant que JSON. Si le parsing
     * réussit et que le résultat est un tableau, elle renvoie une chaîne avec les éléments
     * du tableau séparés par des virgules. En cas d'échec du parsing, elle attrape l'erreur
     * et retourne une chaîne vide.
     *
     * @param {string} productTypesString - La chaîne de caractères JSON à transformer.
     * @returns {string} Les types de commerce formatés en une chaîne lisible, ou une chaîne vide en cas d'erreur.
     */
    function formatProductTypes(productTypesString) {
        try {
        const productTypes = JSON.parse(productTypesString);
        if (Array.isArray(productTypes)) {
            return productTypes.join(', ');
        }
        return '';
        } catch (error) {
        console.error('Erreur lors du parsing de productTypes:', error);
        return '';
        }
    }




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


    /**
        * Fonction de gestion de la soumission du formulaire.
        * @function
        * @param {Event} e - L'événement de soumission du formulaire.
        * @returns {void}
    */
    const handleSubmit = (e) => {
        e.preventDefault();
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
                                    <h3 className='text-center'>Demandes d'utilisation de stablecoin sur E-commerces</h3>
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
                                        <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Demandeur</p></Table.Column>
                                        <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Date</p></Table.Column>
                                        <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Statut</p></Table.Column>
                                        <Table.Column><p className="gr-text-8 pt-3 pb-0 mx-5 ">Actions</p></Table.Column>
                                    </Table.Header>
                                    <Table.Body>
                                        {allDataRequestUseStablecoinEshop?.map((data, index) => (
                                            <Table.Row key={index}>                       
                                                <Table.Cell ><small className=" py-0 ">{data?.customerName}</small></Table.Cell>
                                                <Table.Cell ><small className=" py-0 ">{formatDate(data?.createdAt)}</small></Table.Cell>
                                                <Table.Cell >
                                                    <small className=" py-0 ">
                                                        {
                                                        data?.allow == 0?(
                                                        <i className=''>Pas encore acceptée</i>
                                                        ):data?.allow == 1 && data?.validContract == 2 ?(<i className='colorGreen'>Déjà acceptée</i>
                                                        ):data?.allow === 1 && data?.validContract === 0 ?(<i className='colorBlue'>Contrat envoyé au marchand</i>
                                                        ):data?.allow == 1 && data?.validContract == 1 ?(<i className='colorBlue'>Le marchand a envoyé le contrat </i>
                                                        ):data?.allow == 2?(<i className='colorRed'>Rejetée</i>)
                                                        :""}
                                                    </small>
                                                </Table.Cell>

                                                <Table.Cell >
                                                    <div className='text-center d-flex'>
                                                        <button 
                                                            className={`py-0 mx-2 btn ${data?.allow === 1 || data?.allow === 2? 'btn-secondary' : 'btn-primary'} d`}
                                                            onClick={()=>setRequestId(data?.id)}
                                                            disabled={data?.allow === 1 || data?.allow === 2}
                                                        >
                                                            <small className=" py-0  mx-2 " onClick={handleShowForm}>Répondre</small>
                                                        </button>

                                                        <button 
                                                            className={`py-0 mx-2 btn ${data?.allow === 1 || data?.allow === 2? 'btn-secondary' : 'btn-danger'} d`}
                                                            onClick={()=>setRequestId(data?.id)}
                                                            disabled={data?.allow === 1 || data?.allow === 2}
                                                        >
                                                            <small className=" py-2  mx-3 " onClick={handleShowRejection}>Rejeter</small>
                                                        </button>

                                                        <button 
                                                            className={`py-0 mx-2 btn btn-info`}
                                                            onClick={()=>setRequestId(data?.id)}
                                                        >
                                                            <small className=" py-2  mx-3 " onClick={handleShowInfos}>Détails</small>
                                                        </button>

                                                        <button 
                                                            className={`py-0 mx-2 btn ${!data?.allow == 1 && !data?.validContract == 1? 'btn-secondary' : 'btn-success'} d`}
                                                            onClick={()=>setRequestId(data?.id)}
                                                            disabled={!data?.allow == 1 && !data?.validContract == 1}
                                                        >
                                                            <small className=" py-2  mx-3 " onClick={handleShowContrat}>Contrat</small>
                                                        </button>
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
                {/* MODAL D'ENVOIE DU CONTRAT*/}
            {/* ********************************************************************************** */}
            <Modal show={showForm} className="mt-15" onHide={handleCloseForm}>
                <Modal.Header closeButton id="bgcolor">
                    <Modal.Title className="" >Envoie du contrat</Modal.Title>                
                </Modal.Header>
                    <form>
                    <Modal.Body>
                        <div className='form-group my-3'>
                            Veuillez envoyer le contrat à signer au marchand.
                        </div>
                        <input type="file" onChange={handleFileChange} accept=".pdf" />

                        {/* <div className=" mb-3">
                            <label className="">Nombre limite de requêtes</label>
                            <div className="input-group">
                                <input type="number" defaultValue={limit} onChange={(e)=>setLimit(e.target.value)} placeholder="20"  className="input input-sm input-bordered form-control" />
                            </div>
                        </div>
                        <div className=" mb-3">
                            <label className="" >La durée de disponibilité en heure(24h)</label>
                            <div className="input-group">
                                <input type="text" defaultValue={resetTime} onChange={(e)=>setResetTime(e.target.value)} placeholder="24h"  className="input input-sm input-bordered form-control" />
                            </div>
                        </div> */}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className="text-white" color="danger" onClick={handleCloseForm}>
                            Fermer
                        </Button>
                        <Button  onClick={createEscrowStablecoin}  color="success" disabled={isLoggingIn}>
                            Envoyer
                            {isLoggingIn === true ? (<i className="fas fa-spinner fa-spin fa-lg mx-2"></i>) : ("")}
                        </Button>
                    </Modal.Footer>
                    </form>
            </Modal>
            {/* *****************************************FIN****************************************** */}


            {/* ********************************************************************************** */}
                {/* MODAL DE L'AFFICHAGE DES INFORMATIONS*/}
            {/* ********************************************************************************** */}
            <Modal show={showInfos} className="mt-15" onHide={handleCloseInfos}>
                <Modal.Header closeButton id="bgcolor">
                    <Modal.Title className="" >Les informations</Modal.Title>                
                </Modal.Header>
                    <Modal.Body>
                        <div className=''>
                            <div className=''>
                                <b>Nom de la boutique en ligne:</b> <br/>
                                {dataRequestById?.partner}
                            </div>
                            <div className=''>
                                <b>Email:</b> <br/>
                                {dataRequestById?.customerEmail}
                            </div>
                            <div className=''>
                                <b>Lien du site:</b> <br/>
                                {dataRequestById?.siteLink}
                            </div>
                            <div className=''>
                                <b>Lien de notification:</b> <br/>
                                {dataRequestById?.notificationLink}
                            </div>
                            <div className=''>
                                <b>Lien de retour du succès:</b> <br/>
                                {dataRequestById?.returnLink}
                            </div>
                            <div className=''>
                                <b>Lien de retour d'échec:</b> <br/>
                                {dataRequestById?.returnFailLinks}
                            </div>
                            <div className=''>
                                <b>Les types de produits:</b> <br/>
                                {formatProductTypes(dataRequestById?.productType)}
                            </div>

                            <div className=''>
                                <b>Description:</b> <br/>
                                {dataRequestById?.description}
                            </div>

                        </div>
                        
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className="text-white" color="danger" onClick={handleCloseInfos}>
                            Fermer
                        </Button>
                       
                    </Modal.Footer>
            </Modal>
            {/* *****************************************FIN****************************************** */}


            {/* ********************************************************************************** */}
                {/* MODAL DU CONTRAT SIGNER*/}
            {/* ********************************************************************************** */}
            <Modal show={showContrat} className="mt-15" onHide={handleCloseContrat}>
                <Modal.Header closeButton id="bgcolor">
                    <Modal.Title className="" >Voici le contrat.</Modal.Title>                
                </Modal.Header>
                    <form>
                    <Modal.Body>
                        <div className='btn-box'>
                            <a 
                                href={`${API_URL}/${dataRequestById?.contract}`} 
                                download
                                target="_blank"
                            >
                                <Button
                                    block
                                    color="primary"
                                    type="button"
                                >
                                    {dataRequestById?.allow === 1 && dataRequestById?.validContract === 0 ? "Télécharger contrat non signé":"Télécharger contrat final"}
                                </Button>
                            </a>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className="text-white" color="danger" onClick={handleCloseContrat}>
                            Fermer
                        </Button>
                        {/* <Button  onClick={validContratSign}  color="success" disabled={isLoggingIn}> */}
                        {dataRequestById?.allow === 1 && dataRequestById?.validContract === 0 ? (

                            <Button 
                                className={` mx-2 btn  btn-secondary'`}
                                disabled
                            >
                                Valider
                            </Button>
                            ):(
                                <Button 
                                className={` mx-2 btn ${dataRequestById?.allow === 1 && dataRequestById?.validContract === 2? 'btn-secondary' : 'btn-success'} d`}
                                onClick={validContratSign}
                                disabled={dataRequestById?.allow === 1 && dataRequestById?.validContract === 2}
                            >
                                Valider
                                {isLoggingIn === true ? (<i className="fas fa-spinner fa-spin fa-lg mx-2"></i>) : ("")}
                            </Button>
                            )}
                    </Modal.Footer>
                    </form>
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
                        <div className="form-group mb-6">
                            <label
                                htmlFor="reason"
                                className="text-blackish-blue mb-2"
                            >
                                Raison du rejet
                            </label>
                            <textarea
                                className="form-control gr-text-11 border mt-3 bg-white"
                                type="text"
                                id="reason"
                                placeholder="La raison ici"
                                defaultValue={reason} 
                                onChange={(event)=>setReason(event.target.value)}
                            />
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className="text-white" color="primary" onClick={handleCloseRejection}>
                            Fermer
                        </Button>
                        <Button onClick={rejetRequest}  color="danger" disabled={isLoggingIn}>
                            Rejeter
                        </Button>
                    </Modal.Footer>
            </Modal>
            {/* *****************************************FIN****************************************** */}

        </>
    );
};

export default SurEcommerces;
