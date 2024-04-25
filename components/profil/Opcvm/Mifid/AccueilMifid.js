import { useState, useEffect } from 'react';
// reactstrap components
import {Button} from "reactstrap";

const AccueilMifid = () => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API
     // Variable de l'api key de stablecoin
     const API_KEY_STABLECOIN = process.env.NEXT_PUBLIC_API_KEY_STABLECOIN
    
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [mifidForUser, setMifidForUser] = useState(false);
  
    // States de tab
    const [toggleState, setToggleState] = useState(1);
    const toggleTab = (index) => {
        setToggleState(index);
    };
    // Fin

    // Recuperer les donnees du questionnaire MIFID de l'utilisateur connecté
    useEffect(async() => {
        const token = localStorage.getItem('tokenEnCours')
            const getMifidForUser = async () => {
            const result = await fetch(`${API_URL}/api/mifid/find-quiz-mifid-of-user`, {
                headers: {
                'Content-Type': 'application/json',
                    'x-api-key': `${API_KEY_STABLECOIN}`,
                Authorization:  `Bearer ${token}`,
                },
            })
                .then((result) => result.json())
                .then((data) => {
                    setMifidForUser(data)
                }) 
            };
            await getMifidForUser();
    }, []);
    // FIN


    

    return (
        <>
            <div className='' >
                <div className=' mx-15'>
                    <div className='py-10'>
                        <h1 className='text-center'>Votre profil investisseur : <i className='colorRed'>{mifidForUser?.categoryProfileGlobal}</i> </h1>
                    </div>
                </div>

                {/* Les images de fond */}
                <div className='shape1'>
                </div>
                <div className='shape2 mb-5'><br/>
                <img src='/images/shape/shape2.png' alt='image' />
                </div>
                <div className='shape3'>
                </div>
                <div className='shape4'>
                <img src='/images/shape/shape4.png' alt='image' />
                </div>
                {/* Fin des images de fond */}

                {/* Les cards */}
                <div className='cryptocurrency-search-box'>
                    {/* PARTIE PROFIL GLOBAL */}
                    <div className='row'>
                        {/* <div className='col-lg-1 col-md-1'></div> */}
                            <div className='col-lg-12 col-md-12'>
                                <div className='currency-selection'>
                                    <div className="m-4 pb-3 credit-card  w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                                        <div className='col-lg-12 col-md-12 row justify-content-between'>
                                            <h3 className='text-center my-3'><b>Profil Global</b></h3>
                                            <div className='col-lg-6 col-md-6'>
                                            {/* Si le profil est : Sécurité */}
                                                <div className='d-flex align-items-center'>
                                                    <div className='bestseller-coin-image mx-3 my-3'>
                                                        <img src="/images/ecfa/opcvm/mifid/mifid1.jpg" className="rounded-circle"  alt='image' />
                                                    </div>
                                                    <div className='title mt-4'>

                                                        <h5>Volatilité du portefeuille</h5>
                                                        <p>{mifidForUser?.volatilityPortfolioTarget}</p>
                                                    </div>
                                                </div>
                                            
                                        </div>
                                        <div className='col-lg-6 col-md-6 my-3'>
                                            <div className='my-3'>
                                                <h5 className='mx-3'>Type de fond</h5>
                                                <p className='mx-3'>{mifidForUser?.fundtype}</p>

                                                <h5 className='mx-3'>Durée d'investissement</h5>
                                                <p className='mx-3'>{mifidForUser?.durationInvestment}</p>
                                            </div>
                                        </div>

                                        </div>

                                        <div>
                                            <h5 className='mx-3'>Commentaire</h5>

                                            <p className=' mx-3 mb-5'>{mifidForUser?.commentGlobal}</p>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        {/* <div className='col-lg-1 col-md-1'></div> */}
                    </div>
                    {/* FIN PARTIE PROFIL GLOBAL */}

                    {/* LES SOUS PARTIES  */}
                    <div className='row '>
                        <div className='currency-selection '>
                            <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                                <div className='cryptocurrency-slides'>
                                    <div className='single-cryptocurrency-box'>

                                        {/* L'entête des tabs */}
                                        <div className="bloc-tabs-utilite ">
                                            <button
                                                className={toggleState === 1 ? "tabs active-tabs gr-text-8 text-color-opacity" : "tabs gr-text-8 text-color-opacity"}
                                                onClick={() => toggleTab(1)}
                                            >
                                                <span className=''>profil investisseur</span>
                                            </button>

                                            <button
                                                className={toggleState === 2 ? "tabs active-tabs  gr-text-8 text-color-opacity" : "tabs  gr-text-8 text-color-opacity"}
                                                onClick={() => toggleTab(2)}

                                            >
                                                <span className=''>Capacité financière </span>
                                            </button>

                                            <button
                                                className={toggleState === 3  ? "tabs active-tabs  gr-text-8 text-color-opacity" : "tabs  gr-text-8 text-color-opacity"}
                                                onClick={() => toggleTab(3)}

                                            >
                                                <span className=''>Connaissances financières </span>
                                            </button>

                                            <button
                                                className={toggleState === 4 ? "tabs active-tabs  gr-text-8 text-color-opacity" : "tabs  gr-text-8 text-color-opacity"}
                                                onClick={() => toggleTab(4)}

                                            >
                                                <span className=''>Expérience en investissement </span>
                                            </button>

                                        </div>

                                        {/* Le corps de tab */}
                                        <div className="content-tabs">
                                            {/* Les caractéristiques du profil investisseur  */}
                                            <div
                                                className={toggleState === 1 ? "content  active-content" : "content"}
                                            >
                                                <div className='cryptocurrency-search-box'>
                                                    
                                                    <h5 className='d-flex'>Catégorie:  <p className='colorRed mx-2'> {mifidForUser?.categoryPartOne}</p></h5>
                                                    
                                                    {/* <h5>Commentaire :</h5> */}
                                                    <p className='text-left'>{mifidForUser?.commentPartOne}</p>
                                                </div>
                                            </div>
                                            {/* Fin */}

                                            {/* La situation financière et la capacité d’investissement */}
                                            <div className={toggleState === 2 ? "content  active-content" : "content"}>
                                                <div className='cryptocurrency-search-box'>
                                                    <h5 className='d-flex'>Catégorie:  <p className='colorRed mx-2'> {mifidForUser?.categoryPartTwo}</p></h5>
                                                    {/* <h5>Commentaire :</h5> */}
                                                    <p>{mifidForUser?.commentPartTwo}</p>
                                                </div>
                                            </div>
                                            {/* Fin */}
                                            {/* Les connaissances en matière d’instruments financiers */}
                                            <div className={toggleState === 3 ? "content  active-content" : "content"}>
                                                <div className='cryptocurrency-search-box'>
                                                    <h5 className='d-flex'>Catégorie:  <p className='colorRed mx-2'> {mifidForUser?.categoryPartThree}</p></h5>
                                                    {/* <h5>Commentaire :</h5> */}
                                                    <p>{mifidForUser?.commentPartThree}</p>
                                                </div>
                                            </div>
                                            {/* Fin */}

                                            {/* L’expérience en termes d’investissement  */}
                                            <div className={toggleState === 4 ? "content  active-content" : "content"}>
                                                <div className='cryptocurrency-search-box'>
                                                    <h5 className='d-flex'>Catégorie:  <p className='colorRed mx-2'> {mifidForUser?.categoryPartFour}</p></h5>
                                                    {/* <h5>Commentaire :</h5> */}
                                                    <p>{mifidForUser?.commentPartFour}</p>
                                                </div>
                                            </div>
                                            {/* Fin */}


                                        </div>
                                        {/* Fin le corps de tab */}
                                    </div>
                                </div>

                            
                            </div>


                            {/* 2 è BLOGS */}
                            <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">

                                <div className='cryptocurrency-slides'>
                                    <div className='single-cryptocurrency-box'>

                                        {/* L'entête des tabs */}
                                        <div className="bloc-tabs-utilite ">
                                            
                                            <button
                                                className={toggleState === 5 ? "tabs active-tabs  gr-text-8 text-color-opacity" : "tabs  gr-text-8 text-color-opacity"}
                                                onClick={() => toggleTab(5)}

                                            >
                                                <span className=''>Besoin d'investissement</span>
                                            </button>

                                            <button
                                                className={toggleState === 6  ? "tabs active-tabs  gr-text-8 text-color-opacity" : "tabs  gr-text-8 text-color-opacity"}
                                                onClick={() => toggleTab(6)}

                                            >
                                                <span className=''>Objectifs et motivations </span>
                                            </button>

                                            <button
                                                className={toggleState === 7  ? "tabs active-tabs  gr-text-8 text-color-opacity" : "tabs  gr-text-8 text-color-opacity"}
                                                onClick={() => toggleTab(7)}

                                            >
                                                <span className=''>Préférence en matière d'investissement</span>
                                            </button>

                                            <button
                                                className={toggleState === 8  ? "tabs active-tabs  gr-text-8 text-color-opacity" : "tabs  gr-text-8 text-color-opacity"}
                                                onClick={() => toggleTab(8)}

                                            >
                                                <span className=''>Aversion au risque </span>
                                            </button>
                                        </div>

                                        {/* Le corps de tab */}
                                        <div className="content-tabs">
                                            {/* Les besoins en termes d’investissement */}
                                            <div
                                                className={toggleState === 5 ? "content  active-content" : "content"}
                                            >
                                                <div className='cryptocurrency-search-box'>
                                                    
                                                    <h5 className='d-flex'>Catégorie:  <p className='colorRed mx-2'> {mifidForUser?.categoryPartFive}</p></h5>
                                                    
                                                    {/* <h5>Commentaire :</h5> */}
                                                    <p className='text-left'>{mifidForUser?.commentPartFive}</p>
                                                </div>
                                            </div>
                                            {/* Fin */}

                                            {/* Les objectifs attendus et les motivations de l’investissement */}
                                            <div className={toggleState === 6 ? "content  active-content" : "content"}>
                                                <div className='cryptocurrency-search-box'>
                                                    <h5 className='d-flex'>Catégorie:  <p className='colorRed mx-2'> {mifidForUser?.categoryPartSix}</p></h5>
                                                    {/* <h5>Commentaire :</h5> */}
                                                    <p>{mifidForUser?.commentPartSix}</p>
                                                </div>
                                            </div>
                                            {/* Fin */}

                                            {/* Les préférences en matière d’investissement */}
                                            <div className={toggleState === 7 ? "content  active-content" : "content"}>
                                                <div className='cryptocurrency-search-box'>
                                                    <h5 className='d-flex'>Catégorie:  <p className='colorRed mx-2'> {mifidForUser?.categoryPartSeven}</p></h5>
                                                    {/* <h5>Commentaire :</h5> */}
                                                    <p>{mifidForUser?.commentPartSeven}</p>
                                                </div>
                                            </div>
                                            {/* Fin */}

                                            {/* L’attitude face à la perte et l’aversion aux risques */}
                                            <div className={toggleState === 8 ? "content  active-content" : "content"}>
                                                <div className='cryptocurrency-search-box'>
                                                    <h5 className='d-flex'>Catégorie:  <p className='colorRed mx-2'> {mifidForUser?.categoryPartHeight}</p></h5>
                                                    {/* <h5>Commentaire :</h5> */}
                                                    <p>{mifidForUser?.commentPartHeight}</p>
                                                </div>
                                            </div>
                                            {/* Fin */}
                                        </div>
                                        {/* Fin le corps de tab */}
                                    </div>
                                </div>
                            </div>
                        </div>

                        
                    </div>

                    {/* FIN */}

                </div>
            </div>

            
        </>
    );
};

export default AccueilMifid;
