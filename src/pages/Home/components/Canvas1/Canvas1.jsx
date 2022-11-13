import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "./Canvas1.module.scss";
import { jsPDF } from "jspdf";
import JSZip from "jszip";
import axios from "axios";

import AuthContext from "../../../../contexts/AuthContext";
import Loader from "../../../../components/loader/loader";
import positions from "./utils";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { saveAs } from "file-saver";

const Canvas1 = ({
  certs1,
  img,
  setFinalcerts1,
  setStep,
  setImgcids,
  imgcids,
  step,
  setDimensions,
}) => {
  const cert_canvas = useRef();
  const { authState } = useContext(AuthContext);
  const [columns, setColumns] = useState([]);
  const [fields, setFields] = useState([]);
  const [certimg, setCertimg] = useState(img);
  const [check, setCheck] = useState(false);
  const [labelIdx, setLabelIdx] = useState(-1);
  const [loading, setLoading] = useState(false);
  const toastId = useRef(null);
  // let fieldss = [];
  useEffect(() => {
    setCertimg(img);
    if (certs1?.length > 0) {
      setColumns(Object.keys(certs1[0]));

      let fieldss = Object.keys(certs1[0])?.map((ele, i) => {
        return {
          text: ele.toString(),
          x: positions[i].x,
          y: positions[i].y,
          font: positions[i].font,
          fontfamily: positions[i].fontfamily,
          style: positions[i].style,
          isDragged: false,
        };
        // return {
        //   text: ele.toString(),
        //   x: 100,
        //   y: 100 * i + 300,
        //   font: 64,
        //   fontfamily: "Arial",
        //   isDragged: false,
        // };
      });

      setFields(fieldss);
    }
    // console.log("certs1", certs1, columns, fields);
    // console.log("imggg", certimg);

    makeCertificate();
  }, []);

  const notify = () => {
    toastId.current = toast("Uploading to IPFS...", {
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
      render: "Uploaded to IPFS",
      type: toast.TYPE.SUCCESS,
      autoClose: 100,
      hideProgressBar: true,
    });
  };

  /*
  Clears all text from canvas leaving only certificate image
  */

  const clearCanvas = () => {
    const canvas = cert_canvas.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(certimg, 0, 0);
  };

  /*
  Adds all the text from the text field to the respective location
  */

  const addTexts = () => {
    const canvas = cert_canvas.current;
    const ctx = canvas.getContext("2d");
    clearCanvas();

    for (var field of fields) {
      // 0.0003 because it scaled the font well
      ctx.font = ` ${0.0003 * field.font * canvas.width}px ${field.fontfamily}`;
      console.log("font", ctx.font);
      ctx.fillText(field?.text, field?.x, field?.y);
    }
  };

  /*
  Creates the initial canvas and returns its context
  */

  const initCanvas = () => {
    const canvas = cert_canvas.current;
    canvas.width = certimg.width;
    canvas.height = certimg.height;
    setDimensions({ width: certimg.width, height: certimg.height });
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
      // let field = fields[i];
      const fontSize = 0.0003 * fields[i].font * canvas.width;
      const textLength = ctx.measureText(fields[i].text).width;
      fields[i].x = canX - textLength / 2;
      fields[i].y = canY + fontSize / 2;
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
      // 0.0003 because it scaled the font well
      const fontSize = 0.0003 * fields[i].font * canvas.width;
      const textLength = fields[i].text.length * fontSize;
      const textHeight = fontSize;
      x = fields[i].x;
      y = fields[i].y;
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
      const fontSize = 0.0003 * fields[i].font * canvas.width;
      const textLength = ctx.measureText(fields[i].text).width;
      fields[i].x = canX - textLength / 2;
      fields[i].y = canY + fontSize / 2;
      fields[i].isDragged = true;
      // console.log("fields", fields);
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
      const firstData = certs1?.[0];
      let originalFields = [];
      const canvas = cert_canvas.current;
      const ctx = canvas.getContext("2d");
      for (var field of fields) {
        originalFields.push({ ...field });
        let length = ctx.measureText(field.text).width;
        field.text = firstData[field.text].toString();
        let length2 = ctx.measureText(field.text).width;
        field.x = field.x - (length2 - length) * 2.5;
      }
      addTexts();
      setCheck(true);
    }
    // console.log(this.originalFields);
  };

  const submitZip = () => {
    setLoading(true);
    const canvas = cert_canvas.current;
    const ctx = canvas.getContext("2d");
    const quality = 0.5;
    const zip = new JSZip();
    var initialfields = columns.map((ele, i) => {
      return {
        text: ele,
        x: fields[i].x,
        y: fields[i].y,
        font: fields[i].font,
        fontfamily: fields[i].fontfamily,
      };
    });

    for (var i = 0; i < certs1.length; i++) {
      clearCanvas();

      for (var field of initialfields) {
        // 0.0003 because it scaled the font well
        if (i !== 0) {
          let length = ctx.measureText(certs1[i - 1][field.text]).width;
          let length2 = ctx.measureText(certs1[i][field.text]).width;
          field.x = field.x - (length2 - length) / 1.95;
          ctx.font = `${0.0003 * field.font * canvas.width}px ${
            field.fontfamily
          }`;
          ctx.fillText(certs1[i][field.text], field.x, field.y);
        } else {
          ctx.font = `${0.0003 * field.font * canvas.width}px ${
            field.fontfamily
          }`;
          ctx.fillText(certs1[i][field.text], field.x, field.y);
        }
      }
      // console.log("hello", i);
      const imgdata = canvas.toDataURL("image/jpeg", quality);

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(imgdata, "JPEG", 0, 0, canvas.width, canvas.height);
      let name = certs1[i].Name;
      setFinalcerts1((current) => [...current, { img: imgdata, Name: name }]);
      var pdfName = certs1[i]["Name"] + ".pdf";
      zip.file(pdfName, pdf.output("blob"));
    }

    zip.generateAsync({ type: "blob" }).then(async (content) => {
      var data = new FormData();
      data.append("file", content);

      //   saveAs(content, zipName);

      var config = {
        method: "post",
        url: `${process.env.REACT_APP_SERVER_URL}/v1/uploadCertificates`,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${authState.token}`,
        },
        data: data,
      };

      axios(config)
        .then(function (response) {
          update();
          onsuccess(response);
        })
        .catch(function (error) {
          setLoading(false);
        });
    });
  };

  const onsuccess = (res) => {
    setImgcids(res?.data?.IQR);
    setLoading(false);
    setStep(3);
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
              Click "Check" below to view a sample certificate without CID.
            </div>
          ) : null}
          {check && loading ? <div className={styles.glass}> </div> : null}
        </div>
        {/* <div className={styles.highlight}></div> */}
        <div className={styles.options}>
          <div
            variant="primary"
            size="lg"
            type="submit"
            style={{ marginLeft: 4 }}
            onClick={() => {
              replaceText();
            }}
            className={
              check ? styles.options_optiondisa : styles.options_option
            }
          >
            Check
          </div>
          {loading ? (
            <div className={styles.optiontxt}>
              Certificates without CID are getting uploaded to the IPFS network.
              This may take a while.
            </div>
          ) : null}
          <div
            variant="primary"
            size="lg"
            type="submit"
            onClick={() => {
              if (check && !loading) {
                notify();
                submitZip();
              }
            }}
            className={
              check ? styles.options_optionl : styles.options_optiondis
            }
          >
            {loading ? <Loader /> : "Submit Certificates"}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};
export default Canvas1;
