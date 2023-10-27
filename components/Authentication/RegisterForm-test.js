import React from 'react';
import Link from 'next/link';
import axios from 'axios';


import { useCallback, useState, useEffect } from 'react';
import { Row, Col, Container } from "react-bootstrap";
import Router from 'next/router';
import { magic } from '../../magic';
import Swal from 'sweetalert2';
import LoginForm from './LoginForm';





function RegisterForm() {
  // Variable de l'url de l'api
  const API_URL =process.env.NEXT_PUBLIC_URL_API;

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [messageError, setMessageError] = useState("")


  // Pour le formulaire d'enregistrement
  const [codeProfile, setCodeProfile] = useState("p");
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState()
  const [codeTypeProfil, setCodeTypeProfil] = useState("")

  // Recuperer tous les types de profil
  const [allTypeProfil, setAllTypeProfil] = useState("")
  const [infosOtherUser, setInfosOtherUser] = useState("")

  


  /**
   * Perform login action via Magic's passwordless flow. Upon successuful
   * completion of the login flow, a user is redirected to the homepage.
   */
  const login = useCallback(async () => {
    setIsLoggingIn(true);

    try {
      // Grab auth token from loginWithMagicLink
      const didToken = await magic.auth.loginWithMagicLink({
        email,
        redirectURI: new URL('/callback', window.location.origin).href,
      });

    } catch {
      setIsLoggingIn(false);
    }
  }, [email]);

  /**
   * Saves the value of our email input into component state.
   */
  const handleInputOnChange = useCallback((event) => {
    setEmail(event.target.value);
  }, []);



  const handleSubmit = async (event) =>{
    setIsLoggingIn(true)
      event.preventDefault();

      const dataa = {
        // codeProfile:codeProfile,
        email:email,
        password:password,
        confirmPassword:confirmPassword,
        codeTypeProfil:codeTypeProfil
      }
      
      if (!dataa.codeTypeProfil=="" && dataa.codeTypeProfil) {
        const result= await fetch(`${API_URL}/api/session/register`, {
            method:"POST",
            body: JSON.stringify(dataa),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        // .then(data => {
      const data = await result.json();

          if (data.message) {
            setMessageError(data.message)
            setIsLoggingIn(false);
        }

        if(data.message ==="Utilisateur déjà existant"){
          Swal.fire({
            position: 'center',
            icon: 'info',
            html: "<p   class='colorRed card text-red'>Ce compte existe déjà mais n'est peut-être pas activé.<br/>Merci de vous connecter pour l'activer si c'est pas encore fait. </p>" ,
            showConfirmButton: false,
            timer: 15000
          })
        }
        if (data.success==true) {
          //Pour magic Grab auth token from loginWithMagicLink
          const didToken = await magic.auth.loginWithMagicLink({
            email,
            // redirectURI: new URL('/account/firstEdition', window.location.origin).href,
            redirectURI: new URL('/callback_register', window.location.origin).href,
          }); 
          // Fin

            // Swal.fire({
            //   position: 'center',
            //   icon: 'success',
            //   html: "<p> Votre inscription s'est effectuée avec succès </p>" ,
            //   showConfirmButton: false,
            //   timer: 5000
            // })


        }
        //  Actualiser après l'affichage 
        
          // Router.push("/account/activated"); 
        // Fin
        // })
        // .catch(error => {
        //   handle error
        //   console.log(error);
        //   setIsLoggingIn(false);


        // });
      }else{
        setMessageError("Veuillez choisir un type de profil")
        setIsLoggingIn(false);
      }

      

      // Swal.fire({
      //   position: 'center',
      //   icon: 'success',
      //   html: "<p> Votre inscription s'est effectuée avec succès </p>" ,
      //   showConfirmButton: false,
      //   timer: 5000
      // })
      //  Actualiser après l'affichage 
      
        // Router.push("/auth/authentication"); 
      // Fin

      
  }

  // RECUPERER TOUS LES TYPES DE PROFILE
  useEffect(() => {
    const getAllWayProfil = async () => {
    const resProfil = await fetch(`${API_URL}/api/user/find-all-way-profile`, {
        headers: {
        'Content-Type': 'application/json',
        },
    })
        .then((resProfil) => resProfil.json())
        .then((profil) => {
        setAllTypeProfil(profil)
    console.log("allTypeProfil=>",profil)

        }) 

    };
    getAllWayProfil();
  }, []);
  // FIN


  // Obtenir un utilisateur en fonction de son email 
  const searchUserWithEmail = () =>{
    if (email) {
      const getUser = async (_email) => {
      
          const result = await fetch(`${API_URL}/api/user/find-user-by-email?email=${_email}`, {
              headers: {
              'Content-Type': 'application/json',
              },
          })
              .then((result) => result.json())
              .then((user) => {
                setInfosOtherUser(user)
              }) 
      
          };
          
            getUser(email);
        
    }
  }
  // FIN


  return (
    <>
      <div className='col-lg-3 col-md-12'></div>
      <div  className='col-lg-6 col-md-12 '>
        <div className='register-form '>
          <h2 className='text-center'>Inscription</h2>
          {messageError? (
            <Col lg="12" md="12" sm="12" className="mb-5 text-center ">
                <div className="pricing-card bg-red gr-hover-shadow-1 border text-left pt-9 pb-9 pe-3 px-3 rounded-10">
                <div className="price-content">
                    <div className="text">
                        <p className="gr-text-10 mx-2 colorRed">
                        {messageError}
                        </p>
                    </div>
                </div>
                </div>
            </Col>
          ):("")}
          <form onSubmit={handleSubmit}>

            <div className='form-group'>
              <input
                type='email'
                name='email'
                required='required'
                placeholder='Email'
                className="form-control"
                defaultValue={email} 
                onChange={(event)=>setEmail(event.target.value)}
              />
            </div>

            
            <div className="form-group mb-6">
              <select 
                className="form-control gr-text-11 border mt-3 bg-white"
                id="nom"
                required
                defaultValue={codeTypeProfil} 
                onChange={(event)=>setCodeTypeProfil(event.target.value)}
              >
                <option defaultValue="">Choisissez le type de compte</option>
                  {/* Parcourir les profils */}
                  {allTypeProfil?(
                  allTypeProfil.map((data) => (
                    <optgroup className='single-cryptocurrency-box'
                            key={data.id}>
                      <option  value={data.code}>{data.libelle}</option>
                    </optgroup>
                  ))):("")}
                {/* Fin */}
                            
              </select>
            </div>
           
          

            
            
            <div className='form-group'>
              <input
                type='password'
                className='form-control'
                placeholder='Mot de passe'
                defaultValue={password} 
                onChange={(event)=>setPassword(event.target.value)}
              />
            </div>
            <div className='form-group'>
              <input
                type='password'
                className='form-control'
                placeholder='Confirmer mot de passe'
                defaultValue={confirmPassword} 
                onChange={(event)=>setConfirmPassword(event.target.value)}
                
              />
            </div>

            <div className='col-lg-12 col-md-6 col-sm-6 lost-your-password-wrap text-center'>
                Avez-vous déjà un compte ?  
                <a href='/auth/authentication'className='lost-your-password mx-2'>Connectez-vous
                </a>
              </div>
              <button type='submit'  className="btn btn-primary mx-3" disabled={isLoggingIn}>Enregistrer</button>
          </form>
        </div>
      </div>
      <div className='col-lg-3 col-md-12'></div>
    </>
  );
};


export default RegisterForm;
