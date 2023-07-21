import { useState } from 'react';
import ProgressBar from '../ProgressBar';
import Link from 'next/link';



const CQuestionnaireAmlFive = () => {
  const [answers, setAnswers] = useState({
    proceduresSignalementTransactionsSuspectes: '',
    mesuresFormationSensibilisationEmployes: '',
    proceduresEvaluationGestionRisques: '',
    evaluationRisquesBlanchimentArgent: '',
    mesuresConfidentialiteSecuriteInformations: '',
    proceduresEvaluationTiers: '',
    mecanismesCommunicationInternes: '',
    auditsConformiteReglementations: '',
    relationsPaysNonReglementes: '',
    proceduresGestionNonConformite: ''
  });

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
            <br/><br/><h1 className='text-center'>Questionnaires AML 5</h1>
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
                  Avez-vous mis en place des procédures pour signaler les transactions suspectes aux autorités compétentes conformément aux réglementations AML en vigueur dans votre pays, en respectant les délais et les protocoles spécifiques ?
                </label>
                <select className='form-control mt-2' name="proceduresSignalementTransactionsSuspectes" onChange={handleChange}>
                  <option value="">Choisissez une option</option>
                  <option value="Oui">Oui</option>
                  <option value="Non">Non</option>
                </select>
              </div>

              {/* Ajoutez ici les autres questions */}
              {/* Question 12 */}
              <div className='mt-3'>
                <label>
                  Avez-vous mis en place des mesures de formation et de sensibilisation régulières pour vos employés sur les risques de blanchiment d'argent et les obligations AML, conformément aux directives de l'autorité de régulation AML de votre pays ?
                </label>
                <select className='form-control mt-2' name="mesuresFormationSensibilisationEmployes" onChange={handleChange}>
                  <option value="">Choisissez une option</option>
                  <option value="Oui">Oui</option>
                  <option value="Non">Non</option>
                </select>
              </div>

              {/* Question 13 */}
              <div className='mt-3'>
                <label>
                  Votre entreprise dispose-t-elle de procédures pour évaluer et gérer les risques liés au blanchiment d'argent et au financement du terrorisme, notamment en utilisant des outils de screening des entités et des individus ?
                </label>
                <select className='form-control mt-2' name="proceduresEvaluationGestionRisques" onChange={handleChange}>
                  <option value="">Choisissez une option</option>
                  <option value="Oui">Oui</option>
                  <option value="Non">Non</option>
                </select>
              </div>

              {/* Question 14 */}
              <div className='mt-3'>
                <label>
                  Avez-vous évalué les risques liés au blanchiment d'argent spécifiques à votre entreprise et à vos activités de monnaie électronique, en prenant en compte les recommandations internationales et les règles établies par l'autorité de régulation AML de votre pays ?
                </label>
                <select className='form-control mt-2' name="evaluationRisquesBlanchimentArgent" onChange={handleChange}>
                  <option value="">Choisissez une option</option>
                  <option value="Oui">Oui</option>
                  <option value="Non">Non</option>
                </select>
              </div>

              {/* Question 15 */}
              <div className='mt-3'>
                <label>
                  Votre entreprise a-t-elle des mesures en place pour protéger la confidentialité et la sécurité des informations relatives à vos clients et à leurs activités de monnaie électronique, conformément aux exigences de protection des données de votre pays ?
                </label>
                <select className='form-control mt-2' name="mesuresConfidentialiteSecuriteInformations" onChange={handleChange}>
                  <option value="">Choisissez une option</option>
                  <option value="Oui">Oui</option>
                  <option value="Non">Non</option>
                </select>
              </div>

              {/* Question 16 */}
              <div className='mt-3'>
                <label>
                  Avez-vous des procédures pour évaluer les tiers avec lesquels vous faites affaire, en vérifiant leur réputation, leur historique et leur conformité aux règles AML internationales, notamment pour les partenaires situés dans des juridictions à haut risque ?
                </label>
                <select className='form-control mt-2' name="proceduresEvaluationTiers" onChange={handleChange}>
                  <option value="">Choisissez une option</option>
                  <option value="Oui">Oui</option>
                  <option value="Non">Non</option>
                </select>
              </div>

              {/* Question 17 */}
              <div className='mt-3'>
                <label>
                  Avez-vous mis en place des mécanismes de communication internes pour signaler les comportements suspects ou les violations potentielles des règles AML, conformément aux protocoles de signalement établis par l'autorité de régulation AML de votre pays ?
                </label>
                <select className='form-control mt-2' name="mecanismesCommunicationInternes" onChange={handleChange}>
                  <option value="">Choisissez une option</option>
                  <option value="Oui">Oui</option>
                  <option value="Non">Non</option>
                </select>
              </div>

              {/* Question 18 */}
              <div className='mt-3'>
                <label>
                  Avez-vous réalisé des audits internes ou externes pour évaluer votre conformité aux réglementations AML et pour identifier d'éventuelles lacunes, en se basant sur les standards internationaux et les meilleures pratiques de l'industrie ?
                </label>
                <select className='form-control mt-2' name="auditsConformiteReglementations" onChange={handleChange}>
                  <option value="">Choisissez une option</option>
                  <option value="Oui">Oui</option>
                  <option value="Non">Non</option>
                </select>
              </div>

              {/* Question 19 */}
              <div className='mt-3'>
                <label>
                  Votre entreprise a-t-elle des relations commerciales avec des personnes ou des entités qui ne sont pas soumises à des réglementations strictes de lutte contre le blanchiment d'argent et les activités illicites, en provenance de pays tels que la Somalie, le Yemen ou le Soudan ?
                </label>
                <select className='form-control mt-2' name="relationsPaysNonReglementes" onChange={handleChange}>
                  <option value="">Choisissez une option</option>
                  <option value="Oui">Oui</option>
                  <option value="Non">Non</option>
                </select>
              </div>

              {/* Question 20 */}
              <div className='mt-3'>
                <label>
                  Avez-vous mis en place des procédures pour gérer les cas de non-conformité et prendre les mesures correctives appropriées, en suivant les directives de l'autorité de régulation AML de votre pays et en tenant compte des éventuelles sanctions ou pénalités ?
                </label>
                <select className='form-control mt-2' name="proceduresGestionNonConformite" onChange={handleChange}>
                  <option value="">Choisissez une option</option>
                  <option value="Oui">Oui</option>
                  <option value="Non">Non</option>
                </select>
              </div>

              {/* <button type="submit">Envoyer</button> */}
              <div className="form-group mb-6 mt-3 col-lg-12 col-md-12  row justify-content-between">
                                <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">
                                    <Link href='/profil/kyc/entreprise/questionnaire-aml-four/' className="align-right">
                                        <a
                                        className=""
                                        >
                                            <button className="btn btn-primary " type='button'  > Précédente </button>
                                        </a>   
                                    </Link>                          
                                </div>
                                <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">
                                    <Link href='/profil/kyc/entreprise/identite-one/' className="align-right">
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

export default CQuestionnaireAmlFive;
