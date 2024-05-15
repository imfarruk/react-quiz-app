import React, { useState } from "react";
import { Box, TextField, Grid, Container, Paper, Stack } from "@mui/material";
import Button from "@mui/material/Button";
import { BsPlusSquareFill } from "react-icons/bs";
import { MdCancel, MdDelete } from "react-icons/md";
import { BsFillSave2Fill } from "react-icons/bs";
import { createQuizQuestion } from "../store/actions/createQuiz";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import MenuItem from "@mui/material/MenuItem";

const initialQuizValue = {
  subject: "",
  level: "",
  question: "",
  optionA: "",
  optionB: "",
  optionC: "",
  optionD: "",
  correctOption: "",
};
const initialError = {
  subject: false,
  level: false,
  question: false,
  optionA: false,
  optionB: false,
  correctOption: false,
};
const QuizCard = ({ createQuizInfo, ...props }) => {
  const dispatch = useDispatch();
  const [option, setOption] = useState(false);
  const [errors, setErrors] = useState(initialError);
  const [submitting, setSubmitting] = useState(false);
  const [quizValue, setQuizValue] = useState(initialQuizValue);


  const showOption = () => {
    setOption(!option);
  };

  const changeValue = (e) => {
    setQuizValue({ ...quizValue, [e.target.name]: e.target.value });
  };

  const deleteOption = () => {
    setOption(false);
    setQuizValue({ ...quizValue, optionC: "", optionD: "" });
  };

  const saveQuestion = async (e) => {
    //firebase
    e.preventDefault();
    setSubmitting(true);
    const validationErrors = validateForm(quizValue);
    if (Object.keys(validationErrors).length === 0) {
      const {
        subject,
        level,
        question,
        optionA,
        optionB,
        optionC,
        optionD,
        correctOption,
      } = quizValue;
      const datass = {
        subject,
        level,
        question,
        optionA,
        optionB,
        optionC,
        optionD,
        correctOption,
      };
      dispatch(createQuizQuestion(datass)).then(() => {
        setQuizValue({
          subject: "",
          level: "",
          question: "",
          optionA: "",
          optionB: "",
          optionC: "",
          optionD: "",
          correctOption: "",
        });
        toast.success("created successfully");
        clearForm();
        createQuizInfo(false);
      });
    } else {
      setErrors(validationErrors);
      setSubmitting(false);
    }
  };

  const validateForm = (data) => {
    let errors = {};
    if (!data.subject.trim()) {
      setErrors({ ...errors }, (errors.subject = true));
    }
    if (!data.question.trim()) {
      setErrors({ ...errors }, (errors.question = true));
    }
    if (!data.level.trim()) {
      setErrors({ ...errors }, (errors.level = true));
    }
    if (!data.optionA.trim()) {
      setErrors({ ...errors }, (errors.optionA = true));
    }
    if (!data.optionB.trim()) {
      setErrors({ ...errors }, (errors.optionB = true));
    }
    if (!data.correctOption.trim()) {
      setErrors({ ...errors }, (errors.correctOption = true));
    }
    return errors;
  };

  const clearForm = () => {
    setErrors({});
    setSubmitting(false);
  };
  const cancelSaveQuestion = () => {
    clearForm();
    createQuizInfo(false);
  };
  return (
    <Box sx={{ p: 2 }}>
      <Container maxWidth="lg">
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
                    defaultValue=""
                    name="subject"
                    onChange={changeValue}
                    error={Boolean(errors.subject)}
                    helperText={errors.subject && "Subject required"}
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
                 
                  <TextField
                    id="outlined-select-level"
                    select
                    fullWidth
                    label="Quiz level"
                    size="small"
                    defaultValue=""
                    name="level"
                    onChange={changeValue}
                    error={Boolean(errors.level)}
                    helperText={errors.level && "level required"}
                  >
                    <MenuItem value="easy">Easy</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="hard">Hard</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={12} md={12} mt={2}>
                  <TextField
                    error={Boolean(errors.question)}
                    helperText={errors.question && "Question required"}
                    id="standard-error-helper-text"
                    multiline
                    fullWidth
                    size="small"
                    value={quizValue.question}
                    name="question"
                    onChange={changeValue}
                    label="Question"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6} mt={2}>
                  <TextField
                    error={Boolean(errors.optionA)}
                    helperText={errors.optionA && "Option A required"}
                    fullWidth
                    size="small"
                    value={quizValue.optionA}
                    name="optionA"
                    onChange={changeValue}
                    label="Option A"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6} mt={2}>
                  <TextField
                    error={Boolean(errors.optionB)}
                    helperText={errors.optionB && "option B required"}
                    fullWidth
                    size="small"
                    value={quizValue.optionB}
                    name="optionB"
                    onChange={changeValue}
                    label="Option B"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} mt={2} sx={{ textAlign: "end" }}>
                  <Button
                    onClick={showOption}
                    variant="contained"
                    endIcon={<BsPlusSquareFill />}
                  >
                    Add More option
                  </Button>
                </Grid>
                {option && (
                  <>
                    <Grid item xs={12} sm={6} mt={2}>
                      <TextField
                        fullWidth
                        size="small"
                        value={quizValue.optionC}
                        name="optionC"
                        onChange={changeValue}
                        label="Option C"
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} mt={2}>
                      <TextField
                        fullWidth
                        size="small"
                        value={quizValue.optionD}
                        name="optionD"
                        onChange={changeValue}
                        label="Option D"
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} sx={{ textAlign: "end" }} mt={2}>
                      <Button
                        onClick={deleteOption}
                        sx={{ background: "red" }}
                        variant="contained"
                        endIcon={<MdDelete />}
                      >
                        Delete option
                      </Button>
                    </Grid>
                  </>
                )}
                <Grid item xs={12} sm={6} mt={2}>
                  <TextField
                    error={Boolean(errors.correctOption)}
                    helperText={
                      errors.correctOption && "correct option required"
                    }
                    fullWidth
                    size="small"
                    value={quizValue.correctOption}
                    name="correctOption"
                    onChange={changeValue}
                    label="Correct option"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} mt={2} sx={{ textAlign: "start" }}>
                  <Stack direction="row" spacing={2}>
                    <Button
                      onClick={saveQuestion}
                      variant="contained"
                      endIcon={<BsFillSave2Fill />}
                    >
                      Save
                    </Button>
                    <Button
                      onClick={cancelSaveQuestion}
                      color="error"
                      variant="contained"
                      endIcon={<MdCancel />}
                    >
                      Cancel
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

// export default QuizCard
export default QuizCard;
