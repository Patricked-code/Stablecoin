import { useState, useEffect } from 'react';
import React from 'react';
import Link from 'next/link';
import { Button } from 'reactstrap';
import { magic } from '../../../../magic';
import Loading from '../../../../components/loading';
import Router from 'next/router';

const getUserProfileId = (user) => {
  const rawProfileId = user?.profileId ?? user?.ProfileId;
  const numericProfileId = Number(rawProfileId);

  return Number.isFinite(numericProfileId) ? numericProfileId : null;
};

const DasbaordWti = () => {
  const API_URL = process.env.NEXT_PUBLIC_URL_API;
  const API_KEY_STABLECOIN = process.env.NEXT_PUBLIC_API_KEY_STABLECOIN;

  const [currentUser, setCurrentUser] = useState(null);
  const [currentProfileId, setCurrentProfileId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    const getCurrentUser = async () => {
      try {
        if (!API_URL || !API_KEY_STABLECOIN) {
          throw new Error('Configuration API incomplète.');
        }

        const token = typeof window !== 'undefined' ? localStorage.getItem('tokenEnCours') : null;

        if (!token) {
          throw new Error('Session expirée. Merci de vous reconnecter.');
        }

        const result = await fetch(`${API_URL}/api/user/find-user-sign-in`, {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': `${API_KEY_STABLECOIN}`,
            Authorization: `Bearer ${token}`,
          },
        });

        const rawText = await result.text();
        let user = {};

        try {
          user = rawText ? JSON.parse(rawText) : {};
        } catch (error) {
          throw new Error(rawText || 'Réponse API invalide.');
        }

        if (!result.ok || user?.message) {
          throw new Error(user?.message || 'Impossible de récupérer le compte connecté.');
        }

        const profileId = getUserProfileId(user);

        if (!isMounted) return;

        if (profileId === 2 || profileId === 3) {
          setCurrentUser(user);
          setCurrentProfileId(profileId);
          return;
        }

        setCurrentProfileId(profileId);
        setErrorMessage("Ce compte n'a pas les droits nécessaires pour accéder au panel Wealthtech.");
      } catch (error) {
        if (!isMounted) return;
        setErrorMessage(error?.message || 'Erreur pendant le chargement du panel Wealthtech.');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    getCurrentUser();

    return () => {
      isMounted = false;
    };
  }, [API_URL, API_KEY_STABLECOIN]);

  useEffect(() => {
    const refreshMagicSession = async () => {
      try {
        if (magic) {
          await magic.user.isLoggedIn();
        }
      } catch (error) {
        console.log('Vérification Magic non bloquante pour le panel admin =>', error);
      }
    };

    refreshMagicSession();
  }, []);

  if (isLoading) {
    return (
      <span className='text-center bg-default-2 btn-bottom-text d-block gr-text-5 text-blackish-blue gr-opacity-10 my-35'>
        <Loading />
      </span>
    );
  }

  if (errorMessage) {
    return (
      <div className='cryptocurrency-search-box text-center my-5'>
        <div className='m-4 credit-card shadow-lg rounded-xl bg-white p-4'>
          <h3>Accès au panel Wealthtech impossible</h3>
          <p className='colorRed'>{errorMessage}</p>
          {currentProfileId !== null ? (
            <p>Profil applicatif détecté : {currentProfileId}</p>
          ) : null}
          <Button color='primary' type='button' onClick={() => Router.push('/profil/dashboard/')}>
            Retour au dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className=''>
        <div className=' mx-15'>
          <div className='py-10'>
            <h1 className='text-center'>Dashboard de Wealthtech</h1>
          </div>
        </div>

        <div className='shape1'></div>
        <div className='shape2 mb-5'><br />
          <img src='/images/shape/shape2.png' alt='image' />
        </div>
        <div className='shape3'></div>
        <div className='shape4'>
          <img src='/images/shape/shape4.png' alt='image' />
        </div>

        <div className='cryptocurrency-search-box'>
          <div className='row'>
            {currentProfileId === 2 ? (
              <>
                <AdminCard title='Attribuer des rôles' href='/admin/wealthtech/roles/attribution/' />
                <AdminCard title='Stablecoin comme moyen de payement' href='/admin/wealthtech/stablecoin/comme-moyen-paiement' />
                <AdminCard title="Les demandes d'être distributeur" href='/admin/wealthtech/stablecoin/distributeur/' />
                <AdminCard title='Ajout ou modification des infos de conversion' href='/admin/wealthtech/stablecoin/portefeuille/conversion/' />
                <AdminCard title="Ajout ou modification des tarifs d'abonnement" href='/admin/wealthtech/stablecoin/abonnement/tarifs' />
                <AdminCard title='Les abonnés' href='/admin/wealthtech/stablecoin/abonnement/liste-abonnes' />
              </>
            ) : (
              <div className='col-lg-12 col-md-12 text-center'>
                <div className='m-4 credit-card shadow-lg rounded-xl bg-white p-4'>
                  <h3>Accès administrateur restreint</h3>
                  <p>Votre profil est reconnu, mais ce tableau de bord complet est réservé au profil administrateur principal.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const AdminCard = ({ title, href }) => (
  <div className='col-lg-6 col-md-6'>
    <div className='currency-selection text-center'>
      <div className='m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg rounded-xl bg-white'>
        <div className='cryptocurrency-slides'>
          <div className='single-cryptocurrency-box'>
            <div className='d-flex align-items-center'>
              <div className='title'>
                <h3>{title}</h3>
              </div>
            </div>
            <div className='btn-box'>
              <Link href={href}>
                <Button block color='primary' type='button'>
                  Voir plus
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default DasbaordWti;
