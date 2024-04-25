/**
 * Composant React pour la gestion des tarifs d'abonnement.
 * @module TarifAbonnement
 * @see {@link https://reactjs.org/}
 */

import { useState, useEffect } from 'react';
import { Container, Row, Col, Modal } from "react-bootstrap";
import {Button,Form} from "reactstrap";
import React from "react";
import { Table } from '@nextui-org/react';


// Pour Magic
import { magic } from "../../../../../magic";
import { ethers } from "ethers";
import Swal from 'sweetalert2';


/**
 * Composant pour la gestion des tarifs d'abonnement.
 * @function
 * @returns {JSX.Element} Élément JSX représentant le composant pour la gestion des tarifs d'abonnement.
 */
const TarifAbonnement = () => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API
     // Variable de l'api key de stablecoin
     const API_KEY_STABLECOIN = process.env.NEXT_PUBLIC_API_KEY_STABLECOIN


    const [currentUser, setCurrentUser] = useState();
    const [isLoggingIn, setIsLoggingIn] = useState();
    const [provider, setProvider] = useState(null);
        
    // States de Tarification
    const [subscriptionMonth, setSubscriptionMonth] = useState();
    const [subscriptionCost, setSubscriptionCost] = useState();
    const [subMonth, setSubMonth] = useState()
    const [subCost, setSubCost] = useState()

    const [dataAllRate, setDataAllRate] = useState();
    const [rateSubscriptionId, setRateSubscriptionId] = useState();

    
    /**
     * État de contrôle pour afficher ou masquer la modal du formulaire d'ajout de tarif d'abonnement.
     * @type {boolean}
    */
     const [showFormAddTarif, setShowFormAddTarif] = useState(false);

    /**
     * Fonction pour fermer la modal du formulaire d'ajout de tarif d'abonnement.
     * @function
     * @returns {void}
   */
    const handleCloseFormAddTarif = () => setShowFormAddTarif(false);

    /**
     * Fonction pour afficher la modal du formulaire d'ajout de tarif d'abonnement.
     * @function
     * @returns {void}
   */
    const handleShowFormAddTarif = () => setShowFormAddTarif(true);


    /**
     * État de contrôle pour afficher ou masquer la modal du formulaire de mise à jour de tarif d'abonnement
     * @type {boolean}
    */
     const [showForm, setShowForm] = useState(false);

    /**
     * Fonction pour fermer la modal du formulaire de mise à jour de tarif d'abonnement.
     * @function
     * @returns {void}
   */
    const handleCloseForm = () => setShowForm(false);

    /**
     * Fonction pour afficher la modal du formulaire de mise à jour de tarif d'abonnement.
     * @function
     * @returns {void}
   */
    const handleShowForm = () => setShowForm(true);
 

    /**
     * Hook d'effet pour initialiser le fournisseur Web3 en fonction de l'instance Magic.
     * @function
     * @returns {void}
     * @param {Object} magic - Instance de Magic.
     * @param {Object} setProvider - Fonction pour mettre à jour l'état du fournisseur Web3.
     */
    useEffect(() => {

        if (!!magic) {
            const pt = new ethers.providers.Web3Provider(magic.rpcProvider);
            setProvider(pt);
        }
    }, [magic]);

    /**
     * Hook d'effet pour récupérer les informations qui concernent Magic et les informations de l'utilisateur actuel.
     * @function
     * @returns {void}
   */
    useEffect(() => {
        (async () => {
            if (!!magic && !!provider) {
              const userMetadatas = await magic.user.getMetadata();
              const signer = provider.getSigner();
              const network = await provider.getNetwork();
              const userAddress = await signer.getAddress();
              //const userBalance = ethers.utils.formatEther(await provider.getBalance(userAddress))
              // FIN

              // Obtenir un utilisateur en fonction de son email 
              const getUser = async () => {
                const result = await fetch(`${API_URL}/api/user/find-user-by-email?email=${userMetadatas?.email}`, {
                    headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': `${API_KEY_STABLECOIN}`,
                    },
                })
                  .then((result) => result.json())
                  .then((user) => {
                  setCurrentUser(user)
                  }) 
              };
              await getUser();
              // Fin
            }
        })();
    }, [provider, magic]);
    //  Fin


    /**
     * Fonction d'ajout des tarifs d'abonnement.
     * @async
     * @function
     * @param {Event} event - Événement de formulaire.
     * @returns {void}
   */
    const addRateSubscription= async(event) =>{
        event.preventDefault();
        setIsLoggingIn(true)
        
        const dataRequest = {
            subscriptionMonth: subscriptionMonth,
            subscriptionCost: subscriptionCost
        }

        // Obtenir le token en cours
        const token = localStorage.getItem('tokenEnCours');

        const result = await fetch(`${API_URL}/api/subscription/add-rate-subscription`, {
            method:"POST",
            body: JSON.stringify(dataRequest),
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': `${API_KEY_STABLECOIN}`,
                Authorization:  `Bearer ${token}`
            }
        })
        .then(res=>{
            if (res.status==200) {
            Swal.fire({
                position: 'center',
                icon: 'success',
                html: "<p> Le tarif d'abonnement a été ajouté avec succès.</p>" ,
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
                html: "<p>  Une erreur s'est produite lors de l'exécution.</p>" ,
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

    /**
    * Fonction de mise à jour des tarifs d'abonnement.
    * @async
    * @function
    * @param {Event} event - Événement de formulaire.
    * @returns {void}
   */
    const updateRateSubscription= async(event) =>{
        event.preventDefault();
        setIsLoggingIn(true)
        
        const dataRequest = {
            subscriptionMonth: subscriptionMonth,
            subscriptionCost: subscriptionCost
        }

        // Obtenir le token en cours
        const token = localStorage.getItem('tokenEnCours');

        const result = await fetch(`${API_URL}/api/subscription/update-rate-subscription/${rateSubscriptionId}`, {
            method:"PUT",
            body: JSON.stringify(dataRequest),
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': `${API_KEY_STABLECOIN}`,
                Authorization:  `Bearer ${token}`
            }
        })
        .then(res=>{
            if (res.status==200) {
            Swal.fire({
                position: 'center',
                icon: 'success',
                html: "<p> La mise à jour du tarif s'est effectuée avec succès.</p>" ,
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
                html: "<p>  Une erreur s'est produite lors de l'exécution.</p>" ,
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


    /**
   * Hook d'effet pour récupérer toutes les données de tarification des abonnements.
   * @returns {void}
   */
     useEffect(async () => {
        const token = localStorage.getItem('tokenEnCours');
    
        /**
         * Fonction pour obtenir toutes les données de tarification des abonnements.
         * @returns {void}
        */
        const getDataAllRate = async () => {
            const result = await fetch(`${API_URL}/api/subscription/find-all-rate-subscription`, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': `${API_KEY_STABLECOIN}`,
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!result.ok) {
                throw new Error('Failed to fetch data');
            } else {
                // Vérifier si la réponse n'est pas vide avant de la parser en JSON
                const text = await result.text();
                const data = text ? JSON.parse(text) : null;
    
                setDataAllRate(data);
            }
        };
    
        await getDataAllRate();
    }, []);
    // FIN

    /**
     * Fonction de rendu du composant TarifAbonnement.
     * @returns {JSX.Element} Élément JSX représentant le composant TarifAbonnement.
   */
    return (
        <>

        <div className='' >
            <div className=' mx-15'>
                <div className='py-10'>
                    <h3 className='text-center'>Ajout ou modification des tarifs d'abonnement</h3>
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
                    <div className='row'>
                        <div className='col-lg-2 col-md-2'></div>
                        <div className='col-lg-8 col-md-8'>
                            <div className='currency-selection '>
                                <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                                    <div className='cryptocurrency-slides'>
                                        <div className='single-cryptocurrency-box'>
                                            <Table
                                                aria-label="Example table with static content"
                                                css={{
                                                    height: "auto",
                                                    minWidth: "100%",
                                                }}
                                            >
                                                <Table.Header>
                                                    <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Durée (en Mois)</p></Table.Column>
                                                    <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Frais</p></Table.Column>
                                                    <Table.Column><p className="gr-text-8 pt-3 pb-0 text-center">Actions</p></Table.Column>
                                                </Table.Header>
                                                <Table.Body>
                                                    {dataAllRate?.map((data) => (
                                                        <Table.Row >                       
                                                            <Table.Cell ><small className=" py-0 ">{data?.subscriptionMonth}</small></Table.Cell>
                                                            <Table.Cell ><small className=" py-0 ">{data?.subscriptionCost}</small></Table.Cell>
                                                            <Table.Cell className="row">
                                                                <div className='text-center'>
                                                                    <button className=" py-0  mx-2 btn btn-success" onClick={()=>setRateSubscriptionId(data?.id)}>
                                                                        <p onClick={()=>setSubMonth(data?.subscriptionMonth)}>
                                                                            <p onClick={()=>setSubCost(data?.subscriptionCost)}>
                                                                                <a className=" text-white aNoDecor px-2" onClick={handleShowForm}>Modifier</a> 
                                                                            </p>
                                                                        </p>
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
                                                    rowsPerPage={3}
                                                    onPageChange={(page) => console.log({ page })}
                                                /> */}
                                            </Table>
                                            <div className='text-center'>
                                                <button className=" py-0 my-3  mx-2 btn btn-primary text-center">
                                                    <a className=" text-white aNoDecor px-3" onClick={handleShowFormAddTarif}>Ajouter</a> 
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='col-lg-2 col-md-2'></div>
                    </div>
                </div>
        
            </div>

            {/* ********************************************************************************** */}
                {/* MODAL DE MISE A JOUR DES TARIFS D'ABONNEMENT*/}
            {/* ********************************************************************************** */}
            <Modal show={showFormAddTarif} className="mt-15" onHide={handleCloseFormAddTarif}>
                <Modal.Header closeButton id="bgcolor">
                    <Modal.Title className="" >Ajout d'un tarif d'abonnement</Modal.Title>                
                </Modal.Header>
                <form>
                <Modal.Body>
                    <div className="form-group my-6 ">
                        <label
                        htmlFor="subscriptionMonth"
                        className="mt-3"
                        >
                            Durée d'abonnement (en Mois) <sup className="text-red">*</sup>
                        </label>
                        <div className="input-group flex-nowrap mt-3">
                            <input
                                className="form-control gr-text-11 border  bg-white"
                                type="number"
                                id="subscriptionMonth"
                                placeholder="Durée d'abonnement"
                                required
                                defaultValue={subscriptionMonth} 
                                onChange={(event)=>setSubscriptionMonth(event.target.value)}
                            />
                        </div>
                    </div>
                    <div className="form-group my-6 ">
                        <label
                        htmlFor="subscriptionCost"
                        className="mt-3"
                        >
                            Frais d'abonnement <sup className="text-red">*</sup>
                        </label>
                        <div className="input-group flex-nowrap mt-3">
                            <input
                                className="form-control gr-text-11 border  bg-white"
                                type="number"
                                id="subscriptionCost"
                                placeholder="Frais d'abonnement"
                                required
                                step="0.01"
                                defaultValue={subscriptionCost} 
                                onChange={(event)=>setSubscriptionCost(event.target.value)}
                            />
                        </div>
                    </div>

                </Modal.Body>
                <Modal.Footer>
                    <Button className="text-white" color="danger" onClick={handleCloseFormAddTarif}>
                        Fermer
                    </Button>
                    <Button  onClick={addRateSubscription}  color="success" disabled={isLoggingIn}>
                        Modifier
                        {isLoggingIn === true ? (<i className="fas fa-spinner fa-spin fa-lg mx-2"></i>) : ("")}
                    </Button>
                </Modal.Footer>
                </form>
            </Modal>
            {/* *****************************************FIN****************************************** */}
        
            {/* ********************************************************************************** */}
                {/* MODAL DE MISE A JOUR DES TARIFS D'ABONNEMENT*/}
            {/* ********************************************************************************** */}
            <Modal show={showForm} className="mt-15" onHide={handleCloseForm}>
                <Modal.Header closeButton id="bgcolor">
                    <Modal.Title className="" >Mise à jour d'un tarif d'abonnement</Modal.Title>                
                </Modal.Header>
                <form>
                <Modal.Body>
                    <div className="form-group my-6 ">
                        <label
                        htmlFor="subscriptionMonth"
                        className="mt-3"
                        >
                            Durée d'abonnement (en Mois) <sup className="text-red">*</sup>
                        </label>
                        <div className="input-group flex-nowrap mt-3">
                            <input
                                className="form-control gr-text-11 border  bg-white"
                                type="number"
                                id="subscriptionMonth"
                                placeholder="Durée d'abonnement"
                                required
                                defaultValue={subMonth} 
                                onChange={(event)=>setSubscriptionMonth(event.target.value)}
                            />
                        </div>
                    </div>
                    <div className="form-group my-6 ">
                        <label
                        htmlFor="subscriptionCost"
                        className="mt-3"
                        >
                            Frais d'abonnement <sup className="text-red">*</sup>
                        </label>
                        <div className="input-group flex-nowrap mt-3">
                            <input
                                className="form-control gr-text-11 border  bg-white"
                                type="number"
                                id="subscriptionCost"
                                placeholder="Frais d'abonnement"
                                required
                                step="0.01"
                                defaultValue={subCost} 
                                onChange={(event)=>setSubscriptionCost(event.target.value)}
                            />
                        </div>
                    </div>

                </Modal.Body>
                <Modal.Footer>
                    <Button className="text-white" color="danger" onClick={handleCloseForm}>
                        Fermer
                    </Button>
                    <Button  onClick={updateRateSubscription}  color="success" disabled={isLoggingIn}>
                        Modifier
                        {isLoggingIn === true ? (<i className="fas fa-spinner fa-spin fa-lg mx-2"></i>) : ("")}
                    </Button>
                </Modal.Footer>
                </form>
            </Modal>
            {/* *****************************************FIN****************************************** */}
        
        </>
    );
};

export default TarifAbonnement;
