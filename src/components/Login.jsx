import React, { useEffect, useState } from 'react'
import { Grid, Box, TextField, Button, Container, Typography, Divider } from "@mui/material"
import { MdEmail, MdSend } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaUser, FaPhoneAlt, FaGoogle } from "react-icons/fa";
import { IoPush } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// firebase
import { getAuth, signInWithEmailAndPassword,GoogleAuthProvider,signInWithPopup  } from "firebase/auth";
import { app } from '../firebase/firebase';

// redux 
import { userLogin } from "../store/actions/authAction";
import { LOGIN, LOGOUT, USER_LOADED } from "../store/actions/index";


//image import
import googleIcon from "../assets/images/google.png";
import facebookIcon from "../assets/images/facebook.png";

import loginImg from '../assets/images/quiz4.webp'
import { useDispatch, useSelector } from 'react-redux';

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const Login = (props) => {
    
    const dispatch = useDispatch();
    const alreadyAuth = useSelector(state => state.auth)
    const { isAuthenticated, loading } = alreadyAuth;
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate()

    const signInWithEmail = () => {
        let data = {
            email,
            password
        }
        signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
            // Signed in 
            toast.success('user login')
            setEmail("");
            setPassword("");
            dispatch({
                type: LOGIN,
                payload: userCredential.user,
            });
            navigate('/')

        }).catch((error) => {
            toast.error(error.code)
        });
    }

    const userSignInWIthGoogle = () =>{
        signInWithPopup(auth,provider).then((result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            // console.log(result,'34',credential);
            dispatch({
                type: LOGIN,
                payload: result.user,
            });
            const token = credential.accessToken;
            const user = result.user.providerData[0];
            toast.success('login')
            navigate('/')
            // ...
          }).catch((error) => {
            toast.error(error.code)
         
          });
    }


    // signInWithEmailAndPassword(auth, email, password)
    // .then((userCredential) => {
    //   // Signed in 
    //   console.log(userCredential);
    //   const user = userCredential.user;
    //   toast.success('user')
    //   setEmail("");
    //   setPassword("");
    //   // ...
    // })
    // .catch((error) => {
    //   toast.error(error.code)
    // });
    // }
    useEffect(() => {
        if (isAuthenticated && !loading) {
            navigate('/')
        }
    }, [])


    return (
        <>
            <Box sx={{ background: `url(${googleIcon} cover)`, margin: '30px 20px', }}>
                <Container sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Grid container mx={3} item xs={12} sm={10} md={8} sx={{ minHeight: '430px', background: '#fff', display: 'flex', alignSelf: 'center', borderRadius: '40px' }}>
                        <Grid item xs={12} sm={7} order={{ xs: 2, sm: 1 }}>
                            <Box sx={{ p: 3 }}>
                                <Box sx={{ py: 2, gap: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                    <Typography variant="h4">Login</Typography>
                                    <TextField name="email" value={email} onChange={(e) => setEmail(e.target.value)} id="outlined-basic" label="email" variant="outlined" />
                                    <TextField name="password" value={password} onChange={(e) => setPassword(e.target.value)} id="outlined-basic" label="password" variant="outlined" />
                                    <Button onClick={signInWithEmail} variant="contained" endIcon={<MdSend />}>
                                        Login
                                    </Button>
                                </Box>
                                <Divider />
                                <Typography sx={{ textAlign: 'center' }}>------------ or ------------</Typography>
                                <Box>
                                    <Typography>you can also login through third party</Typography>
                                    <Box sx={{ p: 3, display: 'flex', gap: 2 }}>
                                        <Button onClick={userSignInWIthGoogle}>
                                            <img src={googleIcon} alt="google" width="40px" />
                                        </Button>
                                        <Button >
                                            <img src={facebookIcon} alt="google" width="40px" />
                                        </Button>
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={5} sx={{ background: 'brown', borderRadius: '40px' }} order={{ xs: 1, sm: 2 }}>
                            <Box sx={{ height: { sm: "100%", xs: "auto" }, color: '#fff', flexDirection: 'column', justifyContent: 'center', display: 'flex', alignItems: 'center', padding: 3 }}>
                                <img src={loginImg} alt="login" width="100%" />
                                <Box>
                                    <Typography>if you are a new user then please signup from here.</Typography>
                                    <Link to="/signup">
                                        <Button variant="contained" endIcon={<IoPush />}>
                                            Signup
                                        </Button>
                                    </Link>
                                </Box>
                            </Box>
                        </Grid>

                    </Grid>
                </Container>
            </Box>


        </>
    )
}

export default Login