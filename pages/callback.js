import { useEffect, useState } from 'react';
import Router from 'next/router';
import Loading from '../components/loading';
import { magic } from '../magic';
import Swal from 'sweetalert2';

export default function Callback() {
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const completeMagicLogin = async () => {
      try {
        if (!magic) {
          throw new Error('Magic SDK non initialisé. Vérifiez NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY.');
        }

        const didToken = await magic.auth.loginWithCredential();

        const res = await fetch('/api/login', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${didToken}`,
          },
        });

        const data = await res.json();

        if (!res.ok || !data?.authenticated) {
          throw new Error(data?.message || 'Authentification Magic impossible.');
        }

        if (data?.token) {
          localStorage.setItem('tokenEnCours', data.token);
        }

        await Router.push('/profil/dashboard/');
      } catch (error) {
        const message = error?.message || 'Erreur inconnue pendant le callback de connexion.';
        setErrorMessage(message);

        Swal.fire({
          position: 'center',
          icon: 'error',
          html: `<p class='colorRed'>${message}</p>`,
          showConfirmButton: true,
        });

        setTimeout(() => {
          Router.push('/auth/authentication');
        }, 3000);
      }
    };

    completeMagicLogin();
  }, []);

  if (errorMessage) {
    return (
      <div className="text-center my-5">
        <p className="colorRed">{errorMessage}</p>
      </div>
    );
  }

  return <Loading />;
}
