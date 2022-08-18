import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

// PARTIE MAGIC
import { magic } from "../../../magic";
import Web3 from "web3";
import { ethers } from "ethers";
import { Icon } from '@iconify/react';
import Swal from 'sweetalert2'
// FIN

const CardOpcvm = () => {
  const [nameTwo, setNameTwo] = useState('E-WARI');

//   POUR OPCVM
const [nomTokenOpcvm, setNomTokenOpcvm] = useState('Nsia Epargne')

// FIN OPCVM

  //converter hook
  const [conversionValue, setConversionValue] = useState('');
  const [cryptoQuantity, setcryptoQuantity] = useState(1);


//  Image E-WARI
  const [imageTwo, setImageTwo] = useState(
    '/images/ecfa/logo/logo_ewari1.jpg'
  );

  const [toggleState, setToggleState] = useState(false);


    // PARTIE MAGIC
    let adresseWealtech = "0x9Eb056F83507F21EE512e2A8f2aD8EA7B9CBeE28"

    let adresseRecepNsia = "0xad6ABa39Ae1bf961FA210Faa2db352f97209dc19";
    let adresseRecepCrepmf = "0xB3DF67B2c07D43e4c6Eab115411bf1fAaDAdD50b";
    let adresseRecepSicav = "0xD69a4fe2a84E2426d6823C10d158478EBdc499C2";
    let adresseRecepEcobank = "0x0eBa003CA865Fe44fCd948fFD6375be9D4D650D0";
    let adresseRecepCoris = "0x5f2f6c289DfB1A34E022ab2a741902078c294DF3";

    let Rpcweb3 = 'https://rpc.testnet.moonbeam.network';
    let Rpcprovider = "https://rpc.testnet.moonbeam.network";
    let priv_key = "58daac6cd25ffc439211c40ffc0b4600e95dbe89486e037259e4295563c117ce";
  //   PARTIE E-WARI
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

const [provider, setProvider] = useState(null);


    // const [montantInitial, setMontantInitial] = useState(0);
    // const [quantiteInitial, setQuantiteInitial] = useState();
    // let montantInitial = 0;
    // let quantiteInitial = 0;

    const [montantNsia, setMontantNsia] = useState(2000);
    const [quantiteNsia, setQuantiteNsia] = useState();

    const [montantCrepmf, setMontantCrepmf] = useState(8000);
    const [quantiteCrepmf, setQuantiteCrepmf] = useState();

    const [montantEcobank, setMontantEcobank] = useState(6000);
    const [quantiteEcobank, setQuantiteEcobank] = useState();

    const [montantSicav, setMontantSicav] = useState(4000);
    const [quantiteSicav, setQuantiteSicav] = useState();

    const [montantCoris, setMontantCoris] = useState(5000);
    const [quantiteCoris, setQuantiteCoris] = useState();



    // PARTIE RACHETER
    const [montantRachatNsia, setMontantRachatNsia] = useState(2000);
    const [quantiteRachatNsia, setQuantiteRachatNsia] = useState();

    const [montantRachatCrepmf, setMontantRachatCrepmf] = useState(8000);
    const [quantiteRachatCrepmf, setQuantiteRachatCrepmf] = useState();

    const [montantRachatSicav, setMontantRachatSicav] = useState(6000);
    const [quantiteRachatSicav, setQuantiteRachatSicav] = useState();

    const [montantRachatEcobank, setMontantRachatEcobank] = useState(4000);
    const [quantiteRachatEcobank, setQuantiteRachatEcobank] = useState();

    const [montantRachatCoris, setMontantRachatCoris] = useState(5000);
    const [quantiteRachatCoris, setQuantiteRachatCoris] = useState();


    // PARTIE VARIABLE GLOBALE
    const [montantSaisiGlobale, setMontantSaisiGlobale] = useState();
    const [quantiteGlobale, setQuantiteGlobale] = useState(0);
   
    // FIN
    
    const [currentAdresse, setCurrentAdresse] = useState("...");
    const [balance, setBalance] = useState();

    
    


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
            
            const web3 = new Web3(Rpcweb3)
              const contract = new web3.eth.Contract(AbiEcfa,adresseEcfa)
              const balanceECFA = await contract.methods.balanceOf(userAddress).call()
            //   const symbole = await contract.methods.symbol().call()
            //   setSymbol(symbole)
              setBalance(balanceECFA/10**2)
  
          }
        })();
      }, [provider, magic]);

      
      

        // let montantCalcule = quantiteGlobale * montantNsia;
        // let montantSaisiForNsia  = montantCalcule.toString();

        // let montantCalculeCrepmf = quantiteGlobale * montantCrepmf;
        // let montantSaisiForCrepmf = montantCalculeCrepmf.toString();

        // let montantCalculeSicav = quantiteGlobale * montantSicav;
        // let montantSaisiForSicav= montantCalculeSicav.toString();

        // let montantCalculeEcobank = quantiteGlobale * montantEcobank;
        // let montantSaisiForEcobank = montantCalculeEcobank.toString();

        // let montantCalculeCoris = quantiteGlobale * montantCoris;
        // let montantSaisiForCoris = montantCalculeCoris.toString();

    let montantCalcule = quantiteNsia * montantNsia;
    let montantSaisiForNsia  = montantCalcule.toString();

    let montantCalculeCrepmf = quantiteCrepmf * montantCrepmf;
    let montantSaisiForCrepmf = montantCalculeCrepmf.toString();

    let montantCalculeSicav = quantiteSicav * montantSicav;
    let montantSaisiForSicav= montantCalculeSicav.toString();

    let montantCalculeEcobank = quantiteEcobank * montantEcobank;
    let montantSaisiForEcobank = montantCalculeEcobank.toString();

    let montantCalculeCoris = quantiteCoris * montantCoris;
    let montantSaisiForCoris = montantCalculeCoris.toString();


    // PARTIE RACHETER
    let montantCalculeRachat = quantiteRachatNsia * montantRachatNsia;
    let montantSaisiForRachatNsia  = montantCalculeRachat.toString();

    let montantCalculeRachatC = quantiteRachatCrepmf * montantRachatCrepmf;
    let montantSaisiForRachatCrepmf  = montantCalculeRachatC.toString();

    let montantCalculeRachatS = quantiteRachatSicav * montantRachatSicav;
    let montantSaisiForRachatSicav  = montantCalculeRachatS.toString();

    let montantCalculeRachatE = quantiteRachatEcobank * montantRachatEcobank;
    let montantSaisiForRachatEcobank  = montantCalculeRachatE.toString();

    let montantCalculeRachatF = quantiteRachatCoris * montantRachatCoris;
    let montantSaisiForRachatCoris  = montantCalculeRachatF.toString();
    

    // ************************************************************************
        //   FONCTION DE TRANSACTION NSIA
    // **************************************************************************
    // fonction: Prendre les E-WARI du client pour envoyer vers notre adresse
    async function sell_tokenEcfa() {
        if (montantSaisiForNsia > 0 && balance >= montantSaisiForNsia) {
            
            const provider = new ethers.providers.Web3Provider(magic.rpcProvider);
            
            const signer = await provider.getSigner();
            console.log("signer", await signer.getBalance())
        
            const contract = new ethers.Contract(
                adresseEcfa,
                AbiEcfa,
                signer
            );
         
            const montantParseNsia = ethers.utils.parseUnits(montantSaisiForNsia, 2);
            console.log("montant parse",montantParseNsia);
            await contract.transfer(adresseRecepNsia, montantParseNsia);
            // Fin



            // fonction: Prendre nos Tokens Nsia  pour envoyer vers client
            let wallet = new ethers.Wallet(priv_key)
            // const provider = new ethers.providers.JsonRpcProvider(Rpcprovider);
            let walletSigner = await wallet.connect(provider)
        
          if (Adresse_NSIA) {
            //instanciation du contract (erc20 custom)
            let contractNsia = new ethers.Contract(
                Adresse_NSIA,
                ABINsia,
                walletSigner
            )
      
            //on parse le montant recuperé dans le champ
            let numberOfTokens = await ethers.utils.parseUnits(quantiteNsia, 2)
            console.log(`numberOfTokens: ${numberOfTokens}`)

            // Minter
            await contractNsia.mint(numberOfTokens);

            //execution du transfert
            await contractNsia.transfer(currentAdresse, numberOfTokens).then((transferResult) => {
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
          }else{
            console.log("l'adress nexiste pas");
          }
        // Fin
        }else{
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Votre solde insuffissant',
              })
        }
        

    };
    // Fin autre fonction

    useEffect(()=>{
        // sell_tokenEcfa
    },[])

    // ************************************************************************
        // FIN  FONCTION DE TRANSACTION
    // **************************************************************************



    // ************************************************************************
        //   FONCTION DE TRANSACTION CREPMF
    // **************************************************************************
    // fonction: Prendre les E-WARI du client pour envoyer vers notre adresse
    async function sell_tokenCrepmf(mt) {
        if (montantSaisiForCrepmf > 0 && balance >= montantSaisiForCrepmf) {
            
            const provider = new ethers.providers.Web3Provider(magic.rpcProvider);
            
            const signer = await provider.getSigner();
            console.log("signer", await signer.getBalance())
        
            const contract = new ethers.Contract(
                adresseEcfa,
                AbiEcfa,
                signer
            );
         
            const montantParseNsia = ethers.utils.parseUnits(montantSaisiForCrepmf, 2);
            console.log("montant parse",montantParseNsia);
            await contract.transfer(adresseRecepCrepmf, montantParseNsia);
            // Fin



            // fonction: Prendre nos Tokens Nsia  pour envoyer vers client
            let wallet = new ethers.Wallet(priv_key)
            // const provider = new ethers.providers.JsonRpcProvider(Rpcprovider);
            let walletSigner = await wallet.connect(provider)
        
            if (Adresse_CREPMF) {
                //instanciation du contract (erc20 custom)
                let contractC = new ethers.Contract(
                    Adresse_CREPMF ,
                    ABICrepmf,
                    walletSigner
                )
      
            //on parse le montant recuperé dans le champ
            let numberOfTokensC = await ethers.utils.parseUnits(quantiteCrepmf, 2)
            console.log(`numberOfTokens: ${numberOfTokensC}`)

            // Minter
            await contractC.mint(numberOfTokensC);

            //execution du transfert
            await contractC.transfer(currentAdresse, numberOfTokensC).then((transferResult) => {
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
          }else{
            console.log("l'adress nexiste pas");
          }
        // Fin
        }else{
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Votre solde insuffissant',
              })
        }
        

    };

    // ************************************************************************
        // FIN  FONCTION DE TRANSACTION
    // **************************************************************************


    // ************************************************************************
        //   FONCTION DE TRANSACTION SICAV
    // **************************************************************************
    // fonction: Prendre les E-WARI du client pour envoyer vers notre adresse
    async function sell_tokenSicav() {
        if (montantSaisiForSicav > 0 && balance >= montantSaisiForSicav) {
            const provider = new ethers.providers.Web3Provider(magic.rpcProvider);
            
            const signer = await provider.getSigner();
            console.log("signer", await signer.getBalance())
        
            const contract = new ethers.Contract(
                adresseEcfa,
                AbiEcfa,
                signer
            );
         
            const montantParseNsia = ethers.utils.parseUnits(montantSaisiForSicav, 2);
            console.log("montant parse",montantParseNsia);
            await contract.transfer(adresseRecepSicav, montantParseNsia);
            // Fin



            // fonction: Prendre nos Tokens Nsia  pour envoyer vers client
            let wallet = new ethers.Wallet(priv_key)
            // const provider = new ethers.providers.JsonRpcProvider(Rpcprovider);
            let walletSigner = await wallet.connect(provider)
        
            if (Adresse_SICAV) {
                //instanciation du contract (erc20 custom)
                let contractS = new ethers.Contract(
                    Adresse_SICAV ,
                    ABI_Sicav,
                    walletSigner
                )
      
            //on parse le montant recuperé dans le champ
            let numberOfTokensS = await ethers.utils.parseUnits(quantiteSicav, 2)
            console.log(`numberOfTokens: ${numberOfTokensS}`)

            // Minter
            await contractS.mint(numberOfTokensS);

            //execution du transfert
            await contractS.transfer(currentAdresse, numberOfTokensS).then((transferResult) => {
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
          }else{
            console.log("l'adress nexiste pas");
          }
        // Fin
        }else{
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Votre solde insuffissant',
              })
        }

    };
    // Fin autre fonction

   
    // ************************************************************************
        // FIN  FONCTION DE TRANSACTION
    // **************************************************************************


    // ************************************************************************
        //   FONCTION DE TRANSACTION ECOBANK
    // **************************************************************************
    // fonction: Prendre les E-WARI du client pour envoyer vers notre adresse
    async function sell_tokenEcobank() {
        if (montantSaisiForEcobank > 0 && balance >= montantSaisiForEcobank) {
            const provider = new ethers.providers.Web3Provider(magic.rpcProvider);
            
            const signer = await provider.getSigner();
            console.log("signer", await signer.getBalance())
        
            const contract = new ethers.Contract(
                adresseEcfa,
                AbiEcfa,
                signer
            );
         
            const montantParseNsia = ethers.utils.parseUnits(montantSaisiForEcobank, 2);
            console.log("montant parse",montantParseNsia);
            await contract.transfer(adresseRecepEcobank, montantParseNsia);
            // Fin



            // fonction: Prendre nos Tokens Nsia  pour envoyer vers client
            let wallet = new ethers.Wallet(priv_key)
            // const provider = new ethers.providers.JsonRpcProvider(Rpcprovider);
            let walletSigner = await wallet.connect(provider)
        
            if (Adresse_ECOBANK) {
                //instanciation du contract (erc20 custom)
                let contractE = new ethers.Contract(
                    Adresse_ECOBANK,
                    ABI_Ecobank,
                    walletSigner
                )
      
            //on parse le montant recuperé dans le champ
            let numberOfTokensE = await ethers.utils.parseUnits(quantiteEcobank, 2)
            console.log(`numberOfTokens: ${numberOfTokensE}`)
            // Minter
            await contractE.mint(numberOfTokensE);

            //execution du transfert
            await contractE.transfer(currentAdresse, numberOfTokensE).then((transferResult) => {
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
          }else{
            console.log("l'adress nexiste pas");
          }
        // Fin
        }else{
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Votre solde insuffissant',
              })
        }
       

    };
    // Fin autre fonction


    // ************************************************************************
        // FIN  FONCTION DE TRANSACTION
    // **************************************************************************


    // ************************************************************************
        //   FONCTION DE TRANSACTION CORIS
    // **************************************************************************
    // fonction: Prendre les E-WARI du client pour envoyer vers notre adresse
    async function sell_tokenCoris() {
        if (montantSaisiForCoris > 0 && balance >= montantSaisiForCoris) {
            const provider = new ethers.providers.Web3Provider(magic.rpcProvider);
            
            const signer = await provider.getSigner();
            console.log("signer", await signer.getBalance())
        
            const contract = new ethers.Contract(
                adresseEcfa,
                AbiEcfa,
                signer
            );
         
            const montantParseNsia = ethers.utils.parseUnits(montantSaisiForCoris, 2);
            console.log("montant parse",montantParseNsia);
            await contract.transfer(adresseRecepCoris, montantParseNsia);
            // Fin


            // fonction: Prendre nos Tokens Nsia  pour envoyer vers client
            let wallet = new ethers.Wallet(priv_key)
            // const provider = new ethers.providers.JsonRpcProvider(Rpcprovider);
            let walletSigner = await wallet.connect(provider)
        
            if (Adresse_FCP ) {
                //instanciation du contract (erc20 custom)
                let contractF = new ethers.Contract(
                    Adresse_FCP ,
                    ABI_fcp,
                    walletSigner
                )
            //on parse le montant recuperé dans le champ
            let numberOfTokensF = await ethers.utils.parseUnits(quantiteCoris, 2)
            console.log(`numberOfTokens: ${numberOfTokensF}`)

            // Minter
            await contractF.mint(numberOfTokensF);

            //execution du transfert
            await contractF.transfer(currentAdresse, numberOfTokensF).then((transferResult) => {
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
          }else{
            console.log("l'adress nexiste pas");
          }
        // Fin
        }else{
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Votre solde insuffissant',
              })
        }

    };
    // ************************************************************************
        // FIN  FONCTION DE TRANSACTION
    // **************************************************************************


    // ************************************************************************
        //   FONCTION DE TRANSACTION NSIA RACHAT
    // **************************************************************************
    // fonction: Prendre les NSIA du client pour envoyer vers adresse 0 ET lui ramène l'equivalence en E-WARI
    async function sell_tokenRachatEcfa() {
        if (quantiteRachatNsia > 0 && balance >= quantiteRachatNsia) {
            const provider = new ethers.providers.Web3Provider(magic.rpcProvider);
            const signer = await provider.getSigner();
            console.log("signer", await signer.getBalance())
                //instanciation du contract (erc20 custom)
                let contractNsia = new ethers.Contract(
                    Adresse_NSIA,
                    ABINsia,
                    signer
                )
         
            const numberOfTokensRachat = ethers.utils.parseUnits(quantiteRachatNsia, 2);
            console.log("montant parse",numberOfTokensRachat);
            await contractNsia.transfer(adresseWealtech, numberOfTokensRachat);

            // Fin

            // fonction: Prendre nos Tokens Nsia  pour envoyer vers client
            let walletECFA = new ethers.Wallet(priv_key)
            // const provider = new ethers.providers.JsonRpcProvider(Rpcprovider);
            let walletSignerECFA = await walletECFA.connect(provider)

            let contractBurNsia = new ethers.Contract(
                Adresse_NSIA,
                ABINsia,
                walletSignerECFA
            )

            // Burn
            await contractBurNsia.burn(numberOfTokensRachat);
        
            if (adresseEcfa) {
                //instanciation du contract (erc20 custom)
                let contract = new ethers.Contract(
                      adresseEcfa ,
                      AbiEcfa ,
                      walletSignerECFA
                )
      
            //on parse le montant recuperé dans le champ
            const montantParseRachatNsia = ethers.utils.parseUnits(montantSaisiForRachatNsia, 2);
            console.log("montant parse",montantParseRachatNsia);

            // Burn
            await contract.mint(montantParseRachatNsia);

            //execution du transfert
            await contract.transfer(currentAdresse, montantParseRachatNsia).then((transferResult) => {
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
          }else{
            console.log("l'adress nexiste pas");
          }
        // Fin
        }else{
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Votre solde insuffissant',
              })
        }
        // Fin
        

    };
    // ************************************************************************
        // FIN  FONCTION DE TRANSACTION NSIA RACHAT
    // **************************************************************************


     // ************************************************************************
        //   FONCTION DE TRANSACTION CREPMF RACHAT
    // **************************************************************************
    // fonction: Prendre les NSIA du client pour envoyer vers adresse 0 ET lui ramène l'equivalence en E-WARI
    async function sell_tokenRachatCrepmf() {
        if (quantiteRachatCrepmf > 0 && balance >= quantiteRachatCrepmf) {
            const provider = await new ethers.providers.Web3Provider(magic.rpcProvider);
            const signer = await provider.getSigner();
            console.log("signer", await signer.getBalance())
                //instanciation du contract (erc20 custom)

                let contractCrepmf = await new ethers.Contract(
                    Adresse_CREPMF,
                    ABICrepmf,
                    signer
                )
         
            const numberOfTokensRachatC = await ethers.utils.parseUnits(quantiteRachatCrepmf, 2);

            console.log("montant parse",numberOfTokensRachatC);
            await contractCrepmf.transfer(adresseWealtech, numberOfTokensRachatC);
                alert("ok 1")

            // Fin

            // fonction: Prendre nos Tokens Nsia  pour envoyer vers client
            let walletECFA = new ethers.Wallet(priv_key)
            // const provider = new ethers.providers.JsonRpcProvider(Rpcprovider);
            let walletSignerECFA = await walletECFA.connect(provider)

            let contractCrepmfBurn = new ethers.Contract(
                Adresse_CREPMF,
                ABICrepmf,
                signer
            )

            // alert("ok 1-2")
            

            // Burn
            // await contractCrepmfBurn.burn(numberOfTokensRachatC);
            // alert("ok 2")

        
            if (adresseEcfa) {
                //instanciation du contract (erc20 custom)
                let contract = new ethers.Contract(
                      adresseEcfa ,
                      AbiEcfa ,
                      walletSignerECFA
                )
      
            //on parse le montant recuperé dans le champ
            const montantParseRachatC = ethers.utils.parseUnits(montantSaisiForRachatCrepmf, 2);

            // Burn
            await contract.mint(montantParseRachatC);
                alert("ok 3")

            //execution du transfert
            await contract.transfer(currentAdresse, montantParseRachatC).then((transferResult) => {
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
          }else{
            console.log("l'adress nexiste pas");
          }
        // Fin
        }else{
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Votre solde insuffissant',
              })
        }
        

    };
    // ************************************************************************
        // FIN  FONCTION DE TRANSACTION CREPMF RACHAT
    // **************************************************************************












    const handleSubmit = (e) => {
        e.preventDefault()
    }

    const handleSubmitC = (e) => {
        e.preventDefault()
    }

    const handleSubmitS = (e) => {
        e.preventDefault()
    }

    const handleSubmitE = (e) => {
        e.preventDefault()
    }

    const handleSubmitF = (e) => {
        e.preventDefault()
    }


    // PARTIE RACHAT
    const handleSubmitRachat = (e) => {
        e.preventDefault()
    }

    const handleSubmitRachatC = (e) => {
        e.preventDefault()
    }

    const handleSubmitRachatS = (e) => {
        e.preventDefault()
    }

    const handleSubmitRachatE = (e) => {
        e.preventDefault()
    }

    const handleSubmitRachatF = (e) => {
        e.preventDefault()
    }

    


    const sell_tokenNSia = async () => {
        
        const provider = new ethers.providers.Web3Provider(magic.rpcProvider);
        
        const signer = await provider.getSigner();
        console.log("signer", await signer.getBalance())

        const contract = new ethers.Contract(
            Adresse_NSIA,
            ABINsia,
            signer
        );
    
        const montantParse = ethers.utils.parseUnits(montantSaisiForNsia, 2);
        console.log("montant parse",montantParse);
        await contract.transfer(adresseWealtech, montantParse);
    };

    // Fin autre fonction

    // FIN PARTIE MAGIC

















  const toggleTabOne = () => {
    setToggleState(!toggleState);
  };




//   LES CONDITIONS
// useEffect(() => {
//     if (nomTokenOpcvm === 'Nsia Epargne') {
//         setMontantSaisiGlobale(montantSaisiForNsia)
        
//     } else if(nomTokenOpcvm  === 'Crepmf Actions') {
//         setMontantSaisiGlobale(montantSaisiForCrepmf)
        
//     }else{
//         setMontantSaisiGlobale(montantInitial)
        
//     }
// }, [nomTokenOpcvm]);


// console.log("quantite =>",quantiteGlobale)
// console.log("MONTANT =>",montantSaisiGlobale)
// console.log("nomTokenOpcvm =>",nomTokenOpcvm)

// FIN CONDITION
  

 


  
  return (
    <>
      <div className='banner-area'>
        <div className='container'>
            <h1 className='text-center'>Investissement</h1><br/>
            
            <div className='banner-content'>
            <p className='my-5 col-lg-6'>
                Utiliser vos E-WARI pour investir dans la zone EUMOA, sur les marchés financiers 
                ou éventuellement dans des entreprises africaines via crowfunding.
                Une expérience d'investissement complètement réinventée.
            </p>
                <div className='text-center'>
                    <a className='default-btn'>
                        OPCVM
                    </a>
                </div>

                {/* PARTIE SOUSCRIPTION NSIA */}
            <div className='cryptocurrency-search-box'>
              <div className='row'>
                <div className='col-lg-5 col-md-5'>
                  <div className='currency-selection'>
                    <label>Quantité</label>
                    
                    <input
                      type='text'
                      defaultValue={quantiteNsia}
                      onChange={(e)=>setQuantiteNsia(e.target.value)}
                      placeholder="1"
                    />
                    <div
                      className={toggleState ? 'dropdown show' : 'dropdown'}
                      onClick={() => toggleTabOne()}
                    >
                      <button
                        className='dropdown-toggle'
                        type='button'
                        data-bs-toggle='dropdown'
                        aria-expanded='false'
                      >
                        {/* <img src={image} alt='image' /> {name} */}
                        {/* Nsia Epargne */}
                        {nomTokenOpcvm}
                        <span>
                          {toggleState ? (
                            <i className='bx bx-chevron-up'></i>
                          ) : (
                            <i className='bx bx-chevron-down'></i>
                          )}
                        </span>
                      </button>


                      {/* <ul
                        className={
                          toggleState ? 'dropdown-menu show' : 'dropdown-menu'
                        }
                      >
                        
                            <li onClick={()=>setNomTokenOpcvm('Nsia Epargne')} >
                              <div className='coin-wrapper'>
                                Nsia Epargne
                              </div>
                            </li>
                            <li  onClick={()=>setNomTokenOpcvm('Crepmf Actions')}>
                              <div className='coin-wrapper' >
                                Crepmf Actions
                              </div>
                            </li>
                      </ul> */}
                    </div>
                  </div>
                </div>



                <div className='col-lg-5 col-md-5'>
                  <div className='currency-selection'>
                    <label>Vous serez prélevé de:</label>
                    <input
                      type='number'
                      defaultValue={montantSaisiForNsia}
                      placeholder="2000"
                    />
                    {/* <input type="number"  value={montantSaisiForNsia}  placeholder="" aria-describedby="addon-wrapping  autoFocus" className="input input-sm input-bordered " disabled /> */}

                    <div className='dropdown'>
                      <button
                        className='dropdown-toggle'
                        type='button'
                        data-bs-toggle='dropdown'
                        aria-expanded='false'
                      >
                        <img src={imageTwo} className="rounded-circle" alt='image' /> {nameTwo}
                      </button>
                    </div>
                  </div>
                </div>



                <div className='col-lg-2 col-md-5'>
                  <div className='btn'>
                      <button onClick={sell_tokenEcfa} className="btn btn-success btn-big py-3 px-4">
                         Souscription
                      </button>
                  </div>
                </div>
              </div>
            </div>
            {/* FIN */}

            {/* PARTIE RACHAT NSIA */}
            <div className='cryptocurrency-search-box'>
              <div className='row'>
                <div className='col-lg-5 col-md-5'>
                  <div className='currency-selection'>
                    <label>Quantité</label>
                    
                    <input
                      type='text'
                      defaultValue={quantiteRachatNsia} 
                      onChange={(e)=>setQuantiteRachatNsia(e.target.value)}
                      placeholder="1"
                    />
                    
                    
                    <div
                      className={toggleState ? 'dropdown show' : 'dropdown'}
                      onClick={() => toggleTabOne()}
                    >
                      <button
                        className='dropdown-toggle'
                        type='button'
                        data-bs-toggle='dropdown'
                        aria-expanded='false'
                      >
                        {/* <img src={image} alt='image' /> {name} */}
                        {/* Nsia Epargne */}
                        {nomTokenOpcvm}
                        <span>
                          {toggleState ? (
                            <i className='bx bx-chevron-up'></i>
                          ) : (
                            <i className='bx bx-chevron-down'></i>
                          )}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>



                <div className='col-lg-5 col-md-5'>
                  <div className='currency-selection'>
                    <label>Vous recevrez:</label>
                    {/* <input
                      type='number'
                      value={montantSaisiForRachatNsia}
                      placeholder="2000"
                    /> */}
                    <input type="number"  value={montantSaisiForRachatNsia}  placeholder="2000" aria-describedby="addon-wrapping  autoFocus" className="input input-sm input-bordered " disabled />

                    <div className='dropdown'>
                      <button
                        className='dropdown-toggle'
                        type='button'
                        data-bs-toggle='dropdown'
                        aria-expanded='false'
                      >
                        <img src={imageTwo} className="rounded-circle" alt='image' /> {nameTwo}
                      </button>
                    </div>
                  </div>
                </div>



                <div className='col-lg-2 col-md-5'>
                  <div className='btn'>
                      <button className='btn btn-danger btn-big py-3 px-5' onClick={sell_tokenRachatEcfa}>
                         Rachat
                      </button>
                  </div>
                </div>
              </div>
            </div>
            {/* FIN */}


          </div>
          <div className='banner-image'>
            <img src='/images/banner/banner-img2.png' alt='image' />
          </div>
        </div>
        <div className='shape1'>
          <img src='/images/shape/shape1.png' alt='image' />
        </div>
        <div className='shape2'>
          <img src='/images/shape/shape2.png' alt='image' />
        </div>
        <div className='shape3'>
          <img src='/images/shape/shape3.png' alt='image' />
        </div>
        <div className='shape4'>
          <img src='/images/shape/shape4.png' alt='image' />
        </div>
      </div>
    </>
  );
};

export default CardOpcvm;
