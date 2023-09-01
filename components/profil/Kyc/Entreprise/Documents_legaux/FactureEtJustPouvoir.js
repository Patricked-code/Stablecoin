import { useState, useEffect, useRef } from 'react';
import React from "react";
import Link from 'next/link';
import Webcam from 'react-webcam'// Pour camera photo
import Router from "next/router";
import Swal from 'sweetalert2';


const CFactureEtJustPouvoirs = ({kycDocumentId, kycRegister, kycDfe, kycCopyStatutes, kycDelegationPowers, kycPvAppointment, kycMapLocation, kycFacture, kycProofPower}) => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API

    const [isLoggingIn, setIsLoggingIn] = useState(false); 
    const [currentKycEntrepriseStatut, setCurrentKycEntrepriseStatut] = useState();
    // State pour uploader les fichiers
    const [createObjectURL, setCreateObjectURL] = useState(null);

// ************************************************************************************
    // STATES DE FACTURE
// ************************************************************************************

    const [statutFacturePhoto, setStatutFacturePhoto] = React.useState("0");
    const [typeDocFacture, setTypeDocFacture] = React.useState();

    // State Pour Camera photo
    const webcamRefFacture = useRef(null)
    const [imageFacture, setImageFacture] = useState(null)
    // Fin

    // State de l'envoie des fichiers dans la base de donnée
    const [factureFile, setFactureFile] = useState(null)

// ********************FIN STATES DE FACTURE*************************



// ************************************************************************************
    // STATES DU JUSTIFICATIF DE POUVOIRS
// ************************************************************************************

const [statutProofPowerPhoto, setStatutProofPowerPhoto] = React.useState("0");
const [typeDocProofPower, setTypeDocProofPower] = React.useState();

// State Pour Camera photo
const webcamRefProofPower = useRef(null)
const [imageProofPower, setImageProofPower] = useState(null)
// Fin

// State de l'envoie des fichiers dans la base de donnée
const [proofPowerFile, setProofPowerFile] = useState(null)

// ********************FIN STATES DU JUSTIFICATIF DE POUVOIRS*************************



// ************************************************************************************
    // FONCTIONS DE FACTURE
// ************************************************************************************

    // Fonction pour faire la capture de facture
    const captureFacture = () => {
        const image = webcamRefFacture.current.getScreenshot()
        setImageFacture(image)
    }
    // Fin


    // FONCTION POUR UPLOADER LE FICHIER DE LA FACTURE
    const uploadToClientFacture = (event) => {
        if (event.target.files && event.target.files[0]) {
        const i = event.target.files[0];
        setFactureFile(i);
        setCreateObjectURL(URL.createObjectURL(i));
        }
    };
    // FIN


    // FONCTION D'AJOUT (MODIFICATION) DE FACTURE
    const updateFacture= async (event) => {
        event.preventDefault();
        setIsLoggingIn(true)
        const token = localStorage.getItem('tokenEnCours')

        const body = new FormData();
        
        body.append("factureFile", typeDocFacture==="0"?factureFile:null);
        body.append("facturePhoto", typeDocFacture==="1"?imageFacture:null);
        
        const result = await fetch(`${API_URL}/api/kyc/business/update-kyc-facture`, {
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

    // FONCTION POUR MODIFIER LE CHAMP facture
    const updateFieldFacture= async (event) => {
        event.preventDefault();
        const token = localStorage.getItem('tokenEnCours')

        const result = await fetch(`${API_URL}/api/kyc/business/update-kyc-field-facture-by-kycId/${kycDocumentId}`, {
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

    // ******************* FIN FONCTIONS DE FACTURE*************



    // ************************************************************************************
        // FONCTIONS DU JUSTIFICATIF DE POUVOIRS
    // ************************************************************************************

    // Fonction pour faire la capture du justificatif de pouvoirs
    const captureProofPower = () => {
        const image = webcamRefProofPower.current.getScreenshot()
        setImageProofPower(image)
    }
    // Fin


// FONCTION POUR UPLOADER LE FICHIER DU JUSTIFICATIF DE POUVOIRS
    const uploadToClientProofPower = (event) => {
        if (event.target.files && event.target.files[0]) {
        const i = event.target.files[0];
        setProofPowerFile(i);
        setCreateObjectURL(URL.createObjectURL(i));
        }
    };
    // FIN


    // FONCTION D'AJOUT(MODIFICATION) DU FICHIER DU JUSTIFICATIF DE POUVOIRS
    const updateProofPower= async (event) => {
        event.preventDefault();
        setIsLoggingIn(true)
        const token = localStorage.getItem('tokenEnCours')

        const body = new FormData();
        
        body.append("proofPowerFile", typeDocProofPower==="0"?proofPowerFile:null);
        body.append("proofPowerPhoto", typeDocProofPower==="1"?imageProofPower:null);
        
        const result = await fetch(`${API_URL}/api/kyc/business/update-kyc-proof-power`, {
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

    // FONCTION POUR MODIFIER LE CHAMP proofPower
    const updateFieldProofPower= async (event) => {
        event.preventDefault();
        const token = localStorage.getItem('tokenEnCours')

        const result = await fetch(`${API_URL}/api/kyc/business/update-kyc-field-proofPower-by-kycId/${kycDocumentId}`, {
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

    // ******************* FIN FONCTIONS DU JUSTIFICATIF DE POUVOIRS*************



    //localStorage pour récupérer une valeur en cliquant sur un bouton Recompleter qui indique qu'on veut modifier une partie Kyc 
    useEffect(() => {
        const kycStatut = localStorage.getItem('currentKycEntrepriseStatut')  
        setCurrentKycEntrepriseStatut(kycStatut)
    }, [currentKycEntrepriseStatut]);


  return (
    <>
        {/* ***************FORMULAIRE DE FACTURE************ */}
        {!kycFacture==1? ( 
            <>
                {kycRegister==1 && kycDfe==1 && kycCopyStatutes==1 && kycDelegationPowers==1 && kycPvAppointment==1 && kycMapLocation==1 && kycFacture==0 ? (
                    <form className='' onSubmit={updateFacture}>
                        {/* PARTIE DE LA MANIERE A ENVOYER LES FICHIERS */}
                        <div className="form-group mb-6 mt-3">
                            <h5 className='colorRed text-center mb-3'>
                                Facture eau / électricité ou contrat de bail
                            </h5>
                            <p className='text-center'>
                                Comment voulez-vous importer votre fichier de facture ?
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
                                    checked={typeDocFacture==="0"}
                                    onChange={()=>setTypeDocFacture("0")}
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
                                    checked={typeDocFacture==="1"}
                                    onChange={()=>setTypeDocFacture("1")}
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
                        {typeDocFacture==="0" ? (
                            <>
                                <div className="form-group my-6">
                                    <label
                                        htmlFor="register"
                                    >
                                        Fichier de la facture
                                    </label>
                                    <input
                                        className="form-control border mt-3 bg-white"
                                        type="file" 
                                        name="myImage"
                                        id='register'
                                        accept="application/pdf, image/*"
                                        onChange={uploadToClientFacture}
                                    />
                                </div>
                            </>
                        ) : ("")}
                        {/* FIN IMPORTATION */}
                                        

                        {/* SI L'UTILISATEUR CHOISIT DE PRENDRE LES DOCUMENTS EN PHOTO */}
                        {typeDocFacture==="1" ? (
                            <>
                                <div className="form-group  ">
                                    <div className='row'>
                                        <div className='col-lg-2 clo-md-2'></div>
                                        <div className='col-lg-8 clo-md-8'>
                                            {statutFacturePhoto==="0" ? (
                                                <button className="btn btn-primary "
                                                    type='button'  
                                                    disabled={isLoggingIn}
                                                    onClick={()=>setStatutFacturePhoto("1")}
                                                >
                                                    Déclencher la caméra pour prendre la photo du fichier
                                                </button>
                                            ) : ("")} 
                                        </div>
                                        <div className='col-lg-2 clo-md-2'></div>
                                    </div>


                                    {/* Cette partie s'affciche lorsqu'on clique sur le bouton ci-dessus */}
                                    {statutFacturePhoto==="1" ? (
                                        <> 
                                            {/* Si on a pas encore pris la photo on affiche la camera */}
                                            <div className='text-center'>
                                                {!imageFacture ? (
                                                <Webcam
                                                    audio={false}
                                                    height={350}
                                                    ref={webcamRefFacture}
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
                                                    {!imageFacture ? (
                                                        <button type='button' onClick={captureFacture}>Sauvegarder</button>
                                                    ) : ("")}
                                                </div>
                                                <div className='col-lg-2 col-md-2'></div>
                                            </div>
                                                                        

                                            {/* Si on a pris la photo et qu'on veut reprende on affiche on clique sur ce bouton */}
                                            <div className='row mb-3'>
                                                <div className='col-lg-2 col-md-2'></div>
                                                <div className='col-lg-8 col-md-8'>
                                                    {imageFacture ? (
                                                        <button type='button' onClick={()=>setImageFacture("")}>Reprendre la photo</button>
                                                    ) : ("")}
                                                </div>
                                                <div className='col-lg-2 col-md-2'></div>
                                            </div>
                                            {/* Fin */}

                                            {/* Pour afficher l'image qui a été prise */}
                                            <div className='row '>
                                                <div className='col-lg-2 col-md-2'></div>
                                                <div className='col-lg-8 col-md-8'>
                                                    {imageFacture && <img src={imageFacture} alt="Selfie" />}
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
                                <button className="btn btn-primary " type='submit' disabled={factureFile||imageFacture?isLoggingIn:true}  >Ajouter facture </button>
                            </div> 
                        </div>
                    </form> 
                ):("")} 
            </>
        ):(
            <>
                <div className='card my-3'>
                    <p className=' bgColorGreen text-center text-white'> Facture eau / électricité ou contrat de bail est sauvegardée succès</p>
                    <div className="form-group mb-6 mt-3  text-center">
                        <button className="btn btn-primary " onClick={updateFieldFacture}  >Modifier</button>
                    </div> 
                </div>
            </>
        )} 
        {/* ************FIN FORMULAIRE DE FACTURE************ */}


        {/* ************ FORMULAIRE DU JUSTIFICATIF DE POUVOIRS************ */}
        {!kycProofPower==1 ?(
            <>
                {kycRegister==1 && kycDfe==1 && kycCopyStatutes==1 && kycDelegationPowers==1 && kycPvAppointment==1 && kycMapLocation==1 && kycFacture==1 && kycProofPower==0 ? (
                    <form className='' onSubmit={updateProofPower}>
                        {/* PARTIE DE LA MANIERE A ENVOYER LES FICHIERS */}
                        <div className="form-group mb-6 mt-3">
                            <h5 className='colorRed text-center mb-3'>
                                La copie du justificatif de pouvoir conféré au signataire sur le compte par le représentant légal
                            </h5>
                            <p className='text-center'>
                                Comment voulez-vous importer votre fichier du justificatif de pouvoir ?
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
                                    checked={typeDocProofPower==="0"}
                                    onChange={()=>setTypeDocProofPower("0")}
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
                                    checked={typeDocProofPower==="1"}
                                    onChange={()=>setTypeDocProofPower("1")}
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
                        {typeDocProofPower==="0" ? (
                            <>
                                <div className="form-group my-6">
                                    <label
                                        htmlFor="dfe"
                                    >
                                        Document du justificatif de pouvoir
                                    </label>
                                    <input
                                        className="form-control border mt-3 bg-white"
                                        type="file" 
                                        name="myImage"
                                        id='dfe'
                                        accept="application/pdf, image/*"
                                        onChange={uploadToClientProofPower}
                                    />
                                </div>
                            </>
                        ) : ("")}
                        {/* FIN IMPORTATION */}
                                        

                        {/* SI L'UTILISATEUR CHOISIT DE PRENDRE LES DOCUMENTS EN PHOTO */}
                        {typeDocProofPower==="1" ? (
                            <>
                                <div className="form-group  ">
                                    <div className='row'>
                                        <div className='col-lg-2 clo-md-2'></div>
                                        <div className='col-lg-8 clo-md-8'>
                                            {statutProofPowerPhoto==="0" ? (
                                                <button className="btn btn-primary "
                                                    type='button'  
                                                    disabled={isLoggingIn}
                                                    onClick={()=>setStatutProofPowerPhoto("1")}
                                                >
                                                    Déclencher la caméra pour prendre la photo du fichier
                                                </button>
                                            ) : ("")} 
                                        </div>
                                        <div className='col-lg-2 clo-md-2'></div>
                                    </div>


                                    {/* Cette partie s'affciche lorsqu'on clique sur le bouton ci-dessus */}
                                    {statutProofPowerPhoto==="1" ? (
                                        <> 
                                            {/* Si on a pas encore pris la photo on affiche la camera */}
                                            <div className='text-center'>
                                                {!imageProofPower ? (
                                                <Webcam
                                                    audio={false}
                                                    height={350}
                                                    ref={webcamRefProofPower}
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
                                                    {!imageProofPower ? (
                                                        <button type='button' onClick={captureProofPower}>Sauvegarder</button>
                                                    ) : ("")}
                                                    </div>
                                                <div className='col-lg-2 col-md-2'></div>
                                            </div>
                                                                        

                                            {/* Si on a pris la photo et qu'on veut reprende on affiche on clique sur ce bouton */}
                                            <div className='row mb-3'>
                                                <div className='col-lg-2 col-md-2'></div>
                                                <div className='col-lg-8 col-md-8'>
                                                    {imageProofPower ? (
                                                        <button type='button' onClick={()=>setImageProofPower("")}>Reprendre la photo</button>
                                                    ) : ("")}
                                                </div>
                                                <div className='col-lg-2 col-md-2'></div>
                                            </div>
                                            {/* Fin */}

                                            {/* Pour afficher l'image qui a été prise */}
                                            <div className='row '>
                                                <div className='col-lg-2 col-md-2'></div>
                                                    <div className='col-lg-8 col-md-8'>
                                                    {imageProofPower && <img src={imageProofPower} alt="Selfie" />}
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
                                <button className="btn btn-primary " type='submit' disabled={proofPowerFile||imageProofPower?isLoggingIn:true}  >Ajouter fichier </button>
                            </div> 
                        </div>
                    </form>  
                ):("")} 
            </>
        ):(
            <>
                <div className='card my-3'>
                    <p className=' bgColorGreen text-center text-white'> La copie du justificatif de pouvoir conféré au signataire sur le compte par le représentant légal est sauvegardée succès</p>
                    <div className="form-group mb-6 mt-3  text-center">
                        <button className="btn btn-primary " onClick={updateFieldProofPower}  >Modifier</button>
                    </div> 
                </div>
            </>
        )}
        {/* ************FIN FORMULAIRE DU JUSTIFICATIF DE POUVOIRS************ */}
                             
    </>
  );
};

export default CFactureEtJustPouvoirs;
