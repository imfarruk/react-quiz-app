import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyC8vPiwg-DQHMhquzNcjQ7pSUYgcxj7DL4",
    authDomain: "quiz-app-87d25.firebaseapp.com",
    projectId: "quiz-app-87d25",
    storageBucket: "quiz-app-87d25.appspot.com",
    messagingSenderId: "38205931918",
    appId: "1:38205931918:web:f2d2e00fc6fdfe1a35e4df",
    databaseURL:"https://quiz-app-87d25-default-rtdb.firebaseio.com/"
  };

  export const app = initializeApp(firebaseConfig);