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

const JtifDomicile = () => {
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

    // State de la géolocalisation
    const [latitude, setLatitude] = useState()
    const [longitude, setLongitude] = useState()

    // State pour les fichiers du justificatif de domicile
    const [frontProofResidence, setFrontProofResidence] = useState(null)
    const [backProofResidence, setBackProofResidence] = useState()

    const [currentKycStatut, setCurrentKycStatut] = useState();

    //localStorage pour récupérer une valeur en cliquant sur un bouton Recompleter qui indique qu'on veut modifier une partie Kyc 
    useEffect(() => {
        const kycStatut = localStorage.getItem('currentUpdateKycStatut')  
        setCurrentKycStatut(kycStatut)
    }, [currentKycStatut]);
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

     // FONCTION POUR OBTENIR LES INFOS SUR LA POSITION EXACTE DE L'UTILISATEUR
     function getUserLocation() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(saveUserLocation);
        } else {
            Swal.fire({
                position: 'center',
                icon: 'error',
                html: `<p> La géolocalisation n'est pas prise en charge par ce navigateur.</p>` ,
                showConfirmButton: false,
                timer: 5000
            })
        }
    }
    // FIN
    // FONCTION POUR SAUVEGARDER LES INFOS DE GEAOLOCATION DE USER
    function saveUserLocation(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        setLatitude(latitude)
        setLongitude(longitude)
    }
    // FIN

    // FONCTION D'AJOUT DES FICHIERS DE LA RESIDENSE DANS LA BASE DE DONNEE
    const AddJustificationDomicile = async () => {
        const token = localStorage.getItem('tokenEnCours')
        const body = new FormData();
        
        body.append("latitude", latitude);
        body.append("longitude", longitude);
        body.append("frontProofResidence", frontProofResidence);
        body.append("backProofResidence", backProofResidence);
        const result = await fetch(`${API_URL}/api/kyc/particular/add-kyc-domicile`, {
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
                if (currentKycStatut==="1") {
                    Router.push("/profil/kyc/particulier/resultat-kyc"); 
                }else{
                    Router.push("/profil/kyc/commun/selfie"); 
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

// La barre de progression de KYC
const steps = ["AML 1 & 2","FATCA", "Identité 1 & 2", "Selfie", "Domicile", "Photo", "Signature"];
const activeStep = 3;
// Fin

  return (
    <>
      <ProgressBar className="mb-15" steps={steps} activeStep={activeStep} />

        <div className='' >
            <div className=' mx-15'>
                <div className='py-10'>
                    <br/><br/><h1 className='text-center'>Justificatif de domicile</h1>
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
                                <label className='colorRed'>
                                    NB: Notez que vous devez être chez vous, à domicile, avant de cliquer sur le bouton ci-dessous pour enregistrer votre situation géographique.
                                </label> 
                                <div className="form-group row">
                                    
                                    <div className='row '>
                                        <div className="form-group mb-6 mt-3 col-lg-3 col-md-3"></div>
                                            <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">
                                                {latitude && longitude ? (
                                                <label className='colorGreen'>
                                                    Félicitations ! Vos informations ont été enregistrées avec succès. Nous vous remercions d'avoir partagé votre situation géographique.
                                                </label>
                                                ):(
                                                    <button className="btn btn-primary" type='button' onClick={getUserLocation}>Enregistrer </button>
                                                )}
                                            </div> 
                                        <div className="form-group mb-6 mt-3 col-lg-3 col-md-3"></div>
                                    </div>
                                    <div className="form-group my-6">
                                        <label
                                            htmlFor="picture"
                                            className='mb-6'
                                        >
                                            Merci de joindre soit (votre facture de l'électricité ou votre attestation de résidence ou votre relevé de compte bancaire)
                                        </label> 
                                    </div><br/>
                                    <div className="form-group my-6">
                                        <label
                                            htmlFor="picture"
                                        >
                                            Recto de votre justificatif de domicile
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
                                            Verso de votre justificatif de domicile (Facultatif si le fichier ne contient pas de verso)
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
                            <div className="form-group mb-6 mt-3 col-lg-12 col-md-12  row justify-content-between">
                                <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">
                                    <Link href='/profil/kyc/particulier/selfie-with-document/' className="align-right">
                                        <a
                                        className=""
                                        >
                                            <button className="btn btn-primary " type='button'  > Précédente </button>
                                        </a>   
                                    </Link>                          
                                </div> 

                                <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">
                                <a
                                    className=""
                                    >
                                        <button className="btn btn-primary " type='button' onClick={AddJustificationDomicile}  disabled={isLoggingIn}>Suivant</button>
                                    </a>                         
                                </div> 
                                </div>
                                

                        </form>  
                             
                    </div>
                <div className='col-lg-3 col-md-12'></div>
            </div>
        </div>



    </>
  );
};

export default JtifDomicile;
