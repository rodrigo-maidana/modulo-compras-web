import React from "react";
import { Tab, Tabs } from "react-bootstrap";
import { Login } from "./Login";
import { Register } from "./Register";
import { FaSignInAlt, FaUserPlus } from "react-icons/fa";

const AuthTabs = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
      }}
    >
      <div className="card" style={{ width: "100%", maxWidth: "500px", padding: "20px" }}>
        <Tabs defaultActiveKey="login" id="auth-tabs" className="mb-3">
          <Tab
            eventKey="login"
            title={
              <span style={{ display: "flex", alignItems: "center" }}>
                <FaSignInAlt style={{ marginRight: "8px" }} /> Login
              </span>
            }
          >
            <div style={{ padding: "20px" }}>
              <Login />
            </div>
          </Tab>
          <Tab
            eventKey="register"
            title={
              <span style={{ display: "flex", alignItems: "center" }}>
                <FaUserPlus style={{ marginRight: "8px" }} /> Register
              </span>
            }
          >
            <div style={{ padding: "20px" }}>
              <Register />
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default AuthTabs;
