import React, { useState, useEffect, useCallback } from "react";
import { magic } from "../../../magic";
import { ethers } from "ethers";
import Swal from 'sweetalert2'


export default function CardPaiement() {
    const [provider, setProvider] = useState(null);
 
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


    //  *************************************************
      // FONCTION POUR PAYER LA FACTURE IMPOT
    //  *************************************************

    const  payerImpot = async () => {
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
      };

    //  *************************************************
      // FIN FONCTION POUR PAYER LA FACTURE IMPOT
    //  *************************************************




//  *************************************************
      // FONCTION POUR PAYER LA FACTURE DOUANE
    //  *************************************************

    const  payerDouane = async () => {
        // Connect web3
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
      };

    //  *************************************************
      // FIN FONCTION POUR PAYER LA FACTURE DOUANE
    //  *************************************************




//  *************************************************
      // FONCTION POUR PAYER LA FACTURE AMENDE
    //  *************************************************

    const  payerAmende = async () => {
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
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
      <div>
       
        <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg mx-auto rounded-xl bg-white">
          <div className="mt-4 p-4">
            <h1 className="text-xl font-semibold text-gray-700 text-center">
              PAIEMENTS
            </h1>

            
          </div>
        </div>

        <div className="row">
            <div className="col-lg-6 col-md-6 ml-3">
              <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg rounded-xl bg-white">
                    <div className="mt-4 p-4">
                        <p className="text-xl font-semibold text-gray-700 text-center">
                            Impôt foncier 
                        </p>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="row  mx-3">
                            <div className="col-lg-6 col-md-6  my-2 ">
                                <div className=" ">
                                    <input type="number" defaultValue={montantImpot}  placeholder="Montant E-WARI" aria-describedby="addon-wrapping  autoFocus" className="input input-sm input-bordered " disabled/>
                                    
                                    E-WARI
                                </div>
                            </div>
                           
                            <div className="col-lg-6 col-md-6   mb-3">
                                <button type="submit" onClick={payerImpot}  className="btn btn-success" >Payer</button>
                            </div>
                        </div>
                    </form>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 ml-3">
            <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg rounded-xl bg-white">
                    <div className="mt-4 p-4">
                        <p className="text-xl font-semibold text-gray-700 text-center">
                            Douane: La circulation des marchandises(le transit)
                        </p>
                    </div>
                    <form onSubmit={handleSubmitDouane}>
                        <div className="row  mx-3">
                            <div className="col-lg-6 col-md-6  my-2 ">
                                <div className=" ">
                                    <input type="number" defaultValue={montantDouane}  placeholder="Montant E-WARI" aria-describedby="addon-wrapping  autoFocus" className="input input-sm input-bordered " disabled/>
                                    E-WARI
                                </div>
                            </div>
                           
                            <div className="col-lg-6 col-md-6   mb-3">
                                <button type="submit" onClick={payerDouane}  className="btn btn-success" >Payer</button>
                            </div>
                        </div>
                    </form>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 ml-3">
            <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg rounded-xl bg-white">
                    <div className="mt-4 p-4">
                        <p className="text-xl font-semibold text-gray-700 text-center">
                            Amende d'excès de vitesse
                        </p>
                    </div>
                    <form onSubmit={handleSubmitAmende}>
                        <div className="row  mx-3">
                            <div className="col-lg-6 col-md-6  my-2 ">
                                <div className=" ">
                                    <input type="number" defaultValue={montantAmende}  placeholder="Montant E-WARI" aria-describedby="addon-wrapping  autoFocus" className="input input-sm input-bordered " disabled/>
                                    E-WARI
                                </div>
                            </div>
                           
                            <div className="col-lg-6 col-md-6   mb-3">
                                <button type="submit" onClick={payerAmende}  className="btn btn-success" >Payer</button>

                            </div>
                        </div>
                    </form>
              </div>
            </div>

           
        </div>
      </div>
      <div>

      </div>
    </div>
  );
}
