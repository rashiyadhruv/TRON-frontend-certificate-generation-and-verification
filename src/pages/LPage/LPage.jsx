// import React, { useContext } from "react";
import styles from "./LPage.module.scss";
import { ReactComponent as Right } from "../../assets/right.svg";
import { ReactComponent as Ill1 } from "../../assets/ill1.svg";
import { ReactComponent as Ill2 } from "../../assets/ill2.svg";
import { ReactComponent as Logout } from "../../assets/logout.svg";
import image from "../../assets/image.png";
import { Link } from "react-router-dom";
import React, { useContext } from "react";
import AuthContext from "../../contexts/AuthContext";

const LPage = () => {
  const token = localStorage.getItem("token");
  const loggedin = localStorage.getItem("loggedin");
  const { logout } = useContext(AuthContext);

  return (
    <div className={styles.lpage}>
      {/* <Bookmark/> */}
      {loggedin === "true" ? (
        <div className={styles.topBar}>
          <Logout
            onClick={() => {
              logout();
            }}
          />
        </div>
      ) : (
        <div className={styles.topBar}></div>
      )}
      <div className={styles.container}>
        {token !== null && loggedin === "true" ? (
          <div className={styles.left}>
            <div className={styles.innerLeft}>
              <Ill1 />
            </div>

            <div className={styles.innerRight}>
              <div className={styles.heading}>Generate Certificate</div>
              <div className={styles.text}>
                Generate any number of custom certificates in batches using your
                own template
              </div>
              <div className={styles.buttonLeft}>
                <Link className={styles.link} to="/generate">
                  Click to generate
                </Link>{" "}
                <Right />
              </div>
            </div>
          </div>
        ) : null}

        <div className={styles.right}>
          <div className={styles.innerLeft}>
            <img className={styles.image} src={image} alt="Illustration" />
          </div>
          <div className={styles.innerRight}>
            <div className={styles.heading}>Verify Certificate</div>
            <div className={styles.text}>
              Verify certificates at the click of a button.
            </div>
            <div className={styles.buttonLeft}>
              {" "}
              <Link className={styles.link} to="/Verify">
                Click to verify
              </Link>{" "}
              <Right />
            </div>
          </div>
        </div>

        <div className={styles.left}>
          <div className={styles.innerLeft}>
            <Ill2 />
          </div>
          <div className={styles.innerRight}>
            <div className={styles.heading}>Download Certificate</div>
            <div className={styles.text}>
              Download your certificate just by entering your CID.
            </div>
            <div className={styles.buttonLeft2}>
              <Link className={styles.link} to="/download">
                Click to download
              </Link>{" "}
              <Right />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.bottom}>
        Made with <span>❤</span> by <div className={styles.name}>Pynodes</div>
      </div>
    </div>
  );
};

export default LPage;
