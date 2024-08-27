import React, { useState } from "react";
import http from "./http-common";

const Login = (props) => {
  const initialUserState = {
    id: null,
    name: "",
    password: "",
  };

  const [user, setUser] = useState(initialUserState);
  const [loginStatus, setLoginStatus] = useState("");

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  const login = () => {
    http
      .post(`/users/login`, {
        userID: user.id,
        password: user.password,
      })
      .then((res) => {
        console.log(res);
        if (res.data[0].password_str === user.password) {
          props.login(user.id, user.name);
          props.history.push("/");
        } else {
          setLoginStatus(res.data);
        }
      });
  };

  const create = () => {
    http
      .post("/users/create", {
        userID: user.id,
        password: user.password,
      })
      .then((res) => {
        console.log(res);
        if (res.data.length < 1) {
          props.login(user.id, user.name);
          props.history.push("/");
        } else {
          setLoginStatus(res.data);
        }
      });
  };

  return (
    <div className="submit-form">
      <div>
        <div className="form-group">
          <label htmlFor="id">ID</label>
          <input
            type="number"
            className="form-control"
            id="id"
            required
            // value={user.id}
            onChange={handleInputChange}
            name="id"
          />
        </div>

        <div className="form-group">
          <label htmlFor="user">Username</label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={user.name}
            onChange={handleInputChange}
            name="name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="text"
            className="form-control"
            id="password"
            required
            value={user.password}
            onChange={handleInputChange}
            name="password"
          />
        </div>

        <button onClick={login} className="btn btn-success">
          Login
        </button>
        <button onClick={create} className="btn btn-success">
          Create Account
        </button>
        <div>{loginStatus}</div>
      </div>
    </div>
  );
};

export default Login;
