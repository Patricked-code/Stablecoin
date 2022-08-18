import { useCallback, useState } from 'react';
import Router from 'next/router';
import { magic } from '../magic';

export default function Login() {
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

  return (
    <>
      <div className="row col-lg-12 my-5">
        <div className="col-lg-2"></div>
        <div className="col-lg-8">
          <div className='m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg mx-auto rounded-xl bg-white text-center partieLogin'>
            <br/><h4>Veuillez vous inscrire ou vous connecter</h4><br/><br/>
            <input
              type='email'
              name='email'
              required='required'
              placeholder='Enter your email'
              onChange={handleInputOnChange}
              disabled={isLoggingIn}
              className=""
            />
            <button onClick={login} className="btn btn-primary mx-3" disabled={isLoggingIn}>
              Envoyer
            </button><br/><br/>
          </div>
          </div>
        <div className="col-lg-2"></div>
        </div>
    </>
  );
}
