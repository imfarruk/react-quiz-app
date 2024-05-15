import React, { useState, useEffect } from "react";
import { Box, TextField, Grid, Container } from "@mui/material";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { homeCenter } from "../constant/style";
import { BsFillSave2Fill } from "react-icons/bs";
import { getQuizById, updateQuiz } from "../store/actions/createQuiz";
import { toast } from "react-toastify";
import MenuItem from "@mui/material/MenuItem";
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
  const [submitting, setSubmitting] = useState(false);
  const [loading,setLoading] = useState(true)
  const navigate = useNavigate();
  const [quizValue, setQuizValue] = useState(initialQuizValue);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
 

  useEffect(() => {
    getQuizById(id).then((data) => {
      
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
  };

  const validateForm = (data) => {
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
