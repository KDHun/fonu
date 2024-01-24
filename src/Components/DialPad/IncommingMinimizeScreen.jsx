import { Avatar, Box, Stack, Typography, Grid, Button } from "@mui/material";
import React from "react";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
const IncommingMinimizeScreen = (props) => {
  return (
    <Box
      sx={{
        backgroundColor: "black",
        color: "white",
        borderRadius: "0.7rem",
        padding: "0.8rem",
        margin: "1rem",
        width: "20vw",
      }}
    >
      <Box>
        <Box sx={{display:"flex",justifyContent:"space-between"}}>
          <Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Avatar
              alt="Remy Sharp"
              src="https://mui.com/static/images/avatar/1.jpg"
              sx={{ width: 36, height: 36 }}
            />
            <Stack>
              <Typography sx={{ fontSize: "0.8rem" }}>
                Incoming call from{" "}
                <Typography
                  variant="span"
                  sx={{ fontWeight: "600", fontSize: "0.9rem" }}
                >
                  Deanna Curtis
                </Typography>
              </Typography>
              <Typography sx={{ fontSize: "0.7rem", color: "#616A75" }}>
                Calling Customer support
              </Typography>
            </Stack>
          </Box>
          <Box onClick={props.openFullScreen}>
            <OpenInFullIcon />
          </Box>
        </Box>
        <Grid container spacing={1} marginTop="1rem">
          <Grid item xs={4}>
            <Button
              sx={{
                backgroundColor: "#003333",
                color: "white",
                fontSize: "0.8rem",
                paddingTop: "0.6rem",
                paddingBottom: "0.6rem",
              }}
              fullWidth
              onClick={props.onReject}
            >
              Transfer
            </Button>{" "}
          </Grid>
          <Grid item xs={4}>
            <Button
              sx={{
                backgroundColor: "#E81313",
                color: "white",
                fontSize: "0.8rem",
                paddingTop: "0.6rem",
                paddingBottom: "0.6rem",
              }}
              fullWidth
              onClick={props.onReject}
            >
              Reject
            </Button>{" "}
          </Grid>
          <Grid item xs={4}>
            <Button
              sx={{
                backgroundColor: "#49A05F",
                color: "white",
                fontSize: "0.8rem",
                paddingTop: "0.6rem",
                paddingBottom: "0.6rem",
              }}
              fullWidth
              onClick={props.onAnswer}
            >
              Answer
            </Button>{" "}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default IncommingMinimizeScreen;
