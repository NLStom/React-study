import React from "react";
import { Link, withRouter } from "react-router-dom";

import { withFirebase } from "../Firebase/context";
import { compose } from "recompose";
import * as ROUTES from "../../constants/routes";
const SignUpPage = () => (
  <div>
    <h1>Sign Up</h1>

    <SignUpForm />
  </div>
);

const SignUpFormBase = (props) => {
  const INITIAL_STATE = {
    username: "",
    email: "",
    passwordOne: "",
    passwordTwo: "",
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
    const { username, email, passwordOne } = formData;

    props.firebase
      .doCreateUserEmailAndPassword(email, passwordOne)
      .then((authUser) => {
        return props.firebase.user(authUser.user.uid).set({
          username,
          email,
        });
      })
      .then(() => {
        setForm({ ...INITIAL_STATE });
        props.history.push(ROUTES.HOME);
        console.log("Sign up success");
      })
      .catch((error) => {
        setForm((prevState) => ({
          ...prevState,
          error,
        }));
      });

    event.preventDefault();
  };

  const isInvalid =
    formData.passwordOne !== formData.passwordTwo ||
    formData.passwordTwo === "" ||
    formData.email === "" ||
    formData.username === "";

  return (
    <form onSubmit={onSubmit}>
      <input
        name="username"
        value={formData.username}
        onChange={onChange}
        type="text"
        placeholder="Full Name"
      />
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
      <input
        name="passwordTwo"
        value={formData.passwordTwo}
        onChange={onChange}
        type="password"
        placeholder="Confirm Password"
        autoComplete="off"
      />
      <button disabled={isInvalid} type="submit">
        Sign Up
      </button>

      {formData.error && <p>{formData.error.message}</p>}
    </form>
  );
};

const SignUpForm = compose(withRouter, withFirebase)(SignUpFormBase);

const SignUpLink = () => (
  <p>
    New here? <Link to={ROUTES.SIGN_UP}>Sign up</Link>
  </p>
);

export default SignUpPage;

export { SignUpForm, SignUpLink };
