import React, { useState } from "react";
import KeyPad from "./KeyPad";
import { Box, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
const DialScreen = (props) => {
  const {
    CallEndHandler,
    makeCall
  } = props;
  const [isTyped, setIsTyped] = useState(false);
  return (
    <Box>
      <Box sx={{ padding: "0rem 1rem" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            height: "4vh",
          }}
        >
          <Typography
            sx={{
              color: "#87909B",
              fontSize: 12,
              fontWeight: "100",
              display: "flex",
              justifyContent: "center",
            }}
            // onClick={() => {
            //   setIsTyped(true);
            //   setNumber("+234 70 1234 5678");
            // }}
          >
            Call using Virtual number +234 70 1234 5678{" "}
            <ExpandMoreIcon sx={{ height: 17, width: 17 }} />
          </Typography>
        </Box>
      </Box>

      <Box sx={{ padding: "0rem 1rem 1rem 1rem" }}>

        <KeyPad
          isTyped={isTyped}
          setIsTyped={setIsTyped}
          makeCall={makeCall}
          CallEndHandler={CallEndHandler}
        />
      </Box>
    </Box>
  );
};

export default DialScreen;
