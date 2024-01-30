import { Box, Button, Typography } from "@mui/material";
import React from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Gird from "@mui/material/Grid";
import PhoneCall from "../Images/PhoneCall.png";
import IncomingCall from "../Images/PhoneIncoming.png";
import OutgoingCall from "../Images/PhoneOutgoing.png";
import HashIcon from "../Images/Hash.png";

const HomeComponent = (props) => {
    return (
        <Box backgroundColor='black' sx={{ padding: { xs: "2rem 2rem", md: "2rem 5rem" } }}>
            <Box display='flex' justifyContent='space-between' alignItems='center'>
                <Typography color='white' fontWeight='500' fontSize='1rem'>
                    Welcome,Deanna Curtis
                </Typography>
                <Button
                    variant='contained'
                    sx={{
                        borderRadius: "50px",
                        backgroundColor: "#1F2124",
                        color: "white",
                    }}
                    endIcon={<KeyboardArrowDownIcon color='white' />}>
                    Daily
                </Button>
            </Box>

            <Gird container spacing={1} width='100%' marginTop='2rem' marginBottom='1rem'>
                <Gird item xs={3}>
                    <img src={PhoneCall} alt='Call' />
                    <Typography color='white' fontWeight='500' fontSize='0.7rem' marginTop='1rem'>
                        Total calls
                    </Typography>
                    <Typography color='white' fontWeight='500' fontSize='2rem'>
                        {props?.deshboard?.totleCalls || 0}
                    </Typography>
                </Gird>

                <Gird item xs={3}>
                    <img src={IncomingCall} alt='<--' />
                    <Typography color='white' fontWeight='500' fontSize='0.7rem' marginTop='1rem'>
                        Incoming calls
                    </Typography>
                    <Typography color='white' fontWeight='500' fontSize='2rem'>
                        {props?.deshboard?.IncommingCalls || 0}
                    </Typography>
                </Gird>

                <Gird item xs={3}>
                    <img src={OutgoingCall} alt='-->' />
                    <Typography color='white' fontWeight='500' fontSize='0.7rem' marginTop='1rem'>
                        Outgoing calls
                    </Typography>
                    <Typography color='white' fontWeight='500' fontSize='2rem'>
                        {props?.deshboard?.OutgoingCalls || 0}
                    </Typography>
                </Gird>

                <Gird item xs={3}>
                    <img src={HashIcon} alt='#' />
                    <Typography color='white' fontWeight='500' fontSize='0.7rem' marginTop='1rem'>
                        Virtual number
                    </Typography>
                    <Typography color='white' fontWeight='500' fontSize='2rem'>
                        {5}
                    </Typography>
                </Gird>
            </Gird>
        </Box>
    );
};

export default HomeComponent;
