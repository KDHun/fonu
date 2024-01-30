import React, { useState } from "react";
import DialPad from "../Components/DialPad/DialPad";
import { Box, Divider } from "@mui/material";
import Navbar from "../Components/Navbar";
import { Outlet } from "react-router-dom";
const Home = () => {
  const [open, setOpen] = useState(false);

  return (
      <Box>
        <Navbar onDialPadClick={() => setOpen(true)} />
        <Divider sx={{ color: "#4b4b4b" }} />
        <DialPad open={open} setOpen={setOpen} />
        <Outlet />
      </Box>
  );
};

export default Home;
