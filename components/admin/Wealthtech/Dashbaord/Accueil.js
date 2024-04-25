import { useState, useEffect } from 'react';
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

const DasbaordWti = () => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API
    // Variable de l'api key de stablecoin
    const API_KEY_STABLECOIN = process.env.NEXT_PUBLIC_API_KEY_STABLECOIN


    const [currentUser, setCurrentUser] = useState();
    const [provider, setProvider] = useState(null);

    //state qui contient other user pour des conditions sur la page de vérification
    const [acteur, setActeur] = useState(); 



    


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

              // Obtenir l'utilisateur connecté 
                const token = localStorage.getItem('tokenEnCours')

                const getUser = async () => {
                    const result = await fetch(`${API_URL}/api/user/find-user-sign-in`, {
                        headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': `${API_KEY_STABLECOIN}`,
                        Authorization:  `Bearer ${token}`,

                        },
                    })
                  .then((result) => result.json())
                  .then((user) => {

                    if (user?.profileId==2 || user?.profileId==3) {
                        setCurrentUser(user)
                    }else{
                        Router.push("/profil/"); 
                        
                    }
                  }) 
              };
              await getUser();
              // Fin
            }
        })();

       


    }, [provider, magic]);
    //  Fin

   


  return (
      <>
    {currentUser?.profileId==2 || currentUser?.profileId==3?(

    <>

      <div className='' >
        <div className=' mx-15'>
            <div className='py-10'>
                <h1 className='text-center'>Dashboard de Wealthtech</h1>
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
                    {currentUser?.profileId==2 ? (
                        <>
                        <div className='col-lg-6 col-md-6'>
                            <div className='currency-selection text-center'>
                                <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                                    <div className='cryptocurrency-slides'>
                                        <div className='single-cryptocurrency-box'>
                                            <div className='d-flex align-items-center'>
                                            
                                            <div className='title'>
                                                <h3>Attribuer des rôles</h3>
                                            </div>
                                            </div>
                                            <div className='btn-box'>
                                                <Link href='/admin/wealthtech/roles/attribution/'>
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
                                                <h3>Stablecoin comme moyen de payement</h3>
                                            </div>
                                            </div>
                                            <div className='btn-box'>
                                                <Link href='/admin/wealthtech/stablecoin/comme-moyen-paiement'>
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
                                                <h3>Les demandes d'être distributeur</h3>
                                            </div>
                                            </div>
                                            <div className='btn-box'>
                                                <Link href='/admin/wealthtech/stablecoin/distributeur/'>
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
                                                <h3>Ajout ou modification des infos de conversion</h3>
                                            </div>
                                            </div>
                                            <div className='btn-box'>
                                                <Link href='/admin/wealthtech/stablecoin/portefeuille/conversion/'>
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
                                                <h3>Ajout ou modification des tarifs d'abonnement</h3>
                                            </div>
                                            </div>
                                            <div className='btn-box'>
                                                <Link href='/admin/wealthtech/stablecoin/abonnement/tarifs'>
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
                                                <h3>Les abonnés</h3>
                                            </div>
                                            </div>
                                            <div className='btn-box'>
                                                <Link href='/admin/wealthtech/stablecoin/abonnement/liste-abonnes'>
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
                        </>
                        
                    ) : ("")}         
                   
                </div>
            </div>
      </div>

    </>
    ):(
        <span className="text-center bg-default-2 btn-bottom-text  d-block gr-text-5 text-blackish-blue gr-opacity-10 my-35">
            <Loading/>
        </span>
    )}
    </>
  );
};

export default DasbaordWti;
