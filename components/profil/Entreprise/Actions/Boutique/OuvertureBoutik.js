import { useState, useEffect } from 'react';
import React from "react";
import axios from 'axios';
import Link from 'next/link';
import { Icon } from '@iconify/react';


// Pour Magic
import { magic } from "../../../../../magic";
import { ethers } from "ethers";
import Loading from "../../../../../components/loading";
import Router from "next/router";
import Swal from 'sweetalert2';
import Web3 from "web3";

// FIN



// MODALS 
// reactstrap components
import {Button} from "reactstrap";

// FIN

const OuvertureBoutik = () => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API


    const [currentUser, setCurrentUser] = useState();
    const [isLoggingIn, setIsLoggingIn] = useState();
    const [provider, setProvider] = useState(null);
        

    //state de la demande de stablecoin
    const [shopName, setShopName] = useState(); 
    const [dataRequestUseStablecoin, setDataRequestUseStablecoin] =useState()


    //states de la demande de stablecoin pour ecommerce
    const [partner, setPartner]=useState()
    const [notificationLink, setNotificationLink] = useState()
    const [dataRequestUseStablecoinEshop, setDataRequestUseStablecoinEshop] =useState()

    // States de tab
    const [toggleState, setToggleState] = useState(1);
    const toggleTab = (index) => {
        setToggleState(index);
    };
    // Fin

    


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



    // FONCTION DE LA DEMANDE D'UTILISATION DE STABLECOIN COMME MOYEN DE PAIEMENT
    const requestUseStablecoin= async(event) =>{
        event.preventDefault();
        setIsLoggingIn(true)
        
        const dataa = {
            shopName:shopName
        }

        // Obtenir le token en cours
        const token = localStorage.getItem('tokenEnCours');

        const result = await fetch(`${API_URL}/api/payment-request/add-of-request-use-stablecoin`, {
            method:"POST",
            body: JSON.stringify(dataa),
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
                html: "<p> Votre demande a été envoyée avec succès.<br/> Merci de patienter le temps que le traitement de votre demande finisse.</p>" ,
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
                html: "<p>  Votre demande a échoué. </p>" ,
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


    // FONCTION DE LA DEMANDE D'UTILISATION DE STABLECOIN COMME MOYEN DE PAIEMENT SUR ECOMMERCE
    const requestUseStablecoinOnEshop= async(event) =>{
        event.preventDefault();
        setIsLoggingIn(true)
        
        const requestBody = {
            partner: partner,
            notificationLink: notificationLink,
        }

        // Obtenir le token en cours
        const token = localStorage.getItem('tokenEnCours');

        const result = await fetch(`${API_URL}/api/apikey/generate-apikey`, {
            method:"POST",
            body: JSON.stringify(requestBody),
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
                html: "<p> Votre demande a été envoyée avec succès.<br/> Merci de patienter le temps que le traitement de votre demande finisse.</p>" ,
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
                html: "<p>  Votre demande a échoué. </p>" ,
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
                throw new Error('Failed to fetch KYC data');
            } else {
                // Vérifier si la réponse n'est pas vide avant de la parser en JSON
                const text = await result.text();
                const data = text ? JSON.parse(text) : null;
    
                setDataRequestUseStablecoin(data);
            }
        };
    
        await getDataRequestUseStablecoin();
    }, []);
    
    // FIN



    /**
     * Hook d'effet pour récupérer et définir la demande d'utilisation de stablecoin sur ecommerce de l'utilisateur connecté.
     * @returns {void}
     */
     useEffect(() => {
        const token = localStorage.getItem('tokenEnCours');
    
        /**
         * Fonction pour obtenir la demande d'utilisation de stablecoin sur ecommerce de l'utilisateur connecté.
         * @returns {void}
         */
        const getDataRequestUseStablecoinEshop = async () => {
            try {
                const result = await fetch(`${API_URL}/api/apikey/find-request-use-stablecoin-for-eshop-of-user`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });
    
                if (!result.ok) {
                    throw new Error("Échec de la récupération des données pour l'utilisation du stablecoin sur le commerce électronique");
                }
    
                const data = await result.json();
                setDataRequestUseStablecoinEshop(data);
            } catch (error) {
                console.error("Erreur lors de la récupération des données pour l'utilisation de stablecoin sur le commerce électronique:", error.message);
                // Handle the error as needed
            }
        };
    
        getDataRequestUseStablecoinEshop();
    }, []);
    
    // FIN

  return (
    <>

      <div className='' >
        <div className=' mx-15'>
            <div className='py-10'>
                <h3 className='text-center'>Demande d'utilisation de stablecoin comme moyen de paiement</h3>
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

                                        {/* L'entête des tabs */}
                                        <div className="bloc-tabs-utilite ">
                                            
                                            <button
                                                className={toggleState === 1 ? "tabs active-tabs gr-text-8 text-color-opacity" : "tabs gr-text-8 text-color-opacity"}
                                                onClick={() => toggleTab(1)}
                                            >
                                                <span className=''>Pour les paiements sur stablecoin</span>
                                            </button>

                                            <button
                                                className={toggleState === 2 ? "tabs active-tabs  gr-text-8 text-color-opacity" : "tabs  gr-text-8 text-color-opacity"}
                                                onClick={() => toggleTab(2)}

                                            >
                                                <span className=''>Pour les paiement sur mon site en ligne</span>
                                            </button>
                                        </div>

                                        {/* Le corps de tab */}
                                        <div className="content-tabs">
                                            {/* demande d'ulisation de stablecoin sur la plafeforme stablecoin */}
                                            <div
                                                className={toggleState === 1 ? "content  active-content" : "content"}
                                            >
                                                <div className='cryptocurrency-search-box'>
                                                    {dataRequestUseStablecoin?.allow==0? (
                                                        <div className='colorRed text-center'>Votre demande est en cours de traitement</div>
                                                    ):dataRequestUseStablecoin?.allow==1? (
                                                        <div className='colorGreen text-center'>Félicitations, votre demande a été acceptée</div>
                                                    ):(
                                                        <form onSubmit={requestUseStablecoin}>
                                                            <div className="form-group my-6 ">
                                                                <label
                                                                htmlFor="shopName"
                                                                className="mt-3"
                                                                >
                                                                    Nom de la boutique <sup className="text-red">*</sup>
                                                                </label>
                                                                <div className="input-group flex-nowrap">
                                                                    <input
                                                                        className="form-control gr-text-11 border  bg-white"
                                                                        type="text"
                                                                        id="shopName"
                                                                        placeholder="Nom de la boutique"
                                                                        required
                                                                        defaultValue={shopName} 
                                                                        onChange={(event)=>setShopName(event.target.value)}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <Button
                                                                block
                                                                color="primary"
                                                                type="submit"
                                                                className='mt-3'
                                                                disabled={isLoggingIn}

                                                            >
                                                                Envoyer
                                                            </Button>
                                                        </form>
                                                    )}
                                                     
                                                </div>
                                            </div>
                                            {/* Fin*/}

                                            {/* demande d'ulisation de stablecoin sur la plafeforme sur votre commerce */}
                                            <div
                                                className={toggleState === 2 ? "content  active-content" : "content"}
                                            >
                                                <div className='cryptocurrency-search-box'>
                                                {dataRequestUseStablecoinEshop?.allow==0? (
                                                        <div className='colorRed text-center'>Votre demande est en cours de traitement</div>
                                                    ):dataRequestUseStablecoinEshop?.allow==1? (
                                                        <div className='colorGreen text-center'>Félicitations, votre demande a été acceptée</div>
                                                    ):(
                                                        <form onSubmit={requestUseStablecoinOnEshop}>
                                                            <div className="form-group my-6 ">
                                                                <label
                                                                htmlFor="partner"
                                                                className="mt-3"
                                                                >
                                                                    Nom du site <sup className="text-red">*</sup>
                                                                </label>
                                                                <div className="input-group flex-nowrap">
                                                                    <input
                                                                        className="form-control gr-text-11 border bg-white"
                                                                        type="text"
                                                                        id="partner"
                                                                        placeholder="Nom du site"
                                                                        required
                                                                        defaultValue={partner} 
                                                                        onChange={(event)=>setPartner(event.target.value)}
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="form-group my-6 ">
                                                                <label
                                                                htmlFor="notificationsLink"
                                                                className="mt-3"
                                                                >
                                                                    Lien de la page de notifications <sup className="text-red">*</sup>
                                                                </label>
                                                                <div className="input-group flex-nowrap">
                                                                    <input
                                                                        className="form-control gr-text-11 border bg-white"
                                                                        type="text"
                                                                        id="notificationsLink"
                                                                        placeholder="Lien de la page de notifications"
                                                                        required
                                                                        defaultValue={notificationLink} 
                                                                        onChange={(event)=>setNotificationLink(event.target.value)}
                                                                    />
                                                                </div>
                                                            </div>

                                                            <Button
                                                                block
                                                                color="primary"
                                                                type="submit"
                                                                className='mt-3'
                                                                disabled={isLoggingIn}
                                                            >
                                                                Envoyer
                                                            </Button>
                                                        </form> 
                                                    )}
                                                </div>
                                            </div>
                                            {/* Fin portefeuille crowdfunding*/}
                                        </div>
                                        {/* Fin le corps de tab */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-lg-2 col-md-2'></div>
                </div>
            </div>
       
      </div>

    </>
  );
};

export default OuvertureBoutik;
