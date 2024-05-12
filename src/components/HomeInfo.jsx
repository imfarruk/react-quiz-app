import React from 'react'
import {Link} from "react-router-dom";
import {Box, Typography,Container,Paper,Button} from "@mui/material";
import Grid from '@mui/material/Grid';
import homeImg from '../assets/images/quiz4.webp';
import {center} from "../constant/style"

const HomeInfo = () => {
  return (
    <Box sx={center}>
        <Container maxWidth="lg">
    <Grid container spacing={2} >
                <Grid item xs={12} md={6}>
                    <Paper sx={{p:2}}>
                      <img src={homeImg} alt="hone-img" width="100%" height="100%"/>
                    </Paper>
                    </Grid>
                <Grid item xs={12} md={6}>
                <Typography variant='h3' color='#000' >Welcome to Quiz App </Typography>
      <Typography variant='h5'>Here,you can test your knowledge </Typography>
                </Grid>
            </Grid>
            </Container>
    </Box>
  )
}

export default HomeInfo