import { useState, useEffect } from 'react';
import { Container, Row, Col, Modal } from "react-bootstrap";
import React from "react";
import axios from 'axios';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { Table } from '@nextui-org/react';



// Pour Magic
import { magic } from "../../../../magic";
import { ethers } from "ethers";
import Loading from "../../../../components/loading";
import Router from "next/router";
import Swal from 'sweetalert2';
import Web3 from "web3";
// FIN

// Importer ABI de E-WARI
import ABI_TOKEN_EWARI from "../../../../components/Contrats/Abi/AbiStablecoin.json";




// MODALS 
// reactstrap components
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    FormGroup,
    Form,
    Input,
    InputGroupAddon,
    InputGroupText,
    InputGroup,
    // Modal,
    // Row,
    // Col,
  } from "reactstrap";

// FIN

const GestionRole = () => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API
    const ADDRESS_CONTRAT_EWARI =process.env.NEXT_PUBLIC_ADDRESS_CONTRAT_EWARI

    // ***********************AUTRES**************************************
    
    const [dataAllRole, setDataAllRole] = useState();
    const [dataAdminAndModerator, setDataAdminAndModerator] = useState();
    const [currentIdRole, setCurrentIdRole] = useState();
    const [currentNameRole, setCurrentNameRole] = useState();

    // States recherche d'un utilisateur
    const [infosOtherUser, setInfosOtherUser] = useState();
    const [emailOtherUser, setEmailOtherUser] = useState();
    
    // ******************************FIN*************************************

    const [currentUser, setCurrentUser] = useState();
    const [magicCurrentAddress, setMagicCurrentAddress] = useState();
    const [provider, setProvider] = useState(null);
    const [isLoggingIn, setIsLoggingIn] = useState(false);


    //***************************************************************** *
        // LES STATES DU STABLECOIN
    // ******************************************************************
    const [contractTokenEwari, setContractTokenEwari] = useState(); //Pour le contrat

    // States des rôles
    const [defaultRole, setDefaultRole] = useState();
    const [addressBcOtherUserRevoke, setAddressBcOtherUserRevoke] = useState();
    // fin

    // ***********************FIN*******************************************




    



    


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
                setMagicCurrentAddress(userAddress)
                //const userBalance = ethers.utils.formatEther(await provider.getBalance(userAddress))
                // FIN

                // *************************************************************************
                    // INTERACTION AVEC LE SMART CONTRAT DE STABLECOIN
                // *************************************************************************

                const contractStablecoin = new ethers.Contract(ADDRESS_CONTRAT_EWARI,ABI_TOKEN_EWARI.abi,signer);
                setContractTokenEwari(contractStablecoin);
                    
                //   recuperation des roles des differentes fonctions du stablecoin
                const defaultRole = await contractStablecoin.DEFAULT_ADMIN_ROLE()
                

                // Le stockage des bytes du rôle default admin dans les states
                setDefaultRole(defaultRole)
                // Fin

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
    //  Fin



    // Modal d'attribution d'un rôle à une adresse
    const [showAttributeRole, setShowAttributeRole] = useState(false);
    const handleCloseAttributeRole = () => setShowAttributeRole(false);
    const handleShowAttributeRole = () => setShowAttributeRole(true);
    // Fin



    // FONCTION D'ATTRIBUTION DE ROLE (grantRole)
    const grantRoleTransaction = async() => {
        setIsLoggingIn(true)
        
        const data ={
            "byteRole":defaultRole,
            "address":infosOtherUser.address,
        }
        try {
            if(magicCurrentAddress){

                const transferResult = await contractTokenEwari.grantRole(data.byteRole, data.address)
                await  transferResult.wait(1)

                    // PARTIE SWITCH ALERT;
                    let timerInterval
                    Swal.fire({
                        title: 'Veuillez patienter svp',
                        html: `<p>L'attribution du rôle est en cours... </p>`,
                        timer: 10000,
                        timerProgressBar: true,
                        didOpen: () => {
                        Swal.showLoading()
                        timerInterval = setInterval(() => {
                        }, 1)
                        },
                        
                        willClose: () => {
                        clearInterval(timerInterval)
                        }
                        
                    }).then((result) => {
                        
                        if (result.dismiss === Swal.DismissReason.timer) {
                            // Appel de la fonction updateProfileId() pour modifier et attribuer un rôle
                            updateProfileId()
                            // Fin
                        }
                        })
              
                // FIN PARTIE SWITCH ALERT

                    
                
            }else{
                console.log("Votre adresse est introuvable")
            }
        } catch (error) {
            console.log("Erreur =>",error)
            setIsLoggingIn(false)
            Swal.fire({
                position: 'top-center',
                icon: 'error',
                title: `Erreur`,
                html:`<p>Une erreur est survenue</p>`,
                showConfirmButton: false,
                timer: 10000
            })
        }
    }
    // FIN 



     // FONCTION DE REVOCATION DE ROLE (revokeRole)
     const revokeRoleTransaction = async() => {
        setIsLoggingIn(true)
        
        const data ={
            "byteRole":defaultRole,
            "address":infosOtherUser.address,
        }

        try {
            if(magicCurrentAddress){

                const transferResult = await contractTokenEwari.revokeRole(data.byteRole, data.address)
                    await  transferResult.wait(1)

                    // PARTIE SWITCH ALERT;
                    let timerInterval 
                    Swal.fire({
                        title: 'Veuillez patienter svp',
                        html: `<p>L'attribution du rôle est en cours... </p>`,
                        timer: 10000,
                        timerProgressBar: true,
                        didOpen: () => {
                        Swal.showLoading()
                        timerInterval = setInterval(() => {
                        }, 1)
                        },
                        
                        willClose: () => {
                        clearInterval(timerInterval)
                        }
                        
                    }).then((result) => {
                        
                        if (result.dismiss === Swal.DismissReason.timer) {
                            // Appel de la fonction updateProfileId() pour modifier et attribuer un rôle
                            updateProfileId()
                            // Fin
                        }
                        })
              
                // FIN PARTIE SWITCH ALERT

                    
                
            }else{
                console.log("Votre adresse est introuvable")
            }
        } catch (error) {
            console.log("Erreur =>",error)
            setIsLoggingIn(false)
            Swal.fire({
                position: 'top-center',
                icon: 'error',
                title: `Erreur`,
                html:`<p>Une erreur est survenue</p>`,
                showConfirmButton: false,
                timer: 10000
            })
        }
    }
    // FIN 


    


    // ************************AUTRES************************************
    // Obtenir un utilisateur en fonction de son email 
    useEffect(async () => {
            const getAllRole = async () => {
                const result = await fetch(`${API_URL}/api/role/find-all-role`, {
                    headers: {
                    'Content-Type': 'application/json',
                    },
                })
                .then((result) => result.json())
                .then((data) => {
                    setDataAllRole(data)
                }) 
            };
            getAllRole();
            // Fin
    }, []);
    // Fin


     // Obtenir un utilisateur en fonction de son email 
     useEffect(async () => {
        const getAdminAndModerator = async () => {
            const result = await fetch(`${API_URL}/api/role/find-all-role-for-admin-and-moderator`, {
                headers: {
                'Content-Type': 'application/json',
                },
            })
            .then((result) => result.json())
            .then((data) => {
                setDataAdminAndModerator(data)
            }) 
        };
        getAdminAndModerator();
        // Fin
    }, []);



    // Fonction de modification de l'id du profil dans la table users
    // Cette fonction est appelée dans la fonction grantRoleTransaction() et revokeRoleTransaction()
    const updateProfileId  = async () => {
        setIsLoggingIn(true);
        /* Vérifier si l'utilisateur a choisi un pays, forme juridique, secteur, employés, type  
        *sinon il reçoit une alerte pour choisir
        */
        
          try {
            const dataa = {
                userId:infosOtherUser?.id,
                profileId:currentIdRole
            }
                       
            const result = await fetch(`${API_URL}/api/role/update-profileId`, {
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
            if (data.message==200) {
              Swal.fire({
                position: 'center',
                icon: 'success',
                html: `<p> Rôle attribué avec succès</p>` ,
                showConfirmButton: false,
                timer: 20000
              })

              // Actualiser après l'affichage 
              setTimeout(() => {
                window.location.reload()
                }, 15000)
                // Fin
            }else{
                setIsLoggingIn(false);
              
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    html: `<p> ${data?.message} </p>` ,
                    showConfirmButton: false,
                    timer: 10000
                  })
            }
            // Fin condition 
        
            } catch {
              setIsLoggingIn(false);
            }
        
    }
    // Fin




    // Obtenir un utilisateur en fonction de son email 
    const searchUserWithEmail = () =>{
        if (emailOtherUser) {
          const getUser = async (_emailOtherUser) => {
          
              const result = await fetch(`${API_URL}/api/user/find-user-by-email?email=${_emailOtherUser}`, {
                  headers: {
                  'Content-Type': 'application/json',
                  },
              })
                  .then((result) => result.json())
                  .then((user) => {
                    setInfosOtherUser(user)
          
                  }) 
          
              };
              
                getUser(emailOtherUser);
            
        }
      }
      // FIN

    // ************************FIN*****************************************





    return (
        <>
        {magicCurrentAddress?( 
            <>
                <div className='' >
                    <div className=' mx-15'>
                        <div className='py-10'>
                            <h1 className='text-center'>Gestion des rôles</h1>
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
                        <div className='cryptocurrency-search-box'>
                            <div className='row'>
                                <div className='col-lg-3 col-md-12'></div>

                                    <div className='col-lg-6 col-md-6'>
                                        <div className='currency-selection'>
                                            <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                                                {!dataAllRole?.length==0 ? (
                                                    
                                                    <div className='col-lg-12 col-md-12 row justify-content-between'>
                                                        <Table
                                                                aria-label="Example table with static content"
                                                                css={{
                                                                    height: "auto",
                                                                    minWidth: "100%",
                                                                }}
                                                            >
                                                            <Table.Header>
                                                                <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Noms des rôles</p></Table.Column>
                                                                <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Actions</p></Table.Column>
                                                            </Table.Header>
                                                            <Table.Body>
                                                                {dataAllRole?.map((data) => (
                                                                    <Table.Row key={data?.id}>
                                                                        <Table.Cell ><p className=" py-0 ">{data?.libelle}</p></Table.Cell>
                                                                        <Table.Cell>
                                                                            <div className="d-flex py-0 ">
                                                                                <p className="text-center">
                                                                                
                                                                                    <button onClick={()=>setCurrentIdRole(data?.id)}>
                                                                                        <p onClick={()=>setCurrentNameRole(data?.libelle)}>
                                                                                            <Icon onClick={handleShowAttributeRole} icon="bx:message-square-add"  width="30"/> 
                                                                                        </p>
                                                                                    </button>
                                                                                </p>
                                                                            </div>
                                                                        </Table.Cell>
                                                                    </Table.Row >
                                                                ))}
                                                            </Table.Body>
                                                        </Table>
                                                    </div>
                                                ) : (
                                                    <div className="text-center mt-5">
                                                        Aucun rôle disponible
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                <div className='col-lg-3 col-md-12'></div>
                            </div>
                        </div>
                </div>

                {/* AFFICHAGE DES MODERATEURS et ADMINISTRATEURS */}
                {!dataAdminAndModerator?.length ==0 ? (
                    <>
                        <div className=' mx-15'>
                            <div className='py-10'>
                                <h3 className='text-center'>Les utilisateurs et leurs rôles</h3>
                            </div>
                        </div>
                        <div className='cryptocurrency-search-box'>
                            <div className='row'>
                                <div className='col-lg-1 col-md-12'></div>
                                    <div className='col-lg-10 col-md-10'>
                                        <div className='currency-selection'>
                                            <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                                                <div className='col-lg-12 col-md-12 row justify-content-between'>
                                                    <Table
                                                            aria-label="Example table with static content"
                                                            cs={{
                                                                height: "auto",
                                                                minWidth: "100%",
                                                            }}
                                                        >
                                                        <Table.Header>
                                                            <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Nom</p></Table.Column>
                                                            <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Prenom</p></Table.Column>
                                                            <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Email</p></Table.Column>
                                                            <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Rôle</p></Table.Column>
                                                        </Table.Header>
                                                        <Table.Body>
                                                            {dataAdminAndModerator?.map((data)=>(
                                                                <Table.Row key={data?.id}>
                                                                    <Table.Cell ><p className=" py-0 ">{data?.firstName} {data?.entreprise}</p></Table.Cell>
                                                                    <Table.Cell ><p className=" py-0 ">{data?.lastName} {data?.entreprise}</p></Table.Cell>
                                                                    <Table.Cell ><p className=" py-0 ">{data?.email}</p></Table.Cell>
                                                                    <Table.Cell >
                                                                        {data?.profileId==1 ? (
                                                                            <p className=" py-0">public</p>
                                                                            ) : data?.profileId==2? (
                                                                            <p className=" py-0">Admin</p>
                                                                            ) : data?.profileId==3 ? (
                                                                            <p className=" py-0">Moderator</p>
                                                                            ):("")
                                                                        }
                                                                        </Table.Cell>
                                                                </Table.Row >
                                                            ))}
                                                        </Table.Body>
                                                    </Table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                <div className='col-lg-1 col-md-12'></div>
                            </div>
                        </div>
                        </>
                ) : ("")}
                {/* FIN */}
                
            </>
        ):(
            <span className="text-center bg-default-2 btn-bottom-text  d-block gr-text-5 text-blackish-blue gr-opacity-10 my-35">
                <Loading/>
            </span>
        )}





        {/* ********************************************************************************** */}
            {/* MODAL DE LA REVOCATION D'UN ROLE*/}
        {/* ********************************************************************************** */}
        <Modal show={showDelete} className="mt-15" onHide={handleDeleteClose}>
            <Modal.Header closeButton className='bgColorRed'>
            <Modal.Title className="text-white">Révocation du rôle <b>{currentNameRole}</b></Modal.Title>
            </Modal.Header>
                <Form role="form">
                    <Modal.Body>
                        <div className="input-group flex-nowrap">
                            <div className='col-lg-12 col-md-12 row justify-content-between'>
                        
                                <div className='input-group-alternative my-3 '>
                                    <label className="mx-2 mb-3" htmlFor='address'>
                                        Adresse blockchain
                                    </label>
                                    <input
                                        type='text'
                                        name='address'
                                        id='address'
                                        required='required'
                                        placeholder="Adresse blockchain"
                                        className="form-control"
                                        defaultValue={addressBcOtherUserRevoke} 
                                        onChange={(event)=>setAddressBcOtherUserRevoke(event.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button className="text-white" color="danger" onClick={handleCloseAttributeRole}>
                        Fermer
                    </Button>
                    <Button  type='submit' onClick={revokeRoleTransaction} color="primary" disabled={isLoggingIn}>
                        Révoquer
                    </Button>
                    </Modal.Footer>
                </Form>
        </Modal>
        {/* *****************************************FIN****************************************** */}



        {/* ********************************************************************************** */}
            {/* MODAL D'Attribution du rôle '*/}
        {/* ********************************************************************************** */}
        <Modal show={showAttributeRole} className="mt-15" onHide={handleCloseAttributeRole}>
            <Modal.Header closeButton id="bgcolor">
                <Modal.Title className="" >Attribution du rôle <b>{currentNameRole}</b></Modal.Title>                
            </Modal.Header>
            {/* <Form role="form"> */}
                <Modal.Body>
                    <div className="input-group flex-nowrap">
                        <div className='col-lg-12 col-md-12 row justify-content-between'>
                        
                        <form onSubmit={handleSubmit}>
                        <div className="form-group my-6 ">
                          <label
                            htmlFor="montant"
                            className="gr-text-8 fw-bold text-blackish-blue"
                          >
                            Adresse email du recepteur <sup className="text-red">*</sup>

                          </label>
                          <div className="input-group flex-nowrap">
                          <input
                              className="form-control gr-text-11 border mt-3 bg-white"
                              type="email"
                              id="email"
                              placeholder="Adresse email du recepteur"
                              required
                              defaultValue={emailOtherUser} 
                              onChange={(event)=>setEmailOtherUser(event.target.value)}
                              
                          />
                          <span className="input-group-text gr-text-11  mt-3" id="addon-wrapping">
                            <button onClick={searchUserWithEmail} disabled={isLoggingIn}><Icon  icon="bx:search-alt"  />
                            </button>
                          </span>

                          </div>
                        </div>
                        {infosOtherUser?.entreprise ? (
                          <p className="gr-text-8 " id="addon-wrapping">
                            Nom de l'entreprise : {infosOtherUser?.entreprise}
                          </p>
                        ) : (infosOtherUser?.firstName && infosOtherUser?.lastName ?
                         (<div>
                            <p className="gr-text-8 " id="addon-wrapping">
                              Nom : {infosOtherUser?.firstName}
                            </p>
                            <p className="gr-text-8 " id="addon-wrapping">
                              Prenom : {infosOtherUser?.lastName}
                            </p>
                         </div>) : <p className="gr-text-8 colorRed" id="addon-wrapping">{infosOtherUser?.message}</p>)}
                      </form>

                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="text-white" color="danger" onClick={handleCloseAttributeRole}>
                        Fermer
                    </Button>
                    {infosOtherUser?.entreprise || infosOtherUser?.firstName || infosOtherUser?.lastName?(
                        <>
                            {/* On vérifie si l'id du profile correspond à l'id 1 du role public on exécute revokeRoleTransaction */}
                            {currentIdRole==1 ? (
                                <Button  type='button' onClick={revokeRoleTransaction} color="success" disabled={isLoggingIn}>
                                    Attribuer public
                                </Button>
                            ) : (
                                // sinon on exécute grantRoleTransaction 
                                <Button  type='button' onClick={grantRoleTransaction} color="success" disabled={isLoggingIn}>
                                    Attribuer
                                </Button>
                            )}
                        </>
                    ):("")}
                </Modal.Footer>
            {/* </Form> */}
        </Modal>
            {/* *****************************************FIN****************************************** */}
            







        </>
    );
};

export default GestionRole;
