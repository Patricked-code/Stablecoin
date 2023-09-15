import { useState, useEffect } from 'react';
// reactstrap components
import {Button} from "reactstrap";

const TypeProfil = () => {
    // Variable de l'url de l'api
    const API_URL =process.env.NEXT_PUBLIC_URL_API
    
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [questionnaireForUser, setQuestionnaireForUser] = useState(false);

    // Recuperer les donnees du questionnaire de l'utilisateur connecté
    useEffect(async() => {
        const token = localStorage.getItem('tokenEnCours')
            const getQuestionnaireForUser = async () => {
            const result = await fetch(`${API_URL}/api/profile/opcvm/find-profile-opcvm-questionnaire-of-user-signIn`, {
                headers: {
                'Content-Type': 'application/json',
                Authorization:  `Bearer ${token}`,
                },
            })
                .then((result) => result.json())
                .then((data) => {
                    setQuestionnaireForUser(data)
                }) 
            };
            await getQuestionnaireForUser();
    }, []);
    // FIN


    

    return (
        <>
            <div className='' >
                <div className=' mx-15'>
                    <div className='py-10'>
                        <h1 className='text-center'>Votre profil investisseur provisoire </h1>
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
                    <div className='row'>
                        <div className='col-lg-1 col-md-1'></div>

                            <div className='col-lg-10 col-md-10'>
                                <div className='currency-selection'>
                                    <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                                        <div className='col-lg-12 col-md-12 row justify-content-between'>
                                        <div className='col-lg-6 col-md-6'>
                                            {/* Si le profil est : Sécurité */}
                                            {questionnaireForUser?.typeProfile==="Sécurité" ? (
                                                <div className='d-flex align-items-center'>
                                                    <div className='bestseller-coin-image mx-3 my-3'>
                                                        <img src="/images/ecfa/opcvm/profil1.jpg" className="rounded-circle"  alt='image' />
                                                    </div>
                                                    <div className='title'>
                                                        <h3>{questionnaireForUser?.typeProfile}</h3>
                                                        <p>{questionnaireForUser?.percentage}</p>
                                                    </div>
                                                </div>
                                            ):("")}
                                            

                                            {/* Si le profil est : Conservateur */}
                                            {questionnaireForUser?.typeProfile==="Conservateur" ? (
                                                <div className='d-flex align-items-center'>
                                                    <div className='bestseller-coin-image mx-3 my-3'>
                                                        <img src="/images/ecfa/opcvm/profil2.jpg" className="rounded-circle"  alt='image' />
                                                    </div>
                                                    <div className='title'>
                                                        <h3>{questionnaireForUser?.typeProfile}</h3>
                                                        <p>{questionnaireForUser?.percentage}</p>
                                                    </div>
                                                </div>
                                            ):("")}

                                            {/* Si le profil est : Equilibré */}
                                            {questionnaireForUser?.typeProfile==="Equilibré" ? (
                                                <div className='d-flex align-items-center'>
                                                    <div className='bestseller-coin-image mx-3 my-3'>
                                                        <img src="/images/ecfa/opcvm/profil3.jpg" className="rounded-circle"  alt='image' />
                                                    </div>
                                                    <div className='title'>
                                                        <h3>{questionnaireForUser?.typeProfile}</h3>
                                                        <p>{questionnaireForUser?.percentage}</p>
                                                    </div>
                                                </div>
                                            ):("")}

                                            {/* Si le profil est : Croissance équilibrée */}
                                            {questionnaireForUser?.typeProfile==="Croissance équilibrée" ? (
                                                <div className='d-flex align-items-center'>
                                                    <div className='bestseller-coin-image mx-3 my-3'>
                                                        <img src="/images/ecfa/opcvm/profil4.jpg" className="rounded-circle"  alt='image' />
                                                    </div>
                                                    <div className='title'>
                                                        <h3>{questionnaireForUser?.typeProfile}</h3>
                                                        <p>{questionnaireForUser?.percentage}</p>
                                                    </div>
                                                </div>
                                            ):("")}

                                            {/* Si le profil est : Croissance */}
                                            {questionnaireForUser?.typeProfile==="Croissance" ? (
                                                <div className='d-flex align-items-center'>
                                                    <div className='bestseller-coin-image mx-3 my-3'>
                                                        <img src="/images/ecfa/opcvm/profil5.jpg" className="rounded-circle"  alt='image' />
                                                    </div>
                                                    <div className='title'>
                                                        <h3>{questionnaireForUser?.typeProfile}</h3>
                                                        <p>{questionnaireForUser?.percentage}</p>
                                                    </div>
                                                </div>
                                            ):("")}

                                            {/* Ce bouton s'affiche si l'utilisateur n'a pas encore donné son avis  */}
                                            {questionnaireForUser?.status===true && !questionnaireForUser?.conditions ? (
                                                <div className='btn-box'>
                                                    <a className='nav-link' href='/profil/opcvm/conditions-profil'>
                                                        <Button
                                                            block
                                                            color="primary"
                                                            type="button"
                                                        >
                                                            Cliquez ici pour nous donner votre avis sur votre resultat
                                                        </Button>
                                                    </a>
                                                </div>
                                            ):("")}

                                        </div>
                                        <div className='col-lg-6 col-md-6 my-3'>
                                            <p>Votre profil d’investisseur est fondé sur vos réponses à propos de votre situation financière actuelle, de vos buts et objectifs de placement ainsi que de votre attitude à l’égard du risque. Veuillez lire les énoncés suivants et confirmer votre accord et en sélectionnant si nécessaire un profil qui pourrait vous convenir.</p>
                                            {/* Si le profil est : Sécurité */}
                                            {questionnaireForUser?.typeProfile==="Sécurité" ? (
                                                <div className='my-3'>
                                                    <p>• Votre objectif principal est de conserver votre capital</p>
                                                    <p>• Vous ne tolérez pas de fluctuations de rendement</p>
                                                    <p>• Vous investissez pour une courte période de temps</p>
                                                </div>
                                            ):("")}

                                            {/* Si le profil est : Conservateur */}
                                            {questionnaireForUser?.typeProfile==="Conservateur" ? (
                                                <div className='my-3'>
                                                    <p>• Vous vous préoccupez de la conservation de votre capital</p>
                                                    <p>• Vous désirez un revenu de placement relativement stable</p>
                                                    <p>• Vous êtes prêt à tolérer des fluctuations limitées</p>
                                                    <p>• La période de croissance de vos placements est plutôt courte</p>
                                                </div>
                                            ):("")}


                                            {/* Si le profil est : Equilibré */}
                                            {questionnaireForUser?.typeProfile==="Equilibré" ? (
                                            <div className='my-3'>
                                                <p>• Vous souhaitez obtenir de bons rendements en réduisant le risque global de votre portefeuille</p>
                                                <p>• Vous êtes prêt à tolérer certaines fluctuations</p>
                                                <p>• Vous n’avez pas besoin de recourir à des retraits au cours des quelques prochaines années</p>
                                            </div>
                                            ):("")}


                                            {/* Si le profil est : Croissance équilibrée */}
                                            {questionnaireForUser?.typeProfile==="Croissance équilibrée" ? (
                                                <div className='my-3'>
                                                    <p>• Vous êtes un investisseur axé sur la croissance</p>
                                                    <p>• Vous désirez obtenir un bon rendement sur votre portefeuille</p>
                                                    <p>• Vous êtes prêt à accepter des fluctuations de marché</p>
                                                    <p>• Vous disposez d’une période de temps relativement longue</p>
                                                    <p>• Vous n’avez pas besoin de recourir à des retraits au cours des 10 prochaines années</p>
                                                </div>
                                            ):("")}

                                            {/* Si le profil est : Croissance */}
                                            {questionnaireForUser?.typeProfile==="Croissance" ? (
                                                <div className='my-3'>
                                                    <p>• Votre objectif principal est de réaliser le meilleur rendement possible</p>
                                                    <p>• Vous êtes prêt à accepter d’importantes fluctuations de marché</p>
                                                    <p>• Vous n’aurez pas besoin de toucher à ces pl acements pendant les 15 prochaines années.</p>
                                                </div>
                                            ):("")}
                                            

                                        </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        <div className='col-lg-1 col-md-1'></div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TypeProfil;
