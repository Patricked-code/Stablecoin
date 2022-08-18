import React from 'react';
import Link from 'next/link';
import axios from 'axios';


import { useCallback, useState } from 'react';
import Router from 'next/router';
import { magic } from '../../magic';
import Swal from 'sweetalert2';





function RegisterForm() {

  const [email, setEmail] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Pour le formulaire d'enregistrement
  const [codeProfile, setCodeProfile] = useState("");
  const [emailForm, setEmailForm] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState()


  


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



const handleSubmit = (event) =>{
    event.preventDefault();
    const dataa = {
      codeProfile:codeProfile,
      email:emailForm,
      password:password,
      confirmPassword:confirmPassword

    }

   

    
    // fetch("http://localhost:3080/api/session/register", {
    fetch("https://apiv3.liquidity.wealthtechinnovations.com/api/session/register", {

        method:"POST",
        body: JSON.stringify(dataa),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(dataa => {
      //handle data
      console.log("succes",dataa);
      // setter email
      localStorage.setItem('emailEnCours', emailForm);

      // getter email
    const ok = localStorage.getItem('emailEnCours');
    console.log("emailEnCours =>", ok)

    // setter pass
    localStorage.setItem('passEnCours', password);

    // getter pass
  const pass = localStorage.getItem('passEnCours');
  console.log("emailEnCours =>", pass)

        Swal.fire({
          position: 'center',
          icon: 'success',
          html: "<p> Votre inscription s'est effectuée avec succès </p>" ,
          showConfirmButton: false,
          timer: 5000
        })
    //  Actualiser après l'affichage 
     
      Router.push("/account/activated"); 
    // Fin
    })
    .catch(error => {
      //handle error
      console.log(error);

    });

    

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


  return (
    <>
      <div className='col-lg-3 col-md-12'></div>
      <div className='col-lg-6 col-md-12'>
        <div className='register-form'>
          <h2 className='text-center'>Inscription</h2>
          <form onSubmit={handleSubmit}>
           
          <div className='form-group'>
              <input
                type='text'
                className='form-control'
                placeholder='codeProfile'
                hidden
                
              />
            </div>
            <div className='form-group'>
              <select 
              placeholder='Pays'
              className='form-control'
              defaultValue={codeProfile} 
              onChange={(event)=>setCodeProfile(event.target.value)}
              >
                <optgroup >
                  <option>Choisissez le type d'utilisateur</option>
                  <option value="p">Particlier</option>
                  <option  value="e">Entreprise</option>
                  <option  value="i">institution</option>
                </optgroup>
              </select>
            </div>

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
