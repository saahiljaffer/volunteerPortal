import React, { useState } from "react";
import firebase from "firebase";
import { useForm } from "react-hook-form";
import { Redirect, Link } from "react-router-dom";
import {
  Container,
  Box,
  TextField,
  Button,
  FormControlLabel,
  FormGroup,
  Checkbox,
  makeStyles,
} from "@material-ui/core";
import Alert from "../Components/Alert";

// Styling
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  textField: {
    marginRight: theme.spacing(0),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  checkbox: {
    margin: theme.spacing(1),
    textAlign: "left",
  },
  label: {
    margin: theme.spacing(1),
    textAlign: "left",
  },
}));

// Returns a signup page that allows users to create an account
export function SignUp() {
  const [isSignedIn, setIsSignedIn] = useState(false); // Local signed-in state.
  const { register, handleSubmit, watch } = useForm();
  const classes = useStyles();
  const [error, setError] = useState(null);

  // API call to create the account
  const onSubmit = async (event) => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(watch("email"), watch("password"))
      .then((user) => {
        // Signed in
        var user = user.user;
        const body = {
          uid: user.uid,
          fname: watch("fname"),
          lname: watch("lname"),
          email: watch("email"),
          whatsappNumber: watch("whatsappNumber"),
          cellNumber: watch("cellNumber"),
          postalCode: watch("postalCode"),
        };
        console.log(body);
        const result = fetch(`/api/drivers/add/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })
          .then((response) => {
            if (response.status >= 200 && response.status <= 299) {
              setError(false);
              user
                .sendEmailVerification()
                .then(function () {
                  // Email sent.
                })
                .catch(function (error) {
                  // An error happened.
                });
              setIsSignedIn(!!user);
            } else {
              setError(response.statusText);
            }
          })
          .catch((error) => setError(error));
      })
      .catch((error) => {
        setError(error.message);
        var errorCode = error.code;
        var errorMessage = error.message;
      });
  };

  // only show the signup form if they aren't signed in
  if (!isSignedIn) {
    return (
      <div className={classes.root}>
        <Container maxWidth="sm">
          <h1>Sign Up</h1>
          {/* show an error when they don't sign ub succesfully */}
          {error && (
            <Alert className={classes.textField} severity="error">
              Your submission wasn't submitted successfully! &nbsp;
              {error}
            </Alert>
          )}
          <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            {/* </Box> */}
            <TextField
              inputRef={register({ required: "first name required" })}
              name="fname"
              label="First Name"
              variant="outlined"
              className={classes.textField}
              required
              fullWidth
            />
            <TextField
              inputRef={register({ required: "first name required" })}
              name="lname"
              label="Last Name"
              variant="outlined"
              className={classes.textField}
              required
              fullWidth
            />
            <TextField
              inputRef={register({ required: "first name required" })}
              name="email"
              label="Email Address"
              variant="outlined"
              fullWidth
              className={classes.textField}
              required
            />
            <TextField
              inputRef={register({
                required: "first name required",
                minLength: 8,
              })}
              name="password"
              label="Password"
              type="password"
              autoComplete="new-password"
              variant="outlined"
              className={classes.textField}
              fullWidth
              required
            />

            <TextField
              inputRef={register({ required: "first name required" })}
              name="whatsappNumber"
              label="WhatsApp Number"
              variant="outlined"
              className={classes.textField}
              required
              fullWidth
            />
            <TextField
              inputRef={register}
              name="cellNumber"
              label="Cell Number"
              variant="outlined"
              helperText="Please enter your cell number if it is different from your WhatsApp number"
              className={classes.textField}
              fullWidth
            />
            <TextField
              inputRef={register({
                required: "first name required",
                pattern: /^([a-zA-Z]\d[a-zA-Z]\s?\d[a-zA-Z]\d)$/,
              })}
              name="postalCode"
              label="Postal Code"
              autoComplete="current-password"
              variant="outlined"
              className={classes.textField}
              fullWidth
              required
              helperText="Your postal code will be used for planning purposes instead of route optimization"
            />

            <FormGroup row>
              <FormControlLabel
                control={
                  <Checkbox
                    inputRef={register({ required: "first name required" })}
                    name="covidWaiver"
                    color="primary"
                    required
                  />
                }
                classes={{ root: classes.label }}
                label="I understand that while safety of the community is of utmost
              importance, there is still some risks present due to COVID-19. I
              bear full responsibility for my own actions and understand that
              the ISIJ of Toronto will not be held liable for any complications
              arising from the volunteer services I provide."
              />
              <FormControlLabel
                classes={{ root: classes.label }}
                control={
                  <Checkbox
                    inputRef={register({ required: "first name required" })}
                    name="contactWaiver"
                    color="primary"
                    required
                  />
                }
                label="I understand that the ISIJ of Toronto will collect and retain my
              contact information in case public health officials require it for
              contact tracing purposes."
              />
            </FormGroup>
          </form>

          <Box m={1}>
            <Button
              variant="contained"
              onClick={handleSubmit(onSubmit)}
              fullWidth
            >
              Create Account
            </Button>
          </Box>
          <Box m={1}>
            <Link to="/login" key="login" style={{ textDecoration: "none" }}>
              <Button variant="contained" fullWidth>
                Back to login
              </Button>
            </Link>
          </Box>
        </Container>
      </div>
    );
  }
  // redirect them to the app if they're logged in
  return <Redirect to="/"></Redirect>;
}
