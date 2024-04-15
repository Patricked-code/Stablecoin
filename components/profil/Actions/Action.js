import { useState, useEffect } from 'react';
import React from "react";
import axios from 'axios';
import Link from 'next/link';
import { Icon } from '@iconify/react';


// Pour Magic
import { magic } from "../../../magic";
import { ethers } from "ethers";
import Loading from "../../../components/loading";
import Router from "next/router";
import Swal from 'sweetalert2';
import Web3 from "web3";

// FIN



// MODALS 
// reactstrap components
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    FormGroup,
    Form,
    Input,
    InputGroupAddon,
    InputGroupText,
    InputGroup,
    Modal,
    Row,
    Col,
  } from "reactstrap";

// FIN

const Action = () => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API


    const [currentUser, setCurrentUser] = useState();
    const [provider, setProvider] = useState(null);

    //state qui contient l'état de la demande du commerçant pour pouvoir utiliser stablecoin comme moyen de paiement sur la plateforme 
    const [stateOfRequestUseStablecoin, setStateOfRequestUseStablecoin] = useState(); 
    //state qui contient l'état de la demande du commerçant pour être distributeur sur la plateforme 
    const [infosDistributer, setInfosDistributer] = useState()


    


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


    /**
     * Hook d'effet pour récupérer et définir la demande d'utilisation de stablecoin de l'utilisateur connecté.
     * @returns {void}
    */
     useEffect(async () => {
        const token = localStorage.getItem('tokenEnCours');
    
        /**
         * Fonction pour obtenir la demande d'utilisation de stablecoin de l'utilisateur connecté.
         * @returns {void}
         */
        const getDataRequestUseStablecoin = async () => {
            const result = await fetch(`${API_URL}/api/payment-request/find-request-use-stablecoin-of-user`, {
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
    
                setStateOfRequestUseStablecoin(data);
            }
        };
    
        await getDataRequestUseStablecoin();
    }, []);
    // FIN

    const warnOnRequestStatusUseStablecoin = async () =>{
        Swal.fire({
            position: 'center',
            icon: 'error',
            html: `${stateOfRequestUseStablecoin ==0 ? "Votre demande d'accès à cette partie est en cours de traitement":stateOfRequestUseStablecoin ==2 ? "Desolé, votre demande d'accès à cette partie a été rejetée":"Vous devez effectuer une demande pour obtenir une autorisation pour accéder à cette partie."}` ,
            showConfirmButton: false,
            timer: 15000
        })
    }



    // FONCTION POUR RECUPERER LES INFOS DE COMMISION DE DEPOT DE L'INSTITUTION EN FONCTION DE L'UTILISATEUR CONNECTE
    useEffect(() => {
        // Obtenir le token en cours
        const token = localStorage.getItem('tokenEnCours');
        const getInfosDistributer = async () => {
        try {
            const result = await fetch(`${API_URL}/api/distributer/find-request-distributer-of-user`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`

            },
            });

            if (!result.ok) {
            throw new Error('Failed to fetch  data');
            }
            const data = await result.json();
            setInfosDistributer(data);
            
        } catch (error) {
            // Handle errors appropriately, e.g., set an error state.
            console.error('Error fetching  data:', error);
        }
        };

        getInfosDistributer();
        
    }, []);
    // FIN

    const warnOnRequestStatusDistributer = async () =>{
        Swal.fire({
            position: 'center',
            icon: 'error',
            html: `Désolé, vous devez avoir un rôle distributeur afin d'accéder à cette partie.` ,
            showConfirmButton: false,
            timer: 15000
        })
    }


    return (
        <>

        <div className='' >
            <div className=' mx-15'>
                <div className='py-10'>
                    <h1 className='text-center'>Mes actions</h1>
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
            {currentUser?.codeTypeProfil==="entCom"? (
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
                                                <h3>Demande de paiement</h3><br/>
                                            </div>
                                            </div>
                                            <div className='btn-box'>
                                                {stateOfRequestUseStablecoin==1 ? (
                                                    <a href='/profil/entreprise/actions/demande-paiement/'>
                                                        <Button
                                                        block
                                                        color="primary"
                                                        type="button"
                                                        >
                                                            Voir plus 
                                                        </Button>
                                                    </a> 
                                                ):(
                                                    <Button
                                                        block
                                                        color="primary"
                                                        type="button"
                                                        onClick={warnOnRequestStatusUseStablecoin}
                                                        >
                                                            Voir plus
                                                    </Button>
                                                )}
                                                
                                            
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
                                            {/* <div className='bestseller-coin-image'>
                                                <img src="/images/ecfa/logo/logo_ewari1.jpg" className="rounded-circle"  alt='image' />
                                            </div> */}
                                            <div className='title'>
                                                <h3>Financer mon projet </h3><br/>
                                            </div>
                                            </div>
                                            <div className='btn-box'>
                                            <Button
                                                block
                                                color="primary"
                                                type="button"
                                            >
                                                Voir plus
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
                                                <h3>Demande d'utilisation de stablecoin comme moyen de paiement direct</h3>
                                            </div>
                                            </div>
                                            
                                            <div className='btn-box'>
                                            <Link href='/profil/entreprise/actions/boutique/ouverture-boutique' activeClassName='active'>
                                                <Button
                                                    block
                                                    color="primary"
                                                    type="button"
                                                >
                                                    Voir plus
                                                </Button>
                                            </Link>
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
                                                <h3>Demande d'utilisation de stablecoin comme moyen de paiement E-commerce</h3>
                                            </div>
                                            </div>
                                            
                                            <div className='btn-box'>
                                            <Link href='/profil/entreprise/actions/boutique/compte-ecommerce' activeClassName='active'>
                                                <Button
                                                    block
                                                    color="primary"
                                                    type="button"
                                                >
                                                    Voir plus
                                                </Button>
                                            </Link>
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
                                                <h3>Gestion des commandes e-commerce</h3>
                                            </div>
                                            </div><br/>
                                            
                                            <div className='btn-box'>
                                            <Link href='/paiements/gestion-paiement-ecommerce' activeClassName='active'>
                                                <Button
                                                    block
                                                    color="primary"
                                                    type="button"
                                                >
                                                    Voir plus
                                                </Button>
                                            </Link>
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
                                                <h3>Recette des ventes</h3><br/>
                                            </div>
                                            </div>
                                            <div className='btn-box'>
                                            <Link href='/profil/entreprise/actions/boutique' activeClassName='active'>
                                                <Button
                                                    block
                                                    color="primary"
                                                    type="button"
                                                >
                                                    Voir plus
                                                </Button>
                                            </Link>
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
                                                <h3>Fonds collectés "crowdfunding" </h3><br/>
                                            </div>
                                            </div>
                                            <div className='btn-box'>
                                            <Button
                                                block
                                                color="primary"
                                                type="button"
                                            >
                                                Voir plus
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
                                                <h3>Investir dans OPCVM</h3> <br/>
                                            </div>
                                            </div>
                                            <div className='btn-box'>
                                            <Button
                                                block
                                                color="primary"
                                                type="button"
                                            >
                                                Voir plus
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
                                                <h3>Ma dette "crowdfunding"</h3> <br/>
                                            </div>
                                            </div>
                                            <div className='btn-box'>
                                            <Button
                                                block
                                                color="primary"
                                                type="button"
                                            >
                                                Voir plus
                                            </Button>
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

            {currentUser?.codeTypeProfil==="insti" ? (
                <div className='cryptocurrency-search-box'>
                    <div className='row'>
                        <div className='col-lg-6 col-md-6'>
                            <div className='currency-selection text-center'>
                                <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                                <div className='cryptocurrency-slides'>
                                        <div className='single-cryptocurrency-box'>
                                            <div className='d-flex align-items-center'>
                                            <div className='title'>
                                                <h3>Dépôt cash </h3>
                                            </div>
                                            </div>

                                            <div className='row'>
                                            <div className='btn-box col-lg-6 col-md-6'>
                                                {infosDistributer?.allow==1? (

                                                    <a href='/profil/institution/verifier-documents/'>
                                                        {/* <a> */}
                                                        <Button
                                                            block
                                                            color="primary"
                                                            type="button"
                                                        >
                                                            Titulaire du compte 
                                                        </Button>
                                                    </a>
                                                ) : (
                                                    <Button
                                                        block
                                                        color="primary"
                                                        type="button"
                                                        onClick={warnOnRequestStatusDistributer}
                                                    >
                                                        Titulaire du compte 
                                                    </Button>
                                                )}
                                                
                                            {/* Fin */}
                                            </div>

                                            <div className='btn-box col-lg-6 col-md-6'>
                                                {infosDistributer?.allow==1? (
                                                    <a href='/profil/institution/autre-verification-documents/'>
                                                        {/* <a> */}
                                                        <Button
                                                            block
                                                            color="primary"
                                                            type="button"
                                                        >
                                                            Autre utilisateur
                                                        </Button>
                                                    </a>
                                                ) : (
                                                    <Button
                                                        block
                                                        color="primary"
                                                        type="button"
                                                        onClick={warnOnRequestStatusDistributer}
                                                    >
                                                        Titulaire du compte 
                                                    </Button>
                                                )}
                                            {/* Fin */}
                                            </div>
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
                                                <h3>Retrait cash </h3>
                                            </div>
                                            </div>
                                            <div className='btn-box'>
                                            {infosDistributer?.allow==1? (
                                                <a href='/profil/institution/verifier-documents-retrait/'>
                                                <Button
                                                    block
                                                    color="primary"
                                                    type="button"
                                                >
                                                    Titulaire du compte
                                                </Button>
                                                </a>
                                            ) : (
                                                <Button
                                                    block
                                                    color="primary"
                                                    type="button"
                                                    onClick={warnOnRequestStatusDistributer}
                                                >
                                                    Titulaire du compte 
                                                </Button>
                                            )}
                                            {/* Fin */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                            {/* <div className='col-lg-6 col-md-6'>
                                <div className='currency-selection text-center'>
                                    <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                                        <div className='cryptocurrency-slides'>
                                            <div className='single-cryptocurrency-box'>
                                                <div className='d-flex align-items-center'>
                                                <div className='title'>
                                                    <h3>Mint/Burn </h3>
                                                </div>
                                                </div>
                                                <div className='btn-box'>
                                                    <a href='/profil/institution/mintBurn/'>
                                                        <Button
                                                            block
                                                            color="primary"
                                                            type="button"
                                                        >
                                                            Voir plus
                                                        </Button>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div> */}
                                    
                            
                        
                    </div>
                </div>
            ) : ('')}

        
        </div>



        












        






        </>
    );
};

export default Action;
