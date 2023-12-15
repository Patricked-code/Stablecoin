import { useState, useEffect } from 'react';
import { Container, Row, Col, Modal } from "react-bootstrap";

import React from "react";
import axios from 'axios';
// import Link from 'next/link';
import moment from 'moment';
import { Icon } from '@iconify/react';
import { Table } from '@nextui-org/react';
import Link from "../../../Link";


// Pour Magic
import { magic } from "../../../../magic";
import { ethers } from "ethers";
import Loading from "../../../loading";
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
    // Modal,
    // Row,
    // Col,
  } from "reactstrap";

// FIN

const ShowKycParticular = ({kycForParticularId, kycRequestId}) => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API


    const [currentUser, setCurrentUser] = useState();
    const [provider, setProvider] = useState(null);
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    // States de validationde Kyc
    const [etape, setEtape] = useState();

    const [kycForParticularUser, setKycForParticularUser] = useState();
    const [oneKycForParticular, setOneKycForParticular] = useState();
    const [idKycForParticular, setIdKycForParticular] = useState();
    const [oneCountry, setOneCountry] = useState();
    const [allCountry, setAllCountry] = useState();


    // states du formulaire de validation
    const [validQuiz, setValidQuiz] = useState();
    const [validQuizTwo, setValidQuizTwo] = useState();
    const [validQuizFatca, setValidQuizFatca] = useState();
    const [validIdentityOne, setValidIdentityOne] = useState();
    const [validPhotoWithDocument, setValidPhotoWithDocument] = useState();
    const [validIdentity, setValidIdentity] = useState();
    const [validResidence, setValidResidence] = useState();
    const [validPhoto, setValidPhoto] = useState();
    const [validSignature, setValidSignature] = useState();
    const [pattern, setPattern] = useState();

    const [updateKycStatut, setUpdateKycStatut] = useState("0"); 


    const [oneKycRequest, setOneKycRequest] = useState();

    

    
    


    


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

    //   localStorage pour stocker une valeur en cliquant sur un bouton Recompleter qui indique qu'on veut modifier une partie Kyc 
    useEffect(() => {
       localStorage.setItem('currentUpdateKycStatut',updateKycStatut)  
    }, [updateKycStatut]);
    

    // RECUPERER LE KYC DE L'UTILISATEUR PARTICULIER CONNECTE
    useEffect(async() => {
        const token = localStorage.getItem('tokenEnCours')

            const getKycForUserParticular = async (_idKycForParticular) => {
            const resKyc = await fetch(`${API_URL}/api/kyc/particular/find-one-kyc-particular/${_idKycForParticular}`, {
                headers: {
                'Content-Type': 'application/json',
                Authorization:  `Bearer ${token}`,
                },
            })
                .then((resKyc) => resKyc.json())
                .then((data) => {
                setKycForParticularUser(data)
                }) 
            };
            await getKycForUserParticular(kycForParticularId);
    }, []);
    // FIN


    // RECUPERER UNE SEULE LIGNE DE KYC DU PARTICULIER
    if (idKycForParticular) {
            const getOneKycForParticular = async (_idKycForParticular) => {
            const resKyc = await fetch(`${API_URL}/api/kyc/particular/find-one-kyc-particular/${_idKycForParticular}`, {
                headers: {
                'Content-Type': 'application/json',
                },
            })
                .then((resKyc) => resKyc.json())
                .then((data) => {
                setOneKycForParticular(data)
                }) 
            };
            getOneKycForParticular(kycForParticularId);
    }
    // FIN

    // RECUPERER UNE SEULE LIGNE DE PAYS
    if (currentUser?.nativeCountry) {
        const getOneCountry = async (_countryId) => {
          try {
            const result = await fetch(`${API_URL}/api/country/find-one/${_countryId}`, {
              headers: {
                'Content-Type': 'application/json',
              },
            });
      
            if (!result.ok) {
              throw new Error('Failed to fetch pays data');
            }
      
            const data = await result.json();
            setOneCountry(data);
          } catch (error) {
            // Handle errors appropriately, e.g., set an error state.
            console.error('Error fetching pays data:', error);
          }
        };
      
        getOneCountry(currentUser?.nativeCountry);
      }
    //   FIN

    // La fonction qui vérifie si un lien est un lien pdf
    function isPdfLink(link) {
        return link.endsWith('.pdf');
      }


    // Modal de la validation des différentes parties du kyc
    const [showEvaluer, setShowEvaluer] = useState(false);
    const handleCloseEvaluer = () => setShowEvaluer(false);
    const handleShowEvaluer = () => setShowEvaluer(true);
    // Fin

    // Modal pour voir des différentes parties du kyc
    const [showInfosKyc, setShowInfosKyc] = useState(false);
    const handleCloseInfosKyc = () => setShowInfosKyc(false);
    const handleShowInfosKyc = () => setShowInfosKyc(true);
    // Fin
    
    // FONCTION POUR FORMATER LA DATE
    const formatDate = (_updatedAt) =>{
        const maDate = moment(_updatedAt).format('DD/MM/YYYY');
        // const maDate = moment(_updatedAt).format('DD/MM/YYYY à HH:mm');
        return  maDate
    }
    //  FIN

    // Fonction de validation des parties de kyc
    const validKycParticular= async () => {
        setIsLoggingIn(true);
        try {
            const dataa = {
                validQuiz:validQuiz,
                validIdentity:validIdentity,
                validResidence:validResidence,
                validPhoto:validPhoto,
                validSignature:validSignature,
                pattern:pattern
            }
            const token = localStorage.getItem('tokenEnCours') //Le token récuperé
    
            const result = await fetch(`${API_URL}/api/kyc/particular/valid-kyc/${idKycForParticular}`, {
            method:"PUT",
            body: JSON.stringify(dataa),
            headers: {
                'Content-Type': 'application/json',
                Authorization:  `Bearer ${token}`
            }
            })
            const data = await result.json();
        
            /* Verifier s'il y a un messsage d'erreur on l'affiche dans SWAL 
            * sinon on affiche le message de succès
            */
            if (data.message===200) {
            Swal.fire({
                position: 'center',
                icon: 'success',
                html: `<p> Le message a été envoyé avec succès.</p>` ,
                showConfirmButton: false,
                timer: 5000
            }),
            setTimeout(() => {
                window.location.reload()
            }, 10000)
            
            }else{
                setIsLoggingIn(false);
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    html: `<p> ${data.message} </p>` ,
                    showConfirmButton: false,
                    timer: 10000
                })
                
            }
            // Fin condition 
        
            } catch {
            setIsLoggingIn(false);
            }
        }
    // Fin

    // RECUPERER TOUS LES PAYS
    useEffect(async() => {
        const token = localStorage.getItem('tokenEnCours')
        
            const getAllCountries = async () => {
            const resCountry = await fetch(`${API_URL}/api/country/find-all`, {
                headers: {
                'Content-Type': 'application/json',
                Authorization:  `Bearer ${token}`,

                },
            })
                .then((resCountry) => resCountry.json())
                .then((allCountry) => {
                setAllCountry(allCountry)
                }) 

            };
            
            await getAllCountries();
    }, []);
    // FIN


    /**
     * Hook d'effet pour récupérer les données d'une demande d'accès en fonction de son ID.
     * Les données sont stockées dans l'état `OnekycRequest`.
     *
     * @async
     * @function
     * @returns {void}
    */
     useEffect(async () => {
        /**
         * Fonction pour obtenir une demande d'accès en fonction de son ID.
         *
         * @async
         * @returns {void}
         */
        const getOneKycRequest = async (_kycRequestId) => {
            const token = localStorage.getItem('tokenEnCours');

            try {
                /**
                 * Résultat de la requête pour récupérer une demandes d'accès en fonction de son ID.
                 * @type {Response}
                 */
                const result = await fetch(`${API_URL}/api/kyc/find-one-kyc-request/${_kycRequestId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!result.ok) {
                    throw new Error('Failed to fetch KYC request data');
                }

                /**
                 * Données des demandes d'accès de l'utilisateur connecté.
                 * @type {object[]}
                 */
                const data = await result.json();
                setOneKycRequest(data);
            } catch (error) {
                // Gérer les erreurs de manière appropriée, par exemple, définir un état d'erreur.
                console.error('Erreur lors de la récupération des demandes d\'accès KYC:', error);
            }
        };

        // Appel de la fonction pour récupérer les demandes d'accès de l'utilisateur connecté.
        if (kycRequestId) {
            await getOneKycRequest(kycRequestId);
        }
        
    }, [kycRequestId]);


  return (
    <>

        <div className='' >
            <div className=' mx-15'>
                <div className='py-10'>
                    <h1 className='text-center'>Kyc accepté par le propriétaire</h1>
                    
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
                    <div className='col-lg-12 col-md-12'>
                        <div className='currency-selection'>
                            <div className='row'>
                                {oneKycRequest?.quizAmlAccept == 1 ? (
                                <div className='col-lg-3 col-md-3'>
                                    <div className='currency-selection text-center'>
                                        <div className="mt-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                                            <div className='cryptocurrency-slides'>
                                                <div className='single-cryptocurrency-box'>
                                                    <div className='title text-center '>
                                                        <p className=" py-0 "> Questionnaires AML</p>
                                                        <p className=" py-0 ">{kycForParticularUser?.validQuiz==1 ? ( <Icon icon="bx:chevron-down-circle" width={30} color="#208454" /> ) : ( <Icon icon="bx:x-circle" width={30} color="#dc3545" />)}</p>
                                                    </div>
                                                            
                                                    <div className='btn-box ' onClick={()=>setEtape(1)}>
                                                        <Button
                                                            block
                                                            color="primary"
                                                            type="button"
                                                            onClick={()=>setIdKycForParticular(kycForParticularUser?.id)}
                                                        >
                                                            Détails
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                ):("")}

                                {oneKycRequest?.quizFatcaAccept == 1 ? (
                                <div className='col-lg-3 col-md-3'>
                                    <div className='currency-selection text-center'>
                                        <div className="mt-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                                            <div className='cryptocurrency-slides'>
                                                <div className='single-cryptocurrency-box'>
                                                    <div className='title text-center '>
                                                        <p className=" py-0 "> Questionnaire Fatca </p>
                                                        <p className=" py-0 ">{kycForParticularUser?.validQuizFatca==1 ? ( <Icon icon="bx:chevron-down-circle" width={30} color="#208454" /> ) : ( <Icon icon="bx:x-circle" width={30} color="#dc3545" />)}</p>
                                                    </div>
                                                            
                                                    <div className='btn-box ' onClick={()=>setEtape(6)}>
                                                        <Button
                                                            block
                                                            color="primary"
                                                            type="button"
                                                            onClick={()=>setIdKycForParticular(kycForParticularUser?.id)}
                                                        >
                                                            Détails
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                ):("")}

                                {oneKycRequest?.identityAccept == 1 ? (
                                <div className='col-lg-3 col-md-3'>
                                    <div className='currency-selection text-center'>
                                        <div className="mt-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                                            <div className='cryptocurrency-slides'>
                                                <div className='single-cryptocurrency-box'>
                                                    <div className='title text-center '>
                                                        <p className=" py-0 "> Justificatif d'identité </p>
                                                        <p className=" py-0 ">{kycForParticularUser?.validIdentityOne==1 && kycForParticularUser?.validIdentity==1 ? ( <Icon icon="bx:chevron-down-circle" width={30} color="#208454" /> ) : ( <Icon icon="bx:x-circle" width={30} color="#dc3545" />)}</p>
                                                    </div>
                                                            
                                                    <div className='btn-box ' onClick={()=>setEtape(2)}>
                                                        <Button
                                                            block
                                                            color="primary"
                                                            type="button"
                                                            onClick={()=>setIdKycForParticular(kycForParticularUser?.id)}
                                                        >
                                                            Détails
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                ):("")}

                                {oneKycRequest?.residenceAccept == 1 ? (
                                <div className='col-lg-3 col-md-3'>
                                    <div className='currency-selection text-center'>
                                        <div className="mt-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                                            <div className='cryptocurrency-slides'>
                                                <div className='single-cryptocurrency-box'>
                                                    <div className='title text-center '>
                                                        <p className=" py-0 "> Justificatif de domicile </p>
                                                        <p className=" py-0 ">{kycForParticularUser?.validResidence==1 && kycForParticularUser?.validPhotoWithDocument==1 ? ( <Icon icon="bx:chevron-down-circle" width={30} color="#208454" /> ) : ( <Icon icon="bx:x-circle" width={30} color="#dc3545" />)}</p>
                                                    </div>
                                                            
                                                    <div className='btn-box ' onClick={()=>setEtape(3)}>
                                                        <Button
                                                            block
                                                            color="primary"
                                                            type="button"
                                                            onClick={()=>setIdKycForParticular(kycForParticularUser?.id)}
                                                        >
                                                            Détails
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                ):("")}

                                {oneKycRequest?.photoAccept == 1 ? (
                                <div className='col-lg-3 col-md-3'>
                                    <div className='currency-selection text-center'>
                                        <div className="mt-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                                            <div className='cryptocurrency-slides'>
                                                <div className='single-cryptocurrency-box'>
                                                    <div className='title text-center '>
                                                        <p className=" py-0 "> Photo </p>
                                                        <p className=" py-0 ">{kycForParticularUser?.validPhoto==1 ? ( <Icon icon="bx:chevron-down-circle" width={30} color="#208454" /> ) : ( <Icon icon="bx:x-circle" width={30} color="#dc3545" />)}</p>
                                                    </div>
                                                            
                                                    <div className='btn-box ' onClick={()=>setEtape(4)}>
                                                        <Button
                                                            block
                                                            color="primary"
                                                            type="button"
                                                            onClick={()=>setIdKycForParticular(kycForParticularUser?.id)}
                                                        >
                                                            Détails
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                ):("")}

                                {oneKycRequest?.signatureAccept == 1 ? (
                                <div className='col-lg-3 col-md-3'>
                                    <div className='currency-selection text-center'>
                                        <div className="mt-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                                            <div className='cryptocurrency-slides'>
                                                <div className='single-cryptocurrency-box'>
                                                    <div className='title text-center '>
                                                        <p className=" py-0 "> Signature </p>
                                                        <p className=" py-0 ">{kycForParticularUser?.validSignature==1 ? ( <Icon icon="bx:chevron-down-circle" width={30} color="#208454" /> ) : ( <Icon icon="bx:x-circle" width={30} color="#dc3545" />)}</p>
                                                    </div>
                                                            
                                                    <div className='btn-box ' onClick={()=>setEtape(5)}>
                                                        <Button
                                                            block
                                                            color="primary"
                                                            type="button"
                                                            onClick={()=>setIdKycForParticular(kycForParticularUser?.id)}
                                                        >
                                                            Détails
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                ):("")}
                                <div className='col-lg-3 col-md-3'>
                                    <div className='currency-selection text-center'>
                                        <div className="mt-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                                            <div className='cryptocurrency-slides'>
                                                <div className='single-cryptocurrency-box'>
                                                    <div className='title text-center mb-5'>
                                                        <p className=" py-0 my-2">{kycForParticularUser?.validationKycDate && kycForParticularUser?.validQuiz==1 && kycForParticularUser?.validQuizTwo==1 && kycForParticularUser?.validQuizFatca==1 && kycForParticularUser?.validIdentityOne==1 && kycForParticularUser?.validPhotoWithDocument && kycForParticularUser?.validIdentity==1 && kycForParticularUser?.validResidence==1 && kycForParticularUser?.validPhoto==1 && kycForParticularUser?.validSignature==1 ? (<b className='colorGreen'>Valider</b>):(<b className='colorRed'>En cours</b>)}</p>
                                                        <p className=" py-0 my-3">{kycForParticularUser?.validationKycDate?formatDate(kycForParticularUser?.validationKycDate):"Pas encore corrigé"}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                

                            </div>

                            

                            {/* AFFICHAGE DES INFORMATIONS DE KYC */}
                            <div className=''>
                                {/* Les questionnaires */}
                                {etape===1 ? (
                                    <>
                                        <div className='py-10'>
                                            <h3 className='text-center'>Les questionnaires</h3>
                                        </div>
                                        <div className='row'>
                                            <div className="col-lg-6 col-md-6">
                                                <h4 className='mx-5'><b>La partie 1</b></h4>
                                                <div className='mx-5 '>
                                                    <div className=''>
                                                        <b>1) Les dépenses récurrentes :</b><br/>
                                                        {oneKycForParticular?.spentA? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForParticular.spentA }</p>): ("")}
                                                        {oneKycForParticular?.spentB? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForParticular.spentB }</p>): ("")}
                                                        {oneKycForParticular?.spentC? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForParticular.spentC }</p>): ("")}
                                                        {oneKycForParticular?.spentD? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForParticular.spentD }</p>): ("")}
                                                        {oneKycForParticular?.spentE? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForParticular.spentE }</p>): ("")}
                                                        {oneKycForParticular?.spentF? (<p className='mb-1'><Icon icon="bx:check-double" color="#208454" />{oneKycForParticular.spentF }</p>): ("")}

                                                        {!oneKycForParticular?.spentA && !oneKycForParticular?.spentB && !oneKycForParticular?.spentC && !oneKycForParticular?.spentD && !oneKycForParticular?.spentE && !oneKycForParticular?.spentF ? (<p className='my-1'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>): ("")}
                                                    </div>

                                                    <div className='mx-10 '>
                                                        <b>2) La ou les fréquences de revenus :</b><br/>
                                                        {oneKycForParticular?.frequencyA? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForParticular.frequencyA}</p>): ("")}
                                                        {oneKycForParticular?.frequencyB? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForParticular.frequencyB}</p>): ("")}
                                                        {oneKycForParticular?.frequencyC? (<p className='mb-2'><Icon icon="bx:check-double" color="#208454" />{oneKycForParticular.frequencyC}</p>): ("")}
                                                        

                                                        {!oneKycForParticular?.frequencyA && !oneKycForParticular?.frequencyB && !oneKycForParticular?.frequencyC ? (<p className='mt-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>): ("")}
                                                    </div>

                                                   
                                                    
                                                </div>
                                            </div>


                                            {/* PARTIE QUESTIONNAIRE 2 */}
                                            <div className="col-lg-6 col-md-6">
                                                <h4 className='mx-5'><b>La partie 2</b></h4>
                                                <div className='mx-5 '>
                                                    <div className=''>
                                                        <b> L'estimation de vos revenus mensuels en CFA :</b><br/>
                                                        {oneKycForParticular?.incomeMonthly? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForParticular.incomeMonthly }</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                    </div>

                                                    <div className='mx-10 '>
                                                        <b>L'estimation de vos revenus annuels en CFA :</b><br/>
                                                        {oneKycForParticular?.annualIncome? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForParticular.annualIncome }</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                    </div>

                                                    <div className='mx-10 '>
                                                        <b>Source des revenus</b><br/>
                                                        {oneKycForParticular?.sourceIncome? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForParticular.sourceIncome }</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                    </div>

                                                    {oneKycForParticular?.sourceIncome ? (
                                                        <>
                                                        
                                                            {oneKycForParticular?.sourceIncome==="Salaire" ? (
                                                                <>
                                                                    <b>Montant :</b><br/>
                                                                    {oneKycForParticular?.salaries? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForParticular.salaries } FCFA</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                                </>
                                                            ) : ("") }
                                                            

                                                            {oneKycForParticular?.sourceIncome==="Rentes" ? (
                                                                <>
                                                                    <b>Montant :</b><br/>
                                                                    {oneKycForParticular?.rents? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForParticular.rents } FCFA</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                                </>
                                                            ) : ("") }

                                                            {oneKycForParticular?.sourceIncome==="Recettes activités commerciales" ? (
                                                                <>
                                                                    <b>Montant :</b><br/>
                                                                    {oneKycForParticular?.businessReceipts? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForParticular.businessReceipts } FCFA</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                                </>
                                                            ) : ("") }

                                                            {oneKycForParticular?.allowances==="Indemnités" ? (
                                                                <>
                                                                    <b>Montant :</b><br/>
                                                                    {oneKycForParticular?.allowances? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForParticular.allowances } FCFA</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                                </>
                                                            ) : ("") }  
                                                        </>
                                                    ):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                    

                                                    <div className='mx-10 '>
                                                        <b> Avez-vous un compte bancaire ? :</b><br/>
                                                        {oneKycForParticular?.otherBankAccount? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForParticular.otherBankAccount }</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                    </div>

                                                    {/* si l'utilisateur a un compte bancaire on lui pose la question suivante */}
                                                    {oneKycForParticular?.otherBankAccount === "Oui"? (
                                                        <>
                                                            <b> Nature du ou des comptes :</b><br/>

                                                            {oneKycForParticular?.savingsAccount? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForParticular.savingsAccount }</p>): ("")}
                                                            {oneKycForParticular?.currentAccount? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForParticular.currentAccount }</p>): ("")}
                                                            {oneKycForParticular?.titleAccount? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForParticular.titleAccount }</p>): ("")}
                                                        
                                                            {!oneKycForParticular?.savingsAccount && !oneKycForParticular?.currentAccount && !oneKycForParticular?.titleAccount ? (<p className='my-1'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>): ("")}

                                                        </>
                                                        
                                                    ):("")}
                                                    {/* fin */}
                                                    
                                                    {/* Si l'utilisateur a choisi compte d'épargne */}
                                                    {oneKycForParticular?.savingsAccount? (
                                                        <>
                                                         
                                                            <b>Pays de la banque de votre compte d'épargne existant :</b><br/>
                                                            {oneKycForParticular?.otherBankCountrySavings? (
                                                                <>
                                                                    {allCountry?.map((data) => (
                                                                        data?.code===oneKycForParticular?.otherBankCountrySavings?
                                                                        <p className='mt-0' key={data?.id}><Icon icon="bx:check-double" color="#208454" />
                                                                            {data?.libelle}
                                                                        </p>
                                                                        :''
                                                                    ))}
                                                                </>
                                                            ): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                            <b>Nom de la banque de votre compte d'épargne :</b><br/>
                                                            {oneKycForParticular?.otherBankNameSavings? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForParticular.otherBankNameSavings }</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                            
                                                            <b> Références de la banque de votre compte d'épargne :</b><br/>
                                                            {oneKycForParticular?.bankReferencesSavings? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForParticular.bankReferencesSavings }</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}

                                                        </>
                                                        
                                                    ):("")}
                                                    {/* fin */}


                                                    {/* Si l'utilisateur a choisi compte courant */}
                                                    {oneKycForParticular?.currentAccount? (
                                                        <>
                                                            <b> Pays de la banque de votre compte courant existant :</b><br/>
                                                            {oneKycForParticular?.otherBankCountryCurrent? (
                                                                <>
                                                                    {allCountry?.map((data) => (
                                                                        data?.code===oneKycForParticular?.otherBankCountryCurrent?
                                                                        <p className='mt-0' key={data?.id}><Icon icon="bx:check-double" color="#208454" />
                                                                            {data?.libelle}
                                                                        </p>
                                                                        :''
                                                                    ))}
                                                                </>
                                                            ): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}

                                                            <b> Nom de la banque de votre compte courant :</b><br/>
                                                            {oneKycForParticular?.otherBankNameCurrent? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForParticular.otherBankNameCurrent }</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                            
                                                            <b> Références de la banque de votre compte courant :</b><br/>
                                                            {oneKycForParticular?.bankReferencesCurrent? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForParticular.bankReferencesCurrent }</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}

                                                        </>
                                                        
                                                    ):("")}
                                                    {/* fin */}

                                                    {/* Si l'utilisateur a choisi compte titre */}
                                                    {oneKycForParticular?.titleAccount? (
                                                        <>
                                                            
                                                            <b> Pays de la banque de votre compte titre existant :</b><br/>
                                                            {oneKycForParticular?.otherBankCountryTitle? (
                                                                <>
                                                                    {allCountry?.map((data) => (
                                                                        data?.code===oneKycForParticular?.otherBankCountryTitle?
                                                                        <p className='mt-0' key={data?.id}><Icon icon="bx:check-double" color="#208454" />
                                                                            {data?.libelle}
                                                                        </p>
                                                                        :''
                                                                    ))}
                                                                </>
                                                            ): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                            
                                                            <b> Nom de la banque de votre compte titre :</b><br/>
                                                            {oneKycForParticular?.otherBankNameTitle? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForParticular.otherBankNameTitle }</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                            
                                                            <b> Références de la banque de votre compte titre :</b><br/>
                                                            {oneKycForParticular?.bankReferencesTitle? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForParticular.bankReferencesTitle }</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}

                                                        </>
                                                        
                                                    ):("")}
                                                    {/* fin */}

                                                    {/* Partie mobile money */}
                                                    <div className='mx-10 '>
                                                        <b> Avez-vous un compte de monnaie électronique (Mobile money)? </b><br/>
                                                        {oneKycForParticular?.mobileAccount? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForParticular.mobileAccount }</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                    </div>

                                                    {oneKycForParticular?.mobileAccount==="Oui"? (
                                                        <>
                                                            <b> Pays de votre compte de la monnaie électronique existant :</b><br/>
                                                            {oneKycForParticular?.mobileCountry? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForParticular.mobileCountry }</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        
                                                            <b> Opérateur de votre compte de la monnaie électronique existant :</b><br/>
                                                            {oneKycForParticular?.operator? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForParticular.operator }</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        
                                                        </>
                                                    ) : ("") }
                                                    {/* Fin */}

                                                    
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ): ("")}

                                {/* Justificatif d'identité */}
                                {etape===2 ? (
                                    <>
                                        

                                        <div className='py-10 my-10'>
                                            <h3 className='text-center'>Justificatif d'identité partie 1</h3>
                                        </div><br/>

                                        
                                        <div className='row  justify-content-center  mx-5'>
                                            <div className='col-lg-6 col-md-6 '>
                                                <b> Civilité :</b><br/>
                                                {oneKycForParticular?.civility? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForParticular.civility }</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                            </div>

                                            <div className='col-lg-6 col-md-6'>
                                                <b> Votre nom :</b><br/>
                                                {currentUser?.lastName? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{currentUser.lastName }</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}

                                            </div>
                                            
                                            <div className='col-lg-6 col-md-6'>
                                                <b> Vos prénoms :</b><br/>
                                                {currentUser?.firstName? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{currentUser.firstName }</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}

                                            </div>

                                            <div className='col-lg-6 col-md-6'>
                                                <b> Nom et prénoms du père :</b><br/>
                                                {oneKycForParticular?.fatherName? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForParticular.fatherName }</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                            </div>

                                            <div className='col-lg-6 col-md-6'>
                                                <b> Nom et prénoms de la mère :</b><br/>
                                                {oneKycForParticular?.motherName? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForParticular.motherName }</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                            </div>

                                            <div className='col-lg-6 col-md-6'>
                                                <b> Situation familiale :</b><br/>
                                                {oneKycForParticular?.familyStatus? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForParticular.familyStatus }</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                            </div>

                                            <div className='col-lg-6 col-md-6'>
                                                <b> Langue :</b><br/>
                                                {oneKycForParticular?.language? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForParticular.language }</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                            </div>
                                            
                                            <div className='col-lg-6 col-md-6'>
                                                <b> Nationalité :</b><br/>
                                                {currentUser?.nationality? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{currentUser.nationality }</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                            </div>

                                            <div className='col-lg-6 col-md-6'>
                                                <b> Pays de Naissance :</b><br/>
                                                {oneCountry?.libelle? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{oneCountry?.libelle }</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                            </div>

                                            <div className='col-lg-6 col-md-6'>
                                                <b> Date de naissance :</b><br/>
                                                {currentUser?.birthday? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{formatDate(currentUser.birthday) }</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                            </div>
                                        </div>

                                        <div className='py-10 my-5'>
                                            <h3 className='text-center'>Justificatif d'identité partie 2</h3>
                                        </div><br/>

                                        <div className='row  justify-content-between  mx-5'>
                                            <div className='col-lg-6 col-md-6 '>
                                                <b> Type de justificatif d'identité :</b><br/>
                                                {oneKycForParticular?.receiptType? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForParticular.receiptType }</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                            </div>

                                            <div className='col-lg-6 col-md-6 '>
                                                <b> Numéro du justificatif d'identité :</b><br/>
                                                {oneKycForParticular?.pieceNumber? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForParticular.pieceNumber }</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                            </div>

                                            <div className='col-lg-6 col-md-6 '>
                                                <b> Date d'expiration :</b><br/>
                                                {oneKycForParticular?.validityDate? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{formatDate(oneKycForParticular.validityDate) }</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                            </div>
                                        </div>
                                        
                                        <div className=" row col-lg-12 col-md-12 justify-content-between">
                                            <div className='col-lg-6 col-md-6 text-center'>
                                                <h4 className='text-center'>Recto</h4>
                                                {oneKycForParticular?.frontReceiptPhoto? 
                                                        <img src={oneKycForParticular?.frontReceiptPhoto} className="" width={'400'} height={'400'} alt="Recto"/> : 
                                                        oneKycForParticular?.frontReceipt? (
                                                            <>
                                                                {/* Utilisation de la fonction isPdfLink pour vérifier si un lien est pour un fichier PDF */}
                                                                {isPdfLink(`${API_URL}/${oneKycForParticular?.frontReceipt}`) ? (
                                                                    <>
                                                                        <div className="hero-btn  text-center ">
                                                                            <a
                                                                                className="nav-link btn btn-blue nav-link btn btn-outline-green"
                                                                                role="button"
                                                                                data-toggle="dropdown"
                                                                                aria-haspopup="true"
                                                                                aria-expanded="false"
                                                                                href={`${API_URL}/${oneKycForParticular?.frontReceipt}`} 
                                                                                target="_blank"
                                                                            >
                                                                            <p className="gr-text-8 bgColorblue text-white mb-0">
                                                                                <Icon icon="bx:show-alt" width="50" />
                                                                                Veuillez cliquer ici pour voir le fichier
                                                                            </p>
                                                                            </a>
                                                                        </div>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <img src={`${API_URL}/${oneKycForParticular?.frontReceipt}`} className="" width={'400'} height={'400'} alt="Recto"/> :
                                                                    </>
                                                                )}
                                                            </>
                                                        ):"Pas de recto justificatif"
                                                }
                                                
                                            </div>

                                            <div className='col-lg-6 col-md-6 text-center'>
                                                <h4 className='text-center'>Verso</h4>
                                                {oneKycForParticular?.backReceiptPhoto? 
                                                    <img src={oneKycForParticular?.backReceiptPhoto} className="" width={'400'} height={'400'} alt="Verso"/> : 
                                                    oneKycForParticular?.backReceipt? 
                                                    (
                                                        <>
                                                        {/* Utilisation de la fonction isPdfLink pour vérifier si un lien est pour un fichier PDF */}
                                                        {isPdfLink(`${API_URL}/${oneKycForParticular?.frontReceipt}`) ? (
                                                            <>
                                                                <div className="hero-btn  text-center ">
                                                                    <a
                                                                        className="nav-link btn btn-blue nav-link btn btn-outline-green"
                                                                        role="button"
                                                                        data-toggle="dropdown"
                                                                        aria-haspopup="true"
                                                                        aria-expanded="false"
                                                                        href={`${API_URL}/${oneKycForParticular?.backReceipt}`} 
                                                                        target="_blank"
                                                                    >
                                                                    <p className="gr-text-8 bgColorblue text-white mb-0">
                                                                        <Icon icon="bx:show-alt" width="50" />
                                                                        Veuillez cliquer ici pour voir le fichier
                                                                    </p>
                                                                    </a>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <img src={`${API_URL}/${oneKycForParticular?.backReceipt}`} className="" width={'400'} height={'400'} alt="Verso"/> 
                                                            </>
                                                        )}
                                                    </>
                                                    ):"Pas de recto justificatif"
                                                }
                                            </div>
                                        </div>
                                        
                                        {/* PARTIE SELFIE AVEC LE DOCUMENT D'IDENTITE */}
                                        <br/><div className='py-10 my-10'>
                                            <h3 className='text-center'>Photo de l'utilisateur avec le document de justificatif d'identité</h3>
                                        </div>

                                        <div className="input-group flex-nowrap">
                                            <div className='col-lg-12 col-md-12 row justify-content-between'>
                                                <div className='input-group-alternative my-3 text-center'>
                                                    {oneKycForParticular?.selfieWithDocument? <img src={oneKycForParticular?.selfieWithDocument} alt="Selfie" /> : "Aucune photo avec document"}
                                                </div>
                                            </div>
                                        </div>
                                        {/* FIN */}
                                    </>
                                ): ("")}

                                {/* Justificatif de domicile */}
                                {etape===3 ? (
                                    <>
                                        <div className='py-10'>
                                            <h3 className='text-center'>Justificatif de domicile</h3>
                                        </div>
                                        <div className=" row justify-content-center my-5">
                                            <div className='col-lg-6 col-md-6 text-center'>
                                                <b> latitude :</b><br/>
                                                {oneKycForParticular?.latitude? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForParticular.latitude }</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                            </div>

                                            <div className='col-lg-6 col-md-6 text-center'>
                                                <b> Longitude :</b><br/>
                                                {oneKycForParticular?.longitude? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForParticular.longitude }</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                            </div>
                                        </div>

                                        <div className='py-10 mb-5'>
                                            <h3 className='text-center'>Les documents</h3>
                                        </div>
                                        <div className=" row col-lg-12 col-md-12 justify-content-between">
                                            <div className='col-lg-6 col-md-6 text-center'>
                                                <h4 className='text-center'>Recto</h4>
                                                {oneKycForParticular?.frontProofResidencePhoto? 
                                                    <img src={oneKycForParticular?.frontProofResidencePhoto} className="" width={'400'} height={'400'} alt="Recto"/> :
                                                    oneKycForParticular?.frontProofResidence? (
                                                        <>
                                                            {/* Utilisation de la fonction isPdfLink pour vérifier si un lien est pour un fichier PDF */}
                                                            {isPdfLink(`${API_URL}/${oneKycForParticular?.frontProofResidence}`) ? (
                                                                <>
                                                                    <div className="hero-btn  text-center ">
                                                                    <a
                                                                        className="nav-link btn btn-blue nav-link btn btn-outline-green"
                                                                        role="button"
                                                                        data-toggle="dropdown"
                                                                        aria-haspopup="true"
                                                                        aria-expanded="false"
                                                                        href={`${API_URL}/${oneKycForParticular?.frontProofResidence}`} 
                                                                        // download
                                                                        // onClick={handleShow}
                                                                        target="_blank"
                                                                    >
                                                                    <p className="gr-text-8 bgColorblue text-white mb-0">
                                                                        <Icon icon="bx:show-alt" width="50" />
                                                                        Veuillez cliquer ici pour voir le fichier
                                                                    </p>
                                                                    </a>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    {oneKycForParticular?.frontProofResidence? <img src={`${API_URL}/${oneKycForParticular?.frontProofResidence}`} className="" width={'400'} height={'400'} alt="Recto"/> : "Pas de recto justificatif"}
                                                                </>
                                                            )}
                                                        </>
                                                    ):"Pas de recto justificatif de domicile"
                                                }
                                            </div>

                                            <div className='col-lg-6 col-md-6 text-center'>
                                                <h4 className='text-center'>Verso</h4>

                                                {oneKycForParticular?.frontProofResidencePhoto? 
                                                    <img src={oneKycForParticular?.frontProofResidencePhoto} className="" width={'400'} height={'400'} alt="Recto"/> :
                                                    oneKycForParticular?.frontProofResidence? (
                                                        <>
                                                            {/* Utilisation de la fonction isPdfLink pour vérifier si un lien est pour un fichier PDF */}
                                                            {isPdfLink(`${API_URL}/${oneKycForParticular?.backProofResidence}`) ? (
                                                                <>
                                                                    <div className="hero-btn  text-center ">
                                                                    <a
                                                                        className="nav-link btn btn-blue nav-link btn btn-outline-green"
                                                                        role="button"
                                                                        data-toggle="dropdown"
                                                                        aria-haspopup="true"
                                                                        aria-expanded="false"
                                                                        href={`${API_URL}/${oneKycForParticular?.backProofResidence}`}
                                                                        target="_blank"
                                                                    >
                                                                    <p className="gr-text-8 bgColorblue text-white mb-0">
                                                                        <Icon icon="bx:show-alt" width="50" />
                                                                        Veuillez cliquer ici pour voir le fichier
                                                                    </p>
                                                                    </a>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    {oneKycForParticular?.backProofResidence? <img src={`${API_URL}/${oneKycForParticular?.backProofResidence}`} width={'400'} height={'400'} alt="Verso"/> : "Pas de verso justificatif"}
                                                                </>
                                                            )}
                                                        </>
                                                            ):"Pas de verso de justificatif de domicile"
                                                    }
                                            </div>
                                        </div>
                                    </>
                                ): ("")}

                                {/* Photo de l'utilisateur */}
                                {etape===4 ? (
                                    <>
                                        <div className='py-10'>
                                            <h3 className='text-center'>Photo de l'utilisateur</h3>
                                        </div>
                                        <div className="input-group flex-nowrap">
                                            <div className='col-lg-12 col-md-12 row justify-content-between'>
                                                <div className='input-group-alternative my-3 text-center'>
                                                    {oneKycForParticular?.userPicture? <img src={oneKycForParticular?.userPicture} alt="Selfie" /> : "Aucune photo"}
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ): ("")}

                                {/* Signature de l'utilisateur */}
                                {etape===5 ? (
                                    <>
                                        <div className='py-10'>
                                            <h3 className='text-center'>Signature de l'utilisateur</h3>
                                        </div>
                                        <div className="input-group flex-nowrap">
                                            <div className='col-lg-12 col-md-12 row justify-content-between'>
                                                <div className='input-group-alternative my-3 text-center'>
                                                    {oneKycForParticular?.userSignature? <img src={oneKycForParticular?.userSignature} alt="Selfie" /> : "Aucune signature"}
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ): ("")}


                                {/* Questionnaires Fatca */}
                                {etape===6 ? (
                                    <>
                                        <div className='py-10'>
                                            <h3 className='text-center'>Les questionnaires ID & FATCA</h3>
                                        </div>
                                        <div className='row'>
                                            {/* PARTIE QUESTIONNAIRE 2 */}
                                            {/* <div className=""> */}
                                                    <div className='mx-10 col-lg-6 col-md-6'>
                                                        <b> Etes-vous une "US PERSON"? (Citoyenneté Américaine (Passeport américain) / Résidence aux USA /Présence significative ou permanente (green card) / Lieu de naissance aux USA) :</b><br/>
                                                        {oneKycForParticular?.usPerson? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForParticular.usPerson}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                    </div>

                                                    <div className='mx-10 col-lg-6 col-md-6'>
                                                        <b>Adresse ou boîte postale :</b><br/>
                                                        {oneKycForParticular?.mailbox? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForParticular.mailbox }</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                    </div>
                                                    <div className='mx-10 col-lg-6 col-md-6'>
                                                        <b> Statut professionnel :</b><br/>
                                                        {oneKycForParticular?.professionStatus? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForParticular.professionStatus }</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                    </div>

                                                    {/* Si le Statut professionnel est salarié */}
                                                    {oneKycForParticular?.professionStatus === "Salarié" ? (
                                                        <>
                                                            <div className='mx-10 col-lg-6 col-md-6'>
                                                                <b> Nom de l'employeur :</b><br/>
                                                                {oneKycForParticular?.employerCorporate? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForParticular.employerCorporate }</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                            </div>

                                                            <div className='mx-10 col-lg-6 col-md-6'>
                                                                <b> Adresse de l'employeur :</b><br/>
                                                                {oneKycForParticular?.employerAddress? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForParticular.employerAddress }</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                            </div>
                                                        </>
                                                    ) : ("")}
                                                    <div className='mx-10 col-lg-6 col-md-6'>
                                                        <b> Profession/fonction/activité :</b><br/>
                                                        {oneKycForParticular?.profession? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForParticular.profession }</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                    </div>
                                                    {/* Fin */}
                                                    
                                                    {/* PARTIE MOTIVATION */}
                                                    <div className='mx-10 col-lg-6 col-md-6'>
                                                        <b> Motivation de l’ouverture de compte :</b><br/>
                                                        {oneKycForParticular?.motivation? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForParticular.motivation }</p>): ("")}
                                                        {oneKycForParticular?.motivationA? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForParticular.motivationA }</p>): ("")}
                                                        {oneKycForParticular?.motivationB? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForParticular.motivationB }</p>): ("")}
                                                        {oneKycForParticular?.motivationC? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForParticular.motivationC }</p>): ("")}
                                                        {oneKycForParticular?.motivationD? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForParticular.motivationD }</p>): ("")}
                                                        
                                                        {!oneKycForParticular?.motivation && !oneKycForParticular?.motivationA && !oneKycForParticular?.motivationB && !oneKycForParticular?.motivationC ? (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>): ("")}
                                                    
                                                    </div>
                                                    {/* FIN PARTIE MOTIVATION */}

                                                    <div className='mx-10 col-lg-6 col-md-6'>
                                                        <b> Bénéficiez-vous d’un mandat d’administrateur dans le Conseil d’Administration d’une société ?</b><br/>
                                                        {oneKycForParticular?.directorship? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForParticular.directorship }</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                    </div>
                                                    {/* Si l'utilisateur bénéficie d’un mandat d’administrateur */}
                                                    {oneKycForParticular?.directorship==="Oui"? (
                                                        <div className='mx-10 col-lg-6 col-md-6'>
                                                            <b> La (les)quelle(s) :</b><br/>
                                                            {oneKycForParticular?.whatBoard? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForParticular.whatBoard }</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </div>
                                                    ) : ("")}
                                                    

                                                    <div className='mx-10 col-lg-6 col-md-6'>
                                                        <b> Etes-vous actionnaire, fondateur ou co-fondateur d'une société ?</b><br/>
                                                        {oneKycForParticular?.shareholder? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForParticular.shareholder }</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                    </div>
                                                    
                                                    {oneKycForParticular?.shareholder === "Oui" ? (
                                                    <div className='mx-10 col-lg-6 col-md-6'>
                                                        <b> La (les)quelle(s) :</b><br/>
                                                        {oneKycForParticular?.whatHareholder? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForParticular.whatHareholder }</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                    </div>
                                                    ) : ("")}

                                                {/* </div> */}
                                            {/* </div> */}
                                        </div>
                                    </>
                                ): ("")}


                                {/* KYC PARTICULIER CLASSIFICATION */}
                                {etape===7 ? (
                                    <>
                                        <div className='mt-15' >
                                            <div className=' mx-15'>
                                                <div className='py-10'>
                                                <br/><br/><h1 className='text-center '>Classification</h1>
                                                </div>
                                            </div>

                                            {/* Les cards */}
                                            <div className='row'>
                                                <div className='col-lg-3 col-md-12'></div>
                                                    <div className='m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white cryptocurrency-search-box login-form col-lg-6 col-md-12'>
                                                        <form className='' onSubmit={addClassification} >
                                                        {/* <form className='' onSubmit={updateQuestionnaireFatca}> */}
                                                            
                                                            <label
                                                                htmlFor="usPerson"
                                                                className="text-blackish-blue mb-2"
                                                            >
                                                                Classification du client en risque élevé si le client remplit au moins une des conditions ci-dessous :
                                                            </label>
                                                            
                                                            <input
                                                                type='text'
                                                                className='form-control'
                                                                defaultValue={idKycForParticular} 
                                                                onChange={(event)=>setKycParticularId(event.target.value)}
                                                            />
                                                            <div className="form-group mb-6 mt-3">

                                                                <label
                                                                    htmlFor="classificationRisk"
                                                                    className="text-blackish-blue mb-2"
                                                                >
                                                                    S’agit-il d’une personnalité politiquement exposée et active ou un de ses proches ?
                                                                </label>
                                                                <select 
                                                                className="form-control"
                                                                id="classificationRisk"
                                                                required
                                                                defaultValue={classificationRisk} 
                                                                onChange={(event)=>setClassificationRisk(event.target.value)}
                                                                >
                                                                <option defaultValue="">Choisissez</option>
                                                                    <optgroup className='single-cryptocurrency-box'>
                                                                    <option  value="Oui">Oui</option>
                                                                    <option  value="Non">Non</option>
                                                                    </optgroup>
                                                                </select>
                                                            </div >

                                                            <div className="form-group mb-6 mt-3">

                                                                <label
                                                                    htmlFor="sourcesDiverse"
                                                                    className="text-blackish-blue mb-2"
                                                                >
                                                                    S’agit-il d’une personne dont les sources de revenus sont multiples et diverses ?
                                                                </label>
                                                                <select 
                                                                className="form-control"
                                                                id="sourcesDiverse"
                                                                required
                                                                defaultValue={sourcesDiverse} 
                                                                onChange={(event)=>setSourcesDiverse(event.target.value)}
                                                                >
                                                                <option defaultValue="">Choisissez</option>
                                                                    <optgroup className='single-cryptocurrency-box'>
                                                                    <option  value="Oui">Oui</option>
                                                                    <option  value="Non">Non</option>
                                                                    </optgroup>
                                                                </select>
                                                            </div >
                                                            
                                                            <div className="form-group mb-6 mt-3">

                                                                <label
                                                                    htmlFor="highRisk"
                                                                    className="text-blackish-blue mb-2"
                                                                >
                                                                    S’agit-il d’une personne exerçant une activité à risque élevé (conf procédure) ?
                                                                </label>
                                                                <select 
                                                                className="form-control"
                                                                id="highRisk"
                                                                required
                                                                defaultValue={highRisk} 
                                                                onChange={(event)=>setHighRisk(event.target.value)}
                                                                >
                                                                <option defaultValue="">Choisissez</option>
                                                                    <optgroup className='single-cryptocurrency-box'>
                                                                    <option  value="Oui">Oui</option>
                                                                    <option  value="Non">Non</option>
                                                                    </optgroup>
                                                                </select>
                                                            </div >

                                                            <div className="form-group mb-6 mt-3">

                                                                <label
                                                                    htmlFor="anotherHighRisk"
                                                                    className="text-blackish-blue mb-2"
                                                                >
                                                                    Existe-il une autre raison de classer le client en risque élevé ?
                                                                </label>
                                                                <select 
                                                                className="form-control"
                                                                id="anotherHighRisk"
                                                                required
                                                                defaultValue={anotherHighRisk} 
                                                                onChange={(event)=>setAnotherHighRisk(event.target.value)}
                                                                >
                                                                <option defaultValue="">Choisissez</option>
                                                                    <optgroup className='single-cryptocurrency-box'>
                                                                    <option  value="Oui">Oui</option>
                                                                    <option  value="Non">Non</option>
                                                                    </optgroup>
                                                                </select>
                                                            </div >

                                                            {/* Si oui il une autre raison */}
                                                            <div className="form-group mb-6 mt-3">
                                                                <label
                                                                    htmlFor="whichOne"
                                                                    className="text-blackish-blue mb-2"
                                                                >
                                                                
                                                                Laquelle ?
                                                                </label>
                                                                <div className='form-group mt-3'>
                                                                    <input
                                                                        type='text'
                                                                        id='whichOne'
                                                                        className='form-control'
                                                                        defaultValue={whichOne} 
                                                                        onChange={(event)=>setWhichOne(event.target.value)}
                                                                    />
                                                                </div>
                                                            </div >
                                                            {/* Fin si oui */}

                                                            <div className="form-group mb-6 mt-3">

                                                                <label
                                                                    htmlFor="levelRisk"
                                                                    className="text-blackish-blue mb-2"
                                                                >
                                                                    Niveau de risque attribué au client
                                                                </label>
                                                                <select 
                                                                className="form-control"
                                                                id="levelRisk"
                                                                required
                                                                defaultValue={levelRisk} 
                                                                onChange={(event)=>setLevelRisk (event.target.value)}
                                                                >
                                                                <option defaultValue="">Choisissez</option>
                                                                    <optgroup className='single-cryptocurrency-box'>
                                                                        <option  value="Réduit">Réduit</option>
                                                                        <option  value="Elevé">Elevé</option>
                                                                    </optgroup>
                                                                </select>
                                                            </div >

                                                            <div className="form-group mb-6 mt-3">
                                                                <label
                                                                    htmlFor="levelRiskRevision"
                                                                    className="text-blackish-blue mb-2"
                                                                >
                                                                    Niveau de risque en cas de révision
                                                                </label>
                                                                <div className='form-group mt-3'>
                                                                    <input
                                                                        type='text'
                                                                        id='levelRiskRevision'
                                                                        className='form-control'
                                                                        defaultValue={levelRiskRevision} 
                                                                        onChange={(event)=>setLevelRiskRevision(event.target.value)}
                                                                    />
                                                                </div>
                                                            </div >
                                                            <div className="form-group mb-6 mt-3">
                                                                <label
                                                                    htmlFor="profileLevel"
                                                                    className="text-blackish-blue mb-2"
                                                                >
                                                                    Niveau de profil attribué au client
                                                                </label>
                                                                <select 
                                                                className="form-control"
                                                                id="profileLevel"
                                                                required
                                                                defaultValue={profileLevel} 
                                                                onChange={(event)=>setProfileLevel (event.target.value)}
                                                                >
                                                                <option defaultValue="">Choisissez</option>
                                                                    <optgroup className='single-cryptocurrency-box'>
                                                                        <option  value="Réduit">Réduit</option>
                                                                        <option  value="Elevé">Elevé</option>
                                                                    </optgroup>
                                                                </select>
                                                            </div >

                                                            <div className="form-group mb-6">
                                                                <label
                                                                    htmlFor="comment"
                                                                    className="text-blackish-blue mb-2"
                                                                >
                                                                    Commentaire
                                                                </label>
                                                                <textarea
                                                                    className="form-control gr-text-11 border mt-3 bg-white"
                                                                    type="text"
                                                                    id="comment"
                                                                    placeholder="commentaire ici"
                                                                    defaultValue={comment} 
                                                                    onChange={(event)=>setComment(event.target.value)}
                                                                />
                                                            </div>

                                                            <button className="btn btn-primary " type='submit' disabled={isLoggingIn} > Suivant </button>
                                                        </form>       
                                                    </div>
                                                <div className='col-lg-3 col-md-12'></div>
                                            </div>
                                        </div>
                                    </>
                                ) : ("")}
                                {/* FIN PARTICULIER CLASSIFICATION */}

                            
                            </div>

                        </div>
                    </div>
                    {/* <div className='col-lg-1 col-md-1'></div> */}
                </div>
            </div>
        </div>
    </>
  );
};

export default ShowKycParticular;
