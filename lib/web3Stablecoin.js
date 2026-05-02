import { ethers } from 'ethers';
import { magic } from '../magic';
import ABI_TOKEN_EWARI from '../components/Contrats/Abi/AbiStablecoin.json';

export const MOONBEAM_MAINNET = {
  chainId: '0x504',
  chainName: 'Moonbeam',
  nativeCurrency: {
    name: 'GLMR',
    symbol: 'GLMR',
    decimals: 18,
  },
  rpcUrls: ['https://rpc.api.moonbeam.network'],
  blockExplorerUrls: ['https://moonbeam.moonscan.io/'],
};

export const MOONBASE_ALPHA = {
  chainId: '0x507',
  chainName: 'Moonbase Alpha',
  nativeCurrency: {
    name: 'DEV',
    symbol: 'DEV',
    decimals: 18,
  },
  rpcUrls: ['https://rpc.testnet.moonbeam.network'],
  blockExplorerUrls: ['https://moonbase.moonscan.io/'],
};

export function getDefaultRpcUrl() {
  return process.env.NEXT_PUBLIC_RPC_PROVIDER || MOONBASE_ALPHA.rpcUrls[0];
}

export function getStablecoinAddress() {
  return process.env.NEXT_PUBLIC_ADDRESS_CONTRAT_EWARI || '';
}

export function getStablecoinAbi() {
  return ABI_TOKEN_EWARI?.abi || ABI_TOKEN_EWARI;
}

export function isValidAddress(address) {
  try {
    return Boolean(address && ethers.utils.isAddress(address));
  } catch (error) {
    return false;
  }
}

export function formatChecksumAddress(address) {
  if (!isValidAddress(address)) {
    return '';
  }
  return ethers.utils.getAddress(address);
}

export function getReadOnlyProvider() {
  return new ethers.providers.JsonRpcProvider(getDefaultRpcUrl());
}

export function getReadOnlyStablecoinContract() {
  const address = getStablecoinAddress();

  if (!isValidAddress(address)) {
    throw new Error('Adresse du smart contract E-WARI invalide ou absente. Vérifiez NEXT_PUBLIC_ADDRESS_CONTRAT_EWARI.');
  }

  return new ethers.Contract(address, getStablecoinAbi(), getReadOnlyProvider());
}

export function getMagicInstance() {
  return magic || null;
}

export function hasMagicWallet() {
  return Boolean(getMagicInstance());
}

export function getMagicProvider() {
  const magicInstance = getMagicInstance();

  if (!magicInstance?.rpcProvider) {
    throw new Error('Magic RPC Provider indisponible. Vérifiez NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY et la configuration Magic.');
  }

  return new ethers.providers.Web3Provider(magicInstance.rpcProvider);
}

export async function isMagicLoggedIn() {
  const magicInstance = getMagicInstance();

  if (!magicInstance?.user?.isLoggedIn) {
    return false;
  }

  try {
    return await magicInstance.user.isLoggedIn();
  } catch (error) {
    return false;
  }
}

export async function connectMagicWalletWithEmail(email) {
  const magicInstance = getMagicInstance();

  if (!magicInstance) {
    throw new Error('Magic SDK non initialisé.');
  }

  const safeEmail = String(email || '').trim();

  if (!safeEmail) {
    throw new Error('Email utilisateur introuvable. Impossible de connecter le wallet Magic.');
  }

  const alreadyLoggedIn = await isMagicLoggedIn();

  if (!alreadyLoggedIn) {
    await magicInstance.auth.loginWithMagicLink({
      email: safeEmail,
      showUI: true,
    });
  }

  return getMagicWalletAddress();
}

export async function getMagicWalletAddress() {
  const magicInstance = getMagicInstance();

  if (!magicInstance) {
    throw new Error('Magic SDK non initialisé.');
  }

  const provider = getMagicProvider();
  const signer = provider.getSigner();
  const address = await signer.getAddress();

  if (!isValidAddress(address)) {
    throw new Error('Adresse Magic wallet invalide ou introuvable.');
  }

  return formatChecksumAddress(address);
}

export async function getMagicMetadata() {
  const magicInstance = getMagicInstance();

  if (!magicInstance?.user?.getMetadata) {
    return null;
  }

  try {
    return await magicInstance.user.getMetadata();
  } catch (error) {
    return null;
  }
}

export async function getMagicStablecoinContract() {
  const provider = getMagicProvider();
  const signer = provider.getSigner();
  const address = getStablecoinAddress();

  if (!isValidAddress(address)) {
    throw new Error('Adresse du smart contract E-WARI invalide ou absente. Vérifiez NEXT_PUBLIC_ADDRESS_CONTRAT_EWARI.');
  }

  return new ethers.Contract(address, getStablecoinAbi(), signer);
}

export function getInjectedEthereum() {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.ethereum || null;
}

export function hasInjectedWallet() {
  return Boolean(getInjectedEthereum());
}

export async function ensureMoonbaseAlphaNetwork() {
  const ethereum = getInjectedEthereum();

  if (!ethereum) {
    throw new Error('Aucun wallet Web3 injecté détecté. Installez MetaMask ou utilisez le wallet Magic intégré.');
  }

  try {
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: MOONBASE_ALPHA.chainId }],
    });
  } catch (switchError) {
    if (switchError?.code === 4902) {
      await ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [MOONBASE_ALPHA],
      });
      return;
    }

    throw switchError;
  }
}

export async function connectInjectedWallet() {
  const ethereum = getInjectedEthereum();

  if (!ethereum) {
    throw new Error('Aucun wallet Web3 injecté détecté. Installez MetaMask ou utilisez le wallet Magic intégré.');
  }

  await ensureMoonbaseAlphaNetwork();

  const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
  const address = accounts?.[0];

  if (!isValidAddress(address)) {
    throw new Error('Adresse wallet invalide ou introuvable après connexion.');
  }

  return formatChecksumAddress(address);
}

export function getInjectedProvider() {
  const ethereum = getInjectedEthereum();

  if (!ethereum) {
    throw new Error('Aucun wallet Web3 injecté détecté.');
  }

  return new ethers.providers.Web3Provider(ethereum, 'any');
}

export async function getInjectedSigner() {
  const provider = getInjectedProvider();
  await provider.send('eth_requestAccounts', []);
  return provider.getSigner();
}

export async function getSignerStablecoinContract() {
  const signer = await getInjectedSigner();
  const address = getStablecoinAddress();

  if (!isValidAddress(address)) {
    throw new Error('Adresse du smart contract E-WARI invalide ou absente. Vérifiez NEXT_PUBLIC_ADDRESS_CONTRAT_EWARI.');
  }

  return new ethers.Contract(address, getStablecoinAbi(), signer);
}

export async function readStablecoinInfoForAddress(walletAddress) {
  if (!isValidAddress(walletAddress)) {
    throw new Error('Adresse wallet invalide pour la lecture blockchain.');
  }

  const contract = getReadOnlyStablecoinContract();
  const [name, symbol, decimals, rawBalance] = await Promise.all([
    contract.name(),
    contract.symbol(),
    contract.decimals(),
    contract.balanceOf(walletAddress),
  ]);

  return {
    contractAddress: formatChecksumAddress(getStablecoinAddress()),
    walletAddress: formatChecksumAddress(walletAddress),
    name,
    symbol,
    decimals: Number(decimals),
    rawBalance: rawBalance.toString(),
    formattedBalance: ethers.utils.formatUnits(rawBalance, decimals),
  };
}
