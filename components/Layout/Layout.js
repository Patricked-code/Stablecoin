import Head from 'next/head';
import { useRouter } from 'next/router';


//navbar
import Navbar from './Navbar';
// import NavbarTwo from './NavbarTwo';

//footer
import Footer from './Footer';

const Layout = ({ children }) => {
  
  const router = useRouter();
  const { pathname } = router;

  return (
    <>
      <Head>
        <title>Stablecoin</title>
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1, shrink-to-fit=no'
        />
        <meta
          name='description'
          content="E-WARI est un actif numérique fiable adossé au franc CFA - XOF/XAF pour vos transactions et vos investissements . Nous vous offrons les avantages des actifs numériques et de la blockchain associés à la stabilité de l'une des devises les plus échangées en AFRIQUE"
        />
        <meta
          name='og:title'
          property='og:title'
          content='STABLECOIN E-WARI DE WEALTHTECH INNOVATIONS'
        ></meta>
        <meta
          name='twitter:card'
          content='STABLECOIN E-WARI DE WEALTHTECH INNOVATIONS'
        ></meta>
        {/* <link rel='canonical' href='https://novis-react.envytheme.com'></link> */}
      </Head>

      {/* {pathname === "/auth/authentication"||pathname ==="/auth/enregistrer"||pathname ==="/account/activated"?'' : <Navbar />} */}
      {pathname === "/profil" || 
      pathname === "/callback_register"|| 
      pathname === "/callback"|| 
      pathname === "/account/firstEdition"|| 
      pathname === "/auth/send-link-password"|| 
      pathname === "/auth/reset-password"|| 

      
      pathname === "/profil/dashboard" ||
      pathname === "/profil/kyc/particulier/questionnaires-revenus-one"||
      pathname === "/profil/kyc/particulier/questionnaires-revenus-two" ||
      pathname === "/profil/kyc/particulier/questionnaires-fatca" ||
      pathname === "/profil/kyc/particulier/justificatif-identite-one"||
      pathname === "/profil/kyc/particulier/justificatif-identite-two"||
      pathname === "/profil/kyc/particulier/selfie-with-document"||
      pathname === "/profil/kyc/particulier/resultat-kyc"||
      pathname === "/profil/kyc/particulier/kyc-demandes"||

      pathname === "/profil/action"||
      pathname === "/profil/achat/achat-carte"||
      pathname === "/profil/retrait/retrait-compte-bancaire"||
      pathname === "/profil/achat/achat-mobile"||
      pathname === "/profil/retrait/retrait-mobile"||
      pathname === "/profil/kyc/particulier/justificatif-domicile"||
      pathname === "/profil/kyc/commun/selfie"||
      pathname === "/profil/kyc/commun/signature"||
      pathname === "/profil/informations/connexion"||
      pathname === "/profil/informations/utilisateur"||

      // Kyc entreprise
      pathname === "/profil/kyc/entreprise/questionnaire"||
      pathname === "/profil/kyc/entreprise/questionnaire-aml-two"||
      pathname === "/profil/kyc/entreprise/questionnaire-aml-three"||
      pathname === "/profil/kyc/entreprise/questionnaire-aml-four"||
      pathname === "/profil/kyc/entreprise/identite-one"||
      pathname === "/profil/kyc/entreprise/identite-representant-one"||
      pathname === "/profil/kyc/entreprise/identite-representant-two"||
      pathname === "/profil/kyc/entreprise/beneficiaire-effectif-one"||
      pathname === "/profil/kyc/entreprise/beneficiaire-effectif-two"||
      pathname === "/profil/kyc/entreprise/structure-control-one"||
      pathname === "/profil/kyc/entreprise/structure-control-two"||
      pathname === "/profil/kyc/entreprise/politiquement-exposees-one"||
      pathname === "/profil/kyc/entreprise/politiquement-exposees-two"||
      pathname === "/profil/kyc/entreprise/operations-financieres-one"||
      pathname === "/profil/kyc/entreprise/origine-fonds"||
      pathname === "/profil/kyc/entreprise/information-financiere-one"||
      pathname === "/profil/kyc/entreprise/information-financiere-two"||
      pathname === "/profil/kyc/entreprise/information-financiere-three"||
      pathname === "/profil/kyc/entreprise/information-financiere-four"||
      pathname === "/profil/kyc/entreprise/information-financiere-five"||
      pathname === "/profil/kyc/entreprise/documents-legaux"||
      pathname === "/profil/kyc/entreprise/kyc-demandes"||
      

      pathname === "/profil/kyc/entreprise/justificatif-domicile"||
      pathname === "/profil/kyc/entreprise/resultat-kyc"||
      pathname === "/profil/wallet"||
      pathname === "/profil/paiements/paiements-attente"||

      // POUR LES HISTORIQUES
      pathname === "/profil/historique"||
      pathname === "/profil/historique/stablecoin"||
      pathname === "/profil/historique/mobile-money"||
      pathname === "/profil/historique/investissement/opcvm"||
      pathname === "/profil/historique/bancaire"||


      // KYC OPCVM
      pathname === "/profil/kyc/opcvm/questionnaire-one"||
      pathname === "/profil/kyc/opcvm/questionnaire-two"||
      pathname === "/profil/kyc/opcvm/questionnaire-three"||
      pathname === "/profil/kyc/opcvm/questionnaire-four"||
      pathname === "/profil/kyc/opcvm/questionnaire-five"||
      pathname === "/profil/kyc/opcvm/questionnaire-six"||
      pathname === "/profil/kyc/opcvm/questionnaire-seven"||
      pathname === "/profil/kyc/opcvm/questionnaire-eight"||
      pathname === "/profil/kyc/opcvm/questionnaire-nine"||

      pathname === "/profil/opcvm/type-profil"||
      pathname === "/profil/opcvm/conditions-profil"||
      


      // LES ROUTES DE LA PARTIE DU PROFIL INSTITUTION
      pathname === "/profil/institution/depot-cash"||
      pathname === "/profil/institution/retrait-cash"||
      pathname === "/profil/institution/verifier-documents"||
      pathname === "/profil/institution/autre-verification-documents"||
      pathname === "/profil/institution/verifier-documents-retrait"||
      pathname === "/profil/institution/mintBurn"||
      pathname === "/profil/institution/demande-kyc"||
      pathname === "/profil/institution/kyc-digital"||
      pathname === "/profil/institution/gestion-stablecoin"||

  


      // FIN

      // LES ROUTES DE LA PARTIE DU PROFIL ENTREPRISE / COMMERCANT
      pathname === "/profil/entreprise/actions/demande-paiement"||

      // FIN


      // LES ROUTES DE LA PARTIE ADMIN WWEALTHTECH
      pathname === "/admin/wealthtech"||
      pathname === "/admin/wealthtech/stablecoin"||
      pathname === "/admin/wealthtech/stablecoin/roles/attribuer-roles"||
      pathname === "/admin/wealthtech/stablecoin/mintBurn"||
      pathname === "/admin/wealthtech/kyc"||
      pathname === "/admin/wealthtech/kyc/validation/particular"||
      pathname === "/admin/wealthtech/kyc/validation/entreprise"||
      pathname === "/admin/wealthtech/roles/attribution"





      // FIN


      


      



      ? '' : <Navbar />}
      {/* <Navbar /> */}

      {children}
      
      {pathname === "/profil"|| 
      pathname === "/callback_register"|| 
      pathname === "/callback"|| 
      pathname === "/profil/dashboard" || 
      pathname === "/auth/send-link-password"|| 
      pathname === "/auth/reset-password"|| 

      // KYC particulier
      pathname === "/profil/kyc/particulier/questionnaires-revenus-one" ||
      pathname === "/profil/kyc/particulier/questionnaires-revenus-two" ||
      pathname === "/profil/kyc/particulier/questionnaires-fatca" ||
      pathname === "/profil/kyc/particulier/justificatif-identite-one"||
      pathname === "/profil/kyc/particulier/justificatif-identite-two"||
      pathname === "/profil/kyc/particulier/justificatif-domicile"||
      pathname === "/profil/kyc/particulier/selfie-with-document"||
      pathname === "/profil/kyc/particulier/resultat-kyc"||
      pathname === "/profil/kyc/particulier/kyc-demandes"||
      
      pathname === "/profil/action"||
      pathname === "/profil/achat/achat-carte"||
      pathname === "/profil/retrait/retrait-compte-bancaire"||
      pathname === "/profil/achat/achat-mobile"||
      pathname === "/profil/retrait/retrait-mobile"||
      pathname === "/profil/kyc/commun/selfie"||
      pathname === "/profil/kyc/commun/signature"||
      pathname === "/profil/informations/connexion"||
      pathname === "/profil/informations/utilisateur"||

      // Kyc entreprise
      pathname === "/profil/kyc/entreprise/identite-one"||
      pathname === "/profil/kyc/entreprise/identite-representant-one"||
      pathname === "/profil/kyc/entreprise/identite-representant-two"||
      pathname === "/profil/kyc/entreprise/beneficiaire-effectif-one"||
      pathname === "/profil/kyc/entreprise/beneficiaire-effectif-two"||
      pathname === "/profil/kyc/entreprise/structure-control-one"||
      pathname === "/profil/kyc/entreprise/structure-control-two"||
      pathname === "/profil/kyc/entreprise/politiquement-exposees-one"||
      pathname === "/profil/kyc/entreprise/politiquement-exposees-two"||
      pathname === "/profil/kyc/entreprise/operations-financieres-one"||
      pathname === "/profil/kyc/entreprise/origine-fonds"||
      pathname === "/profil/kyc/entreprise/information-financiere-one"||
      pathname === "/profil/kyc/entreprise/information-financiere-two"||
      pathname === "/profil/kyc/entreprise/information-financiere-three"||
      pathname === "/profil/kyc/entreprise/information-financiere-four"||
      pathname === "/profil/kyc/entreprise/information-financiere-five"||
      pathname === "/profil/kyc/entreprise/documents-legaux"||
      pathname === "/profil/kyc/entreprise/questionnaire"||
      pathname === "/profil/kyc/entreprise/questionnaire-aml-two"||
      pathname === "/profil/kyc/entreprise/questionnaire-aml-three"||
      pathname === "/profil/kyc/entreprise/questionnaire-aml-four"||

      pathname === "/profil/kyc/entreprise/justificatif-domicile"||
      pathname === "/profil/kyc/entreprise/resultat-kyc"||
      pathname === "/profil/kyc/entreprise/kyc-demandes"||

      
      // pathname === "/profil/kyc/entreprise/justificatif-domicile"||
      pathname === "/profil/wallet"||
      pathname === "/profil/paiements/paiements-attente"||

      // POUR LES HISTORIQUES
      pathname === "/profil/historique"||
      pathname === "/profil/historique/stablecoin"||
      pathname === "/profil/historique/mobile-money"||
      pathname === "/profil/historique/investissement/opcvm"||
      pathname === "/profil/historique/bancaire"||

      // KYC OPCVM
      pathname === "/profil/kyc/opcvm/questionnaire-one"||
      pathname === "/profil/kyc/opcvm/questionnaire-two"||
      pathname === "/profil/kyc/opcvm/questionnaire-three"||
      pathname === "/profil/kyc/opcvm/questionnaire-four"||
      pathname === "/profil/kyc/opcvm/questionnaire-five"||
      pathname === "/profil/kyc/opcvm/questionnaire-six"||
      pathname === "/profil/kyc/opcvm/questionnaire-seven"||
      pathname === "/profil/kyc/opcvm/questionnaire-eight"||
      pathname === "/profil/kyc/opcvm/questionnaire-nine"||

      pathname === "/profil/opcvm/type-profil"||
      pathname === "/profil/opcvm/conditions-profil"||

      // LES ROUTES DE LA PARTIE DU PROFIL INSTITUTION
      pathname === "/profil/institution/depot-cash"||
      pathname === "/profil/institution/retrait-cash"||
      pathname === "/profil/institution/verifier-documents"||
      pathname === "/profil/institution/verifier-documents-retrait"||
      pathname === "/profil/institution/autre-verification-documents"||
      pathname === "/profil/institution/mintBurn"||
      pathname === "/profil/institution/demande-kyc"||
      pathname === "/profil/institution/kyc-digital"||
      pathname === "/profil/institution/gestion-stablecoin"||


      // FIN

      // LES ROUTES DE LA PARTIE DU PROFIL ENTREPRISE / COMMERCANT
      pathname === "/profil/entreprise/actions/demande-paiement"||

      // FIN

      // LES ROUTES DE LA PARTIE ADMIN WEALTHTECH
      pathname === "/admin/wealthtech"||
      pathname === "/admin/wealthtech/stablecoin"||
      pathname === "/admin/wealthtech/stablecoin/roles/attribuer-roles"||
      pathname === "/admin/wealthtech/stablecoin/mintBurn"||
      pathname === "/admin/wealthtech/kyc"||
      pathname === "/admin/wealthtech/kyc/validation/particular"||
      pathname === "/admin/wealthtech/kyc/validation/entreprise"||
      pathname === "/admin/wealthtech/roles/attribution"||







      




      pathname === "/auth/authentication" || 
      pathname === "/auth/enregistrer" || 
      pathname === "/account/activated" || 
      pathname ==="/account/twoEdition" || 
      pathname ==="/account/firstEdition"?'' : <Footer />}
        {/* <Footer /> */}

      
    </>
  );
};

export default Layout;
