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
    // Modal,
    // Row,
    // Col,
  } from "reactstrap";

// FIN

const ValidEntreprise = () => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API


    const [currentUser, setCurrentUser] = useState();
    const [provider, setProvider] = useState(null);
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    // States de validationde Kyc
    const [etape, setEtape] = useState();



    const [allKycForEntreprise, setAllKycForEntreprise] = useState();
    const [oneKycForEntreprise, setOneKycForEntreprise] = useState();
    const [idKycForEntreprise, setIdKycForEntreprise] = useState();

    // states du formulaire de validation
    const [validQuiz, setValidQuiz] = useState();
    const [validLegalDocuments, setValidLegalDocuments] = useState();
    const [validIdentity, setValidIdentity] = useState();
    const [validResidence, setValidResidence] = useState();
    const [validPhoto, setValidPhoto] = useState();
    const [validSignature, setValidSignature] = useState();
    const [pattern, setPattern] = useState();

    


    
    


    


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

    
    // RECUPERER KYC DE L'ENTREPRISE
    useEffect(async() => {
    const token = localStorage.getItem('tokenEnCours')
    
        const getAllKycForEntreprise = async () => {
        const resKyc = await fetch(`${API_URL}/api/kyc/entreprise/find-all-kyc-entreprise`, {
            headers: {
            'Content-Type': 'application/json',
            Authorization:  `Bearer ${token}`,
            },
        })
            .then((resKyc) => resKyc.json())
            .then((data) => {
            setAllKycForEntreprise(data)
            }) 
        };
        // console.log("Banques =>",allBank)
        await getAllKycForEntreprise();
    }, []);
    // FIN


    // RECUPERER UNE SEULE LIGNE DE KYC DE L'ENTREPRISE
    if (idKycForEntreprise) {
        console.log("idKycForEntreprise=>",idKycForEntreprise)
        // return
        // useEffect(async() => {
            const getOneKycForEntreprise = async (_idKycForEntreprise) => {
            const resKyc = await fetch(`${API_URL}/api/kyc/entreprise/find-one-kyc-entreprise/${_idKycForEntreprise}`, {
                headers: {
                'Content-Type': 'application/json',
                },
            })
                .then((resKyc) => resKyc.json())
                .then((data) => {
                setOneKycForEntreprise(data)
                }) 
            };
            // console.log("Banques =>",allBank)
            getOneKycForEntreprise(idKycForEntreprise);
        // }, []);
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
                validLegalDocuments:validLegalDocuments,
                validIdentity:validIdentity,
                validResidence:validResidence,
                validPhoto:validPhoto,
                validSignature:validSignature,
                pattern:pattern
            }
            const token = localStorage.getItem('tokenEnCours') //Le token récuperé
    
            const result = await fetch(`${API_URL}/api/kyc/entreprise/valid-kyc/${idKycForEntreprise}`, {
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
                <div className=''>
                    <h1 className='text-center'>Validation de Kyc entreprise / commerçant</h1>
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
                                    {!allKycForEntreprise?.length==0 ?(
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
                                            <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Documents</p></Table.Column>
                                            <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Domicile</p></Table.Column>
                                            <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Identité</p></Table.Column>
                                            <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Photo</p></Table.Column>
                                            <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Signature</p></Table.Column>
                                            <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Statut</p></Table.Column>
                                            <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Date</p></Table.Column>
                                            <Table.Column><p className="gr-text-8 pt-3 pb-0 text-center">Actions</p></Table.Column>
                                        </Table.Header>
                                            <Table.Body>
                                                {allKycForEntreprise?.map((data) => (
                                                    <Table.Row key={data?.id}>                       
                                                        {/* <Table.Cell ><p className=" py-0 ">Koné Arouna</p></Table.Cell> */}
                                                        
                                                        <Table.Cell ><p className=" py-0 " onClick={()=>setEtape(1)}><button className='bgColorblue text-white' onClick={()=>setIdKycForEntreprise(data?.id)}>Voir détails</button> {data.validQuiz==1 ? ( <Icon icon="bx:chevron-down-circle" width={30} color="#208454" /> ) : ( <Icon icon="bx:x-circle" width={30} color="#dc3545" />)} </p></Table.Cell>
                                                        <Table.Cell ><p className=" py-0 " onClick={()=>setEtape(2)}><button className='bgColorblue text-white' onClick={()=>setIdKycForEntreprise(data?.id)}>Voir détails</button> {data.validLegalDocuments==1 ? ( <Icon icon="bx:chevron-down-circle" width={30} color="#208454" /> ) : (  <Icon icon="bx:x-circle" width={30} color="#dc3545" />)} </p></Table.Cell>
                                                        <Table.Cell ><p className=" py-0 " onClick={()=>setEtape(3)}><button className='bgColorblue text-white' onClick={()=>setIdKycForEntreprise(data?.id)}>Voir détails</button> {data.validResidence==1 ? ( <Icon icon="bx:chevron-down-circle" width={30} color="#208454" /> ) : (  <Icon icon="bx:x-circle" width={30} color="#dc3545" />)} </p></Table.Cell>
                                                        <Table.Cell ><p className=" py-0 " onClick={()=>setEtape(4)}><button className='bgColorblue text-white' onClick={()=>setIdKycForEntreprise(data?.id)}>Voir détails</button> {data.validIdentity==1 ? ( <Icon icon="bx:chevron-down-circle" width={30} color="#208454" /> ) : (  <Icon icon="bx:x-circle" width={30} color="#dc3545" />)} </p></Table.Cell>
                                                        <Table.Cell ><p className=" py-0 " onClick={()=>setEtape(5)}><button className='bgColorblue text-white' onClick={()=>setIdKycForEntreprise(data?.id)}>Voir détails</button> {data.validPhoto==1 ? ( <Icon icon="bx:chevron-down-circle" width={30} color="#208454" /> ) : (  <Icon icon="bx:x-circle" width={30} color="#dc3545" />)} </p></Table.Cell>
                                                        <Table.Cell ><p className=" py-0 " onClick={()=>setEtape(6)}><button className='bgColorblue text-white' onClick={()=>setIdKycForEntreprise(data?.id)}>Voir détails</button> {data.validSignature==1 ? ( <Icon icon="bx:chevron-down-circle" width={30} color="#208454" /> ) : (  <Icon icon="bx:x-circle" width={30} color="#dc3545" />)} </p></Table.Cell>
                                                        <Table.Cell ><p className=" py-0 ">{data.validQuiz==1 && data.validLegalDocuments==1 && data.validIdentity==1 && data.validResidence==1 && data.validPhoto==1 && data.validSignature==1 ? (<b className='colorGreen'>Valider</b>):(<b className='colorRed'>En cours</b>)}</p></Table.Cell>
                                                        <Table.Cell ><p className=" py-0 ">{formatDate(data?.createdAt)}</p></Table.Cell>
                                                        <Table.Cell>
                                                            <div className="d-flex py-0 ">
                                                                <p className="text-center">
                                                                                            
                                                                    <Button type='button' onClick={()=>setIdKycForEntreprise(data?.id)}  color='success' className=''>
                                                                        <div onClick={handleShowEvaluer}>
                                                                            Evaluer <Icon icon="bx:chevron-down-circle"  width="30"/>
                                                                        </div>          
                                                                    </Button>

                                                                    {/* <Button  color='danger' className='text-center mx-3 bg-red'>
                                                                        Annuler <Icon icon="bx:trash"  width="30"/> 
                                                                    </Button> */}
                                                                </p>
                                                            </div>
                                                        </Table.Cell>
                                                    </Table.Row >
                                                ))}
                                            </Table.Body>
                                            <Table.Pagination
                                                shadow
                                                noMargin
                                                align="center"
                                                rowsPerPage={5}
                                                onPageChange={(page) => console.log({ page })}
                                            />
                                        </Table>
                                    ):(
                                        <div className="text-center my-5">
                                            Aucun Kyc en attente
                                        </div>
                                    )}
                                </div>
                            {/* </form> */}
                            </div>
                            

                            {/* AFFICHAGE DES INFORMATIONS DE KYC */}
                            <div className=''>
                                {/* Les questionnaires */}
                                {etape===1 ? (
                                    <>
                                        <div className='my-5'>
                                            <h3 className='text-center'>Les questionnaires</h3>
                                        </div>
                                        <div className="input-group ">
                                        
                                            <div className='mx-5 '>
                                                <div className=''>
                                                    <b>1) Les dépenses récurrentes :</b><br/>
                                                    {oneKycForEntreprise?.spentA? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForEntreprise.spentA }</p>): ("")}
                                                    {oneKycForEntreprise?.spentB? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForEntreprise.spentB }</p>): ("")}
                                                    {oneKycForEntreprise?.spentC? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForEntreprise.spentC }</p>): ("")}
                                                    {oneKycForEntreprise?.spentD? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForEntreprise.spentD }</p>): ("")}
                                                    {oneKycForEntreprise?.spentE? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForEntreprise.spentE }</p>): ("")}
                                                    {/* {oneKycForEntreprise?.spentF? (<p className='mb-1'><Icon icon="bx:check-double" color="#208454" />{oneKycForEntreprise.spentF }</p>): ("")} */}

                                                    {!oneKycForEntreprise?.spentA && !oneKycForEntreprise?.spentB && !oneKycForEntreprise?.spentC && !oneKycForEntreprise?.spentD && !oneKycForEntreprise?.spentE ? (<p className='my-1'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>): ("")}
                                                </div>

                                                <div className='mx-10 '>
                                                    <b>2) Les opérations financières transfrontalières dans le cadre des activités de votre entreprise concernent  :</b><br/>
                                                    {oneKycForEntreprise?.operationA? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForEntreprise.operationA}</p>): ("")}
                                                    {oneKycForEntreprise?.operationB? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForEntreprise.operationB}</p>): ("")}
                                                    {oneKycForEntreprise?.operationC? (<p className='mb-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForEntreprise.operationC}</p>): ("")}
                                                    {oneKycForEntreprise?.operationD? (<p className='mb-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForEntreprise.operationD}</p>): ("")}
                                                    {oneKycForEntreprise?.operationE? (<p className='mb-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForEntreprise.operationE}</p>): ("")}
                                                    {oneKycForEntreprise?.operationF? (<p className='mb-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForEntreprise.operationF}</p>): ("")}
                                                    {oneKycForEntreprise?.operationG? (<p className='mb-2'><Icon icon="bx:check-double" color="#208454" />{oneKycForEntreprise.operationG}</p>): ("")}
                                                    

                                                    {!oneKycForEntreprise?.operationA && !oneKycForEntreprise?.operationB && !oneKycForEntreprise?.operationC && !oneKycForEntreprise?.operationD && !oneKycForEntreprise?.operationE && !oneKycForEntreprise?.operationF && !oneKycForEntreprise?.operationG ? (<p className='mt-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>): ("")}
                                                </div>

                                                <div className=''>
                                                    <b>3) Avez-vous une boutique en ligne ? :</b><br/>
                                                    {oneKycForEntreprise?.eShop? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForEntreprise.eShop}</p>): ("Aucune réponse")}

                                                </div>

                                                <div className=''>
                                                    <b>4) Seriez intéressés par une solution digitale (paiement/ encaissement) qui vous permettra de recevoir et d'effectuer des paiements instantanés de vos clients et à vos fournisseurs, quelque soit leur pays de résidence, les moyens de paiements que ces derniers utilisent ? :</b><br/>
                                                    {oneKycForEntreprise?.multiplePayment? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForEntreprise.multiplePayment}</p>): ("Aucune réponse")}

                                                </div>
                                                
                                            </div>
                                        </div>
                                    </>
                                ): ("")}

                                {/* Les documents légaux */}
                                {etape===2 ? (
                                    <>
                                        <div className='my-5'>
                                            <h3 className='text-center'>Les documents légaux</h3>
                                        </div>
                                        <div className=" row col-lg-12 col-md-12 justify-content-between">
                                            <div className='col-lg-6 col-md-6 text-center'>
                                                <h4 className='text-center'>Registre de commerce</h4>
                                                {/* Utilisation de la fonction isPdfLink pour vérifier si un lien est pour un fichier PDF */}
                                                {isPdfLink(`${API_URL}/${oneKycForEntreprise?.tradeRegistry}`) ? (
                                                    <>
                                                    
                                                        <div className="hero-btn  text-center ">
                                                        <a
                                                            className="nav-link btn btn-blue nav-link btn btn-outline-green"
                                                            role="button"
                                                            data-toggle="dropdown"
                                                            aria-haspopup="true"
                                                            aria-expanded="false"
                                                            href={`${API_URL}/${oneKycForEntreprise?.tradeRegistry}`} 
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
                                                        {oneKycForEntreprise?.tradeRegistry? <img src={`${API_URL}/${oneKycForEntreprise?.tradeRegistry}`} className="" width={'400'} height={'400'} alt="Recto"/> : "Pas de registre de commerce"}
                                                    </>
                                                )}
                                                
                                            </div>

                                            <div className='col-lg-6 col-md-6 text-center'>
                                                <h4 className='text-center'>Déclaration d'existence fiscale</h4>
                                                {/* Utilisation de la fonction isPdfLink pour vérifier si un lien est pour un fichier PDF */}
                                                {isPdfLink(`${API_URL}/${oneKycForEntreprise?.fiscalExistence}`) ? (
                                                    <>
                                                        <div className="hero-btn  text-center ">
                                                        <a
                                                            className="nav-link btn btn-blue nav-link btn btn-outline-green"
                                                            role="button"
                                                            data-toggle="dropdown"
                                                            aria-haspopup="true"
                                                            aria-expanded="false"
                                                            href={`${API_URL}/${oneKycForEntreprise?.fiscalExistence}`}
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
                                                        {oneKycForEntreprise?.fiscalExistence? <img src={`${API_URL}/${oneKycForEntreprise?.fiscalExistence}`} width={'400'} height={'400'} alt="Verso"/> : "Pas de déclaration d'existence fiscale"}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                ): ("")}


                                {/* Justificatif de domicile du bureau*/}
                                {etape===3 ? (
                                    <>
                                        <div className='my-5'>
                                            <h3 className='text-center'>Justificatif de domicile du bureau</h3>
                                        </div>
                                        <div className=" row col-lg-12 col-md-12 justify-content-between">
                                            <div className='col-lg-6 col-md-6 text-center'>
                                                <h4 className='text-center'>Recto</h4>
                                                {/* Utilisation de la fonction isPdfLink pour vérifier si un lien est pour un fichier PDF */}
                                                {isPdfLink(`${API_URL}/${oneKycForEntreprise?.frontProofResidence}`) ? (
                                                    <>
                                                        <div className="hero-btn  text-center ">
                                                        <a
                                                            className="nav-link btn btn-blue nav-link btn btn-outline-green"
                                                            role="button"
                                                            data-toggle="dropdown"
                                                            aria-haspopup="true"
                                                            aria-expanded="false"
                                                            href={`${API_URL}/${oneKycForEntreprise?.frontProofResidence}`} 
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
                                                        {oneKycForEntreprise?.frontProofResidence? <img src={`${API_URL}/${oneKycForEntreprise?.frontProofResidence}`} className="" width={'400'} height={'400'} alt="Recto"/> : "Pas de recto justificatif"}
                                                    </>
                                                )}
                                                
                                            </div>

                                            <div className='col-lg-6 col-md-6 text-center'>
                                                <h4 className='text-center'>Verso</h4>
                                                {/* Utilisation de la fonction isPdfLink pour vérifier si un lien est pour un fichier PDF */}
                                                {isPdfLink(`${API_URL}/${oneKycForEntreprise?.backProofResidence}`) ? (
                                                    <>
                                                        <div className="hero-btn  text-center ">
                                                        <a
                                                            className="nav-link btn btn-blue nav-link btn btn-outline-green"
                                                            role="button"
                                                            data-toggle="dropdown"
                                                            aria-haspopup="true"
                                                            aria-expanded="false"
                                                            href={`${API_URL}/${oneKycForEntreprise?.backProofResidence}`}
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
                                                        {oneKycForEntreprise?.backProofResidence? <img src={`${API_URL}/${oneKycForEntreprise?.backProofResidence}`} width={'400'} height={'400'} alt="Verso"/> : "Pas de verso justificatif"}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                ): ("")}

                                {/* Justificatif d'identité du dirigeant*/}
                                {etape===4 ? (
                                    <>
                                        <div className='my-5'>
                                            <h3 className='text-center'>Justificatif d'identité du dirigeant</h3>
                                        </div>
                                        
                                        <div className=" row col-lg-12 col-md-12 justify-content-between">
                                            <div className='col-lg-6 col-md-6 text-center'>
                                                <h4>Nom du dirigeant</h4>
                                                {oneKycForEntreprise?.firstNameLeader? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForEntreprise.firstNameLeader}</p>): ("Aucun nom")}
                                            </div>
                                            <div className='col-lg-6 col-md-6 text-center'>
                                                <h4>prenom du dirigeant</h4>
                                                {oneKycForEntreprise?.lastNameLeader? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForEntreprise.lastNameLeader}</p>): ("Aucun prénom")}
                                            </div>
                                            <div className='col-lg-6 col-md-6 text-center'>
                                                <h4 className='text-center'>Recto</h4>
                                                {oneKycForEntreprise?.cniFrontLeader? (
                                                            <>
                                                                {/* Utilisation de la fonction isPdfLink pour vérifier si un lien est pour un fichier PDF */}
                                                                {isPdfLink(`${API_URL}/${oneKycForEntreprise?.cniFrontLeader}`) ? (
                                                                    <>
                                                                        <div className="hero-btn  text-center ">
                                                                            <a
                                                                                className="nav-link btn btn-blue nav-link btn btn-outline-green"
                                                                                role="button"
                                                                                data-toggle="dropdown"
                                                                                aria-haspopup="true"
                                                                                aria-expanded="false"
                                                                                href={`${API_URL}/${oneKycForEntreprise?.cniFrontLeader}`} 
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
                                                                        <img src={`${API_URL}/${oneKycForEntreprise?.cniFrontLeader}`} className="" width={'400'} height={'400'} alt="Recto"/> :
                                                                    </>
                                                                )}
                                                            </>
                                                        ):"Pas de recto justificatif"
                                                        }
                                                
                                            </div>

                                            <div className='col-lg-6 col-md-6 text-center'>
                                                <h4 className='text-center'>Verso</h4>
                                                {oneKycForEntreprise?.cniBackLeader? 
                                                    (
                                                        <>
                                                        {/* Utilisation de la fonction isPdfLink pour vérifier si un lien est pour un fichier PDF */}
                                                        {isPdfLink(`${API_URL}/${oneKycForEntreprise?.cniBackLeader}`) ? (
                                                            <>
                                                                <div className="hero-btn  text-center ">
                                                                    <a
                                                                        className="nav-link btn btn-blue nav-link btn btn-outline-green"
                                                                        role="button"
                                                                        data-toggle="dropdown"
                                                                        aria-haspopup="true"
                                                                        aria-expanded="false"
                                                                        href={`${API_URL}/${oneKycForEntreprise?.cniBackLeader}`} 
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
                                                                <img src={`${API_URL}/${oneKycForEntreprise?.cniBackLeader}`} className="" width={'400'} height={'400'} alt="Verso"/> 
                                                            </>
                                                        )}
                                                    </>
                                                    ):"Pas de recto justificatif"
                                                }
                                            </div>
                                        </div>

                                    </>
                                ): ("")}

                                

                                {/* Photo du dirigeant */}
                                {etape===5 ? (
                                    <>
                                        <div className='my-5'>
                                            <h3 className='text-center'>Photo du dirigeant</h3>
                                        </div>
                                        <div className="input-group flex-nowrap">
                                            <div className='col-lg-12 col-md-12 row justify-content-between'>
                                                <div className='input-group-alternative my-3 text-center'>
                                                    {oneKycForEntreprise?.userPictureLeader? <img src={oneKycForEntreprise?.userPictureLeader} alt="Selfie" /> : "Aucune photo"}
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ): ("")}

                                {/* Signature du dirigeant */}
                                {etape===6 ? (
                                    <>
                                        <div className='my-5'>
                                            <h3 className='text-center'>Signature du dirigeant</h3>
                                        </div>
                                        <div className="input-group flex-nowrap">
                                            <div className='col-lg-12 col-md-12 row justify-content-between'>
                                                <div className='input-group-alternative my-3 text-center'>
                                                    {oneKycForEntreprise?.userSignatureLeader? <img src={oneKycForEntreprise?.userSignatureLeader} alt="Selfie" /> : "Aucune signature"}
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
                <Modal.Title className="text-white" >Validation de KYC</Modal.Title>                
            </Modal.Header>
                <Form role="form">
                    <Modal.Body>
                        <div className='row justify-content-between'>
                            {/* Les questionnaires */}
                            <div className='form-group my-3 col-lg-6 col-md-6'>
                                <label className="mx-2  mb-2" htmlFor='validQuiz'>
                                    Les questionnaires 
                                </label>
                                {!oneKycForEntreprise?.validQuiz==1 ? (
                                    <select 
                                        className="form-control"
                                        id="validQuiz"
                                        required
                                        defaultValue={validQuiz} 
                                        onChange={(event)=>setValidQuiz(event.target.value)}
                                    >
                                        <option defaultValue="">Choisissez une option</option>
                                        <optgroup className='single-cryptocurrency-box'>
                                            <option  value="true">Valider</option>
                                            <option  value="false">Non valider</option>
                                        </optgroup>
                                    </select>
                                ):(<p className='colorGreen mx-2'><b>Déjà validé</b></p>)}
                            </div>

                            {/* Les documents légaux */}
                            <div className='form-group my-3 col-lg-6 col-md-6'>
                                <label className="mx-2  mb-2" htmlFor='validLegalDocuments'>
                                    Les documents légaux
                                </label>
                                {!oneKycForEntreprise?.validLegalDocuments==1 ? (
                                    <select 
                                        className="form-control"
                                        id="validLegalDocuments"
                                        required
                                        defaultValue={validLegalDocuments} 
                                        onChange={(event)=>setValidLegalDocuments(event.target.value)}
                                    >
                                        <option defaultValue="">Choisissez une option</option>
                                        <optgroup className='single-cryptocurrency-box'>
                                            <option  value="true">Valider</option>
                                            <option  value="false">Non valider</option>
                                        </optgroup>
                                    </select>
                                ):(<p className='colorGreen mx-2'><b>Déjà validé</b></p>)}
                            </div>

                            {/* Justificatif d'identité */}
                            <div className='form-group my-3 col-lg-6 col-md-6'>
                                <label className="mx-2  mb-2" htmlFor='validIdentity'>
                                    Justificatif d'identité
                                </label>
                                {!oneKycForEntreprise?.validIdentity==1 ? (
                                    <select 
                                        className="form-control"
                                        id="validIdentity"
                                        required
                                        defaultValue={validIdentity} 
                                        onChange={(event)=>setValidIdentity(event.target.value)}
                                    >
                                        <option defaultValue="">Choisissez une option</option>
                                        <optgroup className='single-cryptocurrency-box'>
                                            <option  value="true">Valider</option>
                                            <option  value="false">Non valider</option>
                                        </optgroup>
                                    </select>
                                ):(<p className='colorGreen mx-2'><b>Déjà validé</b></p>)}

                            </div>

                            {/* Justificatif de domicile */}
                            <div className='form-group my-3 col-lg-6 col-md-6'>
                                <label className="mx-2  mb-2" htmlFor='validResidence'>
                                    Justificatif de domicile
                                </label>
                                {!oneKycForEntreprise?.validResidence==1 ? (
                                    <select 
                                        className="form-control"
                                        id="validResidence"
                                        required
                                        defaultValue={validResidence} 
                                        onChange={(event)=>setValidResidence(event.target.value)}
                                    >
                                        <option defaultValue="">Choisissez une option</option>
                                        <optgroup className='single-cryptocurrency-box'>
                                            <option  value="true">Valider</option>
                                            <option  value="false">Non valider</option>
                                        </optgroup>
                                    </select>
                                ):(<p className='colorGreen mx-2'><b>Déjà validé</b></p>)}

                            </div>

                            {/* Photo de l'utilisateur */}
                            <div className='form-group my-3 col-lg-6 col-md-6'>
                                <label className="mx-2  mb-2" htmlFor='validPhoto'>
                                    Photo de l'utilisateur
                                </label>
                                {!oneKycForEntreprise?.validPhoto==1 ? ( 
                                    <select 
                                        className="form-control"
                                        id="validPhoto"
                                        required
                                        defaultValue={validPhoto} 
                                        onChange={(event)=>setValidPhoto(event.target.value)}
                                    >
                                        <option defaultValue="">Choisissez une option</option>
                                        <optgroup className='single-cryptocurrency-box'>
                                            <option  value="true">Valider</option>
                                            <option  value="false">Non valider</option>
                                        </optgroup>
                                    </select>
                                ):(<p className='colorGreen mx-2'><b>Déjà validé</b></p>)}

                            </div>

                            {/* Signature de l'utilisateur */}
                            <div className='form-group my-3 col-lg-6 col-md-6'>
                                <label className="mx-2  mb-2" htmlFor='validSignature'>
                                    Signature de l'utilisateur
                                </label>
                                {!oneKycForEntreprise?.validSignature==1 ? (
                                    <select 
                                        className="form-control"
                                        id="validSignature"
                                        required
                                        defaultValue={validSignature} 
                                        onChange={(event)=>setValidSignature(event.target.value)}
                                    >
                                        <option defaultValue="">Choisissez une option</option>
                                        <optgroup className='single-cryptocurrency-box'>
                                            <option  value="true">Valider</option>
                                            <option  value="false">Non valider</option>
                                        </optgroup>
                                    </select>
                                ):(<p className='colorGreen mx-2'><b>Déjà validé</b></p>)}

                            </div>
                        </div>
                       
                        <div className="form-group mb-6">
                            <textarea
                                className="form-control gr-text-11 border mt-3 bg-white"
                                type="text"
                                id="contenu"
                                placeholder="Décrivez le résultat ici"
                                defaultValue={pattern} 
                                onChange={(event)=>setPattern(event.target.value)}
                            />
                        </div>


                        

                    </Modal.Body>
                    <Modal.Footer>
                        <Button className="text-white" color="danger" onClick={handleCloseEvaluer}>
                            Fermer
                        </Button>
                        <Button  type='button'  color="success" onClick={validKycParticular}  disabled={isLoggingIn}>
                            Envoyer
                        </Button>
                    </Modal.Footer>
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

export default ValidEntreprise;
