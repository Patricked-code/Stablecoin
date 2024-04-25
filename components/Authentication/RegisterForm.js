import React from 'react';
import Link from 'next/link';
import axios from 'axios';


import { useCallback, useState, useEffect } from 'react';
import { Row, Col, Container } from "react-bootstrap";
import Router from 'next/router';
import { magic } from '../../magic';
import Swal from 'sweetalert2';




/**
 * Composant React représentant le formulaire d'inscription.
 * @function
 * @component
 * @name RegisterForm
 */
function RegisterForm() {
  // Variable de l'url de l'api
  const API_URL =process.env.NEXT_PUBLIC_URL_API;
   // Variable de l'api key de stablecoin
   const API_KEY_STABLECOIN = process.env.NEXT_PUBLIC_API_KEY_STABLECOIN

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [messageError, setMessageError] = useState("")


  // Pour le formulaire d'enregistrement
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState()
  const [codeTypeProfil, setCodeTypeProfil] = useState("")

  // Recuperer tous les types de profil
  const [allTypeProfil, setAllTypeProfil] = useState("")
  const [infosOtherUser, setInfosOtherUser] = useState("")


  /**
   * Fonction pour gérer la déconnexion de l'utilisateur.
   * @function
   * @async
   * @name logout
   * @returns {void}
   */
  const logout = useCallback(() => {
    try {
    magic.user.logout().then(() => {
     
    });
  } catch (error) {
    console.log("une erreur s'est produit =>", error)
  }
  }, [Router]);
  // FIN


  // ********************FONCTION DE CONNEXION***********************************
  /**
   * Fonction pour effectuer l'action de connexion via le flux sans mot de passe de Magic.
   * @function
   * @async
   * @name login
   * @returns {void}
   */
   const login = useCallback(async () => {
    setIsLoggingIn(true);

    logout() //Appel de la fonction de déconnection à magic
    try {
      const dataa = {
        email:email,
        password:password
  
      }
    
      // Pour connexion simple
    const res = await fetch(`${API_URL}/api/session/login`, {
        method:"POST",
        body: JSON.stringify(dataa),
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': `${API_KEY_STABLECOIN}`,
        }
    })
    const data = await res.json();
      if (data?.message) {
        Swal.fire({
          position: 'center',
          icon: 'error',
          html: `<p class='colorRed'>${data?.message}</p>` ,
          showConfirmButton: false,
          timer: 15000
        })
      setIsLoggingIn(false);
      }else{
        
        if (data?.auth==1) {
          
            // setter Token
            localStorage.setItem('tokenEnCours', data.token);
          //Pour magic Grab auth token from loginWithMagicLink
          const didToken = await magic.auth.loginWithMagicLink({
            email,
            redirectURI: new URL('/callback', window.location.origin).href,
          });
          setTimeout(() => {
              window.location.reload()
          }, 1000)
          // Router.push("/profil/dashboard/"); 
        }else{
          //Pour magic Grab auth token from loginWithMagicLink
          const didToken = await magic.auth.loginWithMagicLink({
            email,
            redirectURI: new URL('/callback_register', window.location.origin).href,
          });
          setTimeout(() => {
              window.location.reload()
          }, 1000)
          // Router.push("/profil/dashboard/"); 
        }
        
      }
    } catch {
      setIsLoggingIn(false);
    }
  }, [email, password]);
  // Fin


  // ********************FONCTION D'INSCRIPTION***********************************
  /**
   * Fonction pour gérer la soumission du formulaire d'inscription.
   * @function
   * @async
   * @name handleSubmit
   * @param {object} event - Événement de soumission du formulaire.
   * @returns {void}
   */
  const handleSubmit = async (event) =>{
    setIsLoggingIn(true)
      event.preventDefault();

      const dataa = {
        // codeProfile:codeProfile,
        email:email,
        password:password,
        confirmPassword:confirmPassword,
        codeTypeProfil:codeTypeProfil,
        platform:'Stablecoin'
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
        }
        
      }else{
        setMessageError("Veuillez choisir un type de profil")
        setIsLoggingIn(false);
      }

      
  }
  // FIN


  /**
   * Fonction pour récupérer tous les types de profil.
   * @function
   * @async
   * @name getAllWayProfil
   * @returns {void}
   */
  useEffect(() => {
    const getAllWayProfil = async () => {
    const resProfil = await fetch(`${API_URL}/api/user/find-all-way-profile`, {
        headers: {
        'Content-Type': 'application/json',
          'x-api-key': `${API_KEY_STABLECOIN}`,
        },
    })
        .then((resProfil) => resProfil.json())
        .then((profil) => {
        setAllTypeProfil(profil)

        }) 

    };
    getAllWayProfil();
  }, []);
  // FIN


  /**
   * Fonction pour rechercher un utilisateur en fonction de son email.
   * @function
   * @name searchUserWithEmail
   * @returns {void}
   */
  const searchUserWithEmail = () =>{
    if (email) {
      const getUser = async (_email) => {
      
          const result = await fetch(`${API_URL}/api/user/find-user-by-email?email=${_email}`, {
              headers: {
              'Content-Type': 'application/json',
                'x-api-key': `${API_KEY_STABLECOIN}`,
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
          <h3 className='text-center mb-3'>Se connecter / S'inscrire</h3>
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
            {infosOtherUser?.email || infosOtherUser?.message==="Aucun utilisateur trouvé"? (
              ""
            ):(
              <Row className="my-3 justify-content-center align-items-center">
                <Col
                    xs="6"
                    md="6"
                    lg="6"
                    xl="6"
                  className="order-lg-1 text-center"
                  // onClick={()=>setShowInfoUser(3)}
                >
                  <button className="text-white  btn btn-primary mx-3 " onClick={searchUserWithEmail} variant="success" >
                    Envoyer
                  </button>
                </Col>
              </Row>
            )}

            {email? (
              <>
                {/* *******************PARTIE CONNEXION****************************** */}
                {infosOtherUser?.email ? (
                  <form >
                    {/* <div className='form-group'>
                    <input
                      type='email'
                      name='email'
                      required='required'
                      placeholder='Email'
                      className="form-control"
                      defaultValue={email} 
                      onChange={(event)=>setEmail(event.target.value)}
                    />
                    </div> */}
                    <div className='form-group mt-3'>
                      <input
                        type='password'
                        className='form-control'
                        placeholder='Mot de passe'
                        defaultValue={password} 
                        onChange={(event)=>setPassword(event.target.value)}
                      />
                    </div>
                    <div className='row align-items-center'>
                      <div className='col-lg-6 col-md-6 col-sm-6 lost-your-password-wrap text-center'>
                        Pas de compte?  <br/>
                        <a href='/auth/authentication'className='lost-your-password mx-2'>Créer un compte
                        </a>
                      </div>
                      <div className='col-lg-6 col-md-6 col-sm-6 lost-your-password-wrap text-center'>
                        <a href='/auth/send-link-password'className='lost-your-password mx-2'>
                          Mot de passe oublié
                        </a>
                      </div>
                    </div>

                      <button className="btn btn-primary mx-3" onClick={login} disabled={isLoggingIn}>Connecter</button>
                  </form>
                ):("")}
                {/* *******************FIN PARTIE CONNEXION****************************** */}

                {/* *******************PARTIE DECONNEXION****************************** */}
                {infosOtherUser?.message==="Aucun utilisateur trouvé" ? (
                  <form onSubmit={handleSubmit}>
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
                        <a href='/auth/authentication'className='lost-your-password mx-2'>
                          Connectez-vous
                        </a>
                      </div>
                      <button type='submit'  className="btn btn-primary mx-3" disabled={isLoggingIn}>Enregistrer</button>
                  </form>
                ):("")}
                {/* *******************FIN PARTIE DECONNEXION****************************** */}
              </>
            ):("")}
        </div>
      </div>
      <div className='col-lg-3 col-md-12'></div>
    </>
  );
};


export default RegisterForm;
