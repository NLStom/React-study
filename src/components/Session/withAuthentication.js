import React, { useState, useEffect } from "react";

import AuthUserContext from "./context";
import { withFirebase } from "../Firebase";

const withAuthentication = (Component) => {
  const WithAuthentication = (props) => {
    const inital_state = { authUser: null };
    const [data, setData] = useState(inital_state);
    useEffect(() => {
      const listener = props.firebase.auth.onAuthStateChanged((authUser) => {
        authUser ? setData({ authUser }) : setData(inital_state);
      });
      return () => {
        listener();
      };
    });
    return (
      <AuthUserContext.Provider value={data.authUser}>
        <Component {...props} />
      </AuthUserContext.Provider>
    );
  };

  return withFirebase(WithAuthentication);
};

export default withAuthentication;
