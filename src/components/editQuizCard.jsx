import React, { useState, useEffect } from "react";
import { Box, TextField, Grid, Container } from "@mui/material";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { BsPlusSquareFill } from "react-icons/bs";
import { homeCenter } from "../constant/style";
import { MdDelete } from "react-icons/md";
import { BsFillSave2Fill } from "react-icons/bs";
import { quiz } from "../constant/db";
import { createQuizQuestion, getQuizById, updateQuiz } from "../store/actions/createQuiz";
import { connect, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import FormHelperText from "@mui/material/FormHelperText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";

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

const EditQuizCard = () => {
  const { id } = useParams();
  const [option, setOption] = useState(false);
  const [errors, setErrors] = useState(initialError);
  const [dbFile, setDbFile] = useState(quiz);
  const [submitting, setSubmitting] = useState(false);
  const [loading,setLoading] = useState(true)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [quizValue, setQuizValue] = useState(initialQuizValue);
  let valId;

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  console.log(id, "id");

  useEffect(() => {
    getQuizById(id).then((data) => {
      console.log(data, "resultById");
      
      setQuizValue(data);
      setLoading(false);
    });
  }, [id]);

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
    updateQuiz(id,quizValue).then((data)=>{
        toast.success(data);
        navigate('/create-quiz')
    })
    // setSubmitting(true);
    // const validationErrors = validateForm(quizValue);
    // if (Object.keys(validationErrors).length === 0) {
    //     const { subject, level, question, optionA, optionB, optionC, optionD, correctOption } = quizValue;
    //         const datass = {
    //             subject, level, question, optionA, optionB, optionC, optionD, correctOption
    //         }
    //        dispatch(createQuizQuestion(datass)).then(()=>{
    //         setQuizValue({subject:"", level:"", question:"", optionA:"", optionB:"", optionC:"", optionD:"", correctOption:""})
    //         toast.success('created successfully')
    //         clearForm();
    //     });
    //   } else {
    //     setErrors(validationErrors);
    //     setSubmitting(false);
    //   }
  };

  const validateForm = (data) => {
    console.log(data, "daada");
    let errors = {};
    if (!data.subject.trim()) {
      setErrors({ ...errors }, (errors.subject = true));
      console.log(errors, "errors");
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

  return (
    <>
      <Box sx={{ ...homeCenter, p: 2 }}>
      { !loading &&
        <Container
          maxWidth="lg"
          sx={{
            background: "#fff",
            display: "flex",
            gap: 3,
            p: 2,
            borderRadius: "20px",
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
                    defaultValue={quizValue.subject}
                    value={quizValue.subject}
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
                    defaultValue={quizValue.level}
                    value={quizValue.level}
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
                  <Button
                    onClick={saveQuestion}
                    variant="contained"
                    endIcon={<BsFillSave2Fill />}
                  >
                    Save
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        

        </Container>
          }
      </Box>
      { loading &&
          <Box sx={{textAlign:'center'}}>
            <Typography variant="h5">Loading ...</Typography>
          </Box>
          }
    </>
  );
};

export default EditQuizCard;