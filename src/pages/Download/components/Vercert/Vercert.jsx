import React, { useState } from "react";
import styles from "./Vercert.module.scss";

import { ReactComponent as Warn } from "../../../../assets/warn.svg";
import { ReactComponent as Checked } from "../../../../assets/checked.svg";
import { ReactComponent as Home } from "../../../../assets/home.svg";

import { Link } from "react-router-dom";

const Vercert = ({ imglink }) => {
  const [checked, setChecked] = useState(0);

  return (
    <div className={styles.main}>
      {/* <img src={imglink} alt="" /> */}
      <object data={imglink} type="application/pdf" width="100%" height="100%">
        <p>
          Alternative text - include a link <a href={imglink}>to the PDF!</a>
        </p>
      </object>
      <div className={styles.main_content}>
        <div className={styles.main_content_inst}>
          The displayed degree has been issued by the institution.
        </div>

        <div className={styles.main_content_notice_green}>
          The degree can be downloaded from the options given.
        </div>
        <Link className={styles.main_content_btn} to="/home">
          Back to Home <Home />
        </Link>
      </div>
    </div>
  );
};

export default Vercert;
