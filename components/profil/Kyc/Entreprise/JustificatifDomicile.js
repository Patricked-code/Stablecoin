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

const CJtifDomicile = () => {
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

    
    // State pour les fichiers du justificatif de domicile
    const [frontProofResidence, setFrontProofResidence] = useState(null)
    const [backProofResidence, setBackProofResidence] = useState()



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


    // FONCTION POUR UPLOADER LES FICHIERS
    // const [image, setImage] = useState(null);
    const [createObjectURL, setCreateObjectURL] = useState(null);

    const uploadToClientRecto = (event) => {
        if (event.target.files && event.target.files[0]) {
        const i = event.target.files[0];

        setFrontProofResidence(i);
        setCreateObjectURL(URL.createObjectURL(i));
        }
    };


    const uploadToClientVerso = (event) => {
        if (event.target.files && event.target.files[0]) {
        const i = event.target.files[0];

        setBackProofResidence(i);
        setCreateObjectURL(URL.createObjectURL(i));
        }
    };

    // FONCTION D'AJOUT DES FICHIERS DE LA RESIDENSE DANS LA BASE DE DONNEE
    const AddJustificationDomicile = async () => {
        const token = localStorage.getItem('tokenEnCours')

        const body = new FormData();
        
        body.append("frontProofResidence", frontProofResidence);
        body.append("backProofResidence", backProofResidence);
        
        const result = await fetch(`${API_URL}/api/kyc/entreprise/add-kyc-domicile`, {
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
                html: `<p> Vos fichers de justificatif de domicile ont été sauvegardés avec succès.</p>` ,
                showConfirmButton: false,
                timer: 5000
            }),
            setTimeout(() => {
            Router.push("/profil/kyc/entreprise/justificatif-identite"); 
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



  return (
    <>

        <div className='' >
            <div className=' mx-15'>
                <div className='py-10'>
                    <h1 className='text-center'>Justificatif de domicile du bureau</h1>
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
                                    <label
                                        htmlFor="picture"
                                        className='mb-6'
                                    >
                                        Merci de joindre soit (votre facture de l'électricité du bureau ou votre facture de location)
                                    </label> 
                                    </div><br/>
                                    <div className="form-group my-6">
                                        <label
                                            htmlFor="picture"
                                        >
                                            Recto de votre justificatif de domicile du bureau
                                        </label>
                                        <input
                                            className="form-control border mt-3 bg-white"
                                            type="file" 
                                            name="myImage"
                                            id='picture'
                                            accept="application/pdf, image/*"
                                            onChange={uploadToClientRecto}
                                        />
                                    </div>
                                    <div className="form-group mb-6">
                                        <label
                                            htmlFor="picture"
                                        >
                                            Verso de votre justificatif de domicile du bureau
                                        </label>
                                        <input
                                            className="form-control  border mt-3"
                                            type="file" 
                                            name="myImage"
                                            id='picture'
                                            accept="application/pdf, image/*"
                                            onChange={uploadToClientVerso}
                                        />
                                    </div>
                            </div>
                            {/* Fin */}

                                {/* <Link href='/profil/kyc/commun/selfie' className="align-right"> */}
                                    <a
                                    className=""
                                    >
                                        <button className="btn btn-primary " type='button' onClick={AddJustificationDomicile}  disabled={isLoggingIn}>Suivant</button>
                                    </a>
                                {/* </Link> */}

                        </form>  
                             
                    </div>
                <div className='col-lg-3 col-md-12'></div>
            </div>
        </div>



    </>
  );
};

export default CJtifDomicile;
