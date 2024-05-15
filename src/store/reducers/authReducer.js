import { LOGIN, LOGOUT, USER_LOADED } from "../actions/index";

const initialState = {
  isAuthenticated: false,
  loading: true,
  token: "",
  user: {},
};

const authReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case LOGIN:
      localStorage.setItem("quizAppToken", payload.token);
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload,
      };
    case LOGOUT:
      localStorage.removeItem("quizAppToken");
      return {
        ...state,
        isAuthenticated: false,
        loading: false,
        token: "",
        user: null,
      };
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: payload.token ? true : false,
        loading: false,
        token: payload.token,
        user: payload,
      };
    default:
      return state;
  }
};

export default authReducer;
