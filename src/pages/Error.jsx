import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

const Error = () => {
  const navigate = useNavigate();

  const navigateHome = () => {
    console.log("Navigating back to home");
    navigate("/");
  };

  return (
    <Box
      display='flex'
      justifyContent='center'
      alignItems='center'
      flexDirection='column'
      height='100vh'>
      <Typography color='error'>Oops! Something went wrong.</Typography>
      <Button
        variant='contained'
        sx={{
          backgroundColor: "#4F722D",
          "&:hover": { backgroundColor: "#FFFFFE", color: "#4F722D" },
        }}
        onClick={navigateHome}>
        Go Back Home
      </Button>
    </Box>
  );
};

export default Error;
