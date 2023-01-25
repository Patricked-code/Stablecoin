import React, { useState, useEffect, useCallback } from "react";
import { magic } from "../../../magic";
import { ethers } from "ethers";
import Swal from 'sweetalert2'




const CardFacture = () => {


    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const [provider, setProvider] = useState(null);
    const [currentAdresse, setCurrentAdresse] = useState();


    // LES MONTANTS DES FACTURES
    const [montantSodeci, setMontantSodeci] = useState("2000");
    const [montantCei, setMontantCei] = useState("1000");

    // ADRESS DE RECEPTION
    let adresseToSODECI = "0xAFF309e33F09e1CBE3E11d923a00E71C0C4D9979"
    let adresseToCIE = "0xa59fa98287cb56e44b26a4b29e779534c5fcbcdd"

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
      // FONCTION POUR PAYER LA FACTURE SODECI
    //  *************************************************

    const  payerFactureSODECI = async () => {
        setIsLoggingIn(true);
        if (currentAdresse && !currentAdresse=="") {

            try {
                const provider = await new ethers.providers.Web3Provider(magic.rpcProvider);
                const signer = await provider.getSigner();
                console.log("signer", await signer.getBalance())
                const contract = await new ethers.Contract(
                    adresseEcfa,
                    AbiEcfa,
                    signer
                );
            
                // Call a state-change method
                const montantParse = ethers.utils.parseUnits(montantSodeci, 2);
                console.log("montant parse",montantParse);
                await contract.transfer(adresseToSODECI, montantParse).then((transferResult) => {
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
      // FIN FONCTION POUR PAYER LA FACTURE SODECI
    //  *************************************************



//  *************************************************
      // FONCTION POUR PAYER LA FACTURE CIE
    //  *************************************************

    const  payerFactureCEI = async () => {
        setIsLoggingIn(true);
        if (currentAdresse && !currentAdresse=="") {

            try {
                // Connect web3
            const provider = await new ethers.providers.Web3Provider(magic.rpcProvider);
            console.log("ok 1")
            const signer = await provider.getSigner();
            // let signer = wallet.connect(provider)
            console.log("signer", await signer.getBalance())

            // console.log("BALANCE",await signer.getAddress())

            const contract = await new ethers.Contract(
                adresseEcfa,
                AbiEcfa,
                signer
            );
            console.log("ok 2")
        
            // Call a state-change method
            const montantParse = ethers.utils.parseUnits(montantCei, 2);
            console.log("ok 3")

            console.log("montant parse",montantParse);
            await contract.transfer(adresseToCIE, montantParse).then((transferResult) => {
            console.log("ok 4")

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
    // FIN FONCTION POUR PAYER LA FACTURE CIE
  //  *************************************************


    const handleSubmit = (e) =>{
      e.preventDefault()
    }

    const handleSubmitCei = (e) =>{
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
                    <div className=' text-center'>
                        <div className=" text-center rounded-pill my-3 px-5   rounded-xl bg-primary text-white ">
                            FACTURES
                        </div>
                    </div>
                </div>
              </div>
              <div className='col-xl-3 col-lg-3 col-md-3 p-0'></div>
            </div>

            <div className='buy-sell-cryptocurrency-area pt-100 pb-70'>
                <div className='container'>
                    <div className='section-title'>
                        <h4>Payez vos factures en toute sécurité</h4>
                        <p>
                            Utilisez vos jetons E-WARI pour payer vos factures en toute sécurité. 
                        </p>
                    </div>
                    <div className='row justify-content-center'>
                        <div className='col-lg-4 col-md-6 col-sm-6'>
                            <div className='single-buy-sell-item'>
                                    <img src='/images/ecfa/ecosysteme/factures/sodeci1.jpeg' width={150} alt='image' />
                                <h3>FACTURE SODECI</h3>

                                <form data-toggle='validator' onSubmit={handleSubmit}>
                                    <label className="mx-2">{montantSodeci} E-WARI</label>
                                    <input
                                        type='hidden'
                                        className='input-sodeci'
                                        placeholder='2000'
                                        name='sodeci'
                                        defaultValue={montantSodeci}
                                        required
                                    />
                                    <button className='btn-box default-btn btn-sm' disabled={isLoggingIn} onClick={payerFactureSODECI}>
                                        Payer
                                    </button>
                                </form>
                            </div>
                        </div>
                        <div className='col-lg-4 col-md-6 col-sm-6'>
                            <div className='single-buy-sell-item'>
                                    <img src='/images/ecfa/ecosysteme/factures/cie1.jpg' height="10" width={150} alt='image' />
                                <h3>FACTURE CIE</h3>
                                
                                <form data-toggle='validator' onSubmit={handleSubmitCei}>
                                    <label className="mx-2">{montantCei} E-WARI</label>
                                    <input
                                        type='hidden'
                                        className='input-sodeci'
                                        placeholder='2000'
                                        name='sodeci'
                                        defaultValue={montantCei}
                                        required
                                    />
                                    <button className='btn-box default-btn btn-sm' onClick={payerFactureCEI} disabled={isLoggingIn}>
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
  
  export default CardFacture;
  