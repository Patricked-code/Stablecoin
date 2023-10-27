import { useState, useEffect } from 'react';
import React from "react";


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


    const [currentUser, setCurrentUser] = useState();
    const [provider, setProvider] = useState(null);


    


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

              // Obtenir l'utilisateur connecté 
              const token = localStorage.getItem('tokenEnCours')

                const getUser = async () => {
                  const result = await fetch(`${API_URL}/api/user/find-user-sign-in`, {
                      headers: {
                      'Content-Type': 'application/json',
                      Authorization:  `Bearer ${token}`,

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
                            <Table
                                aria-label="Example table with static content"
                                css={{
                                    height: "auto",
                                    minWidth: "100%",
                                }}
                            >
                                <Table.Header>
                                    {/* <Table.Column><p className="gr-text-8 pt-3 pb-0 mx-3 ">Nom & prenom </p></Table.Column> */}
                                    <Table.Column><p className="gr-text-8 pt-3 pb-0 ">type<br/>Actif</p></Table.Column>
                                    <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Expéditeur<br/>Récepteur<br/></p></Table.Column>
                                    <Table.Column><p className="gr-text-8 pt-3 pb-0 text-center">Adresse expéditeur<br/>Adresse recepteur<br/>Hash de transaction</p></Table.Column>
                                    <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Montant<br/>Date</p></Table.Column>
                                </Table.Header>
                                <Table.Body>
                                    {/* {allKycForParticular?.map((data) => ( */}
                                        <Table.Row >                       
                                            <Table.Cell ><small className=" py-0 ">Transfert<br/>KOREE</small></Table.Cell>
                                            <Table.Cell ><small className=" py-0 ">Koné Arouna<br/>Konaté Ali</small></Table.Cell>
                                            <Table.Cell ><small className=" py-0 ">0x09439864ddaA177C80396353Cd98e6EaDa996a39<br/>0xa31f3d5d0d8a412084a3f83d253340524f7f8897<br/>0x78f3e606898836d13c9d02d58665c40c84b4dc6a07a17133f10ba46d0e2363fb</small></Table.Cell>
                                            <Table.Cell ><small className=" py-0 "><br/>1 000 000<br/>22/09/2023</small></Table.Cell>
                                        </Table.Row >

                                        <Table.Row >                       
                                            <Table.Cell ><small className=" py-0 ">Mint<br/>KOREE</small></Table.Cell>
                                            <Table.Cell ><small className=" py-0 ">Koné Arouna<br/>Konaté Ali</small></Table.Cell>
                                            <Table.Cell ><small className=" py-0 ">0x09439864ddaA177C80396353Cd98e6EaDa996a39<br/>0xa31f3d5d0d8a412084a3f83d253340524f7f8897<br/>0x78f3e606898836d13c9d02d58665c40c84b4dc6a07a17133f10ba46d0e2363fb</small></Table.Cell>
                                            <Table.Cell ><small className=" py-0 ">1 000 000<br/>22/09/2023</small></Table.Cell>
                                        </Table.Row >

                                        <Table.Row >                       
                                            <Table.Cell ><small className=" py-0 ">Burn<br/>KOREE</small></Table.Cell>
                                            <Table.Cell ><small className=" py-0 ">Koné Arouna<br/>Konaté Ali</small></Table.Cell>
                                            <Table.Cell ><small className=" py-0 ">0x09439864ddaA177C80396353Cd98e6EaDa996a39<br/>0xa31f3d5d0d8a412084a3f83d253340524f7f8897<br/>0x78f3e606898836d13c9d02d58665c40c84b4dc6a07a17133f10ba46d0e2363fb</small></Table.Cell>
                                            <Table.Cell ><small className=" py-0 ">1 000 000<br/>22/09/2023</small></Table.Cell>
                                        </Table.Row >

                                        <Table.Row >                       
                                            <Table.Cell ><small className=" py-0 ">GrantRol<br/>KOREE</small></Table.Cell>
                                            <Table.Cell ><small className=" py-0 ">Koné Arouna<br/>Konaté Ali</small></Table.Cell>
                                            <Table.Cell ><small className=" py-0 ">0x09439864ddaA177C80396353Cd98e6EaDa996a39<br/>0xa31f3d5d0d8a412084a3f83d253340524f7f8897<br/>0x78f3e606898836d13c9d02d58665c40c84b4dc6a07a17133f10ba46d0e2363fb</small></Table.Cell>
                                            <Table.Cell ><small className=" py-0 ">Aucun <br/>22/09/2023</small></Table.Cell>
                                        </Table.Row >

                                        <Table.Row >                       
                                            <Table.Cell ><small className=" py-0 ">RevokeRol<br/>KOREE</small></Table.Cell>
                                            <Table.Cell ><small className=" py-0 ">Koné Arouna<br/>Konaté Ali</small></Table.Cell>
                                            <Table.Cell ><small className=" py-0 ">0x09439864ddaA177C80396353Cd98e6EaDa996a39<br/>0xa31f3d5d0d8a412084a3f83d253340524f7f8897<br/>0x78f3e606898836d13c9d02d58665c40c84b4dc6a07a17133f10ba46d0e2363fb</small></Table.Cell>
                                            <Table.Cell ><small className=" py-0 ">Aucun<br/>22/09/2023</small></Table.Cell>
                                        </Table.Row >

                                        
                                    {/* ))} */}
                                </Table.Body>
                                <Table.Pagination
                                    shadow
                                    noMargin
                                    align="center"
                                    rowsPerPage={5}
                                    onPageChange={(page) => console.log({ page })}
                                />
                            </Table>
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
