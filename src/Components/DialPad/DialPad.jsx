import { Box, Modal, Paper, Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import DialScreen from "./DialScreen";

import JsSIP from "jssip";
import { useSelector, useDispatch } from "react-redux";
import CallScreen from "./CallScreen";
import CallingScreen from "./CallingScreen";
import IncommingMinimizeScreen from "./IncommingMinimizeScreen";
import MinimizeCallScreen from "./MinimizeCallScreen";
import ContactModal from "./ContactModal";
import { setPhonenumber } from "../../store/phonenumberSlice";
const DialPad = (props) => {
  const { open, setOpen } = props;
  const [openContactList, setOpenContactList] = useState(false);
  const [isMiniOpen, setIsMiniOpen] = useState(false);
  const phonenumber = useSelector((state) => state.phonenumber.phonenumber);
  const dispatch = useDispatch();
  const [callState, setCallState] = useState(null);
  //useState("Connected");
  const [displayName, setDisplayName] = useState("");
  const [ua, setUA] = useState(null);
  //const [session, setSession] = useState(null);
  const [callTime, setCallTime] = useState(null);
  const [isMute, setIsMute] = useState(false);
  const [isHold, setIsHold] = useState(false);
  const audio = new window.Audio();
  const [activeCalls, setActiveCalls] = useState([]);

  // useState([
  //   { call: null, hold: true, phonenumber: "+9106619122" },
  //   { call: null, hold: false, phonenumber: "+9106619122" },
  //   { call: null, hold: true, phonenumber: "+9106619122" },
  //   { call: null, hold: true, phonenumber: "+9106619122" },
  //   { call: null, hold: true, phonenumber: "+9106619122" },
  // ]);
  const [incommingSession, setIncommingSession] = useState(null);
  const [outgoingSession, setOutgoingSession] = useState(null);

  const muteHandler = () => {
    if (isMute) {
      //session.unmute();

      setIsMute(false);
    } else {
      //session.mute();

      setIsMute(true);
    }
  };

  const holdHandler = () => {
    if (isHold) {
      // Unhold logic
      setActiveCalls((state) => {
        return state.map((item) => ({ ...item, hold: false }));
      });
      // Uncomment the following line if you have a session object
      // session.unhold();
      setIsHold(false);
    } else {
      // Hold logic
      setActiveCalls((state) => state.map((item) => ({ ...item, hold: true })));
      // Uncomment the following line if you have a session object
      // session.hold();
      setIsHold(true);
    }
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
    };

    const userAgent = new JsSIP.UA(configration);

    if (!userAgent.isRegistered()) userAgent.register();

    userAgent.start();

    userAgent.on("connected", function (e) {
      console.log("user connected", e);
    });
    userAgent.on("disconnected", function (e) {
      console.log("user disconnected", e);
    });

    userAgent.on("registrationFailed", function (e) {
      console.log("user registrationFailed", e);
    });

    userAgent.on("newRTCSession", (data) => {
      console.log("rct sessiton", data);
      const newSession = data.session;

      //setDisplayName(data.session.remote_identity.display_name || "Unknown");

      if (newSession._direction === "incoming") {
        setIncommingSession(newSession);
        if (!open) setIsMiniOpen(true);
        setCallState("incomming");

        setDisplayName(data.session.remote_identity.display_name || "Unknown");

        newSession.on("accepted", () => {
          setActiveCalls((state) => {
            return [
              { call: newSession, hold: false, phonenumber: phonenumber },
              ...state.map((item) => {
                item.call.hold();
                return { ...item, hold: true };
              }),
            ];
          });
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
        setCallState("outgoing");
        newSession.on("progress", () => {
          setCallState("calling");
        });
        newSession.on("accepted", () => {
          console.log("accept");

          setActiveCalls((state) => {
            return [
              { call: newSession, hold: false, phonenumber: phonenumber },
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
        setActiveCalls((state) => {
          // Use the functional form of setState to ensure the latest state
          const updatedState = state.filter((c) => newSession._id !== c.call._id);

          // Log the updated state
          console.log(updatedState, "after ac");

          return updatedState;
        });
      });

      newSession.on("failed", () => {
        setActiveCalls((state) => state.filter((c) => newSession._id !== c.call._id));
      });
      newSession.on("addstream", function (e) {
        const hiddenAudio = audio;
        hiddenAudio.src = window.URL.createObjectURL(e.stream);
        hiddenAudio.play();
      });
    });
    setUA(userAgent);

    return () => {
      userAgent.stop();
    };
  }, []);

  const makeCall = (number = phonenumber) => {
    if (!number) return;
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
      console.log(number, "phonenumber st call");
      console.log(newSession, "newsession");
    }
  };

  const acceptCall = () => {
    debugger;
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
    setCallTime(1);
  };

  const rejectCall = () => {
    if (incommingSession) {
      incommingSession.terminate();
      setCallState("Call Rejected");
      setIncommingSession(null);
      setCallTime(null);
      setIsMiniOpen(false);
    }
  };

  const endCall = () => {
    activeCalls.forEach((item) => {
      item.call.terminate();
    });
    setActiveCalls([]);

    setCallState(null);
    setOpen(false);
    setCallTime(null);
    setIsMiniOpen(false);
  };

  const addCallHanddler = (user) => {
    console.log(user);
    dispatch(setPhonenumber(user.phone.substring(3)));
    makeCall(user.phone.substring(3));
  };

  const currentCallEnd = (item) => {
    if (!item.call.isEnded()) item.call.terminate();
    //setActiveCalls((state) => state.filter((c) => item.call._id !== c.call._id));
  };

  const currentCallHold = (item) => {
    setActiveCalls((state) => {
      if (item.call.isOnHold().local) {
        return state.map((callItem) => {
          if (item.call._id === callItem.call._id) {
            callItem.call.unhold();
            return { ...callItem, hold: false };
          } else {
            callItem.call.hold();
            return { ...callItem, hold: true };
          }
        });
      } else {
        return state.map((callItem) => {
          if (item.call._id === callItem.call._id) {
            callItem.call.hold();
            return { ...callItem, hold: true };
          } else {
            return callItem;
          }
        });
      }
    });
  };

  const fullScreenCalling = () => {
    setOpen(true);
    setIsMiniOpen(false);
  };

  const resetState = () => {
    setCallState(null);
    setDisplayName("");
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width:
      // isTransfer || isAddCall ?
      350,
    // : 350
    height:
      // isTransfer || isAddCall ?
      //"75vh":
      "89vh",
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
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'>
        <Paper elevation={3} sx={style}>
          <Modal open={openContactList} onClose={() => setOpenContactList(false)}>
            <Box display='flex' justifyContent='center' alignItems='center' height='100vh'>
              <ContactModal
                btnText='call'
                addCallHanddler={addCallHanddler}
                setOpenContactList={setOpenContactList}
              />
            </Box>
          </Modal>
          <Box>
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

            {!callState && <DialScreen makeCall={makeCall} />}
            {callState === "incomming" && (
              <CallScreen
                acceptCall={acceptCall}
                rejectCall={rejectCall}
                displayName={displayName}
              />
            )}

            {callState === "Connected" && (
              <CallingScreen
                callTime={callTime}
                onEndCall={endCall}
                displayName={displayName}
                isMute={isMute}
                isHold={isHold}
                muteHandler={muteHandler}
                holdHandler={holdHandler}
                setOpenContactList={setOpenContactList}
                isMultipleCall={activeCalls.length > 1}
                activeCalls={activeCalls}
                currentCallEnd={currentCallEnd}
                currentCallHold={currentCallHold}
              />
            )}
            {callState === "calling" && (
              <CallScreen type='outgoing' rejectCall={endCall} displayName={displayName} />
            )}
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
            openFullScreen={() => {
              setIsMiniOpen(false);
              setOpen(true);
            }}
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
          />
        )}
      </Box>
    </Box>
  );
};

export default DialPad;
