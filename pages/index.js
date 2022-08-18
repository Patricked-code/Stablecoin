import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Banner from '../components/HomeOne/Banner';
// import Analytics from 'analytics'
// import googleTagManager from '@analytics/google-tag-manager'



import Structuration from '../components/HomeOne/Structuration';
import Organe from '../components/HomeOne/Organe';
import Incubation from '../components/HomeOne/Incubation';
import MotPresident from '../components/HomeOne/Mot_president';
import NotreVisions from '../components/HomeOne/Notre_vision';
import Avantage from '../components/HomeOne/Avantages';
import Adoption from '../components/HomeOne/Adoption';


const Index = () => {
  // const analytics = Analytics({
  //   app: 'awesome-app',
  //   plugins: [
  //     googleTagManager({
  //       containerId: 'G-ZBPE30Z5T4'
  //     })
  //   ]
  // })
  
  /* Track a page view */
  // analytics.page()
  
  return (
    <>
      <Banner />
      <Avantage/>
      <MotPresident pt70='pt-70' />
      <Adoption/>
      {/* <NotreVisions bgColor='bg-f9f9f9' /> */}
      {/* <Structuration title='Structuration' /> */}
      {/* <Organe title='Organe' /> */}
      {/* <Incubation title='Incubation' /> */}
    </>
  );
};

export default Index;
