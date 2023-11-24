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

const AccueilBoutique = () => {
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
                <h1 className='text-center'>Ma boutique</h1>
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
                            <div className="mt-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                                <div className='cryptocurrency-slides'>
                                    <div className='single-cryptocurrency-box'>
                                        <div className='d-flex align-items-center'>
                                        <div className='bestseller-coin-image'>
                                            <img src="/images/ecfa/logo/logo_ewari1.jpg" className="rounded-circle"  alt='image' />
                                        </div>
                                        <div className='title pb-5'>
                                            <h3>Stablecoin E-WARI</h3>
                                            <p>Mon solde non récupéré: 35 678 E-WARI</p>
                                        </div>
                                        </div>
                                        <div className='btn-box pb-3'>
                                        {/* <Button
                                            block
                                            color="success"
                                            type="button"
                                        >
                                            Voir plus
                                        </Button> */}
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
                                            <h3>Effectuer un retrait vers mon compte </h3>
                                        </div>
                                        </div>
                                        <form >
                                            <div className="form-group my-6 ">
                                                {/* <label
                                                htmlFor="montant"
                                                className="gr-text-8 fw-bold text-blackish-blue"
                                                >
                                                    Montant à retirer <sup className="text-red">*</sup>
                                                </label> */}
                                                <div className="input-group flex-nowrap">
                                                <input
                                                    className="form-control gr-text-11 border mt-3 bg-white"
                                                    type="number"
                                                    id="montant"
                                                    placeholder="35 678"
                                                    required
                                                    disabled
                                                    value={"35 678"}
                                                    // defaultValue={montantEnvoyer} 
                                                    // onChange={(event)=>setMontantEnvoyer(event.target.value)}
                                                />
                                                    <span className="input-group-text gr-text-11  mt-3" id="addon-wrapping">EWARI</span>
                                                </div>
                                            </div>
                                            <Button
                                                block
                                                color="primary"
                                                type="button"
                                                className='mt-3'
                                            >
                                                Retirer
                                            </Button>
                                        </form>
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

export default AccueilBoutique;
