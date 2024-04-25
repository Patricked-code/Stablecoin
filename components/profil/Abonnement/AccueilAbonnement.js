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
     // Variable de l'api key de stablecoin
     const API_KEY_STABLECOIN = process.env.NEXT_PUBLIC_API_KEY_STABLECOIN
    const ADDRESS_CONTRAT_EWARI = process.env.NEXT_PUBLIC_ADDRESS_CONTRAT_EWARI
    const PRIVATE_KEY = process.env.NEXT_PUBLIC_PRIVATE_KEY
    const  ADDRESS_COMMISSION = process.env.NEXT_PUBLIC_ADDRESS_COMMISSION

    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [messageError, setMessageError] = useState();
    const [currentUser, setCurrentUser] = useState();
    const [magicCurrentAddress, setMagicCurrentAddress] = useState();
    const [provider, setProvider] = useState(null);

    //State du formulaire
    const [selectedOption, setSelectedOption] = useState('');
    const [infoSubsriptionOfUser, setInfoSubsriptionOfUser] = useState()

    // states des tarification d'abonnement
    const [dataAllRateSubsription, setDataAllRateSubsription] = useState()
    const [dataOneRateSubsription, setDataOneRateSubsription] = useState()

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
            setBalanceStablecoin(balanceStablecoin/10**decimalStablecoin)
            // Fin
            
          // Obtenir un utilisateur en fonction de son email 
          const getUser = async () => {
            const result = await fetch(`${API_URL}/api/user/find-user-by-email?email=${userMetadatas?.email}`, {
                headers: {
                'Content-Type': 'application/json',
                'x-api-key': `${API_KEY_STABLECOIN}`,
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
    };
      
      
      
    // Fonction d'enregistrement des données d'abonnement
    const addSubscription = async (_magicCurrentAddress, _addressCommission, _subscriptionCost, _subscriptionDays,_hash) => {
      setIsLoggingIn(true);

      try {
          
          const dataBody = {
            addressSubscriber: _magicCurrentAddress,
            addressCommission:_addressCommission,
            subscriptionCost: _subscriptionCost,
            subscriptionDays: _subscriptionDays,
            hash: _hash
          }

          // Obtenir le token en cours
          const token = localStorage.getItem('tokenEnCours');
          
          const response = await fetch(`${API_URL}/api/subscription/add-subscription`, {
              method: 'POST',
              body: JSON.stringify(dataBody),
              headers: {
                  'Content-Type': 'application/json',
                    'x-api-key': `${API_KEY_STABLECOIN}`,
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
                  html: `<p>L'abonnement s'est effectué avec succès.</p>`,
                  showConfirmButton: false,
                  timer: 5000
              });

              // Actualiser après l'affichage
              setTimeout(() => {
                  window.location.reload();
              }, 7000);
              Router.push("/profil/dashboard/"); 

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
    const resubscription = async (_magicCurrentAddress, _addressCommission, _subscriptionCost, _subscriptionDays,_hash) => {
      setIsLoggingIn(true);
      try {
          
          const dataBody = {
            addressSubscriber: _magicCurrentAddress,
            addressCommission:_addressCommission,
            subscriptionCost: _subscriptionCost,
            subscriptionDays: _subscriptionDays,
            hash: _hash
          }

          // Obtenir le token en cours
          const token = localStorage.getItem('tokenEnCours');
          
          const response = await fetch(`${API_URL}/api/subscription/update-subscription/${infoSubsriptionOfUser?.id}`, {
              method: 'PUT',
              body: JSON.stringify(dataBody),
              headers: {
                  'Content-Type': 'application/json',
                    'x-api-key': `${API_KEY_STABLECOIN}`,
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
                  html: `<p> Le réabonnement s'est effectué avec succès.</p>`,
                  showConfirmButton: false,
                  timer: 5000
              });

              // Actualiser après l'affichage
              setTimeout(() => {
                  window.location.reload();
              }, 7000);
              Router.push("/profil/dashboard/"); 


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
              'x-api-key': `${API_KEY_STABLECOIN}`,
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

    // FONCTION POUR RECUPERER LES TARIFS DES ABONNEMENTS 
    useEffect(() => {
      // Obtenir le token en cours
      const token = localStorage.getItem('tokenEnCours');
      const getAllRateSubsription = async () => {
      try {
          const result = await fetch(`${API_URL}/api/subscription/find-all-rate-subscription`, {
          headers: {
              'Content-Type': 'application/json',
              'x-api-key': `${API_KEY_STABLECOIN}`,
              Authorization: `Bearer ${token}`

          },
          });

          if (!result.ok) {
          throw new Error('Failed to fetch user data');
          }
          const data = await result.json();
          setDataAllRateSubsription(data);
      } catch (error) {
          // Handle errors appropriately, e.g., set an error state.
          console.error('Error fetching user data:', error);
      }
      };

      getAllRateSubsription();
      
    }, []);
    // FIN

    // FONCTION POUR RECUPERER UNE SEULE LIGNE DE TARIFS DES ABONNEMENTS 
    useEffect(() => {
      // Obtenir le token en cours
      const token = localStorage.getItem('tokenEnCours');
      
      const getOneRateSubsription = async (_selectedOption) => {
      try {
          const result = await fetch(`${API_URL}/api/subscription/find-one-rate-subscription/${_selectedOption}`, {
          headers: {
              'Content-Type': 'application/json',
              'x-api-key': `${API_KEY_STABLECOIN}`,
              Authorization: `Bearer ${token}`

          },
          });

          if (!result.ok) {
          throw new Error('Failed to fetch user data');
          }
          const data = await result.json();
          setDataOneRateSubsription(data);
      } catch (error) {
          // Handle errors appropriately, e.g., set an error state.
          console.error('Error fetching user data:', error);
      }
      };

      if (selectedOption) {
        getOneRateSubsription(selectedOption);
      }
      
    }, [selectedOption]);
    // FIN

    // La fonction d'abonnement du smart contrat
    const subscribe = async () => {
      setIsLoggingIn(true)
      
       // Parser le montant d'abonnement
       const tostingA = String(dataOneRateSubsription?.subscriptionCost);
       const feeWei = ethers.utils.parseUnits(tostingA, decimalStablecoin);
      
       const dataForm ={
        addressSubscriber: magicCurrentAddress,
        addressCommission: ADDRESS_COMMISSION,
        subscriptionCost: feeWei,
        subscriptionDays: dataOneRateSubsription?.subscriptionDays
      }
      try {


        // Vérifie si l'abonné a suffisamment de jetons pour payer le coût d'abonnement
      const convertAmount = parseFloat(dataOneRateSubsription?.subscriptionCost)
      if (balanceStablecoin<=convertAmount) {
        setIsLoggingIn(false);
        Swal.fire({
          position: 'center',
          icon: 'error',
          html: "Votre solde est insuffisant pour couvrir le coût d'abonnement.",
          showConfirmButton: false,
          timer: 5000,
        });
        throw new Error("Solde insuffisant pour l'abonnement.");
      }




      // Vérifie si l'exécuteur a suffisamment de frais de gas
      const gasEstimate = await contractStablecoin.estimateGas.subscribe(
        dataForm?.addressSubscriber,
        dataForm?.addressCommission,
        dataForm?.subscriptionCost,
        dataForm?.subscriptionDays
      );
      const gasCost = gasEstimate.mul(await signer.getGasPrice());
      const senderBalance = await signer.getBalance();
  
      if (gasCost?._hex>senderBalance?._hex) {
      setIsLoggingIn(false);

        Swal.fire({
          position: 'center',
          icon: 'error',
          html: "L'exécuteur n'a pas suffisamment de frais de gas pour exécuter cette transaction.",
          showConfirmButton: false,
          timer: 5000,
        });
        throw new Error("L'exécuteur n'a pas suffisamment de frais de gas pour exécuter cette transaction.");
      }

      


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
          resubscription(magicCurrentAddress, ADDRESS_COMMISSION, dataOneRateSubsription?.subscriptionCost, dataForm?.subscriptionDays, subscribeTx?.hash)
          
        } else {
          addSubscription(magicCurrentAddress, ADDRESS_COMMISSION, dataOneRateSubsription?.subscriptionCost, dataForm?.subscriptionDays, subscribeTx?.hash)

        }
        
        // Vous pouvez effectuer des actions supplémentaires ici

        return subscribeTx; // Vous pouvez également retourner le résultat si nécessaire
      } catch (error) {
        // Affiche une notification d'erreur avec Swal
        setIsLoggingIn(false)
        // Swal.fire({
        //   position: 'center',
        //   icon: 'error',
        //   html: 'Une erreur s\'est produite lors de l\'abonnement.',
        //   showConfirmButton: false,
        //   timer: 5000,
        // });

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
                <h3 className='text-center'>Abonnement</h3>
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
                  <p>Veuillez choisir un abonnement</p>
                  {dataAllRateSubsription?.map((data) => (
                    <div className='form-group ' key={data?.id}>
                      <div className='input-group flex-nowrap'>
                        
                        <label>
                          <input
                            type="radio"
                            value={data?.id}
                            className='mx-3'
                            checked={data?.id == selectedOption}
                            onChange={(e) => handleOptionChange(e)}
                          />
                          {data?.subscriptionMonth} Mois
                        </label>
                        <span className="mx-5 colorGreen">{data?.subscriptionCost} {symbolStablecoin}</span>
                      </div>
                    </div>
                  ))}
                  {/* Les boutons */}
                  <div className="form-group mt-3 col-lg-12 col-md-12">
                    <button className="btn btn-primary" onClick={subscribe} disabled={!selectedOption || isLoggingIn}>
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
