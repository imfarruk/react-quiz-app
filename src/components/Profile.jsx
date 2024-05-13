import { Box, Button, Container, Divider, Grid, Paper, Stack, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import {  useNavigate } from 'react-router-dom';
import { homeCenter } from '../constant/style';

import profileImg from "../assets/images/account11.jpg"

const Profile = () => {
    const profileData = useSelector(state => state.auth);
    const navigate = useNavigate();
    const {isAuthenticated,loading,user} = profileData;
    console.log(profileData,'user');

    useEffect(()=>{
        if(!isAuthenticated && !loading){
            navigate('/')
        }
    },[])

    const editProfile = () =>{
        navigate('/edit-profile')
    }
  return (
    <Box sx={{...homeCenter}}>
        <Stack>
        <Paper maxWidth="md" sx={{background:'grey',p:2}}>
        <Grid container spacing={3} sx={{justifyContent:'center'}}>
        <Grid item xs={8} sm={4}>
            <Box sx={{width:'100%',height:'100%'}}>
            {user.photoURL === null ? (
                  <img
                    src={profileImg}
                    width="175px"
                    height="175px"
                    style={{ borderRadius: "50%" }}
                  />
                ) : (
                  <img
                    src={user?.photoURL}
                    width="175px"
                    height="175px"
                    style={{ borderRadius: "50%" }}
                  />
                )}
            </Box>
          
        </Grid>
        <Grid item xs={12} sm={8}>
            <Paper sx={{p:2}}>
                <Typography sx={{fontSize:22}}> Welcome Mr {user?.displayName}</Typography>
                <Divider/>
              <Typography>Email: {user?.email}</Typography>
              <Typography>Phone No: {user?.phoneNumber}</Typography>
              <Box sx={{textAlign:'end'}}>
              <Button variant="contained" onClick={editProfile}>Edit Profile</Button>

              </Box>
             

            </Paper>
            <Paper sx={{p:2,mt:2}}>
            <Typography sx={{fontSize:18}}>Your last quiz Result</Typography>
              <Divider/>
              <Typography>Total Attempt : 20</Typography>
              <Typography>Correct Answer : 20</Typography>
              <Typography>Wrong Answer : 10</Typography>
            </Paper>
        </Grid> 
            
        </Grid>
                
                
           
        </Paper>
        </Stack>
    </Box>
  )
}

export default Profile