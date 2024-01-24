import { Box, Skeleton } from "@mui/material";
import React, { useEffect, useState } from "react";
import HomeComponent from "../Components/HomeComponent";
import Layout from "../Components/Layout";
import axios from "axios";

const DeshBoard = () => {
  const [deshboardData, setDeshboardData] = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/deshboard`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setDeshboardData(() => response.data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => setLoading(false));
  }, []);
  return (
    <Box>
      {loading && (
        <>
          <Skeleton variant='rectangular' width='100%' height="35vh" sx={{marginBottom:"1rem"}} />
          <Box display="flex" justifyContent="center" gap={2}>
            <Skeleton variant='rectangular' width='55%' height="80vh" />
            <Skeleton variant='rounded' width='35%' height="80vh" />
          </Box>
        </>
      )}
      {!loading && (
        <>
          <HomeComponent deshboard={deshboardData?.deshboard} />
          <Layout deshboard={{ ...deshboardData }} />
        </>
      )}
    </Box>
  );
};

export default DeshBoard;
