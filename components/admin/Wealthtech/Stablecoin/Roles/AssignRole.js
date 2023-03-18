import { useState, useEffect } from 'react';
import { Container, Row, Col, Modal } from "react-bootstrap";
import React from "react";
import axios from 'axios';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { Table } from '@nextui-org/react';



// Pour Magic
import { magic } from "../../../../../magic";
import { ethers } from "ethers";
import Loading from "../../../../../components/loading";
import Router from "next/router";
import Swal from 'sweetalert2';
import Web3 from "web3";
// FIN

// Importer ABI de E-WARI
import ABI_TOKEN_EWARI from "../../../../../components/Contrats/Abi/AbiStablecoin.json";




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

const AssignRole = () => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API
    const ADDRESS_CONTRAT_EWARI =process.env.NEXT_PUBLIC_ADDRESS_CONTRAT_EWARI
    
    const [currentUser, setCurrentUser] = useState();
    const [magicCurrentAddress, setMagicCurrentAddress] = useState();
    const [provider, setProvider] = useState(null);
    const [isLoggingIn, setIsLoggingIn] = useState(false);


    //***************************************************************** *
        // LES STATES DU STABLECOIN
    // ******************************************************************
    const [contractTokenEwari, setContractTokenEwari] = useState();

    // States des rôles
    const [defaultRole, setDefaultRole] = useState();
    const [pauseRole, setPauseRole] = useState();
    const [mintRole, setMintRole] = useState();
    const [burnRole, setBurnRole] = useState();
    const [permitRole, setPermitRole] = useState();
    const [transferRole, setTransferRole] = useState();
    const [transferFromRole, setTransferFromRole] = useState();
    const [asyncRole, setAsyncRole] = useState();

    // states de vérification des rôles
    const [verifyDefaultRole, setVerifyDefaultRole] = useState();
    const [verifyPauseRole, setVerifyPauseRole] = useState();
    const [verifyMintRole, setVerifyMintRole] = useState();
    const [verifyBurnRole, setVerifyBurnRole] = useState();
    const [verifyPermitRole, setVerifyPermitRole] = useState();
    const [verifyTransferRole, setVerifyTransferRole] = useState();
    const [verifyTransferFromRole, setVerifyTransferFromRole] = useState();
    const [verifyAsyncRole, setVerifyAsyncRole] = useState();

    

    const [currentRole, setCurrentRole] = useState();
    const [currentNameRole, setCurrentNameRole] = useState();

    const [verifyAddress, setVerifyAddress] = useState();
    const [addressBcOtherUser, setAddressBcOtherUser] = useState();
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
                const pauseRole = await contractStablecoin.PAUSER_ROLE()
                const mintRole = await contractStablecoin.MINTER_ROLE()
                const burnRole = await contractStablecoin.BURNER_ROLE()
                const permitRole = await contractStablecoin.PERMITER_ROLE()
                const transferRole = await contractStablecoin.TRANSFER_ROLE()
                const transferFromRole = await contractStablecoin.TRANSFERFROM_ROLE()
                const asyncRole = await contractStablecoin.ASYNC_ROLE()

                // Le stockage des bytes de rôle dans les states
                setDefaultRole(defaultRole)
                setPauseRole(pauseRole)
                setMintRole(mintRole)
                setBurnRole(burnRole)
                setPermitRole(permitRole)
                setTransferRole(transferRole)
                setTransferFromRole(transferFromRole)
                setAsyncRole(asyncRole)
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


    // Modal pour révoquer un rôle
    const [showDelete, setShowDelete] = useState(false);
    const handleDeleteClose = () => setShowDelete(false);
    const handleDeleteShow = () => setShowDelete(true);

    // Modal d'attribution d'un rôle à une adresse
    const [showAttributeRole, setShowAttributeRole] = useState(false);
    const handleCloseAttributeRole = () => setShowAttributeRole(false);
    const handleShowAttributeRole = () => setShowAttributeRole(true);
    // Fin



    // FONCTION D'ATTRIBUTION DE ROLE (grantRole)
    const grantRoleTransaction = async() => {
        setIsLoggingIn(true)
        
        const data ={
            "byteRole":currentRole,
            "address":addressBcOtherUser,
        }

        try {
            if(magicCurrentAddress){

                await contractTokenEwari.grantRole(data.byteRole, data.address).then((transferResult) => {
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
                        //   Affiche après le rechargement
                        Swal.fire({
                            position: 'top-center',
                            icon: 'success',
                            title: `Succès`,
                            html:`<p> Le rôle a été attribué avec succès. Ci-dessous le numéro de l'ajout: <br/> ${transferResult.hash} </p>`,
                            showConfirmButton: false,
                            timer: 10000
                        })
                        // Fin
                        }
                        })
                })
                // FIN PARTIE SWITCH ALERT

                    // Actualiser après l'affichage 
                    setTimeout(() => {
                    window.location.reload()
                    }, 15000)
                    // Fin
                    error => {
                        console.log(error);
                    }
            }else{
                console.log("Votre adresse est introuvable")
            }
        } catch (error) {
            console.log("Erreur =>",error)
            setIsLoggingIn(false)
        }
    }
    // FIN 



     // FONCTION DE REVOCATION DE ROLE (revokeRole)
     const revokeRoleTransaction = async() => {
        setIsLoggingIn(true)
        
        const data ={
            "byteRole":currentRole,
            "address":addressBcOtherUserRevoke,
        }

        try {
            if(magicCurrentAddress){

                await contractTokenEwari.revokeRole(data.byteRole, data.address).then((transferResult) => {
                    // PARTIE SWITCH ALERT;
                    let timerInterval
                    Swal.fire({
                        title: 'Veuillez patienter svp',
                        html: `<p>La révocation du rôle est en cours... </p>`,
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
                        //   Affiche après le rechargement
                        Swal.fire({
                            position: 'top-center',
                            icon: 'success',
                            title: `Succès`,
                            html:`<p> Le rôle a été révoqué avec succès. Ci-dessous le numéro de l'ajout: <br/> ${transferResult.hash} </p>`,
                            showConfirmButton: false,
                            timer: 10000
                        })
                        // Fin
                        }
                        })
                })
                // FIN PARTIE SWITCH ALERT

                    // Actualiser après l'affichage 
                    setTimeout(() => {
                    window.location.reload()
                    }, 15000)
                    // Fin
                  
               
                
                    error => {
                        console.log(error);
                    }
            }else{
                console.log("Votre adresse est introuvable")
            }
        } catch (error) {
            console.log("Erreur =>",error)
            setIsLoggingIn(false)
        }
    }
    // FIN 


    // FONCTION DE VERIFICATION DES ROLE ATTRIBUES A UNE ADRESSE (hasRole)
    const hasRoleTransaction = async() => {
        setIsLoggingIn(true)

        try {
            if(magicCurrentAddress){

                // Les fonctions blockchain de vérification des rôles attribués à une adresse
                const verifyDefaultRole = await contractTokenEwari.hasRole(defaultRole,verifyAddress)
                const verifyPauseRole = await contractTokenEwari.hasRole(pauseRole,verifyAddress)
                const verifyMintRole = await contractTokenEwari.hasRole(mintRole,verifyAddress)
                const verifyBurnRole = await contractTokenEwari.hasRole(burnRole,verifyAddress)
                const verifyPermitRole = await contractTokenEwari.hasRole(permitRole,verifyAddress)
                const verifyTransferRole = await contractTokenEwari.hasRole(transferRole,verifyAddress)
                const verifyTransferFromRole = await contractTokenEwari.hasRole(transferFromRole,verifyAddress)
                const verifyAsyncRole = await contractTokenEwari.hasRole(asyncRole,verifyAddress)
                
                // Stockage du resultat de verification dans les states suivants
                setVerifyDefaultRole(verifyDefaultRole)
                setVerifyPauseRole(verifyPauseRole)
                setVerifyMintRole(verifyMintRole)
                setVerifyBurnRole(verifyBurnRole)
                setVerifyPermitRole(verifyPermitRole)
                setVerifyTransferRole(verifyTransferRole)
                setVerifyTransferFromRole(verifyTransferFromRole)
                setVerifyAsyncRole(verifyAsyncRole)

                setIsLoggingIn(false)

                
            }else{
                console.log("Votre adresse est introuvable")
            }
        } catch (error) {
            console.log("Erreur =>",error)
            setIsLoggingIn(false)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        }
    // FIN 





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
                                                <form onSubmit={handleSubmit}>
                                                    <div className='col-lg-12 col-md-12 row justify-content-between'>

                                                        <label className="mx-3 mt-3" htmlFor='address'>
                                                            Vérifier le statut de l'adresse blockchain
                                                        </label>
                                                        <div className="input-group flex-nowrap m-3">
                                                            <input
                                                            type='text'
                                                            name='address'
                                                            required='required'
                                                            id='address'
                                                            placeholder="Adresse blockchain"
                                                            className="form-control"
                                                            defaultValue={verifyAddress} 
                                                            onChange={(event)=>setVerifyAddress(event.target.value)}
                                                                
                                                            />
                                                            <span className="input-group-text gr-text-11" id="addon-wrapping">
                                                                <button disabled={isLoggingIn}><Icon onClick={hasRoleTransaction } icon="bx:search-alt"  width="30" />
                                                                {isLoggingIn === true ? (<i className="fas fa-spinner fa-spin fa-2x"></i>) : ("")}
                                                                </button>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </form>
                                                {/* <form className=''> */}
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
                                                                <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Statut</p></Table.Column>
                                                                <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Actions</p></Table.Column>

                                                                
                                                            </Table.Header>
                                                            <Table.Body>
                                                            
                                                                <Table.Row >
                                                                    {/* Default Admin */}
                                                                    <Table.Cell ><p className=" py-0 ">Default Admin</p></Table.Cell>
                                                                    <Table.Cell >
                                                                        <p className=" py-0">
                                                                            {verifyDefaultRole === true ? (<Icon color="green" icon="bx:check-circle" width="30" />) : (verifyDefaultRole === false ? <Icon color="#ff0000" width="30" icon="bx:x-circle" /> : <i className="fas fa-spinner fa-spin fa-2x" width="100"></i>)}
                                                                        </p>
                                                                    </Table.Cell>
                                                                    <Table.Cell>
                                                                        <div className="d-flex py-0 ">
                                                                            <p className="text-center">
                                                                            
                                                                                <button onClick={()=>setCurrentRole(defaultRole)}>
                                                                                    <p onClick={()=>setCurrentNameRole("Default admin")}>
                                                                                        <Icon onClick={handleShowAttributeRole} icon="bx:message-square-add"  width="30"/> 
                                                                                    </p>
                                                                                </button>

                                                                                <button className='mx-3' onClick={()=>setCurrentRole(defaultRole)}>
                                                                                    <p onClick={()=>setCurrentNameRole("Default admin")}>
                                                                                        <Icon onClick={handleDeleteShow} icon="bx:trash" color="#ff0000" width="30"/> 
                                                                                    </p>
                                                                                </button>
                                                                            </p>
                                                                        </div>
                                                                    </Table.Cell>
                                                                </Table.Row >
                                                                
                                                                <Table.Row >
                                                                    {/* Pause */}
                                                                    <Table.Cell ><p className=" py-0 ">Pause</p></Table.Cell>
                                                                    <Table.Cell >
                                                                        <p className=" py-0">
                                                                            {verifyPauseRole === true ? (<Icon color="green" icon="bx:check-circle" width="30" />) : (verifyPauseRole === false ? <Icon color="#ff0000" width="30" icon="bx:x-circle" /> : <i className="fas fa-spinner fa-spin fa-2x" width="100"></i>)}
                                                                        </p>
                                                                    </Table.Cell>
                                                                    <Table.Cell>
                                                                        <div className="d-flex py-0 ">
                                                                            <p className="text-center">
                                                                            
                                                                                <button onClick={()=>setCurrentRole(pauseRole)}>
                                                                                    <p onClick={()=>setCurrentNameRole("Pause")}>
                                                                                        <Icon onClick={handleShowAttributeRole} icon="bx:message-square-add"  width="30"/> 
                                                                                    </p>
                                                                                </button>

                                                                                <button className='mx-3' onClick={()=>setCurrentRole(pauseRole)}>
                                                                                    <p onClick={()=>setCurrentNameRole("Pause")}>
                                                                                        <Icon onClick={handleDeleteShow} icon="bx:trash" color="#ff0000" width="30"/> 
                                                                                    </p>
                                                                                </button>
                                                                            </p>
                                                                        </div>
                                                                    </Table.Cell>
                                                                </Table.Row >
                                                                
                                                                <Table.Row >
                                                                    {/* Mint */}
                                                                    <Table.Cell ><p className=" py-0 ">Mint</p></Table.Cell>
                                                                    <Table.Cell >
                                                                        <p className=" py-0">
                                                                            {verifyMintRole === true ? (<Icon color="green" icon="bx:check-circle" width="30" />) : (verifyMintRole === false ? <Icon color="#ff0000" width="30" icon="bx:x-circle" /> : <i className="fas fa-spinner fa-spin fa-2x" width="100"></i>)}
                                                                        </p>
                                                                    </Table.Cell>

                                                                    <Table.Cell>
                                                                        <div className="d-flex py-0 ">
                                                                            <p className="text-center">
                                                                            
                                                                                <button onClick={()=>setCurrentRole(mintRole)}>
                                                                                    <p onClick={()=>setCurrentNameRole("Mint")}>
                                                                                        <Icon onClick={handleShowAttributeRole} icon="bx:message-square-add"  width="30"/> 
                                                                                    </p>
                                                                                </button>

                                                                                <button className='mx-3' onClick={()=>setCurrentRole(mintRole)}>
                                                                                    <p onClick={()=>setCurrentNameRole("Mint")}>
                                                                                        <Icon onClick={handleDeleteShow} icon="bx:trash" color="#ff0000" width="30"/> 
                                                                                    </p>
                                                                                </button>
                                                                            </p>
                                                                        </div>
                                                                    </Table.Cell>
                                                                </Table.Row >
                                                                
                                                                <Table.Row >
                                                                    {/* burn */}
                                                                    <Table.Cell ><p className=" py-0 ">Burn</p></Table.Cell>
                                                                    <Table.Cell >
                                                                        <p className=" py-0">
                                                                            {verifyBurnRole === true ? (<Icon color="green" icon="bx:check-circle" width="30" />) : (verifyBurnRole === false ? <Icon color="#ff0000" width="30" icon="bx:x-circle" /> : <i className="fas fa-spinner fa-spin fa-2x" width="100"></i>)}
                                                                        </p>
                                                                    </Table.Cell>
                                                                    <Table.Cell>
                                                                        <div className="d-flex py-0 ">
                                                                            <p className="text-center">
                                                                            
                                                                                <button onClick={()=>setCurrentRole(burnRole)}>
                                                                                    <p onClick={()=>setCurrentNameRole("Burn")}>
                                                                                        <Icon onClick={handleShowAttributeRole} icon="bx:message-square-add"  width="30"/> 
                                                                                    </p>
                                                                                </button>

                                                                                <button className='mx-3' onClick={()=>setCurrentRole(burnRole)}>
                                                                                    <p onClick={()=>setCurrentNameRole("Burn")}>
                                                                                        <Icon onClick={handleDeleteShow} icon="bx:trash" color="#ff0000" width="30"/> 
                                                                                    </p>
                                                                                </button>
                                                                            </p>
                                                                        </div>
                                                                    </Table.Cell>
                                                                </Table.Row >
                                                                
                                                                <Table.Row >
                                                                    {/* Permit */}
                                                                    <Table.Cell ><p className=" py-0 ">Permit</p></Table.Cell>
                                                                    <Table.Cell >
                                                                        <p className=" py-0">
                                                                            {verifyPermitRole === true ? (<Icon color="green" icon="bx:check-circle" width="30" />) : (verifyPermitRole === false ? <Icon color="#ff0000" width="30" icon="bx:x-circle" /> : <i className="fas fa-spinner fa-spin fa-2x" width="100"></i>)}
                                                                        </p>
                                                                    </Table.Cell>
                                                                    <Table.Cell>
                                                                        <div className="d-flex py-0 ">
                                                                            <p className="text-center">
                                                                            
                                                                                <button onClick={()=>setCurrentRole(permitRole)}>
                                                                                    <p onClick={()=>setCurrentNameRole("Permit")}>
                                                                                        <Icon onClick={handleShowAttributeRole} icon="bx:message-square-add"  width="30"/> 
                                                                                    </p>
                                                                                </button>

                                                                                <button className='mx-3' onClick={()=>setCurrentRole(permitRole)}>
                                                                                    <p onClick={()=>setCurrentNameRole("Permit")}>
                                                                                        <Icon onClick={handleDeleteShow} icon="bx:trash" color="#ff0000" width="30"/> 
                                                                                    </p>
                                                                                </button>
                                                                            </p>
                                                                        </div>
                                                                    </Table.Cell>
                                                                </Table.Row >
                                                                
                                                                <Table.Row >
                                                                    {/* Transfert */}
                                                                    <Table.Cell ><p className=" py-0 ">Transfer</p></Table.Cell>
                                                                    <Table.Cell >
                                                                        <p className=" py-0">
                                                                            {verifyTransferRole === true ? (<Icon color="green" icon="bx:check-circle" width="30" />) : (verifyTransferRole === false ? <Icon color="#ff0000" width="30" icon="bx:x-circle" /> : <i className="fas fa-spinner fa-spin fa-2x" width="100"></i>)}
                                                                        </p>
                                                                    </Table.Cell>
                                                                    <Table.Cell>
                                                                        <div className="d-flex py-0 ">
                                                                            <p className="text-center">
                                                                            
                                                                                <button onClick={()=>setCurrentRole(transferRole)}>
                                                                                    <p onClick={()=>setCurrentNameRole("Transfer")}>
                                                                                        <Icon onClick={handleShowAttributeRole} icon="bx:message-square-add"  width="30"/> 
                                                                                    </p>
                                                                                </button>

                                                                                <button className='mx-3' onClick={()=>setCurrentRole(transferRole)}>
                                                                                    <p onClick={()=>setCurrentNameRole("Transfer")}>
                                                                                        <Icon onClick={handleDeleteShow} icon="bx:trash" color="#ff0000" width="30"/> 
                                                                                    </p>
                                                                                </button>
                                                                            </p>
                                                                        </div>
                                                                    </Table.Cell>
                                                                </Table.Row >
                                                                
                                                                <Table.Row >
                                                                    {/* transferFrom */}
                                                                    <Table.Cell ><p className=" py-0 ">TransferFrom</p></Table.Cell>
                                                                    <Table.Cell >
                                                                        <p className=" py-0">
                                                                            {verifyTransferFromRole === true ? (<Icon color="green" icon="bx:check-circle" width="30" />) : (verifyTransferFromRole === false ? <Icon color="#ff0000" width="30" icon="bx:x-circle" /> : <i className="fas fa-spinner fa-spin fa-2x" width="100"></i>)}
                                                                        </p>
                                                                    </Table.Cell>
                                                                    <Table.Cell>
                                                                        <div className="d-flex py-0 ">
                                                                            <p className="text-center">
                                                                            
                                                                                <button onClick={()=>setCurrentRole(transferFromRole)}>
                                                                                    <p onClick={()=>setCurrentNameRole("TransferFrom")}>
                                                                                        <Icon onClick={handleShowAttributeRole} icon="bx:message-square-add"  width="30"/> 
                                                                                    </p>
                                                                                </button>

                                                                                <button className='mx-3' onClick={()=>setCurrentRole(transferFromRole)}>
                                                                                    <p onClick={()=>setCurrentNameRole("TransferFrom")}>
                                                                                        <Icon onClick={handleDeleteShow} icon="bx:trash" color="#ff0000" width="30"/> 
                                                                                    </p>
                                                                                </button>
                                                                            </p>
                                                                        </div>
                                                                    </Table.Cell>
                                                                </Table.Row >
                                                                
                                                                <Table.Row >
                                                                    {/* AsyncTransfer */}
                                                                    <Table.Cell ><p className=" py-0 ">AsyncTransfer</p></Table.Cell>
                                                                    <Table.Cell >
                                                                        <p className=" py-0">
                                                                            {verifyAsyncRole === true ? (<Icon color="green" icon="bx:check-circle" width="30" />) : (verifyAsyncRole === false ? <Icon color="#ff0000" width="30" icon="bx:x-circle" /> : <i className="fas fa-spinner fa-spin fa-2x" width="100"></i>)}
                                                                        </p>
                                                                    </Table.Cell>
                                                                    <Table.Cell>
                                                                        <div className="d-flex py-0 ">
                                                                            <p className="text-center">
                                                                            
                                                                                <button onClick={()=>setCurrentRole(asyncRole)}>
                                                                                    <p onClick={()=>setCurrentNameRole("AsyncTransfer")}>
                                                                                        <Icon onClick={handleShowAttributeRole} icon="bx:message-square-add"  width="30"/> 
                                                                                    </p>
                                                                                </button>

                                                                                <button className='mx-3' onClick={()=>setCurrentRole(asyncRole)}>
                                                                                    <p onClick={()=>setCurrentNameRole("AsyncTransfer")}>
                                                                                        <Icon onClick={handleDeleteShow} icon="bx:trash" color="#ff0000" width="30"/> 
                                                                                    </p>
                                                                                </button>
                                                                            </p>
                                                                        </div>
                                                                    </Table.Cell>

                                                                </Table.Row>
                                                                </Table.Body>
                                                            </Table>
                                                    </div>
                                                {/* </form> */}
                                            </div>
                                        </div>
                                    </div>
                                <div className='col-lg-3 col-md-12'></div>
                            </div>
                        </div>
                </div>
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

        {/* <Button className="text-white" color="secondary" onClick={handleDeleteClose}> */}


        {/* ********************************************************************************** */}
            {/* MODAL D'AJOUT D'UN COMPTE MOBILE '*/}
        {/* ********************************************************************************** */}
        <Modal show={showAttributeRole} className="mt-15" onHide={handleCloseAttributeRole}>
            <Modal.Header closeButton id="bgcolor">
                <Modal.Title className="" >Attribution du rôle <b>{currentNameRole}</b></Modal.Title>                
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
                                    defaultValue={addressBcOtherUser} 
                                    onChange={(event)=>setAddressBcOtherUser(event.target.value)}
                                />
                            </div>

                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="text-white" color="danger" onClick={handleCloseAttributeRole}>
                        Fermer
                    </Button>
                    <Button  type='submit' onClick={grantRoleTransaction} color="success" disabled={isLoggingIn}>
                        Attribuer
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
            {/* *****************************************FIN****************************************** */}
            







        </>
    );
};

export default AssignRole;
