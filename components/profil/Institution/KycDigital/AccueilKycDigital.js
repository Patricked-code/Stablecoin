import React,{ useState, useEffect } from 'react';
import { Container, Row, Col, Modal } from "react-bootstrap";
import {Button,Form} from "reactstrap";


// Pour Magic
import { magic } from "../../../../magic";
import { ethers } from "ethers";
import Loading from "../../../../components/loading";
import Router from "next/router";
import { Table } from '@nextui-org/react';
import Link from 'next/link';
import moment from 'moment';
import Swal from 'sweetalert2';



// FIN

const CAccueilKycDigital = () => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API

    const [isLoggingIn, setIsLoggingIn] = useState();
    const [currentUser, setCurrentUser] = useState();
    const [provider, setProvider] = useState(null);
    const [showWallet, setShowWallet] = useState(null);
    
    const [kycRequestInitiate, setKycRequestInitiate] = useState();
    const [kycRequestTreaty, setKycRequestTreaty] = useState();
    const [kycRequestAccept, setKycRequestAccept] = useState();
    const [comment, setComment] = useState();
    const [kycRequestId, setKycRequestId] = useState();



    /**
     * État de contrôle pour afficher ou masquer la modal du formulaire du retour au propriétaire.
     * @type {boolean}
    */
     const [show, setShow] = useState(false);

     /**
      * Fonction pour fermer la modal du formulaire.
      * @function
      * @returns {void}
      */
     const handleClose = () => setShow(false);
 
     /**
      * Fonction pour afficher la modal du formulaire.
      * @function
      * @returns {void}
      */
     const handleShow = () => setShow(true);


    // States de tab
    const [toggleState, setToggleState] = useState(1);
    const toggleTab = (index) => {
        setToggleState(index);
    };
    // Fin

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
              //const userBalance = ethers.utils.formatEther(await provider.getBalance(userAddress))
              // FIN

              // Obtenir l'utilisateur connecté 
              const token = localStorage.getItem('tokenEnCours')

                const getUser = async () => {
                  const result = await fetch(`${API_URL}/api/user/find-user-sign-in`, {
                      headers: {
                      'Content-Type': 'application/json',
                      Authorization:  `Bearer ${token}`,

                      },
                })
                  .then((result) => result.json())
                  .then((user) => {
                    // if (user?.profileId==2 || user?.profileId==3) {
                    //     setCurrentUser(user)
                    // }else{
                    //     Router.push("/profil/"); 
                        
                    // }
                  }) 
              };
              await getUser();
              // Fin
            }
        })();
    }, [provider, magic]);
    //  Fin



    /**
     * Fonction pour faire un retour au propriétaire du KYC.
     *
     * @function
     * @returns {void}
    */
     const returnToOwner = async (e) => {
        e.preventDefault();
        setIsLoggingIn(true);
        
        try {
            
            const dataForm = {
                comment:comment
            }
           
  
            // Obtenir le token en cours
            const token = localStorage.getItem('tokenEnCours');
  
            /**
             * Réponse de la requête KYC.
             * @type {Response}
             */
            const response = await fetch(`${API_URL}/api/kyc/answer-of-institution-kyc/${kycRequestId}`, {
                method: 'PUT',
                body: JSON.stringify(dataForm),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
            });
  
            /**
             * Données de la réponse de la requête KYC.
             * @type {object}
             */
            const data = await response.json();
  
            /* Verifier s'il y a un messsage d'erreur, on l'affiche dans SWAL 
            * sinon on affiche le message de succès
            */
            if (data.message == 200) {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    html: `<p> Votre retour a été envoyé avec succès.</p>`,
                    showConfirmButton: false,
                    timer: 5000
                });
  
                // Actualiser après l'affichage
                setTimeout(() => {
                    window.location.reload();
                }, 7000);
                // Fin
            } else {
                setMessageError(data.message);
                setIsLoggingIn(false);
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    html: `<p> ${messageError} </p>`,
                    showConfirmButton: false,
                    timer: 10000
                });
            }
            // Fin condition
        } catch (error) {
            console.error('Erreur =>', error);
        }
    };


    // Recuperer les donnees de la demande d'accès aux kyc initiée
    
    useEffect(async () => {
        const token = localStorage.getItem('tokenEnCours');
    
    
        const getKycRequestInitiate = async () => {
            const result = await fetch(`${API_URL}/api/kyc/find-all-kyc-request-initiate-for-institution`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
    
            if (!result?.ok) {
                throw new Error(`Failed to fetch data`);
            } else {
                // Vérifier si la réponse n'est pas vide avant de la parser en JSON
                const text = await result.text();
                const data = text ? JSON.parse(text) : null;
    
                setKycRequestInitiate(data)
            }
        };
    
        await getKycRequestInitiate();
    }, []);
    // FIN
    
    // Recuperer les donnees de la demande d'accès aux kyc à traiter
    useEffect(async() => {
        const token = localStorage.getItem('tokenEnCours')
            const getKycRequestTreaty = async () => {
            const result = await fetch(`${API_URL}/api/kyc/find-all-kyc-request-treaty-for-institution`, {
                headers: {
                'Content-Type': 'application/json',
                Authorization:  `Bearer ${token}`,
                },
            })
                .then((result) => result.json())
                .then((data) => {
                    setKycRequestTreaty(data)
                }) 
            };
            await getKycRequestTreaty();
    }, []);
    // FIN

    // Recuperer les donnees de la demande d'accès aux kyc Accepté
    useEffect(async() => {
        const token = localStorage.getItem('tokenEnCours')
            const getKycRequestAccept = async () => {
            const result = await fetch(`${API_URL}/api/kyc/find-all-kyc-request-accept-for-institution`, {
                headers: {
                'Content-Type': 'application/json',
                Authorization:  `Bearer ${token}`,
                },
            })
                .then((result) => result.json())
                .then((data) => {
                    setKycRequestAccept(data)
                }) 
            };
            await getKycRequestAccept();
    }, []);
    // FIN

    // FONCTION POUR FORMATER LA DATE
    const formatDate = (_updatedAt) =>{
        const maDate = moment(_updatedAt).format('DD/MM/YYYY');
        // const maDate = moment(_updatedAt).format('DD/MM/YYYY à HH:mm');
        return  maDate
    }
    //  FIN

    // FONCTION POUR FORMATER LA DATE POUR LES COMPARAISONS
    const formatDateCompared = (_updatedAt) =>{
        const maDate = moment(_updatedAt).format('YYYY/MM/DD');
        // const maDate = moment(_updatedAt).format('DD/MM/YYYY à HH:mm');
        return  maDate
    }
    //  FIN


    /**
     * Effet secondaire qui met à jour la clé 'kycRequestId' dans le stockage local lorsque la valeur de kycRequestId change.
     *
     * @function
     * @name useEffectSetKycRequestId
     * @param {string} kycRequestId - L'identifiant de la demande KYC.
     * @returns {void}
    */
    useEffect(() => {
        localStorage.setItem('kycRequestId', kycRequestId);
    }, [kycRequestId]);

    return (
        <>
            {/* {currentUser?.profileId==2 || currentUser?.profileId==3?( */}

                <>
                    <div className='' >
                        
                        <div className='my-5' >
                            <h3 className='text-center'>Kyc digital </h3>
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


                        <div className='row my-5'>
                            <div className='col-lg-4 col-md-4'></div>
                            <div className='col-lg-4 col-md-4'>
                            <div className='currency-selection text-center'>
                                <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                                <div className='cryptocurrency-slides'>
                                        <div className='single-cryptocurrency-box'>
                                            <div className='d-flex align-items-center'>
                                            <div className='title'>
                                                <h3>Demande d'accès aux kyc</h3>
                                            </div>
                                            </div>
                                            <div className='btn-box'>
                                            <Link href='/profil/institution/kyc-digital/demande-kyc'>
                                                <Button
                                                    block
                                                    color="primary"
                                                    type="button"
                                                >
                                                    Voir plus
                                                </Button>
                                            </Link>
                                            {/* Fin */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            </div>
                            <div className='col-lg-4 col-md-4'></div>
                        </div>

                        <div className='row'>
                            <div className='col-lg-1 col-md-1'></div>

                            <div className='col-lg-10 col-md-10'>
                                
                                
                                        {/* L'entête de tab*/}
                                        {/* <div className='row'> */}
                                            {/* <div className='col-lg-3 col-md-3'></div> */}
                                        <div className="bloc-tabs-utilite ">
                                            
                                            <button
                                                className={toggleState === 1 ? "tabs active-tabs gr-text-8 text-color-opacity" : "tabs gr-text-8 text-color-opacity"}
                                                onClick={() => toggleTab(1)}
                                            >
                                                <span className=''>Kyc demandés</span>
                                            </button>

                                            <button
                                                className={toggleState === 2 ? "tabs active-tabs  gr-text-8 text-color-opacity" : "tabs  gr-text-8 text-color-opacity"}
                                                onClick={() => toggleTab(2)}

                                            >
                                                <span className='colorRed'>Kyc à traiter </span>
                                            </button>

                                            <button
                                                className={toggleState === 3 ? "tabs active-tabs  gr-text-8 text-color-opacity" : "tabs  gr-text-8 text-color-opacity"}
                                                onClick={() => toggleTab(3)}

                                            >
                                                <span className='colorGreen'>Kyc finalisés</span>
                                            </button>
                                        </div>
                                        <div className='col-lg-6 col-md-6'></div>
                                        {/* </div> */}
                                        {/* L'entête de tab */}


                                        {/* Le corps de tab */}
                                        <div className="content-tabs">
                                            {/* Kyc demandés */}
                                            <div
                                                className={toggleState === 1 ? "content  active-content" : "content"}
                                            >
                                                <div className='cryptocurrency-search-box'>
                                                    {!kycRequestInitiate?.length==0 ? (
                                                    <Table
                                                        aria-label="Example table with static content"
                                                        css={{
                                                            height: "auto",
                                                            minWidth: "100%",
                                                        }}
                                                    >
                                                        <Table.Header>
                                                            <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Propriétaire</p></Table.Column>
                                                            <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Date</p></Table.Column>
                                                        </Table.Header>
                                                        <Table.Body>
                                                            {kycRequestInitiate?.map((data, index) => (
                                                                <Table.Row key={index}>                       
                                                                    <Table.Cell ><small className=" py-0 ">{data?.nameOwnerKyc}</small></Table.Cell>
                                                                    <Table.Cell ><small className=" py-0 ">{formatDate(data?.sendingDate)}</small></Table.Cell>
                                                                </Table.Row >
                                                                
                                                                
                                                            ))} 
                                                        </Table.Body>
                                                        {/* <Table.Pagination
                                                            shadow
                                                            noMargin
                                                            align="center"
                                                            rowsPerPage={3}
                                                            onPageChange={(page) => console.log({ page })}
                                                        /> */}
                                                    </Table>
                                                    ): (
                                                        <p className='colorRed'>Aucune demande initiée</p>
                                                    )}
                                                </div>
                                            </div>
                                            {/* Fin Kyc demandés */}

                                            
                                            {/* Kyc à traiter */}
                                            <div
                                                className={toggleState === 2 ? "content  active-content" : "content"}
                                            >
                                                <div className='cryptocurrency-search-box'>
                                                    {!kycRequestAccept?.length==0 ? (
                                                    
                                                        <Table
                                                            aria-label="Example table with static content"
                                                            css={{
                                                                height: "auto",
                                                                minWidth: "100%",
                                                            }}
                                                        >
                                                            <Table.Header>
                                                                <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Propriétaire</p></Table.Column>
                                                                <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Date</p></Table.Column>
                                                                <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Date limite</p></Table.Column>
                                                                <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Actions</p></Table.Column>
                                                            </Table.Header>
                                                            <Table.Body>
                                                                {kycRequestAccept?.map((data, index) => (
                                                                    <Table.Row key={index}>                       
                                                                        <Table.Cell ><small className=" py-0 ">{data?.nameOwnerKyc}</small></Table.Cell>
                                                                        <Table.Cell ><small className=" py-0 ">{formatDate(data?.sendingDate)}</small></Table.Cell>
                                                                        <Table.Cell ><small className=" py-0 ">{data?.deadline?formatDate(data?.deadline):"Aucune"}</small></Table.Cell>
                                                                        <Table.Cell className="row">
                                                                            <div className='d-flex'>
                                                                            
                                                                                <p className=" py-0 " onClick={()=>setKycRequestId(data?.id)}>
                                                                                    {formatDateCompared(data?.deadline) < formatDateCompared(new Date()) ? (
                                                                                        <small className="py-0 btn btn-secondary" disabled>Voir Kyc</small>
                                                                                    ) : (
                                                                                        <Link href="/profil/institution/kyc-digital/show-kyc" className="">
                                                                                            <small className="py-0 btn btn-primary">Voir Kyc</small>
                                                                                        </Link>
                                                                                    )}
                                                                                </p>
                                                                                <p onClick={()=>setKycRequestId(data?.id)}>
                                                                                    <small className=" py-0   btn btn-success" onClick={handleShow}>Retour</small>
                                                                                </p>
                                                                            </div>
                                                                        </Table.Cell>
                                                                    </Table.Row >

                                                                    
                                                                ))} 
                                                            </Table.Body>
                                                            {/* <Table.Pagination
                                                                shadow
                                                                noMargin
                                                                align="center"
                                                                rowsPerPage={3}
                                                                onPageChange={(page) => console.log({ page })}
                                                            /> */}
                                                        </Table>
                                                    ): (
                                                        <p className='colorRed'>Aucune demande à traiter</p>
                                                    )}
                                                </div>
                                            </div>
                                            {/* Fin Kyc à traiter*/}

                                            {/* Kyc finalisés */}
                                            <div
                                                className={toggleState === 3 ? "content  active-content" : "content"}
                                            >
                                                <div className='cryptocurrency-search-box'>
                                                    {!kycRequestTreaty?.length==0 ? (
                                                    
                                                        <Table
                                                            aria-label="Example table with static content"
                                                            css={{
                                                                height: "auto",
                                                                minWidth: "100%",
                                                            }}
                                                        >
                                                            <Table.Header>
                                                                <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Propriétaire</p></Table.Column>
                                                                <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Date</p></Table.Column>
                                                                <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Date limite</p></Table.Column>
                                                                <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Actions</p></Table.Column>
                                                            </Table.Header>
                                                            <Table.Body>
                                                                {kycRequestTreaty?.map((data, index) => (
                                                                    <Table.Row key={index}>                       
                                                                        <Table.Cell ><small className=" py-0 ">{data?.nameOwnerKyc}</small></Table.Cell>
                                                                        <Table.Cell ><small className=" py-0 ">{formatDate(data?.sendingDate)}</small></Table.Cell>
                                                                        <Table.Cell ><small className=" py-0 ">{data?.deadline?formatDate(data?.deadline):"Aucune"}</small></Table.Cell>
                                                                        <Table.Cell className="row">
                                                                            <div className='d-flex'>
                                                                            
                                                                                <p className=" py-0 " onClick={()=>setKycRequestId(data?.id)}>
                                                                                    {formatDateCompared(data?.deadline) < formatDateCompared(new Date()) ? (
                                                                                        <small className="py-0 btn btn-secondary" disabled>Voir Kyc</small>
                                                                                    ) : (
                                                                                        <Link href="/profil/institution/kyc-digital/show-kyc" className="">
                                                                                            <small className="py-0 btn btn-primary">Voir Kyc</small>
                                                                                        </Link>
                                                                                    )}
                                                                                </p>
                                                                            </div>
                                                                        </Table.Cell>
                                                                    </Table.Row >
                                                                    
                                                                ))} 
                                                            </Table.Body>
                                                            {/* <Table.Pagination
                                                                shadow
                                                                noMargin
                                                                align="center"
                                                                rowsPerPage={3}
                                                                onPageChange={(page) => console.log({ page })}
                                                            /> */}
                                                        </Table>
                                                    ): (
                                                        <p className='colorRed'>Aucune demande finalisée</p>
                                                    )}
                                                </div>
                                            </div>
                                            {/* Fin Kyc finalisés*/}
                                        </div>
                                        {/* Fin le corps de tab */}
                               
                            </div>
                            <div className='col-lg-1 col-md-1'></div>
                        </div>
                    </div>
                </>
            {/* ):(
                <span className="text-center bg-default-2 btn-bottom-text  d-block gr-text-5 text-blackish-blue gr-opacity-10 my-35">
                    <Loading/>
                </span>
            )} */}




            {/* ********************************************************************************** */}
                {/* MODAL DU RETOUR DE L'INSTITUTION APRES LE TRAITEMENT DU KYC*/}
            {/* ********************************************************************************** */}
            <Modal show={show} className="mt-15" onHide={handleClose}>
                <Modal.Header closeButton className="bgColorblue">
                    <Modal.Title className="text-white" >Rejet de la demande</Modal.Title>                
                </Modal.Header>
                    <Form>
                        <Modal.Body>
                            <div className="form-group mb-6">
                                <label className="mx-2  mb-2" htmlFor='contenu'>
                                    Veuillez faire un retour au propriétaire du KYC
                                </label>
                                <textarea
                                    className="form-control gr-text-11 border  bg-white"
                                    type="text"
                                    id="contenu"
                                    placeholder="Le contenu ici"
                                    defaultValue={comment} 
                                    onChange={(event)=>setComment(event.target.value)}
                                />
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button className="text-white" color="danger" onClick={handleClose}>
                                Fermer
                            </Button>
                            <Button  onClick={returnToOwner}  color="primary" disabled={isLoggingIn}>
                                Envoyer
                            </Button>
                        </Modal.Footer>
                    </Form>
            </Modal>
            {/* *****************************************FIN****************************************** */}
        </>
        

        
    );
};

export default CAccueilKycDigital;
