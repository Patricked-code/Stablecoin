import { useState, useEffect } from 'react';
import React from "react";
import Link from 'next/link';
// reactstrap components
import { Button} from "reactstrap";


const Compte = () => {


  return (
    <>

      <div className='' >
        <div className=' mx-15'>
            <div className='py-10'>
                <h1 className='text-center'>Mon profil</h1>
            </div>
        </div>

        {/* Les images de fond */}
        <div className='shape1'>
          {/* <img src='/images/shape/shape1.png' alt='image' /> */}
        </div>
        <div className='shape2 mb-5'><br/>
          <img src='/images/shape/shape2.png' alt='image' />
        </div>
        <div className='shape3'>
          {/* <img src='/images/shape/shape3.png' alt='image' /> */}
        </div>
        <div className='shape4'>
          <img src='/images/shape/shape4.png' alt='image' />
        </div>
        {/* Fin des images de fond */}

        {/* Les cards */}
        <div className='cryptocurrency-search-box'>
            <div className='row'>
                    <div className='col-lg-4 col-md-4'>
                        <div className='currency-selection text-center'>
                            <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                                <div className='cryptocurrency-slides'>
                                    <div className='single-cryptocurrency-box'>
                                        <div className='d-flex align-items-center'>
                                        {/* <div className='bestseller-coin-image'>
                                            <img src="/images/ecfa/logo/logo_ewari1.jpg" className="rounded-circle"  alt='image' />
                                        </div> */}
                                        <div className='title'>
                                            <h3>Mes infos de connexion</h3>
                                        </div>
                                        </div>
                                        <div className='btn-box'>
                                            <Link href='/profil/informations/connexion' className="align-right">
                                                <Button
                                                    block
                                                    color="primary"
                                                    type="button"
                                                >
                                                    Voir plus
                                                </Button>
                                            </Link>
                                        {/* Fin */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                <div className='col-lg-4 col-md-4'>
                    <div className='currency-selection text-center'>
                        <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                        <div className='cryptocurrency-slides'>
                                <div className='single-cryptocurrency-box'>
                                    <div className='d-flex align-items-center'>
                                    <div className='title'>
                                        <h3>Mes infos personnelles</h3>
                                    </div>
                                    </div>
                                    <div className='btn-box'>
                                        <Link href='/profil/informations/utilisateur' className="align-right">
                                            <Button
                                                block
                                                color="primary"
                                                type="button"
                                            >
                                                Voir plus
                                            </Button>
                                        </Link>
                                    {/* Fin */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='col-lg-4 col-md-4'>
                    <div className='currency-selection text-center'>
                        <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                        <div className='cryptocurrency-slides'>
                                <div className='single-cryptocurrency-box'>
                                    <div className='d-flex align-items-center'>
                                    
                                    <div className='title'>
                                        <h3>Mon historique</h3>
                                    </div>
                                    </div>
                                    <div className='btn-box'>
                                    <Link href='/profil/historique' className="align-right">
                                    <Button
                                        block
                                        color="primary"
                                        type="button"
                                    >
                                        Voir plus
                                    </Button>
                                    </Link>
                                    {/* Fin */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='col-lg-4 col-md-4'>
                    <div className='currency-selection text-center'>
                        <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                        <div className='cryptocurrency-slides'>
                                <div className='single-cryptocurrency-box'>
                                    <div className='d-flex align-items-center'>

                                    <div className='title'>
                                        <h3>Mes commandes</h3>
                                    </div>
                                    </div>
                                    <div className='btn-box'>
                                    <Button
                                        block
                                        color="primary"
                                        type="button"
                                    >
                                        Voir plus
                                    </Button>
                                    {/* Fin */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

       
      </div>



      












    






    </>
  );
};

export default Compte;
