import React from 'react';
import Link from 'next/link';
import axios from 'axios';


import { useCallback, useState } from 'react';
import Router from 'next/router';
import { magic } from '../../../magic';
import Swal from 'sweetalert2';





function TwoEdition() {

  const [email, setEmail] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Pour le formulaire de mise à jour du profil
  const [city, setCity] = useState("");
  const [birthday, setBirthday] = useState();
  const [picture, setPicture] = useState();
  const [recto, setRecto] = useState()
  const [verso, setVerso] = useState()

//   Banque
const [bankName, setBankName] = useState()
const [iban, setIban] = useState()
const [countrie, setCountrie] = useState()

//   Mobile
const [accountName, setAccountName] = useState()
const [numberMobile, setNumberMobile] = useState()
const [networkMobile, setNetworkMobile] = useState()





  


  /**
   * Perform login action via Magic's passwordless flow. Upon successuful
   * completion of the login flow, a user is redirected to the homepage.
   */
  const login = useCallback(async () => {
    setIsLoggingIn(true);

    try {
      // Grab auth token from loginWithMagicLink
      const didToken = await magic.auth.loginWithMagicLink({
        email,
        redirectURI: new URL('/callback', window.location.origin).href,
      });

    } catch {
      setIsLoggingIn(false);
    }
  }, [email]);

  /**
   * Saves the value of our email input into component state.
   */
  const handleInputOnChange = useCallback((event) => {
    setEmail(event.target.value);
  }, []);


const handleSubmit = async(event) =>{
    event.preventDefault();
    const dataa = {
        city:city,
        birthday:birthday,
        picture:picture,
        recto:recto,
        verso:verso

    }

    console.log("city =>",dataa.city)

    // getter
    const token = localStorage.getItem('tokenEnCours');
    console.log("token Login Update =>", token)
   

    // fetch("http://localhost:3080/api/user", {
    // fetch("https://api.stablecoin.wealthtechinnovations.com/api/user", {
    // fetch("http://localhost:3080/api/session/two-edition", {
    //     method:"PUT",
    //     body: JSON.stringify(dataa),
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization':token

    //     }
    // })

    // const res = await fetch("http://localhost:3080/api/session/two-edition", {
        const res = await fetch("https://apiv3.liquidity.wealthtechinnovations.com/api/session/two-edition", {
          method:"PUT",
          body: JSON.stringify(dataa),
          headers: {
              'Content-Type': 'application/json',
              Authorization:  `Bearer ${token}`
          }
      })
      .then(res=>{
      const data =  res.json();
      console.log("data", data)
    
        console.log("Succès update=>",dataa)

        Swal.fire({
          position: 'center',
          icon: 'success',
          html: "<p> Votre demande de mise à jour s'est enregistrée avec succès </p>" ,
          showConfirmButton: false,
          timer: 5000
        })
    //  Actualiser après l'affichage 
     
    //   Router.push("/account/activated"); 
    // Fin
    })
    .catch(error => {
      //handle error
      console.log(error);

    });

    

    // Swal.fire({
    //   position: 'center',
    //   icon: 'success',
    //   html: "<p> Votre inscription s'est effectuée avec succès </p>" ,
    //   showConfirmButton: false,
    //   timer: 5000
    // })
    //  Actualiser après l'affichage 
     
      // Router.push("/auth/authentication"); 
    // Fin

    
}


  return (
    <>
      <div className=''>
        <div className='register-form'>
          <h2 className='text-center'>Mettre à jour le profil</h2>
          <form onSubmit={handleSubmit}>
           <div className='col-lg-12 col-md-12 row justify-content-between'>
          <div className='form-group col-lg-6 col-md-6'>
              <input
                type='text'
                className='form-control'
                placeholder='Ville'
                defaultValue={city} 
                onChange={(event)=>setCity(event.target.value)}
              />
            </div>

            <div className='form-group col-lg-6 col-md-6'>
            <input
              type='date'
              name='birthday'
              required='required'
              placeholder="Date d'anniversaire"
              className="form-control"
              defaultValue={birthday} 
              onChange={(event)=>setBirthday(event.target.value)}
            />
            </div>

            

            <div className='form-group col-lg-4 col-md-6 text-center'>
                Photo profil
            <div className='currency-selection text-center'>
                    <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white ">
                        <div className='banner-image text-center'>
                            <img src='/images/ecfa/profil/avatar2.png' width={'200'}  alt='image' />
                            
                        </div>
                    </div>
                </div>
                <div className='mx-3'>
                <input
                    type='file'
                    name='birthday'
                    required='required'
                    placeholder="Photo profil"
                    className="form-control"
                    defaultValue={picture} 
                    onChange={(event)=>setPicture(event.target.value)}
                />
                </div>
            </div>

            <div className='form-group col-lg-4 col-md-6 text-center'>
                Recto de la pièce d'identité
            <div className='currency-selection text-center'>
                    <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white ">
                        <div className='banner-image text-center'>
                            <img src='/images/ecfa/profil/avatar2.png' width={'200'}  alt='image' />
                            
                        </div>
                    </div>
                </div>
                <div className='mx-3'>
                <input
                    type='file'
                    name='birthday'
                    required='required'
                    placeholder="Recto"
                    className="form-control"
                    defaultValue={recto} 
                    onChange={(event)=>setRecto(event.target.value)}
                />
                </div>
            </div>

            <div className='form-group col-lg-4 col-md-6 text-center'>
                Verso de la pièce d'identité
            <div className='currency-selection text-center'>
                    <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white ">
                        <div className='banner-image text-center'>
                            <img src='/images/ecfa/profil/avatar2.png' width={'200'}  alt='image' />
                            
                        </div>
                    </div>
                </div>
                <div className='mx-3'>
                <input
                    type='file'
                    name='birthday'
                    required='required'
                    placeholder="Verso"
                    className="form-control"
                    defaultValue={verso} 
                    onChange={(event)=>setVerso(event.target.value)}
                />
                </div>
            </div>

              <button type='submit'  className="btn btn-primary mx-3" disabled={isLoggingIn}>Mettre à jour</button>

                </div>
          </form>
        </div>

        
       </div>
    </>
  );
};


export default TwoEdition;
