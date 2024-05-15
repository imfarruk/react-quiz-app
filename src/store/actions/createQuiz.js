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
  addDoc(collection(firestore, dbName), data)
    .then((data) => {
      return data;
    })
    .catch((error) => {
      return error;
    });
  //    return resultRes
};

export const readQuizQuestion = (sub, level) => async (dispatch) => {
  const collectionRef = collection(firestore, dbName);
  const q = query(
    collectionRef,
    where("subject", "==", sub),
    where("level", "==", level)
  );
  const docRes = await getDocs(q);
  let resArray = [];
  docRes.forEach((data) => resArray.push(data));
  return resArray;
};

export const readSubjectWiseQuiz = (data) => async (dispatch) => {
  let resArray = [];
  const querySnapshot = await getDocs(collection(firestore, dbName));
  querySnapshot.forEach((doc) => {
    resArray.push(doc.data());
    return resArray;
  });
};

export const getQuizById = async (id) => {
  const docRef = doc(firestore, dbName, id);
  const result = await getDoc(docRef);
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
  if(data === null){
    return false
  }
  try {
    const result = await addDoc(
      collection(firestore, `${dbUser}/${auth?.currentUser.uid}/userResult`),
      data
    );
    localStorage.removeItem("unsavedQuizResult")
    return "Data saved";
  } catch (error) {
    toast.error(error.message);
  }
};
