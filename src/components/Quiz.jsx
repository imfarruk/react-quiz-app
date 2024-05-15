import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  LinearProgress,
  MenuItem,
  MobileStepper,
  Modal,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { MdNotStarted } from "react-icons/md";
import {
  quizSubjects,
  readQuizQuestion,
  saveResultTodb,
} from "../store/actions/createQuiz";
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



const initialQuizValue = {
  subject: "reactjs",
  level: "easy",
};



const BoxModel = styled(Paper)({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  background: "#fff",
  padding: "20px",
});

const Quiz = ({ isEditable }) => {
  const theme = useTheme();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [quizValue, setQuizValue] = useState(initialQuizValue);
  const [quizSelcVal, setQuizSelcVal] = useState({ subject: "", level: "" });
  const [subjectQuestion, setSubjectQuestion] = useState([]);
  const [wrongCount, setWrongCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalAttempt, setTotalAttempt] = useState(0);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [subLoading, setSubLoading] = useState(true);
  const [selectedValue, setSelectedValue] = useState("");
  const [resultPer, setResultPer] = useState(0);
  const [optionSelect, setOptionSelect] = useState("");
  const [open, setOpen] = React.useState(false);
  const [openResultButton, setOpenResultButton] = useState(false);
  const [allSubjects, setAllSubjects] = useState();
  const [dialogOpen, setDialogOpen] = useState(false);

  const expiryTimestamp = 60;
  const navigate = useNavigate();
  const handleClose = () => setOpen(false);
  const easy = 40;
  const medium = 35;
  const hard = 30;
  const { seconds, minutes, start, pause, resume, restart } = useTimer({
    expiryTimestamp,
    onExpire: () => {},
  });

  useEffect(() => {
    const res = quizSubjects().then((res) => {
      setAllSubjects(res);
      setSubLoading(false);
    });
  }, []);

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
    dispatch(readQuizQuestion(quizValue.subject, quizValue.level))
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
    quizValue.level === "easy" && time.setSeconds(time.getSeconds() + easy);

    quizValue.level === "medium" && time.setSeconds(time.getSeconds() + medium);

    quizValue.level === "hard" && time.setSeconds(time.getSeconds() + hard);

    restart(time);
  };

  seconds === 0 && activeStep !== maxSteps - 1 && !isEditable && handleNext();
  useEffect(() => {
    if (seconds === 0 && activeStep === maxSteps - 1 && !isEditable) {
      setOpenResultButton(true);
    }
  }, [seconds]);

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
    resetQuiz();
  };

  const editQuiz = (value) => {
    navigate(`/edit-quiz/${value}`);
  };

  const resultSaveToDB = () => {
    if (!isAuthenticated) {
      setDialogOpen(!dialogOpen);
      toast.error("First login to save your result");
    } else {
      const data = {
        totalQuestion: maxSteps,
        totalAttempt: totalAttempt,
        correctAnswer: correctCount,
        wrongAnswer: wrongCount,
        markPercentage: resultPer,
        subject: quizValue.subject,
        level: quizValue.level,
        date: Date.now(),
      };
      localStorage.setItem("unsavedQuizResult", JSON.stringify(data));
      saveResultTodb()
        .then((res) => {
          toast.success(res);
          handleClose();
          againSolve();
        })
        .catch((error) => toast.error(error.message));
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(!dialogOpen);

    localStorage.removeItem("unsavedQuizResult");
  };

  const loginForSaveResult = () => {
    const data = {
      totalQuestion: maxSteps,
      totalAttempt: totalAttempt,
      correctAnswer: correctCount,
      wrongAnswer: wrongCount,
      markPercentage: resultPer,
      subject: quizValue.subject,
      level: quizValue.level,
      date: Date.now(),
    };
    localStorage.setItem("unsavedQuizResult", JSON.stringify(data));
    navigate("/login");
  };
  return (
    <Box sx={{ p: 2 }}>
      <Stack sx={{ width: "100%" }}>
        <Box>
          <Typography
            variant="h4"
            sx={{ textAlign: "center", fontFamily: "poetsen one" }}
          >
            {!isEditable ? "Subject wise quizes" : "All Quizes"}
          </Typography>
        </Box>
        {!subLoading && (
          <Container
            maxWidth="lg"
            sx={{
              display: "flex",
              gap: 3,
              borderRadius: "20px",
              mt: 2,
            }}
          >
            <Paper square elevation={20} sx={{ width: "100%" }}>
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
                        {!subLoading &&
                          allSubjects.map((sub, i) => {
                            return (
                              <MenuItem key={i} value={sub.subject}>
                                {sub.title}
                              </MenuItem>
                            );
                          })}
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
            </Paper>
          </Container>
        )}
        {subLoading && (
          <Container maxWidth="lg">
            <Grid item xs={12} p={2}>
              <Paper sx={{ p: 2, mt: 1 }} elevation={20}>
                <Typography sx={{ fontSize: 18, mt: 2 }}>
                  Loading ...
                </Typography>
                <LinearProgress sx={{ mt: 2, mb: 1 }} />
              </Paper>
            </Grid>
          </Container>
        )}
        <Box sx={{ mt: 5 }}>
          {!loading && subjectQuestion.length > 0 && (
            <Container
              maxWidth="lg"
              sx={{
                display: "flex",
                gap: 3,
                pb: 2,
                borderRadius: "20px",
              }}
            >
              <Paper square elevation={20} sx={{ width: "100%" }}>
                <Grid container spacing={2} sx={{ p: 2, gap: 2 }}>
                  <Grid item xs={12} sm={12} md={12} sx={{ m: 2 }}>
                    <Grid container alignItems="center" spacing={1}>
                      {!isEditable && (
                        <Grid item xs={12} mt={2}>
                          <Typography
                            sx={{ color: seconds <= 5 ? "red" : "inherit" }}
                          >
                            Time Left : {minutes} : {seconds}
                          </Typography>
                        </Grid>
                      )}
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
                          <Stack sx={{ width: "100%" }}>
                            <Typography>Correct Option</Typography>
                            <Button
                              fullWidth
                              variant="outlined"
                              value={subjectQuestion[activeStep].correctOption}
                              onClick={optionSelected}
                            >
                              {" "}
                              {subjectQuestion[activeStep].correctOption}
                            </Button>
                          </Stack>
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
              </Paper>
            </Container>
          )}
          {loading && subjectQuestion.length === 0 && (
            <Typography sx={{ textAlign: "center", pb: 2 }}>
              Select your preference
            </Typography>
          )}
          {!loading && subjectQuestion.length === 0 && (
            <>
              <Box sx={{ pb: 2 }}>
                <Container
                  maxWidth="lg"
                  sx={{
                    py: 5,
                    p: 2,
                  }}
                >
                  <Paper square elevation={20}>
                    <Typography sx={{ p: 2 }}>
                      Question is not available currently.. Soon{" "}
                      <span style={{ fontWeight: 600 }}>
                        {quizSelcVal.subject} {quizSelcVal.level}
                      </span>{" "}
                      level question will be added.
                    </Typography>
                  </Paper>
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
        <BoxModel
          sx={{ minWidth: { xs: "80%", sm: "400px" } }}
          square
          elevation={20}
        >
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
          <Stack direction="row" spacing={2} sx={{ float: "inline-end" }}>
            <Button onClick={againSolve} endIcon={<GrPowerReset />}>
              reset
            </Button>
            <Button onClick={resultSaveToDB} endIcon={<CiSaveDown1 />}>
              SAVE RESULT
            </Button>
          </Stack>
        </BoxModel>
      </Modal>
      <Dialog square onClose={handleDialogClose} open={dialogOpen}>
        <Paper square elevation={20}>
          <DialogTitle>Do you want to login ?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              After login your data will be saved automatically and you can
              check your result in future.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={loginForSaveResult}>yes</Button>
            <Button onClick={() => setDialogOpen(false)}>no</Button>
          </DialogActions>
        </Paper>
      </Dialog>
    </Box>
  );
};

export default Quiz;
