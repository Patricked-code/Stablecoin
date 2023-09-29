import { useState, useEffect } from 'react';
import ProgressBar from '../ProgressBar';
import Link from 'next/link';
import Swal from 'sweetalert2';
import Router from "next/router";

const CQuestionnaireAmlFour = () => {
// Variable de l'url de l'api
const API_URL =process.env.NEXT_PUBLIC_URL_API;

const [isLoggingIn, setIsLoggingIn] = useState(false);
const [messageError, setMessageError] = useState();
const [currentKycEntrepriseStatut, setCurrentKycEntrepriseStatut] = useState();


const [answers, setAnswers] = useState({
  taxHavens: '',
  cashAboveFifteenThousand: '',
  politicallyExposed: '',
  cashAboveTenThousand: '',
  kycProcedures: '',
  amlRiskAssessment: '',
  transactionMonitoring: '',
  clientsAboveOneHundredThousand: '',
  transactionDeclaration: '',
  illegalActivities: ''
});


//localStorage pour récupérer une valeur en cliquant sur un bouton Recompleter qui indique qu'on veut modifier une partie Kyc 
useEffect(() => {
  const kycStatut = localStorage.getItem('currentKycEntrepriseStatut')  
  setCurrentKycEntrepriseStatut(kycStatut)
}, [currentKycEntrepriseStatut]);


  // Fonction d'envoie des informations du questionnaire four
  const updateQuizFour= async (event) => {
    event.preventDefault();
    setIsLoggingIn(true);
    
    try {

        const dataa = {
          taxHavens:answers?.taxHavens,
          cashAboveFifteenThousand:answers?.cashAboveFifteenThousand,
          politicallyExposed:answers?.politicallyExposed,
          cashAboveTenThousand:answers?.cashAboveTenThousand,
          kycProcedures:answers?.kycProcedures,
          amlRiskAssessment:answers?.amlRiskAssessment,
          transactionMonitoring:answers?.transactionMonitoring,
          clientsAboveOneHundredThousand:answers?.clientsAboveOneHundredThousand, 
          transactionDeclaration:answers?.transactionDeclaration, 
          illegalActivities:answers?.illegalActivities
        }

            const token = localStorage.getItem('tokenEnCours') //Le token récuperé

            const result = await fetch(`${API_URL}/api/kyc/business/update-kyc-quiz-four`, {
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
                        Router.push("/profil/kyc/entreprise/identite-one"); 
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
            <br/><br/><h1 className='text-center'>Questionnaires AML 4</h1>
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
            <form onSubmit={updateQuizFour}>

              <div className='mt-3'>
                <label>
                  Votre entreprise a-t-elle des relations commerciales avec des pays connus pour être des paradis fiscaux, tels que les îles Caymans, les îles Vierges Britanniques ou le Luxembourg ?
                </label>
                <select className='form-control mt-2' name="taxHavens" onChange={handleChange}>
                  <option value="">Choisissez une option</option>
                  <option value="Oui">Oui</option>
                  <option value="Non">Non</option>
                </select>
              </div>

              {/* Ajoutez ici les autres questions */}
              {/* Question 2 */}
              <div className='mt-3'>
                <label>
                  Acceptez-vous des paiements en especes pour des transactions d'une valeur superieure à 15 000 euros provenant de pays comme la Suisse, Monaco ou Singapour ?
                </label>
                <select className='form-control mt-2' name="cashAboveFifteenThousand" onChange={handleChange}>
                  <option value="">Choisissez une option</option>
                  <option value="Oui">Oui</option>
                  <option value="Non">Non</option>
                </select>
              </div>

              {/* Question 3 */}
              <div className='mt-3'>
                <label>
                  Avez-vous des clients politiquement exposes (PEP) ou des membres de leur famille proche parmi vos actionnaires, dirigeants ou beneficiaires effectifs provenant de pays tels que la Russie, l'Arabie saoudite ou la Chine ?
                </label>
                <select className='form-control mt-2' name="politicallyExposed" onChange={handleChange}>
                  <option value="">Choisissez une option</option>
                  <option value="Oui">Oui</option>
                  <option value="Non">Non</option>
                </select>
              </div>

              {/* Question 4 */}
              <div className='mt-3'>
                <label>
                  Votre entreprise accepte-t-elle des paiements en especes pour des transactions d'une valeur superieure à 10 000 dollars americains provenant de pays tels que les Emirats arabes unis, le Qatar ou le Bahrein ?
                </label>
                <select className='form-control mt-2' name="cashAboveTenThousand" onChange={handleChange}>
                  <option value="">Choisissez une option</option>
                  <option value="Oui">Oui</option>
                  <option value="Non">Non</option>
                </select>
              </div>

              {/* Question 5 */}
              <div className='mt-3'>
                <label>
                  Avez-vous mis en place des procedures de connaissance de vos clients (KYC) pour verifier l'identite de vos clients avant d'ouvrir un compte de monnaie electronique, conformement aux reglementations AML en vigueur dans votre pays ?
                </label>
                <select className='form-control mt-2' name="kycProcedures" onChange={handleChange}>
                  <option value="">Choisissez une option</option>
                  <option value="Oui">Oui</option>
                  <option value="Non">Non</option>
                </select>
              </div>

              {/* Question 6 */}
              <div className='mt-3'>
                <label>
                  Disposez-vous de politiques et de procedures pour evaluer le risque de blanchiment d'argent associe à vos clients et à leurs activites, en tenant compte des montants des transactions superieurs à 50 000 euros ou son equivalent dans une autre devise ?
                </label>
                <select className='form-control mt-2' name="amlRiskAssessment" onChange={handleChange}>
                  <option value="">Choisissez une option</option>
                  <option value="Oui">Oui</option>
                  <option value="Non">Non</option>
                </select>
              </div>

              {/* Question 7 */}
              <div className='mt-3'>
                <label>
                  Avez-vous mis en place des mesures de surveillance pour detecter les transactions suspectes ou inexpliquees effectuees par vos clients, en particulier celles impliquant des pays sous sanctions internationales, tels que la Coree du Nord, l'Iran ou le Venezuela ?
                </label>
                <select className='form-control mt-2' name="transactionMonitoring" onChange={handleChange}>
                  <option value="">Choisissez une option</option>
                  <option value="Oui">Oui</option>
                  <option value="Non">Non</option>
                </select>
              </div>

              {/* Question 8 */}
              <div className='mt-3'>
                <label>
                  Avez-vous des clients qui effectuent frequentement des transactions d'un montant superieur à 100 000 euros provenant de pays consideres comme des paradis fiscaux, tels que les Iles Caymans, les Iles Vierges Britanniques ou les Seychelles ?
                </label>
                <select className='form-control mt-2' name="clientsAboveOneHundredThousand" onChange={handleChange}>
                  <option value="">Choisissez une option</option>
                  <option value="Oui">Oui</option>
                  <option value="Non">Non</option>
                </select>
              </div>

              {/* Question 9 */}
              <div className='mt-3'>
                <label>
                  Avez-vous etabli des seuils de declaration pour les transactions effectuees par vos clients, notamment celles depassant 20 000 euros en especes ou 10 000 euros en crypto-monnaies ?
                </label>
                <select className='form-control mt-2' name="transactionDeclaration" onChange={handleChange}>
                  <option value="">Choisissez une option</option>
                  <option value="Oui">Oui</option>
                  <option value="Non">Non</option>
                </select>
              </div>

              {/* Question 10 */}
              <div className='mt-3'>
                <label>
                  Votre entreprise a-t-elle des relations commerciales avec des entites impliquees dans des activites illegales connues, telles que le trafic de drogue, la traite des etres humains ou le financement du terrorisme, en provenance de pays tels que la Colombie, le Nigeria ou l'Afghanistan ?
                </label>
                <select className='form-control mt-2' name="illegalActivities" onChange={handleChange}>
                  <option value="">Choisissez une option</option>
                  <option value="Oui">Oui</option>
                  <option value="Non">Non</option>
                </select>
              </div>

              {/* <button type="submit">Envoyer</button> */}
              <div className="form-group mb-6 mt-3 col-lg-12 col-md-12  row justify-content-between">
                <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">
                    <Link href='/profil/kyc/entreprise/questionnaire-aml-three/' className="align-right">
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

export default CQuestionnaireAmlFour;
