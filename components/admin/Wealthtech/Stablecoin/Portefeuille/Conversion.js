/**
 * Composant React pour la gestion des conversions de devises.
 * @module Conversion
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
 * Composant de conversion des devises.
 * @function
 * @returns {JSX.Element} Élément JSX représentant le composant de conversion des devises.
 */
const Conversion = () => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API


    const [currentUser, setCurrentUser] = useState();
    const [isLoggingIn, setIsLoggingIn] = useState();
    const [provider, setProvider] = useState(null);
        
    // States de conversion
    const [exchangeRate, setExchangeRate] = useState();
    const [dataAllConversion, setDataAllConversion] = useState();
    const [conversionId, setConversionId] = useState();
    const [currency, setCurrency] = useState();
    const [activeSymbol, setActiveSymbol] = useState();
    const [activeName, setActiveName] = useState();
    const [exchange, setExchange] = useState();
    
      
    /**
     * État de contrôle pour afficher ou masquer la modal du formulaire de la mise à jour du taux de conversion.
     * @type {boolean}
    */
     const [showForm, setShowForm] = useState(false);
     
    /**
     * Fonction pour fermer la modal du formulaire de la mise à jour du taux de conversion.
     * @function
     * @returns {void}
   */
    const handleCloseForm = () => setShowForm(false);

    /**
     * Fonction pour afficher la modal du formulaire de la mise à jour du taux de conversion.
     * @function
     * @returns {void}
    */
    const handleShowForm = () => setShowForm(true);
 
    

    /**
     * État de contrôle pour afficher ou masquer la modal du formulaire de l'ajour de taux de conversion.
     * @type {boolean}
    */
     const [showFormAddConversion, setShowFormAddConversion] = useState(false);
     
    /**
     * Fonction pour fermer la modal du formulaire de l'ajour de taux de conversion.
     * @function
     * @returns {void}
   */
    const handleCloseFormAddConversion = () => setShowFormAddConversion(false);

    /**
     * Fonction pour afficher la modal du formulaire de l'ajour de taux de conversion.
     * @function
     * @returns {void}
    */
    const handleShowFormAddConversion = () => setShowFormAddConversion(true);

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
     * Fonction d'ajout des taux de conversion.
     * @async
     * @function
     * @param {Event} event - Événement de formulaire.
     * @returns {void}
   */
     const addConversion= async(event) =>{
        event.preventDefault();
        setIsLoggingIn(true)
        
        const dataRequest = {
            currency:currency,
            activeSymbol:activeSymbol,
            activeName:activeName,
            exchangeRate: exchangeRate,
        }

        // Obtenir le token en cours
        const token = localStorage.getItem('tokenEnCours');

        const result = await fetch(`${API_URL}/api/conversion/add-conversion`, {
            method:"POST",
            body: JSON.stringify(dataRequest),
            headers: {
                'Content-Type': 'application/json',
                Authorization:  `Bearer ${token}`
            }
        })
        .then(res=>{
            if (res.status==200) {
            Swal.fire({
                position: 'center',
                icon: 'success',
                html: "<p> Les données ont été ajouté avec succès.</p>" ,
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
     * Fonction de mise à jour des taux de conversion.
     * @async
     * @function
     * @param {Event} event - Événement de formulaire.
     * @returns {void}
   */
    const updateConversion= async(event) =>{
        event.preventDefault();
        setIsLoggingIn(true)
        
        const dataRequest = {
            exchangeRate: exchangeRate,
        }

        // Obtenir le token en cours
        const token = localStorage.getItem('tokenEnCours');

        const result = await fetch(`${API_URL}/api/conversion/update-conversion/${conversionId}`, {
            method:"PUT",
            body: JSON.stringify(dataRequest),
            headers: {
                'Content-Type': 'application/json',
                Authorization:  `Bearer ${token}`
            }
        })
        .then(res=>{
            if (res.status==200) {
            Swal.fire({
                position: 'center',
                icon: 'success',
                html: "<p> Votre modification s'est effectuée avec succès.</p>" ,
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
     * Hook d'effet pour récupérer toutes les données de conversion entre les fiat et actifs numérique.
     * @returns {void}
     */
     useEffect(async () => {
        const token = localStorage.getItem('tokenEnCours');
    
        /**
         * Fonction pour obtenir toutes les données de conversion entre les fiat et actifs numérique.
         * @returns {void}
         */
        const getDataAllConversion = async () => {
            const result = await fetch(`${API_URL}/api/conversion/find-all-conversion`, {
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
    
                setDataAllConversion(data);
            }
        };
    
        await getDataAllConversion();
    }, []);
    // FIN

    /**
     * Fonction de rendu du composant Conversion.
     * @returns {JSX.Element} Élément JSX représentant le composant Conversion.
   */
    return (
        <>

        <div className='' >
            <div className=' mx-15'>
                <div className='py-10'>
                    <h3 className='text-center'>Modification des infos de conversion</h3>
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
                                                    <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Devise</p></Table.Column>
                                                    <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Actifs</p></Table.Column>
                                                    <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Taux</p></Table.Column>
                                                    <Table.Column><p className="gr-text-8 pt-3 pb-0 text-center">Actions</p></Table.Column>
                                                </Table.Header>
                                                <Table.Body>
                                                    {dataAllConversion?.map((data, index) => (
                                                        <Table.Row key={index}>                       
                                                            <Table.Cell ><small className=" py-0 ">{data?.currency}</small></Table.Cell>
                                                            <Table.Cell ><small className=" py-0 ">{data?.activeName}</small></Table.Cell>
                                                            <Table.Cell ><small className=" py-0 ">{data?.exchangeRate}</small></Table.Cell>
                                                            <Table.Cell className="row">
                                                                <div className='text-center'>
                                                                    <button className=" py-0  mx-2 btn btn-success" onClick={()=>setConversionId(data?.id)}>
                                                                        <p onClick={()=>setExchange(data?.exchangeRate)}>
                                                                            <a className=" text-white aNoDecor px-2" onClick={handleShowForm}>Modifier</a> 
                                                                        </p>
                                                                    </button>
                                                                </div>
                                                            </Table.Cell>
                                                        </Table.Row >

                                                                    
                                                    ))} 
                                                </Table.Body>
                                                <Table.Pagination
                                                    shadow
                                                    noMargin
                                                    align="center"
                                                    rowsPerPage={5}
                                                    onPageChange={(page) => console.log({ page })}
                                                />
                                            </Table>
                                            <div className='text-center'>
                                                <button className=" py-0 my-3  mx-2 btn btn-primary text-center">
                                                    <a className=" text-white aNoDecor px-3" onClick={handleShowFormAddConversion}>Ajouter</a> 
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
                {/* MODAL D'AJOUT DU TAUX D'ECHANGE*/}
            {/* ********************************************************************************** */}
            <Modal show={showFormAddConversion} className="mt-15" onHide={handleCloseFormAddConversion}>
                <Modal.Header closeButton id="bgcolor">
                    <Modal.Title className="" >Ajout d'un taux d'échange</Modal.Title>                
                </Modal.Header>
                <form>
                <Modal.Body>
                    <div className='form-group my-6 ' >
                        <select 
                            className="form-control"
                            required
                            defaultValue={currency} 
                            onChange={(event)=>setCurrency(event.target.value)}
                        >
                            <option defaultValue="">Devise</option>
                            <optgroup className='single-cryptocurrency-box'>
                                <option  value="XOF">XOF</option>
                                <option  value="XAF">XAF</option>
                                <option  value="$">Dollars</option>
                                <option  value="€">Euro</option>
                            </optgroup>
                        </select>
                    </div>
                    <div className="form-group my-6 ">
                        <div className="input-group flex-nowrap mt-3">
                            <input
                                className="form-control gr-text-11 border  bg-white"
                                type="text"
                                id="activeName"
                                placeholder="Nom de l'actif"
                                required
                                defaultValue={activeName} 
                                onChange={(event)=>setActiveName(event.target.value)}
                            />
                        </div>
                    </div>
                    <div className="form-group my-6 ">
                        <div className="input-group flex-nowrap mt-3">
                            <input
                                className="form-control gr-text-11 border  bg-white"
                                type="text"
                                id="activeSymbol"
                                placeholder="Symbol de l'actif"
                                defaultValue={activeSymbol} 
                                onChange={(event)=>setActiveSymbol(event.target.value)}
                            />
                        </div>
                    </div>
                    <div className="form-group my-6 ">
                        <div className="input-group flex-nowrap mt-3">
                            <input
                                className="form-control gr-text-11 border  bg-white"
                                type="number"
                                id="exchangeRate"
                                placeholder="Taux de change"
                                required
                                step="0.01"
                                defaultValue={exchange} 
                                onChange={(event)=>setExchangeRate(event.target.value)}
                            />
                        </div>
                    </div>

                </Modal.Body>
                <Modal.Footer>
                    <Button className="text-white" color="danger" onClick={handleCloseFormAddConversion}>
                        Fermer
                    </Button>
                    <Button  onClick={addConversion}  color="success" disabled={isLoggingIn}>
                        Ajouter
                        {isLoggingIn === true ? (<i className="fas fa-spinner fa-spin fa-lg mx-2"></i>) : ("")}
                    </Button>
                </Modal.Footer>
                </form>
            </Modal>
            {/* *****************************************FIN****************************************** */}
        

            {/* ********************************************************************************** */}
                {/* MODAL DE MISE A JOUR DU TAUX D'ECHANGE*/}
            {/* ********************************************************************************** */}
            <Modal show={showForm} className="mt-15" onHide={handleCloseForm}>
                <Modal.Header closeButton id="bgcolor">
                    <Modal.Title className="" >Mise à jour du taux d'échange</Modal.Title>                
                </Modal.Header>
                <form>
                <Modal.Body>
                    <div className="form-group my-6 ">
                        <label
                        htmlFor="exchangeRate"
                        className="mt-3"
                        >
                            Taux de change <sup className="text-red">*</sup>
                        </label>
                        <div className="input-group flex-nowrap mt-3">
                            <input
                                className="form-control gr-text-11 border  bg-white"
                                type="number"
                                id="exchangeRate"
                                placeholder="Taux de change"
                                required
                                step="0.01"
                                defaultValue={exchange} 
                                onChange={(event)=>setExchangeRate(event.target.value)}
                            />
                        </div>
                    </div>

                </Modal.Body>
                <Modal.Footer>
                    <Button className="text-white" color="danger" onClick={handleCloseForm}>
                        Fermer
                    </Button>
                    <Button  onClick={updateConversion}  color="success" disabled={isLoggingIn}>
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

export default Conversion;
