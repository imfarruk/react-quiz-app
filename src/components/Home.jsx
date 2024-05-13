import React from "react";
import { Link } from "react-router-dom";
import { Box, Typography, Container, Paper, Button } from "@mui/material";
import Grid from "@mui/material/Grid";
import homeImg from "../assets/images/quiz4.webp";
import { homeCenter } from "../constant/style";

import HomeInfo from "./HomeInfo";
const Home = () => {
  return (
    <>

      <Box sx={{ ...homeCenter,flexDirection:'column', background: "#fff",p:3,minHeight:"calc(100vh-120px)" }}>
        <Box sx={{ px: { xs: 3, sm: 2 } }}>
          <img src={homeImg} alt="home" width="100%" />
        </Box>

        <Typography sx={{ fontSize: { xs: 32, sm: 40, md: 48 } }} color="#000">
          Welcome to Quiz App{" "}
        </Typography>
        <Typography sx={{ fontSize: { xs: 22, sm: 30, md: 38 } }}>
          Here,you can test your knowledge{" "}
        </Typography>
        <Link to="/quiz">
          <Button variant="contained" sx={{ mt: 2 }}>
            Let's start
          </Button>
        </Link>
      </Box>
      <Box>
        <HomeInfo />
      </Box>
    </>
  );
};

export default Home;
