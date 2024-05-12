import { LOGIN, LOGOUT,USER_LOADED } from "../actions/index";

const initialState = {
    isAuthenticated: false,
    loading: true,
    token:'',
    user: {},
  };

const authReducer = (state = initialState,action)=>{
    const { type, payload } = action;
    switch (type) {
        case LOGIN:
            console.log(payload,'payload',payload);
            // const data={payload.providerData

            // }
          localStorage.setItem("quizAppToken", payload.accessToken);
        //   localStorage.setItem("quizUser", payload.user._id);
          return {
            ...state,
            isAuthenticated: true,
            loading: false,
            user: payload.providerData[0],
          };
        case LOGOUT:
          localStorage.removeItem("quizAppToken");
          return {
            ...state,
            isAuthenticated: false,
            loading: false,
            token:"",
            user: null,
          };
          case USER_LOADED:

            return {
              ...state,
              isAuthenticated: payload.accessToken ? true : false,
              loading: false,
              token:payload.accessToken,
              user:payload.providerData[0]
            };
          default:
            return state;
        }
}

export default authReducer;