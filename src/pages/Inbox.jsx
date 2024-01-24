import { Grid } from "@mui/material";
import React, { useState } from "react";
import Navbar from "../Components/Inbox/Navbar";
import SalesIcon from "../Images/Inbox/SalesIcon.png";
import CustomerSupportIcon from "../Images/Inbox/CustomerSupportIcon.png";
import TechSupportIcon from "../Images/Inbox/TechSupportIcon.png";
import Conversation from "../Components/Inbox/Conversation";


const Inbox = () => {
  const [activeItem, setActiveItem] = useState(null);
  const item = [
    {
      img: TechSupportIcon,
      title: "Tech Support",
      mobileNumber: "+234 70 9332 7543",
      badgeCount: 0,
    },
    {
      img: SalesIcon,
      title: "Sales",
      mobileNumber: "+234 70 9332 7543",
      badgeCount: 2,
    },
    {
      img: CustomerSupportIcon,
      title: "Customer Support",
      mobileNumber: "+234 70 9332 7543",
      badgeCount: 0,
    },
  ];
  
  return (
    <Grid container height='90vh'>
      <Grid item
        xs={2}
        height='90vh'
        sx={{
          background:
            "linear-gradient(0deg, #F9FAFB, #F9FAFB),linear-gradient(0deg, #EBECEF, #EBECEF)",
        }}>
        <Navbar setActiveItem={setActiveItem} activeItem={activeItem} items={item} />
      </Grid>
      <Grid xs={10} height='90vh' item>
        {activeItem && <Conversation activeItem={activeItem} />}
      </Grid>
    </Grid>
  );
};

export default Inbox;
