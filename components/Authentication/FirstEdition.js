import React from 'react';
import Link from 'next/link';

import { useCallback, useState, useEffect } from 'react';
import Router from 'next/router';
import { magic } from '../../magic';

import Swal from 'sweetalert2';




const FirstEdition = () => {
  // const [email, setEmail] = useState('');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobile, setMobile] = useState('');
  const [currentAddress, setCurrentAdress] = useState('');
  const [codeCountry, setCodeCountry] = useState('');
  const [allCountry, setAllCountry] = useState('');


  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [provider, setProvider] = useState(null);


  /**
   * Perform login action via Magic's passwordless flow. Upon successuful
   * completion of the login flow, a user is redirected to the homepage.
   */
  const login = useCallback(async () => {
    setIsLoggingIn(true);

   

    try {
        // getter pass
      const pass = localStorage.getItem('passEnCours');
      console.log("pass En Cours =>", pass)

      const email = localStorage.getItem('emailEnCours');
      console.log("emailEnCours =>", email)

      const dataLogin = {
        email:email,
        password:pass
  
      }

      // const resp = await fetch("http://localhost:3080/api/session/login", {
      const resp = await fetch("https://apiv3.liquidity.wealthtechinnovations.com/api/session/login", {
        method:"POST",
        body: JSON.stringify(dataLogin),
        headers: {
            'Content-Type': 'application/json',
        }
    })
    const datalog = await resp.json();
    // setter
    localStorage.setItem('tokenEnCours', datalog.token);
    // console.log("Succès")

    // localStorage.setItem('idEnCours', data.auth);
    // console.log("Succès 1")

   
    console.log("Succès login=>",datalog)

     



            const dataa = {
              firstName:firstName,
              lastName:lastName,
              mobile:mobile,
              codeCountry:codeCountry
        
            }

            var monobjet_json = JSON.stringify(dataa);

            // setter
            localStorage.setItem('dataFirstEdition', monobjet_json);
          

          console.log("email",email)

           //Pour magic Grab auth token from loginWithMagicLink
      const didToken = await magic.auth.loginWithMagicLink({
        email,
        redirectURI: new URL('/callback', window.location.origin).href,
      });
      // }
      
    } catch {
      setIsLoggingIn(false);
    }
  }, [firstName,lastName,mobile,codeCountry]);
  // Fin

  // RECUPERER TOUS LES PAYS
  useEffect(async() => {
    const token = localStorage.getItem('tokenEnCours')
    console.log("token pays=>",token)
    
        const getAllCountries = async () => {
        // const resCountry = await fetch('http://localhost:3080/api/country/find-all', {
        const resCountry = await fetch('https://apiv3.liquidity.wealthtechinnovations.com/api/country/find-all', {
            
            headers: {
            'Content-Type': 'application/json',
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

  


  return (
    <>
      <div className='col-lg-3 col-md-12'></div>
      <div className='col-lg-6 col-md-12'>
        <div className='login-form'>
          <h2 className='text-center'>Activation de compte</h2>
          <form >
          
            <div className='form-group'>
              <input
                type='text'
                className='form-control'
                placeholder='Nom'
                defaultValue={firstName} 
                onChange={(event)=>setFirstName(event.target.value)}
              />
            </div>
            <div className='form-group'>
              <input
                type='text'
                className='form-control'
                placeholder='Prénom'
                defaultValue={lastName} 
                onChange={(event)=>setLastName(event.target.value)}
              />
            </div>
            <div className='form-group'>
              <select 
              placeholder='Pays'
              className='form-control'
              defaultValue={codeCountry} 
              onChange={(event)=>setCodeCountry(event.target.value)}
              >
                 <option>Choisissez votre pays</option>
                 {/* Parcourir les pays */}
                 {allCountry?(
                 allCountry.map((data) => (
                <optgroup className='single-cryptocurrency-box'
                        key={data.id}>
                  <option  value={data.code}>{data.libelle}</option>
                </optgroup>
                    ))):("")}
              </select>
              {/* Fin */}
                {/* <option>Choisissez votre pays</option>
                <optgroup label="Other countries">
                  <option value="ci">Côte d'Ivoire</option>
                  <option  value="fr">France</option>
                </optgroup>
              </select> */}
            </div>
            <div className='form-group'>
              <input
                type='text'
                className='form-control'
                placeholder=' Numero téléphone'
                defaultValue={mobile} 
                onChange={(event)=>setMobile(event.target.value)}

              />
            </div>
              <button className="btn btn-primary mx-3" onClick={login} disabled={isLoggingIn}>Envoyer</button>
          </form>
        </div>
      </div>
      <div className='col-lg-3 col-md-12'></div>

    </>
  );
};

FirstEdition.getInitialProps = async (ctx) => {};

export default FirstEdition;
