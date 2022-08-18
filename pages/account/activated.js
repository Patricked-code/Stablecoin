import React from 'react';
import Link from 'next/link';


const Activated = () => {

  return (
    <>
        <div className='row col-lg-12 col-md-12'>
            <div className='col-lg-3 col-md-12 '></div>
            <div className='col-lg-6 col-md-12 text-center card  mx-5 my-5'>
                <div className='login-form'>
                <h2 className='text-center '><b>Confirmez votre e-mail</b></h2>
                <hr/>
                <h5>Pour finaliser l'ouverture de votre compte, 
                    merci de confirmer votre e-mail à travers le mail envoyé à l'instant
                </h5>
                </div>
            </div>
            <div className='col-lg-3 col-md-12'></div>
        </div>
    </>
  );
};


export default Activated;
