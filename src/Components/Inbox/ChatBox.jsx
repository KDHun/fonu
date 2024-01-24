import {
  Avatar,
  Backdrop,
  Badge,
  Box,
  Button,
  Dialog,
  Divider,
  Grid,
  InputBase,
  Typography,
  styled,
} from "@mui/material";

import React, { useEffect, useState, useRef } from "react";
import callIcon from "../../Images/Inbox/PhoneCall.png";
import checkIcon from "../../Images/Inbox/CheckSquare.png";
import DotIcon from "../../Images/Inbox/DotsThreeVertical.png";
import PaperclipIcon from "../../Images/Inbox/Paperclip.png";
import SmileyIcon from "../../Images/Inbox/Smiley.png";
import WhatsAppIcon from "../../Images/Inbox/Whatsapp icon.png";
import ClockIcon from "../../Images/Inbox/Clock.png";
import axios from "axios";
import profileImg from "../../Images/Inbox/Profile Image.png";
import {
  sendMessage,
  subscribeToMessages,
  userTyping,
  subscribeToIsTyping,
  subscribeToDoneTyping,
  doneTyping,
} from "../../socket/Socket";
import SendImg from "../../Images/Inbox/PaperPlaneTilt.png";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import MicIcon from "@mui/icons-material/Mic";
import AudioRecorder from "./AudioRecorder";
const SmallAvatar = styled(Avatar)(({ theme }) => ({
  width: 15,
  height: 15,
}));
const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const ChatBox = ({ selectedChat: props }) => {
  const containerRef = useRef(null);
  const [chatMessage, setChatMessage] = useState([]);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [open, setOpen] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [containerHeight, setContainerHeight] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [isAudio, setIsAudio] = useState(false);
  console.log(chatMessage);

  useEffect(() => {
    const data1 = {
      sender_id: props?.userId,
      receiver_id: props?.reciveUserId?._id,
    };
    const timeout = setTimeout(() => {
      doneTyping(data1);
    }, 2000);
    return () => clearTimeout(timeout);
  }, [props, message]);

  useEffect(() => {
    const unsubscribe = subscribeToIsTyping((data) => {
      if (data?.receiver_id === props?.userId && data.sender_id === props?.reciveUserId?._id)
        setIsTyping(true);
    });
    return unsubscribe;
  }, [props]);

  useEffect(() => {
    const unsubscribe = subscribeToDoneTyping((data) => {
      if (data?.receiver_id === props?.userId && data.sender_id === props?.reciveUserId?._id)
        setIsTyping(false);
    });
    return unsubscribe;
  }, [props]);

  useEffect(() => {
    const handleResize = () => {
      const headerBoxHeight = document.getElementById("chatheader-box")?.offsetHeight || 400;
      const inputBoxHeight = document.getElementById("chatinput-box")?.offsetHeight || 400;
      setContainerHeight(inputBoxHeight + headerBoxHeight);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (file) {
      setImageUrl(URL.createObjectURL(file));
    }
  }, [file]);

  const sendMessageHandler = () => {
    if (!message) return;
    const messageData = {
      broadcast_id: null,
      broadcast_msg_id: null,
      originalName: "",
      fileId: null,
      message: message,
      message_type: 0,
      media_type: 0,
      delivery_type: 0,
      reply_message_id: null,
      schedule_time: null,
      block_message_users: [],
      delete_message_users: [],
      is_deleted: 0,
      message_reaction_users: [],
      cid: props?._id,
      sender_id: props?.userId,
      receiver_id: props?.reciveUserId?._id,
      ispinned: 0,
      pin_by: null,
    };
    sendMessage(messageData);
    setMessage("");
  };

  const handleFileSelect = async (event) => {
    const file1 = event.target.files[0];
    // if (!file1) {
    //   return;
    // }
    setFile(file1);
  };

  const handleFileDelete = () => {
    setFile(null);
  };

  const handleFileSend = async () => {
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/file/upload/image/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      if (!response) return;

      const messageData = {
        broadcast_id: null,
        broadcast_msg_id: null,
        originalName: "",
        fileId: response.data._id,
        fileURL: "/uploads/image/" + response.data.filename,
        fileName: response.data.originalname,
        message: "",
        message_type: 1,
        media_type: 1,
        delivery_type: 0,
        reply_message_id: null,
        schedule_time: null,
        block_message_users: [],
        delete_message_users: [],
        is_deleted: 0,
        message_reaction_users: [],
        cid: props?._id,
        sender_id: props?.userId,
        receiver_id: props?.reciveUserId?._id,
        ispinned: 0,
        pin_by: null,
      };

      sendMessage(messageData);
      setFile(null);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleAudioSend = async (audioBlob) => {
    if (!audioBlob) return;
    console.log(audioBlob, "send Audio called");
    try {
      const formData = new FormData();
      const audioFile = new File([audioBlob], "voice.wav", { type: "audio/wav" });
      formData.append("file", audioFile, "audio_recording.mp3");
      console.log(formData, "formData");
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/file/upload/audio/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      console.log(response, "response");
      if (!response) return;

      const audioData = {
        broadcast_id: null,
        broadcast_msg_id: null,
        originalName: "",
        fileId: response.data._id,
        fileURL: "/uploads/audio/" + response.data.filename,
        fileName: response.data.originalname,
        message: "",
        message_type: 1,
        media_type: 2,
        delivery_type: 0,
        reply_message_id: null,
        schedule_time: null,
        block_message_users: [],
        delete_message_users: [],
        is_deleted: 0,
        message_reaction_users: [],
        cid: props?._id,
        sender_id: props?.userId,
        receiver_id: props?.reciveUserId?._id,
        ispinned: 0,
        pin_by: null,
      };
      console.log(audioData, "audioData");
      // sendMessage function should be modified to handle audio messages
      sendMessage(audioData);
    } catch (error) {
      console.error("Error uploading audio:", error);
    } finally {
      setIsAudio(false);
    }
  };

  const handleDeleteAudio = () => {
    setIsAudio(false);
  };
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [props, chatMessage]);

  useEffect(() => {
    const unsubscribe = subscribeToMessages((message1) => {
      console.log(message1, "chat mess recvi");
      if (message1) {
        if (props?.userId === message1.receiver_id || props?.userId === message1.sender_id) {
          setChatMessage((prev) => [...prev, message1]);
        }
      } else {
        console.log("Received null message. Check server-side implementation.");
      }
    });
    return unsubscribe;
  }, [props]);

  useEffect(() => {
    const fetchChatMessage = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/conversation/chat?sender_id=${props?.userId}&receiver_id=${props?.reciveUserId?._id}`,
          {
            headers: { Authorization: localStorage.getItem("token") },
          }
        );
        setChatMessage(data);
      } catch (err) {
        console.log(err);
      }
    };
    if (props?.userId && props?.reciveUserId?._id) fetchChatMessage();
  }, [props]);

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <Box>
      {props ? (
        <Box width='100%'>
          <Box
            id='chatheader-box'
            sx={{ padding: "1.5rem" }}
            display='flex'
            justifyContent='space-between'
            alignItems='center'>
            <Box display='flex' justifyContent='center' alignItems='center'>
              <Box>
                <Badge
                  overlap='circular'
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  badgeContent={<SmallAvatar alt={props.name} src={WhatsAppIcon} />}>
                  <Avatar alt={props.socialMedia} src={profileImg} sx={{ width: 35, height: 35 }} />
                </Badge>
              </Box>
              <Box paddingLeft='1rem'>
                <Typography sx={{ fontWeight: "600", fontSize: "0.8rem" }}>
                  {props.reciveUserId.name}
                </Typography>
                <Typography sx={{ color: isTyping ? "#4F772D" : "#ABB1BA", fontSize: "0.7rem" }}>
                  {isTyping ? "Typing..." : props.reciveUserId.phone}
                </Typography>
              </Box>
            </Box>
            <Box display='flex' gap='1.5rem'>
              <img src={callIcon} alt='' />
              <img src={checkIcon} alt='' />
              <img src={DotIcon} alt='' />
            </Box>
          </Box>

          <Divider />

          <Box
            ref={containerRef}
            sx={{
              padding: "1rem 3rem 0rem 3rem",
              height: `calc(91vh - ${containerHeight}px)`,
              overflow: "scroll",
              msOverflowStyle: "none",
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }}>
            <Backdrop
              sx={{
                color: "#fff",
                zIndex: (theme) => theme.zIndex.drawer + 1,
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
              open={open || 0}>
              <img
                src={process.env.REACT_APP_API_URL + open}
                alt=''
                style={{ maxHeight: "80vh", maxWidth: "80vw" }}
              />
              <CloseIcon
                sx={{ fontSize: 40 }}
                onClick={() => {
                  setOpen(null);
                }}
              />
            </Backdrop>
            {chatMessage?.map((message) => (
              <Box
                display='flex'
                justifyContent={message.sender_id === props.userId ? "end" : "start"}
                alignItems='end'
                gap={2}
                margin='1.1rem 0rem'
                key={message._id}>
                <Box order={message.sender_id === props.userId ? 2 : 1} marginBottom='1rem'>
                  <img src={profileImg} alt='' />
                </Box>
                <Box
                  order={message.sender_id === props.userId ? 1 : 2}
                  display='flex'
                  alignItems={message.sender_id === props.userId ? "end" : "start"}
                  flexDirection='column'
                  gap={1}>
                  <Typography sx={{ fontSize: "0.7rem", color: "#ABB1BA" }}>
                    {message.sender_id === props.userId ? user.name : props.reciveUserId.name}
                  </Typography>
                  {message.message_type === 0 ? (
                    <Typography
                      sx={{
                        backgroundColor: message.sender_id === props.userId ? "#4F772D" : "#F1F2F4",
                        color: message.sender_id === props.userId ? "#FFFFFE" : "#1F2124",
                        fontSize: "0.75rem",
                        fontWeight: message.sender_id === props.userId ? "600" : "500",
                        borderRadius: "1.5rem",
                        padding: "0.5rem 0.8rem 0.5rem 0.8rem",
                        textWrap: "wrap",
                      }}
                      maxWidth='25vw'>
                      {message.message}
                    </Typography>
                  ) : message.media_type === 2 ? (
                    <Box>
                      <audio
                        controls
                        controlsList='nodownload'
                        src={process.env.REACT_APP_API_URL + message.fileURL}
                        style={{ maxWidth: "20vw" }}
                      />
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        border:
                          message.sender_id === props.userId
                            ? "0.3rem solid #4F772D"
                            : "0.3rem solid #ABB1BA",
                        borderRadius:
                          message.sender_id === props.userId
                            ? "0.7rem 0.7rem 0rem 0.7rem"
                            : "0.7rem 0.7rem 0.7rem 0rem",
                      }}>
                      {message.media_type === 1 && (
                        <Box>
                          <img
                            src={process.env.REACT_APP_API_URL + message.fileURL}
                            alt=''
                            style={{ maxWidth: "15vw" }}
                            onClick={() => setOpen(message.fileURL)}
                          />
                        </Box>
                      )}
                    </Box>
                  )}
                  <Typography sx={{ color: "#ABB1BA", fontSize: "0.65rem" }}>
                    {new Date(message.datetime || message.createdAt).toLocaleString("en-US", {
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                    })}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>

          <Box
            position='fixed'
            width='62%'
            bottom={0}
            sx={{
              background:
                "linear-gradient(0deg, #F9FAFB, #F9FAFB),linear-gradient(0deg, #F1F2F4, #F1F2F4)",
            }}
            id='chatinput-box'
            padding='0.5rem 0rem'>
            {isAudio ? (
              <Box>
                {" "}
                <AudioRecorder
                  handleDeleteAudio={handleDeleteAudio}
                  handleAudioSend={handleAudioSend}
                />{" "}
              </Box>
            ) : (
              <Box padding='0rem 2.5rem 0rem 0rem'>
                <Typography
                  width='100%'
                  padding='0.5rem 0.5rem 0.5rem 0rem'
                  textAlign='end'
                  fontSize='0.8rem'
                  color='#4F772D'>
                  Use template
                </Typography>

                <Box>
                  <Dialog open={file || 0} onClose={() => !file} fullWidth={true}>
                    <Box
                      sx={{
                        height: "80vh",
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                      }}>
                      <Button
                        sx={{
                          // marginRight: "1rem",
                          alignSelf: "end",
                          borderColor: "#4F772D",
                          color: "#4F772D",
                          "&:hover": {
                            // backgroundColor: "#4F772D",
                            // color: "#FFFFFE",
                          },
                        }}
                        onClick={handleFileDelete}>
                        <CloseIcon />
                      </Button>
                      <img
                        src={imageUrl}
                        alt='File not supported'
                        style={{
                          padding: "0rem 0rem 2rem 0rem",
                          maxWidth: "80vw",
                          maxHeight: "60vh",
                        }}
                      />
                      <Typography
                        sx={{
                          // borderRadius: "1.2rem",
                          padding: "0.5rem 1rem",
                          color: "#4F772D",
                          // color: "#FFFFFE",
                          margin: "0rem 1rem",
                        }}>
                        {file?.name?.substring(0, 25)}
                      </Typography>
                      <Box display='flex' alignItems='center' justifyContent='center'>
                        <Button
                          variant='contained'
                          sx={{
                            backgroundColor: "#4F772D",
                            opacity: 0.9,
                            "&:hover": {
                              backgroundColor: "#4F7000",
                              opacity: 1,
                            },
                          }}
                          endIcon={<SendIcon color='#FFFFFE' />}
                          onClick={handleFileSend}>
                          Send
                        </Button>
                      </Box>
                    </Box>
                  </Dialog>
                  <Grid container>
                    <Grid item xs={2} display='flex' alignItems='center' justifyContent='center'>
                      <Button component='label'>
                        <VisuallyHiddenInput type='file' onChange={handleFileSelect} />
                        <img src={PaperclipIcon} alt='' style={{}} />
                      </Button>
                      <Button>
                        <img src={SmileyIcon} alt='' style={{}} />
                      </Button>
                    </Grid>
                    <Grid item xs={10}>
                      <Box
                        display='flex'
                        alignItems='center'
                        justify='center'
                        width='100%'
                        sx={{
                          border: " 1px solid #F1F2F4",
                          backgroundColor: "white",
                          padding: "0.5rem",
                          borderRadius: "0.3rem",
                        }}>
                        <InputBase
                          placeholder='Write a message…'
                          value={message}
                          sx={{
                            width: "100%",
                          }}
                          onKeyDown={(e) => {
                            if (e.code === "Enter" || e.code === "NumpadEnter") {
                              sendMessageHandler();
                            }
                          }}
                          onChange={(e) => {
                            userTyping({
                              sender_id: props?.userId,
                              receiver_id: props?.reciveUserId?._id,
                            });

                            setMessage(e.target.value);
                          }}
                        />

                        <Button sx={{ padding: "0rem", margin: "0rem" }}>
                          <img
                            src={ClockIcon}
                            alt=''
                            style={{ marginRight: "0rem", "&:hover": { cursor: "pointer" } }}
                          />
                        </Button>
                        <Button
                          sx={{ padding: "0rem", margin: "0rem" }}
                          onClick={
                            message
                              ? sendMessageHandler
                              : () => {
                                  setIsAudio(true);
                                }
                          }>
                          {message ? (
                            <img src={SendImg} alt='Send' />
                          ) : (
                            <MicIcon sx={{ fontSize: 20, color: "#4F772D" }} />
                          )}
                          {/*  */}
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      ) : (
        <Box></Box>
      )}
    </Box>
  );
};

export default ChatBox;
