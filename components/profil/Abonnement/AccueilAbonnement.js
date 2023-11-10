import { useCallback, useState, useEffect,useRef } from 'react';
import React from "react";
import Link from 'next/link';
import { Table } from '@nextui-org/react';
import Router from "next/router";
import Swal from 'sweetalert2';
// FIN

const CAccueilAbonnement = () => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API

    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [messageError, setMessageError] = useState();

    //State du formulaire
    const [period, setPeriod] = useState('');
    const [fee, setFee] = useState(); 
    


  return (
    <>
      
        <div className='mt-15' >
            <div className='py-10'>
                <h1 className='text-center'>Abonnement</h1>
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
            <div className='row mt-5'>
              <div className='col-lg-3 col-md-12'></div>
              <div className='m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white cryptocurrency-search-box login-form col-lg-6 col-md-12'>
               
                {/* FORM  */}
                <form >
                    {/* <form onSubmit={updateQuestionFive}> */}
                    <div className='form-group my-3 '>
                        <label className="mx-2  mb-2" htmlFor='period'>
                            Durée d'abonnement
                        </label>
                                                            
                        <select 
                            className="form-control"
                            id="period"
                            required
                            defaultValue={period} 
                            onChange={(event)=>setPeriod(event.target.value)}
                        >
                            <option defaultValue="">Choisissez une durée</option>
                            <optgroup className='single-cryptocurrency-box'>
                                <option  value="true">1 Mois</option>
                                <option  value="false">2 Mois</option>
                                <option  value="false">3 Mois</option>
                            </optgroup>
                        </select>
                    </div>
                    <div className='form-group'>
                        <label className="mx-2  mb-2" htmlFor='fee'>
                            Les frais d'abonnement
                        </label>
                        <input
                            type='number'
                            className='form-control'
                            disabled
                            name='fee'
                            defaultValue={fee}
                            onChange={(e)=>setFee(e.target.value)}
                        />
                    </div>

                    {/* Les boutons */}
                    <button className="btn btn-primary" type='submit' disabled={isLoggingIn}> Abonner </button>
                </form>
              </div>
              <div className='col-lg-3 col-md-12'></div>
            </div>
          </div>
    </>
  );
};

export default CAccueilAbonnement;
