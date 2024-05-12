import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { Grid, Box, TextField, Button, Container, Typography, ImageList, ImageListItem, Divider } from "@mui/material"
import { MdEmail, MdSend } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaUser, FaPhoneAlt, FaGoogle } from "react-icons/fa";
import { IoPush } from "react-icons/io5";
import { toast } from 'react-toastify';

// firebase
import { app } from '../firebase/firebase';
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";

//image import
import googleIcon from "../assets/images/google.png";
import facebookIcon from "../assets/images/facebook.png";
import loginImg from '../assets/images/quiz4.webp'
import { useSelector } from 'react-redux';

// firebase important
const auth = getAuth(app);

const Signup = () => {
    const alreadyAuth = useSelector(state => state.auth)
    const { isAuthenticated, loading } = alreadyAuth;
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const signupWithEmail = () => {
        createUserWithEmailAndPassword(auth,
            email, password).then((value) => {
                toast.success('signup success', value);
                setEmail("");
                setPassword("");
                navigate('/')
            }).catch((error) => { toast.error(error.code) })

    }

    useEffect(() => {
        if (isAuthenticated && !loading) {
            navigate('/')
        }
    }, [])

    return (
        <>
            <Box sx={{ background: `url(${googleIcon} cover)`, margin: '30px 20px', }}>
                <Container sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Grid container mx={3} item xs={12} md={8} sm={10} sx={{ minHeight: '430px', background: '#fff', display: 'flex', alignSelf: 'center', borderRadius: '40px' }}>
                        <Grid item xs={12} sm={5} sx={{ background: 'brown', borderRadius: '40px' }}>
                            <Box sx={{ height: { sm: "100%", xs: "auto" }, color: '#fff', flexDirection: 'column', justifyContent: 'center', display: 'flex', alignItems: 'center', padding: 3 }}>
                                <img src={loginImg} alt="login" width="100%" />
                                <Box>
                                    <Typography>if you are already a user then please login from here.</Typography>
                                    <Link to="/login">
                                        <Button variant="contained" endIcon={<IoPush />}>
                                            Login
                                        </Button>
                                    </Link>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={7} >
                            <Box sx={{ p: 3 }}>
                                <Box sx={{ py: 2, gap: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                    <Typography variant="h4">Signup</Typography>
                                    {/* <TextField id="outlined-basic1" label="name" variant="outlined" size="small" /> */}
                                    <TextField name="email" value={email} onChange={(e) => setEmail(e.target.value)} id="outlined-basic2" label="email" variant="outlined" size="small" />
                                    {/* <TextField id="outlined-basic3" label="mobile no" variant="outlined" size="small"/> */}
                                    <TextField name="password" value={password} onChange={(e) => setPassword(e.target.value)} id="outlined-basic4" label="password" variant="outlined" size="small" />
                                    <Button variant="contained" endIcon={<MdSend />} onClick={signupWithEmail}>
                                        Signup
                                    </Button>
                                </Box>
                                <Divider />
                                <Typography sx={{ textAlign: 'center' }}>------------ or ------------</Typography>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography>you can also login through third party</Typography>
                                    <Box sx={{ p: 3, display: 'flex', gap: 2 }}>
                                        <Button>
                                            <img src={googleIcon} alt="google" width="40px" />
                                        </Button>
                                        <Button>
                                            <img src={facebookIcon} alt="google" width="40px" />
                                        </Button>
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>



        </>
    )
}

export default Signup