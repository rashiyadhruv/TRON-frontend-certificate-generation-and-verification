import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "./Canvas2.module.scss";
import { jsPDF } from "jspdf";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import axios from "axios";
import AuthContext from "../../../../contexts/AuthContext";
import Loader from "../../../../components/loader/loader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Canvas2 = ({
  finalcerts1,
  setStep,
  imgcids,
  dimensions,
  coursename,
  year,
}) => {
  const cert_canvas = useRef();
  const [columns, setColumns] = useState(["CID"]);
  const [fields, setFields] = useState([
    {
      text: "CID",
      x: 400,
      y: 400,
      font: 64,
      isDragged: false,
    },
  ]);
  const [check, setCheck] = useState(false);
  const [labelIdx, setLabelIdx] = useState(-1);
  const [loading, setLoading] = useState(false);
  const { authState } = useContext(AuthContext);
  const [finaldata, setFinaldata] = useState([]);
  const [truedownload, setTruedownload] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const toastId = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    // console.log("certs2", imgcids);
    // console.log("finalcerts", finalcerts1);
    // console.log("certimg", certimg);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setColumns(columns);
    setFields(fields);
    let temp = [];

    for (let i = 0; i < finalcerts1?.length; i++) {
      temp.push({
        CID: imgcids[i].CID,
        img: finalcerts1[i].img,
        Name: finalcerts1[i].Name,
      });
    }

    setFinaldata(temp);

    setTimeout(() => {
      makeCertificate();
    }, 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // eslint-disable-next-line react-hooks/exhaustive-deps

  const notify = () => {
    toastId.current = toast("Uploading to IPFS & downloading Zip...", {
      autoClose: false,
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
      render: "Redirecting to homepage...",
      type: toast.TYPE.INFO,
      autoClose: 3000,
    });
  };
  /*
  Clears all text from canvas leaving only certificate image
  */

  const clearCanvas = async (i = 0) => {
    const canvas = cert_canvas.current;
    const ctx = canvas.getContext("2d");
    var img = new Image();
    img.src = finalcerts1[i].img;
    console.log("img", img);
    console.log(img.src === finalcerts1[i].img ? "true" : "false");
    // setTimeout(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    await ctx.drawImage(img, 0, 0);
    // }, 1);
    // console.log(ctx);
  };

  /*
  Adds all the text from the text field to the respective location
  */

  const addTexts = (i = 0) => {
    clearCanvas(i);
    const canvas = cert_canvas.current;
    const ctx = canvas.getContext("2d");

    setTimeout(() => {
      for (var field of fields) {
        // 0.0003 because it scaled the font well
        ctx.font = `${0.0003 * field.font * canvas.width}px sans-serif`;
        ctx.fillText(field.text, field.x, field.y);
      }
    }, 0);
  };

  /*
  Creates the initial canvas and returns its context
  */

  const initCanvas = () => {
    const canvas = cert_canvas.current;
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    const ctx = canvas.getContext("2d");
    return ctx;
  };

  /*
  On leaving mouse click, sets all text dragging property to false
  */
  const onMouseUp = (e) => {
    for (var field of fields) {
      field.isDragged = false;
    }
    setLabelIdx(-1);
    // e.preventDefault();
  };

  /*
  Moves the text which is draggable, with mouse movement
  */
  function onMouseMove(e) {
    const canvas = cert_canvas.current;
    const ctx = canvas.getContext("2d");
    const i = labelIdx;
    if (i !== -1 && fields[i].isDragged) {
      const scaledCanvas = canvas.getBoundingClientRect();
      const canX =
        ((e.pageX - scaledCanvas.left - window.scrollX) / scaledCanvas.width) *
        canvas.width;
      const canY =
        ((e.pageY - scaledCanvas.top - window.scrollY) / scaledCanvas.height) *
        canvas.height;
      const field = fields[i];
      const fontSize = 0.0003 * field.font * canvas.width;
      const textLength = ctx.measureText(field.text).width;
      field.x = canX - textLength / 2;
      field.y = canY + fontSize / 2;
      addTexts();
    }
    e.preventDefault();
  }

  /*
  Searches the box where the pointer is and sets its draggable property to true
  */

  const onMouseDown = (e) => {
    const canvas = cert_canvas.current;
    const ctx = canvas.getContext("2d");
    const scaledCanvas = canvas.getBoundingClientRect();
    const canX =
      ((e.pageX - scaledCanvas.left - window.scrollX) / scaledCanvas.width) *
      canvas.width;
    const canY =
      ((e.pageY - scaledCanvas.top - window.scrollY) / scaledCanvas.height) *
      canvas.height;
    var i,
      x,
      y,
      flag = false;
    for (i in fields) {
      const field = fields[i];
      // 0.0003 because it scaled the font well
      const fontSize = 0.0003 * field.font * canvas.width;
      const textLength = field.text.length * fontSize;
      const textHeight = fontSize;
      x = field.x;
      y = field.y;
      if (
        canX < x + textLength &&
        canX > x &&
        canY > y - textHeight &&
        canY < y
      ) {
        flag = true;
        break;
      }
    }
    if (flag === true) {
      setLabelIdx(i);
      const field = fields[i];
      const fontSize = 0.0003 * field.font * canvas.width;
      const textLength = ctx.measureText(field.text).width;
      field.x = canX - textLength / 2;
      field.y = canY + fontSize / 2;
      field.isDragged = true;
      addTexts();
    }
    // e.preventDefault();
  };

  /*
  Creates the certificate initially and add texts with default location
  */
  const makeCertificate = () => {
    const ctx = initCanvas();
    ctx.lineWidth = 1;
    addTexts();
  };

  /*
  Replaces default placeholder data with real data to see how the certificate
  looks
  */

  const replaceText = () => {
    if (check === false) {
      const firstData = imgcids[0];
      let originalFields = [];
      for (var field of fields) {
        originalFields.push({ ...field });
        field.text = firstData[field.text].toString();
      }
      addTexts();
      setCheck(true);
    }
    // console.log(this.originalFields);
  };

  const downloadZip = async () => {
    const quality = 0.5;
    const zip = new JSZip();
    const zipName = `${year}-${coursename}-degrees.zip`;

    var initialfields = columns.map((ele, i) => {
      return {
        text: ele,
        x: fields[i].x,
        y: fields[i].y,
        font: 64,
      };
    });

    // console.log(initialfields);

    for (var i = 0; i < finaldata.length; i++) {
      await clearCanvas(i);
      const canvas = cert_canvas.current;
      const ctx = canvas.getContext("2d");
      for (var field of initialfields) {
        // 0.0003 because it scaled the font well
        ctx.font = `${0.0003 * field.font * canvas.width}px sans-serif`;
        ctx.fillText(finaldata[i].CID, field.x, field.y);
      }

      const imgData = canvas.toDataURL("image/jpeg", quality);
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(imgData, "JPEG", 0, 0, canvas.width, canvas.height);
      var pdfName = finaldata[i].Name + ".pdf";
      zip.file(pdfName, pdf.output("blob"));
    }
    if (truedownload) {
      setLoading(true);
      zip.generateAsync({ type: "blob" }).then(async (content) => {
        var data = new FormData();
        data.append("file", content);

        // saveAs(content, zipName);

        var config = {
          method: "post",
          url: `${process.env.REACT_APP_SERVER_URL}/v1/uploadCertificates2`,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${authState.token}`,
          },
          data: data,
        };

        axios(config)
          .then(function (response) {
            // console.log(JSON.stringify(response.data));
            setLoading(false);
            update();
            saveAs(content, zipName);
            setTimeout(() => {
              navigate("/home");
            }, [3000]);
          })
          .catch(function (error) {
            setLoading(false);
          });
      });
    } else {
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.canvas_wrapper}>
        <div className={styles.head}>
          Certificate Preview : Drag and drop the headers only if the placements
          are wrong
        </div>
        <div className={styles.canvas_wrap}>
          <canvas
            onMouseUp={onMouseUp}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            id="cert_canvas"
            ref={cert_canvas}
            className={styles.canvas}
          />
          {!check ? (
            <div className={styles.glass}>
              {" "}
              Click "Check" below to view a sample certificate with CID
            </div>
          ) : null}
          {check && downloaded ? (
            <div className={styles.glass}>
              {" "}
              Your Certificates are getting uploaded to IPFS and the ZIP will be
              downloaded shortly , please wait...
            </div>
          ) : null}
        </div>
        <div className={styles.options}>
          <div
            variant="primary"
            size="lg"
            type="submit"
            style={{ marginLeft: 4 }}
            onClick={() => {
              if (!check) {
                downloadZip();
                setTimeout(() => {
                  setTruedownload(true);
                  replaceText();
                  setCheck(true);
                }, 1000);
              } else {
              }
            }}
            className={
              check ? styles.options_optiondisa : styles.options_option
            }
          >
            Check
          </div>
          <div
            variant="primary"
            size="lg"
            type="submit"
            onClick={() => {
              if (check && !loading) {
                setDownloaded(true);
                notify();
                downloadZip();
              } else {
                alert("Please check the certificates first");
              }
            }}
            className={
              check ? styles.options_optionl : styles.options_optiondis
            }
          >
            {loading ? <Loader /> : "Download Certificates"}
          </div>
          {/* <div
            variant="primary"
            size="lg"
            type="submit"
            onClick={() => {
              submitZip();
            }}
            className={styles.options_option}
          >
            Submit Certificates
          </div> */}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};
export default Canvas2;
