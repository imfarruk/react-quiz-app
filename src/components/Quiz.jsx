import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Box, Button, Container, FormControl, FormControlLabel, Grid, MenuItem, MobileStepper, Paper, Radio, RadioGroup, Stack, TextField, Typography } from "@mui/material"
import { homeCenter } from "../constant/style"
import { quiz } from "../constant/db";
import QuizViewCard from './quizViewCard';
import reactImg from '../assets/images/mind.jpg';
import { FaHourglassStart } from "react-icons/fa"
import { MdNotStarted } from "react-icons/md";
import { readQuizQuestion } from '../store/actions/createQuiz';
import { useDispatch } from 'react-redux';
import QuizCard from './QuizCard';
import { styled, useTheme } from "@mui/material/styles";
import { MdKeyboardArrowRight, MdKeyboardArrowLeft, MdOutlineDone } from "react-icons/md";
import { toast } from 'react-toastify';

export const CardInfo = ({ curVal, counts }) => {

    const navigate = useNavigate();
    const openQuizTest = (valId) => {
        navigate(`/quiz-test/${valId}`)
    }

    let newVal = counts.filter(vval => vval === curVal);

    return (
        <>

            <Paper sx={{ m: 1, p: 2 }}>
                <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexDirection: 'column' }}>

                    <Typography variant="h5" sx={{ textTransform: 'capitalize' }}>{curVal}</Typography>
                    <Typography><img src={reactImg} width="100%" height="100%" alt="react-img" /></Typography>
                    <Typography>Total question: {newVal.length}</Typography>
                    <Button variant="outlined" onClick={() => openQuizTest(curVal)} endIcon={<FaHourglassStart />}>Click to start</Button>
                </Box>
            </Paper>

        </>
    )
};
const initialQuizValue = {
    subject: "",
    level: ""
}

const MyFormControl = styled(FormControl)`
    borderRadius: 4,
    border: '1px solid rgba(0, 0, 0, 0.23)',
    padding: '8px 12px',
    width: '100%',
    '& .MuiFormControlLabel-root': {
      marginLeft: 0,
    },
    '& .MuiRadio-root': {
      padding: 0,
      '&:hover': {
        backgroundColor: 'transparent',
      },
`
const TextFieldStyled = styled('input')({
    textShadow: ' 0 0 #000000',

})
const Quiz = () => {
    const theme = useTheme();
    const [quizVal, setQuizVal] = useState([]);
    const [quizValue, setQuizValue] = useState(initialQuizValue);
    const [subjectQuestion,setSubjectQuestion] = useState([])
    const [wrongCount,setWrongCount] = useState(0);
    const [correctCount,setCorrectCount] = useState(0);

    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [selectedValue, setSelectedValue] = useState('');

    const [optionSelect, setOptionSelect] = useState("");

    const handleChange = (event) => {
        setSelectedValue(event.target.value);
        console.log(event.target.value);
    };

    useEffect(() => {
        setQuizVal(quiz.map(curVal => curVal.title))
    }, [])

    const [activeStep, setActiveStep] = React.useState(0);
    const maxSteps = subjectQuestion.length;

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const quizSubjets = [...new Set(quizVal)];

    const changeValue = (e) => {
        setQuizValue({ ...quizValue, [e.target.name]: e.target.value })
    }

    const showQuestion = async (e) => {
        const readRes = dispatch(readQuizQuestion(quizValue.subject, quizValue.level)).then((data) => {
            console.log(data, 'dataaaa');
            setSubjectQuestion(data);
            // setSubVal(data)
            setLoading(false)
        }).catch((error) => console.log('error'))
    }
    const optionSelected = (e) => {
        console.log(e.target.value, 'optionselected');
        setOptionSelect(e.target.value);
    }

    const submitAnswer = () => {
        if(optionSelect){
            if (optionSelect === subjectQuestion[activeStep].correctOption) {
                console.log(subjectQuestion.correctOption);
                setCorrectCount(correctCount+1);
                toast.success('congratulation')
                handleNext();
            } else {
                toast.error('wrong answer')
                setWrongCount(wrongCount+1);
                console.log(subjectQuestion[activeStep],'console.lo)');
                handleNext()
            }
        }else{
            toast.info('Please select answer')
        }
        
    }
    return (
        <Box sx={{ ...homeCenter, p: 2 }}>
            <Stack sx={{ p: 2, width: "100%" }}>
                <Box>
                    <Typography variant='h4' sx={{ textAlign: 'center', fontFamily: 'poetsen one' }}>Subject wise quizes</Typography>
                </Box>
                {/* <Box sx={{ mt: 3 }}> */}
                {/* <Grid container spacing={2}  sx={{ mt: 2 }}>
                        {
                            quizSubjets.map((curVal ,i) => {
                                return (
                                    <Grid item xs={12} sm={6} md={4} lg={3} key={i}>

                                        <CardInfo curVal={curVal} counts={quizVal} />
                                    </Grid>
                                )
                            })
                        }
                    </Grid> */}
                <Container maxWidth='lg' sx={{ background: '#fff', display: 'flex', gap: 3, p: 2, borderRadius: '20px', mt: 2 }}>
                    <Grid container spacing={2} sx={{ p: 2, gap: 2 }}>
                        <Grid item xs={12} sm={12} md={12} sx={{ m: 2 }}>
                            <Grid container alignItems="center" spacing={1}>
                                <Grid item xs={12} sm={6} md={9} mt={2}>
                                    {/* <TextField error={Boolean(errors.title)} helperText={errors.title && "Title required"} value={quizValue.title} name="title" onChange={changeValue} fullWidth size="small" label="Quiz title (subject)" variant="outlined" /> */}
                                    <TextField
                                        id="outlined-select-subject"
                                        select
                                        fullWidth
                                        label="Select subject"
                                        size="small"
                                        defaultValue="reactjs"
                                        name="subject"
                                        onChange={changeValue}
                                    // error={Boolean(errors.subject)} 
                                    // helperText={errors.subject && "Subject required"}
                                    >

                                        <MenuItem value="reactjs" >ReactJS</MenuItem>
                                        <MenuItem value="html" >Html</MenuItem>
                                        <MenuItem value="css" >Css</MenuItem>
                                        <MenuItem value="java" >Java</MenuItem>
                                        <MenuItem value="software-engineering" >Software Engineering</MenuItem>
                                        <MenuItem value="conputer-network" >Computer Network</MenuItem>
                                        <MenuItem value="mongodb" >MongoDB</MenuItem>
                                        <MenuItem value="operating-system" >Operating System</MenuItem>
                                        <MenuItem value="general-knowledge" >General Knowledge</MenuItem>

                                    </TextField>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3} mt={2}>

                                    {/* <TextField error={Boolean(errors.level)} helperText={errors.level && "Level required"} id="outlined-error-helper-text" fullWidth size="small" value={quizValue.level} name="level" onChange={changeValue} label="Quiz level" variant="outlined" /> */}
                                    <TextField
                                        id="outlined-select-level"
                                        select
                                        fullWidth
                                        label="Quiz level"
                                        size="small"
                                        defaultValue="easy"
                                        name="level"
                                        onChange={changeValue}
                                    // error={Boolean(errors.level)} 
                                    // helperText={errors.level && "level required"}
                                    >

                                        <MenuItem value="easy" >Easy</MenuItem>
                                        <MenuItem value="medium" >Medium</MenuItem>
                                        <MenuItem value="hard" >Hard</MenuItem>

                                    </TextField>
                                </Grid>
                                <Grid item xs={12} mt={2} sx={{ textAlign: 'start' }}><Button onClick={showQuestion} variant="contained" endIcon={<MdNotStarted />}>Start Test</Button></Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Container>

                <Box sx={{ mt: 5 }}>
                    {
                        !loading && subjectQuestion.length >0 &&  (
                            // <QuizCard/>
                            <Box sx={{ ...homeCenter }}>
                                <Container maxWidth='lg' sx={{ background: '#fff', display: 'flex', gap: 3, borderRadius: '20px' }}>

                                    <Grid container spacing={2} sx={{ p: 2, gap: 2 }}>
                                        <Grid item xs={12} sm={12} md={12} sx={{ m: 2 }}>

                                            <Grid container alignItems="center" spacing={1}>
                                            
                                                <Grid item xs={12} mt={2}>

                                                    <TextField fullWidth size="small" value={subjectQuestion[activeStep].question}
                                                        label="Question" name="optionA" variant="outlined" disabled
                                                        sx={{ textShadow: " 0 0 #000" }}
                                                        InputProps={{
                                                            // Pass the custom styled input base to InputProps
                                                            inputComponent: TextFieldStyled,
                                                        }}
                                                    />

                                                </Grid>

                                                <Grid item xs={12} sm={6} mt={2}>
                                                    <Button fullWidth variant="outlined" value={subjectQuestion[activeStep].optionA} onClick={optionSelected}>{subjectQuestion[activeStep].optionA}</Button>
                                                    {/* <TextField fullWidth size="small" value="second" name="optionA" label="Option A" variant="outlined" /> */}
                                                </Grid>
                                                <Grid item xs={12} sm={6} mt={2} >
                                                    <Button fullWidth variant="outlined" value={subjectQuestion[activeStep].optionB} onClick={optionSelected}> {subjectQuestion[activeStep].optionB}</Button>
                                                    {/* <TextField fullWidth size="small" value="third" name="optionB" label="Option B" variant="outlined" /> */}
                                                </Grid>
                                                <Grid item xs={12} sm={6} mt={2}>
                                                    <Button fullWidth variant="outlined" value={subjectQuestion[activeStep].optionC} onClick={optionSelected}> {subjectQuestion[activeStep].optionC}</Button>
                                                    {/* <TextField fullWidth size="small" value={quizValue.optionA} name="optionA" label="Option A" variant="outlined" /> */}
                                                </Grid>
                                                <Grid item xs={12} sm={6} mt={2} >
                                                    <Button fullWidth variant="outlined" value={subjectQuestion[activeStep].optiond} onClick={optionSelected}> {subjectQuestion[activeStep].optionD}</Button>
                                                    {/* <TextField fullWidth size="small" value={quizValue.optionB} name="optionB" label="Option B" variant="outlined" /> */}
                                                </Grid>

                                                        <Grid item xs={12} sm={12} mt={2} sx={{ display:'flex',justifyContent: 'space-between' }} >
                                                           <Box>
                                                            <Typography>Wrong : {wrongCount}</Typography>
                                                            <Typography>Correct : {correctCount}</Typography>
                                                           </Box>
                                                           <Button  variant="contained" endIcon={<MdOutlineDone />} onClick={submitAnswer}>submit</Button>
                                                        </Grid>
                                                {/* <Grid item xs={12} mt={2} sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: { xs: 'column', sm: 'row' }, gap: 1 }}>
                                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                                        <Button variant="contained" endIcon={<MdKeyboardArrowLeft />}>Back</Button>
                                                        <Button variant="contained" endIcon={<MdKeyboardArrowRight />}>next</Button>
                                                    </Box>
                                                    <Box sx={{ textAlign: 'center' }}>Question 1 /10</Box>
                                                    <Button variant="contained" endIcon={<MdOutlineDone />} onClick={submitAnswer}>submit</Button>
                                                </Grid> */}
                                                <Grid item xs={12} mt={2}>
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
                                                                    <MdKeyboardArrowLeft />
                                                                ) : (
                                                                    <MdKeyboardArrowRight />
                                                                )}
                                                            </Button>
                                                        }
                                                        backButton={
                                                            <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                                                                {theme.direction === 'rtl' ? (
                                                                    <MdKeyboardArrowRight />
                                                                ) : (
                                                                    <MdKeyboardArrowLeft />
                                                                )}
                                                                Back
                                                            </Button>
                                                        }
                                                    />
                                                </Grid>

                                            </Grid>
                                        
                                        </Grid>


                                    </Grid>

                                </Container>
                            </Box>
                        )
                    }
                    {
                        loading && subjectQuestion.length === 0 && (
                            <Typography sx={{ textAlign: 'center' }}>Select your preference</Typography>
                        )
                    }
                </Box>
                {/* </Box> */}
            </Stack>
        </Box>
    )
}

export default Quiz