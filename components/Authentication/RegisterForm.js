import React from 'react';
import Link from 'next/link';
import Router from 'next/router';
import { useCallback, useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { magic } from '../../magic';
import Swal from 'sweetalert2';

/**
 * Composant React représentant le formulaire de connexion et d'inscription.
 *
 * Flux fonctionnel :
 * 1. L'utilisateur saisit son email.
 * 2. Le front vérifie si l'utilisateur existe déjà côté API métier.
 * 3. Si l'utilisateur existe, le formulaire affiche la connexion par mot de passe.
 * 4. Si l'utilisateur n'existe pas, le formulaire affiche l'inscription.
 * 5. L'API métier reste la source principale d'authentification et renvoie le token applicatif.
 *
 * Correction importante :
 * - La connexion applicative ne dépend plus obligatoirement de Magic Link, car le service Magic
 *   peut bloquer le flux sur la vérification nouvel appareil avec un 401 côté api.toaster.magic.link.
 * - Magic n'est pas supprimé : il reste disponible pour le wallet blockchain intégré et peut aussi
 *   être réactivé comme authentification obligatoire avec NEXT_PUBLIC_ENABLE_MAGIC_AUTH=true.
 * - Le formulaire conserve maintenant l'email utilisateur dans localStorage afin que le dashboard
 *   puisse initialiser correctement le wallet Magic et récupérer l'adresse blockchain Moonbase Alpha.
 * - Les boutons empêchent le submit HTML implicite.
 * - Les erreurs API texte/JSON sont gérées proprement.
 */
function RegisterForm() {
  const API_URL = process.env.NEXT_PUBLIC_URL_API;
  const API_KEY_STABLECOIN = process.env.NEXT_PUBLIC_API_KEY_STABLECOIN;
  const ENABLE_MAGIC_AUTH = process.env.NEXT_PUBLIC_ENABLE_MAGIC_AUTH === 'true';

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [messageError, setMessageError] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [codeTypeProfil, setCodeTypeProfil] = useState('');

  const [allTypeProfil, setAllTypeProfil] = useState('');
  const [infosOtherUser, setInfosOtherUser] = useState('');

  const persistUserEmail = useCallback((value) => {
    if (typeof window === 'undefined') return;

    const safeEmail = String(value || '').trim().toLowerCase();
    if (!safeEmail || !safeEmail.includes('@')) return;

    localStorage.setItem('email', safeEmail);
    localStorage.setItem('userEmail', safeEmail);
    localStorage.setItem('emailEnCours', safeEmail);
    localStorage.setItem('currentUserEmail', safeEmail);
  }, []);

  const showError = useCallback((message) => {
    const finalMessage = message || 'Une erreur est survenue. Merci de réessayer.';
    setMessageError(finalMessage);

    Swal.fire({
      position: 'center',
      icon: 'error',
      html: `<p class='colorRed'>${finalMessage}</p>`,
      showConfirmButton: true,
    });
  }, []);

  const parseApiResponse = async (response, fallbackMessage) => {
    const rawText = await response.text();

    if (!rawText) {
      return {};
    }

    try {
      return JSON.parse(rawText);
    } catch (error) {
      throw new Error(rawText || fallbackMessage || 'Réponse API invalide.');
    }
  };

  const safeMagicLogout = useCallback(async () => {
    if (!ENABLE_MAGIC_AUTH) {
      return;
    }

    try {
      if (magic) {
        const isLoggedIn = await magic.user.isLoggedIn();
        if (isLoggedIn) {
          await magic.user.logout();
        }
      }
    } catch (error) {
      console.log('Erreur pendant la déconnexion Magic =>', error);
    }
  }, [ENABLE_MAGIC_AUTH]);

  const assertRuntimeConfig = useCallback(() => {
    if (!API_URL) {
      throw new Error('Configuration manquante : NEXT_PUBLIC_URL_API');
    }

    if (!API_KEY_STABLECOIN) {
      throw new Error('Configuration manquante : NEXT_PUBLIC_API_KEY_STABLECOIN');
    }

    if (ENABLE_MAGIC_AUTH && !magic) {
      throw new Error('Magic SDK non initialisé. Vérifiez NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY.');
    }
  }, [API_URL, API_KEY_STABLECOIN, ENABLE_MAGIC_AUTH]);

  const completeLoginAfterBackendSuccess = useCallback(async (data) => {
    persistUserEmail(email);

    if (data?.token) {
      localStorage.setItem('tokenEnCours', data.token);
    }

    if (!ENABLE_MAGIC_AUTH) {
      await Router.push('/profil/dashboard/');
      return;
    }

    const redirectPath = data?.auth === 1 ? '/callback/' : '/callback_register/';

    await safeMagicLogout();
    await magic.auth.loginWithMagicLink({
      email,
      redirectURI: new URL(redirectPath, window.location.origin).href,
    });
  }, [ENABLE_MAGIC_AUTH, email, persistUserEmail, safeMagicLogout]);

  const completeRegisterAfterBackendSuccess = useCallback(async () => {
    persistUserEmail(email);

    if (!ENABLE_MAGIC_AUTH) {
      await Router.push('/account/firstEdition/');
      return;
    }

    await safeMagicLogout();
    await magic.auth.loginWithMagicLink({
      email,
      redirectURI: new URL('/callback_register/', window.location.origin).href,
    });
  }, [ENABLE_MAGIC_AUTH, email, persistUserEmail, safeMagicLogout]);

  const login = useCallback(async (event) => {
    if (event) {
      event.preventDefault();
    }

    setMessageError('');
    setIsLoggingIn(true);

    try {
      assertRuntimeConfig();

      if (!email || !password) {
        throw new Error('Veuillez renseigner votre email et votre mot de passe.');
      }

      persistUserEmail(email);

      const response = await fetch(`${API_URL}/api/session/login`, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': `${API_KEY_STABLECOIN}`,
        },
      });

      const data = await parseApiResponse(response, 'Connexion impossible.');

      if (!response.ok || data?.message) {
        throw new Error(data?.message || 'Connexion impossible.');
      }

      await completeLoginAfterBackendSuccess(data);
    } catch (error) {
      setIsLoggingIn(false);
      showError(error?.message || 'Erreur pendant la connexion.');
    }
  }, [API_URL, API_KEY_STABLECOIN, assertRuntimeConfig, completeLoginAfterBackendSuccess, email, password, persistUserEmail, showError]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessageError('');
    setIsLoggingIn(true);

    try {
      assertRuntimeConfig();

      if (!codeTypeProfil) {
        throw new Error('Veuillez choisir un type de profil.');
      }

      if (!email || !password || !confirmPassword) {
        throw new Error('Veuillez renseigner tous les champs obligatoires.');
      }

      persistUserEmail(email);

      const result = await fetch(`${API_URL}/api/session/register`, {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
          confirmPassword,
          codeTypeProfil,
          platform: 'Stablecoin',
        }),
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': `${API_KEY_STABLECOIN}`,
        },
      });

      const data = await parseApiResponse(result, 'Inscription impossible.');

      if (data?.message === 'Utilisateur déjà existant') {
        setIsLoggingIn(false);
        Swal.fire({
          position: 'center',
          icon: 'info',
          html: "<p class='colorRed card text-red'>Ce compte existe déjà mais n'est peut-être pas activé.<br/>Merci de vous connecter pour l'activer si ce n'est pas encore fait.</p>",
          showConfirmButton: false,
          timer: 15000,
        });
        return;
      }

      if (!result.ok || data?.message) {
        throw new Error(data?.message || 'Inscription impossible.');
      }

      if (data?.success === true) {
        await completeRegisterAfterBackendSuccess();
        return;
      }

      throw new Error('Réponse inattendue pendant l’inscription.');
    } catch (error) {
      setIsLoggingIn(false);
      showError(error?.message || 'Erreur pendant l’inscription.');
    }
  };

  useEffect(() => {
    const getAllWayProfil = async () => {
      if (!API_URL || !API_KEY_STABLECOIN) {
        setMessageError('Configuration API manquante.');
        return;
      }

      try {
        const resProfil = await fetch(`${API_URL}/api/user/find-all-way-profile`, {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': `${API_KEY_STABLECOIN}`,
          },
        });

        const profil = await parseApiResponse(resProfil, 'Impossible de charger les types de profil.');

        if (!resProfil.ok) {
          throw new Error(profil?.message || 'Impossible de charger les types de profil.');
        }

        setAllTypeProfil(profil);
      } catch (error) {
        setMessageError(error?.message || 'Impossible de charger les types de profil.');
      }
    };

    getAllWayProfil();
  }, [API_URL, API_KEY_STABLECOIN]);

  const searchUserWithEmail = async (event) => {
    if (event) {
      event.preventDefault();
    }

    setMessageError('');

    if (!email) {
      setMessageError('Veuillez renseigner votre email.');
      return;
    }

    try {
      assertRuntimeConfig();
      persistUserEmail(email);

      const result = await fetch(`${API_URL}/api/user/find-user-by-email?email=${encodeURIComponent(email)}`, {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': `${API_KEY_STABLECOIN}`,
        },
      });

      const user = await parseApiResponse(result, 'Impossible de vérifier cet email.');

      if (!result.ok) {
        throw new Error(user?.message || 'Impossible de vérifier cet email.');
      }

      setInfosOtherUser(user);
    } catch (error) {
      showError(error?.message || 'Impossible de vérifier cet email.');
    }
  };

  const handleEmailChange = (event) => {
    const nextEmail = event.target.value;
    setEmail(nextEmail);
    persistUserEmail(nextEmail);
  };

  return (
    <>
      <div className='col-lg-3 col-md-12'></div>
      <div className='col-lg-6 col-md-12'>
        <div className='register-form'>
          <h3 className='text-center mb-3'>Se connecter / S'inscrire</h3>

          {messageError ? (
            <Col lg='12' md='12' sm='12' className='mb-5 text-center'>
              <div className='pricing-card bg-red gr-hover-shadow-1 border text-left pt-9 pb-9 pe-3 px-3 rounded-10'>
                <div className='price-content'>
                  <div className='text'>
                    <p className='gr-text-10 mx-2 colorRed'>{messageError}</p>
                  </div>
                </div>
              </div>
            </Col>
          ) : ''}

          <div className='form-group'>
            <input
              type='email'
              name='email'
              required='required'
              placeholder='Email'
              className='form-control'
              value={email}
              onChange={handleEmailChange}
            />
          </div>

          {infosOtherUser?.email || infosOtherUser?.message === 'Aucun utilisateur trouvé' ? '' : (
            <Row className='my-3 justify-content-center align-items-center'>
              <Col xs='6' md='6' lg='6' xl='6' className='order-lg-1 text-center'>
                <button
                  type='button'
                  className='text-white btn btn-primary mx-3'
                  onClick={searchUserWithEmail}
                  disabled={isLoggingIn}
                >
                  Envoyer
                </button>
              </Col>
            </Row>
          )}

          {email ? (
            <>
              {infosOtherUser?.email ? (
                <form onSubmit={login}>
                  <div className='form-group mt-3'>
                    <input
                      type='password'
                      className='form-control'
                      placeholder='Mot de passe'
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                    />
                  </div>

                  <div className='row align-items-center'>
                    <div className='col-lg-6 col-md-6 col-sm-6 lost-your-password-wrap text-center'>
                      Pas de compte ?<br />
                      <a href='/auth/authentication' className='lost-your-password mx-2'>Créer un compte</a>
                    </div>
                    <div className='col-lg-6 col-md-6 col-sm-6 lost-your-password-wrap text-center'>
                      <a href='/auth/send-link-password' className='lost-your-password mx-2'>Mot de passe oublié</a>
                    </div>
                  </div>

                  <button type='submit' className='btn btn-primary mx-3' disabled={isLoggingIn}>
                    {isLoggingIn ? 'Connexion en cours...' : 'Connecter'}
                  </button>
                </form>
              ) : ''}

              {infosOtherUser?.message === 'Aucun utilisateur trouvé' ? (
                <form onSubmit={handleSubmit}>
                  <div className='form-group mb-6'>
                    <select
                      className='form-control gr-text-11 border mt-3 bg-white'
                      id='nom'
                      required
                      value={codeTypeProfil}
                      onChange={(event) => setCodeTypeProfil(event.target.value)}
                    >
                      <option value=''>Choisissez le type de compte</option>
                      {allTypeProfil ? (
                        allTypeProfil.map((data) => (
                          <optgroup className='single-cryptocurrency-box' key={data.id}>
                            <option value={data.code}>{data.libelle}</option>
                          </optgroup>
                        ))
                      ) : ''}
                    </select>
                  </div>

                  <div className='form-group'>
                    <input
                      type='password'
                      className='form-control'
                      placeholder='Mot de passe'
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                    />
                  </div>

                  <div className='form-group'>
                    <input
                      type='password'
                      className='form-control'
                      placeholder='Confirmer mot de passe'
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                    />
                  </div>

                  <div className='col-lg-12 col-md-6 col-sm-6 lost-your-password-wrap text-center'>
                    Avez-vous déjà un compte ?
                    <a href='/auth/authentication' className='lost-your-password mx-2'>Connectez-vous</a>
                  </div>

                  <button type='submit' className='btn btn-primary mx-3' disabled={isLoggingIn}>
                    {isLoggingIn ? 'Inscription en cours...' : 'Enregistrer'}
                  </button>
                </form>
              ) : ''}
            </>
          ) : ''}
        </div>
      </div>
      <div className='col-lg-3 col-md-12'></div>
    </>
  );
}

export default RegisterForm;
