import { CREATE_QUIZ } from "./index";

import { toast } from "react-toastify";
import { app } from "../../firebase/firebase";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import { update } from "firebase/database";
import { getAuth } from "firebase/auth";

const dbName = "itsme";
const dbUser = "quiz-users";
const dbSubject = "quiz-subjects";

const auth = getAuth(app);
const firestore = getFirestore(app);

export const createQuizQuestion = (data) => async (dispatch) => {
  console.log("inside create quiz", data);
  addDoc(collection(firestore, dbName), data)
    .then((data) => {
      console.log("resultResdata", data);
      // dispatch({
      //     type:CREATE_QUIZ,
      //     payload:'Created successfully'
      // })
      return data;
    })
    .catch((error) => {
      return error;
    });
  //    console.log('resultRes',resultRes);
  //    return resultRes
};

export const readQuizQuestion = (sub, level) => async (dispatch) => {
  console.log("data", sub);
  const collectionRef = collection(firestore, dbName);
  const q = query(
    collectionRef,
    where("subject", "==", sub),
    where("level", "==", level)
  );
  const docRes = await getDocs(q);
  let resArray = [];
  docRes.forEach((data) => resArray.push(data));
  console.log(resArray, "resArray", docRes, q);
  return resArray;
};

export const readSubjectWiseQuiz = (data) => async (dispatch) => {
  console.log(data);
  let resArray = [];
  const querySnapshot = await getDocs(collection(firestore, dbName));
  querySnapshot.forEach((doc) => {
    resArray.push(doc.data());
    // doc.data() is never undefined for query doc snapshots
    // console.log(doc.id, " => ", doc.data());
    return resArray;
  });
};

export const getQuizById = async (id) => {
  const docRef = doc(firestore, dbName, id);
  const result = await getDoc(docRef);
  console.log(id, "id", result.data(), docRef);
  return result.data();
};

export const updateQuiz = async (id, data) => {
  try {
    const washingtonRef = doc(firestore, dbName, id);
    const updateRes = await updateDoc(washingtonRef, data);
    return "updated";
  } catch (error) {
    toast.error(error);
  }
};

export const quizSubjects = async () => {
  try {
    let resArray = [];
    const querySnapshot = await getDocs(collection(firestore, dbSubject));
    querySnapshot.forEach((doc) => {
      resArray.push(doc.data());
    });
    return resArray;
  } catch (error) {
    console.log(error);
  }
};

export const saveResultTodb = async () => {
  const text = localStorage.getItem("unsavedQuizResult");
  const data = JSON.parse(text);
  try {
    const result = await addDoc(
      collection(firestore, `${dbUser}/${auth?.currentUser.uid}/userResult`),
      data
    );
    // const userRef = doc(firestore, dbUser, auth?.currentUser.uid);
    // await setDoc(userRef, "userResult", data);
    console.log(result, "result-savedb");
    localStorage.removeItem("unsavedQuizResult")
    return "Data saved";
  } catch (error) {
    console.log(error);
  }
};
