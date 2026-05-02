import React from 'react';
import { useCallback, useState } from 'react';
import Router from 'next/router';
import { magic } from '../../magic';
import Swal from 'sweetalert2';

/**
 * Composant React représentant la réinitialisation du mot de passe.
 *
 * Corrections :
 * - Empêche le submit HTML implicite.
 * - Ajoute l'état messageError qui était utilisé mais non déclaré.
 * - Vérifie la présence du userId stocké après l'envoi du lien.
 * - Affiche des erreurs explicites au lieu de les masquer dans un catch vide.
 */
const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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

  const resetPassword = useCallback(async (event) => {
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

      if (!password || !confirmPassword) {
        throw new Error('Veuillez renseigner et confirmer le nouveau mot de passe.');
      }

      const userId = localStorage.getItem('userId');

      if (!userId) {
        throw new Error('Session de réinitialisation introuvable. Merci de redemander un lien de réinitialisation.');
      }

      await safeMagicLogout();

      const res = await fetch(`${API_URL}/api/user/password-reset/${userId}`, {
        method: 'POST',
        body: JSON.stringify({ password, confirmPassword }),
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': `${API_KEY_STABLECOIN}`,
        },
      });

      const data = await res.json();

      if (data?.message === '200') {
        localStorage.removeItem('userId');

        Swal.fire({
          position: 'center',
          icon: 'success',
          html: "<p>La réinitialisation de votre mot de passe s'est effectuée avec succès.</p>",
          showConfirmButton: false,
          timer: 10000,
        });

        setTimeout(() => {
          Router.push('/auth/authentication');
        }, 10000);
        return;
      }

      if (!res.ok || data?.message) {
        throw new Error(data?.message || 'Réinitialisation impossible.');
      }

      throw new Error('Réponse inattendue pendant la réinitialisation du mot de passe.');
    } catch (error) {
      showError(error?.message || 'Erreur pendant la réinitialisation du mot de passe.');
    } finally {
      setIsLoggingIn(false);
    }
  }, [API_URL, API_KEY_STABLECOIN, confirmPassword, password, safeMagicLogout, showError]);

  return (
    <>
      <div className='col-lg-3 col-md-12'></div>
      <div className='col-lg-6 col-md-12'>
        <div className='login-form'>
          <h2 className='text-center'>Nouveau mot de passe</h2>

          {messageError ? <p className='text-center colorRed'>{messageError}</p> : ''}

          <form onSubmit={resetPassword}>
            <div className='form-group'>
              <input
                type='password'
                className='form-control'
                placeholder='Entrer un nouveau mot de passe'
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>

            <div className='form-group'>
              <input
                type='password'
                className='form-control'
                placeholder='Confirmer le nouveau mot de passe'
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
            </div>

            <button type='submit' className='btn btn-primary mx-3' disabled={isLoggingIn}>
              {isLoggingIn ? 'Réinitialisation en cours...' : 'Réinitialiser'}
            </button>
          </form>
        </div>
      </div>
      <div className='col-lg-3 col-md-12'></div>
    </>
  );
};

export default ResetPassword;
