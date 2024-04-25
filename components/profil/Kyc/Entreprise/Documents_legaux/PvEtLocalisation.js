import { useState, useEffect, useRef } from 'react';
import React from "react";
import Link from 'next/link';
import Webcam from 'react-webcam'// Pour camera photo
import Router from "next/router";
import Swal from 'sweetalert2';


const CPvEtLocalisation = ({kycDocumentId, kycRegister, kycDfe, kycCopyStatutes, kycDelegationPowers, kycPvAppointment, kycMapLocation}) => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API
     // Variable de l'api key de stablecoin
     const API_KEY_STABLECOIN = process.env.NEXT_PUBLIC_API_KEY_STABLECOIN

    const [isLoggingIn, setIsLoggingIn] = useState(false); 
    const [currentKycEntrepriseStatut, setCurrentKycEntrepriseStatut] = useState();
    // State pour uploader les fichiers
    const [createObjectURL, setCreateObjectURL] = useState(null);

// ************************************************************************************
    // STATES DE PV
// ************************************************************************************

    const [statutPvAppointmentPhoto, setStatutPvAppointmentPhoto] = React.useState("0");
    const [typeDocPvAppointment, setTypeDocPvAppointment] = React.useState();

    // State Pour Camera photo
    const webcamRefPvAppointment = useRef(null)
    const [imagePvAppointment, setImagePvAppointment] = useState(null)
    // Fin

    // State de l'envoie des fichiers dans la base de donnée
    const [pvAppointmentFile, setPvAppointmentFile] = useState(null)

// ********************FIN STATES DE PV*************************



// ************************************************************************************
    // STATES DU PLAN LOCALISATION GEOGRAPHIQUE
// ************************************************************************************

const [statutMapLocationPhoto, setStatutMapLocationPhoto] = React.useState("0");
const [typeDocMapLocation, setTypeDocMapLocation] = React.useState();

// State Pour Camera photo
const webcamRefMapLocation = useRef(null)
const [imageMapLocation, setImageMapLocation] = useState(null)
// Fin

// State de l'envoie des fichiers dans la base de donnée
const [mapLocationFile, setMapLocationFile] = useState(null)

// ********************FIN STATES DU PLAN LOCALISATION GEOGRAPHIQUE*************************



// ************************************************************************************
    // FONCTIONS DE PV
// ************************************************************************************

    // Fonction pour faire la capture de Statut
    const capturePvAppointment = () => {
        const image = webcamRefPvAppointment.current.getScreenshot()
        setImagePvAppointment(image)
    }
    // Fin


    // FONCTION POUR UPLOADER LE FICHIER STATUTS
    const uploadToClientPvAppointment = (event) => {
        if (event.target.files && event.target.files[0]) {
        const i = event.target.files[0];
        setPvAppointmentFile(i);
        setCreateObjectURL(URL.createObjectURL(i));
        }
    };
    // FIN


    // FONCTION D'AJOUT (MODIFICATION) DU PV
    const updatePvAppointment= async (event) => {
        event.preventDefault();
        setIsLoggingIn(true)
        const token = localStorage.getItem('tokenEnCours')

        const body = new FormData();
        
        body.append("pvAppointmentFile", typeDocPvAppointment==="0"?pvAppointmentFile:"");
        body.append("pvAppointmentPhoto", typeDocPvAppointment==="1"?imagePvAppointment:"");
        
        const result = await fetch(`${API_URL}/api/kyc/business/update-kyc-pv-appointment`, {
            method:"PUT",
            body,
            headers: {
            // 'Content-Type': 'application/json',
                    'x-api-key': `${API_KEY_STABLECOIN}`,
            Authorization:  `Bearer ${token}`,
            },
        }) 
        
        /* Verifier s'il y a un messsage d'erreur on l'affiche dans SWAL 
                * sinon on affiche le message de succès
                */
        if (result?.status===200) {
            Swal.fire({
                position: 'center',
                icon: 'success',
                html: `<p> Votre ficher a été ajouté avec succès.</p>` ,
                showConfirmButton: false,
                timer: 5000
            }),
            setTimeout(() => {
                if (currentKycEntrepriseStatut==="5") {
                    Router.push("/profil/kyc/entreprise/resultat-kyc"); 

                }else{
                    // Router.push("/profil/kyc/entreprise/justificatif-domicile"); 
                    setTimeout(() => {
                        window.location.reload()
                    }, 1000)
                }
            }, 5000)

            
            }else{
                // setMessageError(data.message)
                setIsLoggingIn(false);
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    html: `<p> Désolé une erreur s'est produite,Veuillez réessayer svp. </p>` ,
                    showConfirmButton: false,
                    timer: 10000
                })
            }
            // Fin condition 
    }
    // FIN

    // FONCTION POUR MODIFIER LE CHAMP pvAppointment
    const updateFieldPvAppointment= async (event) => {
        event.preventDefault();
        const token = localStorage.getItem('tokenEnCours')

        const result = await fetch(`${API_URL}/api/kyc/business/update-kyc-field-pvAppointment-by-kycId/${kycDocumentId}`, {
            method:"PUT",
            headers: {
            'Content-Type': 'application/json',
                    'x-api-key': `${API_KEY_STABLECOIN}`,
            Authorization:  `Bearer ${token}`,
            },
        }) 
        
        /* Verifier s'il y a un messsage d'erreur on l'affiche dans SWAL 
                * sinon on affiche le message de succès
                */
        if (result?.status===200) {
            setTimeout(() => {
                window.location.reload()
            }, 1000)

            }else{
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    html: `<p> Désolé une erreur s'est produite,Veuillez réessayer svp. </p>` ,
                    showConfirmButton: false,
                    timer: 10000
                })
            }
            // Fin condition 
    }
    // FIN
    // ******************* FIN FONCTIONS DE PV*************



    // ************************************************************************************
        // FONCTIONS DU PLAN LOCALISATION GEOGRAPHIQUE
    // ************************************************************************************

    // Fonction pour faire la capture du plan de localisation géographie
    const captureMapLocation = () => {
        const image = webcamRefMapLocation.current.getScreenshot()
        setImageMapLocation(image)
    }
    // Fin


// FONCTION POUR UPLOADER LE FICHIER DU PLAN LOCALISATION GEOGRAPHIQUE
    const uploadToClientMapLocation = (event) => {
        if (event.target.files && event.target.files[0]) {
        const i = event.target.files[0];
        setMapLocationFile(i);
        setCreateObjectURL(URL.createObjectURL(i));
        }
    };
    // FIN


    // FONCTION D'AJOUT(MODIFICATION) DU FICHIER DU PLAN LOCALISATION GEOGRAPHIQUE
    const updateMapLocation= async (event) => {
        event.preventDefault();
        setIsLoggingIn(true)
        const token = localStorage.getItem('tokenEnCours')

        const body = new FormData();
        
        body.append("mapLocationFile", typeDocMapLocation==="0"?mapLocationFile:"");
        body.append("mapLocationPhoto", typeDocMapLocation==="1"?imageMapLocation:"");
        
        const result = await fetch(`${API_URL}/api/kyc/business/update-kyc-map-location`, {
            method:"PUT",
            body,
            headers: {
            // 'Content-Type': 'application/json',
                    'x-api-key': `${API_KEY_STABLECOIN}`,
            Authorization:  `Bearer ${token}`,
            },
        }) 
        
        /* Verifier s'il y a un messsage d'erreur on l'affiche dans SWAL 
                * sinon on affiche le message de succès
                */
        if (result?.status===200) {
            Swal.fire({
                position: 'center',
                icon: 'success',
                html: `<p> Votre ficher a été ajouté avec succès.</p>` ,
                showConfirmButton: false,
                timer: 5000
            }),
            setTimeout(() => {
                if (currentKycEntrepriseStatut==="6") {
                    Router.push("/profil/kyc/entreprise/resultat-kyc"); 

                }else{
                    // Router.push("/profil/kyc/entreprise/justificatif-domicile"); 
                    setTimeout(() => {
                        window.location.reload()
                    }, 1000)
                }
            }, 5000)

            
            }else{
                // setMessageError(data.message)
                setIsLoggingIn(false);
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    html: `<p> Désolé une erreur s'est produite,Veuillez réessayer svp. </p>` ,
                    showConfirmButton: false,
                    timer: 10000
                })
            }
            // Fin condition 
    }
    // FIN

    // FONCTION POUR MODIFIER LE CHAMP mapLocation
    const updateFieldMapLocation= async (event) => {
        event.preventDefault();
        const token = localStorage.getItem('tokenEnCours')

        const result = await fetch(`${API_URL}/api/kyc/business/update-kyc-field-mapLocation-by-kycId/${kycDocumentId}`, {
            method:"PUT",
            headers: {
            'Content-Type': 'application/json',
                    'x-api-key': `${API_KEY_STABLECOIN}`,
            Authorization:  `Bearer ${token}`,
            },
        }) 
        
        /* Verifier s'il y a un messsage d'erreur on l'affiche dans SWAL 
                * sinon on affiche le message de succès
                */
        if (result?.status===200) {
            setTimeout(() => {
                window.location.reload()
            }, 1000)

            }else{
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    html: `<p> Désolé une erreur s'est produite,Veuillez réessayer svp. </p>` ,
                    showConfirmButton: false,
                    timer: 10000
                })
            }
            // Fin condition 
    }
    // FIN

    // ******************* FIN FONCTIONS DU PLAN LOCALISATION GEOGRAPHIQUE*************



    //localStorage pour récupérer une valeur en cliquant sur un bouton Recompleter qui indique qu'on veut modifier une partie Kyc 
    useEffect(() => {
        const kycStatut = localStorage.getItem('currentKycEntrepriseStatut')  
        setCurrentKycEntrepriseStatut(kycStatut)
    }, [currentKycEntrepriseStatut]);


  return (
    <>
        {/* ***************FORMULAIRE DU PV************ */}
        {!kycPvAppointment==1?(
            <>
                {kycRegister==1 && kycDfe==1 && kycCopyStatutes==1 && kycDelegationPowers==1 && kycPvAppointment==0 ? (
                    <form className='' onSubmit={updatePvAppointment}>
                        {/* PARTIE DE LA MANIERE A ENVOYER LES FICHIERS */}
                        <div className="form-group mb-6 mt-3">
                            <h5 className='colorRed text-center mb-3'>
                                PV de nomination des dirigeants publication journal officiel
                            </h5>
                            <p className='text-center'>
                                Comment voulez-vous importer votre fichier de PV de nomination ?
                            </p>
                                        
                            <div className='row'>
                            {/* Imoporter*/}
                            <div className="form-group col-lg-6  mt-3 ">
                                <label
                                    htmlFor="importer-check"
                                    className="gr-check-input mb-7 d-flex"
                                >
                                                    
                                    <input 
                                    type="radio" 
                                    name="0"
                                    value='0'
                                    id='importer-check' 
                                    checked={typeDocPvAppointment==="0"}
                                    onChange={()=>setTypeDocPvAppointment("0")}
                                    />
                                    <p className=" mx-2 mb-0 text-center">
                                        Importer  en pdf ou  en image
                                    </p>
                                </label>
                            </div>
                            {/* Photo */}
                            <div className="form-group col-lg-6  mt-3 ">
                                <label
                                    htmlFor="photo-check"
                                    className="gr-check-input mb-7 d-flex"
                                >
                                    <input 
                                    type="radio" 
                                    name="photo"
                                    value="1"
                                    id='photo-check' 
                                    checked={typeDocPvAppointment==="1"}
                                    onChange={()=>setTypeDocPvAppointment("1")}
                                    />
                                <p className=" mx-2 mb-0 text-center">
                                    Prendre le fichier en photo
                                </p>
                                </label>
                            </div>
                            </div>
                        </div>
                        {/* FIN */}

                                        
                        {/* SI L'UTILISATEUR CHOISIT D'IMPORTER LES DOCUMENTS */}
                        {typeDocPvAppointment==="0" ? (
                            <>
                                <div className="form-group my-6">
                                    <label
                                        htmlFor="register"
                                    >
                                        PV de nomination
                                    </label>
                                    <input
                                        className="form-control border mt-3 bg-white"
                                        type="file" 
                                        name="myImage"
                                        id='register'
                                        accept="application/pdf, image/*"
                                        onChange={uploadToClientPvAppointment}
                                    />
                                </div>
                            </>
                        ) : ("")}
                        {/* FIN IMPORTATION */}
                                        

                        {/* SI L'UTILISATEUR CHOISIT DE PRENDRE LES DOCUMENTS EN PHOTO */}
                        {typeDocPvAppointment==="1" ? (
                            <>
                                <div className="form-group  ">
                                    <div className='row'>
                                        <div className='col-lg-2 clo-md-2'></div>
                                        <div className='col-lg-8 clo-md-8'>
                                            {statutPvAppointmentPhoto==="0" ? (
                                                <button className="btn btn-primary "
                                                    type='button'  
                                                    disabled={isLoggingIn}
                                                    onClick={()=>setStatutPvAppointmentPhoto("1")}
                                                >
                                                    Déclencher la caméra pour prendre la photo du fichier
                                                </button>
                                            ) : ("")} 
                                        </div>
                                        <div className='col-lg-2 clo-md-2'></div>
                                    </div>


                                    {/* Cette partie s'affciche lorsqu'on clique sur le bouton ci-dessus */}
                                    {statutPvAppointmentPhoto==="1" ? (
                                        <> 
                                            {/* Si on a pas encore pris la photo on affiche la camera */}
                                            <div className='text-center'>
                                                {!imagePvAppointment ? (
                                                <Webcam
                                                    audio={false}
                                                    height={350}
                                                    ref={webcamRefPvAppointment}
                                                    screenshotFormat="image/jpeg"
                                                    width={350}
                                                />
                                                ) : ("")}
                                            </div>
                                            {/* Fin */}


                                            {/* Si on a pas encore pris la photo on affiche ce bouton */}
                                            <div className='row '>
                                                <div className='col-lg-2 col-md-2'></div>
                                                <div className='col-lg-8 col-md-8'>
                                                    {!imagePvAppointment ? (
                                                        <button type='button' onClick={capturePvAppointment}>Sauvegarder</button>
                                                    ) : ("")}
                                                </div>
                                                <div className='col-lg-2 col-md-2'></div>
                                            </div>
                                                                        

                                            {/* Si on a pris la photo et qu'on veut reprende on affiche on clique sur ce bouton */}
                                            <div className='row mb-3'>
                                                <div className='col-lg-2 col-md-2'></div>
                                                <div className='col-lg-8 col-md-8'>
                                                    {imagePvAppointment ? (
                                                        <button type='button' onClick={()=>setImagePvAppointment("")}>Reprendre la photo</button>
                                                    ) : ("")}
                                                </div>
                                                <div className='col-lg-2 col-md-2'></div>
                                            </div>
                                            {/* Fin */}

                                            {/* Pour afficher l'image qui a été prise */}
                                            <div className='row '>
                                                <div className='col-lg-2 col-md-2'></div>
                                                <div className='col-lg-8 col-md-8'>
                                                    {imagePvAppointment && <img src={imagePvAppointment} alt="Selfie" />}
                                                </div>
                                                <div className='col-lg-2 col-md-2'></div>
                                            </div>
                                            {/* Fin*/}
                                        </>
                                    ) : ("")} 
                                    {/* Fin Recto */}

                                </div>
                            </>
                        ) : ("")}

                        {/* PARTIE DES BOUTONS */}
                        <div className="form-group mb-6 mt-3 col-lg-12 col-md-12  row justify-content-between">
                            <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">
                                <Link href='/profil/kyc/entreprise/information-financiere-five/' className="align-right">
                                    <a
                                    className=""
                                    >
                                        <button className="btn btn-primary " type='button'> Précédente </button>
                                    </a>   
                                </Link>                          
                            </div> 

                            <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">
                                <button className="btn btn-primary " type='submit' disabled={pvAppointmentFile||imagePvAppointment?isLoggingIn:true}  >Ajouter PV </button>
                            </div> 
                        </div>
                    </form>  
                ):("")} 
            </> 
        ):(
            <>
                {/* on verifie si l'utilisateur veut reprendre soit la partie PV de nomination ou Plan de localisation géographique */}
                {currentKycEntrepriseStatut==5 || currentKycEntrepriseStatut==6 ? (
                    <>
                        {/* si c'est PV de nomination on lui affiche ce bouton */}
                        {currentKycEntrepriseStatut==5 ? (

                        <div className='card my-3'>
                            <p className=' bgColorGreen text-center text-white'>PV de nomination des dirigeants publication journal officiel est sauvegardé succès</p>
                            <div className="form-group mb-6 mt-3  text-center">
                                <button className="btn btn-primary " onClick={updateFieldPvAppointment}  >Modifier</button>
                            </div> 
                        </div>
                        // Sinon le bouton disparaît
                        ):("")}
                    </>

                // Sinon le bouton reste s'affiche normalement comme pour les autres partie des documents
                ):(
                    <div className='card my-3'>
                        <p className=' bgColorGreen text-center text-white'>PV de nomination des dirigeants publication journal officiel est sauvegardé succès</p>
                        <div className="form-group mb-6 mt-3  text-center">
                            <button className="btn btn-primary " onClick={updateFieldPvAppointment}  >Modifier</button>
                        </div> 
                    </div>
                )}
            </>
        )}
        {/* ************FIN FORMULAIRE DU PV************ */}


        {/* ************ FORMULAIRE DU PLAN LOCALISATION GEOGRAPHIQUE************ */}
        {!kycMapLocation==1?(
            <>
                {kycRegister==1 && kycDfe==1 && kycCopyStatutes==1 && kycDelegationPowers==1 && kycPvAppointment==1 && kycMapLocation==0 ? (
                    <form className='' onSubmit={updateMapLocation}>
                        {/* PARTIE DE LA MANIERE A ENVOYER LES FICHIERS */}
                        <div className="form-group mb-6 mt-3">
                            <h5 className='colorRed text-center mb-3'>
                                Plan localisation géographique
                            </h5>
                            <p className='text-center'>
                                Comment voulez-vous importer votre fichier du plan localisation géographique ?
                            </p>
                                        
                            <div className='row'>
                            {/* Imoporter*/}
                            <div className="form-group col-lg-6  mt-3 ">
                                <label
                                    htmlFor="importer-check"
                                    className="gr-check-input mb-7 d-flex"
                                >
                                                    
                                    <input 
                                    type="radio" 
                                    name="0"
                                    value='0'
                                    id='importer-check' 
                                    checked={typeDocMapLocation==="0"}
                                    onChange={()=>setTypeDocMapLocation("0")}
                                    />
                                <p className=" mx-2 mb-0 text-center">
                                    Importer en pdf ou  en image
                                </p>
                                </label>
                            </div>
                            {/* Photo */}
                            <div className="form-group col-lg-6  mt-3 ">
                                <label
                                    htmlFor="photo-check"
                                    className="gr-check-input mb-7 d-flex"
                                >
                                    <input 
                                    type="radio" 
                                    name="photo"
                                    value="1"
                                    id='photo-check' 
                                    checked={typeDocMapLocation==="1"}
                                    onChange={()=>setTypeDocMapLocation("1")}
                                    />
                                <p className=" mx-2 mb-0 text-center">
                                    Prendre le fichier en photo
                                </p>
                                </label>
                            </div>
                            </div>
                        </div>
                        {/* FIN */}

                                        
                        {/* SI L'UTILISATEUR CHOISIT D'IMPORTER LES DOCUMENTS */}
                        {typeDocMapLocation==="0" ? (
                            <>
                                <div className="form-group my-6">
                                    <label
                                        htmlFor="dfe"
                                    >
                                        Document du plan localisation géographique
                                    </label>
                                    <input
                                        className="form-control border mt-3 bg-white"
                                        type="file" 
                                        name="myImage"
                                        id='dfe'
                                        accept="application/pdf, image/*"
                                        onChange={uploadToClientMapLocation}
                                    />
                                </div>
                            </>
                        ) : ("")}
                        {/* FIN IMPORTATION */}
                                        

                        {/* SI L'UTILISATEUR CHOISIT DE PRENDRE LES DOCUMENTS EN PHOTO */}
                        {typeDocMapLocation==="1" ? (
                            <>
                                <div className="form-group  ">
                                    <div className='row'>
                                        <div className='col-lg-2 clo-md-2'></div>
                                        <div className='col-lg-8 clo-md-8'>
                                            {statutMapLocationPhoto==="0" ? (
                                                <button className="btn btn-primary "
                                                    type='button'  
                                                    disabled={isLoggingIn}
                                                    onClick={()=>setStatutMapLocationPhoto("1")}
                                                >
                                                    Déclencher la caméra pour prendre la photo du fichier
                                                </button>
                                            ) : ("")} 
                                        </div>
                                        <div className='col-lg-2 clo-md-2'></div>
                                    </div>


                                    {/* Cette partie s'affciche lorsqu'on clique sur le bouton ci-dessus */}
                                    {statutMapLocationPhoto==="1" ? (
                                        <> 
                                            {/* Si on a pas encore pris la photo on affiche la camera */}
                                            <div className='text-center'>
                                                {!imageMapLocation ? (
                                                <Webcam
                                                    audio={false}
                                                    height={350}
                                                    ref={webcamRefMapLocation}
                                                    screenshotFormat="image/jpeg"
                                                    width={350}
                                                />
                                                ) : ("")}
                                            </div>
                                            {/* Fin */}


                                            {/* Si on a pas encore pris la photo on affiche ce bouton */}
                                            <div className='row '>
                                                <div className='col-lg-2 col-md-2'></div>
                                                <div className='col-lg-8 col-md-8'>
                                                    {!imageMapLocation ? (
                                                        <button type='button' onClick={captureMapLocation}>Sauvegarder</button>
                                                    ) : ("")}
                                                    </div>
                                                <div className='col-lg-2 col-md-2'></div>
                                            </div>
                                                                        

                                            {/* Si on a pris la photo et qu'on veut reprende on affiche on clique sur ce bouton */}
                                            <div className='row mb-3'>
                                                <div className='col-lg-2 col-md-2'></div>
                                                <div className='col-lg-8 col-md-8'>
                                                    {imageMapLocation ? (
                                                        <button type='button' onClick={()=>setImageMapLocation("")}>Reprendre la photo</button>
                                                    ) : ("")}
                                                </div>
                                                <div className='col-lg-2 col-md-2'></div>
                                            </div>
                                            {/* Fin */}

                                            {/* Pour afficher l'image qui a été prise */}
                                            <div className='row '>
                                                <div className='col-lg-2 col-md-2'></div>
                                                    <div className='col-lg-8 col-md-8'>
                                                    {imageMapLocation && <img src={imageMapLocation} alt="Selfie" />}
                                                    </div>
                                                <div className='col-lg-2 col-md-2'></div>
                                            </div>
                                            {/* Fin*/}
                                        </>
                                    ) : ("")} 
                                    {/* Fin Recto */}

                                </div>
                            </>
                        ) : ("")}



                        {/* PARTIE DES BOUTONS */}
                        <div className="form-group mb-6 mt-3 col-lg-12 col-md-12  row justify-content-between">
                            <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">
                                <Link href='/profil/kyc/entreprise/information-financiere-five/' className="align-right">
                                    <a
                                    className=""
                                    >
                                        <button className="btn btn-primary " type='button'> Précédente </button>
                                    </a>   
                                </Link>                          
                            </div> 

                            <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">
                                <button className="btn btn-primary " type='submit' disabled={mapLocationFile||imageMapLocation?isLoggingIn:true}  >Ajouter localisation </button>
                            </div> 
                        </div>
                    </form>  
                ):("")} 
            </>
        ):(
            <>
                {/* on verifie si l'utilisateur veut reprendre soit la partie PV de nomination ou Plan de localisation géographique */}
                {currentKycEntrepriseStatut==5 || currentKycEntrepriseStatut==6 ? (
                    <>
                        {/* si c'est Plan de localisation géographique on lui affiche ce bouton */}
                        {currentKycEntrepriseStatut==6 ? (

                            <div className='card my-3'>
                                <p className=' bgColorGreen text-center text-white'> Plan de localisation géographique est sauvegardé succès</p>
                                <div className="form-group mb-6 mt-3  text-center">
                                    <button className="btn btn-primary " onClick={updateFieldMapLocation}  >Modifier</button>
                                </div> 
                            </div>
                        // Sinon le bouton disparaît
                        ):("")}
                    </>

                // Sinon le bouton reste s'affiche normalement comme pour les autres partie des documents
                ):(
                    <div className='card my-3'>
                        <p className=' bgColorGreen text-center text-white'> Plan de localisation géographique est sauvegardé succès</p>
                        <div className="form-group mb-6 mt-3  text-center">
                            <button className="btn btn-primary " onClick={updateFieldMapLocation}  >Modifier</button>
                        </div> 
                    </div>
                )}
            </>
        )}
        {/* ************FIN FORMULAIRE DU PLAN LOCALISATION GEOGRAPHIQUE************ */}
                             
                    


    </>
  );
};

export default CPvEtLocalisation;
