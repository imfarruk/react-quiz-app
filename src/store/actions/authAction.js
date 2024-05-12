import { LOGIN,LOGOUT,USER_LOADED,} from "./index";
import { toast } from "react-toastify";
import {app} from "../../firebase/firebase";
import { getAuth, signInWithEmailAndPassword ,onAuthStateChanged,signOut } from "firebase/auth";

const auth = getAuth(app);

const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

export const userLogin = (userObj) => async (dispatch) => {
    const body = Number(userObj.password)
     signInWithEmailAndPassword(auth, userObj.email,body).then((userCredential) => {
          // Signed in 
          toast.success('user')
        //   setEmail("");
        //   setPassword("");
        dispatch({
            type: LOGIN,
            payload: userCredential.user,
          });
             return userCredential;
        })
    // try {
     
    //   dispatch(loadUser());
   
  };

export const logoutUser = () => async (dispatch) => {
  signOut(auth).then((res) => {
    
    dispatch({
      type: LOGOUT,
    });
    toast.success("logout success");
    return res;
  }).catch((error) => {
    toast.error(error.code)
  });
    
  };

  // Load User
export const loadUser = () => async (dispatch) => {
  onAuthStateChanged(auth,(user) => {
    if(user){
      dispatch({
        type: USER_LOADED,
        payload: user,
      });
    }else{
      console.log('user error');
    }
  })
    // const userId = {
    //   id: localStorage.getItem("quizAppToken"),
    // };
    // try {
    //   dispatch({
    //     type: USER_LOADED,
    //     payload: userId,
    //   });
    // //   return res;
    // } catch (error) {
    //   console.log('fail');
    // }
  };


