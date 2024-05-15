import React from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  Container,
  Button,
} from "@mui/material";
import homeImg from "../assets/images/quiz4.webp";

const Home = () => {
  return (
    <>
      <Box sx={{ p: 3 }}>
        <Container>
          <Box sx={{ px: { xs: 3, sm: 2 } }}>
            <img src={homeImg} alt="home" width="100%" />
          </Box>

          <Typography
            sx={{ fontSize: { xs: 32, sm: 40, md: 48 } }}
            color="#000"
          >
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
        </Container>
      </Box>
    </>
  );
};

export default Home;
