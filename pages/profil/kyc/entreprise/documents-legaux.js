import React, { useState, useEffect } from 'react';

import CDocumentsIdentites from '../../../../components/profil/Kyc/Entreprise/Documents_legaux/DocumentsIdentites';
import CFactureEtJustPouvoirs from '../../../../components/profil/Kyc/Entreprise/Documents_legaux/FactureEtJustPouvoir';
import CPvEtLocalisation from '../../../../components/profil/Kyc/Entreprise/Documents_legaux/PvEtLocalisation';
import CRegistreEtDfe from '../../../../components/profil/Kyc/Entreprise/Documents_legaux/RegistreEtDfe';
import CStatusEtDelegation from '../../../../components/profil/Kyc/Entreprise/Documents_legaux/StatutsEtDelegation';
import ProgressBar from '../../../../components/profil/Kyc/ProgressBar';
import SidebarProfil from '../../../../components/profil/SideBar/Sidebar';



const documentLegaux = () => {
  // Variable de l'url de l'api
  const API_URL =process.env.NEXT_PUBLIC_URL_API
   // Variable de l'api key de stablecoin
   const API_KEY_STABLECOIN = process.env.NEXT_PUBLIC_API_KEY_STABLECOIN
  const [showSidebar, setShowSidebar] = useState(false);
  const [kycDocument, setKycDocument] = useState(false);
  const [currentKycEntrepriseStatut, setCurrentKycEntrepriseStatut] = useState();

  //localStorage pour récupérer une valeur en cliquant sur un bouton Recompleter qui indique qu'on veut modifier une partie Kyc 
  useEffect(() => {
    const kycStatut = localStorage.getItem('currentKycEntrepriseStatut')  
    setCurrentKycEntrepriseStatut(kycStatut)
    console.log("kycStatut 00000000=>",kycStatut)
  }, [currentKycEntrepriseStatut]);


  // RECUPERER LES DONNEES DU KYC DES DOCUMENTS LEGAUX DE L'ENTREPRISE CONNECTEE
  useEffect(async() => {
    const token = localStorage.getItem('tokenEnCours')
    
        const getKycDocument = async () => {
        const resKyc = await fetch(`${API_URL}/api/kyc/business/find-kyc-business-legal-documents-of-user-signIn`, {
            headers: {
            'Content-Type': 'application/json',
            'x-api-key': `${API_KEY_STABLECOIN}`,
            Authorization:  `Bearer ${token}`,
            },
        })
            .then((resKyc) => resKyc.json())
            .then((data) => {
            setKycDocument(data)

            }) 
        };
        await getKycDocument();
  }, []);
  // FIN



    // La barre de progression de KYC du profil entreprise
    const stepsEntreprise = ["AML","Identité","Représentant", "Bénéficiaire","Control", "Politique", "Opérations", "Fonds", "Financière", "Documents"];
    const activeStepEntreprise = 8;

   

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
        <main className={showSidebar ? 'space-toggle' : null}>
          <header className={`header ${showSidebar ? 'space-toggle' : null}`}>
            <div className='header-toggle mx-30' onClick={() => setShowSidebar(!showSidebar)}>
              <i className={`fas fa-bars text-white  ${showSidebar == "true"? 'fa-solid fa-xmark text-white ' : null}`}></i>
            </div>
          </header>

          <aside className={`sidebar ${showSidebar ? 'showSidebar' : null} z-index-1`}>
            {/* SIDEBAR */}
            <SidebarProfil/>
            {/* FIN */}
          </aside>


          {/* CONTENU PROFIL */}
          {showProgressBar && <ProgressBar className="mb-15" steps={stepsEntreprise} activeStep={activeStepEntreprise} />}

        <div className='' >
            <div className=' mx-15'>
                <div className='py-10'>
                <br/><br/><h1 className='text-center'>Documents légaux de l'entreprise</h1>
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
                {/* On vérifie si l'utilisateur n'est pas cliqué sur un bouton reprendre dans la page de Kyc en attente  */}
                {!currentKycEntrepriseStatut || currentKycEntrepriseStatut == "undefined"?(
                  <>
                    <CRegistreEtDfe kycDocumentId={kycDocument?.id} kycRegister={kycDocument?.register} kycDfe={kycDocument?.dfe}/>
                    <CStatusEtDelegation kycDocumentId={kycDocument?.id} kycRegister={kycDocument?.register} kycDfe={kycDocument?.dfe} kycCopyStatutes={kycDocument?.copyStatutes} kycDelegationPowers={kycDocument?.delegationPowers}/>
                    <CPvEtLocalisation kycDocumentId={kycDocument?.id} kycRegister={kycDocument?.register} kycDfe={kycDocument?.dfe} kycCopyStatutes={kycDocument?.copyStatutes} kycDelegationPowers={kycDocument?.delegationPowers} kycPvAppointment={kycDocument?.pvAppointment} kycMapLocation={kycDocument?.mapLocation}/>
                    <CFactureEtJustPouvoirs kycDocumentId={kycDocument?.id} kycRegister={kycDocument?.register} kycDfe={kycDocument?.dfe} kycCopyStatutes={kycDocument?.copyStatutes} kycDelegationPowers={kycDocument?.delegationPowers} kycPvAppointment={kycDocument?.pvAppointment} kycMapLocation={kycDocument?.mapLocation} kycFacture={kycDocument?.facture} kycProofPower={kycDocument?.proofPower} />
                    <CDocumentsIdentites kycDocumentId={kycDocument?.id} kycRegister={kycDocument?.register} kycDfe={kycDocument?.dfe} kycCopyStatutes={kycDocument?.copyStatutes} kycDelegationPowers={kycDocument?.delegationPowers} kycPvAppointment={kycDocument?.pvAppointment} kycMapLocation={kycDocument?.mapLocation} kycFacture={kycDocument?.facture} kycProofPower={kycDocument?.proofPower} kycIdentity={kycDocument?.identity}/>
                  </>
                  // S'il a cliqué on affiche les composants (formulaires) des documents en fonction du nombre dans contenu dans la variable
                ):(
                  <>
                    {currentKycEntrepriseStatut==1 || currentKycEntrepriseStatut==2 ? (
                      <CRegistreEtDfe kycDocumentId={kycDocument?.id} kycRegister={kycDocument?.register} kycDfe={kycDocument?.dfe}/>
                    ):("")}
                    
                    {currentKycEntrepriseStatut==3 || currentKycEntrepriseStatut==4 ? (
                      <CStatusEtDelegation kycDocumentId={kycDocument?.id} kycRegister={kycDocument?.register} kycDfe={kycDocument?.dfe} kycCopyStatutes={kycDocument?.copyStatutes} kycDelegationPowers={kycDocument?.delegationPowers}/>
                    ):("")}
                    
                    {currentKycEntrepriseStatut==5 || currentKycEntrepriseStatut==6 ? (
                      <CPvEtLocalisation kycDocumentId={kycDocument?.id} kycRegister={kycDocument?.register} kycDfe={kycDocument?.dfe} kycCopyStatutes={kycDocument?.copyStatutes} kycDelegationPowers={kycDocument?.delegationPowers} kycPvAppointment={kycDocument?.pvAppointment} kycMapLocation={kycDocument?.mapLocation}/>
                    ):("")}

                    {currentKycEntrepriseStatut==7 || currentKycEntrepriseStatut==8 ? (
                      <CFactureEtJustPouvoirs kycDocumentId={kycDocument?.id} kycRegister={kycDocument?.register} kycDfe={kycDocument?.dfe} kycCopyStatutes={kycDocument?.copyStatutes} kycDelegationPowers={kycDocument?.delegationPowers} kycPvAppointment={kycDocument?.pvAppointment} kycMapLocation={kycDocument?.mapLocation} kycFacture={kycDocument?.facture} kycProofPower={kycDocument?.proofPower} />
                    ):("")}

                    {currentKycEntrepriseStatut==9 ? (
                      <CDocumentsIdentites kycDocumentId={kycDocument?.id} kycRegister={kycDocument?.register} kycDfe={kycDocument?.dfe} kycCopyStatutes={kycDocument?.copyStatutes} kycDelegationPowers={kycDocument?.delegationPowers} kycPvAppointment={kycDocument?.pvAppointment} kycMapLocation={kycDocument?.mapLocation} kycFacture={kycDocument?.facture} kycProofPower={kycDocument?.proofPower} kycIdentity={kycDocument?.identity}/>
                    ):("")}

                  </>
                )}
              </div>
              <div className='col-lg-3 col-md-12'></div>
            </div>
          </div>

          {/* FIN */}



        </main>
    </>
  );
};

export default documentLegaux;
