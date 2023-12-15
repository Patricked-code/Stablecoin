import { useState, useEffect } from 'react';
import { Container, Row, Col, Modal } from "react-bootstrap";
import {Button} from "reactstrap";

import React from "react";
import axios from 'axios';
import Link from 'next/link';
import { Icon } from '@iconify/react';



// Pour Magic
import { magic } from "../../../../magic";
import { ethers } from "ethers";
import Loading from "../../../../components/loading";
import Router from "next/router";
import Swal from 'sweetalert2';
import Web3 from "web3";

// FIN





// FIN

const AccueilGestion = () => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API


    const [currentUser, setCurrentUser] = useState();
    const [provider, setProvider] = useState(null);
    const [isLoggingIn, setIsLoggingIn] = useState(null);

    
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
    


    useEffect(() => {

        if (!!magic) {
            const pt = new ethers.providers.Web3Provider(magic.rpcProvider);
            setProvider(pt);
        }
    }, [magic]);

    // RECUPERATION DES INFORMATIONS QUI CONCERNENT MAGIC
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


     // Fonction de demande pour être distributeur au niveau de la base de données
     const requestDistributer = async () => {
        setIsLoggingIn(true);
        
        try {
            // Obtenir le token en cours
            const token = localStorage.getItem('tokenEnCours');
            /**
             * Réponse de la requête KYC.
             * @type {Response}
             */
            const response = await fetch(`${API_URL}/api/distributer/add-request-distributer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
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
            if (data.message==200) {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    html: `<p> Votre demande a été envoyé avec succès.</p>`,
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
                <h1 className='text-center'>Gestion de satblecoin</h1>
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
        {currentUser?.codeTypeProfil==="insti" ? (
            <div className='cryptocurrency-search-box'>
                <div className='row'>

                        <div className='col-lg-6 col-md-6'>
                            <div className='currency-selection text-center'>
                                <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                                    <div className='cryptocurrency-slides'>
                                        <div className='single-cryptocurrency-box'>
                                            <div className='d-flex align-items-center'>
                                            {/* <div className='bestseller-coin-image'>
                                                <img src="/images/ecfa/logo/logo_ewari1.jpg" className="rounded-circle"  alt='image' />
                                            </div> */}
                                            <div className='title'>
                                                <h3>Demande de gestion de stablecoin</h3>

                                            </div>
                                            </div>
                                            <div className='btn-box'>
                                                    <Button
                                                        block
                                                        color="primary"
                                                        type="button"
                                                        onClick={handleShowForm}
                                                    >
                                                        Demander d'être distributeur
                                                    </Button>
                                            {/* Fin */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                                
                        <div className='col-lg-6 col-md-6'>
                            <div className='currency-selection text-center'>
                                <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                                <div className='cryptocurrency-slides'>
                                        <div className='single-cryptocurrency-box'>
                                            <div className='d-flex align-items-center'>
                                            <div className='title'>
                                                <h3>Mon contrat</h3>
                                            </div>
                                            </div>
                                            <div className='btn-box'>
                                            <a href='/#'>
                                                <Button
                                                    block
                                                    color="primary"
                                                    type="button"
                                                >
                                                    Vois plus
                                                </Button>
                                            </a>
                                            {/* Fin */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    
                </div>
            </div>
        ) : ('')}
      </div>

      {/* ********************************************************************************** */}
                {/* MODAL D'ACCEPTATION OU REFUS DE LA DEMANDE*/}
            {/* ********************************************************************************** */}
            <Modal show={showForm} className="mt-15" onHide={handleCloseForm}>
                <Modal.Header closeButton id="bgcolor">
                    <Modal.Title className="" >Distributeur</Modal.Title>                
                </Modal.Header>
                    <Modal.Body>
                        <div className='form-group my-3 text-center'>
                            Voulez-vous vraiment faire une demande pour être distributeur ?
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className="text-white" color="danger" onClick={handleCloseForm}>
                            Non
                        </Button>
                        <Button className='px-3' onClick={requestDistributer}  color="success" disabled={isLoggingIn}>
                            Oui
                        </Button>
                    </Modal.Footer>
            </Modal>
            {/* *****************************************FIN****************************************** */}


    </>
  );
};

export default AccueilGestion;
