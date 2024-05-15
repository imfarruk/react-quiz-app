import React, { useEffect, useState } from "react";
import {
  Grid,
  Box,
  TextField,
  Button,
  Container,
  Typography,
  Divider,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { MdEmail, MdOutlineVisibilityOff, MdSend, MdVisibility } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaUser, FaPhoneAlt, FaGoogle } from "react-icons/fa";
import { IoPush } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { homeCenter, center } from "../constant/style";
// firebase
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { app } from "../firebase/firebase";

// redux
import { LOGIN } from "../store/actions/index";

//image import
import googleIcon from "../assets/images/google.png";
import facebookIcon from "../assets/images/facebook.png";

import loginImg from "../assets/images/quiz4.webp";
import { useDispatch, useSelector } from "react-redux";
import { BiLock } from "react-icons/bi";
import { saveResultTodb } from "../store/actions/createQuiz";

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const Login = (props) => {
  const dispatch = useDispatch();
  const alreadyAuth = useSelector((state) => state.auth);
  const { isAuthenticated, loading } = alreadyAuth;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const signInWithEmail = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const users = {
          token: userCredential.user.accessToken,
          displayName: userCredential.user.displayName,
          email: userCredential.user.email,
          phoneNumber: userCredential.user.phoneNumber,
          photoURL: userCredential.user.photoURL,
          uid: userCredential.user.uid,
        };
        toast.success("user login");
        setEmail("");
        setPassword("");
        dispatch({
          type: LOGIN,
          payload: users,
        });
        navigate("/");
      })
      .catch((error) => {
        toast.error(error.code);
      });
  };

  const userSignInWIthGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        GoogleAuthProvider.credentialFromResult(result);
        const users = {
          token: result.user.accessToken,
          displayName: result.user.displayName,
          email: result.user.email,
          phoneNumber: result.user.phoneNumber,
          photoURL: result.user.photoURL,
          uid: result.user.uid,
        };
        dispatch({
          type: LOGIN,
          payload: users,
        });
        toast.success("login success");
        navigate("/");
        // ...
      })
      .catch((error) => {
        toast.error(error.code);
      });
  };
 
  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate("/");
    }
  }, []);

  useEffect(()=>{
    if(isAuthenticated){
        saveResultTodb().then((res)=>{
            toast.success(res)
        })
    }
   
  },[isAuthenticated])

  const handleClickShowPassword = ()=>{
    setShowPassword((show) => !show)
  }

  return (
    <>
      <Box sx={{ ...homeCenter, py: "30px" }}>
        <Container sx={{ display: "flex", justifyContent: "center" }}>
          <Grid
            container
            mx={3}
            item
            xs={12}
            sm={10}
            md={8}
            sx={{
              minHeight: "430px",
              background: "#fff",
              display: "flex",
              alignSelf: "center",
              borderRadius: "40px",
            }}
          >
            <Grid item xs={12} sm={7} order={{ xs: 2, sm: 1 }}>
              <Box sx={{ p: 5 }}>
                <Box
                  sx={{
                    py: 5,
                    gap: "20px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h4">Login</Typography>
                  <TextField
                    name="Email"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    id="outlined-basic1"
                    label="email"
                    variant="outlined"
                    InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <MdEmail />
                          </InputAdornment>
                        ),
                      }}
                  />
                  <TextField
                    name="Password"
                    fullWidth
                    value={password}
                    type={showPassword ? 'text' : 'password'}
                    onChange={(e) => setPassword(e.target.value)}
                    id="outlined-basic"
                    label="password"
                    variant="outlined"
                    InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <BiLock />
                          </InputAdornment>
                        ),
                        endAdornment :(
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                // onMouseDown={handleMouseDownPassword}
                                edge="end"
                              >
                               {showPassword  ? <MdOutlineVisibilityOff  /> : <MdVisibility  />}
                              </IconButton>
                            </InputAdornment>
                        )
                      }}
                      
                  />
                  <Button
                    onClick={signInWithEmail}
                    variant="contained"
                    endIcon={<MdSend />}
                  >
                    Login
                  </Button>
                </Box>
                <Divider />
                <Box sx={{ textAlign: "center" }}>
                  <Typography>------------ or ------------</Typography>
                  <Typography>
                    you can also login through third party
                  </Typography>
                  <Box sx={{ p: 3, display: "flex", gap: 2 }}>
                    <Button onClick={userSignInWIthGoogle}>
                      <img src={googleIcon} alt="google" width="40px" />
                    </Button>
                    <Button>
                      <img src={facebookIcon} alt="google" width="40px" />
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              sm={5}
              sx={{ background: "brown", borderRadius: "40px" }}
              order={{ xs: 1, sm: 2 }}
            >
              <Box
                sx={{
                  height: { sm: "100%", xs: "auto" },
                  color: "#fff",
                  flexDirection: "column",
                  justifyContent: "center",
                  display: "flex",
                  alignItems: "center",
                  padding: 3,
                }}
              >
                <img src={loginImg} alt="login" width="100%" />
                <Box>
                  <Typography>
                    if you are a new user then please signup from here.
                  </Typography>
                  <Link to="/signup">
                    <Button
                      variant="contained"
                      endIcon={<IoPush />}
                      sx={{ mt: 2 }}
                    >
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
  );
};

export default Login;
