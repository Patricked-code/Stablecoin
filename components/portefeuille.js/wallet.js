// *******************LES IMPORTATIONS****************************************************
import { useState, useEffect } from 'react';
import { Container, Row, Col, Collapse, Button, Modal,Form } from "react-bootstrap";
// Importer ABI de E-WARI
import ABI_TOKEN_EWARI from "../../components/Contrats/Abi/AbiStablecoin.json";

// Pour Magic
import { magic } from "../../magic";
import { ethers } from "ethers";
import Web3 from "web3";
import Loading from "../../components/loading";
import Router from "next/router";
import { Icon } from '@iconify/react';
import copy from "copy-to-clipboard"; 
import Swal from 'sweetalert2'
// FIN
import Link from 'next/link';

// ********************FIN************************************************************


const Wallet =({bgGradient, blackText})=>{
 // Variable de l'url de l'api
 const API_URL =process.env.NEXT_PUBLIC_URL_API
 const ADDRESS_CONTRAT_EWARI =process.env.NEXT_PUBLIC_ADDRESS_CONTRAT_EWARI
 
 const [currentUser, setCurrentUser] = useState();
 const [magicCurrentAddress, setMagicCurrentAddress] = useState();
 const [currentAdresse, setCurrentAdresse] = useState("...");
 const [provider, setProvider] = useState(null);
 const [isLoggingIn, setIsLoggingIn] = useState(false);


 //***************************************************************** *
     // LES STATES DU STABLECOIN
 // ******************************************************************
 const [contractStablecoin, setContractStablecoin] = useState();
 const [nameStablecoin, setNameStablecoin] = useState();
 const [symbolStablecoin, setSymbolStablecoin] = useState();
 const [balanceStablecoin, setBalanceStablecoin] = useState();
 const [decimalStablecoin, setDecimalStablecoin] = useState();
 
//  ***************Fin***************************************************

// ****************************************************************************
  // LES STATES DE TRANSFERT
// ****************************************************************************
const [emailOtherUser, setEmailOtherUser] = useState();
const [infosOtherUser, setInfosOtherUser] = useState();
const [codeOtherUser, setCodeOtherUser] = useState();


// *****************************Fin****************************************************


  // States de tab
  const [toggleState, setToggleState] = useState(1);
  const toggleTab = (index) => {
    setToggleState(index);
  };
  // Fin

  const [contentDepot, setContentDepot] = useState();
  const [successCopy, setSuccessCopy] = useState();


  // Modal Depot
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  // Fin

  // Modal Transfert
  const [showTransfert, setShowTransfert] = useState(false);
  const handleTransfertClose = () => setShowTransfert(false);
  const handleTransfertShow = () => setShowTransfert(true);

  // Formulaire du Modal Transfert
  const [montantEnvoyer, setMontantEnvoyer] = useState(0);
  const [addressTo, setAddressTo] = useState();
  const [montantRecu, setMontantRecu] = useState(0);
  const [percent, setPercent] = useState(1);

  const [symbol, setSymbol] = useState();
  // Fin


    // Calcule des frais de transaction
    const frais = montantEnvoyer*percent/100
    const montantRecevoir =  montantEnvoyer - frais 
    // Fin
    


    // FONCTION POUR COPIER L'ADRESSE PUBLIC DE L'UTILISATEUR
    const copyToClipboard = () => {
        copy(magicCurrentAddress);
        setSuccessCopy("Adresse copiée avec succès !");

        setTimeout(() => {
        setSuccessCopy("");
        }, 1000)
    }
    // FIN

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
              setContractStablecoin(contractStablecoin);
                  
              //   recuperation des infos de stablecoin
              const nameStablecoin = await contractStablecoin.name()
              const symbolStablecoin = await contractStablecoin.symbol()
              const decimalStablecoin = await contractStablecoin.decimals()
              const balanceStablecoin = await contractStablecoin.balanceOf(userAddress)
              // Fin 


              // Stocker les infos de stablecoin dans leur state
              setNameStablecoin(nameStablecoin)
              setSymbolStablecoin(symbolStablecoin)
              setDecimalStablecoin(decimalStablecoin)
              setBalanceStablecoin(balanceStablecoin/10**decimalStablecoin)
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


  // Obtenir un utilisateur en fonction de son email 
  if (emailOtherUser) {
    const getUser = async (_emailOtherUser) => {
      console.log("emailOtherUser 3=>",_emailOtherUser)
    
        const result = await fetch(`${API_URL}/api/user/find-user-by-email?email=${_emailOtherUser}`, {
            headers: {
            'Content-Type': 'application/json',
            },
        })
            .then((result) => result.json())
            .then((user) => {
              setInfosOtherUser(user)
        console.log("infosOtherUser=>",infosOtherUser)
    
            }) 
    
        };
        
          // getUser(emailOtherUser);
      
  }
  // Fin



  // Obtenir un utilisateur en fonction de son email 
  if (emailOtherUser) {
    const getUser = async (_emailOtherUser) => {
      console.log("emailOtherUser 3=>",_emailOtherUser)
    
        const result = await fetch(`${API_URL}/api/user/find-user-by-email?email=${_emailOtherUser}`, {
            headers: {
            'Content-Type': 'application/json',
            },
        })
            .then((result) => result.json())
            .then((user) => {
              setInfosOtherUser(user)
        console.log("infosOtherUser=>",infosOtherUser)
    
            }) 
    
        };
        
          // getUser(emailOtherUser);
  }



  // Obtenir un utilisateur en fonction de son email 
  const searchUserWithEmail = () =>{
    if (emailOtherUser) {
      const getUser = async (_emailOtherUser) => {
        console.log("emailOtherUser 3=>",_emailOtherUser)
      
          const result = await fetch(`${API_URL}/api/user/find-user-by-email?email=${_emailOtherUser}`, {
              headers: {
              'Content-Type': 'application/json',
              },
          })
              .then((result) => result.json())
              .then((user) => {
                setInfosOtherUser(user)
                setAddressTo(user?.address)

      
              }) 
      
          };
          
            getUser(emailOtherUser);
        
    }
  }
  // FIN

   // Obtenir un utilisateur en fonction de son adresse blockchain
   const searchUserWithBlockchain = () =>{
    if (addressTo) {
      const getUser = async (_addressTo) => {
        console.log("emailOtherUser 3=>",_addressTo)
      
          const result = await fetch(`${API_URL}/api/user/find-user-by-addrBlockchain?address=${_addressTo}`, {
              headers: {
              'Content-Type': 'application/json',
              },
          })
              .then((result) => result.json())
              .then((user) => {
                setInfosOtherUser(user)
                setAddressTo(user?.address)

      
              }) 
      
          };
          
            getUser(addressTo);
        
    }
  }
  // FIN

   // Obtenir un utilisateur en fonction de son Identifiant
   const searchUserWithIdentifiant = () =>{
    if (codeOtherUser) {
      const getUser = async (_codeOtherUser) => {
          const result = await fetch(`${API_URL}/api/user/find-user-by-userCode?code=${_codeOtherUser}`, {
              headers: {
              'Content-Type': 'application/json',
              },
          })
              .then((result) => result.json())
              .then((user) => {
                setInfosOtherUser(user)
                setAddressTo(user?.address)
      
              }) 
      
          };
          
            getUser(codeOtherUser);
        
    }
  }
  // FIN


    // ***************************************************************************************
    // IMPLEMENTATIONS DES FONCTIONS DU SMART CONTRAT DU TOKEN DE STABLECOIN
  // ***************************************************************************************
  
  // Functions de transfert de Stablecoin avec l'adresse Blockchain
  const transferStablecoin = async () => {
    setIsLoggingIn(true)
    try {
      const tosting = String(montantRecevoir)
      const mountWei = ethers.utils.parseUnits(tosting, decimalStablecoin);
      await contractStablecoin.transfer(addressTo, mountWei).then((transferResult) => {
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
            //   Affiche après le rechargement
            Swal.fire({
                position: 'top-center',
                icon: 'success',
                title: `Succès`,
                html:`<p> ${transferResult.hash}</p>`,
                showConfirmButton: false,
                timer: 20000
            })
            // Fin

            // Actualiser après l'affichage 
            setTimeout(() => {
            window.location.reload()
            }, 20000)
            // Fin
          }
        })
        // FIN PARTIE SWITCH ALERT
    })
      
    } catch (error) {
      setIsLoggingIn(false)

      throw error;
    }
  }
  const handleSubmit = (e) => {
    e.preventDefault()
  }
  // Fin


  // Fonctions de transfert de STABLECOIN avec l'adresse Email
  const transferStablecoinWithEmail = async () => {
    setIsLoggingIn(true);
    // Verifie si l'email saisi n'est pas enregistré dans notre base de donnée 
    //Sinon on recupère l'adresse Bc pour effectuer la transaction
    if(infosOtherUser?.message==="Aucun utisateur trouvé"){
      setIsLoggingIn(false);
      Swal.fire({
        position: 'top-center',
        icon: 'error',
        title: `Erreur`,
        html:`<p>Cet email n'a pas d'utilisateur correspondant.</p>`,
        showConfirmButton: false,
        timer: 10000
    })
    }else{
      
      try {
        if (infosOtherUser?.address) {
          const tosting = String(montantRecevoir)
          const mountWei = ethers.utils.parseUnits(tosting, decimalStablecoin);
          await contractStablecoin.transfer(infosOtherUser?.address, mountWei).then((transferResult) => {
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
                //   Affiche après le rechargement
                Swal.fire({
                    position: 'top-center',
                    icon: 'success',
                    title: `Succès`,
                    html:`<p> ${transferResult.hash}</p>`,
                    showConfirmButton: false,
                    timer: 20000
                })
                // Fin

                // Actualiser après l'affichage 
                setTimeout(() => {
                window.location.reload()
                }, 20000)
                // Fin
              }
            })
            // FIN PARTIE SWITCH ALERT
          })
        }else{
          setIsLoggingIn(false);
            console.log("Non ok")
        }
        
      } catch (error) {
        setIsLoggingIn(false);
        throw error;
      }
    }

  
  }
  // Fin





    return (
        <>
           <div>
                <div className="sign-page bg-default-2 px-0">
                    <Container>
                        <Row className="justify-content-center py-15">
                        <Col lg="12">
                            <div className="main-block">
                            <div className="form-title text-center">
                                <h2 className="title gr-text-7 mb-9 heading-color">Mon Portefeuille Numérique</h2>
                                {/* <button éonClick={transferLysfcRelayer}>Envoyer</button> */}
                            </div>
                            <Row className="justify-content-between">
                                {/* PARTIE DE E-WARI */}
                                <Col lg="6" md="6" sm="10" className="mb-5">
                                    <div className="mt-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                                    <div className="price-content px-16">
                                        <div className="d-flex">
                                        <div className="circle-32 pe-5 ml-5">
                                            <img src="/images/ecfa/logo/logo_ewari1.jpg" className="mx-3 rounded-circle" alt=""   width={60}/>
                                        </div>
                                        <div className="text">
                                            <div className=" my-3 text-blackish-blue title gr-text-7 mb-9 heading-color px-7">
                                            
                                            <p className="my-3 gr-text-8 text-blackish-blue mt-0">
                                            {/* Stablecoin E-WARI */}
                                            {nameStablecoin}
                                            </p>

                                            <p className="my-3 gr-text-8 text-blackish-blue mt-0">
                                               {/*  0.00 E-WARI */}
                                               {balanceStablecoin} {symbolStablecoin}
                                            </p>
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                    <Row className="justify-content-center align-items-center">
                                        <Col
                                        xs="6"
                                        md="6"
                                        lg="6"
                                        xl="6"
                                        className="order-lg-1 mb-5"
                                        data-aos="fade-right"
                                        data-aos-duration="750"
                                        data-aos-delay="500"
                                        >
                                        <div className="hero-btn text-center "
                                            onClick={handleShow}
                                        >
                                        <Button
                                            color="success"
                                            type="button"
                                            onClick={()=>setContentDepot(`Copiez cette adresse pour envoyer à vos proches afin de recevoir des ${symbolStablecoin} du réseau moonbeam`)}
                                        >
                                            Dépôt 
                                        </Button>
                                            
                                        </div>
                                        </Col>

                                        <Col
                                        xs="6"
                                        md="6"
                                        lg="6"
                                        xl="6"
                                        className="order-lg-1 mb-5"
                                        data-aos="fade-right"
                                        data-aos-duration="750"
                                        data-aos-delay="500"
                                        >
                                        <div 
                                            className="hero-btn text-center"
                                            onClick={()=>setSymbol("KOREE")}
                                        >
                                            <Button
                                            color="success"
                                            type="button"
                                            onClick={handleTransfertShow}
                                            >
                                                Transfert
                                            </Button>
                                        </div>
                                        </Col>
                                    </Row>
                                    </div>
                                </Col>
                                {/* FIN */}

                                {/* PARTIE DE MONTANT TOTAL*/}
                                <Col lg="6" md="6" sm="10" className="mb-5">
                                  <div className="mt-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">

                                    <div className="price-content ">
                                      <div className="">
                                        <div className="text">
                                          <p className="text-blackish-blue mx-3 pt-3 pb-5 title gr-text-7 mb-9 heading-color px-7 ">
                                            Current Balance
                                          </p>
                                          <div className="text-center">
                                            <span className="btn-bottom-text gr-text-8 text-blackish-blue gr-opacity-7  text-center">
                                              Total value
                                            </span>
                                            <p className="gr-text-7 text-blackish-blue mt-0">
                                              $0.00
                                            </p>
                                          </div>  <br/>
                                          <div className="text-center my-10"></div>
                                          {/* <div className="text-center">BTC ETH BNB USDT <br/> BUSD USDC DAI</div> */}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </Col>
                                {/* FIN */}

                                {/* PARTIE DE NSIA */}
                                <Col lg="6" md="6" sm="10" className="mb-5">
                                    <div className="mt-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                                    <div className="price-content px-16">
                                        <div className="d-flex">
                                        <div className="circle-32 pe-5 ml-5">
                                            <img src="/images/ecfa/logo/logo_ewari1.jpg" className="mx-3 rounded-circle" alt=""   width={60}/>
                                        </div>
                                        <div className="text">
                                            <div className=" my-3 text-blackish-blue title gr-text-7 mb-9 heading-color px-7">
                                            
                                            <p className="my-3 gr-text-8 text-blackish-blue mt-0">
                                                NSIA
                                            </p>

                                            <p className="my-3 gr-text-8 text-blackish-blue mt-0">
                                                0.00 NSIA EPargne 
                                                <br/><Icon icon="bx:sort-alt-2" /><br/>
                                                0.00 VL
                                                <Icon icon="bx:transfer" className='mx-3' />
                                                0.00 {symbolStablecoin}
                                            </p>
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                    <Row className="justify-content-center align-items-center">
                                        <Col
                                        xs="6"
                                        md="6"
                                        lg="6"
                                        xl="6"
                                        className="order-lg-1 mb-5"
                                        data-aos="fade-right"
                                        data-aos-duration="750"
                                        data-aos-delay="500"
                                        >
                                        <div className="hero-btn text-center "
                                            onClick={handleShow}
                                        >
                                        <Button
                                            color="success"
                                            type="button"
                                            onClick={()=>setContentDepot(`Copiez cette adresse pour envoyer à vos proches afin de recevoir des NSIA Epargne du réseau moonbeam`)}
                                        >
                                            Dépôt 
                                        </Button>
                                            
                                        </div>
                                        </Col>

                                        <Col
                                        xs="6"
                                        md="6"
                                        lg="6"
                                        xl="6"
                                        className="order-lg-1 mb-5"
                                        data-aos="fade-right"
                                        data-aos-duration="750"
                                        data-aos-delay="500"
                                        >
                                        <div 
                                            className="hero-btn text-center"
                                            onClick={()=>setSymbol("E-WARI")}
                                        >
                                            <Button
                                            color="success"
                                            type="button"
                                            onClick={handleTransfertShow}
                                            >
                                                Transfert
                                            </Button>
                                        </div>
                                        </Col>
                                    </Row>
                                    </div>
                                </Col>
                                {/* FIN */}

                                {/* PARTIE DE CREPMF */}
                                <Col lg="6" md="6" sm="10" className="mb-5">
                                    <div className="mt-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                                    <div className="price-content px-16">
                                        <div className="d-flex">
                                        <div className="circle-32 pe-5 ml-5">
                                            <img src="/images/ecfa/logo/logo_ewari1.jpg" className="mx-3 rounded-circle" alt=""   width={60}/>
                                        </div>
                                        <div className="text">
                                            <div className=" my-3 text-blackish-blue title gr-text-7 mb-9 heading-color px-7">
                                            
                                            <p className="my-3 gr-text-8 text-blackish-blue mt-0">
                                                CREPMF
                                            </p>

                                            <p className="my-3 gr-text-8 text-blackish-blue mt-0">
                                                0.00 CREPMF Actions
                                                <br/><Icon icon="bx:sort-alt-2" /><br/>
                                                0.00 VL
                                                <Icon icon="bx:transfer" className='mx-3' />
                                                0.00 {symbolStablecoin}
                                            </p>
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                    <Row className="justify-content-center align-items-center">
                                        <Col
                                        xs="6"
                                        md="6"
                                        lg="6"
                                        xl="6"
                                        className="order-lg-1 mb-5"
                                        data-aos="fade-right"
                                        data-aos-duration="750"
                                        data-aos-delay="500"
                                        >
                                        <div className="hero-btn text-center "
                                            onClick={handleShow}
                                        >
                                        <Button
                                            color="success"
                                            type="button"
                                            onClick={()=>setContentDepot(`Copiez cette adresse pour envoyer à vos proches afin de recevoir des CREPMF Actions du réseau moonbeam`)}
                                        >
                                            Dépôt 
                                        </Button>
                                            
                                        </div>
                                        </Col>

                                        <Col
                                        xs="6"
                                        md="6"
                                        lg="6"
                                        xl="6"
                                        className="order-lg-1 mb-5"
                                        data-aos="fade-right"
                                        data-aos-duration="750"
                                        data-aos-delay="500"
                                        >
                                        <div 
                                            className="hero-btn text-center"
                                            onClick={()=>setSymbol("E-WARI")}
                                        >
                                            <Button
                                            color="success"
                                            type="button"
                                            onClick={handleTransfertShow}
                                            >
                                                Transfert
                                            </Button>
                                        </div>
                                        </Col>
                                    </Row>
                                    </div>
                                </Col>
                                {/* FIN */}

                                {/* PARTIE DE Sicav */}
                                <Col lg="6" md="6" sm="10" className="mb-5">
                                    <div className="mt-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                                    <div className="price-content px-16">
                                        <div className="d-flex">
                                        <div className="circle-32 pe-5 ml-5">
                                            <img src="/images/ecfa/logo/logo_ewari1.jpg" className="mx-3 rounded-circle" alt=""   width={60}/>
                                        </div>
                                        <div className="text">
                                            <div className=" my-3 text-blackish-blue title gr-text-7 mb-9 heading-color px-7">
                                            
                                            <p className="my-3 gr-text-8 text-blackish-blue mt-0">
                                                SICAV
                                            </p>

                                            <p className="my-3 gr-text-8 text-blackish-blue mt-0">
                                                0.00 Sicav Abdou Diouf
                                                <br/><Icon icon="bx:sort-alt-2" /><br/>
                                                0.00 VL
                                                <Icon icon="bx:transfer" className='mx-3' />
                                                0.00 {symbolStablecoin}
                                            </p>
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                    <Row className="justify-content-center align-items-center">
                                        <Col
                                        xs="6"
                                        md="6"
                                        lg="6"
                                        xl="6"
                                        className="order-lg-1 mb-5"
                                        data-aos="fade-right"
                                        data-aos-duration="750"
                                        data-aos-delay="500"
                                        >
                                        <div className="hero-btn text-center "
                                            onClick={handleShow}
                                        >
                                        <Button
                                            color="success"
                                            type="button"
                                            onClick={()=>setContentDepot(`Copiez cette adresse pour envoyer à vos proches afin de recevoir des Sicav Abdou Diouf du réseau moonbeam`)}
                                        >
                                            Dépôt 
                                        </Button>
                                            
                                        </div>
                                        </Col>

                                        <Col
                                        xs="6"
                                        md="6"
                                        lg="6"
                                        xl="6"
                                        className="order-lg-1 mb-5"
                                        data-aos="fade-right"
                                        data-aos-duration="750"
                                        data-aos-delay="500"
                                        >
                                        <div 
                                            className="hero-btn text-center"
                                            onClick={()=>setSymbol("E-WARI")}
                                        >
                                            <Button
                                            color="success"
                                            type="button"
                                            onClick={handleTransfertShow}
                                            >
                                                Transfert
                                            </Button>
                                        </div>
                                        </Col>
                                    </Row>
                                    </div>
                                </Col>
                                {/* FIN */}

                                {/* PARTIE DE Ecobank */}
                                <Col lg="6" md="6" sm="10" className="mb-5">
                                    <div className="mt-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                                    <div className="price-content px-16">
                                        <div className="d-flex">
                                        <div className="circle-32 pe-5 ml-5">
                                            <img src="/images/ecfa/logo/logo_ewari1.jpg" className="mx-3 rounded-circle" alt=""   width={60}/>
                                        </div>
                                        <div className="text">
                                            <div className=" my-3 text-blackish-blue title gr-text-7 mb-9 heading-color px-7">
                                            
                                            <p className="my-3 gr-text-8 text-blackish-blue mt-0">
                                                ECOBANK
                                            </p>

                                            <p className="my-3 gr-text-8 text-blackish-blue mt-0">
                                                0.00 Sicav Ecobank
                                                <br/><Icon icon="bx:sort-alt-2" /><br/>
                                                0.00 VL
                                                <Icon icon="bx:transfer" className='mx-3' />
                                                0.00 {symbolStablecoin}
                                            </p>
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                    <Row className="justify-content-center align-items-center">
                                        <Col
                                        xs="6"
                                        md="6"
                                        lg="6"
                                        xl="6"
                                        className="order-lg-1 mb-5"
                                        data-aos="fade-right"
                                        data-aos-duration="750"
                                        data-aos-delay="500"
                                        >
                                        <div className="hero-btn text-center "
                                            onClick={handleShow}
                                        >
                                        <Button
                                            color="success"
                                            type="button"
                                            onClick={()=>setContentDepot(`Copiez cette adresse pour envoyer à vos proches afin de recevoir des Sicav Ecobank du réseau moonbeam`)}
                                        >
                                            Dépôt 
                                        </Button>
                                            
                                        </div>
                                        </Col>

                                        <Col
                                        xs="6"
                                        md="6"
                                        lg="6"
                                        xl="6"
                                        className="order-lg-1 mb-5"
                                        data-aos="fade-right"
                                        data-aos-duration="750"
                                        data-aos-delay="500"
                                        >
                                        <div 
                                            className="hero-btn text-center"
                                            onClick={()=>setSymbol("E-WARI")}
                                        >
                                            <Button
                                            color="success"
                                            type="button"
                                            onClick={handleTransfertShow}
                                            >
                                                Transfert
                                            </Button>
                                        </div>
                                        </Col>
                                    </Row>
                                    </div>
                                </Col>
                                {/* FIN */}

                                {/* PARTIE DE FCP  */}
                                <Col lg="6" md="6" sm="10" className="mb-5">
                                    <div className="mt-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                                    <div className="price-content px-16">
                                        <div className="d-flex">
                                        <div className="circle-32 pe-5 ml-5">
                                            <img src="/images/ecfa/logo/logo_ewari1.jpg" className="mx-3 rounded-circle" alt=""   width={60}/>
                                        </div>
                                        <div className="text">
                                            <div className=" my-3 text-blackish-blue title gr-text-7 mb-9 heading-color px-7">
                                            
                                            <p className="my-3 gr-text-8 text-blackish-blue mt-0">
                                            FCP 
                                            </p>

                                            <p className="my-3 gr-text-8 text-blackish-blue mt-0">
                                                0.00 FCP Coris
                                                <br/><Icon icon="bx:sort-alt-2" /><br/>
                                                0.00 VL
                                                <Icon icon="bx:transfer" className='mx-3' />
                                                0.00 {symbolStablecoin}
                                            </p>
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                    <Row className="justify-content-center align-items-center">
                                        <Col
                                        xs="6"
                                        md="6"
                                        lg="6"
                                        xl="6"
                                        className="order-lg-1 mb-5"
                                        data-aos="fade-right"
                                        data-aos-duration="750"
                                        data-aos-delay="500"
                                        >
                                        <div className="hero-btn text-center "
                                            onClick={handleShow}
                                        >
                                        <Button
                                            color="success"
                                            type="button"
                                            onClick={()=>setContentDepot(`Copiez cette adresse pour envoyer à vos proches afin de recevoir des FCP Coris du réseau moonbeam`)}
                                        >
                                            Dépôt 
                                        </Button>
                                            
                                        </div>
                                        </Col>

                                        <Col
                                        xs="6"
                                        md="6"
                                        lg="6"
                                        xl="6"
                                        className="order-lg-1 mb-5"
                                        data-aos="fade-right"
                                        data-aos-duration="750"
                                        data-aos-delay="500"
                                        >
                                        <div 
                                            className="hero-btn text-center"
                                            onClick={()=>setSymbol("E-WARI")}
                                        >
                                            <Button
                                            color="success"
                                            type="button"
                                            onClick={handleTransfertShow}
                                            >
                                                Transfert
                                            </Button>
                                        </div>
                                        </Col>
                                    </Row>
                                    </div>
                                </Col>
                                {/* FIN */}
                            </Row>
                        </div>
                        </Col>
                    </Row>
                    </Container>
                </div>
            </div>




      


       {/* ********************************************************************************** */}
                {/* MODAL DE L'ADRESSE PUBLIC'*/}
            {/* ********************************************************************************** */}
            <Modal show={show} className="mt-15" onHide={handleClose}>
                <Modal.Header closeButton id="bgcolor">
                <Modal.Title className="text-white" >Mon adresse public</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className="input-group flex-nowrap">
                  {/* <p className="gr-text-8 pt-3 pb-0 text-center text-green">{magicCurrentAddress} </p> */}
                    
                    <input
                      className="form-control gr-text-8 border  mt-3 bg-white"
                      type="text" 
                      disabled={true}
                      value={magicCurrentAddress}
                    />
                      <span className="input-group-text gr-text-11  mt-3" id="addon-wrapping">
                        <button><Icon onClick={copyToClipboard} icon="bx:copy"  width="30" /></button>
                      </span>
                  </div>
                  
                  <p className="gr-text-8 pt-3 pb-0 text-center colorGreen">{successCopy} </p>
                  <p className="gr-text-8 pt-3 pb-0 text-center">{contentDepot} </p>
                </Modal.Body>
            </Modal>
            {/* *****************************************FIN****************************************** */}


          

          {/* ********************************************************************************** */}
                {/* MODAL DE TRANSFERT DE JETON VERS AUTRE COMPTE*/}
            {/* ********************************************************************************** */}
            <Modal show={showTransfert} className="mt-15" onHide={handleTransfertClose} style={{maxWidth: '1800px', width: '100%'}}>
                <Modal.Header closeButton id="bgcolor">
                <Modal.Title className="" >Transfert des jetons </Modal.Title>
                </Modal.Header>
                {/* <form > */}
                <Modal.Body>
                
                  <div className="bloc-tabs-utilite">
                    <button
                      className={toggleState === 1 ? "tabs active-tabs gr-text-8 text-color-opacity" : "tabs gr-text-8 text-color-opacity"}
                      onClick={() => toggleTab(1)}
                    >
                      Adresse Blockchain
                    </button>

                    <button
                    className={toggleState === 2 ? "tabs active-tabs  gr-text-8 text-color-opacity" : "tabs  gr-text-8 text-color-opacity"}
                    onClick={() => toggleTab(2)}
                    >
                      Adresse email
                    </button>

                    <button
                    className={toggleState === 3 ? "tabs active-tabs  gr-text-8 text-color-opacity" : "tabs  gr-text-8 text-color-opacity"}
                    onClick={() => toggleTab(3)}
                    >
                      Identifiant
                    </button>
                  </div>

                  <div className="content-tabs">
                    <div
                    className={toggleState === 1 ? "content  active-content" : "content"}
                    >
                     {/* Formulaire de la partie avec adresse blockchain  */}
                    <form onSubmit={handleSubmit}>
                      {/* <div className="form-group mb-6">
                        <label
                          htmlFor="addressTo"
                          className="gr-text-8 fw-bold text-blackish-blue "
                        >
                          Adresse blockchain du bénéficiaire <sup className="text-red">*</sup>
                        </label>
                        <input
                          className="form-control gr-text-11 border mt-3 bg-white"
                          type="text"
                          id="addressTo"
                          placeholder="Adresse blockchain du bénéficiaire"
                          required
                          defaultValue={addressTo} 
                          onChange={(event)=>setAddressTo(event.target.value)}
                        />
                      </div> */}

                        <div className="form-group my-6 ">
                          <label
                            htmlFor="montant"
                            className="gr-text-8 fw-bold text-blackish-blue"
                          >
                            Adresse bockchain du bénéficiaire <sup className="text-red">*</sup>

                          </label>
                          <div className="input-group flex-nowrap">
                          <input
                              className="form-control gr-text-11 border mt-3 bg-white"
                              type="text"
                              id="addressTo"
                              placeholder="Adresse blockchain du bénéficiaire"
                              required
                              defaultValue={addressTo} 
                              onChange={(event)=>setAddressTo(event.target.value)}
                              
                          />
                          <span className="input-group-text gr-text-11  mt-3" id="addon-wrapping">
                            <button onClick={searchUserWithBlockchain} disabled={isLoggingIn}><Icon  icon="bx:search-alt"  />
                            </button>
                          </span>

                          </div>
                        </div>

                        {/* affichage infos utilisateur beneeficiaire */}
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
                          {/* Fin affichage */}

                      {infosOtherUser?.entreprise || infosOtherUser?.firstName || infosOtherUser?.lastName?(
                        <>
                          <div className="form-group my-6 ">
                            <label
                              htmlFor="montant"
                              className="gr-text-8 fw-bold text-blackish-blue"
                            >
                              Montant à envoyer <sup className="text-red">*</sup>
                            </label>
                            <div className="input-group flex-nowrap">
                            <input
                              className="form-control gr-text-11 border mt-3 bg-white"
                              type="number"
                              id="montant"
                              placeholder="Montant envoyé"
                              required
                              defaultValue={montantEnvoyer} 
                              onChange={(event)=>setMontantEnvoyer(event.target.value)}
                            />
                            <span className="input-group-text gr-text-11  mt-3" id="addon-wrapping">{symbol}</span>

                            </div>
                          </div>

                          <div className="form-group my-6 ">
                            <label
                              htmlFor="montant"
                              className="gr-text-8 fw-bold text-blackish-blue"
                            >
                              Montant à recevoir avec les frais <sup className="text-red">*</sup>
                            </label>
                            <div className="input-group flex-nowrap">
                            <input
                              className="form-control gr-text-11 border mt-3 bg-white"
                              type="number"
                              id="montant"
                              placeholder="Montant reçu"
                              required
                              disabled={true}
                              value={montantRecevoir} 
                              // defaultValue={montantRecu} 
                              // onChange={(event)=>setMontantRecu(event.target.value)}
                            />
                            <span className="input-group-text gr-text-11  mt-3" id="addon-wrapping">{symbol}</span>

                            </div>
                          </div>
                          {symbol==="KOREE" ? (
                          <Row className="my-3 justify-content-between align-items-center">
                            <Col
                                xs="6"
                                md="6"
                                lg="6"
                                xl="6"
                              className="order-lg-1 text-center"
                            >
                              <Button className="text-white " variant="danger" onClick={handleTransfertClose} >
                                Annuler
                              </Button>
                            </Col>

                            <Col
                                xs="6"
                                md="6"
                                lg="6"
                                xl="6"
                              className="order-lg-1 text-center"
                              
                            >
                              <Button variant="success" onClick={transferStablecoin} disabled={isLoggingIn} className="text-white" >
                                Envoyer
                              </Button>
                            </Col>
                          </Row>
                          ) : (
                            <Row className="my-3 justify-content-between align-items-center">
                            <Col
                                xs="6"
                                md="6"
                                lg="6"
                                xl="6"
                              className="order-lg-1 text-center"
                            >
                              <Button className="text-white " variant="danger" onClick={handleTransfertClose}>
                                Annuler
                              </Button>
                            </Col>

                            <Col
                                xs="6"
                                md="6"
                                lg="6"
                                xl="6"
                              className="order-lg-1 text-center"
                              
                            >
                            <Button variant="success" className="text-white" >
                            Envoyer
                          </Button>
                            </Col>
                          </Row>
                          )}  
                        </>
                      ):("")}
                    </form>
                    </div>

                    <div
                    className={toggleState === 2 ? "content  active-content" : "content"}
                    >
                     {/* Formulaire de la partie avec adresse Email  */}
                    <form onSubmit={handleSubmit}>
                      
                        <div className="form-group my-6 ">
                          <label
                            htmlFor="montant"
                            className="gr-text-8 fw-bold text-blackish-blue"
                          >
                            Adresse email du bénéficiaire <sup className="text-red">*</sup>

                          </label>
                          <div className="input-group flex-nowrap">
                          <input
                              className="form-control gr-text-11 border mt-3 bg-white"
                              type="email"
                              id="email"
                              placeholder="Adresse email du bénéficiaire"
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
                        {/* affichage des infos de l'utilisateur */}
                        {infosOtherUser?.entreprise ? (
                          <p className="gr-text-8 mb-3" id="addon-wrapping">
                            Nom de l'entreprise : {infosOtherUser?.entreprise}
                          </p>
                        ) : (infosOtherUser?.firstName && infosOtherUser?.lastName ?
                         (<div className='mb-3'>
                            <p className="gr-text-8 " id="addon-wrapping">
                              Nom : {infosOtherUser?.firstName}
                            </p>
                            <p className="gr-text-8 " id="addon-wrapping">
                              Prenom : {infosOtherUser?.lastName}
                            </p>
                         </div>) : <p className="gr-text-8 mb-3 colorRed" id="addon-wrapping">{infosOtherUser?.message}</p>)}
                        {/* Fin affichage */}

                        {infosOtherUser?.entreprise || infosOtherUser?.firstName || infosOtherUser?.lastName?(
                          <>
                            <div className="form-group my-6 ">
                              <label
                                htmlFor="montant"
                                className="gr-text-8 fw-bold text-blackish-blue"
                              >
                                Montant à envoyer <sup className="text-red">*</sup>
                              </label>
                              <div className="input-group flex-nowrap">
                              <input
                                className="form-control gr-text-11 border mt-3 bg-white"
                                type="number"
                                id="montant"
                                placeholder="Montant envoyé"
                                required
                                defaultValue={montantEnvoyer} 
                                onChange={(event)=>setMontantEnvoyer(event.target.value)}
                              />
                              <span className="input-group-text gr-text-11  mt-3" id="addon-wrapping">{symbol}</span>

                              </div>
                            </div>

                            <div className="form-group my-6 ">
                              <label
                                htmlFor="montant"
                                className="gr-text-8 fw-bold text-blackish-blue"
                              >
                                Montant à recevoir avec les frais
                              </label>
                              <div className="input-group flex-nowrap">
                              <input
                                className="form-control gr-text-11 border mt-3 bg-white"
                                type="number"
                                id="montant"
                                placeholder="Montant reçu"
                                required
                                disabled={true}
                                value={montantRecevoir} 

                                // defaultValue={montantRecu} 
                                // onChange={(event)=>setMontantRecu(event.target.value)}
                              />
                                <span className="input-group-text gr-text-11  mt-3" id="addon-wrapping">{symbol}</span>

                              </div>
                            </div>
                            <Row className="my-3 justify-content-between align-items-center">
                              <Col
                                  xs="6"
                                  md="6"
                                  lg="6"
                                  xl="6"
                                className="order-lg-1 text-center"
                                
                              >
                                <Button className="text-white " variant="danger"  onClick={handleTransfertClose} >
                                  Annuler
                                </Button>
                              </Col>

                              <Col
                                  xs="6"
                                  md="6"
                                  lg="6"
                                  xl="6"
                                className="order-lg-1 text-center"
                                
                              >
                              <Button variant="success" onClick={transferStablecoin} disabled={isLoggingIn} className="text-white" >
                                  Envoyer
                              </Button>
                              </Col>
                            </Row>
                          </>
                        ):("")}

                    </form>
                    </div>

                    <div
                    className={toggleState === 3 ? "content  active-content" : "content"}
                    >
                     {/* Formulaire de la partie avec identifiant */}
                    <form onSubmit={handleSubmit}>

                      <div className="form-group my-6 ">
                          <label
                            htmlFor="montant"
                            className="gr-text-8 fw-bold text-blackish-blue"
                          >
                            Identifiant du bénéficiaire <sup className="text-red">*</sup>

                          </label>
                          <div className="input-group flex-nowrap">
                          <input
                              className="form-control gr-text-11 border mt-3 bg-white"
                              type="text"
                              id="addressTo"
                              placeholder="Identifiant du bénéficiaire"
                              required
                              defaultValue={codeOtherUser} 
                              onChange={(event)=>setCodeOtherUser(event.target.value)}
                          />
                          <span className="input-group-text gr-text-11  mt-3" id="addon-wrapping">
                            <button onClick={searchUserWithIdentifiant} disabled={isLoggingIn}><Icon  icon="bx:search-alt"  />
                            </button>
                          </span>

                          </div>
                        </div>

                        {/* affichage des infos de l'utilisateur */}
                        {infosOtherUser?.entreprise ? (
                          <p className="gr-text-8 mb-3" id="addon-wrapping">
                            Nom de l'entreprise : {infosOtherUser?.entreprise}
                          </p>
                        ) : (infosOtherUser?.firstName && infosOtherUser?.lastName ?
                         (<div className='mb-3'>
                            <p className="gr-text-8 " id="addon-wrapping">
                              Nom : {infosOtherUser?.firstName}
                            </p>
                            <p className="gr-text-8 " id="addon-wrapping">
                              Prenom : {infosOtherUser?.lastName}
                            </p>
                         </div>) : <p className="gr-text-8 mb-3 colorRed" id="addon-wrapping">{infosOtherUser?.message}</p>)}
                        {/* Fin affichage */}
                        {infosOtherUser?.entreprise || infosOtherUser?.firstName || infosOtherUser?.lastName ?(
                          <>
                            <div className="form-group my-6 ">
                              <label
                                htmlFor="montant"
                                className="gr-text-8 fw-bold text-blackish-blue"
                              >
                                Montant à envoyer <sup className="text-red">*</sup>
                              </label>
                              <div className="input-group flex-nowrap">
                              <input
                                className="form-control gr-text-11 border mt-3 bg-white"
                                type="number"
                                id="montant"
                                placeholder="Montant envoyé"
                                required
                                defaultValue={montantEnvoyer} 
                                onChange={(event)=>setMontantEnvoyer(event.target.value)}
                              />
                              <span className="input-group-text gr-text-11  mt-3" id="addon-wrapping">{symbol}</span>

                              </div>
                            </div>
                        
                            <div className="form-group my-6 ">
                              <label
                                htmlFor="montant"
                                className="gr-text-8 fw-bold text-blackish-blue"
                              >
                                Montant à recevoir avec les frais <sup className="text-red">*</sup>
                              </label>
                              <div className="input-group flex-nowrap">
                              <input
                                className="form-control gr-text-11 border mt-3 bg-white"
                                type="number"
                                id="montant"
                                placeholder="Montant reçu"
                                required
                                disabled={true}
                                value={montantRecevoir} 
                                // defaultValue={montantRecu} 
                                // onChange={(event)=>setMontantRecu(event.target.value)}
                              />
                              <span className="input-group-text gr-text-11  mt-3" id="addon-wrapping">{symbol}</span>

                              </div>
                            </div>
                            <Row className="my-3 justify-content-between align-items-center">
                              <Col
                                  xs="6"
                                  md="6"
                                  lg="6"
                                  xl="6"
                                className="order-lg-1 text-center"
                              >
                                <Button className="text-white " variant="danger" onClick={handleTransfertClose}>
                              Annuler
                            </Button>
                              </Col>

                              <Col
                                  xs="6"
                                  md="6"
                                  lg="6"
                                  xl="6"
                                className="order-lg-1 text-center"
                                
                              >
                                <Button variant="success" onClick={transferStablecoin} disabled={isLoggingIn}  className="text-white" >
                                  Envoyer
                                </Button>
                              </Col>
                            </Row>
                          </>
                        ):("")}

                    </form>
                    </div>
                  </div>

              






                    
                    
                </Modal.Body>
                {/* <Modal.Footer> */}
                {/* <Button className="text-white" variant="danger" onClick={handleTransfertClose}>
                    Annuler
                </Button>
                <Button variant="success" className="text-white" >
                    Envoyer
                </Button>
                </Modal.Footer> */}
                {/* </form> */}
                
            </Modal>
            {/* *****************************************FIN****************************************** */}

        </>
      );
}
export default Wallet