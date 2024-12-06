import React, { Component, useEffect, useState, useRef, useMemo } from "react";
import Moment from "react-moment";
import moment from "moment";
import { Row, Col, Button } from "react-bootstrap";
import TextareaAutosize from "react-textarea-autosize";
import FormWizard from "react-form-wizard-component";
import "react-form-wizard-component/dist/style.css";
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
import ReactMarkdown from "react-markdown";

function SectionTitle({
  children,
  secondary,
  isActive,
  onEdit,
  loading,
  final,
}) {
  return (
    <>
      <Row>
        <Col className="text-start text-primary">
          <strong>{children}</strong>{" "}
          {onEdit && !isActive && !final && (
            <FontAwesomeIcon
              style={!loading ? { cursor: "pointer" } : { opacity: "20%" }}
              icon={faEdit}
              onClick={onEdit}
            />
          )}
        </Col>
      </Row>
      {isActive && secondary && (
        <Row>
          <Col className="text-start text-secondary">{secondary}</Col>
        </Row>
      )}
    </>
  );
}

function BackgroundStory({
  arbitration,
  background,
  setBackground,
  user,
  handleBackground,
  handleClearBackground,
  isActive,
  loading,
}) {
  let randomArgument = () => {
    const randomBackground = [
      "Bob and I are coworkers and we are having a disagreement about",
      "Bob and I are life-long friends, but recently we've been arguing about",
      "Bob is my Pokemon rival. He deliberately chose the starter Pokemon that is strong against mine, and now we are arguing about",
      "Bob and I are married. Bob thinks he is right, but I know that I am right about",
      "Bob is a stranger I just met on the street who feels strongly about",
    ];

    const randomTopic = [
      "the best way to implement a new feature in our codebase.",
      "the best way to cook a steak.",
      "how it's not fair that Bob always wins when we battle.",
      "the best way to handle a difficult customer.",
      "how to split the chores in our apartment.",
    ];

    const randomRequest = [
      "Please help us decide...",
      "If you don't fix this problem, I'm worried one of us will quit and...",
      "We need an impartial third party to help us decide...",
      "Our friendship is on the line, and we need help...",
    ];

    return (
      randomBackground[Math.floor(Math.random() * randomBackground.length)] +
      " " +
      randomTopic[Math.floor(Math.random() * randomTopic.length)] +
      " " +
      randomRequest[Math.floor(Math.random() * randomRequest.length)]
    );
  };

  const [exampleArgument, setExampleArgument] = useState("");

  useEffect(() => {
    if (exampleArgument === "") {
      setExampleArgument(randomArgument());
    }

    const interval = setInterval(() => {
      setExampleArgument(randomArgument()); // Perform the action
    }, 7500);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div>
      <SectionTitle
        secondary={
          "Alice will briefly describe the situation and Bob will have to agree to the background description you have given before you can both present your arguments."
        }
        isActive={isActive}
        onEdit={handleClearBackground}
        loading={loading}
        final={arbitration?.final}
      >
        Background & Context
      </SectionTitle>
      <Row>
        <Col>
          <TextareaAutosize
            className="form-control textarea-custom"
            minRows={4}
            maxRows={10}
            style={{ resize: "none" }}
            value={background}
            onChange={(e) => setBackground(e.target.value)}
            disabled={arbitration?.background_approved || user === "bob"}
            placeholder={exampleArgument}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          {!arbitration?.background_approved ? (
            <>
              {user.includes("alice") && (
                <>
                  {arbitration?.background === "" ||
                  arbitration?.background !== background ? (
                    <Button onClick={handleBackground}>
                      {user === "alice" ? "Submit for Bob's Approval" : "Next"}
                    </Button>
                  ) : (
                    <>
                      <Row style={{ marginBottom: "16px" }}>
                        <Col>
                          <p className="text-secondary">
                            Waiting for Bob's Approval
                          </p>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <div style={{ position: "relative" }}>
                            <div
                              style={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                zIndex: 1,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                width: "100%", // Ensures spinner aligns to full width of container
                                height: "100%", // Optional, ensures full vertical alignment
                              }}
                            >
                              <LoopCircleLoading />
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </>
                  )}
                </>
              )}
              {user === "bob" && (
                <>
                  {arbitration?.background &&
                  !arbitration?.background_approved ? (
                    <Button onClick={handleBackground}>Accept</Button>
                  ) : (
                    <>
                      <Row style={{ marginBottom: "16px" }}>
                        <Col>
                          <p className="text-secondary">Waiting for Alice</p>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <div style={{ position: "relative" }}>
                            <div
                              style={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                zIndex: 1,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                width: "100%", // Ensures spinner aligns to full width of container
                                height: "100%", // Optional, ensures full vertical alignment
                              }}
                            >
                              <LoopCircleLoading />
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </>
                  )}
                </>
              )}
            </>
          ) : null}
        </Col>
      </Row>
    </div>
  );
}

function Arguments({
  arbitration,
  aliceArgument,
  setAliceArgument,
  bobArgument,
  setBobArgument,
  handleSubmitArgument,
  handleClearArgument,
  user,
  isActive,
  loading,
}) {
  let randomArgument = (opponentDisplay) => {
    const randomClaim = [
      "I am right about",
      `${opponentDisplay} is wrong about`,
      "I have the best idea for",
      "I have the best solution for",
      "I have the best strategy for",
    ];

    const randomTopic = [
      "how to implement a new feature in our codebase,",
      "how to cook a steak,",
      `why ${opponentDisplay} should let me win when we battle,`,
      "how to handle a difficult customer,",
      "how to split the chores in our apartment,",
    ];

    const randomReason = [
      "because...",
      "and here's why...",
      "and here's my evidence...",
      "and here's my reasoning...",
      "and here's my argument...",
    ];

    return (
      randomClaim[Math.floor(Math.random() * randomClaim.length)] +
      " " +
      randomTopic[Math.floor(Math.random() * randomTopic.length)] +
      " " +
      randomReason[Math.floor(Math.random() * randomReason.length)]
    );
  };

  const [exampleAliceArgument, setExampleAliceArgument] = useState("");
  const [exampleBobArgument, setExampleBobArgument] = useState("");
  const [minAliceRows, setAliceMinRows] = useState(4);
  const [minBobRows, setBobMinRows] = useState(4);

  useEffect(() => {
    if (exampleAliceArgument === "") {
      setExampleAliceArgument(randomArgument("Bob"));
      setExampleBobArgument(randomArgument("Alice"));
    }

    const interval = setInterval(() => {
      setExampleAliceArgument(randomArgument("Bob")); // Perform the action
      setExampleBobArgument(randomArgument("Alice"));
    }, 7500);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div>
      <SectionTitle
        secondary={"Present your argument to defend your position."}
        isActive={isActive}
        onEdit={() => handleClearArgument(user)}
        loading={loading}
        final={arbitration?.final}
      >
        Arguments
      </SectionTitle>
      <Row>
        <Col md={6} xs={12}>
          <Row>
            <Col className="text-start text-primary">Alice</Col>
          </Row>
          <TextareaAutosize
            className="form-control textarea-custom"
            minRows={minAliceRows}
            maxRows={10}
            onHeightChange={(height, meta) => {
              const rows = (height - 22) / meta.rowHeight;
              // the longer of the two arguments should set the min rows
              if (bobArgument?.length < aliceArgument?.length) {
                setBobMinRows(rows);
              }
            }}
            style={{ resize: "none" }}
            value={aliceArgument}
            onChange={(e) => setAliceArgument(e.target.value)}
            // disabled={arbitration.background_approved || user === "bob"}
            placeholder={user.includes("alice") && exampleAliceArgument}
            disabled={!isActive || !user.includes("alice")}
          />
          {isActive &&
            user.includes("alice") &&
            arbitration?.alice_argument !== aliceArgument &&
            !loading && (
              <Row>
                <Col>
                  <Button
                    onClick={() => handleSubmitArgument("alice", aliceArgument)}
                  >
                    Submit
                  </Button>
                </Col>
              </Row>
            )}
        </Col>
        <Col md={6} xs={12}>
          <Row>
            <Col className="text-start text-primary">Bob</Col>
          </Row>
          <TextareaAutosize
            className="form-control textarea-custom"
            minRows={minBobRows}
            maxRows={10}
            onHeightChange={(height, meta) => {
              const rows = (height - 22) / meta.rowHeight;
              // the longer of the two arguments should set the min rows
              if (bobArgument?.length > aliceArgument?.length) {
                setAliceMinRows(rows);
              }
            }}
            style={{ resize: "none" }}
            value={bobArgument}
            onChange={(e) => setBobArgument(e.target.value)}
            placeholder={user.includes("bob") && exampleBobArgument}
            disabled={!isActive || !user.includes("bob")}
          />
          {isActive &&
            user.includes("bob") &&
            arbitration?.bob_argument !== bobArgument &&
            !loading && (
              <Row>
                <Col>
                  <Button
                    onClick={() => handleSubmitArgument("bob", bobArgument)}
                  >
                    Submit
                  </Button>
                </Col>
              </Row>
            )}
        </Col>
      </Row>
    </div>
  );
}

function Decision({ arbitration, handleAcceptFinal, isActive, loading }) {
  return (
    <div style={{ marginBottom: "10%" }}>
      <SectionTitle isActive={isActive} loading={loading}>
        Decision
      </SectionTitle>
      <Row>
        <Col>
          {arbitration?.arbiter_decision ? (
            <div className="markdown-body">
              <ReactMarkdown>{arbitration?.arbiter_decision}</ReactMarkdown>
            </div>
          ) : (
            <div style={{ position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 1,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%", // Ensures spinner aligns to full width of container
                  height: "100%", // Optional, ensures full vertical alignment
                }}
              >
                <LoopCircleLoading />
              </div>
            </div>
          )}
        </Col>
      </Row>
      {arbitration?.arbiter_decision && !arbitration?.final && !loading && (
        <Row>
          <Col>
            <Button onClick={() => handleAcceptFinal()}>
              Accept Final Decision
            </Button>
          </Col>
        </Row>
      )}
    </div>
  );
}

const CopyURL = ({ url }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset the message after 2 seconds
    });
  };

  return (
    <div className="d-flex align-items-center">
      <div className="me-2 text-truncate" style={{ maxWidth: "90%" }}>
        <span className="d-inline-block text-muted copy-url">{url}</span>
      </div>
      <button className="btn btn-outline-primary btn-sm" onClick={handleCopy}>
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
};

function Arbitration(props) {
  const { id, user } = useParams(); // Destructure the 'id' parameter from the URL

  const [opponent, setOpponent] = useState();
  const [arbitration, setArbitration] = useState(null);
  const [userDisplay, setUserDisplay] = useState(null);
  const [background, setBackground] = useState("");
  const [aliceArgument, setAliceArgument] = useState("");
  const [bobArgument, setBobArgument] = useState("");
  const [backgroundAgreed, setBackgroundAgreed] = useState(false);
  const [readyAndWaiting, setReadyAndWaiting] = useState(false);
  const [desiredIdx, setDesiredIdx] = useState(0);
  const [loading, setLoading] = useState(false);
  const wizard = useRef(null);

  useEffect(() => {
    if (user === "alice") {
      setOpponent("bob");
    } else if (user === "bob") {
      setOpponent("alice");
    }
  }, [user]);

  useEffect(() => {
    if (wizard?.current?.goToTab) {
      wizard.current.goToTab(desiredIdx);
    }
  }, [desiredIdx, wizard]);

  useEffect(() => {
    if (!arbitration) {
      setDesiredIdx(0);
      return;
    }
    if (
      arbitration?.final ||
      readyAndWaiting ||
      arbitration?.arbiter_decision
    ) {
      setDesiredIdx(2);
      return;
    }
    if (arbitration?.background_approved) {
      setDesiredIdx(1);
      return;
    }

    setDesiredIdx(0);
  }, [
    readyAndWaiting,
    arbitration,
    arbitration?.arbiter_decision,
    arbitration?.background_approved,
  ]);

  useEffect(() => {
    if (arbitration && arbitration?.arbiter_decision) {
      // we are no longer ready and waiting
      setReadyAndWaiting(false);
    }
  }, [
    arbitration,
    arbitration?.background_approved,
    arbitration?.bob_argument,
    arbitration?.alice_argument,
    arbitration?.arbiter_decision,
  ]);

  let loadArbitration = async (initial) => {
    try {
      let resp = await axios.get(
        `${config.apiHost}/public/arbitrations/${id}`,
        {
          validateStatus: (status) => {
            return (status >= 200 && status < 300) || status === 404;
          },
        }
      );
      if (resp.status === 404) {
        return;
      }
      setArbitration(resp.data);

      if (initial) {
        setAliceArgument(resp.data[`alice_argument`]);
        setBobArgument(resp.data[`bob_argument`]);
        setBackground(resp.data.background);
      }

      setBackgroundAgreed(resp.data.background_approved);
      if (user === "bob") {
        setBackground(resp.data.background);
      }
      // load the opponent's argument
      if (!user.includes("bob")) {
        setBobArgument(resp.data.bob_argument);
      } else if (!user.includes("alice")) {
        setAliceArgument(resp.data.alice_argument);
      }

      setBackgroundAgreed(resp.data.background_approved);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
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
    setLoading(true);
    if (user.includes("alice")) {
      handleSubmitBackground();
    }
    if (user.includes("bob")) {
      handleAgreeBackground(true);
    }
  };
  const handleClearBackground = async () => {
    setLoading(true);
    handleAgreeBackground(false);
  };

  const handleSubmitBackground = async () => {
    try {
      if (!arbitration) {
        await axios.post(`${config.apiHost}/public/arbitrations`, {
          id: id,
          background: background,
          background_approved: user === "alicebob",
        });
      } else {
        await axios.put(`${config.apiHost}/public/arbitrations/${id}`, {
          background: background,
          // all edits invalidate the background agreement
          background_approved: false,
        });
      }
    } catch (error) {
      console.error("Error agreeing to background:", error);
    } finally {
      setLoading(false);
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
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitArgument = (user, yourArgument) => {
    setLoading(true);
    let opponentArgument = arbitration[`${opponent}_argument`];
    if (!opponent) {
      if (user === "alice") {
        opponentArgument = arbitration?.bob_argument;
      } else if (user === "bob") {
        opponentArgument = arbitration?.alice_argument;
      }
    }

    if (arbitration?.background_approved && opponentArgument) {
      setReadyAndWaiting(true);
    }
    try {
      axios.put(`${config.apiHost}/public/arbitrations/${id}`, {
        [`${user}_argument`]: yourArgument,
      });
    } catch (error) {
      console.error("Error submitting argument:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearArgument = async (user) => {
    setLoading(true);
    try {
      if (user.includes("alice")) {
        await axios.put(`${config.apiHost}/public/arbitrations/${id}`, {
          [`alice_argument`]: "",
        });
      }
      if (user.includes("bob")) {
        await axios.put(`${config.apiHost}/public/arbitrations/${id}`, {
          [`bob_argument`]: "",
        });
      }
    } catch (error) {
      console.error("Error submitting argument:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptFinal = async () => {
    setLoading(true);
    try {
      await axios.put(`${config.apiHost}/public/arbitrations/${id}`, {
        final: true,
      });
    } catch (error) {
      console.error("Error accepting:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user === "alice") {
      setUserDisplay("Alice");
    } else if (user === "bob") {
      setUserDisplay("Bob");
    } else if (user === "alicebob") {
      setUserDisplay("Alice and Bob");
    }
  }, [user]);

  return (
    <>
      {!arbitration?.final ? (
        <>
          <h1>{`You are ${userDisplay}.`}</h1>
          {opponent && (
            <Row>
              <Col>
                <h3>Share this URL with your opponent:</h3>
                <CopyURL
                  url={`${window.location.origin}/arbitration/${id}/${opponent}`}
                />
              </Col>
            </Row>
          )}
        </>
      ) : (
        <h1>Alice and Bob had a disagreement:</h1>
      )}
      <FormWizard
        color="#165f65"
        ref={wizard}
        finishButtonTemplate={(finishFn) => {
          return null;
        }}
        nextButtonTemplate={(nextFn) => {
          return null;
        }}
        backButtonTemplate={(backFn) => {
          return null;
        }}
        disableBackOnClickStep={true}
        style={{}}
      >
        <FormWizard.TabContent title="Background" style={{}}>
          <Row>
            <Col>
              <BackgroundStory
                arbitration={arbitration}
                background={background}
                setBackground={setBackground}
                user={user}
                handleBackground={handleBackground}
                handleClearBackground={handleClearBackground}
                isActive={desiredIdx === 0}
                loading={loading}
              ></BackgroundStory>
            </Col>
          </Row>
        </FormWizard.TabContent>
        <FormWizard.TabContent title="Arguments" style={{}}>
          <Row>
            <Col>
              <Row>
                <Col>
                  <BackgroundStory
                    arbitration={arbitration}
                    background={background}
                    setBackground={setBackground}
                    user={user}
                    handleBackground={handleBackground}
                    handleClearBackground={handleClearBackground}
                    isActive={desiredIdx === 0}
                  ></BackgroundStory>
                </Col>
              </Row>

              <Row>
                <Col>
                  <Arguments
                    arbitration={arbitration}
                    aliceArgument={aliceArgument}
                    setAliceArgument={setAliceArgument}
                    bobArgument={bobArgument}
                    setBobArgument={setBobArgument}
                    user={user}
                    opponentDisplay={opponent}
                    handleSubmitArgument={handleSubmitArgument}
                    handleClearArgument={handleClearArgument}
                    isActive={desiredIdx === 1}
                  ></Arguments>
                </Col>
              </Row>
            </Col>
          </Row>
        </FormWizard.TabContent>
        <FormWizard.TabContent title="Final Decision" style={{}}>
          <Row>
            <Col>
              <Row>
                <Col>
                  <BackgroundStory
                    arbitration={arbitration}
                    background={background}
                    setBackground={setBackground}
                    user={user}
                    handleBackground={handleBackground}
                    handleClearBackground={handleClearBackground}
                    isActive={desiredIdx === 0}
                  ></BackgroundStory>
                </Col>
              </Row>

              <Row>
                <Col>
                  <Arguments
                    arbitration={arbitration}
                    aliceArgument={aliceArgument}
                    setAliceArgument={setAliceArgument}
                    bobArgument={bobArgument}
                    setBobArgument={setBobArgument}
                    user={user}
                    opponentDisplay={opponent}
                    handleSubmitArgument={handleSubmitArgument}
                    handleClearArgument={handleClearArgument}
                    isActive={desiredIdx === 1}
                  ></Arguments>
                </Col>
              </Row>

              <Row>
                <Col>
                  <Decision
                    arbitration={arbitration}
                    isActive={desiredIdx === 2}
                    loading={loading}
                    handleAcceptFinal={handleAcceptFinal}
                  ></Decision>
                </Col>
              </Row>
            </Col>
          </Row>
        </FormWizard.TabContent>
      </FormWizard>
    </>
  );
}

export default Arbitration;
