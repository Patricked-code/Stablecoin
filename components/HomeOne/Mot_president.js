import React from 'react';

const MotPresident = ({pt70}) => {
  return (
    <>
      <div className={`buy-sell-cryptocurrency-area bg-image ${pt70}`}>
        <div className='container'>
          <div className='section-title'>
      
          </div>
          <div className='row justify-content-center'>
            <div className='col-xl-6 col-lg-12 col-md-12'>
              <div className='buy-sell-cryptocurrency-image'>
                {/* <img src='/images/women-with-tab.png' alt='image' /> */}
                <img src='/images/ecfa/logo/logo_ewari1.jpg' className="rounded-circle" width={'250'} alt='logo' />

              </div>
            </div>
            <div className='col-xl-6 col-lg-12 col-md-12'>
            <h2>L'avenir : La digitalisation de l'économie</h2>

              <p>
                Une solution digitalisation de l'économie,Les jetons numériques E-WARI sont une solution de digitalisation de l'économie et permettent de soutenir et de renforcer l'innovation en pleine croissance dans l'espace de la blockchain en Afrique.
                Construits sur plusieurs blockchains, les jetons numériques E-WARI constituent un des piliers du développement d'une nouvelle économie numérique et de l'inclusion financière, pour les personnes non bancarisées.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MotPresident;
