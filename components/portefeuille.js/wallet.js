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
          console.log("Bon Provider=>>",pt)
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
              console.log("contractStablecoin111=>",contractStablecoin)
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

const transfer = async()=>{
  const { DefenderRelaySigner, DefenderRelayProvider } = require('defender-relay-client/lib/ethers');
  // const { ethers } = require('ethers');
  // const YOUR_API_KEY = "9J8guXHwAQ5Pg4vv17cnEgH72AhLsTYz"
  // const YOUR_API_SECRET = "5ghqfeHdMySZ2fBzPy9kB1SkW2rLRSPdKvLfjKLE8qbZY2jZG8QqmSXwTGRrzRep"
  const credentials = { apiKey: YOUR_API_KEY, apiSecret: YOUR_API_SECRET };
  const providerlay = new DefenderRelayProvider(credentials);
  const beneficiary = ""
  const signer = new DefenderRelaySigner(credentials, providerlay, { speed: 'fast' });

  const erc20 = new ethers.Contract(ADDRESS_CONTRAT_EWARI,ABI_TOKEN_EWARI.abi, signer);
  // const tx = await erc20.transfer(beneficiary, 1e18.toString());
  const tosting = String(50)
      const mountWei = ethers.utils.parseUnits(tosting, decimalStablecoin);
  const tx = await erc20.transfer(beneficiary, mountWei);

  const mined = await tx.wait();
  console.log("Mined=>",mined)
}







const { DefenderRelaySigner } = require('defender-relay-client/lib/ethers');
// const { Magic } = require('magic-sdk');
// const { ethers } = require('ethers');

// Adresse Ethereum de l'utilisateur A
// const userAAddress = '0x...';

// Adresse Ethereum de l'utilisateur B
// const userBAddress = '0x...';

// Adresse Ethereum du contrat ERC20
// const erc20Address = '0x...';

// ABI du contrat ERC20
// const erc20Abi = [...];

// Créer un fournisseur d'accès à la blockchain Ethereum
// const providerUrl = 'https://mainnet.infura.io/v3/2e3e8279fbe04ecc99f509a65edbc626';
const providerUrl = 'https://rpc.testnet.moonbeam.network'
const providerRe = new ethers.providers.JsonRpcProvider(provider);
console.log("provider=>",provider)

// const YOUR_API_KEY = "9J8guXHwAQ5Pg4vv17cnEgH72AhLsTYz"
//   const YOUR_API_SECRET = "5ghqfeHdMySZ2fBzPy9kB1SkW2rLRSPdKvLfjKLE8qbZY2jZG8QqmSXwTGRrzRep"
const YOUR_API_KEY = "GWmEwe1fwV2f383dExKeRUVPL9ZYKKFu"
const YOUR_API_SECRET = "QXdiWAUUF1PkhAqjJYMBLpxu57cwKwP7XjisUJfj6RQmyTf3d5PURGy9aQ4aXKzC"

// Créer une instance du contrat ERC20 avec le Defender Relayer Signer
const defenderRelaySigner = new DefenderRelaySigner({ 
  apiKey: YOUR_API_KEY,
  apiSecret: YOUR_API_SECRET 
}, provider, { speed: 'fast' });
const erc20 = new ethers.Contract(ADDRESS_CONTRAT_EWARI,ABI_TOKEN_EWARI.abi,defenderRelaySigner);

// Initialiser Magic avec votre API key
// const magic = new Magic('YOUR_MAGIC_API_KEY');

// Créer un Defender Relayer Signer avec Magic
const createDefenderRelaySignerWithMagic = async (address) => {
  // const provider = new ethers.providers.Web3Provider(provider);
  const signer = provider.getSigner();
  return new DefenderRelaySigner({ 
    apiKey: YOUR_API_KEY,
    apiSecret: YOUR_API_SECRET 
  }, provider, { speed: 'fast', from: address, signer });
};

// Envoyer des jetons ERC20 de l'utilisateur A à l'utilisateur B
const sendTokensNO = async () => {
  try {
    // Authentifier l'utilisateur A avec Magic
    // const userAMagic = await magic.auth.loginWithMagicLink({ email: 'USER_A_EMAIL' });
    // const userAAddress = userAMagic.publicAddress;

    // Créer un Defender Relayer Signer avec Magic pour l'utilisateur A
    const userADefenderRelaySigner = await createDefenderRelaySignerWithMagic(currentAdresse);
    // const userADefenderRelaySigner = await createDefenderRelaySignerWithMagic("0x09439864ddaA177C80396353Cd98e6EaDa996a39");
    
    console.log('userADefenderRelaySigner=>',userADefenderRelaySigner);

    // Créer une transaction pour envoyer des jetons ERC20 de l'utilisateur A à l'utilisateur B
    // const amount = ethers.utils.parseEther('0');
    const tosting = String(montantRecevoir)
    console.log('tosting=>',tosting);

    const amount = ethers.utils.parseUnits(tosting, decimalStablecoin);
    console.log('amount=>',amount);

    // const userBAddress = "0x496Dd9744c3a1B0Ec4C2998656BEA67DbCec888B"
    const userBAddress= "0x09439864ddaA177C80396353Cd98e6EaDa996a39"
    console.log('tx=>');

    const gasEstimate = await erc20.estimateGas.transfer(userBAddress, amount);
    console.log('Estimation des frais de gas:', gasEstimate.toString());
    
    const tx = await erc20.connect(userADefenderRelaySigner).transfer(userBAddress, amount, {
      gasLimit: gasEstimate.add(10000)
    });


//     const tx = await erc20.connect(userADefenderRelaySigner).transfer(userBAddress, amount);
//     console.log('tx=>',tx);
//     const gasLimit = await erc20.estimateGas.transfer(userBAddress, amount);
// console.log('Estimation du gas limit :', gasLimit.toString());

    // Envoyer la transaction au Defender Relayer pour qu'il l'envoie à la blockchain Ethereum et paye les frais de transaction
    const mined = await tx.wait();

    console.log('Transaction envoyée avec succès',mined);
  } catch (error) {
    console.error(error);
  }
};



const sendTokensNOO = async () => {
  try {
    // Authentifier l'utilisateur A avec Magic
    // const userAMagic = await magic.auth.loginWithMagicLink({ email: 'USER_A_EMAIL' });
    // const userAAddress = userAMagic.publicAddress;

    // Créer un Defender Relayer Signer avec Magic pour l'utilisateur A
    const addressA="0x09439864ddaA177C80396353Cd98e6EaDa996a39"
    const userADefenderRelaySigner = await createDefenderRelaySignerWithMagic(addressA);
    console.log("userADefenderRelaySigner=>",userADefenderRelaySigner)
    console.log("currentAdresse=>",currentAdresse)

    const userBAddress = "0x496Dd9744c3a1B0Ec4C2998656BEA67DbCec888B"
    // const userBAddress= "0x09439864ddaA177C80396353Cd98e6EaDa996a39"
    
    // Créer une transaction pour envoyer des jetons ERC20 de l'utilisateur A à l'utilisateur B
    // const amount = ethers.utils.parseEther('2');
    // console.log('tx=>');
    const tosting = String(1)
    const amount = ethers.utils.parseUnits(tosting, decimalStablecoin);
    console.log('amount=>',amount);

    const gasEstimate = await erc20.estimateGas.transfer(userBAddress, amount);
    console.log('Estimation des frais de gas:', gasEstimate.toString());

    // const tx = await erc20.connect(userADefenderRelaySigner).transfer(userBAddress, amount, { from: defenderRelaySigner.getAddress() });
    // console.log('tx=>',tx);
 const tx = await erc20.connect(userADefenderRelaySigner).transfer(userBAddress, amount, {
      from: defenderRelaySigner.getAddress(),
      gasLimit: gasEstimate.add(10000)
    });
    // Envoyer la transaction au Defender Relayer pour qu'il l'envoie à la blockchain Ethereum et paye les frais de transaction
    const mined = await tx.wait();

    console.log('Transaction envoyée avec succès',mined);
  } catch (error) {
    console.error(error);
  }
};








const sendTokens = async () => {
// const magic = new Magic('pk_live_F1AB148D6AA92662');

  try {
    // Authentifier l'utilisateur A avec Magic

    // const userAMagic = await magic.auth.loginWithMagicLink({ email: 'zkone403@gmail.com' });
    // const userAAddress = userAMagic.publicAddress;

    // Connexion au fournisseur Ethereum (infura ou votre propre nœud)

    // const provider = new ethers.providers.JsonRpcProvider('https://rinkeby.infura.io/v3/YOUR_INFURA_PROJECT_ID');

    // Charger le contrat
    const contract = new ethers.Contract(ADDRESS_CONTRAT_EWARI,ABI_TOKEN_EWARI.abi, provider);

    // Récupérer le solde de l'utilisateur A
    // const userABalance = await contract.balanceOf(userAAddress);
    const userAAddress = "0x09439864ddaA177C80396353Cd98e6EaDa996a39"
    const userABalance = await contract.balanceOf(userAAddress);
    

    // Définir l'adresse de l'utilisateur B et le montant à envoyer
    const userBAddress = '0x496Dd9744c3a1B0Ec4C2998656BEA67DbCec888B';
    // const amountToSend = ethers.utils.parseEther('10');

    const tosting = String(1)
    const amountToSend = ethers.utils.parseUnits(tosting, decimalStablecoin);

    // Vérifier si l'utilisateur A a suffisamment de tokens pour envoyer
    if (userABalance.lt(amountToSend)) {
      console.log('L\'utilisateur A n\'a pas suffisamment de tokens pour envoyer !');
      return;
    }

    const RELAYER_ADDRESS = "0x4bcc9911709eef442d44697c00cce7d5ea1f455f"
    console.log("Ok 1")

    const gasEstimate = await erc20.estimateGas.transfer(userBAddress, amountToSend);
    console.log('Estimation des frais de gas:', gasEstimate.toString());

    // Demander à l'utilisateur A d'approuver la transaction
    const approveTx = await contract.connect(userAAddress).approve(RELAYER_ADDRESS, amountToSend, {
      gasLimit: gasEstimate.add(10000)

    });
    console.log("Ok 2")

    // Attendre la confirmation de la transaction d'approbation
    await approveTx.wait();

    console.log("Ok 3")
    
    // Demander au relais de transférer les tokens de l'utilisateur A à l'utilisateur B
    const transferTx = await contract.connect(provider.getSigner(RELAYER_ADDRESS)).transferFrom(userAAddress, userBAddress, amountToSend, {
      gasLimit: gasEstimate.add(10000)

    });
    console.log("Ok 4")

    // Attendre la confirmation de la transaction de transfert
    await transferTx.wait();

    console.log(`Transfert de ${amountToSend.toString()} tokens de ${userAAddress} à ${userBAddress} réussi !`);

  } catch (error) {
    console.log(error);
  }
  
}




const transferRelayer = async() =>{
  // Importez les bibliothèques et les dépendances nécessaires
// import { ethers } from 'ethers';
// import { RelayProvider } from '@defender/relay-client';
// import dotenv from 'dotenv';

// Initialisez les variables d'environnement
// dotenv.config();
// const NETWORK = process.env.NETWORK || 'rinkeby';
// const RELAY_ID = process.env.RELAY_ID;
// const DEFENDER_API_KEY = process.env.DEFENDER_API_KEY;
// const TOKEN_ADDRESS = process.env.TOKEN_ADDRESS;
// const PRIVATE_KEY = process.env.PRIVATE_KEY;
// const DESTINATION_ADDRESS = '0x...'; 
// const AMOUNT = 100; 

const NETWORK = 'moonbase';
const RELAY_ID = "8279505a-ebf4-4265-93e9-c0c47f5c2db0";
const DEFENDER_API_KEY = "AHP4oU1BzcuKLsaqi9chu1qobgV8zAGr";
// const TOKEN_ADDRESS = process.env.TOKEN_ADDRESS;
const PRIVATE_KEY = "36ba8d431646b33e370eac06979af488bdddb6341bd067a676e5d33a8d72a1e1";
const DESTINATION_ADDRESS = '0x496Dd9744c3a1B0Ec4C2998656BEA67DbCec888B'; // Adresse de destination pour le transfert de jeton
const AMOUNT = 5; // Montant de jeton à transférer

// Initialisez l'instance de provider Defender Relayer
const provider = new RelayProvider(NETWORK, RELAY_ID, {
  apikey: DEFENDER_API_KEY,
});

// Initialisez l'instance de contrat pour le jeton ERC20
const tokenContract = new ethers.Contract(ADDRESS_CONTRAT_EWARI, ABI_TOKEN_EWARI.abi, provider);

// Créez un objet TransactionRequest contenant les informations nécessaires pour effectuer la transaction
const tx = {
  to: DESTINATION_ADDRESS,
  value: 0,
  data: tokenContract.interface.encodeFunctionData('transfer', [DESTINATION_ADDRESS, AMOUNT]),
};

// Obtenez l'estimation du coût de gaz nécessaire pour exécuter la transaction
const gasLimit = await tokenContract.estimateGas.transfer(DESTINATION_ADDRESS, AMOUNT);

console.log("currentAdresse=>",currentAdresse)
// Créez un objet RelayableTransaction contenant les informations nécessaires pour signer la transaction
const relayableTx = {
  from: currentAdresse, // Adresse de l'utilisateur
  to: TOKEN_ADDRESS, // Adresse du contrat de jeton ERC20
  gasLimit: gasLimit.toNumber(), // Coût estimé de gaz
  data: tx.data, // Données de la transaction
  nonce: await provider.getTransactionCount(userAddress), // Numéro de séquence de la transaction
};

// Signez l'objet RelayableTransaction en utilisant la clé privée du portefeuille qui paiera les frais de gaz
const signer = new ethers.Wallet(PRIVATE_KEY, provider);
const signedRelayableTx = await signer.signRelayable(relayableTx);
console.log("signedRelayableTx=>",signedRelayableTx)

// Envoyez l'objet RelayableTransaction signé à votre smart contract pour traitement de la méta-transaction
await contract.processMetaTransaction(signedRelayableTx);

}









// ******************************************************************************

// ******************PERMIT*************************************************


const [permitV, setPermitV] = useState()
const [permitR, setPermitR] = useState()
const [permitS, setPermitS] = useState()



// ****************************************************************
// permitAtoB
// ******************************************************************
// Code côté client pour l'utilisateur A
const permitAtoBNo = async () => {
  // ... (configuration de ethers.js et du contrat)

  // Signature du message pour permit
  const signature = await signer._signTypedData(domain, types, valueObj);
  const { v, r, s } = ethers.utils.splitSignature(signature);
  // Envoyer v, r, s à l'utilisateur B par un moyen sûr
};
// ***********FIN**************************************************

// ************************************************************************

// **************************************************************************
// Code côté client pour l'utilisateur B
const transferFromAtoC = async () => {
  // console.log('Using signature:', { v, r, s });

  const signer = provider.getSigner();
  const spenderB = await signer.getAddress();

  const tosting = String("100")
  const value = ethers.utils.parseUnits(tosting, decimalStablecoin);
  // const deadline = Math.floor(new Date().getTime() / 1000) + 3600; // +1 heure


  // Récupération de v, r, s à partir de la signature 
  const v = 27;
  const r = "0xca88bc0aa69d873e05ca99a8352157135e259d55f5a6cae241646f0d69b94749";
  const s = "0x7763ae42584aabfa22f3f2e8a581a5bb37024d4422d414ce77ab05895051c44f";
  const deadline = ""; // +1 heure

  const ownerA = "0x496Dd9744c3a1B0Ec4C2998656BEA67DbCec888B";
  const recipientC ="0x09439864ddaA177C80396353Cd98e6EaDa996a39"

  // Appel à permit pour obtenir la permission de dépenser des tokens de A
  await contractStablecoin.permit(ownerA, spenderB, value, deadline, v, r, s);

  // Transfert de tokens de A à C
  const tx = await contractStablecoin.transferFrom(ownerA, recipientC, value);

  // Log ou autre traitement du tx
  console.log("Transaction hash =>1:", tx.hash);

  console.log("Transaction hash:", tx);
};

// Exécution des fonctions :

// const { v, r, s } = await permitAtoB();  // Exécutez d'abord cette fonction pour obtenir v, r, s
// await transferFromAtoC(v, r, s);  // Ensuite, exécutez cette fonction avec les valeurs obtenues



const transferFromAtoCNo = async () => {
  // ... (configuration de ethers.js et du contrat)
 const v = "";
 const r = "";
 const s = "";

 const ownerA = "";
 const recipientC = "";
//  const s = "";


  // Appel à permit pour obtenir la permission de dépenser des tokens de A
  await contractStablecoin.permit(ownerA, spenderB, value, deadline, v, r, s);

  // Transfert de tokens de A à C
  const tx = await contractStablecoin.transferFrom(ownerA, recipientC, value);

  // Log ou autre traitement du tx
  console.log("Transaction hash:", tx.hash);
};
// **********FIN***********************************************************

// ***********************************************************************
const permitAtoB = async () => {
  const signer = provider.getSigner();
  const owner = await signer.getAddress();
console.log('signer=>',signer)
  const spenderB = "0x2eb9B095202f515388973c78d8308C478f8AA6C2";
  const tosting = String("100")
  const value = ethers.utils.parseUnits(tosting, decimalStablecoin);
  const nonce = await contractStablecoin.nonces(owner);
  const deadline = Math.floor(new Date().getTime() / 1000) + 3600; // +1 heure

  const domain = {
      name: "E-WARI TestD",
      version: "1",
      chainId: 1287, 
      verifyingContract: ADDRESS_CONTRAT_EWARI
  };
  console.log("domain=>",domain)

  const types = {
      Permit: [
          { name: "owner", type: "address" },
          { name: "spender", type: "address" },
          { name: "value", type: "uint256" },
          { name: "nonce", type: "uint256" },
          { name: "deadline", type: "uint256" }
      ]
  };
  console.log("types=>",types)


  const valueObj = {
      owner,
      spenderB,
      value: value.toString(),
      nonce,
      deadline
  };
  console.log("valueObj=>",valueObj)

  const signature = await signer._signTypedData(domain, types, valueObj);

  // Récupération de v, r, s à partir de la signature
  const { v, r, s } = ethers.utils.splitSignature(signature);
  console.log("signature V=> 5",v)
  console.log("signature R=> 6",r)
  console.log("signature S=> 7",s)
  console.log("deadline => 8",deadline)
  
  // Appel de la fonction permit avec les valeurs correctes
  // const tx = await contractStablecoin.permit(owner, spenderB, value, deadline, v, r, s);
  console.log('Signature:', { v, r, s });

  transferFromAtoCInOneTx(v,r,s,deadline)

  return { v, r, s };  // Retourner les valeurs pour les utiliser plus tard
  

  // console.log("Transaction hash:", tx);
};

// *************************************************************************
const transferFromAtoCInOneTx = async (v, r, s,deadline) => {
  const signer = provider.getSigner();
  // const spenderB = await signer.getAddress();
  const spenderB ="0x2eb9B095202f515388973c78d8308C478f8AA6C2"
  const value = ethers.utils.parseUnits("10", decimalStablecoin);
  // const deadline = Math.floor(new Date().getTime() / 1000) + 3600; // +1 heure
  
  const ownerA = "0x496Dd9744c3a1B0Ec4C2998656BEA67DbCec888B";
  const recipientC = "0x09439864ddaA177C80396353Cd98e6EaDa996a39";
  
  const tx = await contractStablecoin.permitAndTransferFrom(
    ownerA,
    spenderB,
    value,
    deadline,
    v,
    r,
    s,
    recipientC
  );
  
  console.log("Transaction hash:", tx.hash);
};



// *************RALAYER******************************************
async function sendTransaction() {
  const web3 = new Web3(window.ethereum);
  const from = YourUserAddress;
  const to = RecipientAddress;
  const value = 10;

  const response = await fetch('/api/metaTransaction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to, value })
  });

  if (response.ok) {
      console.log('Meta-transaction sent successfully');
  }
}



async function sendMetaTransactionNo() {
  const from ="0x09439864ddaA177C80396353Cd98e6EaDa996a39"
  const to = "0x496Dd9744c3a1B0Ec4C2998656BEA67DbCec888B";
  const recipientC = "0x2eb9B095202f515388973c78d8308C478f8AA6C2 ";
  const value = ethers.utils.parseUnits("10", decimalStablecoin);
  

  const txData = contractStablecoin.methods.metaTransfer(from, to, value).encodeABI();
  const tx = {
      to: ADDRESS_CONTRAT_EWARI,
      data: txData,
      gas: 2000000
  };
  const signedTx = await web3.eth.accounts.signTransaction(tx, RelayerPrivateKey);
  console.log("signedTx=>",signedTx)
  return web3.eth.sendSignedTransaction(signedTx.rawTransaction);
}



async function sendMetaTransactionNON() {
  const signer = provider.getSigner();

  const from ="0x09439864ddaA177C80396353Cd98e6EaDa996a39"
  const to = "0x496Dd9744c3a1B0Ec4C2998656BEA67DbCec888B";
  const recipientC = "0x2eb9B095202f515388973c78d8308C478f8AA6C2 ";
  const value = ethers.utils.parseUnits("10", decimalStablecoin);
// Construire les données de la transaction
const txData = contractStablecoin.interface.encodeFunctionData("metaTransfer", [from, to, value]);

// Créer l'objet de transaction
const tx = {
  to: ADDRESS_CONTRAT_EWARI,
  data: txData,
  gasLimit: ethers.utils.hexlify(2000000), // Limite de gaz sous forme hexadécimale
};

// Signer la transaction
const signedTx = await signer.signTransaction(tx);
console.log("signedTx=>",signedTx)
// Envoyer la transaction signée
const txResponse = await provider.sendTransaction(signedTx);

return txResponse;
}


// AUTRES
const sendMetaTransactionA = async () => {
const RelayerPrivateKeyNO = "2QyWScCUTGLW6peR4cHnjkx7p5ZJ6YPxi28zog3uSyoCs8jPpwMEfLuLJPQcY78v"
const RelayerPrivateKey ="36ba8d431646b33e370eac06979af488bdddb6341bd067a676e5d33a8d72a1e1"

const from ="0x09439864ddaA177C80396353Cd98e6EaDa996a39"
const to = "0x496Dd9744c3a1B0Ec4C2998656BEA67DbCec888B";
const recipientC = "0x2eb9B095202f515388973c78d8308C478f8AA6C2 ";
const value = ethers.utils.parseUnits("10", decimalStablecoin);

console.log("OK=>1")
  // Créer un objet Wallet à partir de la clé privée
  const wallet = new ethers.Wallet(RelayerPrivateKey, provider);

  // Connecter le portefeuille au fournisseur
  const connectedWallet = wallet.connect(provider);

  // Créer l'objet Contract pour le contrat stablecoin
  const contractStablecoin = new ethers.Contract(ADDRESS_CONTRAT_EWARI, ABI_TOKEN_EWARI.abi, connectedWallet);

  // Construire les données de la transaction
  const txData = contractStablecoin.interface.encodeFunctionData("metaTransfer", [from, to, value]);
  console.log("OK=>2",txData)

  // Créer l'objet de transaction
  const tx = {
    to: ADDRESS_CONTRAT_EWARI,
    data: txData,
    gasLimit: ethers.utils.hexlify(2000000), // Limite de gaz sous forme hexadécimale
  };

  // Envoyer la transaction
  const txResponse = await connectedWallet.sendTransaction(tx);
console.log("txResponse=>",txResponse)
  return txResponse;
}



// ********AUTRE FONCTION***********************

const sendMetaTransactionB = async () => {
  // Créer un objet Provider Ethereum
  const YOUR_RPC_URL ="https://rpc.testnet.moonbeam.network";
  const provider = new ethers.providers.JsonRpcProvider(YOUR_RPC_URL); // Remplacez YOUR_RPC_URL par l'URL du nœud Ethereum que vous utilisez
  
  const from ="0x09439864ddaA177C80396353Cd98e6EaDa996a39"
  const to = "0x496Dd9744c3a1B0Ec4C2998656BEA67DbCec888B";
  const recipientC = "0x2eb9B095202f515388973c78d8308C478f8AA6C2 ";
  const value = ethers.utils.parseUnits("10", decimalStablecoin);
  const apiKey = "CAxagsqh1odZPHAogaH5QfXb9JdnpMQj"
  const secretKey = ""
  const privateKeyBase58 = "";
  const privateKeyHex = ethers.utils.hexlify(ethers.utils.base58.decode(privateKeyBase58));

// const wallet = new ethers.Wallet(privateKeyHex);
  // Créer un objet Wallet à partir de la clé privée (Secret Key)
  const wallet = new ethers.Wallet(secretKey, provider);
  
  console.log("pPOOOOOOO=>",)

  // Récupérer l'adresse du propriétaire
  const owner = await wallet.getAddress();

  

  // Créer l'objet Contract pour le contrat stablecoin
  const contractStablecoin = new ethers.Contract(ADDRESS_CONTRAT_EWARI, ABI_TOKEN_EWARI.abi, wallet); // Remplacez ABI_DU_CONTRAT par l'ABI de votre contrat stablecoin

  // Construire les données de la transaction
  const txData = contractStablecoin.interface.encodeFunctionData("metaTransfer", [from, to, value]);

  // Créer l'objet de transaction
  const tx = {
    to: ADDRESS_CONTRAT_EWARI,
    data: txData,
    gasLimit: ethers.utils.hexlify(2000000), // Limite de gaz sous forme hexadécimale
  };

  // Signer la transaction avec le Relayer
  const signedTx = await wallet.signTransaction(tx);

  // Créer l'objet Payload pour le Relayer
  const payload = {
    transaction: signedTx,
    apiKey: apiKey,
  };
  console.log("payload=>",payload)

  // Envoyer la transaction via le Relayer Defender
  const response = await fetch("https://defender.openzeppelin.com/relay", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();
console.log("result=>",result)
  return result;
};





// ************AUTRE ****************
const sendMetaTransactionC = async () => {
  const from ="0x09439864ddaA177C80396353Cd98e6EaDa996a39"
  const to = "0x496Dd9744c3a1B0Ec4C2998656BEA67DbCec888B";
  const recipientC = "0x2eb9B095202f515388973c78d8308C478f8AA6C2 ";
  const value = ethers.utils.parseUnits("10", decimalStablecoin);

  try {
    

    const formData = {
      from: from,
      to: to,
      value: 10,
    }
    console.log("response=>",formData)

    const result = await fetch(`/api/metaTransfer`, {
      method:"POST",
      body: JSON.stringify(formData),
      headers: {
          'Content-Type': 'application/json',
      }
    })
      const data = await result.json();
    console.log("response=>",data)
    if (!data.ok) {
      throw new Error(`HTTP error! status: ${data.status}`);
    }

  } catch (error) {
    console.error(error);
  }
};

// µ**************************AUTRE Le bon relayer*******************
const sendMetaTransaction = async () => {
const from ="0x09439864ddaA177C80396353Cd98e6EaDa996a39"
const to = "0x496Dd9744c3a1B0Ec4C2998656BEA67DbCec888B";
const recipientC = "0x2eb9B095202f515388973c78d8308C478f8AA6C2 ";
const value = ethers.utils.parseUnits("10", decimalStablecoin);

  const privateKey = "";
  const privateKeyPS = ""
  const wallet = new ethers.Wallet(privateKey, provider);

  const contractAddress = "0x124f9343ABf61158946C7122e5B59Eb0E49084A9";

  const contract = new ethers.Contract(contractAddress, ABI_TOKEN_EWARI.abi, wallet);
    console.log("contract111=>",contract)
  try {
    const tx = await contract.metaTransfer(from, to, value);
    const receipt = await tx.wait();
    console.log("receipt=>",receipt)
  } catch (error) {
    console.error(error);
  }
}


// ******************FIN RELAYER********************************












    return (
        <>
           <div>
                <div className="sign-page bg-default-2 px-0">
                    <Container>
                        <Row className="justify-content-center py-15">
                        <Col lg="12">
                            <div className="main-block">
                            <div className="form-title text-center">
                                <h2 className="title gr-text-7 mb-9 heading-color">Mon portefeuille numérique </h2>
                                {/* <button onClick={permitAtoB } >permitAtoB </button><br/><br/><br/>
                                <button onClick={sendMetaTransaction } >Realyer </button><br/><br/><br/> */}
                                {/* <button onClick={transferFromAtoC} >transferFromAtoC</button> */}
                                
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
                                            onClick={()=>setContentDepot(`Vous pouvez copier et envoyer en toute sécurité cette adresse "publique" qui vous permet de recevoir des actifs numériques.`)}
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
                                            onClick={()=>setSymbol("EWRITB")}
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
                                            onClick={()=>setContentDepot(`Vous pouvez copier et envoyer en toute sécurité cette adresse "publique" qui vous permet de recevoir des actifs numériques.`)}
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
                                            onClick={()=>setContentDepot(`Vous pouvez copier et envoyer en toute sécurité cette adresse "publique" qui vous permet de recevoir des actifs numériques.`)}
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
                                            onClick={()=>setContentDepot(`Vous pouvez copier et envoyer en toute sécurité cette adresse "publique" qui vous permet de recevoir des actifs numériques.`)}
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
                                            onClick={()=>setContentDepot(`Vous pouvez copier et envoyer en toute sécurité cette adresse "publique" qui vous permet de recevoir des actifs numériques.`)}
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
                                            onClick={()=>setContentDepot(`Vous pouvez copier et envoyer en toute sécurité cette adresse "publique" qui vous permet de recevoir des actifs numériques.`)}
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
                          {symbol==="EWRITB" ? (
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