import { useState, useEffect, useCallback } from 'react';
import React from "react";
import axios from 'axios';
import Link from 'next/link';
import { Icon } from '@iconify/react';


// Pour Magic
import { magic } from "../../../magic";
import { ethers } from "ethers";
import Loading from "../../loading";
import Router from "next/router";
import Swal from 'sweetalert2';
import Web3 from "web3";

// FIN



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

const InfosConnexion = () => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API
     // Variable de l'api key de stablecoin
     const API_KEY_STABLECOIN = process.env.NEXT_PUBLIC_API_KEY_STABLECOIN
    
    const [isLoggingIn, setIsLoggingIn]=useState(false)
    const [messageError, setMessageError]=useState()
    

    const [oldPassword, setOldPassword] = useState()
    const [newPassword, setNewPassword] = useState()
    const [confirmPassword, setConfirmPassword] = useState()

     // FONCTION DE LA DECONNEXION
    const logaout = useCallback(() => {
      try {
      magic.user.logout().then(() => {
      
      });
    } catch (error) {
      console.log("une erreur s'est produit =>", error)
    }
    }, [Router]);
    // FIN

    const changePassword = async (event) => {
      event.preventDefault();
      setIsLoggingIn(true);
      try {

        // Obtenir le token en cours
        const token = localStorage.getItem('tokenEnCours');

          const dataa = {
              oldPassword:oldPassword,
              newPassword:newPassword,
              confirmPassword:confirmPassword,
          }
          
          // Pour connexion simple
          const res = await fetch(`${API_URL}/api/user/change-password`, {
              method:"PUT",
              body: JSON.stringify(dataa),
              headers: {
                  'Content-Type': 'application/json',
                  'x-api-key': `${API_KEY_STABLECOIN}`,
                  Authorization: `Bearer ${token}`

              }
          })
          const data = await res.json();
          if (data.message=="200") {
              Swal.fire({
                  position: 'center',
                  icon: 'success',
                  html: "<p>Votre mot de passe a été changé avec succès</p>" ,
                  showConfirmButton: false,
                  timer: 10000
              })
              logaout() //Appel de la fonction de déconnection à magic
              setTimeout(() => {
                  Router.push("/auth/authentication");
              }, 10000)
          }else{
              setMessageError(data.message)
              setIsLoggingIn(false);
              Swal.fire({
                  position: 'center',
                  icon: 'error',
                  html: `<p>${data.message}</p>` ,
                  showConfirmButton: false,
                  timer: 10000
              })
          }
      } catch(error) {
          setIsLoggingIn(false);
          console.log("Erreur =>",error)
      }
    };

  return (
    <>

      <div className='' >
        <div className=' mx-15'>
            <div className='py-10'>
                <h1 className='text-center'>Infos de connexion</h1>
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
                        <form className='' onSubmit={changePassword}>
                        <div className='col-lg-12 col-md-12 row justify-content-between'>

                            <div className='input-group-alternative my-3'>
                                <label className="mx-2">Mot de passe actuel</label>
                                <input
                                  type='password'
                                  name='oldPassword'
                                  required='required'
                                  placeholder="Mot de passe actuel"
                                  className="form-control"
                                  defaultValue={oldPassword} 
                                  onChange={(event)=>setOldPassword(event.target.value)}
                                />
                            </div>
                            
                                <div className='input-group-alternative my-3'>
                                    <label className="mx-2">Nouveau mot de passe</label>
                                    <input
                                        type='password'
                                        name='newassword'
                                        required='required'
                                        placeholder="Nouveaux mot de passe"
                                        className="form-control"
                                        value={newPassword} 
                                        onChange={(event)=>setNewPassword(event.target.value)}
                                    />
                                </div>

                              <div className='input-group-alternative my-3'>
                                <label className="mx-2">Confirmer le nouveau mot de passe </label>
                                <input
                                  type='password'
                                  name='confirmePassword'
                                  required='required'
                                  placeholder="Confirmer le mot de passe"
                                  className="form-control"
                                  defaultValue={confirmPassword} 
                                  onChange={(event)=>setConfirmPassword(event.target.value)}
                                />
                            </div>
                            </div>
                            <button type='submit'  className="btn btn-primary" disabled={isLoggingIn}>Changer</button>
                        </form>       
                    </div>
                <div className='col-lg-3 col-md-12'></div>
            </div>

       
      </div>

    </>
  );
};

export default InfosConnexion;
