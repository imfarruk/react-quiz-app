import { LOGIN,LOGOUT,USER_LOADED,} from "./index";
import { toast } from "react-toastify";
import {app} from "../../firebase/firebase";
import { getAuth,updateProfile ,updatePhoneNumber , signInWithEmailAndPassword ,onAuthStateChanged,signOut,GoogleAuthProvider,signInWithPopup, createUserWithEmailAndPassword } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore,collection,
  addDoc,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  setDoc, } from "firebase/firestore";

const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const storage = getStorage();
const firestore = getFirestore(app);

const userDB = "quiz-users"
const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

export const userLogin = (userObj) => async (dispatch) => {
    const pwd = Number(userObj.password)
     signInWithEmailAndPassword(auth, userObj.email,pwd).then((userCredential) => {
          // Signed in 
          console.log(userCredential,'userCredential');
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

  export const signupWithEmailPwd = (email,password) => {
    createUserWithEmailAndPassword(auth,
        email, password).then((value) => {
            toast.success('signup success', value);
            console.log(value,'value');
            return 'success'
        }).catch((error) => { 
          toast.error(error.code)
          console.log(error.code); 
          return error
        })

}
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
  };

  export const userSignInWIthGoogleThirdParty = () => async(dispatch)=>{
    signInWithPopup(auth,provider).then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        // console.log(result,'34',credential);
        dispatch({
            type: LOGIN,
            payload: result.user,
        });
        const token = credential.accessToken;
        const user = result.user.providerData[0];
        return "login success"

        // ...
      }).catch((error) => {
        toast.error(error.code)
     
      });
}


export const updateUserProfile = async(value) => {
   // Update other user data like phone no to firestore.
   const userRef = doc(firestore, userDB, auth.currentUser.uid);
   try {
    // Set the document with merge option
    await setDoc(userRef, {
      displayName:auth.currentUser.displayName,
    photoURL:auth.currentUser.photoURL,
    phoneNumber:value.phoneNumber,
    uid:auth.currentUser.uid,
    }, { merge: true });
    console.log('User document updated successfully!',);
  } catch (error) {
    console.error('Error updating user document:', error);
  }
}

export const uploadProfilePhoto = async (file,value) => {
  try {
    // Upload file to Firebase Storage
    const storageRef = ref(storage, `profilePhotos/${auth.currentUser.uid}`);
    await uploadBytes(storageRef, file);

    // Get download URL of the uploaded file
    const downloadURL = await getDownloadURL(storageRef);

    // Update user profile with the image URL
    await updateProfile(auth.currentUser, {
      photoURL: downloadURL,
      displayName: value.displayName,
    });

  } catch (error) {
    return error
  }
};

export const userDetails = async()=>{
  console.log(auth.currentUser.uid,'auth.currentUser.uid')
  const docRef =  doc(firestore,userDB,auth.currentUser.uid);
  const result = await getDoc(docRef)
  console.log(auth.currentUser.uid,'id',result.data(),docRef);
  return result.data()
}