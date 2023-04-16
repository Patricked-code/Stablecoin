import React from 'react';
import DemoProgressBar from '../../components/Demo/DemoProgression';

const KYCPage = () => {
  const steps = ['Étape 1', 'Étape 2', 'Étape 3', 'Étape 4', 'Étape 5', 'Étape 6'];
  const activeStep = 5;

  return (
    <div>
      <h1>Mon KYC</h1>
      <DemoProgressBar steps={steps} activeStep={activeStep} />
      {/* Le reste du contenu de la page */}
    </div>
  );
};

export default KYCPage;
