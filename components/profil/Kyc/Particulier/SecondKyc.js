import { useCallback, useState, useEffect, useRef } from 'react';
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

const SecondKyc = () => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API

    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [messageError, setMessageError] = useState(false);
    
    // Pour les deux nouveaux champs
    // pieceNumber
    // validityDate
    const [pieceNumber, setPieceNumber] = useState();
    const [validityDate, setValidityDate] = useState();


    const [modalFile, setModalFile] = React.useState(false);


    const [statut, setStatut] = React.useState("0");
    const [statutRecto, setStatutRecto] = React.useState("0");
    const [statutVerso, setStatutVerso] = React.useState("0");

    // State de question 0
    const [typeJustificatif, setTypeJustificatif] = useState('default');

    // Fin
    const [selected, setSelected] = useState('file');

    // State du type de justificatif et pour les fichiers
    const [receiptType, setReceiptType] = useState(); //Type du justificatif
    //const [frontReceipt, setFrontReceipt] = useState(null); //Verso du justificatif
    const [backReceipt, setBackReceipt] = useState(null); //Recto du justificatif

    // State des fichiers en photo
    const [frontReceiptPhoto, setFrontReceiptPhoto] = useState(); //Verso du justificatif en photo
    const [backReceiptPhoto, setBackReceiptPhoto] = useState(); //Verso du justificatif en photo


    
    const [currentKycStatut, setCurrentKycStatut] = useState();

    //localStorage pour récupérer une valeur en cliquant sur un bouton Recompleter qui indique qu'on veut modifier une partie Kyc 
    useEffect(() => {
        const kycStatut = localStorage.getItem('currentUpdateKycStatut')  
        setCurrentKycStatut(kycStatut)
    }, [currentKycStatut]);
    // Fin
    
    
 



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
    }
    // Fin

    // Fonction pour prendre photo du verso
    const captureVerso = () => {
        const image = webcamRefVerso.current.getScreenshot()
        setImageVerso(image)
    }
    // Fin



    
 // FONCTION DE LA MODIFICATION DE LA PHOTO
//  const [imageRecto, setImageRecto] = useState(null);
const [frontReceipt, setFrontReceipt] = useState(null); //Verso du justificatif

 const [createObjectURL, setCreateObjectURL] = useState(null);

 const uploadToClientRecto = (event) => {
     if (event.target.files && event.target.files[0]) {
     const i = event.target.files[0];

     setFrontReceipt(i);
     setCreateObjectURL(URL.createObjectURL(i));
     }
 };


//  const [imageVerso, setImageVerso] = useState(null);
//  const [createObjectURL, setCreateObjectURLVerso] = useState(null);

 const uploadToClientVerso = (event) => {
     if (event.target.files && event.target.files[0]) {
     const i = event.target.files[0];

     setBackReceipt(i);
     setCreateObjectURL(URL.createObjectURL(i));
     }
 };

  // FONCTION D'AJOUT DU TYPE DE JUSTIFICATIF ET SES FICHIER
  const AddReceipt = async () => {
      const token = localStorage.getItem('tokenEnCours')

      const body = new FormData();
      body.append("receiptType", typeJustificatif);
      body.append("frontReceipt", frontReceipt);
      body.append("backReceipt", backReceipt);
      
      const result = await fetch(`${API_URL}/api/kyc/particular/add-kyc-identity`, {
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
            html: `<p> Vos fichiers de justificatif d'identité ont été sauvegardés avec succès.</p>` ,
            showConfirmButton: false,
            timer: 5000
        }),
        setTimeout(() => {
            if (currentKycStatut==="1") {
                Router.push("/profil/kyc/particulier/resultat-kyc"); 
            }else{
                Router.push("/profil/kyc/particulier/justificatif-domicile"); 
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


  // Fonction d'envoie des informations du fichiers en photo
    const addFichierPhoto= async () => {
    setIsLoggingIn(true);

    try {
        
        const dataa = {
            receiptType:typeJustificatif,
            frontReceiptPhoto:imageRecto,
            backReceiptPhoto:imageVerso
        }

        const token = localStorage.getItem('tokenEnCours') //Le token récuperé

        const result = await fetch(`${API_URL}/api/kyc/particular/add-kyc-identity-photo`, {
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
            html: `<p> Vos fichiers ont été sauvegardés avec succès.</p>` ,
            showConfirmButton: false,
            timer: 5000
        }),
        setTimeout(() => {
        Router.push("/profil/kyc/particulier/justificatif-domicile"); 
        }, 5000)
        
        }else{
            setMessageError(data.message)

            setIsLoggingIn(false);
            Swal.fire({
                position: 'center',
                icon: 'error',
                html: `<p> ${messageError} </p>` ,
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

// actualiser la page
const actualiser = ()=>{
    setTimeout(() => {
        window.location.reload()
    }, 1000)
}

// La barre de progression de KYC
const steps = ["Questionnaires", "Justificatif d'identité", "Justificatif de domicile", "Photo", "Signature"];
const activeStep = 0;
// Fin

  return (
    <>
      <ProgressBar className="mb-15" steps={steps} activeStep={activeStep} />

        <div className='' >
            <div className=' mx-15'>
                <div className='py-10'>
                    <br/><br/><h1 className='text-center'>Justificatif d'identité</h1>
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
                        {/* <form className=''> */}
                            {/* Question 0 */}
                            {typeJustificatif==="Passeport"  || typeJustificatif==="Permis de conduire" || typeJustificatif==="Titre de séjour" || typeJustificatif==="Carte d'identité" || typeJustificatif==="Autre"? ("") :(
                                <>
                                    <div className="form-group mb-6 mt-3">
                                        <label
                                            htmlFor="Q1"
                                            className="text-blackish-blue mb-2"
                                        >
                                            Quel type de Justificatif d'identité souhaiterez-vous nous envoyer?
                                        <br/>
                                        </label>
                                        {/* Default */}
                                        <input 
                                            type="radio" 
                                            name="default"
                                            value='default'
                                            hidden
                                            checked={typeJustificatif==="default"}
                                            onChange={()=>setTypeJustificatif("default")}
                                        />
                                        {/* Fin default */}

                                        {/* Passeport*/}
                                        <div className="form-group  mt-3 ">
                                            <label
                                                htmlFor="passeport-check"
                                                className="gr-check-input mb-7 d-flex"
                                            >
                                                <input 
                                                type="radio" 
                                                name="passeport"
                                                value='Passeport'
                                                id='passeport-check' 
                                                checked={typeJustificatif==="Passeport"}
                                                onChange={()=>setTypeJustificatif("Passeport")}
                                                />
                                            <p className=" mx-2 mb-0 text-center">
                                                Passeport
                                            </p>
                                            </label>
                                        </div>
                                        {/* Carte d'identité */}
                                        <div className="form-group  mt-3 ">
                                            <label
                                                htmlFor="carte-check"
                                                className="gr-check-input mb-7 d-flex"
                                            >
                                                <input 
                                                type="radio" 
                                                name="carte"
                                                value="Carte d'identité"
                                                id='carte-check' 
                                                checked={typeJustificatif==="Carte d'identité"}
                                                onChange={()=>setTypeJustificatif("Carte d'identité")}
                                                />
                                            <p className=" mx-2 mb-0 text-center">
                                                Carte d'identité
                                            </p>
                                            </label>
                                        </div>
                                        {/* Permis de conduire */}
                                        <div className="form-group  mt-3 ">
                                            <label
                                                htmlFor="permis-check"
                                                className="gr-check-input mb-7 d-flex"
                                            >
                                                <input 
                                                type="radio" 
                                                name="permis"
                                                value="Permis de conduire"
                                                id='permis-check' 
                                                checked={typeJustificatif==="Permis de conduire"}
                                                onChange={()=>setTypeJustificatif("Permis de conduire")}
                                                />
                                            <p className=" mx-2 mb-0 text-center">
                                                Permis de conduire
                                            </p>
                                            </label>
                                        </div>

                                        {/* Titre de séjour */}
                                        <div className="form-group  mt-3 ">
                                            <label
                                                htmlFor="sejour-check"
                                                className="gr-check-input mb-7 d-flex"
                                            >
                                                <input 
                                                type="radio" 
                                                name="sejour"
                                                value="Titre de séjour"
                                                id='sejour-check' 
                                                checked={typeJustificatif==="Titre de séjour"}
                                                onChange={()=>setTypeJustificatif("Titre de séjour")}
                                                />
                                            <p className=" mx-2 mb-0 text-center">
                                                Titre de séjour
                                            </p>
                                            </label>
                                        </div>

                                        {/* Autre */}
                                        <div className="form-group  mt-3 ">
                                            <label
                                                htmlFor="autre-check"
                                                className="gr-check-input mb-7 d-flex"
                                            >
                                                <input 
                                                type="radio" 
                                                name="autre"
                                                value="Autre"
                                                id='autre-check' 
                                                checked={typeJustificatif==="Autre"}
                                                onChange={()=>setTypeJustificatif("Autre")}
                                                />
                                            <p className=" mx-2 mb-0 text-center">
                                                Autre
                                            </p>
                                            </label>
                                        </div>
                                    </div >

                                    <form>
                                    <Link href='/profil/kyc/particulier/' className="align-right">
                                        <a >
                                            <button className="btn btn-primary "type='button' >
                                            Précédente
                                            </button>
                                        </a>
                                    </Link>
                                    </form>
                                </>
                            )}
                            {/* Fin Q0 */}
                            
                            

                            {/* Question 1 */}
                            {typeJustificatif==="Passeport"  || typeJustificatif==="Permis de conduire" || typeJustificatif==="Titre de séjour" || typeJustificatif==="Carte d'identité" || typeJustificatif==="Autre"? (
                                <>
                                <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="Q1"
                                    className="text-blackish-blue mb-2"
                                >
                                     Choisissez une option pour soumettre les fichiers de votre Justificatif d'identité
                                <br/>
                                </label>
                            </div >
                              {/* Les bouton de choix  */}
                            {statut==="0" ? (
                            <div className="form-group row mt-3">

                                <div className="form-group ">
                                    <label
                                        htmlFor="trimestriels-check"
                                        className="gr-check-input d-flex"
                                    >
                                        <input 
                                            type="radio" 
                                            name="trimestriels"
                                            value="file"
                                            id='trimestriels-check' 
                                            checked={selected === 'file'}
                                            onChange={() => setSelected('file')}
                                        />
                                    <p className=" mx-2 mb-0 text-center">
                                        Importer les fichiers
                                    </p>
                                    </label>
                                </div>

                                <div className="form-group">
                                    <label
                                        htmlFor="trimestriels-check"
                                        className="gr-check-input mb-3 d-flex"
                                    >
                                        <input 
                                        type="radio" 
                                        name="trimestriels"
                                        value="photo"
                                        id='trimestriels-check' 
                                        checked={selected === 'photo'}
                                        onChange={() => setSelected('photo')}
                                        />
                                    <p className=" mx-2 mb-0 text-center">
                                        Prendre les photos du justificatif
                                    </p>
                                    </label>
                                </div>
                            </div>
                            
                            ) :('') }
                            </>
                            ) : ("")}
                            {/* Fin */}


                            {/* Si selected est file on affiche ce formulaire pour importer des fichiers */}
                            {selected==="file" && statut==="1" ? (
                                <div className="form-group row mt-3">
                                <form>
                                    <div className="form-group mb-6 mt-3">
                                        <label
                                            htmlFor="pieceNumber"
                                            className="text-blackish-blue mb-2"
                                        >
                                            Numéro de la pièce d’identité
                                        </label>
                                        <div className='form-group'>
                                            <input
                                                type='text'
                                                id='pieceNumber'
                                                className='form-control'
                                                placeholder='Numéro de la pièce d’identité'
                                                defaultValue={pieceNumber} 
                                                onChange={(event)=>setPieceNumber(event.target.value)}
                                            />
                                        </div>
                                    </div >
                                    <div className="form-group mb-6 mt-3">
                                        <label
                                            htmlFor="validityDate"
                                            className="text-blackish-blue mb-2"
                                        >
                                            Date Validité 
                                        </label>
                                        <div className='form-group'>
                                            <input
                                                type='date'
                                                id='firstName'
                                                className='form-control'
                                                placeholder='Date Validité '
                                                defaultValue={validityDate} 
                                                onChange={(event)=>setValidityDate(event.target.value)}
                                            />
                                        </div>
                                    </div >
                                    <div className="form-group mb-6">
                                        <label
                                            htmlFor="picture"
                                        >
                                            Recto de votre justificatif d'identité
                                        </label>
                                        <input
                                            className="form-control border mt-3 bg-white"
                                            type="file" 
                                            name="myImage"
                                            accept="application/pdf, image/*" 
                                            id='picture'
                                            onChange={uploadToClientRecto}
                                        />
                                    </div>
                                    <div className="form-group mb-6">
                                        <label
                                            htmlFor="picture"
                                        >
                                            Verso de votre justificatif d'identité
                                        </label>
                                        <input
                                            className="form-control  border mt-3"
                                            type="file" 
                                            name="myImage"
                                            accept="application/pdf, image/*"
                                            id='picture'
                                            onChange={uploadToClientVerso}
                                        />
                                    </div>

                                    {statut==="1" ? (

                                    <div className="form-group mb-6 mt-3 col-lg-12 col-md-12  row justify-content-between">
                                    <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">
                                        <a
                                            className=""
                                        >
                                            <button className="btn btn-primary " onClick={actualiser} type='button'  > Précédente </button>
                                        </a>  
                                    </div> 

                                    <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">
                                        <a
                                        className=""
                                        >
                                            <button className="btn btn-primary " type='button' onClick={AddReceipt}  disabled={isLoggingIn}>Suivant </button>
                                        </a>
                                    </div> 
                                    </div>

                                       
                            ) :("")}
                                </form>
                            </div>
                            ) :("")}
                            {/* Fin */}

                            {/* Si selected est photo on affiche ce formulaire pour prendre photos des fichiers */}
                            {selected==="photo" && statut==="1" ? (
                                <>
                                <form>
                                    {/* Recto */}
                                    <div className="form-group row mt-3">
                                        <div className="form-group">
                                            <label
                                                htmlFor="pieceNumber"
                                                className="text-blackish-blue mb-2"
                                            >
                                                Numéro de la pièce d’identité
                                            </label>
                                            <div className='form-group'>
                                                <input
                                                    type='text'
                                                    id='pieceNumber'
                                                    className='form-control'
                                                    placeholder='Numéro de la pièce d’identité'
                                                    defaultValue={pieceNumber} 
                                                    onChange={(event)=>setPieceNumber(event.target.value)}
                                                />
                                            </div>
                                        </div >
                                        <div className="form-group">
                                            <label
                                                htmlFor="validityDate"
                                                className="text-blackish-blue mb-2"
                                            >
                                                Date Validité 
                                            </label>
                                            <div className='form-group'>
                                                <input
                                                    type='date'
                                                    id='firstName'
                                                    className='form-control'
                                                    placeholder='Date Validité '
                                                    defaultValue={validityDate} 
                                                    onChange={(event)=>setValidityDate(event.target.value)}
                                                />
                                            </div>
                                        </div >
                                        <div className="form-group col-lg-3 col-md-3"></div>

                                        <div className="form-group col-lg-6 col-md-6 ">
                                            {statutRecto==="0" ? (
                                                <button className="btn btn-primary "
                                                    type='button'  
                                                    disabled={isLoggingIn}
                                                    onClick={()=>setStatutRecto("1")}
                                                >
                                                    Déclencher la caméra pour prendre la photo du Recto 
                                                </button>
                                            ) : ("")}


                                            {/* Cette partie s'affciche lorsqu'on clique sur le bouton ci-dessus */}
                                            {statutRecto==="1" ? (
                                            <>
                                            <label
                                                htmlFor="picture"
                                            >
                                                Recto de votre justificatif d'identité
                                            </label>
                                             {/* Si on a pas encore pris la photo on affiche la camera */}
                                            {!imageRecto ? (
                                            <Webcam
                                                audio={false}
                                                height={350}
                                                ref={webcamRefRecto}
                                                screenshotFormat="image/jpeg"
                                                width={350}
                                            />
                                            ) : ("")}
                                            {/* Fin */}

                                            {/* Si on a pas encore pris la photo on affiche ce bouton */}
                                            {!imageRecto ? (
                                                <button type='button' onClick={captureRecto}>Sauvegarder</button>
                                            ) : ("")}
                                            {/* Fin */}
                                            

                                            {/* Si on a pris la photo et qu'on veut reprende on affiche on clique sur ce bouton */}
                                            {imageRecto ? (
                                                <button type='button' onClick={()=>setImageRecto("")}>Reprendre la photo</button>
                                            ) : ("")}
                                            {/* Fin */}

                                            {/* Pour afficher l'image qui a été prise        */}
                                            {imageRecto && <img src={imageRecto} alt="Selfie" />}
                                            {/* Fin*/}
                                            </>
                                        ) : ("")}
                                        </div>
                                        
                                        
                                        <div className="form-group col-lg-3 col-md-3"></div>
                                         
                                        
                                    </div>
                                    
                                    {/* Fin Recto */}

                                    {/* Verso */}
                                    <div className="form-group row mt-3">
                                        <div className="form-group col-lg-3 col-md-3"></div>
                                        
                                        <div className="form-group col-lg-6 col-md-6 ">
                                            {imageRecto ? (
                                                statutVerso ==="0"? (

                                                    <button className="btn btn-primary "
                                                        type='button'  
                                                        disabled={isLoggingIn}
                                                        onClick={()=>setStatutVerso("1")}
                                                    >
                                                        Déclencher la caméra pour prendre la photo du verso 
                                                    </button>
                                                ) : ("")
                                            ) : ("")}

                                            {statutVerso ==="1"? (
                                                <>
                                            <label
                                                htmlFor="picture"
                                            >
                                                Verso de votre justificatif d'identité
                                            </label>
                                            {/* Si on a pas encore pris la photo on affiche la camera */}
                                            {!imageVerso ? (
                                            <Webcam
                                                audio={false}
                                                height={350}
                                                ref={webcamRefVerso}
                                                screenshotFormat="image/jpeg"
                                                width={350}
                                            />
                                            ) : ("")}
                                            {/* Fin */}

                                            {/* Si on a pas encore pris la photo on affiche ce bouton */}
                                            {!imageVerso  ? (
                                                <button type='button' onClick={captureVerso}>Sauvegarder</button>
                                            ) : ("")}
                                            {/* Fin */}
                                            

                                            {/* Si on a pris la photo et qu'on veut reprende on affiche on clique sur ce bouton */}
                                            {imageVerso ? (
                                                <button type='button' onClick={()=>setImageVerso("")}>Reprendre la photo</button>
                                            ) : ("")}
                                            {/* Fin */}

                                            {/* Pour afficher l'image qui a été prise        */}
                                            {imageVerso && <img src={imageVerso} alt="Selfie" />}
                                            {/* Fin*/}
                                            </>
                                        ) : ("")}

                                        </div>
                                        
                                        <div className="form-group col-lg-3 col-md-3"></div>
                                    </div>
                                    {/* Fin verso */}
                                    {statut==="1" && imageVerso && imageRecto ? (

                                        <div className="form-group mb-6 mt-3 col-lg-12 col-md-12  row justify-content-between">
                                            <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">
                                                <a
                                                    className=""
                                                >
                                                    <button className="btn btn-primary " onClick={actualiser} type='button'  > Précédente </button>
                                                </a>  
                                            </div> 

                                            <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">
                                                <button className="btn btn-primary " type='button' onClick={addFichierPhoto}  disabled={isLoggingIn}>Suivant</button>
                                            </div> 
                                        </div>

                                        // <a
                                        // className=""
                                        // >
                                        //     <button className="btn btn-primary " type='button' onClick={addFichierPhoto}  disabled={isLoggingIn}>Suivant</button>
                                        // </a> 
                                    ) :("")}
                                    </form>
                                </>
                            ) :("")}
                            {/* Fin */}
                            {statut==="0" ? (
                                <>
                                
                                    {typeJustificatif==="Passeport"  || typeJustificatif==="Permis de conduire" || typeJustificatif==="Titre de séjour" || typeJustificatif==="Carte d'identité" || typeJustificatif==="Autre"? 
                                    (
                                        <div className="form-group mb-6 mt-3 col-lg-12 col-md-12  row justify-content-between">
                                        <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">
                                            {/* <Link href='/profil/kyc/particulier/seconde-phase/' className="align-right"> */}
                                            <form>
                                            
                                                <a
                                                onClick={actualiser}
                                                className=""
                                                >
                                                    <button className="btn btn-primary " type='button'  > Précédente </button>
                                                </a>  
                                            </form> 
                                            {/* </Link>                           */}
                                        </div> 

                                        <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">
                                        <form>
                                            <a
                                            className=""
                                            >
                                                <button className="btn btn-primary "
                                                    type='button'  
                                                    disabled={isLoggingIn}
                                                    onClick={()=>setStatut("1")}
                                                >
                                                    Suivant
                                                </button>
                                            </a> 
                                        </form>                         
                                        </div> 
                                        </div>
                                        
                                    ) :("")}
                                </>
                            ) : ("")}

                           
                            {statut==="1" ? (''
                                // <Link href='/profil/kyc/particulier/justificatif-domicile' className="align-right">
                                    // <a
                                    // className=""
                                    // >
                                    //     <button className="btn btn-primary " type='button' onClick={addFichierPhoto}  disabled={isLoggingIn}>Suivant</button>
                                    // </a>
                                // </Link>
                            ) :("")}

                        {/* </form>   */}
                             
                    </div>
                <div className='col-lg-3 col-md-12'></div>
            </div>
        </div>









        {/* ************************************************************************************************** */}
            {/* MODAL D'IMPORTATION D'UN FICHIER */}
        {/* ************************************************************************************************** */}

        <Modal isOpen={modalFile} toggle={() => setModalFile(false)}>
            <div className=" modal-body p-0">
                <Card className="  shadow border-0">
                    <CardBody className=" px-lg-5 py-lg-5">
                        <div className="  text-muted mb-4">
                            <h4 className='text-center'>
                                Justificatif d'identité 
                            </h4>
                            <div className="form-group row mt-3">
                                <form>
                                    <div className="form-group mb-6">
                                        <label
                                            htmlFor="picture"
                                        >
                                            Recto de justificatif d'identité
                                        </label>
                                        <input
                                            className="form-control border mt-3 bg-white"
                                            type="file" 
                                            name="myImage"
                                            accept="image/*" 
                                            id='picture'
                                            // onChange={uploadToClient}
                                        />
                                    </div>
                                    <div className="form-group mb-6">
                                        <label
                                            htmlFor="picture"
                                        >
                                            Verso
                                        </label>
                                        <input
                                            className="form-control  border mt-3"
                                            type="file" 
                                            name="myImage"
                                            accept="image/*" 
                                            id='picture'
                                            // onChange={uploadToClient}
                                        />
                                    </div>
                                </form>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </Modal>
        {/* *********************************FIN****************************************************************/}












    </>
  );
};

export default SecondKyc;
