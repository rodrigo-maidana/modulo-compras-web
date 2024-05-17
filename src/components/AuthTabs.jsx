import React from "react";
import { Tab, Tabs } from "react-bootstrap";
import { Login } from "./Login";
import { Register } from "./Register";

const AuthTabs = () => {
  return (
    <Tabs defaultActiveKey="login" id="auth-tabs" className="mb-3">
      <Tab eventKey="login" title="Login">
        <Login />
      </Tab>
      <Tab eventKey="register" title="Register">
        <Register />
      </Tab>
    </Tabs>
  );
};

export default AuthTabs;
