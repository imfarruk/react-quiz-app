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
} from "firebase/firestore";

const firestore = getFirestore(app);

export const createQuizQuestion = (data) => async (dispatch) => {
  console.log("inside create quiz", data);
  addDoc(collection(firestore, "itsme"), data)
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

export const readQuizQuestion = (sub,level) => async (dispatch) => {
  console.log("data", sub);
  const collectionRef = collection(firestore, "itsme");
  const q = query(collectionRef, where("subject", "==", sub), where("level", "==",level));
  const docRes = await getDocs(q);
  let resArray = [];
  docRes.forEach((data) => resArray.push(data.data()));
  console.log(resArray, "resArray");
  return resArray;
};

export const readSubjectWiseQuiz = (data) => async (dispatch) => {
  console.log(data);
  let resArray = [];
  const querySnapshot = await getDocs(collection(firestore, "itsme"));
  querySnapshot.forEach((doc) => {
    resArray.push(doc.data());
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
    return resArray;
  });
};
