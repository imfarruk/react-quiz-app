import {USER_DETAILS} from '../actions/index';

const initialState={
    userDetail:{},
    response:"",
    userLoading:true
}

 const createQuizReducer =(state =initialState,action)=>{
    const { type, payload } = action;
    switch (type) {
        case USER_DETAILS:
            console.log(payload,'createttett');
           return {
            ...state,
            userDetail:payload,
            userLoading:false
           };
        default:
            return state;
        }
    
}

export default createQuizReducer;