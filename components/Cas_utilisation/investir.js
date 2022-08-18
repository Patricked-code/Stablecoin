
const Investir = ({title}) => {
    return (
      <>
        <div className='account-create-process-area ptb-30'>
          <div className='container'>
            <div className='row align-items-center'>
              <div className='col-xl-8 col-lg-9 col-md-12'>
                <div className='account-create-process-content'>
                  
                  <div className='row justify-content-center'>
                  <h3>{title}</h3>
                    <p>
                    Avec le jeton numérique vous pouvez financer dans entreprises en participant 
                    à des campagnes de financement participatif (crowfunding). Vous pouvez également 
                    investir dans les actions des entreprises de la zone UEMOA ou éventuellement investir 
                    dans des OPCVM dont le registre est tenue de manière transparente sur une blockchain 
                    </p>
                  </div>
                </div>
              </div>
              <div className='col-xl-4 col-lg-3 col-md-12'>
                <div className='account-create-process-image text-center'>
                  <img src='/images/ecfa/ecosysteme/crowdfunding/Crowd2.jpg' alt='image' />
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };
  
  export default Investir;
  