/* eslint-disable react/jsx-no-useless-fragment */
import React, { useRef, useState } from "react";
import styles from "./Download.module.scss";

import Loader from "../../components/loader/loader";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../../components/Navbar/Navbar";
import Vercert from "./components/Vercert/Vercert";
import axios from "axios";

const Download = () => {
  const [cid, setcid] = useState("");
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [imglink, setImglink] = useState();
  const toastId = useRef(null);

  const notify = () => {
    toastId.current = toast.error("Invalid ID", {
      autoClose: 4000,
      position: "top-right",
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      theme: "light",
    });
  };

  // calls

  const handledownload = () => {
    setLoading(true);
    var config = {
      method: "post",
      url: `${process.env.REACT_APP_SERVER_URL}/v1/download`,
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${authState.token}`,
      },
      data: {
        id: cid,
      },
    };

    axios(config)
      .then(function (response) {
        if (response?.data?.link === "e") {
          notify();
          setLoading(false);
        } else {
          setImglink(response?.data?.link);
          setLoading(false);
          setStep(1);
        }
      })
      .catch(function (error) {
        // console.log(error);
        notify();
        setLoading(false);
      });
  };

  //

  return (
    <div className={styles.wrapper}>
      <Navbar />
      <div className={styles.con}>
        <div className={styles.head}>Download the certificate</div>
        {step === 0 ? (
          <>
            {" "}
            <div className={styles.main}>
              {/* <div className={styles.main_select}>
              Select From Device <Gallery />
            </div> */}
              {/* <div className={styles.main_or}>Or</div> */}
              <div className={styles.main_cid}>
                <div className={styles.main_cid_head}>Certificate ID</div>
                <input
                  type="text"
                  placeholder=""
                  name="cid"
                  id="cid"
                  onChange={(e) => setcid(e.target.value)}
                />
              </div>
              <div
                className={styles.main_verify}
                onClick={() => {
                  handledownload();
                }}
              >
                {loading ? <Loader /> : "Verify"}
              </div>
            </div>
          </>
        ) : (
          <Vercert imglink={imglink} />
        )}
      </div>
      <div className={styles.space}></div>
      <ToastContainer />
    </div>
  );
};

export default Download;
