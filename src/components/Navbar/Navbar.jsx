import React from "react";
import styles from "./Navbar.module.css";
import cloud from "../../assets/cloud.svg";
import { NavLink } from "react-router-dom";
import HoverAnimatedText from "../HoverAnimatedText/HoverAnimatedText";

function Navbar({ routes }) {
  return (
    <header>
      <div className={styles.navbar}>
        <NavLink to="/">
          <img src={cloud} alt="A cloud" className={styles.logo} />
        </NavLink>

        <nav>
          <div className={styles.links}>
            {/* <NavLink to="/">
              <HoverAnimatedText text="Home" />
            </NavLink>
            <NavLink to="/gallery">
              <HoverAnimatedText text="Gallery" />
            </NavLink>
            <NavLink to="/about">
              <HoverAnimatedText text="About" />
            </NavLink> */}
            {routes.map((route, i) => {
              return (
                route.showInNavbar && (
                  <NavLink to={route.path} key={"navlink_" + i}>
                    <HoverAnimatedText text={route.label} />
                  </NavLink>
                )
              );
            })}
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
