import React, { useState, useEffect, useCallback } from "react";
import { magic } from "../../../magic";
import { ethers } from "ethers";
import Swal from 'sweetalert2'



const CardPaiement = () => {

    const [isLoggingIn, setIsLoggingIn] = useState(false);



    const [provider, setProvider] = useState(null);
    const [currentAdresse, setCurrentAdresse] = useState();

 
    const [magicTest, setMagicTest] = useState(null);
    const [providerTest, setProviderTest] = useState(null);

    // LES MONTANTS DES FACTURES
    const [montantImpot, setMontantImpot] = useState("2000");
    const [montantDouane, setMontantDouane] = useState("1000");
    const [montantAmende, setMontantAmende] = useState("5000");


    // ADRESS DE RECEPTION
    let adresseToImpot = "0x23835bf85e5ef5fbe17335a6e75f46c450cbb494"
    let adresseToDouane = "0x23fd8fdbc00258ee29abcfe4ad94eaf19aed5453"
    let adresseToAmende = "0x6F0C34E57B7cEA603D0EfB8e7FafB3AEeD737160"

    // COMPOSANTS E-WARI
    let adresseEcfa = "0x762a7A1C4948c6ac617B635c1B44Bf434BD3284a";
    let AbiEcfa = [
        {
            "inputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "tokenOwner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "spender",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "tokens",
                    "type": "uint256"
                }
            ],
            "name": "Approval",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "value",
                    "type": "uint256"
                }
            ],
            "name": "Burn",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "tokens",
                    "type": "uint256"
                }
            ],
            "name": "Transfer",
            "type": "event"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "_totalSupply",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "tokenOwner",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "spender",
                    "type": "address"
                }
            ],
            "name": "allowance",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "remaining",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "spender",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokens",
                    "type": "uint256"
                }
            ],
            "name": "approve",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "success",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "tokenOwner",
                    "type": "address"
                }
            ],
            "name": "balanceOf",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "balance",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_value",
                    "type": "uint256"
                }
            ],
            "name": "burn",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "decimals",
            "outputs": [
                {
                    "internalType": "uint8",
                    "name": "",
                    "type": "uint8"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "mint",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "name",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "a",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "b",
                    "type": "uint256"
                }
            ],
            "name": "safeAdd",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "c",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "a",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "b",
                    "type": "uint256"
                }
            ],
            "name": "safeDiv",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "c",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "a",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "b",
                    "type": "uint256"
                }
            ],
            "name": "safeMul",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "c",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "a",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "b",
                    "type": "uint256"
                }
            ],
            "name": "safeSub",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "c",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "symbol",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "totalSupply",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokens",
                    "type": "uint256"
                }
            ],
            "name": "transfer",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "success",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokens",
                    "type": "uint256"
                }
            ],
            "name": "transferFrom",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "success",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ]

    useEffect(() => {

        if (!!magic) {
            const pt = new ethers.providers.Web3Provider(magic.rpcProvider);
            setProvider(pt);
        }
    }, [magic]);

    useEffect(() => {
        (async () => {
             if (!!magic && !!provider) {
                 const userMetadata = await magic.user.getMetadata();
                 const signer = provider.getSigner();
                 const network = await provider.getNetwork();
                 const userAddress = await signer.getAddress();
                 setCurrentAdresse(userAddress);
                 
 
             }
         })();
     }, [provider, magic]);


    //  *************************************************
      // FONCTION POUR PAYER LA FACTURE IMPOT
    //  *************************************************

    const  payerImpot = async () => {
        setIsLoggingIn(true);
        if (currentAdresse && !currentAdresse=="") {

            try {
                // Connect web3
            const provider = await new ethers.providers.Web3Provider(magic.rpcProvider);
            const signer = await provider.getSigner();
            const contract = await new ethers.Contract(
                adresseEcfa,
                AbiEcfa,
                signer
            );
        
            // Call a state-change method
            const montantParse = ethers.utils.parseUnits(montantImpot, 2);
            await contract.transfer(adresseToImpot, montantParse).then((transferResult) => {
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
                        html:`<p>Le hash est : ${transferResult.hash}</p>`,
                        showConfirmButton: false,
                        timer: 20000
                    })
                    // Fin
        
                    // Actualiser après l'affichage 
                    setTimeout(() => {
                    window.location.reload()
                    }, 15000)
                    // Fin
                }
                })
                // FIN PARTIE SWITCH ALERT
            });
                
            } catch (error) {
                setIsLoggingIn(false);
            }
        }else{
            Swal.fire({
                position: 'top-center',
                icon: 'error',
                title: `Pas connecté`,
                html:`<p>Désolé, merci de vous connecter pour effectuer cette action.</p>`,
                showConfirmButton: false,
                timer: 20000
            })
        }
      };

    //  *************************************************
      // FIN FONCTION POUR PAYER LA FACTURE IMPOT
    //  *************************************************




//  *************************************************
      // FONCTION POUR PAYER LA FACTURE DOUANE
    //  *************************************************

    const  payerDouane = async () => {
        // Connect web3
        setIsLoggingIn(true);
        if (currentAdresse && !currentAdresse=="") {

            try {
                const provider = await new ethers.providers.Web3Provider(magic.rpcProvider);
                
                const signer = await provider.getSigner();
                const contract = await new ethers.Contract(
                    adresseEcfa,
                    AbiEcfa,
                    signer
                );
            
                // Call a state-change method
                const montantParse = ethers.utils.parseUnits(montantDouane, 2);
                await contract.transfer(adresseToDouane, montantParse).then((transferResult) => {
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
                            html:`<p>Le hash est : ${transferResult.hash}</p>`,
                            showConfirmButton: false,
                            timer: 20000
                        })
                        // Fin
            
                        // Actualiser après l'affichage 
                        setTimeout(() => {
                        window.location.reload()
                        }, 15000)
                        // Fin
                    }
                    })
                    // FIN PARTIE SWITCH ALERT
                });
            } catch (error) {
                setIsLoggingIn(false);
            }

        }else{
            Swal.fire({
                position: 'top-center',
                icon: 'error',
                title: `Pas connecté`,
                html:`<p>Désolé, merci de vous connecter pour effectuer cette action.</p>`,
                showConfirmButton: false,
                timer: 20000
            })
        }
      };

    //  *************************************************
      // FIN FONCTION POUR PAYER LA FACTURE DOUANE
    //  *************************************************




//  *************************************************
      // FONCTION POUR PAYER LA FACTURE AMENDE
    //  *************************************************

    const  payerAmende = async () => {
        setIsLoggingIn(true);
        if (currentAdresse && !currentAdresse=="") {

            try {
                // Connect web3
            const provider = await new ethers.providers.Web3Provider(magic.rpcProvider);
            
            const signer = await provider.getSigner();

            // let signer = wallet.connect(provider)
            const contract = await new ethers.Contract(
                adresseEcfa,
                AbiEcfa,
                signer
            );
        
            // Call a state-change method
            const montantParse = ethers.utils.parseUnits(montantAmende, 2);
            await contract.transfer(adresseToAmende, montantParse).then((transferResult) => {
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
                        html:`<p>Le hash est : ${transferResult.hash}</p>`,
                        showConfirmButton: false,
                        timer: 20000
                    })
                    // Fin
        
                    // Actualiser après l'affichage 
                    setTimeout(() => {
                    window.location.reload()
                    }, 15000)
                    // Fin
                }
                })
                // FIN PARTIE SWITCH ALERT
            });
            } catch (error) {
                setIsLoggingIn(false);
            }
        }else{
            Swal.fire({
                position: 'top-center',
                icon: 'error',
                title: `Pas connecté`,
                html:`<p>Désolé, merci de vous connecter pour effectuer cette action.</p>`,
                showConfirmButton: false,
                timer: 20000
            })
        }
      };

    //  *************************************************
      // FIN FONCTION POUR PAYER LA FACTURE AMENDE
    //  *************************************************


const handleSubmit = (e) =>{
    e.preventDefault()
  }

  const handleSubmitDouane = (e) =>{
    e.preventDefault()
  }

  const handleSubmitAmende = (e) =>{
    e.preventDefault()
  }
















    return (
      <>
        <div className='banner-wrapper-area'>
          <div className='container'>
            <div className='row align-items-center m-0'>
              <div className='col-xl-3 col-lg-3 col-md-3 p-0'></div>

              <div className='col-xl-6 col-lg-6 col-md-6 p-0'>
                <div className='banner-wrapper-content'>
                    <div className='currency-selection text-center'>
                        <div className=" text-center rounded-pill my-3 px-5   rounded-xl bg-primary text-white ">
                            PAIEMENTS
                        </div>
                    </div>
                </div>
              </div>
              <div className='col-xl-3 col-lg-3 col-md-3 p-0'></div>
            </div>

            <div className='buy-sell-cryptocurrency-area pt-100 pb-70'>
                <div className='container'>
                    <div className='section-title'>
                        <h4>Impôts / Douanes / Amendes </h4>
                        <p>
                            Utilisez vos jetons E-WARI  pour payer vos impôts, vos amendes et les taxes douanières
                        </p>
                    </div>
                    <div className='row justify-content-center'>
                        <div className='col-lg-4 col-md-6 col-sm-6'>
                            <div className='single-buy-sell-item'>
                                    <img src='/images/ecfa/ecosysteme/factures/impot2.jpg' width={190} height={10} alt='image' />
                                <h3>IMPÔTS</h3>
                                {/* <p>Impôt Foncier</p> */}
                                <form data-toggle='validator' onSubmit={handleSubmit}>
                                    <label className="mx-2">{montantImpot} E-WARI</label>
                                    <input
                                        type='hidden'
                                        className='input-sodeci'
                                        placeholder='2000'
                                        name='sodeci'
                                        defaultValue={montantImpot}
                                        required
                                    />
                                    <button className='btn-box default-btn btn-sm' disabled={isLoggingIn} onClick={payerImpot} >
                                        Payer
                                    </button>
                                </form>
                            </div>
                        </div>
                        <div className='col-lg-4 col-md-6 col-sm-6'>
                            <div className='single-buy-sell-item'>
                                    <img src='/images/ecfa/ecosysteme/factures/douane3.jpg' width={200} height={10} alt='image' />
                                <h3>DOUANES</h3>
                                {/* <p>La circulation des marchandises</p> */}
                                <form data-toggle='validator' onSubmit={handleSubmitDouane}>
                                    <label className="mx-2">{montantDouane} E-WARI</label>
                                    <input
                                        type='hidden'
                                        className='input-sodeci'
                                        placeholder='2000'
                                        name='sodeci'
                                        defaultValue={montantDouane} 
                                        required
                                    />
                                    <button className='btn-box default-btn btn-sm' disabled={isLoggingIn} onClick={payerDouane}>
                                        Payer
                                    </button>
                                </form>
                            </div>
                        </div>
                        <div className='col-lg-4 col-md-6 col-sm-6'>
                            <div className='single-buy-sell-item'>
                                    <img src='/images/ecfa/ecosysteme/factures/amende2.jpg' width={150} height={10} alt='image' />
                                <h3>AMENDES</h3>
                                {/* <p>Amende d'excès de vitesse</p> */}
                                <form data-toggle='validator' onSubmit={handleSubmitAmende}>
                                    <label className="mx-2">{montantAmende} E-WARI</label>
                                    <input
                                        type='hidden'
                                        className='input-sodeci'
                                        placeholder='2000'
                                        name='sodeci'
                                        defaultValue={montantAmende} 
                                        required
                                    />
                                    <button className='btn-box default-btn btn-sm' disabled={isLoggingIn} onClick={payerAmende}>
                                        Payer
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='shape13'>
                    <img src='/images/shape/shape13.png' alt='image' />
                </div>
            </div>
          </div>
        </div>
      </>
    );
  };
  
  export default CardPaiement;
  