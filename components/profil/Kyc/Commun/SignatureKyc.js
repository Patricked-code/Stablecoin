import { useState, useEffect, useRef } from 'react';
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

// FIN

const SignatureKyc = () => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API

    const [isLoggingIn, setIsLoggingIn] = useState(false);

    // Pour la signature
    const signatureRef = useRef(null)
    const [signatureData, setSignatureData] = useState(null)

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
  
    const clear = () => {
      signatureRef.current.clear()
    }
  
    const save = () => {
      const data = signatureRef.current.getTrimmedCanvas().toDataURL('image/png')
      setSignatureData(data)
      console.log("data=>",data)
    }
    // Fin

   


  return (
    <>

        <div className='' >
            <div className=' mx-15'>
                <div className='py-10'>
                    <h1 className='text-center'>Signature</h1>
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
                                {currentUser?.activated && currentUser?.codeTypeProfil==="entCom"? (
                                    <label
                                        htmlFor="Q1"
                                        className="text-blackish-blue mb-2"
                                    >
                                        Merci de signer dans la case ci-dessous(Signature du dirigeant de l'entreprise)
                                    </label>

                                ) :(
                                    <label
                                        htmlFor="Q1"
                                        className="text-blackish-blue mb-2"
                                    >
                                        Merci de signer dans la case ci-dessous

                                    </label>
                                )}
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
                                    {/* <div className="form-group row mt-3 text-center">
                                        <div className="form-group col-lg-6 col-md-6 ">
                                            <button type='button' onClick={()=>setSignatureData("")}>Effacer</button>
                                        </div>

                                        <div className="form-group col-lg-6 col-md-6 ">
                                            <button type='button' onClick={save}>Sauvegarder</button>
                                        </div>
                                    
                                    </div> */}
                                    {signatureData && <img src={signatureData} alt="Signature" className='mt-3' />}
                                </div>
                            <div className="form-group col-lg-3 col-md-3"></div>

                            </div>
                            {/* Fin */}

                            <button className="btn btn-primary " type='button'  disabled={isLoggingIn}>Envoyer</button>

                            {/* <Link href='/profil/kyc/particulier/seconde-phase'>
                                <a
                                className=""
                                >
                                    <button className="btn btn-primary " type='button'  disabled={isLoggingIn}>Suivant</button>
                                </a>
                            </Link> */}
                        </form>  
                             
                    </div>
                <div className='col-lg-3 col-md-3'></div>
            </div>
        </div>
    </>
  );
};

export default SignatureKyc;
