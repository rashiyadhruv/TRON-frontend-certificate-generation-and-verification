import React, {useReducer } from "react";

const AuthContext = React.createContext();

const initialState = {
  isAuthenticated: localStorage.getItem("token") ? true : false,
  token: localStorage.getItem("token"),
};

const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("loggedin", true);
      return {
        ...state,
        isAuthenticated: true,
        token: action.payload.token,
      };
    case "LOGOUT":
      localStorage.clear();
      return {
        ...state,
        isAuthenticated: false,
        token: null,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const logout = () => {
    dispatch({
      type: "LOGOUT",
    });
  };

  const login = async (token) => {
    dispatch({
      type: "LOGIN",
      payload: {
        token,
      },
    });
  };

  return (
    <AuthContext.Provider value={{ authState: state, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
