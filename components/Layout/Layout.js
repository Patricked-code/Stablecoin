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
      pathname === "/profil/dashboard" ||
      pathname === "/profil/kyc/particulier"||
      pathname === "/profil/kyc/particulier/seconde-phase"||
      pathname === "/profil/action"||
      pathname === "/profil/achat/achat-carte"||
      pathname === "/profil/retrait/retrait-compte-bancaire"||
      pathname === "/profil/achat/achat-mobile"||
      pathname === "/profil/retrait/retrait-mobile"||
      pathname === "/profil/kyc/particulier/justificatif-domicile"||
      pathname === "/profil/kyc/commun/selfie"||
      pathname === "/profil/kyc/commun/signature"||
      pathname === "/profil/kyc/entreprise/questionnaire"||
      pathname === "/profil/kyc/entreprise/documents-legaux"||
      pathname === "/profil/informations/connexion"||
      pathname === "/profil/informations/utilisateur"||
      pathname === "/profil/kyc/entreprise/justificatif-identite"||
      pathname === "/profil/kyc/entreprise/justificatif-domicile"||
      pathname === "/profil/wallet"||
      pathname === "/profil/paiements/paiements-attente"||

      // LES ROUTES DE LA PARTIE DU PROFIL INSTITUTION
      pathname === "/profil/institution/depot-cash"||
      pathname === "/profil/institution/retrait-cash"||
      pathname === "/profil/institution/verifier-documents"||
      pathname === "/profil/institution/autre-verification-documents"||
      pathname === "/profil/institution/verifier-documents-retrait"||

      // FIN

      // LES ROUTES DE LA PARTIE DU PROFIL ENTREPRISE / COMMERCANT
      pathname === "/profil/entreprise/actions/demande-paiement"||

      // FIN

      

      // LES ROUTES DE LA PARTIE ADMIN WWEALTHTECH
      pathname === "/admin/wealthtech"||
      pathname === "/admin/wealthtech/stablecoin"||
      pathname === "/admin/wealthtech/stablecoin/roles/attribuer-roles"||
      pathname === "/admin/wealthtech/stablecoin/mintBurn"

      // FIN


      


      



      ? '' : <Navbar />}
      {/* <Navbar /> */}

      {children}

      {pathname === "/profil"|| 
      pathname === "/profil/dashboard" || 
      pathname === "/profil/kyc/particulier" ||
      pathname === "/profil/kyc/particulier/seconde-phase"||
      pathname === "/profil/action"||
      pathname === "/profil/achat/achat-carte"||
      pathname === "/profil/retrait/retrait-compte-bancaire"||
      pathname === "/profil/achat/achat-mobile"||
      pathname === "/profil/retrait/retrait-mobile"||
      pathname === "/profil/kyc/particulier/justificatif-domicile"||
      pathname === "/profil/kyc/commun/selfie"||
      pathname === "/profil/kyc/commun/signature"||
      pathname === "/profil/kyc/entreprise/questionnaire"||
      pathname === "/profil/kyc/entreprise/documents-legaux"||
      pathname === "/profil/informations/connexion"||
      pathname === "/profil/informations/utilisateur"||
      pathname === "/profil/kyc/entreprise/justificatif-identite"||
      pathname === "/profil/kyc/entreprise/justificatif-domicile"||
      // pathname === "/profil/kyc/entreprise/justificatif-domicile"||
      pathname === "/profil/wallet"||
      pathname === "/profil/paiements/paiements-attente"||

      // LES ROUTES DE LA PARTIE DU PROFIL INSTITUTION
      pathname === "/profil/institution/depot-cash"||
      pathname === "/profil/institution/retrait-cash"||
      pathname === "/profil/institution/verifier-documents"||
      pathname === "/profil/institution/verifier-documents-retrait"||
      pathname === "/profil/institution/autre-verification-documents"||

      // FIN

      // LES ROUTES DE LA PARTIE DU PROFIL ENTREPRISE / COMMERCANT
      pathname === "/profil/entreprise/actions/demande-paiement"||

      // FIN

      // LES ROUTES DE LA PARTIE ADMIN WEALTHTECH
      pathname === "/admin/wealthtech"||
      pathname === "/admin/wealthtech/stablecoin"||
      pathname === "/admin/wealthtech/stablecoin/roles/attribuer-roles"||
      pathname === "/admin/wealthtech/stablecoin/mintBurn"||




      




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
