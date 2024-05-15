import { useEffect } from "react";
import { app } from "./firebase/firebase";
import { getAuth } from "firebase/auth";
//redux
import { PersistGate } from "redux-persist/integration/react";
import store, { Persistor } from "./store/configurePersist";
import { Provider } from "react-redux";
import { loadUser } from "./store/actions/authAction";

import { Routes, Route } from "react-router-dom";
import { Paper } from "@mui/material";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//import components
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Quiz from "./components/Quiz";
import CreateQuiz from "./components/CreateQuiz";
import Profile from "./components/Profile";
import { readSubjectWiseQuiz } from "./store/actions/createQuiz";
import EditQuizCard from "./components/editQuizCard";
import EditProfile from "./components/EditProfile";

function App() {
  useEffect(() => {
    store.dispatch(loadUser());
    store.dispatch(readSubjectWiseQuiz());
  }, []);

  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={Persistor}>
          <Navbar />

          <Paper
            variant="square"
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              minHeight: "calc(100vh - 20vh)",
              background: "#e3e3e3",
            }}
          >
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route exact path="/signup" element={<Signup />} />
              <Route exact path="/login" element={<Login />} />
              <Route exact path="/quiz" element={<Quiz />} />
              <Route exact path="/create-quiz" element={<CreateQuiz />} />
              <Route exact path="/profile" element={<Profile />} />
              <Route exact path="/edit-quiz/:id" element={<EditQuizCard />} />
              <Route exact path="/edit-profile" element={<EditProfile />} />
            </Routes>

          </Paper>
          <ToastContainer />
        </PersistGate>
      </Provider>
    </>
  );
}

export default App;
