import { useState, useEffect } from 'react';
import React from "react";
import moment from 'moment';
// import Link from "../../Link";
import Link from 'next/link';
import { Icon } from '@iconify/react';
import copy from "copy-to-clipboard"; 
import Swal from 'sweetalert2'


// Pour Magic
import { magic } from "../../../magic";
import { ethers } from "ethers";
import Loading from "../../../components/loading";
import Router from "next/router";
import { Table } from '@nextui-org/react';


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
    Modal,
    Row,
    Col,
  } from "reactstrap";

// FIN

const CHistoriqueStablecoin = () => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API
    const HASH_TX = process.env.NEXT_PUBLIC_HASH_TX
    const ADDRESS_TX = process.env.NEXT_PUBLIC_ADDRESS_TX

    const [currentUser, setCurrentUser] = useState();
    const [provider, setProvider] = useState(null);

    const [dataAllHistoricalByUserEmail, setDataAllHistoricalByUserEmail] = useState();
    const [copyAddress, setCopyAddress] = useState()
    const [successCopy, setSuccessCopy] = useState()
    


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
              
            }
        })();
    }, [provider, magic]);
    //  Fin


    /**
     * Hook d'effet pour récupérer et définir les informations de l'utilisateur connecté.
     * @returns {void}
     */
     useEffect(async () => {
        const token = localStorage.getItem('tokenEnCours');
        
        /**
         * Fonction pour obtenir l'utilisateur connecté et mettre à jour l'état.
         * @returns {void}
         */
        const getUserSignIn = async () => {
            const result = await fetch(`${API_URL}/api/user/find-user-sign-in`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((result) => result.json())
            .then((data) => {
                setCurrentUser(data);
            });
        };

        await getUserSignIn();
    }, []);
    // FIN


    // FONCTION POUR RECUPERER LES TARIFS DES ABONNEMENTS 
    useEffect(() => {
        // Obtenir le token en cours
        const token = localStorage.getItem('tokenEnCours');
        const getAllHistoricalByUserEmail = async () => {
        try {
            const result = await fetch(`${API_URL}/api/historical/find-all-historical-by-user-email?email=${currentUser?.email}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
  
            },
            });
  
            if (!result.ok) {
            throw new Error('Failed to fetch user data');
            }
            const data = await result.json();
            setDataAllHistoricalByUserEmail(data);
        } catch (error) {
            // Handle errors appropriately, e.g., set an error state.
            console.error('Error fetching user data:', error);
        }
        };
  
        getAllHistoricalByUserEmail();
        
    }, [currentUser?.id]);
    // FIN


    /**
     * Formate un nombre en tronquant à deux décimales et en ajoutant un séparateur de milliers (espace).
     * @param {number} number - Le nombre à formater.
     * @returns {string} - Le nombre formaté en tant que chaîne de caractères.
     * @throws {Error} - Si la fonction est appelée avec autre chose qu'un nombre.
     */
     function formatNumber(number) {
        if (typeof number !== 'number') {
            throw new Error('La fonction doit être appelée avec un nombre.');
        }

        // Tronquer le nombre à deux décimales
        const truncatedNumber = Math.floor(number * 100) / 100;

        // Ajouter un séparateur de milliers (espace)
        const formattedNumber = truncatedNumber.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

        return formattedNumber;
    }

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
        // const maDate = moment(_updatedAt).format('DD/MM/YYYY');
        const maDate = moment(_updatedAt).format('DD/MM/YYYY à HH:mm');
        return  maDate
    }
    //  FIN

    // FONCTION POUR COPIER UNE ADRESSE PUBLIC 
    const copyToClipboard = () => {
        copy(copyAddress);
        setSuccessCopy("Adresse copiée avec succès !");
        Swal.fire({
            position: 'center',
            icon: 'success',
            html: `<p> Adresse copiée avec succès</p>`,
            showConfirmButton: false,
            timer: 1000
        });
        // setTimeout(() => {
        //     setSuccessCopy("");
        // }, 1000)
    }
    // FIN

    return (
        <>
            {/* {currentUser?.profileId==2 || currentUser?.profileId==3?( */}

                <>
                    <div className='' >
                        <div className=' mx-15'>
                            <div className='py-10'>
                                <h1 className='text-center'>Historiques de stablecoin</h1>
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
                            {!dataAllHistoricalByUserEmail?.length==0 ? (
                                <Table
                                    aria-label="Example table with static content"
                                    css={{
                                        height: "auto",
                                        minWidth: "100%",
                                    }}
                                >
                                    <Table.Header>
                                        {/* <Table.Column><p className="gr-text-8 pt-3 pb-0 mx-3 ">Nom & prenom </p></Table.Column> */}
                                        <Table.Column><p className="gr-text-8 pt-3 pb-0 ">type</p></Table.Column>
                                        <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Actif</p></Table.Column>
                                        <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Nom</p></Table.Column>
                                        <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Hash de transaction</p></Table.Column>
                                        <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Adresse</p></Table.Column>
                                        <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Montant<br/>Date</p></Table.Column>
                                    </Table.Header>
                                    <Table.Body>
                                        {dataAllHistoricalByUserEmail?.map((data,) => (
                                            <Table.Row key={data?.id}>                       
                                                <Table.Cell ><small className=" py-0 ">{data?.typeTransaction}</small></Table.Cell>
                                                <Table.Cell ><small className=" py-0 ">{data?.activeSymbol}</small></Table.Cell>
                                                <Table.Cell >
                                                    <small className=" py-0 ">
                                                        {currentUser?.address != data?.senderAddress ? (
                                                            <>
                                                                {displayLimitedContent(data?.nameSender,20,"characters")}
                                                            </>
                                                        ):currentUser?.address != data?.receiverAddress ? (
                                                            <>
                                                                {displayLimitedContent(data?.nameReceiver,20,"characters")}
                                                            </>
                                                        ):("")}
                                                    </small>
                                                </Table.Cell>
                                                <Table.Cell ><small className=" py-0 d-flex">{displayLimitedContent(data?.hash, 20, "characters")}<a className=" aNoDecor " target="_blank"  href={`${HASH_TX}/${data?.hash}`}>Détails</a></small></Table.Cell>
                                                <Table.Cell >
                                                    <small className=" py-0 ">
                                                        {currentUser?.address != data?.senderAddress ? (
                                                            <>
                                                                {displayLimitedContent(data?.senderAddress,20,'characters')} 
                                                                <button onClick={()=>setCopyAddress(data?.senderAddress)}><Icon onClick={copyToClipboard} icon="bx:copy"  width="15" /></button><br/>
                                                            
                                                            </>
                                                        ) :currentUser?.address != data?.receiverAddress ? (
                                                            <>
                                                                {displayLimitedContent(data?.receiverAddress,20,"characters")}

                                                                <button onClick={()=>setCopyAddress(data?.receiverAddress)}>
                                                                    <Icon onClick={copyToClipboard} icon="bx:copy"  width="15" />
                                                                </button><br/><i className="colorGreen"></i>
                                                            </>
                                                        ):("")}

                                                       
                                                    </small>
                                                </Table.Cell>
                                                <Table.Cell >
                                                    <small className=" py-0 ">
                                                    {currentUser?.address != data?.senderAddress ? (
                                                            <>
                                                                <i className='colorGreen'> + {formatNumber(parseFloat(data?.amount))}</i>
                                                            </>
                                                        ):currentUser?.address != data?.receiverAddress ? (
                                                            <>
                                                                <i className='colorRed'> - {formatNumber(parseFloat(data?.amount))}</i>
                                                            </>
                                                    ):("")}
                                                    
                                                    <br/>{formatDate(data?.createdAt)}
                                                    </small>
                                                    {/* <small className=" py-0 ">
                                                        {formatNumber(parseFloat(data?.amount))}<br/>{formatDate(data?.createdAt)}
                                                    </small> */}
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
                            ) : (
                                <p className='colorRed text-center m-3'>Aucune transaction effectuée</p>
                            )}
                        </div>
                    </div>
                </>
            {/* ):(
                <span className="text-center bg-default-2 btn-bottom-text  d-block gr-text-5 text-blackish-blue gr-opacity-10 my-35">
                    <Loading/>
                </span>
            )} */}
        </>
    );
};

export default CHistoriqueStablecoin;
