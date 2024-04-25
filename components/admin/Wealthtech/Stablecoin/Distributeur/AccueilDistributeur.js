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






const AccueilDistributeur = () => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API
     // Variable de l'api key de stablecoin
    const API_KEY_STABLECOIN = process.env.NEXT_PUBLIC_API_KEY_STABLECOIN

    const ADDRESS_COMMISSION =process.env.NEXT_PUBLIC_ADDRESS_COMMISSION

    // Pour les smart contrats
    const ADDRESS_CONTRAT_FACTORY_ESCROW = process.env.NEXT_PUBLIC_ADDRESS_CONTRAT_FACTORY_ESCROW
    const ADDRESS_CONTRAT_EWARI = process.env.NEXT_PUBLIC_ADDRESS_CONTRAT_EWARI
    const PRIVATE_KEY = process.env.NEXT_PUBLIC_PRIVATE_KEY

    const [isLoggingIn, setIsLoggingIn] = useState();
    const [currentUser, setCurrentUser] = useState();
    const [userById, setUserById] = useState();
    const [provider, setProvider] = useState(null);
    const [messageError, setMessageError] = useState();

    
    const [contractFactoryEscrow, setContractFactoryEscrow] = useState();
    
    // States du formulaire d'acceptation par partie
    const [addressEscrow, setAddressEscrow] = useState();
    
    // state du distributeur
    const [requestId, setRequestId] = useState();
    const [allDataDistributeur, setAllDataDistributeur] = useState();
    const [contractUnsigned, setContractUnsigned] = useState()
    const [uploadStatus, setUploadStatus] = useState(null);

    // States pour uploader le contrat non signé
    const [infosDistributer, setInfosDistributer] = useState()
    const [contractSigned, setContractSigned] = useState()


    const [percentage, setPercentage] = useState()
    const [percentageInstitution, setPercentageInstitution] = useState()
    const [percentageWithdrawal, setPercentageWithdrawal] = useState()
    const [percentageWithdrawalInstitution, setPercentageWithdrawalInstitution] = useState()

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
      * État de contrôle pour afficher ou masquer la modal du contrat.
      * @type {boolean}
      */
     const [showChangeContract, setShowChangeContract] = useState(false);
 
     /**
      * Fonction pour fermer du contrat.
      * @function
      * @returns {void}
      */
     const handleCloseChangeContract = () => setShowChangeContract(false);
 
     /**
      * Fonction pour afficher du changement de photo.
      * @function
      * @returns {void}
      */
     const handleShowChangeContract = () => setShowChangeContract(true);
 

    const handleFileChange = (event) => {
        setContractUnsigned(event.target.files[0]);
    };

    // FONCTION POUR UPLOADER LE CONTRAT NON SIGNE
    const handleUpdateContract = async (event) => {
        event.preventDefault();
        // setIsLoggingIn(true);

        if (!contractUnsigned) {
        setUploadStatus('Vous devez sélectionner un fichier.');
        return;
        }

        const formData = new FormData();
        formData.append('contractUnsigned', contractUnsigned);

        // Obtenir le token en cours
        const token = localStorage.getItem('tokenEnCours');

        try {
        const response = await fetch(`${API_URL}/api/distributer/send-contract-unsigned/${requestId}`, {
            method: 'PUT',
            body: formData,
            headers: {
                // 'Content-Type': 'application/json',
                'x-api-key': `${API_KEY_STABLECOIN}`,
                Authorization: `Bearer ${token}`
            }
        });

        const responseData = await response.json();

        if (response.ok) {
            setUploadStatus(responseData.message);
            Swal.fire({
                position: 'center',
                icon: 'success',
                html: `<p>Le contrat a été envoyé avec succès.</p>` ,
                showConfirmButton: false,
                timer: 5000
            })
            setTimeout(() => {
                window.location.reload()
            }, 5000)
        } else {
            console.error('Error updating:', responseData.message);
            setIsLoggingIn(false);
              Swal.fire({
                  position: 'center',
                  icon: 'error',
                  html: `<p>Une erreur s'est produite lors de l'envoie du contrat</p>` ,
                  showConfirmButton: false,
                  timer: 6000
              })
        }
        } catch (error) {
            console.error('Error updating:', error);
            setIsLoggingIn(false);
              Swal.fire({
                  position: 'center',
                  icon: 'error',
                  html: `<p>Une erreur s'est produite lors de l'envoie du contrat</p>` ,
                  showConfirmButton: false,
                  timer: 6000
              })
        }
    };
    //Fin


    const handleFileChangeContractSigned = (event) => {
        setContractSigned(event.target.files[0]);
    };

    // FONCTION POUR UPLOADER LE CONTRAT SIGNE
    const handleUpdateContractSigner = async () => {
        // event.preventDefault();
        setIsLoggingIn(true);

        if (!contractSigned) {
        setUploadStatus('Vous devez sélectionner un fichier.');
        return;
        }
        console.log('contractSigned', contractSigned)
        const formData = new FormData();
        formData.append('contractSigned', contractSigned);

        // Obtenir le token en cours
        const token = localStorage.getItem('tokenEnCours');

        try {
        const response = await fetch(`${API_URL}/api/distributer/send-contract-signed/${infosDistributer?.id}`, {
            method: 'PUT',
            body: formData,
            headers: {
                // 'Content-Type': 'application/json',
                'x-api-key': `${API_KEY_STABLECOIN}`,
                Authorization: `Bearer ${token}`
            }
        });

        const responseData = await response.json();

        if (response.ok) {
            setUploadStatus(responseData.message);
            Swal.fire({
                position: 'center',
                icon: 'success',
                html: `<p>Vous avez accepté cette demande avec succès.</p>` ,
                showConfirmButton: false,
                timer: 5000
            })
            // setTimeout(() => {
            //     window.location.reload()
            // }, 5000)
        } else {
            console.error('Error updating:', responseData.message);
            setIsLoggingIn(false);
            Swal.fire({
                position: 'center',
                icon: 'error',
                html: `<p>Une erreur s'est produite lors de l'envoie du contrat</p>` ,
                showConfirmButton: false,
                timer: 6000
            })
        }
        } catch (error) {
            console.error('Error updating:', error);
            setIsLoggingIn(false);
            Swal.fire({
                position: 'center',
                icon: 'error',
                html: `<p>Une erreur s'est produite lors de l'envoie du contrat</p>` ,
                showConfirmButton: false,
                timer: 6000
            })
        }
    };
    //Fin

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
        const getAllDataDistributeur = async () => {
            const token = localStorage.getItem('tokenEnCours');

            try {
                
                const result = await fetch(`${API_URL}/api/distributer/find-all-request-distributer`, {
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
                setAllDataDistributeur(data);
            } catch (error) {
                // Gérer les erreurs de manière appropriée, par exemple, définir un état d'erreur.
                console.error('Erreur lors de la récupération des demandes:', error);
            }
        };

        await getAllDataDistributeur();
    }, []);

    // Fonction d'acceptation de la demande au niveau de la base de données
    const acceptRequest = async () => {
        setIsLoggingIn(true);
        
        try {
            
           
            console.log('contractSigned', contractSigned)
        const formData = new FormData();

        formData.append('wealthtechCommissionAddress', ADDRESS_COMMISSION);
        formData.append('percentage', percentage);
        formData.append('percentageInstitution', percentageInstitution);
        formData.append('percentageWithdrawal', percentageWithdrawal);
        formData.append('percentageWithdrawalInstitution', percentageWithdrawalInstitution);
        formData.append('contractSigned', contractSigned);
  
            // Obtenir le token en cours
            const token = localStorage.getItem('tokenEnCours');
            /**
             * Réponse de la requête KYC.
             * @type {Response}
             */
            const response = await fetch(`${API_URL}/api/distributer/answer-request-distributer/${requestId}`, {
                method: 'PUT',
                body: formData,
                headers: {
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
                // Appel de la fonction pour uploader le fichier du contrat signé par les deux parties
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    html: `<p> Vous avez accepté cette demande avec succès.</p>`,
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

    // Fonction du rejet de la demande au niveau de la base de données
    const rejetRequest = async () => {
        setIsLoggingIn(true);
        
        try {
           
  
            // Obtenir le token en cours
            const token = localStorage.getItem('tokenEnCours');
            /**
             * Réponse de la requête KYC.
             * @type {Response}
             */
            const response = await fetch(`${API_URL}/api/distributer/rejection-request-distributer/${requestId}`, {
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
                    html: `<p> Cette demande a été rejeté avec succès.</p>`,
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
    
        if (requestId) {
        getUserById(requestId);
        }
    }, [requestId]);
    // FIN

   


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
                                    <h3 className='text-center'>Demandes d'être distributeur</h3>
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
                                        <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Statut</p></Table.Column>
                                        <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Actions</p></Table.Column>
                                    </Table.Header>
                                    <Table.Body>
                                        {allDataDistributeur?.map((data, index) => (
                                            <Table.Row key={index}>                       
                                                <Table.Cell ><small className=" py-0 ">{data?.institution}</small></Table.Cell>
                                                <Table.Cell ><small className=" py-0 ">{formatDate(data?.createdAt)}</small></Table.Cell>
                                                <Table.Cell ><small className=" py-0 ">{data?.allow == 0?(<i className=''>Pas encore acceptée</i>):data?.allow == 1?(<i className='colorGreen'>Déjà acceptée</i>):data?.allow == 2 ? (<i className='colorRed'>Rejetée</i>) :""}</small></Table.Cell>
                                                <Table.Cell >
                                                    <div className='text-center d-flex'>
                                                        <button 
                                                            className={`py-0 mx-2 btn ${data?.allow === 1 ? 'btn-secondary' : 'btn-primary'} d`}

                                                            onClick={()=>setRequestId(data?.id)}
                                                            disabled={data?.allow === 1}
                                                        >
                                                            <p onClick={handleShowForm} className="text-white">Répondre</p>
                                                        </button>

                                                        <button 
                                                            className={`py-0 mx-2 btn ${data?.allow === 1 || data?.allow === 2 ? 'btn-secondary' : 'btn-danger'} d`}
                                                            onClick={()=>setRequestId(data?.id)}
                                                            disabled={data?.allow === 1 || data?.allow === 2}
                                                        >
                                                            <p onClick={handleShowRejection} className="text-white">
                                                                Rejeter
                                                            </p>
                                                            
                                                        </button>

                                                        <button 
                                                            className={`py-0 mx-2 btn ${data?.allow === 1 ? 'btn-secondary' : 'btn-success'} d`}
                                                            onClick={()=>setRequestId(data?.id)}
                                                            disabled={data?.allow === 1}
                                                        >
                                                            <p onClick={handleShowChangeContract} className="text-white">
                                                                Contrat
                                                            </p>
                                                        </button>

                                                        {data?.contractSigned && data?.allow===0? (
                                                            <a 
                                                                href={`${API_URL}/${data?.contractSigned}`} 
                                                                download
                                                                target="_blank"
                                                            >
                                                                <button
                                                                    className={`py-0 mx-2 btn btn-primary`}

                                                                    color="primary"
                                                                    type="button"
                                                                >
                                                                    Contrat non signé
                                                                </button>
                                                            </a>
                                                        ) : ("")}

                                                        {data?.contractSigned && data?.allow===1 && data?.contractValid==1? (
                                                            <a 
                                                                href={`${API_URL}/${data?.contractSigned}`} 
                                                                download
                                                                target="_blank"
                                                            >
                                                                <button
                                                                    className={`py-0 mx-2 btn btn-primary px-4`}
                                                                    color="primary"
                                                                    type="button"
                                                                >
                                                                    Contrat signé
                                                                </button>
                                                            </a>
                                                        ) : ("")}
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
                <form>
                    <Modal.Body>
                        {/* PARTIE DEPOT */}
                        <div className='form-group mt-3'>
                            <input
                            type='member'
                            className='form-control'
                            placeholder='Le pourcentage des dépôts'
                            defaultValue={percentage} 
                            onChange={(event)=>setPercentage(event.target.value)}
                            />
                        </div>

                        <div className='form-group mt-3'>
                            <input
                            type='member'
                            className='form-control'
                            placeholder="Le pourcentage des dépôts de l'institution"
                            defaultValue={percentageInstitution} 
                            onChange={(event)=>setPercentageInstitution(event.target.value)}
                            />
                        </div>

                        {/* PARIE RETRAIT */}
                        <div className='form-group mt-3'>
                            <input
                            type='member'
                            className='form-control'
                            placeholder='Le pourcentage des retraits'
                            defaultValue={percentageWithdrawal} 
                            onChange={(event)=>setPercentageWithdrawal(event.target.value)}
                            />
                        </div>

                        <div className='form-group mt-3'>
                            <input
                            type='member'
                            className='form-control'
                            placeholder="Le pourcentage des retraits de l'institution"
                            defaultValue={percentageWithdrawalInstitution} 
                            onChange={(event)=>setPercentageWithdrawalInstitution(event.target.value)}
                            />

                        </div>

                        <div className='form-group mt-3'>
                            <input type="file" onChange={handleFileChangeContractSigned} accept=".pdf" />
                        </div>


                    </Modal.Body>
                    <Modal.Footer>
                        <Button className="text-white" color="danger" onClick={handleCloseForm}>
                            Fermer
                        </Button>
                        <Button  onClick={acceptRequest}  color="success" disabled={isLoggingIn}>
                            Accepter
                        </Button>
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


            {/* ********************************************************************************** */}
                {/* MODAL DU CHANGEMENT DE L'AVATAR'*/}
            {/* ********************************************************************************** */}
            <Modal show={showChangeContract} className="mt-15" onHide={handleCloseChangeContract}>
                <Modal.Header closeButton className="bgColorblue">
                    <Modal.Title className="text-white" >Envoyer le contrat à l'institution</Modal.Title>                
                </Modal.Header>
                    <form onSubmit={handleUpdateContract}>
                        <Modal.Body>
                            <input type="file" onChange={handleFileChange} accept=".pdf" />
                            
                        </Modal.Body>
                        <Modal.Footer>
                            <Button className="text-white" color="danger" onClick={handleCloseChangeContract}>
                                Fermer
                            </Button>
                            <Button  type='submit'  color="success" disabled={isLoggingIn}>
                                Envoyer
                            </Button>
                        </Modal.Footer>
                    </form>
            </Modal>
            {/* *****************************************FIN****************************************** */}

        </>
    );
};

export default AccueilDistributeur;
