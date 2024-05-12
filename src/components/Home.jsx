import React from 'react';
import {Link} from "react-router-dom";
import {Box, Typography,Container,Paper,Button} from "@mui/material";
import Grid from '@mui/material/Grid';
import homeImg from '../assets/images/quiz4.webp';

import HomeInfo from './HomeInfo';
const Home = () => {
  return (
    <>
    {/* <Box sx={{justifyContent:'content',display:'flex',flexDirection:'column',alignItems:'center'}}>
      <Typography variant='h3' color='#000' >Welcome to Quiz App </Typography>
      <Typography variant='h5'>Here,you can test your knowledge </Typography>
      <Box minHeight={100}/>
        <Container maxWidth="md">
        {/* <Box> */}
            {/* <Grid container spacing={2} >
                <Grid xs={12} md={6}>
                    <Paper sx={{p:2}}>
                      <img src={homeImg} alt="hone-img" width="100%"/>
                    </Paper>
                    </Grid>
                <Grid xs={12} md={6}>
                    <Typography variant="h5">You can give emerging technology quiz.</Typography>
                </Grid>
            </Grid> */}
            {/* </Box> */}
        {/* </Container> */}
       
        

    {/* </Box> */}
    <Box sx={{display:'flex',justifyContent:'center',flexDirection:'column',alignItems:'center',minHeight: "calc(100vh - 120px)",background:'#fff'}}>
    <Box sx={{m:2}}>
        <img src={homeImg} alt="home" width="100%"/>
    <Typography variant='h3' color='#000' >Welcome to Quiz App </Typography>
      <Typography variant='h5'>Here,you can test your knowledge </Typography>
      <Link to="/quiz" >
      
      <Button variant="contained" sx={{mt:2}}>Let's start</Button>
      </Link>
    </Box>
    </Box>
    <Box>
        <HomeInfo/>
    
            </Box>
    </>
  )
}

export default Home