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

// FIN


// FIN

const CDocumentLegaux = () => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API

    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const [modalFile, setModalFile] = React.useState(false);


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

    // Fonction pour prendre photo du Recto
    const captureRecto = () => {
        const image = webcamRefRecto.current.getScreenshot()
        setImageRecto(image)
        console.log("image=>",image)
    }
    // Fin

    // Fonction pour prendre photo du verso
    const captureVerso = () => {
        const image = webcamRefVerso.current.getScreenshot()
        setImageVerso(image)
        console.log("image=>",image)
    }
    // Fin


  return (
    <>

        <div className='' >
            <div className=' mx-15'>
                <div className='py-10'>
                    <h1 className='text-center'>Documents legaux de l'entreprise</h1>
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
                                <form>
                                    <div className="form-group my-6">
                                        <label
                                            htmlFor="nom"
                                            className='mb-6'
                                        >
                                            Nom du dirigeant de l'entreprise
                                        </label>
                                        <input
                                            className="form-control border mt-3 bg-white"
                                            type="text" 
                                            name="nom"
                                            id='nom'
                                            // onChange={uploadToClient}
                                        /> 
                                    </div>
                                    <div className="form-group my-6">
                                        <label
                                            htmlFor="picture"
                                            className='mb-6'
                                        >
                                            Merci de joindre ces différents fichiers
                                        </label> 
                                    </div><br/>
                                    <div className="form-group my-6">
                                        <label
                                            htmlFor="picture"
                                        >
                                            Registre de commerce de l'entreprise
                                        </label>
                                        <input
                                            className="form-control border mt-3 bg-white"
                                            type="file" 
                                            name="myImage"
                                            id='picture'
                                            accept="application/pdf, image/*"
                                            // onChange={uploadToClient}
                                        />
                                    </div>
                                    <div className="form-group mb-6">
                                        <label
                                            htmlFor="picture"
                                        >
                                            Déclaration d'existence fiscale de l'entreprise (Facultatif)
                                        </label>
                                        <input
                                            className="form-control  border mt-3"
                                            type="file" 
                                            name="myImage"
                                            id='picture'
                                            accept="application/pdf, image/*"
                                            // onChange={uploadToClient}
                                        />
                                    </div>
                                </form>
                            </div>
                            {/* Fin */}

                                <Link href='/profil/kyc/commun/selfie' className="align-right">
                                    <a
                                    className=""
                                    >
                                        <button className="btn btn-primary " type='button'  disabled={isLoggingIn}>Suivant</button>
                                    </a>
                                </Link>

                        </form>  
                             
                    </div>
                <div className='col-lg-3 col-md-12'></div>
            </div>
        </div>



    </>
  );
};

export default CDocumentLegaux;
