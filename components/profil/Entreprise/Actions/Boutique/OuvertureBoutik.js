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
    const [provider, setProvider] = useState(null);

    //state qui contient other user pour des conditions sur la page de vérification
    const [acteur, setActeur] = useState(); 


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

    if (typeof window !== 'undefined') {
        localStorage.setItem('acteurOfDepot',acteur);

        const actor = localStorage.getItem('acteurOfDepot');

        console.log("Acteur=>",actor)
    }


  return (
    <>

      <div className='' >
        <div className=' mx-15'>
            <div className='py-10'>
                <h1 className='text-center'>Ouverture de boutique</h1>
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
                                            {/* Portefeuille OPCVM */}
                                            <div
                                                className={toggleState === 1 ? "content  active-content" : "content"}
                                            >
                                                <div className='cryptocurrency-search-box'>
                                                    
                                                    <form >
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
                                                                    // defaultValue={shopName} 
                                                                    // onChange={(event)=>setShopName(event.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                        <Button
                                                            block
                                                            color="primary"
                                                            type="button"
                                                            className='mt-3'
                                                        >
                                                            Envoyer
                                                        </Button>
                                                    </form> 
                                                </div>
                                            </div>
                                            {/* Fin portefeuille OPCVM */}

                                            
                                            <div
                                                className={toggleState === 2 ? "content  active-content" : "content"}
                                            >
                                                <div className='cryptocurrency-search-box'>
                                                    <form >
                                                        <div className="form-group my-6 ">
                                                            <label
                                                            htmlFor="siteName"
                                                            className="mt-3"
                                                            >
                                                                Nom du site <sup className="text-red">*</sup>
                                                            </label>
                                                            <div className="input-group flex-nowrap">
                                                                <input
                                                                    className="form-control gr-text-11 border bg-white"
                                                                    type="text"
                                                                    id="siteName"
                                                                    placeholder="Nom du site"
                                                                    required
                                                                    // defaultValue={siteName} 
                                                                    // onChange={(event)=>setSiteName(event.target.value)}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="form-group my-6 ">
                                                            <label
                                                            htmlFor="notificationsPageLink"
                                                            className="mt-3"
                                                            >
                                                                Lien de la page de notifications <sup className="text-red">*</sup>
                                                            </label>
                                                            <div className="input-group flex-nowrap">
                                                                <input
                                                                    className="form-control gr-text-11 border bg-white"
                                                                    type="text"
                                                                    id="notificationsPageLink"
                                                                    placeholder="Lien de la page de notifications"
                                                                    required
                                                                    // defaultValue={notificationsPageLink} 
                                                                    // onChange={(event)=>setNotificationsPageLink(event.target.value)}
                                                                />
                                                            </div>
                                                        </div>

                                                        <Button
                                                            block
                                                            color="primary"
                                                            type="button"
                                                            className='mt-3'
                                                        >
                                                            Envoyer
                                                        </Button>
                                                    </form> 
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
