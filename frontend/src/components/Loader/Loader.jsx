import { TailSpin } from "react-loader-spinner";
import styles from "./Loader.module.css";
function Loader({ text }) {
  return (
    <div className={styles.LoaderWrapper}>
      <h2>Loading {text}</h2>
      <TailSpin height={80} width={80} color={"#3861fb"} radius={1} />
    </div>
  );
}

export default Loader;
