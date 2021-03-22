import React from "react";

import { withFirebase } from "../Firebase";
const INITIAL_STATE = {
  passwordOne1: "",
  passwordTwo1: "",
  error: null,
};
const PasswordChangeForm = (props) => {
  const [formData, setForm] = React.useState(INITIAL_STATE);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const onSubmit = (event) => {
    const { passwordOne1 } = formData;

    props.firebase
      .doPasswordUpdate(passwordOne1)
      .then(() => {
        setForm({ ...INITIAL_STATE });
        console.log("Reset password success");
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
    formData.passwordOne === "";

  return (
    <form onSubmit={onSubmit}>
      <input
        name="passwordOne1"
        value={formData.passwordOne}
        onChange={onChange}
        type="password"
        placeholder="New Password"
        autoComplete="off"
      />
      <input
        name="passwordTwo1"
        value={formData.passwordTwo}
        onChange={onChange}
        type="password"
        placeholder="Confirm New Password"
        autoComplete="off"
      />

      <button disabled={isInvalid} type="submit">
        Reset Password
      </button>

      {formData.error && <p>{formData.error.message}</p>}
    </form>
  );
};

export default withFirebase(PasswordChangeForm);
