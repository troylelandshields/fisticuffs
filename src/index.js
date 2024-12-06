// import "bootstrap/dist/css/bootstrap.min.css";
import "./custom.scss";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client"; // Use react-dom/client for React 18
import App from "./App";

// Create a root and render the App component
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
