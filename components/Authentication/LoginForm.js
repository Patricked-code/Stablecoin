import React from 'react';
import Link from 'next/link';

import { useCallback, useState, useEffect } from 'react';
import Router from 'next/router';
import { magic } from '../../magic';

import Swal from 'sweetalert2';




const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const API_URL =process.env.NEXT_PUBLIC_URL_API

  
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

  /**
   * Perform login action via Magic's passwordless flow. Upon successuful
   * completion of the login flow, a user is redirected to the homepage.
   */
  const login = useCallback(async () => {
    setIsLoggingIn(true);

    logaout() //Appel de la fonction de déconnection à magic
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


  return (
    <>

      <div className='col-lg-3 col-md-12'></div>
      <div className='col-lg-6 col-md-12'>
        <div className='login-form'>
          <h2 className='text-center'>Se connecter ou s'inscrire</h2>

          {showForm==false ? (
            <>
              <div className='col-lg-12 col-md-12 row'>
                <button 
                  className="btn btn-primary mx-3"
                  onClick={()=>setShowForm(true)}
                >Se connecter</button>
              </div>
              <p className='text-center'>ou</p>
              <a href='/auth/enregistrer/' className='col-lg-12 col-md-12 row'>
                <button className="btn btn-primary mx-3">S'inscrire</button>
              </a>
            </>
          ):(
            <form >
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
              <div className='form-group'>
                <input
                  type='password'
                  className='form-control'
                  placeholder='Mot de passe'
                  defaultValue={password} 
                  onChange={(event)=>setPassword(event.target.value)}
                />
              </div>
              {/* <div className='form-group'>
                <input
                  type='password'
                  className='form-control'
                  placeholder='Mot de passe'
                />
              </div> */}
              <div className='row align-items-center'>
                <div className='col-lg-6 col-md-6 col-sm-6 lost-your-password-wrap text-center'>
                  Pas de compte ?  
                  <a href='/auth/enregistrer/'className='lost-your-password mx-2'>Créer un compte
                  </a>
                </div>
                <div className='col-lg-6 col-md-6 col-sm-6 lost-your-password-wrap text-center'>
                  <a href='/auth/send-link-password/'className='lost-your-password mx-2'>
                    Mot de passe oublié
                  </a>
                </div>
              </div>

                <button className="btn btn-primary mx-3" onClick={login} disabled={isLoggingIn}>Connecter</button>
            </form>
          )}
        </div>
      </div>
      <div className='col-lg-3 col-md-12'></div>

    </>
  );
};

LoginForm.getInitialProps = async (ctx) => {};

export default LoginForm;
