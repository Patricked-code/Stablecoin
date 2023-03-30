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

// FIN


// FIN

const CJustificatifIdentity = () => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API

    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [messageError, setMessageError] = useState(false);
    

    const [modalFile, setModalFile] = React.useState(false);


    const [statut, setStatut] = React.useState("0");
    const [statutRecto, setStatutRecto] = React.useState("0");
    const [statutVerso, setStatutVerso] = React.useState("0");

    // State de question 0
    const [typeJustificatif, setTypeJustificatif] = useState('default');

    // Fin
    const [selected, setSelected] = useState('file');

    // State du type de justificatif et pour les fichiers
    const [firstNameLeader, setFirstNameLeader] = useState(); // Nom du dirigeant
    const [lastNameLeader, setLastNameLeader] = useState(); //Prenom du dirigeant
    const [cniFrontLeader, setCniFrontLeader] = useState(null); //Recto du justificatif
    const [cniBackLeader, setCniBackLeader] = useState(null); //Verso du justificatif

    

    
    
    
    
    
    
    
    
 



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



    
 // FONCTION DE L'ENVOIE DES INFORMATIONS DU JUSTICATIF DANS LA DB
 const [createObjectURL, setCreateObjectURL] = useState(null);

 const uploadToClientRecto = (event) => {
     if (event.target.files && event.target.files[0]) {
     const i = event.target.files[0];

     setCniFrontLeader(i);
     setCreateObjectURL(URL.createObjectURL(i));
     }
 };


 const uploadToClientVerso = (event) => {
     if (event.target.files && event.target.files[0]) {
     const i = event.target.files[0];

     setCniBackLeader(i);
     setCreateObjectURL(URL.createObjectURL(i));
     }
 };

  // FONCTION D'AJOUT DU TYPE DE JUSTIFICATIF ET SES FICHIER
  const AddReceipt = async () => {
      const token = localStorage.getItem('tokenEnCours')

      const body = new FormData();
      body.append("firstNameLeader", firstNameLeader);
      body.append("lastNameLeader", lastNameLeader);
      body.append("cniFrontLeader", cniFrontLeader);
      body.append("cniBackLeader", cniBackLeader);
      
      const result = await fetch(`${API_URL}/api/kyc/entreprise/add-kyc-identity`, {
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
        Router.push("/profil/kyc/commun/selfie"); 
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

    // actualiser la page
    const actualiser = ()=>{
        setTimeout(() => {
            window.location.reload()
        }, 1000)
    }






  return (
    <>

        <div className='' >
            <div className=' mx-15'>
                <div className='py-10'>
                    <h1 className='text-center'>Justificatif d'identité du dirigeant</h1>
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
                            {/* {typeJustificatif==="Passeport"  || typeJustificatif==="Permis de conduire" || typeJustificatif==="Titre de séjour" || typeJustificatif==="Carte d'identité" || typeJustificatif==="Autre"? ("") :( */}
                            {statut=="0"?(
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
                            ):("")}
                            {/* Fin Q0 */}

                            

                            {/* Question 1 */}
                            {typeJustificatif==="Passeport"  || typeJustificatif==="Permis de conduire" || typeJustificatif==="Titre de séjour" || typeJustificatif==="Carte d'identité" || typeJustificatif==="Autre"? (
                                <>
                                <div className="form-group mb-6 mt-3">
                                {/* <label
                                    htmlFor="Q1"
                                    className="text-blackish-blue mb-2"
                                >
                                     Choisissez une option pour soumettre les fichiers de votre Justificatif d'identité
                                <br/>
                                </label> */}
                            </div >
                              {/* Les bouton de choix  */}
                            {/* {statut==="0" ? (
                            <div  className="form-group row mt-3">

                                <div  className="form-group ">
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

                                
                            </div>
                            
                            ) :('') } */}
                            </>
                            ) : ("")}
                            {/* Fin */}


                            {/* Si selected est file on affiche ce formulaire pour importer des fichiers */}
                            {/* {selected==="file" && statut==="1" ? ( */}
                            {statut==="1" ? (

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
                                            name="firstNameLeader"
                                            id='firstNameLeader'
                                            defaultValue={firstNameLeader} 
                                            onChange={(event)=>setFirstNameLeader(event.target.value)}
                                        /> 
                                    </div>

                                    <div className="form-group my-6">
                                        <label
                                            htmlFor="nom"
                                            className='mb-6'
                                        >
                                            Prénom du dirigeant de l'entreprise
                                        </label>
                                        <input
                                            className="form-control border mt-3 bg-white"
                                            type="text" 
                                            name="lastNameLeader"
                                            id='lastNameLeader' 
                                            defaultValue={lastNameLeader} 
                                            onChange={(event)=>setLastNameLeader(event.target.value)}
                                            
                                        /> 
                                    </div>


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
                                                <button className="btn btn-primary " onClick={actualiser} type='button'  > Précèdente </button>
                                            </a> 
                                        </div> 

                                        <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">
                                            <a
                                            className=""
                                            >
                                                <button className="btn btn-primary " type='button' onClick={AddReceipt}  disabled={isLoggingIn}>Suivant</button>
                                            </a>
                                        </div> 
                                    </div>
                                    
                            ) :("")}
                                </form>
                            </div>
                            ) :("")}
                            {/* Fin */}
                            {/* {typeJustificatif==="Passeport"  || typeJustificatif==="Permis de conduire" || typeJustificatif==="Titre de séjour" || typeJustificatif==="Carte d'identité" || typeJustificatif==="Autre"? ("") :( */}

                            {statut==="0"&& typeJustificatif==="Passeport"  || typeJustificatif==="Permis de conduire" || typeJustificatif==="Titre de séjour" || typeJustificatif==="Carte d'identité" || typeJustificatif==="Autre" ? (
                                <form>
                                    <div className="form-group mb-6 mt-3 col-lg-12 col-md-12  row justify-content-between">
                                        
                                        <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">
                                            <Link href='/profil/kyc/entreprise/justificatif-domicile/' className="align-right">
                                                <a
                                                    className=""
                                                >
                                                    <button className="btn btn-primary " type='button'  > Précèdente </button>
                                                </a> 
                                            </Link> 
                                        </div> 

                                        <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">
                                            <button className="btn btn-primary "
                                                type='button'  
                                                disabled={isLoggingIn}
                                                onClick={()=>setStatut("1")}
                                            >
                                                Suivant
                                            </button>
                                        </div> 
                                    </div>
                                </form>

                            ) :("")}

                            {/* <form>
                            
                            {statut==="0" ? (
                                <button className="btn btn-primary "
                                    type='button'  
                                    disabled={isLoggingIn}
                                    onClick={()=>setStatut("1")}
                                >
                                    Suivant
                                </button>
                            ) :("")}
                            </form> */}

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
                                Justificatif d'identité du dirigéant de l'entreprise
                            </h4>
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
                                            name="firstNameLeader"
                                            id='firstNameLeader'
                                            defaultValue={firstNameLeader} 
                                            onChange={(event)=>setfirstNameLeader(event.target.value)}
                                        /> 
                                    </div>

                                    <div className="form-group my-6">
                                        <label
                                            htmlFor="nom"
                                            className='mb-6'
                                        >
                                            Prénom du dirigeant de l'entreprise
                                        </label>
                                        <input
                                            className="form-control border mt-3 bg-white"
                                            type="text" 
                                            name="lastNameLeader"
                                            id='lastNameLeader' 
                                            defaultValue={firstNameLeader} 
                                            onChange={(event)=>setFirstNameLeader(event.target.value)}
                                            
                                        /> 
                                    </div>
                                    <div className="form-group mb-6">
                                        <label
                                            htmlFor="picture"
                                        >
                                            Recto de justificatif d'identité
                                        </label>
                                        <input
                                            className="form-control border mt-3 bg-white"
                                            type="file" 
                                            name="lastNameLeader"
                                            id='lastNameLeader'
                                            defaultValue={lastNameLeader} 
                                            onChange={(event)=>setLastNameLeader(event.target.value)}
                                           
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

export default CJustificatifIdentity;
