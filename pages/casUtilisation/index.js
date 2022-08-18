import React, { useState, useEffect } from 'react';
import AcheterNft from '../../components/Cas_utilisation/Achater_nft';
import CasUsage from '../../components/Cas_utilisation/Cas_usage';
import Investir from '../../components/Cas_utilisation/investir';
import Paiement from '../../components/Cas_utilisation/Paiement';
import UtiliserMtn from '../../components/Cas_utilisation/UtiliserMtn';


const Index = () => {
  
  return (
    <>
    <UtiliserMtn
     bgGradient='bg-gradient-image'
     blackText='black-text'
    />
    <Paiement/><br/>

    <Investir title="Utiliser E-WARI pour investir dans l'économie et les entreprises locales"/>

    <CasUsage/><br/>
    <AcheterNft title="Utiliser E-WARI pour acheter des NFTs"/><br/>
    </>
  );
};

export default Index;
