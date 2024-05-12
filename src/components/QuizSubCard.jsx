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
import TestMainQuizCard from './TestMainQuizCard';

import { readQuizQuestion } from '../store/actions/createQuiz';
import { useDispatch } from 'react-redux';

const TestCard = ({ val }) => {
    const [index, setIndex] = useState(0);
    const [questions, setQuestions] = useState(val);

    const [activeStep, setActiveStep] = React.useState(0);
    const maxSteps = val.length;
    const theme = useTheme();


    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    console.log(val, 'val', questions);

    const handleEdit = () => {

    }

    return (
        <>
            <Box sx={{ width: '100%', flexGrow: 1 }}>
                <Paper
                    square
                    elevation={0}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        height: 50,
                        pl: 2,
                        //   bgcolor: 'background.default',
                    }}
                >
                    <Typography>{index + 1} : {val[activeStep].question}</Typography>
                </Paper>
                <Box sx={{ height: 255, width: '100%', background: '#fff' }}>
                    {/* <Typography variant='h5' sx={{fontFamily:'poetsen One'}}>{val[activeStep].question}</Typography> */}
                    <FormControl sx={{ p: 2 }}>
                        <RadioGroup
                            aria-labelledby="demo-radio-buttons-group-label"
                            defaultValue="female"
                            name="radio-buttons-group"
                        >
                           <FormControlLabel value={val[activeStep].optionA} control={<Radio />} label={val[activeStep].optionA} /> 
                            <FormControlLabel value={val[activeStep].optionB} control={<Radio />} label={val[activeStep].optionB} />
                            <FormControlLabel value={val[activeStep].optionC} control={<Radio />} label={val[activeStep].optionC} />
                            <FormControlLabel value={val[activeStep].optionD} control={<Radio />} label={val[activeStep].optionD} /> 
                        </RadioGroup>
                    </FormControl>
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


        </>
    )
}

const QuizSubCard = () => {
    const [subVal, setSubVal] = useState([]);
    const [loading, setLoading] = useState(true);
    const { sub } = useParams();
    const dispatch = useDispatch();
    let values

    useEffect(() => {
        const readRes = dispatch(readQuizQuestion(sub)).then((data) => {
            console.log(data, 'dataaaa');
            setSubVal(data)
            setLoading(false)
        }).catch((error) => console.log('error'))
        console.log(readRes, 'readResMain');
    }, [])
    console.log(sub, 'sub', values, subVal);
    return (
        <Box sx={{}}>
            <Stack sx={{ m: { sm: 10, xs: 5 } }}>
                <Box>
                    <Typography variant='h4' sx={{ textAlign: 'center', textTransform: 'capitalize' }}>{sub}</Typography>
                </Box>
                <Grid container spacing={2} sx={{ mt: 2, display: 'flex', justifyContent: 'center' }} >

                    {/* {
                    val.length > 0 && val.map((currVal, i) => {
                        return ( */}
                    {
                        !loading && (
                            <Grid item xs={12} sm={8} md={6} >
                                <TestCard val={subVal} />

                            </Grid>
                        )
                    }

                    {/* )
                    }
                    )
                } */}

                </Grid>
            </Stack>
        </Box>
    )
}

export default QuizSubCard