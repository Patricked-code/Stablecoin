import React from 'react';

const Paiement = ({pt5}) => {
  return (
    <>
    <br/><br/>
      <div className={`buy-sell-cryptocurrency-area bg-image ${pt5}`} >
        <div className='container'>
          <div className=''>
            <h2 className='text-center'>Cas d'usages</h2>
            <p>Posséder le jeton E-WARI, qui est un stablecoin (une cryptomonnaie à valeur constante), donne accès à des types de transactions impossibles à réaliser avec du mobile money.
                E-WARI permettra d'accompagner la révolution numérique de l'inclusion financière . Cet actif numérique donnera la possibilité à de nombreuses personnes de s'envoyer de l'argent à moindre coût et d'accéder à de multiples services.
            </p>
      
          </div><br/>
          <div className='row justify-content-center'>
            <div className='col-xl-6 col-lg-12 col-md-12'>
              <div className='buy-sell-cryptocurrency-image'>
                {/* <img src='/images/women-with-tab.png' alt='image' /> */}
                <img src='/images/ecfa/ecosysteme/investissements/invest15.jpg' className=""  alt='logo' />

              </div>
            </div>
            <div className='col-xl-6 col-lg-12 col-md-12'>
                <h3>Paiements instantanés et transfert d'argent </h3>
              <p>
                L'utilisation du jeton E-WARI vous permettra d'effectuer des transactions à tout moment en un clin d'œil. Grâce à la blockchain, les transactions sont sécurisées sans aucun intermédiaire et vérifiable en temps réel.<br/>
                Vous pouvez l’utiliser pour :
              </p>
              <p>
                  - Payer vos factures ou des frais liés à des démarches administratives<br/>
                  - Envoyer et transférer de l'argent à vos proches
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Paiement;
