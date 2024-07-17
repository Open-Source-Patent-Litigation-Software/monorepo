import React, { useState } from "react";
import styles from "./popup.module.css";
interface PopUpProps {
  title: string;
  error: string;
}
const PopUpModal: React.FC<PopUpProps> = ({ title, error }) => {
  const [modal, setModal] = useState(true);
  const toggleModal = () => {
    setModal(!modal);
  };
  if (modal) {
    document.body.classList.add(styles.activeModal);
  } else {
    document.body.classList.remove(styles.activeModal);
  }
  return (
    <>
      {modal && (
        <div className={styles.modal}>
          <div onClick={toggleModal} className={styles.overlay}></div>
          <div className={styles.modalContent}>
            <h2 id="title">{title}</h2>
            <p>{error}</p>
            <button
              className={styles.closeModal}
              onClick={toggleModal}
            ></button>
          </div>
        </div>
      )}
    </>
  );
};
export default PopUpModal;
