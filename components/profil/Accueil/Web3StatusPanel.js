import React, { useCallback, useEffect, useState } from 'react';
import { Button, Card, Col, Row } from 'reactstrap';
import Swal from 'sweetalert2';
import {
  connectInjectedWallet,
  hasInjectedWallet,
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

export default function Web3StatusPanel({ currentUser }) {
  const [walletAddress, setWalletAddress] = useState('');
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

  const connectWallet = useCallback(async () => {
    setIsConnecting(true);
    setError('');

    try {
      const connectedAddress = await connectInjectedWallet();
      setWalletAddress(connectedAddress);
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
    const ethereum = typeof window !== 'undefined' ? window.ethereum : null;

    if (!ethereum) {
      return undefined;
    }

    const syncAccounts = async () => {
      try {
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        const firstAccount = accounts?.[0];

        if (isValidAddress(firstAccount)) {
          setWalletAddress(firstAccount);
          loadStablecoinInfo(firstAccount);
        }
      } catch (syncError) {
        setError(syncError?.message || 'Impossible de lire le wallet connecté.');
      }
    };

    const handleAccountsChanged = (accounts) => {
      const firstAccount = accounts?.[0];
      if (isValidAddress(firstAccount)) {
        setWalletAddress(firstAccount);
        loadStablecoinInfo(firstAccount);
      } else {
        setWalletAddress('');
        setStablecoinInfo(null);
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
          </p>
          <p className='mb-1'>
            Contrat stablecoin : <strong>{formatShortAddress(stablecoinInfo?.contractAddress || getStablecoinAddress())}</strong>
          </p>
          <p className='mb-1'>
            RPC : <strong>{getDefaultRpcUrl()}</strong>
          </p>
          {currentUser?.email ? (
            <p className='mb-1'>
              Compte applicatif : <strong>{currentUser.email}</strong>
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
            onClick={connectWallet}
            disabled={isConnecting || !hasInjectedWallet()}
          >
            {isConnecting ? 'Connexion...' : walletAddress ? 'Reconnecter wallet' : 'Connecter wallet'}
          </Button>
          {!hasInjectedWallet() ? (
            <p className='small mt-2 mb-0'>MetaMask ou un wallet compatible est requis.</p>
          ) : null}
        </Col>
      </Row>
    </Card>
  );
}
