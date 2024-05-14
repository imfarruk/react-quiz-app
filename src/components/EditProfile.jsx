import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { homeCenter } from "../constant/style";
import { styled } from "@mui/material/styles";
import profileImg from "../assets/images/account11.jpg";
import { MdCloudUpload } from "react-icons/md";
import {
  updateUserProfile,
  uploadProfilePhoto,
  userDetails,
} from "../store/actions/authAction";
import { toast } from "react-toastify";
import noUserPhoto from '../assets/images/no-user-photo.jpg'

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const EditProfile = () => {
  const profileData = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { isAuthenticated, loading, user } = profileData;
  const [userDetail, setUserDetail] = useState({});
  const [userName, setUserName] = useState(user?.displayName);
  const [phoneNo, setPhoneNo] = useState("");
  const [userId, setUserId] = useState(user.uid);
  const [imageFile, setImageFile] = useState("");
  const [profilePreview, setProfilePreview] = useState("");
  const [fileChange, setFileChange] = useState(false);
  

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      navigate("/");
    }
    userDetails(user.uid).then((data) => {
      setUserDetail(data);
      setPhoneNo(data?.phoneNumber)
    });
  }, []);

  const updateProfile = () => {
    const data = {
      displayName: userName,
      phoneNumber: phoneNo,
      photoURL: imageFile,
      userId: userId,
    };
     
      uploadProfilePhoto(imageFile, data,user.uid)
        .then((datas) => {
          toast.success("user details updated successfully");
        navigate("/profile");
        })
        .catch((error) => {
          toast.error(error.message);
        });
  };

  const fileUpload = (e) => {
    setFileChange(true);
    let files = e.target.files[0];
    setImageFile(files);
    setProfilePreview(URL.createObjectURL(files));
  };
  return (
    <Box sx={{ ...homeCenter }}>
      <Container  maxWidth="md" >
        <Paper sx={{ background: "grey", p: 2,my:5 }}>
          
          <Grid container spacing={3} sx={{ justifyContent: "center" }}>
            <Grid item xs={8} sm={4}>
              <Stack sx={{ width: "100%", height: "100%",alignItems: 'center' }}>
                
                {profilePreview.length !== 0 ? (
                  <img
                    src={profilePreview}
                    width="175px"
                    height="175px"
                    style={{ borderRadius: "50%",objectFit:'cover' }}
                    alt="user-profile"
                  />
                ) : (
                  <img
                    src={user.photoURL !== null ? (user?.photoURL):(noUserPhoto)}
                    width="175px"
                    height="175px"
                    style={{ borderRadius: "50%",objectFit:'cover' }}
                    alt="user-profile"
                  />
                )}
                <Button
                  component="label"
                  role={undefined}
                  variant="contained"
                  tabIndex={-1}
                  size="small"
                  startIcon={<MdCloudUpload />}
                  sx={{mt:1}}
                >
                  Upload file
                  <VisuallyHiddenInput
                    type="file"
                    // value={imageFile}
                    onChange={fileUpload}
                  />
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={8}>
              <Paper sx={{ p: 3 }}>
                <Stack spacing={1.5}>
                  <TextField
                    onChange={(e) => setUserName(e.target.value)}
                    value={userName}
                    size="small"
                    name="user"
                    label="User Name"
                  />
                  <TextField
                    onChange={(e) => setPhoneNo(e.target.value)}
                    type="number"
                    value={phoneNo}
                    size="small"
                    name="phoneNo"
                    label="Phone No"
                  />
                  <TextField
                    size="small"
                    name="email"
                    label="Email"
                    value={user.email}
                    disabled
                  />
                  <Box sx={{ textAlign: "end" }}>
                    <Button variant="contained" onClick={updateProfile}>
                      Update Profile
                    </Button>
                  </Box>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
          
        </Paper>
        </Container>
     
    </Box>
  );
};

export default EditProfile;
