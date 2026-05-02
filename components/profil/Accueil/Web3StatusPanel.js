import React, { useCallback, useEffect, useState } from 'react';
import { Button, Card, Col, Row } from 'reactstrap';
import Swal from 'sweetalert2';
import {
  connectInjectedWallet,
  connectMagicWalletWithEmail,
  getMagicWalletAddress,
  getMagicMetadata,
  hasInjectedWallet,
  hasMagicWallet,
  isMagicLoggedIn,
  readStablecoinInfoForAddress,
  getDefaultRpcUrl,
  getStablecoinAddress,
  isValidAddress,
} from '../../../lib/web3Stablecoin';

const formatShortAddress = (address) => {
  if (!address) return 'Non connectée';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const formatTokenBalance = (value) => {
  if (value === undefined || value === null || value === '') return '0';
  const asNumber = Number(value);
  if (!Number.isFinite(asNumber)) return String(value);
  return asNumber.toLocaleString('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 6,
  });
};

function getStoredUserEmail() {
  if (typeof window === 'undefined') return '';

  const candidates = [
    localStorage.getItem('email'),
    localStorage.getItem('userEmail'),
    localStorage.getItem('emailEnCours'),
    localStorage.getItem('currentUserEmail'),
  ];

  const found = candidates.find((candidate) => candidate && candidate.includes('@'));
  return found || '';
}

export default function Web3StatusPanel({ currentUser }) {
  const [walletAddress, setWalletAddress] = useState('');
  const [walletSource, setWalletSource] = useState('');
  const [magicEmail, setMagicEmail] = useState(currentUser?.email || '');
  const [stablecoinInfo, setStablecoinInfo] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [error, setError] = useState('');

  const loadStablecoinInfo = useCallback(async (address) => {
    if (!isValidAddress(address)) return;

    setIsReading(true);
    setError('');

    try {
      const info = await readStablecoinInfoForAddress(address);
      setStablecoinInfo(info);
    } catch (readError) {
      const message = readError?.message || 'Lecture blockchain impossible.';
      setStablecoinInfo(null);
      setError(message);
    } finally {
      setIsReading(false);
    }
  }, []);

  const connectMagicWallet = useCallback(async () => {
    setIsConnecting(true);
    setError('');

    try {
      const email = currentUser?.email || magicEmail || getStoredUserEmail();
      const connectedAddress = await connectMagicWalletWithEmail(email);
      const metadata = await getMagicMetadata();

      setWalletAddress(connectedAddress);
      setWalletSource('Magic');

      if (metadata?.email && !magicEmail) {
        setMagicEmail(metadata.email);
      }

      await loadStablecoinInfo(connectedAddress);
    } catch (connectError) {
      const message = connectError?.message || 'Connexion au wallet Magic impossible.';
      setError(message);

      Swal.fire({
        icon: 'error',
        title: 'Connexion Magic impossible',
        html: `<p>${message}</p>`,
        showConfirmButton: true,
      });
    } finally {
      setIsConnecting(false);
    }
  }, [currentUser?.email, loadStablecoinInfo, magicEmail]);

  const connectInjected = useCallback(async () => {
    setIsConnecting(true);
    setError('');

    try {
      const connectedAddress = await connectInjectedWallet();
      setWalletAddress(connectedAddress);
      setWalletSource('Wallet injecté');
      await loadStablecoinInfo(connectedAddress);
    } catch (connectError) {
      const message = connectError?.message || 'Connexion wallet impossible.';
      setError(message);

      Swal.fire({
        icon: 'error',
        title: 'Connexion blockchain impossible',
        html: `<p>${message}</p>`,
        showConfirmButton: true,
      });
    } finally {
      setIsConnecting(false);
    }
  }, [loadStablecoinInfo]);

  useEffect(() => {
    const hydrateMagicWallet = async () => {
      if (!hasMagicWallet()) return;

      try {
        const loggedIn = await isMagicLoggedIn();
        const metadata = await getMagicMetadata();

        if (metadata?.email) {
          setMagicEmail(metadata.email);
        } else if (currentUser?.email) {
          setMagicEmail(currentUser.email);
        } else {
          const storedEmail = getStoredUserEmail();
          if (storedEmail) setMagicEmail(storedEmail);
        }

        if (loggedIn) {
          const address = await getMagicWalletAddress();
          setWalletAddress(address);
          setWalletSource('Magic');
          await loadStablecoinInfo(address);
        }
      } catch (magicError) {
        setError(magicError?.message || 'Impossible de synchroniser le wallet Magic.');
      }
    };

    hydrateMagicWallet();
  }, [currentUser?.email, loadStablecoinInfo]);

  useEffect(() => {
    const ethereum = typeof window !== 'undefined' ? window.ethereum : null;

    if (!ethereum) {
      return undefined;
    }

    const syncAccounts = async () => {
      try {
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        const firstAccount = accounts?.[0];

        if (isValidAddress(firstAccount) && !walletAddress) {
          setWalletAddress(firstAccount);
          setWalletSource('Wallet injecté');
          loadStablecoinInfo(firstAccount);
        }
      } catch (syncError) {
        setError(syncError?.message || 'Impossible de lire le wallet injecté connecté.');
      }
    };

    const handleAccountsChanged = (accounts) => {
      const firstAccount = accounts?.[0];
      if (isValidAddress(firstAccount)) {
        setWalletAddress(firstAccount);
        setWalletSource('Wallet injecté');
        loadStablecoinInfo(firstAccount);
      }
    };

    const handleChainChanged = () => {
      if (walletAddress) {
        loadStablecoinInfo(walletAddress);
      }
    };

    syncAccounts();

    ethereum.on?.('accountsChanged', handleAccountsChanged);
    ethereum.on?.('chainChanged', handleChainChanged);

    return () => {
      ethereum.removeListener?.('accountsChanged', handleAccountsChanged);
      ethereum.removeListener?.('chainChanged', handleChainChanged);
    };
  }, [loadStablecoinInfo, walletAddress]);

  return (
    <Card className='p-4 my-4 shadow-sm border rounded-10 bg-white'>
      <Row className='align-items-center'>
        <Col lg='8' md='12'>
          <h4 className='mb-2'>Connexion blockchain</h4>
          <p className='mb-1'>
            Wallet connecté : <strong>{formatShortAddress(walletAddress)}</strong>
            {walletSource ? <span className='ml-2'>({walletSource})</span> : null}
          </p>
          <p className='mb-1'>
            Contrat stablecoin : <strong>{formatShortAddress(stablecoinInfo?.contractAddress || getStablecoinAddress())}</strong>
          </p>
          <p className='mb-1'>
            RPC : <strong>{getDefaultRpcUrl()}</strong>
          </p>
          {currentUser?.email || magicEmail ? (
            <p className='mb-1'>
              Email wallet Magic : <strong>{currentUser?.email || magicEmail}</strong>
            </p>
          ) : null}
          {stablecoinInfo ? (
            <p className='mb-1'>
              Solde {stablecoinInfo.symbol} : <strong>{formatTokenBalance(stablecoinInfo.formattedBalance)}</strong>
            </p>
          ) : null}
          {isReading ? <p className='mb-1'>Lecture blockchain en cours...</p> : null}
          {error ? <p className='colorRed mb-1'>{error}</p> : null}
        </Col>
        <Col lg='4' md='12' className='text-center mt-3 mt-lg-0'>
          <Button
            color='primary'
            type='button'
            onClick={connectMagicWallet}
            disabled={isConnecting || !hasMagicWallet()}
            className='mb-2'
            block
          >
            {isConnecting ? 'Connexion...' : walletAddress && walletSource === 'Magic' ? 'Reconnecter Magic' : 'Connecter wallet Magic'}
          </Button>

          {hasInjectedWallet() ? (
            <Button
              color='secondary'
              type='button'
              onClick={connectInjected}
              disabled={isConnecting}
              block
            >
              Wallet externe / MetaMask
            </Button>
          ) : null}

          {!hasMagicWallet() ? (
            <p className='small mt-2 mb-0'>Magic SDK n'est pas initialisé.</p>
          ) : null}
        </Col>
      </Row>
    </Card>
  );
}
