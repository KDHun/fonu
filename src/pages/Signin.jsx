import {
  Alert,
  Box,
  Button,
  Grid,
  InputAdornment,
  LinearProgress,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import SigninBG1 from "../Images/SigninBGLogo.png";
import SigninBG2 from "../Images/SigninBGLogo1.png";
import FonuLogoGreen from "../Images/SigninLogoGreen.png";
import FonuTextGreen from "../Images/FONU.png";
import FonuTextWhite from "../Images/Fo.png";
import FonuLogoWhite from "../Images/SigninLogoWhite.png";
import orimg from "../Images/___________OR______________.png";
import AppleLogo from "../Images/AppleLogo.png";
import FacebookLogo from "../Images/FaceBookLogo.png";
import GoogleLogo from "../Images/GoogleLogo.png";
import Carousel from "react-material-ui-carousel";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import RefreshIcon from "@mui/icons-material/Refresh";
import { initSocketConnection } from "../socket/Socket";
const Signin = () => {
  const [IsActive, setIsActive] = useState(false);
  const [isNumber, setIsNumber] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [resendTime, setResendTime] = useState();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [message, setMessage] = useState();
  const [mobileNumber, setMobileNumber] = useState();
  const [OTP, setOTP] = useState();
  const [progress, setProgress] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      if (resendTime > 0) {
        setResendTime(resendTime - 1);
      } else {
        setResendTime(null);
        setIsSending(false);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [resendTime]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (progress > 0) {
        setProgress(progress - 1);
      } else {
        setProgress(null);
        setSnackbarOpen(false);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [progress]);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/overview");
    }
  }, [navigate]);
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const getOPTHandler = async () => {
    setMessage(null);
    setResendTime(30);
    setIsSending(true);
    setProgress(10);
    try {
      const data = await axios.post(`${process.env.REACT_APP_API_URL}/otp`, {
        mobileNumber: `+234 ${mobileNumber.substring(0, 2)} ${mobileNumber.substring(
          2,
          6
        )} ${mobileNumber.substring(6)}`,
      });
      console.log(data.data);
      setSnackbarOpen(true);
    } catch (error) {
      console.log(error);
    }

    setTimeout(() => {
      setIsSending(false);
    }, 10000);
  };
  const varifyOTPHandler = async () => {
    setProgress(10);
    try {
      console.log(mobileNumber);
      const data = await axios.post(`${process.env.REACT_APP_API_URL}/varifyotp`, {
        phone: `+91${mobileNumber}`,
        OTP: OTP,
      });
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));
      initSocketConnection(data.data.user);
      navigate("/overview");
    } catch (error) {
      setMessage(
        "Invalid verification code, check and try again or request a new code by clicking resend code"
      );
      setSnackbarOpen(true);
      console.log(error);
    }
  };

  const mobileNumberHandler = (e) => {
    const input = e.target.value;
    if (/^[0-9]*$/.test(input)) {
      setMobileNumber(input);
      setIsNumber(input.length === 10);
    }
  };

  const otpHandler = (e) => {
    const input = e.target.value;
    if (/^[0-9]*$/.test(input)) {
      setOTP(input);
      setIsActive(input.length === 6);
    }
  };

  return (
    <Box>
      <Grid
        container
        sx={{
          width: "100%",
          height: "100vh",
          overflow: "scroll",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
          "&-ms-overflow-style:": {
            display: "none",
          },
        }}>
        <Grid
          item
          xs={8}
          sx={{
            backgroundColor: "#F5F9F1",
            height: "100vh",
            overflow: "scroll",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": {
              display: "none",
            },
            "&-ms-overflow-style:": {
              display: "none",
            },
          }}>
          <Box
            sx={{
              backgroundColor: "#F5F9F1",
              width: "100%",
              position: "relative",
            }}>
            <Box sx={{ padding: "2rem 6rem" }}>
              <img
                src={FonuLogoGreen}
                alt=''
                style={{
                  scale: "0.7",
                }}
              />
              <img
                src={FonuTextGreen}
                alt=''
                style={{
                  scale: "0.7",
                }}
              />
            </Box>
            <Grid container>
              <Grid item xs={3}></Grid>
              <Grid item xs={5.5}>
                <Box>
                  <Box>
                    <Typography sx={{ fontSize: "2rem", fontWeight: "600" }}>Sign In</Typography>
                    <Typography sx={{ color: "#ABB1BA", fontSize: "0.8rem" }}>
                      Fill the form below to get started
                    </Typography>

                    <Typography
                      sx={{
                        color: "#616A75",
                        fontSize: "0.8rem",
                        fontWeight: "500",
                        margin: "3rem auto 0.3rem 0",
                      }}>
                      Phone number
                    </Typography>
                    <Grid container spacing={1}>
                      <Grid item xs={8}>
                        <TextField
                          fullWidth
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position='start' sx={{ fontSize: "0.5rem" }}>
                                +91
                              </InputAdornment>
                            ),
                          }}
                          placeholder='9000000000'
                          value={mobileNumber}
                          onChange={mobileNumberHandler}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <Button
                          variant='contained'
                          sx={{
                            backgroundColor: isNumber ? "#4F772D" : "#CACED3",
                            fontSize: "0.7rem",
                            paddingTop: "0.6rem",
                            paddingBottom: "0.6rem",
                            "&:hover": {
                              backgroundColor: "#4F772D",
                            },
                          }}
                          fullWidth
                          disabled={!isNumber || isSending}
                          onClick={getOPTHandler}
                          endIcon={!isSending && resendTime && <RefreshIcon />}>
                          {isSending
                            ? `Resend in ${resendTime}s`
                            : resendTime
                            ? "Resend Code"
                            : "Send Code"}
                        </Button>

                        <Snackbar
                          open={snackbarOpen}
                          onClose={handleClose}
                          autoHideDuration={10000}
                          anchorOrigin={{
                            vertical: "top",
                            horizontal: "right",
                          }}
                          sx={{
                            position: "absolute",
                            width: "35%",
                          }}>
                          <Box
                            sx={{
                              backgroundColor: message ? "#ED4242" : "#6D8F50",
                              borderRadius: "0.6rem",
                              overflow: "hidden",
                            }}>
                            <Alert
                              onClose={handleClose}
                              sx={{
                                backgroundColor: message ? "#ED4242" : "#6D8F50",
                              }}
                              icon={false}
                              severity='success'
                              variant='filled'>
                              {message
                                ? message
                                : "Verification code sent to your phone number successfully"}
                            </Alert>
                            <LinearProgress
                              variant='determinate'
                              value={progress * 10}
                              sx={{
                                height: "0.4rem",
                                backgroundColor: message ? "#E81313" : "#4F772D",

                                "& .MuiLinearProgress-bar": {
                                  backgroundColor: message ? "#F17171" : "#8BA873",
                                },
                              }}
                            />
                          </Box>
                        </Snackbar>
                      </Grid>
                    </Grid>
                    <Typography
                      sx={{
                        fontSize: "0.8rem",
                        color: "#ABB1BA",
                        padding: "0.5rem 1rem 0rem 0rem",
                      }}>
                      We would send you a verification code to confirm this is your phone number
                    </Typography>
                    <Typography
                      sx={{
                        color: "#616A75",
                        fontSize: "0.8rem",
                        marginTop: "3rem",
                        fontWeight: "500",
                        margin: "1.5rem auto 0.3rem 0",
                      }}>
                      Verification code
                    </Typography>
                    <TextField
                      helperText='Enter the verification code sent to your phone number'
                      id='demo-helper-text-misaligned'
                      fullWidth
                      inputProps={{
                        style: {
                          height: "2rem",
                          border: message ? "2px solid #E81313" : "",
                          backgroundColor: message ? "#FDE7E7" : "",
                          borderRadius: "0.2rem",
                        },
                      }}
                      sx={{}}
                      value={OTP}
                      onChange={otpHandler}
                    />
                    <Button
                      disabled={!IsActive}
                      fullWidth
                      variant='contained'
                      sx={{
                        backgroundColor: IsActive ? "#4F772D" : "#EFF7E9",
                        mt: "20px",
                        color: IsActive ? "#F5F9F1" : "#C7D9B8",
                        padding: "2rem auto",
                        margin: "3rem auto",
                        "&:hover": {
                          backgroundColor: "#4F772D",
                        },
                      }}
                      onClick={varifyOTPHandler}>
                      Sign in
                    </Button>

                    <Box sx={{ position: "relative" }}>
                      <img src={orimg} width={450} alt='' />
                      <Typography
                        sx={{
                          position: "absolute",
                          top: "2px",
                          left: "180px",
                          fontSize: "12px",
                          color: "#CACED3",
                          backgroundColor: "#F5F9F1",
                        }}>
                        {" "}
                        Or continue with{" "}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        margin: "24px 0",
                        gap: 2,
                      }}>
                      <Button variant='outlined' className='facebook'>
                        {" "}
                        <img style={{ marginRight: "7px" }} src={FacebookLogo} alt='' /> Facebook
                      </Button>
                      <Button variant='outlined' className='facebook1'>
                        {" "}
                        <img style={{ marginRight: "7px" }} src={GoogleLogo} alt='' /> Google
                      </Button>
                      <Button variant='outlined' className='apple'>
                        {" "}
                        <img style={{ marginRight: "7px" }} src={AppleLogo} alt='' /> Apple
                      </Button>
                    </Box>

                    <Typography className='create'>
                      By creating a new account, you automatically agree to our{" "}
                      <span>Terms & Conditions</span> and <span>Privacy Policy</span>.
                    </Typography>
                    <Typography className='create'>
                      By Already have an account? <span>Sign in</span>
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={3}></Grid>
            </Grid>
          </Box>
        </Grid>

        <Grid
          item
          xs={4}
          sx={{
            backgroundColor: "#4F772D",
            height: "100%",
            overflow: "scroll",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": {
              display: "none",
            },
            "&-ms-overflow-style:": {
              display: "none",
            },
          }}>
          <Box
            sx={{
              backgroundColor: "#4F772D",
              width: "100%",
              height: "100%",
              position: "relative",
              overflow: "hidden",
              maxHeight: "70rem",
              minHeight: "60rem",
            }}>
            <img
              src={SigninBG1}
              alt=''
              style={{
                position: "absolute",
                scale: "0.7",
                right: "-5rem",
                top: "-3rem",
              }}
            />
            <img
              src={SigninBG2}
              alt=''
              style={{
                position: "absolute",
                scale: "0.7",
                left: "-5rem",
                bottom: "-3rem",
              }}
            />
            <Box sx={{ padding: "2rem" }}>
              <img
                src={FonuLogoWhite}
                alt=''
                style={{
                  scale: "0.7",
                }}
              />
              <img
                src={FonuTextWhite}
                alt=''
                style={{
                  scale: "0.7",
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  width: "80%",
                  bottom: 0,
                  margin: "2rem 1.5rem",
                }}>
                <Carousel
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                    bottom: "0",
                    "& .css-1f8sh1y": { order: 2 },
                  }}
                  indicatorContainerProps={{
                    style: {
                      textAlign: "center",
                      order: 1,
                    },
                  }}
                  indicatorIconButtonProps={{
                    style: {
                      color: "white",
                      scale: "0.5",
                    },
                  }}
                  activeIndicatorIconButtonProps={{
                    style: {
                      color: "black", // 2
                    },
                  }}>
                  {[0, 0, 0].map((item, index) => {
                    return (
                      <Box sx={{ order: 2 }} key={index}>
                        <Typography
                          sx={{
                            color: "white",
                            fontSize: "2.1rem",
                            textAlign: "center",
                          }}>
                          Lorem ipsum dolor sit amet consectetur.
                        </Typography>
                        <Typography
                          sx={{
                            color: "#87909B",
                            textAlign: "center",
                            fontSize: "0.9rem",
                          }}>
                          Lorem ipsum dolor sit amet consectetur. Egestas amet eu sit odio duis nunc
                          proin.
                        </Typography>
                      </Box>
                    );
                  })}
                </Carousel>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Signin;
