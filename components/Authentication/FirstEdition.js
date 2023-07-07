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

  // Pour les nouveau champ de paticulier
  const [addressPostal, setAddressPostal] = useState("");
  const [nativeCountry, setNativeCountry] = useState("");
  const [cityOfBirth, setCityOfBirth] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [moneyAccount, setMoneyAccount] = useState("");


  
// Form du profil de la société de gestion
const [presentation, setPresentation] = useState("");
const [regulator, setRegulator] = useState("");
const [service, setService] = useState("");
const [logo, setLogo] = useState("");

// State de service
const [serviceA, setServiceA] = useState([]);
const [serviceB, setServiceB] = useState([]);
const [serviceC, setServiceC] = useState([]);
const [serviceD, setServiceD] = useState([]);









  
  // Form d'entreprise
  const [entreprise, setEntreprise] = useState(''); //institution aussi
  const [site, setSite] = useState(''); //institution aussi
  const [userType, setUserType] = useState(''); //institution aussi
  const [sector, setSector] = useState(''); 
  const [legal, setLegal] = useState('');
  const [numberRegister, setNumberRegister] = useState('');
  const [employee, setEmployee] = useState('');

  // Les states des nouveaux
  const [occupationType, setOccupationType] = useState('');
  const [speciality, setSpeciality] = useState('');
  const [subSpecialty, setSubSpecialty] = useState('');
  const [approvalNumber, setApprovalNumber] = useState('');
  const [countryTwo, setCountryTwo] = useState('');
  const [phoneFixe, setPhoneFixe] = useState('');
  const [mailbox, setMailbox] = useState('');

  const [nationality, setNationality] = useState('');
  const [startDate, setStartDate] = useState('');
  const [taxpayerNumber, setTaxpayerNumber] = useState('');
  const [quality, setQuality] = useState('');



  // Form d'institution
  const [abbreviation, setAbbreviation] = useState('');




  const [codeCountry, setCodeCountry] = useState('');
  const [allCountry, setAllCountry] = useState('');
  const [allNationality, setAllNationality] = useState('');
  


  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [provider, setProvider] = useState(null);
  const [messageError, setMessageError] = useState();
  

  // USER
  const [userMetadata, setUserMetadata] = useState();
  const [currentUser, setCurrentUser] = useState();
  const [currentAddress, setCurrentAddress] = useState("");


  

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
              setCurrentAddress(userAddress);
              console.log("userAddress=>",userAddress)
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
          address:currentAddress,
          codeCountry:codeCountry,
          city:city,
          addressPostal:addressPostal,
          cityOfBirth:cityOfBirth,
          nationality:nationality,
          bankAccount:bankAccount,
          moneyAccount:moneyAccount,
          nativeCountry:nativeCountry,
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
            html: `<p class='colorRed'> ${messageError} </p>` ,
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
  }, [firstName,lastName,mobile,codeCountry,currentAddress,city,birthday,sex,addressPostal,cityOfBirth,nationality,bankAccount,moneyAccount,nativeCountry]);
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
          address:currentAddress,
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
  }, [entreprise,mobile,codeCountry,currentAddress,city,userType,sector,legal,site,employee,numberRegister,userMetadata]);
  // Fin


  // Fonction de mise à jour des informations du profil de la société de gestion OPCVM
  const EditProfilGestion  = async () => {
    
    setIsLoggingIn(true);
    /* Vérifier si l'utilisateur a choisi un pays, forme juridique, secteur, employés, type  
    *sinon il reçoit une alerte pour choisir
    */
    if (!codeCountry=="" && codeCountry) {

      try {

        const dataTable = {
          serviceA:Object.assign({},serviceA),
          serviceB:Object.assign({},serviceB),
          serviceC:Object.assign({},serviceC),
          serviceD:Object.assign({},serviceD)
      }
      
      const body = new FormData();
      body.append("serviceA", dataTable?.serviceA[0]);
      body.append("serviceB", dataTable?.serviceB[0]);
      body.append("serviceC", dataTable?.serviceC[0]);
      body.append("serviceD", dataTable?.serviceD[0]);
      body.append("entreprise", entreprise);
      body.append("mobile", mobile);
      body.append("address", currentAddress);
      body.append("codeCountry", codeCountry);
      body.append("approvalNumber", approvalNumber);
      body.append("city", city);
      body.append("regulator", regulator);
      body.append("startDate", startDate);
      body.append("site", site);
      body.append("logo", logo);
      body.append("userId", currentUser?.id);
      body.append("email", userMetadata.email);

        const result = await fetch(`${API_URL}/api/session/first-edition-gestion`, {
          method:"PUT",
          body,
          headers: {
              // 'Content-Type': 'application/json',
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
          // }, 500000)
          
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
        html: `<p> Veuillez vérifier si vous avez choisi un pays</p>` ,
        showConfirmButton: false,
        timer: 20000
      })
    }
  
  }
  // , [serviceA,serviceB,serviceC,serviceC,serviceD,entreprise,mobile,currentAddress,approvalNumber,regulator,startDate,site,currentUser,userMetadata]);
  // Fin


  // FONCTION POUR UPLOADER LE FICHIER DU LOGO
    // const [image, setImage] = useState(null);
    const [createObjectURL, setCreateObjectURL] = useState(null);

    const uploadToClientLogo = (event) => {
        if (event.target.files && event.target.files[0]) {
        const i = event.target.files[0];
        setLogo(i);
        setCreateObjectURL(URL.createObjectURL(i));
        }
    };

  // Fonction de mise à jour des informations du profil Entreprise / Commerçant
  const EditProfilEntreprise  = useCallback(async () => {
    // setIsLoggingIn(true);
    /* Vérifier si l'utilisateur a choisi un pays, forme juridique, secteur, employés, type  
    *sinon il reçoit une alerte pour choisir
    */
    if (!codeCountry=="" && codeCountry
      ) {

      // if (legal=="other") {
      //   setOtherLegal(true)
      // }else{
      //   setOtherLegal(false)
      // }
      try {
        const dataa = {
          firstName:firstName,
          lastName:lastName,       
          entreprise:entreprise,
          mobile:mobile,
          address:currentAddress,
          codeCountry:codeCountry,
          city:city,
          userType:userType,
          sector:sector,
          occupationType:occupationType,
          speciality:speciality,
          subSpecialty:subSpecialty,
          approvalNumber:approvalNumber,
          phoneFixe:phoneFixe,
          mailbox:mailbox,
          nationality:nationality,
          nativeCountry:nativeCountry,
          startDate:startDate,
          taxpayerNumber:taxpayerNumber,
          quality:quality,
          legal:legal,
          site:site,
          employee:employee,
          numberRegister:numberRegister,
          userId:currentUser?.id,
          email:userMetadata.email
        }
                 
        console.log("dataa=>",dataa)

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
        html: `<p> Veuillez vérifier si vous avez choisi un pays</p>` ,
        showConfirmButton: false,
        timer: 20000
      })
    }
  }, [firstName,lastName,entreprise,mobile,codeCountry,currentAddress,city,userType,sector,legal,site,employee,numberRegister,userMetadata,occupationType,speciality,subSpecialty,approvalNumber,phoneFixe,mailbox,nationality,nativeCountry,startDate,taxpayerNumber,quality]);
  // Fin
  
  

  // Les handles de service
  const handleOptionServiceA = (event) => {
    const value = event.target.value;
    const isChecked = event.target.checked;

    if (isChecked) {
        setServiceA([...serviceA, value]);
    } else {
        setServiceA("");
    }
  };

  const handleOptionServiceB = (event) => {
    const value = event.target.value;
    const isChecked = event.target.checked;

    if (isChecked) {
        setServiceB([...serviceB, value]);
    } else {
        setServiceB("");
    }
  };

  const handleOptionServiceC = (event) => {
    const value = event.target.value;
    const isChecked = event.target.checked;

    if (isChecked) {
        setServiceC([...serviceC, value]);
    } else {
        setServiceC("");
    }
  };

  const handleOptionServiceD = (event) => {
    const value = event.target.value;
    const isChecked = event.target.checked;

    if (isChecked) {
        setServiceD([...serviceD, value]);
    } else {
        setServiceD("");
    }
  };
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

  // RECUPERER TOUTES LES NATIONALITES
  useEffect(async() => {
    const getAllNationality = async () => {
    const resCountry = await fetch(`${API_URL}/api/country/find-all-nationnality`, {
        headers: {
        'Content-Type': 'application/json',
        },
    })
      .then((resNationality) => resNationality.json())
      .then((allNationality) => {
      setAllNationality(allNationality)
      }) 
    };
    await getAllNationality();
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
                <div className="form-group mb-6 mt-3">
                  <select 
                    className="form-control"
                    id="sexe"
                    required
                    defaultValue={sex} 
                    onChange={(event)=>setSex(event.target.value)}
                  >
                    <option defaultValue="">Sexe</option>
                      <optgroup className='single-cryptocurrency-box'>
                        <option  value="Masculin">Masculin</option>
                        <option  value="Feminin">Feminin</option>
                      </optgroup>
                  </select>
                  </div >
                <div className='form-group mt-3'>
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
                    placeholder='Prénoms'
                    defaultValue={lastName} 
                    onChange={(event)=>setLastName(event.target.value)}
                  />
                </div>
                <div className='form-group mt-3'>
                  <select 
                  placeholder='Pays de résidence'
                  className='form-control'
                  defaultValue={codeCountry} 
                  onChange={(event)=>setCodeCountry(event.target.value)}
                  >
                    <option>Votre pays de résidence</option>
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
                

                <div className=" form-group mt-3">
                  <div className=" input-group flex-nowrap ">
                    <span  className="input-group-text " id="addon-wrapping">
                    {allCountry?(
                      allCountry.map((data) => (
                        data.code == codeCountry ?(
                          <i key={data.id}>{data.indicator}</i>
                          
                        ):('')
                      ))
                    ):("")}
                    </span>
                    <input
                      className="form-control"
                      type="text"
                      id="contact"
                      placeholder="Numéro téléphone mobile"
                      required
                      defaultValue={mobile} 
                      onChange={(event)=>setMobile(event.target.value)}
                    />
                  </div>
              </div>






                <div className='form-group mt-3'>
                  <input
                    type='text'
                    className='form-control'
                    placeholder='Ville de résidence'
                    defaultValue={city} 
                    onChange={(event)=>setCity(event.target.value)}
                  />
                </div>
                {/* ***************NOUVEAUX CHAMPS **************** */}
                
                <div className='form-group mt-3'>
                  <select 
                  placeholder='Votre pays de naissance'
                  className='form-control'
                  defaultValue={nativeCountry} 
                  onChange={(event)=>setNativeCountry(event.target.value)}
                  >
                    <option>Votre pays naissance</option>
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
                
                <div className='form-group mt-3'>
                  <select 
                  className='form-control'
                  placeholder='Nationalité '
                  defaultValue={nationality} 
                  onChange={(event)=>setNationality(event.target.value)}
                  >
                    <option>Votre nationalité</option>
                    {/* Parcourir les nationalités */}
                    {allNationality?(
                    allNationality.map((data) => (
                    <optgroup className='single-cryptocurrency-box'
                            key={data.id}>
                      <option  value={data.libelle}>{data.libelle}</option>
                    </optgroup>
                        ))):("")}
                  </select>
                  {/* Fin */}
                </div>
                <div className='form-group mt-3'>
                  <input
                    type='text'
                    className='form-control'
                    placeholder='Ville de naissance '
                    defaultValue={cityOfBirth} 
                    onChange={(event)=>setCityOfBirth(event.target.value)}
                  />
                </div>
                <div className='form-group mt-3'>
                  <label>
                    Date de naissance
                  </label>
                  <input
                    type='date'
                    className='form-control'
                    placeholder='Date de naissance'
                    defaultValue={birthday} 
                    onChange={(event)=>setBirthday(event.target.value)}
                  />
                </div>
                
                <div className='form-group mt-3'>
                  <input
                    type='text'
                    className='form-control'
                    placeholder='Adresse'
                    defaultValue={addressPostal} 
                    onChange={(event)=>setAddressPostal(event.target.value)}
                  />
                </div>

                <div className="form-group mb-6 mt-3">
                <select 
                  className="form-control"
                  id="sexe"
                  required
                  defaultValue={bankAccount} 
                  onChange={(event)=>setBankAccount(event.target.value)}
                >
                  <option defaultValue="">Avez-vous un compte bancaire ?</option>
                    <optgroup className='single-cryptocurrency-box'>
                      <option  value="Oui">Oui</option>
                      <option  value="Non">Non</option>
                    </optgroup>
                </select>
                </div >

                <div className="form-group mb-6 mt-3">
                <select 
                  className="form-control"
                  id="sexe"
                  required
                  defaultValue={moneyAccount} 
                  onChange={(event)=>setMoneyAccount(event.target.value)}
                >
                  <option defaultValue="">Avez-vous un compte mobile money ?</option>
                    <optgroup className='single-cryptocurrency-box'>
                      <option  value="Oui">Oui</option>
                      <option  value="Non">Non</option>
                    </optgroup>
                </select>
                </div >
                
            
                {/* ****************FIN****************************** */}
               
                
                
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
                
                <div className=" form-group mt-3">
                  <div className=" input-group flex-nowrap ">
                    <span  className="input-group-text " id="addon-wrapping">
                    {allCountry?(
                      allCountry.map((data) => (
                        data.code == codeCountry ?(
                          <i key={data.id}>{data.indicator}</i>
                          
                        ):('')
                      ))
                    ):("")}
                    </span>
                    <input
                      className="form-control"
                      type="text"
                      id="contact"
                      placeholder="Numéro téléphone mobile"
                      required
                      defaultValue={mobile} 
                      onChange={(event)=>setMobile(event.target.value)}
                    />
                  </div>
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
      {/* SI LE TYPE DE PROFIL EST GESTIONNAIRE OU SOCIETE DE GESTION */}
      {currentUser?.codeTypeProfil=="socGest" ? (
        <>
          <div className='col-lg-1 col-md-12'></div>

            <div className='col-lg-10 col-md-12 '>
            <div className='login-form'>
              <h2 className='text-center'>Activation de compte (Sociéte de gestion)</h2>
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

              <div className=" form-group col-lg-6 col-md-6 ">
                  <div className=" input-group flex-nowrap ">
                    <span  className="input-group-text " id="addon-wrapping">
                    {allCountry?(
                      allCountry.map((data) => (
                        data.code == codeCountry ?(
                          <i key={data.id}>{data.indicator}</i>
                          
                        ):('')
                      ))
                    ):("")}
                    </span>
                    <input
                      className="form-control"
                      type="text"
                      id="contact"
                      placeholder="Numéro téléphone mobile"
                      required
                      defaultValue={mobile} 
                      onChange={(event)=>setMobile(event.target.value)}
                    />
                  </div>
              </div>

              <div className='form-group  col-lg-6 col-md-6 text-center'>
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
                  placeholder="Site internet"
                  defaultValue={site} 
                  onChange={(event)=>setSite(event.target.value)}
                />
              </div>
              
              <div className='form-group col-lg-6 col-md-6'>
                <input
                  type='text'
                  className='form-control'
                  placeholder="Numéro d’agrément"
                  defaultValue={approvalNumber} 
                  onChange={(event)=>setApprovalNumber(event.target.value)}
                />
              </div>

            <div className='form-group col-lg-6 col-md-6'>
              <input
                type='text'
                className='form-control'
                placeholder="Adresse"
                defaultValue={addressPostal} 
                onChange={(event)=>setAddressPostal(event.target.value)}
              />
            </div>

            <div className="form-group mb-6 col-lg-6 col-md-6">
              <select 
                className="form-control"
                id="regulator"
                required
                defaultValue={regulator} 
                onChange={(event)=>setRegulator(event.target.value)}
              >
                <option defaultValue="">Régulateur</option>
                  <optgroup className='single-cryptocurrency-box'>
                    <option  value="GHANA - Security Exchange Commission (SEC)">GHANA - Security Exchange Commission (SEC)</option>
                    <option  value="UMOA -AMF">UMOA -AMF</option>
                    <option  value="NIGERIA - Central Bank of Nigeria">NIGERIA - Central Bank of Nigeria</option>
                    <option  value="KENYA - Capital Markets Authority (CMA)">KENYA - Capital Markets Authority (CMA)</option>
                    <option  value="MAROC -AMMC">MAROC -AMMC</option>
                    <option  value="SOUTH AFRICA">SOUTH AFRICA</option>
                    <option  value="EUROPE">EUROPE</option>
                    <option  value="CEMAC - COSUMAF">CEMAC - COSUMAF</option>
                    <option  value="CEMAC - COSUMAF">CEMAC - COSUMAF</option>
                  </optgroup>
              </select>
            </div>
            <div className='form-group col-lg-6 col-md-6'>
              <label
                  htmlFor="picture"
              >
                Date d'immatriculation
              </label>
              <input
                type='date'
                className='form-control mt-3'
                placeholder="Date d'immatriculation"
                defaultValue={startDate} 
                onChange={(event)=>setStartDate(event.target.value)}
              />
            </div>
            <div className="form-group col-lg-6 col-md-6">
              <label
                  htmlFor="picture"
              >
                  Logo
              </label>
              <input
                  className="form-control border mt-3 bg-white"
                  type="file" 
                  name="myImage"
                  accept="image/*" 
                  id='picture'
                  onChange={uploadToClientLogo}

              />
            </div>
            {/* Partie service choix multiple */}
            <label
                htmlFor="Q1"
                className="text-blackish-blue h6 mb-2"
            >
              Services
            </label>
            {/* Plateforme de distribution */}
            <div className="form-group  mt-3 ">
              <label
                htmlFor="terms-check"
                className="gr-check-input mb-7 d-flex"
              >
                <input 
                  type="checkbox" 
                  name="plateforme"
                  value="Plateforme de distribution"
                  id='terms-check' 
                  checked={serviceA.includes("Plateforme de distribution")}
                  onChange={handleOptionServiceA}
                />
                <p className="h6 mx-2 mb-0 text-center">
                  Plateforme de distribution
                </p>
            </label>
            </div>

            {/* Transmission de données / data dissemination */}
            <div className="form-group  mt-3 ">
              <label
                htmlFor="terms-check"
                className="gr-check-input mb-7 d-flex"
              >
                <input 
                  type="checkbox" 
                  name="transmission"
                  value="Transmission de données / data dissemination"
                  id='terms-check' 
                  checked={serviceB.includes("Transmission de données / data dissemination")}
                  onChange={handleOptionServiceB}
                />
                <p className=" mx-2 mb-0 text-center h6">
                  Transmission de données / data dissemination
                </p>
            </label>
            </div>

            {/* Reporting */}
            <div className="form-group  mt-3 ">
              <label
                htmlFor="terms-check"
                className="gr-check-input mb-7 d-flex"
              >
                <input 
                  type="checkbox" 
                  name="reporting"
                  value="Reporting"
                  id='terms-check' 
                  checked={serviceC.includes("Reporting")}
                  onChange={handleOptionServiceC}
                />
                <p className=" mx-2 mb-0 text-center h6">
                  Reporting
                </p>
            </label>
            </div>

            {/* Ordering services */}
            <div className="form-group  mt-3 ">
              <label
                htmlFor="terms-check"
                className="gr-check-input mb-7 d-flex"
              >
                <input 
                  type="checkbox" 
                  name="Ordering"
                  value="Ordering services"
                  id='terms-check' 
                  checked={serviceD.includes("Ordering services")}
                  onChange={handleOptionServiceD}
                />
                <p className=" mx-2 mb-0 text-center h6">
                  Ordering services
                </p>
            </label>
            </div>
            {/* Fin service */}

            

            <div className="form-group mb-6">
              <textarea
                rows="10"
                className="form-control gr-text-11 border mt-3 bg-white "
                type="text"
                id="contenu"
                placeholder="Présentation de la société de gestion OPCVM "
                defaultValue={presentation} 
                onChange={(event)=>setPresentation(event.target.value)}
              />
            </div>
            
            
                <button className="btn btn-primary mx-3" type='button' onClick={EditProfilGestion} disabled={isLoggingIn}>Envoyer</button>
            </form>
            </div>
            </div>
        </>
      ) : ("")}
      {/* FIN */}
      <div className='col-lg-1 col-md-12'></div>


      {/* ***************SI LE TYPE DE PROFIL EST ENTREPRISE OU COMMERCANT ****************/}
      {currentUser?.codeTypeProfil=="entCom" ? (
        
        <>
        {/* <div className='col-lg-3 col-md-12'></div> */}

          {/* <div className='col-lg-1 col-md-12'></div> */}

            <div className='col-lg-10 col-md-12 '>
            <div className='login-form'>
              <h2 className='text-center'>Activation de compte (Entreprise / Commerçant)</h2>
            <form className='row'>
              
              {/* ****************NOUVEAU**************************** */}

            <div className="form-group mb-6 col-lg-6 col-md-6">
              <select 
                className="form-control"
                id="employee"
                required
                defaultValue={occupationType} 
                onChange={(event)=>setOccupationType(event.target.value)}
              >
                <option defaultValue="">Type d'activité</option>
                  <optgroup className='single-cryptocurrency-box'>
                    <option  value="Profession libérale">Profession libérale</option>
                    <option  value="Commerçant / Activité informelle">Commerçant / Activité informelle</option>
                    <option  value="Entité légalement constituée">Entité légalement constituée</option>
                    <option  value="Entité en cours de création">Entité en cours de création</option>
                  </optgroup>
              </select>
            </div>

            {/* *****************LES SPECIALITES*********************************** */}
            {occupationType==="Profession libérale" || occupationType==="Commerçant / Activité informelle" || occupationType==="Entité légalement constituée" || occupationType==="Entité en cours de création"? (
              <>

              
            {/* SPECIALITE PROFESSION LIBERALE */}
            {occupationType==="Profession libérale"? (
              <>
              <div className="form-group mb-6 col-lg-6 col-md-6">
                <select 
                  className="form-control"
                  id="speciality"
                  required
                  defaultValue={speciality} 
                  onChange={(event)=>setSpeciality(event.target.value)}
                >
                  <option defaultValue="">Type de profession libérale</option>
                    <optgroup className='single-cryptocurrency-box'>
                      <option  value="Administrateur judiciaire">Administrateur judiciaire</option>
                      <option  value="Agent général d'assurance">Agent général d'assurance</option>
                      <option  value="Architecte">Architecte</option>
                      <option  value="Avocat">Avocat</option>
                      <option  value="Avoué auprès des cours d'appel">Avoué auprès des cours d'appel</option>
                      <option  value="Chiropracteur">Chiropracteur</option>
                      <option  value="Chirurgien-dentiste">Chirurgien-dentiste</option>
                      <option  value="Commissaire aux comptes">Commissaire aux comptes</option>
                      <option  value="Commissaire-priseur">Commissaire-priseur</option>
                      <option  value="Conseil en investissements financiers">Conseil en investissements financiers </option>
                      <option  value="Conseil en propriété industrielle">Conseil en propriété industrielle</option>
                      <option  value="Dentiste">Dentiste</option>
                      <option  value="Diététicien">Diététicien</option>
                      <option  value="Directeur de laboratoire d'analyses médicales">Directeur de laboratoire d'analyses médicales</option>
                      <option  value="Expert-comptable">Expert-comptable</option>
                      <option  value="Géomètre-expert">Géomètre-expert</option>
                      <option  value="Greffier auprès des tribunaux de commerce">Greffier auprès des tribunaux de commerce</option>
                      <option  value="Huissier de justice">Huissier de justice</option>
                      <option  value="Infirmier libéral">Infirmier libéral</option>
                      <option  value="Ingénieurs-conseils">Ingénieurs-conseils</option>
                      <option  value="Journaliste">Journaliste</option>
                      <option  value="Mandataire judiciaire à la protection des majeurs">Mandataire judiciaire à la protection des majeurs</option>
                      <option  value="Mandataire">Mandataire</option>
                      <option  value="judiciaire">judiciaire</option>
                      <option  value="Médecin">Médecin</option>
                      <option  value="Notaire">Notaire</option>
                      <option  value="Orthophoniste">Orthophoniste</option>
                      <option  value="Ostéopathe">Ostéopathe</option>
                      <option  value="Pédicure-podologue">Pédicure-podologue</option>
                      <option  value="Pharmacien">Pharmacien</option>
                      <option  value="Psychologue">Psychologue</option>
                      <option  value="Psychomotricien">Psychomotricien</option>
                      <option  value="Psychothérapeute">Psychothérapeute</option>
                      <option  value="Sage-femme">Sage-femme</option>
                      <option  value="Traducteurs-interprètes">Traducteurs-interprètes</option>
                      <option  value="Vétérinaire">Vétérinaire</option>
                    </optgroup>
                </select>
              </div>
              {speciality ? (
              <div className='form-group col-lg-6 col-md-6'>
              <input
                type='text'
                className='form-control'
                placeholder="Numéro d’agrément"
                defaultValue={approvalNumber} 
                onChange={(event)=>setApprovalNumber(event.target.value)}
              />
            </div>
              ):("")}
              </>
            ) : ("")}

            {/* POUR COMMERCANT/ACTIVITE INFORMELLE */}
            {occupationType==="Commerçant / Activité informelle"? (
              <>
            <div className="form-group mb-6 col-lg-6 col-md-6">
              <select 
                className="form-control"
                id="speciality"
                required
                defaultValue={speciality} 
                onChange={(event)=>setSpeciality(event.target.value)}
              >
                <option defaultValue="">Type de Commerçant / Activité informelle</option>
                  <optgroup className='single-cryptocurrency-box'>
                    <option  value="Activité informelle">Activité informelle</option>
                    <option  value="Commerçant">Commerçant</option>
                  </optgroup>
              </select>
            </div>
              </>
            ) :("")}

            {/* POUR ENTITE LEGALEMENT CONSTITUEE */}
            {occupationType==="Entité légalement constituée"? (
              <>
                <div className="form-group mb-6 col-lg-6 col-md-6">
                  <select 
                    className="form-control"
                    id="speciality"
                    required
                    defaultValue={speciality} 
                    onChange={(event)=>setSpeciality(event.target.value)}
                  >
                    <option defaultValue="">Type d'entité légalement constituée</option>
                      <optgroup className='single-cryptocurrency-box'>
                        <option  value="Société coopérative">Société coopérative</option>
                        <option  value="Groupement ou ONG ou Association">Groupement ou ONG ou Association</option>
                        <option  value="Entreprise individuelle">Entreprise individuelle</option>
                        <option  value="Société">Société</option>
                      </optgroup>
                  </select>
                </div>
              </>
            ) :("")}


            {/* POUR Entité en cours de création */}
            {occupationType==="Entité en cours de création" ? (
              <>
                <div className="form-group mb-6 col-lg-6 col-md-6">
              <select 
                className="form-control"
                id="speciality"
                required
                defaultValue={speciality} 
                onChange={(event)=>setSpeciality(event.target.value)}
              >
                <option defaultValue="">Type d'entité en cours de création</option>
                  <optgroup className='single-cryptocurrency-box'>
                    <option  value="Société Coopérative">Société Coopérative</option>
                    <option  value="Entreprise individuelle">Entreprise individuelle</option>
                    <option  value="SUARL">SUARL</option>
                    <option  value="SARL">SARL</option>
                    <option  value="SA">SA</option>
                    <option  value="SAS">SAS</option>
                    <option  value="ONG">ONG</option>
                    <option  value="Association">Association</option>
                    <option  value="GVC">GVC</option>
                    <option  value="GIE">GIE</option>
                  </optgroup>
              </select>
            </div>
              </>
            ) :("")}
            </>
            ) :("")}
            {/* ***********************FIN SPECIALITE******************* */}


            {/* *********************LES SOUS SPECIAL*************** */}
            {speciality ? (
              <>
              

            {/* 1ère PARTIE POUR Groupement / ONG/ ASSOCIATION*/}
            {speciality==="Groupement ou ONG ou Association" && occupationType==="Entité légalement constituée"? (
              <>
                <div className="form-group mb-6 col-lg-6 col-md-6">
                  <select 
                    className="form-control"
                    id="subSpecialty"
                    required
                    defaultValue={subSpecialty} 
                    onChange={(event)=>setSubSpecialty(event.target.value)}
                  >
                    <option defaultValue="">Type de groupement / ONG/ ASSOCIATION</option>
                      <optgroup className='single-cryptocurrency-box'>
                        <option  value="ONG">ONG</option>
                        <option  value="Association">Association</option>
                        <option  value="GVC">GVC</option>
                        <option  value="GIE">GIE</option>
                      </optgroup>
                  </select>
                </div>
              
              </>
            ) : ('')}


            {/* 2è PARTIE Société */}
            {speciality==="Société" && occupationType==="Entité légalement constituée"? (
              <>
            
            <div className="form-group mb-6 col-lg-6 col-md-6">
              <select 
                className="form-control"
                id="subSpecialty"
                required
                defaultValue={subSpecialty} 
                onChange={(event)=>setSubSpecialty(event.target.value)}
              >
                <option defaultValue="">Type de société</option>
                  <optgroup className='single-cryptocurrency-box'>
                    <option  value="SUARL">SUARL</option>
                    <option  value="SARL">SARL</option>
                    <option  value="SA">SA</option>
                    <option  value="SAS">SAS</option>
                  </optgroup>
              </select>
            </div>
              </>
            ) : ("")}

            {/* *********************FIN********************************* */}


              {/* *****LE CONTENU POUR Profession libérale ET Commerçant / Activité informelle**************** */}
            {occupationType==="Profession libérale" || occupationType==="Commerçant / Activité informelle"? (
              <>
                
            
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
                <select 
                placeholder='Pays dans lequel vous exercez votre activité'
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

              <div className=" form-group col-lg-6 col-md-6 ">
                  <div className=" input-group flex-nowrap ">
                    <span  className="input-group-text " id="addon-wrapping">
                    {allCountry?(
                      allCountry.map((data) => (
                        data.code == codeCountry ?(
                          <i key={data.id}>{data.indicator}</i>
                          
                        ):('')
                      ))
                    ):("")}
                    </span>
                    <input
                      className="form-control"
                      type="text"
                      id="contact"
                      placeholder="Numéro téléphone mobile"
                      required
                      defaultValue={mobile} 
                      onChange={(event)=>setMobile(event.target.value)}
                    />
                  </div>
              </div>


              <div className=" form-group col-lg-6 col-md-6 ">
                  <div className=" input-group flex-nowrap ">
                    <span  className="input-group-text " id="addon-wrapping">
                    {allCountry?(
                      allCountry.map((data) => (
                        data.code == codeCountry ?(
                          <i key={data.id}>{data.indicator}</i>
                          
                        ):('')
                      ))
                    ):("")}
                    </span>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Numéro de téléphone fixe"
                      defaultValue={phoneFixe} 
                      onChange={(event)=>setPhoneFixe(event.target.value)}
                    />
                  </div>
              </div>
              
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
                    type='text'
                    className='form-control'
                    placeholder='Votre nom'
                    defaultValue={firstName} 
                    onChange={(event)=>setFirstName(event.target.value)}
                  />
                </div>
                <div className='form-group col-lg-6 col-md-6'>
                  <input
                    type='text'
                    className='form-control'
                    placeholder='Vos prénoms'
                    defaultValue={lastName} 
                    onChange={(event)=>setLastName(event.target.value)}
                  />
                </div>
           
            <div className='form-group col-lg-6 col-md-6'>
                <select 
                placeholder='Pays de résidence'
                className='form-control'
                defaultValue={nativeCountry} 
                onChange={(event)=>setNativeCountry(event.target.value)}
                >
                  <option>Votre pays de résidence</option>
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

            <div className='form-group col-lg-6 col-md-6'>
              <input
                type='text'
                className='form-control'
                placeholder="Boite postale"
                defaultValue={mailbox} 
                onChange={(event)=>setMailbox(event.target.value)}
              />
            </div>

            <div className={`form-group col-lg-6 col-md-6  ${occupationType==="Profession libérale" ? ('mt-4') :('')}`}>
              
              <select 
              className='form-control'
              placeholder="Nationalité"
              defaultValue={nationality} 
              onChange={(event)=>setNationality(event.target.value)}
              >
                <option>Votre nationalité</option>
                {/* Parcourir les nationalités */}
                {allNationality?(
                allNationality.map((data) => (
                  <optgroup className='single-cryptocurrency-box'
                    key={data.id}>
                    <option  value={data.libelle}>{data.libelle}</option>
                  </optgroup>
                ))):("")}
            </select> 
            {/* Fin */}
          </div>

            <div className='form-group col-lg-6 col-md-6'>
              <label>
                Date de début des activités
              </label>
              <input
                type='date'
                className='form-control'
                placeholder="Date de début des activités"
                defaultValue={startDate} 
                onChange={(event)=>setStartDate(event.target.value)}
              />
            </div>
              </>
            ) : ("")}



            {/* ********************CONTENU DE Entité légalement constituée et Entité en cours de création************************************ */}
            {occupationType==="Entité légalement constituée"|| occupationType==="Entité en cours de création"?  (
              <>
              {occupationType==="Entité légalement constituée"?(
                <>
               
              {speciality==="Société coopérative" || speciality==="Entreprise individuelle" || speciality==="Groupement ou ONG ou Association" || speciality==="Société"? (
                <>
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
                    <input
                      type='text'
                      className='form-control'
                      placeholder="Numéro d’agrément"
                      defaultValue={approvalNumber} 
                      onChange={(event)=>setApprovalNumber(event.target.value)}
                    />
                  </div>
                </>
              ) : ("")}
               
               {speciality==="Société" || speciality==="Entreprise individuelle"? (
                <>
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
                id="sector"
                required
                defaultValue={sector} 
                onChange={(event)=>setSector(event.target.value)}
              >
                <option defaultValue="">Secteur d'activité Principal</option>
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
                </>
              ) : ("")}

               </>
              ):("")}

              
                
                
              {occupationType==="Entité légalement constituée"? (
              <div className='form-group col-lg-6 col-md-6'>
                <input
                  type='text'
                  className='form-control'
                  placeholder="Numéro de compte contribuable"
                  defaultValue={taxpayerNumber} 
                  onChange={(event)=>setTaxpayerNumber(event.target.value)}
                />
              </div>
              ):("")}
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
                <select 
                placeholder="Pays d'enregistrement / immatriculation"
                className='form-control'
                defaultValue={codeCountry} 
                onChange={(event)=>setCodeCountry(event.target.value)}
                >
                  <option>Pays d'enregistrement / immatriculation</option>
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
              <div className=" form-group col-lg-6 col-md-6 ">
                  <div className=" input-group flex-nowrap ">
                    <span  className="input-group-text " id="addon-wrapping">
                    {allCountry?(
                      allCountry.map((data) => (
                        data.code == codeCountry ?(
                          <i key={data.id}>{data.indicator}</i>
                          
                        ):('')
                      ))
                    ):("")}
                    </span>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Numéro téléphone mobile"
                      defaultValue={mobile} 
                      onChange={(event)=>setMobile(event.target.value)}
                    />
                  </div>
              </div>
              <div className=" form-group col-lg-6 col-md-6 ">
                  <div className=" input-group flex-nowrap ">
                    <span  className="input-group-text " id="addon-wrapping">
                    {allCountry?(
                      allCountry.map((data) => (
                        data.code == codeCountry ?(
                          <i key={data.id}>{data.indicator}</i>
                          
                        ):('')
                      ))
                    ):("")}
                    </span>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Numéro de téléphone fixe"
                      defaultValue={phoneFixe} 
                      onChange={(event)=>setPhoneFixe(event.target.value)}
                    />
                  </div>
              </div>
              <div className='form-group col-lg-6 col-md-6'>
                  <input
                    type='text'
                    className='form-control'
                    placeholder='Ville'
                    defaultValue={city} 
                    onChange={(event)=>setCity(event.target.value)}
                  />
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

            <div className={`form-group col-lg-6 col-md-6 ${occupationType==="Entité en cours de création" || speciality==="Groupement ou ONG ou Association" || speciality==="Société"?  ("mt-4"):('')}`}>
              <input
                type='text'
                className='form-control'
                placeholder="Boite postale"
                defaultValue={mailbox} 
                onChange={(event)=>setMailbox(event.target.value)}
              />
            </div>

            <div className='form-group col-lg-6 col-md-6'>
                <label>
                {occupationType==="Entité légalement constituée"? ("Date de création") :("Date de début des activités")}
                </label>
                <input
                  type='date'
                  className='form-control'
                  placeholder={` ${occupationType==="Entité légalement constituée"? ("Date de création") :("Date de début des activités")}`}
                  defaultValue={startDate} 
                  onChange={(event)=>setStartDate(event.target.value)}
                />
              </div>

              
              <div className='form-group col-lg-6 col-md-6'>
                  <input
                    type='text'
                    className='form-control'
                    placeholder='Nom du representant légal'
                    defaultValue={firstName} 
                    onChange={(event)=>setFirstName(event.target.value)}
                  />
                </div>
                <div className='form-group col-lg-6 col-md-6'>
                  <input
                    type='text'
                    className='form-control'
                    placeholder='Prénoms du representant légal'
                    defaultValue={lastName} 
                    onChange={(event)=>setLastName(event.target.value)}
                  />
                </div>
           
            <div className='form-group col-lg-6 col-md-6'>
                <select 
                placeholder='Pays de résidence du representant légal'
                className='form-control'
                defaultValue={nativeCountry} 
                onChange={(event)=>setNativeCountry(event.target.value)}
                >
                  <option>Pays de résidence du representant légal</option>
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
           

            <div className='form-group col-lg-6 col-md-6'>
              <input
                type='text'
                className='form-control'
                placeholder="Qualité du representant légal"
                defaultValue={quality} 
                onChange={(event)=>setQuality(event.target.value)}
              />
            </div>
            
            <div className='form-group mt-3'>
              <select 
              className='form-control'
              placeholder="Nationalité du representant légal"
              defaultValue={nationality} 
              onChange={(event)=>setNationality(event.target.value)}
              >
                <option>Nationalité du representant légal</option>
                {/* Parcourir les nationalités */}
                {allNationality?(
                allNationality.map((data) => (
                  <optgroup className='single-cryptocurrency-box'
                    key={data.id}>
                    <option  value={data.libelle}>{data.libelle}</option>
                  </optgroup>
                ))):("")}
            </select> 
            {/* Fin */}
          </div>

             

              </>
            ) : ("")}

           










            
            
            
              {/* *********************FIN***************************** */}
                
              
             

              {/* <div className="form-group mb-6 col-lg-6 col-md-6">
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
                    <option  value="other">Autre statut, précisez</option>
                  </optgroup>
              </select>
            </div> */}

            

            

            {/* <div className="form-group mb-6 col-lg-6 col-md-6">
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
            </div> */}
              {occupationType==="Profession libérale" || occupationType==="Commerçant / Activité informelle" || occupationType==="Entité légalement constituée" || occupationType==="Entité en cours de création"? (
                <button className="btn btn-primary mx-3" type='button' onClick={EditProfilEntreprise} disabled={isLoggingIn}>Envoyer</button>
              ) : ('')}
              </>
            ):("")}
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
