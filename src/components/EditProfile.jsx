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
import {updateUserProfile,uploadProfilePhoto,userDetails} from "../store/actions/authAction";
import { toast } from "react-toastify";

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
  const [userName, setUserName] = useState(user?.displayName)
  const [phoneNo, setPhoneNo] = useState(user?.phoneNumber)
  const [userId,setUserId] = useState(user.uid)
  const [imageFile, setImageFile] = useState("");
  const [profilePreview, setProfilePreview] = useState("");
  const [fileChange , setFileChange] = useState(false)
  const [userDetail,setUserDetail] = useState({})

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      navigate("/");
    }
    userDetails().then((data)=>{
      // console.log(data,'data');
      setUserDetail(data)
    })
  }, []);


  const updateProfile = () => {
    const data = {
      displayName:userName,
      phoneNumber:phoneNo,
      photoURL:imageFile,
      userId:userId
    }
    fileChange && (
      uploadProfilePhoto(imageFile,data).then((datas) => {
       
      })
      .catch((error) => {
        toast.error(error.message)
      })
    )

    updateUserProfile(data).then((datas) => {
      toast.success('user details updated successfully')
      navigate('/profile')
    })
    .catch((error) => {
     toast.error(error.message)
    });
   
  };

  const fileUpload = (e) => {
    setFileChange(true)
    let files = e.target.files[0];
    setImageFile(files);
    setProfilePreview(URL.createObjectURL(files));
  };
  return (
    <Box sx={{ ...homeCenter }}>
      <Stack>
        <Paper maxWidth="md" sx={{ background: "grey", p: 2 }}>
          <Grid container spacing={3} sx={{ justifyContent: "center" }}>
            <Grid item xs={8} sm={4}>
              <Box sx={{ width: "100%", height: "100%" }}>
                {profilePreview.length !== 0 ? (
                  <img
                    src={profilePreview}
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
                <Button
                  component="label"
                  role={undefined}
                  variant="contained"
                  tabIndex={-1}
                  size="small"
                  startIcon={<MdCloudUpload />}
                >
                  Upload file
                  <VisuallyHiddenInput
                    type="file"
                    // value={imageFile}
                    onChange={fileUpload}
                  />
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} sm={8}>
              <Paper sx={{ p: 2 }}>
                <Stack spacing={1}>
                  <TextField onChange={(e)=>setUserName(e.target.value)} value={userName} size="small" name="user" label="User Name" />
                  <TextField onChange={(e)=>setPhoneNo(e.target.value)} type="number" value={userDetail?.phoneNumber} size="small" name="phoneNo" label="Phone No" />
                  <TextField size="small" name="email" label="Email" value={user.email} disabled />
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
      </Stack>
    </Box>
  );
};

export default EditProfile;
