import React, { Component, useEffect, useState } from "react";
import Moment from "react-moment";
import moment from "moment";
import { Row, FormText, Button } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroller";
import axios from "axios";
import config from "../../services/config.js";
import { LoopCircleLoading } from "react-loadingg";
import _, { set } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faEdit,
  faSortUp,
  faSortDown,
} from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";

function Arbitration(props) {
  const { id, user } = useParams(); // Destructure the 'id' parameter from the URL

  const [opponent, setOpponent] = useState(user === "alice" ? "bob" : "alice");
  const [arbitration, setArbitration] = useState(null);
  const [userDisplay, setUserDisplay] = useState(null);
  const [background, setBackground] = useState("");
  const [yourArgument, setYourArgument] = useState("");
  const [opponentArgument, setOpponentArgument] = useState("");
  const [backgroundAgreed, setBackgroundAgreed] = useState(false);
  const [readyAndWaiting, setReadyAndWaiting] = useState(false);

  useEffect(() => {
    if (arbitration) {
      setReadyAndWaiting(
        arbitration.background_approved &&
          arbitration.bob_argument &&
          arbitration.alice_argument &&
          !arbitration.arbiter_decision
      );
    }
  }, [arbitration]);

  let loadArbitration = async (initial) => {
    try {
      let resp = await axios.get(`${config.apiHost}/public/arbitrations/${id}`);
      setArbitration(resp.data);

      if (initial) {
        setYourArgument(resp.data[`${user}_argument`]);
        setOpponentArgument(resp.data[`${opponent}_argument`]);
        setBackground(resp.data.background);
      }

      setBackgroundAgreed(resp.data.background_approved);
      if (user === "bob") {
        setBackground(resp.data.background);
      }
      setOpponentArgument(resp.data[`${opponent}_argument`]);

      setBackgroundAgreed(resp.data.background_approved);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    loadArbitration(true);
  }, [id]);

  // Periodically poll the API to get updated arbitration data
  useEffect(() => {
    if (id) {
      loadArbitration();
      const interval = setInterval(loadArbitration, 1000); // Poll every so often
      return () => clearInterval(interval);
    }
  }, [id]);

  const handleBackground = async () => {
    if (user === "alice") {
      handleSubmitBackground();
    } else if (user === "bob") {
      handleAgreeBackground(true);
    }
  };
  const handleClearBackground = async () => {
    handleAgreeBackground(false);
  };

  const handleSubmitBackground = async () => {
    try {
      await axios.put(`${config.apiHost}/public/arbitrations/${id}`, {
        background: background,
        // all edits invalidate the background agreement
        background_approved: false,
      });
    } catch (error) {
      console.error("Error agreeing to background:", error);
    }
  };

  const handleAgreeBackground = async (value) => {
    try {
      setBackgroundAgreed(value);
      await axios.put(`${config.apiHost}/public/arbitrations/${id}`, {
        background_approved: value,
      });
    } catch (error) {
      console.error("Error agreeing to background:", error);
    }
  };

  const handleSubmitArgument = async () => {
    if (arbitration.backgroundAgreed && arbitration[`${opponent}_argument`]) {
      setReadyAndWaiting(true);
    }
    try {
      await axios.put(`${config.apiHost}/public/arbitrations/${id}`, {
        [`${user}_argument`]: yourArgument,
      });
    } catch (error) {
      console.error("Error submitting argument:", error);
    }
  };

  useEffect(() => {
    if (user === "alice") {
      setUserDisplay("Alice");
    } else if (user === "bob") {
      setUserDisplay("Bob");
    }
  }, [user]);

  return (
    <>
      <h1>{`You are ${userDisplay}.`}</h1>
      {arbitration ? (
        <>
          <div>
            <h2>Background & Context</h2>
            <textarea
              value={background}
              onChange={(e) => setBackground(e.target.value)}
              disabled={arbitration.background_approved || user === "bob"}
            />
            {!arbitration.background_approved ? (
              <>
                {user === "alice" && (
                  <>
                    {!arbitration.background_approved && (
                      <Button
                        onClick={handleBackground}
                        disabled={
                          background === "" ||
                          arbitration.background === background
                        }
                      >
                        Submit for Bob's Approval
                      </Button>
                    )}
                  </>
                )}
                {user === "bob" && (
                  <>
                    {!arbitration.background_approved && (
                      <Button onClick={handleBackground}>
                        Agree to Background
                      </Button>
                    )}
                  </>
                )}
              </>
            ) : (
              <Button onClick={handleClearBackground}>Clear</Button>
            )}
          </div>

          <div>
            <h2>Your Argument</h2>
            <textarea
              value={yourArgument}
              onChange={(e) => setYourArgument(e.target.value)}
            />
            <button
              onClick={handleSubmitArgument}
              disabled={
                yourArgument === "" ||
                yourArgument === arbitration[`${user}_argument`]
              }
            >
              Submit Argument
            </button>
          </div>

          {arbitration?.background_approved && (
            <div>
              <h2>Opponent's Argument</h2>
              <textarea value={opponentArgument} readOnly />
            </div>
          )}

          <div>
            <h3>Share this URL with your opponent:</h3>
            <input
              type="text"
              value={`${window.location.origin}/arbitration/${id}/${opponent}`}
              readOnly
            />
          </div>

          {readyAndWaiting && <LoopCircleLoading />}
          {arbitration.arbiter_decision && (
            <div>
              <h3>Decision</h3>
              <p>{arbitration.arbiter_decision}</p>
            </div>
          )}
        </>
      ) : (
        <LoopCircleLoading />
      )}
    </>
  );
}

export default Arbitration;
