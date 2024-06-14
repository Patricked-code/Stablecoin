import { useEffect } from 'react';
import Router from 'next/router';
import Loading from '../components/loading';
import { magic } from '../magic';

export default function Callback() {
  useEffect(() => {
    // On mount, we try to login with a Magic credential in the URL query.
    magic.auth.loginWithCredential().then(async (didToken) => {
      // Validate auth token with server
      const res = await fetch('/api/login', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + didToken,
        },
      });
      console.log("res=>",res)
      res.status === 200 && Router.push('/profil/dashboard/');
      setTimeout(() => {
        window.location.reload()
        

       }, 1000)
    });
  }, []);

  return <Loading />;
}
