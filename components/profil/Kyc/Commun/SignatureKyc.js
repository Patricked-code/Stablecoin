import { useCallback, useState, useEffect, useRef } from 'react';
import React from "react";
import axios from 'axios';
import Link from 'next/link';
import { Icon } from '@iconify/react';

// Pour la signature
import SignatureCanvas from 'react-signature-canvas'


// Pour Magic
import { magic } from "../../../../magic";
import { ethers } from "ethers";
import Loading from "../../../loading";
import Router from "next/router";
import Swal from 'sweetalert2';
import Web3 from "web3";
import ProgressBar from '../ProgressBar';

// FIN

const SignatureKyc = () => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API

    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [messageError, setMessageError] = useState(false);

    // Pour la signature
    const signatureRef = useRef(null)
    const [signatureData, setSignatureData] = useState(null)

    const [currentUser, setCurrentUser] = useState();
    const [provider, setProvider] = useState(null);

    //    State d'envoie des données de la signature
    const [userSignature, setUserSignature] = useState();



    const [currentKycStatut, setCurrentKycStatut] = useState();

    //localStorage pour récupérer une valeur en cliquant sur un bouton Recompleter qui indique qu'on veut modifier une partie Kyc 
    useEffect(() => {
        const kycStatut = localStorage.getItem('currentUpdateKycStatut')  
        setCurrentKycStatut(kycStatut)
    }, [currentKycStatut]);
   
   
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
  
    const clear = () => {
      signatureRef.current.clear()
    }
  
    const save = () => {
      const data = signatureRef.current.getTrimmedCanvas().toDataURL('image/png')
      setSignatureData(data)
    }
    // Fin


    // Fonction d'envoie des informations de la signature pour le profil particulier
    const addUserSignature= useCallback(async () => {
        setIsLoggingIn(true);
        try {
            
            const dataa = {
                userSignature:signatureData,
            }

            const token = localStorage.getItem('tokenEnCours') //Le token récuperé

            const result = await fetch(`${API_URL}/api/kyc/particular/add-kyc-signature`, {
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
                html: `<p> Votre signature a été sauvegardée avec succès.</p>` ,
                showConfirmButton: false,
                timer: 5000
            }),
            setTimeout(() => {
            Router.push("/profil/"); 
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
        
    }, [userSignature,signatureData]);
    // Fin

    // La barre de progression de KYC du profil particulier
    const steps = ["AML 1 & 2","FATCA", "Identité 1 & 2", "Selfie", "Domicile", "Photo", "Signature"];
    const activeStep = 5;
    // Fin

  return (
    <>
       
        <ProgressBar className="mb-15" steps={steps} activeStep={activeStep} />
        
        <div className='' >
            <div className=' mx-15'>
                <div className='py-10'>
                    <br/><br/><h1 className='text-center'>Signature</h1>
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

                    <div className='m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white cryptocurrency-search-box login-form col-lg-6 col-md-12'>
                        <form className=''>
                            {/* Question 2 */}
                            <div className="form-group mb-6 mt-3 text-center">
                                
                                <label
                                    htmlFor="Q1"
                                    className="text-blackish-blue mb-2"
                                >
                                    Merci de signer dans la case ci-dessous

                                </label>
                            </div >
                            <div className="form-group row mt-3 text-center">
                            <div className="form-group col-lg-3 col-md-3"></div>

                                <div className="form-group col-lg-6 col-md-6 ">
                                    {!signatureData? (
                                    <SignatureCanvas
                                        className=" card"
                                        canvasProps={{ width: 250, height: 200, className: 'sigCanvas bg-secondary text-white' }}
                                        ref={signatureRef}
                                    />
                                    ) : ('')}
                                            
                                    {signatureData? (
                                        <button type='button' onClick={()=>setSignatureData("")}>Reprendre la signature</button>
                                    ) : ('')}

                                    {!signatureData? (
                                    <button type='button' onClick={save}>Sauvegarder</button>
                                    ) : ('')}
                                    
                                    {signatureData && <img src={signatureData} alt="Signature" className='mt-3' />}
                                </div>
                            <div className="form-group col-lg-3 col-md-3"></div>

                            </div>
                            {/* Fin */}
                            {signatureData?(
                                <>
                                    
                                        <div className="form-group mb-6 mt-3 col-lg-12 col-md-12  row justify-content-between">
                                        <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">
                                            <Link href='/profil/kyc/commun/selfie/' className="align-right">
                                                <a
                                                className=""
                                                >
                                                    <button className="btn btn-primary " type='button'  > Précédente </button>
                                                </a>   
                                            </Link>                          
                                        </div> 

                                        <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">
                                            <button className="btn btn-primary " type='button' onClick={addUserSignature}  disabled={isLoggingIn}>Envoyer</button>
                                        </div> 
                                    </div>
                                </>
                            ):("")}


                            
                        </form>  
                             
                    </div>
                <div className='col-lg-3 col-md-3'></div>
            </div>
        </div>
    </>
  );
};

export default SignatureKyc;
