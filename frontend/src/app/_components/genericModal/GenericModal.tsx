import React from "react";
import styles from "./GenericModal.module.css";

interface Props {
  message: string;
  redirect?: string;
  closeButton: boolean;
  color?: string;
}

const GenericModal: React.FC<Props> = (props) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div>{props.message}</div>
        {props.redirect ? (
          <p>
            <a href={props.redirect}>{props.redirect}</a>
          </p>
        ) : null}
        {props.closeButton ? (
          <button className={styles.closeButton}>Close</button>
        ) : null}
      </div>
    </div>
  );
};

export default GenericModal;
