import React from 'react';
import Link from 'next/link';

import { useCallback, useState, useEffect } from 'react';
import Router from 'next/router';

import Swal from 'sweetalert2';

// Magic
import { magic } from "../../magic";
import { ethers } from "ethers";




const FirstEdition = () => {
  // Variable de l'url de l'api
  const API_URL =process.env.NEXT_PUBLIC_URL_API

  // Form particulier
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobile, setMobile] = useState('');
  const [city, setCity] = useState("");
  const [birthday, setBirthday] = useState("");
  const [sex, setSex] = useState("");
  
  // Form d'entreprise
  const [entreprise, setEntreprise] = useState('');
  const [site, setSite] = useState('');
  const [userType, setUserType] = useState('');
  const [socialRaison, setSocialRaison] = useState('');

  // Form d'institution



  const [currentAddress, setCurrentAdress] = useState('');
  const [codeCountry, setCodeCountry] = useState('');
  const [allCountry, setAllCountry] = useState('');


  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [provider, setProvider] = useState(null);

  // USER
  const [userMetadata, setUserMetadata] = useState();
  const [currentUser, setCurrentUser] = useState();
  const [currentAdresse, setCurrentAdresse] = useState("");


  

  useEffect(() => {

    if (!!magic) {
        const pt = new ethers.providers.Web3Provider(magic.rpcProvider);
        setProvider(pt);
    }
}, [magic]);


useEffect(() => {
   (async () => {
        if (!!magic && !!provider) {
            // RECUPERATION DES INFORMATIONS QUI CONCERNENT MAGIC
            const userMetadata = await magic.user.getMetadata();
            const signer = provider.getSigner();
            const network = await provider.getNetwork();
            const userAddress = await signer.getAddress();
            setUserMetadata(userMetadata)
            setCurrentAdresse(userAddress);
            //const userBalance = ethers.utils.formatEther(await provider.getBalance(userAddress))
            console.log("email=>",await userMetadata.email)
            // FIN


            const getAllCountries = async () => {
              const result = await fetch(`${API_URL}/api/user/find-user-by-email?email=${userMetadata?.email}`, {
                  headers: {
                  'Content-Type': 'application/json',
                  },
              })
                  .then((result) => result.json())
                  .then((user) => {
                  setCurrentUser(user)
                  }) 
      
              };
              
              await getAllCountries();
    }

    })();
}, [provider, magic]);

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

      
    const resp = await fetch(`${API_URL}/api/session/login`, {
      method:"POST",
      body: JSON.stringify(dataLogin),
      headers: {
          'Content-Type': 'application/json',
      }
    })
    const datalog = await resp.json();
    // setter
    localStorage.setItem('tokenEnCours', datalog.token);
    const dataa = {
      firstName:firstName,
      lastName:lastName,
      mobile:mobile,
      codeCountry:codeCountry
    }

    var monobjet_json = JSON.stringify(dataa);
    // setter
    localStorage.setItem('dataFirstEdition', monobjet_json);

    //Pour magic Grab auth token from loginWithMagicLink
      const didToken = await magic.auth.loginWithMagicLink({
        email,
        redirectURI: new URL('/callback', window.location.origin).href,
      });
      
    } catch {
      setIsLoggingIn(false);
    }
  }, [firstName,lastName,mobile,codeCountry]);
  // Fin

  
  console.log("currentUser=>",currentUser)
  

  // RECUPERER TOUS LES PAYS
  useEffect(async() => {
    const token = localStorage.getItem('tokenEnCours')
    console.log("token pays=>",token)


        const getAllCountries = async () => {
        const resCountry = await fetch(`${API_URL}/api/country/find-all`, {
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
           
          {/* SI LE TYPE DE PROFIL EST PARTICULIER */}
          {currentUser?.codeTypeProfil=="part" ? (
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
              </div>
              <div className="input-group flex-nowrap">
                {allCountry?(
                  allCountry.map((data) => (
                    data.code == codeCountry ?(
                      <span key={data.id} className="input-group-text gr-text-11  mt-3" id="addon-wrapping">{data.indicator}</span>
                    ):('')
                  ))
                ):("")}
                <input
                  className="form-control gr-text-11 border mt-3 bg-white"
                  type="text"
                  id="contact"
                  placeholder="Numero téléphone"
                  required
                  defaultValue={mobile} 
                  onChange={(event)=>setMobile(event.target.value)}
                />
              </div>
              <div className='form-group mt-3'>
                <input
                  type='text'
                  className='form-control'
                  placeholder='Ville'
                  defaultValue={city} 
                  onChange={(event)=>setCity(event.target.value)}
                />
              </div>
              <div className='form-group'>
                <input
                  type='text'
                  className='form-control'
                  placeholder='Nationalité'
                  defaultValue={birthday} 
                  onChange={(event)=>setBirthday(event.target.value)}
                />
              </div>
              <div className="form-group mb-6">
              <select 
                className="form-control"
                id="sexe"
                required
                defaultValue={sex} 
                onChange={(event)=>setSex(event.target.value)}
              >
                <option defaultValue="">Choisissez le sexe</option>
                  <optgroup className='single-cryptocurrency-box'>
                    <option  value="Masculin">Masculin</option>
                    <option  value="Feminin">Feminin</option>
                  </optgroup>
              </select>
            </div>
                <button className="btn btn-primary mx-3" onClick={login} disabled={isLoggingIn}>Envoyer</button>
            </form>
          ) : ("")}
          {/* FIN */}

          {/* SI LE TYPE DE PROFIL EST INSTITUTION */}
          {currentUser?.codeTypeProfil=="insti" ? (
            <form >
              <div className='form-group'>
                <input
                  type='text'
                  className='form-control'
                  placeholder="Nom de l'institution"
                  defaultValue={entreprise} 
                  onChange={(event)=>setEntreprise(event.target.value)}
                />
              </div>  
              <div className='form-group'>
                <select 
                placeholder='Pays'
                className='form-control'
                defaultValue={codeCountry} 
                onChange={(event)=>setCodeCountry(event.target.value)}
                >
                  <option>Pays de domiciliation du siège</option>
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
              </div>
              <div className="input-group flex-nowrap">
                {allCountry?(
                  allCountry.map((data) => (
                    data.code == codeCountry ?(
                      <span key={data.id} className="input-group-text gr-text-11  mt-3" id="addon-wrapping">{data.indicator}</span>
                    ):('')
                  ))
                ):("")}
                <input
                  className="form-control gr-text-11 border mt-3 bg-white"
                  type="text"
                  id="contact"
                  placeholder="Numero téléphone"
                  required
                  defaultValue={mobile} 
                  onChange={(event)=>setMobile(event.target.value)}
                />
              </div>
              <div className='form-group mt-3'>
                <input
                  type='text'
                  className='form-control'
                  placeholder='Ville'
                  defaultValue={city} 
                  onChange={(event)=>setCity(event.target.value)}
                />
              </div>
              <div className='form-group'>
                <input
                  type='text'
                  className='form-control'
                  placeholder='Site internet'
                  defaultValue={site} 
                  onChange={(event)=>setSite(event.target.value)}
                />
              </div>
              <div className='form-group'>
                <input
                  type='text'
                  className='form-control'
                  placeholder='abréviation'
                  defaultValue={abbreviation} 
                  onChange={(event)=>setDenomination(event.target.value)}
                />
              </div>
              <div className='form-group'>
                <input
                  type='text'
                  className='form-control'
                  placeholder='Dénomination'
                  defaultValue={denomination} 
                  onChange={(event)=>setDenomination(event.target.value)}
                />
              </div>
              
              <div className="form-group mb-6">
              <select 
                className="form-control"
                id="type"
                required
                defaultValue={userType} 
                onChange={(event)=>setUserType(event.target.value)}
              >
                <option defaultValue="">Type d'institution</option>
                  <optgroup className='single-cryptocurrency-box'>
                    <option  value="Institution publique Ivoirienne">Institution publique Ivoirienne</option>
                    <option  value="Institution régionale">Institution régionale</option>
                    <option  value="Institution sous-régionale">Institution sous-régionale</option>
                    <option  value="Institution Internationale">Institution Internationale</option>
                  </optgroup>
              </select>
            </div>
            
              
                <button className="btn btn-primary mx-3" onClick={login} disabled={isLoggingIn}>Envoyer</button>
            </form>
          ) : ("")}
          {/* FIN */}

          {/* SI LE TYPE DE PROFIL EST ENTREPRISE OU COMMERCANT */}
          {currentUser?.codeTypeProfil=="entCom" ? (
            <form >
             <div className='form-group'>
                <input
                  type='text'
                  className='form-control'
                  placeholder="Nom de l'institution"
                  defaultValue={entreprise} 
                  onChange={(event)=>setEntreprise(event.target.value)}
                />
              </div>  
              <div className='form-group'>
                <select 
                placeholder='Pays'
                className='form-control'
                defaultValue={codeCountry} 
                onChange={(event)=>setCodeCountry(event.target.value)}
                >
                  <option>Pays de domiciliation du siège</option>
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
              </div>
              <div className="input-group flex-nowrap">
                {allCountry?(
                  allCountry.map((data) => (
                    data.code == codeCountry ?(
                      <span key={data.id} className="input-group-text gr-text-11  mt-3" id="addon-wrapping">{data.indicator}</span>
                    ):('')
                  ))
                ):("")}
                <input
                  className="form-control gr-text-11 border mt-3 bg-white"
                  type="text"
                  id="contact"
                  placeholder="Numero téléphone"
                  required
                  defaultValue={mobile} 
                  onChange={(event)=>setMobile(event.target.value)}
                />
              </div>
              <div className='form-group mt-3'>
                <input
                  type='text'
                  className='form-control'
                  placeholder='Ville'
                  defaultValue={city} 
                  onChange={(event)=>setCity(event.target.value)}
                />
              </div>
              <div className='form-group'>
                <input
                  type='text'
                  className='form-control'
                  placeholder='Site internet'
                  defaultValue={site} 
                  onChange={(event)=>setSite(event.target.value)}
                />
              </div>
              <div className="form-group mb-6">
              <select 
                className="form-control"
                id="type"
                required
                defaultValue={userType} 
                onChange={(event)=>setUserType(event.target.value)}
              >
                <option defaultValue="">Type d'entreprise</option>
                  <optgroup className='single-cryptocurrency-box'>
                    <option  value="Personne Physique">Personne Physique</option>
                    <option  value="Personne Morale">Personne Morale</option>
                  </optgroup>
              </select>
            </div>
            <div className="form-group mb-6">
              <textarea
                className="form-control gr-text-11 border mt-3 bg-white"
                type="text"
                id="contenu"
                placeholder="Raison sociale"
                defaultValue={socialRaison} 
                onChange={(event)=>setSocialRaison(event.target.value)}
              />
            </div>
                <button className="btn btn-primary mx-3" onClick={login} disabled={isLoggingIn}>Envoyer</button>
            </form>
          ) : ("")}
          {/* FIN */}
        </div>
      </div>
      <div className='col-lg-3 col-md-12'></div>

    </>
  );
};

FirstEdition.getInitialProps = async (ctx) => {};

export default FirstEdition;
