import { useState, useEffect } from 'react';
import { Container, Row, Col, Modal } from "react-bootstrap";
import {Button,} from "reactstrap";
import React from "react";
import Link from 'next/link';
import moment from 'moment';
import { Icon } from '@iconify/react';
import { Table } from '@nextui-org/react';



// Pour Magic
import { magic } from "../../../magic";
import { ethers } from "ethers";
import Loading from "../../../components/loading";
import Router from "next/router";
import Swal from 'sweetalert2';
// FIN

// Importer ABI de E-WARI
import ABI_TOKEN_EWARI from "../../../components/Contrats/Abi/AbiStablecoin.json";
import ABI_ESCROW_STABLECOIN from "../../../components/Contrats/Abi/AbiEscrowStablecoin.json";


// FIN

const PaiementsEcommerceAttente = () => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API

    // Pour les smart contrats
    const ADDRESS_CONTRAT_EWARI = process.env.NEXT_PUBLIC_ADDRESS_CONTRAT_EWARI
    const PRIVATE_KEY = process.env.NEXT_PUBLIC_PRIVATE_KEY
    const [currentUser, setCurrentUser] = useState();
    const [magicCurrentAddress, setMagicCurrentAddress] = useState();
    const [provider, setProvider] = useState(null);
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const [dataPaymentPending, setDataPaymentPending] = useState(); //state des données de paiement en entente
    const [dataOnePaymentPending, setDataOnePaymentPending] = useState();
    const [paymentPendingLength, setPaymentPendingLength] = useState();

    const [idPaymentPending, setIdPaymentPending] = useState();
    const [currentnameEntreprise, setCurrentEntreprise] = useState();
    const [currentSenderEmail, setCurrentSenderEmail] = useState();
    const [currentSenderAddress, setCurrentSenderAddress] = useState();
    const [currentAmount, setCurrentAmount] = useState();
    const [currentSenderId, setCurrentSenderId] = useState();
    const [contractEscrow, setContractEscrow] = useState()
    
    // Autre user
    const [infosOtherUser, setInfosOtherUser] = useState()

    
    

    //***************************************************************** *
        // LES STATES DU STABLECOIN
    // ******************************************************************
    const [contractStablecoin, setContractStablecoin] = useState();
    const [signer, setSigner] = useState();
    const [walletRelayer, setWalletRelayer] = useState();
    
    const [nameStablecoin, setNameStablecoin] = useState();
    const [symbolStablecoin, setSymbolStablecoin] = useState();
    const [balanceStablecoin, setBalanceStablecoin] = useState();
    const [decimalStablecoin, setDecimalStablecoin] = useState();

    // States des données de l'utilisation de stablecoin comme moyen de paiement
    const [dataRequestUseStablecoinOfUser, setDataRequestUseStablecoinOfUser] = useState()


    // States de la demande de remboursement
    const [oneHistorical, setOneHistorical] = useState();
    const [optionRefund, setOptionRefund] = useState();
    const [addressTo, setAddressTo] = useState();
    const [showConditions, setShowConditions] = useState();
    const [showPartRefund, setShowPartRefund] = useState();
    const [showButtonRegul, setShowButtonRegul] = useState(0);

    
    



    



  



    
    // Modal de la demande de remboursement 
    // const [showRefund, setShowRefund] = useState(false);
    // const handleCloseRefund = () => setShowRefund(false);
    // const handleShowRefund = () => setShowRefund(true);
    const [secondsRemaining, setSecondsRemaining] = useState(5 * 60 );
    
    // Fin


    // Obtenir un utilisateur en fonction de son adresse blockchain
    useEffect(async () => {
        const getOtherUser= async (_addressTo) => {
            const token = localStorage.getItem('tokenEnCours');

            try {
                
                const result = await fetch(`${API_URL}/api/user/find-user-by-addrBlockchain?address=${_addressTo}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!result.ok) {
                    throw new Error('Failed to fetch request data');
                }

                const data = await result.json();
                setInfosOtherUser(data);

            } catch (error) {
                // Gérer les erreurs de manière appropriée, par exemple, définir un état d'erreur.
                console.error('Erreur lors de la récupération des données:', error);
            }
        };
        if (addressTo) {
            await getOtherUser(addressTo);
        }
    }, [addressTo]);


   



  
  
  













   



    





    // Utilisez le useEffect pour effectuer des actions lorsque le composant est monté
    useEffect(() => {
        if (
          dataPaymentPending?.status == "En attente" &&
          dataPaymentPending?.createdAt
        ) {
            const createdAtTimestamp = new Date(dataPaymentPending.createdAt).getTime();
            const nowTimestamp = new Date().getTime();
            const initialTimeDifference = (nowTimestamp - createdAtTimestamp) / 1000; // en secondes
            let remainingTime = 5 * 60 - Math.floor(initialTimeDifference);
            setSecondsRemaining(remainingTime);

          if (remainingTime > 0) {
            setShowPayer(true);
    
            const intervalId = setInterval(() => {
              remainingTime -= 1;
              setSecondsRemaining(remainingTime);
    
              if (remainingTime <= 0) {
                setShowPayer(false);
                clearInterval(intervalId);

                // Le temps est écoulé, exécutez la fonction transferAmount
                transferAmount();
              }
            }, 1000); // Mettez à jour toutes les secondes
          }
        }
      }, [dataPaymentPending?.id]); // Le tableau de dépendances vide garantit que cela s'exécute une seule fois lors du montage du composant
  
      const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
      };
  
 

    /**
     * Affiche un contenu limité en fonction du nombre de mots ou de caractères spécifié.
     *
     * @param {string} content - Le contenu à afficher.
     * @param {number} limit - Le nombre limite de mots ou de caractères.
     * @param {string} unit - L'unité de la limite ('words' pour mots, 'characters' pour caractères).
     * @returns {string} Le contenu limité avec des points de suspension si nécessaire.
     * @throws {Error} Si l'unité spécifiée n'est ni 'words' ni 'characters'.
     */
    function displayLimitedContent(content, limit, unit) {
        // Vérifier si le paramètre 'unit' est spécifié et valide
        if (unit !== 'words' && unit !== 'characters') {
            throw new Error("L'unité doit être 'words' ou 'characters'.");
        }

        if (unit === 'words') {
            // Séparer le contenu en mots
            const words = content.split(' ');

            // Vérifier si le nombre de mots est inférieur ou égal à la limite
            if (words.length <= limit) {
                return content; // Pas besoin de points de suspension
            } else {
                // Sélectionner les premiers 'limit' mots et les rejoindre
                const limitedContent = words.slice(0, limit).join(' ');

                return `${limitedContent}...`;
            }
        } else if (unit === 'characters') {
            // Vérifier si la longueur du contenu est inférieure ou égale à la limite
            if (content.length <= limit) {
                return content; // Pas besoin de points de suspension
            } else {
                // Sélectionner les premiers 'limit' caractères
                const limitedContent = content.slice(0, limit);

                return `${limitedContent}...`;
            }
        }
    }
     
    // FONCTION POUR FORMATER LA DATE
    const formatDate = (_updatedAt) =>{
        const maDate = moment(_updatedAt).format('DD/MM/YYYY à HH:mm');
        return  maDate
    }
    //  FIN

    




    return (
        <>
        


        {/* ********************************************************************************** */}
            {/* MODAL DE VALIDATION DE PAIEMENT  '*/}
        {/* ********************************************************************************** */}
        {/* <Modal show={true} width='2000' fullscreen={true} > */}
        <Modal show={true} className="mt-15 modal-fullpage" style={{ height: '100%', maxHeight: '100%' }}>
        {/* <Modal show={true} className="mt-15" width='50%' height='50%' onHide={handleCloseRefund}> */}
            <Modal.Header closeButton className='bgColorblue text-center'>
                <Modal.Title className="text-white " >Ne fermez pas cette fenêtre</Modal.Title>                
            </Modal.Header>
                <Modal.Body>
                    <div className='col-lg-12 col-md-12  row justify-content-between'>
                      <div className='bestseller-coin-image text-center col-lg-6 col-md-6'>
                          <img src="/images/ecfa/logo/logo_ewari1.jpg" height={80} width={100} className="rounded-circle"  alt='image' />
                      </div>

                      <div className='text-center col-lg-6 col-md-6 mt-3'>
                        <h3>Wealthtech</h3> <b className='colorBlue'>Innovations</b>
                      </div>

                      <div>Vous devez valider votre transaction sur la plateforme <b>Stablecoin de Wealthtech </b>.  </div>

                      <h3 className='text-center mt-3'><i className="fas fa-spinner fa-spin fa-lg mx-3"></i> </h3>
                    </div>
                </Modal.Body>
        </Modal>
        {/* *****************************************FIN****************************************** */}
            







        </>
    );
};

export default PaiementsEcommerceAttente;
