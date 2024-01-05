import React from 'react';
import Link from 'next/link';

import { useCallback, useState, useEffect } from 'react';
import Router from 'next/router';
import { magic } from '../../magic';

import Swal from 'sweetalert2';



/**
 * Composant React représentant le lien de réinitialisation de mot de passe.
 * @function
 * @component
 * @name CLinkResetPassword
 */
const CLinkResetPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const API_URL =process.env.NEXT_PUBLIC_URL_API

  
  /**
   * Fonction pour gérer la déconnexion de l'utilisateur.
   * @function
   * @async
   * @name logaout
   * @returns {void}
   */
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
   * Fonction pour envoyer le lien de réinitialisation du mot de passe.
   * @function
   * @async
   * @name sendPasswordResetLink
   * @returns {void}
   */
  const sendPasswordResetLink = useCallback(async () => {
    setIsLoggingIn(true);

    logaout() //Appel de la fonction de déconnection à magic
    try {
      const dataa = {
        email:email
  
      }
    
      // Pour connexion simple
    const res = await fetch(`${API_URL}/api/user/send-password-reset-link`, {
        method:"POST",
        body: JSON.stringify(dataa),
        headers: {
            'Content-Type': 'application/json',
        }
    })
    const data = await res.json();
    if (data.message) {
      setMessageError(data.message)
      Swal.fire({
        position: 'center',
        icon: 'error',
        html: `<p>${data.message}</p>` ,
        showConfirmButton: false,
        timer: 5000
    })
      setIsLoggingIn(false);
    }else{
        // setter id (on stocke id de l'utilisateur dans localStorage tokenId)
        localStorage.setItem('userId', data.success);
        Swal.fire({
            position: 'center',
            icon: 'success',
            html: "<p>Veuillez vérifier votre boite E-mail, Nous venons de vous envoyer un e-mail pour réinitiliser votre mot de passe.</p>" ,
            showConfirmButton: false,
            timer: 20000
        })
    }
    } catch {
      setIsLoggingIn(false);
    }
    
  }, [email]);
  // Fin


  return (
    <>

      <div className='col-lg-3 col-md-12'></div>
      <div className='col-lg-6 col-md-12'>
        <div className='login-form'>
            <h3 className='text-center'>Réinitialiser votre mot de passe.</h3>
            <p className='text-center'>Pour réinitialiser votre mot de passe, nous devons vous envoyer un e-mail.</p>
            <form >
              <div className='form-group'>
                <input
                  type='email'
                  className='form-control'
                  placeholder='Veuillez entrer votre email'
                  defaultValue={email} 
                  onChange={(event)=>setEmail(event.target.value)}
                />
              </div>

                <button className="btn btn-primary mx-3" onClick={sendPasswordResetLink} disabled={isLoggingIn}>Envoyer</button>
            </form>
        </div>
      </div>
      <div className='col-lg-3 col-md-12'></div>

    </>
  );
};

export default CLinkResetPassword;
