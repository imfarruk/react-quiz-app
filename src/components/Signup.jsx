import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { IoPush } from "react-icons/io5";
import { toast } from "react-toastify";
import { LOGIN } from "../store/actions/index";

//image import
import googleIcon from "../assets/images/google.png";
import facebookIcon from "../assets/images/facebook.png";
import loginImg from "../assets/images/quiz4.webp";
import { useDispatch, useSelector } from "react-redux";
import {
  signupWithEmailPwd,
} from "../store/actions/authAction";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithPopup,
  GoogleAuthProvider
} from "firebase/auth";
import { app } from "../firebase/firebase";
import { BiLock } from "react-icons/bi";

// firebase important
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const Signup = () => {
  const alreadyAuth = useSelector((state) => state.auth);
  const { isAuthenticated, loading } = alreadyAuth;
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const signupWithEmail = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((value) => {
        toast.success("signup success", value);
        setEmail("");
        setPassword("");
        navigate("/profile");
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



const signInWIthGoogle = () => {
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

  const handleClickShowPassword = ()=>{
    setShowPassword((show) => !show)
  }

  return (
    <>
      <Box sx={{ py: "30px" }}>
        <Container sx={{ display: "flex", justifyContent: "center" }}>
          <Grid
            container
            mx={3}
            item
            xs={12}
            md={8}
            sm={10}
            sx={{
              minHeight: "430px",
              background: "#fff",
              display: "flex",
              alignSelf: "center",
              borderRadius: "40px",
            }}
          >
            <Grid
              item
              xs={12}
              sm={5}
              sx={{ background: "brown", borderRadius: "40px" }}
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
                    if you are already a user then please login from here.
                  </Typography>
                  <Link to="/login">
                    <Button
                      variant="contained"
                      endIcon={<IoPush />}
                      sx={{ mt: 2 }}
                    >
                      Login
                    </Button>
                  </Link>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={7}>
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
                  <Typography variant="h4">Signup</Typography>
                  <TextField
                  fullWidth
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    id="outlined-basic2"
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
                  fullWidth
                    name="password"
                    value={password}
                    type={showPassword ? 'text' : 'password'}
                    onChange={(e) => setPassword(e.target.value)}
                    id="outlined-basic4"
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
                    variant="contained"
                    endIcon={<MdSend />}
                    onClick={signupWithEmail}
                  >
                    Signup
                  </Button>
                </Box>
                <Divider />
                <Box sx={{ textAlign: "center" }}>
                  <Typography>------------ or ------------</Typography>

                  <Typography>
                    you can also login through third party
                  </Typography>
                  <Box sx={{ p: 3, display: "flex", gap: 2 }}>
                    <Button onClick={signInWIthGoogle}>
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
  );
};

export default Signup;
