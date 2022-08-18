import React, { useEffect, useState, useCallback } from "react";
import Router from "next/router";
import Link from 'next/link';
import { magic } from "../magic";
import Loading from "../components/loading";
import { ethers } from "ethers";

export default function Index() {
  // states
  const [userMetadata, setUserMetadata] = useState();

  // hooks
  /**
   * On virtual dom mount, we check if a user is logged in.
   *  If so, we'll retrieve the authenticated user's profile.
   */
  useEffect(() => {
    magic.user.isLoggedIn().then(async (magicIsLoggedIn) => {
      if (magicIsLoggedIn) {
        magic.user.getMetadata().then(setUserMetadata);
        const provider = new ethers.providers.Web3Provider(magic.rpcProvider);
        const signer = provider.getSigner();
      } else {
        // If no user is logged in, redirect to `/login`
        setTimeout(() => {
          window.location.reload()
          Router.push("/");
  
         }, 1)
      }
    });
  }, []);

  // functions
  /**
   * Perform logout action via Magic.
   */
  const logout = useCallback(() => {
    magic.user.logout().then(() => {
      Router.push("/");
    });
  }, [Router]);

  // template
  return userMetadata ? (
    <>
      <div className="row col-lg-12 my-5">
        <div className="col-lg-2"></div>
        <div className="col-lg-8">
              <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg mx-auto rounded-xl bg-white text-center "><br/>
            <h5 className="my-3">Mon Email: {userMetadata.email}</h5><br/>

            
            <button onClick={logout} className="mx-3 btn btn-danger">Deconnexion</button>
            <Link href="/profil/">
              <button className="mx-3 btn btn-primary">Mon profil</button>
            </Link><br/><br/>
          </div>
        <div className="col-lg-2"></div>

        </div>

      </div>

    </>
  ) : (
    <Loading />
  );
}
