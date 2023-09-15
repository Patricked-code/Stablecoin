import { useState, useEffect, useRef } from 'react';
import React from "react";
import Link from 'next/link';
import Webcam from 'react-webcam'// Pour camera photo
import Router from "next/router";
import Swal from 'sweetalert2';
import ProgressBar from '../../ProgressBar';


const CRegistreEtDfe = ({kycDocumentId, kycRegister, kycDfe}) => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API

    const [isLoggingIn, setIsLoggingIn] = useState(false); 
    const [currentKycEntrepriseStatut, setCurrentKycEntrepriseStatut] = useState();
    // State pour uploader les fichiers
    const [createObjectURL, setCreateObjectURL] = useState(null);

// ************************************************************************************
    // STATES DU REGISTRE DE COMMERCE
// ************************************************************************************

    const [statutRegisterPhoto, setStatutRegisterPhoto] = React.useState("0");
    const [typeDocRegistre, setTypeDocRegistre] = React.useState();

    
    
    
    // State Pour Camera photo
    const webcamRefRegister = useRef(null)
    const [imageRegister, setImageRegister] = useState(null)
    // Fin

    // State de l'envoie des fichiers dans la base de donnée
    const [registerFile, setRegisterFile] = useState(null)

// ********************FIN STATES DU REGISTRE DE COMMERCE*************************



// ************************************************************************************
    // DE DFE
// ************************************************************************************

const [statutDfePhoto, setStatutDfePhoto] = React.useState("0");
const [typeDocDfe, setTypeDocDfe] = React.useState();

// State Pour Camera photo
const webcamRefDfe = useRef(null)
const [imageDfe, setImageDfe] = useState(null)
// Fin

// State de l'envoie des fichiers dans la base de donnée
const [dfeFile, setDfeFile] = useState(null)

// ********************FIN STATES DE DFE*************************



// ************************************************************************************
    // FONCTIONS DU REGISTRE DE COMMERCE
// ************************************************************************************

    // Fonction pour faire la capture du registre de commerce
    const captureRegister = () => {
        const image = webcamRefRegister.current.getScreenshot()
        setImageRegister(image)
    }
    // Fin


// FONCTION POUR UPLOADER LE FICHIER Extrait de registre de commerce
    const uploadToClientRegistre = (event) => {
        if (event.target.files && event.target.files[0]) {
        const i = event.target.files[0];
        setRegisterFile(i);
        setCreateObjectURL(URL.createObjectURL(i));
        }
    };
    // FIN


    // FONCTION D'AJOUT DU FICHIER DE REGISTRE DE COMMERCE
    const addRegister= async (event) => {
        event.preventDefault();
        setIsLoggingIn(true)
        

        const token = localStorage.getItem('tokenEnCours')

        const body = new FormData();
        
        body.append("registerFile", typeDocRegistre==="0"?registerFile:"");
        body.append("registerPhoto", typeDocRegistre==="1"?imageRegister:"");
        
        const result = await fetch(`${API_URL}/api/kyc/business/add-kyc-register`, {
            method:"POST",
            body,
            headers: {
            // 'Content-Type': 'application/json',
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
                if (currentKycEntrepriseStatut==="1") {
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

    // FONCTION D'AJOUT (MODIFICATION) DU FICHIER DE REGISTRE DE COMMERCE
    const updateRegister= async (event) => {
        event.preventDefault();
        const token = localStorage.getItem('tokenEnCours')

        const body = new FormData();
        
        body.append("registerFile", typeDocRegistre==="0"?registerFile:"");
        body.append("registerPhoto", typeDocRegistre==="1"?imageRegister:"");
        
        const result = await fetch(`${API_URL}/api/kyc/business/update-kyc-register`, {
            method:"PUT",
            body,
            headers: {
            // 'Content-Type': 'application/json',
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
                if (currentKycEntrepriseStatut==="1") {
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

    // FONCTION POUR MODIFIER LE CHAMP REGISTER
    const updateFieldRegister= async (event) => {
        event.preventDefault();
        setIsLoggingIn(true)
        const token = localStorage.getItem('tokenEnCours')

        const result = await fetch(`${API_URL}/api/kyc/business/update-kyc-field-register-by-kycId/${kycDocumentId}`, {
            method:"PUT",
            headers: {
            'Content-Type': 'application/json',
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

    // ******************* FIN FONCTIONS DU REGISTRE DE COMMERCE*************



    // ************************************************************************************
        // FONCTIONS DE DFE
    // ************************************************************************************

    // Fonction pour faire la capture du registre de commerce
    const captureDfe = () => {
        const image = webcamRefDfe.current.getScreenshot()
        setImageDfe(image)
    }
    // Fin


// FONCTION POUR UPLOADER LE FICHIER Extrait de registre de commerce
    const uploadToClientDfe = (event) => {
        if (event.target.files && event.target.files[0]) {
        const i = event.target.files[0];
        setDfeFile(i);
        setCreateObjectURL(URL.createObjectURL(i));
        }
    };
    // FIN


    // FONCTION D'AJOUT(MODIFICATION) DU FICHIER DE REGISTRE DE COMMERCE
    const updateDfe= async (event) => {
        event.preventDefault();
        setIsLoggingIn(true)

        const token = localStorage.getItem('tokenEnCours')

        const body = new FormData();
        
        body.append("dfeFile", typeDocDfe==="0"?dfeFile:"");
        body.append("dfePhoto", typeDocDfe==="1"?imageDfe:"");
        
        const result = await fetch(`${API_URL}/api/kyc/business/update-kyc-dfe`, {
            method:"PUT",
            body,
            headers: {
            // 'Content-Type': 'application/json',
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
                if (currentKycEntrepriseStatut==="1") {
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

    // FONCTION POUR MODIFIER LE CHAMP DEF
    const updateFieldDfe= async (event) => {
        event.preventDefault();

        const token = localStorage.getItem('tokenEnCours')

        const result = await fetch(`${API_URL}/api/kyc/business/update-kyc-field-dfe-by-kycId/${kycDocumentId}`, {
            method:"PUT",
            headers: {
            'Content-Type': 'application/json',
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
    // ******************* FIN FONCTIONS DE DFE*************



    //localStorage pour récupérer une valeur en cliquant sur un bouton Recompleter qui indique qu'on veut modifier une partie Kyc 
    useEffect(() => {
        const kycStatut = localStorage.getItem('currentKycEntrepriseStatut')  
        setCurrentKycEntrepriseStatut(kycStatut)
    }, [currentKycEntrepriseStatut]);

  return (
    <>
                        {/* ************REGISTRE DE COMMERCE************ */}
                        {!kycRegister==1?(
                        <>
                        {!kycRegister==1? (
                        <form className='' onSubmit={kycDocumentId?updateRegister:addRegister}>

                            
                            {/* ***************REGISTRE DE COMMMERCE************ */}
                            
                            {/* PARTIE DE LA MANIERE A ENVOYER LES FICHIERS */}
                            <div className="form-group mb-6 mt-3">
                                <h5 className='colorRed text-center mb-3'>
                                    Extrait de registre de commerce
                                </h5>
                                <p className='text-center'>
                                    Comment voulez-vous importer votre fichier du registre de commerce?
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
                                        checked={typeDocRegistre==="0"}
                                        onChange={()=>setTypeDocRegistre("0")}
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
                                        checked={typeDocRegistre==="1"}
                                        onChange={()=>setTypeDocRegistre("1")}
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
                            {typeDocRegistre==="0" ? (
                                <>
                                
                                    <div className="form-group my-6">
                                        <label
                                            htmlFor="register"
                                        >
                                            Document de registre
                                        </label>
                                        <input
                                            className="form-control border mt-3 bg-white"
                                            type="file" 
                                            name="myImage"
                                            id='register'
                                            accept="application/pdf, image/*"
                                            onChange={uploadToClientRegistre}
                                        />
                                    </div>
                                </>
                            ) : ("")}
                            {/* FIN IMPORTATION */}
                            

                            {/* SI L'UTILISATEUR CHOISIT DE PRENDRE LES DOCUMENTS EN PHOTO */}
                            {typeDocRegistre==="1" ? (
                                <>
                                    <div className="form-group  ">
                                        <div className='row'>
                                            <div className='col-lg-2 clo-md-2'></div>
                                            <div className='col-lg-8 clo-md-8'>
                                                {statutRegisterPhoto==="0" ? (
                                                    <button className="btn btn-primary "
                                                        type='button'  
                                                        disabled={isLoggingIn}
                                                        onClick={()=>setStatutRegisterPhoto("1")}
                                                    >
                                                        Déclencher la caméra pour prendre la photo du registre
                                                    </button>
                                                ) : ("")} 
                                            </div>
                                            <div className='col-lg-2 clo-md-2'></div>
                                        </div>


                                        {/* Cette partie s'affciche lorsqu'on clique sur le bouton ci-dessus */}
                                        {statutRegisterPhoto==="1" ? (
                                            <> 
                                                {/* Si on a pas encore pris la photo on affiche la camera */}
                                                <div className='text-center'>
                                                    {!imageRegister ? (
                                                    <Webcam
                                                        audio={false}
                                                        height={350}
                                                        ref={webcamRefRegister}
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
                                                        {!imageRegister ? (
                                                            <button type='button' onClick={captureRegister}>Sauvegarder</button>
                                                        ) : ("")}
                                                    </div>
                                                    <div className='col-lg-2 col-md-2'></div>
                                                </div>
                                                            

                                                {/* Si on a pris la photo et qu'on veut reprende on affiche on clique sur ce bouton */}
                                                <div className='row mb-3'>
                                                    <div className='col-lg-2 col-md-2'></div>
                                                    <div className='col-lg-8 col-md-8'>
                                                        {imageRegister ? (
                                                            <button type='button' onClick={()=>setImageRegister("")}>Reprendre la photo</button>
                                                        ) : ("")}
                                                    </div>
                                                    <div className='col-lg-2 col-md-2'></div>
                                                </div>
                                                {/* Fin */}

                                                {/* Pour afficher l'image qui a été prise */}
                                                <div className='row '>
                                                    <div className='col-lg-2 col-md-2'></div>
                                                    <div className='col-lg-8 col-md-8'>
                                                        {imageRegister && <img src={imageRegister} alt="Selfie" />}
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
                            {/* ******

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
                                    <button className="btn btn-primary " type="submit" disabled={registerFile||imageRegister?isLoggingIn:true}   >Ajouter registre </button>
                                </div> 
                            </div>
                        </form> 
                        ):("")}
                        </>

                        ):(
                            <>
                                <div className='card'>
                                    <p className=' bgColorGreen text-center text-white'>Extrait de registre de commerce est sauvegardé succès</p>
                                    <div className="form-group mb-6 mt-3  text-center">
                                        <button className="btn btn-primary " onClick={updateFieldRegister}  >Modifier</button>
                                    </div> 
                                </div>
                            </>
                        )}
                        {/* ************FIN REGISTRE DE COMMERCE************ */}



                        {/* ************DFE************ */}
                        {!kycDfe==1?(
                            <>
                                {kycDfe==0 && kycRegister==1? (
                                    <form className='' onSubmit={updateDfe}>
                                        {/* PARTIE DE LA MANIERE A ENVOYER LES FICHIERS */}
                                        <div className="form-group mb-6 mt-3">
                                            <h5 className='colorRed text-center mb-3'>
                                                DFE
                                            </h5>
                                            <p className='text-center'>
                                                Comment voulez-vous importer votre fichier DFE?
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
                                                    checked={typeDocDfe==="0"}
                                                    onChange={()=>setTypeDocDfe("0")}
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
                                                    checked={typeDocDfe==="1"}
                                                    onChange={()=>setTypeDocDfe("1")}
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
                                        {typeDocDfe==="0" ? (
                                            <>
                                            
                                                <div className="form-group my-6">
                                                    <label
                                                        htmlFor="dfe"
                                                    >
                                                        Document DFE
                                                    </label>
                                                    <input
                                                        className="form-control border mt-3 bg-white"
                                                        type="file" 
                                                        name="myImage"
                                                        id='dfe'
                                                        accept="application/pdf, image/*"
                                                        onChange={uploadToClientDfe}
                                                    />
                                                </div>
                                            </>
                                        ) : ("")}
                                        {/* FIN IMPORTATION */}
                                        

                                        {/* SI L'UTILISATEUR CHOISIT DE PRENDRE LES DOCUMENTS EN PHOTO */}
                                        {typeDocDfe==="1" ? (
                                            <>
                                                <div className="form-group  ">
                                                    <div className='row'>
                                                        <div className='col-lg-2 clo-md-2'></div>
                                                        <div className='col-lg-8 clo-md-8'>
                                                            {statutDfePhoto==="0" ? (
                                                                <button className="btn btn-primary "
                                                                    type='button'  
                                                                    disabled={isLoggingIn}
                                                                    onClick={()=>setStatutDfePhoto("1")}
                                                                >
                                                                    Déclencher la caméra pour prendre la photo du Dfe
                                                                </button>
                                                            ) : ("")} 
                                                        </div>
                                                        <div className='col-lg-2 clo-md-2'></div>
                                                    </div>


                                                    {/* Cette partie s'affciche lorsqu'on clique sur le bouton ci-dessus */}
                                                    {statutDfePhoto==="1" ? (
                                                        <> 
                                                            {/* Si on a pas encore pris la photo on affiche la camera */}
                                                            <div className='text-center'>
                                                                {!imageDfe ? (
                                                                <Webcam
                                                                    audio={false}
                                                                    height={350}
                                                                    ref={webcamRefDfe}
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
                                                                    {!imageDfe ? (
                                                                        <button type='button' onClick={captureDfe}>Sauvegarder</button>
                                                                    ) : ("")}
                                                                    </div>
                                                                <div className='col-lg-2 col-md-2'></div>
                                                            </div>
                                                                        

                                                            {/* Si on a pris la photo et qu'on veut reprende on affiche on clique sur ce bouton */}
                                                            <div className='row mb-3'>
                                                                <div className='col-lg-2 col-md-2'></div>
                                                                <div className='col-lg-8 col-md-8'>
                                                                    {imageDfe ? (
                                                                        <button type='button' onClick={()=>setImageDfe("")}>Reprendre la photo</button>
                                                                    ) : ("")}
                                                                </div>
                                                                <div className='col-lg-2 col-md-2'></div>
                                                            </div>
                                                            {/* Fin */}

                                                            {/* Pour afficher l'image qui a été prise */}
                                                            <div className='row '>
                                                                <div className='col-lg-2 col-md-2'></div>
                                                                    <div className='col-lg-8 col-md-8'>
                                                                    {imageDfe && <img src={imageDfe} alt="Selfie" />}
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
                                                <button className="btn btn-primary " type='submit' disabled={dfeFile||imageDfe?isLoggingIn:true}  >Ajouter DFE </button>
                                            </div> 
                                        </div>
                                    </form>
                                ):("")} 
                            </> 
                         ):(
                            <>
                                <div className='card my-3'>
                                    <p className=' bgColorGreen text-center text-white'>Le DFE est sauvegardé avec succès</p>
                                    <div className="form-group mb-6 mt-3  text-center">
                                        <button className="btn btn-primary " onClick={updateFieldDfe}>Modifier</button>
                                    </div> 
                                </div>
                            </>
                        )}
                        {/* ************FIN DFE************ */}
                             
                    


    </>
  );
};

export default CRegistreEtDfe;
