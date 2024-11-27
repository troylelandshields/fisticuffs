import React, { Component } from "react";
import { Button } from "react-bootstrap";
import config from "../../services/config.js";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";

function Home(props) {
  const navigate = useNavigate();

  const createArbitration = async () => {
    const newId = uuidv4();
    try {
      await axios.post(`${config.apiHost}/public/arbitrations`, {
        id: newId,
      });

      // route to the new arbitration
      navigate(`/arbitration/${newId}/alice`);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "0px",
        }}
      >
        <img src="/logo-color.png" style={{}} width="500px"></img>
        <h3
          style={{
            color: "white",
            width: "80%",
            textAlign: "center",
            opacity: "30%",
          }}
        >
          powered by AI
        </h3>
        <p
          style={{
            color: "white",
            width: "80%",
            marginBottom: "8px",
            textAlign: "center",
          }}
        >
          You are Alice. You have a disagreement with Bob. Each of you get a
          chance to present your case.
        </p>

        <Button onClick={createArbitration}>Start argument...</Button>
      </div>
    </>
  );
}

export default Home;
