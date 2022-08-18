import React, { useState, useEffect } from "react";
import { Web3Provider } from "@ethersproject/providers";
import { Magic } from "magic-sdk";
import Web3 from "web3";
import { ethers } from "ethers";
import Swal from 'sweetalert2'



export default function CardAdmin() {

    const [magicTest, setMagicTest] = useState(null);
    const [providerTest, setProviderTest] = useState(null);
  
  // TOKEN
    const [currentAdresse, setCurrentAdresse] = useState("...");
    const [balance, setBalance] = useState(0);
    const [symbol, setSymbol] = useState(null);

    // PARTIE NSIA
    const [balanceNsia, setBalanceNsia] = useState(0);
    const [symbolNsia, setSymbolNsia] = useState(null);
    const [nameNsia, setNameNsia] = useState(null);

    // PARTIE CREPMF
    const [balanceCrepmf, setBalanceCrepmf] = useState(0);
    const [symbolCrepmf, setSymbolCrepmf] = useState(null);
    const [nameCrepmf, setNameCrepmf] = useState(null);


    // PARTIE SICAV ABDOU
    const [balanceSica, setBalanceSica] = useState(0);
    const [symbolSica, setSymbolSica] = useState(null);
    const [nameSicav, setNameSicav] = useState(null);


    // PARTIE ECOBANK
    const [balanceEcobank, setBalanceEcobank] = useState(0);
    const [symbolEcobank, setSymbolEcobank] = useState(null);
    const [nameEcobank, setNameEcobank] = useState(null);


    // PARTIE CORIS
    const [balanceCoris, setBalanceCoris] = useState(0);
    const [symbolCoris, setSymbolCoris] = useState(null);
    const [nameCoris, setNameCoris] = useState(null);

 // TOKEN ENVOYER VERS AUTRE ADRESSE
    const [adresseTo, setAdresseTo] = useState(null);
  const [montantSaisiForTo, setMontantSaisiForTo] = useState();

    // SOLDE DEV
    // const [sol, setAdresseTo] = useState(null);


  
  //   FORM
  const [montantSaisi, setMontantSaisi] = useState();
  const [montantSaisiBurn, setMontantSaisiBurn] = useState();

  const [montantSaisiMintNsia, setMontantSaisiMintNsia] = useState();
  const [montantSaisiBurnNsia, setMontantSaisiBurnNsia] = useState();

  const [montantSaisiMintCrepmf, setMontantSaisiMintCrepmf] = useState();
  const [montantSaisiBurnCrepmf, setMontantSaisiBurnCrepmf] = useState();

  const [montantSaisiMintSicav, setMontantSaisiMintSicav] = useState();
  const [montantSaisiBurnSicav, setMontantSaisiBurnSicav] = useState();

  const [montantSaisiMintEcobank, setMontantSaisiMintEcobank] = useState();
  const [montantSaisiBurnEcobank, setMontantSaisiBurnEcobank] = useState();

  const [montantSaisiMintCoris, setMontantSaisiMintCoris] = useState();
  const [montantSaisiBurnCoris, setMontantSaisiBurnCoris] = useState();


  
      let Rpcweb3 = 'https://rpc.testnet.moonbeam.network';
      let Rpcprovider = "https://rpc.testnet.moonbeam.network";
      let priv_key = "58daac6cd25ffc439211c40ffc0b4600e95dbe89486e037259e4295563c117ce";
      let public_key = "0x9Eb056F83507F21EE512e2A8f2aD8EA7B9CBeE28";
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

      // PARTIE NSIA EPARGNE
  let Adresse_NSIA = "0x8eDc301c590F48eAa594F73D0837A55694250a2c"
  let ABINsia = [
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
      }
  ]

  // PARTIE CREPMF
  let Adresse_CREPMF = "0x7480766cDFc07664d610c996F760127F5d39C3BD"
  let ABICrepmf = [
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
  }
]
  // PARTIE SICAV ABDOU
  let Adresse_SICAV = "0xf3e66649698cc166705dB397e6209216Fea7eCfd"
  let ABI_Sicav = [
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
  }
]
  // PARTIE ECOBANK
  let Adresse_ECOBANK = "0x7aC8d02Aef5A66d7b2E019c05B098D25fdcA3e02"
  let ABI_Ecobank = [
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
  }
]

  // PARTIE CORIS
  let Adresse_FCP = "0xD5dcB240712636AE923208C1004a6320891dd933"
  let ABI_fcp = [
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
  }
]

    
  
  
  
    
  
    useEffect(() => {
  
      const BSCOptions = {
        // rpcUrl: process.env.NEXT_PUBLIC_RPC_URL_56,
        // rpcUrl: 'https://bsc-dataseed.binance.org',
        rpcUrl: "https://rpc.testnet.moonbeam.network", // Smart
        chainId: 1287,
      };
  
      const mt = new Magic("pk_live_35896039660A9884", {
        network: BSCOptions,
      });
      
      setMagicTest(mt);
      if (!!magicTest) {
        const pt = new Web3Provider(magicTest.rpcProvider);
        setProviderTest(pt);
      }
    }, []);
    
  
    useEffect(() => {
      if (!!magicTest) {
        const pt = new Web3Provider(magicTest.rpcProvider);
        setProviderTest(pt);
      }
    }, [magicTest]);

   
  
  
    
    
  
    useEffect(() => {
      (async () => {
        if (!!magicTest && !!providerTest) {
          const userMetadata = await magicTest.user.getMetadata();
          const signer = providerTest.getSigner();
          const network = await providerTest.getNetwork();
          const userAddress = await signer.getAddress();
          setCurrentAdresse(userAddress);
          //const userBalance = ethers.utils.formatEther(await provider.getBalance(userAddress))
          
          const web3 = new Web3(Rpcweb3)
            const contract = new web3.eth.Contract(AbiEcfa,adresseEcfa)
            const balanceECFA = await contract.methods.balanceOf(public_key).call()
            const symbole = await contract.methods.symbol().call()
            setSymbol(symbole)
            setBalance(balanceECFA/10**2)

            // PARTIE NSIA
            const contractN = new web3.eth.Contract(ABINsia,Adresse_NSIA)
            const balanceN = await contractN.methods.balanceOf(public_key).call()
            const symboleN = await contractN.methods.symbol().call()
            const nameN = await contractN.methods.name().call()
            setSymbolNsia(symboleN)
            setNameNsia(nameN)
            setBalanceNsia(balanceN/10**2)

            // PARTIE CREPMF
            const contractC = new web3.eth.Contract(ABICrepmf,Adresse_CREPMF)
            const balanceC = await contractC.methods.balanceOf(public_key).call()
            const symboleC = await contractC.methods.symbol().call()
            const nameC = await contractC.methods.name().call()
            setSymbolCrepmf(symboleC)
            setNameCrepmf(nameC)
            setBalanceCrepmf(balanceC/10**2)

            // PARTIE SICAV
            const contractS = new web3.eth.Contract(ABI_Sicav,Adresse_SICAV)
            const balanceS = await contractS.methods.balanceOf(public_key).call()
            const symboleS = await contractS.methods.symbol().call()
            const nameS = await contractS.methods.name().call()
            setNameSicav(nameS)
            setSymbolSica(symboleS)
            setBalanceSica(balanceS/10**2)

            // PARTIE ECOBANK
            const contractE = new web3.eth.Contract(ABI_Ecobank,Adresse_ECOBANK)
            const balanceE = await contractE.methods.balanceOf(public_key).call()
            const symboleE = await contractE.methods.symbol().call()
            const nameE = await contractE.methods.name().call()
            setNameEcobank(nameE)
            setSymbolEcobank(symboleE)
            setBalanceEcobank(balanceE/10**2)

            // PARTIE FCP CORIS
            const contractF = new web3.eth.Contract(ABI_fcp,Adresse_FCP)
            const balanceF = await contractF.methods.balanceOf(public_key).call()
            const symboleF = await contractF.methods.symbol().call()
            const nameF = await contractF.methods.name().call()
            setNameCoris(nameF)
            setSymbolCoris(symboleF)
            setBalanceCoris(balanceF/10**2)

        }
      })();
    }, [providerTest, magicTest]);
   
    // PARTIE MINT
    const handleSubmit = (e) => {
        e.preventDefault()
    }

    const handleSubmitMintNsia = (e) => {
        e.preventDefault()
    }

    const handleSubmitMintCrepmf = (e) => {
        e.preventDefault()
    }

    const handleSubmitMintSicav = (e) => {
        e.preventDefault()
    }

    const handleSubmitMintEcobank = (e) => {
        e.preventDefault()
    }

    const handleSubmitMintCoris = (e) => {
        e.preventDefault()
    }
    //   FIN MINT

    // PARTIE BURN
    const handleSubmitBurn = (e) => {
        e.preventDefault()
    }

    const handleSubmitBurnNsia = (e) => {
        e.preventDefault()
    }

    const handleSubmitBurnCrepmf = (e) => {
        e.preventDefault()
    }

    const handleSubmitBurnSicav = (e) => {
        e.preventDefault()
    }

    const handleSubmitBurnEcobank = (e) => {
        e.preventDefault()
    }

    const handleSubmitBurnCoris = (e) => {
        e.preventDefault()
    }
    //   FIN BURN

 
  //  ******************************************
      // FONCTION MINT POUR CREER DES TOKENS
  // ******************************************
  
  function mint() {
      let wallet = new ethers.Wallet(priv_key)
      const provider = new ethers.providers.JsonRpcProvider(Rpcprovider);
      let walletSigner = wallet.connect(provider)
      
        if (adresseEcfa) {
          //instanciation du contract (erc20 custom)
          let contract = new ethers.Contract(
                adresseEcfa ,
                AbiEcfa ,
                walletSigner
          )
    
          //on parse le montant recuperé dans le champ
          let numberOfTokens = ethers.utils.parseUnits(montantSaisi, 2)
          console.log(`numberOfTokens: ${numberOfTokens}`)
    
          //execution du transfert
          contract.mint(numberOfTokens).then((transferResult) => {
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
          console.log("l'adress nexiste pas");
        }
    }


    // NSIA
    function mintNsia() {
        let wallet = new ethers.Wallet(priv_key)
        const provider = new ethers.providers.JsonRpcProvider(Rpcprovider);
        let walletSigner = wallet.connect(provider)
        
          if (Adresse_NSIA ) {
            //instanciation du contract (erc20 custom)
            let contractN = new ethers.Contract(
                Adresse_NSIA ,
                ABINsia,
                walletSigner
            )
      
            //on parse le montant recuperé dans le champ
            let numberOfTokens = ethers.utils.parseUnits(montantSaisiMintNsia, 2)
            console.log(`numberOfTokens: ${numberOfTokens}`)
      
            //execution du transfert
            contractN.mint(numberOfTokens).then((transferResult) => {
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
            console.log("l'adress nexiste pas");
          }
      }

    //   CREPMF
    function mintCrepmf() {
        let wallet = new ethers.Wallet(priv_key)
        const provider = new ethers.providers.JsonRpcProvider(Rpcprovider);
        let walletSigner = wallet.connect(provider)
        
          if (Adresse_CREPMF) {
            //instanciation du contract (erc20 custom)
            let contractC = new ethers.Contract(
                Adresse_CREPMF,
                ABICrepmf,
                walletSigner
            )
      
            //on parse le montant recuperé dans le champ
            let numberOfTokens = ethers.utils.parseUnits(montantSaisiMintCrepmf, 2)
            console.log(`numberOfTokens: ${numberOfTokens}`)
      
            //execution du transfert
            contractC.mint(numberOfTokens).then((transferResult) => {
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
            console.log("l'adress nexiste pas");
          }
      }

    //   SICAV
    function mintSicav() {
        let wallet = new ethers.Wallet(priv_key)
        const provider = new ethers.providers.JsonRpcProvider(Rpcprovider);
        let walletSigner = wallet.connect(provider)
        
          if (Adresse_SICAV) {
            //instanciation du contract (erc20 custom)
            let contractS = new ethers.Contract(
                Adresse_SICAV ,
                ABI_Sicav,
                walletSigner
            )
      
            //on parse le montant recuperé dans le champ
            let numberOfTokens = ethers.utils.parseUnits(montantSaisiMintSicav, 2)
            console.log(`numberOfTokens: ${numberOfTokens}`)
      
            //execution du transfert
            contractS.mint(numberOfTokens).then((transferResult) => {
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
            console.log("l'adress nexiste pas");
          }
      }

    //   ECOBANK
    function mintEcobank() {
        let wallet = new ethers.Wallet(priv_key)
        const provider = new ethers.providers.JsonRpcProvider(Rpcprovider);
        let walletSigner = wallet.connect(provider)
        
          if (Adresse_ECOBANK) {
            //instanciation du contract (erc20 custom)
            let contractE = new ethers.Contract(
                Adresse_ECOBANK,
                ABI_Ecobank,
                walletSigner
            )
      
            //on parse le montant recuperé dans le champ
            let numberOfTokens = ethers.utils.parseUnits(montantSaisiMintEcobank, 2)
            console.log(`numberOfTokens: ${numberOfTokens}`)
      
            //execution du transfert
            contractE.mint(numberOfTokens).then((transferResult) => {
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
            console.log("l'adress nexiste pas");
          }
      }

    //   CORIS
    function mintCoris() {
        let wallet = new ethers.Wallet(priv_key)
        const provider = new ethers.providers.JsonRpcProvider(Rpcprovider);
        let walletSigner = wallet.connect(provider)
        
          if (Adresse_FCP ) {
            //instanciation du contract (erc20 custom)
            let contractF = new ethers.Contract(
                Adresse_FCP ,
                ABI_fcp,
                walletSigner
            )
      
            //on parse le montant recuperé dans le champ
            let numberOfTokens = ethers.utils.parseUnits(montantSaisiMintEcobank, 2)
            console.log(`numberOfTokens: ${numberOfTokens}`)
      
            //execution du transfert
            contractF.mint(numberOfTokens).then((transferResult) => {
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
            console.log("l'adress nexiste pas");
          }
      }

  //   FIN FONCTION MINT POUR CREER DES TOKENS

   // FONCTION BURN POUR DETRUIRE DES TOKENS
  // ******************************************
  
  function burn() {
    let wallet = new ethers.Wallet(priv_key)
    const provider = new ethers.providers.JsonRpcProvider(Rpcprovider);
    let walletSigner = wallet.connect(provider)
    
      if (adresseEcfa) {
        //instanciation du contract (erc20 custom)
        let contract = new ethers.Contract(
              adresseEcfa ,
              AbiEcfa ,
              walletSigner
        )
  
        //on parse le montant recuperé dans le champ
        let numberOfTokens = ethers.utils.parseUnits(montantSaisiBurn, 2)
        console.log(`numberOfTokens: ${numberOfTokens}`)
  
        //execution du transfert
        contract.burn(numberOfTokens).then((transferResult) => {
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
        console.log("l'adress nexiste pas");
      }
  }

//   NSIA
function burnNsia() {
    let wallet = new ethers.Wallet(priv_key)
    const provider = new ethers.providers.JsonRpcProvider(Rpcprovider);
    let walletSigner = wallet.connect(provider)
    
      if (Adresse_NSIA) {
        //instanciation du contract (erc20 custom)
        let contractBN = new ethers.Contract(
            Adresse_NSIA ,
            ABINsia,
            walletSigner
        )
  
        //on parse le montant recuperé dans le champ
        let numberOfTokens = ethers.utils.parseUnits(montantSaisiBurnNsia, 2)
        console.log(`numberOfTokens: ${numberOfTokens}`)
  
        //execution du transfert
        contractBN.burn(numberOfTokens).then((transferResult) => {
          console.dir(transferResult)
      //   Router.push('/profil/')
          setTimeout(()=>{
              window.location.reload()
          },20000) 
          alert(`Transaction réussie. Le hash est ${transferResult.hash}`)

          

        })
      }else{
        console.log("l'adress nexiste pas");
      }
  }

//   CREPMF
function burnCrepmf() {
    let wallet = new ethers.Wallet(priv_key)
    const provider = new ethers.providers.JsonRpcProvider(Rpcprovider);
    let walletSigner = wallet.connect(provider)
    
      if (Adresse_CREPMF) {
        //instanciation du contract (erc20 custom)
        let contractbc = new ethers.Contract(
            Adresse_CREPMF ,
            ABICrepmf,
            walletSigner
        )
  
        //on parse le montant recuperé dans le champ
        let numberOfTokens = ethers.utils.parseUnits(montantSaisiBurnCrepmf, 2)
        console.log(`numberOfTokens: ${numberOfTokens}`)
  
        //execution du transfert
        contractbc.burn(numberOfTokens).then((transferResult) => {
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
        console.log("l'adress nexiste pas");
      }
  }

//   SICAV
function burnSicav() {
    let wallet = new ethers.Wallet(priv_key)
    const provider = new ethers.providers.JsonRpcProvider(Rpcprovider);
    let walletSigner = wallet.connect(provider)
    
      if (Adresse_SICAV ) {
        //instanciation du contract (erc20 custom)
        let contractbs = new ethers.Contract(
            Adresse_SICAV ,
            ABI_Sicav,
            walletSigner
        )
  
        //on parse le montant recuperé dans le champ
        let numberOfTokens = ethers.utils.parseUnits(montantSaisiBurnSicav, 2)
        console.log(`numberOfTokens: ${numberOfTokens}`)
  
        //execution du transfert
        contractbs.burn(numberOfTokens).then((transferResult) => {
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
        console.log("l'adress nexiste pas");
      }
  }

//   ECOBANK
function burnEcobank() {
    let wallet = new ethers.Wallet(priv_key)
    const provider = new ethers.providers.JsonRpcProvider(Rpcprovider);
    let walletSigner = wallet.connect(provider)
    
      if (Adresse_ECOBANK) {
        //instanciation du contract (erc20 custom)
        let contractbe = new ethers.Contract(
            Adresse_ECOBANK ,
            ABI_Ecobank,
            walletSigner
        )
  
        //on parse le montant recuperé dans le champ
        let numberOfTokens = ethers.utils.parseUnits(montantSaisiBurnEcobank, 2)
        console.log(`numberOfTokens: ${numberOfTokens}`)
  
        //execution du transfert
        contractbe.burn(numberOfTokens).then((transferResult) => {
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
        console.log("l'adress nexiste pas");
      }
  }

//   CORIS
function burnCoris() {
    let wallet = new ethers.Wallet(priv_key)
    const provider = new ethers.providers.JsonRpcProvider(Rpcprovider);
    let walletSigner = wallet.connect(provider)
    
      if (Adresse_FCP) {
        //instanciation du contract (erc20 custom)
        let contractbf = new ethers.Contract(
            Adresse_FCP,
            ABI_fcp,
            walletSigner
        )
  
        //on parse le montant recuperé dans le champ
        let numberOfTokens = ethers.utils.parseUnits(montantSaisiBurnEcobank, 2)
        console.log(`numberOfTokens: ${numberOfTokens}`)
  
        //execution du transfert
        contractbf.burn(numberOfTokens).then((transferResult) => {
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
        console.log("l'adress nexiste pas");
      }
  }
//   FIN FONCTION BURN POUR DETRUIRE

 

  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
      <div>
       
        <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg mx-auto rounded-xl bg-white">
          <div className="mt-4 p-4">
            <h1 className="text-xl font-semibold text-gray-700 text-center">
              DASHBOARD
            </h1>
          </div>
        </div>

        <div className="col-lg-12 col-md-12 ml-3">
                <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                    
                    <div className="">  
                    <div className="mt-4 p-4">
                        <p className="text-xl font-semibold text-gray-700 text-center">
                            {/* <button onClick={getECFABalance}>ok</button> */}
                            {/* <div onClick={getECFABalance()}></div> */}

                            Mon solde : {balance} {symbol}
                        </p>
                    </div>
                    </div>
                    <div className="row " >
                        <div className="col-lg-6 col-md-6">
                            <div className="mt-4 p-4">
                                <p className="text-xl font-semibold text-gray-700 ">
                                    Créer des E-WARI
                                </p>
                            </div>
                            <div className="mb-3 ml-3">

                            <form className="mx-3" onSubmit={handleSubmit}>
                                <div className="row ml-3">
                                    <div className="col-lg-6 col-md-6 mb-3">
                                        <div className="input-group flex-nowrap">
                                            <span className="input-group-text" id="addon-wrapping">{symbol}</span>
                                            <input type="number" defaultValue={montantSaisi} onChange={(e)=>setMontantSaisi(e.target.value)} placeholder="Montant ECFA" aria-describedby="addon-wrapping  autoFocus" className="input input-sm input-bordered form-control" />
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6">
                                        <button type="submit" onClick={mint}  className="btn btn-success">Créer E-WARI</button>
                                    </div>
                                </div>
                            </form>

                            </div>
                        </div>

                        <div className="col-lg-6 col-md-6">
                            <div className="mt-4 p-4">
                                <p className="text-xl font-semibold text-gray-700 ">
                                    Détruire E-WARI
                                </p>
                            </div>
                            <div className="mb-3 ml-3">

                            <form className="mx-3" onSubmit={handleSubmitBurn}>
                                <div className="row ml-3">
                                    <div className="col-lg-6 col-md-6 mb-3">
                                        <div className="input-group flex-nowrap">
                                            <span className="input-group-text" id="addon-wrapping">{symbol}</span>
                                            <input type="number" defaultValue={montantSaisiBurn} onChange={(e)=>setMontantSaisiBurn(e.target.value)} placeholder="Montant ECFA" aria-describedby="addon-wrapping  autoFocus" className="input input-sm input-bordered form-control" />
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6">
                                        <button type="submit" onClick={burn}  className="btn btn-danger">Détruire E-WARI</button>
                                    </div>
                                </div>
                            </form>

                            </div>
                        </div>
                    </div>
                </div>

                <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                    
                    <div className="">  
                    <div className="mt-4 p-4">
                        <p className="text-xl font-semibold text-gray-700 text-center">
                            {/* <button onClick={getECFABalance}>ok</button> */}
                            {/* <div onClick={getECFABalance()}></div> */}

                            Mon solde : {balanceNsia} {nameNsia}
                        </p>
                    </div>
                    </div>
                    <div className="row " >
                        <div className="col-lg-6 col-md-6">
                            <div className="mt-4 p-4">
                                <p className="text-xl font-semibold text-gray-700 ">
                                    Créer des NSIA
                                </p>
                            </div>
                            <div className="mb-3 ml-3">

                            <form className="mx-3" onSubmit={handleSubmitMintNsia}>
                                <div className="row ml-3">
                                    <div className="col-lg-6 col-md-6 mb-3">
                                        <div className="input-group flex-nowrap">
                                            <span className="input-group-text" id="addon-wrapping">{symbolNsia}</span>
                                            <input type="number" defaultValue={montantSaisiMintNsia} onChange={(e)=>setMontantSaisiMintNsia(e.target.value)} placeholder="Montant NSIA" aria-describedby="addon-wrapping  autoFocus" className="input input-sm input-bordered form-control" />
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6">
                                        <button type="submit" onClick={mintNsia}  className="btn btn-success">Créer NSIA</button>
                                    </div>
                                </div>
                            </form>

                            </div>
                        </div>

                        <div className="col-lg-6 col-md-6">
                            <div className="mt-4 p-4">
                                <p className="text-xl font-semibold text-gray-700 ">
                                    Détruire NSIA
                                </p>
                            </div>
                            <div className="mb-3 ml-3">

                            <form className="mx-3" onSubmit={handleSubmitBurnNsia}>
                                <div className="row ml-3">
                                    <div className="col-lg-6 col-md-6 mb-3">
                                        <div className="input-group flex-nowrap">
                                            <span className="input-group-text" id="addon-wrapping">{symbolNsia}</span>
                                            <input type="number" defaultValue={montantSaisiBurnNsia} onChange={(e)=>setMontantSaisiBurnNsia(e.target.value)} placeholder="Montant NSIA" aria-describedby="addon-wrapping  autoFocus" className="input input-sm input-bordered form-control" />
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6">
                                        <button type="submit" onClick={burnNsia}  className="btn btn-danger">Détruire NSIA</button>
                                    </div>
                                </div>
                            </form>

                            </div>
                        </div>
                    </div>
                </div>


                <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                    
                    <div className="">  
                    <div className="mt-4 p-4">
                        <p className="text-xl font-semibold text-gray-700 text-center">
                            {/* <button onClick={getECFABalance}>ok</button> */}
                            {/* <div onClick={getECFABalance()}></div> */}

                            Mon solde : {balanceCrepmf} {nameCrepmf}
                        </p>
                    </div>
                    </div>
                    <div className="row " >
                        <div className="col-lg-6 col-md-6">
                            <div className="mt-4 p-4">
                                <p className="text-xl font-semibold text-gray-700 ">
                                    Créer des CREPMF
                                </p>
                            </div>
                            <div className="mb-3 ml-3">

                            <form className="mx-3" onSubmit={handleSubmitMintCrepmf}>
                                <div className="row ml-3">
                                    <div className="col-lg-6 col-md-6 mb-3">
                                        <div className="input-group flex-nowrap">
                                            <span className="input-group-text" id="addon-wrapping">{symbolCrepmf}</span>
                                            <input type="number" defaultValue={montantSaisiMintCrepmf} onChange={(e)=>setMontantSaisiMintCrepmf(e.target.value)} placeholder="Montant CREPMF" aria-describedby="addon-wrapping  autoFocus" className="input input-sm input-bordered form-control" />
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6">
                                        <button type="submit" onClick={mintCrepmf}  className="btn btn-success">Créer CREPMF</button>
                                    </div>
                                </div>
                            </form>

                            </div>
                        </div>

                        <div className="col-lg-6 col-md-6">
                            <div className="mt-4 p-4">
                                <p className="text-xl font-semibold text-gray-700 ">
                                    Détruire CREPMF
                                </p>
                            </div>
                            <div className="mb-3 ml-3">

                            <form className="mx-3" onSubmit={handleSubmitBurnCrepmf}>
                                <div className="row ml-3">
                                    <div className="col-lg-6 col-md-6 mb-3">
                                        <div className="input-group flex-nowrap">
                                            <span className="input-group-text" id="addon-wrapping">{symbolCrepmf}</span>
                                            <input type="number" defaultValue={montantSaisiBurnCrepmf} onChange={(e)=>setMontantSaisiBurnCrepmf(e.target.value)} placeholder="Montant CREPMF" aria-describedby="addon-wrapping  autoFocus" className="input input-sm input-bordered form-control" />
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6">
                                        <button type="submit" onClick={burnCrepmf}  className="btn btn-danger">Détruire CREPMF</button>
                                    </div>
                                </div>
                            </form>

                            </div>
                        </div>
                    </div>
                </div>

                <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                    
                    <div className="">  
                    <div className="mt-4 p-4">
                        <p className="text-xl font-semibold text-gray-700 text-center">
                            {/* <button onClick={getECFABalance}>ok</button> */}
                            {/* <div onClick={getECFABalance()}></div> */}

                            Mon solde : {balanceSica} {nameSicav}
                        </p>
                    </div>
                    </div>
                    <div className="row " >
                        <div className="col-lg-6 col-md-6">
                            <div className="mt-4 p-4">
                                <p className="text-xl font-semibold text-gray-700 ">
                                    Créer des SICAV
                                </p>
                            </div>
                            <div className="mb-3 ml-3">

                            <form className="mx-3" onSubmit={handleSubmitMintSicav}>
                                <div className="row ml-3">
                                    <div className="col-lg-6 col-md-6 mb-3">
                                        <div className="input-group flex-nowrap">
                                            <span className="input-group-text" id="addon-wrapping">{symbolSica}</span>
                                            <input type="number" defaultValue={montantSaisiMintSicav} onChange={(e)=>setMontantSaisiMintSicav(e.target.value)} placeholder="Montant SICAV" aria-describedby="addon-wrapping  autoFocus" className="input input-sm input-bordered form-control" />
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6">
                                        <button type="submit" onClick={mintSicav}  className="btn btn-success">Créer SICAV</button>
                                    </div>
                                </div>
                            </form>

                            </div>
                        </div>

                        <div className="col-lg-6 col-md-6">
                            <div className="mt-4 p-4">
                                <p className="text-xl font-semibold text-gray-700 ">
                                    Détruire SICAV
                                </p>
                            </div>
                            <div className="mb-3 ml-3">

                            <form className="mx-3" onSubmit={handleSubmitBurnSicav}>
                                <div className="row ml-3">
                                    <div className="col-lg-6 col-md-6 mb-3">
                                        <div className="input-group flex-nowrap">
                                            <span className="input-group-text" id="addon-wrapping">{symbolSica}</span>
                                            <input type="number" defaultValue={montantSaisiBurnSicav} onChange={(e)=>setMontantSaisiBurnSicav(e.target.value)} placeholder="Montant SICAV" aria-describedby="addon-wrapping  autoFocus" className="input input-sm input-bordered form-control" />
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6">
                                        <button type="submit" onClick={burnSicav}  className="btn btn-danger">Détruire SICAV</button>
                                    </div>
                                </div>
                            </form>

                            </div>
                        </div>
                    </div>
                </div>


                <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                    
                    <div className="">  
                    <div className="mt-4 p-4">
                        <p className="text-xl font-semibold text-gray-700 text-center">
                            {/* <button onClick={getECFABalance}>ok</button> */}
                            {/* <div onClick={getECFABalance()}></div> */}

                            Mon solde : {balanceEcobank} {nameEcobank}
                        </p>
                    </div>
                    </div>
                    <div className="row " >
                        <div className="col-lg-6 col-md-6">
                            <div className="mt-4 p-4">
                                <p className="text-xl font-semibold text-gray-700 ">
                                    Créer des ECOBANK
                                </p>
                            </div>
                            <div className="mb-3 ml-3">

                            <form className="mx-3" onSubmit={handleSubmitMintEcobank}>
                                <div className="row ml-3">
                                    <div className="col-lg-6 col-md-6 mb-3">
                                        <div className="input-group flex-nowrap">
                                            <span className="input-group-text" id="addon-wrapping">{symbolEcobank}</span>
                                            <input type="number" defaultValue={montantSaisiMintEcobank} onChange={(e)=>setMontantSaisiMintEcobank(e.target.value)} placeholder="Montant ECOBANK" aria-describedby="addon-wrapping  autoFocus" className="input input-sm input-bordered form-control" />
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6">
                                        <button type="submit" onClick={mintEcobank}  className="btn btn-success">Créer ECOBANK</button>
                                    </div>
                                </div>
                            </form>

                            </div>
                        </div>

                        <div className="col-lg-6 col-md-6">
                            <div className="mt-4 p-4">
                                <p className="text-xl font-semibold text-gray-700 ">
                                    Détruire ECOBANK
                                </p>
                            </div>
                            <div className="mb-3 ml-3">

                            <form className="mx-3" onSubmit={handleSubmitBurnEcobank}>
                                <div className="row ml-3">
                                    <div className="col-lg-6 col-md-6 mb-3">
                                        <div className="input-group flex-nowrap">
                                            <span className="input-group-text" id="addon-wrapping">{symbolEcobank}</span>
                                            <input type="number" defaultValue={montantSaisiBurnEcobank} onChange={(e)=>setMontantSaisiBurnEcobank(e.target.value)} placeholder="Montant ECOBANK" aria-describedby="addon-wrapping  autoFocus" className="input input-sm input-bordered form-control" />
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6">
                                        <button type="submit" onClick={burnEcobank}  className="btn btn-danger">Détruire ECOBANK</button>
                                    </div>
                                </div>
                            </form>

                            </div>
                        </div>
                    </div>
                </div>

                <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                    
                    <div className="">  
                    <div className="mt-4 p-4">
                        <p className="text-xl font-semibold text-gray-700 text-center">
                            {/* <button onClick={getECFABalance}>ok</button> */}
                            {/* <div onClick={getECFABalance()}></div> */}

                            Mon solde : {balanceCoris} {nameCoris}
                        </p>
                    </div>
                    </div>
                    <div className="row " >
                        <div className="col-lg-6 col-md-6">
                            <div className="mt-4 p-4">
                                <p className="text-xl font-semibold text-gray-700 ">
                                    Créer des CORIS
                                </p>
                            </div>
                            <div className="mb-3 ml-3">

                            <form className="mx-3" onSubmit={handleSubmitMintCoris}>
                                <div className="row ml-3">
                                    <div className="col-lg-6 col-md-6 mb-3">
                                        <div className="input-group flex-nowrap">
                                            <span className="input-group-text" id="addon-wrapping">{symbolCoris}</span>
                                            <input type="number" defaultValue={montantSaisiMintCoris} onChange={(e)=>setMontantSaisiMintCoris(e.target.value)} placeholder="Montant CORIS" aria-describedby="addon-wrapping  autoFocus" className="input input-sm input-bordered form-control" />
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6">
                                        <button type="submit" onClick={mintCoris}  className="btn btn-success">Créer CORIS</button>
                                    </div>
                                </div>
                            </form>

                            </div>
                        </div>

                        <div className="col-lg-6 col-md-6">
                            <div className="mt-4 p-4">
                                <p className="text-xl font-semibold text-gray-700 ">
                                    Détruire CORIS
                                </p>
                            </div>
                            <div className="mb-3 ml-3">

                            <form className="mx-3" onSubmit={handleSubmitBurnCoris}>
                                <div className="row ml-3">
                                    <div className="col-lg-6 col-md-6 mb-3">
                                        <div className="input-group flex-nowrap">
                                            <span className="input-group-text" id="addon-wrapping">{symbolCoris}</span>
                                            <input type="number" defaultValue={montantSaisiBurnCoris} onChange={(e)=>setMontantSaisiBurnCoris(e.target.value)} placeholder="Montant CORIS" aria-describedby="addon-wrapping  autoFocus" className="input input-sm input-bordered form-control" />
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6">
                                        <button type="submit" onClick={burnCoris} className="btn btn-danger">Détruire CORIS</button>
                                    </div>
                                </div>
                            </form>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
      </div>
      <div>

      </div>
    </div>
  );
}
