import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogTitle,
  FormControl,
  Grid,
  List,
  MenuItem,
  MobileStepper,
  Modal,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { homeCenter } from "../constant/style";
import reactImg from "../assets/images/mind.jpg";
import { FaHourglassStart } from "react-icons/fa";
import { MdNotStarted } from "react-icons/md";
import { quizSubjects, readQuizQuestion, saveResultTodb } from "../store/actions/createQuiz";
import { useDispatch, useSelector } from "react-redux";
import { styled, useTheme } from "@mui/material/styles";
import {
  MdKeyboardArrowRight,
  MdKeyboardArrowLeft,
  MdEdit,
  MdOutlineDone,
} from "react-icons/md";
import { toast } from "react-toastify";
import { useTimer } from "react-timer-hook";
import { GrPowerReset } from "react-icons/gr";
import { CiSaveDown1 } from "react-icons/ci";
import {app} from "../firebase/firebase";
import { getAuth } from "firebase/auth";

const auth = getAuth(app);

export const CardInfo = ({ curVal, counts }) => {
  const navigate = useNavigate();
  const openQuizTest = (valId) => {
    navigate(`/quiz-test/${valId}`);
  };

  let newVal = counts.filter((vval) => vval === curVal);

  return (
    <>
      <Paper sx={{ m: 1, p: 2 }}>
        <Box
          sx={{
            display: "flex",
            gap: 3,
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <Typography variant="h5" sx={{ textTransform: "capitalize" }}>
            {curVal}
          </Typography>
          <Typography>
            <img src={reactImg} width="100%" height="100%" alt="react-img" />
          </Typography>
          <Typography>Total question: {newVal.length}</Typography>
          <Button
            variant="outlined"
            onClick={() => openQuizTest(curVal)}
            endIcon={<FaHourglassStart />}
          >
            Click to start
          </Button>
        </Box>
      </Paper>
    </>
  );
};
const initialQuizValue = {
  subject: "reactjs",
  level: "easy",
};

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
`;
const TextFieldStyled = styled("input")({
  textShadow: " 0 0 #000000",
});

const BoxModel = styled(Box)({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  background: "#fff",
  borderRadius: "12px",
  boxShadow: 24,
  padding: "20px",
});

const Quiz = ({ isEditable }) => {
  const theme = useTheme();
  const {isAuthenticated} = useSelector(state=>state.auth)
  const [quizVal, setQuizVal] = useState([]);
  const [quizValue, setQuizValue] = useState(initialQuizValue);
  const [quizSelcVal, setQuizSelcVal] = useState({ subject: "", level: "" });
  const [subjectQuestion, setSubjectQuestion] = useState([]);
  const [wrongCount, setWrongCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalAttempt, setTotalAttempt] = useState(0);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [subLoading,setSubLoading] = useState(true)
  const [selectedValue, setSelectedValue] = useState("");
  const [resultPer, setResultPer] = useState(0);
  const [optionSelect, setOptionSelect] = useState("");
  const [open, setOpen] = React.useState(false);
  const [openResultButton, setOpenResultButton] = useState(false);
  const [allSubjects,setAllSubjects] = useState()
  const [dialogOpen,setDialogOpen] = useState(false)

  const navigate = useNavigate();
  const handleClose = () => setOpen(false);
  const easy = 40;
  const medium = 35;
  const hard = 30;
  const {
    seconds,
    minutes,
    start,
    pause,
    resume,
    restart,
  } = useTimer();

  useEffect(()=>{
    const res = quizSubjects().then((res)=>{
      setAllSubjects(res)
      setSubLoading(false)
    })
   
  },[])

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = subjectQuestion.length;

  const handleNext = () => {
    resetQuiz();
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const changeValue = (e) => {
    setQuizValue({ ...quizValue, [e.target.name]: e.target.value });
  };

  const showQuestion = async (e) => {
   dispatch(
      readQuizQuestion(quizValue.subject, quizValue.level)
    )
      .then((data) => {
        setQuizSelcVal({ subject: quizValue.subject, level: quizValue.level });
        let newValId = data.map((datas) => {
          const id = datas.id;
          let val = datas.data();
          const newObject = {
            id: id,
            ...val,
          };

          return newObject;
        });
        setSubjectQuestion(newValId);
        setLoading(false);
        againSolve();
        resetQuiz();
      })
      .catch((error) => toast.error(error.message));
  };
  const optionSelected = (e) => {
    setOptionSelect(e.target.value);
  };

  const submitAnswer = () => {
    if (optionSelect) {
      if (optionSelect === subjectQuestion[activeStep].correctOption) {
        setCorrectCount(correctCount + 1);
        setTotalAttempt(totalAttempt + 1);
        activeStep < maxSteps - 1 && handleNext();
        activeStep === maxSteps - 1 && setOpenResultButton(true);
      } else {
        activeStep < maxSteps - 1 && handleNext();
        activeStep === maxSteps - 1 && setOpenResultButton(true);
        setTotalAttempt(totalAttempt + 1);
        setWrongCount(wrongCount + 1);
      }
      resetQuiz();
    } else {
      toast.info("please select answer before submit");
    }
  };

  const resetQuiz = () => {
    const time = new Date();
    quizValue.level === 'easy' && ( time.setSeconds(time.getSeconds() + 2))
    
    quizValue.level === 'medium' && ( time.setSeconds(time.getSeconds() + medium))
  
    quizValue.level === 'hard' && ( time.setSeconds(time.getSeconds() + hard))

    restart(time);
  };


  seconds === 0 && activeStep !== maxSteps-1 && !isEditable && (
    handleNext()
  )
  useEffect(()=>{
    if(seconds === 0 && activeStep === maxSteps-1 && !isEditable){
      setOpenResultButton(true)
      console.log('click');
    }
  },[seconds])

  const handleOpen = () => {
    setOpen(true);
    let results = (correctCount / maxSteps) * 100;
    setResultPer(results);
  };

  const againSolve = () => {
    setCorrectCount(0);
    setWrongCount(0);
    setResultPer(0);
    setTotalAttempt(0);
    setActiveStep(0);
    setOptionSelect("");
    setOpenResultButton(false);
    setOpen(false);
    resetQuiz()
  };

  const editQuiz = (value) => {
    navigate(`/edit-quiz/${value}`);
  };

  const resultSaveToDB =()=>{
    if(!isAuthenticated){
      setDialogOpen(!dialogOpen)
      toast.error('First login to save your result')
    }else{
      const data = {
        totalQuestion: maxSteps,
        totalAttempt: totalAttempt,
        correctAnswer: correctCount,
        wrongAnswer: wrongCount,
        markPercentage: resultPer,
        subject:quizValue.subject,
        level: quizValue.level,
        date:Date.now(),
      }
      console.log(data,'data');
      localStorage.setItem('unsavedQuizResult',JSON.stringify(data))
      saveResultTodb().then((res)=>{
        toast.success(res);
      }).catch(error=>toast.error(error.message))
    }
  }

  const handleDialogClose = ()=>{
    setDialogOpen(!dialogOpen);
    
    localStorage.removeItem('unsavedQuizResult')
  }

  const loginForSaveResult = ()=>{
    const data = {
      totalQuestion: maxSteps,
      totalAttempt: totalAttempt,
      correctAnswer: correctCount,
      wrongAnswer: wrongCount,
      markPercentage: resultPer,
      subject:quizValue.subject,
      level: quizValue.level,
      date:Date.now(),
    }
    console.log(data,'data');
    localStorage.setItem('unsavedQuizResult',JSON.stringify(data))
    navigate('/login')
  }
  return (
    <Box sx={{ ...homeCenter,p:2 }}>
      <Stack sx={{  width: "100%" }}>
        <Box>
          <Typography
            variant="h4"
            sx={{ textAlign: "center", fontFamily: "poetsen one" }}
          >
            {!isEditable ? "Subject wise quizes" : "All Quizes"}
          </Typography>
        </Box>

        <Container
          maxWidth="lg"
          sx={{
            background: "#fff",
            display: "flex",
            gap: 3,
            p: 2,
            borderRadius: "20px",
            mt: 2,
          }}
        >
          <Grid container spacing={2} sx={{ p: 2, gap: 2 }}>
            <Grid item xs={12} sm={12} md={12} sx={{ m: 2 }}>
              <Grid container alignItems="center" spacing={1}>
                <Grid item xs={12} sm={6} md={9} mt={2}>
                
                  <TextField
                    id="outlined-select-subject"
                    select
                    fullWidth
                    label="Select subject"
                    size="small"
                    defaultValue="reactjs"
                    name="subject"
                    onChange={changeValue}
                  >
                    { !subLoading &&
                      allSubjects.map((sub,i)=>{
                        return (
                          <MenuItem key={i} value={sub.subject}>{sub.title}</MenuItem>
                        )
                      })
                    }
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6} md={3} mt={2}>
                 
                  <TextField
                    id="outlined-select-level"
                    select
                    fullWidth
                    label="Quiz level"
                    size="small"
                    defaultValue="easy"
                    name="level"
                    onChange={changeValue}
                  >
                    <MenuItem value="easy">Easy</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="hard">Hard</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} mt={2} sx={{ textAlign: "start" }}>
                  <Button
                    onClick={showQuestion}
                    variant="contained"
                    endIcon={<MdNotStarted />}
                  >
                    Start Test
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>

        <Box sx={{ mt: 5 }}>
          {!loading && subjectQuestion.length > 0 && (
          
            <Box sx={{ ...homeCenter }}>
              <Container
                maxWidth="lg"
                sx={{
                  background: "#fff",
                  display: "flex",
                  gap: 3,
                  borderRadius: "20px",
                }}
              >
                <Grid container spacing={2} sx={{ p: 2, gap: 2 }}>
                  <Grid item xs={12} sm={12} md={12} sx={{ m: 2 }}>
                    <Grid container alignItems="center" spacing={1}>
                      {!isEditable && <Grid item xs={12} mt={2}>
                        <Typography sx={{color:seconds <=5 ? 'red' : 'inherit',
                        }}>
                          Time Left : {minutes} : {seconds}
                        </Typography>
                      </Grid>}
                      <Grid item xs={12} mt={2}>
                        <TextField
                          fullWidth
                          multiline
                          value={subjectQuestion[activeStep].question}
                          label="Question"
                          name="question"
                          variant="outlined"
                          InputProps={{
                            readOnly: true, // Optionally make the TextField read-only
                           
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6} mt={2}>
                        <Button
                          fullWidth
                          variant="outlined"
                          value={subjectQuestion[activeStep].optionA}
                          onClick={optionSelected}
                          sx={{
                            background:
                              optionSelect ===
                              subjectQuestion[activeStep].optionA
                                ? "#1565C0"
                                : "",
                            color:
                              optionSelect ===
                              subjectQuestion[activeStep].optionA
                                ? "#fff"
                                : "",
                            "&:hover": {
                              color: "#1565C0",
                            },
                          }}
                        >
                          {subjectQuestion[activeStep].optionA}
                        </Button>
                      
                      </Grid>

                      <Grid item xs={12} sm={6} mt={2}>
                        <Button
                          fullWidth
                          variant="outlined"
                          value={subjectQuestion[activeStep].optionB}
                          onClick={optionSelected}
                          sx={{
                            background:
                              optionSelect ===
                              subjectQuestion[activeStep].optionB
                                ? "#1565C0"
                                : "",
                            color:
                              optionSelect ===
                              subjectQuestion[activeStep].optionB
                                ? "#fff"
                                : "",
                            "&:hover": {
                              color: "#1565C0",
                            },
                          }}
                        >
                          {" "}
                          {subjectQuestion[activeStep].optionB}
                        </Button>
                       
                      </Grid>
                      {subjectQuestion[activeStep].optionC && (
                        <Grid item xs={12} sm={6} mt={2}>
                          <Button
                            fullWidth
                            variant="outlined"
                            value={subjectQuestion[activeStep].optionC}
                            onClick={optionSelected}
                            sx={{
                              background:
                                optionSelect ===
                                subjectQuestion[activeStep].optionC
                                  ? "#1565C0"
                                  : "",
                              color:
                                optionSelect ===
                                subjectQuestion[activeStep].optionC
                                  ? "#fff"
                                  : "",
                              "&:hover": {
                                color: "#1565C0",
                              },
                            }}
                          >
                            {" "}
                            {subjectQuestion[activeStep].optionC}
                          </Button>
                         
                        </Grid>
                      )}
                      {subjectQuestion[activeStep].optionD && (
                        <Grid item xs={12} sm={6} mt={2}>
                          <Button
                            fullWidth
                            variant="outlined"
                            value={subjectQuestion[activeStep].optionD}
                            onClick={optionSelected}
                            sx={{
                              background:
                                optionSelect ===
                                subjectQuestion[activeStep].optionD
                                  ? "#1565C0"
                                  : "",
                              color:
                                optionSelect ===
                                subjectQuestion[activeStep].optionD
                                  ? "#fff"
                                  : "",
                              "&:hover": {
                                color: "#1565C0",
                              },
                            }}
                          >
                            {" "}
                            {subjectQuestion[activeStep].optionD}
                          </Button>
                          
                        </Grid>
                      )}
                      {isEditable && (
                        <Grid
                          item
                          xs={12}
                          mt={2}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Button
                            fullWidth
                            variant="outlined"
                            value={subjectQuestion[activeStep].correctOption}
                            onClick={optionSelected}
                          >
                            {" "}
                            {subjectQuestion[activeStep].correctOption}
                          </Button>
                        </Grid>
                      )}

                      <Grid
                        item
                        xs={12}
                        sm={12}
                        mt={2}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Box>
                         
                          {openResultButton && (
                            <Button
                              variant="contained"
                              endIcon={<MdOutlineDone />}
                              onClick={handleOpen}
                            >
                              result
                            </Button>
                          )}
                        </Box>
                        {isEditable ? (
                          <Button
                            variant="contained"
                            endIcon={<MdEdit />}
                            onClick={() =>
                              editQuiz(subjectQuestion[activeStep].id)
                            }
                          >
                            Edit
                          </Button>
                        ) : (
                          !openResultButton && (
                            <Button
                              variant="contained"
                              endIcon={<MdOutlineDone />}
                              onClick={submitAnswer}
                            >
                              submit
                            </Button>
                          )
                        )}
                      </Grid>

                     
                      <Grid item xs={12}>
                        {isEditable ? (
                          <MobileStepper
                            variant="text"
                            steps={maxSteps}
                            position="static"
                            activeStep={activeStep}
                            nextButton={
                              <Button
                                variant="contained"
                                endIcon={<MdKeyboardArrowRight />}
                                onClick={handleNext}
                                disabled={activeStep === maxSteps - 1}
                              >
                                next
                              </Button>
                            }
                            backButton={
                              <Button
                                size="small"
                                variant="contained"
                                onClick={handleBack}
                                disabled={activeStep === 0}
                              >
                                {theme.direction === "rtl" ? (
                                  <MdKeyboardArrowLeft />
                                ) : (
                                  <MdKeyboardArrowLeft />
                                )}
                                Back
                              </Button>
                            }
                          />
                        ) : (
                          <MobileStepper
                            variant="text"
                            steps={maxSteps}
                            position="static"
                            activeStep={activeStep}
                            nextButton={
                              <Button
                                variant="contained"
                                endIcon={<MdKeyboardArrowRight />}
                                onClick={handleNext}
                                disabled={activeStep === maxSteps - 1}
                              >
                                skip
                              </Button>
                            }
                          />
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Container>
            </Box>
          )}
          {loading && subjectQuestion.length === 0 && (
            <Typography sx={{ textAlign: "center" }}>
              Select your preference
            </Typography>
          )}
          {!loading && subjectQuestion.length === 0 && (
            <>
              <Box sx={{ ...homeCenter }}>
                <Container
                  maxWidth="lg"
                  sx={{
                    py: 5,
                    background: "#fff",
                    display: "flex",
                    borderRadius: "20px",
                    justifyContent: "center",
                  }}
                >
                  <Typography>
                    Question is not available currently.. Soon{" "}
                    <span style={{ fontWeight: 600 }}>
                      {quizSelcVal.subject} {quizSelcVal.level}
                    </span>{" "}
                    level question will be added.
                  </Typography>
                </Container>
              </Box>
            </>
          )}
        </Box>
      </Stack>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <BoxModel sx={{ minWidth: { xs: "80%", sm: "400px" } }}>
          <Typography id="modal-modal-title" variant="h5" component="h2">
            Result
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Total Question : {maxSteps}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Total Attempt : {totalAttempt}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Correct Answer : {correctCount}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Wrong Answer : {wrongCount}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Marks percentage : {resultPer} %
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {resultPer < 40 && "Fail,Work hard"}
            {resultPer > 80 && "Great, much knowledge "}
            {resultPer < 80 &&
              resultPer >= 40 &&
              "Good, do more exercises for more knowledge."}
          </Typography>
          <Stack  direction="row" spacing={2} sx={{ float: "inline-end" }}>
          <Button onClick={againSolve} endIcon={<GrPowerReset/>}>
            reset
          </Button>
          <Button onClick={resultSaveToDB} endIcon={<CiSaveDown1/>}>
            SAVE RESULT
          </Button>
          </Stack>
        </BoxModel>
      </Modal>
      <Dialog onClose={handleDialogClose} open={dialogOpen}>
        <DialogTitle>Do you want to login ?</DialogTitle>
        <List sx={{ pt: 0 }}>
           <Button onClick={loginForSaveResult}>yes</Button>
           <Button onClick={()=>setDialogOpen(false)}>no</Button>
          </List>
        </Dialog>
    </Box>
  );
};

export default Quiz;
