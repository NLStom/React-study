import React from "react";

import { withAuthorization } from "../Session";

const Home = () => (
  <div>
    <h1>Home</h1>
    <p>The Home Page is for signed in user.</p>
  </div>
);

const condition = (authUser) => authUser != null;

export default withAuthorization(condition)(Home);
