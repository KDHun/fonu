import { Avatar, Box, ButtonBase, Grid, Stack, Typography } from "@mui/material";
import React from "react";
import Tooltip from "@mui/material/Tooltip";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import PauseCircleOutlineOutlinedIcon from "@mui/icons-material/PauseCircleOutlineOutlined";
import DialpadIcon from "@mui/icons-material/Dialpad";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import LaunchIcon from "@mui/icons-material/Launch";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import CallEndIcon from "@mui/icons-material/CallEnd";
import SyncAltIcon from '@mui/icons-material/SyncAlt';
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
const MinimizeCallScreen = (props) => {
  // const [isRecord, setIsRecord] = useState(false);
  // const [isKeyPad, setIsKeyPad] = useState(false);

  const {
    onEndCall,
    displayName,
    FullScreenCalling,
    callTime,
    muteHandler,
    holdHandler,
    isHold,
    isMute,
    ongoingCall,
    setContectData
  } = props;

  return (
    <Box
      sx={{
        backgroundColor: "black",
        color: "white",
        borderRadius: "0.5rem",
        padding: "0.5rem",
        margin: "1rem",
      }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "start",
        }}>
        <Stack>
          <Typography sx={{ fontSize: "0.7rem" }}>{ongoingCall?.call?._remote_identity?._uri?._user||"Unknown"}</Typography>
          <Typography sx={{ fontSize: "0.7rem", color: "#616A75" }}>
            Ongoing call… {TimeFormat(callTime)}
          </Typography>
        </Stack>
        <Box sx={{ "&:hover": { cursor: "pointer" } }}>
          <Tooltip title='Full Screen' placement='top'>
            <LaunchIcon onClick={FullScreenCalling} />
          </Tooltip>
        </Box>
      </Box>
      <Box display='flex' gap margin='1rem auto'>
        <Avatar
          alt='Remy Sharp'
          src='https://mui.com/static/images/avatar/1.jpg'
          sx={{ width: 24, height: 24 }}
        />
        <Typography sx={{ fontSize: "0.7rem" }}>{ongoingCall?.call?.remote_identity?._display_name || "Unknown"}</Typography>
      </Box>
      <Grid container spacing={2}>
        <Grid item>
          <ButtonBase onClick={muteHandler}>
            {isMute ? (
              <MicOffIcon
                sx={{
                  fontSize: 30,
                  color: "white",
                  backgroundColor: "#1F2124",
                  padding: "0.5rem",
                  borderRadius: "50%",
                }}
              />
            ) : (
              <MicIcon
                sx={{
                  fontSize: 30,
                  color: "#C0C0C0",
                  backgroundColor: "#1F2124",
                  padding: "0.5rem",
                  borderRadius: "50%",
                }}
              />
            )}
          </ButtonBase>
        </Grid>
        <Grid item>
          <ButtonBase onClick={holdHandler}>
            {isHold ? (
              <PauseCircleIcon
                sx={{
                  fontSize: 30,
                  color: "white",
                  backgroundColor: "#1F2124",
                  padding: "0.5rem",
                  borderRadius: "50%",
                }}
              />
            ) : (
              <PauseCircleOutlineOutlinedIcon
                sx={{
                  fontSize: 30,
                  color: "#C0C0C0",
                  backgroundColor: "#1F2124",
                  padding: "0.5rem",
                  borderRadius: "50%",
                }}
              />
            )}
          </ButtonBase>
        </Grid>
        <Grid item>
          <ButtonBase>
            <DialpadIcon
              sx={{
                fontSize: 32,
                color: "white",
                backgroundColor: "#1F2124",
                padding: "0.4rem",
                borderRadius: "50%",
              }}
            />
          </ButtonBase>
        </Grid>
        <Grid item>
          <ButtonBase
            onClick={()=>setContectData( {isOpen:true,buttonText:"Transfer"})}
          >
            <SyncAltIcon
              sx={{
                fontSize: 30,
                color: "white",
                backgroundColor: "#1F2124",
                padding: "0.5rem",
                borderRadius: "50%",
              }}
            />
          </ButtonBase>
        </Grid>
        <Grid item>
          <ButtonBase onClick={()=>setContectData( {isOpen:true,buttonText:"Call"})}>
            <PersonAddAltRoundedIcon 
              sx={{
                fontSize: 30,
                color: "white",
                backgroundColor: "#1F2124",
                padding: "0.5rem",
                borderRadius: "50%",
              }}
            />
          </ButtonBase>
        </Grid>
        <Grid item>
          <Tooltip title='End Call' placement='top'>
            <ButtonBase onClick={() => onEndCall()}>
              <CallEndIcon
                sx={{
                  fontSize: 30,
                  color: "white",
                  backgroundColor: "#E81313",
                  padding: "0.5rem",
                  borderRadius: "50%",
                }}
              />
            </ButtonBase>
          </Tooltip>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MinimizeCallScreen;
