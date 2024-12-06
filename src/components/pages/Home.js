import React, { Component } from "react";
import { Button, Row, Col } from "react-bootstrap";
import config from "../../services/config.js";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";

function Home(props) {
  const navigate = useNavigate();

  const createArbitration = async (user) => {
    const newId = uuidv4();
    try {
      // await axios.post(`${config.apiHost}/public/arbitrations`, {
      //   id: newId,
      // });

      // route to the new arbitration
      navigate(`/arbitration/${newId}/${user}`);
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

        <h1 className="">You are Alice. You have a disagreement with Bob.</h1>

        <h3>Start an argument with...</h3>
        <Row>
          <Col>
            <Button
              className="text-nowrap"
              onClick={() => createArbitration("alice")}
            >
              Someone Else
            </Button>
          </Col>
          <Col>
            <Button onClick={() => createArbitration("alicebob")}>
              Myself
            </Button>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Home;
