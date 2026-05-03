import Link from 'next/link';

// PARTIE MAGIC
import React, { useState, useEffect } from "react";
import { Web3Provider } from "@ethersproject/providers";
import { Magic } from "magic-sdk";
import Web3 from "web3";





const CardActifs = ({ bgGradient, blackText, ctaImage }) => {
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

  let Rpcweb3 = 'https://rpc.testnet.moonbeam.network';
  let Rpcprovider = "https://rpc.testnet.moonbeam.network";
  let priv_key = "0x0000000000000000000000000000000000000000000000000000000000000001";
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



useEffect(() => {

  const BSCOptions = {
    // rpcUrl: process.env.NEXT_PUBLIC_RPC_URL_56,
    // rpcUrl: 'https://bsc-dataseed.binance.org',
    rpcUrl: "https://rpc.testnet.moonbeam.network", // Smart
    chainId: 1287,
  };

  const mt = new Magic("pk_live_F1AB148D6AA92662", {
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
        const balanceECFA = await contract.methods.balanceOf(userAddress).call()
        const symbole = await contract.methods.symbol().call()
        setSymbol(symbole)
        setBalance(balanceECFA/10**2)

        // PARTIE NSIA
        const contractN = new web3.eth.Contract(ABINsia,Adresse_NSIA)
        const balanceN = await contractN.methods.balanceOf(userAddress).call()
        const symboleN = await contractN.methods.symbol().call()
        const nameN = await contractN.methods.name().call()
        setSymbolNsia(symboleN)
        setNameNsia(nameN)
        setBalanceNsia(balanceN/10**2)

        // PARTIE CREPMF
        const contractC = new web3.eth.Contract(ABICrepmf,Adresse_CREPMF)
        const balanceC = await contractC.methods.balanceOf(userAddress).call()
        const symboleC = await contractC.methods.symbol().call()
        const nameC = await contractC.methods.name().call()
        setSymbolCrepmf(symboleC)
        setNameCrepmf(nameC)
        setBalanceCrepmf(balanceC/10**2)

        // PARTIE SICAV
        const contractS = new web3.eth.Contract(ABI_Sicav,Adresse_SICAV)
        const balanceS = await contractS.methods.balanceOf(userAddress).call()
        const symboleS = await contractS.methods.symbol().call()
        const nameS = await contractS.methods.name().call()
        setNameSicav(nameS)
        setSymbolSica(symboleS)
        setBalanceSica(balanceS/10**2)

        // PARTIE ECOBANK
        const contractE = new web3.eth.Contract(ABI_Ecobank,Adresse_ECOBANK)
        const balanceE = await contractE.methods.balanceOf(userAddress).call()
        const symboleE = await contractE.methods.symbol().call()
        const nameE = await contractE.methods.name().call()
        setNameEcobank(nameE)
        setSymbolEcobank(symboleE)
        setBalanceEcobank(balanceE/10**2)

        // PARTIE FCP CORIS
        const contractF = new web3.eth.Contract(ABI_fcp,Adresse_FCP)
        const balanceF = await contractF.methods.balanceOf(userAddress).call()
        const symboleF = await contractF.methods.symbol().call()
        const nameF = await contractF.methods.name().call()
        setNameCoris(nameF)
        setSymbolCoris(symboleF)
        setBalanceCoris(balanceF/10**2)

    }
  })();
}, [providerTest, magicTest]);
  return (
    <>
      <div className={`cta-area pt-100 ${bgGradient}`}>
        <div className='container'>
          <div className='row align-items-center justify-content-center'>
            <div className='col-lg-12 col-md-12'>
              <div className={`cta-content ${blackText}`}>
                <h2 className='text-center'>Mes actifs</h2>

                <div className='btn-box mt-5 text-center'>
                    <Link href='/#'>
                        <a className='btn btn-primary'>Cash</a>
                    </Link>
                </div>
                <div className='row'>
                    <div className='col-lg-3 col-md-3'></div>
                    <div className='col-lg-6 col-md-6'>
                            <div className='currency-selection text-center'>
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
                                            <p>{balance} E-WARI</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                    </div>
                </div>

                <div className='btn-box mt-5 text-center'>
                    <Link href='/#'>
                        <a className='btn btn-primary'>OPCVM</a>
                    </Link>
                </div>

            <div className='cryptocurrency-search-box'>
            <div className='row'>
                    <div className='col-lg-4 col-md-4'>
                        <div className='currency-selection text-center'>
                            <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                                <div className='cryptocurrency-slides'>
                                    <div className='single-cryptocurrency-box'>
                                        <div className='d-flex align-items-center'>
                                        <div className='bestseller-coin-image'>
                                            <img src="/images/ecfa/logo/logo_ewari1.jpg" className="rounded-circle"  alt='image' />
                                        </div>
                                        <div className='title'>
                                            <h3>Nsia </h3>
                                        </div>
                                        </div>
                                        <div className='btn-box'>
                                        <p>{balanceNsia} {nameNsia}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    
                    <div className='col-lg-4 col-md-4'>
                    <div className='currency-selection text-center'>
                        <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                        <div className='cryptocurrency-slides'>
                                <div className='single-cryptocurrency-box'>
                                    <div className='d-flex align-items-center'>
                                    <div className='bestseller-coin-image'>
                                        <img src="/images/ecfa/logo/logo_ewari1.jpg" className="rounded-circle"  alt='image' />
                                    </div>
                                    <div className='title'>
                                        <h3>CREPMF</h3>
                                    </div>
                                    </div>
                                    <div className='btn-box'>
                                    <p>{balanceCrepmf} {nameCrepmf}</p>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>


                    <div className='col-lg-4 col-md-4'>
                    <div className='currency-selection text-center'>
                        <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                        <div className='cryptocurrency-slides'>
                                <div className='single-cryptocurrency-box'>
                                    <div className='d-flex align-items-center'>
                                    <div className='bestseller-coin-image'>
                                        <img src="/images/ecfa/logo/logo_ewari1.jpg" className="rounded-circle"  alt='image' />
                                    </div>
                                    <div className='title'>
                                        <h3>Sicav</h3>
                                    </div>
                                    </div>
                                    <div className='btn-box'>
                                   <p>{balanceSica} {nameSicav}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>

                    <div className='col-lg-4 col-md-4'>
                    <div className='currency-selection text-center'>
                        <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                        <div className='cryptocurrency-slides'>
                                <div className='single-cryptocurrency-box'>
                                    <div className='d-flex align-items-center'>
                                    <div className='bestseller-coin-image'>
                                        <img src="/images/ecfa/logo/logo_ewari1.jpg" className="rounded-circle"  alt='image' />
                                    </div>
                                    <div className='title'>
                                        <h3>Ecobank</h3>
                                    </div>
                                    </div>
                                    <div className='btn-box'>
                                    <p>{balanceEcobank} {nameEcobank}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>

                    <div className='col-lg-4 col-md-4'>
                    <div className='currency-selection text-center'>
                        <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                        <div className='cryptocurrency-slides'>
                                <div className='single-cryptocurrency-box'>
                                    <div className='d-flex align-items-center'>
                                    <div className='bestseller-coin-image'>
                                        <img src="/images/ecfa/logo/logo_ewari1.jpg" className="rounded-circle"  alt='image' />
                                    </div>
                                    <div className='title'>
                                        <h3>FCP</h3>
                                    </div>
                                    </div>
                                    <div className='btn-box'>
                                    <p>{balanceCoris} {nameCoris}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>

                
               
            </div>
        </div>
              </div>
            </div>
            {/* <div className='col-lg-6 col-md-12'>
              
            </div> */}
          </div>
        </div>
        <div className='shape6'>
          <img src='/images/shape/shape6.png' alt='image' />
        </div>
        
        <div className='shape8'>
          <img src='/images/shape/shape8.png' alt='image' />
        </div>
        
        
      </div>
    </>
  );
};

export default CardActifs;
