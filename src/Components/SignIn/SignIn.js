import { useState } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import { Redirect } from "react-router-dom";
import "./signInStyle.css";

/**
 * SigIn is a component that represents the Sign In page
 */
const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState("");

  const updateEmail = (e) => setEmail(e.target.value);
  const updatePassword = (e) => setPassword(e.target.value);

  const login = (e) => {
    e.preventDefault();

    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed in
        var signedUser = userCredential.user;
        setRedirect("/dashboard");
      })
      .catch((error) => {
        //made something nice for this
        var errorMessage = error.message;
        alert(errorMessage);
      });
  };

  if (redirect) {
    return <Redirect to={redirect}></Redirect>;
  }

  return (
    <div className="sign-in-container">
      <div className="form-container">
        <h2>Sign In</h2>
        <form>
          <label>Email</label>
          <br></br>
          <input type="text" name="email" onChange={updateEmail}></input>
          <br></br>
          <label>Password</label>
          <br></br>
          <input type="password" onChange={updatePassword}></input>
          <br></br>
          <button className="sign-on-button" onClick={login}>
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
