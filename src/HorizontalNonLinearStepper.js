import React, { useState, useEffect, useReducer } from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import { useNavigate  } from 'react-router-dom'
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const steps = ['Connection',    'Project list',  'Files',                 'Images', 'Pins'];
const nav   = ['/connect_page', '/project_page', '/current_project_page', '/final_page', '/pin_page'];

export default function HorizontalNonLinearStepper(props) {
  const [activeStep, setActiveStep] = React.useState(0);
  const navigate = useNavigate();

  const handleStep = (step) => () => {
    if (activeStep == 0 && step != 1){
      return
    }
    if (activeStep == 1 && step != 0){
      return
    }
    navigate(nav[step], {state: props.state});
   // setActiveStep(step);
  };

  useEffect(() => {
    setActiveStep(props.step)
  }, [])


  return (
    <Box sx={{ width: '100%', margin: 'auto', height: 40,backgroundColor: "#5DE3B2"}}>
      <Box sx={{ width: '50%', margin: 'auto', paddingTop: '6px'}}>
        <Stepper nonLinear activeStep={activeStep}>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepButton color="inherit" onClick={handleStep(index)}>
                {label}
              </StepButton>
            </Step>
          ))}
        </Stepper>
      </Box>
    </Box>
  );
}