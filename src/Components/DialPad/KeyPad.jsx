import { Box, Grid, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import BackSpaceIcon from "../../Images/Backspace.png";
import CallIcon from "../../Images/Call.png";
import { useSelector, useDispatch } from "react-redux";
import {
  setPhonenumber,
  addPhonenumberChar,
  deletePhonenumberChar,
} from "../../store/phonenumberSlice";

// const validatePhoneNumber = (phone) => {
//   return String(phone)
//     .toLowerCase()
//     .match(/(\+\d{1,3}\s?)?((\(\d{3}\)\s?)|(\d{3})(\s|-?))(\d{3}(\s|-?))(\d{4})(\s?(([E|e]xt[:|.|]?)|x|X)(\s?\d+))?/g);
// };
let inputValue;
const KeyPad = (props) => {
  const phonenumber = useSelector((state) => state.phonenumber.phonenumber);
  const dispatch = useDispatch();
  const [DTMF, setDTMF] = useState("");
  const { onHide, makeCall, sendDTMFHandler, callState } = props;

  const InputHandler = (data) => {
    if (callState === "Connected") {
      setDTMF((state) => {
        return state + data;
      });
      sendDTMFHandler(data);
      return;
    }
    if (data === "delete") {
      dispatch(deletePhonenumberChar());
      return;
    }
    dispatch(addPhonenumberChar(data));
  };
  const handleChange = (event) => {
    if (callState === "Connected") return;
    let data = event.target.value.replace(/[^0-9]/g, "");
    dispatch(setPhonenumber(data));
  };

  console.log(inputValue,"intp");
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "right",
          padding: "0rem 1rem",
        }}>
        <div style={{ display: "flex", justifyContent: "flex-end", maxWidth: "100%" }}>
          <TextField
            //disabled="disabled"
            //placeholder='Enter Number'
            variant='standard'
            sx={{
              caretColor: "transparent",
              border: "none",
              width: "100%",
              fontWeight: "100",
              "& .MuiInputBase-input": {
                fontSize: "2rem",
                textAlign: "right",
                whiteSpace: "nowrap",
                overflowX: "auto",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
              },
            }}
            InputProps={{
              disableUnderline: true,
              sx: {
                color: "black",
              },
            }}
            value={callState==="Connected"?DTMF:phonenumber}
            onChange={handleChange}
          />
        </div>
      </Box>
      <Box>
        <Grid container spacing={4} sx={{ marginTop: "0rem" }}>
          <Grid item xs={4}>
            {" "}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                "&:hover": { cursor: "pointer" },
              }}
              onClick={() => InputHandler("1")}>
              <Typography sx={{ fontSize: 30 }}>1</Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            {" "}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                "&:hover": { cursor: "pointer" },
              }}
              onClick={() => InputHandler("2")}>
              <Typography sx={{ fontSize: 30 }}>2</Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            {" "}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                "&:hover": { cursor: "pointer" },
              }}
              onClick={() => InputHandler("3")}>
              <Typography sx={{ fontSize: 30 }}>3</Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            {" "}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                "&:hover": { cursor: "pointer" },
              }}
              onClick={() => InputHandler("4")}>
              <Typography sx={{ fontSize: 30 }}>4</Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            {" "}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                "&:hover": { cursor: "pointer" },
              }}
              onClick={() => InputHandler("5")}>
              <Typography sx={{ fontSize: 30 }}>5</Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            {" "}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                "&:hover": { cursor: "pointer" },
              }}
              onClick={() => InputHandler("6")}>
              <Typography sx={{ fontSize: 30 }}>6</Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            {" "}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                "&:hover": { cursor: "pointer" },
              }}
              onClick={() => InputHandler("7")}>
              <Typography sx={{ fontSize: 30 }}>7</Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            {" "}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                "&:hover": { cursor: "pointer" },
              }}
              onClick={() => InputHandler("8")}>
              <Typography sx={{ fontSize: 30 }}>8</Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            {" "}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                "&:hover": { cursor: "pointer" },
              }}
              onClick={() => InputHandler("9")}>
              <Typography sx={{ fontSize: 30 }}>9</Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            {" "}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                "&:hover": { cursor: "pointer" },
              }}
              onClick={() => InputHandler("*")}>
              <Typography sx={{ fontSize: 30 }}>*</Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            {" "}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                "&:hover": { cursor: "pointer" },
              }}
              onClick={() => InputHandler("0")}>
              <Typography sx={{ fontSize: 30 }}>0</Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            {" "}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                "&:hover": { cursor: "pointer" },
              }}
              onClick={() => InputHandler("#")}>
              <Typography sx={{ fontSize: 30 }}>#</Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            {" "}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                "&:hover": { cursor: "pointer" },
              }}>
              <Typography sx={{ fontSize: 30 }}></Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box
              sx={{
                display: callState === "Connected" ? "none" : "flex",
                justifyContent: "center",
                alignItems: "center",
                "&:hover": { cursor: "pointer" },
              }}
              onClick={() => InputHandler("+")}>
              <Typography sx={{ fontSize: 30 }}>+</Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box
              sx={{
                display: callState === "Connected" ? "none" : "flex",
                justifyContent: "center",
                alignItems: "center",
                "&:hover": { cursor: "pointer" },
              }}
              onClick={() => InputHandler("delete")}>
              <Typography sx={{ fontSize: 30 }}>
                <img src={BackSpaceIcon} alt='' />
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={4}></Grid>
        <Grid item textAlign='center' marginTop='1rem' xs={4}>
          <Box
            sx={{
              display: callState === "Connected" ? "none" : "",
              "&:hover": { cursor: "pointer" },
            }}>
            <img
              src={CallIcon}
              alt=''
              onClick={() => {
                if (phonenumber) {
                  makeCall();
                }
              }}
            />
          </Box>
        </Grid>
        <Grid
          item
          xs={4}
          sx={{
            display: "flex",
            textAlign: "center",
            justifyContent: "center",
          }}>
          {callState === "Connected" && (
            <Typography
              sx={{
                margin: "auto",
                "&:hover": { cursor: "pointer" },
              }}
              onClick={() => onHide(false)}>
              Hide
            </Typography>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default KeyPad;
