import React, { useState, useEffect, useCallback } from "react";
import { magic } from "../../magic";
import { ethers } from "ethers";
import Loading from "../../components/loading";
import Router from "next/router";
import Swal from 'sweetalert2'
import Web3 from "web3";



export default function transfer() {

    // TOKEN
    const [currentAdresse, setCurrentAdresse] = useState("...");
    const [balance, setBalance] = useState(0);
    const [symbol, setSymbol] = useState(null);

    const [cfaContract, setCfaContract] = useState();
    const [userMetadata, setUserMetadata] = useState();



    // TOKEN ENVOYER VERS AUTRE ADRESSE
    const [adresseTo, setAdresseTo] = useState(null);
    const [montantSaisiForTo, setMontantSaisiForTo] = useState();

    //   FORM
    const [montantSaisi, setMontantSaisi] = useState();

    const [provider, setProvider] = useState(null);




    //   const contractAdress = "0x6C8a01097195A19EbBeFf5602555a946AEC768cf";
    let priv_key = "58daac6cd25ffc439211c40ffc0b4600e95dbe89486e037259e4295563c117ce";
    let Rpcprovider = "https://rpc.testnet.moonbeam.network";

    let adresseEcfa = "0x762a7A1C4948c6ac617B635c1B44Bf434BD3284a";
    const AbiEcfa = [
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
                //const userBalance = ethers.utils.formatEther(await provider.getBalance(userAddress))

                const web3 = new Web3(magic.rpcProvider)
                const contract = new web3.eth.Contract(AbiEcfa, adresseEcfa)
                const balanceECFA = await contract.methods.balanceOf(userAddress).call()
                const symbole = await contract.methods.symbol().call()
                setSymbol(symbole)
                setBalance(balanceECFA / 10 ** 2)

            }
        })();
    }, [provider, magic]);

    // hooks
    useEffect(async () => {
        const magicIsLoggedin = await magic.user.isLoggedIn();
        if (magicIsLoggedin) {
        magic.user.getMetadata().then(setUserMetadata);
        const provider = new ethers.providers.Web3Provider(magic.rpcProvider);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
            adresseEcfa,
            AbiEcfa,
            signer
        );

        //   LES COMPOSANT E-WARI
        const userAdress = await signer.getAddress();
        console.log(userAdress)
        setCurrentAdresse(userAdress)
        setCfaContract(contract);
        //   FIN

        } else {
            setTimeout(() => {
                window.location.reload()
                Router.push("/");
        
               }, 1)
        }
    }, []);

  // functions
  const sell_tokenThree = async () => {
    try {
      console.log("do somethong to send BCFA to your friends ");
      const mountWei = ethers.utils.parseUnits(montantSaisiForTo, 2);
      await cfaContract.transfer(adresseTo, mountWei).then((transferResult) => {
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
      throw error;
    }
  }

  //  ******************************************
    // ACHAT TOKEN ERC20 UTILISATEUR
    // ******************************************

    async function send_token() {
        let wallet = await new ethers.Wallet(priv_key)
        const provider = await new ethers.providers.JsonRpcProvider(Rpcprovider);
        let walletSigner = await wallet.connect(provider)

        if (adresseEcfa) {
            //instanciation du contract (erc20 custom)
            let contract = await new ethers.Contract(
                adresseEcfa,
                AbiEcfa,
                walletSigner
            )

            //on parse le montant recuperé dans le champ
            let numberOfTokens = await ethers.utils.parseUnits(montantSaisi, 2)
            console.log(`numberOfTokens: ${numberOfTokens}`)

            //   MINTER
            await contract.mint(numberOfTokens);

            //execution du transfert
            await contract.transfer(currentAdresse, numberOfTokens).then((transferResult) => {
                console.dir(transferResult)
                // alert(`Transfert réussi. le hash est ${transferResult.hash}`)
                //   Router.push('/profil/')

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
        } else {
            //   console.log("l'adress nexiste pas");
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: "désolé, votre adresse n'existe pas!",
            })
        }
    }
    //   FIN ACHAT TOKEN ERC20 UTILISATEUR


    

  const handleSubmit = (e) => {
    e.preventDefault()
    }

    const handleSubmitTwo = (e) => {
    e.preventDefault()

    }
 

  // template
  return userMetadata ? (

    <>
         <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <div>

                <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg mx-auto rounded-xl bg-white">
                    <div className="mt-4 p-4">
                        <h1 className="text-xl font-semibold text-gray-700 text-center">
                            Profil
                        </h1>
                    </div>
                </div>

                <div className="row">
                    <div className="col-lg-6 col-md-6 ml-3">
                        <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg rounded-xl bg-white">
                            <div className="mt-4 p-4">
                                <p className="text-xl font-semibold text-gray-700 text-center">
                                    Mon solde : {balance} {symbol}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-6 col-md-6 ml-3">
                        <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                            <div className="mt-4 p-4">
                                <p className="text-xl font-semibold text-gray-700 text-center">
                                    Mon adresse : {currentAdresse}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-12 col-md-12 ml-3">
                    <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                        <div className="row " >
                            <div className="col-lg-6 col-md-6">
                                <div className="mt-4 p-4">
                                    <p className="text-xl font-semibold text-gray-700 text-center">
                                        Obtenir des E-WARI
                                    </p>
                                </div>
                                <div className="mb-3 ml-3">

                                    <form className="mx-3" onSubmit={handleSubmit}>
                                        <div className="row ml-3">
                                            <div className="col-lg-6 col-md-6 mb-3">
                                                <div className="input-group flex-nowrap">
                                                    <span className="input-group-text" id="addon-wrapping">E-WARI</span>
                                                    <input type="number" defaultValue={montantSaisi} onChange={(e) => setMontantSaisi(e.target.value)} placeholder="Montant E-WARI" aria-describedby="addon-wrapping  autoFocus" className="input input-sm input-bordered form-control" />
                                                </div>
                                            </div>
                                            <div className="col-lg-6 col-md-6">
                                                <button type="submit" onClick={send_token} className="btn btn-success">Effectuer transaction</button>
                                            </div>
                                        </div>
                                    </form>

                                </div>
                            </div>
                            <div className="col-lg-6 col-md-6">
                                <div className="mt-4 p-4">
                                    <p className="text-xl font-semibold text-gray-700 ">
                                        Transferer des E-WARI
                                    </p>
                                </div>

                                <form onSubmit={handleSubmitTwo}>
                                    <div className="row  mx-3">
                                        {/* <div className="col-lg-12 col-md-12 mx-3 "> */}

                                        <div className="col-lg-6 col-md-6 text-center my-2 ">
                                            <div className="input-group ">
                                                <input type="number" defaultValue={montantSaisiForTo} onChange={(e) => setMontantSaisiForTo(e.target.value)} placeholder="Montant E-WARI" aria-describedby="addon-wrapping  autoFocus" className="input input-sm input-bordered form-control" />
                                            </div>
                                        </div>
                                        <div className="col-lg-6 col-md-6 my-2 text-center">
                                            <div className="input-group flex-nowrap">
                                                <input type="text" defaultValue={adresseTo} onChange={(e) => setAdresseTo(e.target.value)} placeholder="Adresse bénéfiaire" aria-describedby="addon-wrapping  autoFocus" className="input input-sm input-bordered form-control" />
                                            </div>
                                        </div>

                                        {/* </div> */}
                                        <div className="col-lg-6 col-md-6   mb-3">
                                            <button type="submit" className="btn btn-success" onClick={sell_tokenThree}>Transferer</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div>

            </div>
        </div>
    </>
    
  ) : (
    <Loading />
  );
}
