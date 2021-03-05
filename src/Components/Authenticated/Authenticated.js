import { useClient, useTransact, useEntity } from "homebase-react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import Home from "../Home/Home";
import Header from "../Header/Header";
import SignIn from "../SignIn/SignIn";
import SignUp from "../SignUp/SignUp";
import SyncToFirebase from "../SyncToFirebase/SyncToFirebase";
import { useEffect } from "react";
import Dashboard from "../Dashboard/Dashboard";

/**
 * Authenticated is a component that checks to see
 * if the user has been authenticated and loads the
 * appropriate components is so
 * @param {Components} children all of the components
 * that should be rendered after the user is logged in.
 */
const Athenticated = ({ children }) => {
  const [transact] = useTransact();
  const [currentUser] = useEntity({ identity: "currentUser" });
  const [client] = useClient();

  useEffect(() => {
    window.emptyDB = client.dbToString();
    return firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        transact([
          {
            user: {
              identity: "currentUser",
              uid: user.uid,
              name: user.displayName,
            },
          },
        ]);
      }
    });
  }, []);

  if (currentUser.get("uid")) {
    return (
      <>
        {children}
        <SyncToFirebase />
      </>
    );
  }
  return (
    <Router>
      <Header />
      <Route exact path="/" render={() => <Home />}></Route>
      <Route exact path="/signin" render={() => <SignIn />}></Route>
      <Route exact path="/signup" render={() => <SignUp />}></Route>
    </Router>
  );
};

export default Athenticated;
