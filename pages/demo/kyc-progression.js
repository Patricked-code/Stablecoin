import React from 'react';
import ProgressBar from '../../components/Demo/ProgressBar';

const KYCPage = () => {
  const steps = ['Étape 1', 'Étape 2', 'Étape 3', 'Étape 4'];
  const activeStep = 1;

  return (
    <div>
      <h1>Mon KYC</h1>
      <ProgressBar steps={steps} activeStep={activeStep} />
      {/* Le reste du contenu de la page */}
    </div>
  );
};

export default KYCPage;
