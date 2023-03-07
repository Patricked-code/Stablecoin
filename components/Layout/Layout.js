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
      pathname === "/profil/retrait/retrait-carte"||
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
      pathname === "/profil/kyc/entreprise/justificatif-domicile"
      



      ? '' : <Navbar />}
      {/* <Navbar /> */}

      {children}

      {pathname === "/profil"|| 
      pathname === "/profil/dashboard" || 
      pathname === "/profil/kyc/particulier" ||
      pathname === "/profil/kyc/particulier/seconde-phase"||
      pathname === "/profil/action"||
      pathname === "/profil/achat/achat-carte"||
      pathname === "/profil/retrait/retrait-carte"||
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
