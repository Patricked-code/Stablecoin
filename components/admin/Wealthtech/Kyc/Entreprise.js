import { useState, useEffect } from 'react';
import { Container, Row, Col, Modal } from "react-bootstrap";

import React from "react";
import axios from 'axios';
import Link from 'next/link';
import moment from 'moment';
import { Icon } from '@iconify/react';
import { Table } from '@nextui-org/react';


// Pour Magic
import { magic } from "../../../../magic";
import { ethers } from "ethers";
import Loading from "../../../../components/loading";
import Router from "next/router";
import Swal from 'sweetalert2';
import Web3 from "web3";


// FIN



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
    // Modal,
    // Row,
    // Col,
  } from "reactstrap";

// FIN

const ValidEntreprise = () => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API


    const [currentUser, setCurrentUser] = useState();
    const [provider, setProvider] = useState(null);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [allCountry, setAllCountry] = useState();
    const [userById, setUserById] = useState();

    // States de validation de Kyc
    const [etape, setEtape] = useState();


    // States de l'entreprise
    const [allKycForEntreprise, setAllKycForEntreprise] = useState();
    const [oneKycForEntreprise, setOneKycForEntreprise] = useState();
    const [idKycForEntreprise, setIdKycForEntreprise] = useState();

    // States de l'identité
    const [identityByKycId, setIdentityByKycId] = useState();

    // States des représentant legeaux
    const [allRepresentativeByKycId, setAllRepresentativeByKycId] = useState();

    // States des bénéficiaire effectifs
    const [allBeneficiaryByKycId, setAllBeneficiaryByKycId] = useState();

    // States des structure de contrôle (Associé)
    const [allAssociatesByKycId, setAllAssociatesByKycId] = useState();

    // States des personnes politiquement exposées
    const [allPoliticallyExposedByKycId, setAllPoliticallyExposedByKycId] = useState();
    
    // States des opérations financières
    const [allFinancialOperationByKycId, setAllFinancialOperationByKycId] = useState();

    // States des fonds d'investissement
    const [allFundOriginByKycId, setAllFundOriginByKycId] = useState();

    // States des informations financières
    const [oneMonthlyFinancialInformation, setOneMonthlyFinancialInformation] = useState();
    const [oneAnnualFinancialInformation, setOneAnnualFinancialInformation] = useState();
    const [oneQuarterlyFinancialInformation, setOneQuarterlyFinancialInformation] = useState();
    
    // States des informations sur les transactions
    const [oneMonthlyFinancialTransaction, setOneMonthlyFinancialTransaction] = useState();
    const [oneAnnualFinancialTransaction, setOneAnnualFinancialTransaction] = useState();
    
    // States des documents légaux
    const [oneLegalDocumentByKycId, setOneLegalDocumentByKycId] = useState();

    


    // states du formulaire de validation
    const [validQuiz, setValidQuiz] = useState();
    const [validLegalDocuments, setValidLegalDocuments] = useState();
    const [validIdentity, setValidIdentity] = useState();
    const [validResidence, setValidResidence] = useState();
    const [validPhoto, setValidPhoto] = useState();
    const [validSignature, setValidSignature] = useState();
    const [pattern, setPattern] = useState();

    
    // States d'accordion Pour la partie questionnaire
    const [isOpen1, setIsOpen1] = useState(false);
    const [isOpen2, setIsOpen2] = useState(false);
    const [isOpen3, setIsOpen3] = useState(false);
    const [isOpen4, setIsOpen4] = useState(false);

    // La fonction toggleAccordion Pour la partie questionnaire
    const toggleAccordion = (accordionNumber) => {
        switch (accordionNumber) {
        case 1:
            setIsOpen1(!isOpen1);
            break;
        case 2:
            setIsOpen2(!isOpen2);
            break;
        case 3:
            setIsOpen3(!isOpen3);
            break;
        case 4:
            setIsOpen4(!isOpen4);
            break;
        default:
            break;
        }
    };

    
    


    


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
                  }) 
              };
              await getUser();
              // Fin
            }
        })();
    }, [provider, magic]);
    //  Fin

    
    // RECUPERER KYC DE L'ENTREPRISE
    useEffect(async() => {
    const token = localStorage.getItem('tokenEnCours')
    
        const getAllKycForEntreprise = async () => {
        const resKyc = await fetch(`${API_URL}/api/kyc/business/find-All-kyc`, {
            headers: {
            'Content-Type': 'application/json',
            Authorization:  `Bearer ${token}`,
            },
        })
            .then((resKyc) => resKyc.json())
            .then((data) => {
            setAllKycForEntreprise(data)

            }) 

        };
        await getAllKycForEntreprise();
    }, []);
    // FIN


    // RECUPERER UNE SEULE LIGNE DE KYC DE L'ENTREPRISE
    useEffect(() => {
        const getUserById = async (_idKycForEntreprise) => {
            const token = localStorage.getItem('tokenEnCours') //Le token récuperé

        try {
            const resKyc = await fetch(`${API_URL}/api/kyc/business/find-one-kyc/${_idKycForEntreprise}`, {
                headers: {
                'Content-Type': 'application/json',
                Authorization:  `Bearer ${token}`

                },
            });
    
            if (!resKyc.ok) {
            throw new Error('Failed to fetch user data');
            }
    
            const data = await resKyc.json();
            setOneKycForEntreprise(data)
            
        } catch (error) {
            // Handle errors appropriately, e.g., set an error state.
            console.error('Error fetching user data:', error);
        }
        };
    
        if (idKycForEntreprise) {
        getUserById(idKycForEntreprise);
        }
    }, [idKycForEntreprise]);
   
    // FIN

    // La fonction qui vérifie si un lien est un lien pdf
    function isPdfLink(link) {
        return link.endsWith('.pdf');
      }


    // Modal de la validation des différentes parties du kyc
    const [showEvaluer, setShowEvaluer] = useState(false);
    const handleCloseEvaluer = () => setShowEvaluer(false);
    const handleShowEvaluer = () => setShowEvaluer(true);
    // Fin

    // Modal pour voir des différentes parties du kyc
    const [showInfosKyc, setShowInfosKyc] = useState(false);
    const handleCloseInfosKyc = () => setShowInfosKyc(false);
    const handleShowInfosKyc = () => setShowInfosKyc(true);
    // Fin
    
    // FONCTION POUR FORMATER LA DATE
    const formatDate = (_updatedAt) =>{
        const maDate = moment(_updatedAt).format('DD/MM/YYYY');
        // const maDate = moment(_updatedAt).format('DD/MM/YYYY à HH:mm');
        return  maDate
    }
    //  FIN

    // Fonction de validation des parties de kyc
    const validKycParticular= async () => {
        setIsLoggingIn(true);
        try {
            const dataa = {
                validQuiz:validQuiz,
                validLegalDocuments:validLegalDocuments,
                validIdentity:validIdentity,
                validResidence:validResidence,
                validPhoto:validPhoto,
                validSignature:validSignature,
                pattern:pattern
            }
            const token = localStorage.getItem('tokenEnCours') //Le token récuperé
    
            const result = await fetch(`${API_URL}/api/kyc/entreprise/valid-kyc/${idKycForEntreprise}`, {
            method:"PUT",
            body: JSON.stringify(dataa),
            headers: {
                'Content-Type': 'application/json',
                Authorization:  `Bearer ${token}`
            }
            })
            const data = await result.json();
        
            /* Verifier s'il y a un messsage d'erreur on l'affiche dans SWAL 
            * sinon on affiche le message de succès
            */
            if (data.message===200) {
            Swal.fire({
                position: 'center',
                icon: 'success',
                html: `<p> Le message a été envoyé avec succès.</p>` ,
                showConfirmButton: false,
                timer: 5000
            }),
            setTimeout(() => {
                window.location.reload()
            }, 10000)
            
            }else{
                setIsLoggingIn(false);
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    html: `<p> ${data.message} </p>` ,
                    showConfirmButton: false,
                    timer: 10000
                })
                
            }
            // Fin condition 
        
            } catch {
            setIsLoggingIn(false);
            }
        }
    // Fin


    // RECUPERER TOUS LES PAYS
    useEffect(async() => {
        const token = localStorage.getItem('tokenEnCours')
        
            const getAllCountries = async () => {
            const resCountry = await fetch(`${API_URL}/api/country/find-all`, {
                headers: {
                'Content-Type': 'application/json',
                Authorization:  `Bearer ${token}`,

                },
            })
                .then((resCountry) => resCountry.json())
                .then((allCountry) => {
                setAllCountry(allCountry)
                }) 

            };
            
            await getAllCountries();
    }, []);
    // FIN

     // FONCTION POUR RECUPERER LES INFOS DE L'UTILISATEUR DONT ON VERIFIE SON KYC EN FONCTION DE SON ID
     useEffect(() => {
        const getUserById = async (_userId) => {
        try {
            const result = await fetch(`${API_URL}/api/user/find-one-user-by-id/${_userId}`, {
            headers: {
                'Content-Type': 'application/json',
            },
            });
    
            if (!result.ok) {
            throw new Error('Failed to fetch user data');
            }
    
            const user = await result.json();
            setUserById(user);
        } catch (error) {
            // Handle errors appropriately, e.g., set an error state.
            console.error('Error fetching user data:', error);
        }
        };
    
        if (oneKycForEntreprise?.userId) {
        getUserById(oneKycForEntreprise.userId);
        }
    }, [oneKycForEntreprise?.userId]);
    // FIN

    // FONCTION POUR RECUPERER LES INFOS DE L'IDENTITE DE L'ENTREPRISE EN FONCTION DE ID DU DE CELLE-CI
    useEffect(() => {
        const getIdentityByKycId = async (_kycId) => {
        const token = localStorage.getItem('tokenEnCours')

        try {
            const result = await fetch(`${API_URL}/api/kyc/business/find-kyc-business-identity-by-kycId?kycId=${_kycId}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization:  `Bearer ${token}`,
            },
            });
    
            if (!result.ok) {
            throw new Error('Failed to fetch identity data');
            }
    
            const kycIdentity = await result.json();
            setIdentityByKycId(kycIdentity);
        } catch (error) {
            // Handle errors appropriately, e.g., set an error state.
            console.error('Error fetching user data:', error);
        }
        };
    
        if (oneKycForEntreprise?.id) {
            getIdentityByKycId(oneKycForEntreprise.id);
        }
    }, [oneKycForEntreprise?.id]);
    // FIN


    // FONCTION POUR RECUPERER LA LISTE DES REPRESENTANTS LEGEAUX DE L'ENTREPRISE EN FONCTION DE ID DU DE L'ENTREPRISE
    useEffect(() => {
        const getAllRepresentativesByKycId = async (_kycId) => {
        const token = localStorage.getItem('tokenEnCours')

        try {
            const result = await fetch(`${API_URL}/api/kyc/business/find-kyc-business-representative-by-kycId?kycId=${_kycId}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization:  `Bearer ${token}`,
            },
            });
    
            if (!result.ok) {
            throw new Error('Failed to fetch identity data');
            }
    
            const kycRepresentative = await result.json();
            setAllRepresentativeByKycId(kycRepresentative);
        } catch (error) {
            // Handle errors appropriately, e.g., set an error state.
            console.error('Error fetching user data:', error);
        }
        };
    
        if (oneKycForEntreprise?.id) {
            getAllRepresentativesByKycId(oneKycForEntreprise.id);
        }
    }, [oneKycForEntreprise?.id]);
    // FIN

    // FONCTION POUR RECUPERER LA LISTE DES BENEFIAIRES EFFECTIFS DE L'ENTREPRISE EN FONCTION DE ID DU DE L'ENTREPRISE
    useEffect(() => {
        const getAllBeneficiaryByKycId = async (_kycId) => {
        const token = localStorage.getItem('tokenEnCours')

        try {
            const result = await fetch(`${API_URL}/api/kyc/business/find-kyc-business-beneficiary-by-kycId?kycId=${_kycId}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization:  `Bearer ${token}`,
            },
            });
    
            if (!result.ok) {
            throw new Error('Failed to fetch identity data');
            }
    
            const kycBeneficiary = await result.json();
            setAllBeneficiaryByKycId(kycBeneficiary);
        } catch (error) {
            // Handle errors appropriately, e.g., set an error state.
            console.error('Error fetching user data:', error);
        }
        };
    
        if (oneKycForEntreprise?.id) {
            getAllBeneficiaryByKycId(oneKycForEntreprise.id);
        }
    }, [oneKycForEntreprise?.id]);
    // FIN

    // FONCTION POUR RECUPERER LA LISTE DES STRUCTURE DE CONTROLES (ASSOCIES) DE L'ENTREPRISE EN FONCTION DE ID DU DE L'ENTREPRISE
    useEffect(() => {
        const getAllAssociatesByKycId = async (_kycId) => {
        const token = localStorage.getItem('tokenEnCours')

        try {
            const result = await fetch(`${API_URL}/api/kyc/business/find-kyc-business-structure-by-kycId?kycId=${_kycId}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization:  `Bearer ${token}`,
            },
            });
    
            if (!result.ok) {
            throw new Error('Failed to fetch identity data');
            }
    
            const kycAssociates = await result.json();
            setAllAssociatesByKycId(kycAssociates);
        } catch (error) {
            // Handle errors appropriately, e.g., set an error state.
            console.error('Error fetching user data:', error);
        }
        };
    
        if (oneKycForEntreprise?.id) {
            getAllAssociatesByKycId(oneKycForEntreprise.id);
        }
    }, [oneKycForEntreprise?.id]);
    // FIN 
    
    // FONCTION POUR RECUPERER LA LISTE DES STRUCTURE DE CONTROLES (ASSOCIES) DE L'ENTREPRISE EN FONCTION DE ID DU DE L'ENTREPRISE
    useEffect(() => {
        const getAllPoliticallyExposedByKycId = async (_kycId) => {
        const token = localStorage.getItem('tokenEnCours')

        try {
            const result = await fetch(`${API_URL}/api/kyc/business/find-kyc-business-politically-exposed-by-kycId?kycId=${_kycId}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization:  `Bearer ${token}`,
            },
            });
    
            if (!result.ok) {
            throw new Error('Failed to fetch identity data');
            }
    
            const kycPoliticallyExposed = await result.json();
            setAllPoliticallyExposedByKycId(kycPoliticallyExposed);
        } catch (error) {
            // Handle errors appropriately, e.g., set an error state.
            console.error('Error fetching user data:', error);
        }
        };
    
        if (oneKycForEntreprise?.id) {
            getAllPoliticallyExposedByKycId(oneKycForEntreprise.id);
        }
    }, [oneKycForEntreprise?.id]);
    // FIN 

    // FONCTION POUR RECUPERER LES DONNEES DES OPERATIONS FINANCIERES DE L'ENTREPRISE EN FONCTION DE ID DU DE L'ENTREPRISE
    useEffect(() => {
        const getAllFinancialOperationByKycId = async (_kycId) => {
        const token = localStorage.getItem('tokenEnCours')

        try {
            const result = await fetch(`${API_URL}/api/kyc/business/find-kyc-business-financial-operation-by-kycId?kycId=${_kycId}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization:  `Bearer ${token}`,
            },
            });
    
            if (!result.ok) {
            throw new Error('Failed to fetch identity data');
            }
    
            const kycFinancialOperation = await result.json();
            setAllFinancialOperationByKycId(kycFinancialOperation);
        } catch (error) {
            // Handle errors appropriately, e.g., set an error state.
            console.error('Error fetching user data:', error);
        }
        };
    
        if (oneKycForEntreprise?.id) {
            getAllFinancialOperationByKycId(oneKycForEntreprise.id);
        }
    }, [oneKycForEntreprise?.id]);
    // FIN 

    // FONCTION POUR RECUPERER LES DONNEES DES FONDS D'INVESTISSEMENT DE L'ENTREPRISE EN FONCTION DE ID DU DE L'ENTREPRISE
    useEffect(() => {
        const getAllFundOriginByKycId = async (_kycId) => {
        const token = localStorage.getItem('tokenEnCours')

        try {
            const result = await fetch(`${API_URL}/api/kyc/business/find-kyc-business-fund-origin-by-kycId?kycId=${_kycId}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization:  `Bearer ${token}`,
            },
            });
    
            if (!result.ok) {
            throw new Error('Failed to fetch identity data');
            }
    
            const kycFundOrigin = await result.json();
            setAllFundOriginByKycId(kycFundOrigin);
        } catch (error) {
            // Handle errors appropriately, e.g., set an error state.
            console.error('Error fetching user data:', error);
        }
        };
    
        if (oneKycForEntreprise?.id) {
            getAllFundOriginByKycId(oneKycForEntreprise.id);
        }
    }, [oneKycForEntreprise?.id]);
    // FIN 

    // FONCTION POUR RECUPERER LES DONNEES DES INFORMATIONS FINANCIERES DE L'ENTREPRISE EN FONCTION DE ID DU DE L'ENTREPRISE
    useEffect(() => {
        const getAllFinancialInformationByKycId = async (_kycId) => {
            const token = localStorage.getItem('tokenEnCours')
    
            try {
                const result = await fetch(`${API_URL}/api/kyc/business/find-kyc-business-financial-information-by-kycId?kycId=${_kycId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization:  `Bearer ${token}`,
                    },
                });
    
                if (!result.ok) {
                    throw new Error('Failed to fetch identity data');
                }
    
                const kycFinancialInformation = await result.json();
    
                // Filtrer les données où la colonne "period" est égale à "Mensuelle"
                const monthlyFinancialInformation = kycFinancialInformation.filter(data => data.period === 'Mensuelle');
                setOneMonthlyFinancialInformation(monthlyFinancialInformation);

                // Filtrer les données où la colonne "period" est égale à "Annuelle"
                const annualFinancialInformation = kycFinancialInformation.filter(data => data.period === 'Annuelle');
                setOneAnnualFinancialInformation(annualFinancialInformation);
                
                // Filtrer les données où la colonne "period" est égale à "Trimestrielle"
                const quarterlyFinancialInformation = kycFinancialInformation.filter(data => data.period === 'Trimestrielle');
                setOneQuarterlyFinancialInformation(quarterlyFinancialInformation);
                
            } catch (error) {
                // Handle errors appropriately, e.g., set an error state.
                console.error('Error fetching user data:', error);
            }
        };
    
        if (oneKycForEntreprise?.id) {
            getAllFinancialInformationByKycId(oneKycForEntreprise.id);
        }
    }, [oneKycForEntreprise?.id]);
    // FIN 

    // FONCTION POUR RECUPERER LES DONNEES DES INFORMATIONS SUR LES TRANSACTIONS DE L'ENTREPRISE EN FONCTION DE ID DU DE L'ENTREPRISE
    useEffect(() => {
        const getAllFinancialTransactionByKycId = async (_kycId) => {
            const token = localStorage.getItem('tokenEnCours')
    
            try {
                const result = await fetch(`${API_URL}/api/kyc/business/find-kyc-business-financial-transaction-by-kycId?kycId=${_kycId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization:  `Bearer ${token}`,
                    },
                });
    
                if (!result.ok) {
                    throw new Error('Failed to fetch identity data');
                }
    
                const kycFinancialTransaction = await result.json();
    
                // Filtrer les données où la colonne "period" est égale à "Mensuelle"
                const monthlyFinancialTransaction = kycFinancialTransaction.filter(data => data.period === 'Mensuelle');
                setOneMonthlyFinancialTransaction(monthlyFinancialTransaction);
                console.log("monthlyFinancialTransaction=>",monthlyFinancialTransaction)
                // Filtrer les données où la colonne "period" est égale à "Annuelle"
                const annualFinancialTransaction = kycFinancialTransaction.filter(data => data.period === 'Annuelle');
                setOneAnnualFinancialTransaction(annualFinancialTransaction);
                
                
                
            } catch (error) {
                // Handle errors appropriately, e.g., set an error state.
                console.error('Error fetching user data:', error);
            }
        };
    
        if (oneKycForEntreprise?.id) {
            getAllFinancialTransactionByKycId(oneKycForEntreprise.id);
        }
    }, [oneKycForEntreprise?.id]);
    // FIN 

    // FONCTION POUR RECUPERER LES DONNEES LES DOCUMENTS LEGEAUX DE L'ENTREPRISE EN FONCTION DE ID DU DE L'ENTREPRISE
    useEffect(() => {
        const getAllLegalDocumentByKycId = async (_kycId) => {
        const token = localStorage.getItem('tokenEnCours')

        try {
            const result = await fetch(`${API_URL}/api/kyc/business/find-kyc-business-legal-documents-by-kycId?kycId=${_kycId}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization:  `Bearer ${token}`,
            },
            });
    
            if (!result.ok) {
            throw new Error('Failed to fetch identity data');
            }
    
            const kycLegalDocument = await result.json();
            setOneLegalDocumentByKycId(kycLegalDocument);
        } catch (error) {
            // Handle errors appropriately, e.g., set an error state.
            console.error('Error fetching user data:', error);
        }
        };
    
        if (oneKycForEntreprise?.id) {
            getAllLegalDocumentByKycId(oneKycForEntreprise.id);
        }
    }, [oneKycForEntreprise?.id]);
    // FIN 


    

    // RECUPERER UNE SEULE LIGNE DE PAYS PAR SON
    // if (userById?.nativeCountry) {
    //     const getOneCountry = async () => {
    //       try {
    //         const result = await fetch(`${API_URL}/api/country/find-one/${userById?.nativeCountry}`, {
    //           headers: {
    //             'Content-Type': 'application/json',
    //           },
    //         });
      
    //         if (!result.ok) {
    //           throw new Error('Failed to fetch pays data');
    //         }
      
    //         const data = await result.json();
    //         setOneCountry(data);
    //       } catch (error) {
    //         // Handle errors appropriately, e.g., set an error state.
    //         console.error('Error fetching pays data:', error);
    //       }
    //     };
      
    //     getOneCountry();
    //   }
    //   FIN

  return (
    <>

        <div className='' >
            <div className=' mx-15'>
                <div className=''>
                    <h1 className='text-center'>Validation de Kyc entreprise / commerçant</h1>
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
            <div className='cryptocurrency-search-box'>
                <div className='row'>
                    {/* <div className='col-lg-1 col-md-1'></div> */}
                    <div className='col-lg-12 col-md-12'>
                        <div className='currency-selection'>
                            <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                                <div className='col-lg-12 col-md-12 row justify-content-between'>
                                    {!allKycForEntreprise?.length==0 ?(
                                        <Table
                                            aria-label="Example table with static content"
                                            css={{
                                                height: "auto",
                                                minWidth: "100%",
                                            }}
                                        >
                                        <Table.Header>
                                            {/* <Table.Column><p className="gr-text-8 pt-3 pb-0 mx-3 ">Nom & prenom </p></Table.Column> */}
                                            <Table.Column><p className="gr-text-8 pt-3 pb-0 ">AML</p></Table.Column>
                                            <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Identité</p></Table.Column>
                                            <Table.Column><p className="gr-text-8 pt-3 mx-2 pb-0 ">Représentant</p></Table.Column>
                                            <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Bénéficiaire</p></Table.Column>
                                            <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Control</p></Table.Column>
                                            <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Politique</p></Table.Column>
                                            <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Opérations</p></Table.Column>
                                            <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Fonds</p></Table.Column>
                                            <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Financière</p></Table.Column>
                                            <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Transactions</p></Table.Column>
                                            <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Documents</p></Table.Column>
                                            <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Statut</p></Table.Column>
                                            <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Date</p></Table.Column>
                                            <Table.Column><p className="gr-text-8 pt-3 pb-0 text-center">Actions</p></Table.Column>
                                        </Table.Header>
                                            <Table.Body>
                                                {allKycForEntreprise?.map((data, index) => (
                                                    <Table.Row key={index}> 
                                                  
                                                        <Table.Cell ><p className=" py-0 " onClick={()=>setEtape(1)}><button className='bgColorblue text-white' onClick={()=>setIdKycForEntreprise(data?.id)}>Voir détails</button> {data.validAml==1 ? ( <Icon icon="bx:chevron-down-circle" width={30} color="#208454" /> ) : ( <Icon icon="bx:x-circle" width={30} color="#dc3545" />)} </p></Table.Cell>
                                                        <Table.Cell ><p className=" py-0 " onClick={()=>setEtape(2)}><button className='bgColorblue text-white' onClick={()=>setIdKycForEntreprise(data?.id)}>Voir détails</button> {data.validIdentity==1 ? ( <Icon icon="bx:chevron-down-circle" width={30} color="#208454" /> ) : (  <Icon icon="bx:x-circle" width={30} color="#dc3545" />)} </p></Table.Cell>
                                                        <Table.Cell ><p className=" py-0 " onClick={()=>setEtape(3)}><button className='bgColorblue text-white' onClick={()=>setIdKycForEntreprise(data?.id)}>Voir détails</button> {data.validRepresentative==1 ? ( <Icon icon="bx:chevron-down-circle" width={30} color="#208454" /> ) : (  <Icon icon="bx:x-circle" width={30} color="#dc3545" />)} </p></Table.Cell>
                                                        <Table.Cell ><p className=" py-0 " onClick={()=>setEtape(4)}><button className='bgColorblue text-white' onClick={()=>setIdKycForEntreprise(data?.id)}>Voir détails</button> {data.validBeneficiary==1 ? ( <Icon icon="bx:chevron-down-circle" width={30} color="#208454" /> ) : (  <Icon icon="bx:x-circle" width={30} color="#dc3545" />)} </p></Table.Cell>
                                                        <Table.Cell ><p className=" py-0 " onClick={()=>setEtape(5)}><button className='bgColorblue text-white' onClick={()=>setIdKycForEntreprise(data?.id)}>Voir détails</button> {data.validStructure==1 ? ( <Icon icon="bx:chevron-down-circle" width={30} color="#208454" /> ) : (  <Icon icon="bx:x-circle" width={30} color="#dc3545" />)} </p></Table.Cell>
                                                        <Table.Cell ><p className=" py-0 " onClick={()=>setEtape(6)}><button className='bgColorblue text-white' onClick={()=>setIdKycForEntreprise(data?.id)}>Voir détails</button> {data.validPoliticallyExposed==1 ? ( <Icon icon="bx:chevron-down-circle" width={30} color="#208454" /> ) : (  <Icon icon="bx:x-circle" width={30} color="#dc3545" />)} </p></Table.Cell>
                                                        <Table.Cell ><p className=" py-0 " onClick={()=>setEtape(7)}><button className='bgColorblue text-white' onClick={()=>setIdKycForEntreprise(data?.id)}>Voir détails</button> {data.validFinancialOperation==1 ? ( <Icon icon="bx:chevron-down-circle" width={30} color="#208454" /> ) : (  <Icon icon="bx:x-circle" width={30} color="#dc3545" />)} </p></Table.Cell>
                                                        <Table.Cell ><p className=" py-0 " onClick={()=>setEtape(8)}><button className='bgColorblue text-white' onClick={()=>setIdKycForEntreprise(data?.id)}>Voir détails</button> {data.validFundOrigin==1 ? ( <Icon icon="bx:chevron-down-circle" width={30} color="#208454" /> ) : (  <Icon icon="bx:x-circle" width={30} color="#dc3545" />)} </p></Table.Cell>
                                                        <Table.Cell ><p className=" py-0 " onClick={()=>setEtape(9)}><button className='bgColorblue text-white' onClick={()=>setIdKycForEntreprise(data?.id)}>Voir détails</button> {data.validFinancialInformation==1 ? ( <Icon icon="bx:chevron-down-circle" width={30} color="#208454" /> ) : (  <Icon icon="bx:x-circle" width={30} color="#dc3545" />)} </p></Table.Cell>
                                                        <Table.Cell ><p className=" py-0 " onClick={()=>setEtape(10)}><button className='bgColorblue text-white' onClick={()=>setIdKycForEntreprise(data?.id)}>Voir détails</button> {data.validFinancialTransaction==1 ? ( <Icon icon="bx:chevron-down-circle" width={30} color="#208454" /> ) : (  <Icon icon="bx:x-circle" width={30} color="#dc3545" />)} </p></Table.Cell>
                                                        <Table.Cell ><p className=" py-0 " onClick={()=>setEtape(11)}><button className='bgColorblue text-white' onClick={()=>setIdKycForEntreprise(data?.id)}>Voir détails</button> {data.validLegalDocument==1 ? ( <Icon icon="bx:chevron-down-circle" width={30} color="#208454" /> ) : (  <Icon icon="bx:x-circle" width={30} color="#dc3545" />)} </p></Table.Cell>
                                                        <Table.Cell ><p className=" py-0 ">{data.validAml==1 && data.validIdentity==1 && data.validRepresentative==1 && data.validBeneficiary==1 && data.validStructure==1 && data.validPoliticallyExposed==1 && data.validFinancialOperation==1 && data.validFundOrigin==1 && data.validFinancialInformation==1 && data.validFinancialTransaction==1 && data.validLegalDocument==1? (<b className='colorGreen'>Valider</b>):(<b className='colorRed'>En cours</b>)}</p></Table.Cell>
                                                        <Table.Cell ><p className=" py-0 ">{formatDate(data?.createdAt)}</p></Table.Cell>
                                                         {/* validFinancialTransaction */}
                                                                                                                                                                                                                                            
 
                                                        <Table.Cell>
                                                            <div className="d-flex py-0 ">
                                                                <p className="text-center">
                                                                                            
                                                                    <Button type='button' onClick={()=>setIdKycForEntreprise(data?.id)}  color='success' className=''>
                                                                        <div onClick={handleShowEvaluer}>
                                                                            Evaluer <Icon icon="bx:chevron-down-circle"  width="30"/>
                                                                        </div>          
                                                                    </Button>

                                                                    {/* <Button  color='danger' className='text-center mx-3 bg-red'>
                                                                        Annuler <Icon icon="bx:trash"  width="30"/> 
                                                                    </Button> */}
                                                                </p>
                                                            </div>
                                                        </Table.Cell>
                                                    </Table.Row >
                                                ))}
                                            </Table.Body>
                                            <Table.Pagination
                                                shadow
                                                noMargin
                                                align="center"
                                                rowsPerPage={5}
                                                onPageChange={(page) => console.log({ page })}
                                            />
                                        </Table>
                                    ):(
                                        <div className="text-center my-5">
                                            Aucun Kyc en attente
                                        </div>
                                    )}
                                </div>
                            {/* </form> */}
                            </div>
                            

                            {/* AFFICHAGE DES INFORMATIONS DE KYC */}
                            <div className=''>
                                {/* Les questionnaires */}
                                {etape===1 ? (
                                    <>
                                        {/* Questionnaire Aml 1 */}
                                        <div>
                                            <div className='my-3 btn' onClick={() => toggleAccordion(1)}>
                                                <h3 className='text-center'>Les questionnaires AML 1</h3>
                                            </div>
                                            {isOpen1 &&
                                                <div className="input-group ">
                                                    <div className='mx-5 '>
                                                        <div className=''>
                                                            <b>Les charges récurrentes mensuelles ou annuelles dans le cadre des activités de votre entreprises :</b><br/>
                                                            {oneKycForEntreprise?.spentA? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForEntreprise.spentA }</p>): ("")}
                                                            {oneKycForEntreprise?.spentB? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForEntreprise.spentB }</p>): ("")}
                                                            {oneKycForEntreprise?.spentC? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForEntreprise.spentC }</p>): ("")}
                                                            {oneKycForEntreprise?.spentD? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForEntreprise.spentD }</p>): ("")}
                                                            {oneKycForEntreprise?.spentE? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForEntreprise.spentE }</p>): ("")}
                                                            {oneKycForEntreprise?.spentF? (<p className='mb-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForEntreprise.spentF }</p>): ("")}
                                                            {oneKycForEntreprise?.spentG? (<p className='mb-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForEntreprise.spentG }</p>): ("")}
                                                            {oneKycForEntreprise?.spentH? (<p className='mb-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForEntreprise.spentH }</p>): ("")}
                                                            {oneKycForEntreprise?.spentI? (<p className='mb-1'><Icon icon="bx:check-double" color="#208454" />{oneKycForEntreprise.spentI }</p>): ("")}

                                                            {!oneKycForEntreprise?.spentA && !oneKycForEntreprise?.spentB && !oneKycForEntreprise?.spentC && !oneKycForEntreprise?.spentD && !oneKycForEntreprise?.spentE && !oneKycForEntreprise?.spentF && !oneKycForEntreprise?.spentG && !oneKycForEntreprise?.spentH && !oneKycForEntreprise?.spentI ? (<p className='my-1'><Icon icon="bx:x" className='colorRed' />Aucune charge récurrente</p>): ("")}
                                                        </div>

                                                        <div className='mx-10 '>
                                                            <b>Les opérations financières transfrontalières dans le cadre des activités de votre entreprise concernent  :</b><br/>
                                                            {oneKycForEntreprise?.operationA? (<p className='mt-3'><Icon icon="bx:check-double" color="#208454" />{oneKycForEntreprise.operationA}</p>): ("")}
                                                            {oneKycForEntreprise?.operationB? (<p className='mt-3'><Icon icon="bx:check-double" color="#208454" />{oneKycForEntreprise.operationB}</p>): ("")}
                                                            {oneKycForEntreprise?.operationC? (<p className='mb-3'><Icon icon="bx:check-double" color="#208454" />{oneKycForEntreprise.operationC}</p>): ("")}
                                                            {oneKycForEntreprise?.operationD? (<p className='mb-3'><Icon icon="bx:check-double" color="#208454" />{oneKycForEntreprise.operationD}</p>): ("")}
                                                            {oneKycForEntreprise?.operationE? (<p className='mb-3'><Icon icon="bx:check-double" color="#208454" />{oneKycForEntreprise.operationE}</p>): ("")}
                                                            {oneKycForEntreprise?.operationF? (<p className='mb-3'><Icon icon="bx:check-double" color="#208454" />{oneKycForEntreprise.operationF}</p>): ("")}
                                                            {oneKycForEntreprise?.operationG? (<p className='mb-3'><Icon icon="bx:check-double" color="#208454" />{oneKycForEntreprise.operationG}</p>): ("")}
                                                            

                                                            {!oneKycForEntreprise?.operationA && !oneKycForEntreprise?.operationB && !oneKycForEntreprise?.operationC && !oneKycForEntreprise?.operationD && !oneKycForEntreprise?.operationE && !oneKycForEntreprise?.operationF && !oneKycForEntreprise?.operationG ? (<p className='mt-2'><Icon icon="bx:x" className='colorRed' />Aucune opération financière transfrontalière</p>): ("")}
                                                        </div>

                                                        <div className='mt-3'>
                                                            <b>Avez-vous une boutique en ligne ? :</b><br/>
                                                            {oneKycForEntreprise?.eShop? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForEntreprise.eShop}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}

                                                        </div>

                                                        <div className='mt-3'>
                                                            <b>Seriez intéressés par une solution digitale (paiement/ encaissement) qui vous permettra de recevoir et d'effectuer des paiements instantanés de vos clients et à vos fournisseurs, quelque soit leur pays de résidence, les moyens de paiements que ces derniers utilisent ? :</b><br/>
                                                            {oneKycForEntreprise?.multiplePayment? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForEntreprise.multiplePayment}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}

                                                        </div>
                                                        
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                        {/*Fin Questionnaire Aml 1 */}

                                        {/* Questionnaire Aml 2 */}
                                        <div>
                                            <div className='my-3 btn' onClick={() => toggleAccordion(2)}>
                                                <h3 className='text-center'>Les questionnaires AML 2</h3>
                                            </div>
                                            {isOpen2 &&
                                                <div className="input-group ">
                                                
                                                    <div className='mx-5 '>
                                                        {/* Partie banque */}
                                                        <div className=''>
                                                            <b>Avez-vous un compte bancaire dans une autre institution ? </b><br/>
                                                            {oneKycForEntreprise?.otherBankAccount? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForEntreprise?.otherBankAccount}</p>): (<p className='mt-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </div>
                                                        {oneKycForEntreprise?.otherBankAccount==="Oui"? (
                                                            <>
                                                                <b> Nature du ou des comptes :</b><br/>

                                                                {oneKycForEntreprise?.savingsAccount? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForEntreprise.savingsAccount }</p>): ("")}
                                                                {oneKycForEntreprise?.currentAccount? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForEntreprise.currentAccount }</p>): ("")}
                                                                {oneKycForEntreprise?.titleAccount? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForEntreprise.titleAccount }</p>): ("")}
                                                                {oneKycForEntreprise?.datAccount? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForEntreprise.datAccount }</p>): ("")}
                                                                {oneKycForEntreprise?.foreignCurrencyAccount? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForEntreprise.foreignCurrencyAccount}</p>): ("")}
                                                            
                                                                {!oneKycForEntreprise?.savingsAccount && !oneKycForEntreprise?.currentAccount && !oneKycForEntreprise?.titleAccount && !oneKycForEntreprise?.datAccount && !oneKycForEntreprise?.foreignCurrencyAccount? (<p className='my-1'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>): ("")}
                                                        
                                                                {/* Si l'utilisateur a choisi compte d'épargne */}
                                                                {oneKycForEntreprise?.savingsAccount? (
                                                                    <>
                                                                    
                                                                        <b>Pays de la banque de votre compte d'épargne existant :</b><br/>
                                                                        {oneKycForEntreprise?.otherBankCountrySavings? (
                                                                            <>
                                                                                {allCountry?.map((data) => (
                                                                                    data?.code===oneKycForEntreprise?.otherBankCountrySavings?
                                                                                    <p className='mt-0' key={data?.id}><Icon icon="bx:check-double" color="#208454" />
                                                                                        {data?.libelle}
                                                                                    </p>
                                                                                    :''
                                                                                ))}
                                                                            </>
                                                                        ): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                                    
                                                                        <b>Nom de la banque de votre compte d'épargne :</b><br/>
                                                                        {oneKycForEntreprise?.otherBankNameSavings? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForEntreprise.otherBankNameSavings }</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                                        
                                                                        <b> Références de la banque de votre compte d'épargne :</b><br/>
                                                                        {oneKycForEntreprise?.bankReferencesSavings? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForEntreprise.bankReferencesSavings }</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}

                                                                    </>
                                                                    
                                                                ):("")}
                                                                {/* fin */}


                                                                {/* Si l'utilisateur a choisi compte courant */}
                                                                {oneKycForEntreprise?.currentAccount? (
                                                                    <>
                                                                        <b> Pays de la banque de votre compte courant existant :</b><br/>
                                                                        {oneKycForEntreprise?.otherBankCountryCurrent? (
                                                                            <>
                                                                                {allCountry?.map((data) => (
                                                                                    data?.code===oneKycForEntreprise?.otherBankCountryCurrent?
                                                                                    <p className='mt-0' key={data?.id}><Icon icon="bx:check-double" color="#208454" />
                                                                                        {data?.libelle}
                                                                                    </p>
                                                                                    :''
                                                                                ))}
                                                                            </>
                                                                        ): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                                        
                                                                        <b> Nom de la banque de votre compte courant :</b><br/>
                                                                        {oneKycForEntreprise?.otherBankNameCurrent? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForEntreprise.otherBankNameCurrent }</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                                        
                                                                        <b> Références de la banque de votre compte courant :</b><br/>
                                                                        {oneKycForEntreprise?.bankReferencesCurrent? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForEntreprise.bankReferencesCurrent }</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}

                                                                    </>
                                                                    
                                                                ):("")}
                                                                {/* fin */}

                                                                {/* Si l'utilisateur a choisi compte titre */}
                                                                {oneKycForEntreprise?.titleAccount? (
                                                                    <>
                                                                        
                                                                        <b> Pays de la banque de votre compte titre existant :</b><br/>
                                                                        {oneKycForEntreprise?.otherBankCountryTitle? (
                                                                            <>
                                                                                {allCountry?.map((data) => (
                                                                                    data?.code===oneKycForEntreprise?.otherBankCountryTitle?
                                                                                    <p className='mt-0' key={data?.id}><Icon icon="bx:check-double" color="#208454" />
                                                                                        {data?.libelle}
                                                                                    </p>
                                                                                    :''
                                                                                ))}
                                                                            </>
                                                                        ): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                                        
                                                                        <b> Nom de la banque de votre compte titre :</b><br/>
                                                                        {oneKycForEntreprise?.otherBankNameTitle? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForEntreprise.otherBankNameTitle }</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                                        
                                                                        <b> Références de la banque de votre compte titre :</b><br/>
                                                                        {oneKycForEntreprise?.bankReferencesTitle? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForEntreprise.bankReferencesTitle }</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}

                                                                    </>
                                                                    
                                                                ):("")}
                                                                {/* fin */}

                                                                {/* Si l'utilisateur a choisi compte DAT */}
                                                                {oneKycForEntreprise?.dat? (
                                                                    <>
                                                                        
                                                                        <b> Pays de la banque de votre compte DAT existant :</b><br/>
                                                                        {oneKycForEntreprise?.otherBankCountryDat? (
                                                                            <>
                                                                                {allCountry?.map((data) => (
                                                                                    data?.code===oneKycForEntreprise?.otherBankCountryDat?
                                                                                    <p className='mt-0' key={data?.id}><Icon icon="bx:check-double" color="#208454" />
                                                                                        {data?.libelle}
                                                                                    </p>
                                                                                    :''
                                                                                ))}
                                                                            </>
                                                                        ): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                                        
                                                                        <b> Nom de la banque de votre compte DAT :</b><br/>
                                                                        {oneKycForEntreprise?.otherBankNameDat? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForEntreprise.otherBankNameDat }</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                                        
                                                                        <b> Références de la banque de votre compte DAT :</b><br/>
                                                                        {oneKycForEntreprise?.bankReferencesDat? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForEntreprise.bankReferencesDat }</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}

                                                                    </>
                                                                    
                                                                ):("")}
                                                                {/* fin */}

                                                            </>
                                                        ):("")}
                                                        {/* Fin partie banque */}

                                                        {/* Partie des autres questions */}
                                                        <div className='mt-3'>
                                                            <b>
                                                                Acceptez-vous des paiements en espèces pour des biens ou services d'une valeur supérieure à 15 000 dollars américains (ou équivalent dans une autre devise) provenant d'activités telles que la construction, les services juridiques ou l'hôtellerie ?
                                                            </b><br/>
                                                            {oneKycForEntreprise?.cashPayments? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForEntreprise.cashPayments}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </div>

                                                        <div className='mt-3'>
                                                            <b>
                                                                Effectuez-vous des transactions avec des banques ou des institutions financières situées dans des pays considérés comme des paradis fiscaux ou à haut risque de blanchiment d'argent, en particulier dans des zones offshore telles que les Îles Caïmans, les Îles Vierges Britanniques ou les Seychelles ?
                                                            </b><br/>
                                                            {oneKycForEntreprise?.transactionsInTaxHavens? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForEntreprise.transactionsInTaxHavens}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </div>

                                                        <div className='mt-3'>
                                                            <b>
                                                                Acceptez-vous des paiements ou effectuez-vous des transactions en crypto-monnaies telles que le Bitcoin ou l'Ethereum, notamment dans des activités de jeux en ligne, de paris sportifs ou de commerce en ligne ?
                                                            </b><br/>
                                                            {oneKycForEntreprise?.cryptocurrencyPayments? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForEntreprise.cryptocurrencyPayments}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </div>

                                                        <div className='mt-3'>
                                                            <b>
                                                                Effectuez-vous des transactions d'une valeur supérieure à 5 000 euros (ou équivalent dans une autre devise) vers des pays ou des territoires à faible taux d'imposition, notamment dans des secteurs tels que la finance, la gestion de patrimoine ou l'immobilier ?
                                                            </b><br/>
                                                            {oneKycForEntreprise?.transactionsLowTaxation? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForEntreprise.transactionsLowTaxation}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </div>

                                                        <div className='mt-3'>
                                                            <b>
                                                                Avez-vous des clients ou des fournisseurs qui sont des politiquement exposés (PEP) ou des membres de leur famille proche, notamment dans des secteurs tels que la politique, les institutions publiques ou les organisations internationales ?
                                                            </b><br/>
                                                            {oneKycForEntreprise?.politicallyExposedClients? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForEntreprise.transactionsLowTaxation}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </div>

                                                        <div className='mt-3'>
                                                            <b>
                                                                Acceptez-vous des paiements ou effectuez-vous des transactions en utilisant des sociétés écrans, des trusts ou des sociétés offshore, notamment dans des activités telles que l'évasion fiscale, la planification successorale ou la gestion de patrimoine ?
                                                            </b><br/>
                                                            {oneKycForEntreprise?.offshoreCompanyPayments? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForEntreprise.offshoreCompanyPayments}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </div>

                                                        <div className='mt-3'>
                                                            <b>
                                                                Effectuez-vous des transactions transfrontalieres d'une valeur superieure à 10 000 dollars americains (ou equivalent dans une autre devise) sans verifier la source des fonds ou l'identite des parties, notamment dans des activites telles que le commerce de marchandises, le negoce de matieres premieres ou le transport international ?
                                                            </b><br/>
                                                            {oneKycForEntreprise?.crossBorderTransactions? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForEntreprise.crossBorderTransactions}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </div>


                                                        
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                        {/*Fin Questionnaire Aml 2 */}

                                         {/* Questionnaire Aml 3 */}
                                         <div>
                                            <div className='my-3 btn' onClick={() => toggleAccordion(3)}>
                                                <h3 className='text-center'>Les questionnaires AML 3</h3>
                                            </div>
                                            {isOpen3 &&
                                                <div className="input-group ">
                                                
                                                    <div className='mx-5 '>
                                                        {/* Partie des autres questions */}
                                                        <div className='mt-3'>
                                                            <b>
                                                                Effectuez-vous des transactions en espèces d'un montant supérieur à 10 000 euros (ou équivalent dans une autre devise) provenant d'activités telles que la vente de bijoux, de voitures d'occasion ou de biens immobiliers ?
                                                            </b><br/>
                                                            {oneKycForEntreprise?.transactionAmountHigher? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForEntreprise.transactionAmountHigher}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </div>

                                                        <div className='mt-3'>
                                                            <b>
                                                                Avez-vous des relations commerciales avec des individus ou des entités situés dans des pays soumis à des sanctions internationales, tels que la Russie, le Venezuela ou le Myanmar, notamment dans des secteurs tels que l'énergie, les armes ou les médias ?
                                                            </b><br/>
                                                            {oneKycForEntreprise?.relationsSanctionedCountries? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForEntreprise.relationsSanctionedCountries}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </div>

                                                        <div className='mt-3'>
                                                            <b>
                                                                Acceptez-vous des paiements en liquide provenant de pays considérés comme à haut risque de blanchiment d'argent, notamment dans des secteurs tels que le tourisme, l'immobilier ou la restauration ?
                                                            </b><br/>
                                                            {oneKycForEntreprise?.highRiskCountryPayments? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForEntreprise.highRiskCountryPayments}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </div>

                                                        <div className='mt-3'>
                                                            <b>
                                                                Avez-vous des relations commerciales avec des entités ou des individus impliqués dans des activités illégales connues, telles que le trafic de drogue, la traite des êtres humains ou le financement du terrorisme, notamment dans des secteurs tels que la logistique, la sécurité ou la finance informelle ?
                                                            </b><br/>
                                                            {oneKycForEntreprise?.relationsIllegalActivities? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForEntreprise.relationsIllegalActivities}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </div>

                                                        <div className='mt-3'>
                                                            <b>
                                                            Acceptez-vous des paiements en provenance de pays considérés comme des juridictions non coopératives en matière de lutte contre le blanchiment d'argent, notamment dans des secteurs tels que le commerce de métaux précieux, le jeu en ligne ou la cryptomonnaie ?
                                                            </b><br/>
                                                            {oneKycForEntreprise?.noCooperativeJurisdictionPayments? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForEntreprise.noCooperativeJurisdictionPayments}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </div>

                                                        <div className='mt-3'>
                                                            <b>
                                                                Effectuez-vous des transactions impliquant des comptes bancaires offshores ou des sociétés-écrans dans le but de dissimuler l'identité des parties ou la source des fonds, notamment dans des secteurs tels que la finance internationale, l'investissement ou le commerce international ?
                                                            </b><br/>
                                                            {oneKycForEntreprise?.offshoreBankAccountsTransactions? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForEntreprise.offshoreBankAccountsTransactions}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </div>

                                                        <div className='mt-3'>
                                                            <b>
                                                                Acceptez-vous des paiements ou effectuez-vous des transactions en utilisant des sociétés écrans, des trusts ou des sociétés offshore, notamment dans des activités telles que l'évasion fiscale, la planification successorale ou la gestion de patrimoine ?
                                                            </b><br/>
                                                            {oneKycForEntreprise?.transactionMonitoring? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForEntreprise.thirdPartyCashPayments}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </div>

                                                        <div className='mt-3'>
                                                            <b>
                                                                Effectuez-vous des transactions avec des individus ou des entités soupçonnés de liens avec des activités terroristes ou des groupes terroristes désignés, notamment dans des secteurs tels que la collecte de fonds, la philanthropie ou la fourniture de services financiers ?
                                                            </b><br/>
                                                            {oneKycForEntreprise?.transactionsTerrorismLinks? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForEntreprise.transactionsTerrorismLinks}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                        {/*Fin Questionnaire Aml 3 */}

                                         {/* Questionnaire Aml 4 */}
                                         <div>
                                            <div className='my-3 btn' onClick={() => toggleAccordion(4)}>
                                                <h3 className='text-center'>Les questionnaires AML 4</h3>
                                            </div>
                                            {isOpen4 &&
                                                <div className="input-group ">
                                                
                                                    <div className='mx-5 '>
                                                        {/* Partie des autres questions */}
                                                        <div className='mt-3'>
                                                            <b>
                                                                Votre entreprise a-t-elle des relations commerciales avec des pays connus pour être des paradis fiscaux, tels que les îles Caymans, les îles Vierges Britanniques ou le Luxembourg ?
                                                            </b><br/>
                                                            {oneKycForEntreprise?.taxHavens? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForEntreprise.taxHavens}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </div>

                                                        <div className='mt-3'>
                                                            <b>
                                                                Acceptez-vous des paiements en especes pour des transactions d'une valeur superieure à 15 000 euros provenant de pays comme la Suisse, Monaco ou Singapour ?
                                                            </b><br/>
                                                            {oneKycForEntreprise?.cashAboveFifteenThousand? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForEntreprise.cashAboveFifteenThousand}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </div>

                                                        <div className='mt-3'>
                                                            <b>
                                                                Avez-vous des clients politiquement exposes (PEP) ou des membres de leur famille proche parmi vos actionnaires, dirigeants ou beneficiaires effectifs provenant de pays tels que la Russie, l'Arabie saoudite ou la Chine ?
                                                            </b><br/>
                                                            {oneKycForEntreprise?.politicallyExposed? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForEntreprise.politicallyExposed}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </div>

                                                        <div className='mt-3'>
                                                            <b>
                                                                Votre entreprise accepte-t-elle des paiements en especes pour des transactions d'une valeur superieure à 10 000 dollars americains provenant de pays tels que les Emirats arabes unis, le Qatar ou le Bahrein ?
                                                            </b><br/>
                                                            {oneKycForEntreprise?.cashAboveTenThousand? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForEntreprise.cashAboveTenThousand}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </div>

                                                        <div className='mt-3'>
                                                            <b>
                                                                Avez-vous mis en place des procedures de connaissance de vos clients (KYC) pour verifier l'identite de vos clients avant d'ouvrir un compte de monnaie electronique, conformement aux reglementations AML en vigueur dans votre pays ?
                                                            </b><br/>
                                                            {oneKycForEntreprise?.kycProcedures? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForEntreprise.kycProcedures}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </div>

                                                        <div className='mt-3'>
                                                            <b>
                                                                Disposez-vous de politiques et de procedures pour evaluer le risque de blanchiment d'argent associe à vos clients et à leurs activites, en tenant compte des montants des transactions superieurs à 50 000 euros ou son equivalent dans une autre devise ?
                                                            </b><br/>
                                                            {oneKycForEntreprise?.amlRiskAssessment? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForEntreprise.amlRiskAssessment}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </div>

                                                        <div className='mt-3'>
                                                            <b>
                                                                Avez-vous mis en place des mesures de surveillance pour detecter les transactions suspectes ou inexpliquees effectuees par vos clients, en particulier celles impliquant des pays sous sanctions internationales, tels que la Coree du Nord, l'Iran ou le Venezuela ?
                                                            </b><br/>
                                                            {oneKycForEntreprise?.thirdPartyCashPayments? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForEntreprise.transactionMonitoring}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </div>

                                                        <div className='mt-3'>
                                                            <b>
                                                                Avez-vous des clients qui effectuent frequentement des transactions d'un montant superieur à 100 000 euros provenant de pays consideres comme des paradis fiscaux, tels que les Iles Caymans, les Iles Vierges Britanniques ou les Seychelles ?
                                                            </b><br/>
                                                            {oneKycForEntreprise?.clientsAboveOneHundredThousand? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForEntreprise.clientsAboveOneHundredThousand}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </div>

                                                        <div className='mt-3'>
                                                            <b>
                                                                Avez-vous etabli des seuils de declaration pour les transactions effectuees par vos clients, notamment celles depassant 20 000 euros en especes ou 10 000 euros en crypto-monnaies ?
                                                            </b><br/>
                                                            {oneKycForEntreprise?.transactionDeclaration? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForEntreprise.transactionDeclaration}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </div>

                                                        <div className='mt-3'>
                                                            <b>
                                                                Votre entreprise a-t-elle des relations commerciales avec des entites impliquees dans des activites illegales connues, telles que le trafic de drogue, la traite des etres humains ou le financement du terrorisme, en provenance de pays tels que la Colombie, le Nigeria ou l'Afghanistan ?
                                                            </b><br/>
                                                            {oneKycForEntreprise?.illegalActivities? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForEntreprise.illegalActivities}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                        {/*Fin Questionnaire Aml 4 */}

                                    </>

                                ): ("")}

                                {/* Identité */}
                                {etape===2 ? (
                                    <>
                                        <div className='my-5'>
                                            <h3 className='text-center'>Identité</h3>
                                        </div>
                                        <div className='mx-5 '>
                                            <div className=''>
                                                <b>Domaine d’activité :</b><br/>
                                                {identityByKycId?.international? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{identityByKycId.international }</p>): ("")}
                                                {identityByKycId?.national? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{identityByKycId.national }</p>): ("")}
                                                {identityByKycId?.local? (<p className='mt-0'><Icon icon="bx:check-double" color="#208454" />{identityByKycId.local }</p>): ("")}
                                            
                                                {!identityByKycId?.international && !identityByKycId?.national && !identityByKycId?.local ? (<p className='my-1'><Icon icon="bx:x" className='colorRed' />Aucune domaine d’activité</p>): ("")}
                                            </div>

                                            <div className='mt-3'>
                                                <b>
                                                    Nature de la Personne morale
                                                </b><br/>
                                                {identityByKycId?.naturePerson? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{identityByKycId.naturePerson}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                            </div>

                                            <div className='mt-3'>
                                                <b>
                                                    Ancienneté professionnelle
                                                </b><br/>
                                                {identityByKycId?.seniority? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{identityByKycId.seniority}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                            </div>

                                            <div className='mt-3'>
                                                <b>
                                                    Dénomination sociale 
                                                </b><br/>
                                                {userById?.entreprise? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{userById.entreprise}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                            </div>

                                            <div className='mt-3'>
                                                <b>
                                                    Numéro RCCM
                                                </b><br/>
                                                {identityByKycId?.rccmNumber? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{identityByKycId.rccmNumber}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                            </div>

                                            <div className='mt-3'>
                                                <b>
                                                    Objet social
                                                </b><br/>
                                                {identityByKycId?.socialObject? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{identityByKycId.socialObject}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                            </div>

                                            <div className='mt-3'>
                                                <b>
                                                    Numéro d’identification
                                                </b><br/>
                                                {identityByKycId?.numberIdentification? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{identityByKycId.numberIdentification}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                            </div>

                                            <div className='mt-3'>
                                                <b>
                                                    Ville
                                                </b><br/>
                                                {userById?.city? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{userById.city}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                            </div>

                                            <div className='mt-3'>
                                                <b>
                                                    Adresse postale
                                                </b><br/>
                                                {userById?.mailbox? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{userById.mailbox}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                            </div>

                                            <div className='mt-3'>
                                                <b>
                                                    Adresse siège social
                                                </b><br/>
                                                {identityByKycId?.registeredAddress? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{identityByKycId.registeredAddress}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                            </div>

                                            <div className='mt-3'>
                                                <b>
                                                    Téléphone Fixe
                                                </b><br/>
                                                {userById?.phoneFixe? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{userById.phoneFixe}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                            </div>

                                            <div className='mt-3'>
                                                <b>
                                                    Téléphone mobile
                                                </b><br/>
                                                {userById?.mobile? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{userById.mobile}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                            </div>

                                            <div className='mt-3'>
                                                <b>
                                                    Fax
                                                </b><br/>
                                                {identityByKycId?.fax? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{identityByKycId.fax}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                            </div>

                                            <div className='mt-3'>
                                                <b>
                                                    Date de constitution
                                                </b><br/>
                                                {identityByKycId?.dateConstitution? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{formatDate(identityByKycId.dateConstitution)}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                            </div>

                                            <div className='mt-3'>
                                                <b>
                                                    Date d'enregistrement
                                                </b><br/>
                                                {identityByKycId?.registrationDate? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{formatDate(identityByKycId.registrationDate)}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                            </div>
                                        </div>
                                    </>
                                ): ("")}


                                {/* Representants legeaux*/}
                                {etape===3 ? (
                                    <>
                                        <div className='my-5'>
                                            <h3 className='text-center'>Représentants légeaux</h3>
                                        </div>
                                        <div className='my-5 mx-5'>
                                        
                                        <div className='mt-3'>
                                            <b>
                                                Nombre de représentant légal
                                            </b><br/>
                                            {oneKycForEntreprise?.numberRepresentatives? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForEntreprise.numberRepresentatives}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                        </div>

                                        {/* On affiche ce qui suit si nombre de représentant est supérieur à zéro */}
                                        {oneKycForEntreprise?.numberRepresentatives>0 ? (
                                            <>
                                                {allRepresentativeByKycId?.map((data, index) => (
                                                    <div className='' key={index}>
                                                        <h5 className='colorRed mt-5'>Les informations du représentant légal {index + 1}</h5>
                                                        <div className='form-group my-3 col-lg-6 col-md-6'>
                                                            <form>
                                                                <label className="mx-2  mb-2" htmlFor='validSignature'>
                                                                    Les informations de ce représentant légal sont-elles correctes?
                                                                </label>
                                                                <div className="input-group flex-nowrap">
                                                                    <select 
                                                                        className="form-control gr-text-11 border mt-3"
                                                                        id="validSignature"
                                                                        required
                                                                        // defaultValue={validSignature} 
                                                                        // onChange={(event)=>setValidSignature(event.target.value)}
                                                                    >
                                                                        <option defaultValue="">Choisissez une option</option>
                                                                        <optgroup className='single-cryptocurrency-box'>
                                                                            <option  value="true">Oui</option>
                                                                            <option  value="false">Non</option>
                                                                        </optgroup>
                                                                    </select>
                                                                    <span className="input-group-text gr-text-11  mt-3" id="addon-wrapping">
                                                                        <button  disabled={isLoggingIn}>Envoyer</button>
                                                                    </span>
                                                                </div>
                                                                
                                                            </form>
                                                        </div>
                                                        <div className='mt-3'>
                                                            <b>
                                                                Nom du représentation légal
                                                            </b><br/>
                                                            {data?.lastName? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{data.lastName}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </div>

                                                        <div className='mt-3'>
                                                            <b>
                                                                Prénom du représentation légal
                                                            </b><br/>
                                                            {data?.firstName? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{data.firstName}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </div>
                                                        <div className='mt-3'>
                                                            <b>
                                                                Nationalité du représentant
                                                            </b><br/>
                                                            {data?.nationality? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{data.nationality}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </div>

                                                        <div className='mt-3'>
                                                            <b>
                                                                Email
                                                            </b><br/>
                                                            {data?.email? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{data.email}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </div>

                                                        <div className='mt-3'>
                                                            <b>
                                                                Date de naissance
                                                            </b><br/>
                                                            {data?.dateBirth? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{formatDate(data.dateBirth)}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </div>

                                                        <div className='mt-3'>
                                                            <b>
                                                                Fonction
                                                            </b><br/>
                                                            {data?.functions? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{data.functions}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </div>

                                                        <div className='mt-3'>
                                                            <b>
                                                                Pays de résidence
                                                            </b><br/>
                                                            {data?.residenceCountry? (
                                                                <>
                                                                    {allCountry?.map((dataCountry) => (
                                                                        <p className='my-0' key={dataCountry?.id}>
                                                                            {data.residenceCountry==dataCountry?.code? (
                                                                                <>
                                                                                    <Icon icon="bx:check-double" color="#208454" />
                                                                                    {dataCountry.libelle}
                                                                                </>
                                                                            ):("")}
                                                                        </p>
                                                                    ))}
                                                                </>
                                                            ): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </div>

                                                        <div className='mt-3'>
                                                            <b>
                                                                Téléphone mobile
                                                            </b><br/>
                                                            {data?.residenceCountry && data?.mobile? (
                                                                <>
                                                                    {allCountry?.map((dataCountry) => (
                                                                        <p className='my-0' key={dataCountry?.id}>
                                                                            {data.residenceCountry==dataCountry?.code? (
                                                                                <>
                                                                                    <Icon icon="bx:check-double" color="#208454" />
                                                                                    {dataCountry.indicator} {data.mobile}
                                                                                </>
                                                                            ):("")}
                                                                        </p>
                                                                    ))}
                                                                </>
                                                            ): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </div>
                                                        
                                                        
                                                        <div className='mt-3'>
                                                            <b>
                                                                Type de document d’identité
                                                            </b><br/>
                                                            {data?.typeDocIdentity? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{data.typeDocIdentity}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </div>

                                                        <div className='mt-3'>
                                                            <b>
                                                                Numéro du document d’identité
                                                            </b><br/>
                                                            {data?.identityDocNumber? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{data.identityDocNumber}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </div>

                                                        <div className='mt-3'>
                                                            <b>
                                                                Date d'expiration du document d’identité
                                                            </b><br/>
                                                            {data?.expirationDate? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{formatDate(data.expirationDate)}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </div>

                                                        <div className='mt-3'>
                                                            <b>
                                                                Pays émetteur du document d'identité
                                                            </b><br/>
                                                            {data?.issuingCountry? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{data.issuingCountry}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </div>
                                                        <div className='mt-3'>
                                                            <b>
                                                                Type de document de domicile
                                                            </b><br/>
                                                            {data?.typeDocumentResidence? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{data.typeDocumentResidence}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </div>

                                                        {/* Les fichiers && photos*/}
                                                        {/* Documents de justificatif d'identité */}
                                                        <div className=" row col-lg-12 col-md-12 my-5 mx-5 justify-content-between">
                                                            <div className='col-lg-6 col-md-6 text-center'>
                                                                <h4 className='text-center'>Recto du justificatif d'identité du représentant </h4>
                                                                {/* Si le document est prise en photo */}
                                                                {data?.frontIdentityPhoto? 
                                                                    <img src={data?.frontIdentityPhoto} className="" width={'400'} height={'400'} alt="Recto"/> :(
                                                                        // Sinon
                                                                        <>
                                                                            {/* Utilisation de la fonction isPdfLink pour vérifier si un lien est pour un fichier PDF */}
                                                                            {isPdfLink(`${API_URL}/${data?.frontIdentityFile}`) ? (
                                                                                <>
                                                                                    <div className="hero-btn  text-center ">
                                                                                    <a
                                                                                        className="nav-link btn btn-blue nav-link btn btn-outline-green"
                                                                                        role="button"
                                                                                        data-toggle="dropdown"
                                                                                        aria-haspopup="true"
                                                                                        aria-expanded="false"
                                                                                        href={`${API_URL}/${data?.frontIdentityFile}`} 
                                                                                        // download
                                                                                        // onClick={handleShow}
                                                                                        target="_blank"
                                                                                    >
                                                                                    <p className="gr-text-8 bgColorblue text-white mb-0">
                                                                                        <Icon icon="bx:show-alt" width="50" />
                                                                                        Veuillez cliquer ici pour voir le fichier
                                                                                    </p>
                                                                                    </a>
                                                                                    </div>
                                                                                </>
                                                                            ) : (
                                                                                <>
                                                                                    {data?.frontIdentityFile? <img src={`${API_URL}/${data?.frontIdentityFile}`} className="" width={'400'} height={'400'} alt="Recto"/> : "Pas de recto de justificatif d'identité"}
                                                                                </>
                                                                            )}
                                                                        </>
                                                                    )
                                                                } 
                                                            </div>

                                                            <div className='col-lg-6 col-md-6 text-center'>
                                                                <h4 className='text-center'>Verso du justificatif d'identité du représentant</h4>
                                                                {/* Si le document est prise en photo */}
                                                                {data?.backIdentityPhoto? 
                                                                    <img src={data?.backIdentityPhoto} className="" width={'400'} height={'400'} alt="Recto"/> :(
                                                                        // Sinon
                                                                        <>
                                                                            {/* Utilisation de la fonction isPdfLink pour vérifier si un lien est pour un fichier PDF */}
                                                                            {isPdfLink(`${API_URL}/${data?.backIdentityFile}`) ? (
                                                                                <>
                                                                                    <div className="hero-btn  text-center ">
                                                                                    <a
                                                                                        className="nav-link btn btn-blue nav-link btn btn-outline-green"
                                                                                        role="button"
                                                                                        data-toggle="dropdown"
                                                                                        aria-haspopup="true"
                                                                                        aria-expanded="false"
                                                                                        href={`${API_URL}/${data?.backIdentityFile}`}
                                                                                        target="_blank"
                                                                                    >
                                                                                    <p className="gr-text-8 bgColorblue text-white mb-0">
                                                                                        <Icon icon="bx:show-alt" width="50" />
                                                                                        Veuillez cliquer ici pour voir le fichier
                                                                                    </p>
                                                                                    </a>
                                                                                    </div>
                                                                                </>
                                                                            ) : (
                                                                                <>
                                                                                    {data?.backIdentityFile? <img src={`${API_URL}/${data?.backIdentityFile}`} width={'400'} height={'400'} alt="Verso"/> : "Pas de verso de justificatif d'identité"}
                                                                                </>
                                                                            )}
                                                                        </>
                                                                    )
                                                                }
                                                            </div>
                                                        </div>
                                                        {/*Fin Documents de justificatif d'identité */}

                                                        {/* Documents de justificatif de domicile */}
                                                        <div className=" row col-lg-12 col-md-12 my-5 mx-5 justify-content-between">
                                                            <div className='col-lg-6 col-md-6 text-center'>
                                                                <h4 className='text-center'>Recto du justificatif de domicile du représentant </h4>
                                                                {/* Si le document est prise en photo */}
                                                                {data?.frontDomicilePhoto? 
                                                                    <img src={data?.frontDomicilePhoto} className="" width={'400'} height={'400'} alt="Recto"/> :(
                                                                        // Sinon
                                                                        <>
                                                                            {/* Utilisation de la fonction isPdfLink pour vérifier si un lien est pour un fichier PDF */}
                                                                            {isPdfLink(`${API_URL}/${data?.frontDomicileFile}`) ? (
                                                                                <>
                                                                                    <div className="hero-btn  text-center ">
                                                                                    <a
                                                                                        className="nav-link btn btn-blue nav-link btn btn-outline-green"
                                                                                        role="button"
                                                                                        data-toggle="dropdown"
                                                                                        aria-haspopup="true"
                                                                                        aria-expanded="false"
                                                                                        href={`${API_URL}/${data?.frontDomicileFile}`} 
                                                                                        // download
                                                                                        // onClick={handleShow}
                                                                                        target="_blank"
                                                                                    >
                                                                                    <p className="gr-text-8 bgColorblue text-white mb-0">
                                                                                        <Icon icon="bx:show-alt" width="50" />
                                                                                        Veuillez cliquer ici pour voir le fichier
                                                                                    </p>
                                                                                    </a>
                                                                                    </div>
                                                                                </>
                                                                            ) : (
                                                                                <>
                                                                                    {data?.frontDomicileFile? <img src={`${API_URL}/${data?.frontDomicileFile}`} className="" width={'400'} height={'400'} alt="Recto"/> : "Pas de recto de justificatif de domicile"}
                                                                                </>
                                                                            )}
                                                                        </>
                                                                    )
                                                                } 
                                                            </div>

                                                            <div className='col-lg-6 col-md-6 text-center'>
                                                                <h4 className='text-center'>Verso du justificatif de domicile du représentant</h4>
                                                                {/* Si le document est prise en photo */}
                                                                {data?.backDomicilePhoto? 
                                                                    <img src={data?.backDomicilePhoto} className="" width={'400'} height={'400'} alt="Recto"/> :(
                                                                        // Sinon
                                                                        <>
                                                                            {/* Utilisation de la fonction isPdfLink pour vérifier si un lien est pour un fichier PDF */}
                                                                            {isPdfLink(`${API_URL}/${data?.backDomicileFile}`) ? (
                                                                                <>
                                                                                    <div className="hero-btn  text-center ">
                                                                                    <a
                                                                                        className="nav-link btn btn-blue nav-link btn btn-outline-green"
                                                                                        role="button"
                                                                                        data-toggle="dropdown"
                                                                                        aria-haspopup="true"
                                                                                        aria-expanded="false"
                                                                                        href={`${API_URL}/${data?.backDomicileFile}`}
                                                                                        target="_blank"
                                                                                    >
                                                                                    <p className="gr-text-8 bgColorblue text-white mb-0">
                                                                                        <Icon icon="bx:show-alt" width="50" />
                                                                                        Veuillez cliquer ici pour voir le fichier
                                                                                    </p>
                                                                                    </a>
                                                                                    </div>
                                                                                </>
                                                                            ) : (
                                                                                <>
                                                                                    {data?.backDomicileFile? <img src={`${API_URL}/${data?.backDomicileFile}`} width={'400'} height={'400'} alt="Verso"/> : "Pas de verso de justificatif de domicile"}
                                                                                </>
                                                                            )}
                                                                        </>
                                                                    )
                                                                }
                                                            </div>
                                                        </div>
                                                        {/*Fin Documents de justificatif de domicile */}


                                                        {/* Signature du représentant */}
                                                        <div className='my-5'>
                                                            <h3 className='text-center'>Signature du représentant légal</h3>
                                                        </div>
                                                        <div className="input-group flex-nowrap mx-5">
                                                            <div className='col-lg-12 col-md-12 row justify-content-between'>
                                                                <div className='input-group-alternative my-3 text-center'>
                                                                    {data?.signature? <img src={data?.signature} alt="Selfie" /> : "Aucune signature"}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {/* fin Signature du représentant */}
                                                    </div>
                                                ))}
                                            </>
                                        ):("")}
                                        </div>
                                    </>
                                ): ("")}

                                {/* Bénéficiaire effectif*/}
                                {etape===4 ? (
                                    <>
                                        <div className='my-5'>
                                            <h3 className='text-center'>Bénéficiaire effectif</h3>
                                        </div>
                                        <div className='my-5 mx-5'>
                                        
                                        <div className='mt-3'>
                                            <b>
                                                Nombre de bénéficiaire effectif
                                            </b><br/>
                                            {oneKycForEntreprise?.numberBeneficial? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForEntreprise.numberRepresentatives}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                        </div>

                                        {/* On affiche ce qui suit si nombre du bénéficiaire effectif est supérieur à zéro */}
                                        {oneKycForEntreprise?.numberBeneficial>0 ? (
                                            <>
                                                {allBeneficiaryByKycId?.map((data, index) => (
                                                    <div className='' key={index}>
                                                        <h5 className='colorRed mt-5'>Les informations du bénéficiaire effectif {index + 1}</h5>
                                                        <div className='form-group my-3 col-lg-6 col-md-6'>
                                                            <form>
                                                                <label className="mx-2  mb-2" htmlFor='validSignature'>
                                                                    Les informations de ce bénéficiaire effectif sont-elles correctes?
                                                                </label>
                                                                <div className="input-group flex-nowrap">
                                                                    <select 
                                                                        className="form-control gr-text-11 border mt-3"
                                                                        id="validSignature"
                                                                        required
                                                                        // defaultValue={validSignature} 
                                                                        // onChange={(event)=>setValidSignature(event.target.value)}
                                                                    >
                                                                        <option defaultValue="">Choisissez une option</option>
                                                                        <optgroup className='single-cryptocurrency-box'>
                                                                            <option  value="true">Oui</option>
                                                                            <option  value="false">Non</option>
                                                                        </optgroup>
                                                                    </select>
                                                                    <span className="input-group-text gr-text-11  mt-3" id="addon-wrapping">
                                                                        <button  disabled={isLoggingIn}>Envoyer</button>
                                                                    </span>
                                                                </div>
                                                                
                                                            </form>
                                                        </div>

                                                        <div className='mt-3'>
                                                            <b>
                                                                Type de bénéficiaire
                                                            </b><br/>
                                                            {data?.typeBeneficiary? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{data.typeBeneficiary}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </div>

                                                        {/* Vérifie si le type du bénéficiaire est une Personne physique */}
                                                        {data?.typeBeneficiary==="Personne physique" ? (
                                                            <>
                                                                <div className='mt-3'>
                                                                    <b>
                                                                        Nom du bénéficiaire
                                                                    </b><br/>
                                                                    {data?.lastName? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{data.lastName}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                                </div>

                                                                <div className='mt-3'>
                                                                    <b>
                                                                        Prénom du bénéficiaire
                                                                    </b><br/>
                                                                    {data?.firstName? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{data.firstName}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                                </div>
                                                                <div className='mt-3'>
                                                                    <b>
                                                                        Nationalité du bénéficiaire
                                                                    </b><br/>
                                                                    {data?.nationality? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{data.nationality}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                                </div>

                                                                <div className='mt-3'>
                                                                    <b>
                                                                        Email
                                                                    </b><br/>
                                                                    {data?.email? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{data.email}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                                </div>

                                                                <div className='mt-3'>
                                                                    <b>
                                                                        Date de naissance
                                                                    </b><br/>
                                                                    {data?.dateBirth? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{formatDate(data.dateBirth)}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                                </div>

                                                                <div className='mt-3'>
                                                                    <b>
                                                                        Pays de résidence
                                                                    </b><br/>
                                                                    {data?.residenceCountry? (
                                                                        <>
                                                                            {allCountry?.map((dataCountry) => (
                                                                                <p className='my-0' key={dataCountry?.id}>
                                                                                    {data.residenceCountry==dataCountry?.code? (
                                                                                        <>
                                                                                            <Icon icon="bx:check-double" color="#208454" />
                                                                                            {dataCountry.libelle}
                                                                                        </>
                                                                                    ):("")}
                                                                                </p>
                                                                            ))}
                                                                        </>
                                                                    ): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                                </div>

                                                                <div className='mt-3'>
                                                                    <b>
                                                                        Téléphone mobile
                                                                    </b><br/>
                                                                    {data?.residenceCountry && data?.mobile? (
                                                                        <>
                                                                            {allCountry?.map((dataCountry) => (
                                                                                <p className='my-0' key={dataCountry?.id}>
                                                                                    {data.residenceCountry==dataCountry?.code? (
                                                                                        <>
                                                                                            <Icon icon="bx:check-double" color="#208454" />
                                                                                            {dataCountry.indicator} {data.mobile}
                                                                                        </>
                                                                                    ):("")}
                                                                                </p>
                                                                            ))}
                                                                        </>
                                                                    ): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                                </div>
                                                                <div className='mt-3'>
                                                                    <b>
                                                                        % Participation/ Contrôle (de 0-100)
                                                                    </b><br/>
                                                                    {data?.percentControl? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{data.percentControl} %</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                                </div>
                                                                <div className='mt-3'>
                                                                    <b>
                                                                        Type de document d’identité
                                                                    </b><br/>
                                                                    {data?.typeDocIdentity? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{data.typeDocIdentity}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                                </div>

                                                                <div className='mt-3'>
                                                                    <b>
                                                                        Numéro du document d’identité
                                                                    </b><br/>
                                                                    {data?.identityDocNumber? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{data.identityDocNumber}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                                </div>

                                                                <div className='mt-3'>
                                                                    <b>
                                                                        Date d'expiration du document d’identité
                                                                    </b><br/>
                                                                    {data?.expirationDate? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{formatDate(data.expirationDate)}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                                </div>

                                                                <div className='mt-3'>
                                                                    <b>
                                                                        Pays émetteur du document d'identité
                                                                    </b><br/>
                                                                    {data?.issuingCountry? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{data.issuingCountry}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                                </div>
                                                               

                                                                {/* Les fichiers && photos*/}
                                                                {/* Documents de justificatif d'identité */}
                                                                <div className=" row col-lg-12 col-md-12 my-5 mx-5 justify-content-between">
                                                                    <div className='col-lg-6 col-md-6 text-center'>
                                                                        <h4 className='text-center'>Recto du justificatif d'identité du représentant </h4>
                                                                        {/* Si le document est prise en photo */}
                                                                        {data?.frontIdentityPhoto? 
                                                                            <img src={data?.frontIdentityPhoto} className="" width={'400'} height={'400'} alt="Recto"/> :(
                                                                                // Sinon
                                                                                <>
                                                                                    {/* Utilisation de la fonction isPdfLink pour vérifier si un lien est pour un fichier PDF */}
                                                                                    {isPdfLink(`${API_URL}/${data?.frontIdentityFile}`) ? (
                                                                                        <>
                                                                                            <div className="hero-btn  text-center ">
                                                                                            <a
                                                                                                className="nav-link btn btn-blue nav-link btn btn-outline-green"
                                                                                                role="button"
                                                                                                data-toggle="dropdown"
                                                                                                aria-haspopup="true"
                                                                                                aria-expanded="false"
                                                                                                href={`${API_URL}/${data?.frontIdentityFile}`} 
                                                                                                // download
                                                                                                // onClick={handleShow}
                                                                                                target="_blank"
                                                                                            >
                                                                                            <p className="gr-text-8 bgColorblue text-white mb-0">
                                                                                                <Icon icon="bx:show-alt" width="50" />
                                                                                                Veuillez cliquer ici pour voir le fichier
                                                                                            </p>
                                                                                            </a>
                                                                                            </div>
                                                                                        </>
                                                                                    ) : (
                                                                                        <>
                                                                                            {data?.frontIdentityFile? <img src={`${API_URL}/${data?.frontIdentityFile}`} className="" width={'400'} height={'400'} alt="Recto"/> : "Pas de recto de justificatif d'identité"}
                                                                                        </>
                                                                                    )}
                                                                                </>
                                                                            )
                                                                        } 
                                                                    </div>

                                                                    <div className='col-lg-6 col-md-6 text-center'>
                                                                        <h4 className='text-center'>Verso du justificatif d'identité du représentant</h4>
                                                                        {/* Si le document est prise en photo */}
                                                                        {data?.backIdentityPhoto? 
                                                                            <img src={data?.backIdentityPhoto} className="" width={'400'} height={'400'} alt="Recto"/> :(
                                                                                // Sinon
                                                                                <>
                                                                                    {/* Utilisation de la fonction isPdfLink pour vérifier si un lien est pour un fichier PDF */}
                                                                                    {isPdfLink(`${API_URL}/${data?.backIdentityFile}`) ? (
                                                                                        <>
                                                                                            <div className="hero-btn  text-center ">
                                                                                            <a
                                                                                                className="nav-link btn btn-blue nav-link btn btn-outline-green"
                                                                                                role="button"
                                                                                                data-toggle="dropdown"
                                                                                                aria-haspopup="true"
                                                                                                aria-expanded="false"
                                                                                                href={`${API_URL}/${data?.backIdentityFile}`}
                                                                                                target="_blank"
                                                                                            >
                                                                                            <p className="gr-text-8 bgColorblue text-white mb-0">
                                                                                                <Icon icon="bx:show-alt" width="50" />
                                                                                                Veuillez cliquer ici pour voir le fichier
                                                                                            </p>
                                                                                            </a>
                                                                                            </div>
                                                                                        </>
                                                                                    ) : (
                                                                                        <>
                                                                                            {data?.backIdentityFile? <img src={`${API_URL}/${data?.backIdentityFile}`} width={'400'} height={'400'} alt="Verso"/> : "Pas de verso de justificatif d'identité"}
                                                                                        </>
                                                                                    )}
                                                                                </>
                                                                            )
                                                                        }
                                                                    </div>
                                                                </div>
                                                                {/*Fin Documents de justificatif d'identité */}

                                                            </>
                                                        ):("")}
                                                        {/* Fin Vérifie si le type du bénéficiaire est une Personne physique */}

                                                        {/* Vérifie si le type du bénéficiaire est une Personne morale */}
                                                        {data?.typeBeneficiary==="Personne morale" ? (
                                                            <>
                                                                <div className='mt-3'>
                                                                    <b>
                                                                        Raison sociale
                                                                    </b><br/>
                                                                    {data?.socialReason? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{data.socialReason}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                                </div>

                                                                <div className='mt-3'>
                                                                    <b>
                                                                        Numéro RCCM
                                                                    </b><br/>
                                                                    {data?.numberRccm? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{data.numberRccm}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                                </div>

                                                                <div className='mt-3'>
                                                                    <b>
                                                                        Email
                                                                    </b><br/>
                                                                    {data?.email? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{data.email}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                                </div>

                                                                <div className='mt-3'>
                                                                    <b>
                                                                        Pays d'immatriculation
                                                                    </b><br/>
                                                                    {data?.countryRegistration? (
                                                                        <>
                                                                            {allCountry?.map((dataCountry) => (
                                                                                <p className='my-0' key={dataCountry?.id}>
                                                                                    {data.countryRegistration==dataCountry?.code? (
                                                                                        <>
                                                                                            <Icon icon="bx:check-double" color="#208454" />
                                                                                            {dataCountry.libelle}
                                                                                        </>
                                                                                    ):("")}
                                                                                </p>
                                                                            ))}
                                                                        </>
                                                                    ): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                                </div>

                                                                <div className='mt-3'>
                                                                    <b>
                                                                        Téléphone fixe
                                                                    </b><br/>
                                                                    {data?.countryRegistration && data?.phoneFixe? (
                                                                        <>
                                                                            {allCountry?.map((dataCountry) => (
                                                                                <p className='my-0' key={dataCountry?.id}>
                                                                                    {data.countryRegistration==dataCountry?.code? (
                                                                                        <>
                                                                                            <Icon icon="bx:check-double" color="#208454" />
                                                                                            {dataCountry.indicator} {data.phoneFixe}
                                                                                        </>
                                                                                    ):("")}
                                                                                </p>
                                                                            ))}
                                                                        </>
                                                                    ): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                                </div>
                                                                <div className='mt-3'>
                                                                    <b>
                                                                        % Participation/ Contrôle (de 0-100)
                                                                    </b><br/>
                                                                    {data?.percentControl? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{data.percentControl} %</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                                </div>

                                                                <div className='mt-3'>
                                                                    <b>
                                                                        Date de création
                                                                    </b><br/>
                                                                    {data?.startDate? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{formatDate(data.startDate)}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                                </div>
                                                            </>
                                                        ):("")}
                                                        {/* Fin Vérifie si le type du bénéficiaire est une Personne morale */}

                                                    </div>
                                                ))}
                                            </>
                                        ):("")}
                                        </div>
                                    </>
                                ): ("")}


                                {/* Structure de propriété ou de contrôle*/}
                                {etape===5 ? (
                                    <>
                                        <div className='my-5'>
                                            <h3 className='text-center'>Structure de propriété ou de contrôle</h3>
                                        </div>
                                        <div className='my-5 mx-5'>
                                        
                                        <div className='mt-3'>
                                            <b>
                                                Nombre d'associé
                                            </b><br/>
                                            {oneKycForEntreprise?.numberAssociates? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForEntreprise.numberAssociates}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                        </div>
                                        {oneKycForEntreprise?.numberAssociates==="Plus de 10" ? (
                                            <div className='mt-3'>
                                                <b>
                                                    Nombre d'associés qui ont 5% du capital
                                                </b><br/>
                                                {oneKycForEntreprise?.fivePercent? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForEntreprise.fivePercent}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                            </div>
                                        ):("")}
                                        {/* On affiche ce qui suit si nombre du bénéficiaire effectif est supérieur à zéro */}
                                        {oneKycForEntreprise?.numberAssociates>0 || oneKycForEntreprise?.numberAssociates==="Plus de 10"? (
                                            <>
                                                {allAssociatesByKycId?.map((data, index) => (
                                                    <div className='' key={index}>
                                                        <h5 className='colorRed mt-5'>Les informations de l'associé {index + 1}</h5>
                                                        <div className='form-group my-3 col-lg-6 col-md-6'>
                                                            <form>
                                                                <label className="mx-2  mb-2" htmlFor='validSignature'>
                                                                    Les informations de cet associé sont-elles correctes?
                                                                </label>
                                                                <div className="input-group flex-nowrap">
                                                                    <select 
                                                                        className="form-control gr-text-11 border mt-3"
                                                                        id="validSignature"
                                                                        required
                                                                        // defaultValue={validSignature} 
                                                                        // onChange={(event)=>setValidSignature(event.target.value)}
                                                                    >
                                                                        <option defaultValue="">Choisissez une option</option>
                                                                        <optgroup className='single-cryptocurrency-box'>
                                                                            <option  value="true">Oui</option>
                                                                            <option  value="false">Non</option>
                                                                        </optgroup>
                                                                    </select>
                                                                    <span className="input-group-text gr-text-11  mt-3" id="addon-wrapping">
                                                                        <button  disabled={isLoggingIn}>Envoyer</button>
                                                                    </span>
                                                                </div>
                                                                
                                                            </form>
                                                        </div>

                                                        <div className='mt-3'>
                                                            <b>
                                                                Type d'associé
                                                            </b><br/>
                                                            {data?.typePartner? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{data.typePartner}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </div>

                                                        {/* Vérifie si le type du bénéficiaire est une Personne physique */}
                                                        {data?.typePartner==="Personne physique" ? (
                                                            <>
                                                                <div className='mt-3'>
                                                                    <b>
                                                                        Nom de l'associé
                                                                    </b><br/>
                                                                    {data?.lastName? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{data.lastName}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                                </div>

                                                                <div className='mt-3'>
                                                                    <b>
                                                                        Prénom de l'associé
                                                                    </b><br/>
                                                                    {data?.firstName? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{data.firstName}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                                </div>
                                                                <div className='mt-3'>
                                                                    <b>
                                                                        Nationalité de l'associé
                                                                    </b><br/>
                                                                    {data?.nationality? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{data.nationality}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                                </div>

                                                                <div className='mt-3'>
                                                                    <b>
                                                                        Email
                                                                    </b><br/>
                                                                    {data?.email? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{data.email}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                                </div>

                                                                <div className='mt-3'>
                                                                    <b>
                                                                        Date de naissance
                                                                    </b><br/>
                                                                    {data?.dateBirth? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{formatDate(data.dateBirth)}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                                </div>

                                                                <div className='mt-3'>
                                                                    <b>
                                                                        Pays de résidence
                                                                    </b><br/>
                                                                    {data?.residenceCountry? (
                                                                        <>
                                                                            {allCountry?.map((dataCountry) => (
                                                                                <p className='my-0' key={dataCountry?.id}>
                                                                                    {data.residenceCountry==dataCountry?.code? (
                                                                                        <>
                                                                                            <Icon icon="bx:check-double" color="#208454" />
                                                                                            {dataCountry.libelle}
                                                                                        </>
                                                                                    ):("")}
                                                                                </p>
                                                                            ))}
                                                                        </>
                                                                    ): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                                </div>

                                                                <div className='mt-3'>
                                                                    <b>
                                                                        Téléphone mobile
                                                                    </b><br/>
                                                                    {data?.residenceCountry && data?.mobile? (
                                                                        <>
                                                                            {allCountry?.map((dataCountry) => (
                                                                                <p className='my-0' key={dataCountry?.id}>
                                                                                    {data.residenceCountry==dataCountry?.code? (
                                                                                        <>
                                                                                            <Icon icon="bx:check-double" color="#208454" />
                                                                                            {dataCountry.indicator} {data.mobile}
                                                                                        </>
                                                                                    ):("")}
                                                                                </p>
                                                                            ))}
                                                                        </>
                                                                    ): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                                </div>
                                                                <div className='mt-3'>
                                                                    <b>
                                                                        % Participation/ Contrôle (de 0-100)
                                                                    </b><br/>
                                                                    {data?.percentControl? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{data.percentControl} %</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                                </div>
                                                                <div className='mt-3'>
                                                                    <b>
                                                                        Type de document d’identité
                                                                    </b><br/>
                                                                    {data?.typeDocIdentity? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{data.typeDocIdentity}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                                </div>

                                                                <div className='mt-3'>
                                                                    <b>
                                                                        Numéro du document d’identité
                                                                    </b><br/>
                                                                    {data?.identityDocNumber? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{data.identityDocNumber}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                                </div>

                                                                <div className='mt-3'>
                                                                    <b>
                                                                        Date d'expiration du document d’identité
                                                                    </b><br/>
                                                                    {data?.expirationDate? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{formatDate(data.expirationDate)}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                                </div>

                                                                <div className='mt-3'>
                                                                    <b>
                                                                        Pays émetteur du document d'identité
                                                                    </b><br/>
                                                                    {data?.issuingCountry? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{data.issuingCountry}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                                </div>
                                                               

                                                                {/* Les fichiers && photos*/}
                                                                {/* Documents de justificatif d'identité */}
                                                                <div className=" row col-lg-12 col-md-12 my-5 mx-5 justify-content-between">
                                                                    <div className='col-lg-6 col-md-6 text-center'>
                                                                        <h4 className='text-center'>Recto du justificatif d'identité du représentant </h4>
                                                                        {/* Si le document est prise en photo */}
                                                                        {data?.frontIdentityPhoto? 
                                                                            <img src={data?.frontIdentityPhoto} className="" width={'400'} height={'400'} alt="Recto"/> :(
                                                                                // Sinon
                                                                                <>
                                                                                    {/* Utilisation de la fonction isPdfLink pour vérifier si un lien est pour un fichier PDF */}
                                                                                    {isPdfLink(`${API_URL}/${data?.frontIdentityFile}`) ? (
                                                                                        <>
                                                                                            <div className="hero-btn  text-center ">
                                                                                            <a
                                                                                                className="nav-link btn btn-blue nav-link btn btn-outline-green"
                                                                                                role="button"
                                                                                                data-toggle="dropdown"
                                                                                                aria-haspopup="true"
                                                                                                aria-expanded="false"
                                                                                                href={`${API_URL}/${data?.frontIdentityFile}`} 
                                                                                                // download
                                                                                                // onClick={handleShow}
                                                                                                target="_blank"
                                                                                            >
                                                                                            <p className="gr-text-8 bgColorblue text-white mb-0">
                                                                                                <Icon icon="bx:show-alt" width="50" />
                                                                                                Veuillez cliquer ici pour voir le fichier
                                                                                            </p>
                                                                                            </a>
                                                                                            </div>
                                                                                        </>
                                                                                    ) : (
                                                                                        <>
                                                                                            {data?.frontIdentityFile? <img src={`${API_URL}/${data?.frontIdentityFile}`} className="" width={'400'} height={'400'} alt="Recto"/> : "Pas de recto de justificatif d'identité"}
                                                                                        </>
                                                                                    )}
                                                                                </>
                                                                            )
                                                                        } 
                                                                    </div>

                                                                    <div className='col-lg-6 col-md-6 text-center'>
                                                                        <h4 className='text-center'>Verso du justificatif d'identité du représentant</h4>
                                                                        {/* Si le document est prise en photo */}
                                                                        {data?.backIdentityPhoto? 
                                                                            <img src={data?.backIdentityPhoto} className="" width={'400'} height={'400'} alt="Recto"/> :(
                                                                                // Sinon
                                                                                <>
                                                                                    {/* Utilisation de la fonction isPdfLink pour vérifier si un lien est pour un fichier PDF */}
                                                                                    {isPdfLink(`${API_URL}/${data?.backIdentityFile}`) ? (
                                                                                        <>
                                                                                            <div className="hero-btn  text-center ">
                                                                                            <a
                                                                                                className="nav-link btn btn-blue nav-link btn btn-outline-green"
                                                                                                role="button"
                                                                                                data-toggle="dropdown"
                                                                                                aria-haspopup="true"
                                                                                                aria-expanded="false"
                                                                                                href={`${API_URL}/${data?.backIdentityFile}`}
                                                                                                target="_blank"
                                                                                            >
                                                                                            <p className="gr-text-8 bgColorblue text-white mb-0">
                                                                                                <Icon icon="bx:show-alt" width="50" />
                                                                                                Veuillez cliquer ici pour voir le fichier
                                                                                            </p>
                                                                                            </a>
                                                                                            </div>
                                                                                        </>
                                                                                    ) : (
                                                                                        <>
                                                                                            {data?.backIdentityFile? <img src={`${API_URL}/${data?.backIdentityFile}`} width={'400'} height={'400'} alt="Verso"/> : "Pas de verso de justificatif d'identité"}
                                                                                        </>
                                                                                    )}
                                                                                </>
                                                                            )
                                                                        }
                                                                    </div>
                                                                </div>
                                                                {/*Fin Documents de justificatif d'identité */}

                                                            </>
                                                        ):("")}
                                                        {/* Fin Vérifie si le type du bénéficiaire est une Personne physique */}

                                                        {/* Vérifie si le type du bénéficiaire est une Personne morale */}
                                                        {data?.typePartner==="Personne morale" ? (
                                                            <>
                                                                <div className='mt-3'>
                                                                    <b>
                                                                        Raison sociale
                                                                    </b><br/>
                                                                    {data?.socialReason? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{data.socialReason}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                                </div>

                                                                <div className='mt-3'>
                                                                    <b>
                                                                        Numéro RCCM
                                                                    </b><br/>
                                                                    {data?.numberRccm? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{data.numberRccm}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                                </div>

                                                                <div className='mt-3'>
                                                                    <b>
                                                                        Email
                                                                    </b><br/>
                                                                    {data?.email? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{data.email}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                                </div>

                                                                <div className='mt-3'>
                                                                    <b>
                                                                        Pays d'immatriculation
                                                                    </b><br/>
                                                                    {data?.countryRegistration? (
                                                                        <>
                                                                            {allCountry?.map((dataCountry) => (
                                                                                <p className='my-0' key={dataCountry?.id}>
                                                                                    {data.countryRegistration==dataCountry?.code? (
                                                                                        <>
                                                                                            <Icon icon="bx:check-double" color="#208454" />
                                                                                            {dataCountry.libelle}
                                                                                        </>
                                                                                    ):("")}
                                                                                </p>
                                                                            ))}
                                                                        </>
                                                                    ): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                                </div>

                                                                <div className='mt-3'>
                                                                    <b>
                                                                        Téléphone fixe
                                                                    </b><br/>
                                                                    {data?.countryRegistration && data?.phoneFixe? (
                                                                        <>
                                                                            {allCountry?.map((dataCountry) => (
                                                                                <p className='my-0' key={dataCountry?.id}>
                                                                                    {data.countryRegistration==dataCountry?.code? (
                                                                                        <>
                                                                                            <Icon icon="bx:check-double" color="#208454" />
                                                                                            {dataCountry.indicator} {data.phoneFixe}
                                                                                        </>
                                                                                    ):("")}
                                                                                </p>
                                                                            ))}
                                                                        </>
                                                                    ): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                                </div>
                                                                <div className='mt-3'>
                                                                    <b>
                                                                        % Participation/ Contrôle (de 0-100)
                                                                    </b><br/>
                                                                    {data?.percentControl? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{data.percentControl} %</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                                </div>

                                                                <div className='mt-3'>
                                                                    <b>
                                                                        Date de création
                                                                    </b><br/>
                                                                    {data?.startDate? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{formatDate(data.startDate)}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                                </div>
                                                            </>
                                                        ):("")}
                                                        {/* Fin Vérifie si le type du bénéficiaire est une Personne morale */}

                                                    </div>
                                                ))}
                                            </>
                                        ):("")}
                                        </div>
                                    </>
                                ): ("")}

                                {/* Politiquement exposé */}
                                {etape===6 ? (
                                    <>
                                        <div className='my-5'>
                                            <h3 className='text-center'>Déclaration de personnes politiquement exposées</h3>
                                        </div>
                                        <div className='my-5 mx-5'>
                                        
                                        <div className='mt-3'>
                                            <b>
                                                Nombre de personnes politiquement exposées
                                            </b><br/>
                                            {oneKycForEntreprise?.numberPoliticallyExposed? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{oneKycForEntreprise.numberPoliticallyExposed}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                        </div>
                                        
                                        {/* On affiche ce qui suit si nombre de personnes politiquement exposées est supérieur à zéro */}
                                        {oneKycForEntreprise?.numberPoliticallyExposed>0 && oneKycForEntreprise?.numberPoliticallyExposed? (
                                            <>
                                                {allPoliticallyExposedByKycId?.map((data, index) => (
                                                    <div className='' key={index}>
                                                        <h5 className='colorRed mt-5'>Les informations de personne politiquement exposée {index + 1}</h5>
                                                        <div className='form-group my-3 col-lg-6 col-md-6'>
                                                            <form>
                                                                <label className="mx-2  mb-2" htmlFor='validSignature'>
                                                                    Les informations de cette personne sont-elles correctes?
                                                                </label>
                                                                <div className="input-group flex-nowrap">
                                                                    <select 
                                                                        className="form-control gr-text-11 border mt-3"
                                                                        id="validSignature"
                                                                        required
                                                                        // defaultValue={validSignature} 
                                                                        // onChange={(event)=>setValidSignature(event.target.value)}
                                                                    >
                                                                        <option defaultValue="">Choisissez une option</option>
                                                                        <optgroup className='single-cryptocurrency-box'>
                                                                            <option  value="true">Oui</option>
                                                                            <option  value="false">Non</option>
                                                                        </optgroup>
                                                                    </select>
                                                                    <span className="input-group-text gr-text-11  mt-3" id="addon-wrapping">
                                                                        <button  disabled={isLoggingIn}>Envoyer</button>
                                                                    </span>
                                                                </div>
                                                                
                                                            </form>
                                                        </div>
                                                            <div>
                                                            <div className='mt-3'>
                                                                    <b>
                                                                        Nom de la personne politiquement exposée
                                                                    </b><br/>
                                                                    {data?.lastName? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{data.lastName}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                                </div>

                                                                <div className='mt-3'>
                                                                    <b>
                                                                        Prénom de la personne politiquement exposée
                                                                    </b><br/>
                                                                    {data?.firstName? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{data.firstName}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                                </div>
                                                                <div className='mt-3'>
                                                                    <b>
                                                                        Nationalité de la personne politiquement exposée
                                                                    </b><br/>
                                                                    {data?.nationality? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{data.nationality}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                                </div>

                                                                <div className='mt-3'>
                                                                    <b>
                                                                        Fonctions de la personne politiquement exposée
                                                                    </b><br/>
                                                                    {data?.functions? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{data.functions}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                                </div>
                                                            </div>
                                                    </div>
                                                ))}
                                            </>
                                        ):("")}
                                        </div>
                                    </>
                                ): ("")}

                                {/* Personnes politiquement exposées */}
                                {etape===7 ? (
                                    <>
                                        <div className='my-5'>
                                            <h3 className='text-center'>Description des opérations financières</h3>
                                        </div>

                                        <div className='row mx-5 my-5'>
                                            {allFinancialOperationByKycId?.map((data, index) => (
                                                <div className='mt-3 col-lg-6 col-md-6' key={index}>
                                                    <h5>{data?.title}</h5>
                                                    <b>
                                                        {data?.question}
                                                    </b><br/>
                                                    {data?.answer? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{data.answer}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ):("")}

                                {/* Fonds d'investissement */}
                                {etape===8 ? (
                                    <>
                                        <div className='my-5'>
                                            <h3 className='text-center'>Description des opérations financières</h3>
                                        </div>

                                        <div className='row mx-5 my-5'>
                                            {allFundOriginByKycId?.map((data, index) => (
                                                <div className='mt-3 col-lg-6 col-md-6' key={index}>
                                                    <h5>{data?.title}</h5>
                                                    <b>
                                                        {data?.question}
                                                    </b><br/>
                                                    {data?.answer? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{data.answer}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ):("")}

                                {/* Informations financière */}
                                {etape===9 ? (
                                    <>
                                        {/* ******Autre information financière**** */}
                                        <div className='my-5'>
                                            <h3 className='text-center'>Autre information financière</h3>
                                        </div>

                                        {/* Partie mensuelle */}
                                        <div className='mt-5'>
                                            <h5 className='text-center'>
                                                <b>
                                                    Information financière sur les 4 derniers mois
                                                </b>
                                            </h5>
                                        </div>
                                        <Table
                                        aria-label="Example table with static content"
                                        css={{
                                            height: "auto",
                                            minWidth: "100%",
                                        }}
                                        >
                                            <Table.Header>
                                                <Table.Column><p className="gr-text-8 pt-3 pb-0 px-2 ">Période</p></Table.Column>
                                                <Table.Column><p className="gr-text-8 pt-3 pb-0 ">CA mensuel</p></Table.Column>
                                                <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Charges mensuelles</p></Table.Column>
                                                <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Résultat net Mensuel(%CA)</p></Table.Column>
                                                <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Nombre moyen de transactions mensuelles financières (bancaires)</p></Table.Column>
                                            </Table.Header>
                                            {oneMonthlyFinancialInformation?.map((data, index)=>(
                                            <Table.Body key={index}>
                                                <Table.Row >                       
                                                    <Table.Cell ><p className=" py-0 "> M-1 </p></Table.Cell>
                                                    <Table.Cell >
                                                        {data?.periodOneCa? (<p className=" py-0 ">{data?.periodOneCa}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                    </Table.Cell>
                                                    <Table.Cell >
                                                        {data?.periodOneCa? (<p className="py-0 ">{data?.periodOneCharges}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                    </Table.Cell>
                                                    <Table.Cell >
                                                        {data?.periodOneCa? (<p className="py-0 ">{data?.periodOneResultat}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                    </Table.Cell>
                                                    <Table.Cell >
                                                        {data?.periodOneCa? (<p className="py-0 ">{data?.periodOneTransactions}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                    </Table.Cell>
                                                </Table.Row >
                                                <Table.Row >                       
                                                    <Table.Cell ><p className=" py-0 "> M-2 </p></Table.Cell>
                                                    <Table.Cell >
                                                        {data?.periodOneCa? (<p className="py-0 ">{data?.periodTwoCa}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                    </Table.Cell>
                                                    <Table.Cell >
                                                        {data?.periodOneCa? (<p className="py-0 ">{data?.periodTwoCharges}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                    </Table.Cell>
                                                    <Table.Cell >
                                                        {data?.periodOneCa? (<p className="py-0">{data?.periodTwoResultat}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                    </Table.Cell>
                                                    <Table.Cell >
                                                        {data?.periodOneCa? (<p className="py-0">{data?.periodTwoTransactions}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                    </Table.Cell>
                                                </Table.Row >
                                                <Table.Row >                       
                                                    <Table.Cell ><p className=" py-0 "> M-3 </p></Table.Cell>
                                                    <Table.Cell >
                                                        {data?.periodOneCa? (<p className="py-0">{data?.periodThreeCa}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                    </Table.Cell>
                                                    <Table.Cell >
                                                        {data?.periodOneCa? (<p className="py-0">{data?.periodThreeCharges}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                    </Table.Cell>
                                                    <Table.Cell >
                                                        {data?.periodOneCa? (<p className="py-0">{data?.periodThreeResultat}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                    </Table.Cell>
                                                    <Table.Cell >
                                                        {data?.periodOneCa? (<p className="py-0">{data?.periodThreeTransactions}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                    </Table.Cell>
                                                </Table.Row >
                                                <Table.Row >                       
                                                    <Table.Cell ><p className=" py-0 "> M-4 </p></Table.Cell>
                                                    <Table.Cell >
                                                        {data?.periodOneCa? (<p className="py-0">{data?.periodFourCa}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                    </Table.Cell>
                                                    <Table.Cell >
                                                        {data?.periodOneCa? (<p className="py-0">{data?.periodFourCharges}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                    </Table.Cell>
                                                    <Table.Cell >
                                                        {data?.periodOneCa? (<p className="py-0">{data?.periodFourResultat}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                    </Table.Cell>
                                                    <Table.Cell >
                                                        {data?.periodOneCa? (<p className="py-0">{data?.periodFourTransactions}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                    </Table.Cell>
                                                </Table.Row >

                                            </Table.Body> 
                                            ))}  
                                        </Table>
                                        {/* Fin partie mensuelle */}

                                        {/* Partie trimestrielle */}
                                        <div className='mt-5'>
                                            <h5 className='text-center'>
                                                <b>
                                                    Information financière sur les 4 derniers trimestres
                                                </b>
                                            </h5>
                                        </div>
                                        <Table
                                            aria-label="Example table with static content"
                                            css={{
                                                height: "auto",
                                                minWidth: "100%",
                                            }}
                                        >
                                                <Table.Header>
                                                    <Table.Column><p className="gr-text-8 pt-3 pb-0 px-2 ">Période</p></Table.Column>
                                                    <Table.Column><p className="gr-text-8 pt-3 pb-0 ">CA mensuel</p></Table.Column>
                                                    <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Charges mensuelles</p></Table.Column>
                                                    <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Résultat net Mensuel(%CA)</p></Table.Column>
                                                    <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Nombre moyen de transactions mensuelles financières (bancaires)</p></Table.Column>
                                                </Table.Header>
                                                {oneQuarterlyFinancialInformation?.map((data, index)=>(
                                                <Table.Body key={index}>
                                                    <Table.Row >                       
                                                        <Table.Cell ><p className=" py-0 "> T-1 </p></Table.Cell>
                                                        <Table.Cell >
                                                            {data?.periodOneCa? (<p className=" py-0 ">{data?.periodOneCa}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                        <Table.Cell >
                                                            {data?.periodOneCa? (<p className="py-0 ">{data?.periodOneCharges}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                        <Table.Cell >
                                                            {data?.periodOneCa? (<p className="py-0 ">{data?.periodOneResultat}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                        <Table.Cell >
                                                            {data?.periodOneCa? (<p className="py-0 ">{data?.periodOneTransactions}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                    </Table.Row >
                                                    <Table.Row >                       
                                                        <Table.Cell ><p className=" py-0 "> T-2 </p></Table.Cell>
                                                        <Table.Cell >
                                                            {data?.periodOneCa? (<p className="py-0 ">{data?.periodTwoCa}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                        <Table.Cell >
                                                            {data?.periodOneCa? (<p className="py-0 ">{data?.periodTwoCharges}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                        <Table.Cell >
                                                            {data?.periodOneCa? (<p className="py-0">{data?.periodTwoResultat}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                        <Table.Cell >
                                                            {data?.periodOneCa? (<p className="py-0">{data?.periodTwoTransactions}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                    </Table.Row >
                                                    <Table.Row >                       
                                                        <Table.Cell ><p className=" py-0 "> T-3 </p></Table.Cell>
                                                        <Table.Cell >
                                                            {data?.periodOneCa? (<p className="py-0">{data?.periodThreeCa}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                        <Table.Cell >
                                                            {data?.periodOneCa? (<p className="py-0">{data?.periodThreeCharges}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                        <Table.Cell >
                                                            {data?.periodOneCa? (<p className="py-0">{data?.periodThreeResultat}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                        <Table.Cell >
                                                            {data?.periodOneCa? (<p className="py-0">{data?.periodThreeTransactions}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                    </Table.Row >
                                                    <Table.Row >                       
                                                        <Table.Cell ><p className=" py-0 "> T-4 </p></Table.Cell>
                                                        <Table.Cell >
                                                            {data?.periodOneCa? (<p className="py-0">{data?.periodFourCa}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                        <Table.Cell >
                                                            {data?.periodOneCa? (<p className="py-0">{data?.periodFourCharges}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                        <Table.Cell >
                                                            {data?.periodOneCa? (<p className="py-0">{data?.periodFourResultat}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                        <Table.Cell >
                                                            {data?.periodOneCa? (<p className="py-0">{data?.periodFourTransactions}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                    </Table.Row >
                                                </Table.Body> 
                                            ))}  
                                        </Table>
                                        {/* Fin partie Trimestrielle */}

                                        {/* Partie annuelle */}
                                        <div className='mt-5'>
                                            <h5 className='text-center'>
                                                <b>
                                                    Information financière sur les 4 dernières années
                                                </b>
                                            </h5>
                                        </div>
                                        <Table
                                            aria-label="Example table with static content"
                                            css={{
                                                height: "auto",
                                                minWidth: "100%",
                                            }}
                                        >
                                                <Table.Header>
                                                    <Table.Column><p className="gr-text-8 pt-3 pb-0 px-2 ">Période</p></Table.Column>
                                                    <Table.Column><p className="gr-text-8 pt-3 pb-0 ">CA mensuel</p></Table.Column>
                                                    <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Charges mensuelles</p></Table.Column>
                                                    <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Résultat net Mensuel(%CA)</p></Table.Column>
                                                    <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Nombre moyen de transactions mensuelles financières (bancaires)</p></Table.Column>
                                                </Table.Header>
                                                {oneAnnualFinancialInformation?.map((data, index)=>(
                                                <Table.Body key={index}>
                                                    <Table.Row >                       
                                                        <Table.Cell ><p className=" py-0 "> N-1 </p></Table.Cell>
                                                        <Table.Cell >
                                                            {data?.periodOneCa? (<p className=" py-0 ">{data?.periodOneCa}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                        <Table.Cell >
                                                            {data?.periodOneCa? (<p className="py-0 ">{data?.periodOneCharges}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                        <Table.Cell >
                                                            {data?.periodOneCa? (<p className="py-0 ">{data?.periodOneResultat}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                        <Table.Cell >
                                                            {data?.periodOneCa? (<p className="py-0 ">{data?.periodOneTransactions}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                    </Table.Row >
                                                    <Table.Row >                       
                                                        <Table.Cell ><p className=" py-0 "> N-2 </p></Table.Cell>
                                                        <Table.Cell >
                                                            {data?.periodOneCa? (<p className="py-0 ">{data?.periodTwoCa}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                        <Table.Cell >
                                                            {data?.periodOneCa? (<p className="py-0 ">{data?.periodTwoCharges}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                        <Table.Cell >
                                                            {data?.periodOneCa? (<p className="py-0">{data?.periodTwoResultat}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                        <Table.Cell >
                                                            {data?.periodOneCa? (<p className="py-0">{data?.periodTwoTransactions}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                    </Table.Row >
                                                    <Table.Row >                       
                                                        <Table.Cell ><p className=" py-0 "> N-3 </p></Table.Cell>
                                                        <Table.Cell >
                                                            {data?.periodOneCa? (<p className="py-0">{data?.periodThreeCa}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                        <Table.Cell >
                                                            {data?.periodOneCa? (<p className="py-0">{data?.periodThreeCharges}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                        <Table.Cell >
                                                            {data?.periodOneCa? (<p className="py-0">{data?.periodThreeResultat}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                        <Table.Cell >
                                                            {data?.periodOneCa? (<p className="py-0">{data?.periodThreeTransactions}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                    </Table.Row >
                                                    <Table.Row >                       
                                                        <Table.Cell ><p className=" py-0 "> N-4 </p></Table.Cell>
                                                        <Table.Cell >
                                                            {data?.periodOneCa? (<p className="py-0">{data?.periodFourCa}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                        <Table.Cell >
                                                            {data?.periodOneCa? (<p className="py-0">{data?.periodFourCharges}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                        <Table.Cell >
                                                            {data?.periodOneCa? (<p className="py-0">{data?.periodFourResultat}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                        <Table.Cell >
                                                            {data?.periodOneCa? (<p className="py-0">{data?.periodFourTransactions}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                    </Table.Row >
                                                </Table.Body> 
                                            ))}  
                                        </Table>
                                        {/* Fin partie annuelle */}
                                        
                                        {/* ******Fin Autre information financière**** */}
                                        

                                        {/* ******Transactions**** */}
                                        <div className='my-5'>
                                            <h3 className='text-center'>Transactions</h3>
                                        </div>
                                         {/* Partie annuelle */}
                                         <div className='mt-5'>
                                            <h5 className='text-center'>
                                                <b>
                                                    Information financière sur les 4 dernières années
                                                </b>
                                            </h5>
                                        </div>
                                        <Table
                                            aria-label="Example table with static content"
                                            css={{
                                                height: "auto",
                                                minWidth: "100%",
                                            }}
                                        >
                                                <Table.Header>
                                                    <Table.Column><p className="gr-text-8 pt-3 pb-0 px-2 ">Période</p></Table.Column>
                                                    <Table.Column><p className="gr-text-8 pt-3 pb-0 ">CA mensuel</p></Table.Column>
                                                    <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Charges mensuelles</p></Table.Column>
                                                    <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Résultat net Mensuel(%CA)</p></Table.Column>
                                                    <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Nombre moyen de transactions mensuelles financières (bancaires)</p></Table.Column>
                                                </Table.Header>
                                                {oneAnnualFinancialInformation?.map((data, index)=>(
                                                <Table.Body key={index}>
                                                    <Table.Row >                       
                                                        <Table.Cell ><p className=" py-0 "> N-1 </p></Table.Cell>
                                                        <Table.Cell >
                                                            {data?.periodOneCa? (<p className=" py-0 ">{data?.periodOneCa}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                        <Table.Cell >
                                                            {data?.periodOneCa? (<p className="py-0 ">{data?.periodOneCharges}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                        <Table.Cell >
                                                            {data?.periodOneCa? (<p className="py-0 ">{data?.periodOneResultat}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                        <Table.Cell >
                                                            {data?.periodOneCa? (<p className="py-0 ">{data?.periodOneTransactions}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                    </Table.Row >
                                                    <Table.Row >                       
                                                        <Table.Cell ><p className=" py-0 "> N-2 </p></Table.Cell>
                                                        <Table.Cell >
                                                            {data?.periodOneCa? (<p className="py-0 ">{data?.periodTwoCa}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                        <Table.Cell >
                                                            {data?.periodOneCa? (<p className="py-0 ">{data?.periodTwoCharges}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                        <Table.Cell >
                                                            {data?.periodOneCa? (<p className="py-0">{data?.periodTwoResultat}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                        <Table.Cell >
                                                            {data?.periodOneCa? (<p className="py-0">{data?.periodTwoTransactions}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                    </Table.Row >
                                                    <Table.Row >                       
                                                        <Table.Cell ><p className=" py-0 "> N-3 </p></Table.Cell>
                                                        <Table.Cell >
                                                            {data?.periodOneCa? (<p className="py-0">{data?.periodThreeCa}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                        <Table.Cell >
                                                            {data?.periodOneCa? (<p className="py-0">{data?.periodThreeCharges}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                        <Table.Cell >
                                                            {data?.periodOneCa? (<p className="py-0">{data?.periodThreeResultat}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                        <Table.Cell >
                                                            {data?.periodOneCa? (<p className="py-0">{data?.periodThreeTransactions}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                    </Table.Row >
                                                    <Table.Row >                       
                                                        <Table.Cell ><p className=" py-0 "> N-4 </p></Table.Cell>
                                                        <Table.Cell >
                                                            {data?.periodOneCa? (<p className="py-0">{data?.periodFourCa}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                        <Table.Cell >
                                                            {data?.periodOneCa? (<p className="py-0">{data?.periodFourCharges}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                        <Table.Cell >
                                                            {data?.periodOneCa? (<p className="py-0">{data?.periodFourResultat}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                        <Table.Cell >
                                                            {data?.periodOneCa? (<p className="py-0">{data?.periodFourTransactions}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                    </Table.Row >
                                                </Table.Body> 
                                            ))}  
                                        </Table>
                                        {/* Fin partie annuelle */}
                                        
                                    </>
                                ):("")}

                                {/* Informations sur les transactions */}
                                {etape===10 ? (
                                    <>
                                        <div className='my-5'>
                                            <h3 className='text-center'>Informations sur les transactions</h3>
                                        </div>
                                        {/* Partie mensuelle */}
                                        <div className='mt-5'>
                                            <h5 className='text-center'>
                                                <b>
                                                    Nombre de transactions financières mensuelles moyennes
                                                </b>
                                            </h5>
                                        </div>
                                        <Table
                                            aria-label="Example table with static content"
                                            css={{
                                                height: "auto",
                                                minWidth: "100%",
                                            }}
                                        >
                                                <Table.Header>
                                                    <Table.Column><p className="gr-text-8 pt-3 pb-0 px-2 ">Zone</p></Table.Column>
                                                    <Table.Column><p className="gr-text-8 pt-3 pb-0 "><b className='colorRed'>EMISES</b><br/> Virement bancaire </p></Table.Column>
                                                    <Table.Column><p className="gr-text-8 pt-3 pb-0 "><b className='colorRed'>EMISES</b><br/> Autres Transactions </p></Table.Column>
                                                    <Table.Column><p className="gr-text-8 pt-3 pb-0 "><b className='colorRed'>RECUES</b><br/> Virement bancaire </p></Table.Column>
                                                    <Table.Column><p className="gr-text-8 pt-3 pb-0 "><b className='colorRed'>RECUES</b><br/> Autres Transactions </p></Table.Column>
                                                </Table.Header>
                                                {oneMonthlyFinancialTransaction?.map((data, index)=>(
                                                <Table.Body key={index}>
                                                    {/* National */}
                                                    <Table.Row >                       
                                                        <Table.Cell ><p className=" py-0 "> National </p></Table.Cell>
                                                        {/* Emise  */}
                                                        <Table.Cell >
                                                            {data?.nationalBankIssued ? (<p className=" py-0 ">{data?.nationalBankIssued}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                        <Table.Cell >
                                                            {data?.nationalOthersIssued ? (<p className="py-0 ">{data?.nationalOthersIssued}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                        {/* Recues */}
                                                        <Table.Cell >
                                                            {data?.nationalBankReceived ? (<p className="py-0 ">{data?.nationalBankReceived}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                        <Table.Cell >
                                                            {data?.nationalOthersReceived ? (<p className="py-0 ">{data?.nationalOthersReceived}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                    </Table.Row >

                                                    {/* Zone UEMOA CFA */}
                                                    <Table.Row >                       
                                                        <Table.Cell ><p className=" py-0 "> Zone UEMOA CFA </p></Table.Cell>
                                                        {/* Emise  */}
                                                        <Table.Cell >
                                                            {data?.cfaUemoaBankIssued ? (<p className=" py-0 ">{data?.cfaUemoaBankIssued}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                        <Table.Cell >
                                                            {data?.cfaUemoaOthersIssued ? (<p className="py-0 ">{data?.cfaUemoaOthersIssued}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                        {/* Recues */}
                                                        <Table.Cell >
                                                            {data?.cfaUemoaBankReceived ? (<p className="py-0 ">{data?.cfaUemoaBankReceived}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                        <Table.Cell >
                                                            {data?.cfaUemoaOthersReceived ? (<p className="py-0 ">{data?.cfaUemoaOthersReceived}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                    </Table.Row >

                                                    {/* Afrique Hors UEMOA*/}
                                                    <Table.Row >                       
                                                        <Table.Cell ><p className=" py-0 "> Afrique Hors UEMOA </p></Table.Cell>
                                                        {/* Emise  */}
                                                        <Table.Cell >
                                                            {data?.cfaOutsideUemoaBankIssued ? (<p className=" py-0 ">{data?.cfaOutsideUemoaBankIssued}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                        <Table.Cell >
                                                            {data?.cfaOutsideUemoaOthersIssued ? (<p className="py-0 ">{data?.cfaOutsideUemoaOthersIssued}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                        {/* Recues */}
                                                        <Table.Cell >
                                                            {data?.cfaOutsideUemoaBankReceived ? (<p className="py-0 ">{data?.cfaOutsideUemoaBankReceived}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                        <Table.Cell >
                                                            {data?.cfaOutsideUemoaOthersReceived ? (<p className="py-0 ">{data?.cfaOutsideUemoaOthersReceived}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                    </Table.Row >

                                                    {/* En euros ou dans la zone EURO */}
                                                    <Table.Row >                       
                                                        <Table.Cell ><p className=" py-0 "> En euros ou dans la zone EURO </p></Table.Cell>
                                                        {/* Emise  */}
                                                        <Table.Cell >
                                                            {data?.euroBankIssued ? (<p className=" py-0 ">{data?.euroBankIssued}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                        <Table.Cell >
                                                            {data?.euroOthersIssued ? (<p className="py-0 ">{data?.euroOthersIssued}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                        {/* Recues */}
                                                        <Table.Cell >
                                                            {data?.euroBankReceived ? (<p className="py-0 ">{data?.euroBankReceived}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                        <Table.Cell >
                                                            {data?.euroOthersReceived ? (<p className="py-0 ">{data?.euroOthersReceived}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                    </Table.Row >

                                                    {/* En dollars US */}
                                                    <Table.Row >                       
                                                        <Table.Cell ><p className=" py-0 "> En dollars US </p></Table.Cell>
                                                        {/* Emise  */}
                                                        <Table.Cell >
                                                            {data?.dollarBankIssued ? (<p className=" py-0 ">{data?.dollarBankIssued}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                        <Table.Cell >
                                                            {data?.dollarOthersIssued ? (<p className="py-0 ">{data?.dollarOthersIssued}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                        {/* Recues */}
                                                        <Table.Cell >
                                                            {data?.dollarBankReceived ? (<p className="py-0 ">{data?.dollarBankReceived}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                        <Table.Cell >
                                                            {data?.dollarOthersReceived ? (<p className="py-0 ">{data?.dollarOthersReceived}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                    </Table.Row >

                                                    {/* Autre devises */}
                                                    <Table.Row >                       
                                                        <Table.Cell ><p className=" py-0 "> Autre devises </p></Table.Cell>
                                                        {/* Emise  */}
                                                        <Table.Cell >
                                                            {data?.otherCurrencyBankIssued ? (<p className=" py-0 ">{data?.otherCurrencyBankIssued}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                        <Table.Cell >
                                                            {data?.otherCurrencyOthersIssued ? (<p className="py-0 ">{data?.otherCurrencyOthersIssued}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                        {/* Recues */}
                                                        <Table.Cell >
                                                            {data?.otherCurrencyBankReceived ? (<p className="py-0 ">{data?.otherCurrencyBankReceived}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                        <Table.Cell >
                                                            {data?.otherCurrencyOthersReceived ? (<p className="py-0 ">{data?.otherCurrencyOthersReceived}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                    </Table.Row >

                                                </Table.Body> 
                                            ))}  
                                        </Table>
                                        {/* Fin partie mensuelle */}


                                        {/* Partie annuelle */}
                                        <div className='mt-5'>
                                            <h5 className='text-center'>
                                                <b>
                                                    Nombre de transactions financières annuelles moyennes
                                                </b>
                                            </h5>
                                        </div>
                                        <Table
                                            aria-label="Example table with static content"
                                            css={{
                                                height: "auto",
                                                minWidth: "100%",
                                            }}
                                        >
                                                <Table.Header>
                                                    <Table.Column><p className="gr-text-8 pt-3 pb-0 px-2 ">Zone</p></Table.Column>
                                                    <Table.Column><p className="gr-text-8 pt-3 pb-0 "><b className='colorRed'>EMISES</b><br/> Virement bancaire </p></Table.Column>
                                                    <Table.Column><p className="gr-text-8 pt-3 pb-0 "><b className='colorRed'>EMISES</b><br/> Autres Transactions </p></Table.Column>
                                                    <Table.Column><p className="gr-text-8 pt-3 pb-0 "><b className='colorRed'>RECUES</b><br/> Virement bancaire </p></Table.Column>
                                                    <Table.Column><p className="gr-text-8 pt-3 pb-0 "><b className='colorRed'>RECUES</b><br/> Autres Transactions </p></Table.Column>
                                                </Table.Header>
                                                {oneAnnualFinancialTransaction?.map((data, index)=>(
                                                <Table.Body key={index}>
                                                    {/* National */}
                                                    <Table.Row >                       
                                                        <Table.Cell ><p className=" py-0 "> National </p></Table.Cell>
                                                        {/* Emise  */}
                                                        <Table.Cell >
                                                            {data?.nationalBankIssued ? (<p className=" py-0 ">{data?.nationalBankIssued}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                        <Table.Cell >
                                                            {data?.nationalOthersIssued ? (<p className="py-0 ">{data?.nationalOthersIssued}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                        {/* Recues */}
                                                        <Table.Cell >
                                                            {data?.nationalBankReceived ? (<p className="py-0 ">{data?.nationalBankReceived}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                        <Table.Cell >
                                                            {data?.nationalOthersReceived ? (<p className="py-0 ">{data?.nationalOthersReceived}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                    </Table.Row >

                                                    {/* Zone UEMOA CFA */}
                                                    <Table.Row >                       
                                                        <Table.Cell ><p className=" py-0 "> Zone UEMOA CFA </p></Table.Cell>
                                                        {/* Emise  */}
                                                        <Table.Cell >
                                                            {data?.cfaUemoaBankIssued ? (<p className=" py-0 ">{data?.cfaUemoaBankIssued}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                        <Table.Cell >
                                                            {data?.cfaUemoaOthersIssued ? (<p className="py-0 ">{data?.cfaUemoaOthersIssued}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                        {/* Recues */}
                                                        <Table.Cell >
                                                            {data?.cfaUemoaBankReceived ? (<p className="py-0 ">{data?.cfaUemoaBankReceived}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                        <Table.Cell >
                                                            {data?.cfaUemoaOthersReceived ? (<p className="py-0 ">{data?.cfaUemoaOthersReceived}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                    </Table.Row >

                                                    {/* Afrique Hors UEMOA*/}
                                                    <Table.Row >                       
                                                        <Table.Cell ><p className=" py-0 "> Afrique Hors UEMOA </p></Table.Cell>
                                                        {/* Emise  */}
                                                        <Table.Cell >
                                                            {data?.cfaOutsideUemoaBankIssued ? (<p className=" py-0 ">{data?.cfaOutsideUemoaBankIssued}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                        <Table.Cell >
                                                            {data?.cfaOutsideUemoaOthersIssued ? (<p className="py-0 ">{data?.cfaOutsideUemoaOthersIssued}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                        {/* Recues */}
                                                        <Table.Cell >
                                                            {data?.cfaOutsideUemoaBankReceived ? (<p className="py-0 ">{data?.cfaOutsideUemoaBankReceived}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                        <Table.Cell >
                                                            {data?.cfaOutsideUemoaOthersReceived ? (<p className="py-0 ">{data?.cfaOutsideUemoaOthersReceived}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                    </Table.Row >

                                                    {/* En euros ou dans la zone EURO */}
                                                    <Table.Row >                       
                                                        <Table.Cell ><p className=" py-0 "> En euros ou dans la zone EURO </p></Table.Cell>
                                                        {/* Emise  */}
                                                        <Table.Cell >
                                                            {data?.euroBankIssued ? (<p className=" py-0 ">{data?.euroBankIssued}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                        <Table.Cell >
                                                            {data?.euroOthersIssued ? (<p className="py-0 ">{data?.euroOthersIssued}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                        {/* Recues */}
                                                        <Table.Cell >
                                                            {data?.euroBankReceived ? (<p className="py-0 ">{data?.euroBankReceived}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                        <Table.Cell >
                                                            {data?.euroOthersReceived ? (<p className="py-0 ">{data?.euroOthersReceived}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                    </Table.Row >

                                                    {/* En dollars US */}
                                                    <Table.Row >                       
                                                        <Table.Cell ><p className=" py-0 "> En dollars US </p></Table.Cell>
                                                        {/* Emise  */}
                                                        <Table.Cell >
                                                            {data?.dollarBankIssued ? (<p className=" py-0 ">{data?.dollarBankIssued}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                        <Table.Cell >
                                                            {data?.dollarOthersIssued ? (<p className="py-0 ">{data?.dollarOthersIssued}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                        {/* Recues */}
                                                        <Table.Cell >
                                                            {data?.dollarBankReceived ? (<p className="py-0 ">{data?.dollarBankReceived}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                        <Table.Cell >
                                                            {data?.dollarOthersReceived ? (<p className="py-0 ">{data?.dollarOthersReceived}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                    </Table.Row >

                                                    {/* Autre devises */}
                                                    <Table.Row >                       
                                                        <Table.Cell ><p className=" py-0 "> Autre devises </p></Table.Cell>
                                                        {/* Emise  */}
                                                        <Table.Cell >
                                                            {data?.otherCurrencyBankIssued ? (<p className=" py-0 ">{data?.otherCurrencyBankIssued}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                        <Table.Cell >
                                                            {data?.otherCurrencyOthersIssued ? (<p className="py-0 ">{data?.otherCurrencyOthersIssued}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                        {/* Recues */}
                                                        <Table.Cell >
                                                            {data?.otherCurrencyBankReceived ? (<p className="py-0 ">{data?.otherCurrencyBankReceived}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                        <Table.Cell >
                                                            {data?.otherCurrencyOthersReceived ? (<p className="py-0 ">{data?.otherCurrencyOthersReceived}</p>):(<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                        </Table.Cell>
                                                    </Table.Row >

                                                </Table.Body> 
                                            ))}  
                                        </Table>
                                        {/* Fin partie annuelle */}

                                        {/* Partie des monnnaies et des pays les plus utilisés */}
                                        <div className='mt-5'>
                                            <h5 className='text-center'>
                                                <b>
                                                    Au cours de la dernière année quelles sont les 3 principales devises ou les 3 principaux pays en dehors du F CFA et de la zone UEMOA avec qui vous avez eu des transactions financières.
                                                </b>
                                            </h5>
                                            {oneAnnualFinancialTransaction?.map((data, index)=>(

                                            <div className='row ' key={index}>
                                                <div className='mt-3 col-lg-4 col-md-4'>
                                                    <b>
                                                        1ère monnaie 
                                                    </b><br/>
                                                    {data?.currencyOne? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{data.currencyOne}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                </div>

                                                <div className='mt-3 col-lg-4 col-md-4'>
                                                    <b>
                                                        2è monnaie 
                                                    </b><br/>
                                                    {data?.currencyTwo? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{data.currencyTwo}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                </div>

                                                <div className='mt-3 col-lg-4 col-md-4'>
                                                    <b>
                                                        3è monnaie 
                                                    </b><br/>
                                                    {data?.currencyThree? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{data.currencyThree}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                </div>

                                                <div className='mt-3 col-lg-4 col-md-4'>
                                                    <b>
                                                        1er pays
                                                    </b><br/>
                                                    {data?.countryOne? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{data.countryOne}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                </div>

                                                <div className='mt-3 col-lg-4 col-md-4'>
                                                    <b>
                                                        2è pays
                                                    </b><br/>
                                                    {data?.countryTwo? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{data.countryTwo}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                </div>

                                                <div className='mt-3 col-lg-4 col-md-4'>
                                                    <b>
                                                        3è pays
                                                    </b><br/>
                                                    {data?.countryThree? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{data.countryThree}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                                </div>
                                            </div>
                                            ))}

                                        </div>
                                        {/* Fin partie des monnnaies et des pays les plus utilisés */}

                                    </>
                                ):("")}

                                {/* Les documents legaux */}
                                {etape===11 ? (
                                    <>
                                        <div className='my-5'>
                                            <h3 className='text-center'>Documents légaux de l'entreprise</h3>
                                        </div>

                                        
                                        {/* Extrait de registre de commerce && le DFE  */}
                                        <div className='mt-5 mb-3'>
                                            <h5 className='text-center'>
                                                <b>
                                                    Extrait de registre de commerce && le DFE 
                                                </b>
                                            </h5>
                                        </div>

                                         {/* Extrait de registre de commerce */}
                                         <div className=" row col-lg-12 col-md-12 mx-5 justify-content-between">
                                            <div className='col-lg-6 col-md-6 text-center'>
                                                <p className='text-center'>Extrait de registre de commerce</p>
                                                {/* Si le document est prise en photo */}
                                                {oneLegalDocumentByKycId?.registerPhoto ? 
                                                    <img src={oneLegalDocumentByKycId?.registerPhoto} className="" width={'400'} height={'400'} alt="Not"/> :(
                                                        // Sinon
                                                        <>
                                                            {/* Utilisation de la fonction isPdfLink pour vérifier si un lien est pour un fichier PDF */}
                                                            {isPdfLink(`${API_URL}/${oneLegalDocumentByKycId?.frontIdentityFile}`) ? (
                                                                <>

                                                                    <div className="hero-btn  text-center ">
                                                                    <a
                                                                        className="nav-link btn btn-blue nav-link btn btn-outline-green"
                                                                        role="button"
                                                                        oneLegalDocumentByKycId-toggle="dropdown"
                                                                        aria-haspopup="true"
                                                                        aria-expanded="false"
                                                                        href={`${API_URL}/${oneLegalDocumentByKycId?.registerFile}`} 
                                                                        // download
                                                                        // onClick={handleShow}
                                                                        target="_blank"
                                                                    >
                                                                    <p className="gr-text-8 bgColorblue text-white mb-0">
                                                                        <Icon icon="bx:show-alt" width="50" />
                                                                        Veuillez cliquer ici pour voir le fichier
                                                                    </p>
                                                                    </a>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    {oneLegalDocumentByKycId?.registerFile? <img src={`${API_URL}/${oneLegalDocumentByKycId?.registerFile}`} className="" width={'400'} height={'400'} alt="Recto"/> : "Pas de fichier"}
                                                                </>
                                                            )}
                                                        </>
                                                    )
                                                } 
                                            </div>

                                            {/* Le DFE */}
                                            <div className='col-lg-6 col-md-6 text-center'>
                                                <p className='text-center'>Le DFE</p>
                                                {/* Si le document est prise en photo */}
                                                {oneLegalDocumentByKycId?.dfePhoto? 
                                                    <img src={oneLegalDocumentByKycId?.dfePhoto} className="" width={'400'} height={'400'} alt="Recto"/> :(
                                                        // Sinon
                                                        <>
                                                            {/* Utilisation de la fonction isPdfLink pour vérifier si un lien est pour un fichier PDF */}
                                                            {isPdfLink(`${API_URL}/${oneLegalDocumentByKycId?.dfeFile}`) ? (
                                                                <>
                                                                    <div className="hero-btn  text-center ">
                                                                    <a
                                                                        className="nav-link btn btn-blue nav-link btn btn-outline-green"
                                                                        role="button"
                                                                        oneLegalDocumentByKycId-toggle="dropdown"
                                                                        aria-haspopup="true"
                                                                        aria-expanded="false"
                                                                        href={`${API_URL}/${oneLegalDocumentByKycId?.dfeFile}`}
                                                                        target="_blank"
                                                                    >
                                                                    <p className="gr-text-8 bgColorblue text-white mb-0">
                                                                        <Icon icon="bx:show-alt" width="50" />
                                                                        Veuillez cliquer ici pour voir le fichier
                                                                    </p>
                                                                    </a>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    {oneLegalDocumentByKycId?.dfeFile? <img src={`${API_URL}/${oneLegalDocumentByKycId?.dfeFile}`} width={'400'} height={'400'} alt="Verso"/> : "Pas de verso de justificatif d'identité"}
                                                                </>
                                                            )}
                                                        </>
                                                    )
                                                }
                                            </div>
                                        </div>
                                        {/*Fin Extrait de registre de commerce && DFE */}


                                        {/*Copie des statuts && Délégation de pouvoirs*/}
                                        <div className='mt-5 mb-3'>
                                            <h5 className='text-center'>
                                                <b>
                                                    Copie des statuts && Délégation de pouvoirs
                                                </b>
                                            </h5>
                                        </div>

                                         {/* Copie des statuts */}
                                         <div className=" row col-lg-12 col-md-12 mx-5 justify-content-between">
                                            <div className='col-lg-6 col-md-6 text-center'>
                                                <p className='text-center'>Copie des statuts</p>
                                                {/* Si le document est prise en photo */}
                                                {oneLegalDocumentByKycId?.copyStatutesPhoto? 
                                                    <img src={oneLegalDocumentByKycId?.copyStatutesPhoto} className="" width={'400'} height={'400'} /> :(
                                                        // Sinon
                                                        <>
                                                            {/* Utilisation de la fonction isPdfLink pour vérifier si un lien est pour un fichier PDF */}
                                                            {isPdfLink(`${API_URL}/${oneLegalDocumentByKycId?.copyStatutesFile}`) ? (
                                                                <>
                                                                    <div className="hero-btn  text-center ">
                                                                    <a
                                                                        className="nav-link btn btn-blue nav-link btn btn-outline-green"
                                                                        role="button"
                                                                        oneLegalDocumentByKycId-toggle="dropdown"
                                                                        aria-haspopup="true"
                                                                        aria-expanded="false"
                                                                        href={`${API_URL}/${oneLegalDocumentByKycId?.copyStatutesFile}`} 
                                                                        // download
                                                                        // onClick={handleShow}
                                                                        target="_blank"
                                                                    >
                                                                    <p className="gr-text-8 bgColorblue text-white mb-0">
                                                                        <Icon icon="bx:show-alt" width="50" />
                                                                        Veuillez cliquer ici pour voir le fichier
                                                                    </p>
                                                                    </a>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    {oneLegalDocumentByKycId?.copyStatutesFile? <img src={`${API_URL}/${oneLegalDocumentByKycId?.copyStatutesFile}`} className="" width={'400'} height={'400'} alt="Recto"/> : "Pas de fichier"}
                                                                </>
                                                            )}
                                                        </>
                                                    )
                                                } 
                                            </div>

                                            {/* Délégation de pouvoirs */}
                                            <div className='col-lg-6 col-md-6 text-center'>
                                                <p className='text-center'>Délégation de pouvoirs</p>
                                                {/* Si le document est prise en photo */}
                                                {oneLegalDocumentByKycId?.delegationPowersPhoto? 
                                                    <img src={oneLegalDocumentByKycId?.delegationPowersPhoto} className="" width={'400'} height={'400'}/> :(
                                                        // Sinon
                                                        <>
                                                            {/* Utilisation de la fonction isPdfLink pour vérifier si un lien est pour un fichier PDF */}
                                                            {isPdfLink(`${API_URL}/${oneLegalDocumentByKycId?.delegationPowersFile}`) ? (
                                                                <>
                                                                    <div className="hero-btn  text-center ">
                                                                    <a
                                                                        className="nav-link btn btn-blue nav-link btn btn-outline-green"
                                                                        role="button"
                                                                        oneLegalDocumentByKycId-toggle="dropdown"
                                                                        aria-haspopup="true"
                                                                        aria-expanded="false"
                                                                        href={`${API_URL}/${oneLegalDocumentByKycId?.delegationPowersFile}`}
                                                                        target="_blank"
                                                                    >
                                                                    <p className="gr-text-8 bgColorblue text-white mb-0">
                                                                        <Icon icon="bx:show-alt" width="50" />
                                                                        Veuillez cliquer ici pour voir le fichier
                                                                    </p>
                                                                    </a>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    {oneLegalDocumentByKycId?.delegationPowersFile? <img src={`${API_URL}/${oneLegalDocumentByKycId?.delegationPowersFile}`} width={'400'} height={'400'} alt="Verso"/> : "Pas de fichier"}
                                                                </>
                                                            )}
                                                        </>
                                                    )
                                                }
                                            </div>
                                        </div>
                                        {/*Fin Copie des statuts && Délégation de pouvoirs */}
                                        

                                        {/*PV de nomination des dirigeants publication journal officiel && Plan de localisation géographique*/}
                                        <div className='mt-5 mb-3'>
                                            <h5 className='text-center'>
                                                <b>
                                                    PV de nomination des dirigeants publication journal officiel && Plan de localisation géographique
                                                </b>
                                            </h5>
                                        </div>

                                         {/* PV de nomination des dirigeants publication journal officiel */}
                                         <div className=" row col-lg-12 col-md-12 mx-5 justify-content-between">
                                            <div className='col-lg-6 col-md-6 text-center'>
                                                <p className='text-center'>PV de nomination des dirigeants publication journal officiel</p>
                                                {/* Si le document est prise en photo */}
                                                {oneLegalDocumentByKycId?.pvAppointmentPhoto? 
                                                    <img src={oneLegalDocumentByKycId?.pvAppointmentPhoto} className="" width={'400'} height={'400'} /> :(
                                                        // Sinon
                                                        <>
                                                            {/* Utilisation de la fonction isPdfLink pour vérifier si un lien est pour un fichier PDF */}
                                                            {isPdfLink(`${API_URL}/${oneLegalDocumentByKycId?.pvAppointmentFile}`) ? (
                                                                <>
                                                                    <div className="hero-btn  text-center ">
                                                                    <a
                                                                        className="nav-link btn btn-blue nav-link btn btn-outline-green"
                                                                        role="button"
                                                                        oneLegalDocumentByKycId-toggle="dropdown"
                                                                        aria-haspopup="true"
                                                                        aria-expanded="false"
                                                                        href={`${API_URL}/${oneLegalDocumentByKycId?.pvAppointmentFile}`} 
                                                                        // download
                                                                        // onClick={handleShow}
                                                                        target="_blank"
                                                                    >
                                                                    <p className="gr-text-8 bgColorblue text-white mb-0">
                                                                        <Icon icon="bx:show-alt" width="50" />
                                                                        Veuillez cliquer ici pour voir le fichier
                                                                    </p>
                                                                    </a>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    {oneLegalDocumentByKycId?.pvAppointmentFile? <img src={`${API_URL}/${oneLegalDocumentByKycId?.pvAppointmentFile}`} className="" width={'400'} height={'400'} alt="Recto"/> : "Pas de fichier"}
                                                                </>
                                                            )}
                                                        </>
                                                    )
                                                } 
                                            </div>

                                            {/* Plan de localisation géographique */}
                                            <div className='col-lg-6 col-md-6 text-center'>
                                                <p className='text-center'>Plan de localisation géographique</p>
                                                {/* Si le document est prise en photo */}
                                                {oneLegalDocumentByKycId?.mapLocationPhoto? 
                                                    <img src={oneLegalDocumentByKycId?.mapLocationPhoto} className="" width={'400'} height={'400'}/> :(
                                                        // Sinon
                                                        <>
                                                            {/* Utilisation de la fonction isPdfLink pour vérifier si un lien est pour un fichier PDF */}
                                                            {isPdfLink(`${API_URL}/${oneLegalDocumentByKycId?.mapLocationFile}`) ? (
                                                                <>
                                                                    <div className="hero-btn  text-center ">
                                                                    <a
                                                                        className="nav-link btn btn-blue nav-link btn btn-outline-green"
                                                                        role="button"
                                                                        oneLegalDocumentByKycId-toggle="dropdown"
                                                                        aria-haspopup="true"
                                                                        aria-expanded="false"
                                                                        href={`${API_URL}/${oneLegalDocumentByKycId?.mapLocationFile}`}
                                                                        target="_blank"
                                                                    >
                                                                    <p className="gr-text-8 bgColorblue text-white mb-0">
                                                                        <Icon icon="bx:show-alt" width="50" />
                                                                        Veuillez cliquer ici pour voir le fichier
                                                                    </p>
                                                                    </a>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    {oneLegalDocumentByKycId?.mapLocationFile? <img src={`${API_URL}/${oneLegalDocumentByKycId?.mapLocationFile}`} width={'400'} height={'400'} alt="Verso"/> : "Pas de fichier"}
                                                                </>
                                                            )}
                                                        </>
                                                    )
                                                }
                                            </div>
                                        </div>
                                        {/*Fin PV de nomination des dirigeants publication journal officiel && Plan de localisation géographique*/}

                                        
                                        {/*Facture eau / électricité ou contrat de bail && La copie du justificatif de pouvoir conféré au signataire*/}
                                        <div className='mt-5 mb-3'>
                                            <h5 className='text-center'>
                                                <b>
                                                    Facture eau / électricité ou contrat de bail && La copie du justificatif de pouvoir conféré au signataire
                                                </b>
                                            </h5>
                                        </div>

                                         {/* Facture eau / électricité ou contrat de bail */}
                                         <div className=" row col-lg-12 col-md-12 mx-5 justify-content-between">
                                            <div className='col-lg-6 col-md-6 text-center'>
                                                <p className='text-center'>Facture eau / électricité ou contrat de bail</p>
                                                {/* Si le document est prise en photo */}
                                                {oneLegalDocumentByKycId?.facturePhoto? 
                                                    <img src={oneLegalDocumentByKycId?.facturePhoto} className="" width={'400'} height={'400'} /> :(
                                                        // Sinon
                                                        <>
                                                            {/* Utilisation de la fonction isPdfLink pour vérifier si un lien est pour un fichier PDF */}
                                                            {isPdfLink(`${API_URL}/${oneLegalDocumentByKycId?.factureFile}`) ? (
                                                                <>
                                                                    <div className="hero-btn  text-center ">
                                                                    <a
                                                                        className="nav-link btn btn-blue nav-link btn btn-outline-green"
                                                                        role="button"
                                                                        oneLegalDocumentByKycId-toggle="dropdown"
                                                                        aria-haspopup="true"
                                                                        aria-expanded="false"
                                                                        href={`${API_URL}/${oneLegalDocumentByKycId?.factureFile}`} 
                                                                        // download
                                                                        // onClick={handleShow}
                                                                        target="_blank"
                                                                    >
                                                                    <p className="gr-text-8 bgColorblue text-white mb-0">
                                                                        <Icon icon="bx:show-alt" width="50" />
                                                                        Veuillez cliquer ici pour voir le fichier
                                                                    </p>
                                                                    </a>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    {oneLegalDocumentByKycId?.factureFile? <img src={`${API_URL}/${oneLegalDocumentByKycId?.factureFile}`} className="" width={'400'} height={'400'} alt="Recto"/> : "Pas de fichier"}
                                                                </>
                                                            )}
                                                        </>
                                                    )
                                                } 
                                            </div>

                                            {/* La copie du justificatif de pouvoir conféré au signataire */}
                                            <div className='col-lg-6 col-md-6 text-center'>
                                                <p className='text-center'>La copie du justificatif de pouvoir conféré au signataire</p>
                                                {/* Si le document est prise en photo */}
                                                {oneLegalDocumentByKycId?.proofPowerPhoto? 
                                                    <img src={oneLegalDocumentByKycId?.proofPowerPhoto} className="" width={'400'} height={'400'}/> :(
                                                        // Sinon
                                                        <>
                                                            {/* Utilisation de la fonction isPdfLink pour vérifier si un lien est pour un fichier PDF */}
                                                            {isPdfLink(`${API_URL}/${oneLegalDocumentByKycId?.proofPowerFile}`) ? (
                                                                <>
                                                                    <div className="hero-btn  text-center ">
                                                                    <a
                                                                        className="nav-link btn btn-blue nav-link btn btn-outline-green"
                                                                        role="button"
                                                                        oneLegalDocumentByKycId-toggle="dropdown"
                                                                        aria-haspopup="true"
                                                                        aria-expanded="false"
                                                                        href={`${API_URL}/${oneLegalDocumentByKycId?.proofPowerFile}`}
                                                                        target="_blank"
                                                                    >
                                                                    <p className="gr-text-8 bgColorblue text-white mb-0">
                                                                        <Icon icon="bx:show-alt" width="50" />
                                                                        Veuillez cliquer ici pour voir le fichier
                                                                    </p>
                                                                    </a>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    {oneLegalDocumentByKycId?.proofPowerFile? <img src={`${API_URL}/${oneLegalDocumentByKycId?.proofPowerFile}`} width={'400'} height={'400'} alt="Verso"/> : "Pas de fichier"}
                                                                </>
                                                            )}
                                                        </>
                                                    )
                                                }
                                            </div>
                                        </div>
                                        {/*Fin Facture eau / électricité ou contrat de bail && La copie du justificatif de pouvoir conféré au signataire*/}

                                        {/*Justificatif d'identité du signataire du bulletin de souscription */}
                                        <div className='mt-5 mb-3'>
                                            <h5 className='text-center'>
                                                <b>
                                                    Justificatif d'identité du signataire du bulletin de souscription
                                                </b>
                                            </h5>
                                        </div>
                                        <div className='mt-3 text-center'>
                                            <b>
                                                Date d'expiration du document d’identité
                                            </b><br/>
                                            {oneLegalDocumentByKycId?.expirationDate? (<p className='my-0'><Icon icon="bx:check-double" color="#208454" />{formatDate(oneLegalDocumentByKycId.expirationDate)}</p>): (<p className='my-2'><Icon icon="bx:x" className='colorRed' />Aucune réponse</p>)}
                                        </div>
                                         {/* Documents de justificatif d'identité */}
                                         <div className=" row col-lg-12 col-md-12 mx-5 justify-content-between">
                                            <div className='col-lg-6 col-md-6 text-center'>
                                                <p className='text-center'>Recto du justificatif d'identité du signataire du bulletin de souscription </p>
                                                {/* Si le document est prise en photo */}
                                                {oneLegalDocumentByKycId?.frontIdentityPhoto? 
                                                    <img src={oneLegalDocumentByKycId?.frontIdentityPhoto} className="" width={'400'} height={'400'} alt="Recto"/> :(
                                                        // Sinon
                                                        <>
                                                            {/* Utilisation de la fonction isPdfLink pour vérifier si un lien est pour un fichier PDF */}
                                                            {isPdfLink(`${API_URL}/${oneLegalDocumentByKycId?.frontIdentityFile}`) ? (
                                                                <>
                                                                    <div className="hero-btn  text-center ">
                                                                    <a
                                                                        className="nav-link btn btn-blue nav-link btn btn-outline-green"
                                                                        role="button"
                                                                        oneLegalDocumentByKycId-toggle="dropdown"
                                                                        aria-haspopup="true"
                                                                        aria-expanded="false"
                                                                        href={`${API_URL}/${oneLegalDocumentByKycId?.frontIdentityFile}`} 
                                                                        // download
                                                                        // onClick={handleShow}
                                                                        target="_blank"
                                                                    >
                                                                    <p className="gr-text-8 bgColorblue text-white mb-0">
                                                                        <Icon icon="bx:show-alt" width="50" />
                                                                        Veuillez cliquer ici pour voir le fichier
                                                                    </p>
                                                                    </a>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    {oneLegalDocumentByKycId?.frontIdentityFile? <img src={`${API_URL}/${oneLegalDocumentByKycId?.frontIdentityFile}`} className="" width={'400'} height={'400'} alt="Recto"/> : "Pas de recto de justificatif d'identité"}
                                                                </>
                                                            )}
                                                        </>
                                                    )
                                                } 
                                            </div>

                                            <div className='col-lg-6 col-md-6 text-center'>
                                                <p className='text-center'>Verso du justificatif d'identité du signataire du bulletin de souscription</p>
                                                {/* Si le document est prise en photo */}
                                                {oneLegalDocumentByKycId?.backIdentityPhoto? 
                                                    <img src={oneLegalDocumentByKycId?.backIdentityPhoto} className="" width={'400'} height={'400'} alt="Recto"/> :(
                                                        // Sinon
                                                        <>
                                                            {/* Utilisation de la fonction isPdfLink pour vérifier si un lien est pour un fichier PDF */}
                                                            {isPdfLink(`${API_URL}/${oneLegalDocumentByKycId?.backIdentityFile}`) ? (
                                                                <>
                                                                    <div className="hero-btn  text-center ">
                                                                    <a
                                                                        className="nav-link btn btn-blue nav-link btn btn-outline-green"
                                                                        role="button"
                                                                        oneLegalDocumentByKycId-toggle="dropdown"
                                                                        aria-haspopup="true"
                                                                        aria-expanded="false"
                                                                        href={`${API_URL}/${oneLegalDocumentByKycId?.backIdentityFile}`}
                                                                        target="_blank"
                                                                    >
                                                                    <p className="gr-text-8 bgColorblue text-white mb-0">
                                                                        <Icon icon="bx:show-alt" width="50" />
                                                                        Veuillez cliquer ici pour voir le fichier
                                                                    </p>
                                                                    </a>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    {oneLegalDocumentByKycId?.backIdentityFile? <img src={`${API_URL}/${oneLegalDocumentByKycId?.backIdentityFile}`} width={'400'} height={'400'} alt="Verso"/> : "Pas de verso de justificatif d'identité"}
                                                                </>
                                                            )}
                                                        </>
                                                    )
                                                }
                                            </div>
                                        </div>
                                        {/*Fin Documents de justificatif d'identité */}



                                    </>
                                ):("")}
                            </div>

                        </div>
                    </div>
                    {/* <div className='col-lg-1 col-md-1'></div> */}
                </div>
            </div>
        </div>




         {/* ********************************************************************************** */}
            {/* MODAL DE LA VALIDATION DES DIFFERENTES PARTIES DE KYC'*/}
        {/* ********************************************************************************** */}
        <Modal show={showEvaluer} className="mt-15" onHide={handleCloseEvaluer}>
            <Modal.Header closeButton className='bgColorGreen'>
                <Modal.Title className="text-white" >Validation de KYC</Modal.Title>                
            </Modal.Header>
                <Form role="form">
                    <Modal.Body>
                        <div className='row justify-content-between'>
                            {/* Les questionnaires */}
                            <div className='form-group my-3 col-lg-6 col-md-6'>
                                <label className="mx-2  mb-2" htmlFor='validQuiz'>
                                    Les questionnaires 
                                </label>
                                {!oneKycForEntreprise?.validQuiz==1 ? (
                                    <select 
                                        className="form-control"
                                        id="validQuiz"
                                        required
                                        defaultValue={validQuiz} 
                                        onChange={(event)=>setValidQuiz(event.target.value)}
                                    >
                                        <option defaultValue="">Choisissez une option</option>
                                        <optgroup className='single-cryptocurrency-box'>
                                            <option  value="true">Valider</option>
                                            <option  value="false">Non valider</option>
                                        </optgroup>
                                    </select>
                                ):(<p className='colorGreen mx-2'><b>Déjà validé</b></p>)}
                            </div>

                            {/* Les documents légaux */}
                            <div className='form-group my-3 col-lg-6 col-md-6'>
                                <label className="mx-2  mb-2" htmlFor='validLegalDocuments'>
                                    Les documents légaux
                                </label>
                                {!oneKycForEntreprise?.validLegalDocuments==1 ? (
                                    <select 
                                        className="form-control"
                                        id="validLegalDocuments"
                                        required
                                        defaultValue={validLegalDocuments} 
                                        onChange={(event)=>setValidLegalDocuments(event.target.value)}
                                    >
                                        <option defaultValue="">Choisissez une option</option>
                                        <optgroup className='single-cryptocurrency-box'>
                                            <option  value="true">Valider</option>
                                            <option  value="false">Non valider</option>
                                        </optgroup>
                                    </select>
                                ):(<p className='colorGreen mx-2'><b>Déjà validé</b></p>)}
                            </div>

                            {/* Justificatif d'identité */}
                            <div className='form-group my-3 col-lg-6 col-md-6'>
                                <label className="mx-2  mb-2" htmlFor='validIdentity'>
                                    Justificatif d'identité
                                </label>
                                {!oneKycForEntreprise?.validIdentity==1 ? (
                                    <select 
                                        className="form-control"
                                        id="validIdentity"
                                        required
                                        defaultValue={validIdentity} 
                                        onChange={(event)=>setValidIdentity(event.target.value)}
                                    >
                                        <option defaultValue="">Choisissez une option</option>
                                        <optgroup className='single-cryptocurrency-box'>
                                            <option  value="true">Valider</option>
                                            <option  value="false">Non valider</option>
                                        </optgroup>
                                    </select>
                                ):(<p className='colorGreen mx-2'><b>Déjà validé</b></p>)}

                            </div>

                            {/* Justificatif de domicile */}
                            <div className='form-group my-3 col-lg-6 col-md-6'>
                                <label className="mx-2  mb-2" htmlFor='validResidence'>
                                    Justificatif de domicile
                                </label>
                                {!oneKycForEntreprise?.validResidence==1 ? (
                                    <select 
                                        className="form-control"
                                        id="validResidence"
                                        required
                                        defaultValue={validResidence} 
                                        onChange={(event)=>setValidResidence(event.target.value)}
                                    >
                                        <option defaultValue="">Choisissez une option</option>
                                        <optgroup className='single-cryptocurrency-box'>
                                            <option  value="true">Valider</option>
                                            <option  value="false">Non valider</option>
                                        </optgroup>
                                    </select>
                                ):(<p className='colorGreen mx-2'><b>Déjà validé</b></p>)}

                            </div>

                            {/* Photo de l'utilisateur */}
                            <div className='form-group my-3 col-lg-6 col-md-6'>
                                <label className="mx-2  mb-2" htmlFor='validPhoto'>
                                    Photo de l'utilisateur
                                </label>
                                {!oneKycForEntreprise?.validPhoto==1 ? ( 
                                    <select 
                                        className="form-control"
                                        id="validPhoto"
                                        required
                                        defaultValue={validPhoto} 
                                        onChange={(event)=>setValidPhoto(event.target.value)}
                                    >
                                        <option defaultValue="">Choisissez une option</option>
                                        <optgroup className='single-cryptocurrency-box'>
                                            <option  value="true">Valider</option>
                                            <option  value="false">Non valider</option>
                                        </optgroup>
                                    </select>
                                ):(<p className='colorGreen mx-2'><b>Déjà validé</b></p>)}

                            </div>

                            {/* Signature de l'utilisateur */}
                            <div className='form-group my-3 col-lg-6 col-md-6'>
                                <label className="mx-2  mb-2" htmlFor='validSignature'>
                                    Signature de l'utilisateur
                                </label>
                                {!oneKycForEntreprise?.validSignature==1 ? (
                                    <select 
                                        className="form-control"
                                        id="validSignature"
                                        required
                                        defaultValue={validSignature} 
                                        onChange={(event)=>setValidSignature(event.target.value)}
                                    >
                                        <option defaultValue="">Choisissez une option</option>
                                        <optgroup className='single-cryptocurrency-box'>
                                            <option  value="true">Valider</option>
                                            <option  value="false">Non valider</option>
                                        </optgroup>
                                    </select>
                                ):(<p className='colorGreen mx-2'><b>Déjà validé</b></p>)}

                            </div>
                        </div>
                       
                        <div className="form-group mb-6">
                            <textarea
                                className="form-control gr-text-11 border mt-3 bg-white"
                                type="text"
                                id="contenu"
                                placeholder="Décrivez le résultat ici"
                                defaultValue={pattern} 
                                onChange={(event)=>setPattern(event.target.value)}
                            />
                        </div>


                        

                    </Modal.Body>
                    <Modal.Footer>
                        <Button className="text-white" color="danger" onClick={handleCloseEvaluer}>
                            Fermer
                        </Button>
                        <Button  type='button'  color="success" onClick={validKycParticular}  disabled={isLoggingIn}>
                            Envoyer
                        </Button>
                    </Modal.Footer>
                </Form>
        </Modal>
        {/* *****************************************FIN****************************************** */}
            




        {/* ********************************************************************************** */}
            {/* MODAL POUR VOIR DES DIFFERENTES PARTIES DE KYC'*/}
        {/* ********************************************************************************** */}
        <Modal show={showInfosKyc} className="mt-15" onHide={handleCloseInfosKyc}>
            <Modal.Header closeButton className='bgColorblue'>
                <Modal.Title className="text-white" >Voir infos de KYC</Modal.Title>                
            </Modal.Header>
            {etape===1 ? (
                <>
                    <Modal.Body>
                        <div className="input-group flex-nowrap">
                            <div className='col-lg-12 col-md-12 row justify-content-between'>
                                <div className='input-group-alternative my-3 '>
                                1) Voulez-vous confirmer le paiement 
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className="text-white" color="danger" onClick={handleCloseInfosKyc}>
                            Fermer
                        </Button>
                    </Modal.Footer>
                </>
            ): ("")}

            {etape===2 ? (
                <Form role="form">
                    <Modal.Body>
                            <div className="input-group flex-nowrap">
                                <div className='col-lg-12 col-md-12 row justify-content-between'>
                                    <div className='input-group-alternative my-3 '>
                                    1) Voulez-vous confirmer le paiement 
                                    </div>
                                    <div className='input-group-alternative my-3 '>
                                        1) Voulez-vous confirmer le paiement 
                                    </div>
                                </div>
                            </div>
                            <div className="form-group mb-6">
                            <textarea
                                className="form-control gr-text-11 border mt-3 bg-white"
                                type="text"
                                id="contenu"
                                placeholder="Raison sociale"
                                // defaultValue={socialRaison} 
                                // onChange={(event)=>setSocialRaison(event.target.value)}
                            />
                            </div>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button className="text-white" color="danger" onClick={handleCloseInfosKyc}>
                            Fermer
                        </Button>
                        <Button  type='button'  color="success"  disabled={isLoggingIn}>
                            Valider
                        </Button>
                    </Modal.Footer>
                </Form>
            ): ("")}

            {etape===3 ? (
                <Form role="form">
                    <Modal.Body>
                            <div className="input-group flex-nowrap">
                                <div className='col-lg-12 col-md-12 row justify-content-between'>
                                    <div className='input-group-alternative my-3 '>
                                    1) Voulez-vous confirmer le paiement 
                                    </div>
                                    <div className='input-group-alternative my-3 '>
                                        1) Voulez-vous confirmer le paiement 
                                    </div>
                                </div>
                            </div>
                            <div className="form-group mb-6">
                            <textarea
                                className="form-control gr-text-11 border mt-3 bg-white"
                                type="text"
                                id="contenu"
                                placeholder="Raison sociale"
                                // defaultValue={socialRaison} 
                                // onChange={(event)=>setSocialRaison(event.target.value)}
                            />
                            </div>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button className="text-white" color="danger" onClick={handleCloseInfosKyc}>
                            Fermer
                        </Button>
                        <Button  type='button'  color="success"  disabled={isLoggingIn}>
                            Valider
                        </Button>
                    </Modal.Footer>
                </Form>
            ): ("")}

            {etape===4 ? (
                <Form role="form">
                    <Modal.Body>
                            <div className="input-group flex-nowrap">
                                <div className='col-lg-12 col-md-12 row justify-content-between'>
                                    <div className='input-group-alternative my-3 '>
                                    1) Voulez-vous confirmer le paiement 
                                    </div>
                                    <div className='input-group-alternative my-3 '>
                                        1) Voulez-vous confirmer le paiement 
                                    </div>
                                </div>
                            </div>
                            <div className="form-group mb-6">
                            <textarea
                                className="form-control gr-text-11 border mt-3 bg-white"
                                type="text"
                                id="contenu"
                                placeholder="Raison sociale"
                                // defaultValue={socialRaison} 
                                // onChange={(event)=>setSocialRaison(event.target.value)}
                            />
                            </div>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button className="text-white" color="danger" onClick={handleCloseInfosKyc}>
                            Fermer
                        </Button>
                        <Button  type='button'  color="success"  disabled={isLoggingIn}>
                            Valider
                        </Button>
                    </Modal.Footer>
                </Form>
            ): ("")}

            {etape===5 ? (
                <Form role="form">
                    <Modal.Body>
                            <div className="input-group flex-nowrap">
                                <div className='col-lg-12 col-md-12 row justify-content-between'>
                                    <div className='input-group-alternative my-3 '>
                                    1) Voulez-vous confirmer le paiement 
                                    </div>
                                    <div className='input-group-alternative my-3 '>
                                        1) Voulez-vous confirmer le paiement 
                                    </div>
                                </div>
                            </div>
                            <div className="form-group mb-6">
                            <textarea
                                className="form-control gr-text-11 border mt-3 bg-white"
                                type="text"
                                id="contenu"
                                placeholder="Raison sociale"
                                // defaultValue={socialRaison} 
                                // onChange={(event)=>setSocialRaison(event.target.value)}
                            />
                            </div>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button className="text-white" color="danger" onClick={handleCloseInfosKyc}>
                            Fermer
                        </Button>
                        <Button  type='button'  color="success"  disabled={isLoggingIn}>
                            Valider
                        </Button>
                    </Modal.Footer>
                </Form>
            ): ("")}
        </Modal>
        {/* *****************************************FIN****************************************** */}
            




    </>
  );
};

export default ValidEntreprise;
