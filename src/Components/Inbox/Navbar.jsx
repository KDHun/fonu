import { Badge, Box, Typography } from "@mui/material";
import React from "react";

const Navbar = (props) => {
  
  return (
    <Box p='1.2rem'>
      <Typography sx={{ color: "#ABB1BA", fontSize: "0.8rem" }}>Inboxes</Typography>
      <Box display='flex' flexDirection='column' gap='1rem' padding='2rem 0rem'>
        {props.items.map((item, index) => (
          <Box
            key={index}
            display='flex'
            alignItems='center'
            justifyContent='space-between'
            sx={{
              backgroundColor: props.activeItem?.title===item.title?"#F1F2F4":"",
              padding: "0.1rem 1rem 0.1rem 0.2rem",
              borderRadius: "0.5rem",
            }}
            onClick={() => props.setActiveItem(item)}
            >
            <Box display='flex' gap={1}>
              <img src={item.img} alt='icon' style={{ scale: "0.85" }} />
              <Box>
                <Typography sx={{ fontWeight: "600", fontSize: "0.7rem" }}>{item.title}</Typography>
                <Typography sx={{ color: "#ABB1BA", fontSize: "0.6rem", fontWeight: "600" }}>
                  {item.mobileNumber}
                </Typography>
              </Box>
            </Box>
            <Box sx={{}}>
              <Badge
                sx={{
                  color: "white",
                  "& .MuiBadge-badge": {
                    color: "white",
                    backgroundColor: "#4F772D",
                    fontSize:"0.7rem"
                  },
                  
                }}
                badgeContent={item.badgeCount}>
              </Badge>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Navbar;
