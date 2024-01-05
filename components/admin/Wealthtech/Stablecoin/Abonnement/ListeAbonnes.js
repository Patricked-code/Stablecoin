import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Modal } from "react-bootstrap";
import {Button,Form} from "reactstrap";

// Pour Magic
import { magic } from "../../../../../magic";
import { ethers } from "ethers";
// import Loading from "../../../../../components/loading";
import Router from "next/router";
import { Table } from '@nextui-org/react';
import Link from 'next/link';
import moment from 'moment';
import Swal from 'sweetalert2';





const ListeAbonnes = () => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API
    const HASH_TX = process.env.NEXT_PUBLIC_HASH_TX

    
    const [isLoggingIn, setIsLoggingIn] = useState();
    const [currentUser, setCurrentUser] = useState();
    const [provider, setProvider] = useState(null);
    const [messageError, setMessageError] = useState();
    const [allSubscription, setAllSubscription] = useState();
    const [dataUserByAddressBc, setDataUserByAddressBc] = useState();
    const [subsriberAddressBc, setSubsriberAddressBc] = useState();
    
    
   

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
     * Hook d'effet pour récupérer les données de tous les abonnés.
     * Les données sont stockées dans l'état `allSubscription`.
     *
     * @async
     * @function
     * @returns {void}
    */
    useEffect(async () => {
        /**
         * Fonction pour obtenir tous les abonnés.
         *
         * @async
         * @returns {void}
         */
        const getAllSubscription = async () => {
            const token = localStorage.getItem('tokenEnCours');

            try {
                /**
                 * Résultat de la requête pour récupérer de tous les abonnés.
                 * @type {Response}
                 */
                const result = await fetch(`${API_URL}/api/subscription/find-all-subscription`, {
                    headers: {
                        'Content-Type': 'application/json',
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
                setAllSubscription(data);
            } catch (error) {
                // Gérer les erreurs de manière appropriée, par exemple, définir un état d'erreur.
                console.error('Erreur lors de la récupération des demandes d\'accès KYC:', error);
            }
        };

        // Appel de la fonction pour récupérer touos les abonnés
        await getAllSubscription();
    }, []);


    /**
     * Hook d'effet pour récupérer l'utilisateur en fonction de son adresse blockchain.
     * @returns {void}
    */
    useEffect(async () => {
        const token = localStorage.getItem('tokenEnCours');
    
        /**
         * Fonction pour obtenir l'utilisateur en fonction de son adresse blockchain.
         * @returns {void}
        */
        const getDataUserByAddressBc = async (_subsriberAddressBc) => {
            const result = await fetch(`${API_URL}/api/user/find-user-by-addrBlockchain?address=${_subsriberAddressBc}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!result.ok) {
                throw new Error('Failed to fetch data');
            } else {
                // Vérifier si la réponse n'est pas vide avant de la parser en JSON
                const text = await result.text();
                const data = text ? JSON.parse(text) : null;
    
                setDataUserByAddressBc(data);
            }
        };
        
        if (subsriberAddressBc) {
            await getDataUserByAddressBc(subsriberAddressBc);
        }
    }, [subsriberAddressBc]);
    // FIN
    

    
    /**
     * Formate un nombre en tronquant à deux décimales et en ajoutant un séparateur de milliers (espace).
     * @param {number} number - Le nombre à formater.
     * @returns {string} - Le nombre formaté en tant que chaîne de caractères.
     * @throws {Error} - Si la fonction est appelée avec autre chose qu'un nombre.
     */
     function formatNumber(number) {
        if (typeof number !== 'number') {
            throw new Error('La fonction doit être appelée avec un nombre.');
        }

        // Tronquer le nombre à deux décimales
        const truncatedNumber = Math.floor(number * 100) / 100;

        // Ajouter un séparateur de milliers (espace)
        const formattedNumber = truncatedNumber.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

        return formattedNumber;
    }

       /**
     * Affiche un contenu limité en fonction du nombre de mots ou de caractères spécifié.
     *
     * @param {string} content - Le contenu à afficher.
     * @param {number} limit - Le nombre limite de mots ou de caractères.
     * @param {string} unit - L'unité de la limite ('words' pour mots, 'characters' pour caractères).
     * @returns {string} Le contenu limité avec des points de suspension si nécessaire.
     * @throws {Error} Si l'unité spécifiée n'est ni 'words' ni 'characters'.
     */
    function displayLimitedContent(content, limit, unit) {
        // Vérifier si le paramètre 'unit' est spécifié et valide
        if (unit !== 'words' && unit !== 'characters') {
            throw new Error("L'unité doit être 'words' ou 'characters'.");
        }

        if (unit === 'words') {
            // Séparer le contenu en mots
            const words = content.split(' ');

            // Vérifier si le nombre de mots est inférieur ou égal à la limite
            if (words.length <= limit) {
                return content; // Pas besoin de points de suspension
            } else {
                // Sélectionner les premiers 'limit' mots et les rejoindre
                const limitedContent = words.slice(0, limit).join(' ');

                return `${limitedContent}...`;
            }
        } else if (unit === 'characters') {
            // Vérifier si la longueur du contenu est inférieure ou égale à la limite
            if (content.length <= limit) {
                return content; // Pas besoin de points de suspension
            } else {
                // Sélectionner les premiers 'limit' caractères
                const limitedContent = content.slice(0, limit);

                return `${limitedContent}...`;
            }
        }
    }

    // Fonction pour calculer le nombre de jours restants
    const calculateRemainingDays = (startDate, subscriptionDays) => {
        const ONE_DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000; // Nombre de millisecondes dans une journée
        const currentDate = new Date();
        const startSubscriptionDate = new Date(startDate);
        const expirationDate = new Date(startSubscriptionDate.getTime() + subscriptionDays * ONE_DAY_IN_MILLISECONDS);
    
        // Calcul du nombre de jours restants
        const remainingDays = Math.ceil((expirationDate - currentDate) / ONE_DAY_IN_MILLISECONDS);
    
        return remainingDays > 0 ? remainingDays : 0;
      };

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
        const maDate = moment(_updatedAt).format('DD/MM/YYYY HH:mm');

        // const maDate = moment(_updatedAt).format('DD/MM/YYYY');

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
                                    <h1 className='text-center'>Liste des abonnés</h1>
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
                                        <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Adresse</p></Table.Column>
                                        <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Frais</p></Table.Column>
                                        <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Jours restant</p></Table.Column>
                                        <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Hash</p></Table.Column>
                                        <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Date</p></Table.Column>
                                        <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Actions</p></Table.Column>
                                    </Table.Header>
                                    <Table.Body>
                                        {allSubscription?.map((data, index) => (
                                            <Table.Row key={index}>                       
                                                <Table.Cell ><small className=" py-0 ">{displayLimitedContent(data?.addressSubscriber,20,"characters")}</small></Table.Cell>
                                                <Table.Cell ><small className=" py-0 ">{formatNumber(parseFloat(data?.subscriptionCost))} </small></Table.Cell>
                                                <Table.Cell ><small className=" py-0 ">{calculateRemainingDays(data?.updatedAt, data?.subscriptionDays)}</small></Table.Cell>
                                                <Table.Cell ><small className=" py-0 ">{displayLimitedContent(data?.hash,20,"characters")}<a className=" aNoDecor" target="_blank"  href={`${HASH_TX}/${data?.hash}`}>Détails</a></small></Table.Cell>
                                                <Table.Cell ><small className=" py-0 ">{formatDate(data?.updatedAt)}</small></Table.Cell>
                                                <Table.Cell >
                                                    <div className='text-center d-flex'>
                                                        <button className='btn btn-primary' onClick={()=>setSubsriberAddressBc(data?.addressSubscriber)}>
                                                            <small className=" py-0  mx-2 " onClick={handleShowForm}>Infos</small>
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
                {/* MODAL DES INFORMATIONS SUR L'ABONNE*/}
            {/* ********************************************************************************** */}
            <Modal show={showForm} className="mt-15" onHide={handleCloseForm}>
                <Modal.Header closeButton id="bgcolor">
                    <Modal.Title className="" >Des informations sur l'abonné</Modal.Title>                
                </Modal.Header>
                    <Modal.Body>
                        <p>Abonné : {dataUserByAddressBc?.codeTypeProfil=="part"? dataUserByAddressBc?.lastName + " " + dataUserByAddressBc?.firstName : dataUserByAddressBc?.entreprise} </p>
                        <p>Email : {dataUserByAddressBc?.email}</p>
                        <p>Adresse : {dataUserByAddressBc?.address}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className="text-white" color="danger" onClick={handleCloseForm}>
                            Fermer
                        </Button>
                        {/* <Button   color="success" disabled={isLoggingIn}>
                            Autoriser
                        </Button> */}
                    </Modal.Footer>
            </Modal>
            {/* *****************************************FIN****************************************** */}

        </>
    );
};

export default ListeAbonnes;
