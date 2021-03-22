import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import { PasswordForgetLink } from "../PasswordForget";
import { SignUpLink } from "../SignUp";
import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";

const SignIn = () => (
  <div>
    <h1>SignIn</h1>
    <SignInForm />
    <PasswordForgetLink />

    <SignUpLink />
  </div>
);

const INITIAL_STATE = {
  email: "",
  password: "",
  error: null,
};

const SignInFormBase = (props) => {
  const INITIAL_STATE = {
    email: "",
    passwordOne: "",
    error: null,
  };
  const [formData, setForm] = React.useState(INITIAL_STATE);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const onSubmit = (event) => {
    const { email, passwordOne } = formData;

    props.firebase
      .doSignInWithEmailAndPassword(email, passwordOne)
      .then((authUser) => {
        setForm({ ...INITIAL_STATE });
        props.history.push(ROUTES.HOME);
        console.log("Sign in success");
      })
      .catch((error) => {
        console.log("asdf");
        setForm((prevState) => ({
          ...prevState,
          error,
        }));
      });

    event.preventDefault();
  };

  const isInvalid = formData.passwordOne === "" || formData.email === "";

  return (
    <form onSubmit={onSubmit}>
      <input
        name="email"
        value={formData.email}
        onChange={onChange}
        type="text"
        placeholder="Email Address"
      />
      <input
        name="passwordOne"
        value={formData.passwordOne}
        onChange={onChange}
        type="password"
        placeholder="Password"
        autoComplete="off"
      />
      <button disabled={isInvalid} type="submit">
        Sign In
      </button>

      {formData.error && <p>{formData.error.message}</p>}
    </form>
  );
};

const SignInForm = compose(withRouter, withFirebase)(SignInFormBase);

export default SignIn;
