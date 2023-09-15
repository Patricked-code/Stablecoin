import { useState, useEffect, useRef } from 'react';
import React from "react";
import Link from 'next/link';
import Webcam from 'react-webcam'// Pour camera photo
import Router from "next/router";
import Swal from 'sweetalert2';
import moment from 'moment';



const CDocumentsIdentites = ({kycDocumentId, kycRegister, kycDfe, kycCopyStatutes, kycDelegationPowers, kycPvAppointment, kycMapLocation, kycFacture, kycProofPower, kycIdentity}) => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API

    const [isLoggingIn, setIsLoggingIn] = useState(false); 
    const [currentKycEntrepriseStatut, setCurrentKycEntrepriseStatut] = useState();
    // State pour uploader les fichiers
    const [createObjectURL, setCreateObjectURL] = useState(null);

    // ********************************************************************
        // STATES DE LA FACTURE
    // **********************************************************************
    const [frontIdentity, setFrontIdentity ] = useState();
    const [backIdentity, setBackIdentity ] = useState();
    const [expirationDate, setExpirationDate ] = useState();
    
    // STATES POUR PRENDRE PHOTO WEBCAMP (IDENTITE)
    const [statutDocIdentite, setStatutDocIdentite] = React.useState();
    // const [importerIdentite, setImporterIdentite] = React.useState();
    const [statutRecto, setStatutRecto] = React.useState("0");
    const [statutVerso, setStatutVerso] = React.useState("0");
    const webcamRefRecto = useRef(null)
    const webcamRefVerso = useRef(null)
    const [imageRecto, setImageRecto] = useState(null)
    const [imageVerso, setImageVerso] = useState(null)
    // FIN

    // LES FONCTIONS POUR PRENDRE PHOTO (IDENTITE)
    // Fonction pour prendre photo du Recto
    const captureRecto = () => {
        const image = webcamRefRecto.current.getScreenshot()
        setImageRecto(image)
    }
    // Fin

    // Fonction pour prendre photo du verso
    const captureVerso = () => {
        const image = webcamRefVerso.current.getScreenshot()
        setImageVerso(image)
    }
    // Fin
    // FIN



    // Les fichiers de justificatif d'identité du representant
    const uploadToClientIdentityFront = (event) => {
        if (event.target.files && event.target.files[0]) {
        const i = event.target.files[0];

        setFrontIdentity(i);
        setCreateObjectURL(URL.createObjectURL(i));
        }
    };


    const uploadToClientIdentityBack = (event) => {
        if (event.target.files && event.target.files[0]) {
        const i = event.target.files[0];

        setBackIdentity(i);
        setCreateObjectURL(URL.createObjectURL(i));
        }
    };
    // Fin
    // ******************FIN STATES FACTURE*************************************


    // ************************************************************************************
        // FONCTIONS DE DOCUMENT DE LA PIECE D'IDENTITE
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

    const currentDate = new Date();//definir la date actuelle

    // FONCTION D'AJOUT(MODIFICATION) DU FICHIER DU JUSTIFICATIF DE POUVOIRS
    const updateDocumentIdentity= async (event) => {
        event.preventDefault();
        setIsLoggingIn(true)
        const token = localStorage.getItem('tokenEnCours')

        const body = new FormData();
        body.append("expirationDate", expirationDate);
        body.append("frontIdentityFile", statutDocIdentite==="0"?frontIdentity:"");
        body.append("backIdentityFile", statutDocIdentite==="0"?backIdentity:"");
        body.append("frontIdentityPhoto", statutDocIdentite==="1"?imageRecto:"");
        body.append("backIdentityPhoto", statutDocIdentite==="1"?imageVerso:"");
        
        // Si la date d'expiration est supérieure à la date du jour
        if ( expirationDate > formatDate(currentDate)) {
            const result = await fetch(`${API_URL}/api/kyc/business/update-kyc-documents-identity`, {
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
        // Sinon si la date est inférieure
        }else{
            setIsLoggingIn(false);
            Swal.fire({
                position: 'center',
                icon: 'error',
                html: `<p> Désolé la date d'expiration doit être supérieure à la date du jour. </p>` ,
                showConfirmButton: false,
                timer: 10000
            })
        }
    }
    // FIN

     // FONCTION POUR MODIFIER LE CHAMP identity
     const updateFieldIdentity= async (event) => {
        event.preventDefault();
        const token = localStorage.getItem('tokenEnCours')

        const result = await fetch(`${API_URL}/api/kyc/business/update-kyc-field-identity-by-kycId/${kycDocumentId}`, {
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

    // ******************* FIN FONCTIONS DE DOCUMENT DE LA PIECE D'IDENTITE*************


    // ***************************************************************************
        // FONCTION POUR TERMINER LE KYC
    // ********************************************************************************
    const completeKyc = () => {
        Swal.fire({
            position: 'center',
            icon: 'success',
            html: `<p> Félicitations ! Votre KYC a été soumis avec succès pour traitement. Veuillez patienter pour recevoir les résultats.  </p>` ,
            showConfirmButton: false,
            timer: 10000
        })
        setTimeout(() => {
            window.location.reload()

        }, 10000)
        
        Router.push("/profil"); 

    }

    // FONCTION POUR FORMATER LA DATE
    const formatDate = (_updatedAt) =>{
        const maDate = moment(_updatedAt).format('YYYY-MM-DD');
        return  maDate
    }
    //  FIN

    //localStorage pour récupérer une valeur en cliquant sur un bouton Recompleter qui indique qu'on veut modifier une partie Kyc 
    useEffect(() => {
        const kycStatut = localStorage.getItem('currentKycEntrepriseStatut')  
        setCurrentKycEntrepriseStatut(kycStatut)
    }, [currentKycEntrepriseStatut]);


  return (
    <>
        {/* ***************FORMULAIRE DE FACTURE************ */}
        {!kycIdentity==1 ?(
            <>
                {kycRegister==1 && kycDfe==1 && kycCopyStatutes==1 && kycDelegationPowers==1 && kycPvAppointment==1 && kycMapLocation==1 && kycFacture==1 && kycProofPower==1 && kycIdentity==0? (
                    <form className='' onSubmit={updateDocumentIdentity}>
                        {/* PARTIE DE LA MANIERE A ENVOYER LES FICHIERS */}
                        <div className="form-group mb-6 mt-3">
                            <h5 className='colorRed text-center mb-3'>
                                Copie recto verso de la pièce d’identité du signataire du bulletin de souscription (CNI, Passeport ou carte de séjour en coursde validité)
                            </h5>
                            <p className='text-center'>
                                Comment voulez-vous importer votre fichier de la pièce d’identité du signataire du bulletin de souscription ?
                            </p>
                                        
                            {/* PARTIE DE LA MANIERE A ENVOYER LES FICHIERS */}
                            <div className="form-group mb-6 mt-3">
                                            
                                        
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
                                                    checked={statutDocIdentite==="0"}
                                                    onChange={()=>setStatutDocIdentite("0")}
                                                    />
                                                <p className=" mx-2 mb-0 text-center">
                                                    Importer les fichiers pdf ou image
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
                                                    checked={statutDocIdentite==="1"}
                                                    onChange={()=>setStatutDocIdentite("1")}
                                                    />
                                                <p className=" mx-2 mb-0 text-center">
                                                    Prendre les fichiers en photo
                                                </p>
                                                </label>
                                            </div>
                                            </div>
                                        </div>
                                        {/* FIN */}

                                        
                                        {/* SI L'UTILISATEUR CHOISIT D'IMPORTER LES DOCUMENTS */}
                                        {statutDocIdentite==="0" ? (
                                            <>
                                                <div className="form-group mb-6 mt-3">
                                                    <label
                                                        htmlFor="identityDocNumber"
                                                        className="text-blackish-blue mb-2"
                                                    >
                                                        Date d'expiration du document d’identité 
                                                    </label>
                                                    <div className='form-group'>
                                                        <input
                                                            type='date'
                                                            id='identityDocNumber'
                                                            className='form-control'
                                                            defaultValue={expirationDate} 
                                                            onChange={(event)=>setExpirationDate(event.target.value)}
                                                        />
                                                    </div>
                                                </div >
                                                <div className="form-group my-6">
                                                    <label
                                                        htmlFor="frontIdentity"
                                                    >
                                                        Recto du document d'identité
                                                    </label>
                                                    <input
                                                        className="form-control border mt-3 bg-white"
                                                        type="file" 
                                                        name="myImage"
                                                        id='frontIdentity'
                                                        accept="application/pdf, image/*"
                                                        onChange={uploadToClientIdentityFront}
                                                    />
                                                </div>
                                                <div className="form-group mb-6">
                                                    <label
                                                        htmlFor="backIdentity"
                                                    >
                                                        Verso du document d'identité
                                                    </label>
                                                    <input
                                                        className="form-control  border mt-3"
                                                        type="file" 
                                                        name="myImage"
                                                        id='backIdentity'
                                                        accept="application/pdf, image/*"
                                                        onChange={uploadToClientIdentityBack}
                                                    />
                                                </div>
                                            </>
                                        ) : ("")}
                                        {/* FIN IMPORTATION */}
                                        

                                        {/* SI L'UTILISATEUR CHOISIT DE PRENDRE LES DOCUMENTS EN PHOTO */}
                                        {statutDocIdentite==="1" ? (
                                            <>
                                                <div className="form-group mb-6 mt-3">
                                                    <label
                                                        htmlFor="identityDocNumber"
                                                        className="text-blackish-blue mb-2"
                                                    >
                                                        Date d'expiration du document d’identité 
                                                    </label>
                                                    <div className='form-group'>
                                                        <input
                                                            type='date'
                                                            id='identityDocNumber'
                                                            className='form-control'
                                                            defaultValue={expirationDate} 
                                                            onChange={(event)=>setExpirationDate(event.target.value)}
                                                        />
                                                    </div>
                                                </div >
                                                <div className="form-group  ">
                                                <div className='row '>
                                                    <div className='col-lg-2 col-md-2'></div>
                                                    <div className='col-lg-8 col-md-8'>
                                                        {statutRecto==="0" ? (
                                                            <button className="btn btn-primary "
                                                                type='button'  
                                                                disabled={isLoggingIn}
                                                                onClick={()=>setStatutRecto("1")}
                                                            >
                                                                Déclencher la caméra pour prendre la photo du Recto 
                                                            </button>
                                                        ) : ("")}
                                                    </div>
                                                    <div className='col-lg-2 clo-md-2'></div>
                                                </div>

                                                    {/* Cette partie s'affciche lorsqu'on clique sur le bouton ci-dessus */}
                                                    {/* Recto */}
                                                    {statutRecto==="1" ? (
                                                    <>
                                                    <div className='text-center'>
                                                        <label
                                                            
                                                            htmlFor="picture"
                                                        >
                                                            Recto de justificatif d'identité
                                                        </label>
                                                    </div>

                                                    {/* Si on a pas encore pris la photo on affiche la camera */}
                                                    <div className='text-center'>
                                                        {!imageRecto ? (
                                                        <Webcam
                                                            audio={false}
                                                            height={350}
                                                            ref={webcamRefRecto}
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
                                                            {!imageRecto ? (
                                                                <button type='button' onClick={captureRecto}>Sauvegarder</button>
                                                            ) : ("")}
                                                        </div>
                                                        <div className='col-lg-2 col-md-2'></div>
                                                    </div>
                                                    {/* Fin */}
                                                                

                                                    {/* Si on a pris la photo et qu'on veut reprende on affiche on clique sur ce bouton */}
                                                    <div className='row mb-3'>
                                                        <div className='col-lg-2 col-md-2'></div>
                                                        <div className='col-lg-8 col-md-8'>
                                                            {imageRecto ? (
                                                                <button type='button' onClick={()=>setImageRecto("")}>Reprendre la photo</button>
                                                            ) : ("")}
                                                        </div>
                                                        <div className='col-lg-2 col-md-2'></div>
                                                    </div>
                                                    {/* Fin */}

                                                    {/* Pour afficher l'image qui a été prise        */}
                                                    <div className='row '>
                                                        <div className='col-lg-2 col-md-2'></div>
                                                        <div className='col-lg-8 col-md-8'>
                                                            {imageRecto && <img src={imageRecto} alt="Selfie" />}
                                                        </div>
                                                        <div className='col-lg-2 col-md-2'></div>
                                                    </div>
                                                    {/* Fin*/}
                                                    </>
                                                    ) : ("")}
                                                    {/* Fin Recto */}

                                                    {/* Verso */}
                                                    <div className='row'>
                                                        <div className='col-lg-2 clo-md-2'></div>
                                                        <div className='col-lg-8 clo-md-8'>
                                                            {imageRecto ? (
                                                                statutVerso ==="0"? (

                                                                    <button className="btn btn-primary "
                                                                        type='button'  
                                                                        disabled={isLoggingIn}
                                                                        onClick={()=>setStatutVerso("1")}
                                                                    >
                                                                        Déclencher la caméra pour prendre la photo du verso 
                                                                    </button>
                                                                ) : ("")
                                                            ) : ("")}
                                                        </div>
                                                        <div className='col-lg-2 clo-md-2'></div>
                                                    </div>

                                                    {statutVerso ==="1"? (
                                                        <>
                                                            <br/><br/>
                                                            <div className='text-center'>
                                                                <label
                                                                    className='text-center'
                                                                    htmlFor="picture"
                                                                >
                                                                    Verso de justificatif d'identité
                                                                </label>
                                                            </div>
                                                            {/* Si on a pas encore pris la photo on affiche la camera */}
                                                            <div className='text-center'>
                                                                {!imageVerso ? (
                                                                    <Webcam
                                                                        audio={false}
                                                                        height={350}
                                                                        ref={webcamRefVerso}
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
                                                                    {!imageVerso  ? (
                                                                        <button type='button' onClick={captureVerso}>Sauvegarder</button>
                                                                    ) : ("")}
                                                                </div>
                                                                <div className='col-lg-2 col-md-2'></div>
                                                            </div>
                                                            {/* Fin */}
                                                                

                                                            {/* Si on a pris la photo et qu'on veut reprende on affiche on clique sur ce bouton */}
                                                            <div className='row mb-3'>
                                                                <div className='col-lg-2 col-md-2'></div>
                                                                <div className='col-lg-8 col-md-8'>
                                                                    {imageVerso ? (
                                                                        <button type='button' onClick={()=>setImageVerso("")}>Reprendre la photo</button>
                                                                    ) : ("")}
                                                                </div>
                                                                <div className='col-lg-2 col-md-2'></div>
                                                            </div>
                                                            {/* Fin */}

                                                            {/* Pour afficher l'image qui a été prise        */}
                                                            <div className='row '>
                                                                <div className='col-lg-2 col-md-2'></div>
                                                                <div className='col-lg-8 col-md-8'>
                                                                    {imageVerso && <img src={imageVerso} alt="Selfie" />}
                                                                </div>
                                                                <div className='col-lg-2 col-md-2'></div>
                                                            </div>
                                                            {/* Fin*/}
                                                        </>
                                                    ) : ("")}
                                                    {/* Fin verso */}
                                                </div>
                                            </>
                                        ) : ("")}
                                        {/* ****************FIN PRENDRE PHOTO**************** */}

                        </div>
                        {/* FIN */}
                        
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
                                <button className="btn btn-primary " type='submit' disabled={backIdentity || imageVerso?isLoggingIn:true}  >Ajouter fichiers </button>
                            </div> 
                        </div>
                    </form>  
                ):("")} 
            </>
        ):(
            <>
                <div className='card my-3'>
                    <p className=' bgColorGreen text-center text-white'>Copie recto verso de la pièce d’identité du signataire du bulletin de souscription est sauvegardé succès</p>
                    <div className="form-group mb-6 mt-3  text-center">
                        <button className="btn btn-primary " onClick={updateFieldIdentity}>Modifier</button>
                    </div> 
                </div>
            </>
        )} 
        {/* ************FIN FORMULAIRE DE FACTURE************ */}  

        {kycRegister==1 && kycDfe==1 && kycCopyStatutes==1 && kycDelegationPowers==1 && kycPvAppointment==1 && kycMapLocation==1 && kycFacture==1 && kycProofPower==1 && kycIdentity==1? (
            <form className='mt-5'>
                <button className="btn btn-primary " type='button'  onClick={completeKyc}>Terminer le Kyc</button>
            </form>
        ):("")}

    </>
  );
};

export default CDocumentsIdentites;
