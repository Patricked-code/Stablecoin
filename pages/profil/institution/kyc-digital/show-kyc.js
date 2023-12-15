import React,{ useState, useEffect } from 'react';
import ShowKycEntreprise from '../../../../components/profil/Institution/KycDigital/ShowKycEntreprise';
import ShowKycParticular from '../../../../components/profil/Institution/KycDigital/ShowKycParticular';
import SidebarProfil from '../../../../components/profil/SideBar/Sidebar';



const index = () => {
  // Variable de l'url de l'api
  const API_URL =process.env.NEXT_PUBLIC_URL_API

  const [showSidebar, setShowSidebar] = useState(false);
  const [oneKycRequest, setOneKycRequest] = useState();
  const [kycRequestId, setKycRequestId] = useState();

  useEffect(async () => {
    /**
       * Récupère l'identifiant de la demande KYC depuis le stockage local.
       * @const {string|null} kycRequestId
      */
      const kycId = localStorage.getItem('kycRequestId'); 
      setKycRequestId(kycId)
  }, [kycRequestId]);

  /**
     * Hook d'effet pour récupérer les données d'une demande d'accès en fonction de son ID.
     * Les données sont stockées dans l'état `OnekycRequest`.
     *
     * @async
     * @function
     * @returns {void}
  */
  useEffect(async () => {

    /**
     * Fonction pour obtenir une demande d'accès en fonction de son ID.
     *
     * @async
     * @returns {void}
     */
    const getOneKycRequest = async (_kycRequestId) => {
      /**
       * Récupère le token en cours depuis le stockage local.
       * @const {string|null} token
     */
      const token = localStorage.getItem('tokenEnCours');

      

        try {
            /**
             * Résultat de la requête pour récupérer une demandes d'accès en fonction de son ID.
             * @type {Response}
             */
            const result = await fetch(`${API_URL}/api/kyc/find-one-kyc-request/${kycRequestId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!result.ok) {
                throw new Error('Failed to fetch KYC request data');
            }

            /**
             * Données des demandes d'accès de l'utilisateur connecté.
             * @type {object[]}
             */
            const data = await result.json();
            setOneKycRequest(data);
        } catch (error) {
            // Gérer les erreurs de manière appropriée, par exemple, définir un état d'erreur.
            console.error('Erreur lors de la récupération des demandes d\'accès KYC:', error);
        }
    };

    // Appel de la fonction pour récupérer les demandes d'accès de l'utilisateur connecté.
    if (kycRequestId) {
        await getOneKycRequest(kycRequestId);
    }
    
  }, [kycRequestId]);

  console.log('kycRequestId=>',kycRequestId)


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

          {/* CONTENU KYC PARTICULIER */}
          {oneKycRequest?.particularKycId ? <ShowKycParticular kycForParticularId={oneKycRequest?.particularKycId} kycRequestId={oneKycRequest?.id}/> 
          // CONTENU KYC ENTREPRISE 
          : oneKycRequest?.entrepriseKycId ? <ShowKycEntreprise kycForBusinessId={oneKycRequest?.entrepriseKycId} kycRequestId={oneKycRequest?.id}/>:<p className='mt-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white'>Indisponible</p>}
          {/* FIN */}

        </main>
    </>
  );
};

export default index;
