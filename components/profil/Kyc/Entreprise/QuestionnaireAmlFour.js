import { useState } from 'react';
import ProgressBar from '../ProgressBar';
import Link from 'next/link';


const CQuestionnaireAmlFour = () => {

const [answers, setAnswers] = useState({
  taxHavens: '',
  cashAbove15k: '',
  politicallyExposed: '',
  cashAbove10k: '',
  kycProcedures: '',
  amlRiskAssessment: '',
  transactionMonitoring: '',
  clientsAbove100k: '',
  transactionDeclaration: '',
  illegalActivities: ''
});

// LES BONS
// taxHavens
//   cashAbove15k
//   politicallyExposed
//   cashAbove10k
//   kycProcedures
//   amlRiskAssessment
//   transactionMonitoring
//   clientsAbove100k
//   transactionDeclaration
//   illegalActivities


  

  const handleChange = (e) => {
    setAnswers({ ...answers, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Envoyer les réponses à l'endroit approprié ou effectuer d'autres actions nécessaires
    console.log(answers);
    // Faites ici votre appel API ou toute autre action nécessaire avec les réponses
  };

  // La barre de progression de KYC du profil entreprise
  const stepsEntreprise = ["AML","Identité","Représentant", "Bénéficiaire","Control", "Politique", "Opérations", "Fonds", "Financière", "Documents"];

  const activeStepEntreprise = -1;
  // Fin

  return (
    <>
      <ProgressBar className="mb-15" steps={stepsEntreprise} activeStep={activeStepEntreprise} />

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
            <form onSubmit={handleSubmit}>

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
                <select className='form-control mt-2' name="cashAbove15k" onChange={handleChange}>
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
                <select className='form-control mt-2' name="cashAbove10k" onChange={handleChange}>
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
                <select className='form-control mt-2' name="clientsAbove100k" onChange={handleChange}>
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
                                    <Link href='/profil/kyc/entreprise/questionnaire-aml-five/' className="align-right">
                                        <a
                                        className=""
                                        >
                                            <button className="btn btn-primary " type='button'  > Suivant </button>
                                        </a>   
                                    </Link>                          
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
