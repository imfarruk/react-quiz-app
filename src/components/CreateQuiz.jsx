import React, { useEffect, useState } from 'react'
import {Box, Button, Grid, Typography} from '@mui/material'

import {homeCenter} from "../constant/style"
import { BsPlusSquareFill } from "react-icons/bs";
import QuizCard from './QuizCard';
import QuizViewCard from "./quizViewCard";
import {quiz} from "../constant/db";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {toast } from 'react-toastify';

const CreateQuiz = () => {
    const navigate = useNavigate();

    const authentication = useSelector(state => state.auth);
    const {isAuthenticated,loading} = authentication;
    console.log(authentication,'authhhh');
    const [createQuiz,setCreateQuiz] = useState(false);
    
    const createQuizes=(e)=>{
        setCreateQuiz(!createQuiz)
    }
    useEffect(()=>{
        if(!isAuthenticated && !loading){
            toast.info('you are not authorized user');
            navigate('/')
        }
    })
  return (
    <Box sx={{...homeCenter,flexDirection:'column'}}>
        <Typography variant="h5">Create more quizes</Typography>
        <Button onClick ={createQuizes}size='large' variant='contained' endIcon={<BsPlusSquareFill/>}>Create</Button>
        <Box sx={{mt:2}}>
            {
                createQuiz && (
                   <QuizCard createQuiz={setCreateQuiz}/>
                )
            }
            
        </Box>
        <Box sx={{width:'100%'}}>
            <Grid container spacing={2}>
                
                {
                quiz.length>0 && quiz.map((currVal,i)=>{
                    return(
                        <Grid xs={12} sm={6} md={4}>
                     <QuizViewCard quiz={currVal} key={i}/>
                     </Grid>
                    ) 
                }    
                )
            }
                
            </Grid>
            
           
        </Box>
    </Box>
  )
}

export default CreateQuiz