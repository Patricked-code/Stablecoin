import { useState, useEffect, useRef } from 'react';
import React from "react";
import axios from 'axios';
import Link from 'next/link';
import { Icon } from '@iconify/react';

// Pour camera photo
import Webcam from 'react-webcam'



// Pour Magic
import { magic } from "../../../../magic";
import { ethers } from "ethers";
import Loading from "../../../loading";
import Router from "next/router";
import Swal from 'sweetalert2';
import Web3 from "web3";
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
import ProgressBar from '../ProgressBar';

// FIN


// FIN

const CDocumentLegaux = () => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API

    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const [modalFile, setModalFile] = React.useState(false);

// LES BONS
// registerFile * ok
// registerphoto
// dfeFile ok
// dfePhoto
// copyStatutesFile OK
// copyStatutesPhoto
// delegationPowersFile OK
// delegationPowersPhoto
// pvAppointmentFile OK
// pvAppointmentPhoto
// mapLocationFile OK
// mapLocationPhoto
// factureFile* OK
// facturePhoto*
// proofPowerFile ok
// proofPowerPhoto
// frontIdentityFile
// backIdentityFile*
// frontIdentityPhoto
// backIdentityPhoto

// register
// dfe
// copyStatutes
// delegationPowers
// pvAppointment
// mapLocation
// facture
// proofPower
// identity

// validRegister
// validDfe
// validCopyStatutes
// validDelegationPowers
// validPvAppointment
// validMapLocation
// validFacture
// validProofPower
// validIdentity




    const [statut, setStatut] = React.useState("0");
    const [statutRecto, setStatutRecto] = React.useState("0");
    const [statutVerso, setStatutVerso] = React.useState("0");

    // State de question 0
    const [typeJustificatif, setTypeJustificatif] = useState('default');

    // Fin
    const [selected, setSelected] = useState('file');

    // State Pour Camera photo
    const webcamRefRecto = useRef(null)
    const webcamRefVerso = useRef(null)
    const [imageRecto, setImageRecto] = useState(null)
    const [imageVerso, setImageVerso] = useState(null)
    // Fin

    // State de l'envoie des fichiers dans la base de donnée
    const [tradeRegistry, setTradeRegistry] = useState(null)
    const [fiscalExistence, setFiscalExistence] = useState(null)

    

    const [currentKycEntrepriseStatut, setCurrentKycEntrepriseStatut] = useState();

    //localStorage pour récupérer une valeur en cliquant sur un bouton Recompleter qui indique qu'on veut modifier une partie Kyc 
    useEffect(() => {
        const kycStatut = localStorage.getItem('currentKycEntrepriseStatut')  
        setCurrentKycEntrepriseStatut(kycStatut)
    }, [currentKycEntrepriseStatut]);






   


// ***************************************************************************************

// FONCTION POUR UPLOADER LE FICHIER Extrait de registre de commerce
    const [createObjectURL, setCreateObjectURL] = useState(null);

    const uploadToClientRegistre = (event) => {
        if (event.target.files && event.target.files[0]) {
        const i = event.target.files[0];

        setTradeRegistry(i);
        setCreateObjectURL(URL.createObjectURL(i));
        }
    };


    const uploadToClientFiscal = (event) => {
        if (event.target.files && event.target.files[0]) {
        const i = event.target.files[0];

        setFiscalExistence(i);
        setCreateObjectURL(URL.createObjectURL(i));
        }
    };
    // FIN


    // FONCTION D'AJOUT DES FICHIERS DE LA RESIDENSE DANS LA BASE DE DONNEE
    const addDocumentsLegaux = async () => {
        setIsLoggingIn(true)
        const token = localStorage.getItem('tokenEnCours')

        const body = new FormData();
        
        body.append("tradeRegistry", tradeRegistry);
        body.append("fiscalExistence", fiscalExistence);
        
        const result = await fetch(`${API_URL}/api/kyc/entreprise/add-kyc-legal-documents`, {
            method:"PUT",
            body,
            headers: {
            // 'Content-Type': 'application/json',
            Authorization:  `Bearer ${token}`,
            },
        }) 
        
        /* Verifier s'il y a un messsage d'erreur on l'affiche dans SWAL 
                * sinon on affiche le message de succès
                */
        if (result?.status===200) {
            Swal.fire({
                position: 'center',
                icon: 'success',
                html: `<p> Vos fichers des documents legaux ont été sauvegardés avec succès.</p>` ,
                showConfirmButton: false,
                timer: 5000
            }),
            setTimeout(() => {
                if (currentKycEntrepriseStatut==="1") {
                    Router.push("/profil/kyc/entreprise/resultat-kyc"); 

                }else{
                    Router.push("/profil/kyc/entreprise/justificatif-domicile"); 
                }
            }, 5000)

            
            }else{
                // setMessageError(data.message)
                setIsLoggingIn(false);
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    html: `<p> Désolé une erreur s'est produite,Veuillez réessayer svp. </p>` ,
                    showConfirmButton: false,
                    timer: 10000
                })
            }
            // Fin condition 
    }
    // FIN

    // La barre de progression de KYC du profil entreprise
   const stepsEntreprise = ["AML","Identité","Représentant", "Bénéficiaire","Control", "Politique", "Opérations", "Fonds", "Financière", "Documents"];

   const activeStepEntreprise = 7;
    // Fin

  return (
    <>
        <ProgressBar className="mb-15" steps={stepsEntreprise} activeStep={activeStepEntreprise} />

        <div className='' >
            <div className=' mx-15'>
                <div className='py-10'>
                <br/><br/><h1 className='text-center'>Documents légaux de l'entreprise</h1>
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
            <div className='row'>
                <div className='col-lg-3 col-md-12'></div>

                    <div className='m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white cryptocurrency-search-box login-form col-lg-6 col-md-12'>
                        <form className=''>

                            {/* Si selected est file on affiche ce formulaire pour importer des fichiers */}
                                <div className="form-group row mt-3">
                                    
                                    <div className="form-group my-6">
                                        <h4
                                            htmlFor="picture"
                                            className='mb-6'
                                        >
                                            Merci de joindre ces différents fichiers
                                        </h4> 
                                    </div><br/>
                                    <div className="form-group my-6">
                                        <label
                                            htmlFor="picture"
                                        >
                                            Extrait de registre de commerce
                                        </label>
                                        <input
                                            className="form-control border mt-3 bg-white"
                                            type="file" 
                                            name="myImage"
                                            id='picture'
                                            accept="application/pdf, image/*"
                                            onChange={uploadToClientRegistre}
                                        />
                                    </div>
                                    <div className="form-group mb-6">
                                        <label
                                            htmlFor="picture"
                                        >
                                            DFE
                                        </label>
                                        <input
                                            className="form-control  border mt-3"
                                            type="file" 
                                            name="myImage"
                                            id='picture'
                                            accept="application/pdf, image/*"
                                            onChange={uploadToClientFiscal}
                                        />
                                    </div>

                                    {/* *********NOUVEAU CHAMPS*************** */}
                                    <div className="form-group mb-6">
                                        <label
                                            htmlFor="picture"
                                        >
                                            Copie des statuts à jour
                                        </label>
                                        <input
                                            className="form-control  border mt-3"
                                            type="file" 
                                            name="myImage"
                                            id='picture'
                                            accept="application/pdf, image/*"
                                            onChange={uploadToClientFiscal}
                                        />
                                    </div>

                                    <div className="form-group mb-6">
                                        <label
                                            htmlFor="picture"
                                        >
                                            Délégation de pouvoirs, 
                                        </label>
                                        <input
                                            className="form-control  border mt-3"
                                            type="file" 
                                            name="myImage"
                                            id='picture'
                                            accept="application/pdf, image/*"
                                            onChange={uploadToClientFiscal}
                                        />
                                    </div>

                                    <div className="form-group mb-6">
                                        <label
                                            htmlFor="picture"
                                        >
                                            PV de nomination des dirigeants publication journal officiel
                                        </label>
                                        <input
                                            className="form-control  border mt-3"
                                            type="file" 
                                            name="myImage"
                                            id='picture'
                                            accept="application/pdf, image/*"
                                            onChange={uploadToClientFiscal}
                                        />
                                    </div>

                                    <div className="form-group mb-6">
                                        <label
                                            htmlFor="picture"
                                        >
                                            Plan Localisation géographique
                                        </label>
                                        <input
                                            className="form-control  border mt-3"
                                            type="file" 
                                            name="myImage"
                                            id='picture'
                                            accept="application/pdf, image/*"
                                            onChange={uploadToClientFiscal}
                                        />
                                    </div>

                                    <div className="form-group mb-6">
                                        <label
                                            htmlFor="picture"
                                        >
                                            Facture eau / électricité ou contrat de bail
                                            <br/><small className='colorRed'>
                                                Si le signataire dU bulletin de souscription n’est pas le représentant légal de la société, joindre également au dossier
                                            </small>
                                        </label>
                                        <input
                                            className="form-control  border mt-3"
                                            type="file" 
                                            name="myImage"
                                            id='picture'
                                            accept="application/pdf, image/*"
                                            onChange={uploadToClientFiscal}
                                        />
                                    </div>

                                    <div className="form-group mb-6">
                                        <label
                                            htmlFor="picture"
                                        >
                                            La copie du justificatif de pouvoir conféré au signataire sur le compte par le représentant légal
                                        </label>
                                        <input
                                            className="form-control  border mt-3"
                                            type="file" 
                                            name="myImage"
                                            id='picture'
                                            accept="application/pdf, image/*"
                                            onChange={uploadToClientFiscal}
                                        />
                                    </div>

                                    <div className="form-group mb-6">
                                        <label
                                            htmlFor="picture"
                                        >
                                            Copie recto de la pièce d’identité du signataire du bulletin de souscription (CNI, Passeport ou carte de séjour en coursde validité)
                                        </label>
                                        <input
                                            className="form-control  border mt-3"
                                            type="file" 
                                            name="myImage"
                                            id='picture'
                                            accept="application/pdf, image/*"
                                            onChange={uploadToClientFiscal}
                                        />
                                    </div>

                                    <div className="form-group mb-6">
                                        <label
                                            htmlFor="picture"
                                        >
                                            Copie verso de la pièce d’identité du signataire du bulletin de souscription (CNI, Passeport ou carte de séjour en coursde validité)
                                        </label>
                                        <input
                                            className="form-control  border mt-3"
                                            type="file" 
                                            name="myImage"
                                            id='picture'
                                            accept="application/pdf, image/*"
                                            onChange={uploadToClientFiscal}
                                        />
                                    </div>
                                    {/* ************FIN NOUVEAU CHAMPS*********** */}
                            </div>
                            {/* Fin */}
                            <div className="form-group mb-6 mt-3 col-lg-12 col-md-12  row justify-content-between">
                                        <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">
                                            <Link href='/profil/kyc/entreprise/information-financiere-five/' className="align-right">
                                                <a
                                                className=""
                                                >
                                                    <button className="btn btn-primary " type='button'> Précédente </button>
                                                </a>   
                                            </Link>                          
                                        </div> 

                                        <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">
                                            <button className="btn btn-primary " type='button'  >Suivant </button>
                                        </div> 

                                        {/* <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">
                                        20.	information-financiere-five
                                            <button className="btn btn-primary " type='button' onClick={addDocumentsLegaux}  disabled={isLoggingIn}>Suivant</button>
                                        </div>  */}
                                        </div>
                               

                        </form>  
                             
                    </div>
                <div className='col-lg-3 col-md-12'></div>
            </div>
        </div>



    </>
  );
};

export default CDocumentLegaux;
