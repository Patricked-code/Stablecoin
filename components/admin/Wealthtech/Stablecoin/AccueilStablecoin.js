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

const AccueilStablecoin = () => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API


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
                  console.log("User=>",user)
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
                <h1 className='text-center'>Stablecoin</h1>
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
                                                <h3>Mint </h3>
                                            </div>
                                            </div>
                                            <div className='btn-box'>
                                                <a href='/admin/wealthtech/stablecoin/mintBurn'>
                                                    <Button
                                                        block
                                                        color="primary"
                                                        type="button"
                                                    >
                                                        Voir plus
                                                    </Button>
                                                </a>
                                            
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
                                            <h3>Gestion des rôles</h3>
                                        </div>
                                        </div>
                                        <div className='btn-box'>
                                            <a href='/admin/wealthtech/stablecoin/roles/attribuer-roles'>
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
      </div>

    </>
  );
};

export default AccueilStablecoin;
