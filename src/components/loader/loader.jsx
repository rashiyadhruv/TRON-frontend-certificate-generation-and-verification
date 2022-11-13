import styles from "./loader.module.scss";

const loader = () => {
  return (
    <div className={styles.cube}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default loader;
