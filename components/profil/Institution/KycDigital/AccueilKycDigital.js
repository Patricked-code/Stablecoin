import { useState, useEffect } from 'react';
import React from "react";


// Pour Magic
import { magic } from "../../../../magic";
import { ethers } from "ethers";
import Loading from "../../../../components/loading";
import Router from "next/router";
import { Table } from '@nextui-org/react';
import Link from 'next/link';



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

const CAccueilKycDigital = () => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API


    const [currentUser, setCurrentUser] = useState();
    const [provider, setProvider] = useState(null);
    const [showWallet, setShowWallet] = useState(null);
    


    
    // States de tab
    const [toggleState, setToggleState] = useState(1);
    const toggleTab = (index) => {
        setToggleState(index);
    };
    // Fin

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
                    // if (user?.profileId==2 || user?.profileId==3) {
                    //     setCurrentUser(user)
                    // }else{
                    //     Router.push("/profil/"); 
                        
                    // }
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
                        
                        <div className='my-5' >
                            <h3 className='text-center'>Kyc digital </h3>
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


                        <div className='row my-5'>
                            <div className='col-lg-4 col-md-4'></div>
                            <div className='col-lg-4 col-md-4'>
                            <div className='currency-selection text-center'>
                                <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                                <div className='cryptocurrency-slides'>
                                        <div className='single-cryptocurrency-box'>
                                            <div className='d-flex align-items-center'>
                                            <div className='title'>
                                                <h3>Demander d'accès aux kyc</h3>
                                            </div>
                                            </div>
                                            <div className='btn-box'>
                                            <a href='/profil/institution/demande-kyc'>
                                                <Button
                                                    block
                                                    color="primary"
                                                    type="button"
                                                >
                                                    Vois plus
                                                </Button>
                                            </a>
                                            {/* Fin */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            </div>
                            <div className='col-lg-4 col-md-4'></div>
                        </div>

                        <div className='row'>
                            <div className='col-lg-1 col-md-1'></div>

                            <div className='col-lg-10 col-md-10'>
                                
                                
                                        {/* L'entête de tab*/}
                                        {/* <div className='row'> */}
                                            {/* <div className='col-lg-3 col-md-3'></div> */}
                                        <div className="bloc-tabs-utilite ">
                                            
                                            <button
                                                className={toggleState === 1 ? "tabs active-tabs gr-text-8 text-color-opacity" : "tabs gr-text-8 text-color-opacity"}
                                                onClick={() => toggleTab(1)}
                                            >
                                                <span className=''>Kyc demandés</span>
                                            </button>

                                            <button
                                                className={toggleState === 2 ? "tabs active-tabs  gr-text-8 text-color-opacity" : "tabs  gr-text-8 text-color-opacity"}
                                                onClick={() => toggleTab(2)}

                                            >
                                                <span className='colorRed'>Kyc à traiter </span>
                                            </button>

                                            <button
                                                className={toggleState === 3 ? "tabs active-tabs  gr-text-8 text-color-opacity" : "tabs  gr-text-8 text-color-opacity"}
                                                onClick={() => toggleTab(3)}

                                            >
                                                <span className='colorGreen'>Kyc finalisés</span>
                                            </button>
                                        </div>
                                        <div className='col-lg-6 col-md-6'></div>
                                        {/* </div> */}
                                        {/* L'entête de tab */}


                                        {/* Le corps de tab */}
                                        <div className="content-tabs">
                                            {/* Kyc demandés */}
                                            <div
                                                className={toggleState === 1 ? "content  active-content" : "content"}
                                            >
                                                <div className='cryptocurrency-search-box'>
                                                    
                                                    <Table
                                                        aria-label="Example table with static content"
                                                        css={{
                                                            height: "auto",
                                                            minWidth: "100%",
                                                        }}
                                                    >
                                                        <Table.Header>
                                                            <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Nom</p></Table.Column>
                                                            <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Prenoms</p></Table.Column>
                                                            <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Entreprise</p></Table.Column>
                                                            <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Date</p></Table.Column>
                                                        </Table.Header>
                                                        <Table.Body>
                                                            {/* {allKycForParticular?.map((data) => ( */}
                                                                <Table.Row >                       
                                                                    <Table.Cell ><small className=" py-0 ">Koné</small></Table.Cell>
                                                                    <Table.Cell ><small className=" py-0 ">Zié Arouna</small></Table.Cell>
                                                                    <Table.Cell ><small className=" py-0 "></small></Table.Cell>
                                                                    <Table.Cell ><small className=" py-0 ">25/10/2023</small></Table.Cell>
                                                                </Table.Row >
                                                                
                                                                <Table.Row >                       
                                                                    <Table.Cell ><small className=" py-0 "></small></Table.Cell>
                                                                    <Table.Cell ><small className=" py-0 "></small></Table.Cell>
                                                                    <Table.Cell ><small className=" py-0 ">Wealthtech</small></Table.Cell>
                                                                    <Table.Cell ><small className=" py-0 ">25/10/2023</small></Table.Cell>
                                                                </Table.Row >

                                                                
                                                            {/* ))} */}
                                                        </Table.Body>
                                                        {/* <Table.Pagination
                                                            shadow
                                                            noMargin
                                                            align="center"
                                                            rowsPerPage={3}
                                                            onPageChange={(page) => console.log({ page })}
                                                        /> */}
                                                    </Table>
                                                </div>
                                            </div>
                                            {/* Fin Kyc demandés */}

                                            
                                            {/* Kyc à traiter */}
                                            <div
                                                className={toggleState === 2 ? "content  active-content" : "content"}
                                            >
                                                <div className='cryptocurrency-search-box'>
                                                    
                                                    <Table
                                                        aria-label="Example table with static content"
                                                        css={{
                                                            height: "auto",
                                                            minWidth: "100%",
                                                        }}
                                                    >
                                                        <Table.Header>
                                                            <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Nom</p></Table.Column>
                                                            <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Prenoms</p></Table.Column>
                                                            <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Entreprise</p></Table.Column>
                                                            <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Date</p></Table.Column>
                                                            <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Date limite</p></Table.Column>
                                                            <Table.Column><p className="gr-text-8 pt-3 pb-0 text-center">Actions</p></Table.Column>
                                                        </Table.Header>
                                                        <Table.Body>
                                                            {/* {allKycForParticular?.map((data) => ( */}
                                                                <Table.Row >                       
                                                                    <Table.Cell ><small className=" py-0 ">Koné</small></Table.Cell>
                                                                    <Table.Cell ><small className=" py-0 ">Zié Arouna</small></Table.Cell>
                                                                    <Table.Cell ><small className=" py-0 "></small></Table.Cell>
                                                                    <Table.Cell ><small className=" py-0 ">25/10/2023</small></Table.Cell>
                                                                    <Table.Cell ><small className=" py-0 ">30/10/2023</small></Table.Cell>
                                                                    <Table.Cell className="row">
                                                                        <div className='text-center'>
                                                                            <small className=" py-0  mx-2">
                                                                                <Link href="/#" >
                                                                                <a className=" text-white aNoDecor bgColorGreen px-4">Traiter</a> 
                                                                                </Link>
                                                                            </small>
                                                                        </div>
                                                                    </Table.Cell>
                                                                </Table.Row >

                                                                
                                                            {/* ))} */}
                                                        </Table.Body>
                                                        {/* <Table.Pagination
                                                            shadow
                                                            noMargin
                                                            align="center"
                                                            rowsPerPage={3}
                                                            onPageChange={(page) => console.log({ page })}
                                                        /> */}
                                                    </Table>
                                                </div>
                                            </div>
                                            {/* Fin Kyc à traiter*/}

                                            {/* Kyc finalisés */}
                                            <div
                                                className={toggleState === 3 ? "content  active-content" : "content"}
                                            >
                                                <div className='cryptocurrency-search-box'>
                                                    
                                                    <Table
                                                        aria-label="Example table with static content"
                                                        css={{
                                                            height: "auto",
                                                            minWidth: "100%",
                                                        }}
                                                    >
                                                        <Table.Header>
                                                            <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Nom</p></Table.Column>
                                                            <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Prenoms</p></Table.Column>
                                                            <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Entreprise</p></Table.Column>
                                                            <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Date</p></Table.Column>
                                                            <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Date limite</p></Table.Column>
                                                        </Table.Header>
                                                        <Table.Body>
                                                            {/* {allKycForParticular?.map((data) => ( */}
                                                                <Table.Row >                       
                                                                    <Table.Cell ><small className=" py-0 ">Koné</small></Table.Cell>
                                                                    <Table.Cell ><small className=" py-0 ">Zié Arouna</small></Table.Cell>
                                                                    <Table.Cell ><small className=" py-0 "></small></Table.Cell>
                                                                    <Table.Cell ><small className=" py-0 ">25/10/2023</small></Table.Cell>
                                                                    <Table.Cell ><small className=" py-0 ">30/10/2023</small></Table.Cell>
                                                                </Table.Row >
                                                                
                                                            {/* ))} */}
                                                        </Table.Body>
                                                        {/* <Table.Pagination
                                                            shadow
                                                            noMargin
                                                            align="center"
                                                            rowsPerPage={3}
                                                            onPageChange={(page) => console.log({ page })}
                                                        /> */}
                                                    </Table>
                                                </div>
                                            </div>
                                            {/* Fin Kyc finalisés*/}
                                        </div>
                                        {/* Fin le corps de tab */}
                               
                            </div>
                            <div className='col-lg-1 col-md-1'></div>
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

export default CAccueilKycDigital;
