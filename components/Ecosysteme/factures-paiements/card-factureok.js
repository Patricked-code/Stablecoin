import React, { useState, useEffect, useCallback } from "react";
import { magic } from "../../../magic";
import { ethers } from "ethers";
import Swal from 'sweetalert2'


export default function CardFacture() {
    const [provider, setProvider] = useState(null);

    // LES MONTANTS DES FACTURES
    const [montantSodeci, setMontantSodeci] = useState("2000");
    const [montantCei, setMontantCei] = useState("1000");

    // ADRESS DE RECEPTION
    let adresseToSODECI = "0xAFF309e33F09e1CBE3E11d923a00E71C0C4D9979"
    let adresseToCIE = "0xa59fa98287cb56e44b26a4b29e779534c5fcbcdd "

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
      // FONCTION POUR PAYER LA FACTURE SODECI
    //  *************************************************

    const  payerFactureSODECI = async () => {
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


        
      };

    //  *************************************************
      // FIN FONCTION POUR PAYER LA FACTURE SODECI
    //  *************************************************



//  *************************************************
      // FONCTION POUR PAYER LA FACTURE CIE
    //  *************************************************

    const  payerFactureCEI = async () => {
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
      const montantParse = ethers.utils.parseUnits(montantCei, 2);
      console.log("montant parse",montantParse);
      await contract.transfer(adresseToCIE, montantParse).then((transferResult) => {
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
    // FIN FONCTION POUR PAYER LA FACTURE CIE
  //  *************************************************


    const handleSubmit = (e) =>{
      e.preventDefault()
    }

    const handleSubmitCei = (e) =>{
      e.preventDefault()
    }



 

  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
      <div>
       
        <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg mx-auto rounded-xl bg-white">
          <div className="mt-4 p-4">
            <h1 className="text-xl font-semibold text-gray-700 text-center">
              FACTURES
            </h1>

            
          </div>
        </div>

        <div className="row">
        <div className="col-lg-3 col-md-3 ml-3"></div>

            <div className="col-lg-6 col-md-6 ml-3">
                <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg rounded-xl bg-white">
                    <div className="mt-4 p-4">
                        <p className="text-xl font-semibold text-gray-700 text-center">
                          SODECI
                        </p>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="row  mx-3">
                        <div className="col-lg-6 col-md-6 my-2 text-center">
                                <div className="">
                                    <select aria-describedby="addon-wrapping  autoFocus" className="input input-sm input-bordered ">
                                        <option value={1}>Janvier</option>
                                        <option value={2}>Février</option>
                                        <option value={3}>Mars</option>
                                        <option value={4}>Avril</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-6  my-2 ">
                                <div className=" ">
                                    <input type="number" defaultValue={montantSodeci}  placeholder="Montant E-WARI" aria-describedby="addon-wrapping  autoFocus" className="input input-sm input-bordered " disabled/>
                                    E-WARI
                                </div>
                            </div>
                           
                            <div className="col-lg-6 col-md-6   mb-3">
                                <button type="submit" onClick={payerFactureSODECI} className="btn btn-success" >Payer</button>
                            </div>

                        </div>
                    </form>
                </div>
                
            </div>
        <div className="col-lg-3 col-md-3 ml-3"></div>


            {/* <div className="col-lg-6 col-md-6 ml-3">
                <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg rounded-xl bg-white">
                    <div className="mt-4 p-4">
                        <p className="text-xl font-semibold text-gray-700 text-center">
                            CIE 
                        </p>
                    </div>
                    <form onSubmit={handleSubmitCei}>
                        <div className="row  mx-3">
                        <div className="col-lg-6 col-md-6 my-2 text-center">
                                <div className="">
                                    <select aria-describedby="addon-wrapping  autoFocus" className="input input-sm input-bordered ">
                                        <option value={1}>Janvier</option>
                                        <option value={2}>Février</option>
                                        <option value={3}>Mars</option>
                                        <option value={4}>Avril</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-6  my-2 ">
                                <div className=" ">
                                    <input type="number" value={montantCei}   placeholder="Montant E-WARI" aria-describedby="addon-wrapping  autoFocus" className="input input-sm input-bordered " disabled/>
                                    E-WARI
                                </div>
                            </div>
                           
                            <div className="col-lg-6 col-md-6 mb-3">
                                <button type="submit" onClick={payerFactureCEI}  className="btn btn-success" >Payer</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div> */}
        </div>
      </div>
      <div>

      </div>
    </div>
  );
}
