import { useState, useEffect } from 'react';
import React from "react";
import axios from 'axios';
import Link from 'next/link';
import { Icon } from '@iconify/react';


// Pour Magic
import { magic } from "../../../../magic";
import { ethers } from "ethers";
import Loading from "../../../loading";
import Router from "next/router";
import Swal from 'sweetalert2';
import Web3 from "web3";

// FIN

const FirsKyc = () => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API

    const [isLoggingIn, setIsLoggingIn] = useState(false);

   


  return (
    <>

        <div className='' >
            <div className=' mx-15'>
                <div className='py-10'>
                    <h1 className='text-center'>Questionnaires</h1>
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
            <div className='row'>
                <div className='col-lg-3 col-md-12'></div>

                    <div className='m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white cryptocurrency-search-box login-form col-lg-6 col-md-12'>
                        <form className=''>
                            {/* Question 1 */}
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="Q1"
                                    className="text-blackish-blue mb-2"
                                >
                                    Q1) Avez-vous des dépenses ou payer vous des charges récurrentes mensuelles ou annuelles ?( Assurances, loyers, abonnement "internet, eau, courant, transports" remboursement crédit)
                                </label>
                                <select 
                                className="form-control"
                                id="Q1"
                                required
                                // defaultValue={sex} 
                                // onChange={(event)=>setSex(event.target.value)}
                                >
                                <option defaultValue="">Choisissez</option>
                                    <optgroup className='single-cryptocurrency-box'>
                                    <option  value="Oui">Oui</option>
                                    <option  value="Non">Non</option>
                                    </optgroup>
                                </select>
                            </div >
                            {/* Fin */}

                            {/* Question 2 */}
                            <label
                                htmlFor="Q1"
                                className="text-blackish-blue mb-2"
                            >
                                Q2) Choisissez vos dépenses récurrentes parmi les catégories ci-dessous
                            </label>
                            {/* Loyer */}
                            <div className="form-group  mt-3 ">
                                <label
                                    htmlFor="terms-check"
                                    className="gr-check-input mb-7 d-flex"
                                >
                                    <input 
                                    type="checkbox" 
                                    name="transport"
                                    id='terms-check' 
                                    //   checked={formData.transport}
                                    //   onChange={handleChange}
                                    />
                                <p className=" mx-2 mb-0 text-center">
                                    Loyer
                                </p>
                                </label>
                            </div>
                            {/* Assurances */}
                            <div className="form-group  mt-3 ">
                                <label
                                    htmlFor="Assurances-check"
                                    className="gr-check-input mb-7 d-flex"
                                >
                                    <input 
                                    type="checkbox" 
                                    name="transport"
                                    id='Assurances-check' 
                                    //   checked={formData.transport}
                                    //   onChange={handleChange}
                                    />
                                <p className=" mx-2 mb-0 text-center">
                                    Assurances
                                </p>
                                </label>
                            </div>
                            {/* Crédit bancaire */}
                            <div className="form-group  mt-3 ">
                                <label
                                    htmlFor="bancaire-check"
                                    className="gr-check-input mb-7 d-flex"
                                >
                                    <input 
                                    type="checkbox" 
                                    name="transport"
                                    id='bancaire-check' 
                                    //   checked={formData.transport}
                                    //   onChange={handleChange}
                                    />
                                <p className=" mx-2 mb-0 text-center">
                                    Crédit bancaire
                                </p>
                                </label>
                            </div>
                            {/* Transport */}
                            <div className="form-group  mt-3 ">
                                <label
                                    htmlFor="Transport-check"
                                    className="gr-check-input mb-7 d-flex"
                                >
                                    <input 
                                    type="checkbox" 
                                    name="transport"
                                    id='Transport-check' 
                                    //   checked={formData.transport}
                                    //   onChange={handleChange}
                                    />
                                <p className=" mx-2 mb-0 text-center">
                                    Transport
                                </p>
                                </label>
                            </div>
                            {/* Abonnement & factures */}
                            <div className="form-group  mt-3 ">
                                <label
                                    htmlFor="factures-check"
                                    className="gr-check-input mb-7 d-flex"
                                >
                                    <input 
                                    type="checkbox" 
                                    name="transport"
                                    id='terms-check' 
                                    //   checked={formData.transport}
                                    //   onChange={handleChange}
                                    />
                                <p className=" mx-2 mb-0 text-center">
                                    Abonnement & factures
                                </p>
                                </label>
                            </div>
                            {/* Scolarité */}
                            <div className="form-group  mt-3 ">
                                <label
                                    htmlFor="Scolarite-check"
                                    className="gr-check-input mb-7 d-flex"
                                >
                                    <input 
                                    type="checkbox" 
                                    name="scolarite"
                                    id='terms-check' 
                                    //   checked={formData.transport}
                                    //   onChange={handleChange}
                                    />
                                    <p className=" mx-2 mb-0 text-center">
                                        Scolarité
                                    </p>
                                </label>
                            </div>
                            {/* Fin Q2 */}

                            {/* Question 3 */}
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="Q1"
                                    className="text-blackish-blue mb-2"
                                >
                                    Q3) avez-vous une source récurrente de revenus financiers ? soit mensuelle, Trimestriels ou annuels ?
                                </label>
                                <select 
                                className="form-control"
                                id="Q1"
                                required
                                // defaultValue={sex} 
                                // onChange={(event)=>setSex(event.target.value)}
                                >
                                <option defaultValue="">Choisissez</option>
                                    <optgroup className='single-cryptocurrency-box'>
                                    <option  value="Oui">Oui - J'ai des revenus financiers récurrents</option>
                                    <option  value="Non">Non - mes revenus ne sont pas récurrents</option>
                                    </optgroup>
                                </select>
                            </div >
                            {/* Fin Q3 */}

                            {/* Question 4 */}
                            <label
                                htmlFor="Q1"
                                className="text-blackish-blue mb-2"
                            >
                                Q4) Choisissez la ou les fréquences de vos revenus
                            </label>
                            {/* Revenus mensuels*/}
                            <div className="form-group  mt-3 ">
                                <label
                                    htmlFor="mensuels-check"
                                    className="gr-check-input mb-7 d-flex"
                                >
                                    <input 
                                    type="checkbox" 
                                    name="mensuels"
                                    id='mensuels-check' 
                                    //   checked={formData.transport}
                                    //   onChange={handleChange}
                                    />
                                <p className=" mx-2 mb-0 text-center">
                                    Revenus mensuels
                                </p>
                                </label>
                            </div>
                            {/* Revenus Trimestriels */}
                            <div className="form-group  mt-3 ">
                                <label
                                    htmlFor="trimestriels-check"
                                    className="gr-check-input mb-7 d-flex"
                                >
                                    <input 
                                    type="checkbox" 
                                    name="trimestriels"
                                    id='trimestriels-check' 
                                    //   checked={formData.transport}
                                    //   onChange={handleChange}
                                    />
                                <p className=" mx-2 mb-0 text-center">
                                    Revenus trimestriels
                                </p>
                                </label>
                            </div>
                            {/* Revenus annuels */}
                            <div className="form-group  mt-3 ">
                                <label
                                    htmlFor="annuels-check"
                                    className="gr-check-input mb-7 d-flex"
                                >
                                    <input 
                                    type="checkbox" 
                                    name="annuels"
                                    id='annuels-check' 
                                    //   checked={formData.transport}
                                    //   onChange={handleChange}
                                    />
                                <p className=" mx-2 mb-0 text-center">
                                    Revenus annuels
                                </p>
                                </label>
                            </div>
                            {/* Fin Q4 */}

                            {/* Question 5 */}
                            <label
                                htmlFor="Q1"
                                className="text-blackish-blue mb-2"
                            >
                                Q5) Dans quel cadre touchez vous ces revenus ?
                            </label>
                            {/* Salaire mensuels*/}
                            <div className="form-group  mt-3 ">
                                <label
                                    htmlFor="SalaireMensuels-check"
                                    className="gr-check-input mb-7 d-flex"
                                >
                                    <input 
                                    type="checkbox" 
                                    name="SalaireMensuels"
                                    id='SalaireMensuels-check' 
                                    //   checked={formData.transport}
                                    //   onChange={handleChange}
                                    />
                                <p className=" mx-2 mb-0 text-center">
                                    Salaire mensuels (Vous êtes salariés)
                                </p>
                                </label>
                            </div>
                            {/* Revenus Trimestriels */}
                            <div className="form-group  mt-3 ">
                                <label
                                    htmlFor="trimestriels-check"
                                    className="gr-check-input mb-7 d-flex"
                                >
                                    <input 
                                    type="checkbox" 
                                    name="trimestriels"
                                    id='trimestriels-check' 
                                    //   checked={formData.transport}
                                    //   onChange={handleChange}
                                    />
                                <p className=" mx-2 mb-0 text-center">
                                    Revenus Trimestriels
                                </p>
                                </label>
                            </div>
                            {/* Rentes immobilières (Vous percevez des loyers) */}
                            <div className="form-group  mt-3 ">
                                <label
                                    htmlFor="immobilieres-check"
                                    className="gr-check-input mb-7 d-flex"
                                >
                                    <input 
                                    type="checkbox" 
                                    name="immobilieres"
                                    id='immobilieres' 
                                    //   checked={formData.transport}
                                    //   onChange={handleChange}
                                    />
                                <p className=" mx-2 mb-0 text-center">
                                    Rentes immobilières (Vous percevez des loyers)
                                </p>
                                </label>
                            </div>
                            {/* Fin Q5 */}



                            <Link href='/profil/kyc/particulier/seconde-phase'>
                                <a
                                className=""
                                >
                                    <button className="btn btn-primary " type='button'  disabled={isLoggingIn}>Suivant</button>
                                </a>
                            </Link>
                       
                            {/* <button className="btn btn-primary "  disabled={isLoggingIn}>Suivant</button> */}
                        </form>       
                    </div>
                <div className='col-lg-3 col-md-12'></div>
            </div>
        </div>
    </>
  );
};

export default FirsKyc;
