import { useState, useEffect } from 'react';
import ProgressBar from '../ProgressBar';
import Link from 'next/link';
import Swal from 'sweetalert2';
import Router from "next/router";


const CQuestionnaireAmlThree = () => {
  // Variable de l'url de l'api
  const API_URL =process.env.NEXT_PUBLIC_URL_API;

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [messageError, setMessageError] = useState();
  const [currentKycEntrepriseStatut, setCurrentKycEntrepriseStatut] = useState();


  const [answers, setAnswers] = useState({
    transactionAmountHigher: '',
    relationsSanctionedCountries: '',
    highRiskCountryPayments: '',
    restrictedGoodsTransactions: '',
    relationsIllegalActivities: '',
    noCooperativeJurisdictionPayments: '',
    offshoreBankAccountsTransactions: '',
    frequentClientsTransactions: '',
    thirdPartyCashPayments: '',
    transactionsTerrorismLinks: ''
  });

  // Fonction d'envoie des informations du questionnaire Three
  const updateQuizThree= async (event) => {
    event.preventDefault();
    setIsLoggingIn(true);
    
    try {

        const dataa = {
          transactionAmountHigher:answers?.transactionAmountHigher,
          relationsSanctionedCountries:answers?.relationsSanctionedCountries,
          highRiskCountryPayments:answers?.highRiskCountryPayments,
          relationsIllegalActivities:answers?.relationsIllegalActivities,
          noCooperativeJurisdictionPayments:answers?.noCooperativeJurisdictionPayments,
          offshoreBankAccountsTransactions:answers?.offshoreBankAccountsTransactions,
          thirdPartyCashPayments:answers?.thirdPartyCashPayments,
          transactionsTerrorismLinks:answers?.transactionsTerrorismLinks
        }

            const token = localStorage.getItem('tokenEnCours') //Le token récuperé

            const result = await fetch(`${API_URL}/api/kyc/business/update-kyc-quiz-three`, {
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
            if (data.message) {
            setMessageError(data.message)
            setIsLoggingIn(false);
            Swal.fire({
                position: 'center',
                icon: 'error',
                html: `<p> ${messageError} </p>` ,
                showConfirmButton: false,
                timer: 10000
            })
            }else{
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    html: `<p> Vos réponses ont été sauvegardées avec succès.</p>` ,
                    showConfirmButton: false,
                    timer: 5000
                }),
                setTimeout(() => {
                    if (currentKycEntrepriseStatut==="1") {
                        Router.push("/profil/kyc/entreprise/resultat-kyc"); 
        
                    }else{
                        Router.push("/profil/kyc/entreprise/questionnaire-aml-four"); 
                    }
                }, 5000)
            }
            // Fin condition 
        } catch {
        setIsLoggingIn(false);
        }
  };
  // Fin

  
  const handleChange = (e) => {
    setAnswers({ ...answers, [e.target.name]: e.target.value });
  };

  
// La barre de progression de KYC du profil entreprise
const stepsEntreprise = ["AML","Identité","Représentant", "Bénéficiaire","Control", "Politique", "Opérations", "Fonds", "Financière", "Documents"];

const activeStepEntreprise = -1;
// Fin

// ********************************************************************************
  // LA PARTIE POUR EVITER L'AFFICHAGE DES LA BARRE DE PROGRSSION SUR MOBILE
// ********************************************************************************
  
// Utilisez un état local pour stocker la largeur de l'écran
const [windowWidth, setWindowWidth] = useState(0);
// Utilisez useEffect pour obtenir la largeur de l'écran une fois que le composant est monté
useEffect(() => {
  // Obtenez la largeur de l'écran et mettez à jour l'état local
  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  // Ajoutez un gestionnaire d'événement pour redimensionner la fenêtre
  window.addEventListener('resize', handleResize);

  // Appelez handleResize une fois pour obtenir la largeur initiale
  handleResize();

  // Nettoyez le gestionnaire d'événement lors du démontage du composant
  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, []);

// Conditionnez l'affichage de ProgressBar en fonction de la largeur de l'écran
const showProgressBar = windowWidth >= 1180; // Par exemple, considérez les écrans de 768 pixels ou plus comme des ordinateurs

// *****************FIN LA PARTIE POUR EVITER L'AFFICHAGE DES LA BARRE DE PROGRSSION SUR MOBILE*****


  return (
    <>
  {showProgressBar && <ProgressBar className="mb-15" steps={stepsEntreprise} activeStep={activeStepEntreprise} />}

      <div className=''>
        <div className=' mx-15'>
          <div className='py-10'>
            <br/><br/><h1 className='text-center'>Questionnaires AML 3</h1>
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
        <div className='row'>
          <div className='col-lg-3 col-md-12'></div>

          <div className='m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white cryptocurrency-search-box login-form col-lg-6 col-md-12'>
            <form onSubmit={updateQuizThree}>

              <div className='mt-3'>
                <label>
                  Effectuez-vous des transactions en espèces d'un montant supérieur à 10 000 euros (ou équivalent dans une autre devise) provenant d'activités telles que la vente de bijoux, de voitures d'occasion ou de biens immobiliers ?
                </label>
                <select className='form-control mt-2' name="transactionAmountHigher" onChange={handleChange}>
                  <option value="">Choisissez une option</option>
                  <option value="Oui">Oui</option>
                  <option value="Non">Non</option>
                </select>
              </div>

              {/* Ajoutez ici les autres questions */}
              {/* Question 11 */}
              <div className='mt-3'>
                <label>
                  Avez-vous des relations commerciales avec des individus ou des entités situés dans des pays soumis à des sanctions internationales, tels que la Russie, le Venezuela ou le Myanmar, notamment dans des secteurs tels que l'énergie, les armes ou les médias ?
                </label>
                <select className='form-control mt-2' name="relationsSanctionedCountries" onChange={handleChange}>
                  <option value="">Choisissez une option</option>
                  <option value="Oui">Oui</option>
                  <option value="Non">Non</option>
                </select>
              </div>

              {/* Question 12 */}
              <div className='mt-3'>
                <label>
                  Acceptez-vous des paiements en liquide provenant de pays considérés comme à haut risque de blanchiment d'argent, notamment dans des secteurs tels que le tourisme, l'immobilier ou la restauration ?
                </label>
                <select className='form-control mt-2' name="highRiskCountryPayments" onChange={handleChange}>
                  <option value="">Choisissez une option</option>
                  <option value="Oui">Oui</option>
                  <option value="Non">Non</option>
                </select>
              </div>

              {/* Question 13 */}
              <div className='mt-3'>
                <label>
                  Effectuez-vous des transactions impliquant des marchandises soumises à des restrictions d'exportation ou de contrôle, telles que des armes, des produits chimiques dangereux ou des technologies sensibles, notamment dans des secteurs tels que la recherche scientifique, la défense ou l'aérospatiale ?
                </label>
                <select className='form-control mt-2' name="restrictedGoodsTransactions" onChange={handleChange}>
                  <option value="">Choisissez une option</option>
                  <option value="Oui">Oui</option>
                  <option value="Non">Non</option>
                </select>
              </div>

              {/* Question 14 */}
              <div className='mt-3'>
                <label>
                  Avez-vous des relations commerciales avec des entités ou des individus impliqués dans des activités illégales connues, telles que le trafic de drogue, la traite des êtres humains ou le financement du terrorisme, notamment dans des secteurs tels que la logistique, la sécurité ou la finance informelle ?
                </label>
                <select className='form-control mt-2' name="relationsIllegalActivities" onChange={handleChange}>
                  <option value="">Choisissez une option</option>
                  <option value="Oui">Oui</option>
                  <option value="Non">Non</option>
                </select>
              </div>

              {/* Question 15 */}
              <div className='mt-3'>
                <label>
                  Acceptez-vous des paiements en provenance de pays considérés comme des juridictions non coopératives en matière de lutte contre le blanchiment d'argent, notamment dans des secteurs tels que le commerce de métaux précieux, le jeu en ligne ou la cryptomonnaie ?
                </label>
                <select className='form-control mt-2' name="noCooperativeJurisdictionPayments" onChange={handleChange}>
                  <option value="">Choisissez une option</option>
                  <option value="Oui">Oui</option>
                  <option value="Non">Non</option>
                </select>
              </div>

              {/* Question 16 */}
              <div className='mt-3'>
                <label>
                  Effectuez-vous des transactions impliquant des comptes bancaires offshores ou des sociétés-écrans dans le but de dissimuler l'identité des parties ou la source des fonds, notamment dans des secteurs tels que la finance internationale, l'investissement ou le commerce international ?
                </label>
                <select className='form-control mt-2' name="offshoreBankAccountsTransactions" onChange={handleChange}>
                  <option value="">Choisissez une option</option>
                  <option value="Oui">Oui</option>
                  <option value="Non">Non</option>
                </select>
              </div>

              {/* Question 17 */}
              <div className='mt-3'>
                <label>
                  Avez-vous des clients qui effectuent des transactions fréquentes de montants importants sans justification économique claire, notamment dans des secteurs tels que l'immobilier de luxe, la joaillerie ou la gestion de patrimoine ?
                </label>
                <select className='form-control mt-2' name="frequentClientsTransactions" onChange={handleChange}>
                  <option value="">Choisissez une option</option>
                  <option value="Oui">Oui</option>
                  <option value="Non">Non</option>
                </select>
              </div>

              {/* Question 18 */}
              <div className='mt-3'>
                <label>
                  Acceptez-vous des paiements en espèces provenant de tiers sans vérifier l'identité des parties ou la légitimité des fonds, notamment dans des secteurs tels que l'hôtellerie, le tourisme ou les jeux d'argent ?
                </label>
                <select className='form-control mt-2' name="thirdPartyCashPayments" onChange={handleChange}>
                  <option value="">Choisissez une option</option>
                  <option value="Oui">Oui</option>
                  <option value="Non">Non</option>
                </select>
              </div>

              {/* Question 19 */}
              <div className='mt-3'>
                <label>
                  Effectuez-vous des transactions avec des individus ou des entités soupçonnés de liens avec des activités terroristes ou des groupes terroristes désignés, notamment dans des secteurs tels que la collecte de fonds, la philanthropie ou la fourniture de services financiers ?
                </label>
                <select className='form-control mt-2' name="transactionsTerrorismLinks" onChange={handleChange}>
                  <option value="">Choisissez une option</option>
                  <option value="Oui">Oui</option>
                  <option value="Non">Non</option>
                </select>
              </div>

              {/* <button type="submit">Envoyer</button> */}
              <div className="form-group mb-6 mt-3 col-lg-12 col-md-12  row justify-content-between">
                <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">
                    <Link href='/profil/kyc/entreprise/questionnaire-aml-two/' className="align-right">
                        <a
                        className=""
                        >
                            <button className="btn btn-primary " type='button'  > Précédente </button>
                        </a>   
                    </Link>                          
                </div>
                <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">
                  <button className="btn btn-primary " type='submit' disabled={isLoggingIn}  > Suivant </button>
                </div>
            </div> 
            </form>
          </div>
          <div className='col-lg-3 col-md-12'></div>
        </div>
      </div>
    </>
  );
};

export default CQuestionnaireAmlThree;
