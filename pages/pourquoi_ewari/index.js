import React, { useState, useEffect } from 'react';
import Finance from '../../components/Pourquoi_ewari/Finance';
import HeroWhy from '../../components/Pourquoi_ewari/HeroWhy';


const Index = () => {
  
  return (
    <>
    <HeroWhy
        bgGradient='bg-gradient-image'
        blackText='black-text'
    />
    <Finance/>
    {/* <UtiliserMtn
     bgGradient='bg-gradient-image'
     blackText='black-text'
    />

    <CasUsage/>
    <AcheterNft title="Utiliser E-WARI pour acheter des NFTs"/>
    <Paiement/>
    <Investir title="Utilser E-WARI pour investir dans l'économie et les entreprises locales"/> */}
    {/* </> */}
    </>
  );
};

export default Index;
