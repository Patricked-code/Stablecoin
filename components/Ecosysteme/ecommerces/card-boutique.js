import React, { useState, useEffect, useCallback } from "react";


export default function Boutique() {
 
    return (
      <>
        <div className='banner-wrapper-area'>
          <div className='container'>
            <div className='row align-items-center m-0'>
              <div className='col-xl-3 col-lg-3 col-md-3 p-0'></div>

              <div className='col-xl-6 col-lg-6 col-md-6 p-0'>
                <div className='banner-wrapper-content'>
                    <div className='currency-selection text-center'>
                        <div className=" text-center rounded-pill my-3 px-5   rounded-xl bg-primary text-white ">
                            LES BOUTIQUES DES MARCHANDS
                        </div>
                    </div>
                </div>
              </div>
              <div className='col-xl-3 col-lg-3 col-md-3 p-0'></div>
            </div>

            <div className='buy-sell-cryptocurrency-area pt-100 pb-70'>
                <div className='container'>
                    <div className='section-title'>
                        <h4>E-WARI peut être utilisé dans ces boutiques pour faire des achats. </h4>
                        <p>
                            Parcourez les boutiques ci-dessous pour acheter des produits de votre choix avec le jeton E-WARI
                        </p>
                    </div>
                    <div className='row justify-content-center'>
                        <div className='col-lg-4 col-md-6 '>
                            <div className='text-center single-buy-sell-item'>
                                    <img src='/images/ecfa/ecosysteme/ecommerces/ordinateurs/ord3.jpg' height={20} width={250} alt='image' />
                                <h3 className="my-2">ORDINATEURS</h3>
                                <p>Vendeur: Mr Kone Arouna</p>
                                <a href="/#">
                                    <button className='btn-box default-btn btn-sm'>
                                        Voir les produits
                                    </button>
                                </a>
                            </div>
                        </div>

                        <div className='col-lg-4 col-md-6 '>
                            <div className='text-center single-buy-sell-item'>
                                    <img src='/images/ecfa/ecosysteme/ecommerces/nourriture/locale5.jpg' width={250} alt='image' />
                                <h3 className="my-2">Nourriture locale</h3>
                                <p>Vendeuse: Mme Tuo Solange</p>
                                <a href="/#">
                                    <button className='btn-box default-btn btn-sm'>
                                        Voir les produits
                                    </button>
                                </a>
                            </div>
                        </div>

                        <div className='col-lg-4 col-md-6 '>
                            <div className='text-center single-buy-sell-item'>
                                    <img src='/images/ecfa/ecosysteme/ecommerces/vetement/vetement7.jpg' width={200} alt='image' />
                                <h3 className="my-2">Vêtement</h3>
                                <p>Vendeur: Mr Traoré Klêdjeni</p>
                                <a href="/#">
                                    <button className='btn-box default-btn btn-sm'>
                                        Voir les produits
                                    </button>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='shape13'>
                    <img src='/images/shape/shape13.png' alt='image' />
                </div>
            </div>
          </div>
        </div>
      </>
    );
  };

