import React, { useState, useEffect } from "react";
import { withFirebase } from "../Firebase";

const Admin = (props) => {
  const [data, setData] = useState({ loading: false, users: [] });

  useEffect(() => {
    setData((prevState) => ({ ...prevState, loading: true }));

    props.firebase.users().on("value", (snapshot) => {
      const usersObject = snapshot.val();

      const usersList = Object.keys(usersObject).map((key) => ({
        ...usersObject[key],
        uid: key,
      }));

      setData({
        users: usersList,
        loading: false,
      });
    });

    return () => {
      props.firebase.users().off();
    };
  });

  return (
    <div>
      <h1>Admin</h1>

      {data.loading && <div>Loading ...</div>}

      <UserList users={data.users} />
    </div>
  );
};

const UserList = ({ users }) => (
  <ul>
    {users.map((user) => (
      <li key={user.uid}>
        <span>
          <strong>Id:</strong> {user.uid}
        </span>
      </li>
    ))}
  </ul>
);

export default withFirebase(Admin);
