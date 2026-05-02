import React from 'react';
import { useCallback, useState } from 'react';
import { magic } from '../../magic';
import Swal from 'sweetalert2';

/**
 * Composant React représentant l'envoi d'un lien de réinitialisation de mot de passe.
 *
 * Corrections :
 * - Empêche le submit HTML implicite du formulaire.
 * - Supprime l'appel à setMessageError qui n'existait pas dans le composant.
 * - Ajoute des erreurs explicites si la configuration API est manquante.
 */
const CLinkResetPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [messageError, setMessageError] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_URL_API;
  const API_KEY_STABLECOIN = process.env.NEXT_PUBLIC_API_KEY_STABLECOIN;

  const safeMagicLogout = useCallback(async () => {
    try {
      if (magic) {
        const isLoggedIn = await magic.user.isLoggedIn();
        if (isLoggedIn) {
          await magic.user.logout();
        }
      }
    } catch (error) {
      console.log("Erreur pendant la déconnexion Magic =>", error);
    }
  }, []);

  const showError = useCallback((message) => {
    const finalMessage = message || 'Une erreur est survenue. Merci de réessayer.';
    setMessageError(finalMessage);

    Swal.fire({
      position: 'center',
      icon: 'error',
      html: `<p>${finalMessage}</p>`,
      showConfirmButton: true,
    });
  }, []);

  const sendPasswordResetLink = useCallback(async (event) => {
    if (event) {
      event.preventDefault();
    }

    setMessageError('');
    setIsLoggingIn(true);

    try {
      if (!API_URL) {
        throw new Error('Configuration manquante : NEXT_PUBLIC_URL_API');
      }

      if (!API_KEY_STABLECOIN) {
        throw new Error('Configuration manquante : NEXT_PUBLIC_API_KEY_STABLECOIN');
      }

      if (!email) {
        throw new Error('Veuillez renseigner votre email.');
      }

      await safeMagicLogout();

      const res = await fetch(`${API_URL}/api/user/send-password-reset-link`, {
        method: 'POST',
        body: JSON.stringify({ email }),
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': `${API_KEY_STABLECOIN}`,
        },
      });

      const data = await res.json();

      if (!res.ok || data?.message) {
        throw new Error(data?.message || 'Impossible d’envoyer le lien de réinitialisation.');
      }

      localStorage.setItem('userId', data.success);

      Swal.fire({
        position: 'center',
        icon: 'success',
        html: '<p>Veuillez vérifier votre boîte email. Nous venons de vous envoyer un email pour réinitialiser votre mot de passe.</p>',
        showConfirmButton: false,
        timer: 20000,
      });
    } catch (error) {
      showError(error?.message || 'Erreur pendant l’envoi du lien de réinitialisation.');
    } finally {
      setIsLoggingIn(false);
    }
  }, [API_URL, API_KEY_STABLECOIN, email, safeMagicLogout, showError]);

  return (
    <>
      <div className='col-lg-3 col-md-12'></div>
      <div className='col-lg-6 col-md-12'>
        <div className='login-form'>
          <h3 className='text-center'>Réinitialiser votre mot de passe.</h3>
          <p className='text-center'>Pour réinitialiser votre mot de passe, nous devons vous envoyer un e-mail.</p>

          {messageError ? <p className='text-center colorRed'>{messageError}</p> : ''}

          <form onSubmit={sendPasswordResetLink}>
            <div className='form-group'>
              <input
                type='email'
                className='form-control'
                placeholder='Veuillez entrer votre email'
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>

            <button type='submit' className='btn btn-primary mx-3' disabled={isLoggingIn}>
              {isLoggingIn ? 'Envoi en cours...' : 'Envoyer'}
            </button>
          </form>
        </div>
      </div>
      <div className='col-lg-3 col-md-12'></div>
    </>
  );
};

export default CLinkResetPassword;
