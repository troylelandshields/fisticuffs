import React, { Component, useState, useEffect } from "react";
import axios from "axios";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import config from "../../services/config.js";

function getArbitrationIDPathParameter(url) {
  if (!url) {
    return null;
  }
  const parts = url.split("/");
  const arbitration = parts.indexOf("arbitration");

  if (arbitration === -1) {
    return null;
  }

  return parts[arbitration + 1];
}

function NavBar(props) {
  let arbitrationId = getArbitrationIDPathParameter(props.location);

  const [arbitration, setArbitration] = useState(null);

  const loadArbitration = () => {
    axios
      .get(`${config.apiHost}/public/arbitrations/${arbitrationId}/`)
      .then((resp) => {
        setArbitration(resp.data);
      });
  };

  useEffect(() => {
    if (arbitrationId && !arbitration) {
      loadArbitration();
    }
  }, [arbitrationId]);

  return (
    <Navbar>
      <Nav>
        <Nav.Link href="/">Home</Nav.Link>
      </Nav>
    </Navbar>
  );
}

export default NavBar;
