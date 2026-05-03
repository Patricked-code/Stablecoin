import { useState, useEffect } from 'react';
import React from "react";
import axios from 'axios';
import Link from 'next/link';
import { Icon } from '@iconify/react';


// Pour Magic
import { magic } from "../../../magic";
import { ethers } from "ethers";
import Loading from "../../../components/loading";
import Router from "next/router";
import Swal from 'sweetalert2';
import Web3 from "web3";

// FIN



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
    Modal,
    Row,
    Col,
  } from "reactstrap";

// FIN

const CardA = () => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API
     // Variable de l'api key de stablecoin
     const API_KEY_STABLECOIN = process.env.NEXT_PUBLIC_API_KEY_STABLECOIN


    // MODALS
    const [modalDefaultOpen, setModalDefaultOpen] = React.useState(false);
    const [modalNotificationOpen, setModalNotificationOpen] = React.useState(
        false
    );
    // Banque
    const [modalFormOpen, setModalFormOpen] = React.useState(false);
    // Mobile
    const [modalFormOpenMobile, setModalFormOpenMobile] = React.useState(false);

    // Achat
    const [modalFormOpenAchat, setModalFormOpenAchat] = React.useState(false);

    // Retrait
    const [modalFormOpenRetrait, setModalFormOpenRetrait] = React.useState(false);
    


    // FIN

    //   Banque
const [bankName, setBankName] = useState("")
const [iban, setIban] = useState("")
const [countrie, setCountrie] = useState("")
const [countrieMobile, setCountrieMobile] = useState("")
const [countrieBank, setCountrieBank] = useState("")
const [isoPays, setIsoPays] = useState("")



//   Mobile
const [accountName, setAccountName] = useState()
const [numberMobile, setNumberMobile] = useState()
const [networkMobile, setNetworkMobile] = useState()


const [isLoggingIn, setIsLoggingIn] = useState(false);

// Pays
const [allCountry, setAllCountry] = useState("");

// Banques
const [allBank, setAllBank] = useState([])
const [bankByCountry, setBankByCountry] = useState({})

// Operateurs
const [allOperators, setAllOperators] = useState([])


// Retrait
const [montantRetrait, setMontantRetrait] = useState(0)
const [montantRetraitCalculer, setMontantRetraitCalculer] = useState()


// Achat
const [montantAchat, setMontantAchat] = useState(0)






    
  const [name, setName] = useState('Bitcoin');
  const [nameTwo, setNameTwo] = useState('USD');

//   Variables de l'Utilisateur connecté
  const [userDataSession, setUserDataSession] = useState()
// Fin

  //api data
  const [newData, setnewData] = useState([]);

  //converter hook
  const [conversionValue, setConversionValue] = useState('');
  const [cryptoQuantity, setcryptoQuantity] = useState(1);
  const [coinSymbol, setcoinSymbol] = useState('BTC');

  const [image, setImage] = useState(
    '/images/cryptocurrency/cryptocurrency2.png'
  );
  const [imageTwo, setImageTwo] = useState(
    '/images/cryptocurrency/cryptocurrency1.png'
  );

  const [clicked, setClicked] = useState(false);
  const [toggleState, setToggleState] = useState(false);
  const [toggleStateTwo, setToggleStateTwo] = useState(false);

  // PARTIE MAGIC
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
    const [tokenCurrent, setTokenCurrent] = useState();

    // State des infos user
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [mobile, setMobile] = useState('');
    const [currentAddress, setCurrentAdress] = useState('');
    const [codeCountry, setCodeCountry] = useState('');
    // Fin

    // Pour afficher les informations venant de la base dedonnée
    // const [userData, setUserData] = useState();

    //   const contractAdress = "0x6C8a01097195A19EbBeFf5602555a946AEC768cf";
    let priv_key = "0x0000000000000000000000000000000000000000000000000000000000000001";
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
                // RECUPERATION DES INFORMATIONS QUI CONCERNENT MAGIC
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

                // FIN
            
               

        }

        })();
    }, [provider, magic]);


    // hooks
    useEffect(async () => {
        const magicIsLoggedin = await magic.user.isLoggedIn();
        if (magicIsLoggedin) {
        // const userMetadata = magic.user.getMetadata();
        magic.user.getMetadata().then(setUserMetadata);
        const provider = new ethers.providers.Web3Provider(magic.rpcProvider); //MODIFIER 
        const signer = provider.getSigner();
        const userAdress = await signer.getAddress();
        setCurrentAdresse(userAdress)

        //   LES COMPOSANT E-WARI
        const contract = new ethers.Contract(
            adresseEcfa,
            AbiEcfa,
            signer
        );
        setCfaContract(contract);
        //   FIN
        

        } else {
        // Router.push("/");
        }
    }, []);



    // Obtenir un utilisateur en fonction de son email 
    useEffect(async () => {
        if (userMetadata?.email) {
            const getUser = async () => {
                const result = await fetch(`${API_URL}/api/user/find-user-by-email?email=${userMetadata?.email}`, {
                    headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': `${API_KEY_STABLECOIN}`,
                    },
                })
                  .then((result) => result.json())
                  .then((user) => {
                    setUserDataSession(user)
                  }) 
            };
            getUser();
            // Fin
        }
    }, [userDataSession,userMetadata]);





  // functions de transfert
  const sell_tokenThree = async () => {
    try {
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
    // FONCTION OBTENIR DES JETONS
    // ******************************************

    async function send_token() {
        let wallet = await new ethers.Wallet(priv_key)
        const provider = await new ethers.providers.JsonRpcProvider(Rpcprovider); //Qui a remplacé Rpcprovider
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
                getJetonDev()
                console.dir(transferResult)
                // alert(`Transfert réussi. le hash est ${transferResult.hash}`)
                //   Router.push('/profil/dashboard/')

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

    


    const [unikUserData, setUnikUserData] = useState([]);


    // Obtenir mes infos
    // useEffect(async() => {
    //     const token = localStorage.getItem('tokenEnCours')
    //     console.log("token meoo=>",token)
        
    //         const getMeSession = async () => {
    //         const res = await fetch(`${API_URL}/api/user`, {
    //             headers: {
    //             'Content-Type': 'application/json',
                    // 'x-api-key': `${API_KEY_STABLECOIN}`,
    //             Authorization:  `Bearer ${token}`
    //             },
    //         })
    //             .then((res) => res.json())
    //             .then((userDataSession) => {
    //             setUserDataSession(userDataSession)
    //             }) 

            

    //         };
            
    //         await getMeSession();
    // }, []);

    // Fin Obtenir mes infos



    // RECUPERER TOUS LES PAYS
    useEffect(async() => {
        const token = localStorage.getItem('tokenEnCours')
        console.log("token pays=>",token)
        
            const getAllCountries = async () => {
            const resCountry = await fetch(`${API_URL}/api/country/find-all`, {
                headers: {
                'Content-Type': 'application/json',
                'x-api-key': `${API_KEY_STABLECOIN}`,
                Authorization:  `Bearer ${token}`,

                },
            })
                .then((resCountry) => resCountry.json())
                .then((allCountry) => {
                setAllCountry(allCountry)
                }) 

            };
            
            await getAllCountries();
    }, []);
    // FIN


    // RECUPERER TOUTES LES BANQUES 
    useEffect(async() => {
        const token = localStorage.getItem('tokenEnCours')
        console.log("token me=>",token)
        
            const getAllBank = async () => {
            const resBank = await fetch(`${API_URL}/api/bank/find-all`, {
                headers: {
                'Content-Type': 'application/json',
                'x-api-key': `${API_KEY_STABLECOIN}`,
                Authorization:  `Bearer ${token}`,
                },
            })
                .then((resBank) => resBank.json())
                .then((data) => {
                setAllBank(data)
                }) 
            };
            // console.log("Banques =>",allBank)
            await getAllBank();
    }, []);
    // FIN


    // RECUPERER TOUS LES OPERATEURS
    useEffect(async() => {
        const token = localStorage.getItem('tokenEnCours')
        console.log("token me=>",token)
        
            const getAllOperators = async () => {
            const resOperator = await fetch(`${API_URL}/api/operator/find-all-Operators`, {
                headers: {
                'Content-Type': 'application/json',
                'x-api-key': `${API_KEY_STABLECOIN}`,
                Authorization:  `Bearer ${token}`,
                },
            })
                .then((resOperator) => resOperator.json())
                .then((data) => {
                setAllOperators(data)
                }) 
            };
            console.log("Operator =>",allOperators)
            await getAllOperators();
    }, []);
    // FIN


    // AJOUT D'UN COMPTE BANCAIRE
    const addAccountBank= async(event) =>{
        event.preventDefault();

        // Obtenir le Id
        const userId = localStorage.getItem('idEnCours');

        const dataa = {
            bankName:bankName,
            iban:iban,
            countrie:countrieBank,
            status:true,
            userId:userId
    
        }
    
        console.log("city =>",dataa.city)
    
        // getter
        const token = localStorage.getItem('tokenEnCours');
        console.log("token Login Update =>", token)

        const res = await fetch(`${API_URL}/api/acount-bank/add-account-bank`, {
              method:"POST",
              body: JSON.stringify(dataa),
              headers: {
                  'Content-Type': 'application/json',
                'x-api-key': `${API_KEY_STABLECOIN}`,
                  Authorization:  `Bearer ${token}`
              }
          })
          .then(res=>{
          const data =  res.json();
          console.log("data", data)
        
            console.log("Succès update=>",dataa)
    
            Swal.fire({
              position: 'center',
              icon: 'success',
              html: "<p> Votre compte bancaire a été ajouté avec succès </p>" ,
              showConfirmButton: false,
              timer: 5000
            })
        //  Actualiser après l'affichage 
        setTimeout(() => {
            window.location.reload()

        }, 5000) 
        // Fin
        })
        .catch(error => {
          //handle error
          console.log(error);
    
        });
    }
    // FIN

    // AJOUT D'UN COMPTE MOBILE MONEY
     const addAccountMobile = async(event) =>{
        event.preventDefault();

        // Obtenir le Id
        const userId = localStorage.getItem('idEnCours');

        const dataa = {
            networkMobile:networkMobile,
            countrie:countrieMobile,
            numberMobile:numberMobile,
            status:true,
            userId:userId
    
        }
    
        console.log("city =>",dataa.city)
    
        // getter
        const token = localStorage.getItem('tokenEnCours');
        console.log("token Login Update =>", token)

        const res = await fetch(`${API_URL}/api/mobile/add-mobile`, {
              method:"POST",
              body: JSON.stringify(dataa),
              headers: {
                  'Content-Type': 'application/json',
                    'x-api-key': `${API_KEY_STABLECOIN}`,
                  Authorization:  `Bearer ${token}`
              }
          })
          .then(res=>{
          const data =  res.json();
          console.log("data", data)
        
            console.log("Succès update=>",dataa)
    
            Swal.fire({
              position: 'center',
              icon: 'success',
              html: "<p> Votre compte mobile money a été ajouté avec succès </p>" ,
              showConfirmButton: false,
              timer: 5000
            })
         // Actualisation et redirection
            setTimeout(() => {
                window.location.reload()

            }, 5000) 
         
        //   Router.push("/account/activated"); 
        // Fin
        })
        .catch(error => {
          //handle error
          console.log(error);
    
        });
        
    }

    // FIN

      

    

  const handleSubmit = (e) => {
    e.preventDefault()
    }

    const handleSubmitTwo = (e) => {
    e.preventDefault()

    }
  // FIN PARTIE MAGIC

  const toggleTabOne = () => {
    setToggleState(!toggleState);
  };

  const toggleSelected = (cat, index) => {
    if (clicked === index) {
      return setClicked(null);
    }
    setClicked(index);
    setName(cat.name);
    setImage(cat.image);
    setcoinSymbol(cat.symbol.toUpperCase());
  };

  useEffect(() => {
    const getCoins = async () => {
      const { data } = await axios.get(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false'
      );
      setnewData(data);
    };
    getCoins();
  }, []);

  useEffect(() => {
    const getData = async () => {
      const { data } = await axios.get(
        `https://min-api.cryptocompare.com/data/price?fsym=${coinSymbol}&tsyms=USD`
      );

      setConversionValue(data.USD);
    };
    getData();
  }, [coinSymbol]);



  // FONCTION POUR OBTENU DES DEV
async function getJetonDev() {
	const web3 = new Web3(Rpcprovider)
	const signer = web3.eth.accounts.privateKeyToAccount(priv_key);
	web3.eth.accounts.wallet.add(signer);
  
	// Estimatic the gas limit
	var limit = web3.eth.estimateGas({
	  from: signer.address, 
	  to: currentAdresse,
	  value: web3.utils.toWei("0.001")
	  }).then(console.log);
	  
	// Creating the transaction object
	const tx = {
	  from: signer.address,
	  to: currentAdresse,
	  value: web3.utils.numberToHex(web3.utils.toWei('0.001')),
	  gas: web3.utils.toHex(limit),
	  nonce: web3.eth.getTransactionCount(signer.address),
	  maxPriorityFeePerGas: web3.utils.toHex(web3.utils.toWei('2', 'gwei')),
	  chainId: 1287,                  
	  type: 0x2
	};
	console.log("tx", tx)
  
	const signedTx = await web3.eth.accounts.signTransaction(tx, signer.privateKey)
	console.log("Raw transaction data: " + signedTx.rawTransaction)
  
	// Sending the transaction to the network
	const receipt = await web3.eth
	  .sendSignedTransaction(signedTx.rawTransaction)
	  .once("transactionHash", (txhash) => {
		console.log(`Mining transaction ...`);
		console.log(txhash);
	  });
	// The transaction is now on chain!
	console.log(`Mined in block ${receipt.blockNumber}`);
  
  }

// FIN

 

//  FONCTION D'AJOUT D'UN NOUVEAU TOKEN SUR METAMASK
function watchToken() {
        
		ethereum.request({
			method: 'wallet_watchAsset',
			params: {
			type: 'ERC20',
			options: {
				address: String("0x762a7A1C4948c6ac617B635c1B44Bf434BD3284a"),
				symbol: String("ECFA"),
				decimals: String(2),
			},
			},
		})
	
}
// FIN






















  return (
    <>

      <div className='' >
        <div className=' mx-15'>
          <div className='py-10'>
            <h1 className='text-center'>Mon profil</h1>

            <div className='cryptocurrency-search-box'>
              <div className='row'>
                <div className='col-lg-6 col-md-6'>
                  <div className='currency-selection text-center'>
                    <div className="rounded-pill my-3 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-primary text-white ">
                    {currentAdresse}
                    </div>
                  </div>
                </div>

                <div className='col-lg-6 col-md-6'>
                  <div className='currency-selection text-center'>
                    <div className=" rounded-pill my-3 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-primary text-white">
                    Mon solde : {balance} E-WARI
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </div>
            {/* Bouton d'ajout du jeton E-WARI */}
            <div className='col-lg-12 col-md-12 row'>
            <div className='col-lg-3 col-md-3'></div>
                <div className='col-lg-6 col-md-6 text-center'>
                  <div className='currency-selection text-center'>
                    <div onClick={watchToken} className=" btn rounded-pill my-3 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-primary text-white">
                        Ajouter le jeton E-WARI à MetaMask
                    </div>
                  </div>
                </div>
            <div className='col-lg-3 col-md-3'></div>
            </div>
            {/* Fin */}

          <div className='banner-image'>
            {/* <img src='/images/banner/banner-img2.png' alt='image' /> */}
          </div>
        </div>
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

        <div className='cryptocurrency-search-box '>
            <div className='row'>
            <div className='col-lg-3 col-md-3'>
                <div className='currency-selection text-center'>
                    <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white ">
                        <div className='banner-image text-center'>
                            <img src='/images/ecfa/profil/avatar2.png' width={'200'}  alt='image' />
                            
                        </div>
                    </div>
                </div>
                <div className='mx-3'>
                <input type="file" className="form-control"/>
                {/* <button type="submit" className="btn btn-primary">Submit</button> */}
                </div><br/>
            </div>


            <div className='col-lg-4 col-md-4'>
                <div className='currency-selection '>
                    <div className="mx-2">
                        <div className='my-3'>

                            {/* Afficher les informations d'un seul utilisateur */}
                            <p className='mt-3'><b>Nom :</b> {userDataSession?.firstName}</p>
                            <p><b>Prénom :</b> {userDataSession?.lastName}</p>
                            <p><b>Numero :</b> {userDataSession?.mobile}</p>
                            {/* <p><b>pays :</b> {userDataSession?.pays}</p> */}
                            {userMetadata ? (
                            <small className='mb-5'><b>Email :</b>
                            {userMetadata.email}
                            </small>
                            ) :(
                                <Loading/>
                            )}
                            {/* Fin */}
                        </div>
                    </div>
                </div>
            </div>

            {/* Demander des E-WARI */}
            <div className='col-lg-5 col-md-5'>
                <div className='currency-selection text-center'>
                    <div className=" bg-white ">
                    {/* <div className="mb-3 ml-3"> */}
                      <br/>
                      <form className="" onSubmit={handleSubmit}>
                          <div className="row ml-2 my-3">
                              <div className="col-lg-6 col-md-6 mb-3 ml-2">
                                  <div className="input-group flex-nowrap">
                                      {/* <span className="input-group-text" id="addon-wrapping">E-WARI</span> */}
                                      <input type="number" defaultValue={montantSaisi} onChange={(e) => setMontantSaisi(e.target.value)} placeholder="Montant E-WARI" aria-describedby="addon-wrapping  autoFocus" className="input input-sm input-bordered form-control" />
                                  </div>
                              </div>
                              <div className="col-lg-6 col-md-6">
                                  <button type="submit" onClick={send_token} className="btn btn-success">Demander des E-WARI</button>
                              </div>
                          </div>
                      </form>

                  {/* </div> */}
                    </div>
                </div>

                {/* PARTIE Transferer des E-WARI */}
                <div className='currency-selection text-center'>
                    <div className=" bg-white">
                    {/* <div className="mb-3 ml-3"> */}
                      <br/>
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
                                        <div className="col-lg-12 col-md-12   mb-3">
                                            <button type="submit" className="btn btn-success" onClick={sell_tokenThree}>Transferer des E-WARI</button>
                                        </div>
                                    </div>
                                </form>

                  {/* </div> */}
                    </div>
                </div>


            </div>


            </div>
        </div>
        <div className='col-lg-12 col-md-12 row'>
                        <div className='col-lg-6 col-md-6 text-center'>
                        <div className='currency-selection text-center'>
                            <Link href='/account/twoEdition'>
                                <div className=" btn rounded-pill my-3 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-primary text-white">
                                    Mettre à jour le profil
                                </div>
                            </Link>
                        </div>
                        </div>
                    </div>
        {/* BON */}

        <div className='cryptocurrency-search-box mt-5'>
              <div className='row'>
                <div className='col-lg-6 col-md-6'>
                  <div className='currency-selection text-center'>
                        
                         {/* Bouton Compte Bancaire */}
                        <Button
                            block
                            color="primary"
                            onClick={() => setModalFormOpenMobile(true)}
                            type="button"
                        >
                            Compte mobile money
                        </Button>
                        {/* Fin */}

                        {/* <h3 className='text-center'>Numeros mobile</h3> */}
                        
                        <div className="m-4 ">
                            <table className="table">
                                <thead>
                                    <tr>
                                    <th scope="col">Pays</th>
                                    <th scope="col">Numero</th>
                                    <th scope="col">Réseau</th>
                                    <th scope="col">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                    <td>Côte d'Ivoire</td>
                                    <td>0978665566</td>
                                    <td>ORANGE</td>
                                    <td>
                                    <div className='btn btn-danger'>
                                        <Icon icon="bx:basket" />

                                        {/* Supprimer  */}
                                    </div>
                                    </td>
                                    </tr>
                                    <tr>
                                    <td>Mali</td>
                                    <td>0578665566</td>
                                    <td>MTN</td>
                                    <td>
                                        <div className='btn btn-danger'>
                                            <Icon icon="bx:basket" />

                                        {/* Supprimer  */}
                                        </div>
                                    </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                  </div>
                </div>

                <div className='col-lg-6 col-md-6'>
                  <div className='currency-selection text-center'>
                    
                    {/* Bouton Compte Bancaire */}
                    <Button
                    block
                    color="primary"
                    onClick={() => setModalFormOpen(true)}
                    type="button"
                    >
                        Compte Bancaire
                    </Button>
                    {/* Fin */}

                    <div className="m-4 ">
                        <table className="table">
                            <thead>
                                <tr>
                                <th scope="col">Pays</th>
                                <th scope="col">Banque</th>
                                <th scope="col">IBAN</th>
                                <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                <td>Côte d'Ivoire</td>
                                <td>BNI</td>
                                <td>
                                    <p>
                                    Y763...EYGHZ6UZSI
                                    </p>
                                </td>
                                <td>
                                <div className='btn btn-danger'>
                                    <Icon icon="bx:basket" />

                                    {/* Supprimer  */}
                                </div>
                                </td>
                                </tr>

                                <tr>
                                <td>Burkina Faso</td>
                                <td>NSIA</td>
                                <td>
                                    <p>
                                    Y763...EYGHZ6UZSI
                                    </p>
                                </td>
                                <td>
                                <div className='btn btn-danger'>
                                    <Icon icon="bx:basket" />

                                    {/* Supprimer  */}
                                </div>
                                </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* FIN */}


        <div className='cryptocurrency-search-box'>
            <div className='row'>
                    <div className='col-lg-4 col-md-4'>
                        <div className='currency-selection text-center'>
                            {/* <div className='btn btn-primary'>
                                Achat
                            </div> */}
                            {/* <h3 className='text-center'>Achat</h3> */}

                            <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                                <div className='cryptocurrency-slides'>
                                    <div className='single-cryptocurrency-box'>
                                        <div className='d-flex align-items-center'>
                                        <div className='bestseller-coin-image'>
                                            <img src="/images/ecfa/logo/logo_ewari1.jpg" className="rounded-circle"  alt='image' />
                                        </div>
                                        <div className='title'>
                                            <h3>Stablecoin E-WARI</h3>
                                        </div>
                                        </div>
                                        <div className='btn-box'>
                                        {/* <Link href='/#'>
                                            <a className='btn btn-success'>Achat</a>
                                        </Link> */}
                                         {/* Bouton Achat */}
                                        <Button
                                            block
                                            color="success"
                                            onClick={() => setModalFormOpenAchat(true)}
                                            type="button"
                                        >
                                            Achat
                                        </Button>
                                        {/* Fin */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className='col-lg-4 col-md-4'></div>
                <div className='col-lg-4 col-md-4'>
                    <div className='currency-selection text-center'>
                        {/* <div className='btn btn-primary'>
                        Retrait
                        </div> */}
                        {/* <h3 className='text-center'>Retrait</h3> */}

                        <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                        <div className='cryptocurrency-slides'>
                                <div className='single-cryptocurrency-box'>
                                    <div className='d-flex align-items-center'>
                                    <div className='bestseller-coin-image'>
                                        <img src="/images/ecfa/logo/logo_ewari1.jpg" className="rounded-circle"  alt='image' />
                                    </div>
                                    <div className='title'>
                                        <h3>Stablecoin E-WARI</h3>
                                    </div>
                                    </div>
                                    <div className='btn-box'>
                                    {/* <Link href='/#'>
                                        <a className='btn btn-danger'>Retrait</a>
                                    </Link> */}
                                     {/* Bouton Retrait */}
                                    <Button
                                        block
                                        color="danger"
                                        onClick={() => setModalFormOpenRetrait(true)}
                                        type="button"
                                    >
                                        Retrait
                                    </Button>
                                    {/* Fin */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                
               
            </div>
        </div>

        <div className='cryptocurrency-search-box text-center'>
            <div className='col-lg-12 col-md-12'>
                <div className='currency-selection text-center'>
                    <div className='btn btn-primary'>
                        Dernières Transactions
                    </div>
                    {/* <h3 className='text-center'>Dernières Transactions</h3> */}

                    <div className="m-4 ">
                    <table className="table">
                            <thead>
                                <tr>
                                <th scope="col">Type</th>
                                <th scope="col">Hash</th>
                                <th scope="col">Libellé</th>
                                <th scope="col">Adresse réception</th>
                                <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                <td>Transfert</td>
                                <td>Mon Libellé ici</td>
                                <td>HGREGHEJ....DHT6</td>
                                <td>
                                    <p>
                                    0X63...889HZ6UZSI
                                    </p>
                                </td>
                                <td>
                                <div className='btn btn-danger'>
                                <Icon icon="bx:basket" />

                                    {/* Supprimer  */}
                                </div>
                                
                                </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                   
                </div>
            </div>
        </div>
      </div>



      












    {/* ************************************************************************************************** */}
        {/* PARTIE COMPTE BANCAIRE */}
    {/* ****************************************************************************************************/}
        
    {/* Modal Banque */}
    <Modal isOpen={modalFormOpen} toggle={() => setModalFormOpen(false)}>
            <div className=" modal-body p-0">
              <Card className=" bg-secondary shadow border-0">
    <CardBody className=" px-lg-5 py-lg-5">
                  <div className=" text-center text-muted mb-4">
                  <h3 className='text-center text-white'>Ajouter un compte bancaire</h3>
                  </div>
                  <Form role="form" onSubmit={addAccountBank}>
                  <div className='col-lg-12 col-md-12 row justify-content-between'>
            <div className='input-group-alternative my-3'>
                <select 
                    placeholder='Pays'
                    className='form-control'
                    defaultValue={countrieBank} 
                    onChange={(event)=>setCountrieBank(event.target.value)}
                    >
                <option>Choisissez un pays</option>
                {/* Parcourir les pays */}
                {allCountry? (
                allCountry.map((data) => (
                <optgroup className='single-cryptocurrency-box'
                        key={data.id}>
                  <option  value={data.code}>{data.libelle}</option>
                </optgroup>
                    ))):("")}
                    
              </select>
              {/* Fin */}
            </div>

            <div className='input-group-alternative my-3'>
                <select 
                    placeholder='Banque'
                    className='form-control'
                    defaultValue={bankName} 
                    onChange={(event)=>setBankName(event.target.value)}
                >
                    <option>Choisissez une banque</option>
                    {/* Afficher les Banques d'un pays */}
                    {allBank.map((data) => (
                        data.countryIso===countrieBank?
                            <optgroup className='single-cryptocurrency-box' key={data.id}>
                                <option value={data.bankName}>{data.bankName}</option>
                            </optgroup>
                        :""
                    ))}
                    {/* Fin */}
              </select>
            </div>

            <div className='input-group-alternative my-3'>
            <input
              type='text'
              name='birthday'
              required='required'
              placeholder="Iban"
              className="form-control"
              defaultValue={iban} 
              onChange={(event)=>setIban(event.target.value)}
            />
            </div>
              <button type='submit'  className="btn btn-primary " disabled={isLoggingIn}>Ajouter</button>
                  {/* <button onClick={execute()} ></button> */}
                </div>

                  </Form>
                </CardBody>
                </Card>
                </div>
                </Modal>

        {/* *********************************FIN****************************************************************/}

        
        {/* ************************************************************************************************** */}
            {/* PARTIE COMPTE MOBILE */}
        {/* ************************************************************************************************** */}

    <Modal isOpen={modalFormOpenMobile} toggle={() => setModalFormOpenMobile(false)}>
            <div className=" modal-body p-0">
              <Card className=" bg-secondary shadow border-0">
    <CardBody className=" px-lg-5 py-lg-5">
                  <div className=" text-center text-muted mb-4">
                  <h3 className='text-center text-white'>Ajouter un compte mobile</h3>
                  </div>
                  <Form role="form" onSubmit={addAccountMobile}>
                   

                  <div className='col-lg-12 col-md-12 row justify-content-between'>
            
            <div className='input-group-alternative my-3'>
                <select 
                    placeholder='Pays'
                    className='form-control'
                    defaultValue={countrieMobile} 
                    onChange={(event)=>setCountrieMobile(event.target.value)}
                    >
                        
                <option>Choisissez un pays</option>
                {/* Parcourir les pays */}
                {allCountry? (
                allCountry.map((data) => (
                <optgroup className='single-cryptocurrency-box'
                        key={data.id}>
                  <option  value={data.code}>{data.libelle}</option>
                </optgroup>
                    ))):("")}
              </select>
            </div>

            <div className='input-group-alternative my-3'>
                <select 
                    placeholder='Reseau'
                    className='form-control'
                    defaultValue={networkMobile} 
                    onChange={(event)=>setNetworkMobile(event.target.value)}
                    >
                <option>Choisissez un reseau</option>
                {/* Afficher les Operateurs d'un pays */}
                {allOperators.map((data) => (
                        data.countryIso===countrieMobile?
                            <optgroup className='single-cryptocurrency-box' key={data.id}>
                                <option value={data.operatorName}>{data.operatorName}</option>
                            </optgroup>
                        :""
                    ))}
                    {/* Fin */}
                {/* <optgroup >
                  <option value="Orange">Orange</option>
                  <option value="MTN">MTN</option>
                  <option value="MOOV">MOOV</option>
                </optgroup> */}
              </select>
            </div>

            <div className='input-group-alternative my-3'>
            <input
              type='text'
              name='numberMobile'
              required='required'
              placeholder="Numero mobile"
              className="form-control"
              defaultValue={numberMobile} 
              onChange={(event)=>setNumberMobile(event.target.value)}
            />
            </div>
            
              <button type='submit'  className="btn btn-primary" disabled={isLoggingIn}>Ajouter</button>

                </div>

                  </Form>
                </CardBody>
                </Card>
                </div>
                </Modal>

        {/* *********************************FIN****************************************************************/}


        

        {/* ************************************************************************************************** */}
            {/* PARTIE ACHAT*/}
        {/* ************************************************************************************************** */}

    <Modal isOpen={modalFormOpenAchat} toggle={() => setModalFormOpenAchat(false)}>
            <div className=" modal-body p-0">
              <Card className=" bg-secondary shadow border-0">
    <CardBody className=" px-lg-5 py-lg-5">
                  <div className=" text-center text-muted mb-4">
                  <h3 className='text-center text-white'>Effectuer un achat</h3>
                  </div>
                  <Form role="form">
                   

                    <div className='col-lg-12 col-md-12 row justify-content-between'>

                        <div className='input-group-alternative my-3'>
                        <input
                        type='number'
                        name='mo'
                        required='required'
                        placeholder="Numero mobile"
                        className="form-control"
                        defaultValue={montantAchat} 
                        onChange={(event)=>setMontantAchat(event.target.value)}
                        />
                        </div>
                        <h5 className='text-center text-white'>{montantAchat} CFA</h5>

                        <div className='input-group-alternative my-3'>
                        <select 
                        placeholder='Pays'
                        className='form-control'
                        defaultValue={countrie} 
                        onChange={(event)=>setCountrie(event.target.value)}
                        >
                        <option>Choisissez le moyen de retrait</option>
                        {/* Parcourir les pays */}

                        <optgroup className='single-cryptocurrency-box'>
                        <option value="Mobile money">Mobile money</option>
                        <option value="Compte bancaire">Compte bancaire</option>
                        </optgroup>
                        </select>
                        </div>

                        <div className='input-group-alternative my-3'>
                        <select 
                        placeholder='Reseau'
                        className='form-control'
                        defaultValue={networkMobile} 
                        onChange={(event)=>setNetworkMobile(event.target.value)}
                        >
                        <option>Choisissez un numero</option>
                        <optgroup >
                        <option value="Orange">0998787687</option>
                        <option value="MTN">4563365555</option>
                        <option value="MOOV">0987786667</option>
                        </optgroup>
                        </select>
                        </div>

                        <div className='input-group-alternative my-3'>
                        <select 
                        placeholder='Reseau'
                        className='form-control'
                        defaultValue={networkMobile} 
                        onChange={(event)=>setNetworkMobile(event.target.value)}
                        >
                        <option>Choisissez une banque</option>
                        <optgroup >
                        <option value="Orange">Conseil Nationale du Crédit</option>
                        <option value="MTN">ECOBANK-Togo</option>
                        <option value="MOOV">Bank Of Africa-Bénin</option>
                        </optgroup>
                        </select>
                        </div>



                        <button type='submit'  className="btn btn-primary" disabled={isLoggingIn}>Ajouter</button>

                    </div>

                  </Form>
                </CardBody>
                </Card>
                </div>
                </Modal>

        {/* *********************************FIN****************************************************************/}


        
        {/* ************************************************************************************************** */}
            {/* PARTIE RETRAIT*/}
        {/* ************************************************************************************************** */}

    <Modal isOpen={modalFormOpenRetrait} toggle={() => setModalFormOpenRetrait(false)}>
            <div className=" modal-body p-0">
              <Card className=" bg-secondary shadow border-0">
    <CardBody className=" px-lg-5 py-lg-5">
                  <div className=" text-center text-muted mb-4">
                  <h3 className='text-center text-white'>Effectuer un retrait</h3>
                  </div>
                  <Form role="form">
                  <div className='col-lg-12 col-md-12 row justify-content-between'>

                  <div className='input-group-alternative my-3'>
            <input
              type='number'
              name='mo'
              required='required'
              placeholder="Numero mobile"
              className="form-control"
              defaultValue={montantRetrait} 
              onChange={(event)=>setMontantRetrait(event.target.value)}
            />
            </div>
            <h5 className='text-center text-white'>{montantRetrait} CFA</h5>
            
            <div className='input-group-alternative my-3'>
                <select 
                    placeholder='Pays'
                    className='form-control'
                    defaultValue={countrie} 
                    onChange={(event)=>setCountrie(event.target.value)}
                    >
                <option>Choisissez le moyen de retait</option>
                {/* Parcourir les pays */}
                
                <optgroup className='single-cryptocurrency-box'>
                  <option value="Mobile money">Mobile money</option>
                  <option value="Compte bancaire">Compte bancaire</option>
                </optgroup>
              </select>
            </div>

            <div className='input-group-alternative my-3'>
                <select 
                    placeholder='Reseau'
                    className='form-control'
                    defaultValue={networkMobile} 
                    onChange={(event)=>setNetworkMobile(event.target.value)}
                    >
                <option>Choisissez un numero</option>
                <optgroup >
                  <option value="Orange">0998787687</option>
                  <option value="MTN">4563365555</option>
                  <option value="MOOV">0987786667</option>
                </optgroup>
              </select>
            </div>

            <div className='input-group-alternative my-3'>
                <select 
                    placeholder='Reseau'
                    className='form-control'
                    defaultValue={networkMobile} 
                    onChange={(event)=>setNetworkMobile(event.target.value)}
                    >
                <option>Choisissez une banque</option>
                <optgroup >
                  <option value="Orange">Conseil Nationale du Crédit</option>
                  <option value="MTN">ECOBANK-Togo</option>
                  <option value="MOOV">Bank Of Africa-Bénin</option>
                </optgroup>
              </select>
            </div>

            
            
              <button type='submit'  className="btn btn-primary" disabled={isLoggingIn}>Ajouter</button>

                </div>

                  </Form>
                </CardBody>
                </Card>
                </div>
                </Modal>

        {/* *********************************FIN****************************************************************/}







    </>
  );
};

export default CardA;
