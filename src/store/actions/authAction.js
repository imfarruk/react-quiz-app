import { LOGIN, LOGOUT, USER_LOADED } from "./index";
import { toast } from "react-toastify";
import { app } from "../../firebase/firebase";
import {
  getAuth,
  updateProfile,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, getDoc, doc, setDoc, getDocs, collection } from "firebase/firestore";

const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const storage = getStorage();
const firestore = getFirestore(app);

const userDB = "quiz-users";

export const userLogin = (userObj) => async (dispatch) => {
  const pwd = Number(userObj.password);
  signInWithEmailAndPassword(auth, userObj.email, pwd).then(
    (userCredential) => {
      // Signed in
      console.log(userCredential, "userCredential");
      dispatch({
        type: LOGIN,
        payload: userCredential.user,
      });
      toast.success("user");
      return userCredential;
    }
  );
};

export const signupWithEmailPwd = (email, password) => {
  createUserWithEmailAndPassword(auth, email, password)
    .then((value) => {
      toast.success("signup success", value);
      console.log(value, "value");
      return "success";
    })
    .catch((error) => {
      toast.error(error.code);
      return error;
    });
};
export const logoutUser = () => async (dispatch) => {
  signOut(auth)
    .then((res) => {
      dispatch({
        type: LOGOUT,
      });
      toast.success("logout success");
      return res;
    })
    .catch((error) => {
      toast.error(error.code);
    });
};

// Load User
export const loadUser = () => async (dispatch) => {
  onAuthStateChanged(auth, (user) => {
    console.log(user,'user-action');
    const users = {
      token: user?.accessToken,
      displayName: user?.displayName,
      email: user?.email,
      phoneNumber: user?.phoneNumber,
      photoURL: user?.photoURL,
      uid: user?.uid,
    };
    if (user) {
      dispatch({
        type: USER_LOADED,
        payload: users,
      });
    } else {
      console.log("user error");
    }
  });
};

export const userSignInWIthGoogleThirdParty = () => async (dispatch) => {
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
      // ...
    })
    .catch((error) => {
      toast.error(error.code);
    });
};

export const updateUserProfile = async (value,id) => {
  // Update other user data like phone no to firestore.
  const userRef = doc(firestore, userDB, id);
  try {
    // Set the document with merge option
    console.log(value,'update-user',userRef);
    await setDoc(
      userRef,
      {
        displayName: value.displayName,
        photoURL: value.photoURL,
        phoneNumber: value.phoneNumber,
        uid: value.uid,
      },
      { merge: true }
    );
    // console.log("User document updated successfully!");
  } catch (error) {
    // console.error("Error updating user document:", error);
  }
};

export const uploadProfilePhoto = async (file, value,id) =>  {
  try {
    // Upload file to Firebase Storage
    if(file){
      const storageRef = ref(storage, `profilePhotos/${id}`);
      await uploadBytes(storageRef, file);
  
      // Get download URL of the uploaded file
      const downloadURL = await getDownloadURL(storageRef);
      await updateProfile(auth.currentUser, {
        photoURL: downloadURL,
        displayName: value.displayName,
      });

      const userRef = doc(firestore, userDB, auth.currentUser.uid);
  
      // Set the document with merge option
      await setDoc(userRef, {
      displayName:auth.currentUser.displayName,
      photoURL:auth.currentUser.photoURL,
      phoneNumber:value.phoneNumber,
      uid:auth.currentUser.uid,
      }, { merge: true });
      console.log('User document updated successfully!',);
    }else{
      await updateProfile(auth.currentUser, {
        displayName: value.displayName,
      });
      const userRef = doc(firestore, userDB, auth.currentUser.uid);
  
      // Set the document with merge option
      await setDoc(userRef, {
      displayName:auth.currentUser.displayName,
      photoURL:auth.currentUser.photoURL,
      phoneNumber:value.phoneNumber,
      uid:auth.currentUser.uid,
      }, { merge: true });
      console.log('User document updated successfully!',);

    }
    
    
    // Update user profile with the image URL
   

    // const userRef = doc(firestore, userDB, auth.currentUser.uid);
  
    //  // Set the document with merge option
    //  await setDoc(userRef, {
    //  displayName:auth.currentUser.displayName,
    //  photoURL:auth.currentUser.photoURL,
    //  phoneNumber:value.phoneNumber,
    //  uid:auth.currentUser.uid,
    //  }, { merge: true });
    //  console.log('User document updated successfully!',);

  } catch (error) {
    return error;
  }
};

export const userDetails = async (id) => {
  let resArray=[]
  const docRef = await doc(firestore, userDB, id);
  // const docRef2 = await doc(firestore, `${userDB}/${id}`,'userResult');
  const result = await getDoc(docRef);
  // const result2 = await getDoc(docRef2);
  const querySnapshot = await getDocs(collection(firestore, userDB, id, "userResult"));
querySnapshot.forEach((doc) => {
  // doc.data() is never undefined for query doc snapshots
  resArray.push(doc.data())
  console.log( doc.data());
})
let val= result.data()
let data = {
  ...val,
  userResult:resArray
}
  console.log(result,docRef,'redddd',resArray,data);
  return data;
};
