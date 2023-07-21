import { useState } from 'react';
import ProgressBar from '../ProgressBar';
import Link from 'next/link';



const CQuestionnaireAmlThree = () => {
  const [answers, setAnswers] = useState({
    transactionMontantSuperieur: '',
    paiementEspeces: '',
    relationsIranCoreeSyrieCuba: '',
    transactionsParadisFiscaux: '',
    paiementsCryptoMonnaies: '',
    relationsSanctionsInternationales: '',
    transactionsFaibleTauxImposition: '',
    clientsPolitiquementExposes: '',
    paiementsSocietesOffshore: '',
    transactionsTransfrontalieres: '',
    relationsPaysSanctionnes: '',
    paiementsPaysHautRisque: '',
    transactionsMarchandisesRestreintes: '',
    relationsActivitesIllegales: '',
    paiementsJuridictionsNonCooperatives: '',
    transactionsComptesBancairesOffshores: '',
    clientsTransactionsFrequentes: '',
    paiementsEspècesTiers: '',
    transactionsLiensTerrorisme: ''
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
            <form onSubmit={handleSubmit}>

              <div className='mt-3'>
                <label>
                  Effectuez-vous des transactions en espèces d'un montant supérieur à 10 000 euros (ou équivalent dans une autre devise) provenant d'activités telles que la vente de bijoux, de voitures d'occasion ou de biens immobiliers ?
                </label>
                <select className='form-control mt-2' name="transactionMontantSuperieur" onChange={handleChange}>
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
                <select className='form-control mt-2' name="relationsPaysSanctionnes" onChange={handleChange}>
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
                <select className='form-control mt-2' name="paiementsPaysHautRisque" onChange={handleChange}>
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
                <select className='form-control mt-2' name="transactionsMarchandisesRestreintes" onChange={handleChange}>
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
                <select className='form-control mt-2' name="relationsActivitesIllegales" onChange={handleChange}>
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
                <select className='form-control mt-2' name="paiementsJuridictionsNonCooperatives" onChange={handleChange}>
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
                <select className='form-control mt-2' name="transactionsComptesBancairesOffshores" onChange={handleChange}>
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
                <select className='form-control mt-2' name="clientsTransactionsFrequentes" onChange={handleChange}>
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
                <select className='form-control mt-2' name="paiementsEspècesTiers" onChange={handleChange}>
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
                <select className='form-control mt-2' name="transactionsLiensTerrorisme" onChange={handleChange}>
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
                                    <Link href='/profil/kyc/entreprise/questionnaire-aml-four/' className="align-right">
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

export default CQuestionnaireAmlThree;
