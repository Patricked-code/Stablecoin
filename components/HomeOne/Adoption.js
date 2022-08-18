const Adoption = () => {
    return (
      <>
        <div className='features-area pt-100 pb-70'>
          <div className='container'>
            <div className='section-title'>
              <h2>Adoption répandue</h2>
              <p>
                Notre objectif est de faire en sorte que le jeton E-WARI soit largement adopté par les particuliers,
                les commerces et les entreprises dans les principaux pays des zones Franc XOF et XAF.
                Parce que l'adoption en masse d'une monnaie numérique stable, fonctionnant sur 
                une blockchain permettra surement de réduire les risques et les coûts liés à la circulation d'argent liquide.
              </p>
            </div>
            <div className='row align-items-center justify-content-center'>
              <div className='col-lg-4 col-md-6 col-sm-6'>
                <div className='features-box'>
                  <div className='icon'>
                    <img src='/images/icon/icon18.png' alt='image' />
                  </div>
                  {/* <h3>Start Instantly</h3> */}
                </div>
              </div>
              <div className='col-lg-4 col-md-6 col-sm-6'>
                <div className='features-box'>
                  <div className='icon bg-ffefc7'>
                    <img src='/images/icon/icon19.png' alt='image' />
                  </div>
                </div>
              </div>
              <div className='col-lg-4 col-md-6 col-sm-6'>
                <div className='features-box'>
                  <div className='icon bg-ffc9c2'>
                    <img src='/images/icon/icon20.png' alt='image' />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };
  
  export default Adoption;
  