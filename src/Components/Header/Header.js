import { useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "./headerStyle.css";
import { useLocation } from "react-router-dom";

/**
 * Header is a component that represents the header
 * when the user is not authenticated
 */
const Header = () => {
  const [hideSignIn, setHideSignIn] = useState(false);
  const [hideSignUp, setHideSignUp] = useState(false);

  const location = window.location.pathname;

  useEffect(() => {
    if (location === "/signin") {
      setHideSignIn(true);
    } else if (location === "/signup") {
      setHideSignUp(true);
    } else {
      setHideSignIn(false);
      setHideSignUp(false);
    }
  }, []);

  return (
    <div className="header-container">
      <div className="logo">
        <a href="/">
          <h1>check</h1>
        </a>
      </div>
      <div className="sign-in-out">
        {!hideSignIn && (
          <a href="/signin">
            <button className="sign-in-button">Sign In</button>
          </a>
        )}

        {!hideSignUp && (
          <a href="/signup">
            <button className="sign-up-button">Sign Up</button>
          </a>
        )}
      </div>
    </div>
  );
};

export default Header;
