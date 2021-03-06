import React, { useState, useEffect, useContext } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import { useForm } from "react-hook-form";
import { Redirect } from "react-router-dom";
import { Link } from "react-router-dom";

import { Container, Box, TextField, Button } from "@material-ui/core";

// Configure Firebase.
const config = {
  apiKey: "AIzaSyA_g3NGl1fswGiAn028Rq8VfRlqLZHA_1c",
  authDomain: "isijniyaz.firebaseapp.com",
  projectId: "isijniyaz",
  storageBucket: "isijniyaz.appspot.com",
  messagingSenderId: "575752581167",
  appId: "1:575752581167:web:5cb8b2e65175a906b816da",
};
if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

// Returns a login page that allows users to login
export function Login() {
  const [isSignedIn, setIsSignedIn] = useState(false); // Local signed-in state.
  const { register, handleSubmit, watch, errors } = useForm();

  // log the user in using firebase
  const onSubmit = (event) => {
    firebase
      .auth()
      .signInWithEmailAndPassword(watch("email"), watch("password"))
      .then((user) => {
        setIsSignedIn(!!user);
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
      });
  };

  // only show the login page if theyre not authenticated
  if (!isSignedIn) {
    return (
      <div>
        <h1>Login</h1>
        <Container maxWidth="sm">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box m={1}>
              <TextField
                inputRef={register({ required: true })}
                name="email"
                label="Email Address"
                variant="outlined"
                fullWidth
              />
            </Box>

            <Box m={1}>
              <TextField
                inputRef={register({ required: true })}
                name="password"
                label="Password"
                label="Password"
                type="password"
                autoComplete="current-password"
                variant="outlined"
                fullWidth
              />
            </Box>

            <Box m={1}>
              <Button
                variant="contained"
                onClick={handleSubmit(onSubmit)}
                fullWidth
              >
                Sign In
              </Button>
            </Box>

            {/* buttons for forgot password and new signups */}
            <Box m={1}>
              <Link
                to="/signup"
                key="signup"
                style={{ textDecoration: "none" }}
              >
                <Button variant="contained" fullWidth>
                  Create New Account
                </Button>
              </Link>
            </Box>
            <Box m={1}>
              <Link
                to="/forgotPassword"
                key="forgotPassword"
                style={{ textDecoration: "none" }}
              >
                <Button variant="contained" fullWidth>
                  Forgot Password
                </Button>
              </Link>
            </Box>
          </form>
        </Container>
      </div>
    );
  }
  // otherwise redirect them to the homepage
  return <Redirect to="/"></Redirect>;
}

export default Login;
