import { useState, useEffect } from 'react';
import React from "react";
import axios from 'axios';
import Link from 'next/link';
import { Icon } from '@iconify/react';


// Pour Magic
import { magic } from "../../../magic";
import { ethers } from "ethers";
import Loading from "../../loading";
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

const InfosUtilisateur = () => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API

    const [currentUser, setCurrentUser] = useState();
    const [provider, setProvider] = useState(null);
    
    
    
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
 

    // const [currentTypeProfil, setCurrentTypeProfil] =useState()
    // useEffect(() => {
    //     if (typeof window !== 'undefined') {
    //         const currentTypeProfil = localStorage.getItem('currentTypeProfil'); //Pour recuperer le code du type de profil dans la variable local
    //         setCurrentTypeProfil(currentTypeProfil)
    //     }
    // }, []);


  return (
    <>

      <div className='' >
        <div className=' mx-15'>
            <div className='py-10'>
                {/* INFORMATIONS DU PROFIL PATICULIER */}
                {currentUser?.codeTypeProfil === "part" ? (
                <h1 className='text-center'>Infos personnelles</h1>
                ):("")}

                {/* INFORMATIONS DU PROFIL Entreprise / Commerçant */}
                {currentUser?.codeTypeProfil === "entCom" ? (   
                <h1 className='text-center'>Infos de l'entreprise</h1>
                ):("")}

                {/* INFORMATIONS DU PROFIL Institution et société financière */}
                {currentUser?.codeTypeProfil === "insti" ? ( 
                <h1 className='text-center'>Infos de l'institution</h1>
                ):("")}
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
                    <div className='col-lg-4 col-md-4'>
                        <div className='currency-selection text-center'>
                            <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                                <div className='cryptocurrency-slides'>
                                    <div className='bestseller-coin-image text-center'>
                                        <img src="/images/ecfa/logo/logo_ewari1.jpg" width={150} className="rounded-circle "  alt='image' />
                                        
                                    </div>
                                    {/* <div className='title'>
                                        <h4>Mes infos de connexion</h4>
                                    </div> */}
                                    <div className='single-cryptocurrency-box'>
                                        
                                        <div className='btn-box'>
                                        <Button
                                            block
                                            color="primary"
                                            type="button"
                                        >
                                            Changer la photo
                                        </Button>
                                        {/* Fin */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* INFORMATIONS DU PROFIL PATICULIER */}
                    {currentUser?.codeTypeProfil === "part" ? (   
                        <div className='col-lg-8 col-md-8'>
                            <div className='currency-selection '>
                                <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                                <div className='cryptocurrency-slides'>
                                        <div className='single-cryptocurrency-box'>
                                            <div className='row '>
                                                <div className='col-lg-6 col-md-6 mb-3'>
                                                    <h5>Nom</h5>
                                                    <p>Koné</p>
                                                </div>

                                                <div className='col-lg-6 col-md-6 mb-3'>
                                                    <h5>Prénom</h5>
                                                    <p>Zié Arouna</p>
                                                </div>

                                                <div className='col-lg-6 col-md-6 mb-3'>
                                                    <h5>Pays</h5>
                                                    <p>Côte d'Ivoire</p>
                                                </div>

                                                <div className='col-lg-6 col-md-6 mb-3'>
                                                    <h5>Ville</h5>
                                                    <p>Abidjan</p>
                                                </div>

                                                <div className='col-lg-6 col-md-6 mb-3'>
                                                    <h5>Date de naissance</h5>
                                                    <p>27/01/2023</p>
                                                </div>

                                                <div className='col-lg-6 col-md-6 mb-3'>
                                                    <h5>Sexe</h5>
                                                    <p>Homme</p>
                                                </div>

                                                <div className='col-lg-6 col-md-6 mb-3'>
                                                    <h5>Numéro de téléphone</h5>
                                                    <p>+225 0171070784</p>
                                                </div>

                                                <div className='col-lg-6 col-md-6 mb-3'>
                                                    <h5>Email</h5>
                                                    <p>arouna.kone@wealthtechinnovations.com</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : ("")}
                    {/* Fin */}

                    {/* INFORMATIONS DU PROFIL Entreprise / Commerçant */}
                    {currentUser?.codeTypeProfil === "entCom" ? (   
                    <div className='col-lg-8 col-md-8'>
                        <div className='currency-selection '>
                            <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                            <div className='cryptocurrency-slides'>
                                    <div className='single-cryptocurrency-box'>
                                        <div className='row '>
                                            <div className='col-lg-6 col-md-6 mb-3'>
                                                <h5>L'entreprise</h5>
                                                <p>Wealthtech</p>
                                            </div>

                                            <div className='col-lg-6 col-md-6 mb-3'>
                                                <h5>Pays</h5>
                                                <p>Côte d'Ivoire</p>
                                            </div>

                                            <div className='col-lg-6 col-md-6 mb-3'>
                                                <h5>Ville</h5>
                                                <p>Abidjan</p>
                                            </div>

                                            <div className='col-lg-6 col-md-6 mb-3'>
                                                <h5>Site internet</h5>
                                                <p>google.com</p>
                                            </div>

                                            <div className='col-lg-6 col-md-6 mb-3'>
                                                <h5>Secteur d'activité</h5>
                                                <p>Secteur d'activité ici</p>
                                            </div>

                                            <div className='col-lg-6 col-md-6 mb-3'>
                                                <h5>Numéro de téléphone</h5>
                                                <p>+225 0171070784</p>
                                            </div>

                                            <div className='col-lg-6 col-md-6 mb-3'>
                                                <h5>Nombre d'employés</h5>
                                                <p>10 à 20</p>
                                            </div>

                                            <div className='col-lg-6 col-md-6 mb-3'>
                                                <h5>type d'entreprise</h5>
                                                <p>Personne physique</p>
                                            </div>

                                            <div className='col-lg-6 col-md-6 mb-3'>
                                                <h5>Numéro du régistre</h5>
                                                <p>2345679865456780965847</p>
                                            </div>
                                            

                                            <div className='col-lg-6 col-md-6 mb-3'>
                                                <h5>Email</h5>
                                                <p>arouna.kone@wealthtechinnovations.com</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    ) : ("")}
                    {/* FIN */}

                {/* INFORMATIONS DU PROFIL Institution et société financière */}
                {currentUser?.codeTypeProfil === "insti" ? (   
                    <div className='col-lg-8 col-md-8'>
                        <div className='currency-selection '>
                            <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                            <div className='cryptocurrency-slides'>
                                    <div className='single-cryptocurrency-box'>
                                    <div className='row '>
                                            <div className='col-lg-6 col-md-6 mb-3'>
                                                <h5>L'institution</h5>
                                                <p>Wealthtech</p>
                                            </div>

                                            <div className='col-lg-6 col-md-6 mb-3'>
                                                <h5>Pays</h5>
                                                <p>Côte d'Ivoire</p>
                                            </div>

                                            <div className='col-lg-6 col-md-6 mb-3'>
                                                <h5>Ville</h5>
                                                <p>Abidjan</p>
                                            </div>

                                            <div className='col-lg-6 col-md-6 mb-3'>
                                                <h5>Site internet</h5>
                                                <p>google.com</p>
                                            </div>

                                            <div className='col-lg-6 col-md-6 mb-3'>
                                                <h5>Numéro de téléphone</h5>
                                                <p>+225 0171070784</p>
                                            </div>

                                            <div className='col-lg-6 col-md-6 mb-3'>
                                                <h5>type d'institution</h5>
                                                <p>Personne physique</p>
                                            </div>

                                            <div className='col-lg-6 col-md-6 mb-3'>
                                                <h5>Abréviation</h5>
                                                <p>Abréviation ic</p>
                                            </div>
                                            

                                            <div className='col-lg-6 col-md-6 mb-3'>
                                                <h5>Email</h5>
                                                <p>arouna.kone@wealthtechinnovations.com</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : ("")}
                {/* FIN */}
            </div>
        </div>

       
      </div>

    </>
  );
};

export default InfosUtilisateur;
