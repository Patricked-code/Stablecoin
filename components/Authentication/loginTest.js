import React from 'react';
import Link from 'next/link';

import { useCallback, useState, useEffect } from 'react';
import Router from 'next/router';
import { magic } from '../../magic';

import Swal from 'sweetalert2';




const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  

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



const [emailForm, setEmailForm] = useState();
const [password, setPassword] = useState()

const handleSubmit = async(event) =>{
    event.preventDefault();
    const dataa = {
      email:emailForm,
      password:password

    }
    
    // const res = await fetch("http://localhost:3080/api/user/login", {
      fetch("https://api.stablecoin.wealthtechinnovations.com/api/user", {
        method:"POST",
        body: JSON.stringify(dataa),
        headers: {
            'Content-Type': 'application/json',
        }
    })
    const data = await res.json();
    console.log("data", data)
    // setter
    localStorage.setItem('tokenEnCours', data.message);

    // getter
    const ok = localStorage.getItem('tokenEnCours');

    console.log("tokenEnCours", ok)
    // .then(dataa => {
    //   //handle data
    //   console.log("succes",dataa);
    //   console.log("Auth",dataa.auth);
    //   console.log("Token",dataa.message);
     
    //     Swal.fire({
    //       position: 'center',
    //       icon: 'success',
    //       html: "<p> Votre inscription s'est effectuée avec succès </p>" ,
    //       showConfirmButton: false,
    //       timer: 5000
    //     })
    // //  Actualiser après l'affichage 
     
    //   // Router.push("/auth/authentication"); 
    // // Fin
    // })
    // .catch(error => {
    //   handle error
    //   console.log(error);

    // });
    
}



















  return (
    <>

      <div className='col-lg-3 col-md-12'></div>
      <div className='col-lg-6 col-md-12'>
        <div className='login-form'>
          <h2 className='text-center'>Connexion</h2>
          <form onSubmit={handleSubmit}>
            <div className='form-group'>
            <input
              type='email'
              name='email'
              required='required'
              placeholder='Email'
              className="form-control"
              defaultValue={emailForm} 
              onChange={(event)=>setEmailForm(event.target.value)}
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
              <div className='col-lg-12 col-md-6 col-sm-6 lost-your-password-wrap text-center'>
                Pas de compte ?  
                <a href='/auth/enregistrer/'className='lost-your-password mx-2'>Créer un compte
                </a>
              </div>
            </div>

              <button className="btn btn-primary mx-3" disabled={isLoggingIn}>Connecter</button>
          </form>
        </div>
      </div>
      <div className='col-lg-3 col-md-12'></div>

    </>
  );
};

LoginForm.getInitialProps = async (ctx) => {};

export default LoginForm;
