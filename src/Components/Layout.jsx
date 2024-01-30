import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import React from "react";
import CallHistoryChart from "./CallHistoryChart";
import MemberList from "./MemberList";
import ReplayIcon from "@mui/icons-material/Replay";
import RecentCallHistory from "./RecentCallHistory";
const Layout = (props) => {
  return (
    <Box>
      <Grid container spacing={2} sx={{ padding: { xs: "2rem 2rem", md: "2rem 5rem" } }}>
        <Grid item xs={12} sm={12} md={8}>
          <Box display='flex' gap='1rem' alignItems='center' padding='1rem 0rem'>
            <Typography fontWeight='700' fontSize='1rem'>
              Call summary
            </Typography>

            <Button
              sx={{
                backgroundColor: "#F1F2F4",
                color: "black",
                borderRadius: "50px",
                padding: "0.3rem 1rem",
              }}
              size='small'>
              Refresh
              <ReplayIcon sx={{ width: 20, height: 20 }} />
            </Button>
          </Box>

          <Paper elevation={2} sx={{ backgroundColor: "#FFFFFE", color: "black" }}>
            <CallHistoryChart callSummary={props?.deshboard?.callSummary} />
          </Paper>
        </Grid>

        <Grid item xs={12} sm={12} md={4}>
          <Box display='flex' gap='1rem' alignItems='center' padding='1rem 0rem'>
            <Typography fontWeight='700' fontSize='1rem'>
              Members
            </Typography>

            <Button
              sx={{
                backgroundColor: "#F1F2F4",
                color: "black",
                borderRadius: "50px",
                padding: "0.3rem 1rem",
              }}
              size='small'>
              Refresh <ReplayIcon sx={{ width: 20, height: 20 }} />
            </Button>
          </Box>
          <Box>
            <MemberList members={props?.deshboard?.memberList} />
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ padding: { xs: "2rem 2rem", md: "2rem 5rem" } }}>
        <Typography fontWeight='700' fontSize='1rem'>
          Recent call history
        </Typography>
        <RecentCallHistory callHistory={props?.deshboard?.calldata} />
      </Box>
    </Box>
  );
};

export default Layout;
