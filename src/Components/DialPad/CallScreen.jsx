import { Box, Stack, Typography } from "@mui/material";
import React from "react";
import CallIcon from "../../Images/Call.png";
import CallEndIcon from "../../Images/DisConnected.png";

const CallScreen = (props) => {
  return (
    <Box>
      <Box>
        <Typography sx={{ fontSize: 30 }}>{props.displayName}</Typography>
        <Typography sx={{ color: "#87909B", fontSize: "0.8rem" }}>{props.type==="outgoing"?"Calling...":"Incomming Call"}</Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "end",
          justifyContent: "center",
          marginTop: "22rem",
        }}>
        <Box display='flex'>
          <Stack sx={{ justifyContent:"center" }}>
            <Box sx={{ "&:hover": { cursor: "pointer" } }}>
              <img src={CallEndIcon} alt='' onClick={props.rejectCall} />
            </Box>
            <Typography sx={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>Decline</Typography>
          </Stack>
          <Stack sx={{ display:props.type==="outgoing"?"none":"",marginLeft: "8rem", justifyContent:"center" }}>
            <Box sx={{ "&:hover": { cursor: "pointer" } }}>
              <img src={CallIcon} alt='' onClick={props.acceptCall} />
            </Box>
            <Typography sx={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>Accept</Typography>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default CallScreen;
