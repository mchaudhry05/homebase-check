import { useState } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import { Redirect } from "react-router-dom";
import "./signUpStyle.css";

/**
 * SignUp in a component that represents the
 * sign up page
 */
const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);

  const updateEmail = (e) => setEmail(e.target.value);
  const updateName = (e) => setName(e.target.value);
  const updatePassword = (e) => setPassword(e.target.value);

  const createUser = (e) => {
    e.preventDefault();
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Sign Up
        var user = userCredential.user;

        user.updateProfile({
          displayName: name,
        });

        localStorage.setItem("token", "passed!");
        window.location = "/dashboard";
        setRedirect(true);
      })
      .catch((error) => {
        var errorMessage = error.message;
        alert(errorMessage);
      });
  };

  if (redirect) {
    localStorage.setItem("token", "passed!");
    return <Redirect to={"/dashboard"}></Redirect>;
  }

  return (
    <div className="sign-up-container">
      <div className="form-container">
        <h2>Sign Up</h2>
        <form>
          <label>Name</label>
          <br></br>
          <input type="text" name="Name" onChange={updateName}></input>
          <br></br>
          <label>Email</label>
          <br></br>
          <input type="text" name="Email" onChange={updateEmail}></input>
          <br></br>
          <label>Password</label>
          <br></br>
          <input type="password" onChange={updatePassword}></input>
          <br></br>
          <button className="sign-off-button" onClick={createUser}>
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
