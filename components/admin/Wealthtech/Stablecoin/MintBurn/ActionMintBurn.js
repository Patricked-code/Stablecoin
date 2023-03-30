import { useState, useEffect } from 'react';
import React from "react";
import axios from 'axios';
import Link from 'next/link';
import { Icon } from '@iconify/react';


// Pour Magic
import { magic } from "../../../../../magic";
import { ethers } from "ethers";
import Loading from "../../../../../components/loading";
import Router from "next/router";
import Swal from 'sweetalert2';
import Web3 from "web3";

// FIN

// Importer ABI de E-WARI
import ABI_TOKEN_EWARI from "../../../../../components/Contrats/Abi/AbiStablecoin.json";




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

const ActionMintBurn = () => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API
    const ADDRESS_CONTRAT_EWARI =process.env.NEXT_PUBLIC_ADDRESS_CONTRAT_EWARI //adesse du contrat
    const NEXT_PUBLIC_RPC_PROVIDER = process.env.NEXT_PUBLIC_RPC_PROVIDER //PROVIDER


    const [currentUser, setCurrentUser] = useState();
    const [provider, setProvider] = useState(null);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [isLoggingInBurn, setIsLoggingInBurn] = useState(false);


    // State d'interaction avec MetaMask
    const [network, setNetwork] = useState("Moonbase Alpha");
    const [currentAddressMetamask, setCurrentAddressMetamask] = useState();
    const [amountMint, setAmountMint] = useState();
    const [amountBurn, setAmountBurn] = useState();
    
    
    




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
              //const userBalance = ethers.utils.formatEther(await provider.getBalance(userAddress))
              // FIN

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
                //   console.log("User=>",user)
                  }) 
              };
              await getUser();
              // Fin









              const getTransaction = async () => {
                const result = await fetch(`https://api-moonbase.moonscan.io/api?module=account&action=tokentx&address=0xAd272BE6544B7683A0393fD60f4050a5eDf10FA2&startblock=0&endblock=2500000&sort=asc&apikey=bd5346fd475033cabfbfaf59aec6c45788bd3ccaf329718a26332797786738f3`, {
                    // apiKey  =N72PF9RYJUGZRV9F2Q4FFB8HXBRKVA89BZ
                headers: {
                    'Content-Type': 'application/json',
                    },
                })
                  .then((result) => result.json())
                  .then((user) => {
                //   setCurrentUser(user)
                //   console.log("User=>",user)
                  }) 
              };
              await getTransaction();
            }
        })();

    }, [provider, magic]);
    //  Fin


     // *******************************************************************************
     //we'll connect to metamask
    // *******************************************************************************
    const onClickConnect = async () => {
        console.log("network=>",network)
        try {
        // Will open the MetaMask UI
        // You should disable this button while the request is pending!
        await ethereum.request({ method: 'eth_requestAccounts'});
        try {
            
        //    main Moonbeam
        if(network =="Moonbeam"){
            window.ethereum.request({ 
                method: 'wallet_addEthereumChain', 
                params: [{ 
                    chainId: '0x504', 
                    chainName: 'Moonbeam',
                    nativeCurrency: {
                        name: 'GLMR',
                        symbol: 'GLMR',
                        decimals: 18
                    },    
                    rpcUrls: ['https://rpc.api.moonbeam.network'],
                    blockExplorerUrls: ["https://moonbeam.moonscan.io/"]
                }] 
            })
        }else if(network =="Moonbase Alpha"){

            // Moonbeam Moonbase
            window.ethereum.request({ 
                method: 'wallet_addEthereumChain', 
                params: [{ 
                    chainId: '0x507', 
                    chainName: 'Moonbase Alpha',
                    nativeCurrency: {
                        name: 'GLMR',
                        symbol: 'GLMR',
                        decimals: 18
                    },
                    rpcUrls: ['https://rpc.testnet.moonbeam.network'],
                       blockExplorerUrls: ["https://moonbase.moonscan.io/"]

                }] 
            })
        }
            
        } catch (error) {
            console.log(error)
        }
        //we use eth_accounts because it returns a list of addresses owned by us.
        const accounts = await ethereum.request({ method: 'eth_accounts' });

        setCurrentAddressMetamask(accounts[0])

        //   recupererSolde(accounts[0])
        } catch (error) {
        console.error(error);
        }
    };
    // ***************************************Fin**************************************

    // *******************************************************************************
        //Created check function to see if the MetaMask extension is installed
    // *******************************************************************************
    const isMetaMaskInstalled = () => {
        //Have to check the ethereum binding on the window object to see if it's installed
        const { ethereum } = window;
        return Boolean(ethereum && ethereum.isMetaMask);
    };
    // ************************************Fin****************************************

    // *******************************************************************************
        //Now we check to see if Metmask is installed
    // *******************************************************************************
    const MetaMaskClientCheck = async () => {
        
        if (!isMetaMaskInstalled()) {
            Swal.fire({
                title: 'MetaMask non installé!',
                text: 'Modal with a custom image.',
                html:
                    'Veuillez cliquer sur ce, ' +
                    '<b><a href="https://metamask.io/?source=korben.info" target="_blank">lien</a></b> ' +
                    "pour l'installer",
                imageUrl: '/images/ecfa/metamask/metamask.png',
                imageWidth: 200,
                imageHeight: 200,
                imageAlt: 'Custom image',
                })
        } else {
            // Appel de la fonction d'injection du réseau dans MetaMask définie ci-dessus
            await onClickConnect();
        }
    };
    // ********************************Fin*********************************************


    // *************************************************************************************
        // FONCTION POUR EFFECTUER LE MINT
    // *************************************************************************************
    
    
    async function mintTokens() {
        setIsLoggingIn(true)
        
        try {
            // Exécutez votre appel de contrat ici
            
            console.log("NEXT_PUBLIC_RPC_PROVIDER=>",NEXT_PUBLIC_RPC_PROVIDER)
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(ADDRESS_CONTRAT_EWARI, ABI_TOKEN_EWARI.abi, signer);
            
            if (window.ethereum && window.ethereum.isConnected()) {
                await window.ethereum.request({ method: "eth_requestAccounts" });
                const amount = ethers.utils.parseUnits(amountMint, 10);
                // const transaction = await contract.mintFrom("0x496Dd9744c3a1B0Ec4C2998656BEA67DbCec888B",amount);
                const transaction = await contract.mint(amount);
                
                await transaction.wait();
                if (transaction.hash) {
                    setIsLoggingIn(false)
                    Swal.fire({
                        position: 'top-center',
                        icon: 'success',
                        title: `Succès`,
                        html:`<p> Le <b>Mint</b> s'est effectué avec succès. Ci-dessous le hash du mint : <br/> ${transaction.hash} </p>`,
                        showConfirmButton: false,
                        timer: 20000
                    })

                     // Actualiser après l'affichage 
                     setTimeout(() => {
                        window.location.reload()
                    }, 20000)
                    // Fin
                }
            } else {
                setIsLoggingIn(false)
                Swal.fire({
                    position: 'top-center',
                    icon: 'error',
                    title: `Erreur`,
                    html:`<p> Merci de connecter le wallet MetaMask</p>`,
                    showConfirmButton: false,
                    timer: 20000
                })
            }
            

            } catch (error) {
                if (error.message.search('revert') >= 0) {
                    // Traitez l'erreur de revert ici
                    setIsLoggingIn(true)
                    Swal.fire({
                        position: 'top-center',
                        icon: 'error',
                        title: `Erreur`,
                        html:`<p> Un erreur de revert s'est produite. <br/>Assurez vous d'avoir le droit d'exécution de cette fonction.</p>`,
                        showConfirmButton: false,
                        timer: 20000
                    })

                    console.log(error.message);
                } else {
                    // Traitez toute autre erreur ici
                    setIsLoggingIn(false)
                    Swal.fire({
                        position: 'top-center',
                        icon: 'error',
                        title: `Erreur`,
                        html:`<p> Un erreur s'est produite.</p>`,
                        showConfirmButton: false,
                        timer: 20000
                    })

                }
            }
    }
    const handleSubmit = (e) => {
        e.preventDefault()
    }
    // *********************FIN****************************************************************
    

    // *************************************************************************************
        // FONCTION POUR EFFECTUER LE MINT
    // *************************************************************************************
    
    
    async function burnTokens() {
        setIsLoggingInBurn(true)
        try {
            // Exécutez votre appel de contrat ici
            
            console.log("NEXT_PUBLIC_RPC_PROVIDER=>",NEXT_PUBLIC_RPC_PROVIDER)
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(ADDRESS_CONTRAT_EWARI, ABI_TOKEN_EWARI.abi, signer);
            
            if (window.ethereum && window.ethereum.isConnected()) {
                await window.ethereum.request({ method: "eth_requestAccounts" });
                const amount = ethers.utils.parseUnits(amountBurn, 10);
                // const transaction = await contract.mint("0x88e036DCf477F016a605049e04952bb7BD828BD0",amount);
                const transaction = await contract.burn(amount);
                await transaction.wait();

                if (transaction.hash) {
                    setIsLoggingInBurn(false)
                    Swal.fire({
                        position: 'top-center',
                        icon: 'success',
                        title: `Succès`,
                        html:`<p> Le <b>Burn</b> s'est effectué avec succès. Ci-dessous le hash du burn : <br/> ${transaction.hash} </p>`,
                        showConfirmButton: false,
                        timer: 20000
                    })

                    // Actualiser après l'affichage 
                    setTimeout(() => {
                        window.location.reload()
                    }, 20000)
                    // Fin
                }
               
            } else {
            setIsLoggingInBurn(false)
                Swal.fire({
                    position: 'top-center',
                    icon: 'error',
                    title: `Erreur`,
                    html:`<p> Merci de connecter le wallet MetaMask</p>`,
                    showConfirmButton: false,
                    timer: 20000
                })
            }
            

            } catch (error) {
                if (error.message.search('revert') >= 0) {
                    // Traitez l'erreur de revert ici
                    console.log(error.message);

                    setIsLoggingInBurn(false)
                    Swal.fire({
                        position: 'top-center',
                        icon: 'error',
                        title: `Erreur`,
                        html:`<p> Un erreur de revert s'est produite. <br/>Assurez vous d'avoir le droit d'exécution de cette fonction.</p>`,
                        showConfirmButton: false,
                        timer: 20000
                    })

                    
                } else {
                    // Traitez toute autre erreur ici
                    setIsLoggingInBurn(false)
                    Swal.fire({
                        position: 'top-center',
                        icon: 'error',
                        title: `Erreur`,
                        html:`<p> Un erreur s'est produite. </p>`,
                        showConfirmButton: false,
                        timer: 20000
                    })
                }
            }
    }
    
    // *********************FIN****************************************************************
    


    // **************************************************************************************************
        // RECUPERER LES TRANSACTION MINT EFFCTUER PAR UNE ADRESSE
    // **************************************************************************************************
    useEffect(() => {

        const provider = new ethers.providers.JsonRpcProvider("https://rpc.testnet.moonbeam.network");


const stablecoinContractAddress = "0x1234567890123456789012345678901234567890"; // remplacer par l'adresse du contrat de stablecoin

const stablecoinContract = new ethers.Contract(ADDRESS_CONTRAT_EWARI, ABI_TOKEN_EWARI.abi, provider);

const address = "0xAd272BE6544B7683A0393fD60f4050a5eDf10FA2"; // remplacer par l'adresse que vous souhaitez vérifier

const filter = {
  address: ADDRESS_CONTRAT_EWARI,
  topics: [
    ethers.utils.id("Transfer(address,address,uint256)"), // remplacer par le nom de l'événement de transfert de votre stablecoin
    ethers.utils.hexZeroPad(address, 32), // filtre les événements liés à l'adresse spécifiée comme émetteur ou destinataire
  ],
};

const ok = stablecoinContract.provider.getLogs(filter)
  console.log("logs=>",ok);

// stablecoinContract.provider.getLogs(filter).then((logs) => {
//   console.log("logs=>",logs);
// });

      
}, []);
    

    // ************************FIN**********************************************************************************



  return (
    <>

      <div className='' >
        <div className=' mx-15'>
            <div className='py-10'>
                <h1 className='text-center'>Mint & Burn</h1>
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
        <div className='btn-box text-center my-5'>
            <Button
                color="primary"
                type="button"
                onClick={MetaMaskClientCheck}
            >
                Connecter wallet MetaMask
            </Button>
        </div>
           
        <div className='cryptocurrency-search-box'>
            <div className='row'>
                    <div className='col-lg-6 col-md-6'>
                        <div className='currency-selection '>
                            <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                                <div className='cryptocurrency-slides'>
                                    <div className='single-cryptocurrency-box'>
                                        <div className='align-items-center'>
                                            <div className='title'>
                                                <h3 className='text-center'>Mint </h3>
                                            </div>
                                            <hr/>
                                        </div>

                                        <form onSubmit={handleSubmit}>
                                        {/* <form> */}
                                            <div className='input-group-alternative m-3'>
                                                <label className="mx-2  mb-2" htmlFor='amount'>
                                                    Montant
                                                </label>

                                                <input
                                                type='number'
                                                name='amount'
                                                required='required'
                                                id='amount'
                                                placeholder="Montant"
                                                className="form-control"
                                                defaultValue={amountMint} 
                                                onChange={(event)=>setAmountMint(event.target.value)}
                                                            
                                                />
                                            </div>

                                            <div className='input-group-alternative m-3'>
                                                <label className="mx-2  mb-2" htmlFor='address'>
                                                    Adresse blockchain
                                                </label>

                                                <input
                                                type='text'
                                                name='address'
                                                required='required'
                                                disabled
                                                id='address'
                                                placeholder="Adresse blockchain"
                                                className="form-control"
                                                defaultValue={currentAddressMetamask} 
                                                onChange={(event)=>setCurrentAddressMetamask(event.target.value)}
                                                            
                                                />
                                            </div>
                                            {currentAddressMetamask ? (
                                                <div className='btn-box'>
                                                    <Button
                                                        block
                                                        color="primary"
                                                        type="button"
                                                        onClick={mintTokens}
                                                        disabled={isLoggingIn}

                                                    >
                                                        Exécuter 
                                                        {isLoggingIn === true ? (<i className="fas fa-spinner fa-spin fa-lg"></i>) : ("")}
                                                    </Button>
                                                </div>
                                            ) : ("")}
                                        </form>
                                            
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                                
                    <div className='col-lg-6 col-md-6'>
                        <div className='currency-selection'>
                            <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                            <div className='cryptocurrency-slides'>
                                    <div className='single-cryptocurrency-box'>
                                        <div className=' align-items-center'>
                                            <div className='title '>
                                                <h3 className='text-center'>Burn</h3>
                                            </div>
                                            <hr/>
                                        </div>
                                        <form onSubmit={handleSubmit}>
                                                <div className='input-group-alternative m-3'>
                                                    <label className="mx-2 mb-2" htmlFor='amount'>
                                                        Montant
                                                    </label>

                                                    <input
                                                    type='number'
                                                    name='amount'
                                                    required='required'
                                                    id='amount'
                                                    placeholder="Montant"
                                                    className="form-control"
                                                    defaultValue={amountBurn} 
                                                    onChange={(event)=>setAmountBurn(event.target.value)}
                                                            
                                                    />
                                                </div>

                                                <div className='input-group-alternative m-3'>
                                                    <label className="mx-2 mb-2" htmlFor='address'>
                                                        Adresse blockchain
                                                    </label>

                                                    <input
                                                    type='text'
                                                    name='address'
                                                    required='required'
                                                    id='address'
                                                    disabled
                                                    placeholder="Adresse blockchain"
                                                    className="form-control"
                                                    defaultValue={currentAddressMetamask} 
                                                    onChange={(event)=>setCurrentAddressMetamask(event.target.value)}
                                                          
                                                    />
                                                </div>

                                                {currentAddressMetamask ? (
                                                    <div className='btn-box'>
                                                        <Button
                                                            block
                                                            color="primary"
                                                            type="button"
                                                            onClick={burnTokens}
                                                            disabled={isLoggingInBurn}
                                                        >
                                                            Exécuter
                                                            {isLoggingInBurn === true ? (<i className="fas fa-spinner fa-spin fa-lg"></i>) : ("")}
                                                        </Button>
                                                    </div>
                                                ) : ("")}
                                            </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
      </div>

    </>
  );
};

export default ActionMintBurn;
