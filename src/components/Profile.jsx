import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { homeCenter } from "../constant/style";

import profileImg from "../assets/images/account11.jpg";
import { userDetails } from "../store/actions/authAction";

const Profile = () => {
  const profileData = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { isAuthenticated, loading, user } = profileData;
  const [userDetail, setUserDetail] = useState({});
  const [phoneNo, setPhoneNo] = useState("");
  const [savedQuizResult,setSavedQuizResult] = useState()
  const [allSavedResult,setAllSavedResult] = useState()
  console.log(profileData, "user");

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      navigate("/");
    }
    userDetails(user.uid).then((data) => {
      setUserDetail(data);
      setSavedQuizResult(data?.userResult[0])
      setAllSavedResult(data?.userResult);
      setPhoneNo(data?.phoneNumber)
      console.log(data,'daatta');
    });
  }, []);

 const date = new Date(savedQuizResult?.date)
 const readableDate = date.toLocaleString();

  const calculateTotalSumForKey = (array, key) => {
    return array.reduce((sum, item) => sum + item[key], 0);
  };
   const keys = ["totalQuestion","totalAttempt","wrongAnswer","correctAnswer"]
  const totalSumByKeys = keys.reduce((result, key) => {
    result[key] = calculateTotalSumForKey(allSavedResult, key);
    return result;
  }, {});

  console.log(totalSumByKeys,"totalQuestion");
  const editProfile = () => {
    navigate("/edit-profile");
  };
  return (
    <Box sx={{ ...homeCenter }}>
      <Container  maxWidth="md" >
        <Paper maxWidth="md" sx={{ background: "grey", p: 2,my:5 }}>
          <Grid container spacing={3} sx={{ justifyContent: "center" }}>
            <Grid item xs={8} sm={4}>
              <Stack sx={{ width: "100%", height: "100%",alignItems: 'center' }}>
                {user.photoURL === null ? (
                  <img
                    src={profileImg}
                    width="175px"
                    height="175px"
                    style={{ borderRadius: "50%",objectFit:'cover' }}
                    alt="profile"
                  />
                ) : (
                  <img
                    src={user?.photoURL}
                    width="175px"
                    height="175px"
                    style={{ borderRadius: "50%",objectFit:'cover' }}
                    alt="profile"
                  />
                )}
              </Stack>
            </Grid>
            <Grid item xs={12} sm={8}>
              <Paper sx={{ p: 2 }}>
                <Typography sx={{ fontSize: 22 }}>
                  {" "}
                  Welcome Mr {user?.displayName}
                </Typography>
                <Divider />
                <Typography mt={1}>Email: {user?.email}</Typography>
                <Typography>Phone No: {phoneNo}</Typography>
                <Box sx={{ textAlign: "end" }}>
                  <Button variant="contained" onClick={editProfile}>
                    Edit Profile
                  </Button>
                </Box>
              </Paper>
              <Paper sx={{ p: 2, mt: 2 }}>
                <Typography sx={{ fontSize: 18 }}>
                  Your last quiz Result
                </Typography>
                <Divider />
                <Stack mt={1}>
                <Typography>Attempted Subject : {savedQuizResult?.subject}</Typography>
                <Typography>Subject Level : {savedQuizResult?.level}</Typography>
                <Typography>Total Attempt : {savedQuizResult?.totalAttempt}</Typography>
                <Typography>Correct Answer : {savedQuizResult?.correctAnswer}</Typography>
                <Typography>Wrong Answer : {savedQuizResult?.wrongAnswer}</Typography>
                <Typography>Marks Percentage : {savedQuizResult?.markPercentage} %</Typography>
                <Typography>Date : {readableDate}</Typography>
                </Stack>
              </Paper>
              <Paper sx={{ p: 2, mt: 2 }}>
              <Typography sx={{ fontSize: 18 }}>
                  Your all quiz results
                </Typography>
                <Divider />
                <Stack mt={1}>
                  <Typography>Total Attempt : {totalSumByKeys?.totalAttempt}</Typography>
                <Typography>Correct Answer : {totalSumByKeys?.correctAnswer}</Typography>
                <Typography>Wrong Answer : {totalSumByKeys?.wrongAnswer}</Typography>
                <Typography>Marks Percentage : {(`${totalSumByKeys?.correctAnswer}`/`${totalSumByKeys?.totalAttempt}`)* 100} %</Typography>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default Profile;
