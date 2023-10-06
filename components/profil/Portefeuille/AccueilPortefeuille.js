import { useState, useEffect } from 'react';
import React from "react";


// Pour Magic
import { magic } from "../../../magic";
import { ethers } from "ethers";
import Loading from "../../../components/loading";
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

const CAccueilPortefeuille = () => {
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
                        <div className='  row'>
                            <div className=' col-lg-2 col-md-2' ></div>
                            <div className=' col-lg-6 col-md-6' >
                                <h3 className='text-center'>Mon portefeuille numérique</h3>
                            </div>
                            <div className=' col-lg-2 col-md-2' ></div>

                            <div className=' col-lg-2 col-md-2 text-right' >
                            <select 
                                className="form-control"
                                id="validQuiz"
                                required
                                // defaultValue={validQuiz} 
                                // onChange={(event)=>setValidQuiz(event.target.value)}
                            >
                                <option defaultValue="XOF">XOF</option>
                                <optgroup className='single-cryptocurrency-box'>
                                    <option  value="XAF">XAF</option>
                                    <option  value="XAF">XAF</option>
                                    <option  value="Dollar">Dollar</option>
                                    <option  value="Euro">Euro</option>
                                </optgroup>
                            </select>
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
                        <div className='row'>
                            <div className='col-lg-1 col-md-1'></div>

                            <div className='col-lg-10 col-md-10'>
                                <div className=' bgColorblue my-3 px-3' onClick={()=>setShowWallet(0)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span className='btn text-white'>Portefeuille cash</span>
                                    <p className='text-right mb-0 text-white'>1000 0000 $</p>
                                </div>
                                
                                {/* ********************************************************* */}
                                    {/* PORTEFEUILLE CASH*/}
                                {/* *********************************************************** */}
                                {showWallet==0? (
                                    <div className='cryptocurrency-search-box  my-5'>
                                        <div className='py-10'>
                                            <h4 >Portefeuille cash <b className='colorGreen'> : 1 000 000 CFA</b></h4>
                                        </div>
                                        <Table
                                            aria-label="Example table with static content"
                                            css={{
                                                height: "auto",
                                                minWidth: "100%",
                                            }}
                                        >
                                            <Table.Header>
                                                <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Actifs</p></Table.Column>
                                                <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Montant</p></Table.Column>
                                                <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Valeur $</p></Table.Column>
                                                <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Actions </p></Table.Column>
                                            </Table.Header>
                                            <Table.Body>
                                                {/* {allKycForParticular?.map((data) => ( */}
                                                    <Table.Row >                       
                                                        <Table.Cell ><p className=" py-0 "><b>KOREE</b><br/><small>Stablecoin</small></p></Table.Cell>
                                                        <Table.Cell ><p className=" py-0 "><b>1 000 000 000 KOREE</b> <br/><small >1 000 000 000 CFA</small></p></Table.Cell>
                                                        <Table.Cell ><p className=" py-0 "><b>1 000 000 000 KOREE</b> <br/><small>1 000 000 $ </small></p></Table.Cell>
                                                        <Table.Cell className="row">

                                                            <small className=" py-0  mx-2">
                                                                <Link href="/#" >
                                                                <a className=" text-white aNoDecor bgColorGreen ">Dépôt</a> 
                                                                </Link>
                                                            </small>
                                                            <small className=" py-0 mx-2">
                                                                <Link href="/#" >
                                                                <a className=" text-white aNoDecor bgColorRed">Retrait</a> 
                                                                </Link>
                                                            </small>
                                                            <small className=" py-0 mx-2  ">
                                                                <Link href="/#" >
                                                                <a className=" text-white aNoDecor bgColorblue">Transfert</a> 
                                                                </Link>
                                                            </small>
                                                            <small className=" py-0 mx-2">
                                                                <Link href="/#" >
                                                                <a className=" text-white aNoDecor bgColorblue">Conversion</a> 
                                                                </Link>
                                                            </small>
                                                        </Table.Cell>
                                                    </Table.Row >

                                                    <Table.Row >                       
                                                        <Table.Cell ><p className=" py-0 "><b>KOREE</b><br/><small>Stablecoin</small></p></Table.Cell>
                                                        <Table.Cell ><p className=" py-0 "><b>1 000 000 000 KOREE</b> <br/><small >1 000 000 000 CFA</small></p></Table.Cell>
                                                        <Table.Cell ><p className=" py-0 "><b>1 000 000 000 KOREE</b> <br/><small>1 000 000 $ </small></p></Table.Cell>
                                                        <Table.Cell className="row">

                                                            <small className=" py-0  mx-2">
                                                                <Link href="/#" >
                                                                <a className=" text-white aNoDecor bgColorGreen ">Dépôt</a> 
                                                                </Link>
                                                            </small>
                                                            <small className=" py-0 mx-2">
                                                                <Link href="/#" >
                                                                <a className=" text-white aNoDecor bgColorRed">Retrait</a> 
                                                                </Link>
                                                            </small>
                                                            <small className=" py-0 mx-2  ">
                                                                <Link href="/#" >
                                                                <a className=" text-white aNoDecor bgColorblue">Transfert</a> 
                                                                </Link>
                                                            </small>
                                                            <small className=" py-0 mx-2">
                                                                <Link href="/#" >
                                                                <a className=" text-white aNoDecor bgColorblue">Conversion</a> 
                                                                </Link>
                                                            </small>
                                                        </Table.Cell>
                                                    </Table.Row >

                                                    
                                                {/* ))} */}
                                            </Table.Body>
                                            <Table.Pagination
                                                shadow
                                                noMargin
                                                align="center"
                                                rowsPerPage={3}
                                                onPageChange={(page) => console.log({ page })}
                                            />
                                        </Table>
                                        
                                    </div>
                                ) : ('')}
                                {/* *****************FIN PORTEFEUILLE CASH************************ */}








                                {/* ***************************************************************** */}
                                    {/* PORTEFEUILLE INVESTISSEMENT*/}
                                {/* ***************************************************************** */}
                                <div className=' bgColorblue my-3 px-3' onClick={()=>setShowWallet(1)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span className='btn text-white'>Portefeuille d'investissement</span>
                                    <p className='text-right mb-0 text-white'>1000 0000 $</p>
                                </div>
                                {showWallet==1? (
                                <>
                                
                                        {/* Portefeuille crowdfunding */}
                                        <div className='mb-5'>
                                            <h4 >Portefeuille investissement <b className='colorGreen'> : 1 000 000 CFA</b></h4>
                                        </div>
                                        {/* L'entête de tab*/}
                                        <div className='row'>
                                            {/* <div className='col-lg-3 col-md-3'></div> */}
                                        <div className="bloc-tabs-utilite col-lg-6 col-md-6">
                                            
                                            <button
                                                className={toggleState === 1 ? "tabs active-tabs gr-text-8 text-color-opacity" : "tabs gr-text-8 text-color-opacity"}
                                                onClick={() => toggleTab(1)}
                                            >
                                                OPCVM
                                            </button>

                                            <button
                                                className={toggleState === 2 ? "tabs active-tabs  gr-text-8 text-color-opacity" : "tabs  gr-text-8 text-color-opacity"}
                                                onClick={() => toggleTab(2)}
                                            >
                                                Crowfunding
                                            </button>
                                        </div>
                                        <div className='col-lg-6 col-md-6'></div>
                                        </div>
                                        {/* L'entête de tab */}


                                        {/* Le corps de tab */}
                                        <div className="content-tabs">
                                            {/* Portefeuille OPCVM */}
                                            <div
                                                className={toggleState === 1 ? "content  active-content" : "content"}
                                            >
                                                <div className='cryptocurrency-search-box my-3'>
                                                    <div className='py-3'>
                                                        <p className='colorGreen'><b>Solde : 1 000 000 CFA</b></p>
                                                    </div>
                                                    <Table
                                                        aria-label="Example table with static content"
                                                        css={{
                                                            height: "auto",
                                                            minWidth: "100%",
                                                        }}
                                                    >
                                                        <Table.Header>
                                                            <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Opcvm</p></Table.Column>
                                                            <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Montant</p></Table.Column>
                                                            <Table.Column><p className="gr-text-8 pt-3 pb-0 ">VL</p></Table.Column>
                                                            <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Valeur $</p></Table.Column>
                                                            <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Actions</p></Table.Column>
                                                        </Table.Header>
                                                        <Table.Body>
                                                            {/* {allKycForParticular?.map((data) => ( */}
                                                                <Table.Row >                       
                                                                    <Table.Cell ><p className=" py-0 "><small>Stablecoin</small></p></Table.Cell>
                                                                    <Table.Cell ><small className=" py-0 "><b>5 000 000 $</b></small></Table.Cell>
                                                                    <Table.Cell ><p className=" py-0 "><b>1 000 000 000 KOREE</b> <br/><small >1 000 000 000 CFA</small></p></Table.Cell>
                                                                    <Table.Cell ><p className=" py-0 "><b>1 000 000 000 KOREE</b> <br/><small>1 000 000 $ </small></p></Table.Cell>
                                                                    <Table.Cell className="row">
                                                                        <small className=" py-0  mx-2">
                                                                            <Link href="/#" >
                                                                            <a className=" text-white aNoDecor bgColorGreen ">Achat</a> 
                                                                            </Link>
                                                                        </small>
                                                                        <small className=" py-0 mx-2">
                                                                            <Link href="/#" >
                                                                                <a className=" text-white aNoDecor bgColorRed">Vente</a> 
                                                                            </Link>
                                                                        </small>
                                                                        <small className=" py-0 mx-2">
                                                                            <Link href="/#" >
                                                                            <a className=" text-white aNoDecor bgColorblue">Conversion</a> 
                                                                            </Link>
                                                                        </small>
                                                                    </Table.Cell>
                                                                </Table.Row >

                                                                
                                                            {/* ))} */}
                                                        </Table.Body>
                                                        <Table.Pagination
                                                            shadow
                                                            noMargin
                                                            align="center"
                                                            rowsPerPage={3}
                                                            onPageChange={(page) => console.log({ page })}
                                                        />
                                                    </Table>
                                                </div>
                                            </div>
                                            {/* Fin portefeuille OPCVM */}

                                            
                                            <div
                                                className={toggleState === 2 ? "content  active-content" : "content"}
                                            >
                                                <div className='cryptocurrency-search-box my-5'>
                                                    <div className='py-3'>
                                                        <p className='colorGreen'><b>Solde : 1 000 000 CFA</b></p>
                                                    </div>
                                                    <Table
                                                        aria-label="Example table with static content"
                                                        css={{
                                                            height: "auto",
                                                            minWidth: "100%",
                                                        }}
                                                    >
                                                        <Table.Header>
                                                            <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Opcvm</p></Table.Column>
                                                            <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Montant</p></Table.Column>
                                                            <Table.Column><p className="gr-text-8 pt-3 pb-0 ">VL</p></Table.Column>
                                                            <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Valeur $</p></Table.Column>
                                                            <Table.Column><p className="gr-text-8 pt-3 pb-0 ">Actions</p></Table.Column>
                                                        </Table.Header>
                                                        <Table.Body>
                                                            {/* {allKycForParticular?.map((data) => ( */}
                                                                <Table.Row >                       
                                                                    <Table.Cell ><p className=" py-0 "><small>Stablecoin</small></p></Table.Cell>
                                                                    <Table.Cell ><small className=" py-0 "><b>5 000 000 $</b></small></Table.Cell>
                                                                    <Table.Cell ><p className=" py-0 "><b>1 000 000 000 KOREE</b> <br/><small >1 000 000 000 CFA</small></p></Table.Cell>
                                                                    <Table.Cell ><p className=" py-0 "><b>1 000 000 000 KOREE</b> <br/><small>1 000 000 $ </small></p></Table.Cell>
                                                                    <Table.Cell className="row">
                                                                        <small className=" py-0  mx-2">
                                                                            <Link href="/#" >
                                                                            <a className=" text-white aNoDecor bgColorGreen ">Achat</a> 
                                                                            </Link>
                                                                        </small>
                                                                        <small className=" py-0 mx-2">
                                                                            <Link href="/#" >
                                                                                <a className=" text-white aNoDecor bgColorRed">Vente</a> 
                                                                            </Link>
                                                                        </small>
                                                                        <small className=" py-0 mx-2">
                                                                            <Link href="/#" >
                                                                            <a className=" text-white aNoDecor bgColorblue">Conversion</a> 
                                                                            </Link>
                                                                        </small>
                                                                    </Table.Cell>
                                                                </Table.Row >

                                                                
                                                            {/* ))} */}
                                                        </Table.Body>
                                                        <Table.Pagination
                                                            shadow
                                                            noMargin
                                                            align="center"
                                                            rowsPerPage={3}
                                                            onPageChange={(page) => console.log({ page })}
                                                        />
                                                    </Table>
                                                </div>
                                            </div>
                                            {/* Fin portefeuille crowdfunding*/}
                                        </div>
                                        {/* Fin le corps de tab */}
                                    </>
                                ):("")}
                                {/* ************** Fin portefeuille investissement*********** */}
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

export default CAccueilPortefeuille;
