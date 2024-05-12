import React, { useState } from 'react'
import { Box, Container, Grid, Paper, Stack, Typography,Button } from "@mui/material";
import { FaAngleDown } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import {quiz} from "../constant/db";

const QuizViewCard = ({quiz,key}) => {
     const [openEdit,setOPenEdit] = useState(false)

    const handleEdit = ()=>{
          
    }
    
// console.log(quiz,'currVal');
    return (

        
        <Paper sx={{m:5,p:2}}>
        {/* <Stack> */}
        <Box sx={{ display: 'flex', gap: 3,justifyContent:'center' }}>
            
            <Typography variant="h5">{quiz.title} Question</Typography>
        </Box>
        <Box  sx={{display:'flex',gap:2}}>
            <Typography>Q:</Typography>
            <Typography>{quiz.question}</Typography>
            
        </Box>
        <Box>
            <Typography>A: {quiz.optionA}</Typography>
            <Typography>B: {quiz.optionB}</Typography>
            <Typography>C: {quiz.optionC}</Typography>
            <Typography>D: {quiz.optionD}</Typography>
        </Box>
        <Box sx={{textAlign:'end'}}>
          <Button variant="outlined" onClick={handleEdit} endIcon={<FaEdit/>}>Edit</Button>
        </Box>
    </Paper>
  )
}

export default QuizViewCard