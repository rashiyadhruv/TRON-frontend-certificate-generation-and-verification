/* eslint-disable react/jsx-no-useless-fragment */
import React, { useRef, useState } from "react";
import styles from "./Verify.module.scss";

import Loader from "../../components/loader/loader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Vercert from "./components/Vercert/Vercert";
import Navbar from "../../components/Navbar/Navbar";
import axios from "axios";
// import { upload } from "@testing-library/user-event/dist/upload";

const Verify = () => {
  const [cid, setcid] = useState("");
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [imglink, setImglink] = useState();
  const toastId = useRef(null);

  const notify = () => {
    toastId.current = toast("Verifying...", {
      autoClose: 10000,
      position: "top-right",
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      theme: "light",
    });
  };

  const update = () => {
    toast.update(toastId.current, {
      render: "Invalid ID",
      type: toast.TYPE.ERROR,
      autoClose: 4000,
    });
  };
  // calls

  const handleverify = () => {
    notify();

    setLoading(true);
    var config = {
      method: "post",
      url: `${process.env.REACT_APP_SERVER_URL}/v1/verify`,
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
        setImglink(response?.data?.link);
        setLoading(false);
        setStep(1);
      })
      .catch(function (error) {
        // console.log(error);
        update();
        setLoading(false);
      });
  };

  //

  return (
    <div className={styles.wrapper}>
      <Navbar />
      <div className={styles.con}>
        <div className={styles.head}>Verify the Certificate</div>
        {step === 0 ? (
          <>
            {" "}
            <div className={styles.main}>
              {/* <div className={styles.main_select}>
              Select From Device <Gallery />
            </div>
            <div className={styles.main_or}>Or</div> */}
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
                  handleverify();
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

export default Verify;
