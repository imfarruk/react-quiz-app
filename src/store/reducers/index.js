
import { combineReducers } from "redux";
import authReducer from "./authReducer";
import createQuizReducer from "./createQuizReducer";

export default combineReducers({
    auth: authReducer,
    quizData: createQuizReducer,
});