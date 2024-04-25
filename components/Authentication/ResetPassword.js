import React from 'react';
import Link from 'next/link';

import { useCallback, useState, useEffect } from 'react';
import Router from 'next/router';
import { magic } from '../../magic';

import Swal from 'sweetalert2';



/**
 * Composant React représentant la réinitialisation du mot de passe.
 * @function
 * @component
 * @name ResetPassword
 */
const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const API_URL =process.env.NEXT_PUBLIC_URL_API
   // Variable de l'api key de stablecoin
   const API_KEY_STABLECOIN = process.env.NEXT_PUBLIC_API_KEY_STABLECOIN

  
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
   * @param {object} event - Événement de soumission du formulaire.
   * @returns {void}
   */
   const sendPasswordResetLink = useCallback(async (event) => {
    event.preventDefault();
    setIsLoggingIn(true);
     // setter id
     const userId = localStorage.getItem('userId');
    try {
        logaout() //Appel de la fonction de déconnection à magic

        const dataa = {
            password:password,
            confirmPassword:confirmPassword
        }
        // Pour connexion simple
        const res = await fetch(`${API_URL}/api/user/password-reset/${userId}`, {
            method:"POST",
            body: JSON.stringify(dataa),
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': `${API_KEY_STABLECOIN}`,
            }
        })
        const data = await res.json();
        if (data.message=="200") {
            Swal.fire({
                position: 'center',
                icon: 'success',
                html: "<p>La réinitialisation de votre mot de passe s'est effectuée avec succès</p>" ,
                showConfirmButton: false,
                timer: 10000
            })
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
    } catch {
        setIsLoggingIn(false);
    }
  }, [password]);
  // Fin


  return (
    <>

      <div className='col-lg-3 col-md-12'></div>
      <div className='col-lg-6 col-md-12'>
        <div className='login-form'>
          <h2 className='text-center'>Nouveau mot de passe</h2>

            <form >
              <div className='form-group'>
                <input
                  type='password'
                  className='form-control'
                  placeholder='Entrer un nouveau mot de passe'
                  defaultValue={password} 
                  onChange={(event)=>setPassword(event.target.value)}
                />
              </div>

              <div className='form-group'>
                <input
                  type='confirmPassword'
                  className='form-control'
                  placeholder='Confirmer le nouveau mot de passe'
                  defaultValue={confirmPassword} 
                  onChange={(event)=>setConfirmPassword(event.target.value)}
                />
              </div>
              
                <button className="btn btn-primary mx-3" onClick={sendPasswordResetLink} disabled={isLoggingIn}>Réinitialiser</button>
            </form>
        </div>
      </div>
      <div className='col-lg-3 col-md-12'></div>

    </>
  );
};

export default ResetPassword;
