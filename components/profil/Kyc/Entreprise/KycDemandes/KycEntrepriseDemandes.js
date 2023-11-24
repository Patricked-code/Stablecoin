import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Modal } from "react-bootstrap";
import {Button,Form} from "reactstrap";


// Pour Magic
import { magic } from "../../../../../magic";
import { ethers } from "ethers";
// import Loading from "../../../components/loading";
import Router from "next/router";
import { Table } from '@nextui-org/react';


// FIN





const CKycEntrepriseDemandes = () => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API

    const [isLoggingIn, setIsLoggingIn] = useState();
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


    // PARTIE D'ENVOIE DES DONNEES DE LA DEMANDE DE KYC ENTREPRISE
    const [selectedOptionsEntreprise, setSelectedOptionsEntreprise] = useState([]);

    const handleOptionChangeEntreprise = (e) => {
        const value = e.target.value;
        const isChecked = e.target.checked;

        if (isChecked) {
            setSelectedOptionsEntreprise([...selectedOptionsEntreprise, value]);
        } else {
            setSelectedOptionsEntreprise(selectedOptionsEntreprise.filter(option => option !== value));
        }
    };

    const handleSubmitEntreprise = async (e) => {
        e.preventDefault();

        const response = await fetch('/submit-entreprise', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'quizBusiness': selectedOptionsEntreprise.filter(option => option.includes("Questionnaire AML")),
                'identtityBusiness': selectedOptionsEntreprise.filter(option => option.includes("Justificatif d'identité")),
                'representives': selectedOptionsEntreprise.filter(option => option.includes("Représentants légaux")),
                'beneficiary': selectedOptionsEntreprise.filter(option => option.includes("Bénéficiaires effectifs")),
                'structures': selectedOptionsEntreprise.filter(option => option.includes("Structures de contrôle")),
                'politicallyExposed': selectedOptionsEntreprise.filter(option => option.includes("Personnes politiquement exposées")),
                'financialOperation': selectedOptionsEntreprise.filter(option => option.includes("Opérations financières")),
                'fundsOrigin': selectedOptionsEntreprise.filter(option => option.includes("Origine des fonds")),
                'financialInformation': selectedOptionsEntreprise.filter(option => option.includes("Informations financières")),
                'financialTransaction': selectedOptionsEntreprise.filter(option => option.includes("Transactions financières")),
                'legalDocument': selectedOptionsEntreprise.filter(option => option.includes("Documents légaux"))
            }),
        });
        if (response.ok) {

            console.log('Données enregistrées avec succès');
        } else {
            console.error('Erreur lors de l\'enregistrement des données');
        }
    };

    // Modal du formulaire pour répondre à la demande d'accès
    const [showForm, setShowForm] = useState(false);
    const handleCloseForm = () => setShowForm(false);
    const handleShowForm = () => setShowForm(true);
    // Fin

    // Modal du rejet de la demande
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

                                            <Table.Row >                       
                                                <Table.Cell ><small className=" py-0 ">Ecobank</small></Table.Cell>
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
                        <div>
                            <label className='mb-3'>
                                Cochez les parties que vous souhaiterez autoriser l'institution financière à voir.
                            </label>
                            <div className='form-group'>
                                <label>
                                    <input
                                        type="checkbox"
                                        value="Questionnaire AML"
                                        className='mx-3'
                                        checked={selectedOptionsEntreprise.includes("Questionnaire AML")}
                                        onChange={handleOptionChangeEntreprise}
                                    />
                                    Questionnaire AML
                                </label>
                            </div>
                            <div className='form-group'>
                                <label>
                                    <input
                                        type="checkbox"
                                        value="Justificatif d'identité"
                                        className='mx-3'
                                        checked={selectedOptionsEntreprise.includes("Justificatif d'identité")}
                                        onChange={handleOptionChangeEntreprise}
                                    />
                                    Justificatif d'identité
                                </label>
                            </div>
                            <div className='form-group'>
                                <label>
                                    <input
                                        type="checkbox"
                                        value="Représentants légaux"
                                        className='mx-3'
                                        checked={selectedOptionsEntreprise.includes("Représentants légaux")}
                                        onChange={handleOptionChangeEntreprise}
                                    />
                                    Représentants légaux
                                </label>
                            </div>
                            <div className='form-group'>
                                <label>
                                    <input
                                        type="checkbox"
                                        value="Bénéficiaires effectifs"
                                        className='mx-3'
                                        checked={selectedOptionsEntreprise.includes("Bénéficiaires effectifs")}
                                        onChange={handleOptionChangeEntreprise}
                                    />
                                    Bénéficiaires effectifs
                                </label>
                            </div>
                            <div className='form-group'>
                                <label>
                                    <input
                                        type="checkbox"
                                        value="Structures de contrôle"
                                        className='mx-3'
                                        checked={selectedOptionsEntreprise.includes("Structures de contrôle")}
                                        onChange={handleOptionChangeEntreprise}
                                    />
                                    Structures de contrôle
                                </label>
                            </div>
                            <div className='form-group'>
                                <label>
                                    <input
                                        type="checkbox"
                                        value="Personnes politiquement exposées"
                                        className='mx-3'
                                        checked={selectedOptionsEntreprise.includes("Personnes politiquement exposées")}
                                        onChange={handleOptionChangeEntreprise}
                                    />
                                                        Personnes politiquement exposées
                                </label>
                            </div>
                            <div className='form-group'>
                                <label>
                                    <input
                                        type="checkbox"
                                        value="Opérations financières"
                                        className='mx-3'
                                        checked={selectedOptionsEntreprise.includes("Opérations financières")}
                                        onChange={handleOptionChangeEntreprise}
                                    />
                                    Opérations financières
                                </label>
                            </div>
                            <div className='form-group'>
                                <label>
                                    <input
                                        type="checkbox"
                                        value="Origine des fonds"
                                        className='mx-3'
                                        checked={selectedOptionsEntreprise.includes("Origine des fonds")}
                                        onChange={handleOptionChangeEntreprise}
                                    />
                                    Origine des fonds
                                </label>
                            </div>
                            <div className='form-group'>
                                <label>
                                    <input
                                        type="checkbox"
                                        value="Informations financières"
                                        className='mx-3'
                                        checked={selectedOptionsEntreprise.includes("Informations financières")}
                                        onChange={handleOptionChangeEntreprise}
                                    />
                                    Informations financières
                                </label>
                            </div>
                            <div className='form-group'>
                                <label>
                                    <input
                                        type="checkbox"
                                        value="Transactions financières"
                                        className='mx-3'
                                        checked={selectedOptionsEntreprise.includes("Transactions financières")}
                                        onChange={handleOptionChangeEntreprise}
                                    />
                                    Transactions financières
                                </label>
                            </div>
                            <div className='form-group'>
                                <label>
                                    <input
                                        type="checkbox"
                                        value="Documents légaux"
                                        className='mx-3'
                                        checked={selectedOptionsEntreprise.includes("Documents légaux")}
                                        onChange={handleOptionChangeEntreprise}
                                    />
                                    Documents légaux
                                </label>
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

export default CKycEntrepriseDemandes;
