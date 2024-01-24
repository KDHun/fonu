import { Box, ButtonBase, Grid, Stack, Typography } from "@mui/material";
//import CallIcon from "../../Images/Call.png";
import MuteIcon from "../../Images/Mute.png";
import KeyPadIcon from "../../Images/Keypad.png";
import RecordIcon from "../../Images/Record.png";
import AddCallIcon from "../../Images/AddCall.png";
import CallEndIconImg from "../../Images/DisConnected.png";
import HoldIcon from "../../Images/Hold.png";
import TransferIcon from "../../Images/TransferCall.png";
import UnMuteIcon from "../../Images/UnMute.png";
import ActiveKeyPadIcon from "../../Images/ActiveKeyPad.png";
import ActiveRecordIcon from "../../Images/ActiveRecord.png";
import ActiveAddCallIcon from "../../Images/ActiveAdd.png";
import UnHoldIcon from "../../Images/UnHold.png";
import ActiveTransferIcon from "../../Images/ActiveTransfer.png";
import KeyPad from "./KeyPad";
import { useState } from "react";
import CallEndIcon from "@mui/icons-material/CallEnd";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
const CallingScreen = (props) => {
  const {
    onEndCall,
    displayName,
    callTime,
    muteHandler,
    holdHandler,
    isMute,
    isHold,
    isMultipleCall,
    setOpenContactList,
    activeCalls,
    currentCallEnd,
    currentCallHold
  } = props;

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
    <Box sx={{ color: "black", textAlign: "center", padding: "2rem 0" }}>
      {!isKeyPad && (
        <Box>
          {!isMultipleCall && (
            <Box>
              <Typography sx={{ fontSize: 30 }}>{displayName}</Typography>
              <Typography sx={{ color: "#87909B", fontSize: "0.8rem" }}>
                Connected ·{" " + TimeFormat(callTime)}
              </Typography>
            </Box>
          )}
          {isMultipleCall && (
            <Box>
              <Box
                height='20vh'
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
                    backgroundColor='#4F772D'
                    margin='0.2rem'
                    padding='0.3rem'
                    borderRadius='0.2rem'>
                    <Box sx={{color:"white"}}>
                      <Typography>Karabhai Hun</Typography>
                      <Typography>{item.phonenumber}</Typography>
                    </Box>
                    <Box>
                      <ButtonBase
                      onClick={()=>{currentCallHold(item)}}
                      sx={{
                        margin:"0.5rem"
                      }}>
                        {item.hold?<PlayArrowIcon sx={{color:"white"}}/>:<PauseIcon sx={{color:"white"}}/>}
                      </ButtonBase>
                      <ButtonBase
                       onClick={()=>{currentCallEnd(item)}}
                      sx={{
                        margin:"0.5rem"
                      }}>
                        <CallEndIcon sx={{  backgroundColor: "red", color:"white", padding:"0.2rem 0.5rem", borderRadius:"0.5rem"}} />
                      </ButtonBase>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
          <Box>
            <Grid
              container
              spacing={4}
              sx={{
                marginTop: "1rem",
                marginBottom: "1rem",
                padding: "3rem",
              }}>
              <Grid item xs={4}>
                <Stack sx={{ "&:hover": { cursor: "pointer" } }}>
                  <img src={isMute ? UnMuteIcon : MuteIcon} alt='' onClick={muteHandler} />{" "}
                  <Typography sx={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
                    {isMute ? "Unmute" : "Mute"}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={4}>
                <Stack sx={{ "&:hover": { cursor: "pointer" } }}>
                  <img
                    src={false ? ActiveTransferIcon : TransferIcon}
                    alt=''
                    //onClick={() => setIsTransfer((state) => !state)}
                  />{" "}
                  <Typography sx={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>Transfer</Typography>
                </Stack>
              </Grid>
              <Grid item xs={4}>
                <Stack sx={{ "&:hover": { cursor: "pointer" } }}>
                  <img
                    src={isKeyPad ? ActiveKeyPadIcon : KeyPadIcon}
                    alt=''
                    onClick={() => setIsKeyPad((state) => !state)}
                  />{" "}
                  <Typography sx={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>Keypad</Typography>
                </Stack>
              </Grid>
              <Grid item xs={4}>
                <Stack sx={{ "&:hover": { cursor: "pointer" } }}>
                  <img src={isHold ? UnHoldIcon : HoldIcon} alt='' onClick={holdHandler} />{" "}
                  <Typography sx={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
                    {isHold ? "Unhold" : "Hold"}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={4}>
                <Stack sx={{ "&:hover": { cursor: "pointer" } }}>
                  <img
                    src={isRecord ? ActiveRecordIcon : RecordIcon}
                    alt=''
                    onClick={() => setIsRecord((state) => !state)}
                  />{" "}
                  <Typography sx={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>Record</Typography>
                </Stack>
              </Grid>
              <Grid item xs={4}>
                <Stack sx={{ "&:hover": { cursor: "pointer" } }}>
                  <img
                    src={false ? ActiveAddCallIcon : AddCallIcon}
                    alt=''
                    onClick={() => setOpenContactList(true)}
                  />{" "}
                  <Typography sx={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>Add</Typography>
                </Stack>
              </Grid>
            </Grid>
            <Box sx={{ "&:hover": { cursor: "pointer" } }}>
              <img src={CallEndIconImg} alt='' onClick={onEndCall} />
            </Box>
          </Box>
        </Box>
      )}
      {isKeyPad && <KeyPad onHide={setIsKeyPad} />}
    </Box>
  );
};

export default CallingScreen;
