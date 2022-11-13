/* eslint-disable react/jsx-no-useless-fragment */
import React, { useContext, useState } from "react";
import styles from "./Login.module.scss";
import { Link, Navigate, useNavigate } from "react-router-dom";
import AuthContext from "../../contexts/AuthContext";
import { ReactComponent as EyeOff } from "../../assets/eye-off.svg";
import { ReactComponent as EyeOpen } from "../../assets/eye open.svg";
import Loader from "../../components/loader/loader";

import axios from "axios";

const Login = () => {
  const [showPassword, setShowPassword] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(0);
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = () => {
    setLoading(true);
    var config = {
      method: "post",
      url: `${process.env.REACT_APP_SERVER_URL}/v1/logIn`,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        email: email,
        password: password,
      },
    };

    axios(config)
      .then(function (response) {
        if (response?.data?.token != null || response?.data?.token !== "") {
          login(response?.data?.accessToken);
          navigate("/home");
          setLoading(false);
        }
      })
      .catch(function (error) {
        setLoading(false);
        alert(error.response.data);
      });
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.main}>
        <div className={styles.main_title}>Sign In</div>
        <div className={styles.main_form}>
          <div className={styles.main_form_head}>Email</div>
          <div className={styles.main_form_input}>
            <input
              type="text"
              placeholder="Email"
              name="username"
              id="username"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className={styles.main_form_head}>Password</div>
          <div className={styles.main_form_input}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              name="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
            />
            {showPassword ? (
              <EyeOff
                onClick={() => setShowPassword(0)}
                className={styles.showPasswordIcon}
              />
            ) : (
              <EyeOpen
                onClick={() => setShowPassword(1)}
                className={styles.showPasswordIcon}
              />
            )}
          </div>
          <div className={styles.main_form_extra}>
            <div className={styles.main_form_extra_remember}>
              <input
                type="checkbox"
                name="remember_me"
                id="remember_me"
                onClick={() => setRemember(remember ? 0 : 1)}
              />
              <label htmlFor="remember_me" className={styles.remember_me}>
                Remember me
              </label>
            </div>
            <Link to="/login" className={styles.main_form_extra_forget}>
              Forgot password?
            </Link>
          </div>
        </div>
        <div
          className={styles.main_button}
          onClick={() => {
            handleLogin();
            // console.log("clicked");
          }}
        >
          {loading ? <Loader /> : "Sign In"}
        </div>
      </div>
    </div>
  );
};

export default Login;
