import { Box, Modal, Paper, Tooltip } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

import JsSIP from "jssip";
import { useSelector, useDispatch } from "react-redux";

import CallingScreen from "./CallingScreen";
import IncommingMinimizeScreen from "./IncommingMinimizeScreen";
import MinimizeCallScreen from "./MinimizeCallScreen";
import ContactModal from "./ContactModal";
import { setPhonenumber } from "../../store/phonenumberSlice";

const DialPad = (props) => {
  const { open, setOpen } = props;

  const [isMiniOpen, setIsMiniOpen] = useState(false);
  const phonenumber = useSelector((state) => state.phonenumber.phonenumber);
  const dispatch = useDispatch();
  const [callState, setCallState] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [ua, setUA] = useState(null);
  const [callTime, setCallTime] = useState(null);
  const [isMute, setIsMute] = useState(false);
  const [isHold, setIsHold] = useState(false);
  const audio = new window.Audio();
  const [activeCalls, setActiveCalls] = useState([]);
  const [incommingSession, setIncommingSession] = useState(null);
  const [outgoingSession, setOutgoingSession] = useState(null);
  const [ongoingCall, setOngoingCall] = useState(null);
  const [contectData, setContectData] = useState({
    isOpen: false,
    buttonText: "",
  });
  const isCallingScreen = useRef(false);
  console.log(activeCalls, "refer");

  const muteHandler = () => {
    if (isMute) {
      const updatedSessions = activeCalls.map((item) => {
        item.call.unmute();
        return item;
      });
      setActiveCalls(updatedSessions);
      setIsMute(false);
    } else {
      const updatedSessions = activeCalls.map((item) => {
        item.call.mute();
        return item;
      });
      setActiveCalls(updatedSessions);

      setIsMute(true);
    }
  };

  const holdHandler = () => {
    if (isHold) {
      if (activeCalls.length > 1) return;
      const updatedSessions = activeCalls.map((item) => {
        item.call.unhold();
        return { ...item, hold: false };
      });
      setActiveCalls(updatedSessions);
      setIsHold(false);
    } else {
      const updatedSessions = activeCalls.map((item) => {
        item.call.hold();
        return { ...item, hold: true };
      });
      setActiveCalls(updatedSessions);
      setIsHold(true);
    }
  };

  const swapcallsHandler = () => {
    let index;
    activeCalls.every((item, i) => {
      if (!item.hold) {
        index = i;
        return false;
      }
      return true;
    });
    if (index === undefined || index === null) return;
    const updatedCalls = activeCalls;
    updatedCalls[index].call.hold();
    updatedCalls[index].hold = true;
    updatedCalls[(index + 1) % updatedCalls.length].call.unhold();
    updatedCalls[(index + 1) % updatedCalls.length].hold = false;

    setActiveCalls(updatedCalls);
  };

  useEffect(() => {
    if (callTime === null) return;
    const timer = setTimeout(() => {
      setCallTime((state) => state + 1);
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [callTime]);

  useEffect(() => {
    if (activeCalls.length === 0) {
      setCallState(null);
      setCallTime(null);
      setIsMiniOpen(false);
      setOngoingCall(null);
    }
  }, [activeCalls]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    const socket = new JsSIP.WebSocketInterface("wss://callapi.efone.ca:7443");
    JsSIP.debug.enable("JsSIP:*");
    const configration = {
      sockets: [socket],
      uri: `sip:${userData.sip_username}@134.122.36.172`,
      password: userData.sip_password,
      register: true,
      session_timers: false,
      realm: "*",
      //display_name: userData.name,
    };

    const userAgent = new JsSIP.UA(configration);

    if (!userAgent.isRegistered()) userAgent.register();

    userAgent.start();

    const eventHandlers = {
      connected: (e) => {
        console.log("user connected", e);
      },
      disconnected: (e) => {
        console.log("user disconnected", e);
      },
      registrationFailed: (e) => {
        console.log("user registrationFailed", e);
      },
      newRTCSession: (data) => {
        console.log("rct sessiton", data);
        const newSession = data.session;
        if (newSession._direction === "incoming") {
          setCallState("incomming");
          setIncommingSession(newSession);
          if (!open) setIsMiniOpen(true);
          setDisplayName(data.session.remote_identity._display_name || "Unknown");

          newSession.on("accepted", () => {
            setOngoingCall({
              call: newSession,
              hold: false,
              phonenumber: newSession?._remote_identity?._uri?._user,
              name: newSession?._remote_identity?._display_name || "Unknown",
            });

            setActiveCalls((state) => {
              return [
                {
                  call: newSession,
                  hold: false,
                  phonenumber: newSession?._remote_identity?._uri?._user,
                  name: newSession?._remote_identity?._display_name || "Unknown",
                },
                ...state.map((item) => {
                  item.call.hold();
                  return { ...item, hold: true };
                }),
              ];
            });
            setIsHold(false);
            setIsMute(false);
            setCallState("Connected");
            setCallTime(1);
          });

          newSession.on("peerconnection", function (data) {
            data.peerconnection.addEventListener("addstream", function (e) {
              const remoteAudio = new window.Audio();
              remoteAudio.srcObject = e.stream;
              remoteAudio.play();
            });
          });
        } else if (newSession._direction === "outgoing") {
          setOutgoingSession(newSession);
          setCallState("calling");

          newSession.on("progress", () => {});
          newSession.on("accepted", () => {
            console.log("accept");
            setOngoingCall({
              call: newSession,
              hold: false,
              phonenumber: newSession?._remote_identity?._uri?._user,
              name: newSession?._remote_identity?._display_name || "Unknown",
            });
            isCallingScreen.current = false;
            setActiveCalls((state) => {
              return [
                {
                  call: newSession,
                  hold: false,
                  phonenumber: newSession?._remote_identity?._uri?._user,
                  name: newSession?._remote_identity?._display_name || "Unknown",
                },
                ...state.map((item) => {
                  item.call.hold();
                  return { ...item, hold: true };
                }),
              ];
            });

            setCallState("Connected");
            setCallTime(1);
          });

          newSession.connection.addEventListener("addstream", (event) => {
            const audio = document.createElement("audio");
            audio.srcObject = event.stream;
            audio.play();
          });
        }

        newSession.on("ended", () => {
          const updatedState = activeCalls.filter((c) => newSession._id !== c.call._id);

          if (newSession._id === ongoingCall?.call?._id) {
            setOngoingCall(updatedState[0]);
          }
          setActiveCalls((state) => {
            return state.filter((c) => newSession._id !== c.call._id);
          });
        });

        newSession.on("failed", () => {
          const updatedState = activeCalls.filter((c) => newSession._id !== c.call._id);

          if (newSession._id === ongoingCall?.call?._id) {
            setOngoingCall(updatedState[0]);
          }
          setActiveCalls((state) => {
            return state.filter((c) => newSession._id !== c.call._id);
          });
        });
        newSession.on("addstream", function (e) {
          const hiddenAudio = audio;
          hiddenAudio.src = window.URL.createObjectURL(e.stream);
          hiddenAudio.play();
        });
      },
    };

    Object.keys(eventHandlers).forEach((event) => {
      userAgent.on(event, eventHandlers[event]);
    });

    setUA(userAgent);

    return () => {
      Object.keys(eventHandlers).forEach((event) => {
        userAgent.off(event, eventHandlers[event]);
      });
      userAgent.stop();
    };
  }, []);

  const makeCall = (number = phonenumber) => {
    if (!number) return;
    isCallingScreen.current = true;
    setCallState("calling");
    if (ua) {
      const options = {
        mediaConstraints: { audio: true, video: false },
        sessionTimersExpires: 120,
        pcConfig: {
          iceServers: [
            {
              urls: ["stun:stun.ozekiphone.com:3478"],
            },
          ],
          iceTransportPolicy: "all",
          rtcpMuxPolicy: "negotiate",
        },
      };

      const newSession = ua.call(`sip:+91${number}@callapi.efone.ca`, options);
      setOutgoingSession(newSession);
      console.log(number, "phonenumber st call");
      console.log(newSession, "newsession");
    }
  };

  const acceptCall = () => {
    console.log("call answered");
    incommingSession.answer({
      mediaConstraints: { audio: true, video: false },
      sessionTimersExpires: 120,
      pcConfig: {
        iceServers: [
          {
            urls: ["stun:stun.ozekiphone.com:3478"],
          },
        ],
        iceTransportPolicy: "all",
        rtcpMuxPolicy: "negotiate",
      },
    });
    setCallTime(0);
  };

  const rejectCall = () => {
    if (incommingSession) {
      try {
        incommingSession.terminate();
      } catch (error) {
        console.log("Error in terminating Incomming call", error);
      }
      setIncommingSession(null);
      setCallTime(null);
      if (activeCalls.length === 0) {
        setCallState(null);
        setIsMiniOpen(false);
      } else {
        setCallState("Connected");
      }
    }
  };

  const endCall = () => {
    try {
      if (incommingSession) {
        incommingSession.terminate();
      }
    } catch (error) {
      console.log("Error in terminating call", error);
    }
    try {
      if (outgoingSession) {
        outgoingSession.terminate();
      }
    } catch (error) {
      console.log("Error in terminating call", error);
    }
    activeCalls.forEach((item) => {
      try {
        item.call.terminate();
      } catch (error) {
        console.log("Error in terminating call", error);
      }
    });
    setActiveCalls([]);
    setOngoingCall(null);
    setCallState(null);
    setOpen(false);
    setCallTime(null);
    setIsMiniOpen(false);
  };

  const addCallHandler = (user) => {
    console.log(user);
    dispatch(setPhonenumber(user.phone.substring(3)));
    makeCall(user.phone.substring(3));
  };

  const currentCallEnd = (item) => {
    try {
      if (!item.call.isEnded()) item.call.terminate();
    } catch (err) {
      console.log("Error in terminating call", err);
    }
  };

  const currentCallHold = (item) => {
    const updatedState = activeCalls.map((callItem) => {
      if (item.call._id === callItem.call._id) {
        const isOnHold = item.call.isOnHold().local;
        if (!isOnHold) {
          callItem.call.hold();
        } else {
          callItem.call.unhold();
        }
        return { ...callItem, hold: !isOnHold };
      } else {
        const isOnHold = callItem.call.isOnHold().local;
        if (!isOnHold) {
          callItem.call.hold();
        }
        return { ...callItem, hold: true };
      }
    });
    setActiveCalls(updatedState);

    // setOngoingCall((state) => {
    //   if (item.call._id === state.call._id) {
    //     return { ...state, hold: !state.hold };
    //   } else {
    //     return state;
    //   }
    // });
  };

  const fullScreenCalling = () => {
    setOpen(true);
    setIsMiniOpen(false);
  };

  const transferCallHandler = (user) => {
    console.log(activeCalls, "refer");
    console.log(ongoingCall, "refer2");
    if (ongoingCall && user.phone) {
      try {
        ongoingCall.call.refer(user.phone);
        const updatedState = activeCalls.filter((c) => ongoingCall.call._id !== c.call._id);
        if (updatedState.length === 0) {
          setCallState(null);
          setCallTime(null);
          setIsMiniOpen(false);
          setOngoingCall(null);
        } else {
          setOngoingCall(updatedState[0]);
          setActiveCalls(updatedState);
        }
      } catch (error) {
        console.error("Error during call transfer:", error);
      }
    }
    console.log(ongoingCall, "refer3");
    console.log(activeCalls, "refer1");
  };

  const sendDTMFHandler = (phoneNumber) => {
    const activeCallSession = activeCalls.find((call) => !call.hold)?.call;
    if (activeCallSession) {
      activeCallSession.sendDTMF(phoneNumber);
    }
  };
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width:
      activeCalls.length > 1
        ? 700
        : // isTransfer || isAddCall ?
          350,
    // : 350
    height:
      // isTransfer || isAddCall ?
      //"75vh":
      "90vh",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 2,
    "&:hover": {
      outline: "none",
    },
    "&:focus": {
      outline: "none",
    },
  };

  return (
    <Box>
      <Modal
        open={contectData.isOpen}
        onClose={() =>
          setContectData((state) => {
            return { ...state, isOpen: false };
          })
        }>
        <Box display='flex' justifyContent='center' alignItems='center' height='100vh'>
          <ContactModal
            {...contectData}
            setContectData={setContectData}
            transferCallHandler={transferCallHandler}
            addCallHandler={addCallHandler}
          />
        </Box>
      </Modal>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'>
        <Paper elevation={3} sx={style}>
          <Box height='100%'>
            <Box sx={{ textAlign: "end" }}>
              <Tooltip title='Minimize' placement='top'>
                <CloseIcon
                  sx={{ color: "#CACED3", "&:hover": { cursor: "pointer" } }}
                  onClick={() => {
                    setOpen(false);
                    if (callState) setIsMiniOpen(true);
                  }}
                />
              </Tooltip>
            </Box>

            <CallingScreen
              isCallingScreen={isCallingScreen.current}
              acceptCall={acceptCall}
              rejectCall={rejectCall}
              sendDTMFHandler={sendDTMFHandler}
              callState={callState}
              makeCall={makeCall}
              callTime={callTime}
              onEndCall={endCall}
              displayName={displayName}
              isMute={isMute}
              isHold={isHold}
              muteHandler={muteHandler}
              holdHandler={holdHandler}
              isMultipleCall={activeCalls.length > 1}
              activeCalls={activeCalls}
              currentCallEnd={currentCallEnd}
              currentCallHold={currentCallHold}
              swapcallsHandler={swapcallsHandler}
              setContectData={setContectData}
            />
          </Box>
        </Paper>
      </Modal>
      <Box sx={{ position: "fixed", bottom: 0, right: 0 }}>
        {isMiniOpen && callState === "incomming" && (
          <IncommingMinimizeScreen
            onAnswer={() => {
              acceptCall();
            }}
            onReject={() => {
              rejectCall();
              setIsMiniOpen(false);
            }}
            openFullScreen={fullScreenCalling}
          />
        )}
        {isMiniOpen && callState !== "incomming" && (
          <MinimizeCallScreen
            FullScreenCalling={fullScreenCalling}
            callTime={callTime}
            onEndCall={endCall}
            displayName={displayName}
            isMute={isMute}
            isHold={isHold}
            muteHandler={muteHandler}
            holdHandler={holdHandler}
            ongoingCall={ongoingCall}
            setContectData={setContectData}
          />
        )}
      </Box>
    </Box>
  );
};

export default DialPad;
