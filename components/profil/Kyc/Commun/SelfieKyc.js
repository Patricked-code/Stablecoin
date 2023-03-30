import { useCallback, useState, useEffect, useRef  } from 'react';
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

// FIN


const SelfieKyc = () => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API

    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [messageError, setMessageError] = useState();

   // State Pour Camera photo
   const webcamRef = useRef(null)
   const [imageSrc, setImageSrc] = useState(null)
   // Fin

    //    State de l'envoie du selfie
    const [userPicture, setUserPicture] = useState()



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


   // Fonction pour prendre photo
   const capture = () => {
       const image = webcamRef.current.getScreenshot()
       setImageSrc(image)
   }
   // Fin


    // Fonction d'envoie des informations du fichiers en photo pour le profil particulier
    const addUserPicture= useCallback(async () => {
        setIsLoggingIn(true);
        try {
            
            const dataa = {
                userPicture:imageSrc,
            }

            const token = localStorage.getItem('tokenEnCours') //Le token récuperé

            const result = await fetch(`${API_URL}/api/kyc/particular/add-kyc-selfie`, {
            method:"PUT",
            body: JSON.stringify(dataa),
            headers: {
                'Content-Type': 'application/json',
                Authorization:  `Bearer ${token}`
            }
            })
            const data = await result.json();
            console.log("data=>",data)
        
            /* Verifier s'il y a un messsage d'erreur on l'affiche dans SWAL 
            * sinon on affiche le message de succès
            */
            if (data.message===200) {
            Swal.fire({
                position: 'center',
                icon: 'success',
                html: `<p> Votre photo a été sauvegardée avec succès.</p>` ,
                showConfirmButton: false,
                timer: 5000
            }),
            setTimeout(() => {
            Router.push("/profil/kyc/commun/signature"); 
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
        
    }, [userPicture,imageSrc]);
    // Fin


    // Fonction d'envoie des informations du fichiers en photo pour le profil entreprise
    const addUserPictureLeader= useCallback(async () => {
        setIsLoggingIn(true);
        try {
            
            const dataa = {
                userPictureLeader:imageSrc,
            }

            const token = localStorage.getItem('tokenEnCours') //Le token récuperé

            const result = await fetch(`${API_URL}/api/kyc/entreprise/add-kyc-selfie`, {
            method:"PUT",
            body: JSON.stringify(dataa),
            headers: {
                'Content-Type': 'application/json',
                Authorization:  `Bearer ${token}`
            }
            })
            const data = await result.json();
            console.log("data=>",data)
        
            /* Verifier s'il y a un messsage d'erreur on l'affiche dans SWAL 
            * sinon on affiche le message de succès
            */
            if (data.message===200) {
            Swal.fire({
                position: 'center',
                icon: 'success',
                html: `<p> Votre photo a été sauvegardée avec succès.</p>` ,
                showConfirmButton: false,
                timer: 5000
            }),
            setTimeout(() => {
            Router.push("/profil/kyc/commun/signature"); 
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
        
    }, [userPicture,imageSrc]);
    // Fin


  return (
    <>

        <div className='' >
            <div className=' mx-15'>
                <div className='py-10'>
                    <h1 className='text-center'>Photo</h1>
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
                <div className='col-lg-3 col-md-3'></div>

                    <div className='m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white cryptocurrency-search-box login-form col-lg-6 col-md-6'>
                        <form className=''>
                            <div className="form-group row mt-3 text-center">
                                {currentUser?.activated && currentUser?.codeTypeProfil==="entCom"? (
                                    <label
                                        htmlFor="Q1"
                                        className="text-blackish-blue mb-2"
                                    >
                                        Merci de prendre une photo du dirigeant de l'entreprise
                                    </label>

                                ) :(
                                    <label
                                        htmlFor="Q1"
                                        className="text-blackish-blue mb-2"
                                    >
                                        Merci de prendre une photo de vous
                                    </label>
                                )}
                                <div className="form-group col-lg-3 col-md-3"></div>

                                <div className="form-group col-lg-6 col-md-6 ">
                                    {/* Si on a pas encore pris la photo on affiche la camera */}
                                    {!imageSrc ? (
                                    <Webcam
                                        audio={false}
                                        height={350}
                                        ref={webcamRef}
                                        screenshotFormat="image/jpeg"
                                        width={350}
                                    />
                                    ) : ("")}
                                    {/* Fin */}

                                    {/* Si on a pas encore pris la photo on affiche ce bouton */}
                                    {!imageSrc ? (
                                        <button type='button' onClick={capture}>Sauvegarder</button>
                                    ) : ("")}
                                    {/* Fin */}
                                    

                                    {/* Si on a pris la photo et qu'on veut reprende on affiche on clique sur ce bouton */}
                                    {imageSrc ? (
                                        <button type='button' onClick={()=>setImageSrc("")}>Reprendre la photo</button>
                                    ) : ("")}
                                    {/* Fin */}

                                     {/* Pour afficher l'image qui a été prise        */}
                                    {imageSrc && <img src={imageSrc} alt="Selfie" />}
                                     {/* Fin*/}
                                        
                                </div>
                                <div className="form-group col-lg-3 col-md-3"></div>

                            </div>
                            {/* Fin */}
                            {imageSrc? (
                                <>
                                    
                                    {currentUser?.activated && currentUser?.codeTypeProfil==="entCom"? (
                                        <div className="form-group mb-6 mt-3 col-lg-12 col-md-12  row justify-content-between">
                                        <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">
                                            <Link href='/profil/kyc/entreprise/justificatif-identite/' className="align-right">
                                                <a
                                                className=""
                                                >
                                                    <button className="btn btn-primary " type='button'  > Précèdente </button>
                                                </a>   
                                            </Link>                          
                                        </div> 

                                        <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">
                                            <button className="btn btn-primary " onClick={addUserPictureLeader} type='button'  disabled={isLoggingIn}>Suivant</button>
                                        </div> 
                                        </div>

                                    ):(
                                        <div className="form-group mb-6 mt-3 col-lg-12 col-md-12  row justify-content-between">
                                        <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">
                                            <Link href='/profil/kyc/particulier/justificatif-domicile/' className="align-right">
                                                <a
                                                className=""
                                                >
                                                    <button className="btn btn-primary " type='button'  > Précèdentee </button>
                                                </a>   
                                            </Link>                          
                                        </div> 

                                        <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">
                                            <button className="btn btn-primary " onClick={addUserPicture} type='button'  disabled={isLoggingIn}>Suivant</button>
                                        </div> 
                                        </div>

                                    )}
                                </>
                            ) : ("")}

                                
                            {/* </Link> */}
                        </form>  
                             
                    </div>
                <div className='col-lg-3 col-md-3'></div>
            </div>
        </div>
    </>
  );
};

export default SelfieKyc;
