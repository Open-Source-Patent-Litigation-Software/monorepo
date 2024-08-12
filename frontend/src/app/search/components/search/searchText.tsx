import React, { useState } from "react";
import styles from "./searchText.module.css";

const SearchText = () => {
  const [dropdown1Open, setDropdown1Open] = useState(false);
  const [dropdown2Open, setDropdown2Open] = useState(false);

  return (
    <div className={styles.textContainer}>
      <div className={styles.textBox}>
        <p>
          <span
            className={styles.dropdownToggle}
            onClick={() => setDropdown1Open(!dropdown1Open)}
          >
            What makes a good search?
          </span>
        </p>
        <div
          className={`${styles.dropdownContent} ${
            dropdown1Open ? styles.open : ""
          }`}
        >
          You'll get the best results with a search query that is around 100
          words and details <b>all</b> the key inventive features of your idea.
        </div>
        <div className={styles.divider}></div>
        <p>
          <span
            className={styles.dropdownToggle}
            onClick={() => setDropdown2Open(!dropdown2Open)}
          >
            How does the search work?
          </span>
        </p>
        <div
          className={`${styles.dropdownContent} ${
            dropdown2Open ? styles.open : ""
          }`}
        >
          We use three specialized artificial intelligence models to break down
          your search query into categories and then analyze the patent
          landscape.
        </div>
      </div>
    </div>
  );
};

export default SearchText;
