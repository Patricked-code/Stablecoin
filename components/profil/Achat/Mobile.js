import { useState, useEffect } from 'react';
import React from "react";
import axios from 'axios';
import Link from 'next/link';
import { Icon } from '@iconify/react';


// Pour Magic
// import { magic } from "../../../../magic";
// import { ethers } from "ethers";
// import Loading from "../../../loading";
// import Router from "next/router";
// import Swal from 'sweetalert2';
// import Web3 from "web3";

// FIN

const MobileAchat = () => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API
     // Variable de l'api key de stablecoin
     const API_KEY_STABLECOIN = process.env.NEXT_PUBLIC_API_KEY_STABLECOIN

    const [isLoggingIn, setIsLoggingIn] = useState(false);

    // Retrait
    const [montantRetrait, setMontantRetrait] = useState(0)
    const [montantRetraitCalculer, setMontantRetraitCalculer] = useState()


    // Achat
    const [montantAchat, setMontantAchat] = useState(0)

    const [bankName, setBankName] = useState("")
    const [iban, setIban] = useState("")
    const [countrie, setCountrie] = useState("")
    const [countrieMobile, setCountrieMobile] = useState("")
    const [countrieBank, setCountrieBank] = useState("")
    const [isoPays, setIsoPays] = useState("")

    // States Mobile Money
    const [accountName, setAccountName] = useState()
    const [userDataMobile, setUserDataMobile] = useState()
    const [dataWayPayment, setDataWayPayment] = useState();
    const [mobileLenght, setMobileLength] = useState()
    const [numberMobile, setNumberMobile] = useState()

    const [networkMobile, setNetworkMobile] = useState()
    const [allOperators, setAllOperators] = useState()
    const [allCountry , setAllCountry ] = useState()
    const [allBank , setAllBank ] = useState()

    // Les states des operateurs
    const [allOperatorsOfUser, setAllOperatorsOfUser]=useState()
    const [countryIso, setCountryIso]=useState()
    const [operatorLength, setOperatorLength]=useState()
    const [operatorName, setOperatorName]=useState()
    
    


        // RECUPERER TOUS LES PAYS
        useEffect(async() => {
            const token = localStorage.getItem('tokenEnCours')
            console.log("token pays=>",token)
            
                const getAllCountries = async () => {
                const resCountry = await fetch(`${API_URL}/api/country/find-all`, {
                    headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': `${API_KEY_STABLECOIN}`,
                    Authorization:  `Bearer ${token}`,
    
                    },
                })
                    .then((resCountry) => resCountry.json())
                    .then((allCountry) => {
                    setAllCountry(allCountry)
                    }) 
    
                };
                
                await getAllCountries();
        }, []);
        // FIN
    
    
        // RECUPERER TOUTES LES BANQUES 
        useEffect(async() => {
            const token = localStorage.getItem('tokenEnCours')
            console.log("token me=>",token)
            
                const getAllBank = async () => {
                const resBank = await fetch(`${API_URL}/api/bank/find-all`, {
                    headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': `${API_KEY_STABLECOIN}`,
                    Authorization:  `Bearer ${token}`,
                    },
                })
                    .then((resBank) => resBank.json())
                    .then((data) => {
                    setAllBank(data)
                    }) 
                };
                // console.log("Banques =>",allBank)
                await getAllBank();
        }, []);
        // FIN
    
    
        // RECUPERER TOUS LES OPERATEURS
        useEffect(async() => {
            const token = localStorage.getItem('tokenEnCours')
            console.log("token me=>",token)
            
                const getAllOperators = async () => {
                const resOperator = await fetch(`${API_URL}/api/operator/find-all-Operators`, {
                    headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': `${API_KEY_STABLECOIN}`,
                    Authorization:  `Bearer ${token}`,
                    },
                })
                    .then((resOperator) => resOperator.json())
                    .then((data) => {
                    setAllOperators(data)
                    }) 
                };
                console.log("Operator =>",allOperators)
                await getAllOperators();
        }, []);
        // FIN


        // FONCTION D'OBTENTION DES OPERATEURS EN FONCTION DE L'UTILISATEUR CONNECTE
     useEffect(() => {
        const token = localStorage.getItem('tokenEnCours')
            const getAllOperatorsOfUser = async () => {
            const res = await fetch(`${API_URL}/api/user/find-all-operator-for-user`, {
                headers: {
                'Content-Type': 'application/json',
                'x-api-key': `${API_KEY_STABLECOIN}`,
                Authorization:  `Bearer ${token}`,
                },
            })
                .then((res) => res.json())
                .then((data) => {
                setAllOperatorsOfUser(data)
                setOperatorLength(data.length)
                }) 
            };
            getAllOperatorsOfUser();
    }, []);
    // FIN


    // Obtenir mes numéros mobile money
    useEffect(() => {
        const token = localStorage.getItem('tokenEnCours')
        // console.log("token Mobile",token)
        
            const getMobiles = async () => {
            const res = await fetch(`${API_URL}/api/user/find-all-mobile-for-user`, {

                headers: {
                'Content-Type': 'application/json',
                'x-api-key': `${API_KEY_STABLECOIN}`,
                Authorization:  `Bearer ${token}`,
                },
            })
                .then((res) => res.json())
                .then((userDataMobile) => {
                    setUserDataMobile(userDataMobile)
                    setMobileLength(userDataMobile.length)
                }) 

                
            };
            
            getMobiles();
    }, []);
    // Fin


   


  return (
    <>

        <div className='' >
            <div className=' mx-15'>
                <div className='py-10'>
                    <h3 className='text-center'>Achat avec mobile money</h3>
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
                        <div className='col-lg-12 col-md-12 row justify-content-between'>
                        <div className='input-group-alternative my-3'>
                            <select 
                            placeholder='Pays'
                            className='form-control'
                            defaultValue={operatorName} 
                            onChange={(event)=>setOperatorName(event.target.value)}
                            >
                            <option>Choisissez operateur</option>
                            {/* Parcourir les operateurs*/}
                            {!operatorLength=="0"? (
                                allOperatorsOfUser.map((data) => (
                                    <optgroup className='single-cryptocurrency-box' key={data.id}>
                                        <option value={data.operatorName}>{data.operatorName}</option>
                                    </optgroup>
                                ))
                            ):('')}
                            </select>
                            </div>

                           
                            { operatorName ? (
                                <>
                            <div className='input-group-alternative my-3'>
                            <select 
                            placeholder='Reseau'
                            className='form-control'
                            defaultValue={networkMobile} 
                            onChange={(event)=>setNetworkMobile(event.target.value)}
                            >
                                <option>Choisissez un numero</option>

                                {!mobileLenght=="0"?(
                                userDataMobile.map((data) => (
                                    data.networkMobile===operatorName?
                                        <optgroup className='single-cryptocurrency-box' key={data.id}>
                                            <option value={data.numberMobile}>{data.numberMobile}</option>
                                        </optgroup>
                                    :"Non"
                                ))
                                ):('')}
                                </select>
                            </div>
                            </>
                            ) : ("")}

                            {networkMobile ? (
                                <>
                                    <div className='input-group-alternative my-3'>
                                    <input
                                    type='number'
                                    name='mo'
                                    required='required'
                                    placeholder="Numero mobile"
                                    className="form-control"
                                    defaultValue={montantAchat} 
                                    onChange={(event)=>setMontantAchat(event.target.value)}
                                    />
                                    </div>
                                
                                    <div className='row'>
                                        <div className='input-group-alternative my-3 col-lg-6 col-md-6'>
                                            <label className="mx-2">Montant en CFA</label>
                                            
                                            <input
                                            type='number'
                                            name='mo'
                                            disabled

                                            required='required'
                                            placeholder="Numero mobile"
                                            className="form-control"
                                            value={montantAchat} 
                                            // onChange={(event)=>setMontantAchat(event.target.value)}
                                            />
                                        </div>
                                        <div className='input-group-alternative my-3 col-lg-6 col-md-6'>
                                            <label className="mx-2">Total à acheter</label>
                                            
                                            <input
                                            type='number'
                                            name='mo'
                                            disabled
                                            required='required'
                                            placeholder="Numero mobile"
                                            className="form-control"
                                            value={montantAchat} 
                                            // onChange={(event)=>setMontantAchat(event.target.value)}
                                            />
                                        </div>
                                    </div>
                              
                                </>

                            ) : ("")}
                            
                            </div>
                            {networkMobile ? (
                                <button type='submit'  className="btn btn-primary" disabled={isLoggingIn}>Acheter</button>
                            ) : ("")}
                        
                        </form>  
                    </div>
                <div className='col-lg-3 col-md-12'></div>
            </div>
        </div>
    </>
  );
};

export default MobileAchat;
