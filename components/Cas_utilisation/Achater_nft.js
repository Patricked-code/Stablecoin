
const AcheterNft = ({title}) => {
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
                    E-WARI est le moyen idéal pour acheter des NFT. 
                    Choisissez E-WARI pour simplifier l'expérience d'achat. L'achat de NFT 
                    avec nos solutions on-ramp en E-WARI est le meilleur moyen d'embarquer des millions de clients. 
                    </p>
                  </div>
                </div>
              </div>
              <div className='col-xl-4 col-lg-3 col-md-12'>
                <div className='account-create-process-image text-center'>
                  <img src='/images/ecfa/ecosysteme/exchange/nft2.jpg' width={'300'} alt='image' />
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };
  
  export default AcheterNft;
  