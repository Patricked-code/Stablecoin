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
    const [selectedOption, setSelectedOption] = useState('');

    const handleOptionChange = (event) => {
        const selectedValue = event.target.value;
        setSelectedOption(selectedValue);
    
        // Attribution des points en fonction de la sélection
        switch (selectedValue) {
          case '1 Mois':
            setFee(10000);
            break; 
          case '3 Mois':
            setFee(35000);
            break;
          case '6 Mois':
            setFee(50000);
            break;
          case '1 An':
            setFee(80000);
            break;
          default:
            setFee(""); // Aucune sélection
        }
      };
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
                  <div className='form-group'>
                  <div className='input-group flex-nowrap'>

                    <label>
                      <input
                        type="radio"
                        value="30"
                        className='mx-3 '
                        checked={selectedOption === "30"}
                        onChange={handleOptionChange}
                      />
                      {/* 10000 35000 50000 80000 */}
                          1 Mois
                    </label>
                        <span  className="mx-5 colorGreen" >10 000 E-WARI</span>
                    </div>
                  </div>
                  <div className='form-group'>
                  <div className='input-group flex-nowrap'>

                    <label>
                      <input
                        type="radio"
                        value="90"
                        className='mx-3'
                        checked={selectedOption === "90"}
                        onChange={handleOptionChange}
                      />
                        3 Mois
                    </label>
                        <span  className="mx-5 colorGreen" >35 000 E-WARI</span>
                    </div>
                  </div>
                  <div className='form-group'>
                  <div className='input-group flex-nowrap'>

                    <label>
                        <input
                        type="radio"
                        value="180"
                        className='mx-3'
                        checked={selectedOption === "180"}
                        onChange={handleOptionChange}
                        />
                          6 Mois
                    </label>
                        <span  className="mx-5 colorGreen" >50 000 E-WARI</span>
                    </div>
                  </div>
                  <div className='form-group'>
                  <div className='input-group flex-nowrap'>

                    <label>
                        <input
                        type="radio"
                        value="365"
                        className='mx-3 '
                        checked={selectedOption === "365"}
                        onChange={handleOptionChange}
                        />
                        1 An
                    </label>
                    <span  className="mx-5 px-3 colorGreen" >80 000 E-WARI</span>
                    </div>
                  </div>

                  {/* Les boutons */}
                  <div className="form-group  mt-3 col-lg-12 col-md-12">
                      <button className="btn btn-primary" type='submit' disabled={isLoggingIn}> Abonner </button>
                  </div>
                </form>
              </div>
              <div className='col-lg-3 col-md-12'></div>
            </div>
          </div>
    </>
  );
};

export default CAccueilAbonnement;
