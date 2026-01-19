import React from "react";
import styles from "./ViewModeSwitcher.module.css";

function ViewModeSwitcher({ modes, currentMode, setCurrentMode }) {
  return (
    <div className={styles.switcher}>
      {modes.map((mode, i) => {
        return (
          <button
            data-selected={mode.id === currentMode}
            key={mode.type}
            onClick={() => setCurrentMode(mode.id)}
          >
            <span>{mode.type}</span>
          </button>
        );
      })}
    </div>
  );
}

export default ViewModeSwitcher;
