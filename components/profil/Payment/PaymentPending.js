import { useState, useEffect } from 'react';
import { Container, Row, Col, Modal } from "react-bootstrap";
import React from "react";
import axios from 'axios';
import Link from 'next/link';
import moment from 'moment';
import { Icon } from '@iconify/react';
import { Table } from '@nextui-org/react';



// Pour Magic
import { magic } from "../../../magic";
import { ethers } from "ethers";
import Loading from "../../../components/loading";
import Router from "next/router";
import Swal from 'sweetalert2';
import Web3 from "web3";
// FIN

// Importer ABI de E-WARI
import ABI_TOKEN_EWARI from "../../../components/Contrats/Abi/AbiStablecoin.json";




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

const PaiementPending = () => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API
    const ADDRESS_CONTRAT_EWARI =process.env.NEXT_PUBLIC_ADDRESS_CONTRAT_EWARI
    
    const [currentUser, setCurrentUser] = useState();
    const [magicCurrentAddress, setMagicCurrentAddress] = useState();
    const [provider, setProvider] = useState(null);
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const [dataPaymentPending, setDataPaymentPending] = useState(); //state des données de paiement en entente
    const [dataOnePaymentPending, setDataOnePaymentPending] = useState();
    const [paymentPendingLength, setPaymentPendingLength] = useState();

    const [idPaymentPending, setIdPaymentPending] = useState();
    const [currentnameEntreprise, setCurrentEntreprise] = useState();
    const [currentSenderEmail, setCurrentSenderEmail] = useState();
    const [currentsenderAddress, setCurrentSenderAddress] = useState();
    const [currentAmount, setCurrentAmount] = useState();
    const [currentSenderId, setCurrentSenderId] = useState();
    
    
    

    //***************************************************************** *
        // LES STATES DU STABLECOIN
    // ******************************************************************
    const [contractTokenEwari, setContractTokenEwari] = useState();

    

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
                    

               


             
            }
        })();

    }, [provider, magic]);
    //  Fin


    useEffect(() => {
        (async () => {
    
        // Obtenir un utilisateur en fonction de son email 
        const getUser = async () => {
            // Obtenir le token en cours
            const token = localStorage.getItem('tokenEnCours');
        // const result = await fetch(`${API_URL}/api/user/find-user-by-email?email=${userMetadatas?.email}`, {
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
    
    
        // Obtenir les données de la demande de paiement en fonction de l'utilisateur connecté 
        if (currentUser?.id) {
        const getPaymentPendingOfUser = async () => {
            
            // Obtenir le token en cours
            const token = localStorage.getItem('tokenEnCours');
            const result = await fetch(`${API_URL}/api/payment-request/find-all-payment-request-for-receiver?receiverId=${currentUser.id}`, {
                headers: {
                'Content-Type': 'application/json',
                Authorization:  `Bearer ${token}`
    
                },
            })
                .then((result) => result.json())
                .then((data) => {
                setDataPaymentPending(data)
                setPaymentPendingLength(data?.length)
                }) 
            };
            await getPaymentPendingOfUser();
        }
        // Fin
    })();
    
    }, [currentUser, dataPaymentPending]);



    
    // Modal pour révoquer un rôle
    const [showDelete, setShowDelete] = useState(false);
    const handleDeleteClose = () => setShowDelete(false);
    const handleDeleteShow = () => setShowDelete(true);

    // Modal d'attribution d'un rôle à une adresse
    const [showPayer, setShowPayer] = useState(false);
    const handleClosePayer = () => setShowPayer(false);
    const handleShowPayer = () => setShowPayer(true);
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


// ************************************************************************
// Functions de transfert de LYSFC avec l'adresse Blockchain
const transferKorre = async () => {
    setIsLoggingIn(true)
     
  try {
    const tosting = String(currentAmount)
    const mountWei = ethers.utils.parseUnits(tosting, 10);
    await contractTokenEwari.transfer(currentsenderAddress, mountWei).then((transferResult) => {
     

      // PARTIE SWITCH ALERT
      let timerInterval
      Swal.fire({
        title: 'Veuillez patienter svp',
        html: '<p>Votre transaction est en cours...</p>',
        timer: 20000,
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
            console.log("transferResult.blockHash=>",transferResult.blockHash)
            if (transferResult.hash) {
                //   Affiche après le rechargement
              Swal.fire({
                  position: 'top-center',
                  icon: 'success',
                  title: `Succès`,
                  html:`<p> Nous vous confirmons que votre virement a été effectué avec succès. <br/>Un mail du détail du virement vous a été envoyé.</p>`,
                  showConfirmButton: false,
                  timer: 20000
              })
              // . ci-dessous le se trouve hash : <br/>${transferResult.hash}
              // Fin

              // Appel de la fonction qui permettra de modifier Valid en true dans la DB
              updateValidInTrue()
              // Fin
            }else{
              setIsLoggingIn(false)

              Swal.fire({
                  position: 'top-center',
                  icon: 'error',
                  title: `Erreur`,
                  html:`<p> Une erreur s'est produite.</p>`,
                  showConfirmButton: false,
                  timer: 20000
              })
            }
          

          
        }
      })
      // FIN PARTIE SWITCH ALERT
  })
    
  } catch (error) {
    setIsLoggingIn(false)
      console.log("error=>",error)
    throw error;
  }
}

// ***************************************************************










    // Functions de transfert de LYSFC avec l'adresse Blockchain
  const transferKorreNo = async () => {
      setIsLoggingIn(true)
       
    try {
        console.log("AAAAAAAAAAAAAAAAAA")
      const tosting = String(currentAmount)
      const mountWei = ethers.utils.parseUnits(tosting, 10);
      await contractTokenEwari.transfer(currentsenderAddress, mountWei).then((transferResult) => {
        console.log("AAAAAAAAAAAAAAAAAA 22")
       

        // PARTIE SWITCH ALERT
        
         
              console.log("transferResult.blockHash=>",transferResult.blockHash)
              if (transferResult.hash) {
                  //   Affiche après le rechargement
                Swal.fire({
                    position: 'top-center',
                    icon: 'success',
                    title: `Succès`,
                    html:`<p> Nous vous confirmons que votre virement a été effectué avec succès. <br/>Un mail du détail du virement vous a été envoyé.</p>`,
                    showConfirmButton: false,
                    timer: 20000
                })
                // . ci-dessous le se trouve hash : <br/>${transferResult.hash}
                // Fin
                // Appel de la fonction qui permettra de modifier Valid en true dans la DB
                updateValidInTrue()
                // Fin
                
                
                // Actualiser après l'affichage 
                setTimeout(() => {
                    window.location.reload()
                }, 20000)
                // Fin
              }else{
                setIsLoggingIn(false)

                Swal.fire({
                    position: 'top-center',
                    icon: 'error',
                    title: `Erreur`,
                    html:`<p> Une erreur s'est produite.</p>`,
                    showConfirmButton: false,
                    timer: 20000
                })
              }
            

            
        })
        // FIN PARTIE SWITCH ALERT
      
    } catch (error) {
      setIsLoggingIn(false)
        console.log("error=>",error)
      throw error;
    }
  }


   // FONCTION QUI METTRE VALID DE LA TABLE EN TRUE
   const updateValidInTrue= async() =>{
    setIsLoggingIn(true)
    
    const dataa = {
      amount:currentAmount,
      senderId:currentSenderId
       
    }
    
    // Obtenir le token en cours
    const token = localStorage.getItem('tokenEnCours');

    const result = await fetch(`${API_URL}/api/payment-request/update-payment-valid-in-true/${idPaymentPending}`, {
          method:"PUT",
          body: JSON.stringify(dataa),
          headers: {
              'Content-Type': 'application/json',
              Authorization:  `Bearer ${token}`
          }
      })
      .then(res=>{
      const data =  res.json();
        if (res.status==200) {
          //  Actualiser après l'affichage 
          setTimeout(() => {
            window.location.reload()
          }, 20000) 
          // Fin
        }else{
          setIsLoggingIn(false)
          console.log("La demande de paiement a échouée")
      }
    })
    .catch(error => {
      setIsLoggingIn(false)

      //handle error
      console.log(error);

    });
    }
    // FIN

    // FONCTION QUI METTRE VALID DE LA TABLE EN False
   const updateValidInFalse= async() =>{
    setIsLoggingIn(true)
    
    const dataa = {
      amount:currentAmount,
      senderId:currentSenderId
       
    }
    // Obtenir le token en cours
    const token = localStorage.getItem('tokenEnCours');

    const result = await fetch(`${API_URL}/api/payment-request/update-payment-valid-in-false/${idPaymentPending}`, {
          method:"PUT",
          body: JSON.stringify(dataa),
          headers: {
              'Content-Type': 'application/json',
              Authorization:  `Bearer ${token}`
          }
      })
      .then(res=>{
      const data =  res.json();
      console.log("data 1=>",res)
        if (res.status==200) {
          Swal.fire({
            position: 'center',
            icon: 'success',
            html: "<p> La demande de paiement a été annulée avec succès.<br/> Nous vous avons transmis un email de confirmation en ce sens.</p>" ,
            showConfirmButton: false,
            timer: 10000
          })

          //  Actualiser après l'affichage 
          setTimeout(() => {
            window.location.reload()
          }, 10000) 
          // Fin
        }else{
          setIsLoggingIn(false)

          Swal.fire({
            position: 'center',
            icon: 'error',
            html: "<p> L'annulation de la demande de paiement a échouée. </p>" ,
            showConfirmButton: false,
            timer: 15000
        })
      }
    })
    .catch(error => {
      setIsLoggingIn(false)

      //handle error
      console.log(error);

    });
    }
    // FIN

     
// FONCTION POUR FORMATER LA DATE
const formatDate = (_updatedAt) =>{
    const maDate = moment(_updatedAt).format('DD/MM/YYYY à HH:mm');
    return  maDate
}
//  FIN

    





    return (
        <>
        {magicCurrentAddress?( 
            <>
                <div className='' >
                    <div className=' mx-15'>
                        <div className='py-10'>
                            <h1 className='text-center'>Paiements en attente</h1>
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
                                <div className='col-lg-1 col-md-1'></div>

                                    <div className='col-lg-10 col-md-10'>
                                        <div className='currency-selection'>
                                            <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                                                    <div className='col-lg-12 col-md-12 row justify-content-between'>
                                                        {!paymentPendingLength==0?(
                                                            <Table
                                                                aria-label="Example table with static content"
                                                                css={{
                                                                    height: "auto",
                                                                    minWidth: "100%",
                                                                }}
                                                            >
                                                            <Table.Header>
                                                                <Table.Column><p className="gr-text-8 pt-3 pb-0 mx-3 ">commerçant/entreprise </p></Table.Column>
                                                                <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Montant</p></Table.Column>
                                                                <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Objet</p></Table.Column>
                                                                <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Date</p></Table.Column>
                                                                <Table.Column><p className="gr-text-8 pt-3 pb-0 text-center">Actions</p></Table.Column>
                                                            </Table.Header>
                                                                <Table.Body>
                                                                    {dataPaymentPending?.map(
                                                                        (
                                                                        {id, objet, amount,senderEmail, senderAddress, nameEntreprise, senderId, createdAt},
                                                                        index
                                                                        ) => (
                                                                            <Table.Row key={index}>
                                                                                {/* Default Admin */}
                                                                                <Table.Cell ><p className=" py-0 ">{nameEntreprise}</p></Table.Cell>
                                                                                <Table.Cell ><p className=" py-0 ">{amount} KOREE</p></Table.Cell>
                                                                                <Table.Cell ><p className=" py-0 ">{objet}</p></Table.Cell>
                                                                                <Table.Cell ><p className=" py-0 ">{formatDate(createdAt)}</p></Table.Cell>
                                                                            
                                                                                <Table.Cell>
                                                                                    <div className="d-flex py-0 ">
                                                                                        <p className="text-center">
                                                                                        
                                                                                            <Button type='button'  onClick={()=>setCurrentSenderAddress(senderAddress)}  color='success' className=''>
                                                                                            {/* onClick={()=>setIdForSender(senderId)} */}
                                                                                            
                                                                                                <div onClick={()=>setIdPaymentPending(id)}>
                                                                                                    <div onClick={()=>setCurrentSenderId(senderId)}>
                                                                                                        <div onClick={()=>setCurrentAmount(amount)}>
                                                                                                            <div onClick={()=>setCurrentEntreprise(nameEntreprise)}>
                                                                                                                <div onClick={()=>setCurrentSenderEmail(senderEmail)}>
                                                                                                                    <div onClick={handleShowPayer}>
                                                                                                                        Valider <Icon icon="bx:chevron-down-circle"   width="30"/> 
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </Button>

                                                                                            <Button  onClick={()=>setCurrentAmount(amount)}color='danger' className='text-center mx-3 bg-red'>
                                                                                                <div onClick={()=>setIdPaymentPending(id)}>
                                                                                                    <div onClick={()=>setCurrentSenderId(senderId)}>
                                                                                                        <div onClick={handleDeleteShow}>
                                                                                                            Annuler <Icon icon="bx:trash"  width="30"/> 
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </Button>
                                                                                        </p>
                                                                                    </div>
                                                                                </Table.Cell>
                                                                            </Table.Row >
                                                                        )
                                                                    )}
                                                                    {/* <Table.Pagination
                                                                        shadow
                                                                        noMargin
                                                                        align="center"
                                                                        rowsPerPage={3}
                                                                        onPageChange={(page) => console.log({ page })}
                                                                    /> */}
                                                                </Table.Body>
                                                            </Table>
                                                        ):(
                                                            <div className="text-center my-5">
                                                                Aucune demande de paiement en attente
                                                            </div>
                                                        )}
                                                    </div>
                                                {/* </form> */}
                                            </div>
                                        </div>
                                    </div>
                                <div className='col-lg-1 col-md-1'></div>
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
            {/* MODAL D'ANNULATION DE PAIEMENT'*/}
        {/* ********************************************************************************** */}
        
        <Modal show={showDelete} className="mt-15" onHide={handleDeleteClose}>
            <Modal.Header closeButton className='bgColorRed'>
            <Modal.Title className="text-white">Annulation de la demande</Modal.Title>
            </Modal.Header>
                {/* <Form role="form"> */}
                    <Modal.Body>
                        <div className="input-group flex-nowrap">
                            <div className='col-lg-12 col-md-12 row justify-content-center'>
                                <div className='input-group-alternative my-3 '>
                                    <label className="mx-2 mb-3 text-center" htmlFor='address'>
                                        Voulez-vous vraiment annuler cette demande de paiement ?
                                    </label>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button className="text-white" color="danger" onClick={handleDeleteClose}>
                        Fermer
                    </Button>
                    <Button  type='button' onClick={updateValidInFalse}  color="primary" disabled={isLoggingIn}>
                        Annuler
                    </Button>
                    </Modal.Footer>
                {/* </Form> */}
        </Modal>
        {/* *****************************************FIN****************************************** */}

        {/* <Button className="text-white" color="secondary" onClick={handleDeleteClose}> */}


        {/* ********************************************************************************** */}
            {/* MODAL DE VALIDATION DE PAIEMENT  '*/}
        {/* ********************************************************************************** */}
        <Modal show={showPayer} className="mt-15" onHide={handleClosePayer}>
            <Modal.Header closeButton className='bgColorGreen'>
                <Modal.Title className="text-white" >Validation de paiement</Modal.Title>                
            </Modal.Header>
            {/* <Form role="form" onSubmit={hant}> */}
                <Modal.Body>
                    <div className="input-group flex-nowrap">
                        <div className='col-lg-12 col-md-12 row justify-content-between'>
                            <div className='input-group-alternative my-3 '>
                                Voulez-vous confirmer le paiement de {currentAmount} KOREE à l'adresse de {currentnameEntreprise}
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="text-white" color="danger" onClick={handleClosePayer}>
                        Fermer
                    </Button>
                    <Button  type='button'  color="success" onClick={transferKorre} disabled={isLoggingIn}>
                        Payer
                    </Button>
                </Modal.Footer>
            {/* </Form> */}
        </Modal>
        {/* *****************************************FIN****************************************** */}
            







        </>
    );
};

export default PaiementPending;
