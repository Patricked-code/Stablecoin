import Link from '../../utils/ActiveLink';
import { Icon } from '@iconify/react';

import React, { useEffect, useState, useCallback } from "react";
import Router from "next/router";
// import Link from 'next/link';
import { magic } from "../../magic";
import Loading from "../../components/loading";
import { ethers } from "ethers";

const Navbar = () => {
  const [showMenu, setshowMenu] = useState(false);

  // Pour MAGIC
    // states
  const [userMetadata, setUserMetadata] = useState();
  const [userEmail, setUserEmail] = useState();
  const [token, setToken] = useState()


  // hooks
  /**
   * On virtual dom mount, we check if a user is logged in.
   *  If so, we'll retrieve the authenticated user's profile.
   */
  useEffect(() => {

    const toke = localStorage.getItem('tokenEnCours')
    
  setToken(toke)
    magic.user.isLoggedIn().then(async (magicIsLoggedIn) => {
      if (magicIsLoggedIn) {
        magic.user.getMetadata().then(setUserMetadata);
        const provider = new ethers.providers.Web3Provider(magic.rpcProvider);
        const signer = provider.getSigner();
      } else {
        // If no user is logged in, redirect to `/login`////
        // Router.push("/");
      }
    });
  }, []);

  /**
   * Perform logout action via Magic.
   */
  const logout = useCallback(() => {
    magic.user.logout().then(() => {
      // supprimer le token
      localStorage.removeItem('tokenEnCours');
      // Actualisation et redirection
      setTimeout(() => {
        window.location.reload()
        

       }, 1000)
      Router.push("/");

    });
  }, [Router]);

  // Fin Magic

  const toggleMenu = () => {
    setshowMenu(!showMenu);
  };

  useEffect(() => {
    let elementId = document.getElementById('navbar');
    document.addEventListener('scroll', () => {
      if (window.scrollY > 170) {
        elementId.classList.add('is-sticky');
      } else {
        elementId.classList.remove('is-sticky');
      }
    });
    window.scrollTo(0, 0);
  }, []);



  return (
    <>
      <div id='navbar' className='navbar-area'>
        <div className='raimo-responsive-nav'>
          <div className='container'>
            <div className='raimo-responsive-menu'>
              <div onClick={() => toggleMenu()} className='hamburger-menu'>
                {showMenu ? (
                  <i className='bx bx-x'></i>
                ) : (
                  <i className='bx bx-menu'></i>
                )}
              </div>
              <div className='logo'>
                <Link href='/'>
                  <a>
                    {/* <img src='/images/logo.png' alt='logo' /> */}
                  {/* <img src='/images/ecfa/logo/img_1.jpeg' width={'40'} alt='logo' /> */}
                  <img src='/images/ecfa/logo/logo_ewari3.jpg' width={'80'} alt='logo' />
                  
                  </a>
                </Link>
              </div>

              {/* <div className='responsive-others-option'>
                <div className='d-flex align-items-center'>
                  <div className='option-item'>
                    <Link href='/authentication' activeClassName='active'>
                      <a className='login-btn'>
                        <i className='bx bx-log-in'></i>
                      </a>
                    </Link>
                  </div>

                  <div className='option-item mx-3'>
                  </div>
                </div>
              </div> */}

              {/* Après connexion */}
              {userMetadata && token? (
              <ul className='navbar-nav'>
              <li className='nav-item megamenu '>
                <div className='others-option'>
                  <div className='d-flex align-items-center'>
                    <div className='option-item'>
                        <a className='dropdown-toggle nav-link'>
                        <Icon icon="carbon:user-admin" color="#00ff23" width="50" height="40" />  
                        </a>
                    </div>
                  </div>
                </div>
                  <ul className='dropdown-menu'>
                    
                    <li className='nav-item'>
                      {/* <div >{userMetadata.email}</div> */}
                    </li>
                    <li className='nav-item'>
                      <Link href='/buy'>
                        <a className='nav-link'>
                          <img
                            src='/images/cryptocurrency/cryptocurrency4.png'
                            alt='image'
                          />
                          Profil
                        </a>
                      </Link>
                    </li>
                    <li className='nav-item'>
                      <Link href='/profil/portefeuille'>
                        <a className='nav-link'>
                          <img
                            src='/images/cryptocurrency/cryptocurrency5.png'
                            alt='image'
                          />
                          Mes actifs
                        </a>
                      </Link>
                    </li>
                    <li className='nav-item'>
                      <Link href='/#' activeClassName='active'>
                        <a className='nav-link'>
                          <i className='bx bxs-chevron-right-circle'></i>
                          Transactions
                        </a>
                      </Link>
                    </li>

                    

                    <li className='nav-item'>
                        <a className='nav-link'>
                        <button onClick={logout} className="mx-3 btn btn-danger">Déconnexion</button>
                         
                        </a>
                    </li>
                  </ul>
                </li>
                </ul>
              /* Fin */

               ) : ( 
                <div className='others-option'>
                <div className='d-flex align-items-center'>
                  <div className='option-item'>
                    <Link href='/auth/authentication' activeClassName='active'>
                      <a className='login-btn'>
                        <i className='bx bx-log-in'></i> Connexion
                      </a>
                    </Link>
                  </div>
                </div>
              </div>

               )} 
            </div>
          </div>
        </div>
        <nav
          className={
            showMenu
              ? 'show navbar navbar-expand-md navbar-light'
              : 'navbar navbar-expand-md navbar-light hide-menu'
          }
        >
          <div className='container'>
            <Link href='/'>
              <a className='navbar-brand'>
                {/* <img src='/images/logo.png' alt='logo' /> */}
                <img src='/images/ecfa/logo/logo_ewari1.jpg' width={'80'} alt='logo' />

              </a>
            </Link>
            <div className='collapse navbar-collapse mean-menu'>
              <ul className='navbar-nav'>
                
                <li className='nav-item'>
                  <Link href='/' activeClassName='active'>
                    <a className='nav-link listing'>Accueil</a>
                  </Link>
                </li>

                {/* <li className='nav-item'>
                  <Link href='/casUtilisation/' activeClassName='active'>
                    <a className='nav-link'>Cas d'utilisation</a>
                  </Link>
                </li> */}
                
                {/* <li className='nav-item'>
                  <Link href='/pourquoi_ewari/' activeClassName='active'>
                    <a className='nav-link'>Pourquoi E-WARI ?</a>
                  </Link>
                </li> */}

                <ul className=''>
                <li className='nav-item megamenu '>
                <div className='others-option'>
                  <div className='d-flex align-items-center'>
                    <div className='option-item'>
                        <a className='dropdown-toggle nav-link'>
                          Ecosystème
                        </a>
                    </div>
                  </div>
                </div>
                  <ul className='dropdown-menu'>
                    <li className='nav-item'>
                      <Link href='/profil/ecosysteme/crowdfunding'>
                        <a className='nav-link'>
                          Crowdfunding
                        </a>
                      </Link>
                    </li>
                    <li className='nav-item'>
                      <Link href='/profil/ecosysteme/investissement'>
                        <a className='nav-link '>
                          Investissement
                        </a>
                      </Link>
                    </li>
                    <li className='nav-item'>
                      <Link href='/profil/ecosysteme/ecommerces' activeClassName='active'>
                        <a className='nav-link'>
                         E-commerce
                        </a>
                      </Link>
                    </li>
                    

                    
                  </ul>
                </li>
                </ul>

                <li className='nav-item'>
                  <Link href='/#' activeClassName='active'>
                    <a className='nav-link'>Actualités</a>
                  </Link>
                </li>

                <ul className=''>
                <li className='nav-item megamenu '>
                <div className='others-option'>
                  <div className='d-flex align-items-center'>
                    <div className='option-item'>
                        <a className='dropdown-toggle nav-link'>
                          Stablecoin
                        </a>
                    </div>
                  </div>
                </div>
                  <ul className='dropdown-menu'>
                    <li className='nav-item'>
                      <Link href='/pourquoi_ewari/'>
                        <a className='nav-link'>
                          Pourquoi E-WARI
                        </a>
                      </Link>
                    </li>
                    <li className='nav-item'>
                      <Link href='/casUtilisation/'>
                        <a className='nav-link'>
                          Cas d'utilisation
                        </a>
                      </Link>
                    </li>
                    <li className='nav-item'>
                      <Link href='/#'>
                        <a className='nav-link'>
                          Transparence
                        </a>
                      </Link>
                    </li>
                  </ul>
                </li>
                </ul>

                <li className='nav-item'>
                  <Link href='/map/carte-commerces' activeClassName='active'>
                    <a className='nav-link'>Localisation</a>
                  </Link>
                </li>

               
                {/* <li className='nav-item'>
                  <Link href='/#' activeClassName='active'>
                    <a className='nav-link'>Comment ça fonctionne</a>
                  </Link>
                </li> */}



               

                {/* <li className='nav-item'>
                  <Link href='/#' activeClassName='active'>
                    <a className='nav-link'>Transparence</a>
                  </Link>
                </li> */}
                
              </ul>

              {/* Après connexion */}
              {/* {userMetadata? ( */}
              {userMetadata && token ? (
              <ul className='navbar-nav'>
              <li className='nav-item megamenu '>
                <div className='others-option'>
                  <div className='d-flex align-items-center'>
                    <div className='option-item'>
                        <a className='dropdown-toggle nav-link'>
                        <Icon icon="carbon:user-admin" color="#00ff23" width="50" height="40" />  
                        </a>
                    </div>
                  </div>
                </div>
                  <ul className='dropdown-menu'>
                    
                    <li className='nav-item'>
                      {/* <div >{userMetadata.email}</div> */}
                    </li>
                    <li className='nav-item'>
                      <Link href='/profil'>
                        <a className='nav-link'>
                          <img
                            src='/images/cryptocurrency/cryptocurrency4.png'
                            alt='image'
                          />
                          Profil
                        </a>
                      </Link>
                    </li>
                    <li className='nav-item'>
                      <Link href='/profil/portefeuille'>
                        <a className='nav-link'>
                          <img
                            src='/images/cryptocurrency/cryptocurrency5.png'
                            alt='image'
                          />
                          Mes actifs
                        </a>
                      </Link>
                    </li>
                    <li className='nav-item'>
                      <Link href='/#' activeClassName='active'>
                        <a className='nav-link'>
                          <i className='bx bxs-chevron-right-circle'></i>
                          Transactions
                        </a>
                      </Link>
                    </li>

                    <li className='nav-item'>
                        <a className='nav-link'>
                        <button onClick={logout} className="mx-3 btn btn-danger">Déconnexion</button>
                         
                        </a>
                    </li>
                  </ul>
                </li>
                </ul>
              // Fin  

               ) : ( 
                <div className='others-option'>
                <div className='d-flex align-items-center'>
                  <div className='option-item'>
                    <Link href='/auth/authentication' activeClassName='active'>
                      <a className='login-btn'>
                        <i className='bx bx-log-in'></i> Connexion
                      </a>
                    </Link>
                  </div>
                </div>
              </div>

              )}

            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Navbar;
