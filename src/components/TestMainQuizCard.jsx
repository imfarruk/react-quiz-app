import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { Box, Container, Grid, Paper, Stack, Typography, Button, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { FaAngleDown } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { quiz } from '../constant/db';
import { IoMdCloudDone } from "react-icons/io";
import { homeCenter } from '../constant/style';
import { useTheme } from '@mui/material/styles';

import MobileStepper from '@mui/material/MobileStepper';
import { MdOutlineKeyboardArrowRight, MdOutlineKeyboardArrowLeft } from "react-icons/md";

const TestMainQuizCard = ({ val }) => {

    const [activeStep, setActiveStep] = React.useState(0);
    const maxSteps = val.length;
    const theme = useTheme();
    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    console.log(val, 'val');

    const handleEdit = () => {



    }

    return (
        //     <Box sx={{ width:'100%', flexGrow: 1 }}>
        //     <Paper
        //       square
        //       elevation={0}
        //       sx={{
        //         display: 'flex',
        //         alignItems: 'center',
        //         height: 50,
        //         pl: 2,
        //         bgcolor: 'background.default',
        //       }}
        //     >
        //       <Typography>{val[activeStep].question}</Typography>
        //     </Paper>
        //     <Box sx={{ height: 255, width: '100%', py: 2 }}>
        //     <Typography variant='h5' sx={{fontFamily:'poetsen One'}}>{val[activeStep].question}</Typography>
        //     <FormControl>
        //     <RadioGroup
        //       aria-labelledby="demo-radio-buttons-group-label"
        //       defaultValue="female"
        //       name="radio-buttons-group"
        //     >
        //       <FormControlLabel value={val[activeStep].optionA} control={<Radio />} label={val[activeStep].optionA} />
        //       <FormControlLabel value={val[activeStep].optionB} control={<Radio />} label={val[activeStep].optionB} />
        //       <FormControlLabel value={val[activeStep].optionC} control={<Radio />} label={val[activeStep].optionC} />
        //       <FormControlLabel value={val[activeStep].optionD} control={<Radio />} label={val[activeStep].optionD} />
        //     </RadioGroup>
        //   </FormControl>
        //     </Box>
        //     <MobileStepper
        //       variant="text"
        //       steps={maxSteps}
        //       position="static"
        //       activeStep={activeStep}
        //       nextButton={
        //         <Button
        //           size="small"
        //           onClick={handleNext}
        //           disabled={activeStep === maxSteps - 1}
        //         >
        //           Next
        //           {theme.direction === 'rtl' ? (
        //             <MdOutlineKeyboardArrowLeft />
        //           ) : (
        //             <MdOutlineKeyboardArrowRight />
        //           )}
        //         </Button>
        //       }
        //       backButton={
        //         <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
        //           {theme.direction === 'rtl' ? (
        //             <MdOutlineKeyboardArrowRight />
        //           ) : (
        //             <MdOutlineKeyboardArrowLeft />
        //           )}
        //           Back
        //         </Button>
        //       }
        //     />
        //   </Box>
        <Box sx={{ maxWidth: 400, flexGrow: 1 }}>
            <Paper
                square
                elevation={0}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    height: 50,
                    pl: 2,
                    bgcolor: 'background.default',
                }}
            >
                <Typography>{val[activeStep].question}</Typography>
            </Paper>
            <Box sx={{ height: 255, maxWidth: 400, width: '100%', p: 2 }}>
                {val[activeStep].description}
            </Box>
            <MobileStepper
                variant="text"
                steps={maxSteps}
                position="static"
                activeStep={activeStep}
                nextButton={
                    <Button
                        size="small"
                        onClick={handleNext}
                        disabled={activeStep === maxSteps - 1}
                    >
                        Next
                        {theme.direction === 'rtl' ? (
                            <MdOutlineKeyboardArrowLeft />
                        ) : (
                            <MdOutlineKeyboardArrowRight />
                        )}
                    </Button>
                }
                backButton={
                    <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                        {theme.direction === 'rtl' ? (
                            <MdOutlineKeyboardArrowRight />
                        ) : (
                            <MdOutlineKeyboardArrowLeft />
                        )}
                        Back
                    </Button>
                }
            />
        </Box>
    )
}

export default TestMainQuizCard