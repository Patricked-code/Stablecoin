import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Modal } from "react-bootstrap";
import {Button,Form} from "reactstrap";

// Pour Magic
import { magic } from "../../../../magic";
import { ethers } from "ethers";
// import Loading from "../../../components/loading";
import Router from "next/router";
import { Table } from '@nextui-org/react';
import Link from 'next/link';



const CKycParticulierDemander = () => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API

    
    const [isLoggingIn, setIsLoggingIn] = useState();
    const [currentUser, setCurrentUser] = useState();
    const [provider, setProvider] = useState(null);


    // States du formulaire d'acceptation par partie
    const [quizAmlAccept, setQuizAmlAccept] = useState();
    const [quizFatcaAccept, setQuizFatcaAccept] = useState();
    const [identityAccept, setIdentityAccept] = useState();
    const [residenceAccept, setResidenceAccept] = useState();
    const [photoAccept, setPhotoAccept] = useState();
    const [signatureAccept, setSignatureAccept] = useState();







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
                      Authorization:  `Bearer ${token}`,

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

    // Modal du formulaire pour répondre à la demande d'accès
    const [showForm, setShowForm] = useState(false);
    const handleCloseForm = () => setShowForm(false);
    const handleShowForm = () => setShowForm(true);
    // Fin

    // Modal de retreit
    const [showRejection, setShowRejection] = useState(false);
    const handleCloseRejection = () => setShowRejection(false);
    const handleShowRejection = () => setShowRejection(true);
    // Fin

    return (
        <>
            {/* {currentUser?.profileId==2 || currentUser?.profileId==3?( */}

                <>
                    <div className='row' >
                        <div className='col-lg-1 col-md-1'></div>
                        <div className='col-lg-10 col-md-10'>
                            <div className=' mx-15'>
                                <div className='py-10'>
                                    <h1 className='text-center'>Demandes d'accès au kyc</h1>
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
                                <Table
                                    aria-label="Example table with static content"
                                    css={{
                                        height: "auto",
                                        minWidth: "100%",
                                    }}
                                >
                                    <Table.Header>
                                        {/* <Table.Column><p className="gr-text-8 pt-3 pb-0 mx-3 ">Nom & prenom </p></Table.Column> */}
                                        <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Institution</p></Table.Column>
                                        <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Date</p></Table.Column>
                                        <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Statut</p></Table.Column>
                                        <Table.Column><p className="gr-text-8 pt-3 pb-0 text-center">Actions</p></Table.Column>
                                    </Table.Header>
                                    <Table.Body>
                                        {/* {allKycForParticular?.map((data) => ( */}
                                            <Table.Row >                       
                                                <Table.Cell ><small className=" py-0 ">Fitech banque</small></Table.Cell>
                                                <Table.Cell ><small className=" py-0 ">18/10/2023</small></Table.Cell>
                                                <Table.Cell ><small className=" py-0 ">En cours</small></Table.Cell>
                                                <Table.Cell >
                                                    <div className='text-center'>
                                                        <small className=" py-0  mx-2 btn btn-primary" onClick={handleShowForm}>Répondre</small>
                                                        <small className=" py-0 px-4 mx-2 btn btn-danger" onClick={handleShowRejection}>Rejeter</small>
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
                            </div>
                        </div>
                    </div>
                    <div className='col-lg-1 col-md-1'></div>

                </>
            {/* ):(
                <span className="text-center bg-default-2 btn-bottom-text  d-block gr-text-5 text-blackish-blue gr-opacity-10 my-35">
                    <Loading/>
                </span>
            )} */}

            {/* ********************************************************************************** */}
                {/* MODAL D'ACCEPTATION OU REFUS DE LA DEMANDE*/}
            {/* ********************************************************************************** */}
            <Modal show={showForm} className="mt-15" onHide={handleCloseForm}>
                <Modal.Header closeButton id="bgcolor">
                    <Modal.Title className="" >Acceptation de la demande</Modal.Title>                
                </Modal.Header>
                <Form role="form">
                    <Modal.Body>
                        <div className='row'>
                        <div className='form-group my-3 col-lg-6 col-md-6'>
                            <label className="mx-2  mb-2" htmlFor='quizAmlAccept'>
                                Les questionnaires AML 
                            </label>
                            {/* {!oneKycForParticular?.quizAmlAccept==1 ? ( */}
                                <select 
                                    className="form-control"
                                    id="quizAmlAccept"
                                    required
                                    defaultValue={quizAmlAccept} 
                                    onChange={(event)=>setQuizAmlAccept(event.target.value)}
                                >
                                    <option defaultValue="">Choisissez une option</option>
                                    <optgroup className='single-cryptocurrency-box'>
                                        <option  value="true">Autoriser</option>
                                        <option  value="false">Refuser</option>
                                    </optgroup>
                                </select>
                            {/* ):(<p className='colorGreen mx-2'><b>Déjà validé</b></p>)} */}
                        </div>

                        <div className='form-group my-3 col-lg-6 col-md-6'>
                            <label className="mx-2  mb-2" htmlFor='quizFatcaAccept'>
                                Les questionnaires FATCA
                            </label>
                            {/* {!oneKycForParticular?.quizFatcaAccept==1 ? ( */}
                                <select 
                                    className="form-control"
                                    id="quizFatcaAccept"
                                    required
                                    defaultValue={quizFatcaAccept} 
                                    onChange={(event)=>setQuizFatcaAccept(event.target.value)}
                                >
                                    <option defaultValue="">Choisissez une option</option>
                                    <optgroup className='single-cryptocurrency-box'>
                                        <option  value="true">Autoriser</option>
                                        <option  value="false">Refuser</option>
                                    </optgroup>
                                </select>
                            {/* ):(<p className='colorGreen mx-2'><b>Déjà validé</b></p>)} */}
                        </div>

                        <div className='form-group my-3 col-lg-6 col-md-6'>
                            <label className="mx-2  mb-2" htmlFor='identityAccept'>
                                Justificatif d'identité
                            </label>
                            {/* {!oneKycForParticular?.identityAccept==1 ? ( */}
                                <select 
                                    className="form-control"
                                    id="identityAccept"
                                    required
                                    defaultValue={identityAccept} 
                                    onChange={(event)=>setIdentityAccept(event.target.value)}
                                >
                                    <option defaultValue="">Choisissez une option</option>
                                    <optgroup className='single-cryptocurrency-box'>
                                        <option  value="true">Autoriser</option>
                                        <option  value="false">Refuser</option>
                                    </optgroup>
                                </select>
                            {/* ):(<p className='colorGreen mx-2'><b>Déjà validé</b></p>)} */}
                        </div>

                        <div className='form-group my-3 col-lg-6 col-md-6'>
                            <label className="mx-2  mb-2" htmlFor='residenceAccept'>
                                Justificatif de domicile
                            </label>
                            {/* {!oneKycForParticular?.residenceAccept==1 ? ( */}
                                <select 
                                    className="form-control"
                                    id="residenceAccept"
                                    required
                                    defaultValue={residenceAccept} 
                                    onChange={(event)=>setResidenceAccept(event.target.value)}
                                >
                                    <option defaultValue="">Choisissez une option</option>
                                    <optgroup className='single-cryptocurrency-box'>
                                        <option  value="true">Autoriser</option>
                                        <option  value="false">Refuser</option>
                                    </optgroup>
                                </select>
                            {/* ):(<p className='colorGreen mx-2'><b>Déjà validé</b></p>)} */}
                        </div>

                        <div className='form-group my-3 col-lg-6 col-md-6'>
                            <label className="mx-2  mb-2" htmlFor='photoAccept'>
                                Photo
                            </label>
                            {/* {!oneKycForParticular?.quizAmlAccept==1 ? ( */}
                                <select 
                                    className="form-control"
                                    id="photoAccept"
                                    required
                                    defaultValue={photoAccept} 
                                    onChange={(event)=>setPhotoAccept(event.target.value)}
                                >
                                    <option defaultValue="">Choisissez une option</option>
                                    <optgroup className='single-cryptocurrency-box'>
                                        <option  value="true">Autoriser</option>
                                        <option  value="false">Refuser</option>
                                    </optgroup>
                                </select>
                            {/* ):(<p className='colorGreen mx-2'><b>Déjà validé</b></p>)} */}
                        </div>

                        <div className='form-group my-3 col-lg-6 col-md-6'>
                            <label className="mx-2  mb-2" htmlFor='signatureAccept'>
                                Signature
                            </label>
                            {/* {!oneKycForParticular?.signatureAccept==1 ? ( */}
                                <select 
                                    className="form-control"
                                    id="signatureAccept"
                                    required
                                    defaultValue={signatureAccept} 
                                    onChange={(event)=>setSignatureAccept(event.target.value)}
                                >
                                    <option defaultValue="">Choisissez une option</option>
                                    <optgroup className='single-cryptocurrency-box'>
                                        <option  value="true">Autoriser</option>
                                        <option  value="false">Refuser</option>
                                    </optgroup>
                                </select>
                            {/* ):(<p className='colorGreen mx-2'><b>Déjà validé</b></p>)} */}
                        </div>

                        <div className='form-group my-3 col-lg-6 col-md-6'>
                            <label className="mx-2  mb-2" htmlFor='quizAmlAccept'>
                                Les questionnaires AML 1
                            </label>
                            {/* {!oneKycForParticular?.quizAmlAccept==1 ? ( */}
                                <select 
                                    className="form-control"
                                    id="quizAmlAccept"
                                    required
                                    defaultValue={quizAmlAccept} 
                                    onChange={(event)=>setQuizAmlAccept(event.target.value)}
                                >
                                    <option defaultValue="">Choisissez une option</option>
                                    <optgroup className='single-cryptocurrency-box'>
                                        <option  value="true">Autoriser</option>
                                        <option  value="false">Refuser</option>
                                    </optgroup>
                                </select>
                            {/* ):(<p className='colorGreen mx-2'><b>Déjà validé</b></p>)} */}
                        </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className="text-white" color="danger" onClick={handleCloseForm}>
                            Fermer
                        </Button>
                        <Button  type='submit'  color="success" disabled={isLoggingIn}>
                            Attribuer
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
            {/* *****************************************FIN****************************************** */}


            {/* ********************************************************************************** */}
                {/* MODAL DU REJET COMPLET DE LA DEMANDE'*/}
            {/* ********************************************************************************** */}
            <Modal show={showRejection} className="mt-15" onHide={handleCloseRejection}>
                <Modal.Header closeButton className="bgColorRed">
                    <Modal.Title className="text-white" >Rejet de la demande</Modal.Title>                
                </Modal.Header>
                    <Modal.Body>
                        <div className='form-group my-3'>
                            Voulez-vous vraiment rejeter cette demande ?
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className="text-white" color="primary" onClick={handleCloseRejection}>
                            Fermer
                        </Button>
                        <Button  type='submit'  color="danger" disabled={isLoggingIn}>
                            Rejeter
                        </Button>
                    </Modal.Footer>
            </Modal>
            {/* *****************************************FIN****************************************** */}

        </>
    );
};

export default CKycParticulierDemander;
