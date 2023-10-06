import { useCallback, useState, useEffect } from 'react';
import React from "react";
import Link from 'next/link';
import Router from "next/router";
import Swal from 'sweetalert2';
import ProgressBar from '../ProgressBar';

// FIN

const CIdentiteOne = () => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API

    const [currentKycEntrepriseStatut, setCurrentKycEntrepriseStatut] = useState();
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [messageError, setMessageError] = useState();

    const [kycForEntreprise,setKycForEntreprise] = useState()
    const [kycIdentityForUser,setKycIdentityForUser] = useState()
    const [currentUser,setCurrentUser] = useState()
    
    // States du formulaire
    const [naturePerson, setNaturePerson] = useState();
    const [seniority, setSeniority] = useState();
    const [rccmNumber, setRccmNumber] = useState();
    const [registeredAddress, setRegisteredAddress] = useState();
    const [socialObject, setSocialObject] = useState();
    const [numberIdentification, setNumberIdentification] = useState();
    const [officeAddress, setOfficeAddress] = useState();
    const [fax, setFax] = useState();
    const [email, setEmail] = useState();
    const [dateConstitution, setDateConstitution] = useState();
    const [registrationDate, setRegistrationDate] = useState();
    const [international, setInternational] = useState([]);
    const [national, setNational] = useState([]);
    const [local, setLocal] = useState([]);

    // Pour les infos de l'utilisateur dans la table users
    const [entreprise, setEntreprise] = useState();
    const [mailbox, setMailbox] = useState();
    const [phoneFixe, setPhoneFixe] = useState();
    const [mobile, setMobile] = useState();
    const [city, setCity] = useState();


    //localStorage pour récupérer une valeur en cliquant sur un bouton Recompleter qui indique qu'on veut modifier une partie Kyc 
    useEffect(() => {
        const kycStatut = localStorage.getItem('currentKycEntrepriseStatut')  
        setCurrentKycEntrepriseStatut(kycStatut)
    }, [currentKycEntrepriseStatut]);
    
    // Obtenir l'utilisateur qui est connecté
    useEffect(() => {
        (async () => {
            const token = localStorage.getItem('tokenEnCours') //Le token récuperé

            const getUser = async () => {
            const result = await fetch(`${API_URL}/api/user/find-user-sign-in`, {
                headers: {
                'Content-Type': 'application/json',
                Authorization:  `Bearer ${token}`

                },
            })
            .then((result) => result.json())
            .then((user) => {
            setCurrentUser(user)

            }) 
            };
            await getUser();
            // Fin

        })();
    }, [currentUser]);
      // Fin

    // RECUPERER KYC DE L'ENTREPRISE
    useEffect(async() => {
        const token = localStorage.getItem('tokenEnCours')
        
            const getKycForEntreprise = async () => {
            const resKyc = await fetch(`${API_URL}/api/kyc/business/find-kyc-of-user`, {
                headers: {
                'Content-Type': 'application/json',
                Authorization:  `Bearer ${token}`,
                },
            })
                .then((resKyc) => resKyc.json())
                .then((data) => {
                setKycForEntreprise(data)
                }) 
            };
            await getKycForEntreprise();
    }, []);
    // FIN


    // RECUPERER KYC DE L'ENTREPRISE
    useEffect(async() => {
        const token = localStorage.getItem('tokenEnCours')
        
            const getKycForEntreprise = async () => {
            const resKyc = await fetch(`${API_URL}/api/kyc/business/find-kyc-of-user`, {
                headers: {
                'Content-Type': 'application/json',
                Authorization:  `Bearer ${token}`,
                },
            })
                .then((resKyc) => resKyc.json())
                .then((data) => {
                setKycForEntreprise(data)

                }) 
            };
            await getKycForEntreprise();
    }, []);
    // FIN

    // RECUPERER KYC DE L'IDENTITE DE L'UTISATEUR
    useEffect(async() => {
        const token = localStorage.getItem('tokenEnCours')
            const getKycForEntreprise = async () => {
            const resKyc = await fetch(`${API_URL}/api/kyc/business/find-kyc-business-identity-of-user-signIn`, {
                headers: {
                'Content-Type': 'application/json',
                Authorization:  `Bearer ${token}`,
                },
            })
                .then((resKyc) => resKyc.json())
                .then((data) => {
                    setKycIdentityForUser(data)
                }) 
            };
            await getKycForEntreprise();
    }, []);
    // FIN


    // Fonction d'envoie des informations de l'identité
    const addIdentity= async (event) => {
        event.preventDefault();
        setIsLoggingIn(true);
        try {
            const dataTable = {
                international:Object.assign({},international),
                national:Object.assign({},national),
                local:Object.assign({},local),
            }
            const dataa = {
                international:dataTable?.international[0], 
                national:dataTable?.national[0],
                local:dataTable?.local[0],
                naturePerson:naturePerson,
                seniority:seniority,
                rccmNumber:rccmNumber,
                socialObject:socialObject,
                numberIdentification:numberIdentification,
                registeredAddress:registeredAddress,
                fax:fax,
                dateConstitution:dateConstitution,
                registrationDate:registrationDate
            }

                const token = localStorage.getItem('tokenEnCours') //Le token récuperé

                const result = await fetch(`${API_URL}/api/kyc/business/add-kyc-identity`, {
                method:"POST",
                body: JSON.stringify(dataa),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization:  `Bearer ${token}`
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
                    updateInfosUser() //Appel de la fonction qui modifie les infos de l'entreprise dans la table users
                }
                // Fin condition 
            } catch {
            setIsLoggingIn(false);
            }
    };
    // Fin

    // Fonction de modification d'envoie des informations du de l'identité
    const updateIdentity= async (event) => {
        event.preventDefault();
        setIsLoggingIn(true);
        
        try {

            const dataTable = {
                international:Object.assign({},international),
                national:Object.assign({},national),
                local:Object.assign({},local),
            }
            const dataa = {
                international:dataTable?.international[0], 
                national:dataTable?.national[0],
                local:dataTable?.local[0],
                naturePerson:naturePerson,
                seniority:seniority,
                rccmNumber:rccmNumber,
                socialObject:socialObject,
                numberIdentification:numberIdentification,
                registeredAddress:registeredAddress,
                fax:fax,
                dateConstitution:dateConstitution,
                registrationDate:registrationDate
            }

                const token = localStorage.getItem('tokenEnCours') //Le token récuperé

                const result = await fetch(`${API_URL}/api/kyc/business/update-kyc-identity`, {
                method:"PUT",
                body: JSON.stringify(dataa),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization:  `Bearer ${token}`
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
                    updateInfosUser() //Appel de la fonction qui modifie les infos de l'entreprise dans la table users
                }
                // Fin condition 
            } catch {
            setIsLoggingIn(false);
            }
    };
    // Fin


    // Fonction de modification des infos de l'utisateur qui sont dans justificatif d'identité
    const updateInfosUser = async() => {
        setIsLoggingIn(true);

        try {

            const dataInfosUser = {
                entreprise:entreprise,
                mailbox:mailbox,
                phoneFixe:phoneFixe,
                mobile:mobile,
                city:city
                            
            }
                const token = localStorage.getItem('tokenEnCours') //Le token récuperé

                const result = await fetch(`${API_URL}/api/kyc/business/update-user-kyc-identity`, {
                method:"PUT",
                body: JSON.stringify(dataInfosUser),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization:  `Bearer ${token}`
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
                        html: `<p> Vos réponses ont été sauvegardées avec succès.</p>` ,
                        showConfirmButton: false,
                        timer: 5000
                    }),
                    setTimeout(() => {
                        if (currentKycEntrepriseStatut==="1") {
                            Router.push("/profil/kyc/entreprise/resultat-kyc"); 
                        }else{
                            Router.push("/profil/kyc/entreprise/identite-representant-one"); 
                        }
                    }, 5000)
                }
                // Fin condition 
            
            } catch {
            setIsLoggingIn(false);
        }
        
    }
    // Fin 
    
    
    // Les handle de la partie des boutons checkbox
    const handleOptionInternational = (event) => {
        const value = event.target.value;
        const isChecked = event.target.checked;

        if (isChecked) {
            setInternational([...international, value]);
        } else {
            setInternational("");
        }
    };

    const handleOptionNational = (event) => {
        const value = event.target.value;
        const isChecked = event.target.checked;

        if (isChecked) {
            setNational([...national, value]);
        } else {
            setNational("");
        }
    };

    const handleOptionLocal = (event) => {
        const value = event.target.value;
        const isChecked = event.target.checked;

        if (isChecked) {
            setLocal([...local, value]);
        } else {
            setLocal("");
        }
    };


    // La barre de progression de KYC du profil entreprise
    const stepsEntreprise = ["AML","Identité","Représentant", "Bénéficiaire","Control", "Politique", "Opérations", "Fonds", "Financière", "Documents"];

    const activeStepEntreprise = 0;
    // Fin
    // ********************************************************************************
  // LA PARTIE POUR EVITER L'AFFICHAGE DES LA BARRE DE PROGRSSION SUR MOBILE
// ********************************************************************************
  
// Utilisez un état local pour stocker la largeur de l'écran
  const [windowWidth, setWindowWidth] = useState(0);
  // Utilisez useEffect pour obtenir la largeur de l'écran une fois que le composant est monté
  useEffect(() => {
    // Obtenez la largeur de l'écran et mettez à jour l'état local
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Ajoutez un gestionnaire d'événement pour redimensionner la fenêtre
    window.addEventListener('resize', handleResize);

    // Appelez handleResize une fois pour obtenir la largeur initiale
    handleResize();

    // Nettoyez le gestionnaire d'événement lors du démontage du composant
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Conditionnez l'affichage de ProgressBar en fonction de la largeur de l'écran
  const showProgressBar = windowWidth >= 1180; // Par exemple, considérez les écrans de 768 pixels ou plus comme des ordinateurs
  
  // *****************FIN LA PARTIE POUR EVITER L'AFFICHAGE DES LA BARRE DE PROGRSSION SUR MOBILE*****


  return (
    <>
      {showProgressBar && <ProgressBar className="mb-15" steps={stepsEntreprise} activeStep={activeStepEntreprise} />}

        <div className='mt-15' >
            <div className=' mx-15'>
                <div className='py-10'>
                <br/><br/><h1 className='text-center '>Identité </h1>
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
                        <form className='' onSubmit={kycIdentityForUser?.userId || !kycIdentityForUser?.userId==undefined? updateIdentity :addIdentity} >
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="international"
                                    className="text-blackish-blue mb-2"
                                >
                                    Domaine d’activité 
                                </label>
                                <div className="form-group ">
                                    <label
                                        htmlFor="international-check"
                                        className="gr-check-input mb-7 d-flex"
                                    >
                                        <input 
                                            type="checkbox" 
                                            name="International"
                                            value="International"
                                            id='international-check' 
                                            checked={international.includes("International")}
                                            onChange={handleOptionInternational}
                                            
                                        />
                                    <p className=" mx-2 mb-0 text-center">
                                        International
                                    </p>
                                    </label>
                                </div>
                                <div className="form-group ">
                                    <label
                                        htmlFor="national-check"
                                        className="gr-check-input mb-7 d-flex"
                                    >
                                        <input 
                                            type="checkbox" 
                                            name="National"
                                            value="National"
                                            id='national-check' 
                                            checked={national.includes("National")}
                                            onChange={handleOptionNational}
                                        />
                                    <p className=" mx-2 mb-0 text-center">
                                        National
                                    </p>
                                    </label>
                                </div>
                                <div className="form-group ">
                                    <label
                                        htmlFor="local-check"
                                        className="gr-check-input mb-7 d-flex"
                                    >
                                        <input 
                                            type="checkbox" 
                                            name="Local"
                                            value="Local"
                                            id='local-check' 
                                            checked={local.includes("Local")}
                                            onChange={handleOptionLocal}
                                        />
                                    <p className=" mx-2 mb-0 text-center">
                                        Local
                                    </p>
                                    </label>
                                </div>
                            </div >

                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="naturePerson"
                                    className="text-blackish-blue mb-2"
                                >
                                    Nature de la personne morale 
                                </label>
                                <select 
                                className="form-control"
                                id="naturePerson"
                                required
                                defaultValue={naturePerson} 
                                onChange={(event)=>setNaturePerson(event.target.value)}
                                >
                                <option defaultValue="">Choisissez</option>
                                    <optgroup className='single-cryptocurrency-box'>
                                    <option  value="Entreprise individuelle">Entreprise individuelle</option>
                                    <option  value="Profession libérale">Profession libérale</option>
                                    <option  value="SA">SA</option>
                                    <option  value="SARL">SARL</option>
                                    <option  value="SARL Unipersonnelle">SARL Unipersonnelle</option>
                                    <option  value="Société cooperative">Société cooperative</option>
                                    <option  value="Association">Association</option>
                                    <option  value="GVC">GVC</option>
                                    <option  value="ONG">ONG</option>
                                    <option  value="GIE">GIE</option>
                                    <option  value="Autre">Autre</option>
                                    </optgroup>
                                </select>
                            </div>

                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="seniority"
                                    className="text-blackish-blue mb-2"
                                >
                                    Ancienneté professionnelle 
                                </label>
                                <select 
                                className="form-control"
                                id="seniority"
                                required
                                defaultValue={seniority} 
                                onChange={(event)=>setSeniority(event.target.value)}
                                >
                                    
                                <option defaultValue="">Choisissez</option>
                                    <optgroup className='single-cryptocurrency-box'>
                                        <option  value="Inférieure à un an">Inférieure à un an</option>
                                        <option  value="De 1 à 10 ans">De 1 à 10 ans</option>
                                        <option  value="Plus de 10 ans">Plus de 10 ans</option>
                                    </optgroup>
                                </select>
                            </div>

                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="entreprise"
                                    className="text-blackish-blue mb-2"
                                >
                                    Dénomination sociale
                                </label>
                                <div className='form-group'>
                                    <input
                                        type='text'
                                        id='entreprise'
                                        className='form-control'
                                        placeholder='Dénomination sociale'
                                        defaultValue={currentUser?.entreprise} 
                                        onChange={(event)=>setEntreprise(event.target.value)}
                                    />
                                </div>
                            </div>
                            
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="numberRCCM"
                                    className="text-blackish-blue mb-2"
                                >
                                    Numéro RCCM
                                </label>
                                <div className='form-group'>
                                    <input
                                        type='text'
                                        id='numberRCCM'
                                        className='form-control'
                                        placeholder='Numéro RCCM'
                                        defaultValue={rccmNumber} 
                                        onChange={(event)=>setRccmNumber(event.target.value)}
                                    />
                                </div>
                            </div>
                            
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="socialObject"
                                    className="text-blackish-blue mb-2"
                                >
                                    Objet social
                                </label>
                                <div className='form-group'>
                                    <input
                                        type='text'
                                        id='socialObject'
                                        className='form-control'
                                        placeholder='Objet social'
                                        defaultValue={socialObject} 
                                        onChange={(event)=>setSocialObject(event.target.value)}
                                    />
                                </div>
                            </div>
                            
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="numberIdentification"
                                    className="text-blackish-blue mb-2"
                                >
                                    Numéro d’identification 
                                </label>
                                <div className='form-group'>
                                    <input
                                        type='text'
                                        id='numberIdentification'
                                        className='form-control'
                                        placeholder='Numéro d’identification '
                                        defaultValue={numberIdentification} 
                                        onChange={(event)=>setNumberIdentification(event.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="city"
                                    className="text-blackish-blue mb-2"
                                >
                                    Ville 
                                </label>
                                <div className='form-group'>
                                    <input
                                        type='text'
                                        id='city'
                                        className='form-control'
                                        placeholder='Ville'
                                        defaultValue={currentUser?.city} 
                                        onChange={(event)=>setCity(event.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="mailbox"
                                    className="text-blackish-blue mb-2"
                                >
                                    Adresse postale
                                </label>
                                <div className='form-group'>
                                    <input
                                        type='text'
                                        id='mailbox'
                                        className='form-control'
                                        placeholder='Adresse postale'
                                        defaultValue={currentUser?.mailbox} 
                                        onChange={(event)=>setMailbox(event.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="officeAddress"
                                    className="text-blackish-blue mb-2"
                                >
                                    Adresse du siège social 
                                </label>
                                <div className='form-group'>
                                    <input
                                        type='text'
                                        id='officeAddress'
                                        className='form-control'
                                        placeholder='Adresse siège social'
                                        defaultValue={registeredAddress} 
                                        onChange={(event)=>setRegisteredAddress(event.target.value)}
                                    />
                                </div>
                            </div>
                            
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="immatriculation"
                                    className="text-blackish-blue mb-2"
                                >
                                    Téléphone Fixe
                                </label>
                                <div className='form-group'>
                                    <input
                                        type='text'
                                        id='phoneFixe'
                                        className='form-control'
                                        placeholder='Téléphone Fixe'
                                        defaultValue={currentUser?.phoneFixe} 
                                        onChange={(event)=>setPhoneFixe(event.target.value)}
                                    />
                                </div>
                            </div>
                            
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="mobile"
                                    className="text-blackish-blue mb-2"
                                >
                                    Téléphone mobile 
                                </label>
                                <div className='form-group'>
                                    <input
                                        type='text'
                                        id='mobile'
                                        className='form-control'
                                        placeholder='Téléphone mobile'
                                        defaultValue={currentUser?.mobile} 
                                        onChange={(event)=>setMobile(event.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="fax"
                                    className="text-blackish-blue mb-2"
                                >
                                    Fax
                                </label>
                                <div className='form-group'>
                                    <input
                                        type='text'
                                        id='fax'
                                        className='form-control'
                                        placeholder='Fax'
                                        defaultValue={fax} 
                                        onChange={(event)=>setFax(event.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="dateConstitution"
                                    className="text-blackish-blue mb-2"
                                >
                                    Date de constitution 
                                </label>
                                <div className='form-group'>
                                    <input
                                        type='date'
                                        id='dateConstitution'
                                        className='form-control'
                                        placeholder='Date de constitution '
                                        defaultValue={dateConstitution} 
                                        onChange={(event)=>setDateConstitution(event.target.value)}
                                    />
                                </div>
                            </div>
                            
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="registrationDate"
                                    className="text-blackish-blue mb-2"
                                >
                                    Date d'enregistrement
                                </label>
                                <div className='form-group'>
                                    <input
                                        type='date'
                                        id='registrationDate'
                                        className='form-control'
                                        placeholder="Date d'enregistrement"
                                        defaultValue={registrationDate} 
                                        onChange={(event)=>setRegistrationDate(event.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="form-group mb-6 mt-3 col-lg-12 col-md-12  row justify-content-between">
                                <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">
                                    <Link href='/profil/kyc/entreprise/questionnaire-aml-four/' className="align-right">
                                        <a
                                        className=""
                                        >
                                            <button className="btn btn-primary " type='button'  > Précédente </button>
                                        </a>   
                                    </Link>                          
                                </div>
                                <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">
                                
                                    <button className="btn btn-primary " type='submit' disabled={isLoggingIn}  > Suivant </button>
                                                       
                                </div>
                            </div> 
                        </form>       
                    </div>
                <div className='col-lg-3 col-md-12'></div>
            </div>
        </div>
    </>
  );
};

export default CIdentiteOne;
