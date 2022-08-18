import React, { useState, useEffect, useCallback } from "react";
import { magic } from "../../../magic";
import { ethers } from "ethers";
import Swal from 'sweetalert2'
import Web3 from "web3";



// Avec Enerfip et Groupe Hydronéo, financez une centrale hydroélectrique construite cette année et située au Rwanda !

const Frais = () => {


    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const [provider, setProvider] = useState(null);

    // LES MONTANTS DES FACTURES
    const [montantSodeci, setMontantSodeci] = useState();
    const [montantCei, setMontantCei] = useState();
    const [montantScolarite, setMontantScolarite] = useState();
    const [montantContribueCrowdA, setMontantContribueCrowdA] = useState();
    const [montantContribueCrowdB, setMontantContribueCrowdB] = useState();


    // ADRESS DE RECEPTION
    let adresseToSODECI = "0x8fCb6Eb2d4188DB5551e6B22DaD2a1D9D8D24c80" //Adresse administrative
    let adresseToCIE = "0x8fCb6Eb2d4188DB5551e6B22DaD2a1D9D8D24c80" //Adresse administrative

    // Adresse administrative
    let adresseToAdministrative ="0x8fCb6Eb2d4188DB5551e6B22DaD2a1D9D8D24c80"

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


// **********************************************************************************
    // RECCUPERER LE MONTANT RECU PAR LE PORTEUR DU PROJET
// **********************************************************************************

    useEffect(() => {
        (async () => {
             if (!!magic && !!provider) {
                 const userMetadata = await magic.user.getMetadata();
                 const signer = provider.getSigner();
                 const network = await provider.getNetwork();
                
                 const web3 = new Web3(magic.rpcProvider)
                 const contract = new web3.eth.Contract(AbiEcfa, adresseEcfa)
                 const balanceCrowdA = await contract.methods.balanceOf(adresseToSODECI).call()
                 const balanceCrowdB = await contract.methods.balanceOf(adresseToCIE).call()
                 setMontantContribueCrowdA(balanceCrowdA/10**2)
                 setMontantContribueCrowdB(balanceCrowdB/10**2)
                 
 
             }
         })();
     }, [provider, magic]);


    // **********************************************************************************
        // RECCUPERER LE MONTANT RECU PAR LE PORTEUR DU PROJET
    // **********************************************************************************








    //  *************************************************
      // FONCTION POUR PAYER LA FACTURE SODECI
    //  *************************************************

    const  payerFactureSODECI = async () => {
        setIsLoggingIn(true);
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


        
      };

    //  *************************************************
      // FIN FONCTION POUR PAYER LA FACTURE SODECI
    //  *************************************************



//  *************************************************
      // FONCTION POUR PAYER LA FACTURE CIE
    //  *************************************************

    const  payerFactureCEI = async () => {
        setIsLoggingIn(true);

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

      
    };

  //  *************************************************
    // FIN FONCTION POUR PAYER LA FACTURE CIE
  //  *************************************************

  //  *************************************************
      // FONCTION de FRAIS SCOLARITE
    //  *************************************************

    const  payerFactureScolarite = async () => {
        setIsLoggingIn(true);

     try {
          // Connect web3
      const provider = await new ethers.providers.Web3Provider(magic.rpcProvider);
      const signer = await provider.getSigner();
      // let signer = wallet.connect(provider)
      console.log("signer", await signer.getBalance())

      // console.log("BALANCE",await signer.getAddress())

      const contract = await new ethers.Contract(
          adresseEcfa,
          AbiEcfa,
          signer
      );
  
      // Call a state-change method
      const montantParse = ethers.utils.parseUnits(montantScolarite, 2);
      console.log("montant parse",montantParse);
      await contract.transfer(adresseToAdministrative, montantParse).then((transferResult) => {
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

      
    };

  //  *************************************************
    // FIN FRAIS SCOLARITE
  //  *************************************************


    const handleSubmit = (e) =>{
      e.preventDefault()
    }

    const handleSubmitCei = (e) =>{
      e.preventDefault()
    }

    const handleSubmitScolarite = (e) =>{
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
                            Les Frais administratifs
                        </div>
                    </div>
                </div>
              </div>
              <div className='col-xl-3 col-lg-3 col-md-3 p-0'></div>
            </div>

            <div className='buy-sell-cryptocurrency-area pt-100 pb-70'>
                <div className='container'>
                    <div className='section-title'>
                        <h4>Payer vos frais de passport, CNI et de Casier judiciaire</h4>
                        <p>
                            Utilisez votre jeton E-WARI pour payer vos frais de passport, CNI et de Casier judiciaire en toute securité.
                        </p>
                    </div>
                    <div className='row justify-content-center'>
                        <div className='col-lg-4 col-md-6 col-sm-6'>
                            <div className='single-buy-sell-item'>
                                <img src='/images/ecfa/ecosysteme/administratives/administ1.jpg' width={200} alt='image' />
                                <h3>Frais de passeport</h3>
                                    <form data-toggle='validator' onSubmit={handleSubmit}>
                                        <input
                                            type='number'
                                            className='input-sodeci'
                                            placeholder='Montant E-WARI'
                                            name='sodeci'
                                            defaultValue={montantSodeci}
                                            onChange={(e)=>setMontantSodeci(e.target.value)}
                                            required
                                        /><br/>
                                        <button className='btn-box default-btn btn-sm my-3' disabled={isLoggingIn} onClick={payerFactureSODECI}>
                                            Payer frais de paaseport
                                        </button>
                                    </form>
                            </div>
                        </div>
                        <div className='col-lg-4 col-md-6 col-sm-6'>
                            <div className='single-buy-sell-item'>
                                <img src='/images/ecfa/ecosysteme/administratives/administ3.jpg' height="10" width={400} alt='image' />
                                <h3>Frais de CNI</h3>
                                    <form data-toggle='validator' onSubmit={handleSubmitCei}>
                                        <input
                                            type='number'
                                            className='input-sodeci'
                                            placeholder='Montant E-WARI'
                                            name='sodeci'
                                            defaultValue={montantCei}
                                            onChange={(e)=>setMontantCei(e.target.value)}
                                            required
                                        /><br/>
                                        <button className='btn-box default-btn btn-sm my-3' onClick={payerFactureCEI} disabled={isLoggingIn}>
                                           Payer frais de CNI
                                        </button>
                                    </form>
                            </div>
                        </div>
                        <div className='col-lg-4 col-md-6 col-sm-6'>
                            <div className='single-buy-sell-item'>
                                <img src='/images/ecfa/ecosysteme/administratives/administ6.jpg' height="10" width={400} alt='image' />
                                <h3>Frais casier judiciaire</h3>
                                    <form data-toggle='validator' onSubmit={handleSubmitScolarite}>
                                        <input
                                            type='number'
                                            className='input-sodeci'
                                            placeholder='Montant E-WARI'
                                            name='sodeci'
                                            defaultValue={montantScolarite}
                                            onChange={(e)=>setMontantScolarite(e.target.value)}
                                            required
                                        /><br/>
                                        <button className='btn-box default-btn btn-sm my-3' onClick={payerFactureScolarite} disabled={isLoggingIn}>
                                            Payer frais de casier
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
  
  export default Frais;
  