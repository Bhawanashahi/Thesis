const initialState = {
  user: null
};

const LOGIN = "LOGIN";
const LOGOUT = "LOGOUT";

export default (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload };
    case "LOGOUT":
      return { ...state, user: null };
    default:
      return state;
  }
};

export const login = userInfo => {
  return {
    type: LOGIN,
    payload: userInfo
  };
};
export const logout = () => {
  return {
    type: LOGOUT
  };
};
