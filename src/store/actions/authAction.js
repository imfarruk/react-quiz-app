import { LOGIN, LOGOUT, USER_LOADED,USER_DETAILS } from "./index";
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
import {
  getFirestore,
  getDoc,
  doc,
  setDoc,
  getDocs,
  collection,
} from "firebase/firestore";

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
      console.log("user not found");
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

export const updateUserProfile = async (value, id) => {
  // Update other user data like phone no to firestore.
  const userRef = doc(firestore, userDB, id);
  try {
    // Set the document with merge option
    await setDoc(
      userRef,
      {
        displayName: value.displayName,
        photoURL: value.photoURL,
        phoneNumber: value.phoneNumber,
        uid: value.uid,
        role: "user",
        email: auth.currentUser.email,
      },
      { merge: true }
    );
  } catch (error) {
    toast.error(error.message);
  }
};

export const uploadProfilePhoto = async (file, value, id) => {
  try {
    // Upload file to Firebase Storage
    if (file) {
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
      await setDoc(
        userRef,
        {
          displayName: auth.currentUser.displayName,
          photoURL: auth.currentUser.photoURL,
          phoneNumber: value.phoneNumber,
          uid: auth.currentUser.uid,
          role: value?.role || "user",
          email: auth.currentUser.email,
        },
        { merge: true }
      );
    } else {
      await updateProfile(auth.currentUser, {
        displayName: value.displayName,
      });
      const userRef = doc(firestore, userDB, auth.currentUser.uid);

      // Set the document with merge option
      await setDoc(
        userRef,
        {
          displayName: auth.currentUser.displayName,
          photoURL: auth.currentUser.photoURL,
          phoneNumber: value.phoneNumber,
          uid: auth.currentUser.uid,
          role: value?.role || "user",
          email: auth.currentUser.email,
        },
        { merge: true }
      );
    }
  } catch (error) {
    return error;
  }
};

export const userDetails =(id) => async(dispatch)=>{
  try{
  let resArray = [];
  const docRef = await doc(firestore, userDB, id);
  const result = await getDoc(docRef);
  const querySnapshot = await getDocs(
    collection(firestore, userDB, id, "userResult")
  );
  querySnapshot.forEach((doc) => {
    resArray.push(doc.data());
  });
  let val = result.data();
  let data = {
    ...val,
    userResult: resArray,
  };
  // console.log(data,'dataa');
  dispatch({
    type: USER_DETAILS,
    payload: data,
  });

  return data;
}catch(error){
  toast.error(error)
}
};
