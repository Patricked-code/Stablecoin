import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import dynamic from 'next/dynamic';
const OwlCarousel = dynamic(import('react-owl-carousel3'));

const options = {
  nav: true,
  loop: true,
  margin: 30,
  dots: true,
  autoplay: true,
  autoplayHoverPause: true,
  navText: [
    "<i class='bx bx-left-arrow-alt'></i>",
    "<i class='bx bx-right-arrow-alt'></i>",
  ],
  responsive: {
    0: {
      items: 1,
    },
    576: {
      items: 2,
    },
    768: {
      items: 3,
    },
    992: {
      items: 3,
    },
  },
};

const CardTransaction = () => {
  const [display, setDisplay] = useState(false);
  const [isMounted, setisMounted] = useState(false);
  const [newData, setnewData] = useState([]);

  useEffect(() => {
    setisMounted(true);
    setDisplay(true);
    setisMounted(false);
  }, []);

  // useEffect(() => {
  //   const getCoins = async () => {
  //     const { data } = await axios.get(
  //       'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false'
  //     );
  //     setnewData(data);
  //   };
  //   getCoins();
  // }, []);

  return (
    <>
      <div className='best-seller-area pt-100'>
        <div className='container'>
          <div className='row justify-content-center'>
            <div className='col-xl-4 col-lg-12 col-md-12'>
              <div className='best-seller-image'>
                <img src='/images/women.png' alt='image' />
              </div>
            </div>
            <div className='col-xl-8 col-lg-12 col-md-12'>
              <div className='best-seller-content'>
                <div className='section-title'>
                  <h2>Ecosysteme</h2>
                  <p>
                  Vous pouvez utiliser vos E-WARI pour tirer profit de la digitalisation en Afrique.  
                  Eventuellement pour effectuer des achats en ligne, Investir dans des produits financiers tokénisé, 
                  effectuer des démarches administrtives, payer vos facture ou encore financer des projets via crowfunding
                  </p>
                </div>
                <div className='cryptocurrency-slides'>
                  {display ? (
                    <OwlCarousel {...options}>
                      {/* Factures & Paiement */}
                        <div className='content'>
                          <div className='single-cryptocurrency-box'>
                          <Link href='/profil/ecosysteme/facture-paiement'>
                            <a>
                            <div className=' align-items-center'>
                              <div className=''>
                                <img src="/images/ecfa/ecosysteme/factures/fact2.jpeg" alt='image' />
                              </div>
                              <div className='title'>
                                <span className='sub-title'>
                                  Factures & Paiements
                                </span>
                              </div>
                            </div>
                            </a>
                            </Link>
                          </div>
                        </div>

                        {/* Investissements */}
                        <div className='content'>
                          <div className='single-cryptocurrency-box'>
                          <Link href='/profil/ecosysteme/investissement'>
                            <a>
                            <div className=' align-items-center'>
                              <div className=''>
                                <img src="/images/ecfa/ecosysteme/investissements/invest2.jpg" alt='image' />
                              </div>
                              <div className='title'>
                                <span className='sub-title'>
                                  Investissements
                                </span>
                              </div>
                            </div>
                            </a>
                            </Link>
                          </div>
                        </div>

                        {/* Crowdfunding */}
                        <div className='content'>
                          <div className='single-cryptocurrency-box'>
                          <Link href='/profil/ecosysteme/crowdfunding'>
                            <a>
                            <div className=' align-items-center'>
                              <div className=''>
                                <img src="/images/ecfa/ecosysteme/crowdfunding/crowd3.jpg" alt='image' width={3000}/>
                              </div>
                              <div className='title'>
                                <span className='sub-title'>
                                  Crowdfunding
                                </span>
                              </div>
                            </div>
                            </a>
                            </Link>
                          </div>
                        </div>

                        {/* E-commerces */}
                        <div className='content'>
                          <div className='single-cryptocurrency-box'>
                          <Link href='/profil/ecosysteme/ecommerces'>
                            <a>
                            <div className=' align-items-center'>
                              <div className=''>
                                <img src="/images/ecfa/ecosysteme/ecommerces/ecom1.jpeg" alt='image' />
                              </div>
                              <div className='title'>
                                <span className='sub-title'>
                                  E-commerces
                                </span>
                              </div>
                            </div>
                            </a>
                            </Link>
                          </div>
                        </div>

                        {/* Démarches administratives */}
                        <div className='content'>
                          <div className='single-cryptocurrency-box'>
                          <Link href='/profil/ecosysteme/demarches-administ'>
                            <a>
                            <div className=' align-items-center'>
                              <div className=''>
                                <img src="/images/ecfa/ecosysteme/administratives/administ2.jpeg" alt='image'  />
                              </div>
                              <div className='title'>
                                <span className='sub-title my-1'>
                                  administratives
                                </span>
                              </div>
                            </div>
                            </a>
                            </Link>
                          </div>
                        </div>

                       

                       

                          

                          
                      
                    </OwlCarousel>
                  ) : (
                    ''
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='shape14'>
          <img src='/images/shape/shape14.png' alt='image' />
        </div>
      </div>
    </>
  );
};

export default CardTransaction;
