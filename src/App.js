import React, { useState } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Container } from "react-bootstrap";
import NavBar from "./components/nav/NavBar.js";
import Arbitration from "./components/pages/Arbitration.js";
import Home from "./components/pages/Home.js";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [backgroundColor, setBackgroundColor] = useState("#010536");

  // Define routes using createBrowserRouter
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/arbitration/:id/:user",
      element: <Arbitration />,
    },
  ]);

  return (
    <div
      style={{
        backgroundColor: backgroundColor,
        height: "100%",
        minHeight: "100vh",
        width: "100%",
        minWidth: "100vw",
      }}
    >
      <Container>
        <div>
          <ToastContainer />
          <NavBar location={window.location.href} />
          {/* RouterProvider handles rendering the routes */}
          <RouterProvider router={router} />
        </div>
      </Container>
    </div>
  );
}

export default App;
