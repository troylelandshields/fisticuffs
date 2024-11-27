import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import React from "react";
import ReactDOM from "react-dom/client"; // Use react-dom/client for React 18
import "./index.css";
import App from "./App";

// Create a root and render the App component
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
