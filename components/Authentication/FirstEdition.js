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
  const [mobile, setMobile] = useState(''); //institution et entreprise aussi
  const [city, setCity] = useState(""); //institution et entreprise aussi
  const [birthday, setBirthday] = useState("");
  const [sex, setSex] = useState("");
  
  // Form d'entreprise
  const [entreprise, setEntreprise] = useState(''); //institution aussi
  const [site, setSite] = useState(''); //institution aussi
  const [userType, setUserType] = useState(''); //institution aussi
  const [sector, setSector] = useState(''); 
  const [legal, setLegal] = useState('');
  const [numberRegister, setNumberRegister] = useState('');
  const [employee, setEmployee] = useState('');

  // Form d'institution
  const [abbreviation, setAbbreviation] = useState('');




  const [currentAddress, setCurrentAdress] = useState('');
  const [codeCountry, setCodeCountry] = useState('');
  const [allCountry, setAllCountry] = useState('');


  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [provider, setProvider] = useState(null);
  const [messageError, setMessageError] = useState();
  

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

  // RECUPERATION DES INFORMATIONS QUI CONCERNENT MAGIC
  useEffect(() => {
    (async () => {
          if (!!magic && !!provider) {
              const userMetadatas = await magic.user.getMetadata();
              const signer = provider.getSigner();
              const network = await provider.getNetwork();
              const userAddress = await signer.getAddress();
              setUserMetadata(userMetadatas)
              setCurrentAdresse(userAddress);
              //const userBalance = ethers.utils.formatEther(await provider.getBalance(userAddress))
              // FIN

              // Obtenir un utilisateur en fonction de son email 
              const getUser = async () => {
                const result = await fetch(`${API_URL}/api/user/find-user-by-email?email=${userMetadatas?.email}`, {
                    headers: {
                    'Content-Type': 'application/json',
                    },
                })
                  .then((result) => result.json())
                  .then((user) => {
                  setCurrentUser(user)
                  }) 
              };
              await getUser();
              // Fin
      }

      })();
  }, [provider, magic]);

  // FONCTION DE LA DECONNEXION
  const logaout = useCallback(() => {
    try {
    magic.user.logout().then(() => {
      // Actualisation et redirection
      setTimeout(() => {
        window.location.reload()
      }, 20000)
      Router.push("/auth/authentication");

    });
  } catch (error) {
    console.log("une erreur s'est produit =>", error)
  }
  }, [Router]);
  // FIN

  // Fonction de mise à jour des informations du profil particulier
  const EditProfilParticulier= useCallback(async () => {
    console.log("currentUser?.id=>",currentUser?.id)
    setIsLoggingIn(true);
    /* Vérifier si l'utilisateur a choisi un pays et le sexe 
    *sinon il reçoit une alerte pour choisir
    */
    if (!codeCountry=="" && codeCountry && !sex=="" && sex) {
      try {
        const dataa = {
          firstName:firstName,
          lastName:lastName,
          mobile:mobile,
          address:currentAdresse,
          codeCountry:codeCountry,
          city:city,
          birthday:birthday,
          sex:sex,
          userId:currentUser?.id,
          email:userMetadata.email
        }
        const result = await fetch(`${API_URL}/api/session/first-edition`, {
          method:"PUT",
          body: JSON.stringify(dataa),
          headers: {
              'Content-Type': 'application/json',
          }
        })
        const data = await result.json();
    
        /* Verifier s'il y a un messsage d'erreur on l'affiche dans SWAL 
        * sinon on affiche le message de succès
        */
        if (data.message) {
          setMessageError(data.message)
          setIsLoggingIn(false);
          Swal.fire({
            position: 'center',
            icon: 'error',
            html: `<p> ${messageError} </p>` ,
            showConfirmButton: false,
            timer: 10000
          })
        }else{
          Swal.fire({
            position: 'center',
            icon: 'success',
            html: `<p> Les informations ont été ajoutées avec succès. Merci de vous connecter pour accéder à l’espace de votre profil.</p>` ,
            showConfirmButton: false,
            timer: 20000
          }),
          // setTimeout(() => {
          //   Router.push("/profil/dashboard/"); 
          // }, 5000)

          //Appel de la fonction logaout Pour se deconnecter de magic
          logaout()
          // Fin
        }
        // Fin condition 
    
        } catch {
          setIsLoggingIn(false);
        }
    }else{
      setIsLoggingIn(false);
      Swal.fire({
        position: 'center',
        icon: 'error',
        html: `<p> Veuillez choisir un pays et sexe </p>` ,
        showConfirmButton: false,
        timer: 10000
      })
    }
  }, [firstName,lastName,mobile,codeCountry,currentAdresse,city,birthday,sex]);
  // Fin

  // Fonction de mise à jour des informations du profil Institution et société financière
  const EditProfilInstitution  = useCallback(async () => {
    setIsLoggingIn(true);
    /* Vérifier si l'utilisateur a choisi un pays, forme juridique, secteur, employés, type  
    *sinon il reçoit une alerte pour choisir
    */
    if (!codeCountry=="" && codeCountry
      && !userType=="" && userType) {
      try {
        const dataa = {
          entreprise:entreprise,
          mobile:mobile,
          address:currentAdresse,
          codeCountry:codeCountry,
          city:city,
          userType:userType,
          site:site,
          abbreviation:abbreviation,
          userId:currentUser?.id,
          email:userMetadata.email
        }
                   
        const result = await fetch(`${API_URL}/api/session/first-edition-institution`, {
          method:"PUT",
          body: JSON.stringify(dataa),
          headers: {
              'Content-Type': 'application/json',
          }
        })
        const data = await result.json();
    
        /* Verifier s'il y a un messsage d'erreur on l'affiche dans SWAL 
        * sinon on affiche le message de succès
        */
        if (data.message) {
          setMessageError(data.message)
          setIsLoggingIn(false);
          Swal.fire({
            position: 'center',
            icon: 'error',
            html: `<p> ${messageError} </p>` ,
            showConfirmButton: false,
            timer: 10000
          })
        }else{
          Swal.fire({
            position: 'center',
            icon: 'success',
            html: `<p> Les informations ont été ajoutées avec succès. Merci de vous connecter pour accéder à l’espace de votre profil.</p>` ,
            showConfirmButton: false,
            timer: 20000
          }),
          // setTimeout(() => {
          //   Router.push("/profil/dashboard/"); 
          // }, 5000)

          //Appel de la fonction logaout Pour se deconnecter de magic
          logaout()
          // Fin
        }
        // Fin condition 
    
        } catch {
          setIsLoggingIn(false);
        }
    }else{
      setIsLoggingIn(false);
      Swal.fire({
        position: 'center',
        icon: 'error',
        html: `<p> Veuillez vérifier si vous avez choisi un pays, forme juridique, secteur, nombre d'employés, type d'entrprise</p>` ,
        showConfirmButton: false,
        timer: 20000
      })
    }
  }, [entreprise,mobile,codeCountry,currentAdresse,city,userType,sector,legal,site,employee,numberRegister,userMetadata]);
  // Fin

  // Fonction de mise à jour des informations du profil Entreprise / Commerçant
  const EditProfilEntreprise  = useCallback(async () => {
    setIsLoggingIn(true);
    /* Vérifier si l'utilisateur a choisi un pays, forme juridique, secteur, employés, type  
    *sinon il reçoit une alerte pour choisir
    */
    if (!codeCountry=="" && codeCountry
      && !legal=="" && legal
      && !sector=="" && sector
      && !employee=="" && employee
      && !userType=="" && userType) {

      // if (legal=="other") {
      //   setOtherLegal(true)
      // }else{
      //   setOtherLegal(false)
      // }
      try {
        const dataa = {
          entreprise:entreprise,
          mobile:mobile,
          address:currentAdresse,
          codeCountry:codeCountry,
          city:city,
          userType:userType,
          sector:sector,
          legal:legal,
          site:site,
          employee:employee,
          numberRegister:numberRegister,
          userId:currentUser?.id,
          email:userMetadata.email
        }
                   
        const result = await fetch(`${API_URL}/api/session/first-edition-entreprise`, {
          method:"PUT",
          body: JSON.stringify(dataa),
          headers: {
              'Content-Type': 'application/json',
          }
        })
        const data = await result.json();
    
        /* Verifier s'il y a un messsage d'erreur on l'affiche dans SWAL 
        * sinon on affiche le message de succès
        */
        if (data.message) {
          setMessageError(data.message)
          setIsLoggingIn(false);
          Swal.fire({
            position: 'center',
            icon: 'error',
            html: `<p> ${messageError} </p>` ,
            showConfirmButton: false,
            timer: 10000
          })
        }else{
          Swal.fire({
            position: 'center',
            icon: 'success',
            html: `<p> Les informations ont été ajoutées avec succès. Merci de vous connecter pour accéder à l’espace de votre profil.</p>` ,
            showConfirmButton: false,
            timer: 20000
          }),
          // setTimeout(() => {
          //   Router.push("/profil/dashboard/"); 
          // }, 5000)
          
          //Appel de la fonction logaout Pour se deconnecter de magic
          logaout()
          // Fin
        }
        // Fin condition 
    
        } catch {
          setIsLoggingIn(false);
        }
    }else{
      setIsLoggingIn(false);
      Swal.fire({
        position: 'center',
        icon: 'error',
        html: `<p> Veuillez vérifier si vous avez choisi un pays, forme juridique, secteur, nombre d'employés, type d'entrprise</p>` ,
        showConfirmButton: false,
        timer: 20000
      })
    }
  }, [entreprise,mobile,codeCountry,currentAdresse,city,userType,sector,legal,site,employee,numberRegister,userMetadata]);
  // Fin
  

  // RECUPERER TOUS LES PAYS
  useEffect(async() => {
    const getAllCountries = async () => {
    const resCountry = await fetch(`${API_URL}/api/country/find-all`, {
        headers: {
        'Content-Type': 'application/json',
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
      <div className='col-lg-6 col-md-12 '>
        <div className='card'>
           
          {/* SI LE TYPE DE PROFIL EST PARTICULIER */}
          {currentUser?.codeTypeProfil=="part" ? (
            <>
              <h4 className='text-center'>Activation de compte (Paticulier)</h4>

              <form className='login-form'>
                <div className='form-group'>
                  <input
                    type='text'
                    className='form-control'
                    placeholder='Nom'
                    defaultValue={firstName} 
                    onChange={(event)=>setFirstName(event.target.value)}
                  />
                </div>
                <div className='form-group mt-3'>
                  <input
                    type='text'
                    className='form-control'
                    placeholder='Prénom'
                    defaultValue={lastName} 
                    onChange={(event)=>setLastName(event.target.value)}
                  />
                </div>
                <div className='form-group mt-3'>
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
                    className="form-control mt-3 "
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
                <div className='form-group mt-3'>
                  <input
                    type='date'
                    className='form-control'
                    placeholder='Date de naissance'
                    defaultValue={birthday} 
                    onChange={(event)=>setBirthday(event.target.value)}
                  />
                </div>
                <div className="form-group mb-6 mt-3">
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
                </div >
                <div className="mt-3 row">
                  <button className="btn btn-primary mx-3 btn-lg " onClick={EditProfilParticulier} disabled={isLoggingIn}>Envoyer</button>
                </div>
              </form>
            </>
          ) : ("")}
          {/* FIN */}

          {/* SI LE TYPE DE PROFIL EST INSTITUTION */}
          {currentUser?.codeTypeProfil=="insti" ? (
            <>
              <h4 className='text-center'>
                Activation de compte(Institution et société financière)
              </h4>
              <form className='login-form'>
                <div className='form-group'>
                  <input
                    type='text'
                    className='form-control'
                    placeholder="Nom de l'institution"
                    defaultValue={entreprise} 
                    onChange={(event)=>setEntreprise(event.target.value)}
                  />
                </div>  
                <div className='form-group mt-3'>
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
                <div className="input-group flex-nowrap mt-3">
                  {allCountry?(
                    allCountry.map((data) => (
                      data.code == codeCountry ?(
                        <span key={data.id} className="input-group-text" id="addon-wrapping">{data.indicator}</span>
                      ):('')
                    ))
                  ):("")}
                  <input
                    className="form-control"
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
                    type='ville'
                    className='form-control'
                    placeholder='Ville'
                    defaultValue={city} 
                    onChange={(event)=>setCity(event.target.value)}
                  />
                </div>

                <div className='form-group mt-3'>
                  <input
                    type='text'
                    className='form-control'
                    placeholder='Site internet'
                    defaultValue={site} 
                    onChange={(event)=>setSite(event.target.value)}
                  />
                </div>
                <div className='form-group mt-3'>
                  <input
                    type='text'
                    className='form-control'
                    placeholder='Abréviation'
                    defaultValue={abbreviation} 
                    onChange={(event)=>setAbbreviation(event.target.value)}
                  />
                </div>
                <div className="form-group mt-3">
                <select 
                  className="form-control"
                  id="type"
                  required
                  defaultValue={userType} 
                  onChange={(event)=>setUserType(event.target.value)}
                >
                  <option defaultValue="">Type d'institution</option>
                    <optgroup className='single-cryptocurrency-box'>
                      <option  value="Autorité de contrôle et de régulation">Autorité de contrôle et de régulation</option>
                      <option  value="Auxiliaire et Intermédiaire financiers">Auxiliaire et Intermédiaire financiers</option>
                      <option  value="Banque centrale">Banque centrale</option>
                      <option  value="Banque commerciale">Banque commerciale</option>
                      <option  value="Entreprise d’Investissement">Entreprise d’Investissement </option>
                      <option  value="Fintechs">Fintechs</option>
                      <option  value="Institution financière spécialisée">Institution financière spécialisée</option>
                      <option  value="MicroFinance">MicroFinance</option>
                      <option  value="Société financière">Société financière</option>
                      <option  value="Société d’Assurance">Société d’Assurance</option>
                    </optgroup>
                </select>
              </div>
                <div className="mt-3 row">
                  <button className="btn btn-primary mx-3" onClick={EditProfilInstitution} disabled={isLoggingIn}>Envoyer</button>
                </div>
              </form>
            </>
          ) : ("")}
          {/* FIN */}

          {/* SI LE TYPE DE PROFIL EST ENTREPRISE OU COMMERCANT */}
          
          
          {/* FIN */}
        </div>
      </div>


      <div className='col-lg-3 col-md-12'></div>
        {/* SI LE TYPE DE PROFIL EST ENTREPRISE OU COMMERCANT */}
      {currentUser?.codeTypeProfil=="entCom" ? (
        <>
          <div className='col-lg-1 col-md-12'></div>

            <div className='col-lg-10 col-md-12 '>
            <div className='login-form'>
              <h2 className='text-center'>Activation de compte (Entreprise / Commerçant)</h2>
            <form className='row'>
             <div className='form-group col-lg-6 col-md-6'>
                <input
                  type='text'
                  className='form-control'
                  placeholder="Nom de l'entreprise"
                  defaultValue={entreprise} 
                  onChange={(event)=>setEntreprise(event.target.value)}
                />
              </div>  
              <div className='form-group col-lg-6 col-md-6'>
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
              <div className="form-group flex-nowrap col-lg-6 col-md-6 row ml-3 text-center">
              
              {/* <div className=" flex-nowrap "> */}
                {allCountry?(
                  allCountry.map((data) => (
                    data.code == codeCountry ?(
                      <span key={data.id} className="input-group-text col-lg-2 mx-2 mt-3" id="addon-wrapping">{data.indicator}</span>
                    ):('')
                  ))
                ):("")}
                <div className="col-lg-10 mt-3">
                <input
                  className="form-control"
                  type="text"
                  id="contact"
                  placeholder="Numero téléphone"
                  required
                  defaultValue={mobile} 
                  onChange={(event)=>setMobile(event.target.value)}
                />
                </div>
              </div>
              <div className='form-group mt-3 col-lg-5 col-md-6 mx-3 text-center'>
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
                  type='text'
                  className='form-control'
                  placeholder='Site internet'
                  defaultValue={site} 
                  onChange={(event)=>setSite(event.target.value)}
                />
              </div>
              
              <div className='form-group col-lg-6 col-md-6'>
                <input
                  type='text'
                  className='form-control'
                  placeholder="Numéro du régistre de commerce"
                  defaultValue={numberRegister} 
                  onChange={(event)=>setNumberRegister(event.target.value)}
                />
              </div>

              <div className="form-group mb-6 col-lg-6 col-md-6">
              <select 
                className="form-control"
                id="legal"
                required
                defaultValue={legal} 
                onChange={(event)=>setLegal(event.target.value)}
              >
                <option defaultValue="">Statut ou forme juridique</option>
                  <optgroup className='single-cryptocurrency-box'>
                   
                    <option  value="Personne Physique">Auto-entreprise</option>
                    <option  value="Administration publique">Administration publique</option>
                    <option  value="Activité informelle (pas d’immatriculation au RCCM, ou en cours)">Activité informelle (pas d’immatriculation au RCCM, ou en cours)</option>
                    <option  value="Entreprise ou établissement public">Entreprise ou établissement public</option>
                    <option  value="Entreprise individuelle, EIRL, EURL">Entreprise individuelle, EIRL, EURL</option>
                    <option  value="SA">SA</option>
                    <option  value="SAS">SAS</option>
                    <option  value="SARL">SARL</option>
                    <option  value="SCOP">SCOP</option>
                    <option  value="">Autre statut, précisez</option>
                  </optgroup>
              </select>
            </div>

            <div className="form-group mb-6 col-lg-6 col-md-6">
              <select 
                className="form-control"
                id="sector"
                required
                defaultValue={sector} 
                onChange={(event)=>setSector(event.target.value)}
              >
                <option defaultValue="">Secteur d'activité</option>
                  <optgroup className='single-cryptocurrency-box'>
                    <option  value="Administration">Administration</option>

                    <option  value="Agroalimentaire / Agriculture">Agroalimentaire / Agriculture</option>
                    <option  value="Banque / Assurance / Finance">Banque / Assurance / Finance</option>
                    <option  value="Bois / Papier / Carton / Imprimerie ">Bois / Papier / Carton / Imprimerie </option>
                    <option  value="Chimie / Parachimie ">Chimie / Parachimie </option>
                    <option  value="Commerce ambulant (sur marché)">Commerce ambulant (sur marché)</option>
                    <option  value="Commerce et réparation sédentaire (local fixe)">Commerce et réparation sédentaire (local fixe)</option>
                    <option  value="Commerce / Négoce / Distribution / import /export">Commerce / Négoce / Distribution / import /export</option>
                    <option  value="Études et conseils">Études et conseils</option>
                    <option  value="Édition / Communication">Édition / Communication</option>
                    <option  value="Education et formations">Education et formations</option>
                    <option  value="Informatique / télécoms">Informatique / télécoms </option>
                    <option  value="Industrie pharmaceutique">Industrie pharmaceutique </option>
                    <option  value="Immobilier / BTP / Matériaux de construction ">Immobilier / BTP / Matériaux de construction </option>
                    <option  value="Mine et Energie">Mine et Energie</option>
                    <option  value="Métallurgie / Travail du métal">Métallurgie / Travail du métal </option>
                    <option  value="Machines et équipements / Automobile">Machines et équipements / Automobile </option>
                    <option  value="Multimédia Électronique / Électricité">Multimédia Électronique / Électricité</option>
                    <option  value="Plastique / Caoutchouc">Plastique / Caoutchouc</option>
                    <option  value="Services aux entreprises">Services aux entreprises </option>
                    <option  value="Santé et action sociale">Santé et action sociale</option>
                    <option  value="Transport / Logistique">Transport / Logistique</option>
                    <option  value="Textile / Habillement / Chaussure Transports / Logistique">Textile / Habillement / Chaussure Transports / Logistique</option>
                    <option  value="other">Autres</option>
                  </optgroup>
              </select>
            </div>
              <div className="form-group mb-6 col-lg-6 col-md-6">
              <select 
                className="form-control"
                id="employee"
                required
                defaultValue={employee} 
                onChange={(event)=>setEmployee(event.target.value)}
              >
                <option defaultValue="">Nombre d'employés</option>
                  <optgroup className='single-cryptocurrency-box'>
                    <option  value="Moins de 10">Moins de 10</option>
                    <option  value="Entre 10 et 50">Entre 10 et 50</option>
                    <option  value="Entre 50 et 200">Entre 50 et 200</option>
                    <option  value="Plus de 200 ">Plus de 200 </option>
                  </optgroup>
              </select>
            </div>

            <div className="form-group mb-6 col-lg-6 col-md-6">
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
            
                <button className="btn btn-primary mx-3" onClick={EditProfilEntreprise} disabled={isLoggingIn}>Envoyer</button>
            </form>
            </div>
            </div>
            </>
          ) : ("")}
          {/* FIN */}


      <div className='col-lg-1 col-md-12'></div>

      {/* <div className='my-30'></div> */}


    </>
  );
};

FirstEdition.getInitialProps = async (ctx) => {};

export default FirstEdition;
