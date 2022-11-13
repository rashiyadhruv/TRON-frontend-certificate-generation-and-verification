import React, { useContext, useRef, useState } from "react";
import PlusIcon from "../../assets/PlusIcon";
import Navbar from "../../components/Navbar/Navbar";
import Slider from "../../components/Slider/Slider";
import styles from "./Home.module.scss";
import axios from "axios";

import AuthContext from "../../contexts/AuthContext";
import Loader from "../../components/loader/loader";

import { ReactComponent as Upload } from "../../assets/upload.svg";
import Canvas1 from "./components/Canvas1/Canvas1";
import Canvas2 from "./components/Canvas2/Canvas2";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
  const { authState } = useContext(AuthContext);
  const [coursename, setCoursename] = useState("BTEch");
  const [year, setYear] = useState("");
  const [template, setTemplate] = useState();
  const [csv, setCsv] = useState();
  const [loading, setLoading] = useState(false);
  const [templatename, setTemplatename] = useState("");
  const [csvname, setCsvname] = useState("");
  const [step, setStep] = useState(0);
  const [certs1, setCerts1] = useState([]);
  const [finalcerts1, setFinalcerts1] = useState([]);
  const [imgcids, setImgcids] = useState();
  const [dimensions, setDimensions] = useState({ height: 0, width: 0 });
  //functions
  const toastId = useRef(null);

  const notify = () => {
    toastId.current = toast.error("The Excel file is not in proper format.", {
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

  // on submit
  const onSubmit = () => {
    setLoading(true);
    if (coursename === "" || year === "" || csv === null || template === null) {
      notify();
      setLoading(false);
      return;
    }

    setLoading(true);

    var data = new FormData();
    data.append("file", csv);

    var config = {
      method: "post",
      url: `${process.env.REACT_APP_SERVER_URL}/v1/uploadExcel`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${authState.token}`,
      },

      data: data,
    };

    axios(config)
      .then(function (response) {
        if (
          Object.keys(response?.data?.certData[0]).length !==
          Object.values(response?.data?.certData[0]).length
        ) {
          notify();
          setLoading(false);
        } else {
          setCerts1(response?.data?.certData);
          setStep(2);
          setLoading(false);
        }
      })
      .catch(function (error) {
        // console.log(error.response.data);
        notify();
        setLoading(false);
      });
  };

  return (
    <div className={styles.home}>
      <Navbar />
      <div className={styles.container}>
        {step <= 1 ? (
          <>
            <div className={styles.containerLeft}>
              {step === 1 ? (
                <div className={styles.containerLeft_addnew}>
                  <div className={styles.containerLeft_addnew_head}>
                    Fill up the form and upload the required documents:
                  </div>
                  <div className={styles.form}>
                    <div className={styles.form_head}>
                      Education ( BTech / MTech ){" "}
                    </div>
                    <div className={styles.select}>
                      <select
                        type="dropdown"
                        placeholder="Enter Name"
                        name="Event name"
                        id="Event name"
                        onChange={(e) => setCoursename(e.target.value)}
                        required
                      >
                        <option value="Option 1">BTech</option>
                        <option value="Option 2">MTech</option>
                      </select>
                    </div>
                    <div className={styles.form_head}>Event Name</div>
                    <input
                      type="text"
                      placeholder="Enter event name"
                      name="Year"
                      id="Year"
                      onChange={(e) => setYear(e.target.value)}
                      required
                    />

                    <div className={styles.form_head}>
                      Upload certificate image
                    </div>
                    <input
                      type="file"
                      name="image"
                      accept="image/jpeg, image/png"
                      id="temp"
                      className={styles.temp}
                      onChange={(e) => {
                        let imgsize = e.target.files[0].size;
                        let imgUrl = URL.createObjectURL(e.target.files[0]);
                        var img = new Image();
                        img.src = imgUrl;
                        img.onload = () => {
                          if (img.width < 1750 && img.height < 1240) {
                            alert("Image dimensions are too small!");
                          } else if (imgsize > 9048576) {
                            alert("Image size is too large!");
                          } else {
                            setTemplate(img);
                            setTemplatename(e.target.files[0].name);
                          }
                        };
                      }}
                      required
                    />
                    <label className={styles.file_input__label} for="temp">
                      <Upload />
                      {templatename === "" ? "Add file" : templatename}
                    </label>
                    <div className={styles.form_head}>Upload Excel file</div>
                    <input
                      type="file"
                      name="csv"
                      accept=".csv,.xlsx"
                      id="csv"
                      className={styles.csv}
                      onChange={(e) => {
                        setCsv(e.target.files[0]);
                        setCsvname(e.target.files[0].name);
                      }}
                      required
                    />
                    <label className={styles.file_input__label} for="csv">
                      <Upload />
                      {csvname === "" ? "Add file" : csvname}
                    </label>
                  </div>
                  <div
                    className={styles.containerLeft_addnew_submit}
                    onClick={onSubmit}
                  >
                    {loading &&
                    !(
                      coursename === "" ||
                      year === "" ||
                      csv === null ||
                      template === null
                    ) ? (
                      <Loader />
                    ) : (
                      "Submit"
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <div className={styles.leftTop}>
                    <div
                      className={styles.start}
                      onClick={() => {
                        setStep(1);
                      }}
                    >
                      {/* <div className={styles.startButton}> */}
                      <PlusIcon />
                      {/* </div> */}
                      <div className={styles.startText}>
                        Click here to Start
                      </div>
                    </div>
                  </div>
                  <div className={styles.leftBottom}>
                    <div className={styles.heading}>3 Simple Steps</div>
                    <p className={styles.text}>
                      Step 1 : Upload required details{" "}
                    </p>
                    <p className={styles.text}>
                      Step 2 : Drag and drop headers on template
                    </p>
                    <p className={styles.text}>
                      Step 3 : Drag and drop CID on generated ceritificate
                    </p>
                    <p className={styles.text}>
                      Step 4 : Download all unique degree with CID
                    </p>
                  </div>
                </>
              )}
            </div>
            <div className={styles.containerRight}>
              <Slider />
            </div>
          </>
        ) : step === 2 ? (
          <Canvas1
            certs1={certs1}
            img={template}
            setFinalcerts1={setFinalcerts1}
            setStep={setStep}
            step={step}
            setImgcids={setImgcids}
            imgcids={imgcids}
            setDimensions={setDimensions}
          />
        ) : step === 3 ? (
          <Canvas2
            finalcerts1={finalcerts1}
            setStep={setStep}
            imgcids={imgcids}
            dimensions={dimensions}
            coursename={coursename}
            year={year}
          />
        ) : (
          " "
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Home;
