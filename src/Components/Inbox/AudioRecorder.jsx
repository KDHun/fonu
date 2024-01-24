import React, { useState, useEffect, useRef } from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SendImg from "../../Images/Inbox/PaperPlaneTilt.png";
import StopIcon from "@mui/icons-material/Stop";
import ReplayIcon from "@mui/icons-material/Replay";
import Tooltip from "@mui/material/Tooltip";
const AudioRecorder = (props) => {
  const [permission, setPermission] = useState(false);
  const mediaRecorder = useRef(null);
  const [recordingStatus, setRecordingStatus] = useState("inactive");
  const [stream, setStream] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [audio, setAudio] = useState(null);
  const [timer, setTimer] = useState(0);
  const mimeType = "audio/webm";

  const getMicrophonePermission = async () => {
    if ("MediaRecorder" in window) {
      try {
        const streamData = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        setPermission(true);
        setStream(streamData);
      } catch (err) {
        console.error("Error obtaining media stream:", err.message);
        alert("Microphone access denied or not available.");
      }
    } else {
      alert("The MediaRecorder API is not supported in your browser.");
    }
  };

  const startRecording = () => {
    setRecordingStatus("recording");
    const media = new MediaRecorder(stream, { mimeType });
    mediaRecorder.current = media;
    mediaRecorder.current.start();

    let localAudioChunks = [];
    mediaRecorder.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        localAudioChunks.push(event.data);
      }
    };
    setAudioChunks(localAudioChunks);
  };
  const stopRecording = () => {
    return new Promise((resolve, reject) => {
      if (mediaRecorder.current) {
        setRecordingStatus("inactive");

        mediaRecorder.current.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: mimeType });
          const audioUrl = URL.createObjectURL(audioBlob);
          setAudio(audioUrl);
          setAudioChunks([]);
          resolve(audioUrl);
        };

        mediaRecorder.current.stop();
      } else {
        reject("No media recorder available");
      }
    });
  };

  const sendAudioHandler = async () => {
    let audioUrl = audio;
    if (recordingStatus === "recording") {
      audioUrl = await stopRecording();
    }
    audioHandler(audioUrl);
  };

  const audioHandler = async (audioUrl) => {
    if (audioUrl) {
      try {
        const response = await fetch(audioUrl);
        const audioBlob = await response.blob();
        props.handleAudioSend(audioBlob);
      } catch (error) {
        console.error("Error converting audioURL to Blob:", error);
      }
    }
  };

  const clearRecording = () => {
    setAudio(null);
    stopRecording();
    props.handleDeleteAudio();
  };

  useEffect(() => {
    let interval;
    if (recordingStatus === "recording") {
      interval = setInterval(() => {
        setTimer((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(interval);
      setTimer(0);
    }
    return () => clearInterval(interval);
  }, [recordingStatus]);

  useEffect(() => {
    const initiateRecording = async () => {
      if (!permission) {
        await getMicrophonePermission();
      }
      if (stream) {
        startRecording();
      }
    };
    initiateRecording();
    return () => {
      if (recordingStatus === "recording") {
        stopRecording();
      }
    };
    // eslint-disable-next-line
  }, [stream, permission]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <Grid container spacing={2} alignItems='center' justifyContent='center'>
      <Grid item xs={1}>
        <Button onClick={clearRecording}>
          <Tooltip title='Delete' placement='top'>
            <DeleteIcon sx={{ color: "#E81313" }} />{" "}
          </Tooltip>
        </Button>
      </Grid>
      <Grid item xs={9}>
        <Box width='100%'>
          {recordingStatus === "recording" ? (
            <Box>
              <Typography>{formatTime(timer)}</Typography>
            </Box>
          ) : (
            <audio src={audio} controls style={{ width: "100%" }} controlsList='nodownload' />
          )}
        </Box>
      </Grid>
      <Grid item xs={1}>
        {recordingStatus === "recording" ? (
          <Tooltip title='Stop' placement='top'>
            <Button onClick={stopRecording}>
              <StopIcon sx={{ color: "#E81313" }} />
            </Button>
          </Tooltip>
        ) : (
          <Tooltip title='Restart' placement='top'>
            <Button onClick={startRecording}>
              <ReplayIcon sx={{ color: "#4F772D" }} />
            </Button>
          </Tooltip>
        )}
      </Grid>
      <Grid item xs={1}>
        <Tooltip title='Send' placement='top'>
          <Button onClick={sendAudioHandler}>
            <img src={SendImg} alt='Send' />
          </Button>{" "}
        </Tooltip>
      </Grid>
    </Grid>
  );
};

export default AudioRecorder;
