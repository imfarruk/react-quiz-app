
import './App.css';
import { useEffect } from 'react';
import {getDatabase, ref, set} from "firebase/database";
import {app} from './firebase/firebase';
import {getAuth} from "firebase/auth";
//redux
import { PersistGate } from 'redux-persist/integration/react'
import store,{Persistor} from "./store/configurePersist";
import {Provider, useDispatch} from "react-redux";
import { loadUser } from "./store/actions/authAction";

import {Routes,Route} from 'react-router-dom';
import {Box} from '@mui/material'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//import components
import Home from './components/Home';
import Navbar from './components/Navbar'; 
import Login from './components/Login';
import Signup from './components/Signup';
import Quiz from './components/Quiz';
import CreateQuiz from './components/CreateQuiz';
import QuizSubCard from './components/QuizSubCard';
import Profile from './components/Profile';
import {readSubjectWiseQuiz} from "./store/actions/createQuiz"



function App() {
  useEffect(()=>{
    store.dispatch(loadUser());
    store.dispatch(readSubjectWiseQuiz());
  },[])

  
  return (
    <>
     <Provider store={store}>
      <PersistGate loading={null} persistor={Persistor}>
    <Navbar/>
   
    <Box sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        minHeight: "calc(100vh - 120px)",
        background:'#E2AD8D'
      }}>
      <Routes>
        <Route exact path='/' element={<Home/>}/>
        <Route exact path='/signup' element={<Signup/>}/>
        <Route exact path='/login' element={<Login/>}/>
        <Route exact path='/quiz' element={<Quiz/>}/>
        <Route exact path='/create-quiz' element={<CreateQuiz/>}/>
        <Route exact path='/quiz-test/:sub' element={<QuizSubCard/>}/>
        <Route exact path='/profile' element={<Profile/>}/>
      </Routes>
       {/* <div><button onClick={putData}>Put data</button></div> */}
    </Box>
    <ToastContainer/>
    </PersistGate>
    </Provider>
    </>
  );
}

export default App;
