import { Box, ButtonBase, Grid, Stack, Typography } from "@mui/material";
//import CallIcon from "../../Images/Call.png";
// import MuteIcon from "../../Images/Mute.png";
// import KeyPadIcon from "../../Images/Keypad.png";
// import RecordIcon from "../../Images/Record.png";
// import AddCallIcon from "../../Images/AddCall.png";
// import HoldIcon from "../../Images/Hold.png";
// import TransferIcon from "../../Images/TransferCall.png";
// import UnMuteIcon from "../../Images/UnMute.png";
// import ActiveKeyPadIcon from "../../Images/ActiveKeyPad.png";
// import ActiveRecordIcon from "../../Images/ActiveRecord.png";
// import ActiveAddCallIcon from "../../Images/ActiveAdd.png";
// import UnHoldIcon from "../../Images/UnHold.png";
// import ActiveTransferIcon from "../../Images/ActiveTransfer.png";
//import CallEndIconImg from "../../Images/DisConnected.png";
import KeyPad from "./KeyPad";
import { useState } from "react";
import CallEndIcon from "@mui/icons-material/CallEnd";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SwapCallsIcon from "@mui/icons-material/SwapCalls";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import DialpadIcon from "@mui/icons-material/Dialpad";
import AddIcon from "@mui/icons-material/Add";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import DialScreen from "./DialScreen";
import CallScreen from "./CallScreen";
const CallingScreen = (props) => {
  const {
    acceptCall,
    rejectCall,
    displayName,
    callState,
    onEndCall,
    callTime,
    muteHandler,
    holdHandler,
    isMute,
    isHold,
    isMultipleCall,
    activeCalls,
    currentCallEnd,
    currentCallHold,
    swapcallsHandler,
    makeCall,
    setContectData,
    sendDTMFHandler,
    isCallingScreen,
  } = props;
  console.log(isMultipleCall, "mul");
  const [isRecord, setIsRecord] = useState(false);
  const [isKeyPad, setIsKeyPad] = useState(false);

  const TimeFormat = (time) => {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    return minutes + ":" + seconds;
  };
  console.log(props);

  return (
    <Grid container height='85vh'>
      <Grid item xs={isMultipleCall ? 6 : 12} height='100%'>
        {!callState && <DialScreen makeCall={makeCall} />}
        {callState === "incomming" && (
          <CallScreen acceptCall={acceptCall} rejectCall={rejectCall} displayName={displayName} />
        )}
        {(callState === "Connected" || callState === "calling") && (
          <Box sx={{ color: "black", textAlign: "center", padding: "2rem 0", height: "100%" }}>
            {!isKeyPad && (
              <Box position='relative' height='100%'>
                {!isMultipleCall && (
                  <Box>
                    <Typography sx={{ fontSize: 30 }}>
                      {callState === "Connected" ? activeCalls[0]?.name : "Unknown"}
                    </Typography>
                    <Typography sx={{ color: "#87909B", fontSize: "0.8rem" }}>
                      {callState === "Connected"
                        ? `Connected · ${TimeFormat(callTime)}`
                        : "Calling..."}
                    </Typography>
                  </Box>
                )}
                {isMultipleCall && (
                  <Box>
                    <Typography sx={{ fontSize: 30 }}>
                      {activeCalls.length} Calls Connected
                    </Typography>
                    <Typography sx={{ color: "#87909B", fontSize: "0.8rem" }}>
                      {callState === "Connected"
                        ? `Connected · ${TimeFormat(callTime)}`
                        : "Calling..."}
                    </Typography>
                  </Box>
                )}

                <Box position='absolute' bottom='1rem'>
                  <Grid
                    container
                    spacing={4}
                    sx={{
                      marginTop: "1rem",
                      padding: "0rem 3rem",
                    }}>
                    <Grid item xs={4}>
                      <Stack>
                        <ButtonBase
                          disabled={callState !== "Connected"}
                          sx={{
                            borderRadius: "50%",
                            border: isMute ? "1px solid #4F722D" : "1px solid #DDE0E4",
                            backgroundColor: "#F9FAFB",
                            padding: "1rem",
                          }}
                          onClick={muteHandler}>
                          {isMute ? (
                            <MicOffIcon sx={{ color: "#4F722D", fontSize: 32 }} />
                          ) : (
                            <MicIcon sx={{ color: "#1F2124", fontSize: 32 }} />
                          )}
                        </ButtonBase>
                        <Typography sx={{ fontSize: "0.9rem", marginTop: "0.5rem" }} whiteSpace="nowrap">
                          {isMute
                            ? isMultipleCall
                              ? "Unmute all"
                              : "Unmute"
                            : isMultipleCall
                            ? "Mute all"
                            : "Mute"}
                        </Typography>
                      </Stack>
                    </Grid>
                    {activeCalls.length === 2 && (
                      <Grid item xs={4}>
                        <Stack>
                          <ButtonBase
                            disabled={callState !== "Connected"}
                            sx={{
                              borderRadius: "50%",
                              border: "1px solid #DDE0E4",
                              backgroundColor: "#F9FAFB",
                              padding: "1rem",
                            }}
                            onClick={swapcallsHandler}>
                            <SwapCallsIcon sx={{ color: "#1F2124", fontSize: 32 }} />
                          </ButtonBase>
                          <Typography sx={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
                            Swap
                          </Typography>
                        </Stack>
                      </Grid>
                    )}
                    <Grid item xs={4}>
                      <Stack>
                        <ButtonBase
                          disabled={callState !== "Connected"}
                          sx={{
                            borderRadius: "50%",
                            border: "1px solid #DDE0E4",
                            backgroundColor: "#F9FAFB",
                            padding: "1rem",
                          }}
                          onClick={() => setContectData({ isOpen: true, buttonText: "Transfer" })}>
                          <SyncAltIcon sx={{ color: "#1F2124", fontSize: 32 }} />
                        </ButtonBase>
                        <Typography sx={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
                          Transfer
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={4}>
                      <Stack>
                        <ButtonBase
                          disabled={callState !== "Connected"}
                          sx={{
                            borderRadius: "50%",
                            border: isKeyPad ? "1px solid #4F722D" : "1px solid #DDE0E4",
                            backgroundColor: "#F9FAFB",
                            padding: "1rem",
                          }}
                          onClick={() => setIsKeyPad((state) => !state)}>
                          <DialpadIcon sx={{ color: "#1F2124", fontSize: 32 }} />
                        </ButtonBase>

                        <Typography sx={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
                          Keypad
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={4}>
                      <Stack>
                        <ButtonBase
                          disabled={callState !== "Connected" && isHold && isMultipleCall}
                          sx={{
                            borderRadius: "50%",
                            border: isHold ? "1px solid #4F722D" : "1px solid #DDE0E4",
                            backgroundColor: "#F9FAFB",
                            padding: "1rem",
                          }}
                          onClick={holdHandler}>
                          <PauseIcon sx={{ color: isHold ? "#4F722D" : "#1F2124", fontSize: 32 }} />
                        </ButtonBase>
                        <Typography sx={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
                          {isHold
                            ? isMultipleCall
                              ? ""
                              : "Unhold"
                            : isMultipleCall
                            ? "Hold all"
                            : "Hold"}
                        </Typography>
                      </Stack>
                    </Grid>
                    {!isMultipleCall && (
                      <Grid item xs={4}>
                        <Stack>
                          <ButtonBase
                            disabled={callState !== "Connected" && isHold && isMultipleCall}
                            sx={{
                              borderRadius: "50%",
                              border: isRecord ? "1px solid #4F722D" : "1px solid #DDE0E4",
                              backgroundColor: "#F9FAFB",
                              padding: "1rem",
                            }}
                            onClick={() => setIsRecord((state) => !state)}>
                            <RadioButtonCheckedIcon
                              sx={{ color: isRecord ? "#4F722D" : "#1F2124", fontSize: 32 }}
                            />
                          </ButtonBase>

                          <Typography sx={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
                            Record
                          </Typography>
                        </Stack>
                      </Grid>
                    )}
                    <Grid item xs={4}>
                      <Stack>
                        <ButtonBase
                          disabled={callState !== "Connected"}
                          sx={{
                            borderRadius: "50%",
                            border: "1px solid #DDE0E4",
                            backgroundColor: "#F9FAFB",
                            padding: "1rem",
                          }}
                          onClick={() => setContectData({ isOpen: true, buttonText: "Call" })}>
                          <AddIcon sx={{ color: "#1F2124", fontSize: 32 }} />
                        </ButtonBase>

                        <Typography sx={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
                          Add
                        </Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                  <Box
                    sx={{
                      margin: "1rem",
                    }}>
                    <ButtonBase
                      sx={{
                        borderRadius: "50%",
                        backgroundColor: "#E81313",
                        padding: "1.3rem",
                        ":disabled": {
                          backgroundColor: "#8f5454",
                        },
                      }}
                      onClick={onEndCall}>
                      <CallEndIcon sx={{ color: "#FFFFFE", fontSize: 40 }} />
                    </ButtonBase>
                  </Box>
                </Box>
              </Box>
            )}
            {isKeyPad && (
              <KeyPad
                callState={callState}
                onHide={() => setIsKeyPad(false)}
                makeCall={makeCall}
                sendDTMFHandler={sendDTMFHandler}
              />
            )}
          </Box>
        )}
      </Grid>
      <Grid item xs={isMultipleCall ? 6 : 0}>
        {isMultipleCall && (
          <Box>
            <Box
              height='100%'
              overflow='scroll'
              sx={{
                msOverflowStyle: "none",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
              }}>
              {activeCalls.map((item) => (
                <Box
                  display='flex'
                  justifyContent='space-between'
                  backgroundColor='#F9FAFB'
                  border= "1px solid #DDE0E4"
                  margin='0.2rem'
                  padding='0.3rem'
                  borderRadius='0.2rem'>
                  <Box sx={{ textAlign: "left" }}>
                    <Typography>{item.name}</Typography>
                    <Typography>{item.phonenumber}</Typography>
                  </Box>
                  <Box>
                    <ButtonBase
                      onClick={() => {
                        currentCallHold(item);
                      }}
                      sx={{
                        margin: "0.5rem",
                      }}>
                      {item.hold ? (
                        <PlayArrowIcon sx={{ color: "black" }} />
                      ) : (
                        <PauseIcon sx={{ color: "black" }} />
                      )}
                    </ButtonBase>
                    <ButtonBase
                      onClick={() => {
                        currentCallEnd(item);
                      }}
                      sx={{
                        margin: "0.5rem",
                      }}>
                      <CallEndIcon
                        sx={{
                          backgroundColor: "red",
                          color: "white",
                          padding: "0.2rem 0.5rem",
                          borderRadius: "0.5rem",
                        }}
                      />
                    </ButtonBase>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Grid>
    </Grid>
  );
};

export default CallingScreen;
