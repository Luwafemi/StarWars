import React from "react";
import "./layout.css";
import Header from "./header";

const layout = ({ children }) => (
  <>
    <Header />
    <div className="container">{children}</div>
  </>
);

export default layout;
