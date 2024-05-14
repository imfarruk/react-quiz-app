import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";

import { homeCenter } from "../constant/style";
import { BsPlusSquareFill } from "react-icons/bs";
import QuizCard from "./QuizCard";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Quiz from "./Quiz";

const CreateQuiz = () => {
  const navigate = useNavigate();

  const authentication = useSelector((state) => state.auth);
  const { isAuthenticated, loading } = authentication;
  const [createQuiz, setCreateQuiz] = useState(false);

  const createQuizes = () => {
    setCreateQuiz(!createQuiz);
  };
  useEffect(() => {
    if (!isAuthenticated && !loading) {
      toast.info("you are not authorized user");
      navigate("/");
    }
  });
  return (
    <>
    <Box sx={{ ...homeCenter, p:2,flexDirection: "column" }}>
      <Typography variant="h5">Create more quizes</Typography>
      <Button
        onClick={createQuizes}
        size="large"
        variant="contained"
        endIcon={<BsPlusSquareFill />}
      >
        Create
      </Button>
      <Box sx={{ mt: 2 }}>
        {createQuiz && <QuizCard createQuizInfo={setCreateQuiz} />}
      </Box>
      </Box>
    <Box sx={{ width: "100%" }}>
       <Quiz isEditable={true}/>
    </Box>
    </>
  );
};

export default CreateQuiz;
