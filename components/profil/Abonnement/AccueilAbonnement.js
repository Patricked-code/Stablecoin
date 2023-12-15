import { useCallback, useState, useEffect,useRef } from 'react';
import React from "react";
import { ethers } from "ethers";
import Link from 'next/link';
import { Table } from '@nextui-org/react';
import Router from "next/router";
import Swal from 'sweetalert2';
import { magic } from "../../../magic";
import ABI_TOKEN_EWARI from "../../../components/Contrats/Abi/AbiStablecoin.json"

// FIN

const CAccueilAbonnement = () => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API
    const ADDRESS_CONTRAT_EWARI = process.env.NEXT_PUBLIC_ADDRESS_CONTRAT_EWARI
    const PRIVATE_KEY = process.env.NEXT_PUBLIC_PRIVATE_KEY

    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [messageError, setMessageError] = useState();
    const [currentUser, setCurrentUser] = useState();
    const [magicCurrentAddress, setMagicCurrentAddress] = useState();
    const [provider, setProvider] = useState(null);

    //State du formulaire
    const [period, setPeriod] = useState('');
    const [addressCommission, setAddressCommission] = useState('0x88e036DCf477F016a605049e04952bb7BD828BD0');
    const [fee, setFee] = useState(); 
    const [selectedOption, setSelectedOption] = useState('');
    const [infoSubsriptionOfUser, setInfoSubsriptionOfUser] = useState()

    //***************************************************************** *
     // LES STATES DU STABLECOIN
    // ******************************************************************
    const [contractStablecoin, setContractStablecoin] = useState();
    const [signer, setSigner] = useState();
    const [nameStablecoin, setNameStablecoin] = useState();
    const [symbolStablecoin, setSymbolStablecoin] = useState();
    const [balanceStablecoin, setBalanceStablecoin] = useState();
    const [decimalStablecoin, setDecimalStablecoin] = useState();

    /**
     * Effet pour mettre à jour le fournisseur Ethereum lorsqu'un objet Magic est disponible.
     * Cet effet dépend de l'existence de l'objet `magic`.
     *
     * @function
     * @returns {void}
    */
     useEffect(() => {
      if (!!magic) {
          /**
           * Fournisseur Ethereum basé sur le fournisseur RPC de l'objet Magic.
           * @type {object}
           */
          const pt = new ethers.providers.Web3Provider(magic.rpcProvider);

          /**
           * Mise à jour de l'état local avec le nouveau fournisseur Ethereum.
           * @type {object}
           */
          setProvider(pt);
      }
  }, [magic]);

  // RECUPERATION DES INFORMATIONS QUI CONCERNENT MAGIC
  useEffect(() => {
    (async () => {
        if (!!magic && !!provider) {
            const userMetadatas = await magic.user.getMetadata();
            const signer = provider.getSigner();
            setSigner(signer)
            const network = await provider.getNetwork();
            const userAddress = await signer.getAddress();
            setMagicCurrentAddress(userAddress)

            //const userBalance = ethers.utils.formatEther(await provider.getBalance(userAddress))
            // FIN

            // *************************************************************************
                // INTERACTION AVEC LE SMART CONTRAT DE STABLECOIN
            // *************************************************************************
            const walletRelay = new ethers.Wallet(PRIVATE_KEY, provider);

            const contractStablecoin = new ethers.Contract(ADDRESS_CONTRAT_EWARI,ABI_TOKEN_EWARI.abi,walletRelay);
            setContractStablecoin(contractStablecoin);
                
            //   recuperation des infos de stablecoin
            const nameStablecoin = await contractStablecoin.name()
            const symbolStablecoin = await contractStablecoin.symbol()
            const decimalStablecoin = await contractStablecoin.decimals()
            const balanceStablecoin = await contractStablecoin.balanceOf(userAddress)
            // Fin 

            // Stocker les infos de stablecoin dans leur state
            // setNameStablecoin(nameStablecoin)
            setSymbolStablecoin(symbolStablecoin)
            setDecimalStablecoin(decimalStablecoin)
            // setBalanceStablecoin(balanceStablecoin/10**decimalStablecoin)
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
 


    const handleOptionChange = (event) => {
        const selectedValue = event.target.value;
        setSelectedOption(selectedValue);
    
        // Attribution des points en fonction de la sélection
        switch (selectedValue) {
          case "30":
            setFee(10);
            break; 
          case '90':
            setFee(35);
            break;
          case '180':
            setFee(50);
            break;
          case '365':
            setFee(80);
            break;
          default:
            setFee(""); // Aucune sélection
        }
      };
      
      
      
    // Fonction d'enregistrement des données d'abonnement
    const addSubscription = async (_magicCurrentAddress, _addressCommission, _fee, _selectedOption) => {
      setIsLoggingIn(true);

      try {
          
          const dataBody = {
            addressSubscriber: _magicCurrentAddress,
            addressCommission:_addressCommission,
            subscriptionCost: _fee,
            subscriptionDays: _selectedOption
          }

          // Obtenir le token en cours
          const token = localStorage.getItem('tokenEnCours');
          
          const response = await fetch(`${API_URL}/api/subscription/add-subscription`, {
              method: 'POST',
              body: JSON.stringify(dataBody),
              headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`
              },
          });

          /**
           * Données de la réponse de la requête .
           * @type {object}
           */
          const data = await response.json();

          /* Verifier s'il y a un messsage d'erreur, on l'affiche dans SWAL 
          * sinon on affiche le message de succès
          */
          if (data.message==200) {
              Swal.fire({
                  position: 'center',
                  icon: 'success',
                  html: `<p> Le dépôt s'est effectué avec succès.</p>`,
                  showConfirmButton: false,
                  timer: 5000
              });

              // Actualiser après l'affichage
              setTimeout(() => {
                  window.location.reload();
              }, 7000);
              // Fin
          } else {
              setMessageError(data.message);
              setIsLoggingIn(false);
              Swal.fire({
                  position: 'center',
                  icon: 'error',
                  html: `<p> ${messageError} </p>`,
                  showConfirmButton: false,
                  timer: 10000
              });
          }
          // Fin condition
      } catch (error) {
          console.error('Erreur =>', error);
      }
    };

    // Fonction d'enregistrement des données d'abonnement
    const resubscription = async (_magicCurrentAddress, _addressCommission, _fee, _selectedOption) => {
      setIsLoggingIn(true);
      try {
          
          const dataBody = {
            addressSubscriber: _magicCurrentAddress,
            addressCommission:_addressCommission,
            subscriptionCost: _fee,
            subscriptionDays: _selectedOption
          }

          // Obtenir le token en cours
          const token = localStorage.getItem('tokenEnCours');
          
          const response = await fetch(`${API_URL}/api/subscription/update-subscription`, {
              method: 'PUT',
              body: JSON.stringify(dataBody),
              headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`
              },
          });

          /**
           * Données de la réponse de la requête .
           * @type {object}
           */
          const data = await response.json();

          /* Verifier s'il y a un messsage d'erreur, on l'affiche dans SWAL 
          * sinon on affiche le message de succès
          */
          if (data.message==200) {
              Swal.fire({
                  position: 'center',
                  icon: 'success',
                  html: `<p> Le dépôt s'est effectué avec succès.</p>`,
                  showConfirmButton: false,
                  timer: 5000
              });

              // Actualiser après l'affichage
              setTimeout(() => {
                  window.location.reload();
              }, 7000);
              // Fin
          } else {
              setMessageError(data.message);
              setIsLoggingIn(false);
              Swal.fire({
                  position: 'center',
                  icon: 'error',
                  html: `<p> ${messageError} </p>`,
                  showConfirmButton: false,
                  timer: 10000
              });
          }
          // Fin condition
      } catch (error) {
          console.error('Erreur =>', error);
      }
    };

    // FONCTION POUR RECUPERER LES INFOSD'ABONNEMENT EN FONCTION DE L'UTILISATEUR CONNECTE
    useEffect(() => {
      // Obtenir le token en cours
      const token = localStorage.getItem('tokenEnCours');
      const getSubsriptionOfUser = async () => {
      try {
          const result = await fetch(`${API_URL}/api/subscription/find-subscription-of-user`, {
          headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`

          },
          });

          if (!result.ok) {
          throw new Error('Failed to fetch user data');
          }
          const data = await result.json();
          setInfoSubsriptionOfUser(data);
      } catch (error) {
          // Handle errors appropriately, e.g., set an error state.
          console.error('Error fetching user data:', error);
      }
      };

      getSubsriptionOfUser();
      
    }, []);
    // FIN

    // La fonction d'abonnement du smart contrat
    const subscribe = async () => {
      setIsLoggingIn(true)
      
       // Parser le montant d'abonnement
       const tostingA = String(fee);
       const feeWei = ethers.utils.parseUnits(tostingA, decimalStablecoin);
       
      //  convertir le nombre de jour en entiter
       let entierConverti = selectedOption ? parseInt(selectedOption, 10) : null;
      
       const dataForm ={
        addressSubscriber: magicCurrentAddress,
        addressCommission: addressCommission,
        subscriptionCost: feeWei,
        subscriptionDays: entierConverti
      }
      try {
        // Vérifie si l'exécuteur a suffisamment de frais de gas
        // const gasEstimate = await contractStablecoin.estimateGas.subscribe(
        //   dataForm?.addressSubscriber,
        //   dataForm?.addressCommission,
        //   dataForm?.subscriptionCost,
        //   dataForm?.subscriptionDays
        // );

        // const gasPrice = await wallet.provider.getGasPrice();
        // const gasCost = gasEstimate.mul(gasPrice);

        // const senderBalance = await wallet.getBalance();

        // if (gasCost.gt(senderBalance)) {
        //   setIsLoggingIn(false)
        //   Swal.fire({
        //     position: 'center',
        //     icon: 'error',
        //     title: "L'exécuteur n'a pas suffisamment de frais de gas.",
        //     showConfirmButton: false,
        //     timer: 5000,
        //   });
        //   throw new Error("L'exécuteur n'a pas suffisamment de frais de gas.");
        // }

        // Exécute la fonction subscribe
        const subscribeTx = await contractStablecoin.subscribe(
          dataForm?.addressSubscriber,
          dataForm?.addressCommission,
          dataForm?.subscriptionCost,
          dataForm?.subscriptionDays,
        );
        await subscribeTx.wait();
        

        // Appel de la fonction de la mise à jour des finfos d'abonnement ou de réabonnement dans la base de données
        if (infoSubsriptionOfUser?.userId || !infoSubsriptionOfUser?.userId==undefined) {
          resubscription(magicCurrentAddress, addressCommission, fee, selectedOption)
          
        } else {
          addSubscription(magicCurrentAddress, addressCommission, fee, selectedOption)

        }
        
        // Affiche une notification de succès avec Swal
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Abonnement réussi!',
          showConfirmButton: false,
          timer: 5000,
        });

        // Vous pouvez effectuer des actions supplémentaires ici

        return subscribeTx; // Vous pouvez également retourner le résultat si nécessaire
      } catch (error) {
        // Affiche une notification d'erreur avec Swal
        setIsLoggingIn(false)
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Une erreur s\'est produite lors de l\'abonnement.',
          showConfirmButton: false,
          timer: 5000,
        });

        console.error("Erreur:", error.message);
      }
    };

    const handleSubmit = (e) => {
      e.preventDefault()
    }

  return (
    <>
      
        <div className='mt-15' >
            <div className='py-10'>
                <h1 className='text-center'>Abonnement</h1>
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
            <div className='row mt-5'>
              <div className='col-lg-3 col-md-12'></div>
              <div className='m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white cryptocurrency-search-box login-form col-lg-6 col-md-12'>
               
                {/* FORM  */}
                <form onSubmit={handleSubmit}>
                  <div className='form-group'>
                  <div className='input-group flex-nowrap'>

                    <label>
                      <input
                        type="radio"
                        value="30"
                        className='mx-3 '
                        checked={selectedOption === "30"}
                        onChange={handleOptionChange}
                      />
                      {/* 10000 35000 50000 80000 */}
                          1 Mois
                    </label>
                        <span  className="mx-5 colorGreen" >10 {symbolStablecoin}</span>
                    </div>
                  </div>
                  <div className='form-group'>
                  <div className='input-group flex-nowrap'>

                    <label>
                      <input
                        type="radio"
                        value="90"
                        className='mx-3'
                        checked={selectedOption === "90"}
                        onChange={handleOptionChange}
                      />
                        3 Mois
                    </label>
                        <span  className="mx-5 colorGreen" >35 {symbolStablecoin}</span>
                    </div>
                  </div>
                  <div className='form-group'>
                  <div className='input-group flex-nowrap'>

                    <label>
                        <input
                        type="radio"
                        value="180"
                        className='mx-3'
                        checked={selectedOption === "180"}
                        onChange={handleOptionChange}
                        />
                          6 Mois
                    </label>
                        <span  className="mx-5 colorGreen" >50 {symbolStablecoin}</span>
                    </div>
                  </div>
                  <div className='form-group'>
                  <div className='input-group flex-nowrap'>

                    <label>
                        <input
                        type="radio"
                        value="365"
                        className='mx-3 '
                        checked={selectedOption === "365"}
                        onChange={handleOptionChange}
                        />
                        1 An
                    </label>
                    <span  className="mx-5 px-3 colorGreen" >80 {symbolStablecoin}</span>
                    </div>
                  </div>

                  {/* Les boutons */}
                  <div className="form-group  mt-3 col-lg-12 col-md-12">
                      <button className="btn btn-primary" onClick={subscribe} disabled={isLoggingIn}> 
                        Abonner 
                        {isLoggingIn === true ? (<i className="fas fa-spinner fa-spin fa-lg"></i>) : ("")}
                      </button>
                  </div>
                </form>
              </div>
              <div className='col-lg-3 col-md-12'></div>
            </div>
          </div>
    </>
  );
};

export default CAccueilAbonnement;
