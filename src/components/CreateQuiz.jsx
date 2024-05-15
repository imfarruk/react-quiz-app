import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";

import { homeCenter ,center,centerBox} from "../constant/style";
import { BsPlusSquareFill } from "react-icons/bs";
import QuizCard from "./QuizCard";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Quiz from "./Quiz";
import { userDetails } from "../store/actions/authAction";

const CreateQuiz = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authentication = useSelector((state) => state.auth);
  const {userLoading,userDetail} = useSelector((state) => state.quizData);
  console.log(userDetail,userLoading,'userload');
  const { isAuthenticated, loading,user } = authentication;
  const [createQuiz, setCreateQuiz] = useState(false);
  const [userDetailVal,setUserDetailVal] = useState()
  const [userLoadings,setUserLoadings] = useState(false)
  const createQuizes = () => {
    setCreateQuiz(!createQuiz);
  };
  // useEffect(() => {
  //   dispatch(userDetails(user?.uid)).then((res) => {
      
  //     console.log(res,'res');
  //     if (userDetail !== "admin" && isAuthenticated && !userLoadings ) {
  //       toast.info("you are not authorized user");
  //       navigate("/");
  //     }
  //   });
  // }, []);

  useEffect(() => {
    if (userDetail?.role !== "admin" && isAuthenticated && !userLoading ) {
      toast.info("you are not authorized user");
      navigate("/");
    }
    
  },[]);

  // if (userDetailVal !== "admin" && isAuthenticated && !userLoading ) {
  //   toast.info("you are not authorized user if condition");
  //   navigate("/");
  // }

  
  return (
    <>
    <Box sx={{...centerBox, p:2,flexDirection: "column" }}>
      <Typography variant="h5">Create more quizes</Typography>
      <Button
        onClick={createQuizes}
        size="large"
        variant="contained"
        endIcon={<BsPlusSquareFill />}
      >
        Create
      </Button>
      </Box>
      <Box sx={{ mt: 2 }}>
        {createQuiz && <QuizCard createQuizInfo={setCreateQuiz} />}
      </Box>
    
    <Box sx={{ width: "100%" }}>
       <Quiz isEditable={true}/>
    </Box>
    </>
  );
};

export default CreateQuiz;
