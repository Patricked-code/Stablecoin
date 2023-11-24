import { useState, useEffect } from 'react';
// reactstrap components
import {Button} from "reactstrap";

const AccueilMifid = () => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API
    
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [mifidForUser, setMifidForUser] = useState(false);
  
    

    // Recuperer les donnees du questionnaire MIFID de l'utilisateur connecté
    useEffect(async() => {
        const token = localStorage.getItem('tokenEnCours')
            const getMifidForUser = async () => {
            const result = await fetch(`${API_URL}/api/mifid/find-quiz-mifid-of-user`, {
                headers: {
                'Content-Type': 'application/json',
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
                        <h1 className='text-center'>Votre profil investisseur : {mifidForUser?.categoryProfileGlobal} </h1>
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
                                                <h5>Type de fond</h5>
                                                <p>{mifidForUser?.fundtype}</p>

                                                <h5>Durée d'investissement</h5>
                                                <p>{mifidForUser?.durationInvestment}</p>
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
                    <div className='row'>
                        {/* <div className='col-lg-1 col-md-1'></div> */}
                            {/* Les caractéristiques du profil investisseur  */}
                            <div className='col-lg-4 col-md-4'>
                                <div className='currency-selection'>
                                    <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto bg-white">
                                        <h4 className='my-3 mx-3 pb-3 pt-3'><b>Les caractéristiques du profil investisseur</b></h4>
                                        <br/>
                                        <div className='my-3 mx-3'>
                                            <h5>Catégorie :</h5>
                                            <p>{mifidForUser?.categoryPartOne}</p>

                                            <h5>Commentaire :</h5>
                                            <p>{mifidForUser?.commentPartOne}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Fin */}

                            {/* La situation financière et la capacité d’investissement */}
                            <div className='col-lg-4 col-md-4'>
                                <div className='currency-selection'>
                                    <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto bg-white">
                                        <h4 className='my-3 mx-3 pb-3 pt-3'><b> La situation financière et la capacité d’investissement</b></h4>
                                        <div className='my-3 mx-3'>
                                            <h5>Catégorie :</h5>
                                            <p>{mifidForUser?.categoryPartTwo}</p>

                                            <h5>Commentaire :</h5>
                                            <p>{mifidForUser?.commentPartTwo}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Fin */}

                            {/* Les connaissances en matière d’instruments financiers */}
                            <div className='col-lg-4 col-md-4'>
                                <div className='currency-selection'>
                                    <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto bg-white">
                                        <h4 className='my-3 mx-3 pb-3 pt-3'><b> Les connaissances en matière d’instruments financiers</b></h4>
                                        <div className='my-3 mx-3'>
                                            <h5>Catégorie :</h5>
                                            <p>{mifidForUser?.categoryPartThree}</p>

                                            <h5>Commentaire :</h5>
                                            <p>{mifidForUser?.commentPartThree}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Fin */}

                            {/* L’expérience en termes d’investissement  */}
                            <div className='col-lg-4 col-md-4'>
                                <div className='currency-selection'>
                                    <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto bg-white">
                                        <h4 className='my-3 mx-3 pb-3 pt-3'><b> L’expérience en termes d’investissement </b></h4>
                                        <div className='my-3 mx-3'>
                                            <h5>Catégorie :</h5>
                                            <p>{mifidForUser?.categoryPartFour}</p>

                                            <h5>Commentaire :</h5>
                                            <p>{mifidForUser?.commentPartFour}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Fin */}

                            {/* Les besoins en termes d’investissement */}
                            <div className='col-lg-4 col-md-4'>
                                <div className='currency-selection'>
                                    <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto bg-white">
                                        <h4 className='my-3 mx-3 pb-3 pt-3'><b> Les besoins en termes d’investissement </b></h4>
                                        <br/>
                                        <div className='my-3 mx-3'>
                                            <h5>Catégorie :</h5>
                                            <p>{mifidForUser?.categoryPartFive}</p>

                                            <h5>Commentaire :</h5>
                                            <p>{mifidForUser?.commentPartFive}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Fin */}


                            {/* Les objectifs attendus et les motivations de l’investissement */}
                            <div className='col-lg-4 col-md-4'>
                                <div className='currency-selection'>
                                    <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto bg-white">
                                        <h4 className='my-3 mx-3 pb-3 pt-3'><b> Les objectifs attendus et les motivations de l’investissement </b></h4>
                                        <div className='my-3 mx-3'>
                                            <h5>Catégorie :</h5>
                                            <p>{mifidForUser?.categoryPartSix}</p>

                                            <h5>Commentaire :</h5>
                                            <p>{mifidForUser?.commentPartSix}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Fin */}


                            {/* Les préférences en matière d’investissement */}
                            <div className='col-lg-4 col-md-4'>
                                <div className='currency-selection'>
                                    <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto bg-white">
                                        <h4 className='my-3 mx-3 pb-3 pt-3'><b> Les préférences en matière d’investissement</b></h4>
                                        <div className='my-3 mx-3'>
                                            <h5>Catégorie :</h5>
                                            <p>{mifidForUser?.categoryPartSeven}</p>

                                            <h5>Commentaire :</h5>
                                            <p>{mifidForUser?.commentPartSeven}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Fin */}

                            {/* L’attitude face à la perte et l’aversion aux risques */}
                            <div className='col-lg-4 col-md-4'>
                                <div className='currency-selection'>
                                    <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto bg-white">
                                        <h4 className='my-3 mx-3 pb-3 pt-3'><b> L’attitude face à la perte et l’aversion aux risques</b></h4>
                                        <div className='my-3 mx-3'>
                                            <h5>Catégorie :</h5>
                                            <p>{mifidForUser?.categoryPartHeight}</p>

                                            <h5>Commentaire :</h5>
                                            <p>{mifidForUser?.commentPartHeight}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Fin */}
                        {/* <div className='col-lg-1 col-md-1'></div> */}
                        
                    </div>
                    {/* FIN */}

                </div>
            </div>

            
        </>
    );
};

export default AccueilMifid;
