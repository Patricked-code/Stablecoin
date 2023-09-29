import { useState, useEffect, useRef } from 'react';
import React from "react";
import Link from 'next/link';
import Webcam from 'react-webcam'// Pour camera photo
import Router from "next/router";
import Swal from 'sweetalert2';


const CStatusEtDelegation = ({kycDocumentId,kycRegister, kycDfe, kycCopyStatutes, kycDelegationPowers}) => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API

    const [isLoggingIn, setIsLoggingIn] = useState(false); 
    const [currentKycEntrepriseStatut, setCurrentKycEntrepriseStatut] = useState();
    // State pour uploader les fichiers
    const [createObjectURL, setCreateObjectURL] = useState(null);

// ************************************************************************************
    // STATES DE STATUTS
// ************************************************************************************

    const [statutCopyStatutesPhoto, setStatutCopyStatutesPhoto] = React.useState("0");
    const [typeDocCopyStatutes, setTypeDocCopyStatutes] = React.useState();

    // State Pour Camera photo
    const webcamRefCopyStatutes = useRef(null)
    const [imageCopyStatutes, setImageCopyStatutes] = useState(null)
    // Fin

    // State de l'envoie des fichiers dans la base de donnée
    const [copyStatutesFile, setCopyStatutesFile] = useState(null)

// ********************FIN STATES DE STATUTS*************************



// ************************************************************************************
    // STATES DE DELEGATION DE POUVOIRS
// ************************************************************************************

const [statutDelegationPowersPhoto, setStatutDelegationPowersPhoto] = React.useState("0");
const [typeDocDelegationPowers, setTypeDocDelegationPowers] = React.useState();

// State Pour Camera photo
const webcamRefDelegationPowers = useRef(null)
const [imageDelegationPowers, setImageDelegationPowers] = useState(null)
// Fin

// State de l'envoie des fichiers dans la base de donnée
const [delegationPowersFile, setDelegationPowersFile] = useState(null)

// ********************FIN STATES DE DELEGATION DE POUVOIRS*************************



// ************************************************************************************
    // FONCTIONS DE STATUTS
// ************************************************************************************

    // Fonction pour faire la capture de Statut
    const captureCopyStatutes = () => {
        const image = webcamRefCopyStatutes.current.getScreenshot()
        setImageCopyStatutes(image)
    }
    // Fin


    // FONCTION POUR UPLOADER LE FICHIER STATUTS
    const uploadToClientCopyStatutes = (event) => {
        if (event.target.files && event.target.files[0]) {
        const i = event.target.files[0];
        setCopyStatutesFile(i);
        setCreateObjectURL(URL.createObjectURL(i));
        }
    };
    // FIN


    // FONCTION D'AJOUT (MODIFICATION) DU FICHIER DE STATUTS
    const updateCopyStatutes= async (event) => {
        event.preventDefault();
        setIsLoggingIn(true)
        const token = localStorage.getItem('tokenEnCours')

        const body = new FormData();
        
        body.append("copyStatutesFile", typeDocCopyStatutes==="0"?copyStatutesFile:"");
        body.append("copyStatutesPhoto", typeDocCopyStatutes==="1"?imageCopyStatutes:"");
        
        const result = await fetch(`${API_URL}/api/kyc/business/update-kyc-copyStatutes`, {
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
                if (currentKycEntrepriseStatut==="3") {
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

    // FONCTION POUR MODIFIER LE CHAMP copyStatutes
    const updateFieldCopyStatutes= async (event) => {
        event.preventDefault();
        const token = localStorage.getItem('tokenEnCours')

        const result = await fetch(`${API_URL}/api/kyc/business/update-kyc-field-copyStatutes-by-kycId/${kycDocumentId}`, {
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

    // ******************* FIN FONCTIONS DE STATUTS*************



    // ************************************************************************************
        // FONCTIONS DE DELEGATION DE POUVOIRS
    // ************************************************************************************

    // Fonction pour faire la capture de Délégation de pouvoirs
    const captureDelegationPowers = () => {
        const image = webcamRefDelegationPowers.current.getScreenshot()
        setImageDelegationPowers(image)
    }
    // Fin


// FONCTION POUR UPLOADER LE FICHIER DE DELEGATION DE POUVOIRS
    const uploadToClientDelegationPowers = (event) => {
        if (event.target.files && event.target.files[0]) {
        const i = event.target.files[0];
        setDelegationPowersFile(i);
        setCreateObjectURL(URL.createObjectURL(i));
        }
    };
    // FIN


    // FONCTION D'AJOUT(MODIFICATION) DU FICHIER DE DELEGATION DE POUVOIRS
    const updateDelegationPowers= async (event) => {
        event.preventDefault();
        setIsLoggingIn(true)
        const token = localStorage.getItem('tokenEnCours')

        const body = new FormData();
        
        body.append("delegationPowersFile", typeDocDelegationPowers==="0"?delegationPowersFile:"");
        body.append("delegationPowersPhoto", typeDocDelegationPowers==="1"?imageDelegationPowers:"");
        
        const result = await fetch(`${API_URL}/api/kyc/business/update-kyc-delegation-powers`, {
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
                if (currentKycEntrepriseStatut==="4") {
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

    // FONCTION POUR MODIFIER LE CHAMP delegationPowers
    const updateFieldDelegationPowers= async (event) => {
        event.preventDefault();
        const token = localStorage.getItem('tokenEnCours')

        const result = await fetch(`${API_URL}/api/kyc/business/update-kyc-field-delegationPowers-by-kycId/${kycDocumentId}`, {
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

    // ******************* FIN FONCTIONS DE DELEGATION DE POUVOIRS*************



    //localStorage pour récupérer une valeur en cliquant sur un bouton Recompleter qui indique qu'on veut modifier une partie Kyc 
    useEffect(() => {
        const kycStatut = localStorage.getItem('currentKycEntrepriseStatut')  
        setCurrentKycEntrepriseStatut(kycStatut)
    }, [currentKycEntrepriseStatut]);


  return (
    <>
        {/* ************REGISTRE DE COMMERCE************ */}
        {!kycCopyStatutes==1?( 
            <>
                {kycRegister==1 && kycDfe==1 && kycCopyStatutes==0 ? (
                    <form className='' onSubmit={updateCopyStatutes}>
                                        
                        {/* ***************COPIE DE STATUTS************ */}
                                        
                        {/* PARTIE DE LA MANIERE A ENVOYER LES FICHIERS */}
                        <div className="form-group mb-6 mt-3">
                            <h5 className='colorRed text-center mb-3'>
                                Copie des statuts à jour
                            </h5>
                            <p className='text-center'>
                                Comment voulez-vous importer votre fichier de copie des statuts à jour?
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
                                    checked={typeDocCopyStatutes==="0"}
                                    onChange={()=>setTypeDocCopyStatutes("0")}
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
                                    checked={typeDocCopyStatutes==="1"}
                                    onChange={()=>setTypeDocCopyStatutes("1")}
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
                        {typeDocCopyStatutes==="0" ? (
                            <>
                                <div className="form-group my-6">
                                    <label
                                        htmlFor="register"
                                    >
                                        Copie des statuts à jour
                                    </label>
                                    <input
                                        className="form-control border mt-3 bg-white"
                                        type="file" 
                                        name="myImage"
                                        id='register'
                                        accept="application/pdf, image/*"
                                        onChange={uploadToClientCopyStatutes}
                                    />
                                </div>
                            </>
                        ) : ("")}
                        {/* FIN IMPORTATION */}
                                        

                        {/* SI L'UTILISATEUR CHOISIT DE PRENDRE LES DOCUMENTS EN PHOTO */}
                        {typeDocCopyStatutes==="1" ? (
                            <>
                                <div className="form-group  ">
                                    <div className='row'>
                                        <div className='col-lg-2 clo-md-2'></div>
                                        <div className='col-lg-8 clo-md-8'>
                                            {statutCopyStatutesPhoto==="0" ? (
                                                <button className="btn btn-primary "
                                                    type='button'  
                                                    disabled={isLoggingIn}
                                                    onClick={()=>setStatutCopyStatutesPhoto("1")}
                                                >
                                                    Déclencher la caméra pour prendre la photo du fichier
                                                </button>
                                            ) : ("")} 
                                        </div>
                                        <div className='col-lg-2 clo-md-2'></div>
                                    </div>


                                    {/* Cette partie s'affciche lorsqu'on clique sur le bouton ci-dessus */}
                                    {statutCopyStatutesPhoto==="1" ? (
                                        <> 
                                            {/* Si on a pas encore pris la photo on affiche la camera */}
                                            <div className='text-center'>
                                                {!imageCopyStatutes ? (
                                                <Webcam
                                                    audio={false}
                                                    height={350}
                                                    ref={webcamRefCopyStatutes}
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
                                                    {!imageCopyStatutes ? (
                                                        <button type='button' onClick={captureCopyStatutes}>Sauvegarder</button>
                                                    ) : ("")}
                                                </div>
                                                <div className='col-lg-2 col-md-2'></div>
                                            </div>
                                                                        

                                            {/* Si on a pris la photo et qu'on veut reprende on affiche on clique sur ce bouton */}
                                            <div className='row mb-3'>
                                                <div className='col-lg-2 col-md-2'></div>
                                                <div className='col-lg-8 col-md-8'>
                                                    {imageCopyStatutes ? (
                                                        <button type='button' onClick={()=>setImageCopyStatutes("")}>Reprendre la photo</button>
                                                    ) : ("")}
                                                </div>
                                                <div className='col-lg-2 col-md-2'></div>
                                            </div>
                                            {/* Fin */}

                                            {/* Pour afficher l'image qui a été prise */}
                                            <div className='row '>
                                                <div className='col-lg-2 col-md-2'></div>
                                                <div className='col-lg-8 col-md-8'>
                                                    {imageCopyStatutes && <img src={imageCopyStatutes} alt="Selfie" />}
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
                                <button className="btn btn-primary " type='submit' disabled={copyStatutesFile||imageCopyStatutes?isLoggingIn:true}   >Ajouter statuts </button>
                            </div> 
                        </div>
                    </form>
                ):("")} 
            </> 
        ):(
            <>
                {/* on verifie si l'utilisateur veut reprendre soit la partie Copie des statuts ou Délégation de pouvoirs */}
                {currentKycEntrepriseStatut==3 || currentKycEntrepriseStatut==4 ? (
                    <>
                        {/* si c'est Copie des statuts on lui affiche ce bouton */}
                        {currentKycEntrepriseStatut==3 ? (

                        <div className='card'>
                            <p className=' bgColorGreen text-center text-white'>Copie des statuts à jour est sauvegardée succès</p>
                            <div className="form-group mb-6 mt-3  text-center">
                                <button className="btn btn-primary " onClick={updateFieldCopyStatutes} >Modifier</button>
                            </div> 
                        </div>
                        // Sinon le bouton disparaît
                        ):("")}
                    </>

                // Sinon le bouton reste s'affiche normalement comme pour les autres partie des documents
                ):(
                    <div className='card'>
                        <p className=' bgColorGreen text-center text-white'>Copie des statuts à jour est sauvegardée succès</p>
                        <div className="form-group mb-6 mt-3  text-center">
                            <button className="btn btn-primary " onClick={updateFieldCopyStatutes} >Modifier</button>
                        </div> 
                    </div>
                )}
            </>
        )}  
        {/* ************FIN COPIE DE STATUTS************ */}


        {/* ************ FORMULAIRE DE DELEGATION DE POUVOIRS************ */}
        {!kycDelegationPowers==1 ? (
            <>
                {kycRegister==1 && kycDfe==1 && kycCopyStatutes==1 && kycDelegationPowers==0 ? (
                    <form className='' onSubmit={updateDelegationPowers}>
                        {/* PARTIE DE LA MANIERE A ENVOYER LES FICHIERS */}
                        <div className="form-group mb-6 mt-3">
                            <h5 className='colorRed text-center mb-3'>
                                Délégation de pouvoirs
                            </h5>
                            <p className='text-center'>
                                Comment voulez-vous importer votre fichier de délégation de pouvoirs?
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
                                    checked={typeDocDelegationPowers==="0"}
                                    onChange={()=>setTypeDocDelegationPowers("0")}
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
                                    checked={typeDocDelegationPowers==="1"}
                                    onChange={()=>setTypeDocDelegationPowers("1")}
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
                        {typeDocDelegationPowers==="0" ? (
                            <>
                                <div className="form-group my-6">
                                    <label
                                        htmlFor="dfe"
                                    >
                                        Document de délégation de pouvoirs
                                    </label>
                                    <input
                                        className="form-control border mt-3 bg-white"
                                        type="file" 
                                        name="myImage"
                                        id='dfe'
                                        accept="application/pdf, image/*"
                                        onChange={uploadToClientDelegationPowers}
                                    />
                                </div>
                            </>
                        ) : ("")}
                        {/* FIN IMPORTATION */}
                                        

                        {/* SI L'UTILISATEUR CHOISIT DE PRENDRE LES DOCUMENTS EN PHOTO */}
                        {typeDocDelegationPowers==="1" ? (
                            <>
                                <div className="form-group  ">
                                    <div className='row'>
                                        <div className='col-lg-2 clo-md-2'></div>
                                        <div className='col-lg-8 clo-md-8'>
                                            {statutDelegationPowersPhoto==="0" ? (
                                                <button className="btn btn-primary "
                                                    type='button'  
                                                    disabled={isLoggingIn}
                                                    onClick={()=>setStatutDelegationPowersPhoto("1")}
                                                >
                                                    Déclencher la caméra pour prendre la photo du fichier
                                                </button>
                                            ) : ("")} 
                                        </div>
                                        <div className='col-lg-2 clo-md-2'></div>
                                    </div>


                                    {/* Cette partie s'affciche lorsqu'on clique sur le bouton ci-dessus */}
                                    {statutDelegationPowersPhoto==="1" ? (
                                        <> 
                                            {/* Si on a pas encore pris la photo on affiche la camera */}
                                            <div className='text-center'>
                                                {!imageDelegationPowers ? (
                                                <Webcam
                                                    audio={false}
                                                    height={350}
                                                    ref={webcamRefDelegationPowers}
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
                                                    {!imageDelegationPowers ? (
                                                        <button type='button' onClick={captureDelegationPowers}>Sauvegarder</button>
                                                    ) : ("")}
                                                    </div>
                                                <div className='col-lg-2 col-md-2'></div>
                                            </div>
                                                                        

                                            {/* Si on a pris la photo et qu'on veut reprende on affiche on clique sur ce bouton */}
                                            <div className='row mb-3'>
                                                <div className='col-lg-2 col-md-2'></div>
                                                <div className='col-lg-8 col-md-8'>
                                                    {imageDelegationPowers ? (
                                                        <button type='button' onClick={()=>setImageDelegationPowers("")}>Reprendre la photo</button>
                                                    ) : ("")}
                                                </div>
                                                <div className='col-lg-2 col-md-2'></div>
                                            </div>
                                            {/* Fin */}

                                            {/* Pour afficher l'image qui a été prise */}
                                            <div className='row '>
                                                <div className='col-lg-2 col-md-2'></div>
                                                    <div className='col-lg-8 col-md-8'>
                                                    {imageDelegationPowers && <img src={imageDelegationPowers} alt="Selfie" />}
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
                                <button className="btn btn-primary " type='submit' disabled={delegationPowersFile||imageDelegationPowers?isLoggingIn:true}  >Ajouter fichier </button>
                            </div> 
                        </div>
                    </form> 
                ):("")} 
            </> 
        ):(
            <>
                {/* on verifie si l'utilisateur veut reprendre soit la partie Copie des statuts ou Délégation de pouvoirs */}
                {currentKycEntrepriseStatut==3 || currentKycEntrepriseStatut==4 ? (
                    <>
                        {/* si c'est Délégation de pouvoirs on lui affiche ce bouton */}
                        {currentKycEntrepriseStatut==4 ? (

                        <div className='card my-3'>
                            <p className=' bgColorGreen text-center text-white'>Délégation de pouvoirs est sauvegardée succès</p>
                            <div className="form-group mb-6 mt-3  text-center">
                                <button className="btn btn-primary " onClick={updateFieldDelegationPowers}  >Modifier</button>
                            </div> 
                        </div>
                        // Sinon le bouton disparaît
                        ):("")}
                    </>

                // Sinon le bouton reste s'affiche normalement comme pour les autres partie des documents
                ):(
                    <div className='card my-3'>
                        <p className=' bgColorGreen text-center text-white'>Délégation de pouvoirs est sauvegardée succès</p>
                        <div className="form-group mb-6 mt-3  text-center">
                            <button className="btn btn-primary " onClick={updateFieldDelegationPowers}  >Modifier</button>
                        </div> 
                    </div>
                )}
            </>
        )}   
        {/* ************FIN DE DELEGATION DE POUVOIRS************ */}
                             
                    


    </>
  );
};

export default CStatusEtDelegation;
