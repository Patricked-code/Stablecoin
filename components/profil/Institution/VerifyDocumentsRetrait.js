import { useRef, useState, useEffect } from 'react';
import { Container, Row, Col, Collapse, Button, Modal,Form } from "react-bootstrap";
import ABI_TOKEN_EWARI from "../../../components/Contrats/Abi/AbiStablecoin.json"

// Pour Magic
import { magic } from "../../../magic";
import { ethers } from "ethers";
import React from "react";
import Link from 'next/link';
import { Icon } from '@iconify/react';
import moment from 'moment';
import Swal from 'sweetalert2'



// Pour l'importation du scanner
import dynamic from 'next/dynamic';

const QrScannerWithNoSSR = dynamic(() => import('react-qr-scanner'), {
  ssr: false,
});
// Fin scanner

// PARTIE IMPORTATTION DES MODULES POUR AGRANDIR LES IMAGES
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import MapComponent from '../../CarteEmplacement/MapComponent';
// Fin



const VerifyDocumentsRetrait = () => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API
    const ADDRESS_CONTRAT_EWARI =process.env.NEXT_PUBLIC_ADDRESS_CONTRAT_EWARI

    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [currentUser, setCurrentUser] = useState();
    const [magicCurrentAddress, setMagicCurrentAddress] = useState();
    const [currentAdresse, setCurrentAdresse] = useState("...");
    const [provider, setProvider] = useState(null);

    //***************************************************************** *
     // LES STATES DU STABLECOIN
    // ******************************************************************
    const [contractStablecoin, setContractStablecoin] = useState();
    const [signer, setSigner] = useState();
    const [nameStablecoin, setNameStablecoin] = useState();
    const [symbolStablecoin, setSymbolStablecoin] = useState();
    const [balanceStablecoin, setBalanceStablecoin] = useState();
    const [decimalStablecoin, setDecimalStablecoin] = useState();
  // const position = [parseFloat(oneKycForParticular?.latitude), parseFloat(oneKycForParticular?.longiitude)];

    // States recherche de d'un utilisateur
    const [infosOtherUser, setInfosOtherUser] = useState();
    const [emailOtherUser, setEmailOtherUser] = useState();
    const [codeOtherUser, setCodeOtherUser] = useState();
    const [infosDistributer, setInfosDistributer] = useState();
    
    const [reasonFiling, setReasonFiling] = useState();
    const [fundsOrigin, setFundsOrigin] = useState();
    
    const [showInfoUser, setShowInfoUser] = useState();

    // states de kyc
    const [oneKycForParticular, setOneKycForParticular] = useState();

    // states de retrait cash
    const [fees, setFees] = useState(0);
    const [institutionalCommission, setInstitutionalCommission] = useState(0);
    const [wealthtechCommission, setWealthtechCommission] = useState(0);
    
    // Formulaire du Modal Transfert
    const [montantRetirer, setMontantRetirer] = useState(0);
    const [addressTo, setAddressTo] = useState();
    const [montantRetirerAvecFrais, setMontantRetirerAvecFrais] = useState(0);
    const [percent, setPercent] = useState(10);



     // Calcule des frais de transaction
    //  const frais = montantRetirer*percent/100
    //  const montantRetirerAvecFrais =  parseFloat(montantRetirer) + frais 
     // Fin

      // Calcule des frais de transaction
      useEffect(() => {
        const getInfos = async () => {
        const frais = montantRetirer*infosDistributer?.percentage/100
        const montantRetirerAvecFrais =  parseFloat(montantRetirer) + frais 
        setMontantRetirerAvecFrais(montantRetirerAvecFrais)
        const commissionInstitution = frais*infosDistributer?.percentageInstitution/100
        const commissionWti = frais*infosDistributer?.percentageWealthtech/100
        
       
        // setFees(frais)
        // setAmount(montantEnvoyer)
        setWealthtechCommission(commissionWti)
        setInstitutionalCommission(commissionInstitution)
        setFees(frais)
      };
        getInfos()
      },[montantRetirer])
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
                setSigner(signer)
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
                // setNameStablecoin(nameStablecoin)
                setSymbolStablecoin(symbolStablecoin)
                setDecimalStablecoin(decimalStablecoin)
                // setBalanceStablecoin(balanceStablecoin/10**decimalStablecoin)
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


    // La fonction qui vérifie si un lien est un lien pdf
    function isPdfLink(link) {
      return link.endsWith('.pdf');
    }
    // States de tab
    const [toggleState, setToggleState] = useState(1);
    const toggleTab = (index) => {
        setToggleState(index);
    };
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
    
         // Obtenir un utilisateur en fonction de son adresse blockchain
         const searchUserWithBlockchain = () =>{
          if (addressTo) {
            const getUser = async (_addressTo) => {
            
                const result = await fetch(`${API_URL}/api/user/find-user-by-addrBlockchain?address=${_addressTo}`, {
                    headers: {
                    'Content-Type': 'application/json',

                    },
                })
                    .then((result) => result.json())
                    .then((user) => {
                      setInfosOtherUser(user)
            
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

            
                    }) 
            
                };
                
                  getUser(codeOtherUser);
              
          }
        }
        // FIN
        
        const handleSubmit = (e) => {
          e.preventDefault()
      
        }
        // Fin


   // ************************************************************************
    // PARTIE SCANNER DU QR CODE
  // *************************************************************************
  const qrScannerRef = useRef(null);
  const [showScanner, setShowScanner] = useState();
  const [showInput, setShowInput] = useState();

  const handleScan = (data) => {
    if (data) {
      setAddressTo(data?.text);
      // searchUserWithBlockchain() //Appel automatique de la fonction de recherche des informations apres avoir scanné le qr code 

    }
  };

  const handleError = (error) => {
    console.error(error);
  };
  // *****************************FIN SCANNER*****************************

  // RECUPERER UNE SEULE LIGNE DE KYC DU PARTICULIER D'UN UTILISATEUR EN FONCTION DE SON ID
  if (infosOtherUser?.id) {
    
    const getOneKycForParticular = async (_userId) => {
      // Obtenir le token en cours
      const token = localStorage.getItem('tokenEnCours');
      try {
        const resKyc = await fetch(`${API_URL}/api/kyc/particular/find-one-kyc-particular-by-userId?userId=${_userId}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization:  `Bearer ${token}`

          },
        });
  
        if (!resKyc.ok) {
          throw new Error('Failed to fetch KYC data');
        }
  
        const data = await resKyc.json();
        setOneKycForParticular(data);
      } catch (error) {
        // Handle errors appropriately, e.g., set an error state.
        console.error('Error fetching KYC data:', error);
      }
    };
  
    getOneKycForParticular(infosOtherUser?.id);
}
// FIN


// FONCTION POUR VIDER DES CHAMPS QUAND ON CLIQUE SUR LE BOUTON EMAIL, ADRESSE BLOCKCHAIN ET IDENTIFAINT
const dumpVariables = () =>{
  setInfosOtherUser("")
  setAddressTo("")
  setEmailOtherUser("")
  setCodeOtherUser("")
}




  // **************************************************************
    // PARTIE RETRAIT CASH
  // ****************************************************************
  // Modal Transfert
  const [showWithdrawal, setShowWithdrawal] = useState(false);
  const handleWithdrawalClose = () => setShowWithdrawal(false);
  const handleWithdrawalShow = () => setShowWithdrawal(true);

  // Fonction d'enregistrement de dépôt cash
  const addWithdrawalCash = async (_amountBurn, _wealthtechCommission, _institutionalCommission, _amount, _addressCustomer, _addressInstitution, _hash) => {
    setIsLoggingIn(true);

    try {
        
        const dataBody = {
          addressCustomer: _addressCustomer,
          addressInstitution: _addressInstitution,
          amount: _amount,
          amountBurn: _amountBurn,
          fees: fees,
          institutionalCommission: _institutionalCommission,
          wealthtechCommission: _wealthtechCommission,
          hash: _hash,
          state: "Succès",
          customerId: infosOtherUser?.id
        }

        // Obtenir le token en cours
        const token = localStorage.getItem('tokenEnCours');
        /**
         * Réponse de la requête KYC.
         * @type {Response}
         */
        const response = await fetch(`${API_URL}/api/transaction/add-cash-withdrawal`, {
            method: 'POST',
            body: JSON.stringify(dataBody),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
        });

        /**
         * Données de la réponse de la requête .
         * @type {object}
         */
        const data = await response.json();

        /* Verifier s'il y a un messsage d'erreur, on l'affiche dans SWAL 
        * sinon on affiche le message de succès
        */
        if (!data.message) {
            Swal.fire({
                position: 'center',
                icon: 'success',
                html: `<p> Le retrait s'est effectué avec succès.</p>`,
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

  // FONCTION POUR RECUPERER LES INFOS DE COMMISION DE DEPOT DE L'INSTITUTION EN FONCTION DE L'UTILISATEUR CONNECTE
  useEffect(() => {
    // Obtenir le token en cours
    const token = localStorage.getItem('tokenEnCours');
    const getInfosDistributer = async () => {
    try {
        const result = await fetch(`${API_URL}/api/distributer/find-request-distributer-withdrawal-of-user`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`

        },
        });

        if (!result.ok) {
        throw new Error('Failed to fetch user data');
        }

        const data = await result.json();
        setInfosDistributer(data);
    } catch (error) {
        // Handle errors appropriately, e.g., set an error state.
        console.error('Error fetching user data:', error);
    }
    };

    getInfosDistributer();
    
  }, []);
  // FIN

  // FONCTION DE L'EXECUTION DES TRANSFERT EN BLOC ET DE Burn
  const transferBatchWithBurn = async () => {
    setIsLoggingIn(true);

    try {
      // Parse the amount that the client will burn
      const tostingA = String(montantRetirer);
      const mountWeiA = ethers.utils.parseUnits(tostingA, decimalStablecoin);

      // Parse the amount of WTI commission
      const tostingB = String(wealthtechCommission);
      const mountWeiB = ethers.utils.parseUnits(tostingB, decimalStablecoin);
  
      // Parse the amount of institutional commission
      const tostingC = String(institutionalCommission);
      const mountWeiC = ethers.utils.parseUnits(tostingC, decimalStablecoin);
  
      // Calculate the total burn amount
      // const totalAmount = mountWeiA.add(mountWeiB).add(mountWeiC);

      const dataForm = {
        addressBurn: infosOtherUser?.address,
        recipients: [infosDistributer?.wealthtechCommissionAddress, magicCurrentAddress],
        amounts: [mountWeiB, mountWeiC],
        amountBurn: mountWeiA,
      };
  
      // Check if the executor has enough gas fees (DEV)
      const gasEstimate = await contractStablecoin.estimateGas.transferBatchWithBurn(
        dataForm.addressBurn,
        dataForm.recipients,
        dataForm.amounts,
        dataForm.amountBurn
      );
      const gasCost = gasEstimate.mul(await signer.getGasPrice());
      const senderBalance = await signer.getBalance();
  
      if (gasCost.gt(senderBalance)) {
      setIsLoggingIn(false);

        Swal.fire({
          position: 'center',
          icon: 'error',
          title: "L'institution n'a pas suffisamment de frais de gas pour exécuter cette transaction.",
          showConfirmButton: false,
          timer: 5000,
        });
        throw new Error("L'exécuteur n'a pas suffisamment de DEV pour couvrir les frais de gas.");
      }
  
      // Check if addressBurn has an amount greater than or equal to montantRetirerAvecFrais
      const addressBurnBalance = await contractStablecoin.balanceOf(dataForm.addressBurn);
      if (addressBurnBalance.lt(montantRetirerAvecFrais)) {
      setIsLoggingIn(false);

        Swal.fire({
          position: 'center',
          icon: 'error',
          title: `Le client n'a pas un montant suffisant pour cette transaction.<br/> Son solde est : ${addressBurnBalance}  ${symbolStablecoin}`,
          showConfirmButton: false,
          timer: 5000,
        });
        throw new Error("Le client n'a pas un montant suffisant pour cette transaction.");
      }
  
      // Perform burn once before the loop
      const transferBatchWithBurnTx = await contractStablecoin.transferBatchWithBurn(
        dataForm.addressBurn,
        dataForm.recipients,
        dataForm.amounts,
        dataForm.amountBurn
      );
  
      await transferBatchWithBurnTx.wait();
      
      // Appel de la fonction d'ajout des données dans la table des historique de transactions dans base de données
      addWithdrawalCash(
        montantRetirer,
        wealthtechCommission,
        institutionalCommission,
        montantRetirerAvecFrais,
        infosOtherUser?.address,
        magicCurrentAddress,
        transferBatchWithBurnTx.hash
      )
      
    } catch (error) {
      setIsLoggingIn(false);

      // Show error notification using Swal
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: "Une erreur s'est produite lors de la transaction.",
        showConfirmButton: false,
        timer: 5000,
      });
  
      console.error("Erreur:", error.message);
    }
  };



  
  // *************FIN*************************************************


// PARTIE POUR AGRANDIR LES IMAGES
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const images = [
      oneKycForParticular?.frontReceiptPhoto,
      `${API_URL}/${oneKycForParticular?.frontReceipt}`,
      oneKycForParticular?.backReceiptPhoto,
      `${API_URL}/${oneKycForParticular?.backReceipt}`
  ];
  const handleClickImage = (index) => {
      setLightboxOpen(true);
      setLightboxIndex(index);
  };
// FIN PARTIE POUR AGRANDIR LES IMAGES

// FONCTION POUR FORMATER LA DATE
const formatDate = (_updatedAt) =>{
  const maDate = moment(_updatedAt).format('DD/MM/YYYY');
  return  maDate
}
//  FIN


  return (
    <>

        <div className='' >
            <div className=' mx-15'>
                <div className='py-10'>
                    <h3 className='text-center'>Vérifications des documents</h3>
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
            <div className='row'>
                <div className='col-lg-3 col-md-12'></div>
                <div className='m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white cryptocurrency-search-box login-form col-lg-6 col-md-12'>
                  <div className="bloc-tabs-utilite">
                    <button
                      className={toggleState === 1 ? "tabs active-tabs gr-text-8 text-color-opacity" : "tabs gr-text-8 text-color-opacity"}
                      onClick={() => toggleTab(1)}
                    >
                      <p onClick={dumpVariables}>Adresse Blockchain</p>
                    </button>

                    <button
                    className={toggleState === 2 ? "tabs active-tabs  gr-text-8 text-color-opacity" : "tabs  gr-text-8 text-color-opacity"}
                    onClick={() => toggleTab(2)}
                    >
                      <p onClick={dumpVariables}>Adresse email</p>
                    </button>

                    <button
                    className={toggleState === 3 ? "tabs active-tabs  gr-text-8 text-color-opacity" : "tabs  gr-text-8 text-color-opacity"}
                    onClick={() => toggleTab(3)}
                    >
                      <p onClick={dumpVariables}>Identifiant</p>
                    </button>
                  </div>

                  <div className="content-tabs">
                    <div
                    className={toggleState === 1 ? "content  active-content" : "content"}
                    >
                     {/* Formulaire de la partie avec adresse blockchain  */}
                     <form onSubmit={handleSubmit}>
                        <div className="form-group my-6 ">

                          <div className='row'>
                            <div className='col-lg-6 col-md-6' onClick={()=>setShowInput(0)}>
                              <p onClick={()=>setAddressTo("")}>
                                <button className='my-3' onClick={()=>setShowScanner(1)} disabled={isLoggingIn}>Cliquez ici pour scanner le QR code du recepteur</button>
                              </p>
                            </div>
                              
                            <div className='col-lg-6 col-md-6' onClick={()=>setShowScanner(0)}>
                              <p  onClick={()=>setAddressTo("")}>
                              <button className='my-3' onClick={()=>setShowInput(1)} disabled={isLoggingIn}>Cliquez ici pour saisir l'adresse blockchain du recepteur</button>
                              </p>
                            </div>
                            {showScanner==1 && showInput==0? (
                              <>
                                {!addressTo? (
                                  <>
                                    <div className='col-lg-3 col-md-3'></div>
                                    <div className='col-lg-6 col-md-6'>
                                    
                                      
                                        <QrScannerWithNoSSR
                                          ref={qrScannerRef}
                                          onScan={handleScan}
                                          onError={handleError}
                                          style={{ width: '100%', height: 'auto' }}
                                        />
                                      
                                    </div>
                                    <div className='col-lg-3 col-md-3'></div>
                                </>
                                ):(
                                  <div className="input-group ">
                                    <input
                                        className="form-control gr-text-11 border mt-3 bg-white"
                                        type="text"
                                        id="addressTo"
                                        disabled
                                        placeholder="Entrez adresse bockchain du recepteur"
                                        required
                                        value={addressTo} 
                                    />
                                  </div>
                                )}
                              </>
                            ) : ("")}
                          </div>
                          
                          
                          {showScanner==0 && showInput==1 ? (
                            <>
                              <label
                                htmlFor="montant"
                                className="gr-text-8 fw-bold text-blackish-blue"
                              >
                                Entrez adresse bockchain du recepteur <sup className="text-red">*</sup>

                              </label>
                              <div className="input-group flex-nowrap">
                                <input
                                    className="form-control gr-text-11 border mt-3 bg-white"
                                    type="text"
                                    id="addressTo"
                                    placeholder="Entrez adresse bockchain du recepteur"
                                    required
                                    defaultValue={addressTo} 
                                    onChange={(event)=>setAddressTo(event.target.value)}
                                    
                                />
                                {/* <span className="gr-text-8 mx-2" id="addon-wrapping">
                                  <button onClick={searchUserWithBlockchain} disabled={isLoggingIn}><Icon  icon="bx:search-alt"  />
                                  </button>
                                </span> */}

                              </div>
                            </>
                          ) : ("")}

                      
                              {addressTo ? (
                                <Row className="my-3 justify-content-center align-items-center">
                                  <Col
                                      xs="6"
                                      md="6"
                                      lg="6"
                                      xl="6"
                                    className="order-lg-1 text-center"
                                    onClick={()=>setShowInfoUser(1)}
                                    
                                  >
                                  <Button variant="success" onClick={searchUserWithBlockchain}  className="text-white" >
                                      Vérifier
                                  </Button>
                                  </Col>
                                </Row>
                              ) : ("")}
                        </div>
                        
                      </form>
                    </div>




                    <div
                    className={toggleState === 2 ? "content  active-content" : "content"}
                    >
                     {/* Formulaire de la partie avec adresse email  */}
                    <form onSubmit={handleSubmit}>
                      <div className="form-group mb-6">
                        <label
                          htmlFor="pays"
                          className="gr-text-8 fw-bold text-blackish-blue "
                        >
                          Adresse email du bénéficiaire <sup className="text-red">*</sup>
                        </label>
                        <input
                          className="form-control gr-text-11 border mt-3 bg-white"
                          type="email"
                          id="contact"
                          placeholder="Adresse email du bénéficiaire"
                          required
                          defaultValue={emailOtherUser} 
                          onChange={(event)=>setEmailOtherUser(event.target.value)}
                        />
                      </div>
                      
                      {emailOtherUser ? (
                      <Row className="my-3 justify-content-center align-items-center">
                        <Col
                            xs="6"
                            md="6"
                            lg="6"
                            xl="6"
                          className="order-lg-1 text-center"
                          onClick={()=>setShowInfoUser(2)}
                          
                        >
                        <Button variant="success" onClick={searchUserWithEmail} className="text-white" >
                            Vérifier
                        </Button>
                        </Col>
                      </Row>
                      ):("")}
                    </form>
                    </div>




                    <div
                    className={toggleState === 3 ? "content  active-content" : "content"}
                    >
                     {/* Formulaire de la partie avec identifiant  */}
                    <form onSubmit={handleSubmit}>
                      <div className="form-group mb-6">
                        <label
                          htmlFor="identifiant"
                          className="gr-text-8 fw-bold text-blackish-blue "
                        >
                          Identifiant du bénéficiaire <sup className="text-red">*</sup>
                        </label>
                        <input
                          className="form-control gr-text-11 border mt-3 bg-white"
                          type="text"
                          id="identifiant"
                          placeholder="Identifiant du bénéficiaire"
                          required
                          defaultValue={codeOtherUser} 
                          onChange={(event)=>setCodeOtherUser(event.target.value)}
                        />
                      </div>

                      {codeOtherUser ? (
                        <Row className="my-3 justify-content-center align-items-center">
                          <Col
                              xs="6"
                              md="6"
                              lg="6"
                              xl="6"
                            className="order-lg-1 text-center"
                            onClick={()=>setShowInfoUser(3)}
                          >
                            <Button className="text-white " onClick={searchUserWithIdentifiant} variant="success" >
                                  Vérifier
                              </Button>
                          </Col>
                        </Row>
                      ):("")}
                    </form>
                    </div>
                  </div>
 
                    </div>
                <div className='col-lg-3 col-md-12'></div>
            </div>
            

            {/* AFFICHAGE DES INFORMATIONS */}
            {infosOtherUser? (
              <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                <div className='cryptocurrency-slides'>
                  <div className='single-cryptocurrency-box'>

                    {/* AFFICHAGE DES TEXTES */}
                    <div className={toggleState === 3}>

                    {infosOtherUser?.entreprise ? (
                        // <p className="gr-text-8 " id="addon-wrapping">
                        //       Nom de l'entreprise : {infosOtherUser?.entreprise}
                        // </p>
                        <p className="gr-text-8 colorRed text-center" >Les informations correspondantes sont pour l'entreprise {infosOtherUser?.entreprise} </p>

                      ) : (infosOtherUser?.firstName && infosOtherUser?.lastName && infosOtherUser?.codeTypeProfil=="part"?
                        (
                          <>
                            {!oneKycForParticular?.message ?(
                              <>
                                {oneKycForParticular?.validQuiz==1 && oneKycForParticular?.validQuizTwo==1 && oneKycForParticular?.validQuizFatca==1 && oneKycForParticular?.validIdentityOne==1 && oneKycForParticular.validPhotoWithDocument && oneKycForParticular?.validIdentity==1 && oneKycForParticular?.validResidence==1 && oneKycForParticular?.validPhoto==1 && oneKycForParticular?.validSignature==1 ?(
                                  <>
                                    <div className='row'>
                                      <div className='col-lg-6 col-md-6'>
                                          <b> Nom :</b><br/>
                                          {infosOtherUser?.lastName? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{infosOtherUser.lastName }</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}

                                      </div>
                                                          
                                      <div className='col-lg-6 col-md-6'>
                                          <b> Prénoms :</b><br/>
                                          {infosOtherUser?.firstName? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{infosOtherUser.firstName }</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}

                                      </div>
                                      <div className='col-lg-6 col-md-6 '>
                                          <b> Type de justificatif d'identité :</b><br/>
                                          {oneKycForParticular?.receiptType? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForParticular.receiptType }</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                      </div>

                                      <div className='col-lg-6 col-md-6 '>
                                          <b> Numéro du justificatif d'identité :</b><br/>
                                          {oneKycForParticular?.pieceNumber? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForParticular.pieceNumber }</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                      </div>

                                      <div className='col-lg-6 col-md-6 '>
                                          <b> Date d'expiration :</b><br/>
                                          {oneKycForParticular?.validityDate? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{formatDate(oneKycForParticular.validityDate) }</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                      </div>
                                    </div>

                                     {/* AFFICHAGE DES FICHIERS */}
                                    <div className=" row col-lg-12 col-md-12 justify-content-between">
                                      <div className='col-lg-6 col-md-6 text-center'>
                                          <b className='text-center'>Recto</b><br/>
                                          {/* Si le document est prise en photo */}
                                          {oneKycForParticular?.frontReceiptPhoto? 
                                                  <img src={oneKycForParticular?.frontReceiptPhoto} className="" width={'400'} height={'400'} alt="Recto"/> : 
                                                  // sinon
                                                  oneKycForParticular?.frontReceipt? (
                                                      <>
                                                          {/* Utilisation de la fonction isPdfLink pour vérifier si un lien est pour un fichier PDF */}
                                                          {isPdfLink(`${API_URL}/${oneKycForParticular?.frontReceipt}`) ? (
                                                              <>
                                                                  <div className="hero-btn  text-center ">
                                                                      <a
                                                                          className="nav-link btn btn-blue nav-link btn btn-outline-green"
                                                                          role="button"
                                                                          data-toggle="dropdown"
                                                                          aria-haspopup="true"
                                                                          aria-expanded="false"
                                                                          href={`${API_URL}/${oneKycForParticular?.frontReceipt}`} 
                                                                          target="_blank"
                                                                      >
                                                                      <p className="gr-text-8 bgColorblue text-white mb-0">
                                                                          <Icon icon="bx:show-alt" width="50" />
                                                                          Veuillez cliquer ici pour voir le fichier
                                                                                          </p>
                                                                      </a>
                                                                  </div>
                                                              </>
                                                          ) : (
                                                              <>
                                                                  <img src={`${API_URL}/${oneKycForParticular?.frontReceipt}`} className="" width={'400'} height={'400'} alt="Recto"/> :
                                                              </>
                                                          )}
                                                      </>
                                                  ):"Pas de recto justificatif"
                                          }
                                                              
                                      </div>

                                      <div className='col-lg-6 col-md-6 text-center'>
                                          <b className='text-center'>Verso</b><br/>
                                          {oneKycForParticular?.backReceiptPhoto? 
                                              <img src={oneKycForParticular?.backReceiptPhoto} className="" width={'400'} height={'400'} alt="Verso"/> : 
                                              oneKycForParticular?.backReceipt? 
                                              (
                                                  <>
                                                  {/* Utilisation de la fonction isPdfLink pour vérifier si un lien est pour un fichier PDF */}
                                                  {isPdfLink(`${API_URL}/${oneKycForParticular?.frontReceipt}`) ? (
                                                      <>
                                                          <div className="hero-btn  text-center ">
                                                              <a
                                                                  className="nav-link btn btn-blue nav-link btn btn-outline-green"
                                                                  role="button"
                                                                  data-toggle="dropdown"
                                                                  aria-haspopup="true"
                                                                  aria-expanded="false"
                                                                  href={`${API_URL}/${oneKycForParticular?.backReceipt}`} 
                                                                  target="_blank"
                                                              >
                                                              <p className="gr-text-8 bgColorblue text-white mb-0">
                                                                  <Icon icon="bx:show-alt" width="50" />
                                                                  Veuillez cliquer ici pour voir le fichier
                                                              </p>
                                                              </a>
                                                          </div>
                                                      </>
                                                  ) : (
                                                      <>
                                                          <img src={`${API_URL}/${oneKycForParticular?.backReceipt}`} className="" width={'400'} height={'400'} alt="Verso"/> 
                                                      </>
                                                  )}
                                              </>
                                              ):"Pas de recto justificatif"
                                          }
                                      </div>

                                      <div className='col-lg-6 col-md-6 text-center my-5'>
                                        <b className='text-center'>Photo</b><br/>
                                        {oneKycForParticular?.userPicture? <img src={oneKycForParticular?.userPicture} alt="Selfie" /> : "Aucune photo"}
                                      </div>

                                      <div className='col-lg-6 col-md-6 text-center my-5'>
                                        <b className='text-center'>Photo avec document d'identité</b><br/>
                                        {oneKycForParticular?.selfieWithDocument? <img src={oneKycForParticular?.selfieWithDocument} alt="Selfie" /> : "Aucune photo avec document"}
                                      </div>

                                      <div className='col-lg-6 col-md-6 text-center my-5'>
                                        <b className='text-center'>Signature</b><br/>
                                        {oneKycForParticular?.userSignature? <img src={oneKycForParticular?.userSignature} alt="Selfie" /> : "Aucune signature"}
                                      </div>

                                      <div className='col-lg-6 col-md-6 text-center my-5'>
                                        
                                        <b className='text-center'>Carte de l'emplacement</b><br/>
                                        {oneKycForParticular?.userSignature?(
                                          <MapComponent className="mb-5" latitude={parseFloat(oneKycForParticular?.latitude)} longitude={parseFloat(oneKycForParticular?.longitude)} />
                                        )
                                        // <Map latitude={parseFloat(oneKycForParticular?.latitude)} longitude={parseFloat(oneKycForParticular?.longitude)} />
                                        : "Aucune Carte de l'emplacemen"}
                                      </div>
                                    </div><br/>
                                
                                    {/* FIN */}
                                    <Row className="mb-5 mt-5 justify-content-center align-items-center ">
                                      <Col
                                          xs="6"
                                          md="6"
                                          lg="6"
                                          xl="6"
                                        className="order-lg-1 text-center"
                                      >
                                        {/* <a href='/profil/institution/depot-cash/'> */}
                                          <Button  className="text-white" onClick={handleWithdrawalShow}>
                                            Continuer vers le retrait
                                          </Button>
                                        {/* </a> */}
                                      </Col>
                                    </Row>
                                  </>
                                ):(<p className="gr-text-8 colorRed text-center">Le Kyc de cet utilisateur n'a pas encore été validé</p>)}
                              </>
                            ):(<p className="gr-text-8 colorRed text-center" id="addon-wrapping">Cet utilisateur n'a pas rempli le Kyc</p>)}
                          </>
                        ) : <p className="gr-text-8 colorRed text-center" id="addon-wrapping">{infosOtherUser?.message}</p>)}
                    </div>
                  </div>
                </div>
              </div>
            ) : ("")}
            {/* FIN */}
        </div>


        {/* ********************************************************************************** */}
              {/* MODAL DE TRANSFERT DE JETON VERS AUTRE COMPTE*/}
            {/* ********************************************************************************** */}
            <Modal show={showWithdrawal} className="mt-15" onHide={handleWithdrawalClose} style={{maxWidth: '1800px', width: '100%'}}>
                <Modal.Header closeButton id="bgcolor">
                <Modal.Title className="" >Retrait cash </Modal.Title>
                </Modal.Header>
                {/* <form > */}
                <Modal.Body>
                    
                    {/* Formulaire de la partie avec adresse blockchain  */}
                    <form onSubmit={handleSubmit}>
                        <div className="form-group my-6 ">
                          <label
                            htmlFor="montant"
                            className="gr-text-8 fw-bold text-blackish-blue"
                          >
                            Adresse bockchain du client <sup className="text-red">*</sup>

                          </label>
                          <input
                              className="form-control gr-text-11 border mt-3 bg-white"
                              type="text"
                              id="addressTo"
                              placeholder="Adresse blockchain du bénéficiaire"
                              required
                              disabled
                              value={infosOtherUser?.address}
                              // defaultValue={addressTo} 
                              // onChange={(event)=>setAddressTo(event.target.value)}
                              
                          />
                        </div>

                          <div className="form-group my-6 ">
                            <label
                              htmlFor="montant"
                              className="gr-text-8 fw-bold text-blackish-blue"
                            >
                              Montant à retirer <sup className="text-red">*</sup>
                            </label>
                            <div className="input-group flex-nowrap">
                            <input
                              className="form-control gr-text-11 border mt-3 bg-white"
                              type="number"
                              id="montant"
                              placeholder="Montant à retirer"
                              required
                              defaultValue={montantRetirer} 
                              onChange={(event)=>setMontantRetirer(event.target.value)}
                            />
                            <span className="input-group-text gr-text-11  mt-3" id="addon-wrapping">{symbolStablecoin}</span>

                            </div>
                          </div>

                          <div className="form-group my-6 ">
                            <label
                              htmlFor="montant"
                              className="gr-text-8 fw-bold text-blackish-blue"
                            >
                              Montant à retirer avec les frais <sup className="text-red">*</sup>
                            </label>
                            <div className="input-group flex-nowrap">
                            <input
                              className="form-control gr-text-11 border mt-3 bg-white"
                              type="number"
                              id="montant"
                              placeholder="Montant reçu"
                              required
                              disabled={true}
                              value={montantRetirerAvecFrais} 
                              // defaultValue={montantRecu} 
                              // onChange={(event)=>setMontantRecu(event.target.value)}
                            />
                            <span className="input-group-text gr-text-11  mt-3" id="addon-wrapping">{symbolStablecoin}</span>

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
                              <Button className="text-white " variant="danger" onClick={handleWithdrawalClose} >
                                Fermer
                              </Button>
                            </Col>

                            <Col
                                xs="6"
                                md="6"
                                lg="6"
                                xl="6"
                              className="order-lg-1 text-center"
                              
                            >
                              <Button variant="success" onClick={transferBatchWithBurn}  disabled={isLoggingIn} className="text-white" >
                                Retirer
                                {isLoggingIn === true ? (<i className="fas fa-spinner fa-spin fa-lg"></i>) : ("")}
                              </Button>
                            </Col>
                          </Row> 
                       
                    </form>
                </Modal.Body>
                
            </Modal>
            {/* *****************************************FIN****************************************** */}

    </>
  );
};

export default VerifyDocumentsRetrait;
