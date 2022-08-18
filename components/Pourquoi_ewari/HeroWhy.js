import Link from 'next/link';
import React, { useEffect, useState, useCallback } from "react";

const HeroWhy = ({ bgGradient, blackText, ctaImage }) => {

  const [token, setToken] = useState()

  useEffect(() => {
    const toke = localStorage.getItem('tokenEnCours')
    setToken(toke)
  },[])

  return (
    <>
      <div className={`cta-area pt-100 ${bgGradient}`}>
        <div className='container'>
          <div className='row align-items-center justify-content-center'>
            <div className='col-lg-6 col-md-12'>
              <div className={`cta-content ${blackText}`}>
                <h1 className='text-center'>Pourquoi E-WARI ?</h1>
                <h4>
                </h4>
              </div>
            </div>
            {/* <div className='col-lg-6 col-md-12'>
              <div className='cta-image'>
                <img src={ctaImage} alt='image' />
              </div>
            </div> */}
          </div>

          <div className='row align-items-center justify-content-center my-3'>
            <div className='col-lg-6 col-md-12'>
            <p>E-WARI est utilisé et disponible sur nos plateformes</p>

            {token?(
                <Link href='/profil/ecosysteme/'>
                  <a className='default-btn global-cursor'>
                    <i className='bx bxs-user'></i> Notre écosystème
                  </a>
                </Link>
                ):(<Link href='/auth/authentication'>
                <a className='default-btn global-cursor'>
                  <i className='bx bxs-user'></i> Notre écosystème
                </a>
              </Link>)}
            </div>
            <div className='col-lg-6 col-md-12'>
            <p>Vous souhaitez proposer E-WARI à vos utilisateurs</p>

                <Link href='/#'>
                  <a className='default-btn global-cursor'>
                    <i className='bx bxs-user'></i> Contactez nous
                  </a>
                </Link>
            </div>
          </div>
        </div>
        <div className='shape6'>
          <img src='/images/shape/shape6.png' alt='image' />
        </div>
        <div className='shape7'>
          {/* <img src='/images/shape/shape7.png' alt='image' /> */}
        </div>
        <div className='shape8'>
          {/* <img src='/images/shape/shape8.png' alt='image' /> */}
        </div>
        <div className='shape9'>
          <img src='/images/shape/shape9.png' alt='image' />
        </div>
        <div className='shape15'>
          <img src='/images/shape/shape15.png' alt='image' />
        </div>
      </div>
    </>
  );
};

export default HeroWhy;
