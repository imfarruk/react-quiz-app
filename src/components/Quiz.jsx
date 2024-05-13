import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  Grid,
  MenuItem,
  MobileStepper,
  Modal,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { homeCenter } from "../constant/style";
import { quiz } from "../constant/db";
import QuizViewCard from "./quizViewCard";
import reactImg from "../assets/images/mind.jpg";
import { FaHourglassStart } from "react-icons/fa";
import { MdNotStarted } from "react-icons/md";
import { readQuizQuestion } from "../store/actions/createQuiz";
import { useDispatch } from "react-redux";
import QuizCard from "./QuizCard";
import { styled, useTheme } from "@mui/material/styles";
import {
  MdKeyboardArrowRight,
  MdKeyboardArrowLeft,
  MdEdit,
  MdOutlineDone,
} from "react-icons/md";
import { toast } from "react-toastify";
import { hover } from "@testing-library/user-event/dist/hover";
import { useTimer } from "react-timer-hook";

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
  const [quizVal, setQuizVal] = useState([]);
  const [quizValue, setQuizValue] = useState(initialQuizValue);
  const [quizSelcVal, setQuizSelcVal] = useState({ subject: "", level: "" });
  const [subjectQuestion, setSubjectQuestion] = useState([]);
  const [wrongCount, setWrongCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalAttempt, setTotalAttempt] = useState(0);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [selectedValue, setSelectedValue] = useState("");
  const [resultPer, setResultPer] = useState(0);
  const [optionSelect, setOptionSelect] = useState("");
  const [open, setOpen] = React.useState(false);
  const [openResultButton, setOpenResultButton] = useState(false);

  const navigate = useNavigate();
  const handleClose = () => setOpen(false);
  const expiryTimestamp = 20;
  const {
    totalSeconds,
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    resume,
    restart,
  } = useTimer({
    expiryTimestamp,
    onExpire: () => console.warn("onExpire called"),
  });

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
    console.log(event.target.value);
  };

  const [quizTimer, setQuizTimer] = useState(20);
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = subjectQuestion.length;

  const handleNext = () => {
    resetQuiz();
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const quizSubjets = [...new Set(quizVal)];

  const changeValue = (e) => {
    setQuizValue({ ...quizValue, [e.target.name]: e.target.value });
  };

  const showQuestion = async (e) => {
    const readRes = dispatch(
      readQuizQuestion(quizValue.subject, quizValue.level)
    )
      .then((data) => {
        console.log(data, "dataa");
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
        // console.log(data,'data',newValId,);

        setLoading(false);
        againSolve();
        resetQuiz();
      })
      .catch((error) => console.log("error"));
  };
  const optionSelected = (e) => {
    console.log(e.target.value, "optionselected");
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
    time.setSeconds(time.getSeconds() + 5);
    restart(time);
  };

  seconds === 0 && activeStep !== maxSteps-1 && (
    handleNext()
  )
  if(seconds === 0 && activeStep === maxSteps-1){
    setOpenResultButton(true)
    console.log('click');
    return true
    
  } 

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
  };

  const editQuiz = (value) => {
    navigate(`/edit-quiz/${value}`);
  };
  return (
    <Box sx={{ ...homeCenter, p: 2 }}>
      <Stack sx={{ p: 2, width: "100%" }}>
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
                    <MenuItem value="reactjs">ReactJS</MenuItem>
                    <MenuItem value="html">Html</MenuItem>
                    <MenuItem value="css">Css</MenuItem>
                    <MenuItem value="java">Java</MenuItem>
                    <MenuItem value="software-engineering">
                      Software Engineering
                    </MenuItem>
                    <MenuItem value="conputer-network">
                      Computer Network
                    </MenuItem>
                    <MenuItem value="mongodb">MongoDB</MenuItem>
                    <MenuItem value="operating-system">
                      Operating System
                    </MenuItem>
                    <MenuItem value="general-knowledge">
                      General Knowledge
                    </MenuItem>
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
            // <QuizCard/>
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
                      <Grid item xs={12} mt={2}>
                        <span>
                          Time Left {minutes} : {seconds} : {quizTimer}
                        </span>
                      </Grid>
                      <Grid item xs={12} mt={2}>
                        <TextField
                          fullWidth
                          size="small"
                          value={subjectQuestion[activeStep].question}
                          label="Question"
                          name="optionA"
                          variant="outlined"
                          disabled
                          sx={{ textShadow: " 0 0 #000" }}
                          InputProps={{
                            // Pass the custom styled input base to InputProps
                            inputComponent: TextFieldStyled,
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
                        {/* <TextField fullWidth size="small" value="second" name="optionA" label="Option A" variant="outlined" /> */}
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
                        {/* <TextField fullWidth size="small" value="third" name="optionB" label="Option B" variant="outlined" /> */}
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
                          {/* <TextField fullWidth size="small" value={quizValue.optionA} name="optionA" label="Option A" variant="outlined" /> */}
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
                          {/* <TextField fullWidth size="small" value={quizValue.optionB} name="optionB" label="Option B" variant="outlined" /> */}
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
                          {/* <Typography>Correct : {correctCount}</Typography> */}
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

                      {/* <Grid item xs={12} mt={2} sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: { xs: 'column', sm: 'row' }, gap: 1 }}>
                                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                                        <Button variant="contained" endIcon={<MdKeyboardArrowLeft />}>Back</Button>
                                                        <Button variant="contained" endIcon={<MdKeyboardArrowRight />}>next</Button>
                                                    </Box>
                                                    <Box sx={{ textAlign: 'center' }}>Question 1 /10</Box>
                                                    <Button variant="contained" endIcon={<MdOutlineDone />} onClick={submitAnswer}>submit</Button>
                                                </Grid> */}
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
        {/* </Box> */}
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
          <Button sx={{ float: "inline-end" }} onClick={againSolve}>
            reset
          </Button>
        </BoxModel>
      </Modal>
    </Box>
  );
};

export default Quiz;
