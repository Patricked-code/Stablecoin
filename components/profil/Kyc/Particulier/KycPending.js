import { useState, useEffect } from 'react';
import { Container, Row, Col, Modal } from "react-bootstrap";

import React from "react";
import axios from 'axios';
import Link from 'next/link';
import moment from 'moment';
import { Icon } from '@iconify/react';
import { Table } from '@nextui-org/react';


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

const KycPendingParticular = () => {
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

    // states du formulaire de validation
    const [validQuiz, setValidQuiz] = useState();
    const [validIdentity, setValidIdentity] = useState();
    const [validResidence, setValidResidence] = useState();
    const [validPhoto, setValidPhoto] = useState();
    const [validSignature, setValidSignature] = useState();
    const [pattern, setPattern] = useState();

    const [updateKycStatut, setUpdateKycStatut] = useState("0"); 



    

    
    


    


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

            const getKycForUserParticular = async () => {
            const resKyc = await fetch(`${API_URL}/api/kyc/particular/find-kyc-particular-for-user`, {
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
            await getKycForUserParticular();
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
            getOneKycForParticular(idKycForParticular);
    }
   
    // FIN

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

  return (
    <>

        <div className='' >
            <div className=' mx-15'>
                <div className='py-10'>
                    <h1 className='text-center'>Résultat de la validation de Kyc</h1>
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
                    {/* <div className='col-lg-1 col-md-1'></div> */}
                    <div className='col-lg-12 col-md-12'>
                        <div className='currency-selection'>
                            <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                                <div className='col-lg-12 col-md-12 row justify-content-between'>
                                    {/* {!kycForParticularUser?.length==0 ?( */}
                                        <Table
                                            aria-label="Example table with static content"
                                            css={{
                                                height: "auto",
                                                minWidth: "100%",
                                            }}
                                        >
                                        <Table.Header>
                                            {/* <Table.Column><p className="gr-text-8 pt-3 pb-0 mx-3 ">Nom & prenom </p></Table.Column> */}
                                            <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Questionnaires</p></Table.Column>
                                            <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Identité</p></Table.Column>
                                            <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Domicile</p></Table.Column>
                                            <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Photo</p></Table.Column>
                                            <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Signature</p></Table.Column>
                                            <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Statut</p></Table.Column>
                                            <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Date</p></Table.Column>
                                            <Table.Column><p className="gr-text-8 pt-3 pb-0 text-center">Actions</p></Table.Column>
                                        </Table.Header>
                                            <Table.Body>
                                                    <Table.Row >                       
                                                        {/* <Table.Cell ><p className=" py-0 ">Koné Arouna</p></Table.Cell> */}
                                                        
                                                        <Table.Cell ><p className=" py-0 " onClick={()=>setEtape(1)}><button className='bgColorblue text-white' onClick={()=>setIdKycForParticular(kycForParticularUser?.id)}>Voir détails</button> {kycForParticularUser?.validQuiz==1 ? ( <Icon icon="bx:chevron-down-circle" width={30} color="#208454" /> ) : ( <Icon icon="bx:x-circle" width={30} color="#dc3545" />)} </p></Table.Cell>
                                                        <Table.Cell ><p className=" py-0 " onClick={()=>setEtape(2)}><button className='bgColorblue text-white' onClick={()=>setIdKycForParticular(kycForParticularUser?.id)}>Voir détails</button> {kycForParticularUser?.validIdentity==1 ? ( <Icon icon="bx:chevron-down-circle" width={30} color="#208454" /> ) : (  <Icon icon="bx:x-circle" width={30} color="#dc3545" />)} </p></Table.Cell>
                                                        <Table.Cell ><p className=" py-0 " onClick={()=>setEtape(3)}><button className='bgColorblue text-white' onClick={()=>setIdKycForParticular(kycForParticularUser?.id)}>Voir détails</button> {kycForParticularUser?.validResidence==1 ? ( <Icon icon="bx:chevron-down-circle" width={30} color="#208454" /> ) : (  <Icon icon="bx:x-circle" width={30} color="#dc3545" />)} </p></Table.Cell>
                                                        <Table.Cell ><p className=" py-0 " onClick={()=>setEtape(4)}><button className='bgColorblue text-white' onClick={()=>setIdKycForParticular(kycForParticularUser?.id)}>Voir détails</button> {kycForParticularUser?.validPhoto==1 ? ( <Icon icon="bx:chevron-down-circle" width={30} color="#208454" /> ) : (  <Icon icon="bx:x-circle" width={30} color="#dc3545" />)} </p></Table.Cell>
                                                        <Table.Cell ><p className=" py-0 " onClick={()=>setEtape(5)}><button className='bgColorblue text-white' onClick={()=>setIdKycForParticular(kycForParticularUser?.id)}>Voir détails</button> {kycForParticularUser?.validSignature==1 ? ( <Icon icon="bx:chevron-down-circle" width={30} color="#208454" /> ) : (  <Icon icon="bx:x-circle" width={30} color="#dc3545" />)} </p></Table.Cell>
                                                        <Table.Cell ><p className=" py-0 ">{kycForParticularUser?.validQuiz==1 && kycForParticularUser?.validIdentity==1 && kycForParticularUser?.validResidence==1 && kycForParticularUser?.validPhoto==1 && kycForParticularUser?.validSignature==1 ? (<b className='colorGreen'>Valider</b>):(<b className='colorRed'>En cours</b>)}</p></Table.Cell>
                                                        <Table.Cell ><p className=" py-0 ">{formatDate(kycForParticularUser?.updateAt)}</p></Table.Cell>
                                                        <Table.Cell>
                                                            <div className="d-flex py-0 ">
                                                                <p className="text-center">
                                                                                            
                                                                    <Button type='button' onClick={()=>setIdKycForParticular(kycForParticularUser?.id)}  color='success' className=''>
                                                                        <div onClick={handleShowEvaluer}>
                                                                            Résultat <Icon icon="bx:chevron-down-circle"  width="30"/>
                                                                        </div>          
                                                                    </Button>
                                                                </p>
                                                            </div>
                                                        </Table.Cell>
                                                    </Table.Row >
                                            </Table.Body>
                                            {/* <Table.Pagination
                                                shadow
                                                noMargin
                                                align="center"
                                                rowsPerPage={5}
                                                onPageChange={(page) => console.log({ page })}
                                            /> */}
                                        </Table>
                                    {/* ):(
                                        <div className="text-center my-5">
                                            Aucun Kyc en attente
                                        </div>
                                    )} */}
                                </div>
                            {/* </form> */}
                            </div>
                            

                            {/* AFFICHAGE DES INFORMATIONS DE KYC */}
                            <div className=''>
                                {/* Les questionnaires */}
                                {etape===1 ? (
                                    <>
                                        <div className='py-10'>
                                            <h3 className='text-center'>Les questionnaires</h3>
                                        </div>
                                        <div className="input-group ">
                                        
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

                                                <div className=''>
                                                    <b>3) Dans le cadre que les revenus sont touchés :</b><br/>
                                                    {oneKycForParticular?.incomeTypeA? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForParticular.incomeTypeA}</p>): ("")}
                                                    {oneKycForParticular?.incomeTypeB? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForParticular.incomeTypeB}</p>): ("")}
                                                    {oneKycForParticular?.incomeTypeC? (<p className='mb-2'><Icon icon="bx:check-double" color="#208454" />{oneKycForParticular.incomeTypeC}</p>): ("")}
                                                    

                                                    {!oneKycForParticular?.incomeTypeA && !oneKycForParticular?.incomeTypeB && !oneKycForParticular?.incomeTypeC ? (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>): ("")}
                                                </div>
                                                
                                            </div>
                                        </div>
                                    </>
                                ): ("")}

                                {/* Justificatif d'identité */}
                                {etape===2 ? (
                                    <>
                                        <div className='py-10'>
                                            <h3 className='text-center'>Justificatif d'identité</h3>
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

                                    </>
                                ): ("")}

                                {/* Justificatif de domicile */}
                                {etape===3 ? (
                                    <>
                                        <div className='py-10'>
                                            <h3 className='text-center'>Justificatif de domicile</h3>
                                        </div>
                                        <div className=" row col-lg-12 col-md-12 justify-content-between">
                                            <div className='col-lg-6 col-md-6 text-center'>
                                                <h4 className='text-center'>Recto</h4>
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
                                                
                                            </div>

                                            <div className='col-lg-6 col-md-6 text-center'>
                                                <h4 className='text-center'>Verso</h4>
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
                            </div>

                        </div>
                    </div>
                    {/* <div className='col-lg-1 col-md-1'></div> */}
                </div>
            </div>
        </div>




         {/* ********************************************************************************** */}
            {/* MODAL DE LA VALIDATION DES DIFFERENTES PARTIES DE KYC'*/}
        {/* ********************************************************************************** */}
        <Modal show={showEvaluer} className="mt-15" onHide={handleCloseEvaluer}>
            <Modal.Header closeButton className='bgColorGreen'>
                <Modal.Title className="text-white" >Résultat de KYC</Modal.Title>                
            </Modal.Header>
                <Form role="form">
                    <Modal.Body>
                        <div className='row justify-content-between'>
                            {/* Les questionnaires */}
                            <div className='form-group my-3 col-lg-6 col-md-6'>
                                <label className="mx-2  mb-2" htmlFor='validQuiz'>
                                    Les questionnaires 
                                </label>
                                {!oneKycForParticular?.validQuiz==1 ? (
                                    <a href='/profil/kyc/particulier/' onClick={()=>setUpdateKycStatut("1")}>
                                        <Button  type='button'  color="primary" >
                                            Récompleter 
                                        </Button>
                                    </a>
                                ):(<p className='colorGreen mx-2'><b>Déjà validé</b></p>)}
                            </div>

                            {/* Justificatif d'identité */}
                            <div className='form-group my-3 col-lg-6 col-md-6'>
                                <label className="mx-2  mb-2" htmlFor='validIdentity'>
                                    Justificatif d'identité
                                </label>
                                {!oneKycForParticular?.validIdentity==1 ? (
                                    <a href='/profil/kyc/particulier/seconde-phase/' onClick={()=>setUpdateKycStatut("1")}>
                                        <Button  type='button'  color="primary" >
                                            Récompleter 
                                        </Button>
                                    </a>
                                ):(<p className='colorGreen mx-2'><b>Déjà validé</b></p>)}

                            </div>

                            {/* Justificatif de domicile */}
                            <div className='form-group my-3 col-lg-6 col-md-6'>
                                <label className="mx-2  mb-2" htmlFor='validResidence'>
                                    Justificatif de domicile
                                </label>
                                {!oneKycForParticular?.validResidence==1 ? (
                                    <a href='/profil/kyc/particulier/justificatif-domicile/' onClick={()=>setUpdateKycStatut("1")}>
                                        <Button  type='button'  color="primary" >
                                            Récompleter 
                                        </Button>
                                    </a>
                                ):(<p className='colorGreen mx-2'><b>Déjà validé</b></p>)}

                            </div>

                            {/* Photo de l'utilisateur */}
                            <div className='form-group my-3 col-lg-6 col-md-6'>
                                <label className="mx-2  mb-2" htmlFor='validPhoto'>
                                    Photo de l'utilisateur
                                </label>
                                {!oneKycForParticular?.validPhoto==1 ? ( 
                                    <a href='/profil/kyc/commun/selfie/' onClick={()=>setUpdateKycStatut("1")}>
                                        <Button  type='button'   color="primary" >
                                            Récompleter 
                                        </Button>
                                    </a>
                                ):(<p className='colorGreen mx-2'><b>Déjà validé</b></p>)}

                            </div>

                            {/* Signature de l'utilisateur */}
                            <div className='form-group my-3 col-lg-6 col-md-6'>
                                <label className="mx-2  mb-2" htmlFor='validSignature'>
                                    Signature de l'utilisateur
                                </label>
                                {!oneKycForParticular?.validSignature==1 ? (
                                    <a href='/profil/kyc/commun/signature/' onClick={()=>setUpdateKycStatut("1")}>
                                        <Button  type='button'  color="primary" >
                                            Récompleter 
                                        </Button>
                                    </a>
                                ):(<p className='colorGreen mx-2'><b>Déjà validé</b></p>)}

                            </div>
                        </div>
                       
                    </Modal.Body>
                    
                </Form>
        </Modal>
        {/* *****************************************FIN****************************************** */}
            




        {/* ********************************************************************************** */}
            {/* MODAL POUR VOIR DES DIFFERENTES PARTIES DE KYC'*/}
        {/* ********************************************************************************** */}
        <Modal show={showInfosKyc} className="mt-15" onHide={handleCloseInfosKyc}>
            <Modal.Header closeButton className='bgColorblue'>
                <Modal.Title className="text-white" >Voir infos de KYC</Modal.Title>                
            </Modal.Header>
            {etape===1 ? (
                <>
                    <Modal.Body>
                        <div className="input-group flex-nowrap">
                            <div className='col-lg-12 col-md-12 row justify-content-between'>
                                <div className='input-group-alternative my-3 '>
                                1) Voulez-vous confirmer le paiement 
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className="text-white" color="danger" onClick={handleCloseInfosKyc}>
                            Fermer
                        </Button>
                    </Modal.Footer>
                </>
            ): ("")}

            {etape===2 ? (
                <Form role="form">
                    <Modal.Body>
                            <div className="input-group flex-nowrap">
                                <div className='col-lg-12 col-md-12 row justify-content-between'>
                                    <div className='input-group-alternative my-3 '>
                                    1) Voulez-vous confirmer le paiement 
                                    </div>
                                    <div className='input-group-alternative my-3 '>
                                        1) Voulez-vous confirmer le paiement 
                                    </div>
                                </div>
                            </div>
                            <div className="form-group mb-6">
                            <textarea
                                className="form-control gr-text-11 border mt-3 bg-white"
                                type="text"
                                id="contenu"
                                placeholder="Raison sociale"
                                // defaultValue={socialRaison} 
                                // onChange={(event)=>setSocialRaison(event.target.value)}
                            />
                            </div>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button className="text-white" color="danger" onClick={handleCloseInfosKyc}>
                            Fermer
                        </Button>
                        <Button  type='button'  color="success"  disabled={isLoggingIn}>
                            Valider
                        </Button>
                    </Modal.Footer>
                </Form>
            ): ("")}

            {etape===3 ? (
                <Form role="form">
                    <Modal.Body>
                            <div className="input-group flex-nowrap">
                                <div className='col-lg-12 col-md-12 row justify-content-between'>
                                    <div className='input-group-alternative my-3 '>
                                    1) Voulez-vous confirmer le paiement 
                                    </div>
                                    <div className='input-group-alternative my-3 '>
                                        1) Voulez-vous confirmer le paiement 
                                    </div>
                                </div>
                            </div>
                            <div className="form-group mb-6">
                            <textarea
                                className="form-control gr-text-11 border mt-3 bg-white"
                                type="text"
                                id="contenu"
                                placeholder="Raison sociale"
                                // defaultValue={socialRaison} 
                                // onChange={(event)=>setSocialRaison(event.target.value)}
                            />
                            </div>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button className="text-white" color="danger" onClick={handleCloseInfosKyc}>
                            Fermer
                        </Button>
                        <Button  type='button'  color="success"  disabled={isLoggingIn}>
                            Valider
                        </Button>
                    </Modal.Footer>
                </Form>
            ): ("")}

            {etape===4 ? (
                <Form role="form">
                    <Modal.Body>
                            <div className="input-group flex-nowrap">
                                <div className='col-lg-12 col-md-12 row justify-content-between'>
                                    <div className='input-group-alternative my-3 '>
                                    1) Voulez-vous confirmer le paiement 
                                    </div>
                                    <div className='input-group-alternative my-3 '>
                                        1) Voulez-vous confirmer le paiement 
                                    </div>
                                </div>
                            </div>
                            <div className="form-group mb-6">
                            <textarea
                                className="form-control gr-text-11 border mt-3 bg-white"
                                type="text"
                                id="contenu"
                                placeholder="Raison sociale"
                                // defaultValue={socialRaison} 
                                // onChange={(event)=>setSocialRaison(event.target.value)}
                            />
                            </div>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button className="text-white" color="danger" onClick={handleCloseInfosKyc}>
                            Fermer
                        </Button>
                        <Button  type='button'  color="success"  disabled={isLoggingIn}>
                            Valider
                        </Button>
                    </Modal.Footer>
                </Form>
            ): ("")}

            {etape===5 ? (
                <Form role="form">
                    <Modal.Body>
                            <div className="input-group flex-nowrap">
                                <div className='col-lg-12 col-md-12 row justify-content-between'>
                                    <div className='input-group-alternative my-3 '>
                                    1) Voulez-vous confirmer le paiement 
                                    </div>
                                    <div className='input-group-alternative my-3 '>
                                        1) Voulez-vous confirmer le paiement 
                                    </div>
                                </div>
                            </div>
                            <div className="form-group mb-6">
                            <textarea
                                className="form-control gr-text-11 border mt-3 bg-white"
                                type="text"
                                id="contenu"
                                placeholder="Raison sociale"
                                // defaultValue={socialRaison} 
                                // onChange={(event)=>setSocialRaison(event.target.value)}
                            />
                            </div>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button className="text-white" color="danger" onClick={handleCloseInfosKyc}>
                            Fermer
                        </Button>
                        <Button  type='button'  color="success"  disabled={isLoggingIn}>
                            Valider
                        </Button>
                    </Modal.Footer>
                </Form>
            ): ("")}
        </Modal>
        {/* *****************************************FIN****************************************** */}
            




    </>
  );
};

export default KycPendingParticular;
