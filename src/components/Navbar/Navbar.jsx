import React from "react";
import styles from "./Navbar.module.css";
import cloud from "../../assets/cloud.svg";
import { NavLink } from "react-router-dom";
import HoverAnimatedText from "../HoverAnimatedText/HoverAnimatedText";

function Navbar() {
  return (
    <header>
      <div className={styles.navbar}>
        <NavLink to="/">
          <img src={cloud} alt="A cloud" className={styles.logo} />
        </NavLink>

        <nav>
          <div className={styles.links}>
            <NavLink to="/">
              <HoverAnimatedText text="Home" />
            </NavLink>
            <NavLink to="/gallery">
              <HoverAnimatedText text="Gallery" />
            </NavLink>
            <NavLink to="/about">
              <HoverAnimatedText text="About" />
            </NavLink>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
