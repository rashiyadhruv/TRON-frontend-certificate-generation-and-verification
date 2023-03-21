import React, { useContext } from "react";
import styles from "./Navbar.module.scss";
import { ReactComponent as Logout } from "../../assets/logout.svg";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../contexts/AuthContext";

const Navbar = () => {
  const isloggedin = localStorage.getItem("loggedin");
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  return (
    <div className={styles.navbar}>
      <div
        className={styles.logo}
        onClick={() => {
          navigate("/");
        }}
      >
        Home
      </div>
      <div className={styles.user}>
        {isloggedin === "true" ? (
          <>
            <span>
              {" "}
              Welcome! <span className={styles.userText}>Admin</span>
            </span>
            <Logout
              onClick={() => {
                logout();
                navigate("/home");
              }}
            />
          </>
        ) : null}
      </div>
    </div>
  );
};

export default Navbar;
