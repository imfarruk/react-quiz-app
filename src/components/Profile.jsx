import { Box, Container, Stack, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import {  useNavigate } from 'react-router-dom';

const Profile = () => {
    const profileData = useSelector(state => state.auth);
    const navigate = useNavigate();
    const {isAuthenticated,loading,user} = profileData;
    console.log(profileData,'user');
    const userDetails = user;
     console.log(userDetails,'user');

    useEffect(()=>{
        if(!isAuthenticated && !loading){
            navigate('/')
        }
    },[])
  return (
    <Box>
        <Container maxWidth="lg">
            <Stack>
                <Typography>Hello</Typography>
            </Stack>
        </Container>
    </Box>
  )
}

export default Profile