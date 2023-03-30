import React from 'react';

const ProgressBar = ({ steps, activeStep }) => {
  const progressBarStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: '20px',
    backgroundColor: '#ddd',
    borderRadius: '10px',
    padding: '5px',
    boxSizing: 'border-box'
  };

  const stepStyles = {
    width: `${100 / steps.length}%`,
    height: '10px',
    borderRadius: '5px',
    backgroundColor: '#bbb'
  };

  const activeStepStyles = {
    backgroundColor: 'green'
  };

  const inactiveStepStyles = {
    backgroundColor: 'gray'
  };

  return (
    <div style={progressBarStyles}>
      {steps.map((step, index) => (
        <div
          key={index}
          style={
            index <= activeStep
              ? { ...stepStyles, ...activeStepStyles }
              : { ...stepStyles, ...inactiveStepStyles }
          }
        >
          <p style={{ color: index <= activeStep ? 'black' : 'gray' }}>
            {step}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ProgressBar;
