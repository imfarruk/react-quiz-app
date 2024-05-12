import {CREATE_QUIZ} from '../actions/index';

const initialState={
    quizData:{},
    response:"",
    loading:true
}

 const createQuizReducer =(state =initialState,action)=>{
    const { type, payload } = action;
    switch (type) {
        case CREATE_QUIZ:
            console.log(payload,'createttett');
           return {
            ...state,
            response:payload,
            loading:false
           };
        default:
            return state;
        }
    
}

export default createQuizReducer;